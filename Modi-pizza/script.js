const MENU = loadMenu();
let LANG = "ar";
let cart = []; // {key, name, size, price, qty}
let cartLineId = 0;

/* ---------- Language ---------- */
function applyLang(){
  document.documentElement.lang = LANG;
  document.documentElement.dir = LANG === "ar" ? "rtl" : "ltr";
  document.querySelectorAll("[data-ar]").forEach(el=>{
    el.textContent = LANG === "ar" ? el.dataset.ar : el.dataset.en;
  });
  document.getElementById("langBtn").textContent = LANG === "ar" ? "EN" : "AR";
  renderZones();
}
document.getElementById("langBtn").addEventListener("click", ()=>{
  LANG = LANG === "ar" ? "en" : "ar";
  applyLang();
});

/* ---------- Side Menu ---------- */
const sideMenu = document.getElementById("sideMenu");
const sideOverlay = document.getElementById("sideOverlay");
function openSide(){ sideMenu.classList.add("open"); sideOverlay.classList.add("show"); }
function closeSide(){ sideMenu.classList.remove("open"); sideOverlay.classList.remove("show"); }
document.getElementById("menuBtn").addEventListener("click", openSide);
document.getElementById("closeMenu").addEventListener("click", closeSide);
sideOverlay.addEventListener("click", ()=>{ closeSide(); closeCartDrawer(); });

document.querySelectorAll(".side-link").forEach(link=>{
  link.addEventListener("click",(e)=>{
    e.preventDefault();
    const nav = link.dataset.nav;
    document.getElementById("aboutBox").classList.add("hidden");
    document.getElementById("contactBox").classList.add("hidden");
    if(nav === "about") document.getElementById("aboutBox").classList.remove("hidden");
    if(nav === "contact") document.getElementById("contactBox").classList.remove("hidden");
    if(nav === "home"){ closeSide(); showHome(); }
  });
});
document.getElementById("brandHome").addEventListener("click", showHome);

/* ---------- Home / Section navigation ---------- */
const viewHome = document.getElementById("view-home");
const viewSection = document.getElementById("view-section");

function renderZones(){
  const grid = document.getElementById("zonesGrid");
  grid.innerHTML = "";
  MENU.zones.forEach(z=>{
    const card = document.createElement("button");
    card.className = "zone-card";
    card.innerHTML = `
      <img src="${z.image}" alt="${z.name_ar}" onerror="this.style.opacity=0">
      <span>${LANG === "ar" ? z.name_ar : z.name_en}</span>`;
    card.addEventListener("click", ()=> openSection(z.id));
    grid.appendChild(card);
  });
}

function showHome(){
  viewSection.classList.add("hidden");
  viewHome.classList.remove("hidden");
  window.scrollTo(0,0);
}

function openSection(zoneId){
  const zone = MENU.zones.find(z=>z.id===zoneId);
  const items = MENU.items[zoneId] || [];
  viewHome.classList.add("hidden");
  viewSection.classList.remove("hidden");
  window.scrollTo(0,0);

  document.getElementById("sectionTitle").textContent = LANG==="ar" ? zone.name_ar : zone.name_en;

  const vidBox = document.querySelector(".section-video-box");
  const vid = document.getElementById("sectionVideo");
  vid.src = zone.video;
  vidBox.classList.toggle("ratio169", !!zone.ratio169);
  vid.loop = false;
  vid.play().catch(()=>{});
  vid.onended = ()=>{ vid.pause(); }; // freeze on last frame, no repeat

  const list = document.getElementById("itemsList");
  list.innerHTML = "";

  items.forEach(item=>{
    const row = document.createElement("div");
    row.className = "item-row";
    const descHtml = item.desc_ar ? `<div class="item-desc">${item.desc_ar}</div>` : "";

    if(!item.sizes){
      // صنف بسعر واحد + كمية (المكرونات ووتش فطير)
      row.innerHTML = `
        <div class="item-name">${LANG==="ar"?item.name_ar:item.name_en}</div>
        ${descHtml}
        <div class="item-controls">
          <span class="item-price">${item.price} <small>${LANG==="ar"?"ج.م":"EGP"}</small></span>
          <div class="qty-box">
            <button class="qty-btn minus">−</button>
            <span class="qty-val">1</span>
            <button class="qty-btn plus">+</button>
          </div>
          <button class="add-btn">${LANG==="ar"?"أضف":"Add"}</button>
        </div>`;
      const qtyVal = row.querySelector(".qty-val");
      row.querySelector(".plus").onclick = ()=> qtyVal.textContent = +qtyVal.textContent + 1;
      row.querySelector(".minus").onclick = ()=> qtyVal.textContent = Math.max(1, +qtyVal.textContent - 1);
      row.querySelector(".add-btn").onclick = ()=>{
        addToCart({
          name: LANG==="ar"?item.name_ar:item.name_en,
          size: "",
          price: item.price,
          qty: +qtyVal.textContent
        });
      };
    } else {
      const sizesHtml = item.sizes.map((s,i)=>`
        <button class="size-btn" data-idx="${i}">
          ${LANG==="ar"?s.label_ar:s.label_en} — ${s.price} ${LANG==="ar"?"ج.م":"EGP"}
        </button>`).join("");
      row.innerHTML = `
        <div class="item-name">${LANG==="ar"?item.name_ar:item.name_en}</div>
        ${descHtml}
        <div class="item-controls sizes">${sizesHtml}</div>`;
      row.querySelectorAll(".size-btn").forEach(btn=>{
        btn.onclick = ()=>{
          const s = item.sizes[+btn.dataset.idx];
          addToCart({
            name: LANG==="ar"?item.name_ar:item.name_en,
            size: LANG==="ar"?s.label_ar:s.label_en,
            price: s.price,
            qty: 1
          });
        };
      });
    }
    list.appendChild(row);
  });
}
document.getElementById("backBtn").addEventListener("click", showHome);

