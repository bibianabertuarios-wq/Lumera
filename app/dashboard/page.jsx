'use client';
import { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip } from 'recharts';
import { useRouter } from 'next/navigation';
import { createClient } from '@supabase/supabase-js';
import { getLecturaDelDia, estadoDesdeSintomaHoy } from '../lib/lecturas';

const SUPABASE_URL = 'https://pyekwpmbdnmglrjieexc.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB5ZWt3cG1iZG5tZ2xyamllZXhjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjU0ODM0OTgsImV4cCI6MjA4MTA1OTQ5OH0.zQl7GF3E6BhDqW3bEMixAbdDcOsW8BsFOBeAGa-5bzY';

const getHora = () => {
  const h = new Date().getHours();
  if (h < 12) return 'mañana';
  if (h < 19) return 'tarde';
  return 'noche';
};

function getCicloCode(cicloRaw) {
  const CICLO_TEXTOS = {
    'Regular como siempre': 'regular',
    'Irregular — cambia de duración o cantidad': 'irregular',
    'Muy irregular o casi desaparecido': 'casi_ausente',
    'Sin periodo hace menos de 12 meses': 'sin_menos12',
    'Sin periodo hace más de 12 meses': 'sin_mas12',
    'Sin periodo por intervención quirúrgica': 'quirurgica',
    'Regular as always': 'regular',
    'Irregular — changes in duration or flow': 'irregular',
    'Almost gone': 'casi_ausente',
    'No period for less than 12 months': 'sin_menos12',
    'No period for over 12 months': 'sin_mas12',
    'Surgically induced menopause': 'quirurgica',
  };
  if (!cicloRaw) return null;
  return CICLO_TEXTOS[cicloRaw.trim()] || null;
}

function getFaseCicloInfo(cicloCode, periodLog) {
  const sinFaseFiable = ['sin_menos12', 'sin_mas12', 'quirurgica', 'casi_ausente'];
  if (!cicloCode || sinFaseFiable.includes(cicloCode)) return { tieneCiclo: false };
  if (!periodLog || periodLog.length === 0) return { tieneCiclo: false };
  const lastPeriod = periodLog[periodLog.length - 1];
  const periodDate = new Date(lastPeriod.date);
  const hoy = new Date();
  const diaCicloReal = Math.max(1, Math.round((hoy - periodDate) / (1000 * 60 * 60 * 24)) + 1);
  const duracionCiclo = 28;
  const duracionRegla = lastPeriod.duration || 5;
  let fase = 'folicular';
  if (diaCicloReal <= duracionRegla) fase = 'menstrual';
  else if (diaCicloReal <= 13) fase = 'folicular';
  else if (diaCicloReal <= 16) fase = 'ovulatoria';
  else if (diaCicloReal <= duracionCiclo) fase = 'lutea';
  else fase = 'folicular';
  return { tieneCiclo: true, diaCiclo: Math.min(diaCicloReal, duracionCiclo), duracionCiclo, fase, incierto: cicloCode === 'irregular' };
}

const FASE_LABEL_ES = { menstrual: 'Fase menstrual', folicular: 'Fase folicular', ovulatoria: 'Fase ovulatoria', lutea: 'Fase lútea' };
const FASE_LABEL_EN = { menstrual: 'Menstrual phase', folicular: 'Follicular phase', ovulatoria: 'Ovulatory phase', lutea: 'Luteal phase' };

const DESCUBRIMIENTOS_ES = [
  'Tu hígado metaboliza el estrógeno durante la noche — cenar tarde y pesado le roba ese turno.',
  'El músculo es tu órgano metabólico más activo: cada kilo quema energía incluso mientras duermes.',
  'La luz del sol en la primera hora del día adelanta tu melatonina nocturna hasta 90 minutos.',
  'La progesterona se transforma en alopregnanolona, que actúa sobre los mismos receptores que los ansiolíticos — por eso su bajada afecta tanto al ánimo y al sueño.',
  'Dos minutos de caminar después de comer reducen el pico de glucosa de forma medible.',
  'Tu cerebro es 75% agua: una deshidratación del 2% ya nubla la memoria y el foco.',
  'La fibra alimenta bacterias que fabrican serotonina — tu ánimo también se cocina en el intestino.',
  'El magnesio participa en más de 300 reacciones de tu cuerpo, incluidas las del sueño profundo.',
  'Dormir menos de 6 horas sube la grelina, la hormona del hambre, al día siguiente.',
  'Tu fuerza muscular hoy predice tu independencia física a los 75 mejor que tu peso.',
  'El té con las comidas reduce la absorción de hierro: mejor sepáralos una hora.',
  'Tus mitocondrias se renuevan con el ejercicio: cada sesión fabrica centrales de energía nuevas.',
  'Respirar lento, 4-6 veces por minuto, activa el nervio vago y baja el cortisol en minutos.',
  'La proteína del desayuno reduce los antojos de dulce por la tarde — es química, no fuerza de voluntad.',
];
const DESCUBRIMIENTOS_EN = [
  'Your liver metabolises oestrogen overnight — a late, heavy dinner steals that shift.',
  'Muscle is your most metabolically active organ: every kilo burns energy even while you sleep.',
  'Sunlight in the first hour of your day can advance your night melatonin by up to 90 minutes.',
  'Progesterone converts into allopregnanolone, which acts on the same receptors as anti-anxiety medication — that is why its drop affects mood and sleep so directly.',
  'Two minutes of walking after a meal measurably lowers your glucose spike.',
  'Your brain is 75% water: 2% dehydration already clouds memory and focus.',
  'Fibre feeds bacteria that make serotonin — your mood is also cooked in your gut.',
  'Magnesium takes part in over 300 reactions in your body, including deep sleep.',
  'Sleeping under 6 hours raises ghrelin, your hunger hormone, the next day.',
  'Your muscle strength today predicts your independence at 75 better than your weight.',
  'Tea with meals reduces iron absorption: keep them an hour apart.',
  'Your mitochondria renew with exercise: every session builds new energy factories.',
  'Slow breathing, 4-6 breaths per minute, activates the vagus nerve and lowers cortisol within minutes.',
  'Protein at breakfast reduces afternoon sugar cravings — it is chemistry, not willpower.',
];

// TODO copy pendiente revisión Bibiana — rigor científico, formato mito/verdad
const MITOS_VERDAD_ES = [
  'Mito: sudar más quema más grasa. Verdad: el sudor regula tu temperatura, no tu grasa corporal.',
  'Mito: los carbohidratos de noche engordan más. Verdad: lo que más pesa es el total del día, no la hora.',
  'Mito: hay que aguantar hambre para adelgazar. Verdad: el músculo que pierdes con hambre es el que más te protege a los 60.',
  'Mito: el cansancio se arregla con más cafeína. Verdad: el magnesio y el sueño profundo lo resuelven de raíz.',
  'Mito: la niebla mental es solo cosa de la edad. Verdad: la hidratación y el omega-3 la mejoran de forma medible.',
  'Mito: hay que hacer cardio largo para perder peso. Verdad: el músculo que ganas con fuerza sigue quemando en reposo.',
];
const MITOS_VERDAD_EN = [
  'Myth: sweating more burns more fat. Truth: sweat regulates your temperature, not your body fat.',
  'Myth: carbs at night are more fattening. Truth: your daily total matters more than the time.',
  'Myth: you have to push through hunger to lose weight. Truth: the muscle you lose to hunger is what protects you most at 60.',
  'Myth: tiredness is fixed with more caffeine. Truth: magnesium and deep sleep solve it at the root.',
  'Myth: brain fog is just an age thing. Truth: hydration and omega-3 measurably improve it.',
  'Myth: you need long cardio to lose weight. Truth: the muscle you build with strength keeps burning at rest.',
];

function TendenciaCard({ tipo, checkins, is_es, bare }) {
  const esSueno = tipo === 'sueno';
  const val = (c) => esSueno ? Number(c.sueno) : (Number(c.energia) + Number(c.animo)) / 2;
  const datos = (checkins || []).filter(c => val(c) > 0).slice().sort((a, b) => a.fecha < b.fecha ? -1 : 1);
  const nombre = esSueno ? (is_es ? 'sueño' : 'sleep') : (is_es ? 'energía' : 'energy');
  const hace7 = new Date(Date.now() - 7 * 86400000).toISOString().split('T')[0];
  const rec = datos.filter(c => c.fecha >= hace7);
  const prev = datos.filter(c => c.fecha < hace7);
  const media = (arr) => arr.length ? arr.reduce((s, c) => s + val(c), 0) / arr.length : null;
  const mRec = media(rec), mPrev = media(prev);

  if (datos.length < 4) {
    const contenido = (
      <>
        {!bare && (
          <span style={{fontFamily:'Montserrat,sans-serif',fontSize:'0.65rem',fontWeight:700,color:'rgba(13,61,61,0.4)',letterSpacing:'1.5px',textTransform:'uppercase'}}>
            {is_es ? 'Tu camino' : 'Your path'}
          </span>
        )}
        <div style={{display:'flex',gap:'0.45rem',margin:'0.8rem 0 0.6rem'}}>
          {[0,1,2,3].map(i => (
            <span key={i} style={{width:'12px',height:'12px',borderRadius:'50%',background:i < datos.length ? '#C9935A' : 'rgba(201,147,90,0.18)'}} />
          ))}
        </div>
        <p style={{fontFamily:'Montserrat,sans-serif',fontSize:'0.78rem',color:'rgba(13,61,61,0.55)',margin:0,lineHeight:1.5}}>
          {is_es
            ? `${datos.length} de 4 check-ins — con 4 días registrados, tu tendencia de ${nombre} cobra vida aquí.`
            : `${datos.length} of 4 check-ins — after 4 logged days, your ${nombre} trend comes alive here.`}
        </p>
      </>
    );
    return bare ? contenido : (
      <div style={{background:'rgba(255,255,255,0.9)',border:'1px solid rgba(201,147,90,0.2)',borderRadius:'1.25rem',backdropFilter:'blur(8px)',padding:'1.25rem'}}>
        {contenido}
      </div>
    );
  }

  const ultimos = datos.slice(-14);
  const W = 270, H = 64;
  const xs = (i) => ultimos.length > 1 ? 12 + (i * (W - 24)) / (ultimos.length - 1) : W / 2;
  const ys = (v) => H - 8 - ((v - 1) / 4) * (H - 20);
  const puntos = ultimos.map((c, i) => `${xs(i).toFixed(1)},${ys(val(c)).toFixed(1)}`).join(' ');
  const ux = xs(ultimos.length - 1), uy = ys(val(ultimos[ultimos.length - 1]));
  const deltaPct = (mPrev && mPrev > 0 && mRec !== null) ? Math.round((mRec - mPrev) / mPrev * 100) : null;
  const sube = deltaPct !== null && deltaPct > 2;
  const baja = deltaPct !== null && deltaPct < -2;
  const deltaTxt = deltaPct === null
    ? (is_es ? 'primera semana' : 'first week')
    : `${deltaPct > 0 ? '+' : ''}${deltaPct}% ${sube ? '↑' : baja ? '↓' : '→'}`;
  const frase = deltaPct === null
    ? (is_es ? 'Tu punto de partida ya está dibujado.' : 'Your starting point is drawn.')
    : sube
      ? (is_es ? `Tu ${nombre} mejora — tu constancia está funcionando ✦` : `Your ${nombre} is improving — your consistency is working ✦`)
      : baja
        ? (is_es ? `Tu ${nombre} va en fase baja esta semana. Hoy tienes una palanca concreta para subirla.` : `Your ${nombre} is in a low phase this week. Today you have a concrete lever to lift it.`)
        : (is_es ? `Tu ${nombre} se mantiene estable esta semana.` : `Your ${nombre} is holding steady this week.`);

  const contenido = (
    <>
      <style>{`@keyframes tendPulso { 0%,100% { opacity: 1; } 50% { opacity: 0.55; } }`}</style>
      {!bare && (
        <span style={{fontFamily:'Montserrat,sans-serif',fontSize:'0.65rem',fontWeight:700,color:'rgba(13,61,61,0.4)',letterSpacing:'1.5px',textTransform:'uppercase'}}>
          {is_es ? `Tu camino · ${nombre}` : `Your path · ${nombre}`}
        </span>
      )}
      <p style={{fontFamily:"'Cormorant Garamond',Georgia,serif",fontSize:'1.05rem',fontStyle:'italic',color:'#0D3D3D',margin:'0.4rem 0 0.75rem',lineHeight:1.4}}>{frase}</p>
      <svg viewBox={`0 0 ${W} ${H}`} width="100%" role="img" aria-label={is_es ? `Tendencia de ${nombre}: ${deltaTxt}` : `${nombre} trend: ${deltaTxt}`}>
        <polyline points={puntos} fill="none" stroke="rgba(201,147,90,0.35)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        {ultimos.map((c, i) => (
          <circle key={i} cx={xs(i)} cy={ys(val(c))} r="2.6" fill={c.fecha >= hace7 ? '#C9935A' : 'rgba(13,61,61,0.2)'} />
        ))}
        <circle cx={ux} cy={uy} r="5.5" fill="#C9935A" style={{animation:'tendPulso 2.4s ease-in-out infinite'}} />
      </svg>
      <div style={{display:'flex',justifyContent:'space-between',fontFamily:'Montserrat,sans-serif',fontSize:'0.6rem',color:'rgba(13,61,61,0.35)',marginTop:'0.1rem'}}>
        <span>{is_es ? 'hace 2 semanas' : '2 weeks ago'}</span><span>{is_es ? 'hoy' : 'today'}</span>
      </div>
      <div style={{textAlign:'right',fontFamily:'Montserrat,sans-serif',fontSize:'0.65rem',fontWeight:600,color:'rgba(13,61,61,0.4)',marginTop:'0.35rem'}}>{deltaTxt}</div>
    </>
  );
  return bare ? contenido : (
    <div style={{background:'rgba(255,255,255,0.9)',border:'1px solid rgba(201,147,90,0.2)',borderRadius:'1.25rem',backdropFilter:'blur(8px)',padding:'1.25rem'}}>
      {contenido}
    </div>
  );
}

