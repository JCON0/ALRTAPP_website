// ── HAMBURGER MENU ──
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');
const footerYear = document.getElementById('footerYear');

if (footerYear) {
  footerYear.textContent = new Date().getFullYear();
}

function closeMobileMenu() {
  hamburger.classList.remove('open');
  mobileMenu.classList.remove('open');
  document.body.style.overflow = '';
}

hamburger.addEventListener('click', () => {
  const isOpen = mobileMenu.classList.toggle('open');
  hamburger.classList.toggle('open', isOpen);
  document.body.style.overflow = isOpen ? 'hidden' : '';
});

// ── LIVE CLOCK ──
function tick() {
  document.getElementById('clock').textContent =
    new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
}
setInterval(tick, 1000);
tick();

// ── TICKER (ANIMATION) ──
(function initTicker() {
  const track = document.querySelector('.ticker-track');
  const inner = document.querySelector('.ticker-inner');
  if (!track || !inner) return;

  const speedPxPerSecond = 58;
  let baseWidth = 0;
  let offset = 0;
  let lastTime = performance.now();
  let frameId = null;

  const getSignatures = (items) => {
    return items.map((item) => {
      const dot = item.querySelector('.t-dot');
      const dotColor = dot ? dot.getAttribute('style') || '' : '';
      return `${item.textContent.trim()}|${dotColor}`;
    });
  };

  const findBaseCount = (signatures) => {
    const total = signatures.length;
    for (let size = 1; size <= total; size += 1) {
      if (total % size !== 0) continue;
      let repeats = true;
      for (let index = 0; index < total; index += 1) {
        if (signatures[index] !== signatures[index % size]) {
          repeats = false;
          break;
        }
      }
      if (repeats) return size;
    }
    return total;
  };

  const buildTicker = () => {
    const items = Array.from(inner.querySelectorAll('.ticker-item'));
    if (!items.length) return;

    const signatures = getSignatures(items);
    const baseCount = findBaseCount(signatures);
    const baseItems = items.slice(0, baseCount).map((item) => item.cloneNode(true));

    inner.innerHTML = '';
    let repeats = 0;
    while (repeats < 2 || inner.scrollWidth < track.clientWidth * 2.2) {
      baseItems.forEach((item) => inner.appendChild(item.cloneNode(true)));
      repeats += 1;
      if (repeats > 12) break;
    }

    baseWidth = 0;
    Array.from(inner.querySelectorAll('.ticker-item')).slice(0, baseCount).forEach((item) => {
      baseWidth += item.getBoundingClientRect().width;
    });

    offset = 0;
    inner.style.transform = 'translate3d(0, 0, 0)';
  };

  const animate = (time) => {
    const deltaSeconds = (time - lastTime) / 1000;
    lastTime = time;

    if (baseWidth > 0) {
      offset += speedPxPerSecond * deltaSeconds;
      if (offset >= baseWidth) offset -= baseWidth;
      inner.style.transform = `translate3d(${-offset}px, 0, 0)`;
    }

    frameId = requestAnimationFrame(animate);
  };

  const restart = () => {
    if (frameId) cancelAnimationFrame(frameId);
    buildTicker();
    lastTime = performance.now();
    frameId = requestAnimationFrame(animate);
  };

  window.addEventListener('resize', restart);
  restart();
})();

// ── CUSTOM CURSOR ──
const cur  = document.getElementById('cursor');
const ring = document.getElementById('cursor-ring');
let mx = 0, my = 0, rx = 0, ry = 0;

document.addEventListener('mousemove', e => {
  mx = e.clientX;
  my = e.clientY;
});

(function loop() {
  cur.style.left  = mx + 'px';
  cur.style.top   = my + 'px';
  rx += (mx - rx) * 0.12;
  ry += (my - ry) * 0.12;
  ring.style.left = rx + 'px';
  ring.style.top  = ry + 'px';
  requestAnimationFrame(loop);
})();

document.querySelectorAll('button, a, input, select').forEach(el => {
  el.addEventListener('mouseenter', () => {
    cur.style.width   = '18px';
    cur.style.height  = '18px';
    ring.style.width  = '44px';
    ring.style.height = '44px';
  });
  el.addEventListener('mouseleave', () => {
    cur.style.width   = '10px';
    cur.style.height  = '10px';
    ring.style.width  = '32px';
    ring.style.height = '32px';
  });
});

// ── SCROLL REVEAL ──
const revealObs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('in');
      revealObs.unobserve(e.target);
    }
  });
}, { threshold: 0.08 });

document.querySelectorAll('.sr').forEach(el => revealObs.observe(el));

// ── LIVE FEED SIMULATION ──
const feedMessages = [
  { c: 'var(--safe)',    t: '<strong>Emma</strong> arrived safely home' },
  { c: 'var(--orange)',  t: '<strong>Alert</strong> — Road closure, High Street' },
  { c: 'var(--blue)',    t: '<strong>Tom</strong> is sharing his route home' },
  { c: 'var(--danger)',  t: '<strong>SOS test</strong> completed successfully' },
];
let feedIndex = 0;

setInterval(() => {
  const feed  = document.querySelector('.ops-feed');
  const items = feed.querySelectorAll('.feed-item');

  // Age existing entries
  items.forEach(item => {
    const t = item.querySelector('.feed-time');
    t.textContent = t.textContent === 'now'
      ? '1m'
      : (parseInt(t.textContent) || 0) + 1 + 'm';
  });

  // Remove oldest if over limit
  if (items.length >= 4) items[items.length - 1].remove();

  // Insert new entry at top
  const msg = feedMessages[feedIndex++ % feedMessages.length];
  const div = document.createElement('div');
  div.className = 'feed-item';
  div.innerHTML = `
    <div class="feed-type" style="background:${msg.c};"></div>
    <div class="feed-text">${msg.t}</div>
    <div class="feed-time">now</div>
  `;
  feed.insertBefore(div, items[0]);
}, 7000);