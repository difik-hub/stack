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
