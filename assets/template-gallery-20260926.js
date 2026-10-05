(function () {
  var source = document.getElementById('templateCatalogueData');
  var dialog = document.getElementById('templateDialog');
  if (!source || !dialog || typeof dialog.showModal !== 'function') return;

  var templates = JSON.parse(source.textContent);
  var bySlug = {};
  templates.forEach(function (item) { bySlug[item.slug] = item; });

  var image = document.getElementById('templateDialogImage');
  var title = document.getElementById('templateDialogTitle');
  var niche = document.getElementById('templateDialogNiche');
  var description = document.getElementById('templateDialogDescription');
  var category = document.getElementById('templateDialogCategory');
  var type = document.getElementById('templateDialogType');
  var price = document.getElementById('templateDialogPrice');
  var highlights = document.getElementById('templateDialogHighlights');
  var caption = document.getElementById('templateDialogCaption');
  var count = document.getElementById('templateDialogCount');
  var dots = document.getElementById('templateDialogDots');
  var live = document.getElementById('templateDialogLive');
  var order = document.getElementById('templateDialogOrder');
  var current = null, slide = 0, opener = null, touchX = null;

  function renderSlide(index) {
    if (!current) return;
    slide = (index + current.gallery.length) % current.gallery.length;
    image.classList.add('is-changing');
    image.src = current.gallery[slide];
    image.alt = current.name + ' — ' + current.galleryLabels[slide];
    caption.textContent = current.galleryLabels[slide];
    count.textContent = (slide + 1) + ' / ' + current.gallery.length;
    [].forEach.call(dots.children, function (dot, i) {
      dot.setAttribute('aria-current', i === slide ? 'true' : 'false');
    });
    image.decode().catch(function () {}).then(function () { image.classList.remove('is-changing'); });
    var next = new Image();
    next.src = current.gallery[(slide + 1) % current.gallery.length];
  }

  function openTemplate(slug, trigger) {
    current = bySlug[slug];
    if (!current) return;
    opener = trigger;
    title.textContent = current.name;
    niche.textContent = current.niche;
    description.textContent = current.description;
    category.textContent = current.level === 'premium' ? 'Премиальный шаблон' : 'Готовая структура';
    type.textContent = current.category;
    price.textContent = current.price;
    highlights.innerHTML = current.highlights.map(function (item) { return '<li>' + item + '</li>'; }).join('');
    live.href = '/demo/' + current.slug + '/index.html';
    order.href = '/uslugi?s=' + current.service + '&template=' + current.slug + '#order';
    dots.innerHTML = current.gallery.map(function (_, i) {
      return '<button type="button" aria-label="Показать экран ' + (i + 1) + '"></button>';
    }).join('');
    renderSlide(0);
    dialog.showModal();
    document.documentElement.classList.add('template-dialog-open');
  }

  document.getElementById('demos').addEventListener('click', function (event) {
    var card = event.target.closest('.template-card');
    if (!card || event.target.closest('a')) return;
    if (event.target.closest('.template-detail-open') || !event.target.closest('button')) openTemplate(card.dataset.template, event.target.closest('button') || card);
  });
  document.getElementById('demos').addEventListener('keydown', function (event) {
    var card = event.target.closest('.template-card');
    if (card && event.target === card && (event.key === 'Enter' || event.key === ' ')) {
      event.preventDefault(); openTemplate(card.dataset.template, card);
    }
  });
  dialog.querySelector('.template-dialog-close').addEventListener('click', function () { dialog.close(); });
  dialog.querySelector('.is-prev').addEventListener('click', function () { renderSlide(slide - 1); });
  dialog.querySelector('.is-next').addEventListener('click', function () { renderSlide(slide + 1); });
  dots.addEventListener('click', function (event) {
    var dot = event.target.closest('button');
    if (dot) renderSlide([].indexOf.call(dots.children, dot));
  });
  dialog.addEventListener('click', function (event) {
    if (event.target === dialog) dialog.close();
  });
  dialog.addEventListener('keydown', function (event) {
    if (event.key === 'ArrowLeft') renderSlide(slide - 1);
    if (event.key === 'ArrowRight') renderSlide(slide + 1);
  });
  dialog.querySelector('.template-gallery-frame').addEventListener('touchstart', function (event) {
    touchX = event.touches[0].clientX;
  }, {passive:true});
  dialog.querySelector('.template-gallery-frame').addEventListener('touchend', function (event) {
    if (touchX === null) return;
    var dx = event.changedTouches[0].clientX - touchX; touchX = null;
    if (Math.abs(dx) > 45) renderSlide(slide + (dx < 0 ? 1 : -1));
  }, {passive:true});
  dialog.addEventListener('close', function () {
    document.documentElement.classList.remove('template-dialog-open');
    if (opener && document.contains(opener)) opener.focus();
  });

  var requested = new URLSearchParams(location.search).get('template');
  if (requested && bySlug[requested]) {
    var requestedCard = document.querySelector('.template-card[data-template="' + requested + '"]');
    openTemplate(requested, requestedCard || document.getElementById('demos'));
  }
})();
