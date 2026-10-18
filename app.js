/* Buildless artist portfolio. Edit artworks-data.js to update the collection. */
(() => {
  'use strict';

  const artworks = (Array.isArray(window.ARTWORKS) ? window.ARTWORKS : []).filter(work => work && work.id && work.src && work.title);
  const gallery = document.getElementById('gallery');
  const filterContainer = document.getElementById('filters');
  const dialog = document.getElementById('artwork-dialog');
  const dialogImage = document.getElementById('dialog-image');
  const dialogError = document.getElementById('dialog-image-error');
  const closeButton = document.getElementById('close-lightbox');
  const previousButton = document.getElementById('previous-artwork');
  const nextButton = document.getElementById('next-artwork');
  const groups = [...new Set(artworks.map(work => work.group || 'Selected Works'))];
  const groupDescriptions = {
    'Material Studies': 'Bodies become materials. Digital studies in translucence, softness and imagined sculpture.',
    'Impossible Communities': 'Unfamiliar beings find a place together. Scenes from worlds with their own quiet logic.',
    'Street Fables': 'Original characters, unruly marks and stories told at the scale of a wall.',
    'LOVE: Presence & Absence': 'A recurring character, continually transformed. Portraits of an inner life in unfamiliar forms.',
    'LOVE: Presence and Absence': 'A recurring character, continually transformed. Portraits of an inner life in unfamiliar forms.'
  };
  let activeFilter = 'all';
  let visibleArtworks = [...artworks];
  let lightboxArtworks = [...artworks];
  let activeIndex = 0;
  let previousFocus = null;

  const pad = value => String(value).padStart(2, '0');
  const create = (tag, className, text) => {
    const element = document.createElement(tag);
    if (className) element.className = className;
    if (text !== undefined) element.textContent = text;
    return element;
  };
  const artworkGroup = work => work.group || 'Selected Works';
  const artworkYear = work => String(work.year || '2026');
  const mediumLabel = work => artworkGroup(work) === 'Material Studies' ? 'Digital sculpture study' : 'AI-assisted digital artwork';

  function imageButton(work, featured = false) {
    const button = create('button', 'artwork-button');
    button.type = 'button';
    button.setAttribute('aria-label', `View ${work.title}`);
    const image = create('img');
    image.src = featured ? work.src : (work.thumb || work.src);
    image.alt = work.alt || work.title;
    image.loading = featured ? 'eager' : 'lazy';
    image.decoding = 'async';
    if (featured) image.setAttribute('fetchpriority', 'high');
    if (Number(work.width) > 0) image.width = Number(work.width);
    if (Number(work.height) > 0) image.height = Number(work.height);
    image.addEventListener('error', () => {
      button.classList.add('image-failed');
      image.hidden = true;
      button.append(create('span', '', `${work.title} — image unavailable`));
    }, { once: true });
    button.append(image);
    button.addEventListener('click', () => openArtwork(work.id, button, featured));
    return button;
  }

  function renderHero() {
    if (!artworks.length) return;
    const work = artworks.find(item => item.hero) || artworks[0];
    const hero = document.getElementById('hero-artwork');
    const caption = create('div', 'hero-caption');
    caption.append(create('span', '', `${work.title}, ${artworkYear(work)}`), create('span', '', 'Imagined installation / Digital artwork'));
    hero.replaceChildren(imageButton(work, true), caption);
  }

  function buildFilters() {
    filterContainer.replaceChildren();
    const entries = [{ name: 'All works', value: 'all', count: artworks.length }, ...groups.map(group => ({ name: group, value: group, count: artworks.filter(work => artworkGroup(work) === group).length }))];
    entries.forEach(entry => {
      const button = create('button', `filter-button${entry.value === 'all' ? ' active' : ''}`);
      button.type = 'button';
      button.dataset.filter = entry.value;
      button.setAttribute('aria-pressed', String(entry.value === 'all'));
      button.append(document.createTextNode(entry.name), create('span', 'filter-count', pad(entry.count)));
      button.addEventListener('click', () => setFilter(entry.value));
      filterContainer.append(button);
    });
  }

  function setFilter(filter) {
    activeFilter = filter;
    visibleArtworks = artworks.filter(work => filter === 'all' || artworkGroup(work) === filter);
    filterContainer.querySelectorAll('button').forEach(button => {
      const selected = button.dataset.filter === filter;
      button.classList.toggle('active', selected);
      button.setAttribute('aria-pressed', String(selected));
    });
    renderGallery();
    document.getElementById('filter-status').textContent = `${visibleArtworks.length} artworks shown${filter === 'all' ? ' across all collections' : ` in ${filter}`}.`;
  }

  function renderGallery() {
    if (!artworks.length) return;
    const fragment = document.createDocumentFragment();
    groups.filter(group => activeFilter === 'all' || group === activeFilter).forEach(group => {
      const works = visibleArtworks.filter(work => artworkGroup(work) === group);
      if (!works.length) return;
      const section = create('section', 'chapter');
      const headingId = `chapter-${groups.indexOf(group) + 1}`;
      section.setAttribute('aria-labelledby', headingId);
      const heading = create('div', 'chapter-heading');
      const title = create('h3', 'chapter-title', group);
      title.id = headingId;
      heading.append(create('span', 'chapter-number', pad(groups.indexOf(group) + 1)), title, create('p', 'chapter-description', groupDescriptions[group] || 'A collection of characters, stories and experiments in digital image-making.'));
      const grid = create('div', 'chapter-grid');
      works.forEach(work => {
        const number = artworks.indexOf(work) + 1;
        const figure = create('figure', 'work-card');
        const caption = create('figcaption', 'work-caption');
        const details = create('div');
        details.append(create('h3', '', work.title), create('p', 'work-medium', mediumLabel(work)));
        caption.append(create('span', 'work-number', pad(number)), details, create('span', 'work-year', artworkYear(work)));
        figure.append(imageButton(work), caption);
        grid.append(figure);
      });
      section.append(heading, grid, create('div', 'chapter-end', `${pad(works.length)} works / ${group}`));
      fragment.append(section);
    });
    gallery.replaceChildren(fragment);
  }

  function openArtwork(id, opener, fromFeatured = false) {
    previousFocus = opener || document.activeElement;
    lightboxArtworks = fromFeatured ? [...artworks] : [...visibleArtworks];
    activeIndex = lightboxArtworks.findIndex(work => work.id === id);
    if (activeIndex < 0) return;
    updateLightbox();
    dialog.showModal();
    document.body.classList.add('lightbox-open');
    closeButton.focus({ preventScroll: true });
  }

  function updateLightbox() {
    const work = lightboxArtworks[activeIndex];
    if (!work) return;
    dialogImage.hidden = false;
    dialogError.hidden = true;
    dialogImage.alt = work.alt || work.title;
    dialogImage.src = work.src;
    document.getElementById('dialog-title').textContent = work.title;
    document.getElementById('dialog-group').textContent = artworkGroup(work);
    document.getElementById('dialog-description').textContent = work.caption || '';
    document.getElementById('dialog-year').textContent = artworkYear(work);
    document.getElementById('dialog-counter').textContent = `${pad(activeIndex + 1)} / ${pad(lightboxArtworks.length)}`;
    document.getElementById('lightbox-status').textContent = `${work.title}, artwork ${activeIndex + 1} of ${lightboxArtworks.length}.`;
    previousButton.disabled = lightboxArtworks.length < 2;
    nextButton.disabled = lightboxArtworks.length < 2;
  }

  function moveArtwork(direction) {
    if (!lightboxArtworks.length) return;
    activeIndex = (activeIndex + direction + lightboxArtworks.length) % lightboxArtworks.length;
    updateLightbox();
  }

  function closeLightbox() {
    if (dialog.open) dialog.close();
  }

  closeButton.addEventListener('click', closeLightbox);
  previousButton.addEventListener('click', () => moveArtwork(-1));
  nextButton.addEventListener('click', () => moveArtwork(1));
  dialogImage.addEventListener('error', () => { dialogImage.hidden = true; dialogError.hidden = false; });
  dialog.addEventListener('close', () => {
    document.body.classList.remove('lightbox-open');
    if (previousFocus && previousFocus.isConnected) previousFocus.focus({ preventScroll: true });
  });
  dialog.addEventListener('click', event => { if (event.target === dialog) closeLightbox(); });
  dialog.addEventListener('keydown', event => {
    if (event.altKey || event.ctrlKey || event.metaKey) return;
    if (event.key === 'ArrowLeft') { event.preventDefault(); moveArtwork(-1); }
    if (event.key === 'ArrowRight') { event.preventDefault(); moveArtwork(1); }
  });

  document.querySelector('.nav-count').textContent = `(${pad(artworks.length)})`;
  document.querySelector('.heading-count').textContent = pad(artworks.length);
  document.getElementById('copyright-year').textContent = String(new Date().getFullYear());
  renderHero();
  buildFilters();
  renderGallery();
})();
