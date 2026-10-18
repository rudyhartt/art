/* The artwork viewer keeps image changes, transitions and focus in one place. */
(() => {
  'use strict';
  const protectedImages = 'img, .artwork-link, .external-logo-link, .lightbox-image-wrap';
  const preventImageInteraction = event => {
    if (event.target && typeof event.target.closest === 'function' && event.target.closest(protectedImages)) {
      event.preventDefault();
    }
  };
  document.addEventListener('contextmenu', preventImageInteraction);
  document.addEventListener('dragstart', preventImageInteraction);
  document.querySelectorAll('img').forEach(img => { img.draggable = false; });

  const works = Array.isArray(window.ARTWORKS) ? window.ARTWORKS : [];
  const dialog = document.getElementById('artwork-dialog');
  if (!works.length || !dialog || typeof dialog.showModal !== 'function') return;
  let image = document.getElementById('dialog-image');
  const imageWrap = dialog.querySelector('.lightbox-image-wrap');
  const error = document.getElementById('dialog-image-error');
  const closeButton = document.getElementById('close-lightbox');
  const previousButton = document.getElementById('previous-artwork');
  const nextButton = document.getElementById('next-artwork');
  const materials = document.getElementById('dialog-materials');
  const title = document.getElementById('dialog-title');
  const description = document.getElementById('dialog-description');
  const counter = document.getElementById('dialog-counter');
  const status = document.getElementById('lightbox-status');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const fadeDuration = 200;
  let activeWorks = works.filter(work => (work.scope || 'selected') === 'selected');
  let activeIndex = 0;
  let opener = null;
  let closing = false;
  let renderVersion = 0;
  let closeVersion = 0;
  let pendingLoad = null;
  let openingFrame = 0;
  let revealFrame = 0;
  let fadeOut = Promise.resolve();

  // transitionend follows the actual CSS fade; the fallback also handles a
  // hidden tab, a missing transition, or a changed motion preference.
  function afterFade(element) {
    if (reducedMotion.matches) return Promise.resolve();
    return new Promise(resolve => {
      const finish = event => {
        if (event && (event.target !== element || event.propertyName !== 'opacity')) return;
        window.clearTimeout(timer);
        element.removeEventListener('transitionend', finish);
        resolve();
      };
      const timer = window.setTimeout(finish, fadeDuration + 60);
      element.addEventListener('transitionend', finish);
    });
  }

  function preload(work) {
    const candidate = new Image();
    candidate.id = 'dialog-image';
    candidate.className = image.className;
    candidate.alt = work.alt || work.caption || work.title || '';
    candidate.draggable = false;
    candidate.decoding = 'async';
    let settled = false;
    let settle;
    const promise = new Promise(resolve => {
      settle = value => {
        if (settled) return;
        settled = true;
        candidate.onload = null;
        candidate.onerror = null;
        resolve(value);
      };
      candidate.onload = async () => {
        try {
          if (typeof candidate.decode === 'function') await candidate.decode();
          settle(candidate.naturalWidth > 0 ? candidate : null);
        } catch {
          settle(null);
        }
      };
      candidate.onerror = () => settle(null);
      candidate.src = work.src;
    });
    return {
      promise,
      cancel() {
        if (settled) return;
        settle(null);
        candidate.removeAttribute('src');
      }
    };
  }

  function cancelPending() {
    if (pendingLoad) pendingLoad.cancel();
    pendingLoad = null;
    if (revealFrame) window.cancelAnimationFrame(revealFrame);
    revealFrame = 0;
  }

  function setMetadata(work) {
    title.textContent = work.title || '';
    description.textContent = work.caption || '';
    materials.hidden = !work.materials;
    materials.textContent = work.materials || '';
  }

  const current = version => version === renderVersion && dialog.open && !closing;

  async function renderArtwork() {
    const work = activeWorks[activeIndex];
    if (!work) return;
    const version = ++renderVersion;
    const position = activeIndex + 1;
    const count = activeWorks.length;
    cancelPending();
    if (!dialog.classList.contains('is-changing')) {
      fadeOut = afterFade(imageWrap);
      dialog.classList.add('is-changing');
    }
    imageWrap.setAttribute('aria-busy', 'true');
    counter.textContent = `${String(position).padStart(2,'0')} / ${String(count).padStart(2,'0')}`;
    status.textContent = `Loading ${work.title || 'artwork'}, artwork ${position} of ${count}.`;
    previousButton.disabled = activeWorks.length < 2;
    nextButton.disabled = activeWorks.length < 2;
    const load = preload(work);
    pendingLoad = load;
    const [candidate] = await Promise.all([load.promise, fadeOut]);
    if (!current(version)) return;
    pendingLoad = null;
    setMetadata(work);
    if (candidate) {
      // Swap the decoded node itself: there is no second asynchronous src
      // assignment to the visible image and no stale load/error callback.
      image.replaceWith(candidate);
      image = candidate;
      image.hidden = false;
      error.hidden = true;
    } else {
      image.hidden = true;
      error.hidden = false;
    }
    imageWrap.removeAttribute('aria-busy');
    status.textContent = `${work.title || 'Artwork'}, artwork ${position} of ${count}.${candidate ? '' : ' The image could not be loaded.'}`;
    if (reducedMotion.matches) {
      dialog.classList.remove('is-changing');
    } else {
      imageWrap.getBoundingClientRect();
      revealFrame = window.requestAnimationFrame(() => {
        revealFrame = 0;
        if (current(version)) dialog.classList.remove('is-changing');
      });
    }
  }

  function move(direction) {
    if (!dialog.open || closing || activeWorks.length < 2) return;
    activeIndex = (activeIndex + direction + activeWorks.length) % activeWorks.length;
    renderArtwork();
  }

  async function closeArtwork() {
    if (!dialog.open || closing) return;
    closing = true;
    const version = ++closeVersion;
    ++renderVersion;
    cancelPending();
    if (openingFrame) window.cancelAnimationFrame(openingFrame);
    openingFrame = 0;
    const fading = afterFade(dialog);
    dialog.classList.remove('is-visible');
    await fading;
    if (version === closeVersion && closing && dialog.open) dialog.close();
  }

  document.querySelectorAll('.artwork-link').forEach(control => {
    // Native button activation covers pointer, Enter and Space without a
    // second keyboard handler or a downloadable destination on the control.
    control.addEventListener('click', () => {
      const selected = works.find(work => work.id === control.dataset.artworkId);
      if (!selected) return;
      const scope = selected.scope || 'selected';
      activeWorks = works.filter(work => (work.scope || 'selected') === scope);
      activeIndex = activeWorks.findIndex(work => work.id === selected.id);
      opener = control;
      ++closeVersion;
      closing = false;
      cancelPending();
      image.hidden = true;
      error.hidden = true;
      setMetadata(selected);
      fadeOut = Promise.resolve();
      dialog.classList.add('is-changing');
      if (!dialog.open) {
        dialog.classList.remove('is-visible');
        dialog.showModal();
        dialog.scrollTop = 0;
      }
      document.body.classList.add('lightbox-open');
      closeButton.focus({preventScroll:true});
      renderArtwork();
      if (openingFrame) window.cancelAnimationFrame(openingFrame);
      if (reducedMotion.matches) {
        dialog.classList.add('is-visible');
      } else {
        dialog.getBoundingClientRect();
        openingFrame = window.requestAnimationFrame(() => {
          openingFrame = 0;
          if (dialog.open && !closing) dialog.classList.add('is-visible');
        });
      }
    });
  });
  closeButton.addEventListener('click', closeArtwork);
  previousButton.addEventListener('click', () => move(-1));
  nextButton.addEventListener('click', () => move(1));
  dialog.addEventListener('keydown', event => {
    if (event.ctrlKey || event.metaKey || event.altKey) return;
    if (event.key === 'ArrowLeft') { event.preventDefault(); move(-1); }
    if (event.key === 'ArrowRight') { event.preventDefault(); move(1); }
  });
  dialog.addEventListener('cancel', event => {
    event.preventDefault();
    closeArtwork();
  });
  dialog.addEventListener('close', () => {
    ++renderVersion;
    ++closeVersion;
    closing = false;
    cancelPending();
    if (openingFrame) window.cancelAnimationFrame(openingFrame);
    openingFrame = 0;
    dialog.classList.remove('is-visible', 'is-changing');
    imageWrap.removeAttribute('aria-busy');
    image.hidden = true;
    image.removeAttribute('src');
    image.alt = '';
    error.hidden = true;
    document.body.classList.remove('lightbox-open');
    if (opener && opener.isConnected) opener.focus({preventScroll:true});
    opener = null;
  });
  dialog.addEventListener('click', event => { if (event.target === dialog) closeArtwork(); });
  reducedMotion.addEventListener('change', () => {
    if (!reducedMotion.matches || !dialog.open) return;
    if (closing) dialog.close();
    else dialog.classList.add('is-visible');
  });
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
