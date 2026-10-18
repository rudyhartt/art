/* Decorative links between the nine original MOMENTS captions. */
(() => {
  'use strict';

  const main = document.querySelector('.moments-canvas');
  const svg = document.getElementById('moments-thread');
  if (!main || !svg) return;

  const figures = [...main.querySelectorAll('.work[data-order]')]
    .filter(figure => figure.querySelector('.moment-ribbon'))
    .sort((a, b) => Number(a.dataset.order) - Number(b.dataset.order));
  if (figures.length < 2) return;

  const NS = 'http://www.w3.org/2000/svg';
  const layers = ['moments-thread-shadow', 'moments-thread-ribbon', 'moments-thread-highlight'];
  const paths = figures.slice(1).map((figure, index) => {
    const group = document.createElementNS(NS, 'g');
    group.dataset.connection = `${figures[index].dataset.order}-${figure.dataset.order}`;
    const copies = layers.map(className => {
      const path = document.createElementNS(NS, 'path');
      path.setAttribute('class', className);
      path.setAttribute('fill', 'none');
      path.setAttribute('stroke-linecap', 'round');
      path.setAttribute('stroke-linejoin', 'round');
      path.setAttribute('vector-effect', 'non-scaling-stroke');
      group.appendChild(path);
      return path;
    });
    svg.appendChild(group);
    return copies;
  });
  svg.setAttribute('pointer-events', 'none');
  svg.setAttribute('aria-hidden', 'true');
  svg.setAttribute('focusable', 'false');

  const point = (x, y) => ({ x, y });
  const distance = (a, b) => Math.hypot(b.x - a.x, b.y - a.y);
  const clamp = (value, min, max) => Math.max(min, Math.min(max, value));
  const same = (a, b) => distance(a, b) < .1;
  const lerp = (a, b, t) => point(a.x + (b.x - a.x) * t, a.y + (b.y - a.y) * t);
  const expand = (rect, padding) => ({
    left: rect.left - padding, top: rect.top - padding,
    right: rect.right + padding, bottom: rect.bottom + padding
  });

  // Test the entire small line segment, not just its endpoints.
  function crosses(a, b, rect) {
    let first = 0;
    let last = 1;
    for (const [start, delta, min, max] of [
      [a.x, b.x - a.x, rect.left, rect.right],
      [a.y, b.y - a.y, rect.top, rect.bottom]
    ]) {
      if (Math.abs(delta) < .001) {
        if (start <= min || start >= max) return false;
      } else {
        const enter = (min - start) / delta;
        const leave = (max - start) / delta;
        first = Math.max(first, Math.min(enter, leave));
        last = Math.min(last, Math.max(enter, leave));
        if (first >= last) return false;
      }
    }
    return last > 0 && first < 1;
  }

  function rounded(points, radius) {
    const clean = points.filter((p, i) => !i || !same(p, points[i - 1]));
    const simple = clean.filter((p, i) => {
      if (!i || i === clean.length - 1) return true;
      const before = clean[i - 1], after = clean[i + 1];
      return Math.abs((p.x - before.x) * (after.y - p.y) -
        (p.y - before.y) * (after.x - p.x)) > .1;
    });
    const commands = [{ type: 'M', p: simple[0] }];
    for (let i = 1; i < simple.length - 1; i++) {
      const before = simple[i - 1], corner = simple[i], after = simple[i + 1];
      const r = Math.min(radius, distance(before, corner) * .45, distance(corner, after) * .45);
      const enter = lerp(corner, before, r / distance(before, corner));
      const leave = lerp(corner, after, r / distance(corner, after));
      commands.push({ type: 'L', p: enter });
      commands.push({ type: 'C', c1: lerp(enter, corner, .5523), c2: lerp(leave, corner, .5523), p: leave });
    }
    commands.push({ type: 'L', p: simple[simple.length - 1] });
    return commands;
  }

  function inspect(commands, obstacles) {
    let previous = commands[0].p;
    let length = 0;
    for (const command of commands.slice(1)) {
      const start = previous;
      const steps = command.type === 'C'
        ? Math.max(12, Math.ceil((distance(start, command.c1) + distance(command.c1, command.c2) + distance(command.c2, command.p)) / 10))
        : 1;
      for (let step = 1; step <= steps; step++) {
        const t = step / steps, u = 1 - t;
        const next = command.type === 'C' ? point(
          u ** 3 * start.x + 3 * u * u * t * command.c1.x + 3 * u * t * t * command.c2.x + t ** 3 * command.p.x,
          u ** 3 * start.y + 3 * u * u * t * command.c1.y + 3 * u * t * t * command.c2.y + t ** 3 * command.p.y
        ) : command.p;
        if (obstacles.some(rect => crosses(previous, next, rect))) return Infinity;
        length += distance(previous, next);
        previous = next;
      }
    }
    return length;
  }

  const coordinate = value => Number(value.toFixed(2));
  const pair = p => `${coordinate(p.x)} ${coordinate(p.y)}`;
  const serialize = commands => commands.map(command => command.type === 'C'
    ? `C ${pair(command.c1)} ${pair(command.c2)} ${pair(command.p)}`
    : `${command.type} ${pair(command.p)}`).join(' ');

  let frame = 0;
  function draw() {
    frame = 0;
    const origin = main.getBoundingClientRect();
    if (!origin.width || !origin.height) return;
    const mobile = window.matchMedia('(max-width: 699px)').matches;
    const gutter = mobile ? 8 : 12;
    const clearance = mobile ? 14 : 28;
    const protection = mobile ? 4.75 : 7.25;
    const radius = mobile ? 28 : 65;
    const farGutter = origin.width - gutter;
    const bounds = element => {
      const rect = element.getBoundingClientRect();
      return { left: rect.left - origin.left, top: rect.top - origin.top,
        right: rect.right - origin.left, bottom: rect.bottom - origin.top };
    };
    const moments = figures.map(figure => ({
      figure, image: bounds(figure.querySelector('.artwork-link img') || figure),
      caption: bounds(figure.querySelector('.moment-ribbon')), gallery: figure.closest('.gallery')
    }));
    const collections = [...main.querySelectorAll('.collection-section')].map(bounds);
    const obstacles = [...moments.map(moment => moment.image), ...collections].map(rect => expand(rect, protection));
    svg.setAttribute('viewBox', `0 0 ${coordinate(origin.width)} ${coordinate(origin.height)}`);
    svg.setAttribute('width', coordinate(origin.width));
    svg.setAttribute('height', coordinate(origin.height));

    function port(moment, side) {
      const cap = moment.caption, image = moment.image;
      const y = (cap.top + cap.bottom) / 2;
      const edge = side < 0 ? cap.left + 4 : cap.right - 4;
      const outer = side < 0 ? Math.min(cap.left - 5, image.left - clearance)
        : Math.max(cap.right + 5, image.right + clearance);
      return { edge: point(clamp(edge, gutter, farGutter), y),
        outer: point(clamp(outer, gutter, farGutter), y), side };
    }

    for (let index = 0; index < moments.length - 1; index++) {
      const from = moments[index], to = moments[index + 1];
      const crossing = collections.filter(rect => rect.top > from.caption.top && rect.bottom < to.caption.bottom);
      let best = null, bestLength = Infinity;
      const consider = commands => {
        const length = inspect(commands, obstacles);
        if (length < bestLength) { best = commands; bestLength = length; }
      };
      const considerPoints = points => {
        // Reduce the bend only if it would enter an image or collection.
        for (const rounding of [radius, radius / 2, 4, 0]) {
          const commands = rounded(points, rounding);
          if (Number.isFinite(inspect(commands, obstacles))) { consider(commands); break; }
        }
      };

      for (const sourceSide of [-1, 1]) for (const targetSide of [-1, 1]) {
        const source = port(from, sourceSide), target = port(to, targetSide);
        const a = source.outer, b = target.outer;
        if (crossing.length) {
          // Leave the current gallery below its images; stay outside every
          // collection until the open space above the next original image.
          const galleryBottom = Math.max(...moments.filter(item => item.gallery === from.gallery)
            .map(item => Math.max(item.image.bottom, item.caption.bottom)));
          const exitY = Math.min(crossing[0].top - clearance, galleryBottom + clearance);
          const entryY = Math.min(to.image.top - clearance, crossing[crossing.length - 1].bottom + clearance);
          considerPoints([source.edge, a, point(a.x, exitY), point(gutter, exitY),
            point(gutter, entryY), point(b.x, entryY), b, target.edge]);
          continue;
        }

        const bend = Math.min(mobile ? 65 : 160, Math.max(35, distance(a, b) * .32));
        consider([{ type: 'M', p: source.edge }, { type: 'L', p: a },
          { type: 'C', c1: point(clamp(a.x + source.side * bend, gutter, farGutter), a.y),
            c2: point(clamp(b.x + target.side * bend, gutter, farGutter), b.y), p: b },
          { type: 'L', p: target.edge }]);

        const xs = [a.x, b.x, (a.x + b.x) / 2, gutter, farGutter];
        for (const x of xs) considerPoints([source.edge, a, point(x, a.y), point(x, b.y), b, target.edge]);
        const low = Math.min(a.y, b.y), high = Math.max(a.y, b.y);
        const ys = [(a.y + b.y) / 2, ...moments.flatMap(item =>
          [item.image.top - clearance, item.image.bottom + clearance])].filter(y => y >= low && y <= high);
        for (const y of ys) considerPoints([source.edge, a, point(a.x, y), point(b.x, y), b, target.edge]);
      }

      // A hidden/zero-size figure can be temporarily unroutable during layout.
      // Leave the decoration absent rather than draw across the artwork.
      const d = best ? serialize(best) : '';
      paths[index].forEach(path => path.setAttribute('d', d));
    }
  }

  function schedule() {
    if (!frame) frame = window.requestAnimationFrame(draw);
  }
  if ('ResizeObserver' in window) {
    const observer = new ResizeObserver(schedule);
    observer.observe(main);
    figures.forEach(figure => {
      observer.observe(figure);
      observer.observe(figure.querySelector('.moment-ribbon'));
    });
    main.querySelectorAll('.collection-section').forEach(section => observer.observe(section));
  }
  window.addEventListener('resize', schedule, { passive: true });
  window.addEventListener('pageshow', schedule);
  main.querySelectorAll('img').forEach(image => {
    image.addEventListener('load', schedule, { once: true });
    image.addEventListener('error', schedule, { once: true });
  });
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(schedule);
  schedule();
})();
