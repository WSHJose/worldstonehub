// Supabase Edge Function: create-checkout
// Crea una sesión de Stripe Checkout para WSH
// POST { actor, plan, billing, email, nombre_empresa }

const STRIPE_SECRET = Deno.env.get('STRIPE_SECRET_KEY')!;
const SITE_URL = Deno.env.get('SITE_URL') || 'https://WSHJose.github.io/worldstonehub';

// ── Mapa actor → plan → billing → price_id ──────────────────────────────────
const PRICE_MAP: Record<string, Record<string, Record<string, string>>> = {
  cantera: {
    presencia:   { annual: 'price_1THJMc5kSYznftY2GRgUrNf7', monthly: 'price_1THJMf5kSYznftY2p0F0pRSF' },
    profesional: { annual: 'price_1THJMu5kSYznftY2rTGV7AAS', monthly: 'price_1THJMy5kSYznftY2lsphXUjk' },
    elite:       { annual: 'price_1THJNE5kSYznftY2ltjHnb87', monthly: 'price_1THJNI5kSYznftY2adMD0xzO' },
  },
  fabricante: {
    presencia:   { annual: 'price_1THJMc5kSYznftY2GRgUrNf7', monthly: 'price_1THJMf5kSYznftY2p0F0pRSF' },
    profesional: { annual: 'price_1THJMt5kSYznftY2nSoTiilx', monthly: 'price_1THJMy5kSYznftY2NKXIDDZE' },
    elite:       { annual: 'price_1THJNE5kSYznftY2V5Qgr2aS', monthly: 'price_1THJNI5kSYznftY2OYwtZ89T' },
  },
  distribuidor: {
    presencia:   { annual: 'price_1THJMd5kSYznftY2S2vMuIUS', monthly: 'price_1THJMg5kSYznftY2VFaPCCsu' },
    profesional: { annual: 'price_1THJMu5kSYznftY2UTEaT0mr', monthly: 'price_1THJMz5kSYznftY2AvR3SFAB' },
    elite:       { annual: 'price_1THJNF5kSYznftY26FA2TyPp', monthly: 'price_1THJNJ5kSYznftY2mlFRtNlV' },
  },
  agente: {
    presencia:   { annual: 'price_1THJMa5kSYznftY2Y505esti', monthly: 'price_1THJMd5kSYznftY2dprOYsF3' },
    profesional: { annual: 'price_1THJMr5kSYznftY2Pybf8Shw', monthly: 'price_1THJMw5kSYznftY2r7QQAub6' },
    elite:       { annual: 'price_1THJNB5kSYznftY2Wm9t5zK4', monthly: 'price_1THJNF5kSYznftY2UK3Ouo1S' },
  },
  logistica: {
    presencia:   { annual: 'price_1THJMc5kSYznftY2GRgUrNf7', monthly: 'price_1THJMf5kSYznftY2p0F0pRSF' },
    profesional: { annual: 'price_1THJMt5kSYznftY2nSoTiilx', monthly: 'price_1THJMy5kSYznftY2NKXIDDZE' },
    elite:       { annual: 'price_1THJNE5kSYznftY2V5Qgr2aS', monthly: 'price_1THJNI5kSYznftY2OYwtZ89T' },
  },
  laboratorio: {
    presencia:   { annual: 'price_1THJMb5kSYznftY28CEaBhZe', monthly: 'price_1THJMe5kSYznftY2ZzexHXll' },
    profesional: { annual: 'price_1THJMs5kSYznftY2HLY3N58r', monthly: 'price_1THJMx5kSYznftY2i7ksnXsE' },
    elite:       { annual: 'price_1THJND5kSYznftY29cTCyenN', monthly: 'price_1THJNH5kSYznftY25suUDQo2' },
  },
  'palets-cajones': {
    presencia:   { annual: 'price_1THJMb5kSYznftY2XXckoeKu', monthly: 'price_1THJMe5kSYznftY2oE8ou2EN' },
    profesional: { annual: 'price_1THJMs5kSYznftY2HLY3N58r', monthly: 'price_1THJMx5kSYznftY2i7ksnXsE' },
    elite:       { annual: 'price_1THJND5kSYznftY29cTCyenN', monthly: 'price_1THJNH5kSYznftY25suUDQo2' },
  },
  maquinaria: {
    presencia:   { annual: 'price_1THJMc5kSYznftY2GRgUrNf7', monthly: 'price_1THJMf5kSYznftY2p0F0pRSF' },
    profesional: { annual: 'price_1THJMt5kSYznftY2nSoTiilx', monthly: 'price_1THJMy5kSYznftY2NKXIDDZE' },
    elite:       { annual: 'price_1THJNE5kSYznftY2V5Qgr2aS', monthly: 'price_1THJNI5kSYznftY2OYwtZ89T' },
  },
  arquitecto: {
    profesional: { annual: 'price_1THJMq5kSYznftY20yM2YIYL', monthly: 'price_1THJMv5kSYznftY22bm3Rk4C' },
    elite:       { annual: 'price_1THJNB5kSYznftY2Wm9t5zK4', monthly: 'price_1THJNF5kSYznftY2UK3Ouo1S' },
  },
  constructora: {
    profesional: { annual: 'price_1THJMs5kSYznftY2iqpf88Cz', monthly: 'price_1THJMx5kSYznftY29h4pL96F' },
    elite:       { annual: 'price_1THJND5kSYznftY2NCvzcj2g', monthly: 'price_1THJNH5kSYznftY2voAaQXZ4' },
  },
  comprador: {
    profesional: { annual: 'price_1THJMr5kSYznftY2Pybf8Shw', monthly: 'price_1THJMw5kSYznftY2r7QQAub6' },
    elite:       { annual: 'price_1THJNC5kSYznftY2jueeImAo', monthly: 'price_1THJNG5kSYznftY2sNASEAqG' },
  },
  instalador: {
    profesional: { annual: 'price_1THJMr5kSYznftY2I4MBdlIP', monthly: 'price_1THJMv5kSYznftY2tpaIWaZ6' },
  },
};

