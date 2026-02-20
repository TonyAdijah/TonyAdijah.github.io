/* ============================================
   TONY ADIJAH — PORTFOLIO JS
   Desktop + iPhone 13 / iOS Safari FIXED
   v3.0 — Hero load fix
   ============================================ */

(function () {
  'use strict';

  var isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) ||
    (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
  var isTouchDevice = ('ontouchstart' in window) || (navigator.maxTouchPoints > 0);

  // Start when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    // DOM already loaded
    init();
  }

  function init() {
    initMobileMenu();
    initScrollReveal();
    initSmoothScroll();
    initContactForm();
    initCursor();
  }

  /* ===== MOBILE MENU ===== */
  function initMobileMenu() {
    var btn = document.getElementById('mobile-menu-btn');
    var menu = document.getElementById('mobile-menu');
    if (!btn || !menu) return;

    btn.addEventListener('click', function () {
      var isActive = menu.classList.toggle('active');
      btn.classList.toggle('active');
      document.body.style.overflow = isActive ? 'hidden' : '';
      if (isIOS) {
        if (isActive) {
          document.body.style.position = 'fixed';
          document.body.style.width = '100%';
        } else {
          document.body.style.position = '';
          document.body.style.width = '';
        }
      }
    });

    var links = menu.querySelectorAll('a');
    for (var i = 0; i < links.length; i++) {
      links[i].addEventListener('click', function () {
        menu.classList.remove('active');
        btn.classList.remove('active');
        document.body.style.overflow = '';
        document.body.style.position = '';
        document.body.style.width = '';
      });
    }
  }

  /* ===== SCROLL REVEAL (Desktop + iOS Fixed) ===== */
  function initScrollReveal() {
    var elements = document.querySelectorAll('.reveal');
    if (!elements.length) return;

    if ('IntersectionObserver' in window) {
      var observer = new IntersectionObserver(
        function (entries) {
          for (var i = 0; i < entries.length; i++) {
            if (entries[i].isIntersecting) {
              var target = entries[i].target;
              requestAnimationFrame(function () {
                target.classList.add('visible');
              });
              observer.unobserve(entries[i].target);
            }
          }
        },
        {
          root: null,
          rootMargin: '50px 0px -10px 0px',
          threshold: 0.01,
        }
      );

      for (var i = 0; i < elements.length; i++) {
        observer.observe(elements[i]);
      }

      // ★★★ FIX: Check elements already in viewport on page load ★★★
      // Run immediately
      revealVisibleElements(elements);

      // Run again after fonts/images might have loaded
      setTimeout(function () {
        revealVisibleElements(elements);
      }, 100);

      // Run once more after everything is settled
      setTimeout(function () {
        revealVisibleElements(elements);
      }, 500);

      // Also run when window fully loads (images, fonts, etc.)
      window.addEventListener('load', function () {
        setTimeout(function () {
          revealVisibleElements(elements);
        }, 100);
      });

    } else {
      // Fallback: show everything
      for (var j = 0; j < elements.length; j++) {
        elements[j].classList.add('visible');
      }
    }
  }

  // ★★★ KEY FIX: Reveal elements already visible in viewport ★★★
  function revealVisibleElements(elements) {
    var windowHeight = window.innerHeight || document.documentElement.clientHeight;

    for (var i = 0; i < elements.length; i++) {
      if (elements[i].classList.contains('visible')) continue;

      var rect = elements[i].getBoundingClientRect();

      // Element is in viewport if its top is above the bottom of the screen
      // and its bottom is below the top of the screen
      if (rect.top < windowHeight + 50 && rect.bottom > -50) {
        // Use closure to capture the correct element
        (function (el) {
          requestAnimationFrame(function () {
            el.classList.add('visible');
          });
        })(elements[i]);
      }
    }
  }

  // Backup: Also check on scroll
  var scrollTimer;
  window.addEventListener('scroll', function () {
    clearTimeout(scrollTimer);
    scrollTimer = setTimeout(function () {
      var els = document.querySelectorAll('.reveal:not(.visible)');
      if (els.length > 0) {
        revealVisibleElements(els);
      }
    }, 80);
  }, { passive: true });

  // Backup: Check on resize (in case layout shifts)
  var resizeTimer;
  window.addEventListener('resize', function () {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(function () {
      var els = document.querySelectorAll('.reveal:not(.visible)');
      if (els.length > 0) {
        revealVisibleElements(els);
      }
    }, 200);
  }, { passive: true });

  /* ===== SMOOTH SCROLL (All browsers) ===== */
  function initSmoothScroll() {
    var anchors = document.querySelectorAll('a[href^="#"]');

    for (var i = 0; i < anchors.length; i++) {
      anchors[i].addEventListener('click', function (e) {
        var href = this.getAttribute('href');
        if (href === '#') return;

        var target = document.querySelector(href);
        if (!target) return;

        e.preventDefault();

        var targetY = target.getBoundingClientRect().top + window.pageYOffset - 80;

        if (isIOS) {
          smoothScrollTo(targetY, 600);
        } else if ('scrollBehavior' in document.documentElement.style) {
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        } else {
          smoothScrollTo(targetY, 600);
        }
      });
    }
  }

  function smoothScrollTo(targetY, duration) {
    var startY = window.pageYOffset;
    var diff = targetY - startY;
    var startTime = null;

    function step(timestamp) {
      if (!startTime) startTime = timestamp;
      var elapsed = timestamp - startTime;
      var progress = Math.min(elapsed / duration, 1);
      var eased = 1 - Math.pow(1 - progress, 3);
      window.scrollTo(0, startY + diff * eased);
      if (progress < 1) {
        requestAnimationFrame(step);
      }
    }

    requestAnimationFrame(step);
  }

  /* ===== CONTACT FORM ===== */
  function initContactForm() {
    var form = document.getElementById('contact-form');
    if (!form) return;

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var btn = form.querySelector('button[type="submit"]');
      if (!btn) return;

      var originalHTML = btn.innerHTML;
      btn.innerHTML = 'Sending...';
      btn.disabled = true;
      btn.style.opacity = '0.7';

      setTimeout(function () {
        btn.innerHTML = '✓ Message Sent!';
        btn.style.background = '#00ff88';
        btn.style.boxShadow = '0 0 40px rgba(0, 255, 136, 0.5)';

        setTimeout(function () {
          btn.innerHTML = originalHTML;
          btn.style.background = '';
          btn.style.boxShadow = '';
          btn.disabled = false;
          btn.style.opacity = '1';
          form.reset();
        }, 2500);
      }, 1500);
    });
  }

  /* ===== CUSTOM CURSOR (Desktop Only) ===== */
  function initCursor() {
    if (isTouchDevice || isIOS) return;

    var prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var isDesktop = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    if (prefersReducedMotion || !isDesktop) return;

    var dot = document.getElementById('cursor-dot');
    var ring = document.getElementById('cursor-ring');
    var glow = document.getElementById('cursor-glow');
    if (!dot || !ring || !glow) return;

    var trails = [];
    for (var t = 1; t <= 5; t++) {
      var trail = document.getElementById('trail-' + t);
      if (trail) trails.push(trail);
    }

    dot.style.display = 'block';
    ring.style.display = 'block';
    glow.style.display = 'block';
    for (var i = 0; i < trails.length; i++) trails[i].style.display = 'block';

    var mouseX = 0, mouseY = 0, dotX = 0, dotY = 0;
    var ringX = 0, ringY = 0, glowX = 0, glowY = 0;
    var isMoving = false, moveTimeout;
    var trailPositions = [];
    for (var j = 0; j < trails.length; j++) trailPositions.push({ x: 0, y: 0 });

    document.addEventListener('mousemove', function (e) {
      mouseX = e.clientX;
      mouseY = e.clientY;
      isMoving = true;
      clearTimeout(moveTimeout);
      moveTimeout = setTimeout(function () { isMoving = false; }, 100);
    }, { passive: true });

    document.addEventListener('click', function (e) {
      createBurst(e.clientX, e.clientY);
    });

    function createBurst(x, y) {
      var colors = ['#00ff88', '#ff006e', '#00d4ff'];
      for (var i = 0; i < 8; i++) {
        var p = document.createElement('div');
        p.style.cssText = 'position:fixed;width:4px;height:4px;border-radius:50%;pointer-events:none;z-index:99999;will-change:transform,opacity;';
        var c = colors[Math.floor(Math.random() * colors.length)];
        p.style.background = c;
        p.style.left = x + 'px';
        p.style.top = y + 'px';
        p.style.boxShadow = '0 0 6px ' + c;
        document.body.appendChild(p);
        var a = (Math.PI * 2 / 8) * i + Math.random() * 0.5;
        var v = 60 + Math.random() * 40;
        animP(p, x, y, x + Math.cos(a) * v, y + Math.sin(a) * v);
      }
    }

    function animP(el, sx, sy, ex, ey) {
      var st = performance.now(), d = 600;
      function tk(now) {
        var pr = Math.min((now - st) / d, 1);
        var ea = 1 - Math.pow(1 - pr, 3);
        el.style.left = sx + (ex - sx) * ea + 'px';
        el.style.top = sy + (ey - sy) * ea + 'px';
        el.style.opacity = 1 - pr;
        el.style.transform = 'scale(' + (1 - pr * 0.5) + ')';
        if (pr < 1) requestAnimationFrame(tk);
        else if (el.parentNode) el.parentNode.removeChild(el);
      }
      requestAnimationFrame(tk);
    }

    function animate() {
      dotX += (mouseX - dotX) * 0.35;
      dotY += (mouseY - dotY) * 0.35;
      dot.style.left = dotX + 'px';
      dot.style.top = dotY + 'px';

      ringX += (mouseX - ringX) * 0.15;
      ringY += (mouseY - ringY) * 0.15;
      ring.style.left = ringX + 'px';
      ring.style.top = ringY + 'px';

      glowX += (mouseX - glowX) * 0.08;
      glowY += (mouseY - glowY) * 0.08;
      glow.style.left = glowX + 'px';
      glow.style.top = glowY + 'px';

      for (var i = 0; i < trails.length; i++) {
        var tg = i === 0 ? { x: dotX, y: dotY } : trailPositions[i - 1];
        var sp = 0.2 - i * 0.03;
        trailPositions[i].x += (tg.x - trailPositions[i].x) * sp;
        trailPositions[i].y += (tg.y - trailPositions[i].y) * sp;
        trails[i].style.left = trailPositions[i].x + 'px';
        trails[i].style.top = trailPositions[i].y + 'px';
        if (isMoving) {
          var to = 0.4 - i * 0.07, ts = 5 - i;
          trails[i].style.opacity = to;
          trails[i].style.width = ts + 'px';
          trails[i].style.height = ts + 'px';
          trails[i].style.background = i % 2 === 0 ? 'rgba(0,255,136,.6)' : 'rgba(0,212,255,.6)';
          trails[i].style.boxShadow = '0 0 ' + (ts + 2) + 'px ' + trails[i].style.background;
        } else {
          trails[i].style.opacity = 0;
        }
      }

      var dx = mouseX - ringX, dy = mouseY - ringY;
      var sp2 = Math.sqrt(dx * dx + dy * dy);
      var sk = Math.min(sp2 * 0.3, 15);
      var an = Math.atan2(dy, dx) * (180 / Math.PI);
      var rt = 'translate(-50%,-50%) rotate(' + an + 'deg) scaleX(' + (1 + sk * 0.01) + ') translateZ(0)';
      ring.style.webkitTransform = rt;
      ring.style.transform = rt;

      requestAnimationFrame(animate);
    }
    requestAnimationFrame(animate);

    // Hover
    var hoverEls = document.querySelectorAll('a,button,.service-card,.case-card,.result-card,.cert-card,.social-icon,.tech-item,.btn-primary,.btn-secondary,.magnetic-target');
    for (var h = 0; h < hoverEls.length; h++) {
      hoverEls[h].addEventListener('mouseenter', function () {
        dot.classList.add('cursor-hover');
        ring.classList.add('cursor-hover');
      });
      hoverEls[h].addEventListener('mouseleave', function () {
        dot.classList.remove('cursor-hover');
        ring.classList.remove('cursor-hover');
      });
    }

    // Text cursor
    var textEls = document.querySelectorAll('input,textarea');
    for (var tt = 0; tt < textEls.length; tt++) {
      textEls[tt].addEventListener('mouseenter', function () {
        dot.classList.add('cursor-text');
        ring.classList.add('cursor-text');
        dot.classList.remove('cursor-hover');
        ring.classList.remove('cursor-hover');
      });
      textEls[tt].addEventListener('mouseleave', function () {
        dot.classList.remove('cursor-text');
        ring.classList.remove('cursor-text');
      });
    }

    // Magnetic
    var magEls = document.querySelectorAll('.magnetic-target');
    for (var m = 0; m < magEls.length; m++) {
      magEls[m].addEventListener('mousemove', function (e) {
        var r = this.getBoundingClientRect();
        var t = 'translate(' + ((e.clientX - r.left - r.width / 2) * 0.2) + 'px,' + ((e.clientY - r.top - r.height / 2) * 0.2) + 'px)';
        this.style.webkitTransform = t;
        this.style.transform = t;
      });
      magEls[m].addEventListener('mouseleave', function () {
        this.style.webkitTransform = '';
        this.style.transform = '';
      });
    }

    // Hide/show cursor
    document.addEventListener('mouseleave', function () {
      dot.classList.add('cursor-hidden');
      ring.classList.add('cursor-hidden');
      glow.style.opacity = '0';
    });
    document.addEventListener('mouseenter', function () {
      dot.classList.remove('cursor-hidden');
      ring.classList.remove('cursor-hidden');
      glow.style.opacity = '1';
    });
  }
})();
