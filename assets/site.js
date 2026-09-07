/* Общий скрипт сайта: cookie-плашка. Остальная логика — в страницах. */
(function () {
  var KEY = 'stack-cookies-ok';
  try { if (localStorage.getItem(KEY)) return; } catch (e) { return; }
  var el = document.createElement('div');
  el.className = 'ck';
  el.setAttribute('role', 'dialog');
  el.setAttribute('aria-label', 'Cookies');
  el.innerHTML = '<p>Сайт использует cookies, чтобы запоминать ваш выбор и считать посещения. <a href="/cookies">Подробнее</a></p><button type="button">Понятно</button>';
  el.querySelector('button').addEventListener('click', function () {
    try { localStorage.setItem(KEY, '1'); } catch (e) {}
    el.remove();
  });
  document.body.appendChild(el);
})();
