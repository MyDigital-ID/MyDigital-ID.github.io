# مشويات أبو خميس — الموقع والتطبيق

## هيكل الملفات
- `index.html` / `style.css` / `script.js` — الموقع نفسه (يقرأ كل المحتوى من `data.json`)
- `data.json` — كل بيانات المحل: الاسم، الأقسام، الأصناف، الأسعار، الواتس، الإحداثيات
- `manifest.json` + `service-worker.js` — تحويل الموقع لتطبيق (PWA) يتثبت من المتصفح
- `admin.html` — لوحة التحكم، بتعدل `data.json` مباشرة على GitHub
- `assets/` — مجلدات الصور والفيديو واللوجو (فاضية دلوقتي، لسه محتاجة الملفات الحقيقية)

## قبل الرفع على GitHub
1. حط صور المنتجات في `assets/images/` بنفس الأسماء المكتوبة في `data.json`
2. حط الفيديو في `assets/video/video.mp4`
3. حط اللوجوهات في `assets/logo/` (اللوجو المربع اتحط بالفعل)
4. اعمل أيقونتين للتطبيق `icon-192.png` و `icon-512.png` في `assets/icons/`

## تفعيل لوحة التحكم (admin.html)
1. افتح `admin.html` وغيّر أول سطرين في الكود:
   ```
   const OWNER = 'REPLACE_GITHUB_OWNER';
   const REPO = 'REPLACE_GITHUB_REPO';
   ```
   حطهم باسم حسابك واسم الريبو الفعلي على GitHub
2. اعمل GitHub Personal Access Token (fine-grained) بصلاحية Contents: Read & Write على الريبو ده بس
3. ارفع كل الملفات على GitHub، وفعّل GitHub Pages من إعدادات الريبو
4. افتح `yourdomain/admin.html`، الصق التوكن، وابدأ تعدل الأسعار والبيانات — أي حفظ بيتنفذ فوراً على data.json الحقيقي

⚠️ التوكن ده مفتاح دخول حقيقي — افتح اللوحة من جهازك الشخصي بس، ولو حسيت إنه اتسرب اعمل Revoke فوراً من GitHub.

## بعد ما يتظبط شكل الموقع على GitHub
تقدر تاخد نفس الملفات وترفعها على Cloudflare Pages كنسخة احتياطية منفصلة (زي ما اتفقنا)، من غير ما تربطها بالـ GitHub repo.
