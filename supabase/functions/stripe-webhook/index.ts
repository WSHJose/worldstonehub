// Supabase Edge Function: stripe-webhook
// Activa proveedor en Supabase tras pago exitoso en Stripe

const STRIPE_WEBHOOK_SECRET  = Deno.env.get('STRIPE_WEBHOOK_SECRET')!;
const SUPABASE_URL            = Deno.env.get('SUPABASE_URL')!;
const SUPABASE_SERVICE_KEY    = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

async function verifyStripeSignature(payload: string, sigHeader: string, secret: string): Promise<boolean> {
  const parts  = sigHeader.split(',');
  const tPart  = parts.find((p) => p.startsWith('t='));
  const v1Part = parts.find((p) => p.startsWith('v1='));
  if (!tPart || !v1Part) return false;
  const timestamp      = tPart.slice(2);
  const signature      = v1Part.slice(3);
  const signedPayload  = `${timestamp}.${payload}`;
  const key = await crypto.subtle.importKey(
    'raw', new TextEncoder().encode(secret),
    { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']
  );
  const sigBytes = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(signedPayload));
  const computed = Array.from(new Uint8Array(sigBytes)).map((b) => b.toString(16).padStart(2, '0')).join('');
  return computed === signature;
}

Deno.serve(async (req: Request) => {
  if (req.method !== 'POST') return new Response('Method not allowed', { status: 405 });

  const body      = await req.text();
  const sigHeader = req.headers.get('stripe-signature') || '';
  const valid     = await verifyStripeSignature(body, sigHeader, STRIPE_WEBHOOK_SECRET);
  if (!valid) { console.error('Invalid Stripe signature'); return new Response('Invalid signature', { status: 400 }); }

  const event = JSON.parse(body) as { type: string; data: { object: Record<string, unknown> } };
  console.log(`Stripe event: ${event.type}`);

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as {
      customer_email?: string;
      metadata?: { actor?: string; plan?: string; billing?: string; nombre_empresa?: string };
      subscription?: string;
    };
    const email          = session.customer_email || '';
    const actor          = session.metadata?.actor || '';
    const plan           = session.metadata?.plan || '';
    const billing        = session.metadata?.billing || 'annual';
    const subscriptionId = session.subscription || null;
    console.log(`Activating: ${email} -> ${actor}/${plan}/${billing}`);

    const res = await fetch(
      `${SUPABASE_URL}/rest/v1/proveedores?email=eq.${encodeURIComponent(email)}`,
      {
        method: 'PATCH',
        headers: {
          apikey: SUPABASE_SERVICE_KEY,
          Authorization: `Bearer ${SUPABASE_SERVICE_KEY}`,
          'Content-Type': 'application/json',
          Prefer: 'return=representation',
        },
        body: JSON.stringify({
          activo: true,
          plan,
          billing_period: billing,
          stripe_subscription_id: subscriptionId,
          actor_type: actor,
          activado_at: new Date().toISOString(),
        }),
      }
    );
    const data = await res.json();
    if (!res.ok) console.error('Error activating:', data);
    else console.log('Activated:', data);
  }

  if (event.type === 'customer.subscription.deleted') {
    const sub = event.data.object as { id: string };
    await fetch(`${SUPABASE_URL}/rest/v1/proveedores?stripe_subscription_id=eq.${sub.id}`, {
      method: 'PATCH',
      headers: {
        apikey: SUPABASE_SERVICE_KEY,
        Authorization: `Bearer ${SUPABASE_SERVICE_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ activo: false, plan: 'free' }),
    });
  }

  if (event.type === 'invoice.payment_failed') {
    const invoice = event.data.object as { customer_email?: string; subscription?: string };
    console.warn(`Payment failed: ${invoice.customer_email} / sub ${invoice.subscription}`);
  }

  return new Response(JSON.stringify({ received: true }), { headers: { 'Content-Type': 'application/json' } });
});
