let currentSlide = 0;
const slides = document.querySelectorAll('.slide');
let autoTimer = null;
// تم تحديث الأوقات لتشمل الشرائح الـ 6 كاملة (بما فيها شريحة التسويات البنكية)
const slideDurations = [15, 20, 20, 20, 20, 20];

// تأثير خلفية الماتريكس (Matrix Effect)
const canvas = document.getElementById('matrixCanvas');
const ctx = canvas.getContext('2d');

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

const katakana = 'アァカサタナハマヤャラワガザダバパイィキシチニヒミリヰギジヂビピウゥクスツヌフムユュルグズブヅプエェケセテネヘメレヱゲゼデベペオォコソトノホモヨョロヲゴゾドボポヴッン';
const latin = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
const alphabet = katakana + latin;
const fontSize = 16;
const columns = Math.floor(window.innerWidth / fontSize);
const rainDrops = Array(columns).fill(1);

function drawMatrix() {
    ctx.fillStyle = 'rgba(5, 8, 14, 0.08)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = '#0F0';
    ctx.font = fontSize + 'px monospace';

    for (let i = 0; i < rainDrops.length; i++) {
        const text = alphabet.charAt(Math.floor(Math.random() * alphabet.length));
        ctx.fillText(text, i * fontSize, rainDrops[i] * fontSize);

        if (rainDrops[i] * fontSize > canvas.height && Math.random() > 0.975) {
            rainDrops[i] = 0;
        }
        rainDrops[i]++;
    }
}
setInterval(drawMatrix, 33);

// التنقل بين الشرائح
function showSlide(index) {
    slides.forEach((slide, idx) => {
        slide.classList.remove('active');
        if (idx === index) {
            slide.classList.add('active');
        }
    });
    currentSlide = index;
    resetAutoTimer();
}

function nextSlide() {
    showSlide((currentSlide + 1) % slides.length);
}

function prevSlide() {
    showSlide((currentSlide - 1 + slides.length) % slides.length);
}

function goToSlide(index) {
    showSlide(index);
}

function resetAutoTimer() {
    clearTimeout(autoTimer);
    if (currentSlide < slideDurations.length) {
        autoTimer = setTimeout(nextSlide, slideDurations[currentSlide] * 1000);
    }
}

function toggleMenu() {
    document.getElementById('sideMenu').classList.toggle('open');
}

// نافذة الـ QR Code
function openQRModal() {
    document.getElementById('qrModal').style.display = 'flex';
}

function closeQRModal() {
    document.getElementById('qrModal').style.display = 'none';
}

// إنشاء وتنزيل ملف Contact Card (vCard)
function downloadVCard() {
    const vcardData = `BEGIN:VCARD
VERSION:3.0
FN:Dr. Mostafa Darwish
TITLE:مستشار قانوني وتدريب مصرفي
ADR:;;52 شارع توت عنخ أمون أبراج سيدي جابر;الإسكندرية;;;مصر
URL:https://mydigital-id.com
END:VCARD`;

    const blob = new Blob([vcardData], { type: 'text/vcard;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.setAttribute('download', 'Dr_Mostafa_Darwish.vcf');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

// نظام تغيير اللغة
function setLanguage(lang) {
    const elements = document.querySelectorAll('[data-ar]');
    elements.forEach(el => {
        el.textContent = (lang === 'en') ? el.getAttribute('data-en') : el.getAttribute('data-ar');
    });

    document.documentElement.dir = (lang === 'en') ? 'ltr' : 'rtl';
    document.querySelectorAll('.lang-btn').forEach(btn => btn.classList.remove('active'));
    
    if (event && event.target) {
        event.target.classList.add('active');
    }
}

window.onload = function() {
    resetAutoTimer();
};
