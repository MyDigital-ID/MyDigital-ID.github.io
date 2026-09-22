// بيانات المنيو الكاملة — بيتزا مودي
// الأصناف اللي عندها "sizes" بتتعرض بحجمين (وسط/عائلي)
// الأصناف اللي عندها "price" بس (من غير sizes) بتتعرض بسعر واحد + تحديد كمية (مكرونات ووتش فطير)

const DEFAULT_MENU = {
  zones: [
    { id: "pizza",  name_ar: "ركن البيتزا",       name_en: "Pizza Corner",       image: "assets/images/pizza-zone.jpg",        video: "videos/pizza.mp4" },
    { id: "savory", name_ar: "ركن الفطير الحادق",  name_en: "Savory Pies Corner", image: "assets/images/Savory-pizza-zone.png", video: "videos/savory-pies.mp4" },
    { id: "sweet",  name_ar: "ركن الفطير الحلو",   name_en: "Sweet Pies Corner",  image: "assets/images/sweet-pie.jpg",         video: "videos/sweet-pie.mp4" },
    { id: "pasta",  name_ar: "ركن المكرونات",      name_en: "Pasta Corner",       image: "assets/images/pasta.png",             video: "videos/pasta.mp4" },
    { id: "wetsh",  name_ar: "ركن وتش فطير",       name_en: "Wetsh Pie Corner",   image: "assets/images/wetsh-pie.jpg",         video: "videos/Sandwich-roll.mp4", ratio169: true }
  ],

  items: {
    pizza: [
      { id:"p1",  name_ar:"بيتزا مارجريتا",            name_en:"Margherita Pizza",          desc_ar:"جبنة موزاريلا + خضار + زيتون", sizes:[{label_ar:"وسط",label_en:"Medium",price:75},{label_ar:"عائلي",label_en:"Family",price:150}] },
      { id:"p2",  name_ar:"بيتزا كوتر فورماج",          name_en:"Quatre Fromages Pizza",     desc_ar:"جبنة موزاريلا + كيري + خضار + زيتون", sizes:[{label_ar:"وسط",label_en:"Medium",price:130},{label_ar:"عائلي",label_en:"Family",price:250}] },
      { id:"p3",  name_ar:"بيتزا بالبسطرمة",            name_en:"Basterma Pizza",            desc_ar:"جبنة موزاريلا + خضار + زيتون", sizes:[{label_ar:"وسط",label_en:"Medium",price:130},{label_ar:"عائلي",label_en:"Family",price:250}] },
      { id:"p4",  name_ar:"بيتزا سجق",                  name_en:"Sausage Pizza",             desc_ar:"جبنة موزاريلا + خضار + زيتون", sizes:[{label_ar:"وسط",label_en:"Medium",price:130},{label_ar:"عائلي",label_en:"Family",price:250}] },
      { id:"p5",  name_ar:"بيتزا باللحمة",              name_en:"Meat Pizza",                desc_ar:"جبنة موزاريلا + خضار + زيتون", sizes:[{label_ar:"وسط",label_en:"Medium",price:130},{label_ar:"عائلي",label_en:"Family",price:240}] },
      { id:"p6",  name_ar:"بيتزا كوكتيل مشكل لحوم",     name_en:"Mixed Meat Cocktail Pizza", desc_ar:"جبنة موزاريلا + خضار + زيتون", sizes:[{label_ar:"وسط",label_en:"Medium",price:180},{label_ar:"عائلي",label_en:"Family",price:350}] },
      { id:"p7",  name_ar:"بيتزا سبشيل بالمشروم",       name_en:"Special Mushroom Pizza",    desc_ar:"جبنة موزاريلا + خضار + زيتون", sizes:[{label_ar:"وسط",label_en:"Medium",price:120},{label_ar:"عائلي",label_en:"Family",price:240}] },
      { id:"p8",  name_ar:"بيتزا بالتونة",              name_en:"Tuna Pizza",                desc_ar:"جبنة موزاريلا + خضار + زيتون", sizes:[{label_ar:"وسط",label_en:"Medium",price:130},{label_ar:"عائلي",label_en:"Family",price:250}] },
      { id:"p9",  name_ar:"بيتزا نابوليتان بالأنشوجة",  name_en:"Neapolitan Anchovy Pizza",  desc_ar:"جبنة موزاريلا + خضار + زيتون", sizes:[{label_ar:"وسط",label_en:"Medium",price:190},{label_ar:"عائلي",label_en:"Family",price:350}] },
      { id:"p10", name_ar:"بيتزا دايتو بالفراخ",        name_en:"Chicken Dieto Pizza",       desc_ar:"جبنة موزاريلا + خضار + زيتون", sizes:[{label_ar:"وسط",label_en:"Medium",price:130},{label_ar:"عائلي",label_en:"Family",price:250}] },
      { id:"p11", name_ar:"بيتزا سوسيس",                name_en:"Sausage Roll Pizza",        desc_ar:"جبنة موزاريلا + خضار + زيتون", sizes:[{label_ar:"وسط",label_en:"Medium",price:130},{label_ar:"عائلي",label_en:"Family",price:250}] },
      { id:"p12", name_ar:"بيتزا سلامي",                name_en:"Salami Pizza",              desc_ar:"جبنة موزاريلا + خضار + زيتون", sizes:[{label_ar:"وسط",label_en:"Medium",price:130},{label_ar:"عائلي",label_en:"Family",price:250}] },
      { id:"p13", name_ar:"بيتزا كالسوني",              name_en:"Calzone Pizza",             desc_ar:"جبنة موزاريلا + خضار + زيتون", sizes:[{label_ar:"وسط",label_en:"Medium",price:0},{label_ar:"عائلي",label_en:"Family",price:0}] },
      { id:"p14", name_ar:"بيتزا سوبر سوبريم مشكل",     name_en:"Super Supreme Mix Pizza",   desc_ar:"مشروم + جبنة موزاريلا + خضار + زيتون", sizes:[{label_ar:"وسط",label_en:"Medium",price:190},{label_ar:"عائلي",label_en:"Family",price:300}] },
      { id:"p15", name_ar:"بيتزا جمبري",                name_en:"Shrimp Pizza",              desc_ar:"جبنة موزاريلا + خضار + زيتون", sizes:[{label_ar:"وسط",label_en:"Medium",price:170},{label_ar:"عائلي",label_en:"Family",price:350}] },
      { id:"p16", name_ar:"بيتزا فواكه",                name_en:"Seafood Fruit Pizza",       desc_ar:"جمبري + سبيط + بطارخ + مشروم + جبنة موزاريلا + خضار + زيتون", sizes:[{label_ar:"وسط",label_en:"Medium",price:160},{label_ar:"عائلي",label_en:"Family",price:320}] },
      { id:"p17", name_ar:"بيتزا جمبري + سبيط + بطارخ + مشروم", name_en:"Shrimp, Squid, Roe & Mushroom Pizza", desc_ar:"جبنة موزاريلا + خضار + زيتون", sizes:[{label_ar:"وسط",label_en:"Medium",price:200},{label_ar:"عائلي",label_en:"Family",price:380}] },
      { id:"p18", name_ar:"بيتزا أرجوستا مودي",         name_en:"Argosta Modi Pizza",        desc_ar:"نص فواكه - نص مشكل لحوم (جبنة موزاريلا + خضار + زيتون)", sizes:[{label_ar:"وسط",label_en:"Medium",price:200},{label_ar:"عائلي",label_en:"Family",price:380}] },
      { id:"p19", name_ar:"بيتزا تشكن رانش",            name_en:"Chicken Ranch Pizza",       sizes:[{label_ar:"وسط",label_en:"Medium",price:140},{label_ar:"عائلي",label_en:"Family",price:250}] },
      { id:"p20", name_ar:"بيتزا تشكن باربيكيو",        name_en:"Chicken BBQ Pizza",         sizes:[{label_ar:"وسط",label_en:"Medium",price:140},{label_ar:"عائلي",label_en:"Family",price:250}] }
    ],

    savory: [
      { id:"s1",  name_ar:"فطيرة بالجبنة الرومي",       name_en:"Romy Cheese Pie",       desc_ar:"جبنة رومي + خضار + زيتون", sizes:[{label_ar:"وسط",label_en:"Medium",price:130},{label_ar:"عائلي",label_en:"Family",price:250}] },
      { id:"s2",  name_ar:"فطيرة مشكل جبنات",           name_en:"Mixed Cheese Pie",      desc_ar:"جبنة موزاريلا + رومي + خضار + زيتون", sizes:[{label_ar:"وسط",label_en:"Medium",price:130},{label_ar:"عائلي",label_en:"Family",price:250}] },
      { id:"s3",  name_ar:"فطيرة بالسجق",               name_en:"Sausage Pie",           desc_ar:"جبنة رومي + خضار + زيتون", sizes:[{label_ar:"وسط",label_en:"Medium",price:0},{label_ar:"عائلي",label_en:"Family",price:0}] },
      { id:"s4",  name_ar:"فطيرة بالبسطرمة",            name_en:"Basterma Pie",          desc_ar:"جبنة رومي + خضار + زيتون", sizes:[{label_ar:"وسط",label_en:"Medium",price:130},{label_ar:"عائلي",label_en:"Family",price:250}] },
      { id:"s5",  name_ar:"فطيرة باللحمة البلدي",       name_en:"Local Meat Pie",        desc_ar:"جبنة رومي + خضار + زيتون", sizes:[{label_ar:"وسط",label_en:"Medium",price:130},{label_ar:"عائلي",label_en:"Family",price:250}] },
      { id:"s6",  name_ar:"فطيرة بالبسطرمة + موزاريلا", name_en:"Basterma & Mozzarella Pie", sizes:[{label_ar:"وسط",label_en:"Medium",price:130},{label_ar:"عائلي",label_en:"Family",price:250}] },
      { id:"s7",  name_ar:"فطيرة سوسيس + موزاريلا",     name_en:"Sausage & Mozzarella Pie",  sizes:[{label_ar:"وسط",label_en:"Medium",price:130},{label_ar:"عائلي",label_en:"Family",price:250}] },
      { id:"s8",  name_ar:"فطيرة سجق + موزاريلا",       name_en:"Sujuk & Mozzarella Pie",    sizes:[{label_ar:"وسط",label_en:"Medium",price:130},{label_ar:"عائلي",label_en:"Family",price:250}] },
      { id:"s9",  name_ar:"فطيرة جمبري",                name_en:"Shrimp Pie",            desc_ar:"موزاريلا + خضار", sizes:[{label_ar:"وسط",label_en:"Medium",price:170},{label_ar:"عائلي",label_en:"Family",price:350}] },
      { id:"s10", name_ar:"فطيرة جبنة + بيض + خضار",    name_en:"Cheese, Egg & Veg Pie", sizes:[{label_ar:"وسط",label_en:"Medium",price:150},{label_ar:"عائلي",label_en:"Family",price:300}] },
      { id:"s11", name_ar:"فطيرة فواكه بحر",            name_en:"Seafood Pie",           desc_ar:"موزاريلا + خضار", sizes:[{label_ar:"وسط",label_en:"Medium",price:200},{label_ar:"عائلي",label_en:"Family",price:380}] },
      { id:"s12", name_ar:"فطيرة مشكل لحوم مودي",       name_en:"Modi Mixed Meat Pie",   desc_ar:"لحمة + سجق + بسطرمة + جبنة رومي + موزاريلا", sizes:[{label_ar:"وسط",label_en:"Medium",price:180},{label_ar:"عائلي",label_en:"Family",price:350}] },
      { id:"s13", name_ar:"فطيرة مشكل لحوم مخصوص",      name_en:"Special Mixed Meat Pie", sizes:[{label_ar:"وسط",label_en:"Medium",price:200},{label_ar:"عائلي",label_en:"Family",price:400}] }
    ],

    sweet: [
      { id:"sw1",  name_ar:"فطيرة سادة",                 name_en:"Plain Sweet Pie",         desc_ar:"لبن + سكر + سمنة", sizes:[{label_ar:"وسط",label_en:"Medium",price:45},{label_ar:"عائلي",label_en:"Family",price:80}] },
      { id:"sw2",  name_ar:"فطيرة بالكريمة",             name_en:"Cream Pie",               desc_ar:"لبن + سكر + سمنة", sizes:[{label_ar:"وسط",label_en:"Medium",price:45},{label_ar:"عائلي",label_en:"Family",price:80}] },
      { id:"sw3",  name_ar:"فطيرة بالكريمة + جوزهند",    name_en:"Cream & Coconut Pie",     sizes:[{label_ar:"وسط",label_en:"Medium",price:70},{label_ar:"عائلي",label_en:"Family",price:130}] },
      { id:"sw4",  name_ar:"فطيرة زبيب وجوزهند",         name_en:"Raisin & Coconut Pie",    sizes:[{label_ar:"وسط",label_en:"Medium",price:90},{label_ar:"عائلي",label_en:"Family",price:150}] },
      { id:"sw5",  name_ar:"فطيرة بالقشطة",              name_en:"Qishta Pie",              sizes:[{label_ar:"وسط",label_en:"Medium",price:130},{label_ar:"عائلي",label_en:"Family",price:250}] },
      { id:"sw6",  name_ar:"فطيرة شلمة",                 name_en:"Shalma Pie",              desc_ar:"سمن + سكر + جوز هند + قشطة", sizes:[{label_ar:"وسط",label_en:"Medium",price:150},{label_ar:"عائلي",label_en:"Family",price:280}] },
      { id:"sw7",  name_ar:"فطيرة بغاشة",                name_en:"Baghasha Pie",            desc_ar:"سمن + سكر + جوز هند", sizes:[{label_ar:"وسط",label_en:"Medium",price:70},{label_ar:"عائلي",label_en:"Family",price:130}] },
      { id:"sw8",  name_ar:"فطيرة مكس",                  name_en:"Mix Sweet Pie",           sizes:[{label_ar:"وسط",label_en:"Medium",price:0},{label_ar:"عائلي",label_en:"Family",price:0}] },
      { id:"sw9",  name_ar:"فطيرة موز",                  name_en:"Banana Pie",              sizes:[{label_ar:"وسط",label_en:"Medium",price:100},{label_ar:"عائلي",label_en:"Family",price:200}] },
      { id:"sw10", name_ar:"فطيرة شوكولاتة سادة",        name_en:"Plain Chocolate Pie",     sizes:[{label_ar:"وسط",label_en:"Medium",price:130},{label_ar:"عائلي",label_en:"Family",price:250}] },
      { id:"sw11", name_ar:"فطيرة شوكولاتة بالبندق",     name_en:"Chocolate Hazelnut Pie",  sizes:[{label_ar:"وسط",label_en:"Medium",price:200},{label_ar:"عائلي",label_en:"Family",price:350}] },
      { id:"sw12", name_ar:"فطيرة شوكولاتة فستق",        name_en:"Chocolate Pistachio Pie", sizes:[{label_ar:"وسط",label_en:"Medium",price:200},{label_ar:"عائلي",label_en:"Family",price:400}] },
      { id:"sw13", name_ar:"فطيرة موز + شوكولاتة",       name_en:"Banana & Chocolate Pie",  sizes:[{label_ar:"وسط",label_en:"Medium",price:150},{label_ar:"عائلي",label_en:"Family",price:250}] },
      { id:"sw14", name_ar:"فطيرة فواكه",                name_en:"Fruit Pie",               desc_ar:"موز + تفاح + جوز هند", sizes:[{label_ar:"وسط",label_en:"Medium",price:200},{label_ar:"عائلي",label_en:"Family",price:350}] },
      { id:"sw15", name_ar:"فطيرة زبيب وجوزهند وبندق",   name_en:"Raisin, Coconut & Hazelnut Pie", sizes:[{label_ar:"وسط",label_en:"Medium",price:180},{label_ar:"عائلي",label_en:"Family",price:350}] },
      { id:"sw16", name_ar:"فطيرة شهر العسل مودي",       name_en:"Modi Honeymoon Pie",      desc_ar:"سمن + سكر + عسل + مكسرات + بلح + قشطة", sizes:[{label_ar:"وسط",label_en:"Medium",price:200},{label_ar:"عائلي",label_en:"Family",price:380}] }
    ],

    pasta: [
      { id:"pa1",  name_ar:"مكرونة بالبشاميل لحمة صلصة سبايسي", name_en:"Bechamel Spicy Meat Pasta", price:150 },
      { id:"pa2",  name_ar:"مكرونة بالسجق",       name_en:"Sausage Pasta",  price:150 },
      { id:"pa3",  name_ar:"مكرونة بالبسطرمة",    name_en:"Basterma Pasta", price:180 },
      { id:"pa4",  name_ar:"مكرونة مشكل لحوم",    name_en:"Mixed Meat Pasta", price:160 },
      { id:"pa5",  name_ar:"مكرونة فراخ",         name_en:"Chicken Pasta",  price:150 },
      { id:"pa6",  name_ar:"مكرونة سوسيس",        name_en:"Sausage Roll Pasta", price:160 },
      { id:"pa7",  name_ar:"مكرونة تونة",         name_en:"Tuna Pasta",     price:180 },
      { id:"pa8",  name_ar:"مكرونة جمبري",        name_en:"Shrimp Pasta",   price:200 },
      { id:"pa9",  name_ar:"مكرونة سي فود",       name_en:"Seafood Pasta",  price:150 },
      { id:"pa10", name_ar:"مكرونة مشروم",        name_en:"Mushroom Pasta", price:150 }
    ],

    wetsh: [
      { id:"w1",  name_ar:"وتش رومي",        name_en:"Romy Wetsh",       price:100 },
      { id:"w2",  name_ar:"وتش موزاريلا",     name_en:"Mozzarella Wetsh", price:120 },
      { id:"w3",  name_ar:"وتش كيري",         name_en:"Kiri Wetsh",       price:100 },
      { id:"w4",  name_ar:"وتش مشكل جبن",     name_en:"Mixed Cheese Wetsh", price:130 },
      { id:"w5",  name_ar:"وتش فراخ",         name_en:"Chicken Wetsh",    price:130 },
      { id:"w6",  name_ar:"وتش سجق",          name_en:"Sujuk Wetsh",      price:100 },
      { id:"w7",  name_ar:"وتش بسطرمة",       name_en:"Basterma Wetsh",   price:100 },
      { id:"w8",  name_ar:"وتش لحمة",         name_en:"Meat Wetsh",       price:100 },
      { id:"w9",  name_ar:"وتش تونة",         name_en:"Tuna Wetsh",       price:120 },
      { id:"w10", name_ar:"وتش مشكل لحوم",    name_en:"Mixed Meat Wetsh", price:130 },
      { id:"w11", name_ar:"وتش جمبري",        name_en:"Shrimp Wetsh",     price:160 },
      { id:"w12", name_ar:"وتش سلامي",        name_en:"Salami Wetsh",     price:120 },
      { id:"w13", name_ar:"وتش سوسيس",        name_en:"Sausage Roll Wetsh", price:120 },
      { id:"w14", name_ar:"وتش سي فود",       name_en:"Seafood Wetsh",    price:170 }
    ]
  },

  addons: [
    { id:"a1", name_ar:"اللحمة",      name_en:"Meat" },
    { id:"a2", name_ar:"السجق",       name_en:"Sausage" },
    { id:"a3", name_ar:"البسطرمة",    name_en:"Basterma" },
    { id:"a4", name_ar:"التونة",      name_en:"Tuna" },
    { id:"a5", name_ar:"المشروم",     name_en:"Mushroom" },
    { id:"a6", name_ar:"الأنشوجة",    name_en:"Anchovy" },
    { id:"a7", name_ar:"الموتزاريلا", name_en:"Mozzarella" },
    { id:"a8", name_ar:"جبنة تركي",   name_en:"Turkish Cheese" }
  ],
  addonPrice: 20
};

// نحمّل من التخزين المحلي إن وجد تعديل من لوحة التحكم، وإلا نستخدم القيم الافتراضية
function loadMenu(){
  const saved = localStorage.getItem("pizzaModiMenu");
  return saved ? JSON.parse(saved) : DEFAULT_MENU;
}
