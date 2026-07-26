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
  mail: 'nikitakovalev2604@gmail.com',
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
  ['02-coffee-zerno',    'ЗЕРНО',     'кофейная обжарка, каталог с подбором по способу заваривания'],
  ['10-kopilka-fintech', 'КОПИЛКА',   'финансовый сервис, цифры и графики'],
  ['08-codoo-kids',      'CODOO',     'школа программирования для детей'],
  ['09-tseh-burger',     'ЦЕХ',       'бургерная, меню с составом и ценой'],
  ['04-dental-myata',    'МЯТА',      'стоматология, цены сразу и запись в два поля'],
  ['05-salon-ton',       'ТОН',       'салон красоты, подбор оттенка по шкале прядей'],
  ['12-nocturne-deco',   'НОКТЮРН',   'бар, вечерняя карта'],
  ['03-gym-kuznya',      'КУЗНЯ',     'зал, расписание и тренеры'],
  ['06-flora-botanical', 'ФЛОРА',     'растения, ботанический разворот'],
  ['07-meridian-swiss',  'МЕРИДИАН',  'юристы, строгая подача без картинок'],
];

$('wgrid').innerHTML = WORKS.map(([slug, name, about], i) => `
  <figure class="w rv">
    <span class="ph"><img src="assets/img/${slug}.jpg" width="760" height="507"
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
  window.SELFTEST = t;
  console.log('selftest', t.every(x => x.ок) ? 'пройден' : 'ПРОВАЛЕН', t);
}
