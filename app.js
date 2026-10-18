/* Progressive enhancement: the static artwork links work without JavaScript. */
(() => {
  'use strict';
  const works = Array.isArray(window.ARTWORKS) ? window.ARTWORKS : [];
  const dialog = document.getElementById('artwork-dialog');
  if (!works.length || !dialog || typeof dialog.showModal !== 'function') return;
  const image = document.getElementById('dialog-image');
  const error = document.getElementById('dialog-image-error');
  const closeButton = document.getElementById('close-lightbox');
  const previousButton = document.getElementById('previous-artwork');
  const nextButton = document.getElementById('next-artwork');
  const materials = document.getElementById('dialog-materials');
  let activeWorks = works.filter(work => (work.scope || 'selected') === 'selected');
  let activeIndex = 0;
  let opener = null;

  function renderArtwork() {
    const work = activeWorks[activeIndex];
    if (!work) return;
    image.hidden = false;
    error.hidden = true;
    image.alt = work.alt || work.caption || work.title;
    image.src = work.src;
    document.getElementById('dialog-title').textContent = work.title;
    document.getElementById('dialog-description').textContent = work.caption || '';
    materials.hidden = !work.materials;
    materials.textContent = work.materials || '';
    document.getElementById('dialog-counter').textContent = `${String(activeIndex + 1).padStart(2,'0')} / ${String(activeWorks.length).padStart(2,'0')}`;
    const fullImageLink = document.getElementById('full-image-link');
    fullImageLink.href = work.src;
    document.getElementById('lightbox-status').textContent = `${work.title}, artwork ${activeIndex + 1} of ${activeWorks.length}.`;
    previousButton.disabled = activeWorks.length < 2;
    nextButton.disabled = activeWorks.length < 2;
  }

  function move(direction) {
    activeIndex = (activeIndex + direction + activeWorks.length) % activeWorks.length;
    renderArtwork();
  }

  document.querySelectorAll('.artwork-link').forEach(link => {
    link.addEventListener('click', event => {
      if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      const selected = works.find(work => work.id === link.dataset.artworkId);
      if (!selected) return;
      const scope = selected.scope || 'selected';
      activeWorks = works.filter(work => (work.scope || 'selected') === scope);
      const index = activeWorks.findIndex(work => work.id === selected.id);
      event.preventDefault();
      activeIndex = index;
      opener = link;
      renderArtwork();
      dialog.showModal();
      document.body.classList.add('lightbox-open');
      closeButton.focus({preventScroll:true});
    });
  });
  closeButton.addEventListener('click', () => dialog.close());
  previousButton.addEventListener('click', () => move(-1));
  nextButton.addEventListener('click', () => move(1));
  dialog.addEventListener('keydown', event => {
    if (event.ctrlKey || event.metaKey || event.altKey) return;
    if (event.key === 'ArrowLeft') { event.preventDefault(); move(-1); }
    if (event.key === 'ArrowRight') { event.preventDefault(); move(1); }
  });
  dialog.addEventListener('close', () => {
    document.body.classList.remove('lightbox-open');
    if (opener && opener.isConnected) opener.focus({preventScroll:true});
  });
  dialog.addEventListener('click', event => { if (event.target === dialog) dialog.close(); });
  image.addEventListener('error', () => { image.hidden = true; error.hidden = false; });
})();

/* The repeating waves travel with the scroll, independently of their slow drift. */
(() => {
  'use strict';
  const background = document.querySelector('.ambient-background');
  if (!background) return;
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  let frame = 0;

  function updatePosition() {
    frame = 0;
    const scroll = Math.max(0, window.scrollY);
    background.style.setProperty('--wave-scroll-front', `${(-scroll * .45).toFixed(2)}px`);
    // The rear wave is rotated 180 degrees, so its local offset is reversed.
    background.style.setProperty('--wave-scroll-back', `${(scroll * .25).toFixed(2)}px`);
  }

  function scheduleUpdate() {
    if (!reducedMotion.matches && !frame) frame = window.requestAnimationFrame(updatePosition);
  }

  function configureMotion() {
    window.removeEventListener('scroll', scheduleUpdate);
    if (frame) window.cancelAnimationFrame(frame);
    frame = 0;
    if (reducedMotion.matches) {
      background.style.removeProperty('--wave-scroll-front');
      background.style.removeProperty('--wave-scroll-back');
      return;
    }
    window.addEventListener('scroll', scheduleUpdate, { passive: true });
    scheduleUpdate();
  }

  reducedMotion.addEventListener('change', configureMotion);
  window.addEventListener('pageshow', scheduleUpdate);
  configureMotion();
})();
