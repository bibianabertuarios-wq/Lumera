'use client';
import { useState, useRef, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;0,700;1,400&family=Montserrat:wght@400;500;600;700&display=swap');
  *{box-sizing:border-box;margin:0;padding:0;}
  .fade{opacity:0;transform:translateY(16px);transition:opacity 0.7s ease,transform 0.7s ease;}
  .fade.in{opacity:1;transform:translateY(0);}
  .d1{transition-delay:0.1s;} .d2{transition-delay:0.25s;} .d3{transition-delay:0.4s;}
  .btn{width:100%;background:linear-gradient(135deg,#C9935A,#A06030);border:none;border-radius:0.75rem;padding:1rem;color:white;font-size:1rem;font-family:Montserrat,sans-serif;font-weight:700;cursor:pointer;transition:transform 0.2s ease;}
  .btn:hover{transform:translateY(-2px);}
  .btn:disabled{opacity:0.5;cursor:not-allowed;transform:none;}
  @keyframes rotate{from{transform:rotateY(0deg);}to{transform:rotateY(360deg);}}
  @keyframes pulse{0%,100%{opacity:0.6;}50%{opacity:1;}}
  @keyframes scanline{0%{top:0%;}100%{top:100%;}}
`;

const POSE_CONNECTIONS = [
  [11,12],[11,13],[13,15],[12,14],[14,16],
  [11,23],[12,24],[23,24],[23,25],[24,26],
  [25,27],[26,28],[27,29],[28,30],[29,31],[30,32]
];

export default function Escaner() {
  const [step, setStep] = useState('intro'); // intro | consent | capture | analyzing | result
  const [visible, setVisible] = useState(false);
  const [landmarks, setLandmarks] = useState(null);
  const [analysis, setAnalysis] = useState(null);
  const [rotating, setRotating] = useState(false);
  const [poseIndex, setPoseIndex] = useState(0);
  const fileRef = useRef(null);
  const canvasRef = useRef(null);
  const avatarRef = useRef(null);
  const resultRef = useRef(null);
  const animRef = useRef(null);
  const router = useRouter();

  useEffect(() => {
    setTimeout(() => setVisible(true), 100);
  }, []);

  // Ciclo de poses avatar sprite
  useEffect(() => {
    if (rotating) {
      const interval = setInterval(() => {
        setPoseIndex(i => (i + 1) % 6);
      }, 120);
      return () => clearInterval(interval);
    }
  }, [rotating]);

  const handleFile = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setStep('analyzing');

    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = async () => {
      try {
        // Cargar MediaPipe
        const { PoseLandmarker, FilesetResolver } = await import('@mediapipe/tasks-vision');
        const vision = await FilesetResolver.forVisionTasks(
          'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.0/wasm'
        );
        const poseLandmarker = await PoseLandmarker.createFromOptions(vision, {
          baseOptions: {
            modelAssetPath: 'https://storage.googleapis.com/mediapipe-models/pose_landmarker/pose_landmarker_lite/float16/1/pose_landmarker_lite.task',
            delegate: 'CPU'
          },
          runningMode: 'IMAGE',
          numPoses: 1
        });

        const result = poseLandmarker.detect(img);
        URL.revokeObjectURL(url); // Borrar imagen inmediatamente

        if (result.landmarks && result.landmarks.length > 0) {
          const lm = result.landmarks[0];
          setLandmarks(lm);
          
          // Analizar proporciones
          const analysis = analyzeBody(lm);
          setAnalysis(analysis);
          
          // Dibujar avatar
          drawAvatar(lm, analysis);
          setStep('result');
          setRotating(true);
          setTimeout(() => resultRef.current?.scrollIntoView({behavior:'smooth'}), 300);
        } else {
          setStep('error');
        }
      } catch(err) {
        console.error(err);
        setStep('error');
      }
    };
    img.src = url;
  };

  const analyzeBody = (lm) => {
    // Puntos clave
    const leftShoulder = lm[11];
    const rightShoulder = lm[12];
    const leftHip = lm[23];
    const rightHip = lm[24];
    const leftKnee = lm[25];
    const rightKnee = lm[26];

    const shoulderWidth = Math.abs(leftShoulder.x - rightShoulder.x);
    const hipWidth = Math.abs(leftHip.x - rightHip.x);
    const torsoHeight = Math.abs(((leftShoulder.y + rightShoulder.y)/2) - ((leftHip.y + rightHip.y)/2));
    const legHeight = Math.abs(((leftHip.y + rightHip.y)/2) - ((leftKnee.y + rightKnee.y)/2));

    const ratio = hipWidth / shoulderWidth;
    
    let tipo, zona, consejo;
    if (ratio > 1.1) {
      tipo = 'Pera';
      zona = 'caderas';
      consejo = 'La acumulación en caderas indica dominancia estrogénica. Tu plan prioriza equilibrar estrógeno con progesterona a través de nutrición y ejercicio de fuerza.';
    } else if (ratio < 0.85) {
      tipo = 'Manzana invertida';
      zona = 'hombros';
      consejo = 'Hombros anchos con caderas estrechas sugiere buena musculatura. Tu plan se enfoca en mantener masa muscular y equilibrar cortisol.';
    } else if (ratio >= 0.85 && ratio <= 1.05 && torsoHeight < legHeight * 0.8) {
      tipo = 'Manzana';
      zona = 'abdomen';
      consejo = 'La acumulación abdominal es la señal más clara de resistencia a la insulina y cortisol elevado después de los 40. Tu plan prioriza reducir inflamación y regular glucosa.';
    } else {
      tipo = 'Reloj de arena';
      zona = 'equilibrada';
      consejo = 'Distribución equilibrada. Tu metabolismo hormonal está relativamente balanceado. El plan se enfoca en mantener y optimizar.';
    }

    return { tipo, zona, consejo, ratio: ratio.toFixed(2), shoulderWidth, hipWidth };
  };

  const drawAvatar = (lm, analysis) => {
    const canvas = avatarRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const W = canvas.width;
    const H = canvas.height;
    ctx.clearRect(0, 0, W, H);

    // Escalar landmarks al canvas
    const scale = (pt) => ({ x: pt.x * W, y: pt.y * H });

    // Dibujar silueta con gradiente
    const gradient = ctx.createLinearGradient(0, 0, 0, H);
    gradient.addColorStop(0, 'rgba(201,147,90,0.8)');
    gradient.addColorStop(1, 'rgba(160,96,48,0.6)');

    // Conexiones del cuerpo
    ctx.strokeStyle = gradient;
    ctx.lineWidth = 8;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    POSE_CONNECTIONS.forEach(([a, b]) => {
      if (lm[a] && lm[b]) {
        const ptA = scale(lm[a]);
        const ptB = scale(lm[b]);
        ctx.beginPath();
        ctx.moveTo(ptA.x, ptA.y);
        ctx.lineTo(ptB.x, ptB.y);
        ctx.stroke();
      }
    });

    // Puntos articulares
    [11,12,13,14,15,16,23,24,25,26,27,28].forEach(i => {
      if (lm[i]) {
        const pt = scale(lm[i]);
        ctx.beginPath();
        ctx.arc(pt.x, pt.y, 6, 0, Math.PI * 2);
        ctx.fillStyle = '#C9935A';
        ctx.fill();
      }
    });

    // Destacar zona de acumulación
    if (analysis.zona === 'abdomen' && lm[23] && lm[24]) {
      const hip = scale({ x: (lm[23].x + lm[24].x)/2, y: (lm[23].y + lm[24].y)/2 });
      const glowGrad = ctx.createRadialGradient(hip.x, hip.y, 0, hip.x, hip.y, 40);
      glowGrad.addColorStop(0, 'rgba(201,147,90,0.4)');
      glowGrad.addColorStop(1, 'rgba(201,147,90,0)');
      ctx.beginPath();
      ctx.arc(hip.x, hip.y, 40, 0, Math.PI * 2);
      ctx.fillStyle = glowGrad;
      ctx.fill();
    }
  };

  const is_es = typeof navigator !== 'undefined' && navigator.language?.startsWith('es');

  return (
    <>
      <style dangerouslySetInnerHTML={{__html: css}}/>
      <div style={{minHeight:'100vh',background:'linear-gradient(180deg,#1a0f2e 0%,#0D3D3D 100%)',fontFamily:"'Cormorant Garamond',Georgia,serif",padding:'2rem 1.5rem',display:'flex',flexDirection:'column',alignItems:'center'}}>
        <div style={{maxWidth:'440px',width:'100%'}}>

          {/* HEADER */}
          <div className={`fade d1 ${visible?'in':''}`} style={{textAlign:'center',marginBottom:'2rem'}}>
            <div style={{fontFamily:'Montserrat,sans-serif',fontSize:'0.7rem',fontWeight:700,color:'#C9935A',letterSpacing:'3px',marginBottom:'0.75rem'}}>✦ LUMERA</div>
            <h1 style={{fontSize:'clamp(1.6rem,4vw,2rem)',fontWeight:700,color:'white',lineHeight:1.2,marginBottom:'0.5rem'}}>
              Tu Silueta Hormonal
            </h1>
            <p style={{fontSize:'1rem',fontStyle:'italic',color:'rgba(255,255,255,0.6)',lineHeight:1.6}}>
              Cómo distribuye tu cuerpo el peso — y qué te dice sobre tus hormonas
            </p>
          </div>

          {/* INTRO */}
          {step === 'intro' && (
            <div className={`fade d2 ${visible?'in':''}`}>
              <div style={{background:'rgba(255,255,255,0.05)',border:'1px solid rgba(201,147,90,0.2)',borderRadius:'1rem',padding:'1.5rem',marginBottom:'1.5rem'}}>
                <div style={{fontSize:'0.8rem',fontFamily:'Montserrat,sans-serif',color:'rgba(255,255,255,0.5)',lineHeight:1.8}}>
                  <p style={{marginBottom:'0.5rem'}}>✦ LUMI analizará la distribución de tu silueta</p>
                  <p style={{marginBottom:'0.5rem'}}>✦ La foto se borra inmediatamente tras el análisis</p>
                  <p style={{marginBottom:'0.5rem'}}>✦ No se almacena ninguna imagen en nuestros servidores</p>
                  <p>✦ El análisis es orientativo, no un diagnóstico médico</p>
                </div>
              </div>
              <button className="btn" onClick={()=>setStep('consent')}>
                Descubrir mi silueta hormonal →
              </button>
              <button onClick={()=>router.back()} style={{width:'100%',background:'none',border:'none',color:'rgba(255,255,255,0.3)',fontFamily:'Montserrat,sans-serif',fontSize:'0.8rem',cursor:'pointer',marginTop:'0.75rem',padding:'0.5rem'}}>
                Ahora no
              </button>
            </div>
          )}

          {/* CONSENT */}
          {step === 'consent' && (
            <div className={`fade d1 ${visible?'in':''}`}>
              <div style={{background:'rgba(201,147,90,0.08)',border:'1px solid rgba(201,147,90,0.3)',borderLeft:'4px solid #C9935A',borderRadius:'0 1rem 1rem 0',padding:'1.5rem',marginBottom:'1.5rem'}}>
                <div style={{fontFamily:'Montserrat,sans-serif',fontSize:'0.65rem',fontWeight:700,color:'#C9935A',letterSpacing:'2px',marginBottom:'0.75rem'}}>ANTES DE CONTINUAR</div>
                <p style={{fontSize:'0.95rem',lineHeight:1.7,color:'rgba(255,255,255,0.8)'}}>
                  Voy a pedirte una foto en ropa interior o ajustada, de cuerpo entero, en posición de pie. 
                  <strong style={{color:'#C9935A'}}> Esta imagen se analizará localmente y se eliminará de forma inmediata.</strong> 
                  Nunca se sube a ningún servidor ni se almacena.
                </p>
              </div>
              <div style={{fontSize:'0.8rem',fontFamily:'Montserrat,sans-serif',color:'rgba(255,255,255,0.4)',marginBottom:'1.5rem',lineHeight:1.7}}>
                Para mejores resultados: buena iluminación, fondo claro, cuerpo entero visible, ropa ajustada o ropa interior.
              </div>
              <button className="btn" onClick={()=>fileRef.current?.click()}>
                Entendido — hacer mi análisis
              </button>
              <input ref={fileRef} type="file" accept="image/*" capture="user" style={{display:'none'}} onChange={handleFile}/>
              <button onClick={()=>setStep('intro')} style={{width:'100%',background:'none',border:'none',color:'rgba(255,255,255,0.3)',fontFamily:'Montserrat,sans-serif',fontSize:'0.8rem',cursor:'pointer',marginTop:'0.75rem',padding:'0.5rem'}}>
                Volver
              </button>
            </div>
          )}

          {/* ANALYZING */}
          {step === 'analyzing' && (
            <div style={{textAlign:'center',padding:'3rem 0'}}>
              <div style={{fontSize:'3rem',marginBottom:'1rem',animation:'pulse 1.5s infinite'}}>✦</div>
              <p style={{fontSize:'1.2rem',fontStyle:'italic',color:'rgba(255,255,255,0.8)',marginBottom:'0.5rem'}}>LUMI está analizando tu silueta...</p>
              <p style={{fontSize:'0.8rem',fontFamily:'Montserrat,sans-serif',color:'rgba(255,255,255,0.3)'}}>La imagen se borrará en cuanto termine</p>
            </div>
          )}

          {/* ERROR */}
          {step === 'error' && (
            <div style={{textAlign:'center',padding:'2rem 0'}}>
              <p style={{color:'rgba(255,255,255,0.7)',marginBottom:'1rem',lineHeight:1.7}}>No pude detectar bien tu silueta. Asegúrate de que el cuerpo entero esté visible con buena iluminación.</p>
              <button className="btn" onClick={()=>setStep('consent')}>Intentar de nuevo</button>
            </div>
          )}

          {/* RESULT */}
          {step === 'result' && analysis && (
            <div className={`fade d1 ${visible?'in':''}`}>
              
              {/* AVATAR SPRITE GIRATORIO */}
              <div style={{position:'relative',marginBottom:'1.5rem',textAlign:'center'}}>
                <div style={{
                  display:'inline-block',
                  position:'relative',
                  borderRadius:'1rem',
                  overflow:'hidden',
                  border:'1px solid rgba(201,147,90,0.3)',
                  boxShadow:'0 0 40px rgba(201,147,90,0.15)',
                  background:'rgba(255,255,255,0.03)'
                }}>
                  <img
                    src={`/images/opt/avatar/avatar_pose_${poseIndex + 1}.png`}
                    alt="Avatar hormonal"
                    style={{
                      width:'160px',
                      height:'280px',
                      objectFit:'contain',
                      display:'block',
                      filter:'drop-shadow(0 0 12px rgba(201,147,90,0.4))'
                    }}
                  />
                  <div style={{
                    position:'absolute',
                    top:0,left:0,right:0,bottom:0,
                    background:'linear-gradient(180deg,transparent 0%,rgba(201,147,90,0.04) 50%,transparent 100%)',
                    pointerEvents:'none'
                  }}/>
                </div>
                <div style={{marginTop:'0.5rem',fontFamily:'Montserrat,sans-serif',fontSize:'0.65rem',color:'rgba(255,255,255,0.4)',whiteSpace:'nowrap'}}>
                  Silueta hormonal · Foto eliminada ✓
                </div>
              </div>

              {/* TIPO DE CUERPO */}
              <div ref={resultRef} style={{background:'rgba(255,255,255,0.05)',border:'1px solid rgba(201,147,90,0.25)',borderRadius:'1rem',padding:'1.25rem',marginBottom:'1rem',textAlign:'center'}}>
                <div style={{fontFamily:'Montserrat,sans-serif',fontSize:'0.65rem',fontWeight:700,color:'#C9935A',letterSpacing:'2px',marginBottom:'0.4rem'}}>TU SILUETA HORMONAL</div>
                <div style={{fontSize:'1.5rem',fontWeight:700,color:'white',marginBottom:'0.25rem'}}>{analysis.tipo}</div>
                <div style={{fontSize:'0.8rem',fontFamily:'Montserrat,sans-serif',color:'rgba(255,255,255,0.4)'}}>Zona de atención: {analysis.zona}</div>
              </div>

              {/* ANÁLISIS DE LUMI */}
              <div style={{background:'rgba(201,147,90,0.07)',border:'1px solid rgba(201,147,90,0.2)',borderLeft:'4px solid #C9935A',borderRadius:'0 1rem 1rem 0',padding:'1.25rem',marginBottom:'1.5rem'}}>
                <div style={{fontFamily:'Montserrat,sans-serif',fontSize:'0.65rem',fontWeight:700,color:'#C9935A',letterSpacing:'2px',marginBottom:'0.6rem'}}>✦ LUMI DICE:</div>
                <p style={{fontSize:'0.98rem',lineHeight:1.75,fontStyle:'italic',color:'rgba(255,255,255,0.85)'}}>{analysis.consejo}</p>
              </div>

              {/* PREMIUM */}
              <div style={{background:'rgba(255,255,255,0.04)',border:'1px solid rgba(201,147,90,0.15)',borderRadius:'1rem',padding:'1.25rem',marginBottom:'1.5rem',textAlign:'center'}}>
                <div style={{fontSize:'0.9rem',color:'rgba(255,255,255,0.5)',fontStyle:'italic',marginBottom:'0.75rem',lineHeight:1.6}}>
                  🔒 Vuelve en 7 días para ver cómo evoluciona tu silueta — disponible en Premium
                </div>
                <button className="btn" style={{marginBottom:'0.5rem'}} onClick={()=>router.push('/lumera')}>
                  ✦ Activar Premium — ver mi evolución
                </button>
              </div>

              <button onClick={()=>router.push('/dashboard')} style={{width:'100%',background:'none',border:'1px solid rgba(255,255,255,0.1)',borderRadius:'0.75rem',padding:'0.75rem',color:'rgba(255,255,255,0.4)',fontFamily:'Montserrat,sans-serif',fontSize:'0.85rem',cursor:'pointer'}}>
                Volver al dashboard
              </button>

            </div>
          )}

        </div>
      </div>
    </>
  );
}