// ── Handler ─────────────────────────────────────────────────────────────────
Deno.serve(async (req: Request) => {
  // CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      },
    });
  }

  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), { status: 405 });
  }

  let body: { actor: string; plan: string; billing: string; email: string; nombre_empresa: string };
  try {
    body = await req.json();
  } catch {
    return new Response(JSON.stringify({ error: 'Invalid JSON' }), { status: 400 });
  }

  const { actor, plan, billing, email, nombre_empresa } = body;

  if (!actor || !plan || !billing || !email) {
    return new Response(JSON.stringify({ error: 'Missing required fields' }), { status: 400 });
  }

  // Buscar price_id
  const priceId = PRICE_MAP[actor]?.[plan]?.[billing];
  if (!priceId) {
    return new Response(JSON.stringify({ error: `No price found for ${actor}/${plan}/${billing}` }), { status: 400 });
  }

  // Crear Checkout Session en Stripe
  const params = new URLSearchParams({
    'mode': 'subscription',
    'line_items[0][price]': priceId,
    'line_items[0][quantity]': '1',
    'customer_email': email,
    'success_url': `${SITE_URL}/gracias.html?session_id={CHECKOUT_SESSION_ID}`,
    'cancel_url': `${SITE_URL}/registro.html`,
    'metadata[actor]': actor,
    'metadata[plan]': plan,
    'metadata[billing]': billing,
    'metadata[nombre_empresa]': nombre_empresa || '',
    'subscription_data[metadata][actor]': actor,
    'subscription_data[metadata][plan]': plan,
    'subscription_data[metadata][nombre_empresa]': nombre_empresa || '',
    'allow_promotion_codes': 'true',
    'locale': 'es',
  });

  const stripeRes = await fetch('https://api.stripe.com/v1/checkout/sessions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${STRIPE_SECRET}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: params.toString(),
  });

  const session = await stripeRes.json() as { url?: string; error?: { message: string } };

  if (!stripeRes.ok || !session.url) {
    console.error('Stripe error:', session);
    return new Response(JSON.stringify({ error: session.error?.message || 'Stripe error' }), { status: 500 });
  }

  return new Response(JSON.stringify({ url: session.url }), {
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
    },
  });
});
