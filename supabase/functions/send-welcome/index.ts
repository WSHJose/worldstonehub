// World Stone Hub — Edge Function: send-welcome
// Envía un email de bienvenida branded tras el registro de una empresa.
// Requiere: RESEND_API_KEY en los secrets de Supabase.
// Deploy: supabase functions deploy send-welcome

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const PLAN_LABELS: Record<string, string> = {
  free:         'Directorio',
  presencia:    'Presencia',
  profesional:  'Profesional',
  elite:        'Élite',
};

function buildEmailHtml(nombre_empresa: string, plan: string, email: string): string {
  const planLabel = PLAN_LABELS[plan] || plan;
  const year = new Date().getFullYear();

  return `<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>Bienvenido a World Stone Hub</title>
</head>
<body style="margin:0;padding:0;background:#f8f7f5;font-family:'Helvetica Neue',Arial,sans-serif;">

<table width="100%" cellpadding="0" cellspacing="0" style="background:#f8f7f5;padding:40px 20px;">
  <tr><td align="center">
    <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#ffffff;border:1px solid #e2e0dc;">

      <!-- Header -->
      <tr>
        <td style="padding:0;background:#1a1917;border-bottom:3px solid #A67C52;">
          <table width="100%" cellpadding="0" cellspacing="0">
            <tr>
              <td style="padding:32px 48px;">
                <span style="font-family:Georgia,serif;font-size:13px;letter-spacing:6px;color:#f8f7f5;text-transform:uppercase;font-weight:300;">WORLD STONE</span>
                <span style="font-family:Georgia,serif;font-size:13px;color:#c8c5bf;margin:0 10px;">|</span>
                <span style="font-family:Georgia,serif;font-size:22px;color:#A67C52;font-style:italic;font-weight:300;">Hub</span>
              </td>
            </tr>
          </table>
        </td>
      </tr>

      <!-- Body -->
      <tr>
        <td style="padding:56px 48px 40px;">

          <p style="font-family:Georgia,serif;font-size:11px;letter-spacing:4px;text-transform:uppercase;color:#A67C52;margin:0 0 20px;">Registro confirmado</p>

          <h1 style="font-family:Georgia,serif;font-size:38px;font-weight:300;color:#1a1917;margin:0 0 8px;line-height:1.1;">Bienvenido,<br><em style="font-style:italic;color:#A67C52;">${nombre_empresa}</em></h1>

          <p style="font-size:14px;color:#8a8784;line-height:1.8;margin:24px 0 32px;">
            Tu empresa ya forma parte de World Stone Hub, el directorio global de referencia para la industria de la piedra natural.<br>
            Tu plan <strong style="color:#1a1917;">${planLabel}</strong> está activo y tu ficha es visible para profesionales de más de 80 países.
          </p>

          <table cellpadding="0" cellspacing="0" style="margin:0 0 40px;">
            <tr>
              <td style="background:#1a1917;padding:0;">
                <a href="https://worldstonehub.com/panel.html"
                   style="display:inline-block;padding:14px 40px;font-size:11px;font-weight:600;letter-spacing:3px;text-transform:uppercase;color:#f8f7f5;text-decoration:none;font-family:Arial,sans-serif;">
                  Acceder a mi panel →
                </a>
              </td>
            </tr>
          </table>

          <!-- Divider -->
          <table width="100%" cellpadding="0" cellspacing="0" style="margin:0 0 32px;">
            <tr><td style="border-top:1px solid #e2e0dc;font-size:0;">&nbsp;</td></tr>
          </table>

          <!-- Next steps -->
          <p style="font-size:10px;letter-spacing:3px;text-transform:uppercase;color:#8a8784;margin:0 0 16px;">Próximos pasos</p>

          <table width="100%" cellpadding="0" cellspacing="0">
            <tr>
              <td style="padding:14px 16px;background:#f8f7f5;border-left:2px solid #A67C52;margin-bottom:8px;display:block;">
                <span style="font-size:10px;letter-spacing:2px;text-transform:uppercase;color:#A67C52;font-family:monospace;">01</span>
                <span style="font-size:13px;color:#1a1917;margin-left:12px;">Completa tu perfil con logotipo y descripción</span>
              </td>
            </tr>
            <tr><td style="height:6px;"></td></tr>
            <tr>
              <td style="padding:14px 16px;background:#f8f7f5;border-left:2px solid #c8c5bf;">
                <span style="font-size:10px;letter-spacing:2px;text-transform:uppercase;color:#8a8784;font-family:monospace;">02</span>
                <span style="font-size:13px;color:#1a1917;margin-left:12px;">Añade los materiales y canteras con los que trabajas</span>
              </td>
            </tr>
            <tr><td style="height:6px;"></td></tr>
            <tr>
              <td style="padding:14px 16px;background:#f8f7f5;border-left:2px solid #c8c5bf;">
                <span style="font-size:10px;letter-spacing:2px;text-transform:uppercase;color:#8a8784;font-family:monospace;">03</span>
                <span style="font-size:13px;color:#1a1917;margin-left:12px;">Sube tu catálogo de imágenes para destacar en el directorio</span>
              </td>
            </tr>
          </table>

        </td>
      </tr>

      <!-- Footer -->
      <tr>
        <td style="padding:24px 48px;background:#f8f7f5;border-top:1px solid #e2e0dc;">
          <table width="100%" cellpadding="0" cellspacing="0">
            <tr>
              <td>
                <p style="font-size:10px;letter-spacing:2px;text-transform:uppercase;color:#b8b5b0;margin:0;">
                  © ${year} World Stone Hub &nbsp;·&nbsp;
                  <a href="https://worldstonehub.com/legal.html#privacidad" style="color:#b8b5b0;text-decoration:none;">Privacidad</a>
                  &nbsp;·&nbsp;
                  <a href="https://worldstonehub.com/contacto.html" style="color:#b8b5b0;text-decoration:none;">Contacto</a>
                </p>
                <p style="font-size:10px;color:#c8c5bf;margin:6px 0 0;">Este email se envió a ${email} por ser titular de una cuenta en World Stone Hub.</p>
              </td>
            </tr>
          </table>
        </td>
      </tr>

    </table>
  </td></tr>
</table>

</body>
</html>`;
}

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: CORS });
  }

  const RESEND_KEY = Deno.env.get('RESEND_API_KEY');

  if (!RESEND_KEY) {
    console.warn('WSH send-welcome: RESEND_API_KEY no configurada — email omitido.');
    return new Response(JSON.stringify({ sent: false, reason: 'no_api_key' }), {
      headers: { 'Content-Type': 'application/json', ...CORS },
    });
  }

  let body: { email: string; nombre_empresa: string; plan: string };
  try {
    body = await req.json();
  } catch {
    return new Response('Invalid JSON', { status: 400, headers: CORS });
  }

  const { email, nombre_empresa, plan } = body;
  if (!email || !nombre_empresa) {
    return new Response('Missing email or nombre_empresa', { status: 400, headers: CORS });
  }

  const html = buildEmailHtml(nombre_empresa, plan || 'free', email);

  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${RESEND_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: 'World Stone Hub <noreply@worldstonehub.com>',
      to: [email],
      subject: `Bienvenido a World Stone Hub — ${nombre_empresa}`,
      html,
    }),
  });

  const data = await res.json();

  if (!res.ok) {
    console.error('WSH send-welcome Resend error:', data);
    return new Response(JSON.stringify({ sent: false, error: data }), {
      status: 500,
      headers: { 'Content-Type': 'application/json', ...CORS },
    });
  }

  console.log(`WSH send-welcome: email enviado a ${email} (${nombre_empresa})`);
  return new Response(JSON.stringify({ sent: true, id: data.id }), {
    headers: { 'Content-Type': 'application/json', ...CORS },
  });
});
