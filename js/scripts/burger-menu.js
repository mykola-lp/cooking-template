// scripts/burger-menu.js

export function initBurgerMenu() {
  const navToggle = document.querySelector('.nav-toggle');
  const navPanel = document.querySelector('.nav-panel');

  if (!navToggle || !navPanel) return;

  function toggleMenu() {
    const isOpen = navPanel.classList.toggle('open'); // toggle drawer
    navToggle.classList.toggle('active', isOpen); // toggle burger -> cross

    navToggle.setAttribute('aria-expanded', isOpen);
    navPanel.setAttribute('aria-hidden', !isOpen);

    // prevent scrolling when menu is open
    document.body.style.overflow = isOpen ? 'hidden' : '';
  }

  function closeMenu() {
    navPanel.classList.remove('open');
    navToggle.classList.remove('active');

    navToggle.setAttribute('aria-expanded', false);
    navPanel.setAttribute('aria-hidden', true);

    document.body.style.overflow = '';
  }

  // click on burger button toggles menu
  navToggle.addEventListener('click', toggleMenu);

  navToggle.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      toggleMenu();
    }
  });

  // close menu when clicking outside of drawer
  document.addEventListener('click', (e) => {
    if (!navPanel.contains(e.target) && !navToggle.contains(e.target)) {
      closeMenu();
    }
  });

  // close menu when resizing window to desktop
  window.addEventListener('resize', () => {
    if (window.innerWidth > 968) {
      closeMenu();
    }
  });

  // close menu when clicking any link inside the drawer
  navPanel.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', closeMenu);
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && navPanel.classList.contains('open')) {
      closeMenu();
    }
  });
}
