let SITE = null;
let cart = []; // {key, name, price, qty, weightLabel}

const app = document.getElementById('app');

async function init() {
  const res = await fetch('data.json?v=' + Date.now());
  SITE = await res.json();
  renderShell();
  renderHome();
  renderZones();
  history.replaceState({ view: 'home' }, '', location.pathname);
}

function renderShell() {
  document.title = SITE.siteName;
  document.getElementById('brand-mark').textContent = SITE.siteName;
  document.getElementById('footer-rights').textContent = SITE.footerRights;
  document.getElementById('footer-fingerprint').href = SITE.poweredByLink;
  document.getElementById('sidebar-about').textContent = SITE.about;
  document.getElementById('sidebar-whatsapp').textContent = SITE.whatsappDisplay;
  document.getElementById('sidebar-whatsapp').href = 'https://wa.me/' + SITE.whatsapp;
  const mapFrame = document.getElementById('map-frame');
  mapFrame.src = `https://maps.google.com/maps?q=${SITE.coordinates.lat},${SITE.coordinates.lng}&z=16&output=embed`;
  document.getElementById('sidebar-map-link').href = `https://maps.google.com/?q=${SITE.coordinates.lat},${SITE.coordinates.lng}`;
}

function renderHome() {
  const grid = document.getElementById('category-grid');
  grid.innerHTML = SITE.categories.map(cat => `
    <button class="category-card" data-zone="${cat.id}" onclick="openZone('${cat.id}')">
      <span class="cat-title">${cat.title}</span>
    </button>
  `).join('');
}

function handleImgError(el) {
  el.onerror = null;
  el.classList.add('img-missing');
  el.src = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==';
}

function money(n) { return n + ' ج'; }

function renderZones() {
  const container = document.getElementById('zones-container');
  container.innerHTML = SITE.categories.map(cat => renderZone(cat)).join('');
}

function renderZone(cat) {
  let headerHtml = '';
  if (cat.type === 'items-with-images' && cat.items.some(i => i.image) === false) {
    // no images
  }
  if (cat.headerImages && cat.headerImages.length === 1) {
    headerHtml = `<img class="zone-header-img" src="${cat.headerImages[0]}" alt="${cat.title}" onerror="handleImgError(this)">`;
  } else if (cat.headerImages && cat.headerImages.length > 1) {
    headerHtml = `<div class="zone-header-strip">${cat.headerImages.map(src => `<img src="${src}" alt="${cat.title}" onerror="handleImgError(this)">`).join('')}</div>`;
  }

  let bodyHtml = '';
  if (cat.type === 'items-with-images') {
    bodyHtml = `<div class="item-list">${cat.items.map(item => renderItemCard(cat, item)).join('')}</div>`;
  } else if (cat.type === 'items-no-images') {
    bodyHtml = `<div class="item-list">${cat.items.map(item => renderItemCard(cat, item, true)).join('')}</div>`;
  } else if (cat.type === 'hawawshi') {
    bodyHtml = `<div class="item-list">${cat.items.map(item => renderHawawshiItem(cat, item)).join('')}</div>`;
  } else if (cat.type === 'gallery') {
    bodyHtml = `
      <div class="gallery-grid">${cat.gallery.map(src => `<img src="${src}" alt="${cat.title}" onerror="handleImgError(this)">`).join('')}</div>
      <div class="price-note">${cat.priceNote}</div>
    `;
  }

  return `
    <section class="zone-page" id="zone-${cat.id}">
      ${headerHtml}
      <div class="zone-title-bar"><h2>${cat.title}</h2></div>
      ${bodyHtml}
      <button class="home-fab" onclick="goHome()">الرئيسية</button>
    </section>
  `;
}

const selectedQty = {};

