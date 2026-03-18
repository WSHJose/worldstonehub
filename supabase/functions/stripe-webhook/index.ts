import Stripe from "https://esm.sh/stripe@14.21.0?target=deno&no-check";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY")!, {
  apiVersion: "2023-10-16",
  httpClient: Stripe.createFetchHttpClient(),
});

const supabase = createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
);

// Detectar plan por amount_total si metadata.plan no está presente
function planFromAmount(amount: number | null): string {
  if (!amount) return "presencia";
  if (amount >= 29900) return "elite";
  if (amount >= 12900) return "profesional";
  return "presencia";
}

async function sendWelcomeEmail(email: string, nombre_empresa: string, plan: string) {
  const RESEND_KEY = Deno.env.get("RESEND_API_KEY");
  if (!RESEND_KEY) {
    console.warn("No RESEND_API_KEY — email omitido");
    return;
  }
  try {
    await supabase.functions.invoke("send-welcome", {
      body: { email, nombre_empresa, plan },
    });
    console.log(`✓ Welcome email enviado a ${email}`);
  } catch (e) {
    console.error("Error enviando welcome email:", e);
  }
}

Deno.serve(async (req: Request) => {
  const signature = req.headers.get("stripe-signature");
  if (!signature) {
    return new Response("No signature", { status: 400 });
  }

  const body = await req.text();

  let event: Stripe.Event;
  try {
    event = await stripe.webhooks.constructEventAsync(
      body,
      signature,
      Deno.env.get("STRIPE_WEBHOOK_SECRET")!
    );
  } catch (err) {
    console.error("Webhook signature failed:", err.message);
    return new Response(`Webhook Error: ${err.message}`, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;

    const email =
      session.customer_details?.email ?? session.customer_email ?? null;

    // Plan: primero desde metadata, luego por importe, luego default
    const plan =
      (session.metadata?.plan as string) ||
      planFromAmount(session.amount_total) ||
      "presencia";

    if (!email) {
      console.error("No email in session:", session.id);
      return new Response(JSON.stringify({ received: true }), {
        headers: { "Content-Type": "application/json" },
      });
    }

    console.log(`Activating provider — email: ${email}, plan: ${plan}`);

    // 1) Activar proveedor en la BD
    const { data: proveedor, error } = await supabase
      .from("proveedores")
      .update({
        estado: "activo",
        activo: true,
        plan_activo: true,
        plan: plan,
      })
      .eq("email", email)
      .select("nombre_empresa")
      .maybeSingle();

    if (error) {
      console.error("DB error:", error.message);
      return new Response("DB error", { status: 500 });
    }

    if (!proveedor) {
      console.warn(`⚠ No se encontró proveedor con email: ${email} — puede haber un email diferente o ya estaba activado`);
      // Devolver 200 para que Stripe no reintente indefinidamente
      return new Response(JSON.stringify({ received: true, warning: "no_provider_found" }), {
        headers: { "Content-Type": "application/json" },
      });
    }

    console.log("✓ Provider activated:", email);

    // 2) Enviar email de bienvenida
    const nombre_empresa = proveedor?.nombre_empresa ?? email;
    await sendWelcomeEmail(email, nombre_empresa, plan);
  }

  return new Response(JSON.stringify({ received: true }), {
    headers: { "Content-Type": "application/json" },
  });
});
