import './styles/variables.css';
import './styles/layout.css';
import './styles/components.css';
import './styles/sections.css';

/**
 * Global Selectors
 */
const header = document.querySelector('#site-header') as HTMLElement;
const menuToggle = document.querySelector('#menu-toggle') as HTMLButtonElement;
const navLinks = document.querySelector('#main-nav') as HTMLElement;

/**
 * Sticky Header Logic
 */
if (header) {
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      header.classList.add('header--scrolled');
    } else {
      header.classList.remove('header--scrolled');
    }
  }, { passive: true });
}

/**
 * Responsive "..." Menu Logic
 */
if (menuToggle && navLinks) {
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
}

/**
 * Handle Resize & Cleanup
 */
const handleResize = () => {
  if (window.innerWidth >= 768) {
    if (menuToggle) menuToggle.setAttribute('aria-expanded', 'false');
    if (navLinks) navLinks.classList.remove('nav-links--open');
  }
};

window.addEventListener('resize', handleResize, { passive: true });
