'use client';
import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { useRouter } from 'next/navigation';

const PREGUNTAS_ES = [
  { id:'nombre', tipo:'texto', pregunta:'Primero, ¿cómo te llamas?', placeholder:'Tu nombre' },
  { id:'nacimiento', tipo:'fecha', pregunta:'¿Cuándo naciste?', sub:'Para calcular tu plan con precisión real' },
  { id:'ciclo', tipo:'opciones', pregunta:'¿Cómo está tu ciclo menstrual ahora mismo?', opciones:['Regular como siempre','Irregular — cambia de duración o cantidad','Muy irregular o casi desaparecido','Sin periodo hace menos de 12 meses','Sin periodo hace más de 12 meses','Sin periodo por intervención quirúrgica'] },
  { id:'objetivo', tipo:'opciones', pregunta:'¿Cuál es tu objetivo principal?', opciones:['Perder peso','Ganar energía y vitalidad','Equilibrio hormonal','Ganar fuerza y masa muscular','Dormir mejor'] },
  { id:'sintomas', tipo:'multiple', pregunta:'¿Cuáles son tus síntomas más frecuentes?', sub:'Puedes elegir varios', opciones:['Cansancio constante','Antojos de dulce','Insomnio o despertar nocturno','Hinchazón','Cambios de humor','Sofocos','Bajo deseo sexual','Niebla mental'] },
  { id:'medidas', tipo:'medidas', pregunta:'¿Cuánto mides y cuánto pesas?', sub:'Para calcular tu IMC, TMB y TDEE reales' },
  { id:'actividad', tipo:'opciones', pregunta:'¿Cómo es tu actividad física actual?', opciones:['Sedentaria — poco o nada de movimiento','Algo activa — camino, subo escaleras','Moderadamente activa — ejercicio 2-3 veces/semana','Muy activa — entreno regularmente'] },
  { id:'restricciones', tipo:'opciones', pregunta:'¿Tienes alguna restricción alimentaria?', opciones:['Ninguna','Vegetariana','Vegana','Sin gluten','Sin lácteos'] },
  { id:'medicacion', tipo:'opciones', pregunta:'¿Tomas alguna medicación de forma habitual?', opciones:['No','Sí, tratamiento hormonal (THS o anticonceptivos)','Sí, para tiroides','Sí, para tensión o colesterol','Sí, otra'] },
  { id:'condiciones', tipo:'multiple', pregunta:'¿Tienes alguna condición de salud diagnosticada?', sub:'Puedes elegir varias', opciones:['Ninguna','Hipotiroidismo / Hipertiroidismo','Diabetes o resistencia a la insulina','Hipertensión','Fibromialgia','SOP — Síndrome de ovario poliquístico','Endometriosis','Miomas','Menopausia quirúrgica','Otra'] },
];

const PREGUNTAS_EN = [
  { id:'nombre', tipo:'texto', pregunta:'First, what\'s your name?', placeholder:'Your name' },
  { id:'nacimiento', tipo:'fecha', pregunta:'When were you born?', sub:'To calculate your plan with real precision' },
  { id:'ciclo', tipo:'opciones', pregunta:'How would you describe your menstrual cycle right now?', opciones:['Regular as always','Irregular — changes in duration or flow','Almost gone','No period for less than 12 months','No period for over 12 months','Surgically induced menopause'] },
  { id:'objetivo', tipo:'opciones', pregunta:'What\'s your main goal?', opciones:['Lose weight','Gain energy and vitality','Hormonal balance','Build strength and muscle','Sleep better'] },
  { id:'sintomas', tipo:'multiple', pregunta:'Which symptoms do you experience most often?', sub:'You can choose several', opciones:['Constant fatigue','Sugar cravings','Insomnia or night waking','Bloating','Mood changes','Hot flashes','Low libido','Brain fog'] },
  { id:'medidas', tipo:'medidas', pregunta:'What\'s your height and weight?', sub:'To calculate your real BMI, BMR and TDEE' },
  { id:'actividad', tipo:'opciones', pregunta:'How physically active are you right now?', opciones:['Sedentary — little or no movement','Lightly active — walking, stairs','Moderately active — exercise 2-3x/week','Very active — regular training'] },
  { id:'restricciones', tipo:'opciones', pregunta:'Do you have any dietary restrictions?', opciones:['None','Vegetarian','Vegan','Gluten-free','Dairy-free'] },
  { id:'medicacion', tipo:'opciones', pregunta:'Do you take any regular medication?', opciones:['No','Yes, hormonal treatment (HRT or contraceptives)','Yes, for thyroid','Yes, for blood pressure or cholesterol','Yes, other'] },
  { id:'condiciones', tipo:'multiple', pregunta:'Have you been diagnosed with any health condition?', sub:'You can choose several', opciones:['None','Hypo / Hyperthyroidism','Diabetes or insulin resistance','High blood pressure','Fibromyalgia','PCOS','Endometriosis','Fibroids','Surgical menopause','Other'] },
];

