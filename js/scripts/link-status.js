// scripts/link-status.js

export function initLinkStatus() {
  const navLinks = document.querySelectorAll('[data-nav-link]');

  if (!navLinks.length) return;

  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      // take only links from the same block (ul/menu), not all on the site
      const parent = e.currentTarget.closest('ul, nav, .social');
      if (!parent) return;

      parent.querySelectorAll('[data-nav-link]').forEach(l =>
        l.classList.remove('active')
      );

      e.currentTarget.classList.add('active');
    });
  });
}
