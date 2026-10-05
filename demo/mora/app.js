'use strict';
const qs = (selector, root = document) => root.querySelector(selector);
const qsa = (selector, root = document) => [...root.querySelectorAll(selector)];
const query = new URLSearchParams(location.search);
const still = query.get('still') === '1';
const reduced = matchMedia('(prefers-reduced-motion: reduce)');
const page = document.body.dataset.page;
const services = [
  { id:'landscape', title:'Ландшафтный проект', fee:'от 24 000 ₽ / сотка', intro:'Полный проект сада, от общей идеи до рабочих чертежей.', items:['Генеральный план и маршруты по участку','Вертикальная планировка и покрытия','Дендроплан и схемы посадок','Освещение участка','Полив и водоотведение','Спецификации и ведомости материалов'], image:'forest', group:'Проектирование' },
  { id:'concept', title:'Концепция сада', fee:'от 12 000 ₽ / сотка', intro:'Находим характер будущего сада и связываем его с архитектурой дома.', items:['Зонирование участка','Эскизный генеральный план','Палитра растений и материалов','Виды основных пространств'], image:'court', group:'Проектирование' },
  { id:'renewal', title:'Реконструкция участка', fee:'от 16 000 ₽ / сотка', intro:'Пересматриваем существующий сад, сохраняя то, что уже имеет ценность.', items:['Обследование существующего участка','Схема сохранения деревьев','Обновление маршрутов и зон отдыха','План последовательной реализации'], image:'slope', group:'Проектирование' },
  { id:'planting', title:'Посадочный проект', fee:'от 8 000 ₽ / сотка', intro:'Подбираем посадки под почву, свет и доступный уход.', items:['Дендроплан','Ассортимент растений','Схемы цветников','Ведомость для питомников'], image:'meadow', group:'Проектирование' },
  { id:'lighting', title:'Освещение сада', fee:'от 95 000 ₽ / проект', intro:'Создаём вечерний сценарий участка без лишнего света.', items:['Маршруты и зоны вечернего отдыха','Световые акценты','Схема размещения светильников','Ведомость оборудования'], image:'court', group:'Проектирование' },
  { id:'water', title:'Полив и водоотведение', fee:'от 110 000 ₽ / проект', intro:'Продумываем инженерную основу вместе с посадками и рельефом.', items:['Исходные данные участка','Схема зон полива','Проектные решения по водоотведению','Комплект чертежей и спецификация'], image:'slope', group:'Проектирование' },
  { id:'supervision', title:'Авторский надзор', fee:'от 48 000 ₽ / месяц', intro:'Помогаем сохранить проектные решения во время реализации.', items:['Согласованный график выездов','Ответы подрядчикам','Проверка соответствия проекту','Согласование образцов материалов'], image:'forest', group:'Сопровождение' },
  { id:'supply', title:'Комплектация сада', fee:'8% / от бюджета закупок', intro:'Сверяем растения и материалы с проектом и согласованным бюджетом.', items:['Подбор растений в питомниках','Покрытия и уличный свет','Проверка ведомостей поставки','Согласование замен'], image:'meadow', group:'Сопровождение' }
];
const projects = [
  { id:'forest', title:'Лесной сад', area:'24 сотки', kind:'Лесные участки', category:'forest', stage:'Концепция, посадки', image:'forest', ratio:'wide', description:'Взрослые берёзы задают структуру участка. Каменные дорожки огибают деревья, а папоротники и осоки поддерживают характер леса.', detail:'Главный маршрут связывает дом, террасу и небольшой уголок отдыха. Посадки не закрывают стволы и оставляют глубину обзора. Вместо сплошного мощения используются отдельные плиты светлого камня.' },
  { id:'court', title:'Внутренний двор', area:'8 соток', kind:'Камерные сады', category:'court', stage:'Концепция, благоустройство', image:'court-vertical', ratio:'tall', description:'Небольшой сад становится продолжением комнат. Многоствольное дерево и водное зеркало собирают пространство вокруг террасы.', detail:'Камень повторяет материал дома. Живая изгородь создаёт приватность, а низкие посадки сохраняют открытый центр двора. Каждый вид из окна показывает часть общей композиции.' },
  { id:'meadow', title:'Сад у луга', area:'36 соток', kind:'Природные сады', category:'natural', stage:'Концепция, дендроплан', image:'meadow', ratio:'wide', description:'Открытый участок переходит в луг. Протяжённые посадки злаков и многолетников сохраняют дальние виды и движение ветра.', detail:'Гравийный маршрут ведёт к небольшой беседке. Цветение распределено по сезону, а редкие плодовые деревья дают тень и не перекрывают горизонт.' },
  { id:'slope', title:'Сад на склоне', area:'18 соток', kind:'Природные сады', category:'natural', stage:'Концепция, рельеф', image:'slope', ratio:'wide', description:'Рельеф становится основой сада. Широкие ступени связывают террасы, а посадки смягчают подпорные стены.', detail:'Переходы между уровнями дают разные точки обзора. Камень, сосна и спокойные цветники объединяют участок. Открытые площадки оставлены для отдыха и прогулок.' }
];
const slides = [
  { label:'Подход', text:'Проектируем сад целиком. От первой линии до последней посадки.' },
  { label:'Место', text:'Сохраняем характер участка: рельеф, взрослые деревья и открытые виды.' },
  { label:'Жизнь', text:'Создаём пространство для вашей жизни. Для завтраков на террасе, прогулок и спокойных вечеров дома.' }
];
function image(name, alt, cls, eager) {
  const vertical = name === 'portrait' || name === 'court-vertical';
  return '<img class="' + (cls || '') + '" src="assets/' + name + '.webp" width="' + (vertical ? 1024 : 1536) + '" height="' + (vertical ? 1536 : 1024) + '" alt="' + alt + '" ' + (eager ? 'fetchpriority="high"' : 'loading="lazy"') + '>';
}
function logo(extra) {
  return '<a class="brand ' + (extra || '') + '" href="index.html" aria-label="Mora, на главную"><strong>MORA</strong><span>ЛАНДШАФТНОЕ БЮРО</span></a>';
}
function header() {
  const links = [['index.html','О бюро','about'],['services.html','Услуги','services'],['projects.html','Проекты','projects'],['contacts.html','Контакты','contacts']];
  return '<div class="top-sentinel" aria-hidden="true"></div><a class="skip-link" href="#content">К содержимому</a><header class="site-header"><div class="container header-inner">' + logo() +
    '<nav class="desktop-nav" aria-label="Основная навигация">' + links.map(link => '<a href="' + link[0] + '"' + (page === link[2] ? ' aria-current="page"' : '') + '>' + link[1] + '</a>').join('') +
    '</nav><a class="header-cta" href="#discuss">Обсудить проект</a><button class="menu-toggle" type="button" aria-label="Открыть меню" aria-controls="mobile-menu" aria-expanded="false"><span></span><span></span></button></div></header>' +
    '<dialog class="mobile-menu" id="mobile-menu" aria-label="Навигация"><div class="menu-heading">' + logo() + '<button class="menu-close" type="button" aria-label="Закрыть меню">×</button></div><nav><a href="index.html">Главная</a>' +
    links.map(link => '<a href="' + link[0] + '">' + link[1] + '</a>').join('') + '</nav><a class="button menu-discuss" href="#discuss">Обсудить проект</a></dialog>';
}
function serviceRows(withHeading) {
  return '<section class="services-section container reveal" id="services">' + (withHeading ? '<h2 class="section-title">Услуги</h2>' : '') +
    ['Проектирование','Сопровождение'].map(group => '<div class="service-category"><h3>' + group + '</h3><div>' +
    services.filter(item => item.group === group).map(item => '<a class="service-row" href="service.html?id=' + item.id + '"><span>' + item.title + '</span><span class="row-arrow" aria-hidden="true">↗</span></a>').join('') + '</div></div>').join('') + '</section>';
}
function card(project) {
  return '<article class="project-card reveal" data-category="' + project.category + '"><a class="project-media ' + project.ratio + '" href="project.html?id=' + project.id + '">' +
    image(project.image, project.title + '. Концепция частного сада') + '<span class="project-stage">' + project.stage + '</span></a><div class="project-caption"><a href="project.html?id=' + project.id + '">' + project.title +
    '<span>' + project.area + ' / ' + project.kind.toLowerCase() + '</span></a><a class="project-arrow" aria-label="Открыть ' + project.title + '" href="project.html?id=' + project.id + '">↗</a></div></article>';
}
function portfolio(withFilters) {
  return '<section class="projects-section container" id="projects">' + (!withFilters ? '<h2 class="section-title reveal">Проекты</h2>' : '') +
    (withFilters ? '<div class="project-filters" role="group" aria-label="Категории проектов">' + [['all','Все проекты'],['forest','Лесные участки'],['court','Камерные сады'],['natural','Природные сады']].map((item,index) => '<button type="button" data-filter="' + item[0] + '" aria-pressed="' + (index === 0) + '" class="' + (index === 0 ? 'selected' : '') + '">' + item[1] + '</button>').join('') + '</div>' : '') +
    '<div class="masonry"><div class="project-column">' + card(projects[0]) + card(projects[2]) + '</div><div class="project-column">' + card(projects[1]) + card(projects[3]) + '</div></div>' +
    (!withFilters ? '<a class="button all-projects" href="projects.html">Посмотреть все проекты (4)</a>' : '<p class="portfolio-note" role="status">Показаны все 4 концепции</p>') + '</section>';
}
const heroScenes = [
  {id:'forest',label:'Лесной',image:'forest',project:projects[0],copy:'Сохраняем взрослые деревья. Прокладываем маршруты между домом, террасой и тихими местами в саду.',points:[{x:31,y:23,title:'Взрослые деревья',text:'Кроны задают характер сада. Посадки и маршруты выстраиваем вокруг них.'},{x:46,y:73,title:'Маршрут через сад',text:'Каменная дорожка соединяет дом с террасой и местами для отдыха.'},{x:74,y:67,title:'Низкий ярус',text:'Злаки и многолетники смягчают переход между камнем, деревьями и газоном.'}]},
  {id:'court',label:'Камерный',image:'court',project:projects[1],copy:'Продолжаем комнаты на открытом воздухе. Камень, водное зеркало и дерево собирают небольшой двор в цельное пространство.',points:[{x:39,y:27,title:'Дерево во дворе',text:'Многоствольная форма оставляет нижний уровень открытым и создаёт мягкую тень.'},{x:62,y:74,title:'Водное зеркало',text:'Отражение неба и крон добавляет глубину небольшому пространству.'},{x:24,y:75,title:'Терраса у дома',text:'Камень связывает архитектуру с садом. Место для отдыха остаётся рядом с комнатами.'}]},
  {id:'meadow',label:'Открытый',image:'meadow',project:projects[2],copy:'Оставляем место горизонту. Посадки работают с ветром и сезонами, а свободные площадки — с вашей повседневной жизнью.',points:[{x:45,y:29,title:'Открытый горизонт',text:'Низкие посадки сохраняют дальние виды и не перекрывают ландшафт.'},{x:38,y:71,title:'Прогулочный путь',text:'Плавный маршрут проходит сквозь посадки и связывает открытые площадки.'},{x:72,y:57,title:'Сезонные посадки',text:'Злаки и многолетники меняют рисунок сада в течение года.'}]}
];
function hero() {
  const scene = heroScenes[0];
  return '<div class="hero-grid"><div class="hero-copy"><p class="hero-eyebrow">Частные сады · ландшафтная архитектура</p><h1 class="hero-title"><span class="hero-line"><span>Сад начинается</span></span><span class="hero-line"><span>с вашего ритма.</span></span></h1><p class="hero-lead">Мы соединяем архитектуру, растения и ваши привычки. Чтобы за дверью дома начиналось место, в котором хочется остаться.</p>' +
    '<div class="hero-controls" role="tablist" aria-label="Характер сада">' + heroScenes.map((s,i)=>'<button type="button" class="hero-tab'+(i===0?' selected':'')+'" id="hero-tab-'+s.id+'" role="tab" aria-selected="'+(i===0)+'" tabindex="'+(i===0?0:-1)+'" aria-controls="hero-panel" data-hero-scene="'+i+'"><span class="tab-dot" aria-hidden="true"></span>'+s.label+'</button>').join('')+'</div><p class="hero-description" id="hero-description">'+scene.copy+'</p><div class="hero-actions"><a class="button" href="projects.html">Посмотреть сады <span aria-hidden="true">↗</span></a><a class="text-link" href="#approach">Наш подход <span aria-hidden="true">↓</span></a></div></div>' +
    '<figure class="hero-visual" id="hero-panel" role="tabpanel" aria-labelledby="hero-tab-forest" aria-busy="false"><div class="hero-stage"><a class="hero-picture" id="hero-project-link" href="project.html?id=forest" aria-label="Открыть концепцию Лесной сад">'+image('forest','Лесной сад. Каменная дорожка среди взрослых деревьев и многолетников','hero-image',true)+'</a><div class="hero-frame" aria-hidden="true"></div><div class="hero-hotspots">'+scene.points.map((point,i)=>'<button type="button" class="hero-hotspot'+(i===0?' selected':'')+'" data-hero-point="'+i+'" style="--point-x:'+point.x+'%;--point-y:'+point.y+'%" aria-label="'+point.title+'" aria-pressed="'+(i===0)+'" aria-describedby="hero-point-text"><span aria-hidden="true">+</span></button>').join('')+'</div><span class="hero-photo-note">Авторская концепция</span></div><figcaption><div class="hero-project-caption"><a id="hero-caption-link" href="project.html?id=forest"><strong id="hero-project-title">'+scene.project.title+'</strong><span id="hero-project-area">'+scene.project.area+' / частный участок</span></a><span class="hero-caption-arrow" aria-hidden="true">↗</span></div><div class="hero-point-caption" aria-live="polite"><strong id="hero-point-title">'+scene.points[0].title+'</strong><p id="hero-point-text">'+scene.points[0].text+'</p></div><p class="hero-image-error" role="alert" hidden></p></figcaption></figure></div><div class="facts hero-facts">' +
    [[4,'концепции сада','в портфолио'],[3,'характера участка','для разной жизни'],[6,'разделов проекта','единое решение'],[2,'формата сопровождения','после проектирования']].map(item=>'<div class="fact"><strong data-count="'+item[0]+'">'+item[0]+'</strong><p>'+item[1]+'<span>'+item[2]+'</span></p></div>').join('')+'</div>';
}
function about() {
  return '<section class="about-section container hero-section">' + hero() + '</section>' +
    '<section class="approach container" id="approach" aria-label="Подход бюро"><div class="slider-top"><span id="slide-count">1 / 3</span><div class="slide-progress" role="group" aria-label="Выбрать мысль">' + slides.map((item,index) => '<button type="button" data-slide="' + index + '" aria-label="' + item.label + '" aria-pressed="' + (index === 0) + '"><span></span></button>').join('') +
    '</div><span id="slide-label">Подход</span></div><div class="slider-window" tabindex="0" aria-roledescription="карусель" aria-label="Подход Mora"><div class="slider-track">' + slides.map((item,index) => '<article class="slide" aria-hidden="' + (index !== 0) + '"><h2>' + item.text + '</h2></article>').join('') +
    '</div></div><button class="slider-pause" type="button" aria-pressed="false">Приостановить</button></section>' +
    '<section class="studio-section container"><h2 class="section-title reveal">Ландшафтное бюро Mora</h2><p class="studio-subtitle reveal">Сад как продолжение архитектуры и вашей жизни</p><div class="studio-columns">' +
    [['Проектирование','Объединяем рельеф, маршруты и зоны отдыха.'],['Посадки','Подбираем растения под свет, почву и сезон.'],['Сопровождение','Помогаем сохранить решения на участке.']].map(item => '<article class="reveal"><h3>' + item[0] + '</h3><p>' + item[1] + '</p></article>').join('') + '</div></section>' + serviceRows(true) + portfolio(false);
}
function projectDecisions(project) {
  const scene = heroScenes.find(item=>item.id===project.id);
  const decisions = scene ? scene.points : [
    {title:'Террасы по рельефу',text:'Подпорные стены создают спокойные площадки на склоне. У каждой — своя точка обзора.'},
    {title:'Посадки у камня',text:'Сосны, злаки и многолетники смягчают границы между уровнями сада.'},
    {title:'Связь между уровнями',text:'Широкие ступени объединяют террасы в один прогулочный маршрут.'}
  ];
  return '<section class="project-decisions"><h2>Как устроен сад</h2><div>'+decisions.map(item=>'<article><h3>'+item.title+'</h3><p>'+item.text+'</p></article>').join('')+'</div></section>';
}
function projectPage() {
  const project = projects.find(item => item.id === query.get('id'));
  if (!project) return '<section class="container"><h1>Проект не найден</h1><a class="text-link" href="projects.html">Открыть все проекты</a></section>';
  document.title = project.title + ' / Mora';
  return '<article class="project-detail container"><h1>' + project.title + '</h1><p class="detail-location">' + project.kind + '</p><div class="detail-facts"><span>2026</span><span>' + project.stage + '</span><span>' + project.area + '</span></div><div class="detail-copy"><p>' + project.description + '</p><p>' + project.detail + '</p><p>Авторская концепция частного участка. Растения, маршруты и материалы представлены как единая система.</p></div><a class="detail-image reveal" href="assets/' + project.image + '.webp" data-lightbox aria-label="Рассмотреть ' + project.title + '">' + image(project.image,project.title) + '</a>' + projectDecisions(project) + '<div class="detail-bottom"><a class="text-link" href="projects.html">← Все проекты</a><a class="text-link" href="project.html?id=' + projects[(projects.indexOf(project)+1)%projects.length].id + '">Следующий проект →</a></div></article>';
}
function servicePage() {
  const service = services.find(item => item.id === query.get('id'));
  if (!service) return '<section class="container"><h1>Услуга не найдена</h1><a href="services.html">Все услуги</a></section>';
  document.title = service.title + ' / Mora';
  return '<article class="service-detail container"><h1>' + service.title + '</h1><div class="service-description"><div><p class="service-intro">' + service.intro + '</p><h2>Что входит</h2><ul>' +
    service.items.map(item=>'<li>'+item+'</li>').join('') + '</ul><p class="service-fee">' + service.fee + '</p><p class="fee-note">Ориентир для шаблона. Итоговая стоимость зависит от площади и состава работ. Материалы и реализация оплачиваются отдельно.</p><a class="button" href="#discuss">Обсудить задачу</a></div><figure class="reveal">' +
    image(service.image,service.title + '. Пример концепции сада') + '</figure></div><a class="text-link" href="services.html">← Все услуги</a></article>';
}
function contactPage() {
  return '<section class="contact-page container"><h1>Контакты</h1><div class="contact-page-grid"><div class="contact-links"><a href="#discuss">Обсудить участок <span>↘</span></a><a href="services.html">Выбрать услугу <span>↗</span></a><a href="projects.html">Посмотреть сады <span>↗</span></a><button type="button" data-contact-copy>Скопировать ссылку <span>↗</span></button><p role="status" id="copy-status">Начните с участка и пожеланий к будущему саду.</p></div><figure>' +
    '<iframe title="Интерактивная карта для выбора места проекта" src="https://www.openstreetmap.org/export/embed.html?bbox=36.5%2C55.3%2C38.4%2C56.3&amp;layer=mapnik" loading="lazy" referrerpolicy="no-referrer"></iframe><figcaption>Карта для выбора места проекта. Адрес и контакты компании добавляются при адаптации.</figcaption></figure></div></section>';
}
const documents = {
  privacy:{title:'Конфиденциальность',body:'Имя, номер телефона, комментарий и выбранная услуга используются только для формирования текстового брифа на вашем устройстве. Форма не отправляет сведения на сервер. Бриф можно сохранить, дополнить или передать самостоятельно.'},
  data:{title:'Данные в брифе',body:'Вы сами выбираете, какие сведения включить в бриф. Имя и телефон позволяют сформировать понятную заявку. После формирования текст сохраняется в скачанном файле. Сайт не хранит содержание формы после закрытия страницы.'},
  cookies:{title:'Настройки браузера',body:'Сайт может сохранять только ваши предпочтения интерфейса: состояние настроек и разрешение анимаций. Внешняя аналитика и рекламные сервисы не подключены. На странице контактов загружается внешняя карта OpenStreetMap: её сервер получает обычные технические сведения запроса, включая IP-адрес. Данные формы на карту не передаются. Навигация и форма работают без сохранения предпочтений.'},
  use:{title:'Использование шаблона',body:'Mora представляет концепцию ландшафтного бюро. Портфолио состоит из авторских концепций. Цены служат примерами оформления стоимости услуг. Реальные контактные и юридические данные компании добавляются при адаптации.'}
};
function legalPage() {
  const doc = documents[query.get('doc')] || documents.privacy;
  return '<article class="legal-page container"><h1>' + doc.title + '</h1><p>' + doc.body + '</p><button class="text-link" type="button" data-cookie-settings>Открыть настройки</button><a class="text-link" href="index.html">Вернуться к бюро</a></article>';
}
function discussion() {
  return '<section class="discussion container reveal" id="discuss"><h2 class="section-title">Обсудить проект</h2><div class="discussion-grid"><form id="project-form"><label class="sr-only" for="client-name">Имя и фамилия</label><input id="client-name" name="name" placeholder="Имя и фамилия" autocomplete="name" maxlength="80" required>' +
    '<label class="sr-only" for="client-phone">Номер телефона</label><input id="client-phone" name="phone" type="tel" placeholder="Номер телефона" autocomplete="tel" inputmode="tel" maxlength="18" required><label class="sr-only" for="client-comment">Комментарий</label><input id="client-comment" name="comment" placeholder="Комментарий" maxlength="2000">' +
    '<fieldset class="service-choice"><legend class="sr-only">Услуга</legend><label><input type="radio" name="direction" value="Проектирование сада" required><span>Проектирование сада</span></label><label><input type="radio" name="direction" value="Сопровождение реализации" required><span>Сопровождение реализации</span></label></fieldset>' +
    '<label class="consent"><input type="checkbox" name="consent" required><span>Я ознакомился с <a href="legal.html?doc=privacy">политикой конфиденциальности</a></span></label><label class="consent"><input type="checkbox" name="briefPermission" required><span>Согласен сформировать бриф из <a href="legal.html?doc=data">указанных данных</a></span></label><button class="button form-submit" type="submit">Сохранить бриф</button><p class="form-note">Файл сохранится на устройстве. Данные не отправляются.</p><p id="form-error" class="form-error" role="alert"></p></form>' +
    '<aside class="discussion-person"><div class="person-heading">' + image('portrait','Мастерская Mora') + '<div><h3>Mora</h3><p>Бюро ландшафтной архитектуры</p></div></div><div class="speech" role="status"><p id="response-text">Расскажите про участок и ваши пожелания. Соберём исходные данные в удобный бриф.</p><button type="button" id="download-again" class="text-link" hidden>Скачать бриф ещё раз</button></div></aside></div></section>';
}
function footer() {
  return '<footer class="footer container"><a class="footer-logo" href="index.html" aria-label="Mora, на главную">MORA</a><div class="footer-data"><div><p>Концептуальная работа Stack</p><p>Частные сады и ландшафт</p><p>Авторские концепции</p></div><div><a href="index.html">О бюро</a><a href="services.html">Услуги и стоимость</a><a href="projects.html">Проекты</a></div><div><a href="contacts.html">Обсудить участок</a><a href="#discuss">Сохранить бриф</a><button type="button" data-cookie-settings>Настройки браузера</button></div><div><a href="legal.html?doc=privacy">Конфиденциальность</a><a href="legal.html?doc=data">Данные в брифе</a><a href="legal.html?doc=cookies">Настройки и cookie</a><a href="legal.html?doc=use">О шаблоне</a></div></div><p class="copyright">© Mora, 2026</p></footer>' +
    '<div class="cookie-shade" hidden></div><section class="cookie-banner" aria-label="Настройки браузера" hidden><h2>Настройки браузера</h2><p>Сохраняем только выбранные настройки интерфейса. Внешняя аналитика и рекламные сервисы не используются.</p><div><button type="button" class="button secondary" data-preferences="reject">Не сохранять</button><button type="button" class="button secondary" data-cookie-settings>Настроить</button><button type="button" class="button" data-preferences="accept">Сохранить настройки</button></div><a href="legal.html?doc=cookies">Подробнее о настройках</a></section>' +
    '<button type="button" class="cookie-reopen" data-cookie-settings>Настройки</button><dialog class="preferences-dialog" id="preferences-dialog" aria-labelledby="preferences-title"><div class="dialog-heading"><h2 id="preferences-title">Настройки сайта</h2><button type="button" class="dialog-close" data-close aria-label="Закрыть настройки">×</button></div><label class="preference"><span>Основные функции<small>Навигация, форма и просмотр проектов</small></span><input type="checkbox" checked disabled aria-label="Основные функции всегда включены"></label><label class="preference"><span>Анимации<small>Переходы, счётчики и слайдер</small></span><input type="checkbox" id="motion-preference" checked></label><button type="button" class="button" id="save-preferences">Сохранить</button></dialog>' +
    '<dialog class="lightbox" id="lightbox" aria-label="Просмотр изображения"><button type="button" class="dialog-close" data-close aria-label="Закрыть изображение">×</button><img alt="" id="lightbox-image"></dialog>';
}
let content = '';
if (page === 'about') content = about();
else if (page === 'services') content = '<div class="page-title container"><h1>Услуги</h1></div>' + serviceRows(false);
else if (page === 'projects') content = '<div class="page-title container"><h1>Проекты</h1></div>' + portfolio(true);
else if (page === 'contacts') content = contactPage();
else if (page === 'project') content = projectPage();
else if (page === 'service') content = servicePage();
else if (page === 'legal') content = legalPage();
qs('#site').innerHTML = header() + '<main class="page-main page-' + page + '" id="content">' + content + discussion() + '</main>' + footer();
document.documentElement.classList.add('ready');