function QuizInner() {
  const [lang, setLang] = useState('es');
  const [paso, setPaso] = useState(0);
  const [respuestas, setRespuestas] = useState({});
  const [seleccionMultiple, setSeleccionMultiple] = useState([]);
  const [altura, setAltura] = useState('');
  const [peso, setPeso] = useState('');
  const [visible, setVisible] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const bl = navigator.language || 'es';
    setLang(bl.startsWith('es') ? 'es' : 'en');
  }, []);

  useEffect(() => {
    setVisible(false);
    setTimeout(() => setVisible(true), 50);
    setSeleccionMultiple([]);
  }, [paso]);

  const preguntas = lang === 'es' ? PREGUNTAS_ES : PREGUNTAS_EN;
  const is_es = lang === 'es';
  const p = preguntas[paso];
  const total = preguntas.length;
  const progreso = ((paso) / total) * 100;

  const siguiente = (valor) => {
    const nuevas = { ...respuestas, [p.id]: valor };
    setRespuestas(nuevas);
    if (paso < total - 1) {
      setPaso(paso + 1);
    } else {
      const params = new URLSearchParams();
      Object.entries(nuevas).forEach(([k, v]) => {
        params.set(k, Array.isArray(v) ? v.join('|') : v);
      });
      params.set('lang', lang);
      router.push('/quiz/resultado?' + params.toString());
    }
  };

  const siguienteMultiple = () => {
    if (seleccionMultiple.length > 0) siguiente(seleccionMultiple);
  };

  const toggleMultiple = (op) => {
    setSeleccionMultiple(prev =>
      prev.includes(op) ? prev.filter(x => x !== op) : [...prev, op]
    );
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;0,700;1,400&family=Montserrat:wght@400;600;700&display=swap');
        *{box-sizing:border-box;margin:0;padding:0;}
        .fade{opacity:0;transform:translateY(16px);transition:opacity 0.5s ease,transform 0.5s ease;}
        .fade.in{opacity:1;transform:translateY(0);}
        .opcion{width:100%;background:rgba(255,255,255,0.7);border:1.5px solid rgba(201,147,90,0.25);border-radius:0.75rem;padding:1rem 1.25rem;color:#0D3D3D;font-size:1rem;font-family:'Cormorant Garamond',Georgia,serif;cursor:pointer;text-align:left;transition:all 0.2s ease;margin-bottom:0.6rem;display:flex;align-items:center;gap:0.75rem;}
        .opcion:hover{border-color:#C9935A;background:rgba(201,147,90,0.08);}
        .opcion.sel{border-color:#C9935A;background:rgba(201,147,90,0.12);font-weight:600;}
        .btn-next{width:100%;background:linear-gradient(135deg,#C9935A,#A06030);border:none;border-radius:0.75rem;padding:1rem;color:white;font-size:1rem;font-family:Montserrat,sans-serif;font-weight:700;cursor:pointer;margin-top:1rem;}
        .btn-next:disabled{opacity:0.4;cursor:not-allowed;}
        .input-text{width:100%;background:rgba(255,255,255,0.8);border:1.5px solid rgba(201,147,90,0.3);border-radius:0.75rem;padding:1rem 1.25rem;font-size:1.1rem;font-family:'Cormorant Garamond',Georgia,serif;color:#0D3D3D;outline:none;margin-bottom:1rem;}
        .input-text:focus{border-color:#C9935A;}
        .input-num{width:100%;background:rgba(255,255,255,0.8);border:1.5px solid rgba(201,147,90,0.3);border-radius:0.75rem;padding:1rem;font-size:1.1rem;font-family:'Cormorant Garamond',Georgia,serif;color:#0D3D3D;outline:none;text-align:center;}
        .input-num:focus{border-color:#C9935A;}
      `}</style>

      <div style={{minHeight:'100vh',background:'linear-gradient(135deg,#1a0f2e 0%,#0D3D3D 100%)',padding:'2rem 1.5rem',fontFamily:"'Cormorant Garamond',Georgia,serif",display:'flex',flexDirection:'column'}}>

        {/* Header */}
        <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:'2rem',maxWidth:'480px',width:'100%',margin:'0 auto 2rem'}}>
          <div style={{fontFamily:'Montserrat,sans-serif',fontSize:'0.72rem',fontWeight:700,color:'#C9935A',letterSpacing:'3px'}}>✦ LUMERA</div>
          <div style={{fontFamily:'Montserrat,sans-serif',fontSize:'0.72rem',color:'rgba(255,255,255,0.4)'}}>
            {paso + 1} / {total}
          </div>
        </div>

        {/* Barra progreso */}
        <div style={{maxWidth:'480px',width:'100%',margin:'0 auto 2.5rem',background:'rgba(255,255,255,0.1)',borderRadius:'99px',height:'4px'}}>
          <div style={{height:'4px',borderRadius:'99px',background:'linear-gradient(90deg,#C9935A,#A06030)',width:progreso+'%',transition:'width 0.4s ease'}}/>
        </div>

        {/* Pregunta */}
        <div style={{maxWidth:'480px',width:'100%',margin:'0 auto',flex:1}}>
          <div className={`fade ${visible?'in':''}`}>

            {p.sub && (
              <div style={{fontFamily:'Montserrat,sans-serif',fontSize:'0.75rem',color:'rgba(201,147,90,0.7)',letterSpacing:'1px',marginBottom:'0.75rem',textAlign:'center'}}>
                {p.sub}
              </div>
            )}

            <h2 style={{fontSize:'clamp(1.6rem,4vw,2rem)',fontWeight:600,color:'white',lineHeight:1.2,marginBottom:'2rem',textAlign:'center'}}>
              {p.pregunta}
            </h2>

            {/* TEXTO */}
            {p.tipo === 'texto' && (
              <>
                <input className="input-text" type="text" placeholder={p.placeholder}
                  defaultValue={respuestas[p.id] || ''}
                  onKeyDown={e => { if(e.key==='Enter' && e.target.value.trim()) siguiente(e.target.value.trim()); }}
                  id="input-nombre"
                />
                <button className="btn-next" onClick={() => {
                  const v = document.getElementById('input-nombre').value.trim();
                  if(v) siguiente(v);
                }}>
                  {is_es ? 'Continuar →' : 'Continue →'}
                </button>
              </>
            )}

            {/* FECHA */}
            {p.tipo === 'fecha' && (
              <>
                <input className="input-text" type="month"
                  defaultValue={respuestas[p.id] || ''}
                  id="input-fecha"
                  style={{textAlign:'center'}}
                />
                <button className="btn-next" onClick={() => {
                  const v = document.getElementById('input-fecha').value;
                  if(v) siguiente(v);
                }}>
                  {is_es ? 'Continuar →' : 'Continue →'}
                </button>
              </>
            )}

            {/* OPCIONES ÚNICAS */}
            {p.tipo === 'opciones' && p.opciones.map((op, i) => (
              <button key={i} className={`opcion ${respuestas[p.id]===op?'sel':''}`} onClick={() => siguiente(op)}>
                <span style={{color:'#C9935A',flexShrink:0}}>✦</span>
                {op}
              </button>
            ))}

            {/* SELECCIÓN MÚLTIPLE */}
            {p.tipo === 'multiple' && (
              <>
                {p.opciones.map((op, i) => (
                  <button key={i} className={`opcion ${seleccionMultiple.includes(op)?'sel':''}`} onClick={() => toggleMultiple(op)}>
                    <span style={{width:'20px',height:'20px',border:`2px solid ${seleccionMultiple.includes(op)?'#C9935A':'rgba(201,147,90,0.4)'}`,borderRadius:'4px',flexShrink:0,display:'flex',alignItems:'center',justifyContent:'center',background:seleccionMultiple.includes(op)?'#C9935A':'transparent',fontSize:'0.8rem',color:'white'}}>
                      {seleccionMultiple.includes(op)?'✓':''}
                    </span>
                    {op}
                  </button>
                ))}
                <button className="btn-next" disabled={seleccionMultiple.length===0} onClick={siguienteMultiple}>
                  {is_es ? `Continuar con ${seleccionMultiple.length} seleccionada${seleccionMultiple.length!==1?'s':''} →` : `Continue with ${seleccionMultiple.length} selected →`}
                </button>
              </>
            )}

            {/* MEDIDAS */}
            {p.tipo === 'medidas' && (
              <>
                <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'1rem',marginBottom:'1rem'}}>
                  <div>
                    <div style={{fontFamily:'Montserrat,sans-serif',fontSize:'0.72rem',color:'rgba(255,255,255,0.5)',marginBottom:'0.5rem',textAlign:'center'}}>{is_es?'ALTURA (cm)':'HEIGHT (cm)'}</div>
                    <input className="input-num" type="number" placeholder={is_es?'ej. 165':'e.g. 165'} value={altura} onChange={e=>setAltura(e.target.value)} min="140" max="210"/>
                  </div>
                  <div>
                    <div style={{fontFamily:'Montserrat,sans-serif',fontSize:'0.72rem',color:'rgba(255,255,255,0.5)',marginBottom:'0.5rem',textAlign:'center'}}>{is_es?'PESO (kg)':'WEIGHT (kg)'}</div>
                    <input className="input-num" type="number" placeholder={is_es?'ej. 65':'e.g. 65'} value={peso} onChange={e=>setPeso(e.target.value)} min="40" max="200"/>
                  </div>
                </div>
                <button className="btn-next" disabled={!altura||!peso} onClick={()=>siguiente({altura,peso})}>
                  {is_es?'Continuar →':'Continue →'}
                </button>
              </>
            )}

          </div>
        </div>

        {/* Disclaimer */}
        <div style={{maxWidth:'480px',width:'100%',margin:'2rem auto 0',textAlign:'center',fontSize:'0.75rem',color:'rgba(255,255,255,0.2)',fontStyle:'italic',fontFamily:'Montserrat,sans-serif',lineHeight:1.5}}>
          {is_es?'Lumera no diagnostica ni sustituye el consejo médico profesional.':'Lumera does not diagnose or replace professional medical advice.'}
        </div>

      </div>
    </>
  );
}

export default function Quiz() {
  return (
    <Suspense fallback={
      <div style={{minHeight:'100vh',background:'linear-gradient(135deg,#1a0f2e,#0D3D3D)',display:'flex',alignItems:'center',justifyContent:'center'}}>
        <p style={{color:'rgba(255,255,255,0.5)',fontFamily:'Montserrat,sans-serif',fontSize:'0.9rem'}}>Cargando...</p>
      </div>
    }>
      <QuizInner/>
    </Suspense>
  );
}
