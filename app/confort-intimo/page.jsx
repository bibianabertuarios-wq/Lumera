'use client';
import { useEffect, useRef } from 'react';

// Página de ventas propia para la guía "Confort Íntimo 40+" (Hotmart), pensada para
// recibir tráfico de pago (Meta Ads) sin depender de la página estándar del
// Marketplace de Hotmart. Fondo oscuro con letra clara (lectura discreta en público).
// Estructura tipo "presentación": cada bloque aparece al hacer scroll (no todo de
// golpe), y "Qué vas a encontrar" es un carrusel horizontal deslizable, como las
// diapositivas del carrusel de Instagram, en vez de una cuadrícula estática densa.
const CHECKOUT_ES = 'https://pay.hotmart.com/M8269215?off=8740eb8i';

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;0,700;1,400;1,500&family=Montserrat:wght@400;500;600;700&display=swap');
  *{box-sizing:border-box;}
  .ci-reveal{opacity:0;transform:translateY(18px);transition:opacity 0.6s ease,transform 0.6s ease;}
  .ci-reveal.v{opacity:1;transform:translateY(0);}
  @keyframes ci-pulse{0%,100%{box-shadow:0 0 0 0 rgba(201,147,90,0.45);}50%{box-shadow:0 0 0 14px rgba(201,147,90,0);}}
  .ci-pulse{animation:ci-pulse 2.2s infinite;}
  .ci-cta{display:block;width:100%;text-align:center;background:linear-gradient(135deg,#C9935A,#A06030);border:none;border-radius:0.9rem;
    padding:1.15rem 1.5rem;color:white;font-size:1.05rem;font-family:Montserrat,sans-serif;font-weight:700;cursor:pointer;
    text-decoration:none;box-shadow:0 6px 28px rgba(0,0,0,0.35);transition:transform 0.2s ease;}
  .ci-cta:hover{transform:translateY(-2px);}
  .ci-carousel{display:flex;overflow-x:auto;gap:0.9rem;scroll-snap-type:x mandatory;padding:0.3rem 0.1rem 0.7rem;-webkit-overflow-scrolling:touch;scrollbar-width:none;}
  .ci-carousel::-webkit-scrollbar{display:none;}
  .ci-slide{flex:0 0 76%;scroll-snap-align:center;background:rgba(255,255,255,0.05);border:1px solid rgba(201,147,90,0.3);
    border-radius:1.25rem;padding:1.6rem 1.3rem;text-align:center;}
  .ci-badge{width:44px;height:44px;border-radius:50%;background:rgba(201,147,90,0.18);border:1px solid #C9935A;color:#E3AC71;
    font-family:Montserrat,sans-serif;font-size:0.95rem;font-weight:700;display:flex;align-items:center;justify-content:center;margin:0 auto 0.8rem;}
  .ci-slide-title{font-family:Montserrat,sans-serif;font-size:1rem;font-weight:700;color:#FAF7F1;line-height:1.35;margin-bottom:0.4rem;}
  .ci-slide-sub{font-size:1.02rem;font-style:italic;color:rgba(250,247,241,0.65);line-height:1.4;}
`;

export default function ConfortIntimo() {
  const rootRef = useRef(null);

  useEffect(() => {
    const els = rootRef.current ? rootRef.current.querySelectorAll('.ci-reveal') : [];
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('v');
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: '0px 0px -40px 0px' }
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  const checkoutUrl = CHECKOUT_ES;
  const coverImg = '/images/confort-intimo-40-es.png';
  const flowerImg = '/images/confort-intimo-flor.jpg';

  const handleCtaClick = () => {
    // El Pixel de Meta ya está instalado globalmente en layout.js (fbq init + PageView).
    if (typeof window !== 'undefined' && typeof window.fbq === 'function') {
      window.fbq('track', 'InitiateCheckout', { value: 7.9, currency: 'EUR' });
    }
  };

  const symptoms = [
    'Notas menos lubricación, aunque nada haya cambiado en tu rutina',
    'La intimidad se ha vuelto más incómoda que antes',
    'Sientes que "ya no es lo mismo" y no sabes bien por dónde empezar',
  ];

  const content = [
    { n: '7', title: 'Plan de acción de 7 días', sub: 'Pasos concretos, día a día' },
    { n: '2′', title: 'Autoevaluación de 2 minutos', sub: 'Para saber por dónde empezar' },
    { n: '✦', title: 'Remedios naturales accesibles', sub: 'Sin ingredientes raros' },
    { n: '☑', title: 'Checklist de hábitos y productos', sub: 'Qué evitar, qué priorizar' },
    { n: '!', title: 'Señales claras de cuándo consultar', sub: 'Autocuidado o visita médica' },
    { n: '🗎', title: 'Ficha para tu consulta ginecológica', sub: 'Lista para imprimir' },
  ];

  const steps = [
    'Pagas de forma segura con tarjeta — el checkout es de Hotmart, no de una web desconocida',
    'Recibes la guía al instante en tu email, en PDF, sin esperas',
    'Empiezas cuando quieras — es tuya para siempre, sin fecha límite',
  ];

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: css }} />
      <div ref={rootRef} style={{ minHeight: '100vh', background: 'linear-gradient(180deg,#0D3D3D 0%,#0A2E2E 100%)', fontFamily: "'Cormorant Garamond',Georgia,serif" }}>

        <div style={{ maxWidth: '560px', margin: '0 auto', padding: '2.5rem 1.5rem 4rem' }}>

          {/* MARCA */}
          <div className="ci-reveal v" style={{ textAlign: 'center', marginBottom: '1.25rem' }}>
            <span style={{ fontFamily: 'Montserrat,sans-serif', fontSize: '0.72rem', fontWeight: 700, color: '#E3AC71', letterSpacing: '0.4em' }}>
              {'✦ LUMERA'}
            </span>
          </div>

          {/* FIGURA CENTRAL */}
          <div className="ci-reveal v" style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.5rem' }}>
            <img
              src={flowerImg}
              alt=""
              style={{ width: '150px', height: '150px', borderRadius: '50%', objectFit: 'cover', boxShadow: '0 8px 30px rgba(0,0,0,0.45)', border: '1px solid rgba(201,147,90,0.35)' }}
            />
          </div>

          {/* ¿TE SUENA ESTO? — arriba del todo */}
          <div className="ci-reveal v" style={{ textAlign: 'center', marginBottom: '1rem' }}>
            <h1 style={{ fontSize: 'clamp(2rem,7.5vw,2.5rem)', fontWeight: 700, lineHeight: 1.2, color: '#FAF7F1', margin: 0 }}>
              {'¿Te suena esto?'}
            </h1>
          </div>
          <div style={{ marginBottom: '2rem' }}>
            {symptoms.map((s, i) => (
              <div key={i} className="ci-reveal" style={{ display: 'flex', gap: '0.6rem', alignItems: 'flex-start', justifyContent: 'center', marginBottom: i === symptoms.length - 1 ? 0 : '0.8rem', maxWidth: '440px', margin: '0 auto', paddingBottom: i === symptoms.length - 1 ? 0 : '0.8rem' }}>
                <span style={{ color: '#C9935A', fontSize: '1rem', lineHeight: 1.5, flexShrink: 0 }}>{'✦'}</span>
                <span style={{ fontSize: '1.15rem', color: '#FAF7F1', lineHeight: 1.5, fontStyle: 'italic', fontWeight: 600, textAlign: 'left' }}>{s}</span>
              </div>
            ))}
          </div>

          {/* PUENTE */}
          <div className="ci-reveal" style={{ textAlign: 'center', marginBottom: '2.25rem' }}>
            <p style={{ fontSize: '1.1rem', fontStyle: 'italic', color: 'rgba(250,247,241,0.8)', lineHeight: 1.6, margin: 0 }}>
              {'Después de los 40 el estrógeno baja y los tejidos pierden elasticidad — así de simple. Y así de simple es el plan para mejorarlo.'}
            </p>
          </div>

          {/* QUÉ VAS A ENCONTRAR — carrusel deslizable */}
          <div style={{ marginBottom: '2.25rem' }}>
            <p className="ci-reveal" style={{ fontFamily: 'Montserrat,sans-serif', fontSize: '0.68rem', fontWeight: 700, color: 'rgba(250,247,241,0.45)', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '0.9rem', textAlign: 'center' }}>
              {'Qué vas a encontrar · desliza →'}
            </p>
            <div className="ci-carousel">
              {content.map((c, i) => (
                <div key={i} className="ci-slide ci-reveal">
                  <div className="ci-badge">{c.n}</div>
                  <div className="ci-slide-title">{c.title}</div>
                  <div className="ci-slide-sub">{c.sub}</div>
                </div>
              ))}
            </div>
          </div>

          {/* CÓMO FUNCIONA */}
          <div className="ci-reveal" style={{ background: 'rgba(0,0,0,0.22)', border: '1px solid rgba(201,147,90,0.25)', borderRadius: '1.5rem', padding: '2rem 1.5rem', marginBottom: '2.25rem' }}>
            <p style={{ fontFamily: 'Montserrat,sans-serif', fontSize: '0.72rem', fontWeight: 700, color: '#E3AC71', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: '1.4rem', textAlign: 'center' }}>
              {'Cómo funciona'}
            </p>
            {steps.map((s, i) => (
              <div key={i} style={{ display: 'flex', gap: '0.9rem', alignItems: 'flex-start', marginBottom: i === steps.length - 1 ? 0 : '1.1rem' }}>
                <span style={{ flexShrink: 0, width: '28px', height: '28px', borderRadius: '50%', background: 'rgba(201,147,90,0.2)', border: '1px solid #C9935A', color: '#E3AC71', fontFamily: 'Montserrat,sans-serif', fontSize: '0.8rem', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {i + 1}
                </span>
                <span style={{ fontSize: '1.05rem', color: 'rgba(250,247,241,0.92)', lineHeight: 1.5, fontStyle: 'italic', paddingTop: '0.15rem' }}>{s}</span>
              </div>
            ))}
          </div>

          {/* PORTADA / PRODUCTO */}
          <div className="ci-reveal" style={{ marginBottom: '1.75rem' }}>
            <img
              src={coverImg}
              alt="Confort Íntimo 40+ — Guía práctica para aliviar la sequedad vaginal"
              style={{ width: '100%', display: 'block', borderRadius: '1.25rem', boxShadow: '0 12px 40px rgba(0,0,0,0.4)' }}
            />
          </div>

          {/* PRECIO / ANCLA */}
          <div className="ci-reveal" style={{ textAlign: 'center', marginBottom: '1rem' }}>
            <span style={{ fontFamily: 'Montserrat,sans-serif', fontSize: '1.05rem', color: 'rgba(250,247,241,0.4)', textDecoration: 'line-through', marginRight: '0.6rem' }}>
              {'9,90€'}
            </span>
            <span style={{ fontFamily: 'Montserrat,sans-serif', fontSize: '1.6rem', fontWeight: 700, color: '#E3AC71' }}>
              {'7,90€'}
            </span>
            <div style={{ fontFamily: 'Montserrat,sans-serif', fontSize: '0.72rem', color: 'rgba(250,247,241,0.45)', letterSpacing: '0.05em', marginTop: '0.2rem' }}>
              {'Precio de lanzamiento por tiempo limitado'}
            </div>
          </div>

          {/* CTA PRINCIPAL */}
          <div className="ci-reveal" style={{ marginBottom: '0.75rem' }}>
            <a href={checkoutUrl} target="_blank" rel="noopener noreferrer" onClick={handleCtaClick} className="ci-cta ci-pulse">
              {'→ Quiero mi guía — 7,90€'}
            </a>
          </div>
          <div className="ci-reveal" style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
            <p style={{ fontFamily: 'Montserrat,sans-serif', fontSize: '0.78rem', color: 'rgba(250,247,241,0.4)', margin: 0 }}>
              {'Descarga instantánea · Pago seguro · Garantía de devolución de 15 días'}
            </p>
          </div>

          {/* DISCLAIMER */}
          <div className="ci-reveal v" style={{ textAlign: 'center', marginBottom: '0.5rem' }}>
            <p style={{ fontFamily: 'Montserrat,sans-serif', fontSize: '0.72rem', color: 'rgba(250,247,241,0.4)', lineHeight: 1.5, margin: 0 }}>
              {'Contenido educativo y de autocuidado. No sustituye valoración médica.'}
            </p>
          </div>

          {/* FOOTER */}
          <div className="ci-reveal v" style={{ textAlign: 'center', marginTop: '2rem' }}>
            <a href="/privacidad" style={{ fontFamily: 'Montserrat,sans-serif', fontSize: '0.7rem', color: 'rgba(250,247,241,0.35)', textDecoration: 'underline', marginRight: '1rem' }}>
              {'Política de Privacidad'}
            </a>
            <a href="/terminos" style={{ fontFamily: 'Montserrat,sans-serif', fontSize: '0.7rem', color: 'rgba(250,247,241,0.35)', textDecoration: 'underline' }}>
              {'Términos de Uso'}
            </a>
          </div>

        </div>
      </div>
    </>
  );
}
