const themeToggleBtn = document.getElementById("themeToggle");
    const themeIcon = themeToggleBtn.querySelector("i");

    function applyThemeFromStorage() {
        const stored = localStorage.getItem("ninar_theme") || "light";
        if (stored === "dark") {
            document.body.classList.add("dark-theme");
            themeIcon.classList.remove("uil-moon");
            themeIcon.classList.add("uil-sun");
        } else {
            document.body.classList.remove("dark-theme");
            themeIcon.classList.remove("uil-sun");
            themeIcon.classList.add("uil-moon");
        }
    }

    themeToggleBtn.addEventListener("click", () => {
        const isDark = document.body.classList.toggle("dark-theme");
        localStorage.setItem("ninar_theme", isDark ? "dark" : "light");
        applyThemeFromStorage();
    });

    applyThemeFromStorage();

    const FAVORITES_KEY = "ninar_exchange_favorites";
    const ORDERS_KEY = "ninar_exchange_orders";
    const SELECTED_MARKET_KEY = "ninar_exchange_selected_pair";

    const baseMarkets = [
        {pair: "BTC/USDT", base: "BTC", quote: "USDT", price: 82719, change: 2.53, volume: 14320, segment: "btc"},
        {pair: "ETH/USDT", base: "ETH", quote: "USDT", price: 3719, change: -0.82, volume: 41320, segment: "alts"},
        {pair: "SOL/USDT", base: "SOL", quote: "USDT", price: 142.13, change: 4.11, volume: 28310, segment: "alts"},
        {pair: "BNB/USDT", base: "BNB", quote: "USDT", price: 612.34, change: 1.02, volume: 12340, segment: "alts"},
        {pair: "XRP/USDT", base: "XRP", quote: "USDT", price: 1.18, change: -3.21, volume: 55340, segment: "alts"},
        {pair: "ADA/USDT", base: "ADA", quote: "USDT", price: 0.72, change: 0.91, volume: 21230, segment: "alts"},
        {pair: "UNI/USDT", base: "UNI", quote: "USDT", price: 12.11, change: 5.43, volume: 9870, segment: "defi"},
        {pair: "AAVE/USDT", base: "AAVE", quote: "USDT", price: 142.55, change: 1.67, volume: 3210, segment: "defi"},
        {pair: "LINK/USDT", base: "LINK", quote: "USDT", price: 18.22, change: -0.56, volume: 11200, segment: "defi"},
        {pair: "BTC/EUR", base: "BTC", quote: "EUR", price: 74810, change: 2.23, volume: 3800, segment: "btc"}
    ];

    let markets = JSON.parse(JSON.stringify(baseMarkets));
    let favoriteSet = new Set(JSON.parse(localStorage.getItem(FAVORITES_KEY) || "[]"));

    function saveFavorites() {
        localStorage.setItem(FAVORITES_KEY, JSON.stringify(Array.from(favoriteSet)));
    }

    const marketsBody = document.getElementById("marketsBody");
    const marketTabs = document.querySelectorAll(".market-tab");
    const marketSearch = document.getElementById("marketSearch");

    const pairBaseBadge = document.getElementById("pairBaseBadge");
    const pairSymbolText = document.getElementById("pairSymbolText");
    const pairLastPrice = document.getElementById("pairLastPrice");
    const pairChangeEl = document.getElementById("pairChange");
    const chartPairLabel = document.getElementById("chartPairLabel");

    const btnBuySide = document.getElementById("btnBuySide");
    const btnSellSide = document.getElementById("btnSellSide");
    const orderTypePills = document.querySelectorAll(".order-type-pill");
    const inputPrice = document.getElementById("inputPrice");
    const inputAmount = document.getElementById("inputAmount");
    const priceLabelRight = document.getElementById("priceLabelRight");
    const priceUnit = document.getElementById("priceUnit");
    const amountUnit = document.getElementById("amountUnit");
    const amountSlider = document.getElementById("amountSlider");
    const sliderPercent = document.getElementById("sliderPercent");
    const totalValue = document.getElementById("totalValue");
    const btnPlaceOrder = document.getElementById("btnPlaceOrder");
    const balanceLabel = document.getElementById("balanceLabel");
    const ordersBody = document.getElementById("ordersBody");
    const orderBookList = document.getElementById("orderBookList");
    const tradesList = document.getElementById("tradesList");

    let activeTab = "all";
    let selectedMarket = markets[0];
    let activeSide = "buy";
    let activeOrderType = "market";

    let openOrders = [];
    try {
        openOrders = JSON.parse(localStorage.getItem(ORDERS_KEY) || "[]");
    } catch (e) {
        openOrders = [];
    }

    function saveOrders() {
        localStorage.setItem(ORDERS_KEY, JSON.stringify(openOrders));
    }

    const savedPair = localStorage.getItem(SELECTED_MARKET_KEY);
    if (savedPair) {
        const found = markets.find(m => m.pair === savedPair);
        if (found) selectedMarket = found;
    }

    const chartCanvas = document.getElementById("priceChart");
    const ctx = chartCanvas.getContext("2d");
    let chartPoints = [];
    let currentTimeframeDays = 1;

    const COINGECKO_BASE = "https://api.coingecko.com/api/v3";

    function classifySegmentFromCoin(coin) {
        const symbol = (coin.symbol || "").toUpperCase();
        if (symbol === "BTC") return "btc";
        if (["UNI", "AAVE", "LINK", "MKR", "COMP", "SNX", "CRV"].includes(symbol)) return "defi";
        if (symbol === "ETH") return "alts";
        return "alts";
    }

    async function hydrateMarketsFromAPI() {
        try {
            const pages = [1, 2];
            const liveMarkets = [];

            for (const page of pages) {
                const url =
                    `${COINGECKO_BASE}/coins/markets` +
                    `?vs_currency=usd&order=market_cap_desc&per_page=250&page=${page}` +
                    `&sparkline=false&price_change_percentage=24h`;

                const res = await fetch(url);
                if (!res.ok) continue;
                const data = await res.json();

                data.forEach(c => {
                    liveMarkets.push({
                        id: c.id,
                        pair: `${c.symbol.toUpperCase()}/USDT`,
                        base: c.symbol.toUpperCase(),
                        quote: "USDT",
                        price: c.current_price || 0,
                        change: c.price_change_percentage_24h || 0,
                        volume: c.total_volume || 0,
                        segment: classifySegmentFromCoin(c)
                    });
                });
            }

            if (liveMarkets.length === 0) return;

            markets = liveMarkets;

            const saved = localStorage.getItem(SELECTED_MARKET_KEY);
            if (saved) {
                const fp = markets.find(m => m.pair === saved);
                if (fp) selectedMarket = fp;
                else selectedMarket = markets[0];
            } else {
                selectedMarket = markets[0];
            }

            updateSelectedMarketUI();
            renderMarkets();
        } catch (err) {
            console.error("Failed to hydrate markets from CoinGecko; using fallback mock data.", err);
        }
    }

    setInterval(hydrateMarketsFromAPI, 30000);

    setInterval(() => {
        if (!markets || markets.length === 0) return;

        for (let i = 0; i < markets.length; i++) {
            const m = markets[i];
            const drift = 1 + (Math.random() - 0.5) * 0.002;
            const oldPrice = m.price;
            const newPrice = oldPrice * drift;
            const deltaPct = ((newPrice - oldPrice) / (oldPrice || 1)) * 100;

            m.price = newPrice;
            m.change = (m.change || 0) + deltaPct * 0.2;
            m.volume = m.volume * (1 + (Math.random() - 0.5) * 0.01);
        }

        if (selectedMarket) {
            const updated = markets.find(mm => mm.pair === selectedMarket.pair);
            if (updated) selectedMarket = updated;
        }

        updateSelectedMarketUI();
        renderMarkets();
    }, 5000);

    function renderMarkets() {
        const searchTerm = (marketSearch && marketSearch.value || "").toLowerCase();

        marketsBody.innerHTML = "";

        let filtered = markets.filter(m => {
            if (activeTab === "favorites" && !favoriteSet.has(m.pair)) return false;
            if (activeTab === "btc" && m.base !== "BTC") return false;
            if (activeTab === "alts" && (m.base === "BTC" || m.base === "ETH")) return false;
            if (activeTab === "defi" && !["UNI", "AAVE", "LINK", "MKR", "COMP", "SNX", "CRV"].includes(m.base)) return false;
            if (!searchTerm) return true;
            return m.pair.toLowerCase().includes(searchTerm) || m.base.toLowerCase().includes(searchTerm);
        });

        filtered.forEach(market => {
            const tr = document.createElement("tr");
            if (selectedMarket && market.pair === selectedMarket.pair) {
                tr.classList.add("active");
            }

            tr.innerHTML = `
                <td>
                    <i class="uil uil-star fav-icon ${favoriteSet.has(market.pair) ? "filled" : ""}"
                       data-pair="${market.pair}"></i>
                </td>
                <td>${market.pair}</td>
                <td>$${market.price.toLocaleString(undefined, {maximumFractionDigits: 6})}</td>
                <td class="${market.change >= 0 ? "change-pos" : "change-neg"}">
                    ${market.change >= 0 ? "+" : ""}${market.change.toFixed(2)}%
                </td>
                <td>${(market.volume / 1000000).toFixed(2)}M</td>
            `;

            tr.querySelector(".fav-icon").addEventListener("click", (e) => {
                e.stopPropagation();
                const pair = market.pair;
                if (favoriteSet.has(pair)) {
                    favoriteSet.delete(pair);
                } else {
                    favoriteSet.add(pair);
                }
                saveFavorites();
                renderMarkets();
            });

            tr.addEventListener("click", () => {
                selectedMarket = market;
                localStorage.setItem(SELECTED_MARKET_KEY, market.pair);
                updateSelectedMarketUI();
                renderMarkets();
            });

            marketsBody.appendChild(tr);
        });

        if (filtered.length === 0) {
            const tr = document.createElement("tr");
            tr.innerHTML = `<td colspan="5" style="font-size:11px;color:var(--text-muted);padding-top:6px;">
                No markets match this filter.</td>`;
            marketsBody.appendChild(tr);
        }
    }

    function updateSelectedMarketUI() {
        if (!selectedMarket) return;

        pairBaseBadge.textContent = selectedMarket.base[0] || "?";
        pairSymbolText.textContent = `${selectedMarket.pair}`;
        chartPairLabel.textContent = `${selectedMarket.pair}`;
        pairLastPrice.textContent =
            `$${selectedMarket.price.toLocaleString(undefined, {maximumFractionDigits: 6})}`;
        pairChangeEl.textContent =
            `${selectedMarket.change >= 0 ? "+" : ""}${selectedMarket.change.toFixed(2)}%`;
        pairChangeEl.style.color = selectedMarket.change >= 0 ? "var(--success)" : "var(--danger)";

        priceUnit.textContent = selectedMarket.quote;
        amountUnit.textContent = selectedMarket.base;

        balanceLabel.textContent =
            `Balance: ${(847119 + Math.random()).toFixed(4)} ${selectedMarket.base}`;
        btnPlaceOrder.textContent =
            `${activeSide === "buy" ? "Buy" : "Sell"} ${selectedMarket.base}`;

        if (activeOrderType === "market") {
            inputPrice.value = "";
            priceLabelRight.textContent = "Market";
        } else {
            if (!inputPrice.value) inputPrice.value = selectedMarket.price.toFixed(4);
            priceLabelRight.textContent = activeOrderType === "limit" ? "Limit" : "Stop";
        }
        recalcTotal();
        generateOrderBook();
        generateTrades(true);
        loadChartData();
    }

    marketTabs.forEach(tab => {
        tab.addEventListener("click", () => {
            marketTabs.forEach(t => t.classList.remove("active"));
            tab.classList.add("active");
            activeTab = tab.dataset.tab;
            renderMarkets();
        });
    });

    if (marketSearch) {
        marketSearch.addEventListener("input", renderMarkets);
    }

    function setSide(side) {
        activeSide = side;
        btnBuySide.classList.toggle("active", side === "buy");
        btnSellSide.classList.toggle("active", side === "sell");
        btnPlaceOrder.classList.toggle("buy", side === "buy");
        btnPlaceOrder.classList.toggle("sell", side === "sell");
        btnPlaceOrder.textContent =
            `${side === "buy" ? "Buy" : "Sell"} ${selectedMarket.base}`;
        recalcTotal();
    }

    btnBuySide.addEventListener("click", () => setSide("buy"));
    btnSellSide.addEventListener("click", () => setSide("sell"));

    orderTypePills.forEach(pill => {
        pill.addEventListener("click", () => {
            orderTypePills.forEach(p => p.classList.remove("active"));
            pill.classList.add("active");
            activeOrderType = pill.dataset.type;
            if (activeOrderType === "market") {
                priceLabelRight.textContent = "Market";
                inputPrice.value = "";
                inputPrice.placeholder = "Market price";
                inputPrice.disabled = false;
            } else if (activeOrderType === "limit") {
                priceLabelRight.textContent = "Limit";
                if (!inputPrice.value && selectedMarket) {
                    inputPrice.value = selectedMarket.price.toFixed(4);
                }
                inputPrice.placeholder = "Set your limit price";
                inputPrice.disabled = false;
            } else {
                priceLabelRight.textContent = "Stop";
                if (!inputPrice.value && selectedMarket) {
                    inputPrice.value = (selectedMarket.price * 0.98).toFixed(4);
                }
                inputPrice.placeholder = "Stop trigger price";
                inputPrice.disabled = false;
            }
            recalcTotal();
        });
    });

    amountSlider.addEventListener("input", () => {
        sliderPercent.textContent = amountSlider.value + "%";
        const maxSize = 2.0;
        const size = (amountSlider.value / 100) * maxSize;
        inputAmount.value = size.toFixed(4);
        recalcTotal();
    });

    [inputPrice, inputAmount].forEach(el => el.addEventListener("input", recalcTotal));

    function recalcTotal() {
        if (!selectedMarket) return;
        const amount = parseFloat(inputAmount.value) || 0;
        let price = parseFloat(inputPrice.value);
        if (activeOrderType === "market" || !price) {
            price = selectedMarket.price;
        }
        const total = amount * price;
        totalValue.textContent = `${total.toLocaleString(undefined, {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        })} ${selectedMarket.quote}`;
    }

    function renderOrders() {
        ordersBody.innerHTML = "";
        if (openOrders.length === 0) {
            const tr = document.createElement("tr");
            tr.innerHTML = `<td colspan="6" style="font-size:11px;color:var(--text-muted);padding-top:4px;">
                No orders yet. Place a Buy or Sell to see it here.</td>`;
            ordersBody.appendChild(tr);
            return;
        }

        openOrders.forEach(order => {
            const tr = document.createElement("tr");
            const sideColor = order.side === "buy" ? "var(--success)" : "var(--danger)";
            tr.innerHTML = `
                <td>${order.pair}</td>
                <td style="font-weight:600;color:${sideColor};">${order.side.toUpperCase()}</td>
                <td>${order.type}</td>
                <td>${order.price ? "$" + order.price.toFixed(4) : "Market"}</td>
                <td>${order.amount.toFixed(4)}</td>
                <td><span class="status-pill ${order.status === "Open" ? "status-open" : "status-filled"}">
                    ${order.status}
                </span></td>
            `;
            ordersBody.appendChild(tr);
        });
    }

    btnPlaceOrder.addEventListener("click", () => {
        if (!selectedMarket) return;
        const amount = parseFloat(inputAmount.value);
        if (!amount || amount <= 0) {
            alert("Enter a valid amount.");
            return;
        }

        let price = parseFloat(inputPrice.value);
        if (!price || activeOrderType === "market") price = selectedMarket.price;

        const order = {
            pair: selectedMarket.pair,
            side: activeSide,
            type: activeOrderType.toUpperCase(),
            price,
            amount,
            status: "Open"
        };
        openOrders.unshift(order);
        saveOrders();
        renderOrders();
    });

    setInterval(() => {
        if (openOrders.length === 0) return;
        const idx = Math.floor(Math.random() * openOrders.length);
        if (openOrders[idx].status === "Open") {
            openOrders[idx].status = "Filled";
            saveOrders();
            renderOrders();
        }
    }, 15000);

    function generateOrderBook() {
        orderBookList.innerHTML = "";
        if (!selectedMarket) return;
        const center = selectedMarket.price || 1;
        const levels = 15;

        for (let i = levels; i > 0; i--) {
            const price = center * (1 + (i / 1000));
            const amount = (Math.random() * 1.2 + 0.05);
            const total = price * amount;
            const depth = Math.random();
            const row = document.createElement("div");
            row.className = "depth-row ask";
            row.innerHTML = `
                <span>${price.toFixed(4)}</span>
                <span>${amount.toFixed(3)}</span>
                <span>${(total / 1000).toFixed(2)}k</span>
                <div class="bar" style="width:${depth * 100}%"></div>
            `;
            orderBookList.appendChild(row);
        }

        for (let i = 0; i < levels; i++) {
            const price = center * (1 - (i / 1000));
            const amount = (Math.random() * 1.2 + 0.05);
            const total = price * amount;
            const depth = Math.random();
            const row = document.createElement("div");
            row.className = "depth-row bid";
            row.innerHTML = `
                <span>${price.toFixed(4)}</span>
                <span>${amount.toFixed(3)}</span>
                <span>${(total / 1000).toFixed(2)}k</span>
                <div class="bar" style="width:${depth * 100}%"></div>
            `;
            orderBookList.appendChild(row);
        }
    }

    let trades = [];

    function generateTrades(initial = false) {
        if (!selectedMarket) return;
        if (initial) trades = [];
        tradesList.innerHTML = "";
        const now = new Date();

        for (let i = 0; i < 18; i++) {
            const side = Math.random() > 0.5 ? "buy" : "sell";
            const price = selectedMarket.price * (1 + (Math.random() - 0.5) * 0.002);
            const amount = (Math.random() * 1.3 + 0.01);
            const time = new Date(now.getTime() - i * 15000);
            trades.push({side, price, amount, time});
        }

        trades.sort((a, b) => b.time - a.time);
        renderTrades();
    }

    function renderTrades() {
        tradesList.innerHTML = "";
        trades.slice(0, 30).forEach(t => {
            const row = document.createElement("div");
            row.className = "trades-row " + (t.side === "buy" ? "buy" : "sell");
            const timeStr = t.time.toTimeString().slice(0, 8);
            row.innerHTML = `
                <span>${timeStr}</span>
                <span>${t.price.toFixed(4)}</span>
                <span>${t.amount.toFixed(3)}</span>
            `;
            tradesList.appendChild(row);
        });
    }

    setInterval(() => {
        if (!selectedMarket) return;
        const side = Math.random() > 0.5 ? "buy" : "sell";
        const price = selectedMarket.price * (1 + (Math.random() - 0.5) * 0.0015);
        const amount = (Math.random() * 1.5 + 0.01);
        const time = new Date();
        trades.unshift({side, price, amount, time});
        renderTrades();
    }, 2600);

    function drawChart() {
        const w = chartCanvas.clientWidth;
        const h = chartCanvas.clientHeight;
        if (w === 0 || h === 0) return;
        chartCanvas.width = w * window.devicePixelRatio;
        chartCanvas.height = h * window.devicePixelRatio;
        ctx.setTransform(window.devicePixelRatio, 0, 0, window.devicePixelRatio, 0, 0);
        ctx.clearRect(0, 0, w, h);

        if (!chartPoints || chartPoints.length === 0) return;

        const min = Math.min(...chartPoints);
        const max = Math.max(...chartPoints);
        const padding = 8;
        const range = max - min || 1;

        ctx.beginPath();
        chartPoints.forEach((value, idx) => {
            const x = padding + (idx / (chartPoints.length - 1)) * (w - padding * 2);
            const y = h - padding - ((value - min) / range) * (h - padding * 2);
            if (idx === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
        });
        ctx.lineTo(w - padding, h - padding);
        ctx.lineTo(padding, h - padding);
        ctx.closePath();
        ctx.fillStyle = "rgba(129, 140, 248, 0.35)";
        ctx.fill();

        ctx.beginPath();
        chartPoints.forEach((value, idx) => {
            const x = padding + (idx / (chartPoints.length - 1)) * (w - padding * 2);
            const y = h - padding - ((value - min) / range) * (h - padding * 2);
            if (idx === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
        });
        ctx.lineWidth = 1.8;
        ctx.strokeStyle = "#a855f7";
        ctx.stroke();
    }

    function regenerateMockChartData() {
        if (!selectedMarket) return;
        const base = selectedMarket.price || 1;
        chartPoints = [];
        let last = base;
        for (let i = 0; i < 60; i++) {
            last = last * (1 + (Math.random() - 0.5) * 0.003);
            chartPoints.push(last);
        }
        drawChart();
    }

    async function loadChartData() {
        if (!selectedMarket || !selectedMarket.id) {
            regenerateMockChartData();
            return;
        }
        try {
            const url =
                `${COINGECKO_BASE}/coins/${selectedMarket.id}/market_chart` +
                `?vs_currency=usd&days=${currentTimeframeDays}&interval=hourly`;
            const res = await fetch(url);
            if (!res.ok) {
                regenerateMockChartData();
                return;
            }
            const data = await res.json();
            if (!data.prices || !data.prices.length) {
                regenerateMockChartData();
                return;
            }
            chartPoints = data.prices.map(p => p[1]);
            drawChart();
        } catch (e) {
            console.error("Failed to load chart data; using mock chart.", e);
            regenerateMockChartData();
        }
    }

    window.addEventListener("resize", drawChart);

    document.querySelectorAll(".timeframe-tab").forEach(btn => {
        btn.addEventListener("click", () => {
            document.querySelectorAll(".timeframe-tab").forEach(b => b.classList.remove("active"));
            btn.classList.add("active");
            const tf = btn.dataset.tf;
            if (tf === "1d") currentTimeframeDays = 1;
            else if (tf === "7d") currentTimeframeDays = 7;
            else if (tf === "30d") currentTimeframeDays = 30;
            else if (tf === "90d") currentTimeframeDays = 90;
            else if (tf === "365d") currentTimeframeDays = 365;
            loadChartData();
        });
    });

    updateSelectedMarketUI();
    renderMarkets();
    generateOrderBook();
    generateTrades(true);
    regenerateMockChartData();
    renderOrders();
    hydrateMarketsFromAPI();