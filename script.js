document.addEventListener('DOMContentLoaded', () => {

    const langToggleBtn = document.getElementById('langToggleBtn');

    const translations = {
        ar: {
            pageTitle: 'سندويتشات الزوز | ELZOZ SANDWICHES',
            restaurantName: 'سندويتشات الزوز',
            aboutTitle: 'عن سندويتشات الزوز',
            aboutText: 'مرحباً بكم في مطعم سندويتشات الزوز ❤️ نقدم لكم أشهى وألذ السندويتشات والأطباق البحرية الطازجة.',
            slogan: '"عند الزوز .. السندويتشات بتبوظ"',
            addressTitle: 'العنوان',
            addressText: 'الإسكندرية سيدي بشر الترام - شارع خالد بن الوليد الرئيسي - أمام جزارة الثورة',
            menuCategoriesTitle: 'القائمة والوجبات',
            homeMeal: 'الرئيسية',
            singleMeals: 'وجبات الفرد',
            offersTitle: 'عروض الزوز',
            sandwichesTitle: 'السندويتشات',
            riceTitle: 'أطباق الأرز',
            pastaTitle: 'المكرونات',
            soupsTitle: 'الشوربة والأطباق',
            saucesTitle: 'الصوصات',
            drinksTitle: 'المشروبات',
            mapBtn: 'موقعنا على الخريطة',
            vcardBtn: 'حفظ جهة الاتصال (vCard)',
            qrTitle: 'رمز QR',
            addToCart: 'إضافة للسلة',
            cartTitle: 'سلة الطلبات المباشرة',
            emptyCartMsg: 'السلة فارغة حالياً',
            orderNowBtn: 'تأكيد الطلبات',
            directUploadText: 'طلباتك يتم رفعها بشكل مباشر'
        },
        en: {
            pageTitle: 'ELZOZ SANDWICHES',
            restaurantName: 'ELZOZ SANDWICHES',
            aboutTitle: 'About El Zoz Sandwiches',
            aboutText: 'Welcome to El Zoz Sandwiches ❤️ We offer the finest fresh seafood sandwiches and dishes.',
            slogan: '"At El Zoz .. Sandwiches Overload!"',
            addressTitle: 'Address',
            addressText: 'Sidi Bishr Tram, Khaled Ibn El Waleed St, Alexandria',
            menuCategoriesTitle: 'Menu & Meals',
            homeMeal: 'Home',
            singleMeals: 'Single Meals',
            offersTitle: 'ELZOZ Offers',
            sandwichesTitle: 'Sandwiches',
            riceTitle: 'Rice Dishes',
            pastaTitle: 'Pasta Dishes',
            soupsTitle: 'Soups & Dishes',
            saucesTitle: 'Sauces',
            drinksTitle: 'Drinks',
            mapBtn: 'Location Map',
            vcardBtn: 'Save Contact (vCard)',
            qrTitle: 'Menu QR',
            addToCart: 'Add to Cart',
            cartTitle: 'Live Order Cart',
            emptyCartMsg: 'The cart is empty',
            orderNowBtn: 'Confirm Orders',
            directUploadText: 'Your order is sent directly'
        }
    };

    function updateCategoryBallImages(lang) {
        const isEn = lang === 'en';
        
        const imgSandwiches = document.getElementById('imgSandwiches');
        const imgOffers = document.getElementById('imgOffers');
        const imgRice = document.getElementById('imgRice');
        const imgPasta = document.getElementById('imgPasta');
        const imgSauces = document.getElementById('imgSauces');
        const imgDrinks = document.getElementById('imgDrinks');

        if (imgSandwiches) imgSandwiches.src = isEn ? 'Assets/images/Elzoz-Sandw-engl.png' : 'Assets/images/Elzoz-sandwiches-arabic.png';
        if (imgOffers) imgOffers.src = 'Assets/images/Elzoz-offers-arabic.png';
        if (imgRice) imgRice.src = isEn ? 'Assets/images/Rice-Dishes-engl.png' : 'Assets/images/Rice-Dishes-arabic.png';
        if (imgPasta) imgPasta.src = isEn ? 'Assets/images/Pasta-engl.png' : 'Assets/images/Pasta-arabic.png';
        if (imgSauces) imgSauces.src = isEn ? 'Assets/images/Sauce-engl.png' : 'Assets/images/Sauce-arabic.png';
        if (imgDrinks) imgDrinks.src = isEn ? 'Assets/images/Drinks-engl.png' : 'Assets/images/Drinks-arabic.png';
    }

    function translateAllItems(lang) {
        document.querySelectorAll('[data-ar]').forEach(el => {
            const arText = el.getAttribute('data-ar');
            const enText = el.getAttribute('data-en');
            if (lang === 'en' && enText) {
                el.textContent = enText;
            } else if (arText) {
                el.textContent = arText;
            }
        });
    }

    function applyLanguage(lang) {
        const currentLang = lang === 'en' ? 'en' : 'ar';
        document.documentElement.lang = currentLang;
        document.documentElement.dir = currentLang === 'ar' ? 'rtl' : 'ltr';

        document.querySelectorAll('[data-i18n]').forEach(element => {
            const key = element.getAttribute('data-i18n');
            if (translations[currentLang][key] !== undefined) {
                element.textContent = translations[currentLang][key];
            }
        });

        translateAllItems(currentLang);
        updateCategoryBallImages(currentLang);

        if (langToggleBtn) langToggleBtn.textContent = currentLang === 'ar' ? 'EN' : 'AR';
        localStorage.setItem('elzozLanguage', currentLang);
    }

    langToggleBtn?.addEventListener('click', () => {
        const currentLang = localStorage.getItem('elzozLanguage') || 'ar';
        applyLanguage(currentLang === 'ar' ? 'en' : 'ar');
    });

    applyLanguage(localStorage.getItem('elzozLanguage') || 'ar');

    // التحكم بالقائمة الجانبية Sidebar
    const menuToggleBtn = document.getElementById('menuToggleBtn');
    const closeSidebarBtn = document.getElementById('closeSidebarBtn');
    const sidebar = document.getElementById('sidebar');

    menuToggleBtn?.addEventListener('click', () => sidebar.classList.add('open'));
    closeSidebarBtn?.addEventListener('click', () => sidebar.classList.remove('open'));

    // التحكم بالفيديو واللوجو الرئيسي
    const chefVideo = document.getElementById('chefVideo');
    const videoWrapper = document.getElementById('videoWrapper');
    const logo2Wrapper = document.getElementById('logo2Wrapper');

    chefVideo?.addEventListener('ended', () => {
        videoWrapper.style.display = 'none';
        logo2Wrapper.style.display = 'flex';
        setTimeout(() => { logo2Wrapper.style.opacity = '1'; }, 50);
    });

    // فلترة الفئات
    const allCategoryElements = document.querySelectorAll('[data-category-row]');
    function filterCategory(selectedCategory) {
        allCategoryElements.forEach(element => {
            if (element.getAttribute('data-category-row') === selectedCategory) {
                element.classList.remove('hidden-row');
            } else {
                element.classList.add('hidden-row');
            }
        });
        document.getElementById('menuGrid')?.scrollIntoView({ behavior: 'smooth' });
    }

    document.querySelectorAll('.category-ball, .sidebar-cat-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            filterCategory(btn.getAttribute('data-category'));
            sidebar.classList.remove('open');
        });
    });

    // السلة
    let cart = [];
    const cartBadge = document.getElementById('cartBadge');
    const cartItemsList = document.getElementById('cartItemsList');

    function updateCartUI() {
        let totalCount = cart.reduce((sum, item) => sum + item.qty, 0);
        if (cartBadge) cartBadge.textContent = totalCount;

        if (cart.length > 0) {
            cartItemsList.innerHTML = cart.map((item, index) => `
                <div class="cart-item-row" style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px;">
                    <span>${item.name} (x${item.qty})</span>
                    <button onclick="removeCartItem(${index})" style="background:#ff4d4d;color:#fff;border:none;border-radius:50%;width:22px;height:22px;cursor:pointer;">&times;</button>
                </div>
            `).join('');
        } else {
            const isEn = localStorage.getItem('elzozLanguage') === 'en';
            cartItemsList.innerHTML = `<p class="empty-cart-msg">${isEn ? 'The cart is empty' : 'السلة فارغة حالياً'}</p>`;
        }
    }

    window.removeCartItem = function(index) {
        cart.splice(index, 1);
        updateCartUI();
    };

    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('minus')) {
            const count = e.target.nextElementSibling;
            let val = parseInt(count.textContent);
            if (val > 1) count.textContent = --val;
        } else if (e.target.classList.contains('plus')) {
            const count = e.target.previousElementSibling;
            let val = parseInt(count.textContent);
            count.textContent = ++val;
        } else if (e.target.classList.contains('add-to-cart')) {
            const parent = e.target.closest('.card') || e.target.closest('.sandwich-item');
            const title = parent.querySelector('h3')?.textContent || parent.querySelector('.sandwich-name')?.textContent;
            const qty = parseInt(parent.querySelector('.qty-btn span')?.textContent || '1');

            const exist = cart.find(item => item.name === title);
            if (exist) { exist.qty += qty; } else { cart.push({ name: title, qty }); }
            updateCartUI();
        }
    });

    document.getElementById('sendCartWhatsapp')?.addEventListener('click', () => {
        if (cart.length === 0) return alert('اختر طلباتك أولاً');
        let msg = 'طلبات جديدة من الموقع:\n';
        cart.forEach((item, i) => { msg += `${i + 1}. ${item.name} - العدد: ${item.qty}\n`; });
        window.open(`https://wa.me/201041514004?text=${encodeURIComponent(msg)}`, '_blank');
    });

    // =====================================================
    //  تأثيرات طرطشة الماية وهجوم لفة الضهر السريعة للقرش
    // =====================================================
    const shark = document.querySelector('.squid') || document.querySelector('.fish1');
    const targetInteractiveElements = document.querySelectorAll('.category-ball, .card, .add-to-cart, .sidebar-cat-btn');

    targetInteractiveElements.forEach(element => {
        element.addEventListener('click', function (e) {
            const clickX = e.clientX;
            const clickY = e.clientY;

            // 1. إنشاء طرطشة الماية مكان الضغط
            createSplash(clickX, clickY);

            // 2. تفعيل هجوم ولفة القرش
            if (shark) {
                shark.classList.add('shark-strike');
                shark.style.left = `${clickX}px`;
                shark.style.top = `${clickY}px`;

                setTimeout(() => {
                    shark.classList.add('shark-turn');
                }, 150);

                setTimeout(() => {
                    shark.classList.remove('shark-strike', 'shark-turn');
                    shark.style.left = '';
                    shark.style.top = '';
                }, 650);
            }
        });
    });

    function createSplash(x, y) {
        const splash = document.createElement('div');
        splash.className = 'water-splash';
        splash.style.left = `${x}px`;
        splash.style.top = `${y}px`;

        document.body.appendChild(splash);

        setTimeout(() => {
            splash.remove();
        }, 500);
    }
});

    // =====================================================
    //  تأثير هجوم وانقضاض القرش مع طرطشة الماية السينمائية
    // =====================================================

    // إنشاء عنصر القرش الخاص بالهجوم وإضافته للـ Body
    const attackShark = document.createElement('div');
    attackShark.className = 'attacking-shark';
    attackShark.innerHTML = '🦈';
    document.body.appendChild(attackShark);

    // العناصر التي عند الضغط عليها يتم تفعيل الهجوم
    const interactiveElements = document.querySelectorAll('.category-ball, .card, .add-to-cart, .sidebar-cat-btn, .confirm-order-btn');

    interactiveElements.forEach(element => {
        element.addEventListener('click', function (e) {
            const clickX = e.clientX;
            const clickY = e.clientY;

            // 1. إظهار انقضاض القرش من الأسفل نحو موقع الضغطة مباشرة
            triggerSharkBreach(clickX, clickY);

            // 2. إحداث انفجار وطرطشة الماية في مكان الضغط
            createWaterSplash(clickX, clickY);
        });
    });

    function triggerSharkBreach(x, y) {
        // تحديد مكان الانقضاض عند إحداثيات الضغطة
        attackShark.style.left = `${x}px`;
        attackShark.style.top = `${y}px`;

        // إزالة الكلاس ثم إعادته لإعادة تشغيل الأنيميشن في كل ضغطة
        attackShark.classList.remove('active');
        void attackShark.offsetWidth; // Trigger Reflow
        attackShark.classList.add('active');
    }

    function createWaterSplash(x, y) {
        const splash = document.createElement('div');
        splash.className = 'water-splash';
        splash.style.left = `${x}px`;
        splash.style.top = `${y}px`;

        document.body.appendChild(splash);

        setTimeout(() => {
            splash.remove();
        }, 600);
    }
