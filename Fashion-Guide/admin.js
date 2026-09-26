// ============================================================
// FASHION GUIDE - Admin Panel
// لوحة التحكم مع إمكانية رفع الصور على GitHub
// ============================================================

// ============================================================
// إعدادات GitHub
// ============================================================
const GITHUB_OWNER  = "MyDigital-ID";
const GITHUB_REPO   = "MyDigital-ID.github.io";
const GITHUB_BRANCH = "main";
const DATA_PATH     = "Fashion-Guide/site-data.json";
const IMAGES_PATH   = "Fashion-Guide/assets/uploads";

const TOKEN_KEY = "fashion_guide_token";
const DATA_API  = `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/${DATA_PATH}`;

let TOKEN = localStorage.getItem(TOKEN_KEY) || "";
let storeData = null;
let currentSha = null;
let pendingImages = {}; // {productId: [File, File, ...]}

const $ = (id) => document.getElementById(id);

// ============================================================
// أدوات مساعدة
// ============================================================
function ghHeaders() {
  return {
    "Authorization": `Bearer ${TOKEN}`,
    "Accept": "application/vnd.github+json"
  };
}

function utf8ToBase64(str) {
  const bytes = new TextEncoder().encode(str);
  let binary = "";
  bytes.forEach(b => binary += String.fromCharCode(b));
  return btoa(binary);
}

function base64ToUtf8(b64) {
  const binary = atob(b64.replace(/\n/g, ""));
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return new TextDecoder().decode(bytes);
}

function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const b64 = reader.result.split(",")[1];
      resolve(b64);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

// تصغير الصورة قبل الرفع
function compressImage(file, maxSize = 1200, quality = 0.85) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        let w = img.width, h = img.height;
        if (w > maxSize || h > maxSize) {
          if (w > h) { h = (maxSize / w) * h; w = maxSize; }
          else { w = (maxSize / h) * w; h = maxSize; }
        }
        const canvas = document.createElement("canvas");
        canvas.width = w;
        canvas.height = h;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, w, h);
        canvas.toBlob((blob) => {
          const reader2 = new FileReader();
          reader2.onload = () => resolve(reader2.result.split(",")[1]);
          reader2.onerror = reject;
          reader2.readAsDataURL(blob);
        }, "image/jpeg", quality);
      };
      img.onerror = reject;
      img.src = e.target.result;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

function showStatus(msg, type = "ok") {
  const el = $("statusMsg");
  el.textContent = msg;
  el.className = "show " + type;
  setTimeout(() => { el.className = ""; }, 4000);
}

function showLoading(text = "جاري التحميل...") {
  $("loadingText").textContent = text;
  $("loadingOverlay").classList.add("show");
}

function hideLoading() {
  $("loadingOverlay").classList.remove("show");
}

function uid(prefix = "id") {
  return prefix + "_" + Date.now() + "_" + Math.random().toString(36).slice(2, 6);
}

// ============================================================
// GitHub API
// ============================================================
async function fetchFromGitHub() {
  const res = await fetch(`${DATA_API}?ref=${GITHUB_BRANCH}&t=${Date.now()}`, {
    headers: ghHeaders()
  });
  if (res.status === 401) throw new Error("UNAUTHORIZED");
  if (!res.ok) throw new Error("GitHub error " + res.status);
  const info = await res.json();
  currentSha = info.sha;
  return JSON.parse(base64ToUtf8(info.content));
}

async function saveDataToGitHub() {
  const newContent = JSON.stringify(storeData, null, 2);
  const res = await fetch(DATA_API, {
    method: "PUT",
    headers: { ...ghHeaders(), "Content-Type": "application/json" },
    body: JSON.stringify({
      message: "Update site-data.json via FASHION GUIDE admin",
      content: utf8ToBase64(newContent),
      sha: currentSha,
      branch: GITHUB_BRANCH
    })
  });
  const out = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(out.message || ("Save error " + res.status));
  currentSha = out.content.sha;
}