let preferences = null;
const stored = localStorage.getItem('mora-preferences');
if (stored) { try { preferences = JSON.parse(stored); } catch (error) { console.warn('Mora: настройки браузера имеют неверный формат.'); } }
function motionAllowed() { return !still && !reduced.matches && preferences?.motion !== false; }
let animationContext;
function setupMotion() {
  finishHeroTransition();
  if (animationContext) animationContext.revert();
  document.documentElement.classList.toggle('no-motion', !motionAllowed());
  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') { console.error('Mora: не загрузилась библиотека анимаций.'); return; }
  gsap.registerPlugin(ScrollTrigger);
  if (!motionAllowed()) return;
  animationContext = gsap.context(() => {
    gsap.from('.site-header', {opacity:0,duration:2,delay:.5,ease:'power1.out'});
    if (qs('.hero-section')) {
      const entrance=gsap.timeline({defaults:{ease:'power3.out'}});
      entrance.from('.hero-line>span',{yPercent:105,duration:.9,stagger:.12},.4)
        .from('.hero-eyebrow,.hero-lead,.hero-controls,.hero-description,.hero-actions',{opacity:0,duration:.7,stagger:.06},.55)
        .from('.hero-picture',{clipPath:'inset(0 0 100% 0)',duration:1.15,ease:'power3.inOut'},.65)
        .from('.hero-hotspot',{opacity:0,scale:.75,duration:.5,stagger:.07},1.55);
    }
    qsa('.reveal').forEach(element => gsap.from(element, {opacity:0,duration:2,delay:element.classList.contains('delayed')?1:0,ease:'power1.out',scrollTrigger:{trigger:element,start:'top 95%',once:true}}));
    qsa('[data-count]').forEach(element => { const value = Number(element.dataset.count); const counter = {value:0}; gsap.to(counter, {value,duration:2,ease:'power1.out',onStart:()=>{element.textContent='0';},onUpdate:()=>{element.textContent=String(Math.round(counter.value));},onComplete:()=>{element.textContent=String(value);},scrollTrigger:{trigger:element,start:'top 98%',once:true}}); });
  });
}
let heroIndex = 0, heroRequest = 0, heroTween = null;
const heroPanel = qs('#hero-panel');
let heroPointIndex = 0;
const heroAnnotation = heroPanel ? document.createElement('div') : null;
if (heroAnnotation) {
  heroAnnotation.className='hero-annotation';heroAnnotation.id='hero-annotation';heroAnnotation.hidden=true;
  heroAnnotation.setAttribute('role','status');
  heroAnnotation.innerHTML='<strong></strong><p></p>';
  qs('.hero-stage').append(heroAnnotation);
  qsa('[data-hero-point]').forEach(pin=>{
    pin.querySelector('span').textContent='';
    pin.setAttribute('aria-controls','hero-annotation');pin.setAttribute('aria-expanded','false');
  });
}
function positionHeroAnnotation() {
  if (!heroAnnotation || heroAnnotation.hidden) return;
  const stage=qs('.hero-stage').getBoundingClientRect();
  const pin=qsa('[data-hero-point]')[heroPointIndex].getBoundingClientRect();
  const box=heroAnnotation.getBoundingClientRect(), margin=12, gap=12;
  const cx=pin.left+pin.width/2-stage.left;
  const left=Math.max(margin,Math.min(cx-box.width/2,stage.width-box.width-margin));
  const clampTop=value=>Math.max(margin,Math.min(value,stage.height-box.height-margin));
  const candidates=[{side:'above',top:clampTop(pin.top-stage.top-gap-box.height)},{side:'below',top:clampTop(pin.bottom-stage.top+gap)}];
  const pins=qsa('[data-hero-point]').map(button=>button.getBoundingClientRect());
  const score=choice=>pins.reduce((total,r)=>{
    const x=r.left+r.width/2-stage.left,y=r.top+r.height/2-stage.top;
    const covered=x>=left&&x<=left+box.width&&y>=choice.top&&y<=choice.top+box.height;
    return total+(covered?1000:0);
  },0);
  const choice=candidates.reduce((best,next)=>score(next)<score(best)?next:best);
  heroAnnotation.style.left=left+'px';
  heroAnnotation.style.top=choice.top+'px';
  heroAnnotation.style.setProperty('--pointer-x',Math.max(16,Math.min(cx-left,box.width-16))+'px');
  heroAnnotation.dataset.side=choice.side;
}
function closeHeroAnnotation() {
  if(!heroAnnotation)return;
  heroAnnotation.hidden=true;
  qsa('[data-hero-point]').forEach(pin=>{pin.classList.remove('selected');pin.setAttribute('aria-pressed','false');pin.setAttribute('aria-expanded','false');});
}
function finishHeroTransition() {
  if (heroTween) { heroTween.progress(1); heroTween.kill(); heroTween = null; }
}
function selectHeroPoint(index, open=true) {
  if (!heroPanel) return;
  const point = heroScenes[heroIndex].points[index];
  if (!point) return;
  heroPointIndex=index;
  qsa('[data-hero-point]').forEach((button,i)=>{
    button.classList.toggle('selected',open&&i===index);
    button.setAttribute('aria-pressed',String(open&&i===index));
    button.setAttribute('aria-expanded',String(open&&i===index));
  });
  qs('#hero-point-title').textContent=point.title;
  qs('#hero-point-text').textContent=point.text;
  qs('.hero-photo-note').textContent=point.title;
  qs('.hero-photo-note').hidden=true;
  heroAnnotation.querySelector('strong').textContent=point.title;
  heroAnnotation.querySelector('p').textContent=point.text;
  heroAnnotation.hidden=!open;
  positionHeroAnnotation();
}
async function selectHeroScene(index) {
  if (!heroPanel || !Number.isInteger(index) || !heroScenes[index]) return;
  const request=++heroRequest;
  qsa('.hero-tab').forEach(button=>button.classList.remove('loading'));
  qs('.hero-image-error').hidden=true;
  if(index===heroIndex){heroPanel.setAttribute('aria-busy','false');return;}
  const scene=heroScenes[index], button=qs('[data-hero-scene="'+index+'"]');
  const error=qs('.hero-image-error');
  error.hidden=true;heroPanel.setAttribute('aria-busy','true');button.classList.add('loading');
  const nextImage=new Image();
  nextImage.src='assets/'+scene.image+'.webp';
  try { await nextImage.decode(); }
  catch (cause) {
    if(request!==heroRequest)return;
    heroPanel.setAttribute('aria-busy','false');button.classList.remove('loading');
    error.textContent='Не удалось загрузить изображение. Выберите сад ещё раз.';error.hidden=false;
    return;
  }
  if(request!==heroRequest)return;
  finishHeroTransition();
  if (typeof gsap!=='undefined') { gsap.killTweensOf('.hero-picture');gsap.set('.hero-picture',{clipPath:'none'}); }
  const picture=qs('#hero-project-link'), oldImages=qsa('img',picture);
  nextImage.className='hero-image';nextImage.alt=scene.project.title+'. Авторская концепция частного сада';
  nextImage.width=1536;nextImage.height=1024;nextImage.decoding='async';
  picture.append(nextImage);heroIndex=index;
  const href='project.html?id='+scene.id;
  picture.href=href;picture.setAttribute('aria-label','Открыть концепцию '+scene.project.title);
  qs('#hero-caption-link').href=href;qs('#hero-project-title').textContent=scene.project.title;
  qs('#hero-project-area').textContent=scene.project.area+' / авторская концепция';
  qs('#hero-description').textContent=scene.copy;
  heroPanel.setAttribute('aria-labelledby','hero-tab-'+scene.id);
  qsa('.hero-tab').forEach((tab,i)=>{const selected=i===index;tab.classList.toggle('selected',selected);tab.classList.remove('loading');tab.setAttribute('aria-selected',String(selected));tab.tabIndex=selected?0:-1;});
  qsa('[data-hero-point]').forEach((pin,i)=>{
    const point=scene.points[i];pin.style.setProperty('--point-x',point.x+'%');pin.style.setProperty('--point-y',point.y+'%');pin.setAttribute('aria-label',point.title);
  });
  selectHeroPoint(0,false);heroPanel.setAttribute('aria-busy','false');
  const removePrevious=()=>oldImages.forEach(img=>img.remove());
  if(motionAllowed() && typeof gsap!=='undefined'){
    heroTween=gsap.fromTo(nextImage,{clipPath:'inset(0 100% 0 0)'},{clipPath:'inset(0 0% 0 0)',duration:.65,ease:'power3.inOut',onComplete:removePrevious});
  } else removePrevious();
}
qsa('[data-hero-scene]').forEach((tab,index)=>{
  tab.addEventListener('click',()=>selectHeroScene(index));
  tab.addEventListener('keydown',event=>{
    let next=index;
    if(event.key==='ArrowRight')next=(index+1)%heroScenes.length;
    else if(event.key==='ArrowLeft')next=(index+heroScenes.length-1)%heroScenes.length;
    else if(event.key==='Home')next=0;
    else if(event.key==='End')next=heroScenes.length-1;
    else return;
    event.preventDefault();qs('[data-hero-scene="'+next+'"]').focus();selectHeroScene(next);
  });
});
qsa('[data-hero-point]').forEach(pin=>pin.addEventListener('click',()=>selectHeroPoint(Number(pin.dataset.heroPoint),pin.getAttribute('aria-expanded')!=='true')));
if(heroPanel){
  selectHeroPoint(0,false);
  heroPanel.addEventListener('keydown',event=>{if(event.key==='Escape')closeHeroAnnotation();});
  new ResizeObserver(positionHeroAnnotation).observe(qs('.hero-stage'));
}
const sentinelObserver = new IntersectionObserver(entries => qs('.site-header').classList.toggle('compact', !entries[0].isIntersecting));
sentinelObserver.observe(qs('.top-sentinel'));
const menu = qs('#mobile-menu');
const menuToggle = qs('.menu-toggle');
function closeMenu() { menu.close(); menuToggle.setAttribute('aria-expanded','false'); }
menuToggle.addEventListener('click',()=>{menu.showModal();menuToggle.setAttribute('aria-expanded','true');});
qs('.menu-close').addEventListener('click',closeMenu);
qs('.menu-discuss').addEventListener('click',closeMenu);
menu.addEventListener('close',()=>menuToggle.setAttribute('aria-expanded','false'));
matchMedia('(min-width:1025px)').addEventListener('change',event=>{if(event.matches && menu.open) closeMenu();});
qsa('dialog [data-close]').forEach(button=>button.addEventListener('click',()=>button.closest('dialog').close()));
qsa('dialog').forEach(dialog=>dialog.addEventListener('click',event=>{if(event.target!==dialog)return;const r=dialog.getBoundingClientRect();if(event.clientX<r.left||event.clientX>r.right||event.clientY<r.top||event.clientY>r.bottom)dialog.close();}));

