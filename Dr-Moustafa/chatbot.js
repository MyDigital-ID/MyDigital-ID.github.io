/* ===== شات "نور" - المساعد الشخصي للدكتور مصطفى =====
   يجمع بيانات الزائر في محادثة قصيرة ثم يرسلها إلى تليجرام.
   الإعدادات في الأعلى فقط - لا تحتاج لتعديل أي شيء آخر في الملف. */
(function () {
    'use strict';

    var CONFIG = {
        token: '9171546657:AAFIR9bJd6pdpp9nEv3XZzXRDyq9zuMMZQ8', // توكن البوت من BotFather
        chatId: '9190862085',                                    // رقم محادثتك على تليجرام
        whatsapp: '201008070087',                                // واتساب احتياطي لو فشل الإرسال
        avatar: 'assets/images/noor.png',                        // صورة نور
        cooldownMs: 60000,                                       // أقل مدة بين طلبين من نفس الجهاز
        maxFiles: 5,
        maxFileMB: 10,
        teaserDelayMs: 5000
    };

    /* ---------------- النصوص (عربي / إنجليزي) ---------------- */
    var S = {
        name: { ar: 'نور', en: 'Noor' },
        sub: { ar: 'المساعد الشخصي للدكتور مصطفى', en: "Dr. Moustafa's personal assistant" },
        open: { ar: 'فتح المحادثة مع نور', en: 'Chat with Noor' },
        close: { ar: 'إغلاق', en: 'Close' },
        send: { ar: 'إرسال', en: 'Send' },
        teaser: { ar: 'كيف يمكنني مساعدة حضرتك؟', en: 'How can I help you?' },

        greet: {
            ar: 'أهلاً بحضرتك، أنا نور، المساعد الشخصي للدكتور مصطفى.',
            en: "Welcome, I'm Noor, Dr. Moustafa's personal assistant."
        },
        askName: { ar: 'تحب أنادي حضرتك بإيه؟', en: 'What should I call you?' },
        nameBad: { ar: 'برجاء كتابة الاسم (حرفان على الأقل).', en: 'Please type your name (at least 2 letters).' },
        hello: {
            ar: function (n) { return 'أهلاً أ/ ' + n + '. كيف يمكنني مساعدة حضرتك؟ هل الموضوع:'; },
            en: function (n) { return 'Hello ' + n + '. How can I help you? Is it:'; }
        },
        opt1: { ar: '١- متعلق بقضية جارية', en: '1- An ongoing case' },
        opt2: { ar: '٢- استشارة قانونية أو تحرير عقود', en: '2- A legal consultation or contract drafting' },

        opt3: { ar: '٣- شؤون الأكاديمية ومشاريع التخرج', en: '3- Academy matters and graduation projects' },
        opt4: { ar: '٤- أمر آخر', en: '4- Something else' },
        askAcademy: {
            ar: 'برجاء شرح الاستفسار أو الطلب بشكل محدد.',
            en: 'Please explain your inquiry or request specifically.'
        },
        askOther: {
            ar: 'برجاء شرح الأمر وتفاصيله.',
            en: 'Please explain the matter and its details.'
        },
        askCase: {
            ar: 'برجاء شرح الموضوع بالترتيب مع ذكر الخطوات التي قمت باتخاذها.',
            en: 'Please explain the matter in order, including the steps you have already taken.'
        },
        askConsult: {
            ar: 'برجاء شرح نبذة سريعة عن الأمر.',
            en: 'Please give a quick summary of the matter.'
        },
        detailsBad: { ar: 'برجاء كتابة بضع كلمات على الأقل عن الموضوع.', en: 'Please write a few words about the matter.' },

        askFiles: {
            ar: 'هل لديك أوراق تخص الأمر، مثل صور محاضر رسمية أو إنذارات؟ يمكنك إرفاقها الآن.',
            en: 'Do you have any documents, such as photos of official reports or notices? You can attach them now.'
        },
        attach: { ar: '📎 إرفاق ملفات', en: '📎 Attach files' },
        attachMore: { ar: '📎 إضافة المزيد', en: '📎 Add more' },
        noFiles: { ar: 'لا يوجد، تابع', en: 'None, continue' },
        moreFiles: { ar: 'وصلتني الملفات. هل تريد إضافة المزيد؟', en: 'I received your files. Would you like to add more?' },
        cont: { ar: 'متابعة', en: 'Continue' },
        tooMany: {
            ar: function (n) { return 'الحد الأقصى ' + n + ' ملفات.'; },
            en: function (n) { return 'The maximum is ' + n + ' files.'; }
        },
        tooBig: {
            ar: function (n, mb) { return 'الملف ' + n + ' أكبر من ' + mb + ' ميجا.'; },
            en: function (n, mb) { return 'The file ' + n + ' is larger than ' + mb + ' MB.'; }
        },

        askOnline: {
            ar: 'هل تفضّل أن تتم الاستشارة أونلاين توفيرًا لوقت حضرتك وللحصول على خدمة أسرع؟',
            en: 'Would you prefer the consultation to be held online, to save your time and get faster service?'
        },
        yesOnline: { ar: 'نعم، أونلاين', en: 'Yes, online' },
        noOnline: { ar: 'لا، أفضّل غير ذلك', en: 'No, I prefer otherwise' },

        askPhone: {
            ar: 'برجاء كتابة رقم الموبايل (يفضّل أن يكون عليه واتساب) ليتمكن الدكتور مصطفى من التواصل مع حضرتك.',
            en: 'Please type your mobile number (preferably with WhatsApp) so Dr. Moustafa can reach you.'
        },
        phoneBad: {
            ar: 'الرقم غير واضح، برجاء كتابته بالأرقام فقط مثل 01012345678.',
            en: 'That number looks incomplete. Please use digits only, e.g. 01012345678.'
        },

        askExtra: { ar: 'هل تحب أن تضيف أي معلومة أخرى؟', en: 'Would you like to add anything else?' },
        noExtra: { ar: 'لا، هذا كل شيء', en: "No, that's all" },
        yesExtra: { ar: 'نعم، أريد الإضافة', en: 'Yes, I want to add something' },
        extraPrompt: { ar: 'تفضّل بكتابتها.', en: 'Go ahead and type it.' },

        sending: { ar: 'لحظة من فضلك، أسجّل طلب حضرتك...', en: 'One moment, I am recording your request...' },
        done: {
            ar: function (n) { return 'تم تسجيل طلب حضرتك يا أ/ ' + n + '. سأتواصل مع الدكتور مصطفى وأعرض عليه الأمر كله، وأحدد لحضرتك الموعد المناسب في أقرب وقت.'; },
            en: function (n) { return 'Your request is recorded, ' + n + '. I will contact Dr. Moustafa, present the whole matter to him, and arrange a suitable appointment as soon as possible.'; }
        },
        fail: {
            ar: 'تعذّر إرسال الطلب بسبب مشكلة في الاتصال. يمكنك إرساله مباشرة للدكتور مصطفى عبر واتساب بضغطة واحدة:',
            en: 'The request could not be sent because of a connection problem. You can send it to Dr. Moustafa directly on WhatsApp with one tap:'
        },
        filesFail: {
            ar: function (list) { return 'تعذّر رفع هذه الملفات: ' + list + '. يمكنك إرسالها للدكتور مصطفى عبر واتساب.'; },
            en: function (list) { return 'These files could not be uploaded: ' + list + '. You can send them to Dr. Moustafa on WhatsApp.'; }
        },
        cooldown: {
            ar: 'وصل طلب حضرتك منذ لحظات، وسيتم التواصل معك قريبًا.',
            en: 'Your request arrived a moment ago, and you will be contacted soon.'
        },
        waSend: { ar: 'إرسال عبر واتساب', en: 'Send via WhatsApp' },
        restart: { ar: 'بدء محادثة جديدة', en: 'Start a new chat' },

        phName: { ar: 'اكتب اسمك...', en: 'Type your name...' },
        phText: { ar: 'اكتب هنا...', en: 'Type here...' },
        phPhone: { ar: 'رقم الموبايل', en: 'Mobile number' },
        phChoose: { ar: 'اختر من الأزرار', en: 'Choose from the buttons' },
        phWait: { ar: 'لحظة...', en: 'One moment...' }
    };

    function lang() {
        return document.documentElement.dir === 'ltr' ? 'en' : 'ar';
    }

    function tr(entry) {
        var v = entry[lang()];
        if (typeof v === 'function') {
            return v.apply(null, Array.prototype.slice.call(arguments, 1));
        }
        return v;
    }

    /* ---------------- أدوات صغيرة ---------------- */
    function el(tag, cls) {
        var node = document.createElement(tag);
        if (cls) { node.className = cls; }
        return node;
    }

    function sleep(ms) {
        return new Promise(function (r) { setTimeout(r, ms); });
    }

    function esc(s) {
        return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    }

    function toLatinDigits(s) {
        return String(s)
            .replace(/[\u0660-\u0669]/g, function (d) { return d.charCodeAt(0) - 0x0660; })
            .replace(/[\u06F0-\u06F9]/g, function (d) { return d.charCodeAt(0) - 0x06F0; });
    }

    var TYPE_LABEL = {
        case: 'قضية جارية',
        consult: 'استشارة قانونية / تحرير عقود',
        academy: 'شؤون الأكاديمية ومشاريع التخرج',
        other: 'أمر آخر'
    };

    function cleanPhone(s) {
        return toLatinDigits(s).replace(/[\s\-().]/g, '');
    }

    function validPhone(s) {
        return /^\+?\d{8,15}$/.test(cleanPhone(s));
    }

    function waDigits(phone) {
        var d = cleanPhone(phone).replace('+', '');
        if (d.indexOf('00') === 0) { return d.slice(2); }
        if (d.indexOf('0') === 0) { return '20' + d.slice(1); } // رقم مصري محلي
        return d;
    }

    function store(key, val, session) {
        try {
            var area = session ? sessionStorage : localStorage;
            if (val === undefined) { return area.getItem(key); }
            area.setItem(key, val);
        } catch (e) { /* التخزين غير متاح */ }
        return null;
    }

    function fetchT(url, opts, ms) {
        var ctrl = new AbortController();
        var timer = setTimeout(function () { ctrl.abort(); }, ms);
        opts.signal = ctrl.signal;
        return fetch(url, opts).finally(function () { clearTimeout(timer); });
    }

    /* ---------------- بناء الواجهة ---------------- */
    var root = el('div', 'nr-root');
    root.innerHTML =
        '<button class="nr-launcher" type="button" aria-haspopup="dialog" aria-expanded="false">' +
        '<img src="' + CONFIG.avatar + '" alt=""><span class="nr-dot"></span></button>' +
        '<div class="nr-teaser" hidden></div>' +
        '<section class="nr-panel" role="dialog" aria-labelledby="nrName">' +
        '<header class="nr-head">' +
        '<div class="nr-head-avatar"><img src="' + CONFIG.avatar + '" alt=""><span class="nr-dot"></span></div>' +
        '<div class="nr-head-text"><div class="nr-head-name" id="nrName"></div><div class="nr-head-sub"></div></div>' +
        '<button class="nr-close" type="button">&times;</button>' +
        '</header>' +
        '<div class="nr-msgs" aria-live="polite"></div>' +
        '<form class="nr-form">' +
        '<textarea class="nr-input" rows="1" autocomplete="off"></textarea>' +
        '<button class="nr-send" type="submit"><i class="fas fa-paper-plane"></i></button>' +
        '</form>' +
        '</section>' +
        '<input class="nr-file" type="file" hidden multiple accept="image/*,.pdf,.doc,.docx,.xls,.xlsx,.txt">';

    var launcher = root.querySelector('.nr-launcher');
    var teaser = root.querySelector('.nr-teaser');
    var panel = root.querySelector('.nr-panel');
    var headName = root.querySelector('.nr-head-name');
    var headSub = root.querySelector('.nr-head-sub');
    var closeBtn = root.querySelector('.nr-close');
    var msgs = root.querySelector('.nr-msgs');
    var form = root.querySelector('.nr-form');
    var input = root.querySelector('.nr-input');
    var sendBtn = root.querySelector('.nr-send');
    var fileInput = root.querySelector('.nr-file');

    /* ---------------- الحالة ---------------- */
    var state = null;      // بيانات الزائر
    var mode = null;       // وضع الإدخال الحالي (نص حر) أو null
    var pending = null;    // أزرار الاختيار المعروضة حاليًا
    var started = false;
    var runId = 0;

    function freshState() {
        return { name: '', type: '', details: '', online: null, phone: '', extra: '', files: [] };
    }

    /* ---------------- عرض الرسائل ---------------- */
    function scrollDown() {
        requestAnimationFrame(function () { msgs.scrollTop = msgs.scrollHeight; });
    }

    function addMsg(text, who, extraCls) {
        var m = el('div', 'nr-msg nr-' + who + (extraCls ? ' ' + extraCls : ''));
        m.textContent = text;
        msgs.appendChild(m);
        scrollDown();
        return m;
    }

    function addUser(text) {
        return addMsg(text, 'user');
    }

    async function botSay(text, cls) {
        var dots = el('div', 'nr-typing');
        dots.innerHTML = '<span></span><span></span><span></span>';
        msgs.appendChild(dots);
        scrollDown();
        await sleep(Math.min(1500, 500 + text.length * 14));
        dots.remove();
        return addMsg(text, 'bot', cls);
    }

    /* ---------------- وضع الإدخال ---------------- */
    function applyMode() {
        var active = !!mode;
        input.disabled = !active;
        sendBtn.disabled = !active;
        var ph = mode ? mode.ph : (pending ? S.phChoose : S.phWait);
        input.placeholder = tr(ph);
        input.setAttribute('inputmode', mode && mode.kind === 'tel' ? 'tel' : 'text');
        input.maxLength = mode && mode.max ? mode.max : 500;
    }

    function setMode(m) {
        mode = m;
        applyMode();
        if (m) {
            input.focus({ preventScroll: true });
        }
    }

    function autosize() {
        input.style.height = 'auto';
        input.style.height = Math.min(input.scrollHeight, 120) + 'px';
    }

    function askText(opts) {
        return new Promise(function (resolve) {
            var myRun = runId;
            var m = {
                ph: opts.ph,
                kind: opts.kind,
                max: opts.max,
                onSubmit: async function (text) {
                    if (myRun !== runId) { return; }
                    var err = opts.validate ? opts.validate(text) : null;
                    addUser(text);
                    setMode(null);
                    if (err) {
                        await botSay(err);
                        setMode(m);
                        return;
                    }
                    resolve(text);
                }
            };
            setMode(m);
        });
    }

    function showChoices(options) {
        return new Promise(function (resolve) {
            setMode(null);
            var box = el('div', 'nr-choices');
            options.forEach(function (o) {
                var b;
                if (o.href) {
                    b = el('a', 'nr-choice nr-wa');
                    b.href = o.href;
                    b.target = '_blank';
                    b.rel = 'noopener';
                } else {
                    b = el('button', 'nr-choice');
                    b.type = 'button';
                    b.addEventListener('click', function () {
                        if (o.action) { o.action(); return; }
                        var label = tr(o.label);
                        box.remove();
                        pending = null;
                        addUser(label);
                        resolve(o.value);
                    });
                }
                b.textContent = tr(o.label);
                box.appendChild(b);
            });
            msgs.appendChild(box);
            pending = { box: box, resolve: resolve };
            applyMode();
            scrollDown();
        });
    }

    /* ---------------- الملفات ---------------- */
    fileInput.addEventListener('change', async function () {
        var chosen = Array.prototype.slice.call(fileInput.files || []);
        fileInput.value = '';
        if (!chosen.length || !pending) { return; }

        var maxBytes = CONFIG.maxFileMB * 1024 * 1024;
        var accepted = [];
        var problem = '';

        chosen.forEach(function (f) {
            if (state.files.length + accepted.length >= CONFIG.maxFiles) {
                problem = tr(S.tooMany, CONFIG.maxFiles);
            } else if (f.size > maxBytes) {
                problem = tr(S.tooBig, f.name, CONFIG.maxFileMB);
            } else {
                accepted.push(f);
            }
        });

        if (!accepted.length) {
            if (problem) { addMsg(problem, 'bot', 'nr-error'); }
            return;
        }

        state.files = state.files.concat(accepted);
        var p = pending;
        pending = null;
        p.box.remove();
        addUser('📎 ' + accepted.map(function (f) { return f.name; }).join('\n📎 '));
        if (problem) { addMsg(problem, 'bot', 'nr-error'); }
        p.resolve('attached');
    });

    function openPicker() {
        fileInput.click();
    }

    /* ---------------- الإرسال إلى تليجرام ---------------- */
    function tgUrl(method) {
        return 'https://api.telegram.org/bot' + CONFIG.token + '/' + method;
    }

    async function tgMessage(html) {
        var body = new URLSearchParams({
            chat_id: CONFIG.chatId,
            text: html,
            parse_mode: 'HTML',
            disable_web_page_preview: 'true'
        });
        var r = await fetchT(tgUrl('sendMessage'), { method: 'POST', body: body }, 20000);
        var j = await r.json();
        if (!j.ok) { throw new Error(j.description || 'Telegram error'); }
    }

    async function tgFile(file, caption) {
        var fd = new FormData();
        fd.append('chat_id', CONFIG.chatId);
        fd.append('caption', caption.slice(0, 200));
        fd.append('document', file, file.name);
        var r = await fetchT(tgUrl('sendDocument'), { method: 'POST', body: fd }, 90000);
        var j = await r.json();
        if (!j.ok) { throw new Error(j.description || 'Telegram error'); }
    }

    function stamp() {
        try {
            return new Date().toLocaleString('ar-EG', { timeZone: 'Africa/Cairo', dateStyle: 'medium', timeStyle: 'short' });
        } catch (e) {
            return new Date().toISOString();
        }
    }

    function buildMessages() {
        var s = state;
        var typeLabel = TYPE_LABEL[s.type] || s.type;
        var first = s.details.slice(0, 2000);
        var rest = s.details.slice(2000);

        var lines = [
            '<b>📩 طلب جديد من موقع الدكتور مصطفى</b>',
            '',
            '👤 <b>الاسم:</b> ' + esc(s.name),
            '📌 <b>نوع الموضوع:</b> ' + typeLabel,
            '📞 <b>الموبايل:</b> ' + esc(cleanPhone(s.phone)),
            '💬 <b>واتساب:</b> https://wa.me/' + waDigits(s.phone)
        ];
        if (s.type === 'consult') {
            lines.push('💻 <b>استشارة أونلاين:</b> ' + (s.online ? 'نعم' : 'لا'));
        } else if (s.type === 'case') {
            lines.push('📎 <b>المرفقات:</b> ' + (s.files.length ? s.files.length + ' ملف (تصل بعد هذه الرسالة)' : 'لا يوجد'));
        }
        lines.push('', '📝 <b>التفاصيل:</b>', esc(first));

        var out = [lines.join('\n')];
        while (rest.length) {
            out.push('📝 <b>تكملة التفاصيل:</b>\n' + esc(rest.slice(0, 3500)));
            rest = rest.slice(3500);
        }

        var tail = [];
        if (s.extra) { tail.push('➕ <b>إضافات:</b>\n' + esc(s.extra), ''); }
        tail.push('🌐 لغة الصفحة: ' + (lang() === 'en' ? 'English' : 'العربية'));
        tail.push('🕒 ' + esc(stamp()));
        out.push(tail.join('\n'));
        return out;
    }

    function whatsappUrl() {
        var s = state;
        var parts = [
            'السلام عليكم دكتور مصطفى،',
            'الاسم: ' + s.name,
            'نوع الموضوع: ' + (TYPE_LABEL[s.type] || s.type),
            'الموبايل: ' + cleanPhone(s.phone)
        ];
        if (s.type === 'consult') { parts.push('استشارة أونلاين: ' + (s.online ? 'نعم' : 'لا')); }
        parts.push('التفاصيل: ' + s.details.slice(0, 900));
        if (s.extra) { parts.push('إضافات: ' + s.extra.slice(0, 300)); }
        return 'https://wa.me/' + CONFIG.whatsapp + '?text=' + encodeURIComponent(parts.join('\n'));
    }

    async function deliver() {
        var messages = buildMessages();
        for (var i = 0; i < messages.length; i++) {
            await tgMessage(messages[i]);
        }
        var failed = [];
        for (var k = 0; k < state.files.length; k++) {
            try {
                await tgFile(state.files[k], '📎 ' + state.files[k].name + ' — ' + state.name);
            } catch (e) {
                failed.push(state.files[k].name);
            }
        }
        return failed;
    }

    /* ---------------- سير المحادثة ---------------- */
    async function finish() {
        var last = parseInt(store('nr_last_sent'), 10) || 0;
        if (Date.now() - last < CONFIG.cooldownMs) {
            await botSay(tr(S.cooldown));
            return;
        }

        await botSay(tr(S.sending));
        var failed;
        try {
            failed = await deliver();
        } catch (e) {
            if (window.console) { console.error('Noor chat:', e); }
            await botSay(tr(S.fail), 'nr-error');
            var r = await showChoices([
                { label: S.waSend, href: whatsappUrl() },
                { label: S.restart, value: 'restart' }
            ]);
            if (r === 'restart') { restart(); }
            return;
        }

        store('nr_last_sent', String(Date.now()));
        await botSay(tr(S.done, state.name));
        if (failed.length) {
            await botSay(tr(S.filesFail, failed.join('، ')), 'nr-error');
            await showChoices([
                { label: S.waSend, href: 'https://wa.me/' + CONFIG.whatsapp },
                { label: S.restart, value: 'restart' }
            ]).then(function (r) { if (r === 'restart') { restart(); } });
            return;
        }
        var again = await showChoices([{ label: S.restart, value: 'restart' }]);
        if (again === 'restart') { restart(); }
    }

    async function run() {
        var myRun = ++runId;
        state = freshState();
        var alive = function () { return myRun === runId; };

        await botSay(tr(S.greet));
        if (!alive()) { return; }
        await botSay(tr(S.askName));

        state.name = (await askText({
            ph: S.phName, max: 60,
            validate: function (v) { return v.length < 2 ? tr(S.nameBad) : null; }
        })).trim();
        if (!alive()) { return; }

        await botSay(tr(S.hello, state.name));
        state.type = await showChoices([
            { label: S.opt1, value: 'case' },
            { label: S.opt2, value: 'consult' },
            { label: S.opt3, value: 'academy' },
            { label: S.opt4, value: 'other' }
        ]);
        if (!alive()) { return; }

        var prompts = { case: S.askCase, consult: S.askConsult, academy: S.askAcademy, other: S.askOther };
        await botSay(tr(prompts[state.type]));
        state.details = (await askText({
            ph: S.phText, max: 4000,
            validate: function (v) { return v.length < 5 ? tr(S.detailsBad) : null; }
        })).trim();
        if (!alive()) { return; }

        if (state.type === 'case') {
            await botSay(tr(S.askFiles));
            var r = await showChoices([
                { label: S.attach, action: openPicker },
                { label: S.noFiles, value: 'skip' }
            ]);
            while (r === 'attached' && alive()) {
                if (state.files.length >= CONFIG.maxFiles) { break; }
                await botSay(tr(S.moreFiles));
                r = await showChoices([
                    { label: S.attachMore, action: openPicker },
                    { label: S.cont, value: 'skip' }
                ]);
            }
        } else if (state.type === 'consult') {
            await botSay(tr(S.askOnline));
            var o = await showChoices([
                { label: S.yesOnline, value: 'yes' },
                { label: S.noOnline, value: 'no' }
            ]);
            state.online = (o === 'yes');
        }
        if (!alive()) { return; }

        await botSay(tr(S.askPhone));
        state.phone = (await askText({
            ph: S.phPhone, kind: 'tel', max: 20,
            validate: function (v) { return validPhone(v) ? null : tr(S.phoneBad); }
        })).trim();
        if (!alive()) { return; }

        await botSay(tr(S.askExtra));
        var x = await showChoices([
            { label: S.noExtra, value: 'no' },
            { label: S.yesExtra, value: 'yes' }
        ]);
        if (x === 'yes') {
            await botSay(tr(S.extraPrompt));
            state.extra = (await askText({ ph: S.phText, max: 1000 })).trim();
        }
        if (!alive()) { return; }

        await finish();
    }

    function restart() {
        runId++;
        msgs.innerHTML = '';
        pending = null;
        setMode(null);
        run();
    }

    /* ---------------- فتح وإغلاق ---------------- */
    function layoutPanel() {
        if (!panel.classList.contains('nr-open')) { return; }
        var vv = window.visualViewport;
        if (window.innerWidth <= 520 && vv) {
            panel.style.top = (vv.offsetTop + 8) + 'px';
            panel.style.height = (vv.height - 16) + 'px';
            panel.style.bottom = 'auto';
        } else {
            panel.style.top = '';
            panel.style.height = '';
            panel.style.bottom = '';
        }
        scrollDown();
    }

    function openChat() {
        teaser.hidden = true;
        panel.classList.add('nr-open');
        root.classList.add('nr-is-open');
        launcher.setAttribute('aria-expanded', 'true');
        layoutPanel();
        if (!started) {
            started = true;
            run();
        } else if (mode) {
            input.focus({ preventScroll: true });
        }
    }

    function closeChat() {
        panel.classList.remove('nr-open');
        root.classList.remove('nr-is-open');
        launcher.setAttribute('aria-expanded', 'false');
        launcher.focus({ preventScroll: true });
    }

    function applyLang() {
        headName.textContent = tr(S.name);
        headSub.textContent = tr(S.sub);
        closeBtn.setAttribute('aria-label', tr(S.close));
        sendBtn.setAttribute('aria-label', tr(S.send));
        launcher.setAttribute('aria-label', tr(S.open));
        teaser.textContent = tr(S.teaser);
        applyMode();
    }

    /* ---------------- الأحداث ---------------- */
    launcher.addEventListener('click', openChat);
    closeBtn.addEventListener('click', closeChat);
    teaser.addEventListener('click', openChat);

    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && panel.classList.contains('nr-open')) { closeChat(); }
    });

    form.addEventListener('submit', function (e) {
        e.preventDefault();
        if (!mode) { return; }
        var text = input.value.trim();
        if (!text) { return; }
        input.value = '';
        autosize();
        mode.onSubmit(text);
    });

    input.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' && !e.shiftKey && !e.isComposing) {
            e.preventDefault();
            form.requestSubmit();
        }
    });

    input.addEventListener('input', autosize);

    window.addEventListener('resize', layoutPanel);
    if (window.visualViewport) {
        window.visualViewport.addEventListener('resize', layoutPanel);
        window.visualViewport.addEventListener('scroll', layoutPanel);
    }

    new MutationObserver(applyLang).observe(document.documentElement, { attributes: true, attributeFilter: ['dir'] });

    /* ---------------- التشغيل ---------------- */
    function mount() {
        document.body.appendChild(root);
        applyLang();
        var autoOpen = false;
        try { autoOpen = new URLSearchParams(window.location.search).get('chat') === '1'; } catch (e) { /* قديم */ }
        if (autoOpen) {
            setTimeout(openChat, 700);
            return;
        }
        if (!store('nr_teaser_seen', undefined, true)) {
            setTimeout(function () {
                if (!panel.classList.contains('nr-open')) {
                    teaser.hidden = false;
                    store('nr_teaser_seen', '1', true);
                    setTimeout(function () { teaser.hidden = true; }, 9000);
                }
            }, CONFIG.teaserDelayMs);
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', mount);
    } else {
        mount();
    }
})();