// رفع صورة على GitHub
async function uploadImageToGitHub(base64Content, fileName) {
  const path = `${IMAGES_PATH}/${fileName}`;
  const url = `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/${path}`;
  
  // نشوف لو الصورة موجودة قبل كده
  let sha = null;
  try {
    const check = await fetch(`${url}?ref=${GITHUB_BRANCH}`, { headers: ghHeaders() });
    if (check.ok) {
      const info = await check.json();
      sha = info.sha;
    }
  } catch (e) { /* مش موجودة */ }
  
  const body = {
    message: "Upload image: " + fileName,
    content: base64Content,
    branch: GITHUB_BRANCH
  };
  if (sha) body.sha = sha;
  
  const res = await fetch(url, {
    method: "PUT",
    headers: { ...ghHeaders(), "Content-Type": "application/json" },
    body: JSON.stringify(body)
  });
  
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || "Upload failed");
  }
  
  // نرجّع الرابط المباشر للصورة
  return `https://mydigital-id.github.io/${IMAGES_PATH}/${fileName}`;
}

// ============================================================
// تسجيل الدخول
// ============================================================
$("loginBtn").onclick = login;
$("pwInput").addEventListener("keydown", (e) => { if (e.key === "Enter") login(); });

async function login() {
  const tok = $("pwInput").value.trim();
  if (!tok) return;
  $("loginErr").textContent = "";
  $("loginBtn").textContent = "جاري التحقق...";
  $("loginBtn").disabled = true;
  
  try {
    TOKEN = tok;
    storeData = await fetchFromGitHub();
    localStorage.setItem(TOKEN_KEY, TOKEN);
    $("loginScreen").style.display = "none";
    $("dashboard").classList.add("active");
    renderAll();
    showStatus("تم الدخول بنجاح ✅", "ok");
  } catch (e) {
    if (e.message === "UNAUTHORIZED") {
      $("loginErr").textContent = "التوكن غلط أو مالوش صلاحية";
    } else {
      $("loginErr").textContent = "خطأ: " + e.message;
    }
    $("loginBtn").textContent = "🔓 دخول";
    $("loginBtn").disabled = false;
    TOKEN = "";
  }
}

// محاولة دخول تلقائية لو فيه توكن محفوظ
if (TOKEN) {
  $("pwInput").value = TOKEN;
  login();
}

// ============================================================
// الخروج
// ============================================================
$("logoutBtn").onclick = () => {
  if (!confirm("هيتم مسح التوكن. متأكد؟")) return;
  localStorage.removeItem(TOKEN_KEY);
  location.reload();
};

// ============================================================
// تحديث البيانات
// ============================================================
$("reloadBtn").onclick = async () => {
  if (!confirm("هيتم تجاهل أي تعديل غير محفوظ. متأكد؟")) return;
  showLoading("جاري التحديث...");
  try {
    storeData = await fetchFromGitHub();
    renderAll();
    showStatus("تم التحديث ✅", "ok");
  } catch (e) {
    showStatus("فشل التحديث: " + e.message, "err");
  }
  hideLoading();
};

// ============================================================
// حفظ التعديلات
// ============================================================
async function saveAll() {
  showLoading("جاري حفظ التعديلات على GitHub...");
  try {
    // 1. ارفع الصور المعلقة الأول
    const pendingCount = Object.values(pendingImages).reduce((a, arr) => a + arr.length, 0);
    if (pendingCount > 0) {
      showLoading(`جاري رفع ${pendingCount} صورة...`);
      await uploadAllPendingImages();
    }
    
    // 2. احفظ البيانات
    showLoading("جاري حفظ البيانات...");
    await saveDataToGitHub();
    showStatus("تم الحفظ ✅ التحديث هيظهر خلال دقيقة", "ok");
    pendingImages = {};
  } catch (e) {
    showStatus("فشل الحفظ: " + e.message, "err");
  }
  hideLoading();
}

$("saveBtn").onclick = saveAll;
$("saveBtnBottom").onclick = saveAll;

async function uploadAllPendingImages() {
  for (const productId of Object.keys(pendingImages)) {
    const files = pendingImages[productId];
    if (!files || files.length === 0) continue;
    
    // دوّر على المنتج في كل الأقسام
    let product = null;
    for (const cat of storeData.categories) {
      const p = cat.products.find(pp => pp.id === productId);
      if (p) { product = p; break; }
    }
    if (!product) continue;
    
    if (!product.images) product.images = [];
    
    for (const file of files) {
      const ext = (file.name.split(".").pop() || "jpg").toLowerCase();
      const fileName = `${productId}_${Date.now()}_${Math.random().toString(36).slice(2, 6)}.${ext}`;
      showLoading(`جاري رفع صورة: ${file.name}...`);
      const b64 = await compressImage(file);
      const url = await uploadImageToGitHub(b64, fileName);
      product.images.push(url);
    }
  }
}