let slideIndex = 0, slideTimer, sliderPaused = false, dragOrigin = null;
const sliderWindow = qs('.slider-window'), track = qs('.slider-track');
function scheduleSlide(delay = 2000) {
  clearTimeout(slideTimer);
  if (!track || !motionAllowed() || sliderPaused || document.hidden) return;
  slideTimer = setTimeout(()=>goSlide((slideIndex+1)%slides.length),delay);
}
function goSlide(index) {
  if (!track) return;
  slideIndex = Math.max(0,Math.min(slides.length-1,index));
  track.style.transform = 'translate3d(-' + slideIndex*100 + '%,0,0)';
  qs('#slide-count').textContent = (slideIndex+1) + ' / 3';
  qs('#slide-label').textContent = slides[slideIndex].label;
  qsa('.slide').forEach((element,i)=>element.setAttribute('aria-hidden',String(i!==slideIndex)));
  qsa('[data-slide]').forEach((button,i)=>{button.setAttribute('aria-pressed',String(i===slideIndex));button.classList.toggle('filled',i<=slideIndex);});
  scheduleSlide(3000);
}
if (track) {
  goSlide(0); scheduleSlide();
  qsa('[data-slide]').forEach(button=>button.addEventListener('click',()=>goSlide(Number(button.dataset.slide))));
  qs('.slider-pause').addEventListener('click',event=>{sliderPaused=!sliderPaused;event.currentTarget.setAttribute('aria-pressed',String(sliderPaused));event.currentTarget.textContent=sliderPaused?'Продолжить':'Приостановить';scheduleSlide();});
  sliderWindow.addEventListener('keydown',event=>{if(event.key==='ArrowRight'||event.key==='ArrowLeft'){event.preventDefault();goSlide(slideIndex+(event.key==='ArrowRight'?1:-1));}});
  sliderWindow.addEventListener('pointerdown',event=>{dragOrigin=event.clientX;clearTimeout(slideTimer);sliderWindow.setPointerCapture(event.pointerId);track.classList.add('dragging');});
  sliderWindow.addEventListener('pointermove',event=>{if(dragOrigin===null)return;track.style.transform='translate3d(calc(-' + slideIndex*100 + '% + ' + (event.clientX-dragOrigin) + 'px),0,0)';});
  function endDrag(event) { if(dragOrigin===null)return;const distance=event.clientX-dragOrigin;dragOrigin=null;track.classList.remove('dragging');goSlide(slideIndex+(Math.abs(distance)>45?(distance<0?1:-1):0)); }
  sliderWindow.addEventListener('pointerup',endDrag);
  sliderWindow.addEventListener('pointercancel',event=>{dragOrigin=null;track.classList.remove('dragging');goSlide(slideIndex);});
  document.addEventListener('visibilitychange',()=>scheduleSlide());
}
qsa('[data-filter]').forEach(button=>button.addEventListener('click',()=>{
  const filter=button.dataset.filter;
  qsa('[data-filter]').forEach(item=>{const selected=item===button;item.classList.toggle('selected',selected);item.setAttribute('aria-pressed',String(selected));});
  qsa('.project-card').forEach(item=>{item.hidden=filter!=='all'&&item.dataset.category!==filter;});
  qsa('.project-column').forEach(column=>{column.hidden=!qs('.project-card:not([hidden])',column);});
  const count=qsa('.project-card:not([hidden])').length;
  qs('.portfolio-note').textContent=filter==='all'?'Показаны все 4 концепции':'Найдено проектов: '+count;
  if (typeof ScrollTrigger!=='undefined') ScrollTrigger.refresh();
}));
qsa('[data-lightbox]').forEach(link=>link.addEventListener('click',event=>{event.preventDefault();qs('#lightbox-image').src=link.href;qs('#lightbox-image').alt=qs('img',link).alt;qs('#lightbox').showModal();}));

