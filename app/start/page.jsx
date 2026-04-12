'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Start() {
  const [lang, setLang] = useState('es');
  const [open, setOpen] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const bl = navigator.language || 'es';
    setLang(bl.startsWith('es') ? 'es' : 'en');
  }, []);

  const is_es = lang === 'es';

  const sections = [
    { id:0, emoji:'🧠', title: is_es?'LUMI, tu confidente 24/7':'LUMI, your confidante 24/7', body: is_es?'No es un chatbot. Es una guia biologica personal que aprende como te sientes y te acompana en tiempo real. A las 3am si hace falta.':'Not a chatbot. A personal biological guide that learns how you feel and supports you in real time. At 3am if needed.' },
    { id:1, emoji:'🥗', title: is_es?'Nutricion que equilibra tus hormonas':'Nutrition that balances your hormones', body: is_es?'Menus adaptados a como te sientes esa semana. Tu ciclo, tus sintomas, tu energia real. Con La Lente Alquimica: fotografia tu comida y sabe al instante si te ayuda o te perjudica.':'Menus adapted to how you feel that week. Your cycle, symptoms, real energy. With the Alchemical Lens: photograph your meal and instantly know if it helps or hurts.' },
    { id:2, emoji:'🔍', title: is_es?'Entiende lo que te pasa de verdad':'Understand what is happening for real', body: is_es?'Brain fog, fatiga, antojos, insomnio. Lumera conecta tus sintomas con tu biologia y te explica el porque. Sin alarmar. Sin diagnosticar.':'Brain fog, fatigue, cravings, insomnia. Lumera connects your symptoms with your biology and explains why. Without alarming. Without diagnosing.' },
    { id:3, emoji:'📚', title: is_es?'Recursos para tu vida real':'Resources for your real life', body: is_es?'Guias descargables, planes de 7 dias y herramientas practicas.':'Downloadable guides, 7-day plans and practical tools.', resources:true },
  ];

  const res = [
    { emoji:'📥', title: is_es?'Guia GLP-1 Natural Gratis':'Natural GLP-1 Guide Free', sub: is_es?'3 habitos que cambian tu energia':'3 habits that change your energy', btn: is_es?'Descargar gratis':'Download free', color:'#2A7A4A', url:'/guia-glp1', ext:false },
    { emoji:'⭐', title: is_es?'Plan GLP-1 Completo 7 Dias':'Complete GLP-1 7-Day Plan', sub: is_es?'21 comidas · Lista compra · Anti-antojos':'21 meals · Shopping list · Cravings reset', btn: is_es?'Obtener €6.99':'Get €6.99', color:'linear-gradient(135deg,#C9935A,#A06030)', url: is_es?'https://getlumera.gumroad.com/l/yndiyy':'https://getlumera.gumroad.com/l/hkbpn', ext:true },
  ];

  const pg = {minHeight:'100vh',background:'linear-gradient(135deg,rgba(8,6,4,0.96),rgba(20,12,6,0.94))',backgroundImage:'url(/images/quiz-bg.png)',backgroundSize:'cover',backgroundPosition:'center',backgroundBlendMode:'multiply',fontFamily:"'Cormorant Garamond',Georgia,serif",color:'white'};

  return (
    <div style={pg}>
      <div style={{maxWidth:'540px',margin:'0 auto',padding:'2rem 1.25rem 4rem',display:'flex',flexDirection:'column',alignItems:'center'}}>
        <div style={{textAlign:'center',marginBottom:'2rem'}}>
          <div style={{color:'#C9935A',fontSize:'0.95rem',letterSpacing:'0.3em',fontWeight:300,marginBottom:'0.5rem'}}>{'✦ LUMERA'}</div>
          <div style={{fontSize:'2.2rem',fontWeight:700,lineHeight:1.15,marginBottom:'0.75rem'}}>{is_es?'Tu santuario para los 40+':'Your sanctuary for 40+'}</div>
          <div style={{fontSize:'1.1rem',fontStyle:'italic',color:'rgba(240,232,220,0.8)',lineHeight:1.6}}>{is_es?'La app que se adapta a ti, a lo que sientes y necesitas, para que transites este camino acompanada.':'The app that adapts to you, to what you feel and need, so you never walk this path alone.'}</div>
        </div>
        <button onClick={() => router.push('/quiz')} style={{width:'100%',background:'linear-gradient(135deg,#C9935A,#A06030)',border:'none',borderRadius:'0.75rem',padding:'1.1rem',color:'white',fontSize:'1.1rem',fontFamily:'Montserrat,sans-serif',fontWeight:700,letterSpacing:'1px',cursor:'pointer',marginBottom:'0.5rem'}}>{is_es?'✨ EMPIEZA TU SANTUARIO — 3 DIAS GRATIS':'✨ START YOUR SANCTUARY — 3 DAYS FREE'}</button>
        <div style={{fontSize:'0.8rem',color:'rgba(240,232,220,0.4)',fontFamily:'Montserrat,sans-serif',marginBottom:'2.5rem'}}>{is_es?'Sin tarjeta · Cancela cuando quieras':'No card · Cancel anytime'}</div>
        <div style={{width:'100%',marginBottom:'2rem'}}>
          <div style={{fontFamily:'Montserrat,sans-serif',fontSize:'0.8rem',fontWeight:700,color:'#C9935A',letterSpacing:'3px',textTransform:'uppercase',marginBottom:'1rem',textAlign:'center'}}>{is_es?'Por que Lumera?':'Why Lumera?'}</div>
          {(is_es?['✦  Porque aqui no estas sola','✦  Porque no te hablan como a una paciente','✦  Porque alguien te acompana dia a dia']:['✦  Because here you are not alone','✦  Because you are not treated like a patient','✦  Because someone walks with you every day']).map((t,i)=>(
            <div key={i} style={{fontSize:'1.05rem',fontStyle:'italic',color:'rgba(240,232,220,0.88)',marginBottom:'0.6rem',lineHeight:1.5}}>{t}</div>
          ))}
        </div>
        <div style={{width:'100%',marginBottom:'2rem'}}>
          <div style={{fontFamily:'Montserrat,sans-serif',fontSize:'0.8rem',fontWeight:700,color:'#C9935A',letterSpacing:'3px',textTransform:'uppercase',marginBottom:'1rem',textAlign:'center'}}>{is_es?'Dentro de Lumera':'Inside Lumera'}</div>
          {sections.map((sec)=>(
            <div key={sec.id} style={{marginBottom:'0.75rem'}}>
              <div onClick={()=>setOpen(open===sec.id?null:sec.id)} style={{background:'rgba(255,255,255,0.04)',border:'1px solid rgba(201,147,90,0.25)',borderLeft:open===sec.id?'3px solid #C9935A':'3px solid rgba(201,147,90,0.4)',borderRadius:'0 0.75rem 0.75rem 0',padding:'0.9rem 1rem',cursor:'pointer',display:'flex',justifyContent:'space-between',alignItems:'center'}}>
                <div style={{fontSize:'1.05rem',fontWeight:700}}>{sec.emoji} {sec.title}</div>
                <div style={{color:'#C9935A',fontSize:'1.2rem'}}>{open===sec.id?'−':'+'}</div>
              </div>
              {open===sec.id&&(
                <div style={{background:'rgba(255,255,255,0.02)',border:'1px solid rgba(201,147,90,0.15)',borderTop:'none',borderRadius:'0 0 0.75rem 0.75rem',padding:'0.9rem 1rem'}}>
                  <div style={{fontSize:'1rem',fontStyle:'italic',color:'rgba(240,232,220,0.82)',lineHeight:1.7,marginBottom:sec.resources?'1rem':0}}>{sec.body}</div>
                  {sec.resources&&(
                    <div style={{display:'flex',flexDirection:'column',gap:'0.6rem'}}>
                      {res.map((r,i)=>(
                        <div key={i} style={{background:'rgba(255,255,255,0.04)',border:'1px solid rgba(201,147,90,0.2)',borderRadius:'0.6rem',padding:'0.75rem 1rem',display:'flex',justifyContent:'space-between',alignItems:'center',gap:'0.5rem'}}>
                          <div>
                            <div style={{fontSize:'0.95rem',fontWeight:700,marginBottom:'0.2rem'}}>{r.emoji} {r.title}</div>
                            <div style={{fontSize:'0.85rem',color:'rgba(240,232,220,0.6)',fontStyle:'italic'}}>{r.sub}</div>
                          </div>
                          <button onClick={()=>r.ext?window.open(r.url,'_blank'):router.push(r.url)} style={{background:r.color,border:'none',borderRadius:'0.5rem',padding:'0.5rem 0.75rem',color:'white',fontSize:'0.8rem',fontFamily:'Montserrat,sans-serif',fontWeight:700,cursor:'pointer',whiteSpace:'nowrap',flexShrink:0}}>{r.btn}</button>
                        </div>
                      ))}
                      <div style={{fontSize:'0.8rem',color:'rgba(201,147,90,0.4)',fontStyle:'italic',textAlign:'center'}}>{is_es?'Proximamente mas guias...':'More guides coming soon...'}</div>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
        <div style={{width:'100%',textAlign:'center',borderTop:'1px solid rgba(201,147,90,0.2)',paddingTop:'2rem'}}>
          <div style={{fontSize:'1.4rem',fontWeight:700,marginBottom:'0.5rem'}}>{is_es?'Tu cuerpo es unico. Lumera lo sabe.':'Your body is unique. Lumera knows it.'}</div>
          <div style={{fontSize:'1rem',fontStyle:'italic',color:'rgba(240,232,220,0.6)',marginBottom:'1.5rem'}}>{is_es?'Empieza a entenderte.':'Start understanding yourself.'}</div>
          <button onClick={()=>router.push('/quiz')} style={{width:'100%',background:'linear-gradient(135deg,#C9935A,#A06030)',border:'none',borderRadius:'0.75rem',padding:'1.1rem',color:'white',fontSize:'1.1rem',fontFamily:'Montserrat,sans-serif',fontWeight:700,letterSpacing:'1px',cursor:'pointer',marginBottom:'0.5rem'}}>{is_es?'✨ EMPIEZA TU SANTUARIO — 3 DIAS GRATIS':'✨ START YOUR SANCTUARY — 3 DAYS FREE'}</button>
          <div style={{fontSize:'0.8rem',color:'rgba(240,232,220,0.4)',fontFamily:'Montserrat,sans-serif'}}>{is_es?'Sin tarjeta · Cancela cuando quieras':'No card · Cancel anytime'}</div>
        </div>
        <div style={{marginTop:'2rem',color:'rgba(201,147,90,0.3)',fontSize:'0.8rem',fontStyle:'italic',letterSpacing:'0.1em',textAlign:'center'}}>{'✦ Lumera — Decoding Women\'s Biology'}</div>
      </div>
    </div>
  );
}
