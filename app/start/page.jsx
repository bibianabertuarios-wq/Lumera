'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;0,700;1,400&family=Montserrat:wght@400;500;600;700&display=swap');
  *{box-sizing:border-box;margin:0;padding:0;}
  .fi{opacity:0;transform:translateY(20px);transition:opacity 0.8s ease,transform 0.8s ease;}
  .fi.v{opacity:1;transform:translateY(0);}
  .d1{transition-delay:0.1s;} .d2{transition-delay:0.25s;} .d3{transition-delay:0.4s;} .d4{transition-delay:0.55s;} .d5{transition-delay:0.7s;}
  @keyframes pulse{0%,100%{box-shadow:0 0 0 0 rgba(201,147,90,0.5);}50%{box-shadow:0 0 0 12px rgba(201,147,90,0);}}
  .pulse{animation:pulse 2s infinite;}
  .btn-main{width:100%;background:linear-gradient(135deg,#C9935A,#A06030);border:none;border-radius:0.75rem;padding:1.15rem 1.5rem;color:white;font-size:1.05rem;font-family:Montserrat,sans-serif;font-weight:700;cursor:pointer;box-shadow:0 4px 24px rgba(201,147,90,0.35);transition:transform 0.2s ease;}
  .btn-main:hover{transform:translateY(-2px);}
  .symp-btn{width:100%;background:white;border:1.5px solid rgba(201,147,90,0.25);border-radius:0.75rem;padding:0.9rem 1.1rem;color:#0D3D3D;font-size:0.95rem;font-family:'Cormorant Garamond',Georgia,serif;cursor:pointer;text-align:left;display:flex;align-items:center;gap:0.75rem;margin-bottom:0.5rem;transition:all 0.2s ease;}
  .symp-btn:hover{border-color:#C9935A;background:rgba(201,147,90,0.05);}
  .symp-btn.sel{border-color:#C9935A;background:rgba(201,147,90,0.1);font-weight:600;}
  .check{width:20px;height:20px;border-radius:50%;border:2px solid rgba(201,147,90,0.4);flex-shrink:0;display:flex;align-items:center;justify-content:center;font-size:0.7rem;transition:all 0.2s ease;}
  .check.on{background:#C9935A;border-color:#C9935A;color:white;}
`;

export default function Start() {
  const [lang, setLang] = useState('es');
  const [v, setV] = useState(false);
  const [selected, setSelected] = useState([]);
  const router = useRouter();

  useEffect(() => {
    const bl = navigator.language || 'es';
    setLang(bl.startsWith('es') ? 'es' : 'en');
    setTimeout(() => setV(true), 100);
  }, []);

  const es = lang === 'es';

  const toggle = (s) => setSelected(prev => prev.includes(s) ? prev.filter(x => x !== s) : [...prev, s]);

  const symptoms = es ? [
    {icon:'⚡', text:'Siento un cansancio que no se va'},
    {icon:'😴', text:'Me despierto a mitad de la noche'},
    {icon:'🧠', text:'Me cuesta concentrarme — neblina mental'},
    {icon:'🎢', text:'Mi estado de ánimo es una montaña rusa'},
    {icon:'⚖️', text:'Mi peso sube aunque no haya cambiado nada'},
  ] : [
    {icon:'⚡', text:'I feel a fatigue that never goes away'},
    {icon:'😴', text:'I wake up in the middle of the night'},
    {icon:'🧠', text:'I struggle to concentrate — brain fog'},
    {icon:'🎢', text:'My mood is a rollercoaster'},
    {icon:'⚖️', text:'My weight keeps going up even though nothing changed'},
  ];

  return (
    <>
      <style dangerouslySetInnerHTML={{__html: css}} />
      <div style={{minHeight:'100vh',display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',padding:'3rem 1.5rem',textAlign:'center',background:'linear-gradient(180deg,#ffffff 0%,#FBF7F0 100%)',fontFamily:"'Cormorant Garamond',Georgia,serif"}}>
        <div style={{maxWidth:'480px',width:'100%'}}>

          <div className={['fi d1',v?'v':''].join(' ')}>
            <img src="/images/shula-lagrima.jpg" alt="Lumera" style={{width:'120px',height:'150px',objectFit:'cover',objectPosition:'top center',borderRadius:'50% 50% 40% 40%',border:'3px solid #C9935A',marginBottom:'1.25rem',boxShadow:'0 8px 32px rgba(201,147,90,0.2)'}}/>
          </div>

          <div className={['fi d1',v?'v':''].join(' ')} style={{fontFamily:'Montserrat,sans-serif',fontSize:'0.7rem',fontWeight:700,color:'#C9935A',letterSpacing:'0.4em',marginBottom:'1rem'}}>
            ✦ LUMERA
          </div>

          <div className={['fi d2',v?'v':''].join(' ')}>
            <h1 style={{fontSize:'clamp(1.9rem,5vw,2.5rem)',fontWeight:700,lineHeight:1.15,marginBottom:'0.6rem',color:'#0D3D3D'}}>
              {es ? '¿Fatiga, insomnio o neblina mental?' : 'Fatigue, insomnia or brain fog?'}
            </h1>
            <h2 style={{fontSize:'clamp(1.2rem,3vw,1.5rem)',fontWeight:600,lineHeight:1.3,marginBottom:'1rem',color:'#C9935A',fontStyle:'italic'}}>
              {es ? 'No te lo estás imaginando. Es tu cuerpo cambiando.' : 'You are not imagining it. Your body is changing.'}
            </h2>
          </div>

          <div className={['fi d3',v?'v':''].join(' ')}>
            <p style={{fontSize:'1rem',fontStyle:'italic',color:'rgba(13,61,61,0.6)',marginBottom:'1.75rem',lineHeight:1.7}}>
              {es ? 'A partir de los 40, las hormonas cambian las reglas del juego. Lumera entiende tus síntomas y te devuelve el control — sin complicaciones.' : 'After 40, hormones change the rules. Lumera understands your symptoms and gives you back control — without the complexity.'}
            </p>
          </div>

          <div className={['fi d3',v?'v':''].join(' ')} style={{marginBottom:'1.5rem',textAlign:'left'}}>
            <p style={{fontFamily:'Montserrat,sans-serif',fontSize:'0.72rem',fontWeight:700,color:'rgba(13,61,61,0.4)',letterSpacing:'2px',textTransform:'uppercase',marginBottom:'0.75rem',textAlign:'center'}}>
              {es ? 'Selecciona tu síntoma más molesto hoy:' : 'Select your most bothersome symptom today:'}
            </p>
            {symptoms.map((s,i) => (
              <button key={i} className={['symp-btn', selected.includes(s.text)?'sel':''].join(' ')} onClick={()=>toggle(s.text)}>
                <span className={['check', selected.includes(s.text)?'on':''].join(' ')}>
                  {selected.includes(s.text) ? '✓' : ''}
                </span>
                <span style={{fontSize:'1.1rem',flexShrink:0}}>{s.icon}</span>
                <span>{s.text}</span>
              </button>
            ))}
          </div>

          <div className={['fi d4',v?'v':''].join(' ')}>
            <button className={['btn-main', selected.length>0?'pulse':''].join(' ')} onClick={()=>router.push('/quiz')} style={{marginBottom:'0.75rem'}}>
              {es ? '→ Descubre qué le pasa a tu cuerpo y tu plan' : '→ Discover what is happening to your body'}
            </button>
            <p style={{fontSize:'0.78rem',color:'rgba(13,61,61,0.35)',fontFamily:'Montserrat,sans-serif'}}>
              {es ? 'En solo 2 minutos · 3 días gratis · Sin tarjeta' : 'In just 2 minutes · 3 days free · No card'}
            </p>
          </div>

        </div>
      </div>
    </>
  );
}
