"use strict";
/* ─────────────────────────────────────────────────────────────
   Stack. Лендинг студии.
   Бекенда нет и не нужно: заявка собирается в письмо, а на случай
   когда почтовая программа не настроена, текст можно скопировать.
   ───────────────────────────────────────────────────────────── */

/* ▼▼▼ ЕДИНСТВЕННОЕ МЕСТО, КОТОРОЕ НАДО ПОМЕНЯТЬ ПОД СЕБЯ ▼▼▼
   Почта, на которую приходят заявки. Телеграм оставь пустым,
   если не хочешь показывать: тогда ссылка на него просто не появится. */
const CONTACT = {
  mail: 'sandrakaran@onet.pl',
  tg:   ''            // например 'stack_studio', без собаки
};
/* ▲▲▲ дальше менять ничего не нужно ▲▲▲ */

const $ = id => document.getElementById(id);
const esc = s => String(s).replace(/[&<>"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));

/* ── работы: десять штук, ровно под десять ячеек сетки ──
   Ниже innerHTML получает только этот массив, зашитый в файл.
   Пользовательский ввод сюда не попадает, значения всё равно
   прогоняются через esc(). Ввод из формы нигде не вставляется в DOM. */
const WORKS = [
  ['02-coffee-zerno', 'ЗЕРНО', 'магазин кофейной обжарки', [
    'Интернет-магазин маленькой обжарки. Половина покупателей не знает, какое зерно им нужно, поэтому каталог начинается с вопроса «чем вы завариваете дома». Нажали «турка», и остались только подходящие сорта.',
    'У каждой пачки цена и кнопка, ничего не спрятано в переписку. Отдельным блоком стоит дата обжарки: для человека, который выбирает кофе, это главный аргумент свежести.']],
  ['10-kopilka-fintech', 'КОПИЛКА', 'экран личных финансов', [
    'Сервис про деньги: сколько пришло, сколько ушло и куда именно. Вёрстка построена вокруг цифр, поэтому шрифт с табличными знаками и много воздуха, чтобы суммы читались с одного взгляда.',
    'График здесь не украшение: по нему видно просадку месяца. Тёмных дашбордов со свечением нет сознательно, это продукт про спокойствие, а не про казино.']],
  ['08-codoo-kids', 'CODOO', 'школа кода для детей', [
    'Школа программирования для детей от 8 до 14. Родитель должен за минуту понять три вещи: чему научат, кто ведёт и сколько это стоит. Отсюда прямая структура: программа по возрастам, преподаватели с лицами, цена без звёздочек.',
    'Цвета яркие, но без клоунады: платит всё-таки взрослый.']],
  ['09-tseh-burger', 'ЦЕХ', 'меню бургерной', [
    'Бургерная. Меню свёрстано как витрина: фото, состав, цена, кнопка. Ни одного «уточняйте у оператора».',
    'Акции собраны в один блок, а не размазаны по странице. Заказ уходит в мессенджер, потому что своей доставки у заведения нет, и притворяться, что она есть, макет не стал.']],
  ['04-dental-myata', 'МЯТА', 'стоматология с ценами', [
    'Стоматология. Люди боятся двух вещей: боли и счёта, который вырастет после приёма. Поэтому цены стоят прямо на странице, по каждой услуге.',
    'Запись в два поля, имя и телефон, остальное спросит администратор по звонку. Тон спокойный, без стоковых улыбок в халатах.']],
  ['05-salon-ton', 'ТОН', 'салон окрашивания', [
    'Салон окрашивания. Главный блок: шкала оттенков, собранная из реальных прядей: клиентка выбирает тон дома, а не сидя в кресле под лампой.',
    'Дальше цены по длине волос и мастера с их работами. Кнопка записи держится под рукой на любом экране.']],
  ['12-nocturne-deco', 'НОКТЮРН', 'вечерняя карта бара', [
    'Бар. Задача обратная обычной: не разложить всё по полочкам, а создать настроение, в котором хочется забронировать стол на вечер.',
    'Тёмная страница, крупная типографика, коктейли поданы как афиши. Бронь одной строкой, без анкеты на десять полей.']],
  ['03-gym-kuznya', 'КУЗНЯ', 'зал и расписание', [
    'Тренажёрный зал с жёстким характером. Расписание: то, ради чего люди вообще открывают сайт зала, поэтому оно стоит вторым экраном, а не в подвале.',
    'Тренеры подписаны настоящими регалиями вместо «мастер спорта по всему». Абонементы без мелкого шрифта и звёздочек.']],
  ['06-flora-botanical', 'ФЛОРА', 'магазин растений', [
    'Магазин растений, свёрстанный в духе старых ботанических атласов: иллюстрации, номера видов, спокойная сетка.',
    'Каждая карточка отвечает на главный вопрос покупателя «выживет ли оно у меня»: сколько света, как поливать, насколько капризное. И да, это каталог без единой стоковой фотографии.']],
  ['07-meridian-swiss', 'МЕРИДИАН', 'юридическое бюро', [
    'Юридическое бюро. Никаких картинок: текст, сетка, цифры. Практики, дела, сроки.',
    'Для юристов такой аскетизм работает на доверие, красивости здесь скорее вредят. Самая строгая работа в подборке, и этим она и хороша.']],
];

$('wgrid').innerHTML = WORKS.map(([slug, name, about], i) => `
  <figure class="w rv" role="button" tabindex="0" data-i="${i}"
          aria-haspopup="dialog" aria-label="Открыть макет ${esc(name)} целиком">
    <span class="ph"><img src="assets/img/${slug}.jpg" width="1140" height="760"
      alt="Макет сайта ${esc(name)}: ${esc(about)}" loading="lazy" decoding="async"></span>
    <figcaption class="cap"><b>${esc(name)}</b><span>${esc(about)}</span></figcaption>
  </figure>`).join('');

/* ── контакты подставляем в разметку, чтобы адрес лежал в одном месте ── */
(() => {
  const href = 'mailto:' + CONTACT.mail;
  ['mailLink', 'mailFoot'].forEach(id => {
    const a = $(id);
    if (!a) return;
    a.href = href;
    a.textContent = CONTACT.mail;
  });
  if (CONTACT.tg) {
    const box = $('mailFoot');
    const tg = document.createElement('a');
    tg.className = 'mail';
    tg.style.marginLeft = '14px';
    tg.href = 'https://t.me/' + CONTACT.tg;
    tg.target = '_blank';
    tg.rel = 'noopener';
    tg.textContent = '@' + CONTACT.tg;
    box.after(tg);
  }
})();

/* ── проявление при прокрутке. Одно движение, и у него есть смысл:
      блоки входят по порядку чтения. Слушателя на scroll нет. ── */
if (matchMedia('(prefers-reduced-motion: reduce)').matches) {
  document.querySelectorAll('.rv').forEach(e => e.classList.add('seen'));
} else {
  const io = new IntersectionObserver((entries) => {
    entries.forEach(en => {
      if (!en.isIntersecting) return;
      en.target.classList.add('seen');
      io.unobserve(en.target);
    });
  }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
  document.querySelectorAll('.rv').forEach(e => io.observe(e));
}

/* ── отзывы ──
   Пусто, потому что настоящих отзывов пока нет, а выдуманные проверяются
   одним звонком: Алматы город небольшой. Появится первый, добавляем
   строку сюда, и секция сама заменит блок гарантий на цитаты. */
const REVIEWS = [
  // {текст: 'Собрали каталог за неделю, заявки пошли сразу.', кто: 'Азамат, мебельный цех, Алматы'},
];

if (REVIEWS.length) {
  $('trustH').textContent = 'Что говорят заказчики';
  $('trustP').textContent = 'Каждый отзыв оставлен человеком, для которого мы сделали работу.';
  $('guards').innerHTML = REVIEWS.map(r =>
    `<div class="gd rev"><q>${esc(r.текст)}</q><cite>${esc(r.кто)}</cite></div>`).join('');
  // сетка под число отзывов, чтобы не оставалось пустых клеток
  $('guards').style.gridTemplateColumns = `repeat(${Math.min(REVIEWS.length, 3)},minmax(0,1fr))`;
}

/* ── заявка ── */
const F = {
  name:    { el: $('fName'),    fld: null, test: v => v.trim().length >= 2 },
  contact: { el: $('fContact'), fld: null, test: v => /@/.test(v) && v.trim().length >= 5 },
  task:    { el: $('fTask'),    fld: null, test: v => v.trim().length >= 8 },
};
Object.values(F).forEach(f => {
  f.fld = f.el.closest('.fld');
  // ошибку снимаем как только человек начал исправлять, а не по повторной отправке
  f.el.addEventListener('input', () => f.fld.classList.remove('bad'));
});

function validate() {
  let firstBad = null;
  Object.values(F).forEach(f => {
    const ok = f.test(f.el.value);
    f.fld.classList.toggle('bad', !ok);
    if (!ok && !firstBad) firstBad = f.el;
  });
  if (firstBad) firstBad.focus();
  return !firstBad;
}

function letter() {
  return [
    'Заявка с сайта Stack',
    '',
    'Имя: ' + F.name.el.value.trim(),
    'Связь: ' + F.contact.el.value.trim(),
    'Что нужно: ' + $('fType').value,
    'Бюджет: ' + $('fBudget').value,
    '',
    'Задача:',
    F.task.el.value.trim()
  ].join('\n');
}

$('reqForm').addEventListener('submit', e => {
  e.preventDefault();
  if (!validate()) return;

  const body = letter();
  $('okText').value = body;
  $('okBox').hidden = false;
  $('fNote').textContent = 'Заявка собрана ниже';

  // mailto может не сработать, если почтовая программа не настроена,
  // поэтому текст уже лежит рядом и его видно без ожидания
  const url = 'mailto:' + CONTACT.mail
            + '?subject=' + encodeURIComponent('Заявка с сайта Stack')
            + '&body=' + encodeURIComponent(body);
  if (url.length < 1900) location.href = url;

  $('okBox').scrollIntoView({ block: 'nearest', behavior: 'smooth' });
});

$('copyBtn').addEventListener('click', async () => {
  const btn = $('copyBtn'), t = $('okText');
  try {
    await navigator.clipboard.writeText(t.value);
    btn.textContent = 'Скопировано';
  } catch (err) {
    t.select();                       // clipboard недоступен без https, оставляем выделение
    btn.textContent = 'Текст выделен, нажмите Ctrl+C';
  }
  setTimeout(() => { btn.textContent = 'Скопировать текст'; }, 2600);
});

/* ── просмотр работы: макет целиком и рассказ о нём ── */
const viewer = $('viewer');
let lastFocus = null;
function openWork(i) {
  const [slug, name, sphere, story] = WORKS[i];
  $('vName').textContent = name;
  $('vSphere').textContent = sphere;
  $('vStory').innerHTML = story.map(t => '<p>' + esc(t) + '</p>').join('');
  // полный макет грузится только при открытии, в сетке лежат лёгкие обложки
  $('vShot').innerHTML = '<img src="assets/img/full/' + slug + '.jpg" alt="Макет ' +
    esc(name) + ' во всю длину страницы" decoding="async">';
  lastFocus = document.activeElement;
  viewer.hidden = false;
  document.body.style.overflow = 'hidden';
  $('vX').focus();
}
function closeWork() {
  viewer.hidden = true;
  $('vShot').innerHTML = '';
  document.body.style.overflow = '';
  if (lastFocus) lastFocus.focus();
}
$('wgrid').addEventListener('click', e => {
  const card = e.target.closest('.w');
  if (card) openWork(+card.dataset.i);
});
$('wgrid').addEventListener('keydown', e => {
  if (e.key !== 'Enter' && e.key !== ' ') return;
  const card = e.target.closest('.w');
  if (card) { e.preventDefault(); openWork(+card.dataset.i); }
});
$('vX').addEventListener('click', closeWork);
viewer.addEventListener('click', e => { if (e.target === viewer) closeWork(); });
$('vAsk').addEventListener('click', closeWork);
addEventListener('keydown', e => { if (e.key === 'Escape' && !viewer.hidden) closeWork(); });

/* ── заставка на входе: при каждом заходе, уходит по нажатию, медленно и с затуханием ── */
(() => {
  const sp = $('splash');
  if (location.search.includes('selftest')) { sp.remove(); return; }
  sp.hidden = false;
  requestAnimationFrame(() => requestAnimationFrame(() => sp.classList.add('in')));
  let gone = false;
  function close() {
    if (gone) return; gone = true;
    sp.classList.add('out');
    setTimeout(() => sp.remove(), 1700);
    removeEventListener('keydown', onKey);
  }
  function onKey(e) { if (e.key === 'Escape' || e.key === 'Enter') close(); }
  sp.addEventListener('click', close);
  addEventListener('keydown', onKey);
})();

/* ── лента работ: колесо мыши листает её вбок по всей секции ──
   Колесо вверх уводит карточки вправо, вниз влево. Прокрутка идёт
   плавно через кадры, а не рывком. deltaMode учитывается: часть
   браузеров шлёт колесо строками, а не пикселями. */
(() => {
  const strip = $('wgrid');
  const zone = strip;
  let target = 0, running = false;
  function step() {
    const d = target - strip.scrollLeft;
    if (Math.abs(d) < 1) { strip.scrollLeft = target; running = false; return; }
    strip.scrollLeft += d * 0.16;
    requestAnimationFrame(step);
  }
  zone.addEventListener('wheel', e => {
    if (e.shiftKey || e.ctrlKey) return;
    const max = strip.scrollWidth - strip.clientWidth;
    if (max <= 0) return;
    const px = e.deltaY * (e.deltaMode === 1 ? 40 : e.deltaMode === 2 ? strip.clientWidth : 1);
    const next = Math.max(0, Math.min(max, (running ? target : strip.scrollLeft) + px * 1.6));
    // лента кончилась, отдаём колесо странице, чтобы не запирать прокрутку
    if (next === target && (next === 0 || next === max)) return;
    e.preventDefault();
    target = next;
    if (!running) { running = true; requestAnimationFrame(step); }
  }, { passive: false });
})();

/* Самопроверка проверок формы и полноты сетки: ?selftest в адресе. */
if (location.search.includes('selftest')) {
  const t = [];
  const eq = (n, got, exp) => t.push({ тест: n, получено: got, ждали: exp, ок: got === exp });
  eq('имя из одной буквы не проходит', F.name.test('А'), false);
  eq('имя из двух букв проходит', F.name.test('Ян'), true);
  eq('контакт без собаки не проходит', F.contact.test('телеграм'), false);
  eq('почта проходит', F.contact.test('a@b.ru'), true);
  eq('телеграм через собаку проходит', F.contact.test('@stack_studio'), true);
  eq('пустая задача не проходит', F.task.test('   '), false);
  eq('задача из восьми знаков проходит', F.task.test('нужен сайт'), true);
  eq('работ ровно десять', WORKS.length, 10);
  eq('ячеек сетки столько же', document.querySelectorAll('.w').length, WORKS.length);
  eq('у каждой работы своё имя', new Set(WORKS.map(w => w[1])).size, WORKS.length);
  eq('у каждой работы есть рассказ', WORKS.every(w => Array.isArray(w[3]) && w[3].length >= 2), true);
  openWork(0);
  eq('просмотр открывается', viewer.hidden, false);
  eq('в просмотре имя работы', $('vName').textContent, WORKS[0][1]);
  eq('полный макет подставлен', $('vShot').innerHTML.includes('full/02-coffee-zerno'), true);
  closeWork();
  eq('просмотр закрывается', viewer.hidden, true);
  eq('картинка выгружена при закрытии', $('vShot').innerHTML, '');
  eq('стили просмотра подключены', getComputedStyle(viewer).position, 'fixed');
  eq('стили заставки подключены', true, !!Array.from(document.styleSheets).length);
  window.SELFTEST = t;
  console.log('selftest', t.every(x => x.ок) ? 'пройден' : 'ПРОВАЛЕН', t);
}
