'use client';
import { useState, useEffect, useMemo, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { createClient } from '@supabase/supabase-js';

function calcularEdad(fechaNacimientoStr) {
  if (!fechaNacimientoStr) return null;
  const fecha = new Date(fechaNacimientoStr + '-01');
  if (isNaN(fecha.getTime())) return null;
  const hoy = new Date();
  let edad = hoy.getFullYear() - fecha.getFullYear();
  const m = hoy.getMonth() - fecha.getMonth();
  if (m < 0 || (m === 0 && hoy.getDate() < fecha.getDate())) edad--;
  return edad > 0 && edad < 120 ? edad : null;
}

function mapActividad(texto) {
  const mapa = {
    'Sedentaria — poco o nada de movimiento': 'sedentary',
    'Algo activa — camino, subo escaleras': 'light',
    'Moderadamente activa — ejercicio 2-3 veces/semana': 'moderate',
    'Muy activa — entreno regularmente': 'active',
    'Sedentary — little or no movement': 'sedentary',
    'Lightly active — walking, stairs': 'light',
    'Moderately active — exercise 2-3x/week': 'moderate',
    'Very active — regular training': 'active',
  };
  return mapa[texto] || 'moderate';
}

function calcularBMI(weight, height) {
  if (!weight || !height || weight <= 0 || height <= 0) return null;
  const heightInMeters = height / 100;
  return parseFloat((weight / (heightInMeters * heightInMeters)).toFixed(2));
}

function calcularBMR(weight, height, age) {
  if (!weight || !height || !age) return null;
  return Math.round((10 * weight) + (6.25 * height) - (5 * age) - 161);
}

function calcularTDEE(bmr, activityLevel) {
  if (!bmr) return null;
  const multiplicadores = {
    sedentary: 1.2,
    light: 1.375,
    moderate: 1.55,
    active: 1.725,
    very_active: 1.9,
  };
  const m = multiplicadores[activityLevel] || 1.55;
  return Math.round(bmr * m);
}

function getImcInfo(imc, is_es) {
  if (!imc) return { label: '', color: '#C9935A' };
  if (imc < 18.5) return { label: is_es ? 'activar metabolismo' : 'activate metabolism', color: '#3B82F6' };
  if (imc < 25) return { label: is_es ? 'equilibrio óptimo' : 'optimal balance', color: '#2A7A4A' };
  if (imc < 30) return { label: is_es ? 'equilibrar hormonas' : 'balance hormones', color: '#F59E0B' };
  return { label: is_es ? 'plan intensivo' : 'intensive plan', color: '#EF4444' };
}

const primerPasoPorSintoma = (sintoma, is_es) => {
  const mapa = {
    'Cansancio constante': { es: 'Hoy: toma tu café antes de las 10h — después compite con tu cortisol natural y te deja más cansada, no menos.', en: 'Today: have your coffee before 10am — after that it competes with your natural cortisol and leaves you more tired, not less.' },
    'Constant fatigue': { es: 'Hoy: toma tu café antes de las 10h — después compite con tu cortisol natural y te deja más cansada, no menos.', en: 'Today: have your coffee before 10am — after that it competes with your natural cortisol and leaves you more tired, not less.' },
    'Antojos de dulce': { es: 'Hoy: una cucharada de vinagre de manzana diluido antes de comer corta el pico de glucosa que dispara el antojo de después.', en: 'Today: a spoon of diluted apple cider vinegar before eating blunts the glucose spike that triggers the craving afterwards.' },
    'Sugar cravings': { es: 'Hoy: una cucharada de vinagre de manzana diluido antes de comer corta el pico de glucosa que dispara el antojo de después.', en: 'Today: a spoon of diluted apple cider vinegar before eating blunts the glucose spike that triggers the craving afterwards.' },
    'Insomnio o despertar nocturno': { es: 'Hoy: cena al menos 3 horas antes de dormir — la digestión sube tu temperatura justo cuando tu cuerpo necesita bajarla para dormir profundo.', en: 'Today: have dinner at least 3 hours before bed — digestion raises your temperature right when your body needs to lower it for deep sleep.' },
    'Insomnia or night waking': { es: 'Hoy: cena al menos 3 horas antes de dormir — la digestión sube tu temperatura justo cuando tu cuerpo necesita bajarla para dormir profundo.', en: 'Today: have dinner at least 3 hours before bed — digestion raises your temperature right when your body needs to lower it for deep sleep.' },
    'Hinchazón': { es: 'Hoy: añade un plátano o aguacate a alguna comida — no es la sal lo que retiene agua, es la sal sin potasio.', en: 'Today: add a banana or avocado to a meal — it\'s not salt itself that retains water, it\'s salt without potassium.' },
    'Bloating': { es: 'Hoy: añade un plátano o aguacate a alguna comida — no es la sal lo que retiene agua, es la sal sin potasio.', en: 'Today: add a banana or avocado to a meal — it\'s not salt itself that retains water, it\'s salt without potassium.' },
    'Cambios de humor': { es: 'Hoy: busca luz natural antes de las 10h, no a mediodía — en esa ventana regula mejor tu cortisol y tu serotonina.', en: 'Today: get natural light before 10am, not at midday — that window regulates your cortisol and serotonin better.' },
    'Mood changes': { es: 'Hoy: busca luz natural antes de las 10h, no a mediodía — en esa ventana regula mejor tu cortisol y tu serotonina.', en: 'Today: get natural light before 10am, not at midday — that window regulates your cortisol and serotonin better.' },
    'Sofocos': { es: 'Hoy: en el próximo sofoco, respira 4 segundos al inhalar y 8 al exhalar — corta la respuesta de golpe de calor en segundos.', en: 'Today: at your next hot flash, breathe in for 4 seconds and out for 8 — it cuts the heat surge response in seconds.' },
    'Hot flashes': { es: 'Hoy: en el próximo sofoco, respira 4 segundos al inhalar y 8 al exhalar — corta la respuesta de golpe de calor en segundos.', en: 'Today: at your next hot flash, breathe in for 4 seconds and out for 8 — it cuts the heat surge response in seconds.' },
    'Bajo deseo sexual': { es: 'Hoy: prioriza el magnesio por la noche (almendras, cacao puro) — es el primer mineral que cae con el estrés, y afecta directo a tu deseo.', en: 'Today: prioritise magnesium at night (almonds, raw cacao) — it\'s the first mineral depleted by stress, and it directly affects desire.' },
    'Low libido': { es: 'Hoy: prioriza el magnesio por la noche (almendras, cacao puro) — es el primer mineral que cae con el estrés, y afecta directo a tu deseo.', en: 'Today: prioritise magnesium at night (almonds, raw cacao) — it\'s the first mineral depleted by stress, and it directly affects desire.' },
    'Niebla mental': { es: 'Hoy: empieza a comer por la grasa o proteína del plato, no por el carbohidrato — el orden cambia cuánta glucosa llega después a tu cerebro.', en: 'Today: eat the fat or protein on your plate first, not the carbs — the order changes how much glucose reaches your brain afterwards.' },
    'Brain fog': { es: 'Hoy: empieza a comer por la grasa o proteína del plato, no por el carbohidrato — el orden cambia cuánta glucosa llega después a tu cerebro.', en: 'Today: eat the fat or protein on your plate first, not the carbs — the order changes how much glucose reaches your brain afterwards.' },
  };
  const fallback = { es: 'Hoy: bebe un vaso de agua nada más despertar — antes de que tu cuerpo entre en modo estrés por la mañana.', en: 'Today: drink a glass of water first thing — before your body shifts into morning stress mode.' };
  const entry = mapa[sintoma] || fallback;
  return is_es ? entry.es : entry.en;
};

const insightPorSintoma = (sintoma, is_es) => {
  const mapa = {
    'Cansancio constante': {
      es: 'Tu cuerpo está gestionando un cambio hormonal real — el cansancio no es pereza, es química. Empezamos por recuperar tu energía.',
      en: 'Your body is managing a real hormonal shift — the fatigue isn\'t laziness, it\'s chemistry. We start by getting your energy back.'
    },
    'Constant fatigue': {
      es: 'Tu cuerpo está gestionando un cambio hormonal real — el cansancio no es pereza, es química. Empezamos por recuperar tu energía.',
      en: 'Your body is managing a real hormonal shift — the fatigue isn\'t laziness, it\'s chemistry. We start by getting your energy back.'
    },
    'Antojos de dulce': {
      es: 'Esos antojos no son falta de voluntad — son tus hormonas pidiendo estabilidad de glucosa. Empezamos por regular ese vaivén.',
      en: 'Those cravings aren\'t a lack of willpower — it\'s your hormones asking for glucose stability. We start by steadying that swing.'
    },
    'Sugar cravings': {
      es: 'Esos antojos no son falta de voluntad — son tus hormonas pidiendo estabilidad de glucosa. Empezamos por regular ese vaivén.',
      en: 'Those cravings aren\'t a lack of willpower — it\'s your hormones asking for glucose stability. We start by steadying that swing.'
    },
    'Insomnio o despertar nocturno': {
      es: 'Ese despertar a media noche tiene nombre y explicación — le pasa a la mayoría de mujeres en esta etapa. Empezamos por tu descanso.',
      en: 'Waking up in the middle of the night has a name and an explanation — it happens to most women at this stage. We start with your rest.'
    },
    'Insomnia or night waking': {
      es: 'Ese despertar a media noche tiene nombre y explicación — le pasa a la mayoría de mujeres en esta etapa. Empezamos por tu descanso.',
      en: 'Waking up in the middle of the night has a name and an explanation — it happens to most women at this stage. We start with your rest.'
    },
    'Hinchazón': {
      es: 'Esa hinchazón suele venir de la relación entre tus hormonas y la retención de líquidos, no de lo que comes. Empezamos por desinflamarte.',
      en: 'That bloating usually comes from the link between your hormones and fluid retention, not from what you eat. We start by de-bloating.'
    },
    'Bloating': {
      es: 'Esa hinchazón suele venir de la relación entre tus hormonas y la retención de líquidos, no de lo que comes. Empezamos por desinflamarte.',
      en: 'That bloating usually comes from the link between your hormones and fluid retention, not from what you eat. We start by de-bloating.'
    },
    'Cambios de humor': {
      es: 'Esos cambios de humor tienen una base hormonal concreta, no eres "demasiado sensible". Empezamos por estabilizarlo.',
      en: 'Those mood swings have a real hormonal basis — you\'re not "too sensitive". We start by stabilising it.'
    },
    'Mood changes': {
      es: 'Esos cambios de humor tienen una base hormonal concreta, no eres "demasiado sensible". Empezamos por estabilizarlo.',
      en: 'Those mood swings have a real hormonal basis — you\'re not "too sensitive". We start by stabilising it.'
    },
    'Sofocos': {
      es: 'Los sofocos son tu termostato interno reajustándose por el descenso de estrógeno — no algo que tengas que aguantar en silencio. Empezamos por regularlos.',
      en: 'Hot flashes are your internal thermostat readjusting to falling oestrogen — not something to just endure. We start by regulating them.'
    },
    'Hot flashes': {
      es: 'Los sofocos son tu termostato interno reajustándose por el descenso de estrógeno — no algo que tengas que aguantar en silencio. Empezamos por regularlos.',
      en: 'Hot flashes are your internal thermostat readjusting to falling oestrogen — not something to just endure. We start by regulating them.'
    },
    'Bajo deseo sexual': {
      es: 'Tu deseo bajo tiene raíz hormonal, no dice nada de ti ni de tu relación. Empezamos por entender qué lo está frenando.',
      en: 'Your low libido has a hormonal root — it says nothing about you or your relationship. We start by understanding what\'s holding it back.'
    },
    'Low libido': {
      es: 'Tu deseo bajo tiene raíz hormonal, no dice nada de ti ni de tu relación. Empezamos por entender qué lo está frenando.',
      en: 'Your low libido has a hormonal root — it says nothing about you or your relationship. We start by understanding what\'s holding it back.'
    },
    'Niebla mental': {
      es: 'Esa niebla mental es real y es hormonal, no falta de esfuerzo. Empezamos por devolverte claridad.',
      en: 'That brain fog is real and hormonal, not a lack of effort. We start by giving you back your clarity.'
    },
    'Brain fog': {
      es: 'Esa niebla mental es real y es hormonal, no falta de esfuerzo. Empezamos por devolverte claridad.',
      en: 'That brain fog is real and hormonal, not a lack of effort. We start by giving you back your clarity.'
    },
  };
  const fallback = {
    es: 'Tu cuerpo está atravesando cambios reales, y mereces entenderlos. Empezamos por tu primer paso.',
    en: 'Your body is going through real changes, and you deserve to understand them. We start with your first step.'
  };
  const entry = mapa[sintoma] || fallback;
  return is_es ? entry.es : entry.en;
};

function BienvenidaInner() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [aceptaTerminos, setAceptaTerminos] = useState(false);
  const [error, setError] = useState('');
  const [visible, setVisible] = useState(false);
  const router = useRouter();
  const params = useSearchParams();

  const lang = params.get('lang') || 'es';
  const is_es = lang === 'es';
  const nombre = params.get('nombre') || (is_es ? 'tu' : 'you');
  const sintoma = (params.get('sintoma') || params.get('sintomas') || '').split('|')[0];
  const insight = insightPorSintoma(sintoma, is_es);
  const primerPaso = primerPasoPorSintoma(sintoma, is_es);

  const pesoParam = parseFloat(params.get('peso')) || null;
  const tallaParam = parseFloat(params.get('talla')) || null;
  const edadParam = calcularEdad(params.get('nacimiento') || '');
  const activityKeyParam = mapActividad(params.get('actividad') || '');

  const imcPreview = useMemo(() => calcularBMI(pesoParam, tallaParam), [pesoParam, tallaParam]);
  const bmrPreview = useMemo(() => calcularBMR(pesoParam, tallaParam, edadParam), [pesoParam, tallaParam, edadParam]);
  const tdeePreview = useMemo(() => calcularTDEE(bmrPreview, activityKeyParam), [bmrPreview, activityKeyParam]);
  const imcInfo = getImcInfo(imcPreview, is_es);

  useEffect(() => {
    setTimeout(() => setVisible(true), 100);
  }, []);

  const handleActivar = async () => {
    if (!email || !password) {
      setError(is_es ? 'Por favor introduce tu email y contraseña.' : 'Please enter your email and password.');
      return;
    }
    if (!aceptaTerminos) {
      setError(is_es ? 'Debes aceptar los términos para continuar.' : 'You must accept the terms to continue.');
      return;
    }
    setLoading(true);
    setError('');

    const supabase = createClient(
      'https://pyekwpmbdnmglrjieexc.supabase.co',
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB5ZWt3cG1iZG5tZ2xyamllZXhjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjU0ODM0OTgsImV4cCI6MjA4MTA1OTQ5OH0.zQl7GF3E6BhDqW3bEMixAbdDcOsW8BsFOBeAGa-5bzY'
    );

    const { error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          nombre,
          sintoma_principal: sintoma,
          objetivo: params.get('objetivo') || '',
          ciclo: params.get('ciclo') || '',
          peso: params.get('peso') || '',
          talla: params.get('talla') || '',
          actividad: params.get('actividad') || '',
        }
      }
    });

    let userId = null;

    if (signUpError && signUpError.message.includes('already registered')) {
      const { data: loginData, error: loginError } = await supabase.auth.signInWithPassword({ email, password });
      if (loginError) {
        setError(is_es ? 'Email o contrasena incorrectos.' : 'Incorrect email or password.');
        setLoading(false);
        return;
      }
      userId = loginData?.user?.id;
    } else if (signUpError) {
      setError(signUpError.message);
      setLoading(false);
      return;
    } else {
      const { data: { session } } = await supabase.auth.getSession();
      userId = session?.user?.id;
    }

    if (userId) {
      const objetivoParam = params.get('objetivo') || '';
      const condicionesArray = (params.get('condiciones') || '').split('|').filter(Boolean);

      await supabase.from('users').upsert({
        id: userId,
        email,
        profile_name: nombre,
        sintoma_principal: sintoma,
        goal: objetivoParam,
        weight_goal: objetivoParam,
        ciclo: params.get('ciclo') || '',
        weight: pesoParam,
        height: tallaParam,
        activity_level: activityKeyParam,
        age: edadParam,
        bmi: imcPreview,
        bmr: bmrPreview,
        tdee: tdeePreview,
        restricciones: params.get('restricciones') || '',
        medicacion: params.get('medicacion') || '',
        health_conditions: condicionesArray.length ? condicionesArray : null,
        language: lang,
        updated_at: new Date().toISOString()
      });
    }

    setLoading(false);
    router.push('/dashboard');
  };

  return (
    <>
      <style dangerouslySetInnerHTML={{__html:`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;0,700;1,400&family=Montserrat:wght@400;500;600;700&display=swap');
        *{box-sizing:border-box;margin:0;padding:0;}
        .fade{opacity:0;transform:translateY(20px);transition:opacity 0.8s ease,transform 0.8s ease;}
        .fade.in{opacity:1;transform:translateY(0);}
        .d1{transition-delay:0.1s;} .d2{transition-delay:0.3s;} .d3{transition-delay:0.5s;} .d4{transition-delay:0.7s;}
        .input-field{width:100%;background:rgba(255,255,255,0.06);border:1px solid rgba(201,147,90,0.3);border-radius:0.75rem;padding:1rem 1.25rem;color:white;font-size:1rem;font-family:'Cormorant Garamond',Georgia,serif;outline:none;transition:border-color 0.2s ease;margin-bottom:0.75rem;}
        .input-field::placeholder{color:rgba(255,255,255,0.35);}
        .input-field:focus{border-color:#C9935A;}
        .btn-activar{width:100%;background:linear-gradient(135deg,#C9935A,#A06030);border:none;border-radius:0.75rem;padding:1.15rem;color:white;font-size:1.05rem;font-family:Montserrat,sans-serif;font-weight:700;cursor:pointer;box-shadow:0 4px 24px rgba(201,147,90,0.35);transition:transform 0.2s ease;margin-top:0.5rem;}
        .btn-activar:hover{transform:translateY(-2px);}
        .btn-activar:disabled{opacity:0.6;cursor:not-allowed;transform:none;}
      `}}/>
      <div style={{minHeight:'100vh',display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',padding:'2.5rem 1.5rem 2.5rem 1.5rem',background:'linear-gradient(180deg,#1a0f2e 0%,#0D3D3D 100%)',fontFamily:"'Cormorant Garamond',Georgia,serif"}}>
        <div style={{maxWidth:'440px',width:'100%'}}>

          <div className={`fade d1 ${visible?'in':''}`} style={{textAlign:'center',marginBottom:'1.5rem'}}>
            <div style={{fontFamily:'Montserrat,sans-serif',fontSize:'0.7rem',fontWeight:700,color:'#C9935A',letterSpacing:'3px',marginBottom:'1rem'}}>✦ LUMERA</div>
            <h1 style={{fontSize:'clamp(1.5rem,4vw,2rem)',fontWeight:700,color:'white',lineHeight:1.2}}>
              {is_es ? `${nombre}, te entiendo.` : `${nombre}, I understand.`}
            </h1>
          </div>

          <div className={`fade d1 ${visible?'in':''}`} style={{background:'rgba(255,255,255,0.04)',border:'1px solid rgba(201,147,90,0.2)',borderLeft:'4px solid #C9935A',borderRadius:'0 1rem 1rem 0',padding:'1.25rem 1.5rem',marginBottom:'1.5rem'}}>
            <p style={{fontSize:'1.02rem',lineHeight:1.75,fontStyle:'italic',color:'rgba(255,255,255,0.85)'}}>
              {insight}
            </p>
          </div>

          <div className={`fade d2 ${visible?'in':''}`} style={{background:'rgba(201,147,90,0.08)',border:'1px solid rgba(201,147,90,0.3)',borderRadius:'0.85rem',padding:'1.25rem',marginBottom:'1.5rem'}}>
            <div style={{fontFamily:'Montserrat,sans-serif',fontSize:'0.68rem',fontWeight:700,color:'#C9935A',letterSpacing:'2px',textTransform:'uppercase',marginBottom:'0.6rem'}}>
              ✨ {is_es?'Empieza por aquí':'Start here'}
            </div>
            <p style={{fontSize:'1.05rem',lineHeight:1.6,color:'white',marginBottom:'0.75rem',fontWeight:600}}>
              {primerPaso}
            </p>
            <p style={{fontSize:'0.85rem',fontStyle:'italic',color:'rgba(255,255,255,0.5)',lineHeight:1.5}}>
              {is_es ? 'Esto es solo el día 1. Con tu plan, cada día tendrás una acción como esta — hecha para tu ciclo, tus síntomas y tu objetivo.' : 'This is just day 1. With your plan, every day you\'ll get an action like this one — made for your cycle, your symptoms, and your goal.'}
            </p>
          </div>

          <div className={`fade d3 ${visible?'in':''}`}>
            <p style={{fontSize:'0.85rem',fontStyle:'italic',color:'rgba(255,255,255,0.45)',textAlign:'center',marginBottom:'1rem',lineHeight:1.6}}>
              {is_es ? 'Para que pueda acompañarte y guardar tu plan, crea tu acceso:' : 'To let me guide you and save your plan, create your access:'}
            </p>
            <input type="email" className="input-field" placeholder={is_es ? 'Tu correo electrónico...' : 'Your email address...'} value={email} onChange={e=>setEmail(e.target.value)} onKeyDown={e=>e.key==='Enter'&&handleActivar()}/>
            <input type="password" className="input-field" placeholder={is_es ? 'Crea una contraseña segura...' : 'Create a secure password...'} value={password} onChange={e=>setPassword(e.target.value)} onKeyDown={e=>e.key==='Enter'&&handleActivar()}/>
            {error && <p style={{color:'#F87171',fontSize:'0.85rem',fontFamily:'Montserrat,sans-serif',marginBottom:'0.75rem',textAlign:'center'}}>{error}</p>}
            <div style={{display:'flex',alignItems:'flex-start',gap:'0.75rem',marginBottom:'1rem',cursor:'pointer'}} onClick={()=>setAceptaTerminos(!aceptaTerminos)}>
              <div style={{width:'18px',height:'18px',borderRadius:'4px',border:'1.5px solid rgba(201,147,90,0.5)',background:aceptaTerminos?'#C9935A':'transparent',flexShrink:0,marginTop:'2px',display:'flex',alignItems:'center',justifyContent:'center',color:'white',fontSize:'0.7rem'}}>
                {aceptaTerminos?'✓':''}
              </div>
              <p style={{fontSize:'0.82rem',color:'rgba(255,255,255,0.45)',lineHeight:1.5,fontFamily:'Montserrat,sans-serif'}}>
                {is_es ? <span>Soy mayor de 18 años y acepto la <a href='/privacidad' target='_blank' style={{color:'#C9935A',textDecoration:'underline'}}>Política de Privacidad</a> y los <a href='/terminos' target='_blank' style={{color:'#C9935A',textDecoration:'underline'}}>Términos de Uso</a>. Entiendo que Lumera no sustituye el consejo médico profesional.</span> : <span>I am over 18 and accept the <a href='/privacy' target='_blank' style={{color:'#C9935A',textDecoration:'underline'}}>Privacy Policy</a> and <a href='/terms' target='_blank' style={{color:'#C9935A',textDecoration:'underline'}}>Terms of Use</a>. I understand Lumera does not replace professional medical advice.</span>}
              </p>
            </div>
            <button className="btn-activar" onClick={handleActivar} disabled={loading}>
              {loading ? (is_es?'Guardando tu plan...':'Saving your plan...') : (is_es?'Guardar mi plan y empezar':'Save my plan and start')}
            </button>
            <p style={{textAlign:'center',fontSize:'0.75rem',color:'rgba(255,255,255,0.25)',fontFamily:'Montserrat,sans-serif',marginTop:'0.75rem',lineHeight:1.5}}>
              {is_es ? 'Sin tarjeta de crédito. Cancela cuando quieras.' : 'No credit card. Cancel anytime.'}
            </p>
          </div>

          <div className={`fade d4 ${visible?'in':''}`} style={{textAlign:'center',marginTop:'1.5rem'}}>
            <p style={{fontSize:'0.85rem',color:'rgba(255,255,255,0.3)',fontFamily:'Montserrat,sans-serif'}}>
              {is_es ? 'Ya tienes cuenta? ' : 'Already have an account? '}
              <span onClick={()=>router.push('/dashboard')} style={{color:'#C9935A',cursor:'pointer',textDecoration:'underline'}}>
                {is_es ? 'Entrar aqui' : 'Sign in here'}
              </span>
            </p>
            <p style={{textAlign:'center',fontSize:'0.72rem',color:'rgba(255,255,255,0.15)',fontStyle:'italic',marginTop:'1rem',lineHeight:1.5}}>
              {is_es?'Resultados individuales pueden variar. Lumera no diagnostica ni sustituye el consejo médico profesional.':'Individual results may vary. Lumera does not diagnose or replace professional medical advice.'}
            </p>
          </div>

        </div>
      </div>
    </>
  );
}

export default function BienvenidaPage() {
  return (
    <Suspense fallback={
      <div style={{minHeight:'100vh',background:'linear-gradient(180deg,#1a0f2e,#0D3D3D)',display:'flex',alignItems:'center',justifyContent:'center'}}>
        <p style={{color:'rgba(255,255,255,0.5)',fontFamily:'Montserrat,sans-serif',fontSize:'0.9rem'}}>Cargando...</p>
      </div>
    }>
      <BienvenidaInner/>
    </Suspense>
  );
}
