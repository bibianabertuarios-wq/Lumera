'use client';
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';

export default function Start() {
  const [lang, setLang] = useState('es');
  const [lenteProbada, setLenteProbada] = useState(false);
  const [foto, setFoto] = useState(null);
  const [analisis, setAnalisis] = useState('');
  const [cargando, setCargando] = useState(false);
  const [openSection, setOpenSection] = useState(null);
  const [showInstall, setShowInstall] = useState(false);
  const fileRef = useRef();
  const router = useRouter();

  useEffect(() => {
    const bl = navigator.language || 'es';
    setLang(bl.startsWith('es') ? 'es' : 'en');
    setLenteProbada(!!localStorage.getItem('lente_usada'));
  }, []);

  const is_es = lang === 'es';
  const cream = '#FBF7F0';
  const teal = '#0D3D3D';
  const copper = '#C9935A';
  const green = '#2A7A4A';
  const mint = '#EAF5EF';

  const handleFoto = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = async (ev) => {
      const base64 = ev.target.result.split(',')[1];
      setFoto(ev.target.result);
      setCargando(true);
      try {
        const res = await fetch('/api/lente', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ image: base64, lang })
        });
        const data = await res.json();
        setAnalisis(data.analisis || (is_es ? 'No se pudo analizar.' : 'Could not analyse.'));
        localStorage.setItem('lente_usada', '1');
        setLenteProbada(true);
      } catch {
        setAnalisis(is_es ? 'Error al analizar. Intenta de nuevo.' : 'Analysis error. Please try again.');
      }
      setCargando(false);
    };
    reader.readAsDataURL(file);
  };

  const weeks = is_es ? [
    { w:'Semana 1', icon:'⚡', result:'Menos antojos a las 4pm', sub:'Tu GLP-1 empieza a activarse' },
    { w:'Semana 2', icon:'☀️', result:'Energía estable sin café extra', sub:'Tu metabolismo se recalibra' },
    { w:'Semana 3', icon:'✨', result:'Tu ropa te queda diferente', sub:'Tu cuerpo encuentra su equilibrio' },
  ] : [
    { w:'Week 1', icon:'⚡', result:'Fewer 4pm cravings', sub:'Your GLP-1 starts activating' },
    { w:'Week 2', icon:'☀️', result:'Stable energy without extra coffee', sub:'Your metabolism recalibrates' },
    { w:'Week 3', icon:'✨', result:'Your clothes fit differently', sub:'Your body finds its balance' },
  ];

  const sections = [
    { id:0, emoji:'🧠', title: is_es?'LUMI — Tu guía y confidente 24/7, solo para ti':'LUMI — Your biological guide 24/7', body: is_es?'No es un chatbot. Es una guía biológica personal que aprende cómo te sientes, recuerda tu historial y te acompaña en tiempo real. Disponible a las 3am si hace falta..':'Not a chatbot. A personal biological guide that learns how you feel, remembers your history and supports you in real time. Available at 3am if needed.' },
    { id:1, emoji:'🥗', title: is_es?'Nutrición personalizada — sin magia, con resultados reales':'Nutrition adapted to your hormones', body: is_es?'Menús que cambian cada semana según tus síntomas reales. Tu ciclo, tu energía, tus restricciones alimentarias. Nunca el mismo plan dos semanas seguidas..':'Menus that change every week based on your real symptoms. Your cycle, your energy, your food restrictions. Never the same plan two weeks in a row.' },
    { id:2, emoji:'📊', title: is_es?'Seguimiento de síntomas y ciclo hormonal':'Symptom and cycle tracking', body: is_es?'Registra tu energia, sueno, animo y sintomas. Lumera detecta patrones y te explica la conexión con tus hormonas. Lo que sientes tiene una razón biológica..':'Track your energy, sleep, mood and symptoms. Lumera detects patterns and explains the connection with your hormones. What you feel has a biological reason.' },
    { id:3, emoji:'📚', title: is_es?'Recursos y guías descargables':'Resources and downloadable guides', body: is_es?'Guías GLP-1, planes de 7 días, retos y herramientas practicas. Todo lo que necesitas, cuando lo necesitas. Y mas contenido cada mes.':'GLP-1 guides, 7-day plans, challenges and practical tools. Everything you need, when you need it. And more content every month.' },
  ];

  return (
    <div style={{fontFamily:"'Cormorant Garamond',Georgia,serif",background:cream,color:teal,overflowX:'hidden'}}>

      {/* POPUP INSTALACION */}
      {showInstall && (
        <div onClick={()=>setShowInstall(false)} style={{position:'fixed',top:0,left:0,right:0,bottom:0,background:'rgba(0,0,0,0.5)',zIndex:1000,display:'flex',alignItems:'center',justifyContent:'center',padding:'1.5rem'}}>
          <div onClick={e=>e.stopPropagation()} style={{background:'white',borderRadius:'1.25rem',padding:'2rem 1.5rem',maxWidth:'400px',width:'100%',fontFamily:"'Cormorant Garamond',Georgia,serif"}}>
            <div style={{textAlign:'center',marginBottom:'1.5rem'}}>
              <div style={{fontSize:'2rem',marginBottom:'0.5rem'}}>📱</div>
              <div style={{fontSize:'1.4rem',fontWeight:700,color:'#0D3D3D',marginBottom:'0.25rem'}}>
                {is_es ? 'Instala Lumera en tu móvil' : 'Install Lumera on your phone'}
              </div>
              <div style={{fontSize:'0.95rem',fontStyle:'italic',color:'rgba(13,61,61,0.6)'}}>
                {is_es ? 'Sin App Store · Gratis · En segundos' : 'No App Store · Free · In seconds'}
              </div>
            </div>
            <div style={{background:'#EAF5EF',borderRadius:'0.75rem',padding:'1.25rem',marginBottom:'1rem'}}>
              <div style={{fontFamily:'Montserrat,sans-serif',fontSize:'0.75rem',fontWeight:700,color:'#2A7A4A',letterSpacing:'2px',textTransform:'uppercase',marginBottom:'0.75rem'}}>🍎 iPhone / iPad</div>
              <div style={{fontSize:'0.95rem',color:'#0D3D3D',lineHeight:1.7}}>
                {is_es
                  ? <span>1. Abre getlumera.app en Safari<br/>2. Pulsa el botón Compartir ↑<br/>3. Selecciona "Añadir a pantalla de inicio"<br/>4. Pulsa "Añadir" — ¡lista!</span>
                  : <span>1. Open getlumera.app in Safari<br/>2. Tap the Share button ↑<br/>3. Select "Add to Home Screen"<br/>4. Tap "Add" — done!</span>}
              </div>
            </div>
            <div style={{background:'#EAF5EF',borderRadius:'0.75rem',padding:'1.25rem',marginBottom:'1.5rem'}}>
              <div style={{fontFamily:'Montserrat,sans-serif',fontSize:'0.75rem',fontWeight:700,color:'#2A7A4A',letterSpacing:'2px',textTransform:'uppercase',marginBottom:'0.75rem'}}>🤖 Android</div>
              <div style={{fontSize:'0.95rem',color:'#0D3D3D',lineHeight:1.7}}>
                {is_es
                  ? <span>1. Abre getlumera.app en Chrome<br/>2. Pulsa el menú ⋮ arriba a la derecha<br/>3. Selecciona "Añadir a pantalla de inicio"<br/>4. Pulsa "Añadir" — ¡lista!</span>
                  : <span>1. Open getlumera.app in Chrome<br/>2. Tap the menu ⋮ top right<br/>3. Select "Add to Home Screen"<br/>4. Tap "Add" — done!</span>}
              </div>
            </div>
            <button onClick={()=>setShowInstall(false)} style={{width:'100%',background:'linear-gradient(135deg,#C9935A,#A06030)',border:'none',borderRadius:'0.75rem',padding:'0.9rem',color:'white',fontSize:'1rem',fontFamily:'Montserrat,sans-serif',fontWeight:700,cursor:'pointer'}}>
              {is_es ? 'Entendido ✦' : 'Got it ✦'}
            </button>
          </div>
        </div>
      )}

      {/* HERO */}
      <div style={{minHeight:'100vh',display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',padding:'2.5rem 1.25rem',textAlign:'center',background:`linear-gradient(180deg,white 0%,${cream} 100%)`}}>
        <div style={{maxWidth:'500px',width:'100%'}}>
          <img src="/images/shula-lagrima.jpg" alt="Lumera" style={{width:'180px',height:'220px',objectFit:'cover',objectPosition:'top center',borderRadius:'50% 50% 40% 40%',border:`3px solid ${copper}`,marginBottom:'1.5rem',boxShadow:'0 8px 32px rgba(201,147,90,0.25)'}}/>
          <div style={{color:copper,fontSize:'0.85rem',letterSpacing:'0.3em',marginBottom:'0.75rem',fontFamily:'Montserrat,sans-serif',fontWeight:700}}>{'✦ LUMERA'}</div>
          <div style={{display:'flex',gap:'0.5rem',justifyContent:'center',marginBottom:'0.75rem',flexWrap:'wrap'}}>
            <span onClick={()=>setShowInstall(true)} style={{background:'rgba(13,61,61,0.08)',border:'1px solid rgba(13,61,61,0.15)',borderRadius:'20px',padding:'3px 10px',fontSize:'0.75rem',fontFamily:'Montserrat,sans-serif',fontWeight:600,color:'#0D3D3D',letterSpacing:'0.5px',cursor:'pointer'}}>📱 App descargable</span>
            <span style={{background:'rgba(13,61,61,0.08)',border:'1px solid rgba(13,61,61,0.15)',borderRadius:'20px',padding:'3px 10px',fontSize:'0.75rem',fontFamily:'Montserrat,sans-serif',fontWeight:600,color:'#0D3D3D',letterSpacing:'0.5px'}}>🌍 ES · EN</span>
            <span style={{background:'rgba(201,147,90,0.12)',border:'1px solid rgba(201,147,90,0.3)',borderRadius:'20px',padding:'3px 10px',fontSize:'0.75rem',fontFamily:'Montserrat,sans-serif',fontWeight:600,color:'#C9935A',letterSpacing:'0.5px'}}>✦ 3 días gratis</span>
          </div>
          <h1 style={{fontSize:'2.3rem',fontWeight:700,lineHeight:1.15,marginBottom:'1rem',color:teal}}>
            {is_es ? '¿¿No sabes si tu cansancio es físico, emocional u hormonal?' : 'Not sure if your fatigue is physical, emotional or hormonal?'}
          </h1>
          <p style={{fontSize:'1.15rem',fontStyle:'italic',color:'rgba(13,61,61,0.7)',marginBottom:'2rem',lineHeight:1.6}}>
            {is_es ? 'Lumera te da claridad en 45 segundos.' : 'Lumera gives you clarity in 45 seconds.'}
          </p>
          <button onClick={() => router.push('/quiz')} style={{width:'100%',background:`linear-gradient(135deg,${copper},#A06030)`,border:'none',borderRadius:'0.75rem',padding:'1.1rem',color:'white',fontSize:'1.1rem',fontFamily:'Montserrat,sans-serif',fontWeight:700,letterSpacing:'1px',cursor:'pointer',marginBottom:'0.6rem',boxShadow:'0 4px 20px rgba(201,147,90,0.35)'}}>
            {is_es ? '✨ EMPEZAR MI QUIZ GRATIS — 45s' : '✨ START MY FREE QUIZ — 45s'}
          </button>
          <div style={{fontSize:'0.8rem',color:'rgba(13,61,61,0.4)',fontFamily:'Montserrat,sans-serif'}}>
            {is_es ? 'Sin tarjeta · Cancela cuando quieras' : 'No card · Cancel anytime'}
          </div>
        </div>
      </div>

      {/* TIMELINE RESULTADOS */}
      <div style={{background:teal,padding:'3rem 1.5rem',textAlign:'center'}}>
        <div style={{maxWidth:'500px',margin:'0 auto'}}>
          <div style={{fontFamily:'Montserrat,sans-serif',fontSize:'0.8rem',fontWeight:700,color:copper,letterSpacing:'3px',textTransform:'uppercase',marginBottom:'0.5rem'}}>
            {is_es ? 'Lo que notan las mujeres' : 'What women notice'}
          </div>
          <h2 style={{fontSize:'1.8rem',fontWeight:700,color:'white',marginBottom:'0.5rem'}}>
            {is_es ? 'Resultados reales, semana a semana' : 'Real results, week by week'}
          </h2>
          <p style={{fontSize:'0.9rem',color:'rgba(240,232,220,0.5)',fontStyle:'italic',marginBottom:'2rem',fontFamily:'Montserrat,sans-serif'}}>
            {is_es ? 'Resultados individuales pueden variar.' : 'Individual results may vary.'}
          </p>
          <div style={{display:'flex',flexDirection:'column',gap:'1rem'}}>
            {weeks.map((w,i) => (
              <div key={i} style={{background:'rgba(255,255,255,0.06)',border:`1px solid rgba(201,147,90,${0.3+i*0.15})`,borderLeft:`4px solid ${copper}`,borderRadius:'0 0.75rem 0.75rem 0',padding:'1rem 1.25rem',textAlign:'left',display:'flex',alignItems:'center',gap:'1rem'}}>
                <div style={{fontSize:'2rem',flexShrink:0}}>{w.icon}</div>
                <div>
                  <div style={{fontFamily:'Montserrat,sans-serif',fontSize:'0.75rem',fontWeight:700,color:copper,letterSpacing:'2px',textTransform:'uppercase',marginBottom:'0.25rem'}}>{w.w}</div>
                  <div style={{fontSize:'1.1rem',fontWeight:700,color:'white',marginBottom:'0.2rem'}}>{w.result}</div>
                  <div style={{fontSize:'0.9rem',fontStyle:'italic',color:'rgba(240,232,220,0.6)'}}>{w.sub}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* PROBLEMA */}
      <div style={{background:'white',padding:'3rem 1.5rem',textAlign:'center'}}>
        <div style={{maxWidth:'500px',margin:'0 auto'}}>
          <div style={{fontFamily:'Montserrat,sans-serif',fontSize:'0.8rem',fontWeight:700,color:copper,letterSpacing:'3px',textTransform:'uppercase',marginBottom:'1rem'}}>
            {is_es ? '¿Esto te suena?' : 'Does this sound familiar?'}
          </div>
          <h2 style={{fontSize:'1.8rem',fontWeight:700,marginBottom:'1.5rem',color:teal}}>
            {is_es ? 'No estás rota.' : 'You are not broken.'}
          </h2>
          {(is_es ? [
            'Hambre 2h después de comer aunque hayas comido bien',
            'Antojos de dulce a las 4pm que no puedes controlar',
            'Energía que cae después de comer',
            'Hinchazón constante por las tardes',
            'Comes bien pero sin resultados en la báscula',
          ] : [
            'Hungry again 2h after eating even a full meal',
            'Sweet cravings at 4pm you cannot control',
            'Energy crash after eating',
            'Constant afternoon bloating',
            'Eating well but no results on the scale',
          ]).map((t,i) => (
            <div key={i} style={{display:'flex',alignItems:'flex-start',gap:'0.75rem',marginBottom:'0.6rem',textAlign:'left',background:mint,borderRadius:'0.5rem',padding:'0.75rem 1rem'}}>
              <span style={{color:green,fontWeight:700,flexShrink:0,fontSize:'1.1rem'}}>{'✓'}</span>
              <span style={{fontSize:'1rem',color:teal,lineHeight:1.5}}>{t}</span>
            </div>
          ))}
          <div style={{marginTop:'1.5rem',fontSize:'1.15rem',fontStyle:'italic',color:copper,fontWeight:600,lineHeight:1.5}}>
            {is_es ? '"Tu cuerpo solo necesita las señales correctas."' : '"Your body just needs the right signals."'}
          </div>
        </div>
      </div>

      {/* LENTE ALQUIMICA */}
      <div style={{background:cream,padding:'3rem 1.5rem',textAlign:'center'}}>
        <div style={{maxWidth:'500px',margin:'0 auto'}}>
          <div style={{fontFamily:'Montserrat,sans-serif',fontSize:'0.8rem',fontWeight:700,color:copper,letterSpacing:'3px',textTransform:'uppercase',marginBottom:'0.5rem'}}>
            {is_es ? 'Prueba gratuita — solo una vez' : 'Free trial — one time only'}
          </div>
          <h2 style={{fontSize:'1.8rem',fontWeight:700,color:teal,marginBottom:'0.5rem'}}>
            {'📸 '}{is_es ? 'La Lente Alquímica' : 'The Alchemical Lens'}
          </h2>
          <p style={{fontSize:'1.05rem',fontStyle:'italic',color:'rgba(13,61,61,0.7)',marginBottom:'0.5rem',lineHeight:1.6}}>
            {is_es ? 'Fotografía tu plato ahora mismo. LUMI analiza cómo afecta a tus hormonas — y te lo ajusta — en segundos.' : 'Photograph your food and LUMI analyses how it affects your hormones — in seconds.'}
          </p>
          <p style={{fontSize:'0.95rem',color:copper,fontWeight:600,marginBottom:'1.5rem',fontStyle:'italic'}}>
            {is_es ? '✦ Esto es solo una muestra de lo que LUMI puede hacer por ti cada día.' : 'This is just a part of what Lumera can do for you.'}
          </p>

          {!lenteProbada && !analisis && (
            <div style={{background:'white',border:`1px solid rgba(201,147,90,0.3)`,borderRadius:'1rem',padding:'1.5rem'}}>
              <input type="file" accept="image/*" capture="environment" ref={fileRef} onChange={handleFoto} style={{display:'none'}}/>
              <div style={{fontSize:'3rem',marginBottom:'1rem'}}>🍽️</div>
              <button onClick={() => fileRef.current.click()} disabled={cargando} style={{width:'100%',background:`linear-gradient(135deg,${teal},#1A6B6B)`,border:'none',borderRadius:'0.75rem',padding:'1rem',color:'white',fontSize:'1.05rem',fontFamily:'Montserrat,sans-serif',fontWeight:700,cursor:'pointer',marginBottom:'0.5rem'}}>
                {cargando ? (is_es?'Analizando tu plato...':'Analysing your food...') : (is_es?'📷 📷 Fotografía tu plato — obtén tu análisis gratis':'📷 Photograph my food')}
              </button>
              <div style={{fontSize:'0.8rem',color:'rgba(13,61,61,0.4)',fontFamily:'Montserrat,sans-serif'}}>
                {is_es ? 'Sin registro · Solo una vez · Resultado inmediato' : 'One free trial · No sign up'}
              </div>
            </div>
          )}

          {foto && cargando && (
            <div style={{textAlign:'center',padding:'2rem'}}>
              <img src={foto} alt="tu comida" style={{width:'120px',height:'120px',objectFit:'cover',borderRadius:'0.75rem',border:`2px solid ${copper}`,marginBottom:'1rem',display:'block',margin:'0 auto 1rem'}}/>
              <div style={{fontSize:'1.1rem',fontStyle:'italic',color:teal}}>
                {is_es ? 'LUMI está analizando tu plato...' : 'LUMI is analysing your food...'}
              </div>
            </div>
          )}

          {analisis && (
            <div>
              {foto && <img src={foto} alt="tu comida" style={{width:'120px',height:'120px',objectFit:'cover',borderRadius:'0.75rem',border:`2px solid ${copper}`,margin:'0 auto 1rem',display:'block'}}/>}
              <div style={{background:'white',border:`1px solid rgba(201,147,90,0.3)`,borderLeft:`4px solid ${copper}`,borderRadius:'0 1rem 1rem 0',padding:'1.25rem',textAlign:'left',marginBottom:'1rem'}}>
                <div style={{fontFamily:'Montserrat,sans-serif',fontSize:'0.75rem',fontWeight:700,color:copper,letterSpacing:'2px',textTransform:'uppercase',marginBottom:'0.75rem'}}>{'✦ LUMI dice:'}</div>
                <div style={{fontSize:'1.05rem',color:teal,lineHeight:1.75,fontStyle:'italic'}}>{analisis}</div>
              </div>
              <div style={{background:mint,borderRadius:'0.75rem',padding:'1rem',marginBottom:'1rem',fontSize:'0.95rem',color:teal,fontStyle:'italic'}}>
                {is_es ? '✦ Esto es una muestra. Con Lumera, LUMI analiza tu comida cada dia y adapta tu plan semanal a tus hormonas reales.' : '✦ This is a sample. With Lumera, LUMI analyses your food every day and adapts your weekly plan to your real hormones.'}
              </div>
              <button onClick={() => router.push('/quiz')} style={{width:'100%',background:`linear-gradient(135deg,${copper},#A06030)`,border:'none',borderRadius:'0.75rem',padding:'1rem',color:'white',fontSize:'1.05rem',fontFamily:'Montserrat,sans-serif',fontWeight:700,cursor:'pointer'}}>
                {is_es ? '✨ Quiero mi plan personalizado completo' : '✨ I want my complete personalised plan'}
              </button>
            </div>
          )}

          {lenteProbada && !analisis && (
            <div style={{background:'white',border:`1px solid rgba(201,147,90,0.3)`,borderRadius:'1rem',padding:'1.5rem'}}>
              <div style={{fontSize:'1.05rem',fontStyle:'italic',color:teal,marginBottom:'1rem',lineHeight:1.6}}>
                {is_es ? 'Ya has usado tu prueba gratuita de la Lente Alquímica. Empieza tu plan completo personalizado para análisis ilimitados.' : 'You have used your free Alchemical Lens trial. Start your full personalised plan for unlimited analyses.'}
              </div>
              <button onClick={() => router.push('/quiz')} style={{width:'100%',background:`linear-gradient(135deg,${copper},#A06030)`,border:'none',borderRadius:'0.75rem',padding:'1rem',color:'white',fontSize:'1.05rem',fontFamily:'Montserrat,sans-serif',fontWeight:700,cursor:'pointer'}}>
                {is_es ? '✨ Empezar mi plan gratis — 3 dias' : '✨ Start my free plan — 3 days'}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* LO QUE LUMERA HACE - DESPLEGABLES */}
      <div style={{background:'white',padding:'3rem 1.5rem'}}>
        <div style={{maxWidth:'500px',margin:'0 auto'}}>
          <div style={{fontFamily:'Montserrat,sans-serif',fontSize:'0.8rem',fontWeight:700,color:copper,letterSpacing:'3px',textTransform:'uppercase',marginBottom:'0.5rem',textAlign:'center'}}>
            {is_es ? 'Dentro de Lumera' : 'Inside Lumera'}
          </div>
          <h2 style={{fontSize:'1.8rem',fontWeight:700,color:teal,marginBottom:'1.5rem',textAlign:'center'}}>
            {is_es ? 'Todo lo que necesitas, en un lugar' : 'Everything you need in one place'}
          </h2>
          {sections.map((sec) => (
            <div key={sec.id} style={{marginBottom:'0.75rem'}}>
              <div onClick={() => setOpenSection(openSection===sec.id?null:sec.id)} style={{background:cream,border:`1px solid rgba(201,147,90,0.25)`,borderLeft:`3px solid ${openSection===sec.id?copper:'rgba(201,147,90,0.4)'}`,borderRadius:'0 0.75rem 0.75rem 0',padding:'1rem 1.1rem',cursor:'pointer',display:'flex',justifyContent:'space-between',alignItems:'center'}}>
                <div style={{fontSize:'1.05rem',fontWeight:700,color:teal}}>{sec.emoji} &nbsp;{sec.title}</div>
                <div style={{color:copper,fontSize:'1.3rem',fontWeight:300,flexShrink:0}}>{openSection===sec.id?'−':'+'}</div>
              </div>
              {openSection===sec.id && (
                <div style={{background:'rgba(234,245,239,0.5)',border:`1px solid rgba(201,147,90,0.15)`,borderTop:'none',borderRadius:'0 0 0.75rem 0.75rem',padding:'1rem 1.1rem'}}>
                  <div style={{fontSize:'1rem',fontStyle:'italic',color:'rgba(13,61,61,0.8)',lineHeight:1.75}}>{sec.body}</div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* 3 OPCIONES */}
      <div style={{background:cream,padding:'3rem 1.5rem',textAlign:'center'}}>
        <div style={{maxWidth:'500px',margin:'0 auto'}}>
          <div style={{fontFamily:'Montserrat,sans-serif',fontSize:'0.8rem',fontWeight:700,color:copper,letterSpacing:'3px',textTransform:'uppercase',marginBottom:'0.5rem'}}>
            {is_es ? 'Elige tu siguiente paso' : 'Choose your next step'}
          </div>
          <h2 style={{fontSize:'1.8rem',fontWeight:700,color:teal,marginBottom:'1.5rem'}}>
            {is_es ? '3 formas de empezar hoy' : '3 ways to start today'}
          </h2>
          {[
            { emoji:'📥', badge:is_es?'GRATIS':'FREE', title:is_es?'3 Hábitos GLP-1 Naturales':'3 Natural GLP-1 Habits', sub:is_es?'Empieza hoy. Energía estable esta semana.':'Start today. Stable energy this week.', btn:is_es?'Descargar gratis':'Download free', color:green, action:()=>window.open(lang==='es'?'/guia-glp1-es.pdf':'/guia-glp1-en.pdf','_blank') },
            { emoji:'👑', badge:'€6.99', title:is_es?'Plan Completo 7 Dias':'Complete 7-Day Plan', sub:is_es?'21 comidas · Lista compra · Anti-antojos':'21 meals · Shopping list · Cravings reset', btn:is_es?'Obtener €6.99':'Get €6.99', color:`linear-gradient(135deg,${copper},#A06030)`, action:()=>window.open(is_es?'https://getlumera.gumroad.com/l/yndiyy':'https://getlumera.gumroad.com/l/hkbpn','_blank') },
            { emoji:'✨', badge:is_es?'3 DIAS GRATIS':'3 DAYS FREE', title:is_es?'Transformación Completa':'Complete Transformation', sub:is_es?'Plan personalizado · LUMI · Lente · Seguimiento':'Personalised plan · LUMI · Lens · Tracking', btn:is_es?'Empezar gratis':'Start free', color:`linear-gradient(135deg,#1A6B6B,${teal})`, action:()=>router.push('/quiz') },
          ].map((opt,i) => (
            <div key={i} style={{background:'white',border:`1px solid rgba(201,147,90,0.25)`,borderRadius:'1rem',padding:'1.25rem',marginBottom:'1rem',position:'relative',textAlign:'left',boxShadow:'0 2px 12px rgba(13,61,61,0.06)'}}>
              <div style={{position:'absolute',top:'-10px',right:'1rem',background:i===1?`linear-gradient(135deg,${copper},#A06030)`:i===0?green:'#1A6B6B',color:'white',fontSize:'0.7rem',fontWeight:700,padding:'2px 10px',borderRadius:'20px',fontFamily:'Montserrat,sans-serif',letterSpacing:'1px'}}>{opt.badge}</div>
              <div style={{fontSize:'1.15rem',fontWeight:700,color:teal,marginBottom:'0.3rem'}}>{opt.emoji} &nbsp;{opt.title}</div>
              <div style={{fontSize:'0.95rem',fontStyle:'italic',color:'rgba(13,61,61,0.6)',marginBottom:'0.85rem',lineHeight:1.5}}>{opt.sub}</div>
              <button onClick={opt.action} style={{width:'100%',background:opt.color,border:'none',borderRadius:'0.5rem',padding:'0.8rem',color:'white',fontSize:'0.95rem',fontFamily:'Montserrat,sans-serif',fontWeight:700,cursor:'pointer'}}>{opt.btn}</button>
            </div>
          ))}
        </div>
      </div>

      {/* OBJECIONES */}
      <div style={{background:'white',padding:'3rem 1.5rem',textAlign:'center'}}>
        <div style={{maxWidth:'500px',margin:'0 auto'}}>
          <div style={{fontFamily:'Montserrat,sans-serif',fontSize:'0.8rem',fontWeight:700,color:copper,letterSpacing:'3px',textTransform:'uppercase',marginBottom:'1rem'}}>
            {is_es ? 'Por qué Lumera funciona' : 'Why Lumera works'}
          </div>
          {(is_es?[
            'Sin dieta ni pastillas — solo biología real',
            'Se adapta a tu vida real, no al revés',
            'Resultados desde la semana 1',
            'Cancela cuando quieras, sin compromiso',
            '100% privacidad de tus datos',
          ]:[
            'No diet or pills — just real biology',
            'Adapts to your real life, not the other way around',
            'Results from week 1',
            'Cancel anytime, no commitment',
            '100% data privacy',
          ]).map((t,i) => (
            <div key={i} style={{display:'flex',alignItems:'center',gap:'0.75rem',marginBottom:'0.75rem',textAlign:'left',padding:'0.75rem 0',borderBottom:`1px solid rgba(201,147,90,0.1)`}}>
              <span style={{color:green,fontWeight:700,fontSize:'1.1rem',flexShrink:0}}>{'✓'}</span>
              <span style={{fontSize:'1.05rem',color:teal}}>{t}</span>
            </div>
          ))}
        </div>
      </div>

      {/* CTA FINAL */}
      <div style={{background:`linear-gradient(135deg,${teal},#1A6B6B)`,padding:'3.5rem 1.5rem',textAlign:'center'}}>
        <div style={{maxWidth:'500px',margin:'0 auto'}}>
          <div style={{fontSize:'2rem',fontWeight:700,color:'white',lineHeight:1.2,marginBottom:'0.75rem'}}>
            {is_es ? 'Tu cuerpo es único.\nLumera lo sabe.' : 'Your body is unique.\nLumera knows it.'}
          </div>
          <div style={{fontSize:'1.1rem',fontStyle:'italic',color:'rgba(240,232,220,0.7)',marginBottom:'2rem',lineHeight:1.6}}>
            {is_es ? 'Empieza a entenderte hoy.' : 'Start understanding yourself today.'}
          </div>
          <button onClick={() => router.push('/quiz')} style={{width:'100%',maxWidth:'400px',background:`linear-gradient(135deg,${copper},#A06030)`,border:'none',borderRadius:'0.75rem',padding:'1.15rem',color:'white',fontSize:'1.15rem',fontFamily:'Montserrat,sans-serif',fontWeight:700,letterSpacing:'1px',cursor:'pointer',marginBottom:'0.75rem',boxShadow:'0 4px 20px rgba(201,147,90,0.4)'}}>
            {is_es ? '✨ EMPEZAR MI QUIZ GRATIS — 45s' : '✨ START MY FREE QUIZ — 45s'}
          </button>
          <div style={{fontSize:'0.8rem',color:'rgba(240,232,220,0.35)',fontFamily:'Montserrat,sans-serif',marginBottom:'1rem'}}>
            {is_es ? 'Sin tarjeta · Cancela cuando quieras' : 'No card · Cancel anytime'}
          </div>
          <div style={{fontSize:'0.8rem',color:'rgba(240,232,220,0.3)',fontStyle:'italic',maxWidth:'360px',margin:'0 auto',lineHeight:1.5}}>
            {is_es ? 'Resultados individuales pueden variar. Lumera no diagnostica ni sustituye consejo medico profesional.' : 'Individual results may vary. Lumera does not diagnose or replace professional medical advice.'}
          </div>
          <div style={{marginTop:'2rem',fontSize:'0.85rem',color:'rgba(201,147,90,0.4)',fontStyle:'italic',letterSpacing:'0.1em'}}>
            {'✦ Lumera — Decoding Women\'s Biology'}
          </div>
        </div>
      </div>

    </div>
  );
}