/* ---------- Cart ---------- */
const cartDrawer = document.getElementById("cartDrawer");
const cartOverlay = document.getElementById("cartOverlay");
function openCartDrawer(){ cartDrawer.classList.add("open"); cartOverlay.classList.add("show"); }
function closeCartDrawer(){ cartDrawer.classList.remove("open"); cartOverlay.classList.remove("show"); }
document.getElementById("cartBtn").addEventListener("click", openCartDrawer);
document.getElementById("closeCart").addEventListener("click", closeCartDrawer);
cartOverlay.addEventListener("click", closeCartDrawer);

function addToCart(line){
  line.id = "c" + (cartLineId++);
  cart.push(line);
  renderCart();
  openCartDrawer();
}

function removeFromCart(id){
  cart = cart.filter(l=>l.id!==id);
  renderCart();
}

function renderCart(){
  const box = document.getElementById("cartItems");
  box.innerHTML = "";
  if(cart.length === 0){
    box.innerHTML = `<p class="empty-cart" data-ar="السلة فارغة" data-en="Your cart is empty">${LANG==="ar"?"السلة فارغة":"Your cart is empty"}</p>`;
  }
  cart.forEach(line=>{
    const row = document.createElement("div");
    row.className = "cart-line";
    row.innerHTML = `
      <div class="cart-line-info">
        <strong>${line.qty} × ${line.name}${line.size ? " ("+line.size+")" : ""}</strong>
        <span>${line.price * line.qty} ${LANG==="ar"?"ج.م":"EGP"}</span>
      </div>
      <button class="remove-line" aria-label="remove">✕</button>`;
    row.querySelector(".remove-line").onclick = ()=> removeFromCart(line.id);
    box.appendChild(row);
  });

  document.getElementById("cartCount").textContent = cart.reduce((a,l)=>a+l.qty,0);
  document.getElementById("cartTotal").textContent = cart.reduce((a,l)=>a+l.price*l.qty,0);
}

/* ---------- Add-ons ---------- */
function renderAddons(){
  const grid = document.getElementById("addonsGrid");
  grid.innerHTML = "";
  MENU.addons.forEach(a=>{
    const btn = document.createElement("button");
    btn.className = "addon-btn";
    btn.textContent = (LANG==="ar"?a.name_ar:a.name_en) + " +" + MENU.addonPrice;
    btn.onclick = ()=>{
      addToCart({ name: LANG==="ar"?a.name_ar:a.name_en, size: LANG==="ar"?"إضافة":"Add-on", price: MENU.addonPrice, qty: 1 });
    };
    grid.appendChild(btn);
  });
}

/* ---------- Send order via WhatsApp ---------- */
document.getElementById("sendOrderBtn").addEventListener("click", ()=>{
  if(cart.length === 0) return;
  let msg = LANG==="ar" ? "طلب جديد من بيتزا مودي:%0A" : "New order from Pizza Modi:%0A";
  cart.forEach(l=>{
    msg += `${l.qty} × ${l.name}${l.size?" ("+l.size+")":""} - ${l.price*l.qty} ${LANG==="ar"?"ج.م":"EGP"}%0A`;
  });
  const total = cart.reduce((a,l)=>a+l.price*l.qty,0);
  msg += (LANG==="ar" ? "الإجمالي: " : "Total: ") + total + (LANG==="ar"?" ج.م":" EGP");
  window.open(`https://wa.me/201205154025?text=${msg}`, "_blank");
});

/* ---------- Install prompt ---------- */
let deferredPrompt;
window.addEventListener("beforeinstallprompt", (e)=>{
  e.preventDefault();
  deferredPrompt = e;
  const lastDismiss = sessionStorage.getItem("installDismissed");
  if(!lastDismiss){
    document.getElementById("installPrompt").classList.remove("hidden");
  }
});
document.getElementById("installNowBtn").addEventListener("click", async ()=>{
  document.getElementById("installPrompt").classList.add("hidden");
  if(deferredPrompt){ deferredPrompt.prompt(); await deferredPrompt.userChoice; deferredPrompt = null; }
});
document.getElementById("installLaterBtn").addEventListener("click", ()=>{
  document.getElementById("installPrompt").classList.add("hidden");
  // يظهر البروبمت تاني في الزيارة الجاية لأننا مش بنخزنه بشكل دائم
  sessionStorage.setItem("installDismissed","1");
});

/* ---------- Init ---------- */
renderZones();
renderCart();
renderAddons();
applyLang();
