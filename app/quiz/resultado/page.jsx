'use client';
import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

function ResultadoInner() {
  const [lumiMsg, setLumiMsg] = useState('');
  const [imc, setImc] = useState(null);
  const [tmb, setTmb] = useState(null);
  const [tdee, setTdee] = useState(null);
  const [imcCat, setImcCat] = useState('');
  const [cargando, setCargando] = useState(true);
  const [visible, setVisible] = useState(false);
  const [openFeature, setOpenFeature] = useState(null);
  const router = useRouter();
  const params = useSearchParams();
  const lang = params.get('lang') || 'es';
  const is_es = lang === 'es';
  const nombre = params.get('nombre') || (is_es ? 'tú' : 'you');

  useEffect(() => {
    const nacimiento = params.get('nacimiento') || '';
    const ciclo = params.get('ciclo') || '';
    const objetivo = params.get('objetivo') || '';
    const sintomas = (params.get('sintomas') || '').split('|').filter(Boolean);
    const actividad = params.get('actividad') || '';
    const restricciones = params.get('restricciones') || '';
    const medicacion = params.get('medicacion') || '';
    const condiciones = (params.get('condiciones') || '').split('|').filter(Boolean);

    const callLumi = async () => {
      const sintomaLanding = params.get('sintoma') || '';
      const sintomasPriorizados = sintomaLanding && !sintomas.includes(sintomaLanding)
        ? [sintomaLanding, ...sintomas]
        : sintomas;
      try {
        const res = await fetch('https://pyekwpmbdnmglrjieexc.supabase.co/functions/v1/lumi-onboarding', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB5ZWt3cG1iZG5tZ2xyamllZXhjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjU0ODM0OTgsImV4cCI6MjA4MTA1OTQ5OH0.zQl7GF3E6BhDqW3bEMixAbdDcOsW8BsFOBeAGa-5bzY'
          },
          body: JSON.stringify({
            nombre,
            fechaNacimiento: nacimiento ? nacimiento + '-01' : '1984-01-01',
            ciclo, objetivo,
            sintomas: sintomasPriorizados,
            peso: parseFloat(params.get('peso')) || 65,
            talla: parseFloat(params.get('talla')) || 165,
            actividad, restricciones, medicacion, condiciones,
            language: lang
          })
        });
        const data = await res.json();
        setLumiMsg(data.message || '');
        if(data.imc) setImc(parseFloat(data.imc));
        if(data.tmb) setTmb(data.tmb);
        if(data.tdee) setTdee(data.tdee);
        if(data.imcCategoria) setImcCat(data.imcCategoria);
      } catch(e) {
        setLumiMsg(is_es ? 'Tu plan está listo. Empecemos juntas.' : 'Your plan is ready. Let us start together.');
      }
      setCargando(false);
      setTimeout(() => setVisible(true), 100);
    };
    callLumi();
  }, []);

  const imcColor = !imc ? '#C9935A' : imc < 18.5 ? '#3B82F6' : imc < 25 ? '#2A7A4A' : imc < 30 ? '#F59E0B' : '#EF4444';

  const imcLabel = !imc ? '' : imc < 18.5
    ? (is_es ? 'activar metabolismo' : 'activate metabolism')
    : imc < 25
    ? (is_es ? 'equilibrio óptimo' : 'optimal balance')
    : imc < 30
    ? (is_es ? 'equilibrar hormonas' : 'balance hormones')
    : (is_es ? 'plan intensivo' : 'intensive plan');

  const features = is_es ? [
    {icon:'🥗', title:'Nutrición Metabólica e Integral', body:'Alimenta tus hormonas y cuida tu cuerpo por dentro para que se note por fuera — sin contar calorías ni pasar hambre.'},
    {icon:'📸', title:'Tu Escáner Nutricional — La Lente Alquímica', body:'La herramienta definitiva para entender en segundos el impacto real de cada plato en tu energía y tus hormonas.'},
    {icon:'📊', title:'Tu Brújula Hormonal Anticipatoria', body:'Obtén el control absoluto. Entiende por qué te sientes así hoy y anticípate a los cambios de tu cuerpo antes de que ocurran.'},
    {icon:'💪', title:'Movilidad Inteligente y Fuerza Amable', body:'Muévete para activar tu metabolismo y ganar vitalidad — sin terminar agotada. Diseñado para tu cuerpo ahora.'},
    {icon:'🤝', title:'LUMI: Tu Mentora de Bienestar 24/7', body:'La guía y el apoyo que necesitas en cada paso. Siempre a tu lado, recuerda tu historial y aprende contigo.'},
    {icon:'📅', title:'Un Plan Adaptativo que Evoluciona Contigo', body:'Todas las herramientas reunidas en una estrategia flexible que cambia contigo, semana a semana, ciclo a ciclo.'},
  ] : [
    {icon:'🥗', title:'Metabolic & Integral Nutrition', body:'Feed your hormones and care for your body from within so it shows on the outside — no calorie counting, no hunger.'},
    {icon:'📸', title:'Your Nutritional Scanner — The Alchemical Lens', body:'The ultimate tool to instantly understand the real impact of every meal on your energy and hormones.'},
    {icon:'📊', title:'Your Anticipatory Hormonal Compass', body:'Gain total control. Understand why you feel the way you do today and anticipate your body changes before they happen.'},
    {icon:'💪', title:'Intelligent Movement & Gentle Strength', body:'Move to activate your metabolism and gain vitality — without ending up exhausted. Designed for your body right now.'},
    {icon:'🤝', title:'LUMI: Your 24/7 Wellness Mentor', body:'The guidance and support you need at every step. Always by your side, remembering your history and learning with you.'},
    {icon:'📅', title:'An Adaptive Plan That Evolves With You', body:'All the tools you need in one flexible strategy that changes with you, week by week, cycle by cycle.'},
  ];

  return (
    <>
      <style dangerouslySetInnerHTML={{__html:`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;0,700;1,400&family=Montserrat:wght@400;600;700&display=swap');
        *{box-sizing:border-box;margin:0;padding:0;}
        .fade{opacity:0;transform:translateY(20px);transition:opacity 0.7s ease,transform 0.7s ease;}
        .fade.in{opacity:1;transform:translateY(0);}
        .d1{transition-delay:0.1s;} .d2{transition-delay:0.3s;} .d3{transition-delay:0.5s;} .d4{transition-delay:0.7s;} .d5{transition-delay:0.9s;}
        .btn{width:100%;background:linear-gradient(135deg,#C9935A,#A06030);border:none;border-radius:0.75rem;padding:1.15rem;color:white;font-size:1.05rem;font-family:Montserrat,sans-serif;font-weight:700;cursor:pointer;box-shadow:0 4px 24px rgba(201,147,90,0.35);transition:transform 0.2s ease;}
        .btn:hover{transform:translateY(-2px);}
        .accordion{width:100%;background:none;border:none;border-bottom:1px solid rgba(201,147,90,0.1);padding:0.9rem 0;color:rgba(255,255,255,0.8);font-size:1rem;font-family:'Cormorant Garamond',Georgia,serif;cursor:pointer;text-align:left;display:flex;align-items:center;justify-content:space-between;gap:0.75rem;}
        .accordion:hover{color:white;}
      `}}/>
      <div style={{minHeight:'100vh',background:'linear-gradient(180deg,#1a0f2e 0%,#0D3D3D 60%,#FBF7F0 100%)',fontFamily:"'Cormorant Garamond',Georgia,serif",padding:'2.5rem 1.5rem'}}>
        <div style={{maxWidth:'480px',margin:'0 auto'}}>

          {cargando ? (
            <div style={{textAlign:'center',paddingTop:'5rem'}}>
              <div style={{fontSize:'2.5rem',marginBottom:'1.5rem'}}>✦</div>
              <p style={{fontSize:'1.2rem',fontStyle:'italic',color:'rgba(255,255,255,0.8)',lineHeight:1.7}}>
                {is_es ? `LUMI está analizando tu perfil, ${nombre}...` : `LUMI is analysing your profile, ${nombre}...`}
              </p>
              <p style={{fontSize:'0.82rem',fontFamily:'Montserrat,sans-serif',color:'rgba(255,255,255,0.3)',marginTop:'1rem'}}>
                {is_es ? 'Calculando tu plan personalizado' : 'Calculating your personalised plan'}
              </p>
            </div>
          ) : (
            <>
              {/* HEADER */}
              <div className={`fade d1 ${visible?'in':''}`} style={{textAlign:'center',marginBottom:'2rem'}}>
                <div style={{fontFamily:'Montserrat,sans-serif',fontSize:'0.72rem',fontWeight:700,color:'#C9935A',letterSpacing:'3px',marginBottom:'0.75rem'}}>✦ LUMERA</div>
                <h1 style={{fontSize:'clamp(1.6rem,4vw,2rem)',fontWeight:700,color:'white',lineHeight:1.2}}>
                  {is_es ? `${nombre}, tu plan está listo.` : `${nombre}, your plan is ready.`}
                </h1>
              </div>

              {/* LUMI */}
              <div className={`fade d1 ${visible?'in':''}`} style={{marginBottom:'2rem'}}>
                <div style={{background:'rgba(255,255,255,0.05)',border:'1px solid rgba(201,147,90,0.3)',borderLeft:'4px solid #C9935A',borderRadius:'0 1rem 1rem 0',padding:'1.5rem'}}>
                  <div style={{fontFamily:'Montserrat,sans-serif',fontSize:'0.68rem',fontWeight:700,color:'#C9935A',letterSpacing:'2px',textTransform:'uppercase',marginBottom:'0.75rem'}}>✦ LUMI {is_es?'dice:':'says:'}</div>
                  <p style={{fontSize:'1.05rem',lineHeight:1.8,fontStyle:'italic',color:'rgba(255,255,255,0.9)'}}>{lumiMsg}</p>
                </div>
              </div>

              {/* CTA PRINCIPAL */}
              <div className={`fade d2 ${visible?'in':''}`} style={{marginBottom:'2rem'}}>
                <button className="btn" onClick={()=>router.push('/')}>
                  {is_es ? '✨ Comenzar mi Día 1 — gratis' : '✨ Start my Day 1 — free'}
                </button>
                <p style={{textAlign:'center',fontSize:'0.75rem',color:'rgba(255,255,255,0.3)',fontFamily:'Montserrat,sans-serif',marginTop:'0.5rem'}}>
                  {is_es ? 'Sin tarjeta · Cancela cuando quieras' : 'No card · Cancel anytime'}
                </p>
              </div>

              {/* PERFIL HORMONAL */}
              {imc && (
                <div className={`fade d2 ${visible?'in':''}`} style={{marginBottom:'2rem'}}>
                  <div style={{fontFamily:'Montserrat,sans-serif',fontSize:'0.68rem',fontWeight:700,color:'#C9935A',letterSpacing:'3px',marginBottom:'1rem',textAlign:'center'}}>
                    {is_es?'TU PERFIL HORMONAL':'YOUR HORMONAL PROFILE'}
                  </div>
                  <div style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:'0.75rem'}}>
                    {[
                      {label:is_es?'RITMO METABÓLICO':'METABOLIC RHYTHM', value:imc, unit:'', sub:imcLabel, color:imcColor},
                      {label:is_es?'ENERGÍA BASE':'BASE ENERGY', value:tmb, unit:'kcal', sub:is_es?'necesidad real':'real need', color:'#C9935A'},
                      {label:is_es?'GASTO HORMONAL':'HORMONAL BURN', value:tdee, unit:'kcal', sub:is_es?'adaptado a ti':'adapted to you', color:'#2A7A4A'},
                    ].map((m,i) => (
                      <div key={i} style={{background:'rgba(255,255,255,0.06)',border:'1px solid rgba(255,255,255,0.1)',borderRadius:'0.75rem',padding:'1rem',textAlign:'center'}}>
                        <div style={{fontFamily:'Montserrat,sans-serif',fontSize:'0.55rem',fontWeight:700,color:'rgba(255,255,255,0.4)',letterSpacing:'1px',marginBottom:'0.4rem'}}>{m.label}</div>
                        <div style={{fontSize:'1.4rem',fontWeight:700,color:m.color,marginBottom:'0.1rem'}}>{m.value}</div>
                        <div style={{fontFamily:'Montserrat,sans-serif',fontSize:'0.6rem',color:'rgba(255,255,255,0.35)'}}>{m.unit}</div>
                        <div style={{fontFamily:'Montserrat,sans-serif',fontSize:'0.58rem',color:'rgba(255,255,255,0.25)',marginTop:'0.2rem',fontStyle:'italic'}}>{m.sub}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* LÍNEA DE PROGRESIÓN */}
              <div className={`fade d3 ${visible?'in':''}`} style={{marginBottom:'2rem'}}>
                <div style={{fontFamily:'Montserrat,sans-serif',fontSize:'0.68rem',fontWeight:700,color:'#C9935A',letterSpacing:'3px',marginBottom:'1.25rem',textAlign:'center'}}>
                  {is_es?'TU CAMINO':'YOUR JOURNEY'}
                </div>
                <div style={{display:'flex',alignItems:'flex-start',position:'relative',padding:'0 0.5rem'}}>
                  {(is_es?[
                    {icon:'📍',label:'Aquí estás',active:true},
                    {icon:'⚡',label:'Semana 2',active:false},
                    {icon:'🌿',label:'Mes 1',active:false},
                    {icon:'✨',label:'Objetivo',active:false},
                  ]:[
                    {icon:'📍',label:'You are here',active:true},
                    {icon:'⚡',label:'Week 2',active:false},
                    {icon:'🌿',label:'Month 1',active:false},
                    {icon:'✨',label:'Goal',active:false},
                  ]).map((step,i,arr)=>(
                    <div key={i} style={{flex:1,display:'flex',flexDirection:'column',alignItems:'center',position:'relative'}}>
                      {i < arr.length-1 && (
                        <div style={{position:'absolute',top:'18px',left:'50%',width:'100%',height:'2px',background:i===0?'linear-gradient(90deg,#C9935A,rgba(255,255,255,0.1))':'rgba(255,255,255,0.08)',zIndex:0}}/>
                      )}
                      <div style={{width:'36px',height:'36px',borderRadius:'50%',background:step.active?'linear-gradient(135deg,#C9935A,#A06030)':'rgba(255,255,255,0.07)',border:`2px solid ${step.active?'#C9935A':'rgba(255,255,255,0.12)'}`,display:'flex',alignItems:'center',justifyContent:'center',fontSize:'1rem',position:'relative',zIndex:1,marginBottom:'0.5rem'}}>
                        {step.icon}
                      </div>
                      <div style={{fontFamily:'Montserrat,sans-serif',fontSize:'0.58rem',fontWeight:step.active?700:400,color:step.active?'#C9935A':'rgba(255,255,255,0.3)',textAlign:'center',lineHeight:1.3}}>{step.label}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* SABÍAS QUE */}
              <div className={`fade d3 ${visible?'in':''}`} style={{background:'rgba(201,147,90,0.07)',border:'1px solid rgba(201,147,90,0.2)',borderLeft:'4px solid #C9935A',borderRadius:'0 1rem 1rem 0',padding:'1.25rem',marginBottom:'2rem'}}>
                <div style={{fontFamily:'Montserrat,sans-serif',fontSize:'0.65rem',fontWeight:700,color:'#C9935A',letterSpacing:'2px',textTransform:'uppercase',marginBottom:'0.5rem'}}>💡 {is_es?'¿Sabías que?':'Did you know?'}</div>
                <p style={{fontSize:'0.95rem',lineHeight:1.7,fontStyle:'italic',color:'rgba(255,255,255,0.7)'}}>
                  {is_es?'Despertarte a las 3 de la madrugada sin razón aparente tiene nombre: es la ventana de cortisol. Le pasa al 60% de las mujeres después de los 40. No estás sola — y tiene solución.':'Waking up at 3am for no apparent reason has a name: the cortisol window. It happens to 60% of women over 40. You are not alone — and there is a solution.'}
                </p>
              </div>

              {/* FEATURES ACORDEÓN */}
              <div className={`fade d4 ${visible?'in':''}`} style={{marginBottom:'2rem'}}>
                <div style={{fontFamily:'Montserrat,sans-serif',fontSize:'0.68rem',fontWeight:700,color:'#C9935A',letterSpacing:'3px',marginBottom:'1.25rem',textAlign:'center'}}>
                  {is_es?'CON LUMERA VAS A PODER':'WITH LUMERA YOU WILL'}
                </div>
                {features.map((f,i)=>(
                  <div key={i}>
                    <button className="accordion" onClick={()=>setOpenFeature(openFeature===i?null:i)}>
                      <span style={{display:'flex',alignItems:'center',gap:'0.75rem'}}>
                        <span style={{fontSize:'1.1rem'}}>{f.icon}</span>
                        <span>{f.title}</span>
                      </span>
                      <span style={{color:'#C9935A',fontSize:'1rem',flexShrink:0}}>{openFeature===i?'−':'+'}</span>
                    </button>
                    {openFeature===i && (
                      <div style={{padding:'0.75rem 0 1rem 2rem',fontSize:'0.95rem',fontStyle:'italic',color:'rgba(255,255,255,0.55)',lineHeight:1.6,borderBottom:'1px solid rgba(201,147,90,0.1)'}}>
                        {f.body}
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* CTA FINAL */}
              <div className={`fade d5 ${visible?'in':''}`} style={{marginBottom:'3rem'}}>
                <button className="btn" onClick={()=>router.push('/')}>
                  {is_es?'✨ Comenzar mi Día 1 — gratis':'✨ Start my Day 1 — free'}
                </button>
                <p style={{textAlign:'center',fontSize:'0.75rem',color:'rgba(255,255,255,0.25)',fontFamily:'Montserrat,sans-serif',marginTop:'0.75rem'}}>
                  {is_es?'Sin tarjeta · Cancela cuando quieras':'No card · Cancel anytime'}
                </p>
                <p style={{textAlign:'center',fontSize:'0.72rem',color:'rgba(255,255,255,0.15)',fontStyle:'italic',marginTop:'1.5rem',lineHeight:1.5}}>
                  {is_es?'Resultados individuales pueden variar. Lumera no diagnostica ni sustituye el consejo médico profesional.':'Individual results may vary. Lumera does not diagnose or replace professional medical advice.'}
                </p>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}

export default function ResultadoPage() {
  return (
    <Suspense fallback={
      <div style={{minHeight:'100vh',background:'linear-gradient(180deg,#1a0f2e,#0D3D3D)',display:'flex',alignItems:'center',justifyContent:'center'}}>
        <p style={{color:'rgba(255,255,255,0.5)',fontFamily:'Montserrat,sans-serif',fontSize:'0.9rem'}}>Cargando...</p>
      </div>
    }>
      <ResultadoInner/>
    </Suspense>
  );
}
