// Cloudflare Worker — يستقبل رسالة الشات من الموقع ويرسلها إلى تليجرام.
// التوكن والـ ID محفوظان كـ Secrets في Cloudflare (BOT_TOKEN و CHAT_ID) وليسا في الكود.

const ALLOWED_ORIGINS = [
  'https://mydigital-id.github.io'
];

function cors(origin) {
  return {
    'Access-Control-Allow-Origin': origin,
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Vary': 'Origin'
  };
}

export default {
  async fetch(request, env) {
    const origin = request.headers.get('Origin') || '';

    // فتح الرابط من المتصفح يعرض Hello World (للتأكد أن الـ Worker شغال)
    if (request.method === 'GET') {
      return new Response('Hello World');
    }

    if (!ALLOWED_ORIGINS.includes(origin)) {
      return new Response('Forbidden', { status: 403 });
    }

    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: cors(origin) });
    }

    if (request.method !== 'POST') {
      return new Response('Method Not Allowed', { status: 405, headers: cors(origin) });
    }

    let body;
    try {
      body = await request.json();
    } catch (e) {
      return new Response('Bad Request', { status: 400, headers: cors(origin) });
    }

    const text = String(body.message || '').slice(0, 3500);
    if (!text.startsWith('📩 طلب جديد')) {
      return new Response('Bad Request', { status: 400, headers: cors(origin) });
    }

    const tg = await fetch(`https://api.telegram.org/bot${env.BOT_TOKEN}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chat_id: env.CHAT_ID, text })
    });

    return new Response(tg.ok ? 'OK' : 'Telegram error', {
      status: tg.ok ? 200 : 502,
      headers: cors(origin)
    });
  }
};
