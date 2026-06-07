'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://pyekwpmbdnmglrjieexc.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB5ZWt3cG1iZG5tZ2xyamllZXhjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjU0ODM0OTgsImV4cCI6MjA4MTA1OTQ5OH0.zQl7GF3E6BhDqW3bEMixAbdDcOsW8BsFOBeAGa-5bzY';

const misionDelDia = (sintoma, is_es, nombre) => {
  const misiones = {
    'Siento un cansancio que no se va': {
      titulo: is_es ? 'Recargar tu energia' : 'Recharge your energy',
      pasos: is_es ? [
        { icon: 'Desayuna antes de las 9am con proteina — tu cortisol necesita combustible al despertar', time: 'Manana' },
        { icon: '15 minutos de luz natural al despertar — activa tu ritmo circadiano', time: 'Manana' },
        { icon: 'Evita el cafe despues de las 2pm — interfiere con tu cortisol nocturno', time: 'Tarde' },
      ] : [
        { icon: 'Eat breakfast before 9am with protein — your cortisol needs fuel at wake-up', time: 'Morning' },
        { icon: '15 minutes of natural light after waking — activates your circadian rhythm', time: 'Morning' },
        { icon: 'Avoid coffee after 2pm — it interferes with your night cortisol', time: 'Afternoon' },
      ]
    },
    'Mi peso sube aunque no haya cambiado nada': {
      titulo: is_es ? 'Equilibrar tu metabolismo' : 'Balance your metabolism',
      pasos: is_es ? [
        { icon: 'Proteina en cada comida — frena la perdida de masa muscular que acelera el metabolismo', time: 'Todo el dia' },
        { icon: 'Camina 20 minutos despues de comer — reduce el pico de insulina postcomida', time: 'Mediodia' },
        { icon: 'Cena antes de las 8pm — tu metabolismo baja por la noche', time: 'Noche' },
      ] : [
        { icon: 'Protein in every meal — prevents muscle loss that speeds up metabolism', time: 'All day' },
        { icon: 'Walk 20 minutes after eating — reduces post-meal insulin spike', time: 'Midday' },
        { icon: 'Dinner before 8pm — your metabolism slows at night', time: 'Evening' },
      ]
    },
    'Me despierto a mitad de la noche': {
      titulo: is_es ? 'Recuperar tu sueno profundo' : 'Recover your deep sleep',
      pasos: is_es ? [
        { icon: 'Cena ligera y baja en carbohidratos — los picos de glucosa nocturna te despiertan', time: 'Noche' },
        { icon: 'Magnesio antes de dormir — relaja el sistema nervioso y reduce el cortisol nocturno', time: 'Noche' },
        { icon: 'Temperatura fresca en el dormitorio 18-20 grados — clave para el sueno profundo', time: 'Noche' },
      ] : [
        { icon: 'Light low-carb dinner — night glucose spikes wake you up', time: 'Evening' },
        { icon: 'Magnesium before bed — relaxes the nervous system and reduces night cortisol', time: 'Evening' },
        { icon: 'Cool bedroom 18-20 degrees — key for deep sleep', time: 'Night' },
      ]
    },
    'Me cuesta concentrarme — neblina mental': {
      titulo: is_es ? 'Despejar tu mente' : 'Clear your mind',
      pasos: is_es ? [
        { icon: 'Omega-3 diario — el cerebro lo necesita para producir neurotransmisores', time: 'Manana' },
        { icon: 'Hidratate — la deshidratacion es la causa mas comun de niebla mental', time: 'Todo el dia' },
        { icon: 'Pausa de 5 minutos cada hora — tu cortisol baja y el foco se recupera', time: 'Trabajo' },
      ] : [
        { icon: 'Daily Omega-3 — your brain needs it to produce neurotransmitters', time: 'Morning' },
        { icon: 'Stay hydrated — dehydration is the most common cause of brain fog', time: 'All day' },
        { icon: '5-minute break every hour — your cortisol drops and focus recovers', time: 'Work' },
      ]
    },
    'Mi estado de animo es una montana rusa': {
      titulo: is_es ? 'Estabilizar tu animo' : 'Stabilise your mood',
      pasos: is_es ? [
        { icon: 'No saltes el desayuno — la hipoglucemia dispara la irritabilidad hormonal', time: 'Manana' },
        { icon: 'Reduce el azucar procesado — provoca picos de insulina que afectan al animo', time: 'Todo el dia' },
        { icon: '10 minutos de movimiento suave — libera endorfinas y regula el cortisol', time: 'Cuando necesites' },
      ] : [
        { icon: 'Do not skip breakfast — low blood sugar triggers hormonal irritability', time: 'Morning' },
        { icon: 'Reduce processed sugar — causes insulin spikes that affect mood', time: 'All day' },
        { icon: '10 minutes of gentle movement — releases endorphins and regulates cortisol', time: 'When needed' },
      ]
    },
  };
  return misiones[sintoma] || {
    titulo: is_es ? 'Tu plan de hoy' : 'Your plan for today',
    pasos: is_es ? [
      { icon: 'Registra como te sientes hoy — LUMI aprende de ti cada dia', time: 'Ahora' },
      { icon: 'Revisa tu menu de hoy en la seccion Nutricion', time: 'Manana' },
      { icon: 'Habla con LUMI si tienes alguna duda o sintoma nuevo', time: 'Cuando quieras' },
    ] : [
      { icon: 'Log how you feel today — LUMI learns from you every day', time: 'Now' },
      { icon: 'Check your menu in the Nutrition section', time: 'Morning' },
      { icon: 'Talk to LUMI if you have any questions or new symptoms', time: 'Anytime' },
    ]
  };
};

