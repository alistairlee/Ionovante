(function () {
  'use strict';

  var nav = document.getElementById('nav');
  var navLinks = document.getElementById('nav-links');
  var navToggle = document.getElementById('nav-toggle');

  /* Nav: add/remove solid background on scroll */
  if (nav) {
    function updateNavScroll() {
      if (window.scrollY > 50) {
        nav.classList.add('is-scrolled');
      } else {
        nav.classList.remove('is-scrolled');
      }
    }
    window.addEventListener('scroll', updateNavScroll, { passive: true });
    updateNavScroll();
  }

  /* Mobile menu toggle */
  if (navToggle && navLinks) {
    navToggle.addEventListener('click', function () {
      var isOpen = navLinks.classList.toggle('is-open');
      navToggle.setAttribute('aria-expanded', isOpen);
      navToggle.setAttribute('aria-label', isOpen ? 'Close menu' : 'Open menu');
    });
    navLinks.querySelectorAll('.nav__link').forEach(function (link) {
      link.addEventListener('click', function () {
        navLinks.classList.remove('is-open');
        navToggle.setAttribute('aria-expanded', 'false');
        navToggle.setAttribute('aria-label', 'Open menu');
      });
    });
  }

  /* Learning Portal: Shift+click opens stage environment */
  document.querySelectorAll('[data-learning-portal-link]').forEach(function (link) {
    link.addEventListener('click', function (event) {
      var nextUrl = event.shiftKey ? link.dataset.stageUrl : link.dataset.defaultUrl;

      if (!nextUrl || nextUrl === link.href) {
        return;
      }

      event.preventDefault();
      var newTab = window.open(nextUrl, '_blank');
      if (newTab) {
        newTab.opener = null;
      }
    });
  });

  /* GSAP ScrollTrigger: reveal animations */
  if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);
    gsap.utils.toArray('.reveal').forEach(function (el) {
      gsap.fromTo(el, { opacity: 0, y: 24 }, {
        opacity: 1,
        y: 0,
        duration: 0.6,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: el,
          start: 'top 85%',
          toggleActions: 'play none none none'
        }
      });
    });
  }
})();
