const ADMIN_PASSWORD = "Modi@alex26";
const SINGLE_PRICE_ZONES = ["pasta","wetsh"]; // أركان بسعر واحد + كمية (من غير أحجام)
let menu = loadMenu();

document.getElementById("loginBtn").addEventListener("click", tryLogin);
document.getElementById("passInput").addEventListener("keydown", e=>{ if(e.key==="Enter") tryLogin(); });

function tryLogin(){
  const val = document.getElementById("passInput").value;
  if(val === ADMIN_PASSWORD){
    document.getElementById("loginView").classList.add("hidden");
    document.getElementById("dash").classList.remove("hidden");
    renderDash();
  } else {
    document.getElementById("loginError").classList.remove("hidden");
  }
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
        return `
        <div class="item-edit" data-zone="${zone.id}" data-idx="${idx}">
          <div class="row">
            <div class="size-field"><label>الاسم (عربي)</label><input class="f-name-ar" value="${item.name_ar||''}"></div>
            <div class="size-field"><label>Name (English)</label><input class="f-name-en" value="${item.name_en||''}"></div>
            <div class="size-field"><label>السعر</label><input type="number" class="f-price" value="${item.price||0}"></div>
          </div>
          <button class="btn-remove">حذف الصنف</button>
        </div>`;
      }
      const sizesHtml = item.sizes.map((s,si)=>`
        <div class="row size-row" data-si="${si}">
          <div class="size-field"><label>الحجم (عربي)</label><input class="f-size-ar" value="${s.label_ar||''}"></div>
          <div class="size-field"><label>Size (English)</label><input class="f-size-en" value="${s.label_en||''}"></div>
          <div class="size-field"><label>السعر</label><input type="number" class="f-size-price" value="${s.price||0}"></div>
        </div>`).join("");
      return `
        <div class="item-edit" data-zone="${zone.id}" data-idx="${idx}">
          <div class="row">
            <div class="size-field"><label>الاسم (عربي)</label><input class="f-name-ar" value="${item.name_ar||''}"></div>
            <div class="size-field"><label>Name (English)</label><input class="f-name-en" value="${item.name_en||''}"></div>
          </div>
          <div class="sizes-wrap">${sizesHtml}</div>
          <button class="btn-remove">حذف الصنف</button>
        </div>`;
    }).join("");

    block.innerHTML = `
      <h2>${zone.name_ar}</h2>
      <div class="items-wrap">${itemsHtml}</div>
      <button class="btn-add" data-zone="${zone.id}">+ إضافة صنف جديد</button>
    `;
    container.appendChild(block);
  });

  const addonsBlock = document.createElement("div");
  addonsBlock.className = "zone-block";
  addonsBlock.innerHTML = `
    <h2>الإضافات الاختيارية</h2>
    <div class="row"><div class="size-field"><label>سعر الإضافة الواحدة</label>
      <input type="number" id="addonPriceInput" value="${menu.addonPrice}"></div></div>
    <div id="addonsWrap"></div>
    <button class="btn-add" id="addAddonBtn">+ إضافة عنصر جديد</button>
  `;
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
      const zid = wrap.dataset.zone, idx = +wrap.dataset.idx;
      menu.items[zid].splice(idx,1);
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
      <button class="btn-remove addon-remove">حذف</button>
    </div>`).join("");

  wrap.querySelectorAll(".addon-remove").forEach(btn=>{
    btn.addEventListener("click", ()=>{
      const idx = +btn.closest("[data-idx]").dataset.idx;
      menu.addons.splice(idx,1);
      renderDash();
    });
  });
  document.getElementById("addAddonBtn").onclick = ()=>{
    menu.addons.push({id:"a"+Date.now(), name_ar:"إضافة جديدة", name_en:"New add-on"});
    renderDash();
  };
}

function collectFormIntoMenu(){
  document.querySelectorAll(".item-edit").forEach(wrap=>{
    const zid = wrap.dataset.zone, idx = +wrap.dataset.idx;
    const item = menu.items[zid][idx];
    item.name_ar = wrap.querySelector(".f-name-ar").value;
    item.name_en = wrap.querySelector(".f-name-en").value;
    if(!item.sizes){
      item.price = +wrap.querySelector(".f-price").value;
    } else {
      wrap.querySelectorAll(".size-row").forEach((sr,si)=>{
        item.sizes[si].label_ar = sr.querySelector(".f-size-ar").value;
        item.sizes[si].label_en = sr.querySelector(".f-size-en").value;
        item.sizes[si].price = +sr.querySelector(".f-size-price").value;
      });
    }
  });
  document.querySelectorAll("#addonsWrap [data-idx]").forEach(row=>{
    const idx = +row.dataset.idx;
    menu.addons[idx].name_ar = row.querySelector(".addon-ar").value;
    menu.addons[idx].name_en = row.querySelector(".addon-en").value;
  });
  menu.addonPrice = +document.getElementById("addonPriceInput").value;
}

document.getElementById("saveAllBtn").addEventListener("click", ()=>{
  collectFormIntoMenu();
  localStorage.setItem("pizzaModiMenu", JSON.stringify(menu));
  const msg = document.getElementById("saveMsg");
  msg.style.display = "block";
  setTimeout(()=> msg.style.display="none", 2000);
});