function renderItemCard(cat, item, noImage) {
  const key = item.id;
  const imgHtml = noImage ? '' : `<img src="${item.image}" alt="${item.name}" onerror="handleImgError(this)">`;
  let weightHtml = '';
  if (item.byWeight) {
    const labels = { 1: 'كيلو', 0.5: 'نص كيلو', 0.25: 'ربع كيلو' };
    weightHtml = `<div class="weight-select" id="weights-${key}">
      ${item.weights.map((w, i) => `<span class="weight-chip ${i === 0 ? 'selected' : ''}" data-weight="${w}" onclick="selectWeight('${key}', ${w}, this)">${labels[w]}</span>`).join('')}
    </div>`;
  }
  selectedQty[key] = selectedQty[key] || 1;
  return `
    <div class="item-card">
      ${imgHtml}
      <div class="item-info">
        <div class="item-name">${item.name}</div>
        <div class="item-price" id="price-${key}">${money(item.price)}</div>
        ${weightHtml}
      </div>
      <div class="item-controls">
        <div class="qty-control">
          <button onclick="changeQty('${key}', -1)">−</button>
          <span id="qty-${key}">${selectedQty[key]}</span>
          <button onclick="changeQty('${key}', 1)">+</button>
        </div>
        <button class="add-btn" onclick="addToCart('${cat.id}','${key}')">إضافة</button>
      </div>
    </div>
  `;
}

function changeQty(key, delta) {
  selectedQty[key] = Math.max(1, (selectedQty[key] || 1) + delta);
  const span = document.getElementById('qty-' + key);
  if (span) span.textContent = selectedQty[key];
}

function renderHawawshiItem(cat, item) {
  return `
    <div class="hawawshi-item">
      <h3>${item.name}</h3>
      ${cat.tiers.map(tier => `
        <div class="tier-row">
          <span class="tier-name">${tier.name}</span>
          <span class="tier-price">${money(tier.price)}</span>
          <button class="add-btn" onclick="addHawawshi('${item.id}','${item.name}','${tier.id}','${tier.name}',${tier.price})">إضافة</button>
        </div>
      `).join('')}
    </div>
  `;
}

const selectedWeights = {};

function selectWeight(itemKey, weight, el) {
  selectedWeights[itemKey] = weight;
  el.parentElement.querySelectorAll('.weight-chip').forEach(c => c.classList.remove('selected'));
  el.classList.add('selected');
}

function findItem(catId, itemKey) {
  const cat = SITE.categories.find(c => c.id === catId);
  return cat.items.find(i => i.id === itemKey);
}

function addToCart(catId, itemKey) {
  const item = findItem(catId, itemKey);
  let weightLabel = '';
  let price = item.price;
  if (item.byWeight) {
    const w = selectedWeights[itemKey] || item.weights[0];
    const labels = { 1: 'كيلو', 0.5: 'نص كيلو', 0.25: 'ربع كيلو' };
    weightLabel = labels[w];
    price = Math.round(item.price * w);
  }
  const qty = selectedQty[itemKey] || 1;
  const cartKey = itemKey + (weightLabel ? '-' + weightLabel : '');
  const existing = cart.find(c => c.key === cartKey);
  if (existing) { existing.qty += qty; }
  else { cart.push({ key: cartKey, name: item.name, price, qty, weightLabel }); }
  selectedQty[itemKey] = 1;
  const span = document.getElementById('qty-' + itemKey);
  if (span) span.textContent = 1;
  renderCart();
  pulseCartBadge();
}

function addHawawshi(itemId, itemName, tierId, tierName, price) {
  const cartKey = itemId + '-' + tierId;
  const existing = cart.find(c => c.key === cartKey);
  if (existing) { existing.qty++; }
  else { cart.push({ key: cartKey, name: itemName, price, qty: 1, weightLabel: tierName }); }
  renderCart();
  pulseCartBadge();
}

function removeFromCart(key) {
  cart = cart.filter(c => c.key !== key);
  renderCart();
}

