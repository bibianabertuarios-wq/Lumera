'use client';

import { useState, useRef, useEffect } from 'react';

// EL CÍRCULO DE HOY — pieza central del Inicio, propuesta por la auditoría UX de fable
// (lumera-rediseno-dashboard.html, sección 3 y 4: "un dato dominante por pantalla",
// "las 3 tareas como píldoras pulsables debajo del anillo, con verbo y nada más").
//
// v2: absorbe lo que antes era la tarjeta "Tu plan de hoy" (lista plana con checkbox +
// etiqueta + enlace + "¿por qué?" para las 3 tareas a la vez). Ahora solo una tarea se
// puede ver en detalle cada vez — tocas una píldora, se abre SOLO esa, la marcas hecha
// y pasas a la siguiente. Es un flujo, no una lista.
//
// v3: la silueta ya no es una forma SVG abstracta — usa /videos/silueta-circulo.mp4,
// recorte de /videos/silueta.mp4 (asset real de Lumera, ya existente) sin las etiquetas,
// el rótulo "LUMERA" ni la marca de agua. Se le aplica una viñeta suave (mask-image) para
// disimular cualquier resto de las etiquetas originales en los bordes.

const TIPOS = ['nutricion', 'movimiento', 'interior'];
const COLORES = { nutricion: '#C9935A', movimiento: '#A06030', interior: '#0D3D3D' };
const RADIOS = { nutricion: 100, movimiento: 84, interior: 68 };
const ESTADOS_ES = ['Empieza tu día', 'Vas arrancando', 'Casi lo tienes', '✦ Día completo'];
const ESTADOS_EN = ['Start your day', 'Getting going', 'Almost there', '✦ Day complete'];

function truncar(texto, n) {
  if (!texto) return '';
  return texto.length > n ? texto.slice(0, n - 1).trimEnd() + '…' : texto;
}

