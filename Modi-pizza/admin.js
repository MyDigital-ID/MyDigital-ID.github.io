const GITHUB_OWNER  = 'MyDigital-ID';
const GITHUB_REPO   = 'MyDigital-ID.github.io';
const GITHUB_BRANCH = 'main';
const GITHUB_PATH   = 'Modi-pizza/menu-data.js';

const SINGLE_PRICE_ZONES = ["pasta","wetsh"];
let TOKEN = localStorage.getItem('pizza_gh_token') || '';
let FILE_SHA = null;
let menu = null;

document.getElementById('togglePass').addEventListener('click', ()=>{
  const inp = document.getElementById('passInput');
  inp.type = inp.type === 'password' ? 'text' : 'password';
});

document.getElementById('loginBtn').addEventListener('click', async ()=>{
  const t = document.getElementById('passInput').value.trim();
  if(!t) return;
  TOKEN = t;
  const ok = await loadMenuFromGitHub();
  if(ok){
    localStorage.setItem('pizza_gh_token', TOKEN);
    document.getElementById('loginView').classList.add('hidden');
    document.getElementById('dash').classList.remove('hidden');
    renderDash();
  } else {
    document.getElementById('loginError').classList.remove('hidden');
  }
});

document.getElementById('changeTokenBtn').addEventListener('click', ()=>{
  localStorage.removeItem('pizza_gh_token');
  TOKEN = '';
  document.getElementById('dash').classList.add('hidden');
  document.getElementById('loginView').classList.remove('hidden');
  document.getElementById('passInput').value = '';
});

document.getElementById('saveAllBtn').addEventListener('click', async ()=>{
  collectFormIntoMenu();
  const msg = document.getElementById("saveMsg");
  msg.textContent = "جاري الحفظ..."; msg.style.display = "block";
  const ok = await saveMenuToGitHub();
  msg.textContent = ok ? "تم الحفظ ✅" : "حصل خطأ في الحفظ ❌";
  setTimeout(()=> msg.style.display="none", 3000);
});

async function ghFetch(method, body){
  const url = `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/${GITHUB_PATH}`;
  const opts = { method, headers: { 'Authorization': `Bearer ${TOKEN}`, 'Accept': 'application/vnd.github+json' } };
  if(body) opts.body = JSON.stringify(body);
  return fetch(method === 'GET' ? `${url}?ref=${GITHUB_BRANCH}` : url, opts);
}
function utf8ToBase64(str){ return btoa(unescape(encodeURIComponent(str))); }
function base64ToUtf8(str){ return decodeURIComponent(escape(atob(str))); }

async function loadMenuFromGitHub(){
  try{
    const res = await ghFetch('GET');
    if(!res.ok) return false;
    const json = await res.json();
    FILE_SHA = json.sha;
    const raw = base64ToUtf8(json.content);
    const match = raw.match(/const menu\s*=\s*(\{[\s\S]*\});/);
    menu = match ? JSON.parse(match[1]) : JSON.parse(raw);
    return true;
  }catch(e){ console.error(e); return false; }
}

async function saveMenuToGitHub(){
  try{
    const newContent = "const menu = " + JSON.stringify(menu, null, 2) + ";\n\nfunction loadMenu(){ return menu; }\n";
    const res = await ghFetch('PUT', {
      message: 'admin: تحديث أسعار بيتزا مودي',
      content: utf8ToBase64(newContent),
      sha: FILE_SHA,
      branch: GITHUB_BRANCH
    });
    if(!res.ok) return false;
    const json = await res.json();
    FILE_SHA = json.content.sha;
    return true;
  }catch(e){ console.error(e); return false; }
}