// ============================================================
// عرض كل حاجة
// ============================================================
function renderAll() {
  renderConfig();
  renderZones();
}

// ============================================================
// إعدادات عامة
// ============================================================
const CONFIG_FIELDS = [
  ["brand_ar", "اسم المتجر (عربي)"],
  ["brand_en", "اسم المتجر (English)"],
  ["tagline_ar", "الشعار (عربي)"],
  ["about_ar", "نبذة عن المتجر (عربي)", true],
  ["about_en", "نبذة (English)", true],
  ["whatsappNumber", "رقم واتساب الطلب (بالصيغة الدولية، مثال: 201234567890)"],
  ["address_ar", "العنوان (عربي)", true],
  ["address_en", "العنوان (English)", true],
  ["mapUrl", "رابط خرائط جوجل"],
  ["rights_ar", "جملة حقوق الملكية"]
];

function renderConfig() {
  const wrap = $("configFields");
  wrap.innerHTML = "";
  const cfg = storeData.config;
  
  CONFIG_FIELDS.forEach(([key, label, isArea]) => {
    const lbl = document.createElement("label");
    lbl.textContent = label;
    wrap.appendChild(lbl);
    
    const input = document.createElement(isArea ? "textarea" : "input");
    if (!isArea) input.type = "text";
    input.value = cfg[key] || "";
    input.oninput = () => { cfg[key] = input.value; };
    wrap.appendChild(input);
  });
  
  // أرقام التليفونات
  const phonesLbl = document.createElement("label");
  phonesLbl.textContent = "أرقام التليفونات";
  wrap.appendChild(phonesLbl);
  
  const phonesWrap = document.createElement("div");
  wrap.appendChild(phonesWrap);
  
  function renderPhones() {
    phonesWrap.innerHTML = "";
    (cfg.phones || []).forEach((phone, i) => {
      const row = document.createElement("div");
      row.style.cssText = "display:flex;gap:8px;margin-top:6px;align-items:center";
      
      const inp = document.createElement("input");
      inp.type = "text";
      inp.value = phone;
      inp.oninput = () => { cfg.phones[i] = inp.value; };
      
      const del = document.createElement("button");
      del.className = "btn-danger";
      del.textContent = "✕";
      del.onclick = () => { cfg.phones.splice(i, 1); renderPhones(); };
      
      row.appendChild(inp);
      row.appendChild(del);
      phonesWrap.appendChild(row);
    });
  }
  
  if (!cfg.phones) cfg.phones = [];
  renderPhones();
  
  const addPhoneBtn = document.createElement("button");
  addPhoneBtn.className = "btn-add";
  addPhoneBtn.textContent = "+ إضافة رقم";
  addPhoneBtn.onclick = () => { cfg.phones.push(""); renderPhones(); };
  wrap.appendChild(addPhoneBtn);
}
// ============================================================
// عرض الأقسام
// ============================================================
function renderZones() {
  const wrap = $("zonesWrap");
  wrap.innerHTML = "";
  
  if (!storeData.categories) storeData.categories = [];
  
  storeData.categories.forEach((cat, idx) => {
    wrap.appendChild(buildZoneCard(cat, idx));
  });
}

