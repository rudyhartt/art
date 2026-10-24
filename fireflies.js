/* White winged creatures gather in quiet clouds between the artworks. */
(() => {
  'use strict';
  const canvas = document.querySelector('.firefly-field');
  if (!canvas || canvas.dataset.firefliesReady) return;
  const context = canvas.getContext('2d');
  if (!context) return;
  canvas.dataset.firefliesReady = 'true';

  const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const dialog = document.getElementById('artwork-dialog');
  const frameInterval = 1000 / 30;
  const tau = Math.PI * 2;
  let width = 0;
  let height = 0;
  let compact = false;
  const cloudBands = new Map();
  let frameId = 0;
  let lastFrame = 0;
  let elapsed = 0;
  let running = false;
  let pageActive = true;
  let modalOpen = Boolean(dialog && dialog.open);
  let scrollPosition = Math.max(0, window.scrollY);
  const nebula = new Image();
  nebula.decoding = 'async';
  nebula.addEventListener('load', () => {
    if (pageActive && !document.hidden && !modalOpen) draw(motion.matches ? 0 : elapsed);
  });

  // One small cached glow avoids creating gradients for every creature/frame.
  const halo = document.createElement('canvas');
  halo.width = halo.height = 48;
  const haloContext = halo.getContext('2d');
  if (haloContext) {
    const glow = haloContext.createRadialGradient(24, 24, 1, 24, 24, 24);
    glow.addColorStop(0, 'rgba(255,255,255,.13)');
    glow.addColorStop(.35, 'rgba(255,255,255,.055)');
    glow.addColorStop(1, 'rgba(255,255,255,0)');
    haloContext.fillStyle = glow;
    haloContext.fillRect(0, 0, 48, 48);
  }

  function randomSource(seed) {
    return () => {
      seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0;
      return seed / 4294967296;
    };
  }

  function createClouds(band) {
    const random = randomSource(2397 + band * 7919);
    const anchors = compact
      ? [[.17, .32], [.83, .76]]
      : [[.08, .28], [.92, .65], [.16, .83], [.73, .08]];
    const quiet = motion.matches;
    const creatureCount = quiet ? 2 : compact ? 3 : 4;
    const moteCount = quiet ? 8 : compact ? 18 : 30;
    const spread = () => (random() + random() + random() - 1.5) / 1.5;
    return anchors.map(([x, y], index) => ({
      x,
      y,
      phase: index * 1.73 + random(),
      creatures: Array.from({ length: creatureCount }, () => ({
        x: spread(),
        y: spread(),
        phase: random() * tau,
        size: compact ? .67 + random() * .20 : .86 + random() * .34,
        opacity: .72 + random() * .23,
        flutter: 2.1 + random() * 1.1
      })),
      motes: Array.from({ length: moteCount }, () => ({
        x: spread() * 1.65,
        y: spread() * 1.45,
        phase: random() * tau,
        radius: .5 + random() * (compact ? .65 : 1),
        opacity: .16 + random() * .24
      }))
    }));
  }

  function drawCreature(creature, x, y, time) {
    const quiet = motion.matches;
    const beat = quiet ? .72 : .28 + .72 * (.5 + .5 * Math.sin(time * tau * creature.flutter + creature.phase));
    const tilt = -.12 + Math.sin(time * .52 + creature.phase) * .22;
    context.save();
    context.translate(x, y);
    context.rotate(tilt);
    context.scale(creature.size, creature.size);
    context.globalAlpha = creature.opacity;
    if (haloContext) context.drawImage(halo, -16, -16, 32, 32);

    // Exactly two translucent oval wings; the circular body stays distinct.
    context.fillStyle = 'rgba(255,255,255,.40)';
    context.beginPath();
    context.ellipse(-3.2 - beat * 1.4, -1.4, 2 + beat * 3.8, 2.7, -.48, 0, tau);
    context.fill();
    context.beginPath();
    context.ellipse(3.2 + beat * 1.4, -1.4, 2 + beat * 3.8, 2.7, .48, 0, tau);
    context.fill();
    context.fillStyle = 'rgba(255,255,255,.53)';
    context.beginPath();
    context.arc(0, 1, 3.3, 0, tau);
    context.fill();
    context.restore();
  }

  function draw(time) {
    context.clearRect(0, 0, width, height);
    const quiet = motion.matches;
    const spanX = Math.min(width * (compact ? .31 : .16), compact ? 125 : 215);
    const spanY = Math.min(height * .16, compact ? 110 : 150);
    const bandHeight = Math.max(600, height);
    // Keep the canvas small, but anchor every cloud to the document itself.
    // The margin covers the full cloud spread, glow, drift and orbit so clouds
    // enter the viewport naturally rather than appearing at a band boundary.
    const margin = 360;
    const firstBand = Math.max(0, Math.floor((scrollPosition - margin) / bandHeight));
    const lastBand = Math.floor((scrollPosition + height + margin) / bandHeight);
    for (const band of cloudBands.keys()) {
      if (band < firstBand || band > lastBand) cloudBands.delete(band);
    }

    const visibleClouds = [];
    for (let band = firstBand; band <= lastBand; band++) {
      if (!cloudBands.has(band)) cloudBands.set(band, createClouds(band));
      for (const cloud of cloudBands.get(band)) {
        const driftX = quiet ? 0 : Math.sin(time * .09 + cloud.phase) * Math.min(width * .04, 62);
        const driftY = quiet ? 0 : Math.cos(time * .075 + cloud.phase) * Math.min(height * .055, 48);
        const centerX = width * cloud.x + driftX;
        const centerY = bandHeight * (band + cloud.y) + driftY - scrollPosition;
        if (centerY < -margin || centerY > height + margin) continue;
        visibleClouds.push({ cloud, centerX, centerY });
      }
    }

    // Paint the transparent photographic mist first, below every creature.
    if (nebula.complete && nebula.naturalWidth) {
      const mistWidth = Math.min(width * (compact ? .95 : .55), compact ? 420 : 720);
      const mistHeight = mistWidth * nebula.naturalHeight / nebula.naturalWidth;
      for (const { cloud, centerX, centerY } of visibleClouds) {
        context.save();
        context.translate(centerX, centerY);
        context.rotate(Math.sin(cloud.phase) * .32);
        context.scale(Math.cos(cloud.phase) < 0 ? -1 : 1, 1);
        context.globalAlpha = compact ? .18 : .20;
        context.drawImage(nebula, -mistWidth / 2, -mistHeight / 2, mistWidth, mistHeight);
        context.restore();
      }
    }

    for (const { cloud, centerX, centerY } of visibleClouds) {
      for (const mote of cloud.motes) {
        const orbitX = quiet ? 0 : Math.sin(time * .29 + mote.phase) * 12;
        const orbitY = quiet ? 0 : Math.cos(time * .23 + mote.phase) * 9;
        const shimmer = quiet ? 1 : .83 + .17 * Math.sin(time * .45 + mote.phase);
        context.globalAlpha = mote.opacity * shimmer;
        context.fillStyle = '#fff';
        context.beginPath();
        context.arc(centerX + mote.x * spanX + orbitX, centerY + mote.y * spanY + orbitY, mote.radius, 0, tau);
        context.fill();
      }

      for (const creature of cloud.creatures) {
        const orbitX = quiet ? 0 : Math.sin(time * .32 + creature.phase) * 22;
        const orbitY = quiet ? 0 : Math.cos(time * .27 + creature.phase) * 16;
        drawCreature(creature, centerX + creature.x * spanX + orbitX, centerY + creature.y * spanY + orbitY, time);
      }
    }
    context.globalAlpha = 1;
  }

  function stop() {
    running = false;
    if (frameId) window.cancelAnimationFrame(frameId);
    frameId = 0;
    lastFrame = 0;
  }

  function tick(now) {
    frameId = 0;
    if (!running) return;
    if (!lastFrame) lastFrame = now;
    const delta = now - lastFrame;
    if (delta >= frameInterval - .5) {
      elapsed += Math.min(delta / 1000, .08);
      lastFrame = now;
      draw(elapsed);
    }
    frameId = window.requestAnimationFrame(tick);
  }

  function synchronize() {
    stop();
    scrollPosition = Math.max(0, window.scrollY);
    if (!pageActive || document.hidden || modalOpen) return;
    if (motion.matches) {
      draw(0);
      return;
    }
    draw(elapsed);
    running = true;
    frameId = window.requestAnimationFrame(tick);
  }

  function resize() {
    stop();
    width = Math.max(1, window.innerWidth);
    height = Math.max(1, window.innerHeight);
    compact = width < 700;
    const ratio = Math.min(window.devicePixelRatio || 1, 1.5);
    canvas.width = Math.round(width * ratio);
    canvas.height = Math.round(height * ratio);
    context.setTransform(ratio, 0, 0, ratio, 0, 0);
    cloudBands.clear();
    synchronize();
  }

  window.addEventListener('resize', resize, { passive: true });
  window.addEventListener('scroll', () => {
    scrollPosition = Math.max(0, window.scrollY);
    // Repaint in the scroll event so the clouds stay attached to the artwork,
    // including in reduced-motion mode, without starting another RAF loop.
    if (pageActive && !document.hidden && !modalOpen) draw(motion.matches ? 0 : elapsed);
  }, { passive: true });
  document.addEventListener('visibilitychange', synchronize);
  motion.addEventListener('change', () => {
    cloudBands.clear();
    synchronize();
  });
  window.addEventListener('pagehide', () => {
    pageActive = false;
    stop();
  });
  window.addEventListener('pageshow', () => {
    pageActive = true;
    resize();
  });
  if (dialog) {
    new MutationObserver(() => {
      modalOpen = dialog.open;
      synchronize();
    }).observe(dialog, { attributes: true, attributeFilter: ['open'] });
  }
  resize();
  nebula.src = 'assets/firefly-nebula.webp';
})();
