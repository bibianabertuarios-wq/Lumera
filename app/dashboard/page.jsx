'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://pyekwpmbdnmglrjieexc.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB5ZWt3cG1iZG5tZ2xyamllZXhjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjU0ODM0OTgsImV4cCI6MjA4MTA1OTQ5OH0.zQl7GF3E6BhDqW3bEMixAbdDcOsW8BsFOBeAGa-5bzY';

const getHora = () => {
  const h = new Date().getHours();
  if (h < 12) return 'mañana';
  if (h < 19) return 'tarde';
  return 'noche';
};

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [lumiMsg, setLumiMsg] = useState('');
  const [lumiLoading, setLumiLoading] = useState(false);
  const [checkinHecho, setCheckinHecho] = useState(false);
  const [checkinData, setCheckinData] = useState(null);
  const [ultimosCheckins, setUltimosCheckins] = useState([]);
  const [visible, setVisible] = useState(false);
  const [planVisible, setPlanVisible] = useState(false);
  const router = useRouter();
  const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

  useEffect(() => { init(); }, []);

  const init = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) { router.push('/start'); return; }

    const { data: profiles } = await supabase
      .from('users').select('*').eq('id', session.user.id).limit(1);
    const profile = profiles?.[0];

    const userData = {
      id: session.user.id,
      nombre: profile?.profile_name || session.user.email?.split('@')[0] || 'amiga',
      sintoma: profile?.sintoma_principal || '',
      objetivo: profile?.objetivo || '',
      createdAt: profile?.created_at || session.user.created_at,
      isPremium: ['active','paid'].includes(profile?.subscription_status),
      lang: profile?.language || 'es',
      peso: profile?.peso || null,
      talla: profile?.talla || null,
    };
    setUser(userData);

    // Cargar últimos 7 checkins
    const { data: checkins } = await supabase
      .from('lumi_checkins')
      .select('*')
      .eq('user_id', session.user.id)
      .order('fecha', { ascending: false })
      .limit(7);
    setUltimosCheckins(checkins || []);

    // Ver si ya hizo checkin hoy
    const hoy = new Date().toISOString().split('T')[0];
    const checkinHoy = checkins?.find(c => c.fecha === hoy);
    if (checkinHoy) {
      setCheckinHecho(true);
      setCheckinData(checkinHoy);
    }

    setLoading(false);
    setTimeout(() => setVisible(true), 100);

    // Generar mensaje de LUMI
    generarMensajeLumi(userData, checkins || [], checkinHoy);
  };

  const generarMensajeLumi = async (userData, checkins, checkinHoy) => {
    setLumiLoading(true);
    try {
      const is_es = userData.lang === 'es';
      const diasEnApp = Math.floor((new Date() - new Date(userData.createdAt)) / (1000*60*60*24));
      const ayer = checkins?.[0];
      
      const contexto = `
Eres LUMI, asesora de bienestar hormonal de Lumera. Hablas en ${is_es ? 'español' : 'inglés'}.
Usuaria: ${userData.nombre}
Objetivo principal: ${userData.objetivo || 'equilibrio hormonal'}
Síntoma principal: ${userData.sintoma || 'bienestar general'}
Días en la app: ${diasEnApp}
Checkin de ayer: ${ayer ? `energía ${ayer.energia}/5, sueño ${ayer.sueno}/5, ánimo ${ayer.animo}/5` : 'sin datos aún'}
Es su primer día: ${diasEnApp === 0 ? 'sí' : 'no'}

Escribe UN mensaje corto y directo (máximo 3 frases) para cuando abra la app hoy.
- Primera vez: preséntate brevemente y dile de dónde parte según su objetivo
- Resto de días: referencia algo concreto de ayer si lo hay, y dile qué toca hoy
- Tono: cercana, científica, directa. Sin drama. Sin diagnósticos.
- No uses "no estás rota", no uses "te entiendo", no uses emojis
- Termina siempre con una acción concreta para hoy
- Máximo 3 frases
      `.trim();

      const res = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'claude-sonnet-4-6',
          max_tokens: 1000,
          messages: [{ role: 'user', content: contexto }]
        })
      });
      const data = await res.json();
      const msg = data.content?.[0]?.text || '';
      setLumiMsg(msg);
    } catch(e) {
      setLumiMsg(userData.lang === 'es' 
        ? 'Hola ' + userData.nombre + '. Tu plan de hoy está listo según tu objetivo.'
        : 'Hi ' + userData.nombre + '. Your plan for today is ready.');
    }
    setLumiLoading(false);
  };

  const hacerCheckin = async (estado) => {
    if (checkinHecho) return;
    const hoy = new Date().toISOString().split('T')[0];
    const valores = {
      'bien':     { energia: 4, animo: 4, sueno: 3, sintoma_hoy: 'bien' },
      'cansada':  { energia: 2, animo: 3, sueno: 2, sintoma_hoy: 'cansancio' },
      'niebla':   { energia: 2, animo: 2, sueno: 3, sintoma_hoy: 'niebla mental' },
      'regular':  { energia: 3, animo: 2, sueno: 3, sintoma_hoy: 'regular' },
    };
    const datos = valores[estado];
    await supabase.from('lumi_checkins').upsert({
      user_id: user.id,
      fecha: hoy,
      ...datos
    });
    setCheckinHecho(true);
    setCheckinData(datos);
    // Regenerar mensaje con el nuevo checkin
    generarMensajeLumi(user, ultimosCheckins, datos);
  };

  const getPromedioSemana = (campo) => {
    if (!ultimosCheckins.length) return 0;
    const vals = ultimosCheckins.filter(c => c[campo]).map(c => c[campo]);
    if (!vals.length) return 0;
    return Math.round((vals.reduce((a,b) => a+b, 0) / vals.length) * 20);
  };

  const getPlanDelDia = () => {
    const is_es = user?.lang === 'es';
    const obj = user?.objetivo?.toLowerCase() || '';
    
    if (obj.includes('peso') || obj.includes('weight')) return is_es ? [
      { icono: '🕗', accion: 'Desayuna antes de las 9am con proteína', ciencia: 'El cortisol matutino está en su pico — la proteína lo estabiliza y frena el catabolismo muscular.' },
      { icono: '🚶', accion: 'Camina 20 min después de comer', ciencia: 'Reduce el pico de insulina postcomida hasta un 30%. El músculo activo capta glucosa sin necesitar insulina.' },
      { icono: '🌙', accion: 'Cena antes de las 8pm', ciencia: 'La sensibilidad a la insulina baja por la noche. Cenar tarde almacena más grasa que la misma comida a mediodía.' },
    ] : [
      { icono: '🕗', accion: 'Breakfast before 9am with protein', ciencia: 'Morning cortisol is at its peak — protein stabilises it and prevents muscle breakdown.' },
      { icono: '🚶', accion: 'Walk 20 min after meals', ciencia: 'Reduces post-meal insulin spike by up to 30%. Active muscle absorbs glucose without needing insulin.' },
      { icono: '🌙', accion: 'Dinner before 8pm', ciencia: 'Insulin sensitivity drops at night. Late dinner stores more fat than the same meal at noon.' },
    ];

    if (obj.includes('energía') || obj.includes('energy') || obj.includes('niebla') || obj.includes('fog')) return is_es ? [
      { icono: '💧', accion: 'Hidratación: 2 vasos de agua al despertar', ciencia: 'La deshidratación leve (1-2%) reduce el rendimiento cognitivo. El cerebro es 75% agua.' },
      { icono: '🥑', accion: 'Omega-3 en el desayuno: nueces, aguacate o salmón', ciencia: 'El DHA es el principal ácido graso del cerebro. Reduce la neuroinflamación que causa niebla mental.' },
      { icono: '⏸️', accion: 'Pausa de 5 min cada hora sin pantallas', ciencia: 'El cortisol acumulado bloquea el córtex prefrontal. Micro-pausas lo regulan y restauran el foco.' },
    ] : [
      { icono: '💧', accion: '2 glasses of water on waking', ciencia: 'Mild dehydration (1-2%) reduces cognitive performance. The brain is 75% water.' },
      { icono: '🥑', accion: 'Omega-3 at breakfast: walnuts, avocado or salmon', ciencia: 'DHA is the brain\'s main fatty acid. Reduces neuroinflammation that causes brain fog.' },
      { icono: '⏸️', accion: '5-min screen-free break every hour', ciencia: 'Accumulated cortisol blocks the prefrontal cortex. Micro-breaks regulate it and restore focus.' },
    ];

    if (obj.includes('sueño') || obj.includes('sleep') || obj.includes('ánimo') || obj.includes('mood')) return is_es ? [
      { icono: '🌡️', accion: 'Dormitorio a 18-20°C esta noche', ciencia: 'La temperatura corporal debe bajar 1°C para iniciar el sueño profundo. El frío lo facilita.' },
      { icono: '💊', accion: 'Magnesio bisglicinato 300mg por la noche', ciencia: 'El magnesio activa el GABA, el neurotransmisor del descanso. El 70% de mujeres 40+ tiene déficit.' },
      { icono: '🚫', accion: 'Sin pantallas 1h antes de dormir', ciencia: 'La luz azul suprime la melatonina hasta 3 horas. Sin luz azul, el ciclo circadiano se regula solo.' },
    ] : [
      { icono: '🌡️', accion: 'Bedroom at 18-20°C tonight', ciencia: 'Body temperature must drop 1°C to enter deep sleep. Cool rooms facilitate this.' },
      { icono: '💊', accion: 'Magnesium bisglycinate 300mg at night', ciencia: 'Magnesium activates GABA, the rest neurotransmitter. 70% of women 40+ are deficient.' },
      { icono: '🚫', accion: 'No screens 1h before bed', ciencia: 'Blue light suppresses melatonin for up to 3 hours. Without it, the circadian cycle self-regulates.' },
    ];

    // Ganar músculo / default
    return is_es ? [
      { icono: '🥩', accion: '1.6g proteína por kg de peso hoy', ciencia: 'La síntesis proteica muscular requiere un umbral mínimo de leucina por comida. Sin proteína suficiente, el músculo no crece aunque entrenes.' },
      { icono: '🏋️', accion: 'Entrena fuerza 3 series al fallo', ciencia: 'La tensión mecánica activa mTOR, la vía anabólica principal. El fallo muscular maximiza el reclutamiento de fibras.' },
      { icono: '😴', accion: 'Duerme 8h — el músculo crece durmiendo', ciencia: 'El 70% de la hormona de crecimiento se libera durante el sueño profundo. Sin sueño, el entrenamiento no sirve.' },
    ] : [
      { icono: '🥩', accion: '1.6g protein per kg of bodyweight today', ciencia: 'Muscle protein synthesis requires a minimum leucine threshold per meal. Without enough protein, muscle won\'t grow regardless of training.' },
      { icono: '🏋️', accion: 'Strength train 3 sets to failure', ciencia: 'Mechanical tension activates mTOR, the main anabolic pathway. Training to failure maximises fibre recruitment.' },
      { icono: '😴', accion: 'Sleep 8h — muscle grows while sleeping', ciencia: '70% of growth hormone is released during deep sleep. Without sleep, training is ineffective.' },
    ];
  };

  if (loading) return (
    <div style={{minHeight:'100vh',background:'linear-gradient(135deg,#FBF7F0,#f0e8d8)',display:'flex',alignItems:'center',justifyContent:'center'}}>
      <p style={{fontFamily:"'Cormorant Garamond',Georgia,serif",fontSize:'1.2rem',color:'#C9935A',fontStyle:'italic'}}>Iniciando tu espacio...</p>
    </div>
  );

  const is_es = user?.lang === 'es';
  const hora = getHora();
  const diasEnApp = Math.floor((new Date() - new Date(user.createdAt)) / (1000*60*60*24));
  const diasRestantes = Math.max(0, 3 - diasEnApp);
  const plan = getPlanDelDia();
  const energiaPct = getPromedioSemana('energia');
  const suenoPct = getPromedioSemana('sueno');
  const animoPct = getPromedioSemana('animo');

  const saludoHora = is_es
    ? hora === 'mañana' ? 'Buenos días' : hora === 'tarde' ? 'Buenas tardes' : 'Buenas noches'
    : hora === 'mañana' ? 'Good morning' : hora === 'tarde' ? 'Good afternoon' : 'Good evening';

  return (
    <>
      <style dangerouslySetInnerHTML={{__html:`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;0,700;1,400&family=Montserrat:wght@300;400;500;600;700&display=swap');
        *{box-sizing:border-box;margin:0;padding:0;}
        .fade{opacity:0;transform:translateY(16px);transition:opacity 0.6s ease,transform 0.6s ease;}
        .fade.in{opacity:1;transform:translateY(0);}
        .d1{transition-delay:0.05s;} .d2{transition-delay:0.15s;} .d3{transition-delay:0.25s;} .d4{transition-delay:0.35s;} .d5{transition-delay:0.45s;}
        .estado-btn{flex:1;padding:0.6rem 0.4rem;border:1.5px solid rgba(201,147,90,0.25);border-radius:0.75rem;background:white;cursor:pointer;font-family:'Cormorant Garamond',serif;font-size:0.9rem;color:#0D3D3D;transition:all 0.2s ease;text-align:center;}
        .estado-btn:hover{border-color:#C9935A;background:rgba(201,147,90,0.06);}
        .estado-btn.sel{border-color:#C9935A;background:rgba(201,147,90,0.12);font-weight:600;}
        .tool-card{background:white;border:1px solid rgba(201,147,90,0.15);border-radius:1rem;padding:1rem;text-align:center;cursor:pointer;transition:all 0.2s ease;}
        .tool-card:hover{border-color:#C9935A;transform:translateY(-2px);box-shadow:0 4px 16px rgba(201,147,90,0.12);}
        .nav-item{display:flex;flex-direction:column;align-items:center;gap:3px;cursor:pointer;padding:0.5rem;min-width:50px;transition:opacity 0.2s;}
        .nav-item:hover{opacity:0.7;}
        .btn-premium{width:100%;background:linear-gradient(135deg,#C9935A,#A06030);border:none;border-radius:0.75rem;padding:1rem;color:white;font-size:1rem;font-family:Montserrat,sans-serif;font-weight:700;cursor:pointer;}
        @keyframes shimmer{0%{opacity:0.5;}50%{opacity:1;}100%{opacity:0.5;}}
        .shimmer{animation:shimmer 1.5s infinite;}
      `}}/>

      <div style={{minHeight:'100vh',backgroundImage:"url('/images/shula_flores_bg.jpg')",backgroundSize:'cover',backgroundPosition:'center',backgroundAttachment:'fixed',fontFamily:"'Cormorant Garamond',Georgia,serif",paddingBottom:'80px'}}>

        {/* HEADER */}
        <div style={{background:'rgba(255,255,255,0.92)',borderBottom:'1px solid rgba(201,147,90,0.15)',backdropFilter:'blur(10px)',padding:'0.75rem 1.25rem',display:'flex',alignItems:'center',justifyContent:'space-between',position:'sticky',top:0,zIndex:100}}>
          <span style={{fontSize:'1.1rem',fontWeight:700,color:'#0D3D3D',fontFamily:"'Cormorant Garamond',serif"}}>✦ Lumera</span>
          {!user?.isPremium && (
            <div style={{display:'flex',alignItems:'center',gap:'0.75rem'}}>
              <span style={{fontSize:'0.7rem',fontFamily:'Montserrat,sans-serif',color:'rgba(13,61,61,0.5)'}}>
                {is_es ? `${diasRestantes}d de prueba` : `${diasRestantes}d trial`}
              </span>
              <button onClick={()=>router.push('/lumera')} style={{background:'linear-gradient(135deg,#C9935A,#A06030)',border:'none',borderRadius:'99px',padding:'0.4rem 0.85rem',color:'white',fontSize:'0.75rem',fontFamily:'Montserrat,sans-serif',fontWeight:700,cursor:'pointer'}}>
                ✦ Premium
              </button>
            </div>
          )}
        </div>

        <div style={{maxWidth:'520px',margin:'0 auto',padding:'1.25rem 1.25rem 0'}}>

          {/* SALUDO */}
          <div className={`fade d1 ${visible?'in':''}`} style={{marginBottom:'1rem'}}>
            <p style={{fontSize:'0.8rem',fontFamily:'Montserrat,sans-serif',color:'rgba(13,61,61,0.4)',marginBottom:'0.1rem'}}>{saludoHora}</p>
            <h1 style={{fontSize:'clamp(1.6rem,4vw,2rem)',fontWeight:700,color:'#0D3D3D',lineHeight:1.15}}>{user?.nombre}</h1>
          </div>

          {/* BLOQUE 1 — LUMI */}
          <div className={`fade d2 ${visible?'in':''}`} style={{background:'linear-gradient(135deg,rgba(13,61,61,0.97),rgba(10,45,45,0.98))',borderRadius:'1.25rem',padding:'1.5rem',marginBottom:'1.25rem',boxShadow:'0 4px 24px rgba(13,61,61,0.2)'}}>
            <div style={{display:'flex',alignItems:'center',gap:'0.5rem',marginBottom:'1rem'}}>
              <div style={{width:'32px',height:'32px',borderRadius:'50%',background:'linear-gradient(135deg,#C9935A,#A06030)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'0.85rem',fontWeight:700,color:'white',fontFamily:'Montserrat,sans-serif'}}>L</div>
              <div>
                <div style={{fontFamily:'Montserrat,sans-serif',fontSize:'0.65rem',fontWeight:700,color:'#C9935A',letterSpacing:'2px'}}>LUMI</div>
                <div style={{fontFamily:'Montserrat,sans-serif',fontSize:'0.6rem',color:'rgba(255,255,255,0.3)'}}>
                  {is_es ? 'Tu asesora de bienestar' : 'Your wellness advisor'}
                </div>
              </div>
            </div>

            {lumiLoading ? (
              <div className="shimmer" style={{fontSize:'1rem',fontStyle:'italic',color:'rgba(255,255,255,0.4)',lineHeight:1.7}}>
                {is_es ? 'Preparando tu plan...' : 'Preparing your plan...'}
              </div>
            ) : (
              <p style={{fontSize:'1.05rem',fontStyle:'italic',color:'rgba(255,255,255,0.9)',lineHeight:1.75,marginBottom:'1.25rem'}}>{lumiMsg}</p>
            )}

            <button onClick={()=>setPlanVisible(!planVisible)} style={{width:'100%',background:'rgba(201,147,90,0.15)',border:'1px solid rgba(201,147,90,0.3)',borderRadius:'0.75rem',padding:'0.75rem',color:'#C9935A',fontFamily:'Montserrat,sans-serif',fontSize:'0.85rem',fontWeight:600,cursor:'pointer',transition:'all 0.2s ease'}}>
              {planVisible 
                ? (is_es ? '▲ Ocultar plan de hoy' : '▲ Hide today\'s plan')
                : (is_es ? '✦ Ver mi plan de hoy' : '✦ See my plan for today')}
            </button>

            {/* PLAN DEL DIA */}
            {planVisible && (
              <div style={{marginTop:'1rem',borderTop:'1px solid rgba(201,147,90,0.2)',paddingTop:'1rem'}}>
                {plan.map((p, i) => (
                  <div key={i} style={{marginBottom:'0.85rem'}}>
                    <div style={{display:'flex',alignItems:'flex-start',gap:'0.6rem',marginBottom:'0.25rem'}}>
                      <span style={{fontSize:'1.1rem'}}>{p.icono}</span>
                      <span style={{fontSize:'0.95rem',color:'rgba(255,255,255,0.9)',lineHeight:1.5,flex:1}}>{p.accion}</span>
                    </div>
                    <div style={{marginLeft:'1.7rem',fontSize:'0.75rem',fontFamily:'Montserrat,sans-serif',color:'rgba(201,147,90,0.7)',lineHeight:1.5,fontStyle:'italic'}}>
                      {is_es ? '¿Por qué? ' : 'Why? '}{p.ciencia}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* BLOQUE 2 — CHECK-IN */}
          <div className={`fade d3 ${visible?'in':''}`} style={{background:'rgba(255,255,255,0.9)',border:'1px solid rgba(201,147,90,0.2)',borderRadius:'1.25rem',backdropFilter:'blur(8px)',padding:'1.25rem',marginBottom:'1.25rem'}}>
            <div style={{fontFamily:'Montserrat,sans-serif',fontSize:'0.65rem',fontWeight:700,color:'#C9935A',letterSpacing:'2px',textTransform:'uppercase',marginBottom:'0.75rem'}}>
              {checkinHecho 
                ? (is_es ? '✓ Registrado hoy' : '✓ Logged today')
                : (is_es ? '¿Cómo estás ahora?' : 'How are you right now?')}
            </div>
            {!checkinHecho ? (
              <div style={{display:'flex',gap:'0.5rem'}}>
                {(is_es
                  ? [{k:'bien',l:'✦ Bien'},{k:'cansada',l:'😴 Cansada'},{k:'niebla',l:'🌫️ Con niebla'},{k:'regular',l:'😤 Regular'}]
                  : [{k:'bien',l:'✦ Good'},{k:'cansada',l:'😴 Tired'},{k:'niebla',l:'🌫️ Foggy'},{k:'regular',l:'😤 Regular'}]
                ).map(({k,l}) => (
                  <button key={k} className="estado-btn" onClick={()=>hacerCheckin(k)}>{l}</button>
                ))}
              </div>
            ) : (
              <div style={{display:'flex',alignItems:'center',gap:'0.5rem'}}>
                <div style={{width:'8px',height:'8px',borderRadius:'50%',background:'#C9935A'}}/>
                <span style={{fontSize:'0.9rem',color:'rgba(13,61,61,0.6)',fontStyle:'italic'}}>
                  {is_es ? `LUMI tiene en cuenta cómo te sientes hoy` : `LUMI is taking into account how you feel today`}
                </span>
              </div>
            )}
          </div>

          {/* BLOQUE 3 — TU SEMANA + TOOLS */}
          <div className={`fade d4 ${visible?'in':''}`} style={{marginBottom:'1.25rem'}}>

            {/* Progreso semanal — solo si hay datos */}
            {ultimosCheckins.length > 0 && (
              <div style={{background:'rgba(255,255,255,0.9)',border:'1px solid rgba(201,147,90,0.2)',borderRadius:'1.25rem',backdropFilter:'blur(8px)',padding:'1.25rem',marginBottom:'1rem'}}>
                <div style={{fontFamily:'Montserrat,sans-serif',fontSize:'0.65rem',fontWeight:700,color:'rgba(13,61,61,0.4)',letterSpacing:'2px',textTransform:'uppercase',marginBottom:'0.75rem'}}>
                  {is_es ? 'Tu semana' : 'Your week'}
                </div>
                {[
                  {label: is_es?'Energía':'Energy', val: energiaPct, color:'#C9935A'},
                  {label: is_es?'Sueño':'Sleep', val: suenoPct, color:'#7B9EA6'},
                  {label: is_es?'Ánimo':'Mood', val: animoPct, color:'#9B7BB0'},
                ].map(({label,val,color}) => (
                  <div key={label} style={{marginBottom:'0.6rem'}}>
                    <div style={{display:'flex',justifyContent:'space-between',marginBottom:'0.2rem'}}>
                      <span style={{fontFamily:'Montserrat,sans-serif',fontSize:'0.7rem',color:'rgba(13,61,61,0.5)'}}>{label}</span>
                      <span style={{fontFamily:'Montserrat,sans-serif',fontSize:'0.7rem',color,fontWeight:600}}>{val}%</span>
                    </div>
                    <div style={{height:'4px',background:'rgba(13,61,61,0.08)',borderRadius:'99px',overflow:'hidden'}}>
                      <div style={{height:'100%',background:color,borderRadius:'99px',width:val+'%',transition:'width 1s ease'}}/>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Tools grid */}
            <div style={{fontFamily:'Montserrat,sans-serif',fontSize:'0.65rem',fontWeight:700,color:'rgba(13,61,61,0.4)',letterSpacing:'2px',textTransform:'uppercase',marginBottom:'0.75rem'}}>
              {is_es ? 'Tus herramientas' : 'Your tools'}
            </div>
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'0.75rem'}}>
              {(is_es ? [
                {img:'/images/nutri_huevo.png', title:'Nutrición', sub:'Tu menú de hoy', route:'/lumera'},
                {img:'/images/lente_alquimica.png', title:'Lente Alquímica', sub:'Analiza tu plato', route:'/lumera'},
                {img:'/images/ejer_fuerza.png', title:'Silueta Hormonal', sub:'Tu análisis corporal', route:'/escaner'},
                {img:'/images/lumi.png', title:'LUMI', sub:'Habla con tu asesora', route:'/lumera'},
              ] : [
                {img:'/images/nutri_huevo.png', title:'Nutrition', sub:'Your menu today', route:'/lumera'},
                {img:'/images/lente_alquimica.png', title:'Alchemical Lens', sub:'Analyse your plate', route:'/lumera'},
                {img:'/images/ejer_fuerza.png', title:'Body Scanner', sub:'Your body analysis', route:'/escaner'},
                {img:'/images/lumi.png', title:'LUMI', sub:'Talk to your advisor', route:'/lumera'},
              ]).map((t,i) => (
                <div key={i} className="tool-card" onClick={()=>router.push(t.route)}>
                  <img src={t.img} alt={t.title} style={{width:'48px',height:'48px',objectFit:'cover',borderRadius:'50%',marginBottom:'0.4rem'}} onError={e=>{e.target.style.display='none'}}/>
                  <div style={{fontSize:'0.95rem',fontWeight:600,color:'#0D3D3D',marginBottom:'0.1rem'}}>{t.title}</div>
                  <div style={{fontSize:'0.7rem',fontFamily:'Montserrat,sans-serif',color:'rgba(13,61,61,0.4)'}}>{t.sub}</div>
                </div>
              ))}
            </div>
          </div>

          {/* BANNER PREMIUM */}
          {!user?.isPremium && diasRestantes <= 1 && (
            <div className={`fade d5 ${visible?'in':''}`} style={{background:'linear-gradient(135deg,rgba(201,147,90,0.1),rgba(160,96,48,0.06))',border:'1px solid rgba(201,147,90,0.25)',borderRadius:'1.25rem',padding:'1.5rem',marginBottom:'1.25rem',textAlign:'center'}}>
              <p style={{fontSize:'1rem',fontWeight:600,color:'#0D3D3D',marginBottom:'0.4rem'}}>
                {is_es ? 'Tu prueba termina pronto' : 'Your trial ends soon'}
              </p>
              <p style={{fontSize:'0.85rem',fontStyle:'italic',color:'rgba(13,61,61,0.5)',marginBottom:'1rem',lineHeight:1.6}}>
                {is_es ? 'LUMI seguirá aprendiendo de ti con Premium.' : 'LUMI will keep learning about you with Premium.'}
              </p>
              <button className="btn-premium" onClick={()=>router.push('/lumera')}>✦ Continuar con Premium</button>
            </div>
          )}

        </div>

        {/* NAV */}
        <div style={{position:'fixed',bottom:0,left:0,right:0,background:'rgba(255,255,255,0.95)',borderTop:'1px solid rgba(201,147,90,0.15)',backdropFilter:'blur(10px)',padding:'0.5rem 0',display:'flex',justifyContent:'space-around',zIndex:100}}>
          {(is_es ? [
            {icon:'🏠', label:'Inicio', route:'/dashboard'},
            {icon:'🥗', label:'Nutrición', route:'/lumera'},
            {icon:'✦', label:'Silueta', route:'/escaner'},
            {icon:'🤝', label:'LUMI', route:'/lumera'},
            {icon:'👑', label:'Premium', route:'/lumera'},
          ] : [
            {icon:'🏠', label:'Home', route:'/dashboard'},
            {icon:'🥗', label:'Nutrition', route:'/lumera'},
            {icon:'✦', label:'Scanner', route:'/escaner'},
            {icon:'🤝', label:'LUMI', route:'/lumera'},
            {icon:'👑', label:'Premium', route:'/lumera'},
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