const form = qs('#project-form'), phone = qs('#client-phone');
const clientName = qs('#client-name');
clientName.addEventListener('input',()=>clientName.setCustomValidity(''));
function formatPhone(raw) {
  let digits=raw.replace(/\D/g,'');
  if(digits.startsWith('7')||digits.startsWith('8'))digits=digits.slice(1);
  digits=digits.slice(0,10);
  if(!digits)return '';
  return '+7 ('+digits.slice(0,3)+(digits.length>=3?') ':'')+digits.slice(3,6)+(digits.length>6?'-'+digits.slice(6,8):'')+(digits.length>8?'-'+digits.slice(8,10):'');
}
phone.addEventListener('input',()=>{phone.value=formatPhone(phone.value);phone.setCustomValidity('');});
phone.addEventListener('focus',()=>{phone.placeholder='+7 (___) ___-__-__';});
phone.addEventListener('blur',()=>{phone.placeholder='Номер телефона';});
form.addEventListener('invalid',()=>{qs('#form-error').textContent='Заполните имя и телефон, выберите направление и отметьте согласия.';},true);
let briefText='';
function downloadBrief() {
  const url=URL.createObjectURL(new Blob(['\uFEFF',briefText],{type:'text/plain;charset=utf-8'}));
  const link=document.createElement('a');link.href=url;link.download='mora-project-brief.txt';document.body.append(link);link.click();link.remove();setTimeout(()=>URL.revokeObjectURL(url),1000);
}
form.addEventListener('submit',event=>{
  event.preventDefault();
  if(!clientName.value.trim()){clientName.setCustomValidity('Укажите имя.');clientName.reportValidity();qs('#form-error').textContent='Укажите имя.';return;}
  if(phone.value.replace(/\D/g,'').length!==11){phone.setCustomValidity('Укажите номер из 10 цифр после +7.');phone.reportValidity();qs('#form-error').textContent='Проверьте номер телефона.';return;}
  if(!form.reportValidity())return;
  const data=new FormData(form);
  briefText=['MORA / Бриф проекта','','Имя: '+data.get('name').trim(),'Телефон: '+data.get('phone'),'Направление: '+data.get('direction'),'Комментарий: '+(data.get('comment').trim()||'Пока не указан'),'','Данные сохранены только в этом файле.','Концептуальная работа Stack.'].join('\n');
  downloadBrief();
  qs('#form-error').textContent='';
  qs('#response-text').textContent='Бриф готов. Сохраните его, добавьте план участка и используйте для обсуждения будущего сада. Данные остались на вашем устройстве.';
  qs('#download-again').hidden=false;
  qs('.speech').classList.add('success');
});
qs('#download-again').addEventListener('click',downloadBrief);
const cookieBanner=qs('.cookie-banner'), cookieShade=qs('.cookie-shade'), preferencesDialog=qs('#preferences-dialog');
if(!preferences && !still){cookieBanner.hidden=false;cookieShade.hidden=false;}
function closeBanner(){cookieBanner.hidden=true;cookieShade.hidden=true;}
function openPreferences(){
  qs('#motion-preference').checked=preferences?.motion!==false && !reduced.matches;
  qs('#motion-preference').disabled=reduced.matches;
  preferencesDialog.showModal();
}
function applyPreferences(value,persist) {
  preferences=value;
  if(persist)localStorage.setItem('mora-preferences',JSON.stringify(value));
  closeBanner();setupMotion();scheduleSlide();
}
qsa('[data-cookie-settings]').forEach(button=>button.addEventListener('click',openPreferences));
qsa('[data-preferences]').forEach(button=>button.addEventListener('click',()=>applyPreferences({motion:true},button.dataset.preferences==='accept')));
qs('#save-preferences').addEventListener('click',()=>{applyPreferences({motion:qs('#motion-preference').checked},true);preferencesDialog.close();});
const copyLink=qs('[data-contact-copy]');
if(copyLink) copyLink.addEventListener('click',async()=>{
  try { await navigator.clipboard.writeText(location.href);qs('#copy-status').textContent='Ссылка скопирована.'; }
  catch(error){qs('#copy-status').textContent='Не удалось скопировать ссылку. Можно скопировать адрес из строки браузера.';}
});
const transition=qs('.page-transition');
document.addEventListener('click',event=>{
  const link=event.target.closest('a[href]');
  if(!link || event.defaultPrevented || event.button!==0 || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey || link.hasAttribute('download') || link.hasAttribute('data-lightbox'))return;
  const url=new URL(link.href);
  if(url.origin!==location.origin || !url.pathname.endsWith('.html') || (url.pathname===location.pathname && url.search===location.search))return;
  if(!motionAllowed())return;
  event.preventDefault();transition.classList.add('leaving');transition.setAttribute('aria-hidden','false');setTimeout(()=>location.assign(url.href),500);
});
window.addEventListener('pageshow',event=>{if(event.persisted){transition.classList.remove('leaving');transition.classList.add('entered');setupMotion();scheduleSlide();}});
window.addEventListener('pagehide',()=>{clearTimeout(slideTimer);++heroRequest;finishHeroTransition();if(animationContext)animationContext.revert();});
reduced.addEventListener('change',()=>{setupMotion();scheduleSlide();});
document.fonts.ready.then(()=>{
  setupMotion();
  if(still||!motionAllowed())transition.classList.add('entered');
  else setTimeout(()=>transition.classList.add('entered'),500);
  transition.setAttribute('aria-hidden','true');
  if(query.get('at')){const target=document.getElementById(query.get('at'));if(target)target.scrollIntoView({behavior:'instant',block:'start'});}
});
window.Mora={goSlide,formatPhone,services,projects,selectHeroScene,get heroIndex(){return heroIndex;},get slideIndex(){return slideIndex;},get motion(){return motionAllowed();}};