function buildZoneCard(cat, idx) {
  const card = document.createElement("div");
  card.className = "card";
  
  // ====== العنوان ======
  const title = document.createElement("div");
  title.className = "card-title";
  
  const info = document.createElement("div");
  info.className = "title-info";
  info.innerHTML = `
    <span class="zone-icon">${cat.icon || "📦"}</span>
    <span>${cat.name_ar || "(قسم بدون اسم)"}</span>
    <span class="type-badge">${(cat.products || []).length} منتج</span>
    <span class="toggle-chev">▼</span>
  `;
  
  const actions = document.createElement("div");
  actions.style.cssText = "display:flex;gap:6px;align-items:center;flex-wrap:wrap";
  
  // زرار الإخفاء/التفعيل
  const visToggle = document.createElement("div");
  visToggle.className = "vis-toggle " + (cat.visible !== false ? "on" : "off");
  visToggle.textContent = cat.visible !== false ? "👁️ ظاهر" : "🚫 مخفي";
  visToggle.onclick = (e) => {
    e.stopPropagation();
    cat.visible = cat.visible === false ? true : false;
    visToggle.className = "vis-toggle " + (cat.visible !== false ? "on" : "off");
    visToggle.textContent = cat.visible !== false ? "👁️ ظاهر" : "🚫 مخفي";
  };
  
  // زرار حذف القسم
  const delBtn = document.createElement("button");
  delBtn.className = "btn-danger";
  delBtn.textContent = "🗑️ حذف القسم";
  delBtn.onclick = (e) => {
    e.stopPropagation();
    if (!confirm(`متأكد من حذف قسم "${cat.name_ar}"؟`)) return;
    storeData.categories.splice(idx, 1);
    renderZones();
  };
  
  actions.appendChild(visToggle);
  actions.appendChild(delBtn);
  
  title.appendChild(info);
  title.appendChild(actions);
  card.appendChild(title);
  
  // ====== الجسم ======
  const body = document.createElement("div");
  body.className = "zone-body";
  
  info.onclick = () => {
    body.classList.toggle("open");
    title.querySelector(".toggle-chev").classList.toggle("open");
  };
  
  // حقول القسم
  body.appendChild(fieldRow("اسم القسم (عربي)", cat.name_ar, (v) => { cat.name_ar = v; info.querySelector("span:nth-child(2)").textContent = v; }));
  body.appendChild(fieldRow("اسم القسم (English)", cat.name_en, (v) => { cat.name_en = v; }));
  body.appendChild(fieldRow("أيقونة (إيموجي)", cat.icon, (v) => { cat.icon = v; info.querySelector(".zone-icon").textContent = v; }));
  body.appendChild(fieldRow("صورة القسم في الرئيسية (رابط أو رفع من الصور)", cat.homeImg, (v) => { cat.homeImg = v; }));
  
  // أزرار سريعة لرفع صورة القسم الرئيسية
  const homeImgActions = document.createElement("div");
  homeImgActions.style.cssText = "display:flex;gap:8px;margin-top:8px";
  
  const uploadHomeBtn = document.createElement("button");
  uploadHomeBtn.className = "btn-secondary";
  uploadHomeBtn.style.fontSize = "0.8rem";
  uploadHomeBtn.textContent = "📤 رفع صورة الرئيسية";
  const homeFile = document.createElement("input");
  homeFile.type = "file";
  homeFile.accept = "image/*";
  homeFile.style.display = "none";
  uploadHomeBtn.onclick = () => homeFile.click();
  homeFile.onchange = async (e) => {
    const f = e.target.files[0];
    if (!f) return;
    showLoading("جاري رفع صورة القسم...");
    try {
      const b64 = await compressImage(f);
      const ext = (f.name.split(".").pop() || "jpg").toLowerCase();
      const fileName = `cat_${cat.id}_${Date.now()}.${ext}`;
      const url = await uploadImageToGitHub(b64, fileName);
      cat.homeImg = url;
      renderZones();
      // فتح القسم تاني بعد إعادة العرض
      setTimeout(() => {
        const newCard = document.querySelectorAll(".card")[idx + 1];
        if (newCard) {
          newCard.querySelector(".zone-body").classList.add("open");
          newCard.querySelector(".toggle-chev").classList.add("open");
        }
      }, 100);
      showStatus("تم رفع الصورة ✅", "ok");
    } catch (err) {
      showStatus("فشل الرفع: " + err.message, "err");
    }
    hideLoading();
  };
  
  homeImgActions.appendChild(uploadHomeBtn);
  homeImgActions.appendChild(homeFile);
  body.appendChild(homeImgActions);
  
  // ====== عنوان المنتجات ======
  const prodsLabel = document.createElement("label");
  prodsLabel.style.cssText = "margin-top:20px;font-size:1rem;color:var(--bg)";
  prodsLabel.textContent = "🛍️ المنتجات:";
  body.appendChild(prodsLabel);
  
  // ====== قائمة المنتجات ======
  const prodsWrap = document.createElement("div");
  body.appendChild(prodsWrap);
  
  function rerender() {
    renderProductsAdmin(prodsWrap, cat, rerender);
  }
  rerender();
  
  // ====== زرار إضافة منتج ======
  const addProdBtn = document.createElement("button");
  addProdBtn.className = "btn-add";
  addProdBtn.textContent = "+ إضافة منتج جديد";
  addProdBtn.onclick = () => {
    if (!cat.products) cat.products = [];
    cat.products.push({
      id: uid("p"),
      name_ar: "",
      name_en: "",
      desc_ar: "",
      desc_en: "",
      price: 0,
      price_xxxl: 0,
      sizes: [],
      images: []
    });
    rerender();
    // تحديث شارة العدد
    info.querySelector(".type-badge").textContent = cat.products.length + " منتج";
  };
  body.appendChild(addProdBtn);
  
  card.appendChild(body);
  return card;
}

