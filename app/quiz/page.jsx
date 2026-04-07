'use client';
import { useState, useEffect } from 'react';

const questions = {
  es: [
    { q: '¿Cuál es tu mayor reto ahora mismo?', opts: ['Agotamiento constante aunque duerma bien','Mi cuerpo cambia y no entiendo por qué','No consigo perder peso aunque me esfuerce','Mi estado de ánimo es completamente impredecible'] },
    { q: '¿Cuándo lo sientes con más fuerza?', opts: ['Por la mañana, me levanto ya agotada','Por la tarde, caída de energía brutal','Todo el día sin descanso','Por la noche, no puedo apagar la mente'] },
    { q: '¿Qué has intentado hasta ahora?', opts: ['Dietas y ejercicio, sin resultado real','Suplementos y vitaminas, poco efecto','Todavía no he encontrado por dónde empezar','He probado de todo y nada funciona'] }
  ],
  en: [
    { q: 'What is your biggest challenge right now?', opts: ['Constant exhaustion despite sleeping well','My body is changing and I do not understand why','I cannot lose weight no matter how hard I try','My mood is completely unpredictable'] },
    { q: 'When do you feel it most intensely?', opts: ['Morning — I wake up already drained','Afternoon — a brutal energy crash','All day long without relief','At night — I cannot quiet my mind'] },
    { q: 'What have you tried so far?', opts: ['Diets and exercise with no real results','Supplements and vitamins with little effect','I have not found where to start yet','I have tried everything and nothing works'] }
  ]
};

