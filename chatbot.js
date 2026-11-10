/* ===== مدير المشاريع — MyDigital-ID chat =====
   الرسائل تُرسل إلى Cloudflare Worker، والتوكن والـ ID محفوظان هناك فقط. */

(function () {
    'use strict';

    // ضع هنا رابط الـ Worker بعد نشره على Cloudflare
 const WORKER_URL = 'https://mydigital-bot.download-my-app.workers.dev/'; 

    const AVATAR = 'assets/manager.jpg';

    // قيم التقرير (تصل لتليجرام دائماً بالعربية)
    const ACTIVITIES = [
        { ar: 'تجارة', en: 'Trade / Retail' },
        { ar: 'تقديم خدمات', en: 'Services' },
        { ar: 'مكتب خاص', en: 'Private office' },
        { ar: 'عيادة طبيب', en: 'Doctor\u2019s clinic' }
    ];
    const BUDGETS = ['3000', '5000', '10000'];

    const T = {
        ar: {
            name: 'مدير المشاريع',
            hello: g => `${g}، أنا مدير المشاريع.`,
            morning: 'صباح الخير', evening: 'مساء الخير',
            nameQ: 'أتشرف بالاسم الكريم', namePh: 'اكتب اسمك',
            welcome: n => `أهلاً بك يا ${n}. هل تواصلك بخصوص:`,
            optA: 'أ- إنشاء موقع إلكتروني وتطبيق جديدين',
            optB: 'ب- تطوير صفحة موجودة بالفعل',
            optC: 'ت- استفسار آخر',
            actQ: 'ما هو نوع النشاط؟',
            countQ: 'كم عدد أقسام المشروع أو عدد المنتجات التي سيتم عرضها في الموقع؟', countPh: 'اكتب العدد',
            ideaQ: 'هل هناك فكرة معينة تحب تنفيذها على أرض الواقع؟', ideaPh: 'اكتب فكرتك',
            budQA: 'ما هي الميزانية المناسبة لك؟',
            budPh: 'أو اكتب المبلغ المناسب (ج م)',
            linkQ: 'من فضلك قم بنسخ رابط موقعك الإلكتروني في الخانة التالية.', linkPh: 'رابط الموقع',
            curActQ: 'ما هو نوع النشاط الحالي؟',
            devQ: 'ما نوع التطوير المطلوب؟', devPh: 'اكتب التطوير المطلوب',
            budQB: 'ما هي الميزانية المناسبة لهذا التطوير؟',
            inqQ: 'من فضلك اكتب الاستفسار المطلوب وسوف نقوم بالرد عليك في أسرع وقت.', inqPh: 'اكتب استفسارك',
            phoneQ: 'من فضلك اكتب رقمك وسوف يتم التواصل معك في أقرب وقت ممكن.', phonePh: 'رقم الموبايل',
            thanks: 'نشكر لك وقتك ونرجو لك دوام التوفيق والنجاح.',
            sendErr: 'تعذر إرسال بياناتك الآن، تأكد من الاتصال بالإنترنت.', retry: 'إعادة المحاولة',
            vName: 'من فضلك اكتب الاسم الكريم.',
            vPhone: 'الرقم غير صحيح، من فضلك اكتبه مرة أخرى بالأرقام فقط.',
            vLink: 'من فضلك انسخ رابط الموقع كاملاً في الخانة.',
            vBudget: 'من فضلك اكتب المبلغ بالأرقام فقط.',
            vFree: 'من فضلك اكتب تفاصيل أكثر قليلاً.',
            typeHere: 'اكتب هنا...', pickAbove: 'اختر من الأعلى',
            cur: 'ج م', close: 'إغلاق', send: 'إرسال', open: 'تحدث مع مدير المشاريع'
        },
        en: {
            name: 'Project Manager',
            hello: g => `${g}, I\u2019m the Project Manager.`,
            morning: 'Good morning', evening: 'Good evening',
            nameQ: 'May I have your name, please?', namePh: 'Your name',
            welcome: n => `Welcome, ${n}. Are you contacting us about:`,
            optA: 'A- Creating a new website and app',
            optB: 'B- Developing an existing page',
            optC: 'C- Another inquiry',
            actQ: 'What is your type of business?',
            countQ: 'How many sections or products will be displayed on the website?', countPh: 'Type the number',
            ideaQ: 'Is there a specific idea you would like to bring to life?', ideaPh: 'Type your idea',
            budQA: 'What budget suits you?',
            budPh: 'Or type your budget (EGP)',
            linkQ: 'Please copy your website link into the box below.', linkPh: 'Website link',
            curActQ: 'What is your current type of business?',
            devQ: 'What kind of development do you need?', devPh: 'Type the development needed',
            budQB: 'What budget suits this development?',
            inqQ: 'Please type your inquiry and we will reply as soon as possible.', inqPh: 'Type your inquiry',
            phoneQ: 'Please type your phone number and we will contact you as soon as possible.', phonePh: 'Phone number',
            thanks: 'Thank you for your time. We wish you all the best and continued success.',
            sendErr: 'We couldn\u2019t send your details right now. Please check your connection.', retry: 'Try again',
            vName: 'Please type your name.',
            vPhone: 'That number doesn\u2019t look right. Please type digits only.',
            vLink: 'Please paste the full website link.',
            vBudget: 'Please type the amount in numbers only.',
            vFree: 'Please add a few more details.',
            typeHere: 'Type here...', pickAbove: 'Choose from above',
            cur: 'EGP', close: 'Close', send: 'Send', open: 'Chat with the Project Manager'
        }
    };

    // على الموبايل لا نفتح الكيبورد تلقائياً — يظهر فقط عندما يضغط الزائر على الخانة
    const isTouch =
        (window.matchMedia && window.matchMedia('(pointer: coarse)').matches) ||
        'ontouchstart' in window;

    let epoch = 0; // يزيد عند إعادة بدء المحادثة لإلغاء أي تشغيل قديم

    function lang() {
        return document.documentElement.getAttribute('lang') === 'ar' ? 'ar' : 'en';
    }
    function t(key) { return T[lang()][key]; }

    /* ---------- أدوات ---------- */

    const sleep = ms => new Promise(r => setTimeout(r, ms));

    function toLatinDigits(str) {
        return str
            .replace(/[٠-٩]/g, d => '٠١٢٣٤٥٦٧٨٩'.indexOf(d))
            .replace(/[۰-۹]/g, d => '۰۱۲۳۴۵۶۷۸۹'.indexOf(d));
    }

    function toArabicDigits(str) {
        return String(str).replace(/\d/g, d => '٠١٢٣٤٥٦٧٨٩'[d]);
    }

    function showDigits(str) {
        return lang() === 'ar' ? toArabicDigits(str) : String(str);
    }

    function greeting() {
        // من 12 منتصف الليل حتى 11:59 صباحاً: صباح الخير — من 12 ظهراً: مساء الخير
        return new Date().getHours() < 12 ? t('morning') : t('evening');
    }

    function el(tag, cls, text) {
        const e = document.createElement(tag);
        if (cls) e.className = cls;
        if (text !== undefined) e.textContent = text;
        return e;
    }

    /* ---------- بناء الواجهة ---------- */

    const launcher = el('button', 'pm-launcher');
    launcher.type = 'button';
    launcher.setAttribute('aria-label', t('open'));
    launcher.style.backgroundImage = `url('${AVATAR}')`;
    launcher.appendChild(el('span', 'pm-dot'));

    const panel = el('div', 'pm-panel');
    panel.setAttribute('role', 'dialog');
    panel.setAttribute('aria-label', t('name'));

    const header = el('div', 'pm-header');
    const avatar = el('div', 'pm-avatar');
    avatar.style.backgroundImage = `url('${AVATAR}')`;
    avatar.appendChild(el('span', 'pm-dot'));
    const title = el('div', 'pm-title');
    const titleName = el('strong', '', t('name'));
    title.appendChild(titleName);
    const closeBtn = el('button', 'pm-close', '×');
    closeBtn.type = 'button';
    closeBtn.setAttribute('aria-label', t('close'));
    header.append(avatar, title, closeBtn);

    const messages = el('div', 'pm-messages');
    messages.setAttribute('aria-live', 'polite');

    const bar = el('div', 'pm-inputbar');
    const input = el('textarea', 'pm-input');
    input.rows = 1;
    const sendBtn = el('button', 'pm-send');
    sendBtn.type = 'button';
    sendBtn.setAttribute('aria-label', t('send'));
    sendBtn.innerHTML = '<svg viewBox="0 0 24 24" width="22" height="22" fill="#fff" aria-hidden="true"><path d="M3 11.2 20.5 3.6c.9-.4 1.8.5 1.4 1.4L14.3 21c-.4.9-1.7.8-2-.1l-1.9-6.2-6.2-1.9c-.9-.3-1-1.5-.2-1.6zM11 13.6l5.4-6.3-7.6 5.1z"/></svg>';
    bar.append(input, sendBtn);

    panel.append(header, messages, bar);
    document.body.append(launcher, panel);

    // اتجاه الشات واسمه يتبعان لغة الصفحة (وعند تغييرها أثناء المحادثة)
    function applyLang() {
        const l = lang();
        panel.setAttribute('dir', l === 'ar' ? 'rtl' : 'ltr');
        panel.setAttribute('lang', l);
        titleName.textContent = t('name');
        closeBtn.setAttribute('aria-label', t('close'));
        sendBtn.setAttribute('aria-label', t('send'));
        launcher.setAttribute('aria-label', t('open'));
        panel.setAttribute('aria-label', t('name'));
    }
    applyLang();
    new MutationObserver(applyLang).observe(document.documentElement, {
        attributes: true,
        attributeFilter: ['lang']
    });

    /* ---------- رسائل ---------- */

    function scrollDown() {
        messages.scrollTop = messages.scrollHeight;
    }

    function addUser(text) {
        messages.appendChild(el('div', 'pm-msg user', text));
        scrollDown();
    }

    async function say(text, delay) {
        const myEpoch = epoch;
        const t = el('div', 'pm-typing');
        t.append(el('i'), el('i'), el('i'));
        messages.appendChild(t);
        scrollDown();
        await sleep(delay || Math.min(500 + text.length * 14, 1500));
        t.remove();
        if (myEpoch !== epoch) throw new Error('cancelled');
        messages.appendChild(el('div', 'pm-msg bot', text));
        scrollDown();
    }

    /* ---------- انتظار إجابة الزائر ---------- */

    let pending = null; // { mode, resolve, validate }

    function setInput(enabled, placeholder, inputmode) {
        input.disabled = !enabled;
        sendBtn.disabled = !enabled;
        input.placeholder = placeholder || '';
        input.setAttribute('inputmode', inputmode || 'text');
        input.value = '';
        input.style.height = 'auto';
        if (enabled && !isTouch) setTimeout(() => input.focus(), 50);
    }

    function submitText() {
        if (!pending || pending.mode === 'choice') return;
        const raw = input.value.trim();
        if (!raw) return;
        const p = pending;
        const result = p.validate ? p.validate(raw) : { ok: true, value: raw };
        if (!result.ok) {
            p.onInvalid && p.onInvalid(result.message);
            return;
        }
        pending = null;
        setInput(false, t('typeHere'));
        addUser(result.display || result.value);
        p.resolve(result.value);
    }

    sendBtn.addEventListener('click', submitText);
    input.addEventListener('keydown', e => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            submitText();
        }
    });
    input.addEventListener('input', () => {
        input.style.height = 'auto';
        input.style.height = Math.min(input.scrollHeight, 120) + 'px';
    });

    // سؤال بخانة كتابة
    function askText(placeholder, validate, inputmode) {
        return new Promise(resolve => {
            pending = {
                mode: 'text',
                resolve,
                validate,
                onInvalid: msg => say(msg, 500)
            };
            setInput(true, placeholder, inputmode);
        });
    }

    // سؤال باختيارات (أزرار) — وممكن معها خانة كتابة
    function askChoice(options, config) {
        config = config || {};
        return new Promise(resolve => {
            const wrap = el('div', 'pm-choices');
            options.forEach(opt => {
                const b = el('button', 'pm-choice', opt.label);
                b.type = 'button';
                b.addEventListener('click', () => {
                    if (!pending) return;
                    pending = null;
                    wrap.remove();
                    setInput(false, t('typeHere'));
                    addUser(opt.label);
                    resolve(opt.value !== undefined ? opt.value : opt.label);
                });
                wrap.appendChild(b);
            });
            messages.appendChild(wrap);
            scrollDown();

            if (config.allowText) {
                pending = {
                    mode: 'text',
                    resolve: v => { wrap.remove(); resolve(v); },
                    validate: config.validate,
                    onInvalid: msg => say(msg, 500)
                };
                setInput(true, config.placeholder, config.inputmode);
            } else {
                pending = { mode: 'choice' };
                setInput(false, t('pickAbove'));
            }
        });
    }

    /* ---------- التحقق ---------- */

    function validateName(raw) {
        if (raw.length < 2) return { ok: false, message: t('vName') };
        return { ok: true, value: raw.slice(0, 60) };
    }

    function validatePhone(raw) {
        const digits = toLatinDigits(raw).replace(/[\s\-()+]/g, '');
        if (!/^\d{8,15}$/.test(digits)) {
            return { ok: false, message: t('vPhone') };
        }
        return { ok: true, value: digits, display: showDigits(digits) };
    }

    function validateLink(raw) {
        const v = raw.replace(/\s/g, '');
        if (v.length < 4 || !v.includes('.')) {
            return { ok: false, message: t('vLink') };
        }
        return { ok: true, value: v };
    }

    function validateBudget(raw) {
        const digits = toLatinDigits(raw).replace(/[,،.\s]/g, '').replace(/ج\s?م/g, '');
        if (!/^\d{3,9}$/.test(digits)) {
            return { ok: false, message: t('vBudget') };
        }
        return { ok: true, value: digits, display: showDigits(digits) + ' ' + t('cur') };
    }

    function validateFree(min) {
        return raw => raw.length < min
            ? { ok: false, message: t('vFree') }
            : { ok: true, value: raw.slice(0, 1200) };
    }

    /* ---------- الأسئلة المشتركة ---------- */

    function activityOptions() {
        return ACTIVITIES.map(a => ({ label: a[lang()], value: a.ar }));
    }

    function budgetOptions() {
        return BUDGETS.map(b => ({
            label: showDigits(b) + ' ' + t('cur'),
            value: b
        }));
    }

    async function askBudget(key) {
        await say(t(key));
        const v = await askChoice(budgetOptions(), {
            allowText: true,
            placeholder: t('budPh'),
            inputmode: 'numeric',
            validate: validateBudget
        });
        return v + ' ج م';
    }

    async function askPhone() {
        await say(t('phoneQ'));
        return askText(t('phonePh'), validatePhone, 'tel');
    }

    async function thanks() {
        await say(t('thanks'));
    }

    /* ---------- الإرسال إلى تليجرام عبر الـ Worker ---------- */

    function buildReport(d) {
        const lines = ['📩 طلب جديد من موقع MyDigital-ID', ''];
        lines.push('👤 الاسم: ' + d.name);
        lines.push('🎯 الموضوع: ' + d.topic);
        d.rows.forEach(r => lines.push(r[0] + ': ' + r[1]));
        lines.push('📞 الموبايل: ' + d.phone);
        lines.push('');
        lines.push('🕒 ' + new Date().toLocaleString('ar-EG'));
        return lines.join('\n');
    }

    async function deliver(report) {
        const res = await fetch(WORKER_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message: report })
        });
        if (!res.ok) throw new Error('HTTP ' + res.status);
    }

    async function sendWithRetry(report) {
        for (;;) {
            try {
                await deliver(report);
                return true;
            } catch (e) {
                await say(t('sendErr'));
                const again = await askChoice([{ label: t('retry'), value: 'retry' }]);
                if (again !== 'retry') return false;
            }
        }
    }

    /* ---------- زر التحويل للعربية (يظهر فقط في الشات الإنجليزي) ---------- */

    let hintEl = null;

    function addLangHint() {
        removeLangHint();
        const b = el('button', 'pm-hint');
        b.type = 'button';
        b.setAttribute('dir', 'rtl');
        b.setAttribute('lang', 'ar');
        b.appendChild(el('span', 'pm-hint-text', 'للتواصل باللغة العربية اضغط هنا'));
        b.appendChild(el('span', 'pm-hint-icon', 'ع'));
        b.addEventListener('click', switchToArabic);
        messages.appendChild(b);
        hintEl = b;
        scrollDown();
    }

    function removeLangHint() {
        if (hintEl) { hintEl.remove(); hintEl = null; }
    }

    function switchToArabic() {
        const toggle = document.getElementById('langToggle');
        if (lang() !== 'ar' && toggle) toggle.click(); // يحوّل الموقع كله
        applyLang();
        // إعادة بدء المحادثة بالعربية (لم يُدخل الزائر بياناته بعد)
        epoch++;
        pending = null;
        hintEl = null;
        messages.innerHTML = '';
        setInput(false, t('typeHere'));
        runFlow().catch(() => {});
    }

    /* ---------- سير المحادثة ---------- */

    let started = false;

    async function runFlow() {
        const data = { rows: [] };

        await say(T[lang()].hello(greeting()));
        if (lang() === 'en') addLangHint();
        await say(t('nameQ'));
        data.name = await askText(t('namePh'), validateName);
        removeLangHint();

        await say(T[lang()].welcome(data.name));
        const path = await askChoice([
            { label: t('optA'), value: 'A' },
            { label: t('optB'), value: 'B' },
            { label: t('optC'), value: 'C' }
        ]);

        if (path === 'A') {
            data.topic = 'إنشاء موقع إلكتروني وتطبيق جديدين';

            await say(t('actQ'));
            const activity = await askChoice(activityOptions());
            data.rows.push(['🏷️ نوع النشاط', activity]);

            await say(t('countQ'));
            const count = await askText(t('countPh'), validateFree(1));
            data.rows.push(['🗂️ الأقسام/المنتجات', count]);

            await say(t('ideaQ'));
            const idea = await askText(t('ideaPh'), validateFree(2));
            data.rows.push(['💡 الفكرة', idea]);

            const budget = await askBudget('budQA');
            data.rows.push(['💰 الميزانية', budget]);
        }

        else if (path === 'B') {
            data.topic = 'تطوير صفحة موجودة بالفعل';

            await say(t('linkQ'));
            const link = await askText(t('linkPh'), validateLink, 'url');
            data.rows.push(['🔗 رابط الموقع', link]);

            await say(t('curActQ'));
            const activity = await askChoice(activityOptions());
            data.rows.push(['🏷️ نوع النشاط', activity]);

            await say(t('devQ'));
            const dev = await askText(t('devPh'), validateFree(2));
            data.rows.push(['🛠️ التطوير المطلوب', dev]);

            const budget = await askBudget('budQB');
            data.rows.push(['💰 الميزانية', budget]);
        }

        else {
            data.topic = 'استفسار آخر';

            await say(t('inqQ'));
            const q = await askText(t('inqPh'), validateFree(2));
            data.rows.push(['❓ الاستفسار', q]);
        }

        data.phone = await askPhone();

        const ok = await sendWithRetry(buildReport(data));
        if (ok) await thanks();
    }

    /* ---------- فتح وغلق ---------- */

    function openChat() {
        panel.classList.add('pm-open');
        launcher.classList.add('pm-hidden');
        if (!started) {
            started = true;
            runFlow().catch(() => {});
        } else if (pending && pending.mode !== 'choice' && !isTouch) {
            setTimeout(() => input.focus(), 50);
        }
    }

    function closeChat() {
        panel.classList.remove('pm-open');
        launcher.classList.remove('pm-hidden');
    }

    launcher.addEventListener('click', openChat);
    closeBtn.addEventListener('click', closeChat);
    document.addEventListener('keydown', e => {
        if (e.key === 'Escape' && panel.classList.contains('pm-open')) closeChat();
    });

    const pageBtn = document.getElementById('chatOpenBtn');
    if (pageBtn) pageBtn.addEventListener('click', openChat);

    setInput(false, t('typeHere'));
})();
