'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Start() {
  const [lang, setLang] = useState('es');
  const [visible, setVisible] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const bl = navigator.language || 'es';
    setLang(bl.startsWith('es') ? 'es' : 'en');
    setTimeout(() => setVisible(true), 100);
  }, []);

  const is_es = lang === 'es';

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;0,700;1,400&family=Montserrat:wght@400;600;700&display=swap');
        *{box-sizing:border-box;margin:0;padding:0;}
        .fade-in{opacity:0;transform:translateY(20px);transition:opacity 0.8s ease,transform 0.8s ease;}
        .fade-in.visible{opacity:1;transform:translateY(0);}
        .d1{transition-delay:0.1s;} .d2{transition-delay:0.3s;} .d3{transition-delay:0.5s;} .d4{transition-delay:0.7s;}
        @keyframes pulse{0%,100%{box-shadow:0 0 0 0 rgba(201,147,90,0.4);}50%{box-shadow:0 0 0 10px rgba(201,147,90,0);}}
        .pulse{animation:pulse 2s infinite;}
      `}</style>
      <div style={{minHeight:'100vh',display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',padding:'2.5rem 1.5rem',textAlign:'center',background:'linear-gradient(180deg,#ffffff 0%,#FBF7F0 100%)',fontFamily:"'Cormorant Garamond',Georgia,serif"}}>
        <div style={{maxWidth:'460px',width:'100%'}}>

          <div className={`fade-in d1 ${visible?'visible':''}`}>
            <img src="/images/shula-lagrima.jpg" alt="Lumera" style={{width:'150px',height:'190px',objectFit:'cover',objectPosition:'top center',borderRadius:'50% 50% 40% 40%',border:'3px solid #C9935A',marginBottom:'1.5rem',boxShadow:'0 12px 40px rgba(201,147,90,0.25)'}}/>
          </div>

          <div className={`fade-in d1 ${visible?'visible':''}`} style={{fontFamily:'Montserrat,sans-serif',fontSize:'0.72rem',fontWeight:700,color:'#C9935A',letterSpacing:'0.4em',marginBottom:'1.25rem'}}>✦ LUMERA</div>

          <div className={`fade-in d2 ${visible?'visible':''}`}>
            <h1 style={{fontSize:'clamp(2rem,5vw,2.6rem)',fontWeight:700,lineHeight:1.15,marginBottom:'1.25rem',color:'#0D3D3D'}}>
              {is_es?'¿Notas que tu cuerpo y tu energía han cambiado después de los 40?':'Have you noticed changes in your body and energy after 40?'}
            </h1>
          </div>

          <div className={`fade-in d3 ${visible?'visible':''}`} style={{background:'linear-gradient(135deg,rgba(201,147,90,0.08),rgba(201,147,90,0.03))',border:'1px solid rgba(201,147,90,0.3)',borderLeft:'4px solid #C9935A',borderRadius:'0 1rem 1rem 0',padding:'1.25rem 1.5rem',marginBottom:'1.75rem',textAlign:'left'}}>
            <div style={{fontFamily:'Montserrat,sans-serif',fontSize:'0.68rem',fontWeight:700,color:'#C9935A',letterSpacing:'2px',textTransform:'uppercase',marginBottom:'0.5rem'}}>💡 {is_es?'¿Sabías que?':'Did you know?'}</div>
            <p style={{fontSize:'1rem',lineHeight:1.7,fontStyle:'italic',color:'rgba(13,61,61,0.85)'}}>
              {is_es?'El estrógeno no solo regula tu ciclo — también actúa como antiinflamatorio natural en tu cerebro. Cuando fluctúa después de los 40, cambia tu memoria, tu sueño, tu energía y tu humor. Todo está conectado.':'Oestrogen doesn\'t just regulate your cycle — it also acts as a natural anti-inflammatory in your brain. When it fluctuates after 40, it changes your memory, sleep, energy and mood. Everything is connected.'}
            </p>
          </div>

          <div className={`fade-in d3 ${visible?'visible':''}`}>
            <p style={{fontSize:'1.05rem',fontStyle:'italic',color:'rgba(13,61,61,0.6)',marginBottom:'2rem',lineHeight:1.7}}>
             {is_es?'Descubre qué te está diciendo tu cuerpo y recibe un plan adaptado a ti \u2014 en 2 minutos.':'Discover what your body is telling you and get a plan adapted to you \u2014 in 2 minutes.'}
          </div>

          <div className={`fade-in d4 ${visible?'visible':''}`}>
            <button className="pulse" onClick={()=>router.push('/quiz')} style={{width:'100%',background:'linear-gradient(135deg,#C9935A,#A06030)',border:'none',borderRadius:'0.75rem',padding:'1.15rem',color:'white',fontSize:'1.1rem',fontFamily:'Montserrat,sans-serif',fontWeight:700,cursor:'pointer',marginBottom:'0.75rem',boxShadow:'0 4px 24px rgba(201,147,90,0.35)'}}>
              {is_es?'✨ Empezar mi plan — 2 minutos':'✨ Start my 2-minute plan'}
            </button>
            <p style={{fontSize:'0.78rem',color:'rgba(13,61,61,0.35)',fontFamily:'Montserrat,sans-serif'}}>
              {is_es?'Sin tarjeta · 3 días gratis · Cancela cuando quieras':'No card · 3 days free · Cancel anytime'}
            </p>
          </div>

        </div>
      </div>
    </>
  );
}
