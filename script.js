(function() {
  'use strict';

  // ========== NAV SCROLL ==========
  const nav = document.getElementById('nav');
  let lastScroll = 0;

  function onScroll() {
    const y = window.scrollY;
    if (y > 50) {
      nav.classList.add('scrolled');
    } else {
      nav.classList.remove('scrolled');
    }
    lastScroll = y;
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // ========== MOBILE MENU ==========
  const burger = document.getElementById('navBurger');
  const navLinks = document.getElementById('navLinks');

  if (burger && navLinks) {
    burger.addEventListener('click', function() {
      burger.classList.toggle('active');
      navLinks.classList.toggle('open');
      document.body.style.overflow = navLinks.classList.contains('open') ? 'hidden' : '';
    });

    navLinks.querySelectorAll('.nav__link').forEach(function(link) {
      link.addEventListener('click', function() {
        burger.classList.remove('active');
        navLinks.classList.remove('open');
        document.body.style.overflow = '';
      });
    });
  }

  // ========== SCROLL ANIMATIONS ==========
  var animEls = document.querySelectorAll('.anim');
  if ('IntersectionObserver' in window) {
    var observer = new IntersectionObserver(function(entries) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

    animEls.forEach(function(el) { observer.observe(el); });
  } else {
    animEls.forEach(function(el) { el.classList.add('visible'); });
  }

  // ========== COUNTER ANIMATION ==========
  var counters = document.querySelectorAll('[data-count]');
  if (counters.length && 'IntersectionObserver' in window) {
    var counterObserver = new IntersectionObserver(function(entries) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          counterObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });

    counters.forEach(function(el) { counterObserver.observe(el); });
  }

  function animateCounter(el) {
    var target = parseInt(el.getAttribute('data-count'), 10);
    var duration = 1500;
    var start = performance.now();

    function step(now) {
      var progress = Math.min((now - start) / duration, 1);
      var eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.floor(eased * target);
      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        el.textContent = target;
      }
    }

    requestAnimationFrame(step);
  }

  // ========== SMOOTH SCROLL FOR ANCHOR LINKS ==========
  document.querySelectorAll('a[href^="#"]').forEach(function(link) {
    link.addEventListener('click', function(e) {
      var target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        var offset = 80;
        var top = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top: top, behavior: 'smooth' });
      }
    });
  });

  // ========== CONTACT FORM ==========
  var form = document.getElementById('contactForm');
  if (form) {
    form.addEventListener('submit', function(e) {
      e.preventDefault();
      var name = document.getElementById('name').value.trim();
      var telegram = document.getElementById('telegram').value.trim();
      var project = document.getElementById('project').value.trim();

      if (!name || !telegram || !project) {
        showToast('Заполните все поля');
        return;
      }

      var msg = 'Заявка с Lux.connect\n\nИмя: ' + name + '\nTelegram: ' + telegram + '\nПроект:\n' + project;
      var url = 'https://t.me/userquack?text=' + encodeURIComponent(msg);
      window.open(url, '_blank');
      showToast('Открой Telegram и отправь сообщение');
      form.reset();
    });
  }

  // ========== TOAST ==========
  var toastEl = document.getElementById('toast');
  var toastTimeout;

  function showToast(msg) {
    if (!toastEl) return;
    clearTimeout(toastTimeout);
    toastEl.textContent = msg;
    toastEl.classList.add('show');
    toastTimeout = setTimeout(function() {
      toastEl.classList.remove('show');
    }, 3500);
  }

  // ========== ACTIVE NAV LINK ON SCROLL ==========
  var sections = document.querySelectorAll('section[id]');
  var navLinksAll = document.querySelectorAll('.nav__link[href^="#"]');

  function updateActiveLink() {
    var scrollPos = window.scrollY + 120;
    sections.forEach(function(section) {
      var top = section.offsetTop;
      var height = section.offsetHeight;
      var id = section.getAttribute('id');
      if (scrollPos >= top && scrollPos < top + height) {
        navLinksAll.forEach(function(link) {
          link.style.color = '';
          if (link.getAttribute('href') === '#' + id) {
            link.style.color = 'var(--gold)';
          }
        });
      }
    });
  }

  window.addEventListener('scroll', updateActiveLink, { passive: true });
  updateActiveLink();

  // ========== CURSOR GLOW TRACKING ==========
  var glowCards = document.querySelectorAll('.service-card, .price-card, .review-card, .portfolio-card, .contact__channel');
  glowCards.forEach(function(card) {
    card.addEventListener('mousemove', function(e) {
      var rect = card.getBoundingClientRect();
      var x = e.clientX - rect.left;
      var y = e.clientY - rect.top;
      card.style.setProperty('--mx', x + 'px');
      card.style.setProperty('--my', y + 'px');
    });
  });

  // ========== PHONE MOCKUP ANIMATION ==========
  var phoneMsg1 = document.getElementById('phoneMsg1');
  var phoneReply1 = document.getElementById('phoneReply1');
  var phoneTyping = document.getElementById('phoneTyping');
  var phoneReply2 = document.getElementById('phoneReply2');

  if (phoneMsg1) {
    phoneMsg1.addEventListener('click', function() {
      phoneMsg1.style.pointerEvents = 'none';
      phoneMsg1.style.opacity = '0.6';

      setTimeout(function() {
        phoneReply1.style.display = '';
        phoneReply1.style.opacity = '0';
        phoneReply1.style.transform = 'translateY(8px)';
        requestAnimationFrame(function() {
          phoneReply1.style.transition = 'all 0.3s ease';
          phoneReply1.style.opacity = '1';
          phoneReply1.style.transform = 'translateY(0)';
        });
      }, 400);

      setTimeout(function() {
        phoneTyping.style.display = '';
        phoneTyping.style.opacity = '0';
        phoneTyping.style.transform = 'translateY(8px)';
        requestAnimationFrame(function() {
          phoneTyping.style.transition = 'all 0.3s ease';
          phoneTyping.style.opacity = '1';
          phoneTyping.style.transform = 'translateY(0)';
        });
      }, 1800);

      setTimeout(function() {
        phoneReply2.style.display = '';
        phoneReply2.style.opacity = '0';
        phoneReply2.style.transform = 'translateY(8px)';
        requestAnimationFrame(function() {
          phoneReply2.style.transition = 'all 0.3s ease';
          phoneReply2.style.opacity = '1';
          phoneReply2.style.transform = 'translateY(0)';
        });
      }, 3000);
    });
  }

})();
