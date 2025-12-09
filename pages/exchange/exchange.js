 const coins = [
        {
            symbol: "BTC",
            name: "Bitcoin",
            price: 82719,
            change: 1.72,
            volume: 120000000,
            orderBook: {bids: [], asks: []},
            trades: []
        },
        {
            symbol: "ETH",
            name: "Ethereum",
            price: 3719,
            change: -0.84,
            volume: 78000000,
            orderBook: {bids: [], asks: []},
            trades: []
        },
        {
            symbol: "BNB",
            name: "Binance Coin",
            price: 628,
            change: 0.32,
            volume: 32000000,
            orderBook: {bids: [], asks: []},
            trades: []
        },
        {
            symbol: "SOL",
            name: "Solana",
            price: 142.5,
            change: 3.12,
            volume: 56000000,
            orderBook: {bids: [], asks: []},
            trades: []
        },
        {
            symbol: "USDT",
            name: "Tether",
            price: 1.0,
            change: 0.02,
            volume: 890000000,
            orderBook: {bids: [], asks: []},
            trades: []
        }
    ];

    const balances = {
        BTC: 0.05234567,
        ETH: 1.21456789,
        BNB: 2.437621,
        SOL: 10.432156,
        USDT: 2500.12
    };

    const favourites = new Set();
    const watchlist = new Set();
    const openOrders = [];
    const orderHistory = [];
    let nextOrderId = 1;

    // ===== STATE =====

    let currentSymbol = "BTC";
    let currentSide = "BUY";
    let currentType = "MARKET"; // MARKET | LIMIT
    let currentTab = "all";
    let currentOrdersTab = "open";

    const FEE_RATE = 0.001; // 0.1%

    // ===== DOM ELEMENTS =====

    const marketsListEl = document.getElementById("marketsList");
    const searchInput = document.getElementById("searchInput");
    const tabs = document.querySelectorAll(".tab");

    const obPairTitle = document.getElementById("obPairTitle");
    const asksListEl = document.getElementById("asksList");
    const bidsListEl = document.getElementById("bidsList");
    const tradesListEl = document.getElementById("tradesList");
    const midPriceLabel = document.getElementById("midPriceLabel");

    const sideToggle = document.getElementById("sideToggle");
    const typeToggle = document.getElementById("typeToggle");
    const orderSideInput = document.getElementById("orderSide");
    const orderTypeInput = document.getElementById("orderType");
    const pairTitle = document.getElementById("pairTitle");
    const pairPriceEl = document.getElementById("pairPrice");
    const pairChangeEl = document.getElementById("pairChange");

    const symbolSelect = document.getElementById("symbolSelect");
    const availableBalanceEl = document.getElementById("availableBalance");
    const amountHint = document.getElementById("amountHint");
    const amountInput = document.getElementById("amountInput");
    const priceInput = document.getElementById("priceInput");
    const priceInfo = document.getElementById("priceInfo");
    const totalInput = document.getElementById("totalInput");
    const feeText = document.getElementById("feeText");

    const summarySide = document.getElementById("summarySide");
    const summaryType = document.getElementById("summaryType");
    const summaryPair = document.getElementById("summaryPair");
    const summaryTotal = document.getElementById("summaryTotal");
    const submitBtn = document.getElementById("submitBtn");
    const submitLabel = document.getElementById("submitLabel");
    const statusMsg = document.getElementById("statusMsg");
    const orderForm = document.getElementById("orderForm");

    const walletList = document.getElementById("walletList");
    const ordersContainer = document.getElementById("ordersContainer");
    const ordersTabsButtons = document.querySelectorAll("[data-orders-tab]");

    // ===== HELPERS =====

    function formatNumber(val, decimals = 2) {
        return Number(val).toLocaleString(undefined, {
            minimumFractionDigits: decimals,
            maximumFractionDigits: decimals
        });
    }

    function formatCompact(val) {
        return Intl.NumberFormat("en", {
            notation: "compact",
            maximumFractionDigits: 2
        }).format(val);
    }

    function getCoin(symbol) {
        return coins.find(c => c.symbol === symbol);
    }

    // ===== RENDER FUNCTIONS =====

    function renderMarkets() {
        const q = (searchInput.value || "").trim().toLowerCase();
        marketsListEl.innerHTML = "";

        let filtered = coins.slice();

        if (currentTab === "favourites") {
            filtered = filtered.filter(c => favourites.has(c.symbol));
        } else if (currentTab === "watchlist") {
            filtered = filtered.filter(c => watchlist.has(c.symbol));
        }

        if (q) {
            filtered = filtered.filter(c =>
                c.symbol.toLowerCase().includes(q) ||
                c.name.toLowerCase().includes(q)
            );
        }

        if (filtered.length === 0) {
            marketsListEl.innerHTML =
                '<div class="muted" style="padding:0.7rem 0.2rem;font-size:0.8rem;">No coins match this filter.</div>';
            return;
        }

        filtered.forEach(c => {
            const row = document.createElement("div");
            row.className = "market-row";

            const avatarClass =
                c.symbol === "ETH" ? "eth" :
                    c.symbol === "BNB" ? "bnb" :
                        c.symbol === "SOL" ? "sol" :
                            c.symbol === "USDT" ? "usdt" : "";

            const changeClass = c.change >= 0 ? "change-positive" : "change-negative";
            const changeText = (c.change >= 0 ? "+" : "") + c.change.toFixed(2) + "%";

            row.innerHTML = `
                <div class="market-main">
                    <div class="coin-avatar ${avatarClass}"></div>
                    <div class="coin-label">
                        <span>${c.symbol} / USDT</span>
                        <span>${c.name}</span>
                    </div>
                </div>
                <div>$${formatNumber(c.price, 2)}</div>
                <div class="${changeClass}">${changeText}</div>
                <div>${formatCompact(c.volume)} USDT</div>
                <div>
                    <div class="buy-sell-actions" style="margin-bottom:0.3rem;">
                        <button class="pill buy" data-action="buy" data-symbol="${c.symbol}">Buy</button>
                        <button class="pill sell" data-action="sell" data-symbol="${c.symbol}">Sell</button>
                    </div>
                    <div class="fav-watch">
                        <button class="icon-btn ${favourites.has(c.symbol) ? "active" : ""}"
                                data-icon="fav" data-symbol="${c.symbol}">
                            <i class="uil uil-heart"></i>
                        </button>
                        <button class="icon-btn ${watchlist.has(c.symbol) ? "active" : ""}"
                                data-icon="watch" data-symbol="${c.symbol}">
                            <i class="uil uil-star"></i>
                        </button>
                    </div>
                </div>
            `;
            marketsListEl.appendChild(row);
        });
    }

    function renderOrderBook() {
        const coin = getCoin(currentSymbol);
        if (!coin) return;

        obPairTitle.textContent = `${coin.symbol} / USDT`;

        asksListEl.innerHTML = "";
        bidsListEl.innerHTML = "";

        coin.orderBook.asks.forEach(a => {
            const row = document.createElement("div");
            row.className = "orderbook-row";
            row.innerHTML = `
                <span class="price ask">$${formatNumber(a.price, 2)}</span>
                <span class="size">${formatNumber(a.size, 4)}</span>
            `;
            asksListEl.appendChild(row);
        });

        coin.orderBook.bids.forEach(b => {
            const row = document.createElement("div");
            row.className = "orderbook-row";
            row.innerHTML = `
                <span class="price bid">$${formatNumber(b.price, 2)}</span>
                <span class="size">${formatNumber(b.size, 4)}</span>
            `;
            bidsListEl.appendChild(row);
        });

        const mid = coin.price;
        midPriceLabel.textContent = `Mid: $${formatNumber(mid, 2)}`;
    }

    function renderTrades() {
        const coin = getCoin(currentSymbol);
        if (!coin) return;
        tradesListEl.innerHTML = "";

        if (coin.trades.length === 0) {
            tradesListEl.innerHTML = '<div class="muted">Waiting for first trades…</div>';
            return;
        }

        coin.trades.slice().reverse().forEach(t => {
            const row = document.createElement("div");
            row.className = "trade-row";
            const sideClass = t.side === "BUY" ? "side-buy" : "side-sell";
            row.innerHTML = `
                <span class="${sideClass}">${t.side}</span>
                <span>$${formatNumber(t.price, 2)}</span>
                <span class="muted">${formatNumber(t.amount, 5)}</span>
            `;
            tradesListEl.appendChild(row);
        });
    }

    function renderWallet() {
        walletList.innerHTML = "";
        Object.keys(balances).forEach(symbol => {
            const row = document.createElement("div");
            row.className = "wallet-row";
            row.innerHTML = `
                <span>${symbol}</span>
                <span>${formatNumber(balances[symbol], 6)}</span>
            `;
            walletList.appendChild(row);
        });
    }

    function renderOrders() {
        ordersContainer.innerHTML = "";

        const source = currentOrdersTab === "open" ? openOrders : orderHistory;

        if (source.length === 0) {
            ordersContainer.innerHTML =
                `<div class="muted" style="font-size:0.78rem;">No ${currentOrdersTab === "open" ? "open" : "historical"} orders yet.</div>`;
            return;
        }

        const header = document.createElement("div");
        header.className = "orders-header";
        header.innerHTML = `
            <span>Side</span>
            <span>Pair</span>
            <span>Type</span>
            <span>Price</span>
            <span>Amount / Total</span>
        `;
        ordersContainer.appendChild(header);

        source.slice().slice().reverse().forEach(o => {
            const row = document.createElement("div");
            row.className = "orders-row";

            const tagClass = o.side === "BUY" ? "buy" : "sell";
            const priceText = o.type === "MARKET" ? "Market" : `$${formatNumber(o.price, 2)}`;
            const statusExtra = o.status && o.status !== "OPEN" ? ` (${o.status})` : "";

            row.innerHTML = `
                <span><span class="tag ${tagClass}">${o.side}</span></span>
                <span>${o.symbol}/USDT</span>
                <span>${o.type}</span>
                <span>${priceText}</span>
                <span class="muted">${formatNumber(o.amount, 6)} @ ${formatNumber(o.total, 2)} USDT${statusExtra}</span>
            `;
            ordersContainer.appendChild(row);
        });
    }

    function renderSymbolSelect() {
        symbolSelect.innerHTML = "";
        coins.forEach(c => {
            const opt = document.createElement("option");
            opt.value = c.symbol;
            opt.textContent = `${c.symbol} / USDT`;
            symbolSelect.appendChild(opt);
        });
        symbolSelect.value = currentSymbol;
    }

    function updatePairInfo() {
        const coin = getCoin(currentSymbol) || coins[0];
        pairTitle.textContent = `${coin.symbol} / USDT`;
        pairPriceEl.textContent = "$" + formatNumber(coin.price, 2);
        pairChangeEl.textContent =
            (coin.change >= 0 ? "+" : "") + coin.change.toFixed(2) + "%";

        if (coin.change >= 0) {
            pairChangeEl.classList.remove("red");
        } else {
            pairChangeEl.classList.add("red");
        }

        summaryPair.textContent = `${coin.symbol} / USDT`;

        if (currentType === "MARKET") {
            priceInput.value = coin.price.toFixed(2);
        }

        updateAvailableBalance();
        recalcTotal();
    }

    function updateAvailableBalance() {
        const bal = balances[currentSymbol] || 0;
        availableBalanceEl.textContent = `${formatNumber(bal, 8)} ${currentSymbol}`;
    }

    function recalcTotal() {
        const amount = parseFloat(amountInput.value) || 0;
        const price = parseFloat(priceInput.value) || 0;
        const total = amount * price;

        if (total > 0) {
            totalInput.value = total.toFixed(2);
            summaryTotal.textContent = `${formatNumber(total, 2)} USDT`;
        } else {
            totalInput.value = "";
            summaryTotal.textContent = "0.00 USDT";
        }

        const fee = total * FEE_RATE;
        feeText.textContent = `Fee (0.1%): ${formatNumber(fee || 0, 4)} USDT`;
    }

    function setSide(side) {
        currentSide = side;
        orderSideInput.value = side;

        sideToggle.querySelectorAll("button").forEach(btn => {
            btn.classList.remove("active", "buy", "sell");
        });
        const btn = sideToggle.querySelector(`[data-side="${side}"]`);
        btn.classList.add("active");
        btn.classList.add(side === "BUY" ? "buy" : "sell");

        summarySide.textContent = side === "BUY" ? "Buy" : "Sell";
        amountHint.textContent = side === "BUY" ? "Amount you want to buy" :
            "Amount you want to sell";
        submitBtn.classList.toggle("sell", side === "SELL");
        submitLabel.textContent =
            `Place ${side === "BUY" ? "Buy" : "Sell"} ${currentType === "MARKET" ? "Market" : "Limit"} Order`;
        statusMsg.textContent = "";
        statusMsg.className = "status-msg";
    }

    function setOrderType(type) {
        currentType = type;
        orderTypeInput.value = type;

        typeToggle.querySelectorAll("button").forEach(btn => {
            btn.classList.remove("active", "type");
        });
        const btn = typeToggle.querySelector(`[data-type="${type}"]`);
        btn.classList.add("active", "type");

        summaryType.textContent = type === "MARKET" ? "Market" : "Limit";
        const coin = getCoin(currentSymbol);

        if (type === "MARKET") {
            priceInput.value = coin.price.toFixed(2);
            priceInput.readOnly = true;
            priceInfo.textContent = "Market price";
        } else {
            priceInput.readOnly = false;
            priceInfo.textContent = "Your limit price";
        }

        submitLabel.textContent =
            `Place ${currentSide === "BUY" ? "Buy" : "Sell"} ${currentType === "MARKET" ? "Market" : "Limit"} Order`;

        recalcTotal();
    }

    function showStatus(message, isError = false) {
        statusMsg.textContent = message;
        statusMsg.className = "status-msg " + (isError ? "status-error" : "status-success");
    }

    // ===== EVENTS =====

    tabs.forEach(tab => {
        tab.addEventListener("click", () => {
            tabs.forEach(t => t.classList.remove("active"));
            tab.classList.add("active");
            currentTab = tab.dataset.tab;
            renderMarkets();
        });
    });

    searchInput.addEventListener("input", () => {
        renderMarkets();
    });

    marketsListEl.addEventListener("click", (e) => {
        const pill = e.target.closest(".pill");
        const iconBtn = e.target.closest(".icon-btn");

        if (pill) {
            const sym = pill.dataset.symbol;
            const action = pill.dataset.action;
            currentSymbol = sym;
            renderSymbolSelect();
            updatePairInfo();
            renderOrderBook();
            renderTrades();
            setSide(action.toUpperCase());
        }

        if (iconBtn) {
            const sym = iconBtn.dataset.symbol;
            const type = iconBtn.dataset.icon;
            if (type === "fav") {
                if (favourites.has(sym)) favourites.delete(sym);
                else favourites.add(sym);
            } else if (type === "watch") {
                if (watchlist.has(sym)) watchlist.delete(sym);
                else watchlist.add(sym);
            }
            renderMarkets();
        }
    });

    sideToggle.addEventListener("click", (e) => {
        const btn = e.target.closest("button");
        if (!btn) return;
        const side = btn.dataset.side;
        if (!side) return;
        setSide(side);
    });

    typeToggle.addEventListener("click", (e) => {
        const btn = e.target.closest("button");
        if (!btn) return;
        const type = btn.dataset.type;
        if (!type) return;
        setOrderType(type);
    });

    symbolSelect.addEventListener("change", () => {
        currentSymbol = symbolSelect.value;
        updatePairInfo();
        renderOrderBook();
        renderTrades();
    });

    amountInput.addEventListener("input", recalcTotal);
    priceInput.addEventListener("input", recalcTotal);

    ordersTabsButtons.forEach(btn => {
        btn.addEventListener("click", () => {
            ordersTabsButtons.forEach(b => b.classList.remove("active"));
            btn.classList.add("active");
            currentOrdersTab = btn.dataset.ordersTab;
            renderOrders();
        });
    });

    orderForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const amount = parseFloat(amountInput.value);
        const price = parseFloat(priceInput.value);
        const coin = getCoin(currentSymbol);
        if (!coin) return;

        if (!amount || amount <= 0 || !price || price <= 0) {
            showStatus("Enter a valid amount and price.", true);
            return;
        }

        const total = amount * price;
        const fee = total * FEE_RATE;
        const totalWithFee = total + fee;

        if (currentSide === "BUY") {
            if (balances.USDT < totalWithFee && currentType === "MARKET") {
                showStatus("Not enough USDT to buy (including fee).", true);
                return;
            }
            if (currentType === "MARKET") {
                // Market order executes immediately at mid price
                balances.USDT -= totalWithFee;
                balances[currentSymbol] = (balances[currentSymbol] || 0) + amount;
                const order = {
                    id: nextOrderId++,
                    symbol: currentSymbol,
                    side: "BUY",
                    type: "MARKET",
                    price,
                    amount,
                    total: totalWithFee,
                    status: "FILLED"
                };
                orderHistory.push(order);
                showStatus("Market buy executed (demo only).");
            } else {
                // Limit buy: if limit >= best ask -> fill now; else open order
                const bestAsk = coin.orderBook.asks.length ? coin.orderBook.asks[0].price : coin.price;
                if (price >= bestAsk) {
                    if (balances.USDT < totalWithFee) {
                        showStatus("Not enough USDT to buy (including fee).", true);
                        return;
                    }
                    balances.USDT -= totalWithFee;
                    balances[currentSymbol] = (balances[currentSymbol] || 0) + amount;
                    orderHistory.push({
                        id: nextOrderId++,
                        symbol: currentSymbol,
                        side: "BUY",
                        type: "LIMIT",
                        price,
                        amount,
                        total: totalWithFee,
                        status: "FILLED"
                    });
                    showStatus("Limit buy immediately filled (price crossed).");
                } else {
                    openOrders.push({
                        id: nextOrderId++,
                        symbol: currentSymbol,
                        side: "BUY",
                        type: "LIMIT",
                        price,
                        amount,
                        total: totalWithFee,
                        status: "OPEN"
                    });
                    showStatus("Limit buy placed (open order).");
                }
            }
        } else {
            // SELL
            if ((balances[currentSymbol] || 0) < amount && currentType === "MARKET") {
                showStatus(`Not enough ${currentSymbol} to sell.`, true);
                return;
            }
            if (currentType === "MARKET") {
                balances[currentSymbol] -= amount;
                balances.USDT += total - fee; // fee taken from proceeds
                orderHistory.push({
                    id: nextOrderId++,
                    symbol: currentSymbol,
                    side: "SELL",
                    type: "MARKET",
                    price,
                    amount,
                    total: total - fee,
                    status: "FILLED"
                });
                showStatus("Market sell executed (demo only).");
            } else {
                const bestBid = coin.orderBook.bids.length ? coin.orderBook.bids[0].price : coin.price;
                if (price <= bestBid) {
                    if ((balances[currentSymbol] || 0) < amount) {
                        showStatus(`Not enough ${currentSymbol} to sell.`, true);
                        return;
                    }
                    balances[currentSymbol] -= amount;
                    balances.USDT += total - fee;
                    orderHistory.push({
                        id: nextOrderId++,
                        symbol: currentSymbol,
                        side: "SELL",
                        type: "LIMIT",
                        price,
                        amount,
                        total: total - fee,
                        status: "FILLED"
                    });
                    showStatus("Limit sell immediately filled (price crossed).");
                } else {
                    openOrders.push({
                        id: nextOrderId++,
                        symbol: currentSymbol,
                        side: "SELL",
                        type: "LIMIT",
                        price,
                        amount,
                        total: total - fee,
                        status: "OPEN"
                    });
                    showStatus("Limit sell placed (open order).");
                }
            }
        }

        amountInput.value = "";
        recalcTotal();
        renderWallet();
        renderOrders();
    });

    // ===== ORDER BOOK & TRADES SIMULATION =====

    function generateOrderBook(price) {
        const bids = [];
        const asks = [];
        const levels = 10;
        const step = price * 0.0015; // 0.15%

        for (let i = levels; i >= 1; i--) {
            const p = price - step * i;
            bids.push({
                price: Math.max(0.0001, p),
                size: Math.random() * 0.7 + 0.01
            });
        }
        for (let i = 1; i <= levels; i++) {
            const p = price + step * i;
            asks.push({
                price: Math.max(0.0001, p),
                size: Math.random() * 0.7 + 0.01
            });
        }
        return {bids: bids.sort((a, b) => b.price - a.price), asks};
    }

    function addRandomTrade(coin) {
        const side = Math.random() > 0.5 ? "BUY" : "SELL";
        const price = coin.price * (1 + (Math.random() - 0.5) * 0.002);
        const amount = Math.random() * 0.6 + 0.01;
        coin.trades.push({side, price, amount});
        if (coin.trades.length > 40) coin.trades.shift();
    }

    function simulateTick() {
        coins.forEach(c => {
            const drift = 1 + (Math.random() - 0.5) * 0.0035; // ±0.175%
            c.price = Math.max(0.0001, c.price * drift);
            c.change += (Math.random() - 0.5) * 0.15;
            c.orderBook = generateOrderBook(c.price);
            addRandomTrade(c);
        });

        matchOpenOrders();
        renderMarkets();
        updatePairInfo();
        renderOrderBook();
        renderTrades();
        renderOrders();
    }

    function matchOpenOrders() {
        for (let i = openOrders.length - 1; i >= 0; i--) {
            const o = openOrders[i];
            const coin = getCoin(o.symbol);
            if (!coin) continue;
            const bestAsk = coin.orderBook.asks.length ? coin.orderBook.asks[0].price : coin.price;
            const bestBid = coin.orderBook.bids.length ? coin.orderBook.bids[0].price : coin.price;

            let shouldFill = false;
            let fillPrice = coin.price;

            if (o.side === "BUY" && bestAsk <= o.price) {
                shouldFill = true;
                fillPrice = bestAsk;
            } else if (o.side === "SELL" && bestBid >= o.price) {
                shouldFill = true;
                fillPrice = bestBid;
            }

            if (shouldFill) {
                const total = o.amount * fillPrice;
                const fee = total * FEE_RATE;

                if (o.side === "BUY") {
                    if (balances.USDT >= total + fee) {
                        balances.USDT -= total + fee;
                        balances[o.symbol] = (balances[o.symbol] || 0) + o.amount;
                    }
                } else {
                    if ((balances[o.symbol] || 0) >= o.amount) {
                        balances[o.symbol] -= o.amount;
                        balances.USDT += total - fee;
                    }
                }

                orderHistory.push({
                    ...o,
                    price: fillPrice,
                    total: o.side === "BUY" ? total + fee : total - fee,
                    status: "FILLED"
                });
                openOrders.splice(i, 1);
            }
        }
        renderWallet();
    }

    // ===== INIT =====

    (function init() {
        // prepare books & trades
        coins.forEach(c => {
            c.orderBook = generateOrderBook(c.price);
            for (let i = 0; i < 8; i++) addRandomTrade(c);
        });

        renderSymbolSelect();
        renderMarkets();
        renderOrderBook();
        renderTrades();
        renderWallet();
        renderOrders();
        updatePairInfo();
        setSide("BUY");
        setOrderType("MARKET");

        setInterval(simulateTick, 6000);
    })();



