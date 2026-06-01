'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;0,700;1,400&family=Montserrat:wght@400;500;600;700&display=swap');
  *{box-sizing:border-box;margin:0;padding:0;}
  .fi{opacity:0;transform:translateY(20px);transition:opacity 0.8s ease,transform 0.8s ease;}
  .fi.v{opacity:1;transform:translateY(0);}
  .d1{transition-delay:0.1s;} .d2{transition-delay:0.3s;} .d3{transition-delay:0.5s;} .d4{transition-delay:0.65s;}
  @keyframes pulse{0%,100%{box-shadow:0 0 0 0 rgba(201,147,90,0.5);}50%{box-shadow:0 0 0 12px rgba(201,147,90,0);}}
  .pulse{animation:pulse 2s infinite;}
  .btn{width:100%;background:linear-gradient(135deg,#C9935A,#A06030);border:none;border-radius:0.75rem;padding:1.15rem 1.5rem;color:white;font-size:1.1rem;font-family:Montserrat,sans-serif;font-weight:700;cursor:pointer;box-shadow:0 4px 24px rgba(201,147,90,0.35);transition:transform 0.2s ease;}
  .btn:hover{transform:translateY(-2px);}
  .symp{display:flex;align-items:center;gap:0.75rem;padding:0.9rem 1.1rem;background:white;border:1px solid rgba(201,147,90,0.2);border-radius:0.75rem;margin-bottom:0.5rem;text-align:left;}
`;

export default function Start() {
  const [lang, setLang] = useState('es');
  const [v, setV] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const bl = navigator.language || 'es';
    setLang(bl.startsWith('es') ? 'es' : 'en');
    setTimeout(() => setV(true), 100);
  }, []);

  const es = lang === 'es';

  return (
    <>
      <style dangerouslySetInnerHTML={{__html: css}} />
      <div style={{minHeight:'100vh',display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',padding:'3rem 1.5rem',textAlign:'center',background:'linear-gradient(180deg,#ffffff 0%,#FBF7F0 100%)',fontFamily:"'Cormorant Garamond',Georgia,serif"}}>
        <div style={{maxWidth:'480px',width:'100%'}}>

          <div className={['fi d1',v?'v':''].join(' ')}>
            <img src="/images/shula-lagrima.jpg" alt="Lumera" style={{width:'130px',height:'165px',objectFit:'cover',objectPosition:'top center',borderRadius:'50% 50% 40% 40%',border:'3px solid #C9935A',marginBottom:'1.5rem',boxShadow:'0 8px 32px rgba(201,147,90,0.2)'}}/>
          </div>

          <div className={['fi d1',v?'v':''].join(' ')} style={{fontFamily:'Montserrat,sans-serif',fontSize:'0.7rem',fontWeight:700,color:'#C9935A',letterSpacing:'0.4em',marginBottom:'1rem'}}>
            ✦ LUMERA
          </div>

          <div className={['fi d2',v?'v':''].join(' ')}>
            <h1 style={{fontSize:'clamp(1.9rem,5vw,2.6rem)',fontWeight:700,lineHeight:1.15,marginBottom:'1rem',color:'#0D3D3D'}}>
              {es ? '¿Estás en perimenopausia o menopausia y no sabes por dónde empezar?' : 'Are you in perimenopause or menopause and do not know where to start?'}
            </h1>
            <p style={{fontSize:'1.05rem',fontStyle:'italic',color:'rgba(13,61,61,0.6)',marginBottom:'1.75rem',lineHeight:1.7}}>
              {es ? 'Descubre qué le está pasando a tu cuerpo y recibe un plan adaptado a ti — en 2 minutos.' : 'Discover what is happening to your body and get a plan adapted to you — in 2 minutes.'}
            </p>
          </div>

          <div className={['fi d3',v?'v':''].join(' ')} style={{marginBottom:'1.75rem'}}>
            {(es ? [
              {icon:'😴', text:'Duermes mal o te despiertas sin razón'},
              {icon:'⚡', text:'Cansancio que no desaparece'},
              {icon:'🧠', text:'Niebla mental, cambios de humor'},
              {icon:'🌡️', text:'Sofocos o ciclo irregular'},
            ] : [
              {icon:'😴', text:'Poor sleep or waking up for no reason'},
              {icon:'⚡', text:'Fatigue that never goes away'},
              {icon:'🧠', text:'Brain fog or mood changes'},
              {icon:'🌡️', text:'Hot flashes or irregular cycle'},
            ]).map((s,i) => (
              <div key={i} className="symp">
                <span style={{fontSize:'1.2rem',flexShrink:0}}>{s.icon}</span>
                <span style={{fontSize:'0.95rem',color:'#0D3D3D'}}>{s.text}</span>
              </div>
            ))}
          </div>

          <div className={['fi d4',v?'v':''].join(' ')}>
            <button className="btn pulse" onClick={()=>router.push('/quiz')} style={{marginBottom:'0.75rem'}}>
              {es ? '✨ Descubrir mi plan — 2 minutos' : '✨ Discover my plan — 2 minutes'}
            </button>
            <p style={{fontSize:'0.78rem',color:'rgba(13,61,61,0.35)',fontFamily:'Montserrat,sans-serif'}}>
              {es ? '3 días gratis · Sin tarjeta · Cancela cuando quieras' : '3 days free · No card · Cancel anytime'}
            </p>
          </div>

        </div>
      </div>
    </>
  );
}
