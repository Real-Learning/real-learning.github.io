// Simple header logic - assumes elements are present when script loads
window.addEventListener('scroll', () => {
  const header = document.querySelector('#site-header') as HTMLElement;
  if (window.scrollY > 50) {
    header.classList.add('header--scrolled');
  } else {
    header.classList.remove('header--scrolled');
  }
}, { passive: true });

const menuToggle = document.querySelector('#menu-toggle') as HTMLButtonElement;
const navLinks = document.querySelector('#nav-links') as HTMLElement;

const closeMenu = () => {
  menuToggle.setAttribute('aria-expanded', 'false');
  navLinks.classList.remove('nav-links--open');
};

menuToggle.addEventListener('click', () => {
  const isExpanded = menuToggle.getAttribute('aria-expanded') === 'true';
  const newState = !isExpanded;

  menuToggle.setAttribute('aria-expanded', String(newState));

  if (newState) {
    navLinks.classList.add('nav-links--open');
  } else {
    navLinks.classList.remove('nav-links--open');
  }
});

const signupBtn = document.querySelector('.header-signup-btn') as HTMLElement;
signupBtn.addEventListener('click', () => {
  closeMenu();
});

// Close menu on pressing Escape key
window.addEventListener('keydown', (event: KeyboardEvent) => {
  if (event.key === 'Escape' && menuToggle.getAttribute('aria-expanded') === 'true') {
    closeMenu();
    menuToggle.focus();
  }
});

// Close menu when clicking outside
document.addEventListener('click', (event: MouseEvent) => {
  const target = event.target as HTMLElement;
  const isExpanded = menuToggle.getAttribute('aria-expanded') === 'true';
  if (isExpanded && !menuToggle.contains(target) && !navLinks.contains(target)) {
    closeMenu();
  }
});

const handleResize = () => {
  if (window.innerWidth >= 768) {
    closeMenu();
  }
};

window.addEventListener('resize', handleResize, { passive: true });
