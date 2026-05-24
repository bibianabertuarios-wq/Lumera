'use client';
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';

export default function Start() {
  const [lang, setLang] = useState('es');
  const [foto, setFoto] = useState(null);
  const [analisis, setAnalisis] = useState('');
  const [cargando, setCargando] = useState(false);
  const [lenteProbada, setLenteProbada] = useState(false);
  const [visible, setVisible] = useState(false);
  const fileRef = useRef();
  const router = useRouter();

  useEffect(() => {
    const bl = navigator.language || 'es';
    setLang(bl.startsWith('es') ? 'es' : 'en');
    setLenteProbada(!!localStorage.getItem('lente_usada'));
    setTimeout(() => setVisible(true), 100);
  }, []);

  const is_es = lang === 'es';

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

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;0,700;1,300;1,400;1,500&family=Montserrat:wght@300;400;500;600;700&display=swap');
        :root {
          --cream: #FBF7F0; --teal: #0D3D3D; --copper: #C9935A;
          --green: #2A7A4A; --mint: #EAF5EF; --white: #ffffff;
        }
        * { box-sizing: border-box; margin: 0; padding: 0; }
        .fade-in { opacity: 0; transform: translateY(24px); transition: opacity 0.8s ease, transform 0.8s ease; }
        .fade-in.visible { opacity: 1; transform: translateY(0); }
        .fade-in.d1 { transition-delay: 0.1s; }
        .fade-in.d2 { transition-delay: 0.25s; }
        .fade-in.d3 { transition-delay: 0.4s; }
        .fade-in.d4 { transition-delay: 0.55s; }
        .fade-in.d5 { transition-delay: 0.7s; }
        .btn-primary { width:100%; background:linear-gradient(135deg,#C9935A,#A06030); border:none; border-radius:0.75rem; padding:1.1rem 1.5rem; color:white; font-size:1.05rem; font-family:'Montserrat',sans-serif; font-weight:700; cursor:pointer; box-shadow:0 4px 24px rgba(201,147,90,0.35); transition:transform 0.2s ease,box-shadow 0.2s ease; }
        .btn-primary:hover { transform:translateY(-2px); box-shadow:0 8px 32px rgba(201,147,90,0.45); }
        .btn-secondary { width:100%; background:linear-gradient(135deg,#0D3D3D,#1A6B6B); border:none; border-radius:0.75rem; padding:1rem 1.5rem; color:white; font-size:1rem; font-family:'Montserrat',sans-serif; font-weight:700; cursor:pointer; transition:transform 0.2s ease; }
        .section { padding:3.5rem 1.5rem; }
        .container { max-width:520px; margin:0 auto; }
        .label { font-family:'Montserrat',sans-serif; font-size:0.72rem; font-weight:700; color:var(--copper); letter-spacing:3px; text-transform:uppercase; margin-bottom:0.6rem; }
        .sabia-card { background:linear-gradient(135deg,rgba(201,147,90,0.08),rgba(201,147,90,0.03)); border:1px solid rgba(201,147,90,0.3); border-left:4px solid var(--copper); border-radius:0 1rem 1rem 0; padding:1.25rem 1.5rem; margin:1.5rem 0; }
        .symptom-item { display:flex; align-items:flex-start; gap:0.75rem; padding:0.75rem 1rem; background:var(--mint); border-radius:0.5rem; margin-bottom:0.5rem; }
        @keyframes pulse-copper { 0%,100%{box-shadow:0 0 0 0 rgba(201,147,90,0.4)} 50%{box-shadow:0 0 0 8px rgba(201,147,90,0)} }
        .pulse { animation:pulse-copper 2s infinite; }
      `}</style>
      <div style={{fontFamily:"'Cormorant Garamond',Georgia,serif",background:'var(--cream)',color:'var(--teal)'}}>

        {/* HERO */}
        <div style={{minHeight:'100vh',display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',padding:'3rem 1.5rem',textAlign:'center',background:'linear-gradient(180deg,#ffffff 0%,#FBF7F0 100%)',position:'relative',overflow:'hidden'}}>
          <div style={{position:'absolute',top:'-100px',right:'-100px',width:'400px',height:'400px',borderRadius:'50%',background:'radial-gradient(circle,rgba(201,147,90,0.06) 0%,transparent 70%)',pointerEvents:'none'}}/>
          <div style={{maxWidth:'480px',width:'100%',position:'relative',zIndex:1}}>
            <div className={`fade-in d1 ${visible?'visible':''}`}>
              <img src="/images/shula-lagrima.jpg" alt="Lumera" style={{width:'160px',height:'200px',objectFit:'cover',objectPosition:'top center',borderRadius:'50% 50% 40% 40%',border:'3px solid #C9935A',marginBottom:'1.75rem',boxShadow:'0 12px 40px rgba(201,147,90,0.3)'}}/>
            </div>
            <div className={`fade-in d1 ${visible?'visible':''}`} style={{fontFamily:'Montserrat,sans-serif',fontSize:'0.75rem',fontWeight:700,color:'#C9935A',letterSpacing:'0.4em',marginBottom:'1.5rem'}}>✦ LUMERA</div>
            <div className={`fade-in d2 ${visible?'visible':''}`}>
              <h1 style={{fontSize:'clamp(1.9rem,5vw,2.5rem)',fontWeight:700,lineHeight:1.15,marginBottom:'1rem',color:'#0D3D3D'}}>
                {is_es?'Lumera se adapta a ti.\nNo al revés.':'Lumera adapts to you.\nNot the other way around.'}
              </h1>
            </div>
            <div className={`fade-in d2 ${visible?'visible':''}`}>
              <div className="sabia-card" style={{textAlign:'left',marginTop:'0'}}>
                <div style={{fontFamily:'Montserrat,sans-serif',fontSize:'0.7rem',fontWeight:700,color:'#C9935A',letterSpacing:'2px',textTransform:'uppercase',marginBottom:'0.5rem'}}>💡 {is_es?'¿Sabías que?':'Did you know?'}</div>
                <p style={{fontSize:'1rem',lineHeight:1.7,fontStyle:'italic',color:'rgba(13,61,61,0.85)'}}>
                  {is_es?'El estrógeno no solo regula tu ciclo — también actúa como antiinflamatorio natural en tu cerebro. Cuando empieza a fluctuar después de los 40, cambia tu memoria, tu sueño, tu energía y tu humor. Todo está conectado.':'Oestrogen doesn\'t just regulate your cycle — it also acts as a natural anti-inflammatory in your brain. When it starts to fluctuate after 40, it changes your memory, sleep, energy and mood. Everything is connected.'}
                </p>
              </div>
            </div>
            <div className={`fade-in d3 ${visible?'visible':''}`}>
              <p style={{fontSize:'1.1rem',fontStyle:'italic',color:'rgba(13,61,61,0.65)',marginBottom:'2rem',lineHeight:1.7}}>
                {is_es?'Cuéntame cómo te sientes y construiré el plan exacto para tu cuerpo — con base científica real.':'Tell me how you feel and I\'ll build the right plan for your body — backed by real science.'}
              </p>
            </div>
            <div className={`fade-in d4 ${visible?'visible':''}`}>
              <button className="btn-primary pulse" onClick={()=>router.push('/quiz')} style={{marginBottom:'0.75rem'}}>
                {is_es?'✨ Empezar mi plan — 2 minutos':'✨ Start my 2-minute plan'}
              </button>
              <p style={{fontSize:'0.8rem',color:'rgba(13,61,61,0.4)',fontFamily:'Montserrat,sans-serif'}}>
                {is_es?'Sin tarjeta · 3 días gratis · Cancela cuando quieras':'No card · 3 days free · Cancel anytime'}
              </p>
            </div>
          </div>
        </div>

        {/* SÍNTOMAS */}
        <div className="section" style={{background:'white'}}>
          <div className="container" style={{textAlign:'center'}}>
            <div className="label">{is_es?'¿Te suena esto?':'Does this sound familiar?'}</div>
            <h2 style={{fontSize:'1.9rem',fontWeight:700,marginBottom:'0.5rem',lineHeight:1.2}}>
              {is_es?'Tu cuerpo está hablando.\nSolo necesita ser escuchado.':'Your body is talking.\nIt just needs to be heard.'}
            </h2>
            <p style={{fontSize:'0.85rem',fontStyle:'italic',color:'rgba(13,61,61,0.55)',marginBottom:'1.75rem',fontFamily:'Montserrat,sans-serif'}}>
              {is_es?'Cada síntoma tiene una explicación biológica real.':'Every symptom has a real biological explanation.'}
            </p>
            {(is_es?[
              {icon:'😴',text:'Te despiertas a las 3 de la madrugada sin razón aparente',note:'Ventana de cortisol'},
              {icon:'🍬',text:'Antojos de dulce a las 4pm que no puedes controlar',note:'Tu cortisol pide glucosa'},
              {icon:'🌡️',text:'Sofocos que aparecen cuando menos lo esperas',note:'Fluctuación del estrógeno'},
              {icon:'🧠',text:'Vas a la cocina y no recuerdas a qué has ido',note:'Niebla mental hormonal'},
              {icon:'⚡',text:'Cansancio que no se va aunque duermas',note:'Fatiga adrenal'},
              {icon:'📅',text:'Tu periodo aparece cuando quiere, o ya no aparece',note:'Transición hormonal activa'},
            ]:[
              {icon:'😴',text:'Waking up at 3am for no apparent reason',note:'Cortisol window'},
              {icon:'🍬',text:'Afternoon sugar cravings you cannot control',note:'Cortisol asking for glucose'},
              {icon:'🌡️',text:'Hot flashes that appear when you least expect them',note:'Oestrogen fluctuation'},
              {icon:'🧠',text:'Walking into a room and forgetting why',note:'Hormonal brain fog'},
              {icon:'⚡',text:'Fatigue that doesn\'t go away even after sleep',note:'Adrenal fatigue'},
              {icon:'📅',text:'Your period comes and goes as it pleases',note:'Active hormonal transition'},
            ]).map((s,i)=>(
              <div key={i} className="symptom-item">
                <span style={{fontSize:'1.3rem',flexShrink:0}}>{s.icon}</span>
                <div style={{flex:1,textAlign:'left'}}>
                  <div style={{fontSize:'1rem',color:'#0D3D3D',lineHeight:1.5}}>{s.text}</div>
                  <div style={{fontSize:'0.75rem',fontFamily:'Montserrat,sans-serif',fontWeight:600,color:'#2A7A4A',marginTop:'0.2rem'}}>→ {s.note}</div>
                </div>
              </div>
            ))}
            <div className="sabia-card" style={{marginTop:'1.5rem',textAlign:'left'}}>
              <div style={{fontFamily:'Montserrat,sans-serif',fontSize:'0.7rem',fontWeight:700,color:'#C9935A',letterSpacing:'2px',textTransform:'uppercase',marginBottom:'0.5rem'}}>💡 {is_es?'¿Sabías que?':'Did you know?'}</div>
              <p style={{fontSize:'1rem',lineHeight:1.7,fontStyle:'italic',color:'rgba(13,61,61,0.85)'}}>
                {is_es?'Los antojos de dulce a las 4pm no son falta de voluntad. Son tu cortisol pidiendo glucosa porque tu ritmo hormonal ha cambiado. La biología, no la disciplina, es la respuesta.':'4pm sugar cravings are not a willpower issue. It\'s your cortisol asking for glucose because your hormonal rhythm has shifted. Biology, not discipline, is the answer.'}
              </p>
            </div>
            <button className="btn-primary" onClick={()=>router.push('/quiz')} style={{marginTop:'1.75rem'}}>
              {is_es?'→ Entender qué me está pasando':'→ Understand what is happening to me'}
            </button>
          </div>
        </div>

        {/* LENTE ALQUÍMICA */}
        <div className="section" style={{background:'var(--cream)'}}>
          <div className="container" style={{textAlign:'center'}}>
            <div className="label">{is_es?'Pruébalo ahora — gratis':'Try it now — free'}</div>
            <h2 style={{fontSize:'1.9rem',fontWeight:700,color:'#0D3D3D',marginBottom:'0.5rem'}}>📸 {is_es?'La Lente Alquímica':'The Alchemical Lens'}</h2>
            <p style={{fontSize:'1.05rem',fontStyle:'italic',color:'rgba(13,61,61,0.65)',marginBottom:'1.5rem',lineHeight:1.7}}>
              {is_es?'Fotografía tu plato. LUMI analiza cómo afecta a tus hormonas en segundos.':'Photograph your plate. LUMI analyses how it affects your hormones in seconds.'}
            </p>
            <input type="file" accept="image/*" capture="environment" ref={fileRef} onChange={handleFoto} style={{display:'none'}}/>
            {!lenteProbada&&!analisis&&(
              <div style={{background:'white',border:'1px solid rgba(201,147,90,0.25)',borderRadius:'1rem',padding:'2rem'}}>
                <div style={{fontSize:'3rem',marginBottom:'1rem'}}>🍽️</div>
                <button onClick={()=>fileRef.current.click()} disabled={cargando} className="btn-secondary" style={{marginBottom:'0.75rem'}}>
                  {cargando?(is_es?'LUMI está analizando...':'LUMI is analysing...'):(is_es?'📷 Fotografía tu plato — análisis gratis':'📷 Photograph your plate — free analysis')}
                </button>
                <p style={{fontSize:'0.78rem',color:'rgba(13,61,61,0.35)',fontFamily:'Montserrat,sans-serif'}}>{is_es?'Sin registro · Solo una vez · Resultado inmediato':'No sign up · One time · Instant result'}</p>
              </div>
            )}
            {foto&&cargando&&(
              <div style={{textAlign:'center',padding:'2rem'}}>
                <img src={foto} alt="tu comida" style={{width:'120px',height:'120px',objectFit:'cover',borderRadius:'1rem',border:'2px solid #C9935A',margin:'0 auto 1rem',display:'block'}}/>
                <p style={{fontSize:'1.05rem',fontStyle:'italic',color:'#0D3D3D'}}>{is_es?'LUMI está analizando tu plato...':'LUMI is analysing your food...'}</p>
              </div>
            )}
            {analisis&&(
              <div>
                {foto&&<img src={foto} alt="tu comida" style={{width:'120px',height:'120px',objectFit:'cover',borderRadius:'1rem',border:'2px solid #C9935A',margin:'0 auto 1rem',display:'block'}}/>}
                <div style={{background:'white',border:'1px solid rgba(201,147,90,0.25)',borderLeft:'4px solid #C9935A',borderRadius:'0 1rem 1rem 0',padding:'1.25rem',textAlign:'left',marginBottom:'1rem'}}>
                  <div style={{fontFamily:'Montserrat,sans-serif',fontSize:'0.72rem',fontWeight:700,color:'#C9935A',letterSpacing:'2px',textTransform:'uppercase',marginBottom:'0.75rem'}}>✦ LUMI {is_es?'dice:':'says:'}</div>
                  <div style={{fontSize:'1.05rem',color:'#0D3D3D',lineHeight:1.75,fontStyle:'italic'}}>{analisis}</div>
                </div>
                <button className="btn-primary" onClick={()=>router.push('/quiz')}>{is_es?'✨ Quiero mi plan personalizado completo':'✨ I want my complete personalised plan'}</button>
              </div>
            )}
            {lenteProbada&&!analisis&&(
              <div style={{background:'white',border:'1px solid rgba(201,147,90,0.25)',borderRadius:'1rem',padding:'1.5rem'}}>
                <p style={{fontSize:'1.05rem',fontStyle:'italic',color:'#0D3D3D',marginBottom:'1rem',lineHeight:1.6}}>{is_es?'Ya has usado tu prueba gratuita. Accede a análisis ilimitados con tu plan completo.':'You\'ve used your free trial. Get unlimited analyses with your full plan.'}</p>
                <button className="btn-primary" onClick={()=>router.push('/quiz')}>{is_es?'✨ Empezar mi plan — 3 días gratis':'✨ Start my plan — 3 days free'}</button>
              </div>
            )}
          </div>
        </div>
        {/* FUNCIONALIDADES */}
        <div className="section" style={{background:'#0D3D3D'}}>
          <div className="container" style={{textAlign:'center'}}>
            <div style={{fontFamily:'Montserrat,sans-serif',fontSize:'0.72rem',fontWeight:700,color:'#C9935A',letterSpacing:'3px',textTransform:'uppercase',marginBottom:'0.6rem'}}>
              {is_es?'Con Lumera vas a poder':'With Lumera you will'}
            </div>
            <h2 style={{fontSize:'1.9rem',fontWeight:700,color:'white',marginBottom:'0.5rem',lineHeight:1.2}}>
              {is_es?'Las herramientas que tu cuerpo necesita ahora.':'The tools your body needs right now.'}
            </h2>
            <p style={{fontSize:'0.85rem',fontStyle:'italic',color:'rgba(240,232,220,0.45)',marginBottom:'2rem',fontFamily:'Montserrat,sans-serif'}}>
              {is_es?'Sin dietas milagro. Sin promesas vacías. Solo ciencia aplicada a ti.':'No miracle diets. No empty promises. Just science applied to you.'}
            </p>
            {(is_es?[
              {icon:'🥗',title:'Nutrición con inteligencia hormonal',body:'Menús adaptados a tu ciclo, tu objetivo y tu tiempo real — con horarios explicados y el porqué detrás de cada elección.'},
              {icon:'📸',title:'La Lente Alquímica',body:'Fotografía tu plato y LUMI te dice cómo afecta a tus hormonas y cómo optimizarlo. Cocción, nutrientes, combinaciones.'},
              {icon:'📊',title:'Anticipa tus patrones',body:'Seguimiento de síntomas que detecta tendencias y te avisa de lo que viene — no solo registra lo que ya pasó.'},
              {icon:'💪',title:'Ejercicio adaptado a tu objetivo',body:'Rutinas diseñadas según tu condición física actual y lo que quieres conseguir. No al revés.'},
              {icon:'🏷️',title:'Lee lo que comes de verdad',body:'Etiquetas, ingredientes, aditivos. LUMI te explica qué significa cada cosa y qué hacer con esa información.'},
              {icon:'🤝',title:'LUMI contigo 24/7',body:'Tu guía, confidente y coach. Disponible a las 3am si hace falta. Recuerda tu historial y aprende contigo.'},
              {icon:'📅',title:'Adaptado a tu ciclo',body:'Si aún tienes periodo, tu plan cambia con cada fase. Si ya no lo tienes, tu plan refleja tu nueva realidad hormonal.'},
            ]:[
              {icon:'🥗',title:'Hormone-smart nutrition',body:'Menus adapted to your cycle, your goal and your real schedule — with explained timings and the why behind every choice.'},
              {icon:'📸',title:'The Alchemical Lens',body:'Photograph your plate and LUMI tells you how it affects your hormones and how to optimise it.'},
              {icon:'📊',title:'Anticipate your patterns',body:'Symptom tracking that detects trends and alerts you to what\'s coming — not just recording what already happened.'},
              {icon:'💪',title:'Exercise adapted to your goal',body:'Routines designed around your current fitness level and what you want to achieve. Not the other way around.'},
              {icon:'🏷️',title:'Read what you really eat',body:'Labels, ingredients, additives. LUMI explains what everything means and what to do with that information.'},
              {icon:'🤝',title:'LUMI with you 24/7',body:'Your guide, confidante and coach. Available at 3am if needed. Remembers your history and learns with you.'},
              {icon:'📅',title:'Adapted to your cycle',body:'If you still have your period, your plan shifts with each phase. If not, it reflects your new hormonal reality.'},
            ]).map((f,i)=>(
              <div key={i} style={{display:'flex',gap:'1rem',padding:'1rem 0',borderBottom:'1px solid rgba(201,147,90,0.12)',textAlign:'left'}}>
                <span style={{fontSize:'1.5rem',flexShrink:0,marginTop:'0.1rem'}}>{f.icon}</span>
                <div>
                  <div style={{fontSize:'1.05rem',fontWeight:700,color:'white',marginBottom:'0.25rem'}}>{f.title}</div>
                  <div style={{fontSize:'0.95rem',fontStyle:'italic',color:'rgba(240,232,220,0.6)',lineHeight:1.6}}>{f.body}</div>
                </div>
              </div>
            ))}
            <div style={{background:'rgba(201,147,90,0.1)',border:'1px solid rgba(201,147,90,0.25)',borderLeft:'4px solid #C9935A',borderRadius:'0 1rem 1rem 0',padding:'1.25rem',textAlign:'left',margin:'1.75rem 0'}}>
              <div style={{fontFamily:'Montserrat,sans-serif',fontSize:'0.7rem',fontWeight:700,color:'#C9935A',letterSpacing:'2px',textTransform:'uppercase',marginBottom:'0.5rem'}}>💡 {is_es?'¿Sabías que?':'Did you know?'}</div>
              <p style={{fontSize:'1rem',lineHeight:1.7,fontStyle:'italic',color:'rgba(240,232,220,0.85)'}}>
                {is_es?'Despertarte a las 3 de la madrugada sin razón aparente tiene nombre: es la ventana de cortisol. Le pasa al 60% de las mujeres después de los 40. No estás sola — y tiene solución.':'Waking up at 3am for no apparent reason has a name: the cortisol window. It happens to 60% of women over 40. You are not alone — and there is a solution.'}
              </p>
            </div>
            <button className="btn-primary" onClick={()=>router.push('/quiz')}>{is_es?'✨ Empezar 3 días gratis':'✨ Start 3 days free'}</button>
            <p style={{fontSize:'0.78rem',color:'rgba(240,232,220,0.3)',fontFamily:'Montserrat,sans-serif',marginTop:'0.6rem'}}>{is_es?'Sin tarjeta · Cancela cuando quieras':'No card · Cancel anytime'}</p>
          </div>
        </div>

        {/* BIO */}
        <div className="section" style={{background:'white'}}>
          <div className="container">
            <div style={{background:'linear-gradient(135deg,#FBF7F0,white)',border:'1px solid rgba(201,147,90,0.2)',borderRadius:'1.25rem',padding:'2rem',position:'relative',overflow:'hidden'}}>
              <div className="label" style={{textAlign:'center'}}>{is_es?'Quién hay detrás de Lumera':'Who is behind Lumera'}</div>
              <div style={{fontSize:'1.5rem',fontWeight:700,color:'#0D3D3D',textAlign:'center',marginBottom:'1.5rem',lineHeight:1.3}}>
                {is_es?'De mujer a mujer.':'From woman to woman.'}
              </div>
              <p style={{fontSize:'1.05rem',lineHeight:1.8,color:'rgba(13,61,61,0.85)',fontStyle:'italic',whiteSpace:'pre-line'}}>
                {is_es
                  ?'Soy Bibiana, fundadora de Lumera, mamá de dos peques y este año, orgullosamente cuarentona.\n\nLumera nació de mi propia necesidad: entender qué le estaba pasando a mi cuerpo al entrar en los 40. Sentí que faltaban respuestas claras — y decidí buscarlas.\n\nGracias a mi formación en bioquímica, nutrición y tecnología de los alimentos, y sobre todo a mi propia experiencia, quise crear un espacio para todas las que estamos viviendo esta transformación. Porque los 40 no son un problema a resolver — son una nueva era a conquistar.\n\nBienvenida.'
                  :'I\'m Bibiana, founder of Lumera, mum of two and this year, proudly turning forty.\n\nLumera was born from my own need: to understand what was happening to my body as I entered my 40s. I felt that clear answers were missing — so I decided to find them.\n\nWith my background in biochemistry, nutrition and food technology, and above all my own experience, I wanted to create a space for all of us living this transformation. Because your 40s are not a problem to solve — they are a new era to own.\n\nWelcome.'}
              </p>
            </div>
          </div>
        </div>

        {/* CTA FINAL */}
        <div className="section" style={{background:'linear-gradient(135deg,#0D3D3D,#1A5C5C)',textAlign:'center'}}>
          <div className="container">
            <div style={{fontSize:'clamp(1.8rem,4vw,2.2rem)',fontWeight:700,color:'white',lineHeight:1.2,marginBottom:'0.75rem',whiteSpace:'pre-line'}}>
              {is_es?'Cada cuerpo es diferente.\nEl tuyo merece un plan propio.':'Every body is different.\nYours deserves its own plan.'}
            </div>
            <p style={{fontSize:'1.05rem',fontStyle:'italic',color:'rgba(240,232,220,0.6)',marginBottom:'2rem',lineHeight:1.7}}>
              {is_es?'Sin dietas generales. Sin ejercicios estándar. Solo lo que tu cuerpo necesita ahora.':'No generic diets. No standard routines. Just what your body needs right now.'}
            </p>
            <button className="btn-primary" onClick={()=>router.push('/quiz')} style={{maxWidth:'400px',margin:'0 auto',display:'block',marginBottom:'0.75rem'}}>
              {is_es?'✨ EMPEZAR MI PLAN GRATIS — 2 min':'✨ START MY FREE PLAN — 2 min'}
            </button>
            <p style={{fontSize:'0.78rem',color:'rgba(240,232,220,0.3)',fontFamily:'Montserrat,sans-serif',marginBottom:'2rem'}}>
              {is_es?'Sin tarjeta · 3 días gratis · Cancela cuando quieras':'No card · 3 days free · Cancel anytime'}
            </p>
            <p style={{fontSize:'0.78rem',color:'rgba(240,232,220,0.25)',fontStyle:'italic',maxWidth:'360px',margin:'0 auto',lineHeight:1.6}}>
              {is_es?'Resultados individuales pueden variar. Lumera no diagnostica ni sustituye el consejo médico profesional.':'Individual results may vary. Lumera does not diagnose or replace professional medical advice.'}
            </p>
            <div style={{marginTop:'2.5rem',fontSize:'0.82rem',color:'rgba(201,147,90,0.35)',fontStyle:'italic',letterSpacing:'0.15em'}}>✦ Lumera — Decoding Women\'s Biology</div>
          </div>
        </div>

      </div>
    </>
  );
}