function AnilloVivo({ info, is_es, racha = 0, size = 150 }) {
  const faseLabels = is_es ? FASE_LABEL_ES : FASE_LABEL_EN;
  if (!info || !info.tieneCiclo) {
    const r = 62, C = 2 * Math.PI * r;
    const p = Math.min(racha / 7, 1);
    const titulo = racha > 0 ? String(racha) : (is_es ? 'Hoy' : 'Today');
    // TODO copy pendiente revisión Bibiana — sin marcar "cero", encuadre de semana ya en marcha
    const sub = racha > 0
      ? (is_es ? (racha === 1 ? 'día de constancia' : 'días de constancia') : (racha === 1 ? 'day of consistency' : 'days of consistency'))
      : (is_es ? 'tu semana ya está en marcha' : 'your week is already underway');
    return (
      <div style={{ width: size, margin: '0 auto', animation: 'lumBreathe 4.5s ease-in-out infinite', transformOrigin: 'center' }} role="img" aria-label={`${titulo} ${sub}`}>
        <svg viewBox="0 0 150 150" width={size} height={size}>
          <circle cx="75" cy="75" r={r} fill="none" stroke="rgba(201,147,90,0.2)" strokeWidth="6" />
          {p > 0 && <circle cx="75" cy="75" r={r} fill="none" stroke="#C9935A" strokeWidth="6" strokeLinecap="round" strokeDasharray={`${C * p} ${C * (1 - p)}`} transform="rotate(-90 75 75)" />}
          <text x="75" y="74" textAnchor="middle" fontSize={racha > 0 ? 30 : 19} fill="#0D3D3D" fontFamily="'Cormorant Garamond',Georgia,serif">{titulo}</text>
          <text x="75" y="92" textAnchor="middle" fontSize="10" fill="#A06030">{sub}</text>
        </svg>
      </div>
    );
  }
  const { diaCiclo, duracionCiclo, fase, incierto } = info;
  const r = 62, C = 2 * Math.PI * r;
  const p = Math.min(Math.max(diaCiclo / duracionCiclo, 0), 1);
  return (
    <div style={{ width: size, margin: '0 auto', animation: 'lumBreathe 4.5s ease-in-out infinite', transformOrigin: 'center' }}
      role="img" aria-label={`${is_es ? 'Día' : 'Day'} ${diaCiclo} ${is_es ? 'de' : 'of'} ${duracionCiclo}, ${faseLabels[fase]}`}>
      <svg viewBox="0 0 150 150" width={size} height={size}>
        <circle cx="75" cy="75" r={r} fill="none" stroke="rgba(201,147,90,0.2)" strokeWidth="6" />
        <circle cx="75" cy="75" r={r} fill="none" stroke="#C9935A" strokeWidth="6" strokeLinecap="round"
          strokeDasharray={`${C * p} ${C * (1 - p)}`} transform="rotate(-90 75 75)" />
        <circle cx="75" cy={75 - r} r="5.5" fill="#C9935A" transform={`rotate(${p * 360} 75 75)`} />
        <text x="75" y="71" textAnchor="middle" fontSize="21" fill="#0D3D3D" fontFamily="'Cormorant Garamond',Georgia,serif">{`${is_es ? 'Día' : 'Day'} ${diaCiclo}`}</text>
        <text x="75" y="89" textAnchor="middle" fontSize="10.5" fill="#A06030">{faseLabels[fase]}</text>
        {incierto && <text x="75" y="103" textAnchor="middle" fontSize="8" fill="rgba(13,61,61,0.45)">{is_es ? 'estimado · ciclo irregular' : 'estimated · irregular cycle'}</text>}
      </svg>
    </div>
  );
}

