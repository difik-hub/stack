/* Cookie-выбор: одна плашка на все страницы. Ответ хранится в браузере.
   Статистику грузим только при «Принять» — счётчика пока нет, поэтому
   выбор сейчас просто запоминается (точка подключения — ниже, в согласии). */
(function () {
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
    '<p>Используем cookies, чтобы запоминать ваш выбор и считать посещения. ' +
    '<a href="/cookies">Подробнее</a></p>' +
    '<div class="ck-b">' +
      '<button type="button" data-a="' + NO + '">Только необходимые</button>' +
      '<button type="button" class="ck-yes" data-a="' + YES + '">Принять</button>' +
    '</div>';

  el.addEventListener('click', function (e) {
    var b = e.target.closest('button[data-a]');
    if (!b) return;
    try { localStorage.setItem(KEY, b.getAttribute('data-a')); } catch (_) {}
    el.remove();
    // согласие на статистику: сюда подключить счётчик, когда он появится
  });

  document.body.appendChild(el);
})();

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
