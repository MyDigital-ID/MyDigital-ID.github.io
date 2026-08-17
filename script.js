document.addEventListener('DOMContentLoaded', () => {
    // 1. العناصر الرئيسية
    const intro = document.getElementById('intro');
    const mediaContainer = document.getElementById('mediaContainer');
    const slideshow = document.getElementById('slideshow');
    const videoSection = document.getElementById('videoSection');
    const introVideo = document.getElementById('introVideo');
    const contactSection = document.getElementById('contactSection');
    const slides = document.querySelectorAll('.slide');
    const dotsContainer = document.getElementById('dotsContainer');
    const bgCards = document.querySelectorAll('.bg-card');

    // زمن عرض كل صورة (1.5 ثانية)
    let currentSlide = 0;
    const slideDuration = 1500;

    // 2. التحكم في القائمة المنزلقة (Side Drawer Menu)
    const openDrawerBtn = document.getElementById('openDrawerBtn');
    const closeDrawerBtn = document.getElementById('closeDrawerBtn');
    const sideDrawer = document.getElementById('sideDrawer');
    const menuOverlay = document.getElementById('menuOverlay');

    function openMenu() {
        sideDrawer.classList.add('open');
        menuOverlay.classList.add('active');
    }

    function closeMenu() {
        sideDrawer.classList.remove('open');
        menuOverlay.classList.remove('active');
    }

    if (openDrawerBtn) openDrawerBtn.addEventListener('click', openMenu);
    if (closeDrawerBtn) closeDrawerBtn.addEventListener('click', closeMenu);
    if (menuOverlay) menuOverlay.addEventListener('click', closeMenu);

    // 3. تفعيل تبديل اللغة (Language Switcher System)
    const langToggle = document.getElementById('langToggle');
    const langEn = document.getElementById('langEn');
    const langAr = document.getElementById('langAr');
    const translatableElements = document.querySelectorAll('[data-en]');

    if (langToggle) {
        langToggle.addEventListener('click', () => {
            const isCurrentEn = langEn.classList.contains('active');
            const targetLang = isCurrentEn ? 'ar' : 'en';

            if (targetLang === 'ar') {
                langEn.classList.remove('active');
                langAr.classList.add('active');
                document.documentElement.setAttribute('dir', 'rtl');
                document.documentElement.setAttribute('lang', 'ar');
            } else {
                langAr.classList.remove('active');
                langEn.classList.add('active');
                document.documentElement.setAttribute('dir', 'ltr');
                document.documentElement.setAttribute('lang', 'en');
            }

            // ترجمة جميع العناصر التفاعلية والقائمة المنزلقة
            translatableElements.forEach(el => {
                if (el.dataset[targetLang]) {
                    el.textContent = el.dataset[targetLang];
                }
            });
        });
    }

    // 4. تجهيز نقاط الترقيم وتحديد الصور الخلفية للـ 3D Stack
    if (slides.length > 0) {
        slides.forEach((_, index) => {
            const dot = document.createElement('div');
            dot.classList.add('dot');
            if (index === 0) dot.classList.add('active');
            if (dotsContainer) dotsContainer.appendChild(dot);
        });
        updateBackgroundCards(0);
    }
    const dots = document.querySelectorAll('.dot');

    // 5. رفع الشعار وإظهار السلايدر بعد 4.8 ثانية
    setTimeout(() => {
        if (intro) intro.classList.add('move-up');
        if (mediaContainer) mediaContainer.classList.add('show');
        
        if (slides.length > 0) {
            slides[0].classList.add('active');
            startSlideshow();
        }
    }, 4800);

    // 6. دالة تحديث صور الكروت الخلفية 3D
    function updateBackgroundCards(index) {
        if (bgCards.length >= 3 && slides.length > 0) {
            const next1 = (index + 1) % slides.length;
            const next2 = (index + 2) % slides.length;
            const next3 = (index + 3) % slides.length;

            bgCards[0].style.backgroundImage = `url(${slides[next1].src})`;
            bgCards[1].style.backgroundImage = `url(${slides[next2].src})`;
            bgCards[2].style.backgroundImage = `url(${slides[next3].src})`;
        }
    }

    // 7. تشغيل معرض الصور
    function startSlideshow() {
        const interval = setInterval(() => {
            if (slides[currentSlide]) {
                slides[currentSlide].classList.remove('active');
                slides[currentSlide].classList.add('exit');
                if (dots[currentSlide]) dots[currentSlide].classList.remove('active');
            }

            currentSlide++;

            if (currentSlide < slides.length) {
                slides[currentSlide].classList.add('active');
                if (dots[currentSlide]) dots[currentSlide].classList.add('active');
                updateBackgroundCards(currentSlide);
            } else {
                clearInterval(interval);
                if (slideshow) slideshow.classList.add('fade-out');
                setTimeout(switchToVideo, 800);
            }
        }, slideDuration);
    }

    // 8. التحول للفيديو
    function switchToVideo() {
        if (slideshow) slideshow.style.display = 'none';
        
        if (videoSection) {
            videoSection.style.display = 'block';
            setTimeout(() => {
                videoSection.classList.add('fade-in');
            }, 50);
        }

        if (introVideo) {
            introVideo.play().catch(err => console.log("Auto-play waiting:", err));
        }

        if (contactSection) {
            contactSection.classList.add('show');
        }
    }

    // 9. تم إيقاف التحويل التلقائي لمنع خطأ Server Error / 404
    // سيظل الزائر داخل الصفحة لاستعراض المحتوى والتواصل، أو الضغط على زر الرجوع بنفسه.
});
