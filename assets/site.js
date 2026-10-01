/* Cookie-выбор: одна плашка на все страницы. Ответ хранится в браузере.
   Статистику грузим только при «Принять»; выбор сохраняется в браузере. */
(function () {
  var COUNTER = 113269785;
  function initAnalytics() {
    if (window.__stackMetrikaLoaded) return;
    window.__stackMetrikaLoaded = true;
    window.ym = window.ym || function () { (window.ym.a = window.ym.a || []).push(arguments); };
    window.ym.l = window.ym.l || +new Date();
    var script = document.createElement('script');
    script.async = true;
    script.src = 'https://mc.yandex.ru/metrika/tag.js';
    document.head.appendChild(script);
    window.ym(COUNTER, 'init', { clickmap: true, trackLinks: true, accurateTrackBounce: true, webvisor: false });
  }
  window.stackInitAnalytics = initAnalytics;
  try { if (localStorage.getItem('stack-cookies') === 'all') initAnalytics(); } catch (e) {}

  try {
    var campaignKeys = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term'];
    var campaignParams = new URLSearchParams(location.search);
    var campaign = campaignKeys.map(function (key) { return campaignParams.get(key) ? key + '=' + campaignParams.get(key) : ''; }).filter(Boolean).join('; ');
    if (campaign) sessionStorage.setItem('stack-campaign', campaign);
  } catch (e) {}

  var KEY = 'stack-cookies';
  var YES = 'all', NO = 'necessary';
  var saved = null;

  try { saved = localStorage.getItem(KEY); } catch (e) { return; }  // хранилище закрыто — не мешаем
  if (saved === YES || saved === NO) return;                        // выбор уже сделан

  var el = document.createElement('div');
  el.className = 'ck';
  el.setAttribute('role', 'dialog');
  el.setAttribute('aria-label', 'Использование cookies');
  el.innerHTML =
    '<p>Используем cookies для статистики. <a href="/cookies">Подробнее</a></p>' +
    '<div class="ck-b">' +
      '<button type="button" data-a="' + NO + '">Только необходимые</button>' +
      '<button type="button" class="ck-yes" data-a="' + YES + '">Принять</button>' +
    '</div>';

  el.addEventListener('click', function (e) {
    var b = e.target.closest('button[data-a]');
    if (!b) return;
    try { localStorage.setItem(KEY, b.getAttribute('data-a')); } catch (_) {}
    el.remove();
    document.documentElement.classList.remove('ck-on');
    if (b.getAttribute('data-a') === YES && window.stackInitAnalytics) window.stackInitAnalytics();
  });

  document.documentElement.classList.add('ck-on');
  document.body.appendChild(el);
})();

document.addEventListener('click', function (e) {
  var link = e.target.closest('a[href*="t.me/"]');
  if (link && window.ym && window.__stackMetrikaLoaded) window.ym(113269785, 'reachGoal', 'telegram_click');
});

/* Шапка на телефоне: едет вместе со страницей, прячется при скролле вниз и
   возвращается при скролле вверх. Бургер открывает разделы панелью под шапкой. */
(function () {
  var hdr = document.querySelector('.hdr');
  if (!hdr) return;
  var nav = hdr.querySelector('.nav'), btn = hdr.querySelector('.burger');

  function close() {
    if (!nav) return;
    nav.classList.remove('open');
    if (btn) btn.setAttribute('aria-expanded', 'false');
  }

  if (btn && nav) {
    btn.addEventListener('click', function () {
      var open = nav.classList.toggle('open');
      btn.setAttribute('aria-expanded', open ? 'true' : 'false');
      if (open) hdr.classList.remove('up');
    });
    nav.addEventListener('click', function (e) { if (e.target.closest('a')) close(); });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && nav.classList.contains('open')) { close(); btn.focus(); }
    });
  }

  var last = window.scrollY, waiting = false;
  window.addEventListener('scroll', function () {
    if (waiting) return;
    waiting = true;
    requestAnimationFrame(function () {
      var y = window.scrollY;
      if (!(nav && nav.classList.contains('open'))) {
        if (y > last && y > 140) hdr.classList.add('up'); else hdr.classList.remove('up');
      }
      last = y;
      waiting = false;
    });
  }, { passive: true });
})();
