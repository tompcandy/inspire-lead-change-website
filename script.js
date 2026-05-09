/* Inspire Lead Change — small interactivity layer */

(function () {
  'use strict';

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
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

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
        alert('Please fill in your name, email, and a short message.');
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