// ============================================================
// حقول مساعدة
// ============================================================
function fieldRow(label, value, onChange) {
  const wrap = document.createElement("div");
  const lbl = document.createElement("label");
  lbl.textContent = label;
  const input = document.createElement("input");
  input.type = "text";
  input.value = value || "";
  input.oninput = () => onChange(input.value);
  wrap.appendChild(lbl);
  wrap.appendChild(input);
  return wrap;
}

// ============================================================
// عرض المنتجات
// ============================================================
const SIZE_PRESETS = {
  clothing: ["S", "M", "L", "XL", "XXL", "XXXL"],
  pants: ["S", "M", "L", "XL", "XXL"],
  shoes: ["40", "41", "42", "43", "44", "45", "46"],
  belts: ["M", "L", "XL", "XXL"],
  kids: ["2Y", "3Y", "4Y", "5Y", "6Y", "7Y", "8Y"],
  one: ["Standard"]
};

function renderProductsAdmin(container, cat, rerender) {
  container.innerHTML = "";
  
  if (!cat.products || cat.products.length === 0) {
    const empty = document.createElement("p");
    empty.style.cssText = "text-align:center;color:var(--text-muted);padding:16px;font-size:0.85rem";
    empty.textContent = "لا توجد منتجات - اضغط على + لإضافة منتج";
    container.appendChild(empty);
    return;
  }
  
  cat.products.forEach((prod, pIdx) => {
    container.appendChild(buildProductCard(prod, pIdx, cat, rerender));
  });
}

function buildProductCard(prod, pIdx, cat, rerender) {
  const box = document.createElement("div");
  box.className = "item-box";
  
  // رقم المنتج
  const num = document.createElement("div");
  num.className = "item-num";
  num.textContent = "#" + (pIdx + 1);
  box.appendChild(num);
  
  // أزرار الإجراءات
  const acts = document.createElement("div");
  acts.className = "item-actions";
  
  const delBtn = document.createElement("button");
  delBtn.className = "btn-danger";
  delBtn.textContent = "🗑️ حذف";
  delBtn.onclick = () => {
    if (!confirm(`حذف "${prod.name_ar || 'المنتج'}"؟`)) return;
    cat.products.splice(pIdx, 1);
    rerender();
  };
  acts.appendChild(delBtn);
  box.appendChild(acts);
  
  // حقول الاسم والوصف
  box.appendChild(fieldRow("الاسم (عربي)", prod.name_ar, (v) => { prod.name_ar = v; }));
  box.appendChild(fieldRow("الاسم (English)", prod.name_en, (v) => { prod.name_en = v; }));
  box.appendChild(fieldRow("وصف مختصر (اختياري)", prod.desc_ar, (v) => { prod.desc_ar = v; }));
  
  // الأسعار
  const priceRow = document.createElement("div");
  priceRow.className = "row-2";
  
  const p1 = document.createElement("div");
  const l1 = document.createElement("label");
  l1.textContent = "السعر العام";
  const i1 = document.createElement("input");
  i1.type = "number";
  i1.value = prod.price || 0;
  i1.oninput = () => { prod.price = parseFloat(i1.value) || 0; };
  p1.appendChild(l1); p1.appendChild(i1);
  
  const p2 = document.createElement("div");
  const l2 = document.createElement("label");
  l2.textContent = "سعر XXXL (اختياري)";
  const i2 = document.createElement("input");
  i2.type = "number";
  i2.value = prod.price_xxxl || 0;
  i2.oninput = () => { prod.price_xxxl = parseFloat(i2.value) || 0; };
  p2.appendChild(l2); p2.appendChild(i2);
  
  priceRow.appendChild(p1); priceRow.appendChild(p2);
  box.appendChild(priceRow);
  
  // الصور
  box.appendChild(buildImagesSection(prod, rerender));
  
  // المقاسات
  box.appendChild(buildSizesSection(prod, rerender));
  
  return box;
}

