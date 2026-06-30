import { Resend } from 'resend';

function buildEmailHtml(nombre) {
  const safeName = nombre || 'hola';
  return `
  <div style="font-family: Georgia, 'Times New Roman', serif; max-width: 560px; margin: 0 auto; background: #FBF7F0; padding: 0;">
    <div style="background: linear-gradient(135deg, #0D3D3D, #0A2A2A); padding: 40px 32px; text-align: center;">
      <p style="color: #C9935A; font-size: 12px; letter-spacing: 3px; text-transform: uppercase; margin: 0 0 8px; font-family: Arial, sans-serif;">✦ LUMERA</p>
      <h1 style="color: #ffffff; font-size: 26px; font-weight: 400; margin: 0; font-style: italic;">Tu plan personalizado ya está listo, ${safeName}</h1>
    </div>
    <div style="padding: 32px;">
      <p style="color: #0D3D3D; font-size: 16px; line-height: 1.7;">
        Tu acceso Premium a Lumera ya está activo. Dentro te espera <strong>LUMI</strong>, tu asesora de bienestar hormonal, con tu análisis personalizado y un plan de nutrición y ejercicio calculado específicamente para tu objetivo.
      </p>
      <p style="color: #0D3D3D; font-size: 16px; line-height: 1.7;">
        Lumera se acopla a ti, a tu tiempo y tus necesidades — no al revés. Siempre con ciencia detrás.
      </p>
      <div style="background: rgba(201,147,90,0.08); border-left: 3px solid #C9935A; padding: 16px 20px; margin: 24px 0;">
        <p style="color: #0D3D3D; font-size: 15px; line-height: 1.7; margin: 0 0 10px;">✦ Tu Silueta Hormonal — análisis visual de tu cuerpo y patrones</p>
        <p style="color: #0D3D3D; font-size: 15px; line-height: 1.7; margin: 0 0 10px;">✦ Lente Alquímica — fotografía tu plato y LUMI lo convierte en información</p>
        <p style="color: #0D3D3D; font-size: 15px; line-height: 1.7; margin: 0;">✦ Bienestar íntimo — el espacio del que casi ninguna app te habla</p>
      </div>
      <div style="text-align: center; margin: 32px 0;">
        <a href="https://getlumera.app/start" style="background: linear-gradient(135deg, #C9935A, #A06030); color: white; padding: 14px 36px; border-radius: 999px; text-decoration: none; font-family: Arial, sans-serif; font-weight: 700; font-size: 14px; display: inline-block;">
          Entrar a mi Lumera
        </a>
      </div>
      <p style="color: rgba(13,61,61,0.5); font-size: 13px; text-align: center; font-family: Arial, sans-serif;">
        Te esperamos.
      </p>
    </div>
  </div>
  `;
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { email, nombre } = body;

    if (!email) {
      return Response.json({ error: 'Email required' }, { status: 400 });
    }

    const resend = new Resend(process.env.RESEND_API_KEY);

    const result = await resend.emails.send({
      from: 'Lumera <hola@getlumera.app>',
      to: email,
      subject: `Tu plan personalizado ya está listo, ${nombre || ''}`.trim(),
      html: buildEmailHtml(nombre),
    });

    return Response.json({ ok: true, result });
  } catch (error) {
    console.error('send-invite error:', error.message);
    return Response.json({ error: 'Failed to send email' }, { status: 500 });
  }
}