export default function QuizPage() {
  const [lang, setLang] = useState('en');
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  useEffect(() => {
    const bl = navigator.language || 'en';
    setLang(bl.startsWith('es') ? 'es' : 'en');
  }, []);

  const qs = questions[lang];

  const handleAnswer = async (i) => {
    const newAnswers = [...answers, i];
    setAnswers(newAnswers);

    if (step < 2) {
      setStep(step + 1);
    } else {
      setLoading(true);
      const selectedAnswers = newAnswers.map((idx, qIdx) => qs[qIdx].opts[idx]);
      
      const prompt = lang === 'es'
        ? `Eres LUMI, la guía biológica de Lumera — una app de bienestar para mujeres de 40+. Una mujer acaba de responder estas preguntas:
1. Mayor reto: "${selectedAnswers[0]}"
2. Cuándo lo siente más: "${selectedAnswers[1]}"
3. Qué ha intentado: "${selectedAnswers[2]}"

Analiza su patrón hormonal y metabólico en máximo 4 líneas. Habla directamente a ella, en segunda persona, con tono cálido, científico y empoderador. Menciona cortisol, GLP-1, estrógeno o progesterona según corresponda. NO uses emojis. NO menciones diagnósticos médicos. Termina diciéndole cómo Lumera puede ayudarla específicamente.`
        : `You are LUMI, the biological guide of Lumera — a wellness app for women 40+. A woman just answered these questions:
1. Biggest challenge: "${selectedAnswers[0]}"
2. When she feels it most: "${selectedAnswers[1]}"
3. What she has tried: "${selectedAnswers[2]}"

Analyze her hormonal and metabolic pattern in maximum 4 lines. Speak directly to her, in second person, with a warm, scientific and empowering tone. Mention cortisol, GLP-1, oestrogen or progesterone as appropriate. Do NOT use emojis. Do NOT mention medical diagnoses. End by telling her how Lumera can help her specifically.`;

      try {
        const response = await fetch('/api/quiz', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ prompt })
        });
        const data = await response.json();
        const text = data.text || '';
        setResult(text);
      } catch (e) {
        setResult(lang === 'es'
          ? 'Tu patrón sugiere un desequilibrio hormonal que está afectando tu energía y metabolismo. Lumera puede ayudarte a entenderlo y reconducirlo.'
          : 'Your pattern suggests a hormonal imbalance affecting your energy and metabolism. Lumera can help you understand and rebalance it.');
      }
      setLoading(false);
    }
  };

  const t = {
    question: lang === 'es' ? `Pregunta ${step + 1} de 3` : `Question ${step + 1} of 3`,
    analyzing: lang === 'es' ? 'LUMI está analizando tu patrón...' : 'LUMI is analyzing your pattern...',
    profile: lang === 'es' ? '✦ Tu análisis de LUMI' : '✦ Your LUMI analysis',
    cta: lang === 'es' ? 'Quiero mi prueba gratis' : 'Start my free trial',
    login: lang === 'es' ? 'Ya tengo cuenta →' : 'Already have an account →',
    sub: lang === 'es' ? '3 días gratis · Sin tarjeta' : '3 days free · No card needed'
  };

  return (
    <div style={{minHeight:'100vh',background:'linear-gradient(135deg,rgba(10,8,6,0.92) 0%,rgba(26,16,8,0.88) 100%)',backgroundImage:'url(/images/quiz-bg.png)',backgroundSize:'cover',backgroundPosition:'center',backgroundBlendMode:'multiply',display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',padding:'1.5rem',fontFamily:"Georgia, serif"}}>
      <link href="https://fonts.googleapis.com/css2?family=Cormorant:ital,wght@0,300;0,400;1,300;1,400&display=swap" rel="stylesheet"/>

      {/* Logo */}
      <div style={{position:'fixed',top:'1.25rem',left:'50%',transform:'translateX(-50%)',display:'flex',alignItems:'center',gap:'0.5rem',zIndex:10}}>
        <svg width="24" height="24" viewBox="0 0 100 100" fill="none">
          <path d="M50 5 C25 5 5 25 5 50 C5 75 25 95 50 95 C35 85 25 68 25 50 C25 32 35 15 50 5Z" fill="#9b8ec4" opacity="0.85"/>
          <path d="M50 22 L56 45 L50 78 L44 45 Z" fill="#C9935A"/>
        </svg>
        <span style={{color:'#C9935A',fontSize:'1.1rem',letterSpacing:'0.2em',fontWeight:300,fontFamily:"'Cormorant',serif"}}>Lumera</span>
      </div>

      <div style={{width:'100%',maxWidth:'540px',marginTop:'2rem'}}>
        {loading ? (
          <div style={{textAlign:'center',padding:'3rem'}}>
            <div style={{fontSize:'0.75rem',letterSpacing:'0.35em',color:'rgba(201,147,90,0.7)',textTransform:'uppercase',marginBottom:'1.5rem'}}>{t.analyzing}</div>
            <div style={{display:'flex',gap:'0.5rem',justifyContent:'center'}}>
              {[0,1,2].map(i => (
                <div key={i} style={{width:'8px',height:'8px',borderRadius:'50%',background:'#C9935A',animation:'pulse 1.4s ease-in-out infinite',animationDelay:`${i*0.2}s`}}/>
              ))}
            </div>
            <style>{`@keyframes pulse{0%,100%{opacity:0.3;transform:scale(0.8)}50%{opacity:1;transform:scale(1.2)}}`}</style>
          </div>
        ) : !result ? (
          <div style={{background:'rgba(255,255,255,0.03)',border:'0.5px solid rgba(201,147,90,0.25)',borderRadius:'1.5rem',padding:'2.5rem 1.75rem'}}>
            <div style={{textAlign:'center',marginBottom:'2rem'}}>
              <div style={{fontSize:'0.7rem',letterSpacing:'0.35em',color:'rgba(201,147,90,0.6)',textTransform:'uppercase',marginBottom:'1rem'}}>{t.question}</div>
              <div style={{display:'flex',gap:'0.5rem',justifyContent:'center',marginBottom:'1.75rem'}}>
                {[0,1,2].map(i => (
                  <div key={i} style={{height:'3px',width:'70px',borderRadius:'2px',background:i<=step?'#C9935A':'rgba(201,147,90,0.15)',transition:'background 0.3s'}}/>
                ))}
              </div>
              <h2 style={{fontSize:'2rem',fontWeight:400,fontStyle:'italic',color:'#FFFFFF',lineHeight:1.3,fontFamily:"'Cormorant',serif"}}>
                {qs[step].q}
              </h2>
            </div>
            <div style={{display:'flex',flexDirection:'column',gap:'0.75rem'}}>
              {qs[step].opts.map((opt, i) => (
                <button key={i} onClick={() => handleAnswer(i)} style={{background:'rgba(201,147,90,0.12)',border:'1px solid rgba(201,147,90,0.4)',borderRadius:'0.875rem',padding:'1.1rem 1.25rem',textAlign:'left',color:'#FFFFFF',fontSize:'1.15rem',fontFamily:"'Cormorant',serif",cursor:'pointer',transition:'all 0.2s',display:'flex',alignItems:'center',gap:'0.75rem'}}
                onMouseEnter={e=>{e.currentTarget.style.background='rgba(201,147,90,0.12)';e.currentTarget.style.borderColor='rgba(201,147,90,0.5)';}}
                onMouseLeave={e=>{e.currentTarget.style.background='rgba(201,147,90,0.05)';e.currentTarget.style.borderColor='rgba(201,147,90,0.2)';}}>
                  <span style={{color:'#C9935A',fontSize:'0.75rem',flexShrink:0}}>✦</span>{opt}
                </button>
              ))}
            </div>
            <div style={{textAlign:'center',marginTop:'1.75rem'}}>
              <a href="/" style={{color:'rgba(240,232,220,0.3)',fontSize:'0.82rem',textDecoration:'none',fontFamily:"'Cormorant',serif"}}>{t.login}</a>
            </div>
          </div>
        ) : (
          <div style={{background:'rgba(255,255,255,0.03)',border:'0.5px solid rgba(201,147,90,0.4)',borderRadius:'1.5rem',padding:'2.5rem 1.75rem'}}>
            <div style={{display:'flex',alignItems:'center',gap:'0.75rem',marginBottom:'1.5rem'}}>
              <div style={{width:'42px',height:'42px',borderRadius:'50%',background:'radial-gradient(circle at 35% 35%,rgba(201,147,90,0.4),rgba(10,8,6,0.9))',border:'1px solid rgba(201,147,90,0.5)',flexShrink:0}}/>
              <div>
                <div style={{color:'#C9935A',fontSize:'0.95rem',letterSpacing:'0.08em',fontFamily:"'Cormorant',serif"}}>LUMI</div>
                <div style={{color:'rgba(240,232,220,0.4)',fontSize:'0.75rem',fontFamily:"'Cormorant',serif"}}>✦ {lang==='es'?'Tu reflejo biológico':'Your biological mirror'}</div>
              </div>
            </div>
            <div style={{fontSize:'0.7rem',letterSpacing:'0.35em',color:'rgba(201,147,90,0.6)',textTransform:'uppercase',marginBottom:'1rem'}}>{t.profile}</div>
            <p style={{fontSize:'1.08rem',color:'rgba(240,232,220,0.88)',lineHeight:1.75,fontWeight:300,fontFamily:"'Cormorant',serif",marginBottom:'2rem',borderLeft:'2px solid rgba(201,147,90,0.3)',paddingLeft:'1rem'}}>{result}</p>
            <a href="/?register=true" style={{display:'block',width:'100%',background:'linear-gradient(135deg,#C9935A,#A06030)',border:'none',borderRadius:'0.875rem',padding:'1.1rem',color:'white',fontSize:'1.15rem',fontFamily:"'Cormorant',serif",fontWeight:500,cursor:'pointer',letterSpacing:'0.05em',boxShadow:'0 4px 24px rgba(201,147,90,0.35)',marginBottom:'0.75rem',textDecoration:'none',textAlign:'center'}}>
              ✦ {t.cta}
            </a>
            <div style={{textAlign:'center',fontSize:'0.78rem',color:'rgba(240,232,220,0.25)',fontFamily:"'Cormorant',serif",marginBottom:'1rem'}}>{t.sub}</div>
            <div style={{textAlign:'center'}}>
              <a href="/" style={{color:'rgba(240,232,220,0.3)',fontSize:'0.82rem',textDecoration:'none',fontFamily:"'Cormorant',serif"}}>{t.login}</a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
