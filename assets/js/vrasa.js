/* ============================================================
   VRASA — Shared JavaScript
   ============================================================ */

(function () {
  'use strict';

  /* --- Global nav scroll reveal --- */
  function initNav() {
    const nav = document.querySelector('.g-nav');
    if (!nav) return;

    // On dark pages (archive etc.) always show
    if (nav.classList.contains('g-nav--dark')) {
      nav.classList.add('is-visible');
      return;
    }

    // On homepage: show once user reaches ~halfway through the split section
    const split = document.getElementById('journal');
    if (!split) {
      nav.classList.add('is-visible');
      return;
    }

    function updateNav() {
      const midpoint = split.offsetTop + split.offsetHeight * 0.48;
      if (window.scrollY >= midpoint) {
        nav.classList.add('is-visible');
      } else {
        nav.classList.remove('is-visible');
      }
    }
    window.addEventListener('scroll', updateNav, { passive: true });
    updateNav(); // run once on load
  }

  /* --- Active nav link highlight --- */
  function initActiveNav() {
    const path = window.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.g-nav__links a').forEach(a => {
      const href = a.getAttribute('href');
      if (href && (href === path || href.startsWith(path.replace('.html', '')))) {
        a.style.opacity = '1';
        a.style.fontWeight = '700';
      }
    });
  }

  /* --- Ticker duplicate for seamless loop --- */
  function initTickers() {
    document.querySelectorAll('.ticker__track').forEach(track => {
      // Clone children for seamless infinite scroll
      const items = Array.from(track.children);
      items.forEach(item => {
        const clone = item.cloneNode(true);
        track.appendChild(clone);
      });
    });
  }

  /* --- Lazy image fade-in --- */
  function initLazyImages() {
    const images = document.querySelectorAll('img[data-src]');
    if (!images.length) return;

    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.src = img.dataset.src;
          img.onload = () => img.classList.add('is-loaded');
          io.unobserve(img);
        }
      });
    }, { rootMargin: '200px' });

    images.forEach(img => {
      img.style.transition = 'opacity 0.6s ease';
      img.style.opacity = '0';
      img.classList.add = (cls) => {
        img.style.opacity = '1';
      };
      io.observe(img);
    });
  }

  /* --- Grid item hover: reveal label --- */
  function initGridHover() {
    document.querySelectorAll('.sheet__item').forEach(item => {
      item.addEventListener('mouseenter', () => {
        item.querySelector('.sheet__item-label')?.classList.add('is-visible');
      });
      item.addEventListener('mouseleave', () => {
        item.querySelector('.sheet__item-label')?.classList.remove('is-visible');
      });
    });
  }

  /* --- Cover scroll hint (fade out on scroll) --- */
  function initScrollHint() {
    const hint = document.querySelector('.cover__scroll-hint');
    if (!hint) return;
    window.addEventListener('scroll', () => {
      hint.style.opacity = Math.max(0, 1 - window.scrollY / 120) + '';
    }, { passive: true });
  }

  /* --- Init all --- */
  document.addEventListener('DOMContentLoaded', () => {
    initNav();
    initActiveNav();
    initTickers();
    initLazyImages();
    initGridHover();
    initScrollHint();
  });
})();
