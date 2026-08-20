/**
 * Site Utilities - Theme Toggle, CAS Controls HUD & Helpers
 * DrNoodle5 (Johan Nararya)
 */

(function () {
  'use strict';

  // --- 1. Theme Management (Light / Dark) ---
  const THEME_KEY = 'drnoodle5_theme';

  function initTheme() {
    const savedTheme = localStorage.getItem(THEME_KEY);
    const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    const theme = savedTheme || (prefersDark ? 'dark' : 'light');
    setTheme(theme, false);

    const themeToggleBtns = document.querySelectorAll('.theme-toggle-btn');
    themeToggleBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        setTheme(newTheme, true);
      });
    });
  }

  function setTheme(theme, save = true) {
    if (theme === 'dark') {
      document.documentElement.setAttribute('data-theme', 'dark');
    } else {
      document.documentElement.removeAttribute('data-theme');
    }
    if (save) {
      localStorage.setItem(THEME_KEY, theme);
    }
    updateThemeButtonText(theme);
  }

  function updateThemeButtonText(theme) {
    const themeToggleBtns = document.querySelectorAll('.theme-toggle-btn');
    themeToggleBtns.forEach(btn => {
      btn.innerHTML = theme === 'dark' ? '☀ Light' : '☾ Dark';
    });
  }

  // --- 2. Interactive CAS HUD Controls ---
  function initCASHUD() {
    const hud = document.getElementById('cas-hud');
    const toggleBtn = document.getElementById('cas-hud-toggle');
    const closeBtn = document.getElementById('cas-hud-close');
    const scatterBtn = document.getElementById('cas-scatter-btn');
    const fishCountSlider = document.getElementById('cas-count-slider');
    const fishCountVal = document.getElementById('cas-count-val');
    const fearRadiusSlider = document.getElementById('cas-fear-slider');
    const fearRadiusVal = document.getElementById('cas-fear-val');

    if (toggleBtn && hud) {
      toggleBtn.addEventListener('click', () => {
        hud.classList.toggle('collapsed');
      });
    }

    if (closeBtn && hud) {
      closeBtn.addEventListener('click', () => {
        hud.classList.add('collapsed');
      });
    }

    if (scatterBtn) {
      scatterBtn.addEventListener('click', () => {
        if (window.AsciiFishCAS) window.AsciiFishCAS.scatter();
      });
    }

    if (fishCountSlider && fishCountVal) {
      fishCountSlider.addEventListener('input', (e) => {
        const val = parseInt(e.target.value, 10);
        fishCountVal.textContent = val;
        if (window.AsciiFishCAS) window.AsciiFishCAS.setCount(val);
      });
    }

    if (fearRadiusSlider && fearRadiusVal) {
      fearRadiusSlider.addEventListener('input', (e) => {
        const val = parseInt(e.target.value, 10);
        fearRadiusVal.textContent = `${val}px`;
        if (window.AsciiFishCAS) window.AsciiFishCAS.setFearRadius(val);
      });
    }
  }

  // --- 3. Footnote Interactive Helpers ---
  function initFootnotes() {
    const fnRefs = document.querySelectorAll('.fn-ref a');
    fnRefs.forEach(ref => {
      ref.addEventListener('click', (e) => {
        const targetId = ref.getAttribute('href');
        const targetEl = document.querySelector(targetId);
        if (targetEl) {
          targetEl.style.backgroundColor = 'var(--badge-bg)';
          setTimeout(() => {
            targetEl.style.backgroundColor = 'transparent';
          }, 1500);
        }
      });
    });
  }

  document.addEventListener('DOMContentLoaded', () => {
    initTheme();
    initCASHUD();
    initFootnotes();
  });

})();
