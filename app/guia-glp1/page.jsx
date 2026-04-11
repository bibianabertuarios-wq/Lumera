'use client';
import { useState, useEffect } from 'react';

export default function GuiaGLP1() {
  const [lang, setLang] = useState('es');
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const bl = navigator.language || 'es';
    setLang(bl.startsWith('es') ? 'es' : 'en');
  }, []);

  const is_es = lang === 'es';
  const pdfUrl = is_es ? '/guia-glp1-es.pdf' : '/guia-glp1-en.pdf';

  const handleSubmit = async () => {
    if (!email || !name) return;
    setLoading(true);
    try {
      await fetch('/api/guia-glp1', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, name, lang })
      });
    } catch(e) {}
    setSubmitted(true);
    setLoading(false);
  };

  const bg = {
    minHeight:'100vh',
    background:'linear-gradient(135deg,rgba(10,8,6,0.95) 0%,rgba(26,16,8,0.92) 100%)',
    backgroundImage:'url(/images/quiz-bg.png)',
    backgroundSize:'cover',
    backgroundPosition:'center',
    backgroundBlendMode:'multiply',
    display:'flex',
    flexDirection:'column',
    alignItems:'center',
    justifyContent:'center',
    padding:'1.5rem',
    fontFamily:"'Cormorant Garamond',Georgia,serif"
  };

  const inputStyle = {
    width:'100%',
    background:'rgba(255,255,255,0.06)',
    border:'1px solid rgba(201,147,90,0.3)',
    borderRadius:'0.75rem',
    padding:'0.9rem 1rem',
    color:'white',
    fontSize:'1rem',
    fontFamily:"'Cormorant Garamond',serif",
    marginBottom:'0.75rem',
    outline:'none'
  };

  const items_es = [
    '✦  Come en el orden correcto — reduce glucosa un 75%',
    '✦  10 minutos que cambian tu metabolismo',
    '✦  La calma como activador hormonal'
  ];
  const items_en = [
    '✦  Eat in the right order — reduces glucose 75%',
    '✦  10 minutes that change your metabolism',
    '✦  Calm as a hormonal activator'
  ];
  const items = is_es ? items_es : items_en;

  return (
    <div style={bg}>
      <div style={{marginBottom:'2rem',textAlign:'center'}}>
        <div style={{color:'#C9935A',fontSize:'1.1rem',letterSpacing:'0.2em',fontWeight:300}}>{'✦ Lumera'}</div>
      </div>

      <div style={{width:'100%',maxWidth:'520px'}}>
        {!submitted ? (
          <div style={{background:'rgba(255,255,255,0.04)',border:'1px solid rgba(201,147,90,0.3)',borderRadius:'1.5rem',padding:'2.5rem 2rem'}}>
            <div style={{textAlign:'center',marginBottom:'2rem'}}>
              <div style={{fontSize:'1.8rem',fontWeight:700,color:'white',lineHeight:1.2,marginBottom:'1rem'}}>
                {is_es ? '3 Hábitos GLP-1 Naturales que Cambian tu Energía' : '3 Natural GLP-1 Habits for Stable Energy'}
              </div>
              <div style={{fontSize:'1.05rem',color:'rgba(240,232,220,0.8)',lineHeight:1.6,fontStyle:'italic'}}>
                {is_es ? '¿Antojos a las 4pm? ¿Energía cero después de comer? No es lo que comes — es tu GLP-1.' : '4pm cravings? Energy crash after lunch? It is not what you eat — it is your GLP-1.'}
              </div>
            </div>

            <div style={{background:'rgba(201,147,90,0.08)',borderLeft:'3px solid #C9935A',borderRadius:'0 8px 8px 0',padding:'1rem 1.2rem',marginBottom:'1.5rem'}}>
              {items.map((item, i) => (
                <div key={i} style={{color:'rgba(240,232,220,0.88)',fontSize:'1rem',marginBottom:'0.5rem',fontStyle:'italic'}}>{item}</div>
              ))}
            </div>

            <input type="text" placeholder={is_es ? 'Tu nombre' : 'Your name'} value={name} onChange={e => setName(e.target.value)} style={inputStyle} />
            <input type="email" placeholder={is_es ? 'Tu email' : 'Your email'} value={email} onChange={e => setEmail(e.target.value)} style={{...inputStyle, marginBottom:'1rem'}} />

            <button
              onClick={handleSubmit}
              disabled={loading || !email || !name}
              style={{width:'100%',background:'linear-gradient(135deg,#C9935A,#A06030)',border:'none',borderRadius:'0.75rem',padding:'1rem',color:'white',fontSize:'1.1rem',fontFamily:"'Cormorant Garamond',serif",fontWeight:600,cursor:'pointer',marginBottom:'0.75rem',opacity:(!email||!name)?0.6:1}}
            >
              {loading ? '...' : (is_es ? '📥 Descargar guía gratis' : '📥 Download free guide')}
            </button>
            <div style={{textAlign:'center',fontSize:'0.8rem',color:'rgba(240,232,220,0.35)',fontStyle:'italic'}}>
              {is_es ? 'Sin spam. Solo ciencia hormonal.' : 'No spam. Just hormonal science.'}
            </div>
          </div>
        ) : (
          <div style={{background:'rgba(255,255,255,0.04)',border:'1px solid rgba(201,147,90,0.4)',borderRadius:'1.5rem',padding:'2.5rem 2rem',textAlign:'center'}}>
            <div style={{fontSize:'2.5rem',marginBottom:'1rem'}}>{'🎉'}</div>
            <div style={{fontSize:'1.6rem',fontWeight:700,color:'white',marginBottom:'0.5rem'}}>
              {is_es ? '¡Tu guía está lista!' : 'Your guide is ready!'}
            </div>
            <div style={{fontSize:'1rem',color:'rgba(240,232,220,0.7)',marginBottom:'2rem',fontStyle:'italic'}}>
              {is_es ? 'Haz clic para descargarla ahora' : 'Click to download now'}
            </div>
            <a href={pdfUrl} target="_blank" rel="noopener noreferrer" style={{display:'block',background:'linear-gradient(135deg,#C9935A,#A06030)',borderRadius:'0.75rem',padding:'1rem',color:'white',fontSize:'1.1rem',fontFamily:"'Cormorant Garamond',serif",fontWeight:600,textDecoration:'none',marginBottom:'1.5rem'}}>
              {is_es ? '⬇️ Descargar PDF' : '⬇️ Download PDF'}
            </a>
            <div style={{borderTop:'1px solid rgba(201,147,90,0.2)',paddingTop:'1.5rem'}}>
              <div style={{fontSize:'0.95rem',color:'rgba(240,232,220,0.6)',fontStyle:'italic',marginBottom:'1rem'}}>
                {is_es ? '¿Quieres tu plan personalizado? Prueba Lumera 3 días gratis' : 'Want your personalised plan? Try Lumera free 3 days'}
              </div>
              <a href="/?bonus=glp1" style={{color:'#C9935A',fontSize:'1rem',textDecoration:'none',fontStyle:'italic'}}>
                {'getlumera.app ✦'}
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
