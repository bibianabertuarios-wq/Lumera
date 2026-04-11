'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Bienvenida() {
  const [lang, setLang] = useState('es');
  const router = useRouter();

  useEffect(() => {
    const bl = navigator.language || 'es';
    setLang(bl.startsWith('es') ? 'es' : 'en');
  }, []);

  const is_es = lang === 'es';

  const options = [
    {
      icon: '🎯',
      badge: is_es ? 'GRATIS' : 'FREE',
      title: is_es ? '3 Hábitos GLP-1 Naturales' : '3 Natural GLP-1 Habits',
      sub: is_es ? 'Empieza hoy. Energía estable esta semana.' : 'Start today. Feel stable energy this week.',
      checks: is_es ? ['Menos antojos 4pm','Energía sin bajones','Menos hinchazón'] : ['Fewer 4pm cravings','Stable energy after meals','Less bloating'],
      btn: is_es ? 'DESCARGAR GRATIS' : 'DOWNLOAD FREE GUIDE',
      micro: is_es ? 'Sin tarjeta · Descarga instantánea' : 'No card needed · Instant access',
      color: '#2A7A4A',
      action: () => router.push('/guia-glp1'),
    },
    {
      icon: '👑',
      badge: '€6.99',
      title: is_es ? 'GLP-1 Natural Completo' : 'GLP-1 Natural Complete',
      sub: is_es ? 'Plan 7 Días · Mujeres 40+' : '7-Day Plan · Women 40+',
      checks: is_es ? ['21 comidas listas','Lista compra preparada','Rutina anti-antojos','Bonus: 7 días Lumera GRATIS'] : ['21 meals planned','Shopping list ready','Cravings reset routine','Bonus: 7 days Lumera FREE'],
      btn: is_es ? 'OBTENER PREMIUM' : 'GET PREMIUM',
      micro: is_es ? 'Descarga instantánea · Sin suscripción' : 'Instant download · No subscription',
      color: 'linear-gradient(135deg,#C9935A,#A06030)',
      action: () => window.open('https://getlumera.gumroad.com', '_blank'),
    },
    {
      icon: '✨',
      badge: is_es ? '3 DÍAS GRATIS' : '3 DAYS FREE',
      title: is_es ? 'Transformación Completa' : 'Complete Transformation',
      sub: is_es ? 'Lumera · Tu guía personal 24/7' : 'Lumera · Your personal guide 24/7',
      checks: is_es ? ['Plan diario personalizado','Lente alquímica para comida','Seguimiento síntomas + energía','Se adapta a tu vida real'] : ['Personalized daily plan','Alchemical lens for food','Symptom + energy tracking','Adapts to your real life'],
      btn: is_es ? 'EMPEZAR 3 DÍAS GRATIS' : 'START 3 DAYS FREE',
      micro: is_es ? 'Sin tarjeta · Cancelar cuando quieras' : 'No card · Cancel anytime',
      color: '#1A6B6B',
      action: () => router.push('/quiz'),
    },
  ];

  return (
    <div style={{minHeight:'100vh',background:'linear-gradient(135deg,rgba(10,8,6,0.92) 0%,rgba(26,16,8,0.88) 100%)',backgroundImage:'url(/images/quiz-bg.png)',backgroundSize:'cover',backgroundPosition:'center',backgroundBlendMode:'multiply',display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',padding:'1.25rem',fontFamily:"'Cormorant Garamond',Georgia,serif"}}>
      <div style={{textAlign:'center',marginBottom:'1.5rem'}}>
        <div style={{color:'#C9935A',fontSize:'1rem',letterSpacing:'0.25em',fontWeight:300,marginBottom:'0.5rem'}}>{'✦ LUMERA'}</div>
        <div style={{color:'white',fontSize:'1.9rem',fontWeight:700,lineHeight:1.2,marginBottom:'0.5rem'}}>{is_es ? 'Tu Siguiente Paso Empieza Aquí' : 'Your Next Step Starts Here'}</div>
        <div style={{color:'rgba(240,232,220,0.95)',fontSize:'1rem',fontStyle:'italic'}}>{is_es ? 'Elige cómo quieres apoyar tu GLP-1 natural' : 'Choose how you want to support your natural GLP-1'}</div>
      </div>
      <div style={{width:'100%',maxWidth:'500px',display:'flex',flexDirection:'column',gap:'0.85rem'}}>
        {options.map((opt, idx) => (
          <div key={idx} style={{background:'rgba(255,255,255,0.04)',border:'1px solid rgba(201,147,90,0.35)',borderRadius:'1rem',padding:'1.1rem 1.25rem',position:'relative'}}>
            <div style={{position:'absolute',top:'-10px',right:'1rem',background:idx===1?'linear-gradient(135deg,#C9935A,#A06030)':idx===0?'#2A7A4A':'#1A6B6B',color:'white',fontSize:'0.7rem',fontWeight:700,padding:'2px 10px',borderRadius:'20px',fontFamily:'Montserrat,sans-serif',letterSpacing:'1px'}}>{opt.badge}</div>
            <div style={{display:'flex',alignItems:'center',gap:'0.5rem',marginBottom:'0.25rem'}}>
              <span style={{fontSize:'1.3rem'}}>{opt.icon}</span>
              <span style={{color:'white',fontSize:'1.15rem',fontWeight:700}}>{opt.title}</span>
            </div>
            <div style={{color:'rgba(240,232,220,0.9)',fontSize:'0.95rem',fontStyle:'italic',marginBottom:'0.75rem',marginLeft:'1.8rem'}}>{opt.sub}</div>
            <div style={{marginBottom:'0.85rem'}}>
              {opt.checks.map((c,i) => (
                <div key={i} style={{color:'rgba(255,255,255,0.95)',fontSize:'0.95rem',marginBottom:'0.25rem',display:'flex',gap:'0.5rem'}}>
                  <span style={{color:'#C9935A',flexShrink:0}}>{'✓'}</span><span>{c}</span>
                </div>
              ))}
            </div>
            <button onClick={opt.action} style={{width:'100%',background:opt.color,border:'none',borderRadius:'0.6rem',padding:'0.8rem',color:'white',fontSize:'0.95rem',fontFamily:'Montserrat,sans-serif',fontWeight:700,letterSpacing:'1px',cursor:'pointer',marginBottom:'0.4rem'}}>{opt.btn}</button>
            <div style={{textAlign:'center',color:'rgba(240,232,220,0.6)',fontSize:'0.75rem',fontFamily:'Montserrat,sans-serif'}}>{opt.micro}</div>
          </div>
        ))}
      </div>
      <div style={{marginTop:'1.5rem',color:'rgba(201,147,90,0.35)',fontSize:'0.8rem',fontStyle:'italic',letterSpacing:'0.1em',textAlign:'center'}}>{'✦ Lumera — Decoding Women\'s Biology'}</div>
    </div>
  );
}
