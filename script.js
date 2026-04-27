/* ============================================
   FORMA — script.js
   ============================================ */

'use strict';

// --- Loader ---
// This code creates a simple loading screen that blocks interaction
// until the page feels “ready.” It updates a fake progress bar and counter
// so the loader appears dynamic instead of instantly disappearing.
const loader = document.getElementById('loader');
const loaderFill = document.getElementById('loaderFill');
const loaderCount = document.getElementById('loaderCount');

let count = 0;
const interval = setInterval(() => {
  // Increase the loading value by a random small amount to simulate progress.
  // Using randomness keeps the animation feeling natural rather than linear.
  count += Math.floor(Math.random() * 8) + 3;

  if (count >= 100) {
    count = 100;
    clearInterval(interval);

    // Wait a short moment so the final state is visible,
    // then hide the loader and restore page scrolling.
    setTimeout(() => {
      loader.classList.add('done');
      document.body.style.overflow = '';

      // Reveal the hero section elements once the loader has finished.
      // This creates the initial intro animation for the headline and hero copy.
      document.querySelectorAll('.hero [data-reveal], .hero-title .title-line').forEach((el, i) => {
        setTimeout(() => el.classList.add('revealed'), i * 100);
      });
    }, 300);
  }

  // Update the visual progress bar width and the counter text.
  loaderFill.style.width = count + '%';
  loaderCount.textContent = count;
}, 40);

// Prevent page scroll while the loader is visible.
// The loader should feel like a modal overlay, not just another page section.
document.body.style.overflow = 'hidden';

// --- Nav scroll ---
// Add a class to the navigation bar when the user scrolls down.
// This lets CSS apply a subtle visual change once the page is no longer at the top.
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 20);
}, { passive: true });

// --- Mobile nav ---
// Toggle a mobile drawer menu when the burger button is clicked.
const burger = document.getElementById('navBurger');
const drawer = document.getElementById('navDrawer');

burger?.addEventListener('click', () => {
  const open = drawer.classList.toggle('open');
  burger.classList.toggle('open', open);

  // Update ARIA attributes so screen readers know whether the menu is open.
  burger.setAttribute('aria-expanded', String(open));
  drawer.setAttribute('aria-hidden', String(!open));
});

// Close the drawer whenever a mobile nav link is selected.
// This prevents the menu from staying open after navigation.
drawer?.querySelectorAll('a').forEach(a => {
  a.addEventListener('click', () => {
    drawer.classList.remove('open');
    burger.classList.remove('open');
    burger.setAttribute('aria-expanded', 'false');
    drawer.setAttribute('aria-hidden', 'true');
  });
});

// --- Scroll Reveal ---
// Use IntersectionObserver to animate elements as they scroll into view.
// This keeps the page feeling lively without heavy animation libraries.
const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;

    // If elements share the same parent, reveal them with a staggered delay.
    // This makes groups of elements feel connected rather than all animating at once.
    const parent = entry.target.parentElement;
    const siblings = parent ? [...parent.querySelectorAll('[data-reveal]')] : [];
    const idx = siblings.indexOf(entry.target);

    setTimeout(() => {
      entry.target.classList.add('revealed');
    }, idx * 90);

    observer.unobserve(entry.target);
  });
}, { threshold: 0.1, rootMargin: '0px 0px -48px 0px' });

document.querySelectorAll('[data-reveal]').forEach(el => observer.observe(el));

// --- Smooth anchor scroll ---
// Override default anchor behavior so navigation links scroll smoothly.
// This keeps the user experience feeling polished when jumping between sections.
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', (e) => {
    const target = document.querySelector(a.getAttribute('href'));
    if (!target) return;

    e.preventDefault();

    window.scrollTo({
      top: target.getBoundingClientRect().top + window.scrollY - 72,
      behavior: 'smooth'
    });
  });
});

// --- Strip pause on hover ---
// The animated showcase strip pauses when the user hovers over it,
// giving them a chance to focus on the image without motion distraction.
const stripTrack = document.getElementById('stripTrack');
stripTrack?.addEventListener('mouseenter', () => {
  stripTrack.style.animationPlayState = 'paused';
});
stripTrack?.addEventListener('mouseleave', () => {
  stripTrack.style.animationPlayState = 'running';
});
