(function () {
  var STORAGE_KEY = "preferred-language";
  var SUPPORTED_LANGUAGES = ["en", "zh"];

  var i18n = {
    en: {
      site_title: "Lingerze",
      language_toggle: "Switch language",
      theme_toggle: "Toggle theme",
      follow_button: "Follow",
      footer_follow: "Follow",
      website_label: "Website",
      email_label: "Email",
      feed_label: "Feed",
      footer_powered_by: "Powered by",
      footer_last_updated: "Site last updated"
    },
    zh: {
      site_title: "\u674e\u7075\u6cfd",
      language_toggle: "\u5207\u6362\u8bed\u8a00",
      theme_toggle: "\u5207\u6362\u4e3b\u9898",
      follow_button: "\u5173\u6ce8",
      footer_follow: "\u5173\u6ce8",
      website_label: "\u4e2a\u4eba\u7f51\u7ad9",
      email_label: "\u90ae\u7bb1",
      feed_label: "\u8ba2\u9605",
      footer_powered_by: "\u6280\u672f\u9a71\u52a8",
      footer_last_updated: "\u6700\u540e\u66f4\u65b0"
    }
  };

  var currentLanguage = resolveLanguage();

  function getStoredLanguage() {
    try {
      return localStorage.getItem(STORAGE_KEY);
    } catch (error) {
      return null;
    }
  }

  function persistLanguage(language) {
    try {
      localStorage.setItem(STORAGE_KEY, language);
    } catch (error) {
      // Ignore persistence failures in restricted browser modes.
    }
  }

  function resolveLanguage() {
    var storedLanguage = getStoredLanguage();
    if (SUPPORTED_LANGUAGES.indexOf(storedLanguage) !== -1) {
      return storedLanguage;
    }
    var browserLanguage = (navigator.language || "en").toLowerCase();
    return browserLanguage.indexOf("zh") === 0 ? "zh" : "en";
  }

  function applyDataText(language) {
    var bilingualElements = document.querySelectorAll("[data-i18n-en][data-i18n-zh]");
    bilingualElements.forEach(function (element) {
      var nextText = language === "zh" ? element.getAttribute("data-i18n-zh") : element.getAttribute("data-i18n-en");
      if (nextText !== null) {
        element.textContent = nextText;
      }
    });

    var keyedElements = document.querySelectorAll("[data-i18n-key]");
    keyedElements.forEach(function (element) {
      var key = element.getAttribute("data-i18n-key");
      var nextText = (i18n[language] && i18n[language][key]) || (i18n.en && i18n.en[key]);
      if (nextText) {
        element.textContent = nextText;
      }
    });

    var attrElements = document.querySelectorAll("[data-i18n-attr]");
    attrElements.forEach(function (element) {
      var ruleText = element.getAttribute("data-i18n-attr");
      if (!ruleText) {
        return;
      }
      ruleText.split("|").forEach(function (rule) {
        var pair = rule.split(":");
        if (pair.length !== 2) {
          return;
        }
        var attr = pair[0].trim();
        var key = pair[1].trim();
        var translatedValue = (i18n[language] && i18n[language][key]) || (i18n.en && i18n.en[key]);
        if (attr && translatedValue) {
          element.setAttribute(attr, translatedValue);
        }
      });
    });
  }

  function applyLanguageBlocks(language) {
    var blockElements = document.querySelectorAll("[data-lang-block]");
    blockElements.forEach(function (element) {
      var shouldShow = element.getAttribute("data-lang-block") === language;
      element.hidden = !shouldShow;
    });
  }

  function updateLanguageToggle(language) {
    var label = document.getElementById("language-toggle-label");
    if (label) {
      label.textContent = language === "zh" ? "EN" : "ZH";
    }
    var trigger = document.querySelector("#language-toggle a[role='button']");
    if (trigger) {
      trigger.setAttribute("aria-label", language === "zh" ? "Switch to English" : "Switch to Chinese");
    }
  }

  function applyLanguage(language) {
    currentLanguage = language;
    document.documentElement.setAttribute("lang", language === "zh" ? "zh-CN" : "en");
    document.documentElement.setAttribute("data-language", language);
    applyDataText(language);
    applyLanguageBlocks(language);
    updateLanguageToggle(language);
    persistLanguage(language);
  }

  function bindToggle() {
    var toggle = document.getElementById("language-toggle");
    if (!toggle) {
      return;
    }
    var handleToggle = function (event) {
      event.preventDefault();
      var nextLanguage = currentLanguage === "zh" ? "en" : "zh";
      applyLanguage(nextLanguage);
    };

    toggle.addEventListener("click", handleToggle);
    toggle.addEventListener("keydown", function (event) {
      if (event.key === "Enter" || event.key === " ") {
        handleToggle(event);
      }
    });
  }

  function bindThemeKeyboardSupport() {
    var themeTrigger = document.querySelector("#theme-toggle a[role='button']");
    if (!themeTrigger) {
      return;
    }
    themeTrigger.addEventListener("keydown", function (event) {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        var themeContainer = document.getElementById("theme-toggle");
        if (themeContainer) {
          themeContainer.click();
        }
      }
    });
  }

  bindToggle();
  bindThemeKeyboardSupport();
  applyLanguage(currentLanguage);
})();
