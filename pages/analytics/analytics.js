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

    // ---------- UTILITIES ----------
    const pad = n => String(n).padStart(2, "0");
    const randFloat = (min, max) => Math.random() * (max - min) + min;

    // Set top date
    (function setDate() {
        const d = new Date();
        document.getElementById("topbarDate").textContent =
            `${pad(d.getMonth() + 1)} / ${pad(d.getDate())} / ${d.getFullYear()}`;
    })();

    // Time ranges & dummy base data
    const ranges = {
        "1D": {
            labels: ["09:00","10:00","11:00","12:00","13:00","14:00","15:00","16:00"],
            portfolio: [1670000,1682000,1688000,1694000,1701000,1710000,1716000,1721000],
            benchmark: [100,101,101.5,102,102.4,103,103.2,103.6]
        },
        "1W": {
            labels: ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"],
            portfolio: [1610000,1635000,1660000,1672000,1694000,1708000,1742562],
            benchmark: [100,101.2,102,101.7,103,103.9,104.5]
        },
        "1M": {
            labels: Array.from({length: 10}, (_, i) => `Day ${i+1}`),
            portfolio: [1500000,1514000,1528000,1539000,1565000,1589000,1602000,1633000,1680000,1742562],
            benchmark: [100,100.4,101,101.7,102.4,103,104.2,104.8,105.3,106]
        },
        "3M": {
            labels: ["Jan","Feb","Mar"],
            portfolio: [1380000,1480000,1742562],
            benchmark: [92,96,106]
        },
        "1Y": {
            labels: ["Apr","Jun","Aug","Oct","Dec"],
            portfolio: [1100000,1250000,1430000,1520000,1742562],
            benchmark: [70,80,88,97,106]
        },
        "ALL": {
            labels: ["2021","2022","2023","2024","2025"],
            portfolio: [400000,650000,930000,1350000,1742562],
            benchmark: [30,45,65,85,106]
        }
    };

    const portfolioCtx = document.getElementById("portfolioChart").getContext("2d");
    const allocationCtx = document.getElementById("allocationChart").getContext("2d");

    let portfolioChart, allocationChart;
    let currentRangeKey = "1D";

    // State for live values
    const state = {
        portfolioValue: 1742562,
        portfolioChange: 4.23,
        realizedPnl: 42310,
        winRate: 63.4,
        maxDrawdown: -18.9,
        volatility: 18.4,
        sharpe: 1.42,
        sortino: 1.86,
        durationDays: 3.4,
        exposureInvested: 81,
        movers: []
    };

    const fmtCurrency = v => "$" + v.toLocaleString("en-US", { maximumFractionDigits: 0 });
    const fmtCurrencySmall = v => "$" + v.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

    function createPortfolioChart(rangeKey) {
        currentRangeKey = rangeKey;
        const data = ranges[rangeKey];

        if (portfolioChart) portfolioChart.destroy();

        portfolioChart = new Chart(portfolioCtx, {
            type: "line",
            data: {
                labels: data.labels.slice(),
                datasets: [
                    {
                        label: "Portfolio",
                        data: data.portfolio.slice(),
                        borderWidth: 2.5,
                        tension: 0.35,
                        pointRadius: 0,
                        borderColor: "rgba(79,70,229,1)",
                        backgroundColor: "rgba(129,140,248,0.25)",
                        fill: true
                    },
                    {
                        label: "BTC Index",
                        data: data.benchmark.slice(),
                        borderWidth: 2,
                        tension: 0.35,
                        pointRadius: 0,
                        borderDash: [5,5],
                        borderColor: "rgba(148,163,184,1)",
                        backgroundColor: "transparent"
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                interaction: {
                    mode: "index",
                    intersect: false
                },
                plugins: {
                    legend: {
                        display: true,
                        position: "bottom",
                        labels: {
                            boxWidth: 10,
                            padding: 16
                        }
                    },
                    tooltip: {
                        callbacks: {
                            label: function(ctx) {
                                if (ctx.datasetIndex === 0) {
                                    return "Portfolio: " + fmtCurrency(ctx.parsed.y);
                                } else {
                                    return "BTC Index: " + ctx.parsed.y.toFixed(2);
                                }
                            }
                        }
                    }
                },
                scales: {
                    y: {
                        grid: { color: "rgba(209,213,219,0.4)" },
                        ticks: {
                            callback: function(value) {
                                if (rangeKey === "1D" || rangeKey === "1W") {
                                    return "$" + (value/1000).toFixed(0) + "k";
                                }
                                return "$" + (value/1000000).toFixed(1) + "M";
                            }
                        }
                    },
                    x: {
                        grid: { display: false }
                    }
                }
            }
        });
    }

    function createAllocationChart() {
        allocationChart = new Chart(allocationCtx, {
            type: "doughnut",
            data: {
                labels: ["BTC","ETH","Stablecoins","Altcoins","Fiat"],
                datasets: [{
                    data: [42,27,18,9,4],
                    backgroundColor: [
                        "#f97316",
                        "#4b5563",
                        "#22c55e",
                        "#6366f1",
                        "#fbbf24"
                    ],
                    borderWidth: 0,
                    hoverOffset: 6
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { display: false }
                },
                cutout: "65%"
            }
        });
    }

    // Time range buttons
    document.querySelectorAll(".time-chip").forEach(btn => {
        btn.addEventListener("click", () => {
            document.querySelectorAll(".time-chip").forEach(b => b.classList.remove("active"));
            btn.classList.add("active");
            createPortfolioChart(btn.getAttribute("data-range"));
        });
    });

    // Top movers initialization (parse DOM into state)
    const moverRows = Array.from(document.querySelectorAll("#topMovers .mover-row"));
    state.movers = moverRows.map(row => {
        const symbolEl = row.querySelector(".mover-symbol");
        const priceEl = row.querySelector(".mover-price");
        const changeEl = row.querySelector(".mover-change");

        const symbol = symbolEl.textContent.trim();
        const price = parseFloat(priceEl.textContent.replace("$",""));
        const change = parseFloat(changeEl.textContent);

        return { row, symbolEl, priceEl, changeEl, symbol, price, change };
    });

    // Live KPI update
    function updateKPIs() {
        // Small random drift on portfolio
        const deltaPct = randFloat(-0.15, 0.35);
        state.portfolioValue = Math.max(500000, state.portfolioValue * (1 + deltaPct / 100));

        // 24h change wiggle
        state.portfolioChange += randFloat(-0.2, 0.4);
        state.portfolioChange = Math.max(-15, Math.min(25, state.portfolioChange));

        // Realized PnL & win rate
        state.realizedPnl += randFloat(-500, 1500);
        state.realizedPnl = Math.max(-5000, Math.min(100000, state.realizedPnl));

        state.winRate += randFloat(-0.5, 0.5);
        state.winRate = Math.max(45, Math.min(80, state.winRate));

        // Max drawdown, volatility, ratios
        state.maxDrawdown += randFloat(-0.2, 0.2);
        state.maxDrawdown = Math.max(-35, Math.min(-10, state.maxDrawdown));

        state.volatility += randFloat(-0.15, 0.15);
        state.volatility = Math.max(10, Math.min(40, state.volatility));

        state.sharpe += randFloat(-0.02, 0.03);
        state.sharpe = Math.max(0.4, Math.min(2.5, state.sharpe));

        state.sortino += randFloat(-0.02, 0.03);
        state.sortino = Math.max(0.5, Math.min(3.0, state.sortino));

        state.durationDays += randFloat(-0.05, 0.05);
        state.durationDays = Math.max(1, Math.min(10, state.durationDays));

        state.exposureInvested += randFloat(-1, 1);
        state.exposureInvested = Math.max(50, Math.min(100, state.exposureInvested));

        // Update DOM
        const portfolioValueEl = document.getElementById("portfolioValue");
        const portfolioChangeEl = document.getElementById("portfolioChange");
        const realizedPnlEl = document.getElementById("realizedPnl");
        const winRateEl = document.getElementById("winRate");
        const maxDrawdownEl = document.getElementById("maxDrawdown");

        portfolioValueEl.textContent = fmtCurrency(Math.round(state.portfolioValue));

        portfolioChangeEl.textContent = `${state.portfolioChange >= 0 ? "+" : ""}${state.portfolioChange.toFixed(2)}% (24h)`;
        portfolioChangeEl.classList.toggle("positive", state.portfolioChange >= 0);
        portfolioChangeEl.classList.toggle("negative", state.portfolioChange < 0);

        realizedPnlEl.textContent =
            (state.realizedPnl >= 0 ? "+" : "-") +
            "$" + Math.abs(state.realizedPnl).toLocaleString("en-US", { maximumFractionDigits: 0 });

        winRateEl.textContent = `Win rate ${state.winRate.toFixed(1)}%`;
        winRateEl.classList.add("positive");

        maxDrawdownEl.textContent = `Max drawdown ${state.maxDrawdown.toFixed(1)}%`;
        maxDrawdownEl.classList.add("negative");

        // Risk metrics
        document.getElementById("metricVolatility").textContent = state.volatility.toFixed(1) + "%";
        document.getElementById("metricSharpe").textContent = state.sharpe.toFixed(2);
        document.getElementById("metricSortino").textContent = state.sortino.toFixed(2);
        document.getElementById("metricMdd").textContent = state.maxDrawdown.toFixed(1) + "%";
        document.getElementById("metricDuration").textContent = state.durationDays.toFixed(1) + " days";
        document.getElementById("metricExposure").textContent = state.exposureInvested.toFixed(0) + "% invested";
        document.getElementById("metricExposureTag").textContent = (100 - state.exposureInvested).toFixed(0) + "% in cash";
    }

    function updateMovers() {
        state.movers.forEach(m => {
            const priceDeltaPct = randFloat(-1.2, 1.2);
            m.price *= (1 + priceDeltaPct / 100);
            m.price = Math.max(0.01, m.price);

            m.change += priceDeltaPct;
            m.change = Math.max(-30, Math.min(40, m.change));

            // Update DOM
            if (m.price >= 1) {
                m.priceEl.textContent = fmtCurrencySmall(m.price);
            } else {
                m.priceEl.textContent = "$" + m.price.toFixed(3);
            }

            m.changeEl.textContent = `${m.change >= 0 ? "+" : ""}${m.change.toFixed(1)}%`;
            m.changeEl.classList.toggle("positive", m.change >= 0);
            m.changeEl.classList.toggle("negative", m.change < 0);
        });
    }

    function updatePortfolioChartLive() {
        if (!portfolioChart) return;

        const labels = portfolioChart.data.labels;
        const portfolioData = portfolioChart.data.datasets[0].data;
        const benchData = portfolioChart.data.datasets[1].data;

        const lastPortfolio = portfolioData[portfolioData.length - 1];
        const lastBench = benchData[benchData.length - 1];

        const newPortfolio = lastPortfolio * (1 + randFloat(-0.25, 0.4) / 100);
        const newBench = lastBench * (1 + randFloat(-0.08, 0.18) / 100);

        let newLabel;
        if (currentRangeKey === "1D") {
            const now = new Date();
            newLabel = `${pad(now.getHours())}:${pad(now.getMinutes())}`;
        } else if (currentRangeKey === "1W") {
            newLabel = "New";
        } else if (currentRangeKey === "1M") {
            newLabel = `Day ${labels.length + 1}`;
        } else {
            newLabel = labels[labels.length - 1];
        }

        if (labels.length >= 20) {
            labels.shift();
            portfolioData.shift();
            benchData.shift();
        }

        labels.push(newLabel);
        portfolioData.push(Math.round(newPortfolio));
        benchData.push(parseFloat(newBench.toFixed(2)));

        portfolioChart.update("none");
    }

    function liveTick() {
        updateKPIs();
        updateMovers();
        updatePortfolioChartLive();
    }

    // Init charts
    createPortfolioChart("1D");
    createAllocationChart();

    // Start live updates every 5 seconds
    setInterval(liveTick, 5000);