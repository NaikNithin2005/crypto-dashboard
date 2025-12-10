/* ---------- THEME TOGGLE ---------- */
    const themeToggleBtn = document.getElementById("themeToggle");
    const themeIcon = themeToggleBtn ? themeToggleBtn.querySelector("i") : null;

    function applyThemeFromStorage() {
        const stored = localStorage.getItem("ninar_theme") || "light";
        const isDark = stored === "dark";
        document.body.classList.toggle("dark-theme", isDark);
        if (themeIcon) {
            themeIcon.classList.remove("uil-moon", "uil-sun");
            themeIcon.classList.add(isDark ? "uil-sun" : "uil-moon");
        }
    }

    if (themeToggleBtn) {
        themeToggleBtn.addEventListener("click", () => {
            const isDarkNow = !document.body.classList.contains("dark-theme");
            localStorage.setItem("ninar_theme", isDarkNow ? "dark" : "light");
            applyThemeFromStorage();
        });
    }

    applyThemeFromStorage();

    /* ---------- STORAGE KEYS ---------- */
    const STORAGE_CONVS_KEY = "ninar_message_center_conversations_v1";
    const STORAGE_ACTIVE_ID_KEY = "ninar_message_center_active_id";
    const STORAGE_FILTER_KEY = "ninar_message_center_filter";

    /* ---------- SEED DATA ---------- */
    function getSeedConversations() {
        return [
            {
                id: "sys-1",
                title: "System notifications",
                type: "system",
                unread: 2,
                lastTime: "Today • 10:42 AM",
                contact: null,
                messages: [
                    { from: "them", text: "Welcome to NINAR. This is a demo message center with local data only.", time: "09:05 AM", tag: "system" },
                    { from: "them", text: "Your BTC card ending ··311 was successfully added to the dashboard view.", time: "09:40 AM", tag: "system" },
                    { from: "them", text: "We updated the analytics widget to include your new investments.", time: "10:42 AM", tag: "system" }
                ]
            },
            {
                id: "support-1",
                title: "NINAR Support · Exchange UI",
                type: "support",
                unread: 1,
                lastTime: "Yesterday • 8:15 PM",
                contact: null,
                messages: [
                    { from: "me", text: "Hi, I want to know how the demo exchange matches my orders.", time: "07:58 PM" },
                    { from: "them", text: "Hi Nithin, the current version uses only local JavaScript to simulate fills. No real backend is involved.", time: "08:10 PM", tag: "support" },
                    { from: "them", text: "You can safely test the UI without affecting any live funds.", time: "08:15 PM", tag: "support" }
                ]
            },
            {
                id: "sec-1",
                title: "Security alerts",
                type: "security",
                unread: 0,
                lastTime: "2 days ago",
                contact: null,
                messages: [
                    { from: "them", text: "We detected a login from a new browser. If this was not you, please update your password.", time: "2 days ago • 09:20 AM", tag: "security" },
                    { from: "them", text: "Tip: In a real app, you should enable 2FA and review active sessions.", time: "2 days ago • 09:21 AM", tag: "security" }
                ]
            },
            {
                id: "support-2",
                title: "Design feedback",
                type: "support",
                unread: 0,
                lastTime: "3 days ago",
                contact: null,
                messages: [
                    { from: "me", text: "I’d like to tweak the colors of the cards to match my brand.", time: "3 days ago • 06:05 PM" },
                    { from: "them", text: "You can update the CSS variables in :root so the whole dashboard follows your palette.", time: "3 days ago • 06:18 PM", tag: "support" }
                ]
            }
        ];
    }

    function loadConversations() {
        try {
            const raw = localStorage.getItem(STORAGE_CONVS_KEY);
            if (!raw) return null;
            const parsed = JSON.parse(raw);
            if (!Array.isArray(parsed)) return null;
            return parsed;
        } catch (e) {
            console.warn("Failed to parse stored conversations, using seed.", e);
            return null;
        }
    }

    function saveConversations() {
        try {
            localStorage.setItem(STORAGE_CONVS_KEY, JSON.stringify(conversations));
        } catch (e) {
            console.error("Failed to save conversations", e);
        }
    }

    /* ---------- STATE ---------- */
    let conversations = loadConversations() || getSeedConversations();
    let currentFilter = localStorage.getItem(STORAGE_FILTER_KEY) || "all";
    let currentConvId = localStorage.getItem(STORAGE_ACTIVE_ID_KEY) || (conversations[0]?.id || null);

    /* ---------- DOM ---------- */
    const filterTabs = document.getElementById("filterTabs");
    const conversationListEl = document.getElementById("conversationList");
    const convSearchInput = document.getElementById("convSearchInput");
    const convSummary = document.getElementById("convSummary");
    const chatContainer = document.getElementById("chatContainer");
    const newConvBtn = document.getElementById("newConvBtn");

    const newConvModal = document.getElementById("newConvModal");
    const newConvForm = document.getElementById("newConvForm");
    const newConvEmail = document.getElementById("newConvEmail");
    const newConvPhone = document.getElementById("newConvPhone");
    const newConvSubject = document.getElementById("newConvSubject");
    const newConvBody = document.getElementById("newConvBody");
    const newConvError = document.getElementById("newConvError");
    const closeModalBtn = document.getElementById("closeModalBtn");
    const cancelModalBtn = document.getElementById("cancelModalBtn");

    /* ---------- HELPERS ---------- */
    function formatConversationCount(count) {
        return count + (count === 1 ? " conversation" : " conversations");
    }

    function getConversation(id) {
        return conversations.find(c => c.id === id);
    }

    function setActiveConversation(id) {
        currentConvId = id;
        localStorage.setItem(STORAGE_ACTIVE_ID_KEY, id || "");
    }

    function setFilter(filter) {
        currentFilter = filter;
        localStorage.setItem(STORAGE_FILTER_KEY, filter);
    }

    /* ---------- RENDER CONVERSATIONS ---------- */
    function renderConversations() {
        conversationListEl.innerHTML = "";
        const q = (convSearchInput.value || "").trim().toLowerCase();

        let filtered = conversations.filter(c => currentFilter === "all" || c.type === currentFilter);

        if (q) {
            filtered = filtered.filter(c =>
                c.title.toLowerCase().includes(q) ||
                (c.messages[c.messages.length - 1]?.text || "").toLowerCase().includes(q)
            );
        }

        convSummary.textContent = formatConversationCount(filtered.length);

        if (filtered.length === 0) {
            conversationListEl.innerHTML =
                '<div class="empty-chat" style="background:none;border:none;">No conversations match this filter.</div>';
            return;
        }

        filtered.forEach(c => {
            const lastMsg = c.messages[c.messages.length - 1];
            const snippet = lastMsg ? lastMsg.text.slice(0, 60) + (lastMsg.text.length > 60 ? "…" : "") : "";
            const item = document.createElement("div");
            item.className = "conversation-item" + (c.id === currentConvId ? " active" : "");
            item.dataset.id = c.id;

            const avatarClass =
                c.type === "system" ? "system" :
                c.type === "support" ? "support" :
                c.type === "security" ? "security" : "";

            const labelClass = c.type;

            const initial = c.title.charAt(0).toUpperCase();

            item.innerHTML = `
                <div class="conv-avatar ${avatarClass}">${initial}</div>
                <div class="conv-main">
                    <div class="conv-title-row">
                        <span class="conv-title">${c.title}</span>
                        <span class="conv-time">${c.lastTime}</span>
                    </div>
                    <span class="conv-snippet">${snippet}</span>
                </div>
                <div class="conv-meta">
                    <span class="label-pill ${labelClass}">${c.type.charAt(0).toUpperCase() + c.type.slice(1)}</span>
                    ${c.unread > 0 ? '<span class="unread-dot"></span>' : ""}
                </div>
            `;

            conversationListEl.appendChild(item);
        });
    }

    /* ---------- RENDER CHAT ---------- */
    function renderChat() {
        chatContainer.innerHTML = "";

        const conv = getConversation(currentConvId);

        if (!conv) {
            chatContainer.innerHTML = `
                <div class="empty-chat">
                    Select a conversation from the left to view messages, or start a new one.
                </div>
            `;
            return;
        }

        const header = document.createElement("div");
        header.className = "chat-header";

        const avatarClass =
            conv.type === "system" ? "system" :
            conv.type === "support" ? "support" :
            conv.type === "security" ? "security" : "";

        let metaText = `${conv.type.charAt(0).toUpperCase() + conv.type.slice(1)} · Last updated ${conv.lastTime}`;
        if (conv.contact) {
            const contactParts = [];
            if (conv.contact.email) contactParts.push(conv.contact.email);
            if (conv.contact.phone) contactParts.push(conv.contact.phone);
            if (contactParts.length > 0) {
                metaText += " · " + contactParts.join(" · ");
            }
        }

        header.innerHTML = `
            <div class="chat-header-left">
                <div class="conv-avatar ${avatarClass}">${conv.title.charAt(0).toUpperCase()}</div>
                <div class="chat-title">
                    <span class="name">${conv.title}</span>
                    <span class="meta">${metaText}</span>
                </div>
            </div>
            <div class="chat-header-actions">
                <button class="icon-circle-btn" title="Mark as unread" id="markUnreadBtn">
                    <i class="uil uil-eye-slash"></i>
                </button>
                <button class="icon-circle-btn" title="Delete conversation" id="deleteConvBtn">
                    <i class="uil uil-trash-alt"></i>
                </button>
            </div>
        `;

        const body = document.createElement("div");
        body.className = "chat-body";
        body.id = "chatBody";

        if (conv.messages.length === 0) {
            body.innerHTML = '<div class="empty-chat">No messages yet. Say hi to start the conversation.</div>';
        } else {
            conv.messages.forEach(msg => {
                const row = document.createElement("div");
                row.className = "chat-message-row " + (msg.from === "me" ? "me" : "them");

                const bubble = document.createElement("div");
                bubble.className = "chat-bubble " + (msg.from === "me" ? "me" : "them");
                bubble.textContent = msg.text;
                row.appendChild(bubble);
                body.appendChild(row);

                const metaRow = document.createElement("div");
                metaRow.className = "chat-meta-row " + (msg.from === "me" ? "" : "them");
                metaRow.innerHTML = `
                    <span>${msg.time}</span>
                    ${msg.tag ? `<span class="chat-tag ${msg.tag}">${msg.tag}</span>` : ""}
                `;
                body.appendChild(metaRow);
            });
        }

        // Composer
        const composer = document.createElement("div");
        composer.className = "chat-composer";
        composer.innerHTML = `
            <div class="composer-row">
                <textarea id="composerTextarea" class="composer-textarea" rows="1"
                    placeholder="Type your message to NINAR here..."></textarea>
                <div class="composer-actions">
                    <button type="button" class="send-btn" id="sendMsgBtn">
                        <span>Send</span><i class="uil uil-message"></i>
                    </button>
                </div>
            </div>
            <div class="composer-footnote">
                Messages & contact details are stored only in this browser (localStorage). No server calls.
            </div>
        `;

        chatContainer.appendChild(header);
        chatContainer.appendChild(body);
        chatContainer.appendChild(composer);

        // Scroll to bottom
        body.scrollTop = body.scrollHeight;

        // Attach composer events
        const textarea = document.getElementById("composerTextarea");
        const sendBtn = document.getElementById("sendMsgBtn");
        const markUnreadBtn = document.getElementById("markUnreadBtn");
        const deleteConvBtn = document.getElementById("deleteConvBtn");

        textarea.addEventListener("input", () => {
            textarea.style.height = "auto";
            textarea.style.height = Math.min(textarea.scrollHeight, 150) + "px";
        });

        textarea.addEventListener("keydown", (e) => {
            if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                sendCurrentMessage();
            }
        });

        sendBtn.addEventListener("click", () => {
            sendCurrentMessage();
        });

        markUnreadBtn.addEventListener("click", () => {
            conv.unread = Math.max(conv.unread, 1);
            saveConversations();
            renderConversations();
        });

        deleteConvBtn.addEventListener("click", () => {
            if (!confirm("Delete this conversation from this browser?")) return;
            conversations = conversations.filter(c => c.id !== conv.id);
            saveConversations();
            if (conversations.length > 0) {
                setActiveConversation(conversations[0].id);
                setFilter("all");
                filterTabs.querySelectorAll("button").forEach(b => {
                    b.classList.toggle("active", b.dataset.filter === "all");
                });
            } else {
                setActiveConversation(null);
            }
            renderConversations();
            renderChat();
        });

        // ---- send + auto reply ----
        function sendCurrentMessage() {
            const text = textarea.value.trim();
            if (!text) return;

            const time = new Date();
            const timeStr = time.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

            // User message
            conv.messages.push({
                from: "me",
                text,
                time: timeStr
            });
            conv.lastTime = "Just now";
            conv.unread = 0;

            textarea.value = "";
            textarea.style.height = "auto";

            saveConversations();
            renderConversations();
            renderChat(); // re-render so message appears immediately

            // Auto reply (simulated "them")
            const replyTime = new Date();
            const replyTimeStr = replyTime.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

            const shortSnippet = text.length > 90 ? text.slice(0, 90) + "…" : text;

            let autoText;
            if (conv.type === "system") {
                autoText = `System auto-reply: we registered your message "${shortSnippet}". In a real app, this would create a ticket in the notification service.`;
            } else if (conv.type === "security") {
                autoText = `Security auto-reply: we would review this event and alert you by email${
                    conv.contact?.email ? " at " + conv.contact.email : ""
                } if anything looks suspicious.`;
            } else {
                autoText = `Support auto-reply: thanks for reaching out with "${shortSnippet}". In a real product, a support agent would now join this thread and help you further.`;
            }

            setTimeout(() => {
                conv.messages.push({
                    from: "them",
                    text: autoText,
                    time: replyTimeStr,
                    tag: conv.type
                });
                conv.lastTime = "Just now";
                conv.unread += 1; // incoming message

                saveConversations();
                renderConversations();
                renderChat();
            }, 900);
        }
    }

    /* ---------- EVENTS ---------- */
    filterTabs.addEventListener("click", (e) => {
        const btn = e.target.closest("button");
        if (!btn) return;
        const filter = btn.dataset.filter;
        if (!filter) return;

        filterTabs.querySelectorAll("button").forEach(b => b.classList.remove("active"));
        btn.classList.add("active");

        setFilter(filter);
        renderConversations();
    });

    convSearchInput.addEventListener("input", () => {
        renderConversations();
    });

    conversationListEl.addEventListener("click", (e) => {
        const item = e.target.closest(".conversation-item");
        if (!item) return;
        const id = item.dataset.id;
        setActiveConversation(id);

        const conv = getConversation(id);
        if (conv) {
            conv.unread = 0;
            saveConversations();
        }

        renderConversations();
        renderChat();
    });

    /* ---------- NEW CONVERSATION MODAL ---------- */

    function openNewConvModal() {
        newConvError.style.display = "none";
        newConvError.textContent = "";
        newConvEmail.value = "";
        newConvPhone.value = "";
        newConvSubject.value = "";
        newConvBody.value = "";
        newConvModal.classList.add("active");
        newConvEmail.focus();
    }

    function closeNewConvModal() {
        newConvModal.classList.remove("active");
    }

    newConvBtn.addEventListener("click", () => {
        openNewConvModal();
    });

    closeModalBtn.addEventListener("click", () => {
        closeNewConvModal();
    });

    cancelModalBtn.addEventListener("click", () => {
        closeNewConvModal();
    });

    newConvModal.addEventListener("click", (e) => {
        if (e.target === newConvModal) {
            closeNewConvModal();
        }
    });

    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape" && newConvModal.classList.contains("active")) {
            closeNewConvModal();
        }
    });

    newConvForm.addEventListener("submit", (e) => {
        e.preventDefault();
        newConvError.style.display = "none";
        newConvError.textContent = "";

        const email = newConvEmail.value.trim();
        const phone = newConvPhone.value.trim();
        const subject = newConvSubject.value.trim();
        const bodyText = newConvBody.value.trim();

        if (!email || !phone) {
            newConvError.textContent = "Please provide both email address and phone number.";
            newConvError.style.display = "block";
            return;
        }

        const id = "support-" + (Date.now());
        const now = new Date();
        const timeStr = now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

        const title = subject
            ? `Support · ${subject}`
            : `Support · ${email}`;

        const messages = [];

        if (bodyText) {
            messages.push({
                from: "me",
                text: bodyText,
                time: timeStr
            });
        }

        messages.push({
            from: "them",
            text: `Hi! We created a new support thread for you. In this demo, your contact is stored locally as ${email} / ${phone}.`,
            time: timeStr,
            tag: "support"
        });

        const newConv = {
            id,
            title,
            type: "support",
            unread: bodyText ? 1 : 0,
            lastTime: "Just now",
            contact: {
                email,
                phone
            },
            messages
        };

        conversations.unshift(newConv);
        saveConversations();
        setActiveConversation(id);
        setFilter("all");

        // reset filter tab UI
        filterTabs.querySelectorAll("button").forEach(b => {
            b.classList.toggle("active", b.dataset.filter === "all");
        });

        convSearchInput.value = "";

        closeNewConvModal();
        renderConversations();
        renderChat();
    });

    /* ---------- INIT ---------- */
    (function init() {
        // ensure filter tab UI matches restored filter
        filterTabs.querySelectorAll("button").forEach(b => {
            b.classList.toggle("active", b.dataset.filter === currentFilter);
        });

        if (!currentConvId && conversations.length > 0) {
            setActiveConversation(conversations[0].id);
        }

        renderConversations();
        renderChat();
    })();