//Sidebar Menu

const Sidebar = document.querySelector(".sidebar")
const closeSidebarbtn = document.querySelector(".sidebar_close-btn")
const openSidebarbtn = document.querySelector(".nav_menu-btn")

openSidebarbtn.addEventListener("click", () => {
   Sidebar.style.display = "flex";
})

closeSidebarbtn.addEventListener("click", () => {
   Sidebar.style.display = "none";
})


// Theme Toggel

const themeBtn = document.querySelector(".nav_theme-btn");

themeBtn.addEventListener("click", () => {
    document.body.classList.toggle("dark-theme")
    if(document.body.classList.contains("dark-theme")){
        themeBtn.innerHTML = '<i class="uil uil-sun"></i>'

        localStorage.setItem("currentTheme", "dark-theme")
    } else {
        themeBtn.innerHTML = '<i class="uil uil-moon"></i>'

        localStorage.setItem("currentTheme", " ")

    }
})

document.body.className =localStorage.getItem("currentTheme")
if(document.body.classList.contains("dark-theme")){
    themeBtn.innerHTML = '<i class="uil uil-sun"></i>'

    localStorage.setItem("currentTheme", "dark-theme")
} else {
    themeBtn.innerHTML = '<i class="uil uil-moon"></i>'

    localStorage.setItem("currentTheme", " ")

}