function renderDash(){
  const container = document.getElementById("zonesContainer");
  container.innerHTML = "";
  menu.zones.forEach(zone=>{
    const block = document.createElement("div");
    block.className = "zone-block";
    const items = menu.items[zone.id] || [];
    let itemsHtml = items.map((item, idx)=>{
      if(!item.sizes){
        return `<div class="item-edit" data-zone="${zone.id}" data-idx="${idx}">
          <div class="row">
            <div class="size-field"><label>الاسم (عربي)</label><input class="f-name-ar" value="${item.name_ar||''}"></div>
            <div class="size-field"><label>Name (English)</label><input class="f-name-en" value="${item.name_en||''}"></div>
            <div class="size-field"><label>السعر</label><input type="number" class="f-price" value="${item.price||0}"></div>
          </div>
          <button class="btn-remove">حذف الصنف</button></div>`;
      }
      const sizesHtml = item.sizes.map((s,si)=>`
        <div class="row size-row" data-si="${si}">
          <div class="size-field"><label>الحجم (عربي)</label><input class="f-size-ar" value="${s.label_ar||''}"></div>
          <div class="size-field"><label>Size (English)</label><input class="f-size-en" value="${s.label_en||''}"></div>
          <div class="size-field"><label>السعر</label><input type="number" class="f-size-price" value="${s.price||0}"></div>
        </div>`).join("");
      return `<div class="item-edit" data-zone="${zone.id}" data-idx="${idx}">
        <div class="row">
          <div class="size-field"><label>الاسم (عربي)</label><input class="f-name-ar" value="${item.name_ar||''}"></div>
          <div class="size-field"><label>Name (English)</label><input class="f-name-en" value="${item.name_en||''}"></div>
        </div>
        <div class="sizes-wrap">${sizesHtml}</div>
        <button class="btn-remove">حذف الصنف</button></div>`;
    }).join("");
    block.innerHTML = `<h2>${zone.name_ar}</h2><div class="items-wrap">${itemsHtml}</div>
      <button class="btn-add" data-zone="${zone.id}">+ إضافة صنف جديد</button>`;
    container.appendChild(block);
  });

  const addonsBlock = document.createElement("div");
  addonsBlock.className = "zone-block";
  addonsBlock.innerHTML = `<h2>الإضافات الاختيارية</h2>
    <div class="row"><div class="size-field"><label>سعر الإضافة الواحدة</label>
      <input type="number" id="addonPriceInput" value="${menu.addonPrice}"></div></div>
    <div id="addonsWrap"></div>
    <button class="btn-add" id="addAddonBtn">+ إضافة عنصر جديد</button>`;
  container.appendChild(addonsBlock);
  renderAddonsAdmin();

  container.querySelectorAll(".btn-add[data-zone]").forEach(btn=>{
    btn.addEventListener("click", ()=>{
      const zid = btn.dataset.zone;
      if(SINGLE_PRICE_ZONES.includes(zid)){
        menu.items[zid].push({id:"w"+Date.now(), name_ar:"صنف جديد", name_en:"New item", price:0});
      } else {
        menu.items[zid].push({id:"i"+Date.now(), name_ar:"صنف جديد", name_en:"New item",
          sizes:[{label_ar:"وسط",label_en:"Medium",price:0},{label_ar:"عائلي",label_en:"Family",price:0}]});
      }
      renderDash();
    });
  });
  container.querySelectorAll(".btn-remove").forEach(btn=>{
    btn.addEventListener("click", ()=>{
      const wrap = btn.closest(".item-edit");
      menu.items[wrap.dataset.zone].splice(+wrap.dataset.idx,1);
      renderDash();
    });
  });
}

function renderAddonsAdmin(){
  const wrap = document.getElementById("addonsWrap");
  wrap.innerHTML = menu.addons.map((a,idx)=>`
    <div class="row" data-idx="${idx}">
      <div class="size-field"><label>الاسم (عربي)</label><input class="addon-ar" value="${a.name_ar}"></div>
      <div class="size-field"><label>Name (English)</label><input class="addon-en" value="${a.name_en}"></div>
      <button class="btn-remove addon-remove">حذف</button></div>`).join("");
  wrap.querySelectorAll(".addon-remove").forEach(btn=>{
    btn.addEventListener("click", ()=>{
      menu.addons.splice(+btn.closest("[dat