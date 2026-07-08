/* Inspire Lead Change — small interactivity layer */

(function () {
  'use strict';

  /* ==========================================================
     i18n — language switching (EN / NL / DE / FR)
     ========================================================== */
  var I18N  = window.ILC_TRANSLATIONS || {};
  var LANGS = ['en', 'nl', 'de', 'fr'];
  var currentLang = 'en';

  /* Small inline SVG flags (3:2) */
  var FLAGS = {
    en: '<svg viewBox="0 0 60 40" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><rect width="60" height="40" fill="#012169"/><path d="M0,0 L60,40 M60,0 L0,40" stroke="#fff" stroke-width="8"/><path d="M0,0 L60,40 M60,0 L0,40" stroke="#C8102E" stroke-width="4.5"/><path d="M30,0 V40 M0,20 H60" stroke="#fff" stroke-width="13"/><path d="M30,0 V40 M0,20 H60" stroke="#C8102E" stroke-width="8"/></svg>',
    nl: '<svg viewBox="0 0 60 40" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><rect width="60" height="40" fill="#FFF"/><rect width="60" height="13.33" fill="#AE1C28"/><rect y="26.67" width="60" height="13.33" fill="#21468B"/></svg>',
    de: '<svg viewBox="0 0 60 40" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><rect width="60" height="13.33" fill="#000"/><rect y="13.33" width="60" height="13.33" fill="#DD0000"/><rect y="26.67" width="60" height="13.33" fill="#FFCE00"/></svg>',
    fr: '<svg viewBox="0 0 60 40" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><rect width="60" height="40" fill="#FFF"/><rect width="20" height="40" fill="#002395"/><rect x="40" width="20" height="40" fill="#ED2939"/></svg>'
  };

  function t(key, lang) {
    return (I18N[lang] && I18N[lang][key]) ||
           (I18N.en && I18N.en[key]) || null;
  }

  function detectLang() {
    try {
      var saved = localStorage.getItem('ilc-lang');
      if (saved && LANGS.indexOf(saved) !== -1) return saved;
    } catch (e) { /* storage unavailable */ }
    var nav = (navigator.language || 'en').slice(0, 2).toLowerCase();
    return LANGS.indexOf(nav) !== -1 ? nav : 'en';
  }

  function applyLang(lang) {
    if (!I18N[lang]) return;
    currentLang = lang;
    document.documentElement.lang = lang;

    /* Text / HTML content */
    document.querySelectorAll('[data-i18n]').forEach(function (el) {
      var val = t(el.getAttribute('data-i18n'), lang);
      if (val == null) return;

      if (el.namespaceURI === 'http://www.w3.org/2000/svg') {
        /* SVG labels: plain text + squeeze longer words into their block */
        el.textContent = val;
        var fit = el.getAttribute('data-i18n-fit');
        if (fit && val.length > 7) {
          el.setAttribute('textLength', fit);
          el.setAttribute('lengthAdjust', 'spacingAndGlyphs');
        } else {
          el.removeAttribute('textLength');
          el.removeAttribute('lengthAdjust');
        }
      } else if (el.tagName === 'TITLE') {
        el.textContent = val;
      } else {
        el.innerHTML = val;
      }
    });

    /* Attributes */
    document.querySelectorAll('[data-i18n-placeholder]').forEach(function (el) {
      var v = t(el.getAttribute('data-i18n-placeholder'), lang);
      if (v) el.setAttribute('placeholder', v);
    });
    document.querySelectorAll('[data-i18n-content]').forEach(function (el) {
      var v = t(el.getAttribute('data-i18n-content'), lang);
      if (v) el.setAttribute('content', v);
    });
    document.querySelectorAll('[data-i18n-aria]').forEach(function (el) {
      var v = t(el.getAttribute('data-i18n-aria'), lang);
      if (v) el.setAttribute('aria-label', v);
    });

    /* Footer year lives inside a translated string — re-fill it */
    fillYear();

    /* Update switcher UI */
    document.querySelectorAll('.lang-btn .code').forEach(function (el) {
      el.textContent = lang.toUpperCase();
    });
    document.querySelectorAll('.lang-btn .flag').forEach(function (el) {
      el.innerHTML = FLAGS[lang] || '';
    });
    document.querySelectorAll('.lang-menu button').forEach(function (b) {
      b.setAttribute('aria-current', b.getAttribute('data-lang') === lang ? 'true' : 'false');
    });

    try { localStorage.setItem('ilc-lang', lang); } catch (e) { /* ignore */ }
  }

  /* Add flags to the dropdown options */
  document.querySelectorAll('.lang-menu button').forEach(function (b) {
    var flag = FLAGS[b.getAttribute('data-lang')];
    if (flag && !b.querySelector('.flag')) {
      b.innerHTML = '<span class="flag" aria-hidden="true">' + flag + '</span><span>' + b.textContent + '</span>';
    }
  });

  /* Switcher open/close + selection */
  document.querySelectorAll('.lang-switch').forEach(function (sw) {
    var btn = sw.querySelector('.lang-btn');
    if (!btn) return;
    btn.addEventListener('click', function (e) {
      e.stopPropagation();
      var open = sw.dataset.open === 'true';
      sw.dataset.open = String(!open);
      btn.setAttribute('aria-expanded', String(!open));
    });
    sw.querySelectorAll('.lang-menu button').forEach(function (b) {
      b.addEventListener('click', function () {
        applyLang(b.getAttribute('data-lang'));
        sw.dataset.open = 'false';
        btn.setAttribute('aria-expanded', 'false');
      });
    });
  });
  document.addEventListener('click', function () {
    document.querySelectorAll('.lang-switch[data-open="true"]').forEach(function (sw) {
      sw.dataset.open = 'false';
      var btn = sw.querySelector('.lang-btn');
      if (btn) btn.setAttribute('aria-expanded', 'false');
    });
  });

  /* --- Mobile nav toggle --- */
  const toggle = document.querySelector('.nav-toggle');
  const links  = document.querySelector('.nav-links');
  if (toggle && links) {
    toggle.addEventListener('click', () => {
      const open = toggle.getAttribute('aria-expanded') === 'true';
      toggle.setAttribute('aria-expanded', String(!open));
      links.dataset.open = String(!open);
    });
    // Close menu when a link is clicked (mobile)
    links.querySelectorAll('a').forEach((a) => {
      a.addEventListener('click', () => {
        if (window.innerWidth <= 880) {
          toggle.setAttribute('aria-expanded', 'false');
          links.dataset.open = 'false';
        }
      });
    });
  }

  /* --- Footer year --- */
  function fillYear() {
    const yearEl = document.getElementById('year');
    if (yearEl) yearEl.textContent = new Date().getFullYear();
  }
  fillYear();

  /* Apply the saved / detected language on load */
  applyLang(detectLang());

  /* --- Contact form: opens user's mail client with pre-filled message --- */
  const form    = document.getElementById('contact-form');
  const success = document.getElementById('form-success');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const name    = (form.name.value    || '').trim();
      const company = (form.company.value || '').trim();
      const email   = (form.email.value   || '').trim();
      const role    = (form.role.value    || '').trim();
      const topic   = (form.topic.value   || '').trim();
      const message = (form.message.value || '').trim();

      // Basic validation
      if (!name || !email || !message) {
        alert(t('c.form.alert', currentLang) || 'Please fill in your name, email, and a short message.');
        return;
      }

      const subject = topic
        ? `[Website enquiry] ${topic} — ${name}`
        : `[Website enquiry] ${name}`;

      const body = [
        `Name:    ${name}`,
        company ? `Company: ${company}` : null,
        role    ? `Role:    ${role}`    : null,
        `Email:   ${email}`,
        topic   ? `Topic:   ${topic}`   : null,
        '',
        'Message:',
        message,
        '',
        '---',
        'Sent from inspireleadchange.com'
      ].filter(Boolean).join('\n');

      const mailto = `mailto:info@inspireleadchange.com`
        + `?subject=${encodeURIComponent(subject)}`
        + `&body=${encodeURIComponent(body)}`;

      window.location.href = mailto;

      if (success) {
        success.dataset.show = 'true';
        success.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    });
  }

  /* --- Add a subtle entrance for cards/sections (optional, only if supported) --- */
  if ('IntersectionObserver' in window) {
    const obs = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });

    document.querySelectorAll('.card, .step, .outcome').forEach((el) => {
      el.style.opacity = '0';
      el.style.transform = 'translateY(12px)';
      el.style.transition = 'opacity .5s ease, transform .5s ease';
      obs.observe(el);
    });
  }
})();