const getHora = () => {
  const h = new Date().getHours();
  if (h < 12) return 'manana';
  if (h < 19) return 'tarde';
  return 'noche';
};

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [completados, setCompletados] = useState([]);
  const [cartaRevelada, setCartaRevelada] = useState(false);
  const [cartaMensaje, setCartaMensaje] = useState('');
  const [visible, setVisible] = useState(false);
  const [pais, setPais] = useState('');
  const router = useRouter();

  const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

  useEffect(() => {
    const init = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) { router.push('/start'); return; }

      const { data: profiles } = await supabase
        .from('users')
        .select('*')
        .eq('id', session.user.id)
        .limit(1);

      const profile = profiles?.[0];
      setUser({
        nombre: profile?.profile_name || session.user.email?.split('@')[0] || 'amiga',
        sintoma: profile?.sintoma_principal || '',
        objetivo: profile?.objetivo || '',
        createdAt: profile?.created_at || session.user.created_at,
        isPremium: ['active','paid'].includes(profile?.subscription_status),
        email: session.user.email,
        lang: profile?.language || 'es',
      });

      // Detectar pais por IP
      try {
        const geo = await fetch('https://ipapi.co/json/');
        const geoData = await geo.json();
        setPais(geoData.country_name || '');
      } catch(e) {}

      // Cargar completados del dia
      const hoy = new Date().toDateString();
      const saved = localStorage.getItem('lumera_completados_' + hoy);
      if (saved) setCompletados(JSON.parse(saved));

      setLoading(false);
      setTimeout(() => setVisible(true), 100);
    };
    init();
  }, []);

  const getDiasTrialRestantes = () => {
    if (!user?.createdAt) return 3;
    const inicio = new Date(user.createdAt);
    const hoy = new Date();
    const diff = Math.floor((hoy - inicio) / (1000 * 60 * 60 * 24));
    return Math.max(0, 3 - diff);
  };

  const getDiaDeTrial = () => {
    if (!user?.createdAt) return 1;
    const inicio = new Date(user.createdAt);
    const hoy = new Date();
    const diff = Math.floor((hoy - inicio) / (1000 * 60 * 60 * 24));
    return Math.min(diff + 1, 3);
  };

  const toggleCompletado = (i) => {
    const nuevo = completados.includes(i) ? completados.filter(x=>x!==i) : [...completados, i];
    setCompletados(nuevo);
    const hoy = new Date().toDateString();
    localStorage.setItem('lumera_completados_' + hoy, JSON.stringify(nuevo));
  };

  const revelarCarta = async () => {
    if (cartaRevelada) return;
    setCartaRevelada(true);
    const is_es = user?.lang === 'es';
    const cartas = is_es ? [
      'Tu cuerpo no esta roto. Esta hablando. Escuchalo hoy con curiosidad, no con miedo.',
      'Cada pequeno habito que cuidas hoy es una inversion en la mujer que seras manana.',
      'Los cambios mas profundos no se ven en la bascula. Se sienten en la energia del dia.',
      'Tu ciclo no es una debilidad. Es informacion. Y hoy tienes mas de la que crees.',
      'Descansar tambien es progresar. Tu cuerpo consolida los cambios mientras duermes.',
    ] : [
      'Your body is not broken. It is speaking. Listen today with curiosity, not fear.',
      'Every small habit you care for today is an investment in the woman you will be tomorrow.',
      'The deepest changes are not seen on the scale. They are felt in the energy of the day.',
      'Your cycle is not a weakness. It is information. And today you have more than you think.',
      'Resting is also progress. Your body consolidates changes while you sleep.',
    ];
    setCartaMensaje(cartas[Math.floor(Math.random() * cartas.length)]);
  };

  if (loading) return (
    <div style={{minHeight:'100vh',background:'linear-gradient(135deg,#FBF7F0,#f0e8d8)',display:'flex',alignItems:'center',justifyContent:'center'}}>
      <p style={{fontFamily:"'Cormorant Garamond',Georgia,serif",fontSize:'1.2rem',color:'#C9935A',fontStyle:'italic'}}>Iniciando tu espacio...</p>
    </div>
  );

  const is_es = user?.lang === 'es';
  const mision = misionDelDia(user?.sintoma, is_es, user?.nombre);
  const diasRestantes = getDiasTrialRestantes();
  const diaActual = getDiaDeTrial();
  const progreso = Math.round((completados.length / Math.max(mision.pasos.length, 1)) * 100);
  const hora = getHora();

  const saludoHora = is_es
    ? hora === 'manana' ? 'Buenos dias' : hora === 'tarde' ? 'Buenas tardes' : 'Buenas noches'
    : hora === 'manana' ? 'Good morning' : hora === 'tarde' ? 'Good afternoon' : 'Good evening';

  return (
    <>
      <style dangerouslySetInnerHTML={{__html:`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;0,700;1,400&family=Montserrat:wght@300;400;500;600;700&display=swap');
        *{box-sizing:border-box;margin:0;padding:0;}
        .fade{opacity:0;transform:translateY(16px);transition:opacity 0.6s ease,transform 0.6s ease;}
        .fade.in{opacity:1;transform:translateY(0);}
        .d1{transition-delay:0.05s;} .d2{transition-delay:0.15s;} .d3{transition-delay:0.25s;} .d4{transition-delay:0.35s;} .d5{transition-delay:0.45s;} .d6{transition-delay:0.55s;}
        .paso-card{display:flex;align-items:flex-start;gap:0.85rem;padding:0.9rem 1rem;background:rgba(255,255,255,0.7);border:1.5px solid rgba(201,147,90,0.15);border-radius:0.75rem;margin-bottom:0.6rem;cursor:pointer;transition:all 0.2s ease;}
        .paso-card:hover{border-color:rgba(201,147,90,0.4);}
        .paso-card.done{background:rgba(201,147,90,0.08);border-color:rgba(201,147,90,0.4);}
        .check-circle{width:24px;height:24px;border-radius:50%;border:2px solid rgba(201,147,90,0.4);flex-shrink:0;display:flex;align-items:center;justify-content:center;transition:all 0.2s ease;margin-top:2px;}
        .check-circle.done{background:#C9935A;border-color:#C9935A;color:white;}
        .pilar-card{background:rgba(255,255,255,0.8);border:1px solid rgba(201,147,90,0.15);border-radius:1rem;padding:1.1rem;text-align:center;cursor:pointer;transition:all 0.2s ease;}
        .pilar-card:hover{border-color:#C9935A;transform:translateY(-2px);}
        .btn-premium{width:100%;background:linear-gradient(135deg,#C9935A,#A06030);border:none;border-radius:0.75rem;padding:1rem;color:white;font-size:1rem;font-family:Montserrat,sans-serif;font-weight:700;cursor:pointer;transition:transform 0.2s ease;}
        .btn-premium:hover{transform:translateY(-2px);}
        .nav-item{display:flex;flex-direction:column;align-items:center;gap:3px;cursor:pointer;padding:0.5rem;min-width:50px;transition:opacity 0.2s;}
        .nav-item:hover{opacity:0.8;}
      `}}/>

      <div style={{minHeight:'100vh',background:'linear-gradient(180deg,#FBF7F0 0%,#f0e8d8 100%)',fontFamily:"'Cormorant Garamond',Georgia,serif",paddingBottom:'80px'}}>

        {/* HEADER */}
        <div style={{background:'rgba(255,255,255,0.92)',borderBottom:'1px solid rgba(201,147,90,0.15)',backdropFilter:'blur(10px)',padding:'0.75rem 1.25rem',display:'flex',alignItems:'center',justifyContent:'space-between',position:'sticky',top:0,zIndex:100}}>
          <div style={{display:'flex',alignItems:'center',gap:'0.5rem'}}>
            <span style={{fontSize:'1.1rem',fontWeight:700,color:'#0D3D3D',fontFamily:"'Cormorant Garamond',serif"}}>✦ Lumera</span>
            {pais && <span style={{fontSize:'0.65rem',color:'rgba(13,61,61,0.4)',fontFamily:'Montserrat,sans-serif'}}>{pais}</span>}
          </div>
          {!user?.isPremium && (
            <div style={{display:'flex',alignItems:'center',gap:'0.75rem'}}>
              <span style={{fontSize:'0.7rem',fontFamily:'Montserrat,sans-serif',color:'rgba(13,61,61,0.5)'}}>
                {is_es ? `Dia ${diaActual} de 3` : `Day ${diaActual} of 3`}
              </span>
              <button onClick={()=>router.push('/lumera')} className="btn-premium" style={{width:'auto',padding:'0.4rem 0.85rem',fontSize:'0.75rem'}}>
                {is_es ? '✦ Premium' : '✦ Premium'}
              </button>
            </div>
          )}
        </div>

        <div style={{maxWidth:'520px',margin:'0 auto',padding:'1.25rem 1.25rem 0'}}>

          {/* SALUDO */}
          <div className={`fade d1 ${visible?'in':''}`} style={{marginBottom:'1.25rem'}}>
            <p style={{fontSize:'0.8rem',fontFamily:'Montserrat,sans-serif',color:'rgba(13,61,61,0.45)',marginBottom:'0.15rem'}}>{saludoHora}</p>
            <h1 style={{fontSize:'clamp(1.6rem,4vw,2rem)',fontWeight:700,color:'#0D3D3D',lineHeight:1.15}}>
              {user?.nombre} 
              {!user?.isPremium && <span style={{fontSize:'0.8rem',fontFamily:'Montserrat,sans-serif',fontWeight:400,color:'#C9935A',marginLeft:'0.5rem'}}>
                · {is_es ? `${diasRestantes}d restantes` : `${diasRestantes}d left`}
              </span>}
            </h1>
          </div>

          {/* MISION DEL DIA */}
          <div className={`fade d2 ${visible?'in':''}`} style={{background:'rgba(255,255,255,0.88)',border:'1px solid rgba(201,147,90,0.2)',borderRadius:'1.25rem',backdropFilter:'blur(8px)',padding:'1.25rem',marginBottom:'1.25rem',boxShadow:'0 2px 16px rgba(201,147,90,0.08)'}}>
            <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:'1rem'}}>
              <div>
                <div style={{fontFamily:'Montserrat,sans-serif',fontSize:'0.65rem',fontWeight:700,color:'#C9935A',letterSpacing:'2px',textTransform:'uppercase',marginBottom:'0.25rem'}}>
                  {is_es ? 'Tu mision de hoy' : 'Your mission today'}
                </div>
                <div style={{fontSize:'1.1rem',fontWeight:600,color:'#0D3D3D'}}>{mision.titulo}</div>
              </div>
              <div style={{textAlign:'right'}}>
                <div style={{fontSize:'1.4rem',fontWeight:700,color:progreso===100?'#2A7A4A':'#C9935A'}}>{progreso}%</div>
                <div style={{fontSize:'0.65rem',fontFamily:'Montserrat,sans-serif',color:'rgba(13,61,61,0.4)'}}>{is_es?'completado':'done'}</div>
              </div>
            </div>

            {/* Barra progreso */}
            <div style={{height:'4px',background:'rgba(201,147,90,0.15)',borderRadius:'99px',marginBottom:'1rem',overflow:'hidden'}}>
              <div style={{height:'100%',background:'linear-gradient(90deg,#C9935A,#A06030)',borderRadius:'99px',width:progreso+'%',transition:'width 0.5s ease'}}/>
            </div>

            {/* Pasos */}
            {mision.pasos.map((paso, i) => (
              <div key={i} className={`paso-card ${completados.includes(i)?'done':''}`} onClick={()=>toggleCompletado(i)}>
                <div className={`check-circle ${completados.includes(i)?'done':''}`}>
                  {completados.includes(i) && <span style={{fontSize:'0.75rem'}}>✓</span>}
                </div>
                <div style={{flex:1}}>
                  <div style={{fontSize:'0.95rem',color:'#0D3D3D',lineHeight:1.5,textDecoration:completados.includes(i)?'line-through':'none',color:completados.includes(i)?'rgba(13,61,61,0.4)':'#0D3D3D'}}>{paso.icon}</div>
                  <div style={{fontSize:'0.7rem',fontFamily:'Montserrat,sans-serif',color:'#C9935A',marginTop:'0.2rem',fontWeight:600}}>{paso.time}</div>
                </div>
              </div>
            ))}

            {progreso === 100 && (
              <div style={{textAlign:'center',padding:'0.75rem',background:'rgba(42,122,74,0.08)',borderRadius:'0.75rem',marginTop:'0.5rem'}}>
                <span style={{fontSize:'1rem',color:'#2A7A4A',fontWeight:600}}>
                  {is_es ? '✦ Mision completada hoy. LUMI lo tiene en cuenta.' : '✦ Mission completed today. LUMI takes note.'}
                </span>
              </div>
            )}
          </div>

          {/* COMO TE SIENTES HOY */}
          <div className={`fade d3 ${visible?'in':''}`} style={{background:'rgba(255,255,255,0.88)',border:'1px solid rgba(201,147,90,0.2)',borderRadius:'1.25rem',backdropFilter:'blur(8px)',padding:'1.25rem',marginBottom:'1.25rem'}}>
            <div style={{fontFamily:'Montserrat,sans-serif',fontSize:'0.65rem',fontWeight:700,color:'#C9935A',letterSpacing:'2px',textTransform:'uppercase',marginBottom:'0.75rem'}}>
              {is_es ? 'Como te sientes ahora?' : 'How do you feel right now?'}
            </div>
            <div style={{display:'flex',gap:'0.5rem',flexWrap:'wrap'}}>
              {(is_es ? [
                {emoji:'⚡',label:'Con energia'},
                {emoji:'😴',label:'Cansada'},
                {emoji:'🌫️',label:'Con niebla'},
                {emoji:'😤',label:'Irritable'},
                {emoji:'🌟',label:'Bien'},
              ] : [
                {emoji:'⚡',label:'Energetic'},
                {emoji:'😴',label:'Tired'},
                {emoji:'🌫️',label:'Foggy'},
                {emoji:'😤',label:'Irritable'},
                {emoji:'🌟',label:'Good'},
              ]).map((s,i) => (
                <button key={i} onClick={()=>router.push('/lumera')} style={{background:'rgba(201,147,90,0.06)',border:'1px solid rgba(201,147,90,0.2)',borderRadius:'99px',padding:'0.4rem 0.75rem',fontSize:'0.85rem',cursor:'pointer',fontFamily:"'Cormorant Garamond',serif",color:'#0D3D3D',display:'flex',alignItems:'center',gap:'0.35rem',transition:'all 0.2s ease'}}>
                  {s.emoji} {s.label}
                </button>
              ))}
            </div>
          </div>

          {/* GRID 4 PILARES */}
          <div className={`fade d4 ${visible?'in':''}`} style={{marginBottom:'1.25rem'}}>
            <div style={{fontFamily:'Montserrat,sans-serif',fontSize:'0.65rem',fontWeight:700,color:'rgba(13,61,61,0.4)',letterSpacing:'2px',textTransform:'uppercase',marginBottom:'0.75rem'}}>
              {is_es ? 'Tu espacio' : 'Your space'}
            </div>
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'0.75rem'}}>
              {(is_es ? [
                {img:'/images/nutri_huevo.png',title:'Nutrición',sub:'Tu menú de hoy',route:'/lumera'},
                {img:'/images/lente_alquimica.png',title:'Lente Alquímica',sub:'Analiza tu plato',route:'/lumera'},
                {img:'/images/ejer_fuerza.png',title:'Ejercicio',sub:'Movimiento a tu medida',route:'/lumera'},
                {img:'/images/lumi.png',title:'LUMI',sub:'Tu espacio seguro',route:'/lumera'},
              ] : [
                {img:'/images/nutri_huevo.png',title:'Nutrition',sub:'Your menu today',route:'/lumera'},
                {img:'/images/lente_alquimica.png',title:'Alchemical Lens',sub:'Analyse your plate',route:'/lumera'},
                {img:'/images/ejer_fuerza.png',title:'Exercise',sub:'Movement your way',route:'/lumera'},
                {img:'/images/lumi.png',title:'LUMI',sub:'Your safe space',route:'/lumera'},
              ]).map((p,i) => (
                <div key={i} className="pilar-card" onClick={()=>router.push(p.route)}>
                  <img src={p.img} alt={p.title} style={{width:'56px',height:'56px',objectFit:'cover',borderRadius:'50%',marginBottom:'0.5rem'}} onError={e=>{e.target.style.display='none'}}/>
                  <div style={{fontSize:'1rem',fontWeight:600,color:'#0D3D3D',marginBottom:'0.15rem'}}>{p.title}</div>
                  <div style={{fontSize:'0.75rem',fontFamily:'Montserrat,sans-serif',color:'rgba(13,61,61,0.45)'}}>{p.sub}</div>
                </div>
              ))}
            </div>
          </div>

          {/* CARTA DEL DIA */}
          <div className={`fade d5 ${visible?'in':''}`} style={{marginBottom:'1.25rem'}}>
            <div style={{fontFamily:'Montserrat,sans-serif',fontSize:'0.65rem',fontWeight:700,color:'rgba(13,61,61,0.4)',letterSpacing:'2px',textTransform:'uppercase',marginBottom:'0.75rem'}}>
              {is_es ? 'Tu carta de hoy' : 'Your card today'}
            </div>
            {!cartaRevelada ? (
              <div onClick={revelarCarta} style={{background:'linear-gradient(135deg,#6B3F6B,#4A2550)',borderRadius:'1.25rem',padding:'2rem',textAlign:'center',cursor:'pointer',boxShadow:'0 4px 20px rgba(107,63,107,0.25)',transition:'transform 0.2s ease'}}>
                <div style={{fontSize:'2.5rem',marginBottom:'0.75rem'}}>🌸</div>
                <div style={{fontSize:'1.1rem',fontWeight:600,color:'white',marginBottom:'0.25rem'}}>{is_es?'Carta del Dia':'Card of the Day'}</div>
                <div style={{fontSize:'0.85rem',fontStyle:'italic',color:'rgba(255,255,255,0.6)',fontFamily:'Montserrat,sans-serif'}}>{is_es?'Toca para revelar':'Tap to reveal'}</div>
              </div>
            ) : (
              <div style={{background:'linear-gradient(135deg,#6B3F6B,#4A2550)',borderRadius:'1.25rem',padding:'1.75rem',boxShadow:'0 4px 20px rgba(107,63,107,0.25)'}}>
                <div style={{fontSize:'1.5rem',marginBottom:'0.75rem',textAlign:'center'}}>✦</div>
                <p style={{fontSize:'1.05rem',lineHeight:1.75,fontStyle:'italic',color:'rgba(255,255,255,0.9)',textAlign:'center',marginBottom:'1.25rem'}}>{cartaMensaje}</p>
                {!user?.isPremium && (
                  <button className="btn-premium" onClick={()=>router.push('/lumera')} style={{fontSize:'0.85rem',padding:'0.75rem'}}>
                    {is_es ? '✦ Carta completa + plan — Premium' : '✦ Full card + plan — Premium'}
                  </button>
                )}
              </div>
            )}
          </div>

          {/* BANNER PREMIUM */}
          {!user?.isPremium && diasRestantes <= 1 && (
            <div className={`fade d6 ${visible?'in':''}`} style={{background:'linear-gradient(135deg,rgba(201,147,90,0.12),rgba(160,96,48,0.08))',border:'1px solid rgba(201,147,90,0.3)',borderRadius:'1.25rem',padding:'1.5rem',marginBottom:'1.25rem',textAlign:'center'}}>
              <div style={{fontSize:'1.1rem',fontWeight:700,color:'#0D3D3D',marginBottom:'0.5rem'}}>
                {is_es ? 'Tu prueba termina pronto' : 'Your trial ends soon'}
              </div>
              <p style={{fontSize:'0.9rem',fontStyle:'italic',color:'rgba(13,61,61,0.6)',marginBottom:'1rem',lineHeight:1.6}}>
                {is_es ? 'No pierdas el acceso a LUMI, tu plan y la Lente Alquimica.' : 'Do not lose access to LUMI, your plan and the Alchemical Lens.'}
              </p>
              <button className="btn-premium" onClick={()=>router.push('/lumera')}>
                {is_es ? '✦ Continuar con Premium' : '✦ Continue with Premium'}
              </button>
              <p style={{fontSize:'0.72rem',fontFamily:'Montserrat,sans-serif',color:'rgba(13,61,61,0.35)',marginTop:'0.5rem'}}>
                {is_es ? 'Tu cuerpo merece seguimiento real.' : 'Your body deserves real tracking.'}
              </p>
            </div>
          )}

        </div>

        {/* NAV INFERIOR */}
        <div style={{position:'fixed',bottom:0,left:0,right:0,background:'rgba(255,255,255,0.92)',borderTop:'1px solid rgba(201,147,90,0.15)',backdropFilter:'blur(10px)',padding:'0.5rem 0',display:'flex',justifyContent:'space-around',zIndex:100}}>
          {(is_es ? [
            {icon:'🏠',label:'Inicio',route:'/dashboard'},
            {icon:'🥗',label:'Nutricion',route:'/lumera'},
            {icon:'📊',label:'Sintomas',route:'/lumera'},
            {icon:'🤝',label:'LUMI',route:'/lumera'},
            {icon:'👑',label:'Premium',route:'/lumera'},
          ] : [
            {icon:'🏠',label:'Home',route:'/dashboard'},
            {icon:'🥗',label:'Nutrition',route:'/lumera'},
            {icon:'📊',label:'Symptoms',route:'/lumera'},
            {icon:'🤝',label:'LUMI',route:'/lumera'},
            {icon:'👑',label:'Premium',route:'/lumera'},
          ]).map((n,i) => (
            <div key={i} className="nav-item" onClick={()=>router.push(n.route)}>
              <span style={{fontSize:'1.2rem'}}>{n.icon}</span>
              <span style={{fontSize:'0.6rem',fontFamily:'Montserrat,sans-serif',color:n.route==='/dashboard'?'#C9935A':'rgba(13,61,61,0.4)',fontWeight:n.route==='/dashboard'?700:400}}>{n.label}</span>
            </div>
          ))}
        </div>

      </div>
    </>
  );
}