export default function CirculoDeHoy({ plan, planHecho, onToggle, is_es, racha = 0, objetivoKcal, onAbrirCalma }) {
  const [abierto, setAbierto] = useState(null); // tipo de la tarea actualmente expandida, o null
  const videoRef = useRef(null);

  const idxPorTipo = {};
  (plan || []).forEach((p, i) => {
    if (TIPOS.includes(p.tipo) && !(p.tipo in idxPorTipo)) idxPorTipo[p.tipo] = i;
  });
  const tiposPresentes = TIPOS.filter(t => idxPorTipo[t] !== undefined);
  const total = tiposPresentes.length || 3;
  const hechas = tiposPresentes.filter(t => planHecho.includes(idxPorTipo[t])).length;
  const pleno = total > 0 && hechas === total;
  const estados = is_es ? ESTADOS_ES : ESTADOS_EN;

  useEffect(() => {
    if (videoRef.current) videoRef.current.playbackRate = pleno ? 1.8 : 1;
  }, [pleno]);

  const itemAbierto = abierto !== null && idxPorTipo[abierto] !== undefined ? plan[idxPorTipo[abierto]] : null;
  const idxAbierto = abierto !== null ? idxPorTipo[abierto] : null;
  const hechoAbierto = idxAbierto !== null && planHecho.includes(idxAbierto);

  return (
    <div style={{background:'linear-gradient(170deg,#0D3D3D 0%,#0A2A2A 100%)',borderRadius:'1.5rem',padding:'2rem 1.5rem 1.75rem',marginBottom:'1.25rem',textAlign:'center',position:'relative',overflow:'hidden'}}>
      <div style={{position:'absolute',inset:0,background:'radial-gradient(circle at 50% 10%, rgba(201,147,90,0.18), transparent 62%)',pointerEvents:'none'}}/>

      {racha > 0 && (
        <div style={{display:'inline-flex',alignItems:'center',gap:'0.4rem',background:'rgba(201,147,90,0.16)',border:'1px solid rgba(201,147,90,0.35)',borderRadius:'99px',padding:'0.35rem 0.9rem',marginBottom:'1rem',fontFamily:'Montserrat,sans-serif',fontSize:'0.8rem',fontWeight:700,color:'#C9935A'}}>
          🔥 {racha} {is_es ? (racha === 1 ? 'día seguido' : 'días seguidos') : (racha === 1 ? 'day streak' : 'day streak')}
        </div>
      )}

      <div style={{position:'relative',width:'210px',height:'210px',margin:'0 auto'}}>
        <svg viewBox="0 0 230 230" style={{position:'absolute',inset:0,transform:'rotate(-90deg)'}}>
          {TIPOS.map((t) => {
            const r = RADIOS[t];
            const C = 2 * Math.PI * r;
            const idx = idxPorTipo[t];
            const hecho = idx !== undefined && planHecho.includes(idx);
            return (
              <g key={t}>
                <circle cx="115" cy="115" r={r} fill="none" stroke="rgba(255,255,255,0.09)" strokeWidth="11" />
                <circle cx="115" cy="115" r={r} fill="none" stroke={COLORES[t]} strokeWidth="11" strokeLinecap="round"
                  strokeDasharray={C} strokeDashoffset={hecho ? C * 0.06 : C}
                  style={{transition:'stroke-dashoffset 0.9s cubic-bezier(.22,1,.36,1)'}} />
              </g>
            );
          })}
        </svg>

        <div style={{position:'absolute',inset:0,display:'flex',alignItems:'center',justifyContent:'center'}}>
          <video
            ref={videoRef}
            src="/videos/silueta-circulo.mp4"
            autoPlay
            loop
            muted
            playsInline
            style={{
              width:'104px',
              height:'192px',
              objectFit:'cover',
              objectPosition:'center 18%',
              WebkitMaskImage:'radial-gradient(ellipse 48% 44% at 50% 40%, black 60%, transparent 100%)',
              maskImage:'radial-gradient(ellipse 48% 44% at 50% 40%, black 60%, transparent 100%)',
              filter: pleno ? 'drop-shadow(0 0 18px rgba(201,147,90,0.85))' : 'none',
            }}
          />
        </div>

        <div style={{position:'absolute',left:0,right:0,bottom:'22px',textAlign:'center'}}>
          <div style={{fontFamily:'Montserrat,sans-serif',fontSize:'2.5rem',fontWeight:800,letterSpacing:'-0.03em',color:'white',lineHeight:1}}>{hechas}/{total}</div>
          <div style={{fontFamily:'Montserrat,sans-serif',fontSize:'0.75rem',letterSpacing:'2px',textTransform:'uppercase',color:'rgba(255,255,255,0.55)',marginTop:'0.3rem'}}>{estados[hechas]}</div>
        </div>
      </div>

      {objetivoKcal && (
        <p style={{fontFamily:'Montserrat,sans-serif',fontSize:'0.7rem',color:'rgba(255,255,255,0.35)',marginTop:'0.9rem'}}>
          {is_es ? `Objetivo diario de referencia: ~${objetivoKcal} kcal` : `Reference daily target: ~${objetivoKcal} kcal`}
        </p>
      )}

      {/* Píldoras: un verbo cada una. Tocar abre SOLO esa tarea — nunca las 3 a la vez. */}
      <div style={{display:'flex',justifyContent:'center',gap:'0.5rem',marginTop:'1.1rem',flexWrap:'wrap'}}>
        {tiposPresentes.map((t) => {
          const idx = idxPorTipo[t];
          const item = plan[idx];
          const hecho = planHecho.includes(idx);
          const activa = abierto === t;
          return (
            <button key={t} type="button" onClick={() => setAbierto(activa ? null : t)}
              style={{display:'flex',alignItems:'center',gap:'0.4rem',maxWidth:'160px',fontFamily:'Montserrat,sans-serif',fontSize:'0.76rem',fontWeight:600,color:'rgba(255,255,255,0.92)',background:activa ? 'rgba(201,147,90,0.28)' : hecho ? 'rgba(255,255,255,0.16)' : 'rgba(255,255,255,0.07)',border:activa ? '1px solid rgba(201,147,90,0.7)' : '1px solid transparent',borderRadius:'99px',padding:'0.5rem 0.9rem',cursor:'pointer'}}>
              <span style={{width:'8px',height:'8px',borderRadius:'50%',background:hecho ? COLORES[t] : 'rgba(255,255,255,0.35)',display:'block',flexShrink:0}}/>
              <span style={{overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{hecho && '✓ '}{truncar(item.accion, 22)}</span>
            </button>
          );
        })}
      </div>

      {/* Detalle de la única tarea abierta — nunca las 3 a la vez */}
      {itemAbierto && (
        <div style={{marginTop:'0.9rem',background:'rgba(255,255,255,0.94)',borderRadius:'1rem',padding:'1.1rem 1.2rem',textAlign:'left'}}>
          {itemAbierto.etiqueta && (
            <div style={{fontFamily:"'Cormorant Garamond',Georgia,serif",fontStyle:'italic',fontSize:'0.8rem',color:'#A06030',marginBottom:'0.4rem'}}>
              {itemAbierto.etiqueta}
            </div>
          )}
          <div style={{fontFamily:"'Cormorant Garamond',Georgia,serif",fontSize:'1.15rem',fontWeight:600,color:'#0D3D3D',lineHeight:1.4,marginBottom:'0.6rem'}}>
            {itemAbierto.accion}
          </div>
          {itemAbierto.ciencia && (
            <p style={{fontSize:'0.8rem',fontFamily:'Montserrat,sans-serif',color:'rgba(13,61,61,0.6)',lineHeight:1.55,marginBottom:'0.9rem'}}>
              {itemAbierto.ciencia}
              {itemAbierto.fuente && <span style={{color:'rgba(13,61,61,0.4)'}}> — {is_es ? 'Fuente' : 'Source'}: {itemAbierto.fuente}</span>}
            </p>
          )}
          <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',gap:'0.75rem',flexWrap:'wrap'}}>
            {abierto === 'interior' ? (
              <button type="button" onClick={onAbrirCalma} style={{background:'none',border:'none',padding:0,fontFamily:'Montserrat,sans-serif',fontSize:'0.82rem',color:'#C9935A',fontWeight:600,cursor:'pointer'}}>
                {is_es ? '🌬️ Empezar a respirar →' : '🌬️ Start breathing →'}
              </button>
            ) : itemAbierto.link ? (
              <button type="button" onClick={()=>window.location.href=itemAbierto.link} style={{background:'none',border:'none',padding:0,fontFamily:'Montserrat,sans-serif',fontSize:'0.82rem',color:'#C9935A',fontWeight:600,cursor:'pointer'}}>
                {itemAbierto.linkLabel}
              </button>
            ) : <span/>}
            <button type="button" onClick={() => { onToggle(idxAbierto); setAbierto(null); }}
              style={{background:hechoAbierto ? 'rgba(201,147,90,0.15)' : 'linear-gradient(135deg,#C9935A,#A06030)',color:hechoAbierto ? '#A06030' : 'white',border:'none',borderRadius:'0.6rem',padding:'0.5rem 1rem',fontFamily:'Montserrat,sans-serif',fontSize:'0.8rem',fontWeight:700,cursor:'pointer'}}>
              {hechoAbierto ? (is_es ? '✓ Hecho' : '✓ Done') : (is_es ? 'Marcar hecho' : 'Mark done')}
            </button>
          </div>
        </div>
      )}

      {pleno && !itemAbierto && (
        <div style={{marginTop:'1rem',padding:'0.6rem 0.9rem',background:'rgba(201,147,90,0.16)',border:'1px solid rgba(201,147,90,0.35)',borderRadius:'0.75rem',fontFamily:'Montserrat,sans-serif',fontSize:'0.8rem',color:'#C9935A',fontWeight:600}}>
          {is_es ? '✦ Plan de hoy completado. Tu constancia es la que cambia tu biología.' : "✦ Today's plan complete. Consistency is what changes your biology."}
        </div>
      )}
    </div>
  );
}
