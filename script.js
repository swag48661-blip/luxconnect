/* ============================================================
   Lux.connect — interactions
   ============================================================ */
(function () {
  'use strict';

  var $  = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };

  /* ---------- прогресс, шапка, кнопки ---------- */
  var nav = $('#nav');
  var bar = $('#progressBar');
  var toTop = $('#scrollTop');
  var mobileCta = $('#mobileCta');

  function onScroll() {
    var y = window.scrollY || document.documentElement.scrollTop;
    var h = document.documentElement.scrollHeight - window.innerHeight;

    if (bar) bar.style.width = (h > 0 ? (y / h) * 100 : 0) + '%';
    if (nav) nav.classList.toggle('scrolled', y > 24);
    if (toTop) toTop.classList.toggle('is-visible', y > 700);
    if (mobileCta) mobileCta.classList.toggle('is-visible', y > 500);
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------- мобильное меню ---------- */
  var burger = $('#navBurger');
  var links = $('#navLinks');

  function closeMenu() {
    if (!burger || !links) return;
    burger.classList.remove('is-open');
    links.classList.remove('is-open');
    burger.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }

  if (burger && links) {
    burger.addEventListener('click', function () {
      var open = !links.classList.contains('is-open');
      burger.classList.toggle('is-open', open);
      links.classList.toggle('is-open', open);
      burger.setAttribute('aria-expanded', String(open));
      document.body.style.overflow = open ? 'hidden' : '';
    });
    $$('.nav__link', links).forEach(function (a) { a.addEventListener('click', closeMenu); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeMenu(); });
  }

  /* ---------- плавный скролл с учётом липкой шапки ---------- */
  $$('a[href^="#"]').forEach(function (link) {
    link.addEventListener('click', function (e) {
      var id = this.getAttribute('href');
      if (!id || id === '#') return;
      var target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      var top = target.getBoundingClientRect().top + window.scrollY - 88;
      window.scrollTo({ top: top, behavior: 'smooth' });
      /* на file:// браузер может запретить правку истории — не критично */
      try { history.replaceState(null, '', id); } catch (err) { /* игнорируем */ }
    });
  });

  /* ---------- появление блоков ---------- */
  var anims = $$('.anim');

  function reveal(el) {
    if (el.classList.contains('is-visible')) return;
    el.classList.add('is-visible');
  }

  function revealInView() {
    anims.forEach(function (el) {
      if (el.classList.contains('is-visible')) return;
      var r = el.getBoundingClientRect();
      if (r.top < window.innerHeight - 30 && r.bottom > -30) reveal(el);
    });
  }

  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { reveal(en.target); io.unobserve(en.target); }
      });
    }, { threshold: 0.08, rootMargin: '0px 0px -50px 0px' });
    anims.forEach(function (el) { io.observe(el); });
  } else {
    anims.forEach(reveal);
  }

  /* страховка на случай, если observer не сработал */
  var ticking = false;
  window.addEventListener('scroll', function () {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(function () { ticking = false; revealInView(); });
  }, { passive: true });

  window.addEventListener('load', revealInView);
  window.addEventListener('resize', revealInView);

  /* страховочная сетка: даже если observer заглох — блоки всё равно появятся */
  var netTimer = setInterval(revealInView, 900);
  setTimeout(function () { clearInterval(netTimer); revealInView(); }, 12000);

  /* ---------- активный пункт меню ---------- */
  var sections = $$('main section[id]');
  var navAnchors = $$('.nav__link[href^="#"]');
  if (sections.length && navAnchors.length && 'IntersectionObserver' in window) {
    var sio = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        var id = '#' + en.target.id;
        navAnchors.forEach(function (a) {
          a.classList.toggle('is-active', a.getAttribute('href') === id);
        });
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    sections.forEach(function (s) { sio.observe(s); });
  }

  /* ---------- аккордеон ---------- */
  $$('.acc').forEach(function (item) {
    var q = $('.acc__q', item);
    var a = $('.acc__a', item);
    if (!q || !a) return;
    q.addEventListener('click', function () {
      var isOpen = item.classList.contains('is-open');
      $$('.acc').forEach(function (other) {
        other.classList.remove('is-open');
        var oa = $('.acc__a', other);
        var oq = $('.acc__q', other);
        if (oa) oa.style.maxHeight = '0px';
        if (oq) oq.setAttribute('aria-expanded', 'false');
      });
      if (!isOpen) {
        item.classList.add('is-open');
        a.style.maxHeight = a.scrollHeight + 'px';
        q.setAttribute('aria-expanded', 'true');
      }
    });
  });

  /* ---------- фильтр работ ---------- */
  var chips = $$('.chip[data-filter]');
  var cards = $$('#portfolioGrid .pcard');
  if (chips.length && cards.length) {
    chips.forEach(function (chip) {
      chip.addEventListener('click', function () {
        var f = chip.getAttribute('data-filter');
        chips.forEach(function (c) { c.classList.toggle('chip--active', c === chip); });

        cards.forEach(function (card) {
          var show = f === 'all' || card.getAttribute('data-cat') === f;
          card.style.transition = 'opacity 0.22s ease, transform 0.22s ease';

          if (show) {
            card.classList.remove('is-hidden');
            card.style.opacity = '';
            card.style.transform = '';
          } else {
            card.style.opacity = '0';
            card.style.transform = 'scale(0.98)';
            setTimeout(function () {
              card.classList.add('is-hidden');
              card.style.opacity = '';
              card.style.transform = '';
            }, 220);
          }
        });
      });
    });
  }

  /* ---------- всплывающая подсказка ---------- */
  var toastEl = $('#toast');
  var toastTimer;
  function toast(text) {
    if (!toastEl) return;
    clearTimeout(toastTimer);
    toastEl.textContent = text;
    toastEl.classList.add('is-visible');
    toastTimer = setTimeout(function () { toastEl.classList.remove('is-visible'); }, 4000);
  }

  /* ---------- форма → Telegram ---------- */
  var form = $('#contactForm');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var name = ($('#name') || {}).value || '';
      var tg = ($('#telegram') || {}).value || '';
      var project = ($('#project') || {}).value || '';

      if (!name.trim() || !tg.trim() || !project.trim()) {
        toast('Заполните все поля');
        return;
      }

      var text = 'Заявка с Lux.connect\n\n' +
                 'Имя: ' + name.trim() + '\n' +
                 'Telegram: ' + tg.trim() + '\n' +
                 'Задача:\n' + project.trim();

      window.open('https://t.me/userquack?text=' + encodeURIComponent(text), '_blank');
      toast('Открываем Telegram — отправьте сообщение');
      form.reset();
    });
  }

  /* ---------- наверх ---------- */
  if (toTop) {
    toTop.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

})();