function BarraSemana({ diasCompletados = 0, diasTotales = 7, is_es }) {
  const pct = Math.round((diasCompletados / diasTotales) * 100);
  return (
    <div style={{ margin: '10px 2px 4px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: 'rgba(13,61,61,0.5)', marginBottom: 5 }}>
        <span>{is_es ? 'Tu semana' : 'Your week'}</span>
        <span style={{ color: '#A06030' }}>{diasCompletados} {is_es ? 'de' : 'of'} {diasTotales}</span>
      </div>
      <div style={{ height: 5, background: 'rgba(201,147,90,0.15)', borderRadius: 3 }}>
        <div style={{ height: 5, background: '#C9935A', borderRadius: 3, width: `${pct}%`, transition: 'width .6s ease' }} />
      </div>
    </div>
  );
}

const ETIQUETA_ESTADO_ES = { bien:'bien', cansada:'cansada', niebla:'con niebla', regular:'regular' };
const ETIQUETA_ESTADO_EN = { bien:'good', cansada:'tired', niebla:'foggy', regular:'so-so' };

function CalmaOverlay({ is_es, onClose }) {
  const [fase, setFase] = useState('exhala');
  const [resp, setResp] = useState(0);
  const [fin, setFin] = useState(false);
  useEffect(() => {
    const t0 = Date.now();
    const tick = () => {
      const el = (Date.now() - t0) / 1000;
      if (el >= 60) { setFin(true); clearInterval(iv); return; }
      setResp(Math.floor(el / 10));
      setFase(el % 10 < 4 ? 'inhala' : 'exhala');
    };
    const iv = setInterval(tick, 200);
    tick();
    return () => clearInterval(iv);
  }, []);
  const escala = fase === 'inhala' ? 1.35 : 1;
  const dur = fase === 'inhala' ? '4s' : '6s';
  return (
    <div style={{position:'fixed',inset:0,zIndex:200,background:'rgba(13,61,61,0.97)',display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',padding:'2rem'}}>
      <button onClick={onClose} aria-label={is_es ? 'Cerrar' : 'Close'} style={{position:'absolute',top:'1.25rem',right:'1.5rem',background:'none',border:'none',color:'rgba(255,255,255,0.5)',fontSize:'1.3rem',cursor:'pointer'}}>✕</button>
      {!fin ? (
        <>
          <div style={{width:180,height:180,borderRadius:'50%',border:'2px solid rgba(201,147,90,0.4)',background:'radial-gradient(circle, rgba(201,147,90,0.28), rgba(201,147,90,0.05))',transform:`scale(${escala})`,transition:`transform ${dur} ease-in-out`,display:'flex',alignItems:'center',justifyContent:'center'}}>
            <span style={{fontFamily:"'Cormorant Garamond',Georgia,serif",fontSize:'1.4rem',color:'#F5EFE6'}}>
              {fase === 'inhala' ? (is_es ? 'Inhala' : 'Inhale') : (is_es ? 'Exhala' : 'Exhale')}
            </span>
          </div>
          <p style={{marginTop:'2.75rem',fontFamily:'Montserrat,sans-serif',fontSize:'0.72rem',letterSpacing:'2px',color:'rgba(255,255,255,0.45)',textTransform:'uppercase'}}>
            {is_es ? `Respiración ${Math.min(resp + 1, 6)} de 6` : `Breath ${Math.min(resp + 1, 6)} of 6`}
          </p>
        </>
      ) : (
        <div style={{textAlign:'center',maxWidth:'22rem'}}>
          <p style={{fontFamily:"'Cormorant Garamond',Georgia,serif",fontSize:'1.5rem',color:'#F5EFE6',lineHeight:1.5,fontStyle:'italic'}}>
            {is_es ? 'Un minuto para ti. Tu sistema nervioso te lo agradece.' : 'One minute for you. Your nervous system thanks you.'}
          </p>
          <button onClick={onClose} style={{marginTop:'1.75rem',background:'#C9935A',color:'white',border:'none',borderRadius:'2rem',padding:'0.7rem 2rem',fontFamily:'Montserrat,sans-serif',fontSize:'0.85rem',fontWeight:600,cursor:'pointer'}}>
            {is_es ? 'Volver' : 'Back'}
          </button>
        </div>
      )}
    </div>
  );
}

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [lumiMsg, setLumiMsg] = useState('');
  const [lumiLoading, setLumiLoading] = useState(false);
  const [checkinHecho, setCheckinHecho] = useState(false);
  const [checkinData, setCheckinData] = useState(null);
  const [estadoCheckin, setEstadoCheckin] = useState(null);
  const [mostrarPickerCompleto, setMostrarPickerCompleto] = useState(false);
  const [ultimosCheckins, setUltimosCheckins] = useState([]);
  const [ultimosSintomas, setUltimosSintomas] = useState([]);
  const [visible, setVisible] = useState(false);
  const [planVisible, setPlanVisible] = useState(false);
  const [showPremiumModal, setShowPremiumModal] = useState(false);
  const [showGestion, setShowGestion] = useState(false);
  const [pwaOculto, setPwaOculto] = useState(() => { try { return localStorage.getItem('lumera_pwa_hide') === '1'; } catch(e) { return false; } });
  const [pwaInstruccionesVisibles, setPwaInstruccionesVisibles] = useState(false);
  const [calmaActiva, setCalmaActiva] = useState(false);
  const [mostrarPuertaRecordatorios, setMostrarPuertaRecordatorios] = useState(false);
  const [mostrarCuestionarioHorarios, setMostrarCuestionarioHorarios] = useState(false);
  const [horaDesayuno, setHoraDesayuno] = useState('08:00');
  const [horaComida, setHoraComida] = useState('14:00');
  const [horaCena, setHoraCena] = useState('20:30');
  const [guardandoRecordatorios, setGuardandoRecordatorios] = useState(false);
  const [showMasMenu, setShowMasMenu] = useState(false);
  const [showLumiChat, setShowLumiChat] = useState(false);
  const [showPesoModal, setShowPesoModal] = useState(false);
  const [pesoInput, setPesoInput] = useState('');
  const [metaInput, setMetaInput] = useState('');
  const [guardandoPeso, setGuardandoPeso] = useState(false);
  const [lumiChatInput, setLumiChatInput] = useState('');
  const [lumiChatMessages, setLumiChatMessages] = useState([]);
  const [lumiChatLoading, setLumiChatLoading] = useState(false);
  const [planGenerado, setPlanGenerado] = useState(null);
  const [planLoading, setPlanLoading] = useState(false);
  const [planHecho, setPlanHecho] = useState([]);
  const [ritualHecho, setRitualHecho] = useState([]);
  const [toolsVisible, setToolsVisible] = useState(false);
  const [progresoDetalleVisible, setProgresoDetalleVisible] = useState(false);
  const [usoVisible, setUsoVisible] = useState(false);
  const [recursosVisible, setRecursosVisible] = useState(false);
  const [periodLog, setPeriodLog] = useState([]);
  const router = useRouter();
  const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

  const urlBase64ToUint8Array = (base64String) => {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
    const rawData = atob(base64);
    return Uint8Array.from([...rawData].map(c => c.charCodeAt(0)));
  };

  const activarRecordatorios = async () => {
    setGuardandoRecordatorios(true);
    try {
      const permiso = await Notification.requestPermission();
      if (permiso === 'granted') {
        const reg = await navigator.serviceWorker.ready;
        const vapidKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
        const sub = await reg.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: urlBase64ToUint8Array(vapidKey),
        });
        await fetch('/api/push/subscribe', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userId: user.id,
            subscription: sub,
            horaDesayuno, horaComida, horaCena,
          }),
        });
      }
    } catch(e) {}
    try { localStorage.setItem(`lumi_puerta_recordatorios_${user.id}`, '1'); } catch(e) {}
    setGuardandoRecordatorios(false);
    setMostrarCuestionarioHorarios(false);
    setMostrarPuertaRecordatorios(false);
  };

  const rechazarRecordatorios = () => {
    try { localStorage.setItem(`lumi_puerta_recordatorios_${user?.id}`, '1'); } catch(e) {}
    setMostrarPuertaRecordatorios(false);
  };

  const guardarPeso = async () => {
    const nuevoPeso = parseFloat(pesoInput);
    if (!nuevoPeso || nuevoPeso <= 0) return;
    setGuardandoPeso(true);
    const esInicial = !user?.pesoInicial;
    const nuevaMeta = metaInput ? parseFloat(metaInput) : (user?.pesoMeta || null);
    const updates = {
      peso: nuevoPeso,
      peso_meta: nuevaMeta,
    };
    if (esInicial) {
      updates.peso_inicial = nuevoPeso;
      updates.peso_fecha = new Date().toISOString().split('T')[0];
    }
    try {
      await supabase.from('users').update(updates).eq('id', user.id);
    } catch(e) {}
    setUser(prev => ({
      ...prev,
      peso: nuevoPeso,
      pesoMeta: nuevaMeta,
      pesoInicial: esInicial ? nuevoPeso : prev.pesoInicial,
      pesoFecha: esInicial ? updates.peso_fecha : prev.pesoFecha,
    }));
    setGuardandoPeso(false);
    setShowPesoModal(false);
    setPesoInput('');
    setMetaInput('');
  };

  useEffect(() => { init(); }, []);

  const init = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) { router.push('/start'); return; }

    const { data: profiles } = await supabase
      .from('users').select('*').eq('id', session.user.id).limit(1);
    const profile = profiles?.[0];

    const userData = {
      id: session.user.id,
      nombre: (profile?.profile_name || session.user.email?.split('@')[0] || 'amiga').replace(/^./, c => c.toUpperCase()),
      sintoma: profile?.sintoma_principal || '',
      objetivo: profile?.objetivo || '',
      restricciones: profile?.restricciones || '',
      condiciones: profile?.health_conditions || null,
      createdAt: profile?.created_at || session.user.created_at,
      isPremium: ['active','paid'].includes(profile?.subscription_status),
      lang: profile?.language || 'es',
      peso: profile?.peso || null,
      talla: profile?.talla || null,
      ciclo: profile?.ciclo || '',
      pesoInicial: profile?.peso_inicial || null,
      pushEnabled: profile?.push_enabled || false,
      pesoMeta: profile?.peso_meta || null,
      pesoFecha: profile?.peso_fecha || null,
      tdee: profile?.tdee || null,
    };
    setUser(userData);
    try {
      const yaRespondio = userData.pushEnabled || localStorage.getItem(`lumi_puerta_recordatorios_${session.user.id}`);
      setMostrarPuertaRecordatorios(!yaRespondio);
    } catch(e) {}

    // Cargar últimos 7 checkins
    const { data: checkins } = await supabase
      .from('lumi_checkins')
      .select('*')
      .eq('user_id', session.user.id)
      .order('fecha', { ascending: false })
      .limit(14);
    setUltimosCheckins(checkins || []);

    // Ultimos sintomas registrados (para que LUMI sea predictiva)
    const { data: sintomasData } = await supabase
      .from('symptoms')
      .select('*')
      .eq('user_id', session.user.id)
      .order('symptom_date', { ascending: false })
      .limit(5);
    setUltimosSintomas(sintomasData || []);

    try {
      const hk = new Date().toISOString().split('T')[0];
      setPlanHecho(JSON.parse(localStorage.getItem(`lumi_plan_done_${session.user.id}_${hk}`) || '[]'));
      setRitualHecho(JSON.parse(localStorage.getItem(`lumi_ritual_done_${session.user.id}_${hk}`) || '[]'));
    } catch(e) {}

    try {
      setPeriodLog(JSON.parse(localStorage.getItem('lumeraPeriod') || '[]'));
    } catch(e) {}

    // Ver si ya hizo checkin hoy
    const hoy = new Date().toISOString().split('T')[0];
    const checkinHoy = checkins?.find(c => c.fecha === hoy);
    if (checkinHoy) {
      setCheckinHecho(true);
      setCheckinData(checkinHoy);
    }

    setLoading(false);
    setTimeout(() => setVisible(true), 100);

    // Generar mensaje de LUMI — instantáneo, local, sin esperar a ninguna API.
    generarMensajeLumi(userData, checkins || [], checkinHoy ? estadoDesdeSintomaHoy(checkinHoy.sintoma_hoy) : null);
  };

  const generarMensajeLumi = (userData, checkins, estadoHoy) => {
    const is_es = userData.lang === 'es';
    const { lectura } = getLecturaDelDia({
      nombre: userData.nombre,
      objetivo: userData.objetivo,
      sintoma: userData.sintoma,
      is_es,
      diasRegistrados: (checkins || []).length,
      estadoHoy,
    });
    setLumiMsg(lectura);
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
    setCheckinHecho(true);
    setCheckinData(datos);
    setEstadoCheckin(estado);
    await supabase.from('lumi_checkins').upsert({
      user_id: user.id,
      fecha: hoy,
      ...datos
    });
    // Regenerar mensaje con el nuevo checkin: se antepone el reconocimiento del estado de hoy.
    generarMensajeLumi(user, ultimosCheckins, estado);
  };

  const getPromedioSemana = (campo) => {
    if (!ultimosCheckins.length) return 0;
    const vals = ultimosCheckins.filter(c => c[campo]).map(c => c[campo]);
    if (!vals.length) return 0;
    return Math.round((vals.reduce((a,b) => a+b, 0) / vals.length) * 20);
  };

  const togglePlanItem = (idx) => {
    const hk = new Date().toISOString().split('T')[0];
    setPlanHecho(prev => {
      const next = prev.includes(idx) ? prev.filter(x => x !== idx) : [...prev, idx];
      try { localStorage.setItem(`lumi_plan_done_${user?.id}_${hk}`, JSON.stringify(next)); } catch(e) {}
      return next;
    });
  };

  const marcarRitualHecho = (idx) => {
    const hk = new Date().toISOString().split('T')[0];
    setRitualHecho(prev => {
      if (prev.includes(idx)) return prev;
      const next = [...prev, idx];
      try { localStorage.setItem(`lumi_ritual_done_${user?.id}_${hk}`, JSON.stringify(next)); } catch(e) {}
      return next;
    });
  };

  const getPlanDelDia = () => {
    const is_es = user?.lang === 'es';
    const { plan } = getLecturaDelDia({
      nombre: user?.nombre,
      objetivo: user?.objetivo,
      sintoma: user?.sintoma,
      restricciones: user?.restricciones,
      condiciones: user?.condiciones,
      is_es,
      diasRegistrados: (ultimosCheckins || []).length,
    });
    return plan.map(p => {
      const texto = (p.accion || '').toLowerCase();
      let link, linkLabel;
      if (texto.includes('proteína') || texto.includes('protein') || texto.includes('come') || texto.includes('eat') || texto.includes('desayuno') || texto.includes('breakfast') || texto.includes('menú') || texto.includes('menu') || texto.includes('cena') || texto.includes('dinner') || texto.includes('almuerzo') || texto.includes('lunch')) {
        link = '/lumera?tab=nutrition'; linkLabel = is_es ? 'Ver tu menú →' : 'See your menu →';
      } else if (texto.includes('entrena') || texto.includes('train') || texto.includes('camina') || texto.includes('walk') || texto.includes('series') || texto.includes('sets') || texto.includes('movimiento') || texto.includes('movement')) {
        link = '/lumera?tab=exercise'; linkLabel = is_es ? 'Ver tu rutina →' : 'See your routine →';
      }
      return { icono: p.icono, accion: p.accion, ciencia: p.porque, ...(p.etiqueta ? { etiqueta: p.etiqueta } : {}), ...(link ? { link, linkLabel } : {}) };
    });
  };

  const getObjetivoKcalHoy = () => {
    const { objetivoKcal } = getLecturaDelDia({
      nombre: user?.nombre,
      objetivo: user?.objetivo,
      sintoma: user?.sintoma,
      is_es: user?.lang === 'es',
      diasRegistrados: (ultimosCheckins || []).length,
      tdee: user?.tdee,
    });
    return objetivoKcal;
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
      const sistema = `Eres LUMI, asesora científica de bienestar hormonal. Usuaria: ${user?.nombre}. Objetivo: ${user?.objetivo}. Síntoma: ${user?.sintoma}. Checkin hoy: ${checkinData ? `energía ${checkinData.energia}/5, ánimo ${checkinData.animo}/5` : 'sin registrar'}. Checkin ayer: ${ayer ? `energía ${ayer.energia}/5, sueño ${ayer.sueno}/5` : 'sin datos'}. Idioma: ${is_es ? 'español' : 'inglés'}. Estructura tu respuesta siempre así: 1) reconocimiento breve de lo que siente (nunca minimices), 2) el dato biológico concreto que lo explica (un mecanismo real, no vago), 3) una sola acción práctica que pueda hacer hoy — nunca una lista larga. A veces abres con calidez tipo '¿qué tal va tu día?' sin sonar peloteo. Si menciona falta de tiempo para cocinar, recuérdale que puede fotografiar su plato y tú se lo ajustas. Responde en máximo 3-4 frases. Cercana y científica a la vez, sin diagnósticos médicos, sin emojis.`;
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
  const handleCancelSubscription = async () => {
    const confirmed = window.confirm(
      user?.lang === 'es'
        ? '¿Segura que quieres cancelar? Mantendrás acceso premium hasta el final de tu período de facturación.'
        : 'Are you sure you want to cancel? You will keep premium access until the end of your billing period.'
    );
    if (!confirmed) return;
    const email = user?.email || '';
    window.open(`mailto:support@lumera.app?subject=${encodeURIComponent('Cancelar suscripción')}&body=${encodeURIComponent(`Hola, quiero cancelar mi suscripción.\n\nEmail: ${email}`)}`, '_blank');
  };

  const diasRestantes = Math.max(0, 3 - diasEnApp);
  const diaActual = Math.min(diasEnApp + 1, 3);
  const bloqueado = !user?.isPremium && diasRestantes === 0;
  const cicloCode = getCicloCode(user?.ciclo);
  const infoCiclo = getFaseCicloInfo(cicloCode, periodLog);
  const rachaDias = (() => {
    if (!ultimosCheckins || !ultimosCheckins.length) return 0;
    const dias = new Set(ultimosCheckins.map(c => c.fecha));
    let r = 0;
    const d = new Date();
    if (!dias.has(d.toISOString().split('T')[0])) d.setDate(d.getDate() - 1);
    while (dias.has(d.toISOString().split('T')[0])) { r++; d.setDate(d.getDate() - 1); }
    return r;
  })();
  const hace7dias = new Date(Date.now() - 7 * 86400000).toISOString().split('T')[0];
  const diasCompletadosSemana = Math.min(7, (ultimosCheckins || []).filter(c => c.fecha >= hace7dias).length);
  const estadoAyer = (!checkinHecho && (ultimosCheckins || []).length >= 3 && ultimosCheckins?.[0]) ? estadoDesdeSintomaHoy(ultimosCheckins[0].sintoma_hoy) : null;
  const objLower = (user?.objetivo || '').toLowerCase();
  const esObjetivoPeso = objLower.includes('peso') || objLower.includes('weight') || objLower.includes('fuerza') || objLower.includes('muscul') || objLower.includes('strength') || objLower.includes('muscle');
  const esObjetivoSueno = objLower.includes('sue') || objLower.includes('dorm') || objLower.includes('sleep');
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
        .estado-btn{flex:1;padding:0.6rem 0.4rem;border:1.5px solid rgba(201,147,90,0.25);border-radius:0.75rem;background:white;cursor:pointer;display:flex;flex-direction:column;align-items:center;gap:0.3rem;font-family:'Montserrat',sans-serif;color:#0D3D3D;transition:all 0.2s ease;text-align:center;}
        .estado-btn:hover{border-color:#C9935A;background:rgba(201,147,90,0.06);}
        .estado-btn.sel{border-color:#C9935A;background:rgba(201,147,90,0.12);font-weight:600;}
        .tool-card{background:white;border:1px solid rgba(201,147,90,0.15);border-radius:1rem;padding:1rem;text-align:center;cursor:pointer;transition:all 0.2s ease;}
        .tool-card:hover{border-color:#C9935A;transform:translateY(-2px);box-shadow:0 4px 16px rgba(201,147,90,0.12);}
        .nav-item{display:flex;flex-direction:column;align-items:center;gap:3px;cursor:pointer;padding:0.5rem;min-width:50px;transition:opacity 0.2s;}
        .nav-item:hover{opacity:0.7;}
        .btn-premium{width:100%;background:linear-gradient(135deg,#C9935A,#A06030);border:none;border-radius:0.75rem;padding:1rem;color:white;font-size:1rem;font-family:Montserrat,sans-serif;font-weight:700;cursor:pointer;}
        @keyframes shimmer{0%{opacity:0.5;}50%{opacity:1;}100%{opacity:0.5;}}
        .shimmer{animation:shimmer 1.5s infinite;}
        @keyframes lumBreathe{0%,100%{transform:scale(1);}50%{transform:scale(1.035);}}
        @media (prefers-reduced-motion: reduce){ [style*="lumBreathe"]{animation:none!important;} }
      `}}/>

      <div style={{minHeight:'100vh',backgroundImage:"linear-gradient(rgba(250,247,241,0.92),rgba(250,247,241,0.92)),url('/images/shula_flores_bg.jpg')",backgroundSize:'cover',backgroundPosition:'center',backgroundAttachment:'fixed',fontFamily:"'Cormorant Garamond',Georgia,serif",paddingBottom:'80px'}}>

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
          <div className={`fade d1 ${visible?'in':''}`} style={{background:'#FAF7F1',borderRadius:'1.25rem',boxShadow:'0 2px 12px rgba(13,61,61,0.06)',padding:'0.9rem 1.1rem',marginBottom:'1rem'}}>
            <p style={{fontSize:'0.8rem',fontFamily:'Montserrat,sans-serif',color:'rgba(13,61,61,0.4)',marginBottom:'0.1rem'}}>{saludoHora}</p>
            <h1 style={{fontSize:'clamp(1.6rem,4vw,2rem)',fontWeight:700,color:'#0D3D3D',lineHeight:1.15}}>{user?.nombre}</h1>
          </div>

          {/* MI PLAN — mensaje de LUMI + puerta de recordatorios + plan de hoy (resumen que expande) */}
          <div className={`fade d2 ${visible?'in':''}`} style={{background:'linear-gradient(135deg,rgba(13,61,61,0.97),rgba(10,45,45,0.98))',border:'1px solid rgba(201,147,90,0.25)',borderRadius:'1.25rem',padding:'1.25rem',margin:'0 0.3rem 1.25rem',boxShadow:'0 4px 20px rgba(13,61,61,0.15)'}}>
            <div style={{display:'flex',alignItems:'center',gap:'0.5rem',marginBottom:'1rem'}}>
              <div style={{width:'32px',height:'32px',borderRadius:'50%',background:'linear-gradient(135deg,#C9935A,#A06030)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'0.85rem',fontWeight:700,color:'white',fontFamily:'Montserrat,sans-serif'}}>L</div>
              <div>
                <div style={{fontFamily:'Montserrat,sans-serif',fontSize:'0.65rem',fontWeight:700,color:'#C9935A',letterSpacing:'2px'}}>LUMI</div>
                <div style={{fontFamily:'Montserrat,sans-serif',fontSize:'0.6rem',color:'rgba(255,255,255,0.3)'}}>
                  {is_es ? 'Tu asesora de bienestar' : 'Your wellness advisor'}
                </div>
              </div>
            </div>

            {!checkinHecho ? (
              <>
                {/* TODO copy pendiente revisión Bibiana */}
                <p style={{fontSize:'0.95rem',fontStyle:'italic',color:'rgba(255,255,255,0.7)',lineHeight:1.5,marginBottom:'0.9rem'}}>
                  {is_es ? 'Un toque y te digo qué está pasando en tu cuerpo hoy.' : "One tap and I'll tell you what's happening in your body today."}
                </p>
                {estadoAyer && !mostrarPickerCompleto ? (
                  <div style={{marginBottom:'1.25rem'}}>
                    <p style={{fontSize:'0.95rem',color:'rgba(255,255,255,0.9)',lineHeight:1.5,marginBottom:'0.75rem'}}>
                      {is_es
                        ? `Ayer me dijiste ${ETIQUETA_ESTADO_ES[estadoAyer]}, ¿seguimos igual?`
                        : `Yesterday you told me ${ETIQUETA_ESTADO_EN[estadoAyer]}, are we still the same?`}
                    </p>
                    <div style={{display:'flex',gap:'0.6rem'}}>
                      <button onClick={()=>hacerCheckin(estadoAyer)} style={{flex:1,background:'#C9935A',color:'white',border:'none',borderRadius:'0.75rem',padding:'0.7rem',fontFamily:'Montserrat,sans-serif',fontWeight:600,fontSize:'0.85rem',cursor:'pointer'}}>
                        {is_es ? 'Sí, seguimos igual' : 'Yes, still the same'}
                      </button>
                      <button onClick={()=>setMostrarPickerCompleto(true)} style={{flex:1,background:'none',border:'1px solid rgba(201,147,90,0.3)',borderRadius:'0.75rem',padding:'0.7rem',fontFamily:'Montserrat,sans-serif',fontSize:'0.85rem',color:'rgba(255,255,255,0.55)',cursor:'pointer'}}>
                        {is_es ? 'Ha cambiado' : 'It changed'}
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <p style={{fontFamily:'Montserrat,sans-serif',fontSize:'0.75rem',color:'#C9935A',fontWeight:600,marginBottom:'0.75rem'}}>
                      {is_es ? '¿Cómo amaneces? · Tócame para tu lectura ↓' : 'How do you wake up? · Tap for your reading ↓'}
                    </p>
                    <div style={{display:'flex',gap:'0.5rem',marginBottom:'1.25rem'}}>
                      {(is_es
                        ? [{k:'bien',emoji:'😊',l:'Bien'},{k:'cansada',emoji:'😴',l:'Cansada'},{k:'niebla',emoji:'🌫️',l:'Con niebla'},{k:'regular',emoji:'😐',l:'Regular'}]
                        : [{k:'bien',emoji:'😊',l:'Good'},{k:'cansada',emoji:'😴',l:'Tired'},{k:'niebla',emoji:'🌫️',l:'Foggy'},{k:'regular',emoji:'😐',l:'Regular'}]
                      ).map(({k,emoji,l}) => (
                        <button key={k} className="estado-btn" onClick={()=>hacerCheckin(k)}>
                          <span style={{fontSize:'1.5rem',lineHeight:1}}>{emoji}</span>
                          <span style={{fontSize:'0.68rem'}}>{l}</span>
                        </button>
                      ))}
                    </div>
                  </>
                )}
              </>
            ) : lumiLoading ? (
              <div className="shimmer" style={{fontSize:'1rem',fontStyle:'italic',color:'rgba(255,255,255,0.4)',lineHeight:1.7}}>
                {is_es ? 'Preparando tu plan...' : 'Preparing your plan...'}
              </div>
            ) : (
              <p style={{fontSize:'1.05rem',fontStyle:'italic',color:'rgba(255,255,255,0.9)',lineHeight:1.75,marginBottom:'1.25rem'}}>{lumiMsg}</p>
            )}
            <a href="/lumera?tab=symptoms" style={{display:'block',marginTop:'-0.4rem',marginBottom:'1.1rem',fontFamily:'Montserrat,sans-serif',fontSize:'0.75rem',color:'rgba(255,255,255,0.4)',textDecoration:'none'}}>
              {is_es ? 'Registro detallado de síntomas →' : 'Detailed symptom log →'}
            </a>

            {mostrarPuertaRecordatorios && (
              <div style={{background:'rgba(255,255,255,0.06)',border:'1px solid rgba(201,147,90,0.25)',borderRadius:'1rem',padding:'1.1rem',marginBottom:'1.1rem'}}>
                {!mostrarCuestionarioHorarios ? (
                  <div>
                    <p style={{fontFamily:"'Cormorant Garamond',Georgia,serif",fontSize:'1.05rem',color:'rgba(255,255,255,0.9)',lineHeight:1.5,marginBottom:'0.9rem'}}>
                      {is_es
                        ? `¿Me dejas ayudarte a alcanzar tu objetivo antes, ajustando tus horas de comida, qué comer y en qué orden?`
                        : `Will you let me help you reach your goal sooner, by adjusting your meal times, what to eat and in what order?`}
                    </p>
                    <div style={{display:'flex',gap:'0.6rem'}}>
                      <button onClick={()=>setMostrarCuestionarioHorarios(true)} style={{flex:1,background:'#C9935A',color:'white',border:'none',borderRadius:'0.75rem',padding:'0.7rem',fontFamily:'Montserrat,sans-serif',fontWeight:600,fontSize:'0.85rem',cursor:'pointer'}}>
                        {is_es ? 'Sí, ayúdame' : 'Yes, help me'}
                      </button>
                      <button onClick={rechazarRecordatorios} style={{flex:1,background:'none',border:'1px solid rgba(201,147,90,0.3)',borderRadius:'0.75rem',padding:'0.7rem',fontFamily:'Montserrat,sans-serif',fontSize:'0.85rem',color:'rgba(255,255,255,0.55)',cursor:'pointer'}}>
                        {is_es ? 'Ahora no' : 'Not now'}
                      </button>
                    </div>
                  </div>
                ) : (
                  <div>
                    <p style={{fontFamily:'Montserrat,sans-serif',fontSize:'0.7rem',fontWeight:700,color:'#A06030',letterSpacing:'1px',textTransform:'uppercase',marginBottom:'0.9rem'}}>
                      {is_es ? '¿A qué hora sueles...' : 'What time do you usually...'}
                    </p>
                    {[
                      { label: is_es ? 'Desayunar' : 'Have breakfast', val: horaDesayuno, set: setHoraDesayuno },
                      { label: is_es ? 'Comer' : 'Have lunch', val: horaComida, set: setHoraComida },
                      { label: is_es ? 'Cenar' : 'Have dinner', val: horaCena, set: setHoraCena },
                    ].map(({label,val,set}) => (
                      <div key={label} style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'0.7rem'}}>
                        <label style={{fontFamily:'Montserrat,sans-serif',fontSize:'0.85rem',color:'rgba(255,255,255,0.85)'}}>{label}</label>
                        <input type="time" value={val} onChange={e=>set(e.target.value)} style={{padding:'0.4rem 0.6rem',borderRadius:'0.5rem',border:'1px solid rgba(201,147,90,0.3)',fontSize:'0.85rem',background:'white'}}/>
                      </div>
                    ))}
                    <button onClick={activarRecordatorios} disabled={guardandoRecordatorios} style={{width:'100%',background:'#C9935A',color:'white',border:'none',borderRadius:'0.75rem',padding:'0.75rem',fontFamily:'Montserrat,sans-serif',fontWeight:600,fontSize:'0.85rem',cursor:'pointer',marginTop:'0.4rem'}}>
                      {guardandoRecordatorios ? (is_es?'Activando...':'Activating...') : (is_es ? 'Activar mis recordatorios' : 'Activate my reminders')}
                    </button>
                  </div>
                )}
              </div>
            )}

            <button onClick={()=>setPlanVisible(!planVisible)} style={{width:'100%',background:'rgba(201,147,90,0.15)',border:'1px solid rgba(201,147,90,0.3)',borderRadius:'0.75rem',padding:'0.75rem',color:'#C9935A',fontFamily:'Montserrat,sans-serif',fontSize:'0.85rem',fontWeight:600,cursor:'pointer',transition:'all 0.2s ease'}}>
              {(() => {
                const tp = (planGenerado || plan).length;
                const h = planHecho.filter(x => x < tp).length;
                const c = tp && !planLoading && h > 0 ? ` · ${h}/${tp}` : '';
                return planVisible
                  ? (is_es ? `▲ Ocultar plan de hoy${c}` : `▲ Hide today's plan${c}`)
                  : (is_es ? `✦ Ver mi plan de hoy${c}` : `✦ See my plan for today${c}`);
              })()}
            </button>
            {(() => {
              const objetivoKcal = getObjetivoKcalHoy();
              return objetivoKcal && (
                <p style={{fontFamily:'Montserrat,sans-serif',fontSize:'0.65rem',color:'rgba(255,255,255,0.3)',textAlign:'center',marginTop:'0.4rem',marginBottom:0}}>
                  {is_es ? `Objetivo diario de referencia: ~${objetivoKcal} kcal` : `Reference daily target: ~${objetivoKcal} kcal`}
                </p>
              );
            })()}

            {/* PLAN DEL DIA */}
            {planVisible && (
              <div style={{marginTop:'1rem',borderTop:'1px solid rgba(201,147,90,0.2)',paddingTop:'1rem'}}>
                {planLoading ? (
                  <div className="shimmer" style={{color:'rgba(255,255,255,0.4)',fontFamily:'Montserrat,sans-serif',fontSize:'0.85rem',padding:'0.5rem 0'}}>
                    {is_es ? 'Preparando tu plan personalizado...' : 'Preparing your personalised plan...'}
                  </div>
                ) : (planGenerado || plan).map((p, i) => (
                  <div key={i} style={{marginBottom:'1rem',paddingBottom:'0.85rem',borderBottom:i<(planGenerado||plan).length-1?'1px solid rgba(255,255,255,0.06)':'none'}}>
                    <div onClick={()=>togglePlanItem(i)} style={{display:'flex',alignItems:'flex-start',gap:'0.6rem',marginBottom:'0.25rem',cursor:'pointer'}}>
                      <span style={{width:'22px',height:'22px',borderRadius:'50%',flexShrink:0,display:'flex',alignItems:'center',justifyContent:'center',fontSize:'0.8rem',border:'1.5px solid '+(planHecho.includes(i)?'#C9935A':'rgba(255,255,255,0.3)'),background:planHecho.includes(i)?'#C9935A':'transparent',color:'white',transition:'all 0.2s ease'}}>{planHecho.includes(i)?'✓':''}</span>
                      <span style={{fontSize:'0.98rem',color:planHecho.includes(i)?'rgba(255,255,255,0.5)':'rgba(255,255,255,0.95)',lineHeight:1.5,flex:1,fontWeight:500,textDecoration:planHecho.includes(i)?'line-through':'none',transition:'all 0.2s ease'}}>{p.accion}</span>
                    </div>
                    <div style={{marginLeft:'1.7rem',fontSize:'0.75rem',fontFamily:'Montserrat,sans-serif',color:'rgba(255,255,255,0.45)',lineHeight:1.6,marginBottom:(p.etiqueta || p.link)?'0.4rem':'0'}}>
                      {p.ciencia}
                    </div>
                    {p.etiqueta && (
                      <div style={{marginLeft:'1.7rem',fontFamily:"'Cormorant Garamond',Georgia,serif",fontStyle:'italic',fontSize:'0.72rem',color:'#C9935A',marginBottom:p.link?'0.4rem':'0'}}>
                        {p.etiqueta}
                      </div>
                    )}
                    {p.link && (
                      <div style={{marginLeft:'1.7rem'}}>
                        <span onClick={()=>window.location.href=p.link} style={{fontSize:'0.75rem',fontFamily:'Montserrat,sans-serif',color:'#C9935A',cursor:'pointer',fontWeight:600}}>
                          {p.linkLabel}
                        </span>
                      </div>
                    )}
                  </div>
                ))}
                {!planLoading && (planGenerado || plan).length > 0 && planHecho.filter(x => x < (planGenerado || plan).length).length === (planGenerado || plan).length && (
                  <div style={{marginTop:'0.25rem',padding:'0.6rem 0.75rem',background:'rgba(201,147,90,0.12)',border:'1px solid rgba(201,147,90,0.3)',borderRadius:'0.75rem',fontFamily:'Montserrat,sans-serif',fontSize:'0.8rem',color:'#C9935A',fontWeight:600}}>
                    {is_es ? '✦ Plan de hoy completado. Tu constancia es la que cambia tu biología.' : '✦ Today\'s plan complete. Consistency is what changes your biology.'}
                  </div>
                )}
                {!planLoading && (planGenerado || plan).length > 0 && planHecho.filter(x => x < (planGenerado || plan).length).length === (planGenerado || plan).length && (
                  <div style={{marginTop:'0.6rem',padding:'0.9rem 1rem',background:'linear-gradient(135deg,rgba(13,61,61,0.95),rgba(13,61,61,0.85))',borderRadius:'0.75rem'}}>
                    <div style={{fontFamily:'Montserrat,sans-serif',fontSize:'0.6rem',fontWeight:700,letterSpacing:'2px',color:'#C9935A',textTransform:'uppercase',marginBottom:'0.4rem'}}>
                      {is_es ? '✦ Descubrimiento desbloqueado' : '✦ Discovery unlocked'}
                    </div>
                    <p style={{fontSize:'0.9rem',color:'rgba(255,255,255,0.92)',lineHeight:1.65,fontFamily:"'Cormorant Garamond',Georgia,serif",fontStyle:'italic',margin:0}}>
                      {(is_es ? DESCUBRIMIENTOS_ES : DESCUBRIMIENTOS_EN)[new Date().getDate() % DESCUBRIMIENTOS_ES.length]}
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* TU FOCO DE HOY — 1 problema · 1 acción · 1 porqué · 1 CTA */}
          {checkinHecho && !planLoading && (planGenerado || plan)[0] && (
            <div className={`fade d2 ${visible?'in':''}`} style={{background:'rgba(255,255,255,0.9)',border:'1px solid rgba(201,147,90,0.2)',borderRadius:'1.25rem',backdropFilter:'blur(8px)',padding:'1.25rem',marginBottom:'1.25rem'}}>
              <div style={{fontFamily:'Montserrat,sans-serif',fontSize:'0.65rem',fontWeight:700,color:'rgba(13,61,61,0.4)',letterSpacing:'2px',textTransform:'uppercase',marginBottom:'0.75rem'}}>
                {is_es ? 'Tu foco de hoy' : 'Your focus today'}
              </div>
              <p style={{fontFamily:"'Cormorant Garamond',Georgia,serif",fontSize:'1.15rem',color:'#0D3D3D',lineHeight:1.4,marginBottom:'0.4rem'}}>
                {(planGenerado || plan)[0].accion}
              </p>
              <p style={{fontFamily:'Montserrat,sans-serif',fontSize:'0.78rem',color:'rgba(13,61,61,0.5)',lineHeight:1.5,marginBottom:(planGenerado || plan)[0].etiqueta ? '0.35rem' : '1rem'}}>
                {(planGenerado || plan)[0].ciencia}
              </p>
              {(planGenerado || plan)[0].etiqueta && (
                <p style={{fontFamily:"'Cormorant Garamond',Georgia,serif",fontStyle:'italic',fontSize:'0.75rem',color:'#A06030',marginBottom:'1rem'}}>
                  {(planGenerado || plan)[0].etiqueta}
                </p>
              )}
              <button onClick={()=>togglePlanItem(0)} style={{width:'100%',background:planHecho.includes(0)?'rgba(201,147,90,0.15)':'#C9935A',color:planHecho.includes(0)?'#A06030':'white',border:'none',borderRadius:'0.75rem',padding:'0.75rem',fontFamily:'Montserrat,sans-serif',fontWeight:600,fontSize:'0.85rem',cursor:'pointer'}}>
                {planHecho.includes(0) ? (is_es ? '✓ Hecho' : '✓ Done') : (is_es ? 'Empezar →' : 'Start →')}
              </button>
            </div>
          )}

          {/* TU RITUAL — secuencia guiada, no biblioteca. Revelado progresivo: solo tras registrar hoy. */}
          {checkinHecho && (
          <div className={`fade d2 ${visible?'in':''}`} style={{background:'rgba(255,255,255,0.9)',border:'1px solid rgba(201,147,90,0.2)',borderRadius:'1.25rem',backdropFilter:'blur(8px)',padding:'1.25rem',marginBottom:'1.25rem'}}>
            <div style={{fontFamily:'Montserrat,sans-serif',fontSize:'0.65rem',fontWeight:700,color:'rgba(13,61,61,0.4)',letterSpacing:'2px',textTransform:'uppercase',marginBottom:'0.5rem'}}>
              {is_es ? `Tu ritual · ${Math.max(1, ritualHecho.length)}/4` : `Your ritual · ${Math.max(1, ritualHecho.length)}/4`}
            </div>
            {[
              { label: is_es?'Respiración':'Breathing', sub: is_es?'1 minuto guiado':'1 guided minute', onClick: () => { marcarRitualHecho(0); setCalmaActiva(true); } },
              { label: is_es?'Suelo pélvico':'Pelvic floor', sub: is_es?'10 contracciones de 5 segundos, donde estés':'10 five-second contractions, wherever you are', onClick: () => marcarRitualHecho(1), masInfo:'/lumera?tab=exercise' },
              { label: is_es?'Movimiento':'Movement', sub: is_es?'Tu rutina de hoy':'Your routine today', onClick: () => { marcarRitualHecho(2); window.location.href='/lumera?tab=exercise'; } },
              { label: is_es?'Nutrición':'Nutrition', sub: is_es?'Tu menú de hoy':'Your menu today', onClick: () => { marcarRitualHecho(3); window.location.href='/lumera?tab=nutrition'; } },
            ].map((paso, i) => (
              <div key={i} style={{display:'flex',alignItems:'center',gap:'0.6rem',padding:'0.6rem 0',borderBottom:i<3?'1px solid rgba(201,147,90,0.12)':'none'}}>
                <div onClick={paso.onClick} style={{display:'flex',alignItems:'center',gap:'0.75rem',flex:1,cursor:'pointer'}}>
                  <span style={{width:'26px',height:'26px',borderRadius:'50%',flexShrink:0,display:'flex',alignItems:'center',justifyContent:'center',fontSize:'0.8rem',fontWeight:700,border:'1.5px solid '+(ritualHecho.includes(i)?'#C9935A':'rgba(201,147,90,0.3)'),background:ritualHecho.includes(i)?'#C9935A':'transparent',color:ritualHecho.includes(i)?'white':'#A06030'}}>{ritualHecho.includes(i) ? '✓' : i+1}</span>
                  <div>
                    <div style={{fontSize:'0.9rem',fontWeight:600,color:'#0D3D3D',fontFamily:"'Cormorant Garamond',serif"}}>{paso.label}</div>
                    <div style={{fontSize:'0.72rem',color:'rgba(13,61,61,0.45)',fontFamily:'Montserrat,sans-serif'}}>{paso.sub}</div>
                  </div>
                </div>
                {paso.masInfo && (
                  <span onClick={()=>window.location.href=paso.masInfo} style={{fontSize:'0.68rem',color:'#C9935A',fontFamily:'Montserrat,sans-serif',cursor:'pointer',whiteSpace:'nowrap'}}>
                    {is_es ? 'más info →' : 'more info →'}
                  </span>
                )}
              </div>
            ))}
          </div>
          )}

          {/* TU PROGRESO — gráfica/meta + silueta en una sola card */}
          <div className={`fade d1 ${visible?'in':''}`} style={{background:'rgba(255,255,255,0.9)',border:'1px solid rgba(201,147,90,0.2)',borderRadius:'1.25rem',backdropFilter:'blur(8px)',overflow:'hidden',marginBottom:'1.25rem'}}>
            <div style={{padding:'1.25rem'}}>
              {user?.objetivo && (
                <p style={{fontFamily:'Montserrat,sans-serif',fontSize:'0.65rem',fontWeight:700,color:'rgba(13,61,61,0.4)',letterSpacing:'1.5px',textTransform:'uppercase',marginBottom:'0.75rem'}}>
                  {is_es ? `Tu progreso · ${user.objetivo}` : `Your progress · ${user.objetivo}`}
                </p>
              )}
              <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'0.9rem'}}>
                <p style={{fontFamily:"'Cormorant Garamond',Georgia,serif",fontSize:'1rem',color:'#0D3D3D',margin:0}}>
                  {is_es
                    ? `Racha de ${rachaDias} ${rachaDias === 1 ? 'día' : 'días'} · ${diasCompletadosSemana}/7 esta semana`
                    : `${rachaDias}-day streak · ${diasCompletadosSemana}/7 this week`}
                </p>
                <span onClick={()=>setProgresoDetalleVisible(!progresoDetalleVisible)} style={{fontFamily:'Montserrat,sans-serif',fontSize:'0.72rem',color:'#C9935A',fontWeight:600,cursor:'pointer',whiteSpace:'nowrap',marginLeft:'0.5rem'}}>
                  {progresoDetalleVisible ? (is_es ? '▲ Ocultar' : '▲ Hide') : (is_es ? 'Ver detalle →' : 'See detail →')}
                </span>
              </div>
              {progresoDetalleVisible && (!esObjetivoPeso ? (
                <TendenciaCard tipo={esObjetivoSueno ? 'sueno' : 'energia'} checkins={ultimosCheckins} is_es={is_es} bare />
              ) : !user?.pesoMeta ? (
                <div onClick={()=>setShowPesoModal(true)} style={{textAlign:'center',cursor:'pointer',padding:'0.5rem 0'}}>
                  <p style={{fontFamily:"'Cormorant Garamond',Georgia,serif",fontSize:'1.05rem',color:'#0D3D3D',marginBottom:'0.35rem'}}>
                    {is_es ? '✦ Definir mi meta' : '✦ Set my goal'}
                  </p>
                  <p style={{fontFamily:'Montserrat,sans-serif',fontSize:'0.75rem',color:'rgba(13,61,61,0.45)'}}>
                    {is_es ? 'Marca tu punto de partida y a dónde quieres llegar' : 'Mark your starting point and where you want to get to'}
                  </p>
                </div>
              ) : (() => {
                const total = Math.abs(user.pesoInicial - user.pesoMeta);
                const avance = Math.abs(user.pesoInicial - (user.peso || user.pesoInicial));
                const pct = total > 0 ? Math.min(100, Math.max(0, Math.round((avance/total)*100))) : 0;
                const fechaInicio = user.pesoFecha ? new Date(user.pesoFecha).toLocaleDateString(is_es?'es-ES':'en-GB', {month:'short', year:'2-digit'}) : '';
                return (
                  <div>
                    <p style={{fontFamily:'Montserrat,sans-serif',fontSize:'0.75rem',fontWeight:700,color:'#A06030',textAlign:'right',marginBottom:'0.9rem'}}>{pct}% {is_es?'recorrido':'done'}</p>
                    <div style={{position:'relative',height:'6px',background:'rgba(201,147,90,0.15)',borderRadius:'99px',margin:'1.5rem 0.5rem'}}>
                      <div style={{position:'absolute',left:0,top:0,height:'6px',width:`${pct}%`,background:'#C9935A',borderRadius:'99px',transition:'width 0.6s ease'}}/>
                      <div style={{position:'absolute',left:`calc(${pct}% - 8px)`,top:'-7px',width:'20px',height:'20px',borderRadius:'50%',background:'#C9935A',border:'3px solid white',boxShadow:'0 2px 8px rgba(201,147,90,0.5)',transition:'left 0.6s ease'}}/>
                    </div>
                    <div style={{display:'flex',justifyContent:'space-between',fontSize:'0.7rem',fontFamily:'Montserrat,sans-serif',color:'rgba(13,61,61,0.45)',marginBottom:'0.9rem'}}>
                      <span>{user.pesoInicial}kg {fechaInicio && `· ${fechaInicio}`}</span>
                      <span>{user.pesoMeta}kg</span>
                    </div>
                    <button onClick={()=>{setPesoInput(String(user.peso||''));setMetaInput(String(user.pesoMeta||''));setShowPesoModal(true);}} style={{width:'100%',background:'none',border:'1px solid rgba(201,147,90,0.25)',borderRadius:'0.6rem',padding:'0.5rem',fontFamily:'Montserrat,sans-serif',fontSize:'0.78rem',color:'#A06030',cursor:'pointer'}}>
                      {is_es ? '✎ Actualizar peso' : '✎ Update weight'}
                    </button>
                  </div>
                );
              })())}
            </div>
            <div onClick={()=>router.push('/escaner')} style={{display:'flex',justifyContent:'space-between',alignItems:'center',padding:'0.75rem 1.25rem',borderTop:'1px solid rgba(201,147,90,0.15)',cursor:'pointer'}}>
              <span style={{fontFamily:'Montserrat,sans-serif',fontSize:'0.78rem',color:'#A06030'}}>
                {is_es ? 'Tu Silueta Hormonal' : 'Your Hormonal Silhouette'}
              </span>
              <span style={{color:'#C9935A',fontSize:'0.85rem'}}>→</span>
            </div>
          </div>

          {/* VERDAD DE HOY — mito/verdad, 1 línea */}
          <div className={`fade d1 ${visible?'in':''}`} style={{background:'rgba(255,255,255,0.9)',border:'1px solid rgba(201,147,90,0.2)',borderRadius:'1.25rem',backdropFilter:'blur(8px)',padding:'1rem 1.25rem',marginBottom:'1.25rem'}}>
            <div style={{fontFamily:'Montserrat,sans-serif',fontSize:'0.6rem',fontWeight:700,color:'rgba(13,61,61,0.4)',letterSpacing:'2px',textTransform:'uppercase',marginBottom:'0.4rem'}}>
              {is_es ? '✦ Verdad de hoy' : '✦ Truth of the day'}
            </div>
            {/* TODO copy pendiente revisión Bibiana */}
            <p style={{fontFamily:"'Cormorant Garamond',Georgia,serif",fontSize:'0.95rem',color:'#0D3D3D',lineHeight:1.5,margin:0}}>
              {(is_es ? MITOS_VERDAD_ES : MITOS_VERDAD_EN)[new Date().getDate() % MITOS_VERDAD_ES.length]}
            </p>
          </div>

          {/* PREMIUM COMO SIGUIENTE PASO — valor primero, no "suscripción" */}
          {!user?.isPremium && diasRestantes > 1 && (
            <div onClick={()=>setShowPremiumModal(true)} className={`fade d1 ${visible?'in':''}`} style={{background:'rgba(255,255,255,0.9)',border:'1px solid rgba(201,147,90,0.25)',borderRadius:'1.25rem',padding:'1rem 1.25rem',marginBottom:'1.25rem',cursor:'pointer',display:'flex',justifyContent:'space-between',alignItems:'center'}}>
              <div>
                <div style={{fontSize:'0.95rem',fontWeight:600,color:'#0D3D3D',fontFamily:"'Cormorant Garamond',serif"}}>
                  {is_es ? 'Tu plan personalizado completo' : 'Your full personalised plan'}
                </div>
                <div style={{fontSize:'0.75rem',color:'rgba(13,61,61,0.5)',fontFamily:'Montserrat,sans-serif'}}>
                  {is_es ? 'Más claridad, un plan guiado paso a paso para ti' : 'More clarity, a step-by-step plan guided just for you'}
                </div>
              </div>
              <span style={{color:'#C9935A',fontSize:'1.1rem'}}>→</span>
            </div>
          )}

                    {showPesoModal && (
            <div style={{position:'fixed',inset:0,background:'rgba(13,61,61,0.6)',zIndex:250,display:'flex',alignItems:'flex-end',justifyContent:'center'}} onClick={()=>setShowPesoModal(false)}>
              <div style={{background:'#FBF7F0',borderRadius:'1.5rem 1.5rem 0 0',padding:'1.75rem 1.5rem',width:'100%',maxWidth:'520px'}} onClick={e=>e.stopPropagation()}>
                <h2 style={{fontFamily:"'Cormorant Garamond',Georgia,serif",fontSize:'1.3rem',color:'#0D3D3D',marginBottom:'1rem',textAlign:'center'}}>
                  {is_es ? 'Tu peso y tu meta' : 'Your weight and goal'}
                </h2>
                <label style={{fontFamily:'Montserrat,sans-serif',fontSize:'0.75rem',color:'rgba(13,61,61,0.5)'}}>{is_es?'Peso actual (kg)':'Current weight (kg)'}</label>
                <input type="number" value={pesoInput} onChange={e=>setPesoInput(e.target.value)} placeholder={is_es?'ej. 72.5':'e.g. 72.5'} style={{width:'100%',padding:'0.7rem',borderRadius:'0.6rem',border:'1px solid rgba(201,147,90,0.3)',marginTop:'0.3rem',marginBottom:'0.9rem',fontSize:'1rem'}}/>
                <label style={{fontFamily:'Montserrat,sans-serif',fontSize:'0.75rem',color:'rgba(13,61,61,0.5)'}}>{is_es?'Peso meta (kg)':'Goal weight (kg)'}</label>
                <input type="number" value={metaInput} onChange={e=>setMetaInput(e.target.value)} placeholder={is_es?'ej. 65':'e.g. 65'} style={{width:'100%',padding:'0.7rem',borderRadius:'0.6rem',border:'1px solid rgba(201,147,90,0.3)',marginTop:'0.3rem',marginBottom:'1.25rem',fontSize:'1rem'}}/>
                <button onClick={guardarPeso} disabled={guardandoPeso} style={{width:'100%',background:'#C9935A',color:'white',border:'none',borderRadius:'0.75rem',padding:'0.85rem',fontFamily:'Montserrat,sans-serif',fontWeight:700,cursor:'pointer',marginBottom:'0.6rem'}}>
                  {guardandoPeso ? (is_es?'Guardando...':'Saving...') : (is_es?'Guardar':'Save')}
                </button>
                <button onClick={()=>setShowPesoModal(false)} style={{width:'100%',background:'none',border:'none',color:'rgba(13,61,61,0.35)',fontFamily:'Montserrat,sans-serif',fontSize:'0.8rem',cursor:'pointer',padding:'0.4rem'}}>
                  {is_es?'Cancelar':'Cancel'}
                </button>
              </div>
            </div>
          )}

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

          {/* HABLA CON TU ASESORA + MOMENTO DE CALMA — tiles chicos en fila */}
          <div className={`fade d1 ${visible?'in':''}`} style={{display:'flex',gap:'0.75rem',marginBottom:'0.75rem'}}>
            <div onClick={()=>{ setShowLumiChat(true); if (lumiChatMessages.length === 0) setLumiChatMessages([{role:'assistant', content: lumiMsg}]); }} style={{flex:1,background:'rgba(255,255,255,0.9)',border:'1px solid rgba(201,147,90,0.2)',borderRadius:'1.25rem',backdropFilter:'blur(8px)',padding:'1rem',cursor:'pointer',textAlign:'center'}}>
              <img src="/images/lumi.png" alt="LUMI" style={{width:'40px',height:'40px',objectFit:'cover',borderRadius:'50%',marginBottom:'0.4rem'}} onError={e=>{e.target.style.display='none'}}/>
              <div style={{fontSize:'0.85rem',fontWeight:600,color:'#0D3D3D',fontFamily:"'Cormorant Garamond',serif"}}>
                {is_es ? 'Habla con tu asesora' : 'Talk to your advisor'}
              </div>
            </div>
            <div onClick={() => setCalmaActiva(true)} style={{flex:1,background:'rgba(255,255,255,0.9)',border:'1px solid rgba(201,147,90,0.2)',borderRadius:'1.25rem',backdropFilter:'blur(8px)',padding:'1rem',cursor:'pointer',textAlign:'center'}} role="button" aria-label={is_es ? 'Abrir tu minuto de calma' : 'Open your calm minute'}>
              <AnilloVivo info={infoCiclo} is_es={is_es} racha={rachaDias} size={64} />
              <p style={{textAlign:'center',fontFamily:'Montserrat,sans-serif',fontSize:'0.6rem',letterSpacing:'1px',color:'#A06030',textTransform:'uppercase',margin:'0.35rem 0 0'}}>
                {is_es ? 'Momento de calma' : 'Calm minute'}
              </p>
            </div>
          </div>
          {calmaActiva && <CalmaOverlay is_es={is_es} onClose={() => setCalmaActiva(false)} />}
          <div className={`fade d1 ${visible?'in':''}`} style={{marginBottom:'1.25rem'}}>
            <BarraSemana diasCompletados={diasCompletadosSemana} diasTotales={7} is_es={is_es} />
            {(diasCompletadosSemana === 3 || diasCompletadosSemana === 7) && (
              <p style={{textAlign:'center',fontFamily:"'Cormorant Garamond',Georgia,serif",fontSize:'0.85rem',fontStyle:'italic',color:'#A06030',marginTop:'0.6rem'}}>
                {diasCompletadosSemana === 7
                  ? (is_es ? '✦ Semana completa. Esto es lo que cambia tu biología.' : '✦ Full week. This is what changes your biology.')
                  : (is_es ? '✦ Día 3 — tu constancia ya se nota.' : '✦ Day 3 — your consistency is already showing.')}
              </p>
            )}
          </div>

          {/* BLOQUE 3 — TU SEMANA + TOOLS */}
          <div className={`fade d4 ${visible?'in':''}`} style={{marginBottom:'1.25rem'}}>

            {/* ¿CÓMO USAR LUMERA? — acordeón cerrado por defecto */}
            <div onClick={()=>setUsoVisible(!usoVisible)} style={{display:'flex',justifyContent:'space-between',alignItems:'center',cursor:'pointer',marginBottom:'0.75rem'}}>
              <span style={{fontFamily:'Montserrat,sans-serif',fontSize:'0.65rem',fontWeight:700,color:'rgba(13,61,61,0.4)',letterSpacing:'2px',textTransform:'uppercase'}}>
                {is_es ? '¿Cómo usar Lumera?' : 'How to use Lumera?'}
              </span>
              <span style={{fontSize:'0.75rem',color:'#C9935A',fontWeight:600}}>{usoVisible ? '▲' : '▼'}</span>
            </div>
            {usoVisible && (
              <div style={{marginBottom:'1.5rem'}}>
                {[
                  is_es ? 'Registra cómo te sientes' : 'Log how you feel',
                  is_es ? 'Marca tu plan de hoy' : "Check off today's plan",
                  is_es ? 'Pregunta a tu asesora' : 'Ask your advisor',
                ].map((step, i) => (
                  <div key={i} style={{display:'flex',alignItems:'center',gap:'0.75rem',marginBottom:'0.6rem'}}>
                    <div style={{width:'24px',height:'24px',borderRadius:'50%',background:'linear-gradient(135deg,#C9935A,#A06030)',color:'white',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'0.7rem',fontWeight:700,flexShrink:0}}>{i+1}</div>
                    <span style={{fontSize:'0.85rem',color:'rgba(13,61,61,0.7)',fontFamily:'Montserrat,sans-serif'}}>{step}</span>
                  </div>
                ))}
              </div>
            )}

            {/* RECURSOS — acordeón cerrado por defecto (antes "Guías") */}
            <div onClick={()=>setRecursosVisible(!recursosVisible)} style={{display:'flex',justifyContent:'space-between',alignItems:'center',cursor:'pointer',marginBottom:'0.75rem'}}>
              <span style={{fontFamily:'Montserrat,sans-serif',fontSize:'0.65rem',fontWeight:700,color:'rgba(13,61,61,0.4)',letterSpacing:'2px',textTransform:'uppercase'}}>
                {is_es ? 'Recursos' : 'Resources'}
              </span>
              <span style={{fontSize:'0.75rem',color:'#C9935A',fontWeight:600}}>{recursosVisible ? '▲' : '▼'}</span>
            </div>
            {recursosVisible && (
              <div style={{display:'flex',flexDirection:'column',gap:'0.6rem',marginBottom:'1.5rem'}}>
                {[
                  {es:'7 días para sentirte menos hinchada y con menos antojos', en:'7 days to feel less bloated and fewer cravings', href:'/desinflamate'},
                  {es:'7 noches para calmar tu ansiedad y volver a dormir', en:'7 nights to calm your anxiety and sleep again', href:'/duerme'},
                  {es:'3 Hábitos GLP-1 Naturales que Cambian tu Energía', en:'3 Natural GLP-1 Habits for Stable Energy', href:'/guia-glp1'},
                  {es:'Lente Alquímica — analiza tu plato', en:'Alchemical Lens — analyse your plate', href:'/lumera?tab=chat'},
                ].map((g,i)=>(
                  <div key={i} onClick={()=>{ if (g.href.includes('/lumera')) window.location.href = g.href; else router.push(g.href); }} style={{background:'white',border:'1px solid rgba(201,147,90,0.15)',borderRadius:'0.85rem',padding:'0.8rem 1rem',cursor:'pointer',fontFamily:'Montserrat,sans-serif',fontSize:'0.82rem',color:'#0D3D3D',display:'flex',justifyContent:'space-between',alignItems:'center'}}>
                    <span>{is_es?g.es:g.en}</span>
                    <span style={{color:'#C9935A'}}>→</span>
                  </div>
                ))}
              </div>
            )}

            {/* Tools grid */}
            <div onClick={()=>setToolsVisible(!toolsVisible)} style={{display:'flex',justifyContent:'space-between',alignItems:'center',cursor:'pointer',marginBottom:'0.75rem'}}>
              <span style={{fontFamily:'Montserrat,sans-serif',fontSize:'0.65rem',fontWeight:700,color:'rgba(13,61,61,0.4)',letterSpacing:'2px',textTransform:'uppercase'}}>
                {is_es ? 'Tus herramientas' : 'Your tools'}
              </span>
              <span style={{fontSize:'0.75rem',color:'#C9935A',fontWeight:600}}>{toolsVisible ? '▲' : '▼'}</span>
            </div>
            <div style={{display:toolsVisible?'grid':'none',gridTemplateColumns:'1fr 1fr',gap:'0.75rem'}}>
              {(is_es ? [
                {img:"/images/kling_20260321_作品__Extremely_4730_1.png", title:'Nutrición', sub:'Tu menú de hoy', route:'/lumera?tab=nutrition'},
                {img:"/images/kling_20260321_作品_Extremely__4896_1.png", title:'Ejercicio', sub:'Tu rutina de hoy', route:'/lumera?tab=exercise'},
              ] : [
                {img:"/images/kling_20260321_作品__Extremely_4730_1.png", title:'Nutrition', sub:'Your menu today', route:'/lumera?tab=nutrition'},
                {img:"/images/kling_20260321_作品_Extremely__4896_1.png", title:'Exercise', sub:'Your routine today', route:'/lumera?tab=exercise'},
              ]).map((t,i) => (
                <div key={i} className="tool-card" style={bloqueado?{opacity:0.55,position:'relative'}:{}} onClick={()=>{ if(bloqueado){setShowPremiumModal(true);return;} if(t.route==='__lumi_chat__'){setShowLumiChat(true);if(lumiChatMessages.length===0)setLumiChatMessages([{role:'assistant',content:lumiMsg}]);} else if(t.route.includes('/lumera')) window.location.href=t.route; else router.push(t.route); }}>
                  {bloqueado && <span style={{position:'absolute',top:'0.5rem',right:'0.5rem',fontSize:'0.75rem'}}>🔒</span>}
                  <img src={t.img} alt={t.title} style={{width:'48px',height:'48px',objectFit:'cover',borderRadius:'50%',marginBottom:'0.4rem'}} onError={e=>{e.target.style.display='none'}}/>
                  <div style={{fontSize:'0.95rem',fontWeight:600,color:'#0D3D3D',marginBottom:'0.1rem'}}>{t.title}</div>
                  <div style={{fontSize:'0.7rem',fontFamily:'Montserrat,sans-serif',color:'rgba(13,61,61,0.4)'}}>{t.sub}</div>
                </div>
              ))}
            </div>
          </div>

          {user?.isPremium && (
            <div className={`fade d4 ${visible?'in':''}`} style={{textAlign:'center',marginBottom:'1.25rem'}}>
              <span onClick={()=>setShowGestion(!showGestion)} style={{fontSize:'0.7rem',fontFamily:'Montserrat,sans-serif',color:'rgba(13,61,61,0.35)',cursor:'pointer'}}>
                {is_es?'✦ Premium activa · Gestionar suscripción':'✦ Premium active · Manage subscription'}
              </span>
              {showGestion && (
                <div style={{marginTop:'0.6rem'}}>
                  <button onClick={handleCancelSubscription} style={{background:'none',border:'1px solid rgba(201,147,90,0.25)',borderRadius:'0.5rem',padding:'0.45rem 1rem',fontSize:'0.72rem',color:'rgba(13,61,61,0.45)',cursor:'pointer'}}>
                    {is_es?'Cancelar suscripción':'Cancel subscription'}
                  </button>
                </div>
              )}
            </div>
          )}

          {/* BANNER PWA INSTALACION — discreto, dismissable */}
          {!pwaOculto && typeof window !== 'undefined' && !window.matchMedia('(display-mode: standalone)').matches && !window.navigator?.standalone && (
            <div className={`fade d5 ${visible?'in':''}`} style={{background:'rgba(201,147,90,0.06)',border:'1px solid rgba(201,147,90,0.2)',borderRadius:'1rem',marginBottom:'1.25rem',overflow:'hidden'}}>
              <div onClick={()=>setPwaInstruccionesVisibles(!pwaInstruccionesVisibles)} style={{display:'flex',justifyContent:'space-between',alignItems:'center',padding:'0.75rem 1rem',cursor:'pointer'}}>
                <span style={{fontFamily:'Montserrat,sans-serif',fontSize:'0.75rem',color:'#A06030'}}>
                  {is_es ? '📲 Llévame contigo — instala Lumera' : '📲 Take me with you — install Lumera'}
                </span>
                <span onClick={(e)=>{ e.stopPropagation(); setPwaOculto(true); try { localStorage.setItem('lumera_pwa_hide','1'); } catch(e) {} }} style={{cursor:'pointer',color:'rgba(13,61,61,0.35)',fontSize:'0.95rem',padding:'0 0.25rem'}}>✕</span>
              </div>
              {pwaInstruccionesVisibles && (
                <div style={{padding:'0 1.1rem 1.1rem'}}>
                  <p style={{fontSize:'0.85rem',color:'rgba(13,61,61,0.6)',fontStyle:'italic',marginBottom:'0.9rem',lineHeight:1.6}}>
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

          {/* MODAL MÁS */}
          {showMasMenu && (
            <div style={{position:'fixed',inset:0,background:'rgba(0,0,0,0.7)',zIndex:200,display:'flex',alignItems:'flex-end',justifyContent:'center'}} onClick={()=>setShowMasMenu(false)}>
              <div style={{background:'#FBF7F0',borderRadius:'1.5rem 1.5rem 0 0',padding:'2rem 1.5rem',width:'100%',maxWidth:'520px'}} onClick={e=>e.stopPropagation()}>
                <div style={{textAlign:'center',marginBottom:'1.5rem'}}>
                  <div style={{fontFamily:'Montserrat,sans-serif',fontSize:'0.65rem',fontWeight:700,color:'#C9935A',letterSpacing:'2px',marginBottom:'0.5rem'}}>✦ EXPLORAR</div>
                  <h2 style={{fontSize:'1.4rem',fontWeight:600,color:'#0D3D3D',fontFamily:"'Cormorant Garamond',serif"}}>
                    {is_es ? 'Tu espacio completo' : 'Your full space'}
                  </h2>
                </div>
                <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'0.75rem',marginBottom:'1rem'}}>
                  {[
                    {img:'/images/carta_intimidad.png', es:'Bienestar íntimo', en:'Intimate wellness', route:null, sub_es:'Próximamente', sub_en:'Coming soon'},
                    {img:'/images/mitos.png', es:'Mitos', en:'Myths', route:'/lumera?tab=myths', sub_es:'Lo que no te han contado', sub_en:'What nobody told you'},
                    {img:'/images/consejos.png', es:'Consejos', en:'Tips', route:'/lumera?tab=tips', sub_es:'Tips de LUMI para hoy', sub_en:'LUMI tips for today'},
                    {img:'/images/modo_cueva.png', es:'Período', en:'Period', route:'/lumera?tab=period', sub_es:'Seguimiento de tu ciclo', sub_en:'Track your cycle'},
                    {img:'/images/sintomas.png', es:'Síntomas', en:'Symptoms', route:'/lumera?tab=symptoms', sub_es:'Registra cómo te sientes', sub_en:'Log how you feel'},
                    {img:'/images/escaner_preview.png', es:'Comunidad', en:'Community', route:'/lumera?tab=community', sub_es:'Historias y apoyo real', sub_en:'Real stories & support'},
                  ].map((item,i)=>(
                    <div key={i} onClick={()=>{ if(!item.route){return;} if(bloqueado){setShowMasMenu(false);setShowPremiumModal(true);return;} setShowMasMenu(false); window.location.href=item.route;}} style={{background:'white',border:'1px solid rgba(201,147,90,0.15)',borderRadius:'1rem',padding:'1rem',display:'flex',alignItems:'center',gap:'0.75rem',cursor:'pointer',opacity:bloqueado?0.55:1,position:'relative'}}>
                      {bloqueado && <span style={{position:'absolute',top:'0.5rem',right:'0.5rem',fontSize:'0.75rem'}}>🔒</span>}
                      <img src={item.img} style={{width:'40px',height:'40px',borderRadius:'50%',objectFit:'cover',flexShrink:0}} onError={e=>{e.target.style.display='none'}}/>
                      <div>
                        <div style={{fontSize:'0.88rem',fontWeight:600,color:'#0D3D3D',fontFamily:"'Cormorant Garamond',serif"}}>{is_es?item.es:item.en}</div>
                        <div style={{fontSize:'0.65rem',fontFamily:'Montserrat,sans-serif',color:'rgba(13,61,61,0.45)'}}>{is_es?item.sub_es:item.sub_en}</div>
                      </div>
                    </div>
                  ))}
                </div>
                <button onClick={()=>setShowMasMenu(false)} style={{width:'100%',background:'none',border:'none',color:'rgba(13,61,61,0.35)',fontFamily:'Montserrat,sans-serif',fontSize:'0.8rem',cursor:'pointer',padding:'0.5rem'}}>
                  {is_es?'Cerrar':'Close'}
                </button>
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
            {img:'/images/mitos.png', label:'Más', route:'__mas_menu__'},
            {img:'/images/lumi.png', label:'LUMI', route:'/lumera?tab=chat'},
            {img:"/images/kling_20260321_作品_Extremely__4896_1.png", label:'Ejercicio', route:'/lumera?tab=exercise'},
          ] : [
            {img:"/images/kling_20260321_作品_Extremely__4837_0.png", label:'Home', route:'/dashboard'},
            {img:"/images/kling_20260321_作品__Extremely_4730_1.png", label:'Nutrition', route:'/lumera?tab=nutrition'},
            {img:'/images/sintomas.png', label:'Síntomas', route:'/lumera?tab=symptoms'},
            {img:'/images/mitos.png', label:'Más', route:'__mas_menu__'},
            {img:'/images/lumi.png', label:'LUMI', route:'/lumera?tab=chat'},
            {img:"/images/kling_20260321_作品_Extremely__4896_1.png", label:'Exercise', route:'/lumera?tab=exercise'},
          ]).map((n,i) => (
            <div key={i} className="nav-item" onClick={()=>{ if(n.route==='__lumi_chat__'){setShowLumiChat(true);if(lumiChatMessages.length===0)setLumiChatMessages([{role:'assistant',content:lumiMsg}]);} else if(n.route==='__mas_menu__'){setShowMasMenu(true);} else if(n.route.includes('/lumera')) window.location.href=n.route; else router.push(n.route); }}>
              <img src={n.img} alt={n.label} style={{width:'28px',height:'28px',borderRadius:'50%',objectFit:'cover',border:n.route==='/dashboard'?'2px solid #C9935A':'2px solid transparent'}}/>
              <span style={{fontSize:'0.6rem',fontFamily:'Montserrat,sans-serif',color:n.route==='/dashboard'?'#C9935A':'rgba(13,61,61,0.4)',fontWeight:n.route==='/dashboard'?700:400}}>{n.label}</span>
            </div>
          ))}
        </div>

      </div>
    </>
  );
}
