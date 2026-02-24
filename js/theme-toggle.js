// Shared theme toggle for the Theater site navbar/mobile menu.
(function () {
    "use strict";

    var STORAGE_KEY = "rtg_theme";

    function normalizeTheme(theme) {
        return theme === "light" ? "light" : "dark";
    }

    function getStoredTheme() {
        try {
            return localStorage.getItem(STORAGE_KEY);
        } catch (err) {
            return null;
        }
    }

    function saveTheme(theme) {
        try {
            localStorage.setItem(STORAGE_KEY, theme);
        } catch (err) {
            // Intentionally ignored when storage is blocked.
        }
    }

    function getInitialTheme() {
        var stored = normalizeTheme(getStoredTheme());
        if (stored) {
            return stored;
        }

        var prefersLight = window.matchMedia && window.matchMedia("(prefers-color-scheme: light)").matches;
        return prefersLight ? "light" : "dark";
    }

    function updateToggleButtons(theme) {
        var icon = theme === "light" ? "fa-sun" : "fa-moon";
        var label = theme === "light" ? "Switch to dark mode" : "Switch to light mode";

        document.querySelectorAll(".mode-toggle").forEach(function (button) {
            button.setAttribute("aria-label", label);
            button.setAttribute("title", label);

            var iconNode = button.querySelector(".mode-toggle-icon i");
            if (iconNode) {
                iconNode.className = "fas " + icon;
            }
        });
    }

    function applyTheme(theme) {
        var finalTheme = normalizeTheme(theme);
        document.body.classList.toggle("light-mode", finalTheme === "light");
        document.documentElement.setAttribute("data-theme", finalTheme);
        updateToggleButtons(finalTheme);
        return finalTheme;
    }

    function createToggleButton() {
        var button = document.createElement("button");
        button.type = "button";
        button.className = "mode-toggle";
        button.innerHTML = '<span class="mode-toggle-icon" aria-hidden="true"><i class="fas fa-moon"></i></span><span class="mode-toggle-label">Mode</span>';
        return button;
    }

    function ensureToggleExists(selector) {
        var container = document.querySelector(selector);
        if (!container) {
            return;
        }

        if (!container.querySelector(".mode-toggle")) {
            container.appendChild(createToggleButton());
        }
    }

    document.addEventListener("DOMContentLoaded", function () {
        ensureToggleExists(".action-buttons");
        ensureToggleExists(".header-right");
        ensureToggleExists(".mobile-menu-actions");
        ensureToggleExists(".auth-mode-toggle");

        var currentTheme = applyTheme(getInitialTheme());

        document.querySelectorAll(".mode-toggle").forEach(function (button) {
            button.addEventListener("click", function () {
                currentTheme = currentTheme === "light" ? "dark" : "light";
                currentTheme = applyTheme(currentTheme);
                saveTheme(currentTheme);
            });
        });
    });
})();
