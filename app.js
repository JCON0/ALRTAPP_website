// ── HAMBURGER MENU ──
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');

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