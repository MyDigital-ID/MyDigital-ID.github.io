// ============================================================
// site-data-loader.js
// يحمّل site-data.json أولاً، ثم يسمح لـ script.js بالبدء.
// هذا يمنع مشكلة race condition بين fetch() و loadMenu().
// ============================================================

window.siteDataReady = (async function loadSiteData() {
  try {
    const res = await fetch('site-data.json?t=' + Date.now(), { cache: 'no-store' });
    if (!res.ok) throw new Error('HTTP ' + res.status);

    const data = await res.json();

    const converted = {
      zones: (data.zones || []).map(function (z) {
        return {
          id: z.id,
          name_ar: z.name_ar || '',
          name_en: z.name_en || '',
          image: z.homeImg || '',
          video: z.headerVideo || '',
          ratio169: !!z.ratio169
        };
      }),
      items: {},
      addons: (data.addons || []).map(function (a) {
        return {
          id: a.id || ('a' + Math.random().toString(36).slice(2, 8)),
          name_ar: a.name_ar || '',
          name_en: a.name_en || ''
        };
      }),
      addonPrice: Number(data.addonPrice) || 20
    };

    (data.zones || []).forEach(function (z) {
      converted.items[z.id] = (z.items || []).map(function (item, idx) {
        const id = item.id || (z.id + '_' + idx);

        if (z.type === 'sized') {
          return {
            id,
            name_ar: item.name_ar || '',
            name_en: item.name_en || '',
            desc_ar: item.desc_ar || '',
            sizes: [
              {
                label_ar: 'وسط',
                label_en: 'Medium',
                price: Number(item.price_medium) || 0
              },
              {
                label_ar: 'عائلي',
                label_en: 'Family',
                price: Number(item.price_family) || 0
              }
            ]
          };
        }

        return {
          id,
          name_ar: item.name_ar || '',
          name_en: item.name_en || '',
          desc_ar: item.desc_ar || '',
          price: Number(item.price) || 0
        };
      });
    });

    localStorage.setItem('pizzaModiMenu', JSON.stringify(converted));
    console.log('✅ site-data.json loaded:', converted.zones.length, 'zones');

    return converted;
  } catch (e) {
    console.warn('⚠️ site-data.json failed; using DEFAULT_MENU:', e.message);
    localStorage.removeItem('pizzaModiMenu');
    return null;
  }
})();
