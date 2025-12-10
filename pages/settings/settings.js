 // ----- Theme handling (shared with other NINAR pages) -----
    const THEME_KEY = "ninar_theme";
    const themeBtn = document.querySelector(".nav_theme-btn");

    function applyThemeFromStorage() {
        const stored = localStorage.getItem(THEME_KEY) || "light";
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
            localStorage.setItem(THEME_KEY, isDarkNow ? "dark" : "light");
            applyThemeFromStorage();
        });
    }

    applyThemeFromStorage();

    // ----- Settings state -----
    const SETTINGS_KEY = "ninar_settings_v1";

    const defaultSettings = {
        name: "",
        email: "",
        username: "",
        language: "en",

        twoFA: false,
        loginAlerts: true,
        whitelist: false,
        antiPhishing: "",

        fiat: "INR",
        timeZone: "IST",
        orderConfirm: true,
        oneClick: false,

        priceAlerts: true,
        securityEmails: true,
        productEmails: true,
        marketingEmails: false,

        themePref: "system",
        maskBalances: false,
        hideDust: false,
        sessionTimeout: "30",
        reduceMotion: false
    };

    function loadSettings() {
        try {
            const raw = localStorage.getItem(SETTINGS_KEY);
            if (!raw) return { ...defaultSettings };
            const parsed = JSON.parse(raw);
            return { ...defaultSettings, ...parsed };
        } catch (e) {
            console.warn("Failed to parse settings, using defaults", e);
            return { ...defaultSettings };
        }
    }

    let settings = loadSettings();

    // ----- DOM bindings -----
    const el = id => document.getElementById(id);

    const settingName = el("settingName");
    const settingEmail = el("settingEmail");
    const settingUsername = el("settingUsername");
    const settingLanguage = el("settingLanguage");

    const setting2FA = el("setting2FA");
    const settingLoginAlerts = el("settingLoginAlerts");
    const settingWhitelist = el("settingWhitelist");
    const settingAntiPhishing = el("settingAntiPhishing");

    const settingFiat = el("settingFiat");
    const settingTimeZone = el("settingTimeZone");
    const settingOrderConfirm = el("settingOrderConfirm");
    const settingOneClick = el("settingOneClick");

    const settingPriceAlerts = el("settingPriceAlerts");
    const settingSecurityEmails = el("settingSecurityEmails");
    const settingProductEmails = el("settingProductEmails");
    const settingMarketingEmails = el("settingMarketingEmails");

    const settingThemePref = el("settingThemePref");
    const settingMaskBalances = el("settingMaskBalances");
    const settingHideDust = el("settingHideDust");
    const settingSessionTimeout = el("settingSessionTimeout");
    const settingReduceMotion = el("settingReduceMotion");

    const btnSaveSettings = el("btnSaveSettings");
    const btnSoftReset = el("btnSoftReset");
    const btnResetSettings = el("btnResetSettings");
    const btnClearAll = el("btnClearAll");
    const saveStatus = el("saveStatus");

    function applySettingsToUI() {
        settingName.value = settings.name;
        settingEmail.value = settings.email;
        settingUsername.value = settings.username;
        settingLanguage.value = settings.language;

        setting2FA.checked = settings.twoFA;
        settingLoginAlerts.checked = settings.loginAlerts;
        settingWhitelist.checked = settings.whitelist;
        settingAntiPhishing.value = settings.antiPhishing;

        settingFiat.value = settings.fiat;
        settingTimeZone.value = settings.timeZone;
        settingOrderConfirm.checked = settings.orderConfirm;
        settingOneClick.checked = settings.oneClick;

        settingPriceAlerts.checked = settings.priceAlerts;
        settingSecurityEmails.checked = settings.securityEmails;
        settingProductEmails.checked = settings.productEmails;
        settingMarketingEmails.checked = settings.marketingEmails;

        settingThemePref.value = settings.themePref;
        settingMaskBalances.checked = settings.maskBalances;
        settingHideDust.checked = settings.hideDust;
        settingSessionTimeout.value = settings.sessionTimeout;
        settingReduceMotion.checked = settings.reduceMotion;
    }

    function readUIIntoSettings() {
        settings.name = settingName.value.trim();
        settings.email = settingEmail.value.trim();
        settings.username = settingUsername.value.trim();
        settings.language = settingLanguage.value;

        settings.twoFA = setting2FA.checked;
        settings.loginAlerts = settingLoginAlerts.checked;
        settings.whitelist = settingWhitelist.checked;
        settings.antiPhishing = settingAntiPhishing.value.trim();

        settings.fiat = settingFiat.value;
        settings.timeZone = settingTimeZone.value;
        settings.orderConfirm = settingOrderConfirm.checked;
        settings.oneClick = settingOneClick.checked;

        settings.priceAlerts = settingPriceAlerts.checked;
        settings.securityEmails = settingSecurityEmails.checked;
        settings.productEmails = settingProductEmails.checked;
        settings.marketingEmails = settingMarketingEmails.checked;

        settings.themePref = settingThemePref.value;
        settings.maskBalances = settingMaskBalances.checked;
        settings.hideDust = settingHideDust.checked;
        settings.sessionTimeout = settingSessionTimeout.value;
        settings.reduceMotion = settingReduceMotion.checked;
    }

    function saveSettings() {
        readUIIntoSettings();
        localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
        saveStatus.textContent = "Settings saved locally in this browser.";
        saveStatus.classList.add("success");
        setTimeout(() => {
            saveStatus.textContent = "";
            saveStatus.classList.remove("success");
        }, 2500);
    }

    btnSaveSettings.addEventListener("click", () => {
        saveSettings();
    });

    btnSoftReset.addEventListener("click", () => {
        // revert to last saved (reload from storage)
        settings = loadSettings();
        applySettingsToUI();
        saveStatus.textContent = "Reverted unsaved changes.";
        saveStatus.classList.add("success");
        setTimeout(() => {
            saveStatus.textContent = "";
            saveStatus.classList.remove("success");
        }, 1800);
    });

    btnResetSettings.addEventListener("click", () => {
        if (!confirm("Reset all settings on this page to defaults?")) return;
        settings = { ...defaultSettings };
        localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
        applySettingsToUI();
        saveStatus.textContent = "Settings reset to defaults (demo only).";
        saveStatus.classList.add("success");
        setTimeout(() => {
            saveStatus.textContent = "";
            saveStatus.classList.remove("success");
        }, 2500);
    });

    btnClearAll.addEventListener("click", () => {
        if (!confirm("This will clear all NINAR demo data stored in this browser (settings, theme, etc). Continue?")) {
            return;
        }
        localStorage.removeItem(SETTINGS_KEY);
        localStorage.removeItem(THEME_KEY);
        // You might have other keys like message center, exchange, wallet, etc.
        // Clear them here if you want total reset.
        settings = { ...defaultSettings };
        applySettingsToUI();
        applyThemeFromStorage();
        saveStatus.textContent = "All NINAR demo data cleared locally.";
        saveStatus.classList.add("success");
        setTimeout(() => {
            saveStatus.textContent = "";
            saveStatus.classList.remove("success");
        }, 2500);
    });

    // Init
    applySettingsToUI();