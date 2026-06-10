// ============================================================
// Portfolio — Karim Rahmouni
// Interactions : nav, reveal au scroll, compteurs animés
// ============================================================

(function () {
  'use strict';

  const nav = document.getElementById('nav');
  const navToggle = document.getElementById('navToggle');
  const navLinks = document.getElementById('navLinks');
  const links = navLinks.querySelectorAll('.nav-link');

  // --- Nav : fond au scroll ---
  function onScroll() {
    nav.classList.toggle('scrolled', window.scrollY > 30);
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // --- Menu mobile ---
  navToggle.addEventListener('click', function () {
    const open = navLinks.classList.toggle('open');
    navToggle.classList.toggle('open', open);
    navToggle.setAttribute('aria-expanded', String(open));
    document.body.style.overflow = open ? 'hidden' : '';
  });
  navLinks.addEventListener('click', function (e) {
    if (e.target.closest('a')) {
      navLinks.classList.remove('open');
      navToggle.classList.remove('open');
      navToggle.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    }
  });

  // --- Lien actif selon la section visible ---
  const sections = document.querySelectorAll('section[id]');
  const sectionObserver = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        links.forEach(function (link) {
          link.classList.toggle(
            'active',
            link.getAttribute('href') === '#' + entry.target.id
          );
        });
      });
    },
    { rootMargin: '-45% 0px -50% 0px' }
  );
  sections.forEach(function (s) { sectionObserver.observe(s); });

  // --- Apparition au scroll ---
  const revealObserver = new IntersectionObserver(
    function (entries, observer) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          var el = entry.target;
          el.classList.add('visible');
          observer.unobserve(el);
          // Libère la transition une fois l'apparition jouée,
          // sinon elle ralentit l'effet tilt 3D au survol.
          setTimeout(function () {
            el.classList.remove('reveal', 'visible');
          }, 1400);
        }
      });
    },
    { threshold: 0.12 }
  );
  document.querySelectorAll('.reveal').forEach(function (el) {
    revealObserver.observe(el);
  });

  // --- Compteurs animés (stats du hero) ---
  function animateCount(el) {
    const target = parseInt(el.dataset.count, 10);
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      el.textContent = target;
      return;
    }
    const duration = 1400;
    const start = performance.now();
    function tick(now) {
      const p = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.round(eased * target);
      if (p < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }
  const statObserver = new IntersectionObserver(
    function (entries, observer) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          animateCount(entry.target);
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.5 }
  );
  document.querySelectorAll('.stat-num').forEach(function (el) {
    statObserver.observe(el);
  });

  // --- Effet tilt 3D au survol (cartes + fenêtre de code) ---
  var reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var canHover = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

  if (!reducedMotion && canHover) {
    var tiltElements = document.querySelectorAll(
      '.tilt, .skill-card, .project-card, .edu-card'
    );
    tiltElements.forEach(function (el) {
      el.classList.add('tilt-active');
      var maxTilt = el.classList.contains('tilt') ? 7 : 5;

      el.addEventListener('mousemove', function (e) {
        var rect = el.getBoundingClientRect();
        var px = e.clientX - rect.left;
        var py = e.clientY - rect.top;
        var x = px / rect.width - 0.5;
        var y = py / rect.height - 0.5;
        el.style.transform =
          'perspective(800px) rotateX(' + (-y * maxTilt).toFixed(2) + 'deg)' +
          ' rotateY(' + (x * maxTilt).toFixed(2) + 'deg)' +
          ' translateY(-4px) scale(1.015)';
        // Position du halo lumineux de la carte (voir ::after en CSS)
        el.style.setProperty('--mx', px.toFixed(0) + 'px');
        el.style.setProperty('--my', py.toFixed(0) + 'px');
      });

      el.addEventListener('mouseleave', function () {
        el.style.transform = '';
      });
    });
  }

  // --- Barre de progression de lecture ---
  var progressBar = document.getElementById('scrollProgress');
  function updateProgress() {
    var max = document.documentElement.scrollHeight - window.innerHeight;
    var ratio = max > 0 ? window.scrollY / max : 0;
    progressBar.style.transform = 'scaleX(' + ratio.toFixed(4) + ')';
  }
  window.addEventListener('scroll', updateProgress, { passive: true });
  window.addEventListener('resize', updateProgress, { passive: true });
  updateProgress();

  // --- Spotlight : halo qui suit la souris ---
  var spotlight = document.getElementById('spotlight');
  if (!reducedMotion && canHover) {
    var spotRaf = null;
    window.addEventListener('mousemove', function (e) {
      if (spotRaf) return;
      spotRaf = requestAnimationFrame(function () {
        spotlight.style.setProperty('--sx', e.clientX + 'px');
        spotlight.style.setProperty('--sy', e.clientY + 'px');
        spotRaf = null;
      });
    }, { passive: true });
  } else {
    spotlight.remove();
  }

  // --- Effet machine à écrire (rôle du hero) ---
  var typedEl = document.getElementById('typedText');
  var phrases = [
    'Développeur Back-end .NET',
    'Expert ASP.NET Core & Web API',
    'Architecte de solutions sur mesure',
    'Responsable de production'
  ];
  if (!reducedMotion && typedEl) {
    var phraseIndex = 0;
    var charIndex = phrases[0].length;
    var deleting = true; // le texte initial est déjà affiché : on commence par l'effacer

    function typeLoop() {
      var phrase = phrases[phraseIndex];
      if (deleting) {
        charIndex--;
        typedEl.textContent = phrase.slice(0, charIndex);
        if (charIndex === 0) {
          deleting = false;
          phraseIndex = (phraseIndex + 1) % phrases.length;
          setTimeout(typeLoop, 350);
        } else {
          setTimeout(typeLoop, 38);
        }
      } else {
        charIndex++;
        typedEl.textContent = phrase.slice(0, charIndex);
        if (charIndex === phrase.length) {
          deleting = true;
          setTimeout(typeLoop, 2200);
        } else {
          setTimeout(typeLoop, 65);
        }
      }
    }
    setTimeout(typeLoop, 2400);
  }

  // --- Boutons magnétiques ---
  if (!reducedMotion && canHover) {
    document.querySelectorAll('.btn').forEach(function (btn) {
      btn.addEventListener('mousemove', function (e) {
        var rect = btn.getBoundingClientRect();
        var dx = e.clientX - (rect.left + rect.width / 2);
        var dy = e.clientY - (rect.top + rect.height / 2);
        btn.style.transform =
          'translate(' + (dx * 0.18).toFixed(1) + 'px, ' + (dy * 0.3).toFixed(1) + 'px)';
      });
      btn.addEventListener('mouseleave', function () {
        btn.style.transform = '';
      });
    });
  }

  // --- Année courante ---
  document.getElementById('year').textContent = new Date().getFullYear();
})();