// ============================================================
// قسم الصور
// ============================================================
function buildImagesSection(prod, rerender) {
  const wrap = document.createElement("div");
  
  const lbl = document.createElement("label");
  lbl.textContent = "📷 صور المنتج";
  wrap.appendChild(lbl);
  
  const hint = document.createElement("p");
  hint.style.cssText = "font-size:0.7rem;color:var(--text-muted);margin-bottom:6px";
  hint.textContent = "أضف صورة أو أكثر — يمكنك استخدام صورة واحدة، أو صور متعددة (ألوان / زوايا مختلفة)";
  wrap.appendChild(hint);
  
  const grid = document.createElement("div");
  grid.className = "images-grid";
  
  // الصور الموجودة
  if (!prod.images) prod.images = [];
  prod.images.forEach((imgUrl, i) => {
    const thumb = document.createElement("div");
    thumb.className = "img-thumb";
    
    const img = document.createElement("img");
    img.src = imgUrl;
    img.alt = "صورة " + (i + 1);
    img.onerror = () => { img.style.opacity = "0.3"; };
    
    const del = document.createElement("button");
    del.className = "img-del";
    del.textContent = "✕";
    del.onclick = () => {
      if (!confirm("حذف هذه الصورة؟")) return;
      prod.images.splice(i, 1);
      rerender();
    };
    
    thumb.appendChild(img);
    thumb.appendChild(del);
    grid.appendChild(thumb);
  });
  
  // الصور المعلقة (لسه ما اترفعتش)
  const pending = pendingImages[prod.id] || [];
  pending.forEach((file, i) => {
    const thumb = document.createElement("div");
    thumb.className = "img-thumb";
    thumb.style.borderColor = "var(--orange)";
    
    const img = document.createElement("img");
    img.src = URL.createObjectURL(file);
    
    const del = document.createElement("button");
    del.className = "img-del";
    del.textContent = "✕";
    del.onclick = () => {
      pendingImages[prod.id].splice(i, 1);
      if (pendingImages[prod.id].length === 0) delete pendingImages[prod.id];
      rerender();
    };
    
    const badge = document.createElement("div");
    badge.style.cssText = "position:absolute;bottom:2px;left:2px;background:var(--orange);color:#fff;font-size:0.6rem;padding:2px 6px;border-radius:6px;font-weight:900";
    badge.textContent = "قيد الرفع";
    
    thumb.appendChild(img);
    thumb.appendChild(del);
    thumb.appendChild(badge);
    grid.appendChild(thumb);
  });
  
  // زرار الإضافة
  const addBtn = document.createElement("div");
  addBtn.className = "img-add-btn";
  addBtn.innerHTML = `📷<small>إضافة صورة</small>`;
  
  const fileInput = document.createElement("input");
  fileInput.type = "file";
  fileInput.accept = "image/*";
  fileInput.multiple = true;
  
  addBtn.onclick = () => fileInput.click();
  fileInput.onchange = (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;
    if (!pendingImages[prod.id]) pendingImages[prod.id] = [];
    files.forEach(f => pendingImages[prod.id].push(f));
    rerender();
  };
  
  grid.appendChild(addBtn);
  wrap.appendChild(grid);
  wrap.appendChild(fileInput);
  
  return wrap;
}

