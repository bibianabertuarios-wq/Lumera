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
  const router = useRouter();
  const params = useSearchParams();
  const lang = params.get('lang') || 'es';
  const is_es = lang === 'es';
  const nombre = params.get('nombre') || (is_es ? 'tú' : 'you');

  useEffect(() => {
    const medidasStr = params.get('medidas') || '{}';
    let medidas = {};
    try { medidas = JSON.parse(medidasStr); } catch(e) {}
    const nacimiento = params.get('nacimiento') || '';
    const ciclo = params.get('ciclo') || '';
    const objetivo = params.get('objetivo') || '';
    const sintomas = (params.get('sintomas') || '').split('|').filter(Boolean);
    const actividad = params.get('actividad') || '';
    const restricciones = params.get('restricciones') || '';
    const medicacion = params.get('medicacion') || '';
    const condiciones = (params.get('condiciones') || '').split('|').filter(Boolean);

    const callLumi = async () => {
      try {
        const res = await fetch('https://pyekwpmbdnmglrjieexc.supabase.co/functions/v1/lumi-onboarding', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
          },
          body: JSON.stringify({
            nombre,
            fechaNacimiento: nacimiento ? nacimiento + '-01' : '1984-01-01',
            ciclo, objetivo, sintomas,
            peso: parseFloat(medidas.peso) || 65,
            talla: parseFloat(medidas.altura) || 165,
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
        setLumiMsg(is_es ? 'Tu plan está listo. Empieza hoy.' : 'Your plan is ready. Start today.');
      }
      setCargando(false);
      setTimeout(() => setVisible(true), 100);
    };
    callLumi();
  }, []);

  const imcColor = !imc ? '#C9935A' : imc < 18.5 ? '#3B82F6' : imc < 25 ? '#2A7A4A' : imc < 30 ? '#F59E0B' : '#EF4444';

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;0,700;1,400&family=Montserrat:wght@400;600;700&display=swap');
        *{box-sizing:border-box;margin:0;padding:0;}
        .fade{opacity:0;transform:translateY(20px);transition:opacity 0.7s ease,transform 0.7s ease;}
        .fade.in{opacity:1;transform:translateY(0);}
        .d1{transition-delay:0.1s;} .d2{transition-delay:0.3s;} .d3{transition-delay:0.5s;} .d4{transition-delay:0.7s;} .d5{transition-delay:0.9s;}
        .btn{width:100%;background:linear-gradient(135deg,#C9935A,#A06030);border:none;border-radius:0.75rem;padding:1.15rem;color:white;font-size:1.05rem;font-family:Montserrat,sans-serif;font-weight:700;cursor:pointer;box-shadow:0 4px 24px rgba(201,147,90,0.35);transition:transform 0.2s ease;}
        .btn:hover{transform:translateY(-2px);}
      `}</style>

      <div style={{minHeight:'100vh',background:'linear-gradient(180deg,#1a0f2e 0%,#0D3D3D 60%,#FBF7F0 100%)',fontFamily:"'Cormorant Garamond',Georgia,serif",padding:'2.5rem 1.5rem'}}>
        <div style={{maxWidth:'480px',margin:'0 auto'}}>

          {cargando ? (
            <div style={{textAlign:'center',paddingTop:'5rem'}}>
              <div style={{fontSize:'2.5rem',marginBottom:'1.5rem',animation:'spin 3s linear infinite'}}>✦</div>
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

              {/* LUMI MENSAJE */}
              <div className={`fade d1 ${visible?'in':''}`} style={{marginBottom:'2rem'}}>
                <div style={{background:'rgba(255,255,255,0.05)',border:'1px solid rgba(201,147,90,0.3)',borderLeft:'4px solid #C9935A',borderRadius:'0 1rem 1rem 0',padding:'1.5rem'}}>
                  <div style={{fontFamily:'Montserrat,sans-serif',fontSize:'0.68rem',fontWeight:700,color:'#C9935A',letterSpacing:'2px',textTransform:'uppercase',marginBottom:'0.75rem'}}>✦ LUMI {is_es?'dice:':'says:'}</div>
                  <p style={{fontSize:'1.05rem',lineHeight:1.8,fontStyle:'italic',color:'rgba(255,255,255,0.9)'}}>{lumiMsg}</p>
                </div>
              </div>

              {/* MÉTRICAS */}
              {imc && (
                <div className={`fade d2 ${visible?'in':''}`} style={{marginBottom:'2rem'}}>
                  <div style={{fontFamily:'Montserrat,sans-serif',fontSize:'0.68rem',fontWeight:700,color:'#C9935A',letterSpacing:'3px',marginBottom:'1rem',textAlign:'center'}}>
                    {is_es?'TU PERFIL METABÓLICO':'YOUR METABOLIC PROFILE'}
                  </div>
                  <div style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:'0.75rem'}}>
                    {[
                      {label:'IMC', value:imc, unit:'', sub:imcCat, color:imcColor},
                      {label:is_es?'TMB':'BMR', value:tmb, unit:'kcal', sub:is_es?'en reposo':'at rest', color:'#C9935A'},
                      {label:'TDEE', value:tdee, unit:'kcal', sub:is_es?'diarias':'daily', color:'#2A7A4A'},
                    ].map((m,i) => (
                      <div key={i} style={{background:'rgba(255,255,255,0.06)',border:'1px solid rgba(255,255,255,0.1)',borderRadius:'0.75rem',padding:'1rem',textAlign:'center'}}>
                        <div style={{fontFamily:'Montserrat,sans-serif',fontSize:'0.62rem',fontWeight:700,color:'rgba(255,255,255,0.4)',letterSpacing:'1px',marginBottom:'0.4rem'}}>{m.label}</div>
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

              {/* FEATURES */}
              <div className={`fade d4 ${visible?'in':''}`} style={{marginBottom:'2rem'}}>
                <div style={{fontFamily:'Montserrat,sans-serif',fontSize:'0.68rem',fontWeight:700,color:'#C9935A',letterSpacing:'3px',marginBottom:'1.25rem',textAlign:'center'}}>
                  {is_es?'CON LUMERA VAS A PODER':'WITH LUMERA YOU WILL'}
                </div>
                {(is_es?[
                  {icon:'🥗',t:'Nutrición con inteligencia hormonal'},
                  {icon:'📸',t:'La Lente Alquímica — analiza tu plato'},
                  {icon:'📊',t:'Anticipa tus patrones hormonales'},
                  {icon:'💪',t:'Ejercicio adaptado a tu objetivo'},
                  {icon:'🏷️',t:'Lee lo que comes de verdad'},
                  {icon:'🤝',t:'LUMI contigo 24/7'},
                  {icon:'📅',t:'Adaptado a tu ciclo'},
                ]:[
                  {icon:'🥗',t:'Hormone-smart nutrition'},
                  {icon:'📸',t:'The Alchemical Lens — analyse your plate'},
                  {icon:'📊',t:'Anticipate your hormonal patterns'},
                  {icon:'💪',t:'Exercise adapted to your goal'},
                  {icon:'🏷️',t:'Read what you really eat'},
                  {icon:'🤝',t:'LUMI with you 24/7'},
                  {icon:'📅',t:'Adapted to your cycle'},
                ]).map((f,i)=>(
                  <div key={i} style={{display:'flex',alignItems:'center',gap:'0.75rem',padding:'0.75rem 0',borderBottom:'1px solid rgba(255,255,255,0.05)'}}>
                    <span style={{fontSize:'1.1rem',flexShrink:0}}>{f.icon}</span>
                    <span style={{fontSize:'1rem',color:'rgba(255,255,255,0.8)'}}>{f.t}</span>
                    <span style={{marginLeft:'auto',color:'rgba(201,147,90,0.5)',fontSize:'0.8rem'}}>✦</span>
                  </div>
                ))}
              </div>

              {/* BIO */}
              <div className={`fade d4 ${visible?'in':''}`} style={{background:'rgba(255,255,255,0.03)',border:'1px solid rgba(201,147,90,0.12)',borderRadius:'1rem',padding:'1.5rem',marginBottom:'2rem',textAlign:'center'}}>
                <div style={{fontFamily:'Montserrat,sans-serif',fontSize:'0.65rem',fontWeight:700,color:'#C9935A',letterSpacing:'2px',textTransform:'uppercase',marginBottom:'0.75rem'}}>{is_es?'QUIÉN HAY DETRÁS':'WHO IS BEHIND LUMERA'}</div>
                <p style={{fontSize:'0.95rem',lineHeight:1.7,fontStyle:'italic',color:'rgba(255,255,255,0.55)'}}>
                  {is_es?'Soy Bibiana, fundadora de Lumera, mamá de dos peques y este año, orgullosamente cuarentona. Lumera nació de mi propia necesidad — y de las ganas de compartirlo con todas vosotras.':'I\'m Bibiana, founder of Lumera, mum of two and this year, proudly turning forty. Lumera was born from my own need — and the desire to share it with all of you.'}
                </p>
              </div>

              {/* CTA */}
              <div className={`fade d5 ${visible?'in':''}`} style={{marginBottom:'3rem'}}>
                <button className="btn" onClick={() => router.push('/')}>
                  {is_es?'✨ Empezar mis 3 días gratis':'✨ Start my 3 free days'}
                </button>
                <p style={{textAlign:'center',fontSize:'0.78rem',color:'rgba(255,255,255,0.25)',fontFamily:'Montserrat,sans-serif',marginTop:'0.75rem'}}>
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