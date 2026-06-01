'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;0,700;1,400;1,600&family=Montserrat:wght@300;400;500;600;700&display=swap');
  *{box-sizing:border-box;margin:0;padding:0;}
  body{overflow-x:hidden;}
  .fi{opacity:0;transform:translateY(24px);transition:opacity 0.8s ease,transform 0.8s ease;}
  .fi.v{opacity:1;transform:translateY(0);}
  .d1{transition-delay:0.1s;} .d2{transition-delay:0.25s;} .d3{transition-delay:0.4s;} .d4{transition-delay:0.55s;} .d5{transition-delay:0.7s;}
  @keyframes pulse{0%,100%{box-shadow:0 0 0 0 rgba(201,147,90,0.4);}50%{box-shadow:0 0 0 10px rgba(201,147,90,0);}}
  .pulse{animation:pulse 2s infinite;}
  .btn-copper{width:100%;background:linear-gradient(135deg,#C9935A,#A06030);border:none;border-radius:0.75rem;padding:1.1rem 1.5rem;color:white;font-size:1.05rem;font-family:Montserrat,sans-serif;font-weight:700;cursor:pointer;box-shadow:0 4px 24px rgba(201,147,90,0.3);transition:transform 0.2s ease;}
  .btn-copper:hover{transform:translateY(-2px);}
  .sec{padding:3.5rem 1.5rem;}
  .wrap{max-width:520px;margin:0 auto;}
  .label{font-family:Montserrat,sans-serif;font-size:0.7rem;font-weight:700;color:#C9935A;letter-spacing:3px;text-transform:uppercase;margin-bottom:0.6rem;}
  .card{background:white;border:1px solid rgba(201,147,90,0.2);border-radius:1rem;padding:1.5rem;margin-bottom:1rem;box-shadow:0 2px 12px rgba(13,61,61,0.05);}
  .tag{background:rgba(42,122,74,0.1);border-radius:20px;padding:3px 12px;font-family:Montserrat,sans-serif;font-size:0.72rem;font-weight:600;color:#2A7A4A;display:inline-block;margin-bottom:0.5rem;}
  .symp{display:flex;align-items:flex-start;gap:0.75rem;padding:0.75rem 1rem;background:#EAF5EF;border-radius:0.5rem;margin-bottom:0.5rem;}
  .step{display:flex;align-items:flex-start;gap:1rem;padding:1rem 0;border-bottom:1px solid rgba(201,147,90,0.1);}
  .step-num{width:36px;height:36px;border-radius:50%;background:linear-gradient(135deg,#C9935A,#A06030);display:flex;align-items:center;justify-content:center;color:white;font-family:Montserrat,sans-serif;font-weight:700;font-size:0.9rem;flex-shrink:0;}
  .faq-item{border-bottom:1px solid rgba(201,147,90,0.15);padding:1rem 0;}
  .faq-q{font-size:1rem;font-weight:600;color:#0D3D3D;margin-bottom:0.4rem;}
  .faq-a{font-size:0.95rem;color:rgba(13,61,61,0.7);font-style:italic;line-height:1.6;}
`;

export default function Start() {
  const [lang, setLang] = useState('es');
  const [v, setV] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const bl = navigator.language || 'es';
    setLang(bl.startsWith('es') ? 'es' : 'en');
    setTimeout(() => setV(true), 100);
  }, []);

  const es = lang === 'es';

  return (
    <>
      <style dangerouslySetInnerHTML={{__html: css}} />
      <div style={{fontFamily:"'Cormorant Garamond',Georgia,serif",background:'#FBF7F0',color:'#0D3D3D'}}>

        {/* HERO */}
        <div style={{minHeight:'100vh',display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',padding:'3rem 1.5rem',textAlign:'center',background:'linear-gradient(180deg,#ffffff 0%,#FBF7F0 100%)'}}>
          <div style={{maxWidth:'500px',width:'100%'}}>
            <div className={['fi d1', v?'v':''].join(' ')}>
              <img src="/images/shula-lagrima.jpg" alt="Lumera" style={{width:'140px',height:'175px',objectFit:'cover',objectPosition:'top center',borderRadius:'50% 50% 40% 40%',border:'3px solid #C9935A',marginBottom:'1.5rem',boxShadow:'0 12px 40px rgba(201,147,90,0.25)'}}/>
            </div>
            <div className={['fi d1', v?'v':''].join(' ')} style={{fontFamily:'Montserrat,sans-serif',fontSize:'0.7rem',fontWeight:700,color:'#C9935A',letterSpacing:'0.4em',marginBottom:'1.25rem'}}>
              ✦ LUMERA
            </div>
            <div className={['fi d2', v?'v':''].join(' ')}>
              <h1 style={{fontSize:'clamp(1.9rem,5vw,2.5rem)',fontWeight:700,lineHeight:1.15,marginBottom:'1rem',color:'#0D3D3D'}}>
                {es ? '¿Tu energía, tu sueño o tu ánimo ya no son los de antes?' : 'Is your energy, sleep or mood not what it used to be?'}
              </h1>
            </div>
            <div className={['fi d3', v?'v':''].join(' ')}>
              <p style={{fontSize:'1.1rem',fontStyle:'italic',color:'rgba(13,61,61,0.65)',marginBottom:'0.75rem',lineHeight:1.7}}>
                {es ? 'Lumera convierte tus síntomas y objetivos en un plan claro de nutrición, movimiento y seguimiento para que dejes de ir a ciegas.' : 'Lumera turns your symptoms and goals into a clear plan of nutrition, movement and tracking so you stop going blind.'}
              </p>
            </div>
            <div className={['fi d3', v?'v':''].join(' ')} style={{display:'flex',gap:'0.5rem',justifyContent:'center',flexWrap:'wrap',marginBottom:'1.75rem'}}>
              {(es ? ['Seguimiento hormonal','Menús adaptados','LUMI 24/7'] : ['Hormonal tracking','Adapted menus','LUMI 24/7']).map((b,i) => (
                <span key={i} className="tag">{b}</span>
              ))}
            </div>
            <div className={['fi d4', v?'v':''].join(' ')}>
              <button className="btn-copper pulse" onClick={()=>router.push('/quiz')} style={{marginBottom:'0.75rem'}}>
                {es ? '✨ Empezar mi plan — 2 minutos' : '✨ Start my plan — 2 minutes'}
              </button>
              <p style={{fontSize:'0.78rem',color:'rgba(13,61,61,0.35)',fontFamily:'Montserrat,sans-serif'}}>
                {es ? '3 días gratis · Sin tarjeta · Cancela cuando quieras' : '3 days free · No card · Cancel anytime'}
              </p>
            </div>
          </div>
        </div>

        {/* IDENTIFICACIÓN */}
        <div className="sec" style={{background:'white'}}>
          <div className="wrap" style={{textAlign:'center'}}>
            <div className="label">{es ? 'Si te sientes así, no estás sola' : 'If you feel this way, you are not alone'}</div>
            <h2 style={{fontSize:'1.9rem',fontWeight:700,marginBottom:'0.5rem',lineHeight:1.2}}>
              {es ? 'Tu cuerpo está hablando. Solo necesita ser escuchado.' : 'Your body is talking. It just needs to be heard.'}
            </h2>
            <p style={{fontSize:'0.85rem',fontFamily:'Montserrat,sans-serif',color:'rgba(13,61,61,0.5)',marginBottom:'1.75rem',fontStyle:'italic'}}>
              {es ? 'Cada síntoma tiene una explicación biológica real.' : 'Every symptom has a real biological explanation.'}
            </p>
            {(es ? [
              {icon:'😴', text:'Duermes peor o te despiertas a las 3am sin razón', note:'Ventana de cortisol'},
              {icon:'⚡', text:'Cansancio que no desaparece aunque descanses', note:'Fatiga adrenal'},
              {icon:'🍬', text:'Antojos de dulce a las 4pm que no puedes controlar', note:'Tu cortisol pide glucosa'},
              {icon:'🧠', text:'Niebla mental o falta de concentración', note:'Inflamación hormonal'},
              {icon:'🌡️', text:'Sofocos o cambios de temperatura inesperados', note:'Fluctuación del estrógeno'},
              {icon:'📅', text:'Tu ciclo ha cambiado o ya no aparece', note:'Transición hormonal activa'},
            ] : [
              {icon:'😴', text:'Worse sleep or waking at 3am for no reason', note:'Cortisol window'},
              {icon:'⚡', text:'Fatigue that does not go away even after rest', note:'Adrenal fatigue'},
              {icon:'🍬', text:'Afternoon sugar cravings you cannot control', note:'Cortisol asking for glucose'},
              {icon:'🧠', text:'Brain fog or lack of concentration', note:'Hormonal inflammation'},
              {icon:'🌡️', text:'Hot flashes or unexpected temperature changes', note:'Oestrogen fluctuation'},
              {icon:'📅', text:'Your cycle has changed or disappeared', note:'Active hormonal transition'},
            ]).map((s,i) => (
              <div key={i} className="symp">
                <span style={{fontSize:'1.3rem',flexShrink:0}}>{s.icon}</span>
                <div style={{flex:1,textAlign:'left'}}>
                  <div style={{fontSize:'1rem',color:'#0D3D3D',lineHeight:1.5}}>{s.text}</div>
                  <div style={{fontSize:'0.72rem',fontFamily:'Montserrat,sans-serif',fontWeight:600,color:'#2A7A4A',marginTop:'0.2rem'}}>→ {s.note}</div>
                </div>
              </div>
            ))}
            <button className="btn-copper" onClick={()=>router.push('/quiz')} style={{marginTop:'1.5rem'}}>
              {es ? '→ Entender qué me está pasando' : '→ Understand what is happening to me'}
            </button>
          </div>
        </div>

        {/* PROBLEMA */}
        <div className="sec" style={{background:'#FBF7F0'}}>
          <div className="wrap" style={{textAlign:'center'}}>
            <div className="label">{es ? 'El problema real' : 'The real problem'}</div>
            <h2 style={{fontSize:'1.9rem',fontWeight:700,marginBottom:'1rem',lineHeight:1.2}}>
              {es ? 'No necesitas más información. Necesitas un plan.' : 'You do not need more information. You need a plan.'}
            </h2>
            <p style={{fontSize:'1.05rem',fontStyle:'italic',color:'rgba(13,61,61,0.7)',lineHeight:1.8,marginBottom:'1.5rem'}}>
              {es ? 'Muchas mujeres saben que algo cambió, pero no saben por dónde empezar. Lumera convierte esa confusión en decisiones simples: qué comer, cómo moverte y qué priorizar para sentirte mejor.' : 'Many women know something changed, but do not know where to start. Lumera turns that confusion into simple decisions: what to eat, how to move and what to prioritise to feel better.'}
            </p>
            <div style={{background:'linear-gradient(135deg,rgba(201,147,90,0.08),rgba(201,147,90,0.03))',border:'1px solid rgba(201,147,90,0.25)',borderLeft:'4px solid #C9935A',borderRadius:'0 1rem 1rem 0',padding:'1.25rem 1.5rem',textAlign:'left'}}>
              <div style={{fontFamily:'Montserrat,sans-serif',fontSize:'0.68rem',fontWeight:700,color:'#C9935A',letterSpacing:'2px',textTransform:'uppercase',marginBottom:'0.5rem'}}>💡 {es ? '¿Sabías que?' : 'Did you know?'}</div>
              <p style={{fontSize:'1rem',lineHeight:1.7,fontStyle:'italic',color:'rgba(13,61,61,0.85)'}}>
                {es ? 'El estrógeno no solo regula tu ciclo — también actúa como antiinflamatorio natural en tu cerebro. Cuando fluctúa después de los 40, cambia tu memoria, tu sueño y tu humor. Todo está conectado.' : 'Oestrogen does not just regulate your cycle — it also acts as a natural anti-inflammatory in your brain. When it fluctuates after 40, it changes your memory, sleep and mood. Everything is connected.'}
              </p>
            </div>
          </div>
        </div>

        {/* SOLUCIÓN */}
        <div className="sec" style={{background:'#0D3D3D'}}>
          <div className="wrap" style={{textAlign:'center'}}>
            <div style={{fontFamily:'Montserrat,sans-serif',fontSize:'0.7rem',fontWeight:700,color:'#C9935A',letterSpacing:'3px',textTransform:'uppercase',marginBottom:'0.6rem'}}>
              {es ? 'La solución' : 'The solution'}
            </div>
            <h2 style={{fontSize:'1.9rem',fontWeight:700,color:'white',marginBottom:'0.5rem',lineHeight:1.2}}>
              {es ? 'Tu bienestar, traducido a pasos claros.' : 'Your wellbeing, translated into clear steps.'}
            </h2>
            <p style={{fontSize:'0.85rem',fontStyle:'italic',color:'rgba(240,232,220,0.5)',marginBottom:'2rem',fontFamily:'Montserrat,sans-serif'}}>
              {es ? 'Sin dietas milagro. Sin promesas vacías. Solo ciencia aplicada a ti.' : 'No miracle diets. No empty promises. Just science applied to you.'}
            </p>
            {(es ? [
              {icon:'🤝', title:'LUMI — Tu guía diaria 24/7', body:'No es un chatbot. Es tu confidente hormonal. Te conoce, recuerda tu historial y te acompaña cuando lo necesitas — incluso a las 3am.'},
              {icon:'📸', title:'La Lente Alquímica', body:'Fotografía tu plato y LUMI analiza cómo afecta a tus hormonas en segundos. Cocción, nutrientes, combinaciones óptimas.'},
              {icon:'📊', title:'Seguimiento inteligente', body:'Detecta patrones entre tus síntomas, energía y hábitos. Anticipa lo que viene — no solo registra lo que ya pasó.'},
              {icon:'🥗', title:'Menús hormonales', body:'Menús que cambian cada semana según tus síntomas reales. Tu ciclo, tu objetivo, tu tiempo. Nunca el mismo plan dos veces.'},
              {icon:'💪', title:'Ejercicio adaptado', body:'Rutinas diseñadas según tu condición física actual y lo que quieres conseguir. Sin exigirte lo que no puedes hoy.'},
              {icon:'📅', title:'Adaptado a tu ciclo', body:'Si aún tienes periodo, tu plan cambia con cada fase. Si ya no, refleja tu nueva realidad hormonal.'},
            ] : [
              {icon:'🤝', title:'LUMI — Your daily guide 24/7', body:'Not a chatbot. Your hormonal confidante. She knows you, remembers your history and supports you when you need it.'},
              {icon:'📸', title:'The Alchemical Lens', body:'Photograph your plate and LUMI analyses how it affects your hormones in seconds.'},
              {icon:'📊', title:'Smart tracking', body:'Detects patterns between your symptoms, energy and habits. Anticipates what is coming.'},
              {icon:'🥗', title:'Hormonal menus', body:'Menus that change every week based on your real symptoms. Your cycle, your goal, your time.'},
              {icon:'💪', title:'Adapted exercise', body:'Routines designed around your current fitness level and what you want to achieve.'},
              {icon:'📅', title:'Adapted to your cycle', body:'If you still have your period, your plan shifts with each phase. If not, it reflects your new hormonal reality.'},
            ]).map((f,i) => (
              <div key={i} style={{display:'flex',gap:'1rem',padding:'1rem 0',borderBottom:'1px solid rgba(201,147,90,0.1)',textAlign:'left'}}>
                <span style={{fontSize:'1.4rem',flexShrink:0,marginTop:'0.1rem'}}>{f.icon}</span>
                <div>
                  <div style={{fontSize:'1.05rem',fontWeight:700,color:'white',marginBottom:'0.25rem'}}>{f.title}</div>
                  <div style={{fontSize:'0.95rem',fontStyle:'italic',color:'rgba(240,232,220,0.55)',lineHeight:1.6}}>{f.body}</div>
                </div>
              </div>
            ))}
            <button className="btn-copper" onClick={()=>router.push('/quiz')} style={{marginTop:'2rem'}}>
              {es ? '✨ Empezar 3 días gratis' : '✨ Start 3 days free'}
            </button>
          </div>
        </div>

        {/* CÓMO FUNCIONA */}
        <div className="sec" style={{background:'white'}}>
          <div className="wrap" style={{textAlign:'center'}}>
            <div className="label">{es ? 'Cómo funciona' : 'How it works'}</div>
            <h2 style={{fontSize:'1.9rem',fontWeight:700,marginBottom:'1.75rem',lineHeight:1.2}}>
              {es ? 'Empieza hoy en 3 pasos.' : 'Start today in 3 steps.'}
            </h2>
            {(es ? [
              {n:'1', title:'Cuéntanos cómo te sientes', body:'Responde 2 minutos de preguntas sobre tus síntomas, objetivo, ciclo y estilo de vida.'},
              {n:'2', title:'Recibe tu plan personalizado', body:'LUMI analiza tus respuestas y genera un plan único adaptado a tu biología real.'},
              {n:'3', title:'Sigue tu evolución cada día', body:'Menús, ejercicios, seguimiento de síntomas y LUMI contigo en cada paso.'},
            ] : [
              {n:'1', title:'Tell us how you feel', body:'Answer 2 minutes of questions about your symptoms, goal, cycle and lifestyle.'},
              {n:'2', title:'Receive your personalised plan', body:'LUMI analyses your answers and generates a unique plan adapted to your real biology.'},
              {n:'3', title:'Follow your evolution every day', body:'Menus, exercises, symptom tracking and LUMI with you every step of the way.'},
            ]).map((s,i) => (
              <div key={i} className="step">
                <div className="step-num">{s.n}</div>
                <div style={{textAlign:'left'}}>
                  <div style={{fontSize:'1.05rem',fontWeight:700,color:'#0D3D3D',marginBottom:'0.25rem'}}>{s.title}</div>
                  <div style={{fontSize:'0.95rem',fontStyle:'italic',color:'rgba(13,61,61,0.65)',lineHeight:1.6}}>{s.body}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* DIFERENCIAL */}
        <div className="sec" style={{background:'#FBF7F0'}}>
          <div className="wrap" style={{textAlign:'center'}}>
            <div className="label">{es ? 'Por qué Lumera' : 'Why Lumera'}</div>
            <h2 style={{fontSize:'1.9rem',fontWeight:700,marginBottom:'1rem',lineHeight:1.2}}>
              {es ? 'Tu problema no es falta de disciplina. Es falta de dirección.' : 'Your problem is not lack of discipline. It is lack of direction.'}
            </h2>
            <p style={{fontSize:'1.05rem',fontStyle:'italic',color:'rgba(13,61,61,0.7)',lineHeight:1.8,marginBottom:'1.75rem'}}>
              {es ? 'Saber qué hacer hoy reduce muchísimo la sensación de caos. Lumera te da estructura, calma y una sensación real de progreso sin saturarte de información.' : 'Knowing what to do today greatly reduces the feeling of chaos. Lumera gives you structure, calm and a real sense of progress without overwhelming you.'}
            </p>
            <div style={{background:'linear-gradient(135deg,#0D3D3D,#1A5C5C)',borderRadius:'1rem',padding:'1.5rem',textAlign:'center'}}>
              <p style={{fontSize:'1.3rem',fontWeight:700,color:'white',lineHeight:1.4,fontStyle:'italic'}}>
                {es ? '"Menos culpa. Más claridad. Más control."' : '"Less guilt. More clarity. More control."'}
              </p>
            </div>
          </div>
        </div>

        {/* FUNDADORA */}
        <div className="sec" style={{background:'white'}}>
          <div className="wrap">
            <div style={{background:'linear-gradient(135deg,#FBF7F0,white)',border:'1px solid rgba(201,147,90,0.2)',borderRadius:'1.25rem',padding:'2rem'}}>
              <div className="label" style={{textAlign:'center'}}>{es ? 'Quién hay detrás de Lumera' : 'Who is behind Lumera'}</div>
              <div style={{fontSize:'1.5rem',fontWeight:700,color:'#0D3D3D',textAlign:'center',marginBottom:'1.25rem'}}>
                {es ? 'De mujer a mujer.' : 'From woman to woman.'}
              </div>
              <p style={{fontSize:'1rem',lineHeight:1.85,color:'rgba(13,61,61,0.8)',fontStyle:'italic',whiteSpace:'pre-line'}}>
                {es ? 'Soy Bibiana, fundadora de Lumera, mamá de dos peques y este año, orgullosamente cuarentona.\n\nLumera nació de mi propia necesidad: entender qué le estaba pasando a mi cuerpo al entrar en los 40. Sentí que faltaban respuestas claras — y decidí buscarlas.\n\nGracias a mi formación en bioquímica, nutrición y tecnología de los alimentos, y sobre todo a mi propia experiencia, quise crear un espacio para todas las que estamos viviendo esta transformación. Porque los 40 no son un problema a resolver — son una nueva era a conquistar.\n\nBienvenida.' : "I'm Bibiana, founder of Lumera, mum of two and this year, proudly turning forty.\n\nLumera was born from my own need: to understand what was happening to my body as I entered my 40s. I felt that clear answers were missing — so I decided to find them.\n\nWith my background in biochemistry, nutrition and food technology, and above all my own experience, I wanted to create a space for all of us living this transformation. Because your 40s are not a problem to solve — they are a new era to own.\n\nWelcome."}
              </p>
            </div>
          </div>
        </div>

        {/* FAQ */}
        <div className="sec" style={{background:'#FBF7F0'}}>
          <div className="wrap">
            <div className="label" style={{textAlign:'center'}}>{es ? 'Preguntas frecuentes' : 'FAQ'}</div>
            <h2 style={{fontSize:'1.9rem',fontWeight:700,marginBottom:'1.75rem',textAlign:'center',lineHeight:1.2}}>
              {es ? 'Lo que más nos preguntan.' : 'What you ask us most.'}
            </h2>
            {(es ? [
              {q:'¿Esto es para mí si no sé si estoy en esta etapa?', a:'Sí. Lumera está pensada para mujeres que notan cambios y quieren entender qué está pasando — aunque no tengan un diagnóstico.'},
              {q:'¿Necesito tener síntomas muy claros?', a:'No. Basta con sentir que tu energía, sueño, ánimo o cuerpo ya no responden igual que antes.'},
              {q:'¿Qué incluye la prueba gratis?', a:'3 días de acceso completo a Lumera: LUMI, menús, seguimiento y La Lente Alquímica. Sin compromisos.'},
              {q:'¿Puedo cancelar cuando quiera?', a:'Sí, cuando quieras y sin explicaciones. Sin complicaciones.'},
            ] : [
              {q:'Is this for me if I do not know if I am in this stage?', a:'Yes. Lumera is designed for women who notice changes and want to understand what is happening — even without a diagnosis.'},
              {q:'Do I need to have very clear symptoms?', a:'No. It is enough to feel that your energy, sleep, mood or body no longer respond the same way.'},
              {q:'What does the free trial include?', a:'3 days of full access to Lumera: LUMI, menus, tracking and the Alchemical Lens. No commitment.'},
              {q:'Can I cancel whenever I want?', a:'Yes, whenever you want and without explanation. No complications.'},
            ]).map((f,i) => (
              <div key={i} className="faq-item">
                <div className="faq-q">{f.q}</div>
                <div className="faq-a">{f.a}</div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA FINAL */}
        <div className="sec" style={{background:'linear-gradient(135deg,#0D3D3D,#1A5C5C)',textAlign:'center'}}>
          <div className="wrap">
            <div style={{fontSize:'clamp(1.8rem,4vw,2.2rem)',fontWeight:700,color:'white',lineHeight:1.2,marginBottom:'0.75rem'}}>
              {es ? 'Tu cuerpo cambió. Tu plan también puede cambiar.' : 'Your body changed. Your plan can change too.'}
            </div>
            <p style={{fontSize:'1.05rem',fontStyle:'italic',color:'rgba(240,232,220,0.55)',marginBottom:'2rem',lineHeight:1.7}}>
              {es ? 'Menos culpa. Más claridad. Más control.' : 'Less guilt. More clarity. More control.'}
            </p>
            <button className="btn-copper" onClick={()=>router.push('/quiz')} style={{maxWidth:'400px',margin:'0 auto',display:'block',marginBottom:'0.75rem'}}>
              {es ? '✨ Empezar mi plan gratis' : '✨ Start my free plan'}
            </button>
            <p style={{fontSize:'0.78rem',color:'rgba(240,232,220,0.3)',fontFamily:'Montserrat,sans-serif',marginBottom:'2rem'}}>
              {es ? '3 días gratis · Sin tarjeta · Cancela cuando quieras' : '3 days free · No card · Cancel anytime'}
            </p>
            <p style={{fontSize:'0.75rem',color:'rgba(240,232,220,0.2)',fontStyle:'italic',maxWidth:'360px',margin:'0 auto',lineHeight:1.6}}>
              {es ? 'Resultados individuales pueden variar. Lumera no diagnostica ni sustituye el consejo médico profesional.' : 'Individual results may vary. Lumera does not diagnose or replace professional medical advice.'}
            </p>
            <div style={{marginTop:'2.5rem',fontSize:'0.8rem',color:'rgba(201,147,90,0.3)',fontStyle:'italic',letterSpacing:'0.15em'}}>✦ Lumera</div>
          </div>
        </div>

      </div>
    </>
  );
}