function renderCart() {
  const el = document.getElementById('cart-items');
  const totalEl = document.getElementById('cart-total-amount');
  if (cart.length === 0) {
    el.innerHTML = '<div class="cart-empty">السلة فارغة، اختار أصنافك من القائمة</div>';
  } else {
    el.innerHTML = cart.map(c => `
      <div class="cart-item">
        <div>
          <div class="cart-item-name">${c.name}${c.weightLabel ? ' (' + c.weightLabel + ')' : ''}</div>
          <div class="cart-item-meta">${c.qty} × ${money(c.price)}</div>
        </div>
        <button class="cart-item-delete" onclick="removeFromCart('${c.key}')">🗑</button>
      </div>
    `).join('');
  }
  const total = cart.reduce((sum, c) => sum + c.price * c.qty, 0);
  totalEl.textContent = money(total);

  const badge = document.getElementById('cart-badge');
  const count = cart.reduce((s, c) => s + c.qty, 0);
  badge.textContent = count;
  badge.classList.toggle('show', count > 0);

  const waLink = document.getElementById('whatsapp-order-btn');
  if (cart.length === 0) {
    waLink.href = 'https://wa.me/' + SITE.whatsapp;
  } else {
    const lines = cart.map(c => `${c.name}${c.weightLabel ? ' (' + c.weightLabel + ')' : ''} × ${c.qty} = ${money(c.price * c.qty)}`);
    const msg = 'طلب جديد من ' + SITE.siteName + ':\n' + lines.join('\n') + '\nالإجمالي: ' + money(total);
    waLink.href = 'https://wa.me/' + SITE.whatsapp + '?text=' + encodeURIComponent(msg);
  }
}

function pulseCartBadge() {
  const badge = document.getElementById('cart-badge');
  badge.style.transform = 'scale(1.3)';
  setTimeout(() => badge.style.transform = 'scale(1)', 150);
}

/* ---------------- Navigation ---------------- */
function forceScrollTop() {
  window.scrollTo(0, 0);
  let n = 0;
  const iv = setInterval(() => {
    window.scrollTo(0, 0);
    n++;
    if (n > 8) clearInterval(iv);
  }, 50);
}

function openZone(zoneId) {
  document.querySelectorAll('.zone-page').forEach(z => z.classList.remove('active'));
  document.getElementById('zone-' + zoneId).classList.add('active');
  document.getElementById('home-view').classList.remove('active');
  history.pushState({ view: 'zone', zoneId }, '', '#' + zoneId);
  setActiveNav('home');
  forceScrollTop();
}

function goHome() {
  document.querySelectorAll('.zone-page').forEach(z => z.classList.remove('active'));
  document.getElementById('home-view').classList.add('active');
  history.pushState({ view: 'home' }, '', location.pathname);
  setActiveNav('home');
  forceScrollTop();
}

window.addEventListener('popstate', (e) => {
  const state = e.state;
  if (!state || state.view === 'home') {
    document.querySelectorAll('.zone-page').forEach(z => z.classList.remove('active'));
    document.getElementById('home-view').classList.add('active');
  } else if (state.view === 'zone') {
    document.querySelectorAll('.zone-page').forEach(z => z.classList.remove('active'));
    document.getElementById('zone-' + state.zoneId).classList.add('active');
    document.getElementById('home-view').classList.remove('active');
  }
  forceScrollTop();
});

function scrollToCart() {
  goHome();
  setTimeout(() => {
    document.getElementById('cart-section').scrollIntoView({ behavior: 'smooth' });
  }, 100);
  setActiveNav('cart');
}

function openOffersOrFirstZone() {
  const eventsCat = SITE.categories.find(c => c.id === 'events') || SITE.categories[0];
  openZone(eventsCat.id);
  setActiveNav('offers');
}

function toggleSidebar(open) {
  document.getElementById('sidebar').classList.toggle('open', open);
  document.getElementById('sidebar-overlay').classList.toggle('open', open);
  if (open) setActiveNav('menu');
}

function setActiveNav(key) {
  document.querySelectorAll('.bottom-nav button').forEach(b => b.classList.toggle('active', b.dataset.nav === key));
}

/* ---------------- Video freeze on last frame ---------------- */
function setupHeroVideo() {
  const video = document.getElementById('hero-video');
  if (!video) return;
  video.addEventListener('ended', () => {
    video.currentTime = video.duration;
    video.pause();
  });
}

/* ---------------- PWA ---------------- */
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('service-worker.js').catch(() => {});
  });
}

document.addEventListener('DOMContentLoaded', () => {
  init();
  setupHeroVideo();
});
