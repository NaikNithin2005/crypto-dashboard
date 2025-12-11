 // ---------- THEME (shared key: ninar_theme) ----------
    const themeBtn = document.querySelector(".nav_theme-btn");

    function applyThemeFromStorage() {
        const stored = localStorage.getItem("ninar_theme") || "light";
        const isDark = stored === "dark";
        document.body.classList.toggle("dark-theme", isDark);
        if (themeBtn) {
            themeBtn.innerHTML = isDark
                ? '<i class="uil uil-sun"></i>'
                : '<i class="uil uil-moon"></i>';
        }
    }

    if (themeBtn) {
        themeBtn.addEventListener("click", () => {
            const isDarkNow = !document.body.classList.contains("dark-theme");
            localStorage.setItem("ninar_theme", isDarkNow ? "dark" : "light");
            applyThemeFromStorage();
        });
    }

    applyThemeFromStorage();

    // ---------- FAQ DATA (expanded, crypto-style) ----------
    const faqs = [
        {
            id: 1,
            category: "account",
            title: "How do I verify my NINAR account (KYC)?",
            body: [
                "In a real exchange, verification (KYC) is handled in a dedicated onboarding flow.",
                "Typical steps: fill in your legal name and address, upload ID documents, then wait while the provider reviews them.",
                "In this demo dashboard, we only show the verification UI. No documents are uploaded or reviewed."
            ],
            tags: ["verification", "kyc", "limits"]
        },
        {
            id: 2,
            category: "wallet",
            title: "Where can I see my wallet balance, deposits and withdrawals?",
            body: [
                "Open the Wallet page to view a breakdown per coin (BTC, ETH, stablecoins, altcoins).",
                "Recent deposit and withdrawal history would normally appear in a dedicated 'Transactions' or 'Funding' tab.",
                "In this demo, balances and history live only in JavaScript and reset when you refresh the page."
            ],
            tags: ["wallet", "balances", "deposits", "withdrawals"]
        },
        {
            id: 3,
            category: "trading",
            title: "How does the NINAR Exchange simulator work?",
            body: [
                "The Exchange screen uses local JavaScript to simulate the order book, trades and price ticks.",
                "Market and limit orders update your demo balances instantly on the client.",
                "There is no connection to a live matching engine or blockchain—so it’s safe for practice and UI testing."
            ],
            tags: ["exchange", "orders", "simulation"]
        },
        {
            id: 4,
            category: "trading",
            title: "What is the difference between Market and Limit orders?",
            body: [
                "A Market order executes immediately at the best price available in the book.",
                "A Limit order lets you choose the maximum price you are willing to pay (for buys) or the minimum price you accept (for sells).",
                "In this demo, any limit order that crosses the current simulated price fills instantly; others remain as open orders."
            ],
            tags: ["market", "limit", "order types"]
        },
        {
            id: 5,
            category: "wallet",
            title: "Why do my balances reset after refreshing the page?",
            body: [
                "All portfolio and wallet data in this project currently lives only in memory (and optional localStorage).",
                "Refreshing the tab reloads the script so values go back to the initial demo state.",
                "To make balances persistent, you would connect this UI to a real backend (database / Firestore / APIs)."
            ],
            tags: ["reset", "demo", "local data"]
        },
        {
            id: 6,
            category: "security",
            title: "How can I keep my account and funds secure?",
            body: [
                "In a real crypto app you should: enable 2FA, use a strong unique password, and never share your seed phrase or API keys.",
                "Only download the official app, use hardware keys if possible, and be careful with browser extensions.",
                "This NINAR dashboard is a UI demo—no real keys or secrets should ever be stored in the frontend."
            ],
            tags: ["security", "2fa", "safety"]
        },
        {
            id: 7,
            category: "account",
            title: "Can I switch between light and dark mode?",
            body: [
                "Yes. Use the moon / sun icon in the top navigation bar to toggle the theme.",
                "Your preference is stored in localStorage so NINAR remembers it across page loads.",
                "You can customise colors in the CSS variables (in the :root and body.dark-theme blocks)."
            ],
            tags: ["theme", "design", "ui"]
        },
        {
            id: 8,
            category: "other",
            title: "Is NINAR connected to real-time crypto markets?",
            body: [
                "In this version, prices, order books, analytics and PnL are simulated in the browser.",
                "You can later swap the simulated data layer for real exchange APIs (REST + WebSocket) without changing most of the UI.",
                "This makes NINAR safe for demos, case studies and UI experiments."
            ],
            tags: ["real data", "api", "markets"]
        },
        {
            id: 9,
            category: "wallet",
            title: "How would deposits and withdrawals work in a real app?",
            body: [
                "On a live exchange you get a unique deposit address or QR code per asset or network.",
                "Withdrawals usually require 2FA + email or device confirmation and may include on-chain network fees.",
                "This demo only shows the screens. No on-chain transfer or real money movement happens."
            ],
            tags: ["deposits", "withdrawals", "onchain"]
        },
        {
            id: 10,
            category: "other",
            title: "Where can I see trading fees and minimum order sizes?",
            body: [
                "Real exchanges publish a fee schedule (maker / taker fees) and minimum order sizes per trading pair.",
                "In this UI demo, fees are shown only as labels or hints in the trading form UI.",
                "When you connect a backend, you should fetch fee tiers and limits from your server and show them here."
            ],
            tags: ["fees", "limits", "minimums"]
        },
        {
            id: 11,
            category: "security",
            title: "What happens if a new device logs into my account?",
            body: [
                "A production system would send you an email or in-app notification for every new device or IP.",
                "You would also be able to review active sessions and revoke access from the Security page.",
                "In this demo we show the security alerts only in the Message Center UI; no real login tracking is done."
            ],
            tags: ["device", "login", "sessions"]
        },
        {
            id: 12,
            category: "trading",
            title: "Does the Analytics page use my real trading history?",
            body: [
                "The Analytics view currently builds your PnL, allocation and risk metrics from simulated data points.",
                "When wired to a backend, those charts would use your real fills, portfolio snapshots and market prices.",
                "All formulas (volatility, Sharpe, Sortino, drawdown) are compatible with real data when you plug it in."
            ],
            tags: ["analytics", "pnl", "risk"]
        }
    ];

    // ---------- DEMO TICKETS ----------
    const demoTickets = [
        { id: "#NIN-10234", subject: "Unable to place demo order", status: "resolved", priority: "Normal" },
        { id: "#NIN-10212", subject: "Feedback on dashboard UI", status: "pending", priority: "Low" },
        { id: "#NIN-10187", subject: "Question about wallet reset", status: "open", priority: "Normal" }
    ];

    // ---------- DOM ----------
    const faqListEl = document.getElementById("faqList");
    const faqSearchInput = document.getElementById("faqSearchInput");
    const categoryChips = document.querySelectorAll(".category-chip");
    const faqCountBadge = document.getElementById("faqCountBadge");

    const supportForm = document.getElementById("supportForm");
    const supportEmail = document.getElementById("supportEmail");
    const supportTopic = document.getElementById("supportTopic");
    const supportSubject = document.getElementById("supportSubject");
    const supportMessage = document.getElementById("supportMessage");
    const supportStatus = document.getElementById("supportStatus");

    const quickLinkCards = document.querySelectorAll(".quick-link-card");
    const ticketsList = document.getElementById("ticketsList");

    let currentCategory = "all";

    // ---------- FAQ RENDERING ----------
    function renderFaqs() {
        faqListEl.innerHTML = "";
        const q = (faqSearchInput.value || "").trim().toLowerCase();

        let filtered = faqs.filter(f => currentCategory === "all" || f.category === currentCategory);

        if (q) {
            filtered = filtered.filter(f =>
                f.title.toLowerCase().includes(q) ||
                f.body.join(" ").toLowerCase().includes(q) ||
                f.tags.some(tag => tag.toLowerCase().includes(q))
            );
        }

        faqCountBadge.textContent = filtered.length + (filtered.length === 1 ? " result" : " results");

        if (filtered.length === 0) {
            faqListEl.innerHTML = '<div class="empty-state">No articles found. Try another keyword or category.</div>';
            return;
        }

        filtered.forEach(f => {
            const item = document.createElement("div");
            item.className = "faq-item";
            item.dataset.id = f.id;

            const categoryLabel = ({
                account: "Account & Profile",
                wallet: "Wallet & Payments",
                trading: "Trading & Orders",
                security: "Security",
                other: "Other"
            })[f.category] || "General";

            item.innerHTML = `
                <div class="faq-header">
                    <div class="faq-header-left">
                        <div class="faq-icon"><i class="uil uil-question-circle"></i></div>
                        <div>
                            <div class="faq-title">${f.title}</div>
                            <div class="faq-category-label">${categoryLabel}</div>
                        </div>
                    </div>
                    <div class="faq-toggle-icon">
                        <i class="uil uil-angle-down"></i>
                    </div>
                </div>
                <div class="faq-body">
                    ${f.body.map(p => `<p>${p}</p>`).join("")}
                    <div class="faq-tags">
                        Tags: ${f.tags.map(t => `<span>#${t}</span>`).join(" ")}
                    </div>
                </div>
            `;
            faqListEl.appendChild(item);
        });
    }

    // ---------- FAQ EVENTS ----------
    faqListEl.addEventListener("click", (e) => {
        const header = e.target.closest(".faq-header");
        if (!header) return;
        const item = header.parentElement;
        const body = item.querySelector(".faq-body");
        const icon = item.querySelector(".faq-toggle-icon i");
        const isOpen = body.classList.contains("open");

        // close others
        faqListEl.querySelectorAll(".faq-body.open").forEach(b => {
            if (b !== body) {
                b.classList.remove("open");
                const i = b.parentElement.querySelector(".faq-toggle-icon i");
                i.className = "uil uil-angle-down";
            }
        });

        if (isOpen) {
            body.classList.remove("open");
            icon.className = "uil uil-angle-down";
        } else {
            body.classList.add("open");
            icon.className = "uil uil-angle-up";
        }
    });

    categoryChips.forEach(chip => {
        chip.addEventListener("click", () => {
            categoryChips.forEach(c => c.classList.remove("active"));
            chip.classList.add("active");
            currentCategory = chip.dataset.category;
            renderFaqs();
        });
    });

    faqSearchInput.addEventListener("input", () => {
        renderFaqs();
    });

    // ---------- SUPPORT FORM ----------
    supportForm.addEventListener("submit", (e) => {
        e.preventDefault();
        supportStatus.textContent = "";
        supportStatus.className = "status-msg";

        const email = supportEmail.value.trim();
        const subject = supportSubject.value.trim();
        const message = supportMessage.value.trim();

        if (!email || !subject || !message) {
            supportStatus.textContent = "Please fill in all required fields.";
            supportStatus.classList.add("status-error");
            return;
        }

        const newId = "#NIN-" + (Math.floor(Math.random() * 9000) + 11000);
        demoTickets.unshift({
            id: newId,
            subject,
            status: "open",
            priority: "Normal"
        });

        renderTickets();

        supportForm.reset();
        supportTopic.value = "General question";

        supportStatus.textContent = "Your message has been captured in this demo. In a real app, it would be sent to NINAR Support.";
        supportStatus.classList.add("status-success");
    });

    // ---------- QUICK LINKS ----------
    quickLinkCards.forEach(card => {
        card.addEventListener("click", () => {
            const link = card.dataset.link;
            if (!link || link === "#") return;
            window.location.href = link;
        });
    });

    function renderTickets() {
        ticketsList.innerHTML = "";
        if (demoTickets.length === 0) {
            ticketsList.innerHTML = '<div class="empty-state">No tickets yet. Submit the form above to create a demo ticket.</div>';
            return;
        }

        demoTickets.slice(0, 4).forEach(t => {
            const row = document.createElement("div");
            row.className = "ticket-row";
            const statusClass = t.status === "resolved" ? "resolved" :
                t.status === "pending" ? "pending" : "open";
            row.innerHTML = `
                <span>
                    <span class="ticket-id">${t.id}</span><br>
                    <span>${t.subject}</span>
                </span>
                <span>
                    <span class="badge-status ${statusClass}">${t.status}</span>
                </span>
                <span class="ticket-priority">${t.priority}</span>
            `;
            ticketsList.appendChild(row);
        });
    }

    (function init() {
        renderFaqs();
        renderTickets();
    })();