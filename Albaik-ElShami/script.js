document.addEventListener('DOMContentLoaded', () => {

    // --- قاموس الترجمات (i18n) ---
    const translations = {
        ar: {
            pageTitle: "مطعم البيك الشامي",
            mainTitle: "مطعم البيك الشامي",
            aboutTitle: "عن البيك الشامي",
            aboutText: "مرحباً بكم في مطعم البيك الشامي! نقدم لكم أشهى وألذ المأكولات الشامية والوجبات السريعة المحضرة بأعلى معايير الجودة والنظافة، باستخدام أفضل المكونات والبهارات الأصلية لننقل لكم طعم الشام الحقيقي في كل وجبة.",
            slogan: '"أطيب من هيك .. ما في غير عند البيك"',
            subSlogan: "البيك الشامي .. الطعم السوري الأصلي",
            mapBtn: "موقعنا على الخريطة",
            vcardBtn: "حفظ جهة الاتصال (vCard)",
            qrTitle: "رمز QR الخاص بالمنيو",
            qrDownload: "تحميل الـ QR Code",
            addToCart: "إضافة للسلة",
            whatsappBtn: "اطلب الآن عبر الواتساب",
            
            // الوجبات
            mixBox: "بوكس الميكس العائلي",
            farhaBox: "بوكس الفرحة",
            familyBox: "بوكس العيلة",
            sitraBox: "بوكس السترة",
            kingShawarmaBox: "بوكس ملك الشاورما",
            azamaBox: "بوكس العظمة",
            akilaBox: "بوكس الأكيلة",
            moalemBox: "بوكس المعلم",
            karmOffer: "عرض الكرم",
            mariaKings: "ملوك المعمرية",
            summerOffer: "عرض الصيف",
            vacationOffer: "عرض الإجازة",
            bakawatOffer: "عرض البكاوات",
            tabtabaOffer: "عرض الطبطبة",
            kingOffer: "عرض الكينج",
            moalemOffer: "عرض المعلم",
            mzagOffer: "عرض المزاج",
            raiqMeatOffer: "عرض الرايق لحم",
            raiqChickenOffer: "عرض الرايق دجاج",
            saadaOffer: "عرض السعادة",
            ostoraOffer: "عرض الأسطورة",
            ebnBaikOffer: "عرض ابن البيك"
        },
        en: {
            pageTitle: "Al-Baik Al-Shami Restaurant",
            mainTitle: "Al-Baik Al-Shami Restaurant",
            aboutTitle: "About Al-Baik Al-Shami",
            aboutText: "Welcome to Al-Baik Al-Shami! We serve the finest Levantine cuisine and fast food prepared with the highest quality and cleanliness standards, using authentic spices to bring you the true taste of Syria.",
            slogan: '"Nothing beats the taste of Al-Baik"',
            subSlogan: "Al-Baik Al-Shami .. Authentic Syrian Taste",
            mapBtn: "Our Location on Map",
            vcardBtn: "Save Contact (vCard)",
            qrTitle: "Menu QR Code",
            qrDownload: "Download QR Code",
            addToCart: "Add to Cart",
            whatsappBtn: "Order Now via WhatsApp",
            
            // Meals
            mixBox: "Family Mix Box",
            farhaBox: "Farha Box",
            familyBox: "Family Box",
            sitraBox: "Sitra Box",
            kingShawarmaBox: "Shawarma King Box",
            azamaBox: "Azama Box",
            akilaBox: "Akila Box",
            moalemBox: "El-Moalem Box",
            karmOffer: "El-Karm Offer",
            mariaKings: "Kings of Maria",
            summerOffer: "Summer Offer",
            vacationOffer: "Vacation Offer",
            bakawatOffer: "Bakawat Offer",
            tabtabaOffer: "Tabtaba Offer",
            kingOffer: "King Offer",
            moalemOffer: "Moalem Offer",
            mzagOffer: "Mzag Offer",
            raiqMeatOffer: "Raiq Meat Offer",
            raiqChickenOffer: "Raiq Chicken Offer",
            saadaOffer: "Saada Offer",
            ostoraOffer: "Ostora Offer",
            ebnBaikOffer: "Ebn El-Baik Offer"
        }
    };

    let currentLang = 'ar';

    // 1. زر تبديل اللغة
    const langToggleBtn = document.getElementById('langToggleBtn');
    langToggleBtn?.addEventListener('click', () => {
        currentLang = (currentLang === 'ar') ? 'en' : 'ar';
        langToggleBtn.textContent = (currentLang === 'ar') ? 'EN' : 'عربي';
        
        // تغيير اتجاه الصفحة
        document.documentElement.setAttribute('dir', currentLang === 'ar' ? 'rtl' : 'ltr');
        document.documentElement.setAttribute('lang', currentLang);

        // تحديث النصوص
        document.querySelectorAll('[data-i18n]').forEach(el => {
            const key = el.getAttribute('data-i18n');
            if (translations[currentLang][key]) {
                el.textContent = translations[currentLang][key];
            }
        });
    });

    // 2. القائمة الجانبية
    const menuToggleBtn = document.getElementById('menuToggleBtn');
    const closeSidebarBtn = document.getElementById('closeSidebarBtn');
    const sidebar = document.getElementById('sidebar');

    menuToggleBtn?.addEventListener('click', () => sidebar.classList.add('open'));
    closeSidebarBtn?.addEventListener('click', () => sidebar.classList.remove('open'));

    // 3. فيديو الهيدر
    const chefVideo = document.getElementById('chefVideo');
    const videoWrapper = document.getElementById('videoWrapper');
    const logo2Wrapper = document.getElementById('logo2Wrapper');
    let videoPlayCount = 0;

    if (chefVideo) {
        chefVideo.addEventListener('ended', () => {
            videoPlayCount++;
            if (videoPlayCount < 2) {
                chefVideo.play();
            } else {
                videoWrapper.style.opacity = '0';
                setTimeout(() => {
                    videoWrapper.style.display = 'none';
                    logo2Wrapper.style.opacity = '1';
                }, 1000);
            }
        });
    }

    // 4. إظهار كرات الاختيار بعد 3 ثوانٍ
    setTimeout(() => {
        document.querySelector('.floating-categories')?.classList.add('show');
    }, 3000);

    // 5. التصفية التفاعلية بالصفوف عند الضغط على الكرات
    const categoryBalls = document.querySelectorAll('.category-ball');
    const mainFeaturedRows = document.querySelectorAll('.main-featured-row');
    const categoryRows = document.querySelectorAll('[data-category-row]');

    categoryBalls.forEach(ball => {
        ball.addEventListener('click', () => {
            const selectedCategory = ball.getAttribute('data-category');

            // إخفاء الوجبات الرئيسية الأربعة
            mainFeaturedRows.forEach(row => row.classList.add('hidden-row'));

            // إظهار صفوف القسم المختار
            categoryRows.forEach(row => {
                if (row.getAttribute('data-category-row') === selectedCategory) {
                    row.classList.remove('hidden-row');
                } else {
                    row.classList.add('hidden-row');
                }
            });
        });
    });

    // 6. فيديو الدجاج
    const chickenVideo = document.getElementById('chickenVideo');
    let chickenPlayCount = 0;

    if (chickenVideo) {
        chickenVideo.addEventListener('ended', () => {
            chickenPlayCount++;
            if (chickenPlayCount < 2) {
                chickenVideo.play();
            } else {
                chickenVideo.pause();
            }
        });
    }

    // 7. تحميل vCard
    document.getElementById('downloadVcardBtn')?.addEventListener('click', () => {
        const vcardData = 
`BEGIN:VCARD
VERSION:3.0
FN:مطعم البيك الشامي
TEL;TYPE=CELL:+201287307518
ADR;TYPE=WORK:;;شارع نفق المحروسة من البحر, السيوف بحري, أول المنتزه;الإسكندرية;;;مصر
URL;TYPE=WORK:https://mydigital-id.github.io/Albaik-ElShami/
URL;TYPE=Facebook:https://www.facebook.com/share/18GpESiAv5/
URL;TYPE=Instagram:https://www.instagram.com/albaik_elshami/
END:VCARD`;

        const blob = new Blob([vcardData], { type: 'text/vcard;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', 'AlBaik-ElShami.vcf');
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    });

    // 8. أزرار التحكم بالكمية
    document.querySelectorAll('.qty-btn').forEach(group => {
        const minus = group.querySelector('.minus');
        const plus = group.querySelector('.plus');
        const count = group.querySelector('span');

        minus.addEventListener('click', () => {
            let val = parseInt(count.textContent);
            if (val > 1) count.textContent = --val;
        });

        plus.addEventListener('click', () => {
            let val = parseInt(count.textContent);
            count.textContent = ++val;
        });
    });
});
