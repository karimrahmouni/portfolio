/* ============================================================
   Portfolio 2026 — interactions
   i18n · thème · canvas · curseur · révélations · tilt · nav
   ============================================================ */
(function () {
  'use strict';

  var reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

  /* ---------- i18n ---------- */
  function applyLang(lang) {
    var dict = window.I18N[lang] || window.I18N.fr;
    document.querySelectorAll('[data-i18n]').forEach(function (el) {
      var key = el.getAttribute('data-i18n');
      if (dict[key] !== undefined) el.innerHTML = dict[key];
    });
    document.documentElement.lang = lang;
    document.title = dict['meta.title'];
    var meta = document.querySelector('meta[name="description"]');
    if (meta) meta.setAttribute('content', dict['meta.desc']);
    document.querySelectorAll('.lang-btn').forEach(function (btn) {
      btn.classList.toggle('active', btn.getAttribute('data-lang') === lang);
    });
    try { localStorage.setItem('lang', lang); } catch (e) {}
  }

  var savedLang;
  try { savedLang = localStorage.getItem('lang'); } catch (e) {}
  if (!savedLang) {
    savedLang = (navigator.language || 'fr').toLowerCase().indexOf('fr') === 0 ? 'fr' : 'en';
  }
  if (savedLang !== 'fr') applyLang(savedLang);
  else applyLang('fr');

  document.querySelectorAll('.lang-btn').forEach(function (btn) {
    btn.addEventListener('click', function () {
      applyLang(btn.getAttribute('data-lang'));
    });
  });

  /* ---------- Thème ---------- */
  var savedTheme;
  try { savedTheme = localStorage.getItem('theme'); } catch (e) {}
  if (savedTheme === 'light' || savedTheme === 'dark') {
    document.documentElement.setAttribute('data-theme', savedTheme);
  }
  document.getElementById('themeToggle').addEventListener('click', function () {
    var next = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    var metaTheme = document.querySelector('meta[name="theme-color"]');
    if (metaTheme) metaTheme.setAttribute('content', next === 'dark' ? '#07070d' : '#f7f6fc');
    try { localStorage.setItem('theme', next); } catch (e) {}
  });

  /* ---------- Titre hero : animation lettre par lettre ---------- */
  if (!reducedMotion) {
    document.querySelectorAll('#heroTitle .line').forEach(function (line, li) {
      var text = line.textContent;
      line.textContent = '';
      text.split('').forEach(function (ch, ci) {
        var span = document.createElement('span');
        span.className = 'char';
        span.textContent = ch === ' ' ? ' ' : ch;
        span.style.animationDelay = (0.15 + li * 0.22 + ci * 0.035) + 's';
        line.appendChild(span);
      });
    });
  }

  /* ---------- Canvas de particules (hero) ---------- */
  var canvas = document.getElementById('heroCanvas');
  if (canvas && !reducedMotion) {
    var ctx = canvas.getContext('2d');
    var particles = [];
    var mouse = { x: -9999, y: -9999 };
    var running = true;
    var dpr = Math.min(window.devicePixelRatio || 1, 2);

    function accentColor() {
      return getComputedStyle(document.documentElement).getPropertyValue('--accent').trim() || '#7c6cff';
    }

    function resize() {
      var rect = canvas.parentElement.getBoundingClientRect();
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      var count = Math.min(90, Math.floor(rect.width / 16));
      particles = [];
      for (var i = 0; i < count; i++) {
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          vx: (Math.random() - 0.5) * 0.35 * dpr,
          vy: (Math.random() - 0.5) * 0.35 * dpr,
          r: (Math.random() * 1.4 + 0.6) * dpr
        });
      }
    }

    function step() {
      if (!running) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      var color = accentColor();
      var linkDist = 130 * dpr;

      for (var i = 0; i < particles.length; i++) {
        var p = particles[i];
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;

        var dxm = p.x - mouse.x, dym = p.y - mouse.y;
        var dm = Math.sqrt(dxm * dxm + dym * dym);
        if (dm < 140 * dpr && dm > 0.01) {
          p.x += (dxm / dm) * 0.6 * dpr;
          p.y += (dym / dm) * 0.6 * dpr;
        }

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = color;
        ctx.globalAlpha = 0.55;
        ctx.fill();

        for (var j = i + 1; j < particles.length; j++) {
          var q = particles[j];
          var dx = p.x - q.x, dy = p.y - q.y;
          var d = Math.sqrt(dx * dx + dy * dy);
          if (d < linkDist) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(q.x, q.y);
            ctx.strokeStyle = color;
            ctx.globalAlpha = (1 - d / linkDist) * 0.14;
            ctx.lineWidth = 1;
            ctx.stroke();
          }
        }
      }
      ctx.globalAlpha = 1;
      requestAnimationFrame(step);
    }

    canvas.parentElement.addEventListener('mousemove', function (e) {
      var rect = canvas.getBoundingClientRect();
      mouse.x = (e.clientX - rect.left) * dpr;
      mouse.y = (e.clientY - rect.top) * dpr;
    });
    canvas.parentElement.addEventListener('mouseleave', function () {
      mouse.x = -9999; mouse.y = -9999;
    });

    // Pause quand le hero n'est pas visible
    new IntersectionObserver(function (entries) {
      var wasRunning = running;
      running = entries[0].isIntersecting;
      if (running && !wasRunning) step();
    }).observe(canvas.parentElement);

    window.addEventListener('resize', resize);
    resize();
    step();
  }

  /* ---------- Curseur personnalisé ---------- */
  if (finePointer && !reducedMotion) {
    var dot = document.getElementById('cursorDot');
    var ring = document.getElementById('cursorRing');
    var cx = -100, cy = -100, rx = -100, ry = -100;

    document.addEventListener('mousemove', function (e) {
      cx = e.clientX; cy = e.clientY;
      if (!document.body.classList.contains('cursor-active')) {
        document.body.classList.add('cursor-active');
        rx = cx; ry = cy;
      }
      dot.style.transform = 'translate(' + cx + 'px,' + cy + 'px) translate(-50%,-50%)';
    });
    document.addEventListener('mouseleave', function () {
      document.body.classList.remove('cursor-active');
    });

    (function followRing() {
      rx += (cx - rx) * 0.16;
      ry += (cy - ry) * 0.16;
      ring.style.transform = 'translate(' + rx + 'px,' + ry + 'px) translate(-50%,-50%)';
      requestAnimationFrame(followRing);
    })();

    document.querySelectorAll('a, button, [data-tilt]').forEach(function (el) {
      el.addEventListener('mouseenter', function () { document.body.classList.add('cursor-hover'); });
      el.addEventListener('mouseleave', function () { document.body.classList.remove('cursor-hover'); });
    });
  }

  /* ---------- Boutons magnétiques ---------- */
  if (finePointer && !reducedMotion) {
    document.querySelectorAll('[data-magnetic]').forEach(function (el) {
      el.addEventListener('mousemove', function (e) {
        var rect = el.getBoundingClientRect();
        var x = e.clientX - rect.left - rect.width / 2;
        var y = e.clientY - rect.top - rect.height / 2;
        el.style.transform = 'translate(' + x * 0.22 + 'px,' + y * 0.22 + 'px)';
      });
      el.addEventListener('mouseleave', function () {
        el.style.transform = '';
      });
    });
  }

  /* ---------- Tilt 3D + reflet suivant la souris ---------- */
  if (finePointer && !reducedMotion) {
    document.querySelectorAll('[data-tilt]').forEach(function (el) {
      el.addEventListener('mousemove', function (e) {
        var rect = el.getBoundingClientRect();
        var px = (e.clientX - rect.left) / rect.width;
        var py = (e.clientY - rect.top) / rect.height;
        el.style.setProperty('--mx', (px * 100) + '%');
        el.style.setProperty('--my', (py * 100) + '%');
        var rxDeg = (0.5 - py) * 6;
        var ryDeg = (px - 0.5) * 6;
        el.style.transform = 'perspective(900px) rotateX(' + rxDeg + 'deg) rotateY(' + ryDeg + 'deg)';
      });
      el.addEventListener('mouseleave', function () {
        el.style.transform = '';
      });
    });
  }

  /* ---------- Animations au scroll (démarrées après l'intro) ---------- */
  function initScrollFx() {

  var revealObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        var el = entry.target;
        el.classList.add('visible');
        revealObserver.unobserve(el);
        // Une fois révélé, on retire la transition lente pour que le tilt reste réactif
        setTimeout(function () { el.classList.remove('reveal', 'visible'); }, 1600);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
  document.querySelectorAll('.reveal').forEach(function (el) { revealObserver.observe(el); });

  /* ---------- Compteurs animés ---------- */
  var counterObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (!entry.isIntersecting) return;
      var el = entry.target;
      counterObserver.unobserve(el);
      var target = parseInt(el.getAttribute('data-count'), 10);
      if (reducedMotion) { el.textContent = target; return; }
      var start = null;
      function tick(ts) {
        if (!start) start = ts;
        var progress = Math.min((ts - start) / 1400, 1);
        var eased = 1 - Math.pow(1 - progress, 3);
        el.textContent = Math.round(target * eased);
        if (progress < 1) requestAnimationFrame(tick);
      }
      requestAnimationFrame(tick);
    });
  }, { threshold: 0.6 });
  document.querySelectorAll('[data-count]').forEach(function (el) { counterObserver.observe(el); });

  /* ---------- Fenêtre de code : révélation ligne par ligne ---------- */
  var codeWindow = document.querySelector('.code-window');
  if (codeWindow) {
    var codeObserver = new IntersectionObserver(function (entries) {
      if (!entries[0].isIntersecting) return;
      codeObserver.disconnect();
      var lines = codeWindow.querySelectorAll('.code-line');
      lines.forEach(function (line, i) {
        setTimeout(function () { line.classList.add('typed'); }, reducedMotion ? 0 : 350 + i * 110);
      });
    }, { threshold: 0.3 });
    codeObserver.observe(codeWindow);
  }

  /* ---------- Timeline : trait qui se dessine ---------- */
  var timeline = document.querySelector('.timeline');
  if (timeline) {
    new IntersectionObserver(function (entries, obs) {
      if (entries[0].isIntersecting) {
        timeline.classList.add('drawn');
        obs.disconnect();
      }
    }, { threshold: 0.15 }).observe(timeline);
  }

  } /* fin initScrollFx */

  /* ---------- Intro d'ouverture ---------- */
  var preloader = document.getElementById('preloader');
  var introDone = false;
  function finishIntro() {
    if (introDone) return;
    introDone = true;
    document.body.classList.add('intro-done');
    if (preloader) {
      preloader.classList.add('done');
      setTimeout(function () { preloader.remove(); }, 900);
    }
    initScrollFx();
  }
  if (reducedMotion) {
    finishIntro();
  } else {
    window.addEventListener('load', function () { setTimeout(finishIntro, 800); });
    setTimeout(finishIntro, 2600); // garde-fou si le chargement traîne
  }

  /* ---------- Navigation ---------- */
  var nav = document.getElementById('nav');
  var navLinks = document.getElementById('navLinks');
  var navToggle = document.getElementById('navToggle');
  var progress = document.getElementById('scrollProgress');
  var sections = document.querySelectorAll('section[id]');
  var links = document.querySelectorAll('.nav-link');

  function onScroll() {
    var y = window.scrollY;
    nav.classList.toggle('scrolled', y > 30);

    var doc = document.documentElement;
    var max = doc.scrollHeight - window.innerHeight;
    progress.style.transform = 'scaleX(' + (max > 0 ? y / max : 0) + ')';

    var current = '';
    sections.forEach(function (sec) {
      if (y >= sec.offsetTop - 160) current = sec.id;
    });
    links.forEach(function (link) {
      link.classList.toggle('active', link.getAttribute('href') === '#' + current);
    });
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  navToggle.addEventListener('click', function () {
    var open = navLinks.classList.toggle('open');
    navToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
  });
  links.forEach(function (link) {
    link.addEventListener('click', function () {
      navLinks.classList.remove('open');
      navToggle.setAttribute('aria-expanded', 'false');
    });
  });

  /* ---------- Année du footer ---------- */
  document.getElementById('year').textContent = new Date().getFullYear();
})();