// ============================================================
// قسم المقاسات
// ============================================================
function buildSizesSection(prod, rerender) {
  const wrap = document.createElement("div");
  
  const lbl = document.createElement("label");
  lbl.textContent = "📏 المقاسات";
  wrap.appendChild(lbl);
  
  const hint = document.createElement("p");
  hint.style.cssText = "font-size:0.7rem;color:var(--text-muted);margin-bottom:6px";
  hint.textContent = "اضغط على المقاس لإضافته — اضغط على ✕ لحذفه";
  wrap.appendChild(hint);
  
  // المقاسات المختارة حالياً
  const selectedWrap = document.createElement("div");
  selectedWrap.className = "selected-sizes";
  
  if (!prod.sizes) prod.sizes = [];
  prod.sizes.forEach((sz, i) => {
    const chip = document.createElement("span");
    chip.className = "selected-size";
    chip.innerHTML = `${sz} <button class="sz-del">✕</button>`;
    chip.querySelector(".sz-del").onclick = () => {
      prod.sizes.splice(i, 1);
      rerender();
    };
    selectedWrap.appendChild(chip);
  });
  
  wrap.appendChild(selectedWrap);
  
  // المقاسات الجاهزة
  const presetsLbl = document.createElement("p");
  presetsLbl.style.cssText = "font-size:0.75rem;color:var(--text-muted);margin-top:12px;margin-bottom:4px;font-weight:900";
  presetsLbl.textContent = "المقاسات الجاهزة (اضغط للإضافة):";
  wrap.appendChild(presetsLbl);
  
  const chipsWrap = document.createElement("div");
  chipsWrap.className = "size-chips";
  
  // نجمع كل المقاسات من كل الفئات
  const allPresets = [];
  Object.values(SIZE_PRESETS).forEach(arr => {
    arr.forEach(sz => {
      if (!allPresets.includes(sz)) allPresets.push(sz);
    });
  });
  
  allPresets.forEach(sz => {
    const chip = document.createElement("button");
    chip.className = "size-chip";
    chip.textContent = sz;
    if (prod.sizes.includes(sz)) chip.classList.add("selected");
    chip.onclick = () => {
      if (prod.sizes.includes(sz)) {
        prod.sizes = prod.sizes.filter(s => s !== sz);
      } else {
        prod.sizes.push(sz);
      }
      rerender();
    };
    chipsWrap.appendChild(chip);
  });
  
  wrap.appendChild(chipsWrap);
  
  // إضافة مقاس مخصص
  const customWrap = document.createElement("div");
  customWrap.style.cssText = "display:flex;gap:6px;margin-top:8px";
  
  const customInput = document.createElement("input");
  customInput.type = "text";
  customInput.placeholder = "مقاس مخصص (مثال: 4XL)";
  customInput.style.flex = "1";
  
  const customBtn = document.createElement("button");
  customBtn.className = "btn-secondary";
  customBtn.textContent = "+ إضافة";
  customBtn.onclick = () => {
    const v = customInput.value.trim();
    if (!v) return;
    if (!prod.sizes.includes(v)) prod.sizes.push(v);
    customInput.value = "";
    rerender();
  };
  
  customWrap.appendChild(customInput);
  customWrap.appendChild(customBtn);
  wrap.appendChild(customWrap);
  
  return wrap;
}

// ============================================================
// إضافة قسم جديد
// ============================================================
$("addZoneBtn").onclick = () => {
  const name = prompt("اسم القسم بالعربي:");
  if (!name) return;
  const nameEn = prompt("اسم القسم بالإنجليزي (اختياري):") || "";
  const icon = prompt("أيقونة (إيموجي، اختياري):", "🛍️") || "🛍️";
  
  if (!storeData.categories) storeData.categories = [];
  storeData.categories.push({
    id: uid("cat"),
    icon: icon,
    name_ar: name,
    name_en: nameEn,
    homeImg: "",
    visible: true,
    products: []
  });
  
  renderZones();
  showStatus("تم إضافة القسم — لا تنسَ الحفظ 💾", "ok");
};
// ============================================================
// إغلاق الـ Loading لو حصل خطأ في الشبكة
// ============================================================
window.addEventListener("online", () => {
  if ($("loadingOverlay").classList.contains("show")) {
    hideLoading();
  }
});

// ============================================================
// تحذير قبل الخروج لو فيه تعديلات غير محفوظة
// ============================================================
window.addEventListener("beforeunload", (e) => {
  const hasPendingImages = Object.keys(pendingImages).length > 0;
  if (hasPendingImages) {
    e.preventDefault();
    e.returnValue = "";
  }
});

// ============================================================
// انتهى الملف ✅
// ============================================================
console.log("🎛️ FASHION GUIDE Admin Panel loaded");

// ============================================================
// زر إظهار/إخفاء التوكن
// ============================================================
const togglePw = document.getElementById("togglePw");
if (togglePw) {
  togglePw.onclick = () => {
    const inp = document.getElementById("pwInput");
    if (inp.type === "password") {
      inp.type = "text";
      togglePw.textContent = "🙈";
    } else {
      inp.type = "password";
      togglePw.textContent = "👁️";
    }
  };
}