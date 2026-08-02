'use client';
import { useState, useEffect } from 'react';

// Página de ventas propia para el Plan GLP-1 Natural (Hotmart), pensada para recibir
// tráfico de pago (Meta Ads) sin depender de la página estándar del Marketplace de
// Hotmart. Bilingüe ES/EN vía is_es, igual que el resto de la app (ver CLAUDE.md).
// El botón "Comprar" va directo al checkout de Hotmart (Página de Pago del Hotlink),
// no a la ficha del Marketplace, para no distraer con otros productos.
const CHECKOUT_ES = 'https://pay.hotmart.com/F105444282M';
const CHECKOUT_EN = 'https://pay.hotmart.com/M105444457W';

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;0,700;1,400;1,500&family=Montserrat:wght@400;500;600;700&display=swap');
  *{box-sizing:border-box;}
  .rm-fi{opacity:0;transform:translateY(16px);transition:opacity 0.7s ease,transform 0.7s ease;}
  .rm-fi.v{opacity:1;transform:translateY(0);}
  .rm-d1{transition-delay:0.05s;} .rm-d2{transition-delay:0.2s;} .rm-d3{transition-delay:0.35s;}
  .rm-d4{transition-delay:0.5s;} .rm-d5{transition-delay:0.65s;} .rm-d6{transition-delay:0.8s;}
  @keyframes rm-pulse{0%,100%{box-shadow:0 0 0 0 rgba(201,147,90,0.45);}50%{box-shadow:0 0 0 14px rgba(201,147,90,0);}}
  .rm-pulse{animation:rm-pulse 2.2s infinite;}
  .rm-cta{display:block;width:100%;text-align:center;background:linear-gradient(135deg,#C9935A,#A06030);border:none;border-radius:0.9rem;
    padding:1.15rem 1.5rem;color:white;font-size:1.05rem;font-family:Montserrat,sans-serif;font-weight:700;cursor:pointer;
    text-decoration:none;box-shadow:0 6px 28px rgba(201,147,90,0.35);transition:transform 0.2s ease;}
  .rm-cta:hover{transform:translateY(-2px);}
`;

export default function ReiniciaMetabolismo() {
  const [lang, setLang] = useState('es');
  const [v, setV] = useState(false);

  useEffect(() => {
    const bl = navigator.language || 'es';
    setLang(bl.startsWith('es') ? 'es' : 'en');
    setTimeout(() => setV(true), 80);
  }, []);

  const es = lang === 'es';
  const checkoutUrl = es ? CHECKOUT_ES : CHECKOUT_EN;
  const coverImg = es ? '/images/reinicia-metabolismo-es.png' : '/images/reinicia-metabolismo-en.png';

  const handleCtaClick = () => {
    // El Pixel de Meta ya está instalado globalmente en layout.js (fbq init + PageView).
    // Aquí solo registramos el evento estándar de "empezar checkout" para que las
    // campañas de Meta Ads puedan optimizar por conversión, no solo por clic.
    if (typeof window !== 'undefined' && typeof window.fbq === 'function') {
      window.fbq('track', 'InitiateCheckout', { value: 6.99, currency: 'EUR' });
    }
  };

  const symptoms_es = [
    'Cansancio todo el día, sin ganas de nada',
    'Ansiedad o ganas de llorar sin razón aparente',
    'El peso sube aunque no hayas cambiado nada',
  ];
  const symptoms_en = [
    'Tired all day, no energy for anything',
    'Anxiety or crying spells with no clear reason',
    'Weight creeping up even though nothing changed',
  ];
  const symptoms = es ? symptoms_es : symptoms_en;

  const steps_es = [
    'Pagas de forma segura con tarjeta — el checkout es de Hotmart, no de una web desconocida',
    'Recibes la guía al instante en tu email, en PDF, sin esperas',
    'Empiezas cuando quieras — es tuya para siempre, sin fecha límite',
  ];
  const steps_en = [
    'Pay securely by card — checkout runs through Hotmart, not an unknown site',
    'Get your guide instantly by email, as a PDF, no waiting',
    "Start whenever you're ready — it's yours for good, no deadline",
  ];
  const steps = es ? steps_es : steps_en;

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: css }} />
      <div style={{ minHeight: '100vh', background: 'linear-gradient(180deg,#ffffff 0%,#FBF7F0 100%)', fontFamily: "'Cormorant Garamond',Georgia,serif" }}>

        <div style={{ maxWidth: '560px', margin: '0 auto', padding: '2.5rem 1.5rem 4rem' }}>

          {/* MARCA */}
          <div className={['rm-fi rm-d1', v ? 'v' : ''].join(' ')} style={{ textAlign: 'center', marginBottom: '1.25rem' }}>
            <span style={{ fontFamily: 'Montserrat,sans-serif', fontSize: '0.72rem', fontWeight: 700, color: '#C9935A', letterSpacing: '0.4em' }}>
              {'✦ LUMERA'}
            </span>
          </div>

          {/* EYEBROW */}
          <div className={['rm-fi rm-d1', v ? 'v' : ''].join(' ')} style={{ textAlign: 'center', marginBottom: '1.25rem' }}>
            <span style={{ display: 'inline-block', background: '#fff8f0', border: '1px solid rgba(201,147,90,0.4)', color: '#A06030', fontFamily: 'Montserrat,sans-serif', fontSize: '0.68rem', fontWeight: 700, letterSpacing: '0.15em', padding: '0.4rem 1rem', borderRadius: '1rem' }}>
              {es ? 'GUÍA PREMIUM · MUJERES 40+' : 'PREMIUM GUIDE · WOMEN 40+'}
            </span>
          </div>

          {/* HERO */}
          <div className={['rm-fi rm-d1', v ? 'v' : ''].join(' ')} style={{ textAlign: 'center', marginBottom: '1.75rem' }}>
            <h1 style={{ fontSize: 'clamp(2rem,6vw,2.5rem)', fontWeight: 700, lineHeight: 1.18, color: '#0D3D3D', margin: 0 }}>
              {es ? 'Reinicia tu Metabolismo Después de los 40' : 'Reset Your Metabolism After 40'}
            </h1>
          </div>

          {/* SÍNTOMAS */}
          <div className={['rm-fi rm-d2', v ? 'v' : ''].join(' ')} style={{ background: 'white', border: '1px solid rgba(201,147,90,0.25)', borderRadius: '1.25rem', padding: '1.4rem 1.5rem', marginBottom: '1.5rem' }}>
            <p style={{ fontFamily: 'Montserrat,sans-serif', fontSize: '0.68rem', fontWeight: 700, color: 'rgba(13,61,61,0.45)', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '0.9rem', textAlign: 'center' }}>
              {es ? '¿Te suena esto?' : 'Does this sound familiar?'}
            </p>
            {symptoms.map((s, i) => (
              <div key={i} style={{ display: 'flex', gap: '0.6rem', alignItems: 'flex-start', marginBottom: i === symptoms.length - 1 ? 0 : '0.7rem' }}>
                <span style={{ color: '#C9935A', fontSize: '1rem', lineHeight: 1.5, flexShrink: 0 }}>{'✦'}</span>
                <span style={{ fontSize: '1.08rem', color: '#0D3D3D', lineHeight: 1.5, fontStyle: 'italic', fontWeight: 600 }}>{s}</span>
              </div>
            ))}
          </div>

          {/* PUENTE */}
          <div className={['rm-fi rm-d2', v ? 'v' : ''].join(' ')} style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <p style={{ fontSize: '1.05rem', fontStyle: 'italic', color: 'rgba(13,61,61,0.6)', lineHeight: 1.6, margin: 0 }}>
              {es
                ? 'Mucho de esto empieza en cómo comes. Este plan te ayuda a estabilizar la pieza que sí puedes controlar hoy — sin dietas extremas ni contar calorías.'
                : "A lot of this starts with how you eat. This plan helps you steady the one piece you can control today — no extreme diets, no obsessive calorie counting."}
            </p>
          </div>

          {/* PORTADA / PRODUCTO */}
          <div className={['rm-fi rm-d3', v ? 'v' : ''].join(' ')} style={{ marginBottom: '1.75rem' }}>
            <img
              src={coverImg}
              alt={es ? 'Reinicia tu Metabolismo Después de los 40 — Plan 7 Días' : 'Reset Your Metabolism After 40 — 7-Day Plan'}
              style={{ width: '100%', display: 'block', borderRadius: '1.25rem', boxShadow: '0 12px 40px rgba(13,61,61,0.18)' }}
            />
          </div>

          {/* CTA PRINCIPAL */}
          <div className={['rm-fi rm-d3', v ? 'v' : ''].join(' ')} style={{ marginBottom: '0.75rem' }}>
            <a href={checkoutUrl} target="_blank" rel="noopener noreferrer" onClick={handleCtaClick} className="rm-cta rm-pulse">
              {es ? '→ Quiero mi plan de 7 días — €6.99' : '→ Get my 7-day plan — €6.99'}
            </a>
          </div>
          <div className={['rm-fi rm-d3', v ? 'v' : ''].join(' ')} style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
            <p style={{ fontFamily: 'Montserrat,sans-serif', fontSize: '0.78rem', color: 'rgba(13,61,61,0.4)', margin: 0 }}>
              {es ? 'Descarga instantánea · Pago seguro · Sin suscripción' : 'Instant download · Secure payment · No subscription'}
            </p>
          </div>

          {/* CÓMO FUNCIONA */}
          <div className={['rm-fi rm-d4', v ? 'v' : ''].join(' ')} style={{ background: '#0D3D3D', borderRadius: '1.5rem', padding: '2rem 1.5rem', marginBottom: '2.5rem' }}>
            <p style={{ fontFamily: 'Montserrat,sans-serif', fontSize: '0.72rem', fontWeight: 700, color: '#C9935A', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: '1.4rem', textAlign: 'center' }}>
              {es ? 'Cómo funciona' : 'How it works'}
            </p>
            {steps.map((s, i) => (
              <div key={i} style={{ display: 'flex', gap: '0.9rem', alignItems: 'flex-start', marginBottom: i === steps.length - 1 ? 0 : '1.1rem' }}>
                <span style={{ flexShrink: 0, width: '28px', height: '28px', borderRadius: '50%', background: 'rgba(201,147,90,0.2)', border: '1px solid #C9935A', color: '#C9935A', fontFamily: 'Montserrat,sans-serif', fontSize: '0.8rem', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {i + 1}
                </span>
                <span style={{ fontSize: '1.02rem', color: 'rgba(255,255,255,0.92)', lineHeight: 1.5, fontStyle: 'italic', paddingTop: '0.15rem' }}>{s}</span>
              </div>
            ))}
          </div>

          {/* PARA QUIÉN ES */}
          <div className={['rm-fi rm-d5', v ? 'v' : ''].join(' ')} style={{ marginBottom: '2rem', textAlign: 'center' }}>
            <p style={{ fontSize: '1.02rem', color: 'rgba(13,61,61,0.6)', lineHeight: 1.7, fontStyle: 'italic' }}>
              {es
                ? 'Pensado para mujeres 40+ que quieren un plan claro, con productos locales y fáciles de encontrar.'
                : 'Designed for women 40+ who want a clear plan with everyday, easy-to-find ingredients.'}
            </p>
          </div>

          {/* ENLACE SUAVE A /duerme (solo ES, esa guía todavía no tiene versión EN) */}
          {es && (
            <div className={['rm-fi rm-d5', v ? 'v' : ''].join(' ')} style={{ background: 'rgba(201,147,90,0.06)', border: '1px dashed rgba(201,147,90,0.35)', borderRadius: '1rem', padding: '1.1rem 1.25rem', textAlign: 'center', marginBottom: '2.5rem' }}>
              <p style={{ fontSize: '0.95rem', color: 'rgba(13,61,61,0.7)', fontStyle: 'italic', lineHeight: 1.5, marginBottom: '0.5rem' }}>
                {'Si lo que más te pesa es el insomnio o la ansiedad nocturna, tenemos algo específico para eso.'}
              </p>
              <a href="/duerme" style={{ fontFamily: 'Montserrat,sans-serif', fontSize: '0.8rem', fontWeight: 700, color: '#A06030', textDecoration: 'none' }}>
                {'Guía gratis: 7 noches para calmar tu ansiedad y dormir →'}
              </a>
            </div>
          )}

          {/* CTA SECUNDARIA */}
          <div className={['rm-fi rm-d6', v ? 'v' : ''].join(' ')} style={{ marginBottom: '0.75rem' }}>
            <a href={checkoutUrl} target="_blank" rel="noopener noreferrer" onClick={handleCtaClick} className="rm-cta">
              {es ? '→ Empezar ahora — €6.99' : '→ Start now — €6.99'}
            </a>
          </div>

          {/* FOOTER */}
          <div className={['rm-fi rm-d6', v ? 'v' : ''].join(' ')} style={{ textAlign: 'center', marginTop: '2.5rem' }}>
            <a href="/privacidad" style={{ fontFamily: 'Montserrat,sans-serif', fontSize: '0.7rem', color: 'rgba(13,61,61,0.35)', textDecoration: 'underline', marginRight: '1rem' }}>
              {es ? 'Política de Privacidad' : 'Privacy Policy'}
            </a>
            <a href="/terminos" style={{ fontFamily: 'Montserrat,sans-serif', fontSize: '0.7rem', color: 'rgba(13,61,61,0.35)', textDecoration: 'underline' }}>
              {es ? 'Términos de Uso' : 'Terms of Use'}
            </a>
          </div>

        </div>
      </div>
    </>
  );
}
