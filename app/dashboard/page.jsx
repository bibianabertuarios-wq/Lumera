'use client';
import { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip } from 'recharts';
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
  const [showPremiumModal, setShowPremiumModal] = useState(false);
  const [showLumiChat, setShowLumiChat] = useState(false);
  const [lumiChatInput, setLumiChatInput] = useState('');
  const [lumiChatMessages, setLumiChatMessages] = useState([]);
  const [lumiChatLoading, setLumiChatLoading] = useState(false);
  const [planGenerado, setPlanGenerado] = useState(null);
  const [planLoading, setPlanLoading] = useState(false);
  const router = useRouter();
  const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

  useEffect(() => { init(); }, []);

  const init = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) { router.push('/start'); return; }

    const { data: profiles } = await supabase
      .from('users').select('*').eq('id', session.user.id).limit(1);
    const profile = profiles?.[0];

    if (['active','paid'].includes(profile?.subscription_status)) {
      window.location.href = '/lumera';
      return;
    }

    const userData = {
      id: session.user.id,
      nombre: (profile?.profile_name || session.user.email?.split('@')[0] || 'amiga').replace(/^./, c => c.toUpperCase()),
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
    generarPlanDelDia(userData, checkins || []);
  };

  const generarMensajeLumi = async (userData, checkins, checkinHoy) => {
    setLumiLoading(true);
    try {
      const is_es = userData.lang === 'es';
      const diasEnApp = Math.floor((new Date() - new Date(userData.createdAt)) / (1000*60*60*24));
      const ayer = checkins?.[0];
      
      const patronSemana = checkins.length >= 3 ? (() => {
        const promedioEnergia = checkins.slice(0,3).reduce((a,c) => a+(c.energia||3), 0) / 3;
        const promedioSueno = checkins.slice(0,3).reduce((a,c) => a+(c.sueno||3), 0) / 3;
        const tendencia = promedioEnergia < 2.5 ? 'baja energía persistente' : promedioSueno < 2.5 ? 'sueño deficiente' : 'progreso estable';
        return tendencia;
      })() : null;

      const imc = userData.peso && userData.talla ?
        (userData.peso / Math.pow(userData.talla > 3 ? userData.talla/100 : userData.talla, 2)).toFixed(1) : null;

      const objetivoDetalle = (() => {
        const obj = (userData.objetivo || '').toLowerCase();
        if (!userData.peso) return '';
        const tallaM = userData.talla > 3 ? userData.talla/100 : userData.talla;
        const pesoIdeal = tallaM ? Math.round(21.5 * tallaM * tallaM) : null;
        if (obj.includes('peso') || obj.includes('weight')) {
          const diff = pesoIdeal ? (userData.peso - pesoIdeal).toFixed(1) : null;
          const meses = diff > 0 ? Math.round(diff / 0.75) : null;
          return diff > 0 ? `Peso: ${userData.peso}kg, IMC: ${imc}. Objetivo: ~${pesoIdeal}kg (-${diff}kg). Tiempo estimado: ${meses} meses a 0.5-1kg/mes.` : `Peso: ${userData.peso}kg, IMC: ${imc}. Ya en rango saludable.`;
        }
        if (obj.includes('músculo') || obj.includes('fuerza') || obj.includes('muscle')) {
          return `Peso: ${userData.peso}kg, IMC: ${imc}. Ganar músculo: superávit 200-300kcal/día, fuerza 3x/semana. Resultados en 8-12 semanas.`;
        }
        if (obj.includes('hormonal') || obj.includes('equilibrio') || obj.includes('balance')) {
          return `IMC: ${imc}. El equilibrio hormonal mejora en 4-6 semanas con hábitos consistentes. Síntomas reducen 40-60% en 3 meses con nutrición, movimiento y sueño optimizados.`;
        }
        if (obj.includes('energía') || obj.includes('energy') || obj.includes('sueño') || obj.includes('sleep') || obj.includes('niebla')) {
          return `IMC: ${imc}. La energía y el sueño mejoran en 2-3 semanas al regular el cortisol. El 70% de la hormona de crecimiento se libera durmiendo — el sueño es tu primera prioridad.`;
        }
        return imc ? `IMC: ${imc}.` : '';
      })();

      const contexto = [
        `Eres LUMI, asesora científica de bienestar hormonal. Idioma: ${is_es ? 'español' : 'inglés'}.`,
        `Usuaria: ${userData.nombre}. Objetivo: ${userData.objetivo || 'equilibrio hormonal'}. Síntoma: ${userData.sintoma || 'bienestar general'}.`,
        `Días en app: ${diasEnApp}. Fecha: ${hoy}, ${hora}h.`,
        objetivoDetalle ? `Datos: ${objetivoDetalle}` : '',
        ayer ? `Ayer: energía ${ayer.energia}/5, sueño ${ayer.sueno}/5, ánimo ${ayer.animo}/5.` : 'Sin checkin previo.',
        patronSemana ? `Patrón semana: ${patronSemana}.` : '',
        'Escribe UN mensaje de máximo 4 frases para cuando abra la app hoy.',
        'Día 1 sin checkins: preséntate, menciona punto de partida con datos reales, primer paso concreto, invita a explorar.',
        'Día 2+: referencia ayer específicamente, patrón si existe, acción concreta.',
        'Tono: asesora científica cercana, directa, con números reales. Sin diagnósticos médicos.',
        'NUNCA: emojis, "no estás rota", "te entiendo", "amiga".',
        'Termina con invitación a preguntar o explorar la app.',
      ].filter(Boolean).join(' ');

      const res = await fetch('/api/lumi', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
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

  const generarPlanDelDia = async (userData, checkins) => {
    const hoy = new Date().toISOString().split('T')[0];
    const cacheKey = `lumi_plan_${userData.id}_${hoy}`;
    const cached = localStorage.getItem(cacheKey);
    if (cached) { setPlanGenerado(JSON.parse(cached)); return; }
    setPlanLoading(true);
    try {
      const is_es = userData.lang === 'es';
      const ayer = checkins?.[0];
      const prompt = `Eres LUMI, asesora científica de bienestar hormonal.
Usuaria: ${userData.nombre}
Objetivo: ${userData.objetivo || 'equilibrio hormonal'}
Síntoma principal: ${userData.sintoma || 'bienestar general'}
IMC: ${userData.peso && userData.talla ? (userData.peso / Math.pow(userData.talla > 3 ? userData.talla/100 : userData.talla, 2)).toFixed(1) : 'no disponible'}
Estado ayer: ${ayer ? `energía ${ayer.energia}/5, sueño ${ayer.sueno}/5, ánimo ${ayer.animo}/5` : 'primer día'}
Fecha: ${hoy}
Idioma: ${is_es ? 'español' : 'inglés'}

Genera exactamente 3 acciones concretas para hoy basadas en su objetivo y estado actual.
Responde SOLO en JSON válido, sin texto adicional:
[
  {"icono": "✦", "accion": "acción concreta y específica", "ciencia": "explicación breve en lenguaje claro, no técnico"},
  {"icono": "✦", "accion": "...", "ciencia": "..."},
  {"icono": "✦", "accion": "...", "ciencia": "..."}
]
Reglas: acciones específicas para HOY, no genéricas. Sin diagnósticos. Sin emojis en iconos, solo ✦. Máximo 15 palabras por acción.`;

      const res = await fetch('/api/lumi', {
        method: 'POST',
        headers: {'Content-Type':'application/json'},
        body: JSON.stringify({
          messages: [{role:'user', content: prompt}]
        })
      });
      const data = await res.json();
      const text = data.content?.[0]?.text || '[]';
      const clean = text.replace(/```json|```/g, '').trim();
      const plan = JSON.parse(clean);
      // Añadir links automáticos según contenido
      const planConLinks = plan.map(p => {
        const texto = (p.accion || '').toLowerCase();
        if (texto.includes('proteína') || texto.includes('protein') || texto.includes('come') || texto.includes('eat') || texto.includes('desayuno') || texto.includes('breakfast') || texto.includes('menú') || texto.includes('menu') || texto.includes('cena') || texto.includes('dinner') || texto.includes('almuerzo') || texto.includes('lunch')) {
          return {...p, link: '/lumera?tab=nutrition', linkLabel: is_es ? 'Ver tu menú →' : 'See your menu →'};
        }
        if (texto.includes('entrena') || texto.includes('train') || texto.includes('ejercicio') || texto.includes('exercise') || texto.includes('fuerza') || texto.includes('strength') || texto.includes('camina') || texto.includes('walk') || texto.includes('series') || texto.includes('sets')) {
          return {...p, link: '/lumera?tab=exercise', linkLabel: is_es ? 'Ver tu rutina →' : 'See your routine →'};
        }
        return p;
      });
      localStorage.setItem(cacheKey, JSON.stringify(planConLinks));
      setPlanGenerado(planConLinks);
    } catch(e) {
      console.error('Plan error:', e);
      setPlanGenerado(null);
    }
    setPlanLoading(false);
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
    const diaSemana = new Date().getDay(); // 0=dom, 1=lun... rota el plan
    
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
      { icono: '🥩', accion: '1.6g proteína por kg de peso hoy', ciencia: 'Tu músculo necesita proteína de forma constante para crecer. Sin ella, el ejercicio no da resultados.' },
      { icono: '🏋️', accion: 'Entrena fuerza 3 series al fallo', ciencia: 'El ejercicio de fuerza es lo que más impacto tiene en tu metabolismo hormonal después de los 40.' },
      { icono: '✦', accion: 'Duerme 8h — el músculo crece durmiendo', ciencia: 'Tu cuerpo regenera y crece mientras duermes. Sin sueño suficiente, el resto del plan no funciona.' },
    ] : [
      { icono: '🥩', accion: '1.6g protein per kg of bodyweight today', ciencia: 'Muscle protein synthesis requires a minimum leucine threshold per meal. Without enough protein, muscle won\'t grow regardless of training.' },
      { icono: '🏋️', accion: 'Strength train 3 sets to failure', ciencia: 'Strength training has the highest impact on your hormonal metabolism after 40.' },
      { icono: '✦', accion: 'Sleep 8h — muscle grows while sleeping', ciencia: 'Your body regenerates while you sleep. Without enough sleep, the rest of the plan will not work.' },
    ];
  };

  const enviarMensajeChat = async () => {
    if (!lumiChatInput.trim() || lumiChatLoading) return;
    const msg = lumiChatInput.trim();
    setLumiChatInput('');
    const newMessages = [...lumiChatMessages, {role:'user', content: msg}];
    setLumiChatMessages(newMessages);
    setLumiChatLoading(true);
    try {
      const is_es = user?.lang === 'es';
      const ayer = ultimosCheckins?.[0];
      const sistema = `Eres LUMI, asesora científica de bienestar hormonal. Usuaria: ${user?.nombre}. Objetivo: ${user?.objetivo}. Síntoma: ${user?.sintoma}. Checkin hoy: ${checkinData ? `energía ${checkinData.energia}/5, ánimo ${checkinData.animo}/5` : 'sin registrar'}. Checkin ayer: ${ayer ? `energía ${ayer.energia}/5, sueño ${ayer.sueno}/5` : 'sin datos'}. Idioma: ${is_es ? 'español' : 'inglés'}. Responde en máximo 3 frases. Directa, científica, sin diagnósticos médicos, sin emojis.`;
      const res = await fetch('/api/lumi', {
        method: 'POST',
        headers: {'Content-Type':'application/json'},
        body: JSON.stringify({
          system: sistema,
          messages: newMessages
        })
      });
      const data = await res.json();
      const reply = data.content?.[0]?.text || '';
      setLumiChatMessages([...newMessages, {role:'assistant', content: reply}]);
    } catch(e) {
      setLumiChatMessages([...newMessages, {role:'assistant', content: is_es ? 'Algo fue mal, intenta de nuevo.' : 'Something went wrong, try again.'}]);
    }
    setLumiChatLoading(false);
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
  const diaActual = Math.min(diasEnApp + 1, 3);
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
          <div style={{display:'flex',alignItems:'center',gap:'0.6rem'}}>
            <div style={{display:'flex',alignItems:'center',gap:'0.5rem',background:'rgba(201,147,90,0.08)',border:'1px solid rgba(201,147,90,0.2)',borderRadius:'99px',padding:'0.3rem 0.75rem'}}>
              <span style={{fontSize:'0.85rem',fontWeight:600,color:'#0D3D3D',fontFamily:"'Cormorant Garamond',serif"}}>{user?.nombre}</span>
            </div>
            {!user?.isPremium && (
              <button onClick={()=>setShowPremiumModal(true)} style={{background:'linear-gradient(135deg,#C9935A,#A06030)',border:'none',borderRadius:'99px',padding:'0.4rem 0.85rem',color:'white',fontSize:'0.75rem',fontFamily:'Montserrat,sans-serif',fontWeight:700,cursor:'pointer'}}>
                ✦ Premium
              </button>
            )}
          </div>
        </div>

        <div style={{maxWidth:'520px',margin:'0 auto',padding:'1.25rem 1.25rem 0'}}>

          {/* SALUDO */}
          <div className={`fade d1 ${visible?'in':''}`} style={{marginBottom:'1rem'}}>
            <p style={{fontSize:'0.8rem',fontFamily:'Montserrat,sans-serif',color:'rgba(13,61,61,0.4)',marginBottom:'0.1rem'}}>{saludoHora}</p>
            <h1 style={{fontSize:'clamp(1.6rem,4vw,2rem)',fontWeight:700,color:'#0D3D3D',lineHeight:1.15}}>{user?.nombre}</h1>
          </div>

          {/* CARD SILUETA — WOW FACTOR */}
          <div className={`fade d2 ${visible?'in':''}`} style={{position:'relative',borderRadius:'1.25rem',overflow:'hidden',marginBottom:'1.25rem',cursor:'pointer',boxShadow:'0 4px 24px rgba(13,61,61,0.15)'}} onClick={()=>router.push('/escaner')}>
            <video autoPlay muted loop playsInline style={{width:'100%',height:'180px',objectFit:'cover',display:'block'}}>
              <source src="/videos/silueta.mp4" type="video/mp4"/>
            </video>
            <div style={{position:'absolute',inset:0,background:'linear-gradient(180deg,transparent 30%,rgba(13,61,61,0.85) 100%)',display:'flex',flexDirection:'column',justifyContent:'flex-end',padding:'1.25rem'}}>
              <div style={{fontFamily:'Montserrat,sans-serif',fontSize:'0.65rem',fontWeight:700,color:'#C9935A',letterSpacing:'2px',marginBottom:'0.25rem'}}>✦ NUEVO</div>
              <div style={{fontSize:'1.2rem',fontWeight:700,color:'white',marginBottom:'0.25rem',fontFamily:"'Cormorant Garamond',serif"}}>
                {is_es ? 'Tu Silueta Hormonal' : 'Your Hormonal Silhouette'}
              </div>
              <div style={{fontSize:'0.8rem',fontFamily:'Montserrat,sans-serif',color:'rgba(255,255,255,0.7)'}}>
                {is_es ? 'Analiza tu cuerpo y descubre tus patrones →' : 'Analyse your body and discover your patterns →'}
              </div>
            </div>
          </div>

          {/* BARRA TRIAL */}
          {!user?.isPremium && (
            <div className={`fade d1 ${visible?'in':''}`} style={{marginBottom:'1rem'}}>
              <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'0.3rem'}}>
                <span style={{fontFamily:'Montserrat,sans-serif',fontSize:'0.65rem',color:'rgba(13,61,61,0.5)'}}>
                  {is_es ? `Día ${diaActual} de 3 — Prueba gratuita` : `Day ${diaActual} of 3 — Free trial`}
                </span>
                <span style={{fontFamily:'Montserrat,sans-serif',fontSize:'0.65rem',color:'#C9935A',fontWeight:600}}>
                  {is_es ? `${diasRestantes}d restantes` : `${diasRestantes}d left`}
                </span>
              </div>
              <div style={{height:'3px',background:'rgba(201,147,90,0.15)',borderRadius:'99px',overflow:'hidden'}}>
                <div style={{height:'100%',background:'linear-gradient(90deg,#C9935A,#A06030)',borderRadius:'99px',width:`${(diaActual/3)*100}%`,transition:'width 0.5s ease'}}/>
              </div>
            </div>
          )}

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
                {planLoading ? (
                  <div className="shimmer" style={{color:'rgba(255,255,255,0.4)',fontFamily:'Montserrat,sans-serif',fontSize:'0.85rem',padding:'0.5rem 0'}}>
                    {is_es ? 'Preparando tu plan personalizado...' : 'Preparing your personalised plan...'}
                  </div>
                ) : (planGenerado || plan).map((p, i) => (
                  <div key={i} style={{marginBottom:'1rem',paddingBottom:'0.85rem',borderBottom:i<(planGenerado||plan).length-1?'1px solid rgba(255,255,255,0.06)':'none'}}>
                    <div style={{display:'flex',alignItems:'flex-start',gap:'0.6rem',marginBottom:'0.25rem'}}>
                      <span style={{fontSize:'1.1rem'}}>{p.icono}</span>
                      <span style={{fontSize:'0.98rem',color:'rgba(255,255,255,0.95)',lineHeight:1.5,flex:1,fontWeight:500}}>{p.accion}</span>
                    </div>
                    <div style={{marginLeft:'1.7rem',fontSize:'0.75rem',fontFamily:'Montserrat,sans-serif',color:'rgba(255,255,255,0.45)',lineHeight:1.6,marginBottom:p.link?'0.4rem':'0'}}>
                      {p.ciencia}
                    </div>
                    {p.link && (
                      <div style={{marginLeft:'1.7rem'}}>
                        <span onClick={()=>window.location.href=p.link} style={{fontSize:'0.75rem',fontFamily:'Montserrat,sans-serif',color:'#C9935A',cursor:'pointer',fontWeight:600}}>
                          {p.linkLabel}
                        </span>
                      </div>
                    )}
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
                  ? [{k:'bien',l:'✦ Bien'},{k:'cansada',l:'· Cansada'},{k:'niebla',l:'· Con niebla'},{k:'regular',l:'· Regular'}]
                  : [{k:'bien',l:'✦ Good'},{k:'cansada',l:'· Tired'},{k:'niebla',l:'· Foggy'},{k:'regular',l:'· Regular'}]
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

          {/* CARD PROGRESO */}
          {ultimosCheckins.length >= 2 && (
            <div className={`fade d4 ${visible?'in':''}`} style={{background:'rgba(255,255,255,0.9)',border:'1px solid rgba(201,147,90,0.2)',borderRadius:'1.25rem',backdropFilter:'blur(8px)',padding:'1.25rem',marginBottom:'1.25rem'}}>
              <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'1rem'}}>
                <div>
                  <div style={{fontFamily:'Montserrat,sans-serif',fontSize:'0.65rem',fontWeight:700,color:'#C9935A',letterSpacing:'2px',textTransform:'uppercase',marginBottom:'0.2rem'}}>
                    {is_es ? 'Tu progreso' : 'Your progress'}
                  </div>
                  <div style={{fontSize:'1rem',fontWeight:600,color:'#0D3D3D',fontFamily:"'Cormorant Garamond',serif"}}>
                    {is_es ? 'Últimos 7 días' : 'Last 7 days'}
                  </div>
                </div>
                <div style={{display:'flex',gap:'0.75rem'}}>
                  {[
                    {label:is_es?'Energía':'Energy', color:'#C9935A', val: energiaPct},
                    {label:is_es?'Sueño':'Sleep', color:'#7B9EA6', val: suenoPct},
                    {label:is_es?'Ánimo':'Mood', color:'#9B7BB0', val: animoPct},
                  ].map(({label,color,val}) => (
                    <div key={label} style={{textAlign:'center'}}>
                      <div style={{fontSize:'1rem',fontWeight:700,color,fontFamily:"'Cormorant Garamond',serif"}}>{val}%</div>
                      <div style={{fontSize:'0.6rem',fontFamily:'Montserrat,sans-serif',color:'rgba(13,61,61,0.4)'}}>{label}</div>
                    </div>
                  ))}
                </div>
              </div>
              <ResponsiveContainer width="100%" height={120}>
                <LineChart data={[...ultimosCheckins].reverse().map(c => ({
                  fecha: new Date(c.fecha).toLocaleDateString(is_es?'es-ES':'en-US', {day:'numeric',month:'short'}),
                  energia: (c.energia||0) * 20,
                  sueno: (c.sueno||0) * 20,
                  animo: (c.animo||0) * 20,
                }))}>
                  <XAxis dataKey="fecha" tick={{fontSize:9, fill:'rgba(13,61,61,0.4)'}} axisLine={false} tickLine={false}/>
                  <YAxis hide domain={[0,100]}/>
                  <Tooltip
                    contentStyle={{background:'white',border:'1px solid rgba(201,147,90,0.2)',borderRadius:'0.5rem',fontSize:'0.75rem'}}
                    formatter={(val,name) => [`${val}%`, name==='energia'?(is_es?'Energía':'Energy'):name==='sueno'?(is_es?'Sueño':'Sleep'):(is_es?'Ánimo':'Mood')]}
                  />
                  <Line type="monotone" dataKey="energia" stroke="#C9935A" strokeWidth={2} dot={{fill:'#C9935A',r:3}} activeDot={{r:5}}/>
                  <Line type="monotone" dataKey="sueno" stroke="#7B9EA6" strokeWidth={2} dot={{fill:'#7B9EA6',r:3}} activeDot={{r:5}}/>
                  <Line type="monotone" dataKey="animo" stroke="#9B7BB0" strokeWidth={2} dot={{fill:'#9B7BB0',r:3}} activeDot={{r:5}}/>
                </LineChart>
              </ResponsiveContainer>
              {ultimosCheckins.length < 3 && (
                <p style={{fontSize:'0.7rem',fontFamily:'Montserrat,sans-serif',color:'rgba(13,61,61,0.35)',textAlign:'center',marginTop:'0.5rem',fontStyle:'italic'}}>
                  {is_es ? `Registra ${3-ultimosCheckins.length} días más para ver tendencias` : `Log ${3-ultimosCheckins.length} more days to see trends`}
                </p>
              )}
            </div>
          )}

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
                {img:"/images/kling_20260321_作品__Extremely_4730_1.png", title:'Nutrición', sub:'Tu menú de hoy', route:'/lumera?tab=nutrition'},
                {img:"/images/kling_20260321_作品_Extremely__4896_1.png", title:'Ejercicio', sub:'Tu rutina de hoy', route:'/lumera?tab=exercise'},
                {img:'/images/lumi.png', title:'LUMI', sub:'Habla con tu asesora', route:'__lumi_chat__'},
                {img:'/images/lente_alquimica.png', title:'Lente Alquímica', sub:'Analiza tu plato', route:'/lumera?tab=chat'},
              ] : [
                {img:"/images/kling_20260321_作品__Extremely_4730_1.png", title:'Nutrition', sub:'Your menu today', route:'/lumera?tab=nutrition'},
                {img:"/images/kling_20260321_作品_Extremely__4896_1.png", title:'Exercise', sub:'Your routine today', route:'/lumera?tab=exercise'},
                {img:'/images/lumi.png', title:'LUMI', sub:'Talk to your advisor', route:'__lumi_chat__'},
                {img:'/images/lente_alquimica.png', title:'Alchemical Lens', sub:'Analyse your plate', route:'/lumera?tab=chat'},
              ]).map((t,i) => (
                <div key={i} className="tool-card" onClick={()=>{ if(t.route==='__lumi_chat__'){setShowLumiChat(true);if(lumiChatMessages.length===0)setLumiChatMessages([{role:'assistant',content:lumiMsg}]);} else if(t.route.includes('/lumera')) window.location.href=t.route; else router.push(t.route); }}>
                  <img src={t.img} alt={t.title} style={{width:'48px',height:'48px',objectFit:'cover',borderRadius:'50%',marginBottom:'0.4rem'}} onError={e=>{e.target.style.display='none'}}/>
                  <div style={{fontSize:'0.95rem',fontWeight:600,color:'#0D3D3D',marginBottom:'0.1rem'}}>{t.title}</div>
                  <div style={{fontSize:'0.7rem',fontFamily:'Montserrat,sans-serif',color:'rgba(13,61,61,0.4)'}}>{t.sub}</div>
                </div>
              ))}
            </div>
          </div>

          {/* BANNER PWA INSTALACION */}
          {typeof window !== 'undefined' && !window.matchMedia('(display-mode: standalone)').matches && !window.navigator?.standalone && (
            <div className={`fade d5 ${visible?'in':''}`} style={{background:'rgba(255,255,255,0.9)',border:'1px solid rgba(201,147,90,0.2)',borderRadius:'1.25rem',backdropFilter:'blur(8px)',padding:'1.25rem',marginBottom:'1.25rem'}}>
              <div style={{fontFamily:'Montserrat,sans-serif',fontSize:'0.65rem',fontWeight:700,color:'#C9935A',letterSpacing:'2px',textTransform:'uppercase',marginBottom:'0.75rem'}}>
                {is_es ? '📲 Llévame contigo' : '📲 Take me with you'}
              </div>
              <p style={{fontSize:'0.9rem',color:'rgba(13,61,61,0.6)',fontStyle:'italic',marginBottom:'1rem',lineHeight:1.6}}>
                {is_es ? 'Instala Lumera en tu móvil y tenme siempre a mano — sin buscar en el navegador.' : 'Install Lumera on your phone and have me always at hand — no searching in the browser.'}
              </p>
              {typeof navigator !== 'undefined' && /iphone|ipad|ipod/i.test(navigator.userAgent) ? (
                <div>
                  <div style={{fontFamily:'Montserrat,sans-serif',fontSize:'0.65rem',fontWeight:700,color:'rgba(13,61,61,0.4)',letterSpacing:'2px',marginBottom:'0.5rem'}}>iPhone / iPad</div>
                  {[
                    is_es ? 'Abre Lumera en Safari' : 'Open Lumera in Safari',
                    is_es ? 'Pulsa el botón compartir ↑' : 'Tap the share button ↑',
                    is_es ? 'Selecciona "Añadir a inicio"' : 'Select "Add to Home Screen"',
                  ].map((step, i) => (
                    <div key={i} style={{display:'flex',alignItems:'center',gap:'0.75rem',marginBottom:'0.5rem'}}>
                      <div style={{width:'24px',height:'24px',borderRadius:'50%',background:'linear-gradient(135deg,#C9935A,#A06030)',color:'white',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'0.7rem',fontWeight:700,flexShrink:0}}>{i+1}</div>
                      <span style={{fontSize:'0.85rem',color:'rgba(13,61,61,0.7)',fontFamily:'Montserrat,sans-serif'}}>{step}</span>
                    </div>
                  ))}
                </div>
              ) : typeof navigator !== 'undefined' && /android/i.test(navigator.userAgent) ? (
                <div>
                  <div style={{fontFamily:'Montserrat,sans-serif',fontSize:'0.65rem',fontWeight:700,color:'rgba(13,61,61,0.4)',letterSpacing:'2px',marginBottom:'0.5rem'}}>Android</div>
                  {[
                    is_es ? 'Abre Lumera en Chrome' : 'Open Lumera in Chrome',
                    is_es ? 'Toca el menú ⋮ (tres puntos)' : 'Tap the menu ⋮ (three dots)',
                    is_es ? 'Selecciona "Añadir a pantalla de inicio"' : 'Select "Add to Home Screen"',
                  ].map((step, i) => (
                    <div key={i} style={{display:'flex',alignItems:'center',gap:'0.75rem',marginBottom:'0.5rem'}}>
                      <div style={{width:'24px',height:'24px',borderRadius:'50%',background:'linear-gradient(135deg,#C9935A,#A06030)',color:'white',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'0.7rem',fontWeight:700,flexShrink:0}}>{i+1}</div>
                      <span style={{fontSize:'0.85rem',color:'rgba(13,61,61,0.7)',fontFamily:'Montserrat,sans-serif'}}>{step}</span>
                    </div>
                  ))}
                </div>
              ) : null}
              <p style={{fontSize:'0.7rem',fontFamily:'Montserrat,sans-serif',color:'rgba(13,61,61,0.3)',marginTop:'0.75rem',textAlign:'center'}}>
                {is_es ? '✦ Gratuito · Sin descargas de tienda · Siempre actualizada' : '✦ Free · No store download · Always up to date'}
              </p>
            </div>
          )}

          {/* BANNER PREMIUM SUTIL */}
          {!user?.isPremium && diasRestantes <= 1 && (
            <div className={`fade d5 ${visible?'in':''}`} style={{background:'rgba(201,147,90,0.06)',border:'1px solid rgba(201,147,90,0.2)',borderRadius:'1.25rem',padding:'1.25rem',marginBottom:'1.25rem',textAlign:'center'}}>
              <p style={{fontSize:'0.9rem',fontStyle:'italic',color:'rgba(13,61,61,0.6)',marginBottom:'0.75rem',lineHeight:1.6,fontFamily:"'Cormorant Garamond',serif"}}>
                {is_es ? 'Tu prueba termina pronto. LUMI seguirá aprendiendo de ti con Premium.' : 'Your trial ends soon. LUMI will keep learning about you with Premium.'}
              </p>
              <button className="btn-premium" onClick={()=>setShowPremiumModal(true)}>
                ✦ {is_es ? 'Ver planes' : 'See plans'}
              </button>
            </div>
          )}

          {/* MODAL CHAT LUMI */}
          {showLumiChat && (
            <div style={{position:'fixed',inset:0,background:'rgba(0,0,0,0.8)',zIndex:200,display:'flex',flexDirection:'column'}} >
              <div style={{background:'linear-gradient(135deg,#0D3D3D,#0A2A2A)',flex:1,display:'flex',flexDirection:'column',maxHeight:'100vh'}}>
                {/* Header */}
                <div style={{padding:'1rem 1.25rem',borderBottom:'1px solid rgba(201,147,90,0.2)',display:'flex',alignItems:'center',justifyContent:'space-between'}}>
                  <div style={{display:'flex',alignItems:'center',gap:'0.6rem'}}>
                    <div style={{width:'32px',height:'32px',borderRadius:'50%',background:'linear-gradient(135deg,#C9935A,#A06030)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'0.85rem',fontWeight:700,color:'white',fontFamily:'Montserrat,sans-serif'}}>L</div>
                    <div>
                      <div style={{fontFamily:'Montserrat,sans-serif',fontSize:'0.7rem',fontWeight:700,color:'#C9935A'}}>LUMI</div>
                      <div style={{fontFamily:'Montserrat,sans-serif',fontSize:'0.6rem',color:'rgba(255,255,255,0.4)'}}>{is_es?'Tu asesora de bienestar':'Your wellness advisor'}</div>
                    </div>
                  </div>
                  <button onClick={()=>setShowLumiChat(false)} style={{background:'none',border:'none',color:'rgba(255,255,255,0.4)',fontSize:'1.2rem',cursor:'pointer'}}>✕</button>
                </div>
                {/* Mensajes */}
                <div style={{flex:1,overflowY:'auto',padding:'1rem',display:'flex',flexDirection:'column',gap:'0.75rem'}}>
                  {lumiChatMessages.map((m,i) => (
                    <div key={i} style={{display:'flex',justifyContent:m.role==='user'?'flex-end':'flex-start'}}>
                      <div style={{maxWidth:'80%',background:m.role==='user'?'rgba(201,147,90,0.2)':'rgba(255,255,255,0.08)',border:`1px solid ${m.role==='user'?'rgba(201,147,90,0.3)':'rgba(255,255,255,0.1)'}`,borderRadius:m.role==='user'?'1rem 1rem 0 1rem':'1rem 1rem 1rem 0',padding:'0.75rem 1rem'}}>
                        <p style={{fontSize:'0.9rem',fontStyle:'italic',color:'rgba(255,255,255,0.9)',lineHeight:1.6,fontFamily:"'Cormorant Garamond',serif"}}>{m.content}</p>
                      </div>
                    </div>
                  ))}
                  {lumiChatLoading && (
                    <div style={{display:'flex',justifyContent:'flex-start'}}>
                      <div style={{background:'rgba(255,255,255,0.08)',borderRadius:'1rem',padding:'0.75rem 1rem'}}>
                        <div className="shimmer" style={{color:'rgba(255,255,255,0.4)',fontSize:'0.85rem',fontFamily:'Montserrat,sans-serif'}}>...</div>
                      </div>
                    </div>
                  )}
                </div>
                {/* Input */}
                <div style={{padding:'1rem',borderTop:'1px solid rgba(201,147,90,0.2)',display:'flex',gap:'0.5rem'}}>
                  <input
                    value={lumiChatInput}
                    onChange={e=>setLumiChatInput(e.target.value)}
                    onKeyDown={e=>e.key==='Enter'&&enviarMensajeChat()}
                    placeholder={is_es?'Pregunta a LUMI...':'Ask LUMI...'}
                    style={{flex:1,background:'rgba(255,255,255,0.08)',border:'1px solid rgba(201,147,90,0.3)',borderRadius:'0.75rem',padding:'0.75rem 1rem',color:'white',fontFamily:"'Cormorant Garamond',serif",fontSize:'0.95rem',outline:'none'}}
                  />
                  <button onClick={enviarMensajeChat} disabled={!lumiChatInput.trim()||lumiChatLoading} style={{background:'linear-gradient(135deg,#C9935A,#A06030)',border:'none',borderRadius:'0.75rem',padding:'0.75rem 1rem',color:'white',fontFamily:'Montserrat,sans-serif',fontWeight:700,cursor:'pointer',opacity:(!lumiChatInput.trim()||lumiChatLoading)?0.5:1}}>
                    ✦
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* MODAL PREMIUM */}
          {showPremiumModal && (
            <div style={{position:'fixed',inset:0,background:'rgba(0,0,0,0.7)',zIndex:200,display:'flex',alignItems:'flex-end',justifyContent:'center'}} onClick={()=>setShowPremiumModal(false)}>
              <div style={{background:'linear-gradient(135deg,#0D3D3D,#0A2A2A)',borderRadius:'1.5rem 1.5rem 0 0',padding:'2rem 1.5rem',width:'100%',maxWidth:'520px'}} onClick={e=>e.stopPropagation()}>
                <div style={{textAlign:'center',marginBottom:'1.5rem'}}>
                  <div style={{fontFamily:'Montserrat,sans-serif',fontSize:'0.65rem',fontWeight:700,color:'#C9935A',letterSpacing:'2px',marginBottom:'0.5rem'}}>✦ LUMERA PREMIUM</div>
                  <h2 style={{fontSize:'1.5rem',fontWeight:700,color:'white',fontFamily:"'Cormorant Garamond',serif",marginBottom:'0.4rem'}}>
                    {is_es ? 'LUMI aprende de ti cada día' : 'LUMI learns from you every day'}
                  </h2>
                  <p style={{fontSize:'0.85rem',color:'rgba(255,255,255,0.5)',fontFamily:'Montserrat,sans-serif',lineHeight:1.6}}>
                    {is_es ? 'Acceso ilimitado · Menús personalizados · Seguimiento hormonal' : 'Unlimited access · Personalised menus · Hormonal tracking'}
                  </p>
                </div>
                <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'0.75rem',marginBottom:'1rem'}}>
                  <button onClick={()=>window.location.href='https://getlumera.lemonsqueezy.com/checkout/buy/2d480891-baaa-4968-9c7b-9b4a6e2c04db'} style={{background:'rgba(201,147,90,0.12)',border:'1px solid rgba(201,147,90,0.35)',borderRadius:'1rem',padding:'1.25rem 0.75rem',cursor:'pointer',textAlign:'center'}}>
                    <div style={{fontFamily:'Montserrat,sans-serif',fontSize:'0.6rem',color:'rgba(255,255,255,0.4)',marginBottom:'0.3rem',letterSpacing:'2px'}}>{is_es?'MENSUAL':'MONTHLY'}</div>
                    <div style={{fontSize:'1.6rem',fontWeight:700,color:'#C9935A',fontFamily:"'Cormorant Garamond',serif"}}>€4.99</div>
                    <div style={{fontFamily:'Montserrat,sans-serif',fontSize:'0.65rem',color:'rgba(255,255,255,0.35)'}}>{is_es?'al mes':'per month'}</div>
                  </button>
                  <button onClick={()=>window.location.href='https://getlumera.lemonsqueezy.com/checkout/buy/d3ff3973-7f9e-413c-89dc-9255874779d7'} style={{background:'linear-gradient(135deg,rgba(201,147,90,0.2),rgba(160,96,48,0.15))',border:'2px solid #C9935A',borderRadius:'1rem',padding:'1.25rem 0.75rem',cursor:'pointer',textAlign:'center',position:'relative'}}>
                    <div style={{position:'absolute',top:'-10px',left:'50%',transform:'translateX(-50%)',background:'#C9935A',borderRadius:'99px',padding:'2px 10px',fontFamily:'Montserrat,sans-serif',fontSize:'0.55rem',fontWeight:700,color:'white',whiteSpace:'nowrap'}}>{is_es?'MEJOR PRECIO':'BEST VALUE'}</div>
                    <div style={{fontFamily:'Montserrat,sans-serif',fontSize:'0.6rem',color:'rgba(255,255,255,0.4)',marginBottom:'0.3rem',letterSpacing:'2px'}}>{is_es?'ANUAL':'ANNUAL'}</div>
                    <div style={{fontSize:'1.6rem',fontWeight:700,color:'#C9935A',fontFamily:"'Cormorant Garamond',serif"}}>€39.99</div>
                    <div style={{fontFamily:'Montserrat,sans-serif',fontSize:'0.65rem',color:'rgba(255,255,255,0.35)'}}>{is_es?'al año · ahorras €20':'per year · save €20'}</div>
                  </button>
                </div>
                <p style={{fontFamily:'Montserrat,sans-serif',fontSize:'0.65rem',color:'rgba(255,255,255,0.2)',textAlign:'center',marginBottom:'1rem'}}>
                  {is_es?'Sin permanencia · Cancela cuando quieras':'No commitment · Cancel anytime'}
                </p>
                <button onClick={()=>setShowPremiumModal(false)} style={{width:'100%',background:'none',border:'none',color:'rgba(255,255,255,0.25)',fontFamily:'Montserrat,sans-serif',fontSize:'0.8rem',cursor:'pointer',padding:'0.5rem'}}>
                  {is_es?'Ahora no':'Not now'}
                </button>
              </div>
            </div>
          )}

        </div>

        {/* NAV */}
        <div style={{position:'fixed',bottom:0,left:0,right:0,background:'rgba(255,255,255,0.95)',borderTop:'1px solid rgba(201,147,90,0.15)',backdropFilter:'blur(10px)',padding:'0.5rem 0',display:'flex',justifyContent:'space-around',zIndex:100}}>
          {(is_es ? [
            {img:"/images/kling_20260321_作品_Extremely__4837_0.png", label:'Inicio', route:'/dashboard'},
            {img:"/images/kling_20260321_作品__Extremely_4730_1.png", label:'Nutrición', route:'/lumera?tab=nutrition'},
            {img:'/images/sintomas.png', label:'Síntomas', route:'/lumera?tab=symptoms'},
            {img:'/images/lumi.png', label:'LUMI', route:'/lumera?tab=chat'},
            {img:"/images/kling_20260321_作品_Extremely__4896_1.png", label:'Ejercicio', route:'/lumera?tab=exercise'},
          ] : [
            {img:"/images/kling_20260321_作品_Extremely__4837_0.png", label:'Home', route:'/dashboard'},
            {img:"/images/kling_20260321_作品__Extremely_4730_1.png", label:'Nutrition', route:'/lumera?tab=nutrition'},
            {img:'/images/sintomas.png', label:'Síntomas', route:'/lumera?tab=symptoms'},
            {img:'/images/lumi.png', label:'LUMI', route:'/lumera?tab=chat'},
            {img:"/images/kling_20260321_作品_Extremely__4896_1.png", label:'Exercise', route:'/lumera?tab=exercise'},
          ]).map((n,i) => (
            <div key={i} className="nav-item" onClick={()=>{ if(n.route==='__lumi_chat__'){setShowLumiChat(true);if(lumiChatMessages.length===0)setLumiChatMessages([{role:'assistant',content:lumiMsg}]);} else if(n.route.includes('/lumera')) window.location.href=n.route; else router.push(n.route); }}>
              <img src={n.img} alt={n.label} style={{width:'28px',height:'28px',borderRadius:'50%',objectFit:'cover',border:n.route==='/dashboard'?'2px solid #C9935A':'2px solid transparent'}}/>
              <span style={{fontSize:'0.6rem',fontFamily:'Montserrat,sans-serif',color:n.route==='/dashboard'?'#C9935A':'rgba(13,61,61,0.4)',fontWeight:n.route==='/dashboard'?700:400}}>{n.label}</span>
            </div>
          ))}
        </div>

      </div>
    </>
  );
}
