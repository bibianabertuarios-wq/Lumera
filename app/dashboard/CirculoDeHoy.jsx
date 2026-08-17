'use client';

// EL CÍRCULO DE HOY — pieza central del Inicio, propuesta por la auditoría UX de fable
// (lumera-rediseno-dashboard.html, sección 3). Anillo SVG que se llena por cada tarea
// del día (nutrición/movimiento/calma) + silueta que gira más rápido y brilla al completar
// las 3. Sin librerías nuevas: SVG + CSS puro. Se apoya en el `plan`/`planHecho` que ya
// existe en dashboard/page.jsx — no crea ningún estado ni fuente de datos nueva.

const TIPOS = ['nutricion', 'movimiento', 'interior'];
const COLORES = { nutricion: '#C9935A', movimiento: '#A06030', interior: '#0D3D3D' };
const RADIOS = { nutricion: 100, movimiento: 84, interior: 68 };
const LABEL_ES = { nutricion: 'Nutrición', movimiento: 'Movimiento', interior: 'Calma' };
const LABEL_EN = { nutricion: 'Nutrition', movimiento: 'Movement', interior: 'Calm' };
const ESTADOS_ES = ['Empieza tu día', 'Vas arrancando', 'Casi lo tienes', '✦ Día completo'];
const ESTADOS_EN = ['Start your day', 'Getting going', 'Almost there', '✦ Day complete'];

const SILUETA_PATH = 'M48 6c-6.6 0-11 4.9-11 11.4 0 4.3 1.9 7.6 4.4 9.5-6.6 2.3-11.6 6.4-13.4 12.6-1.7 5.9-2.2 13.4-3.6 20.5-1 5.2-2.7 9.6-4.3 13.4-1 2.4.3 4.8 2.6 5.4 2.3.6 4.4-.6 5.3-2.8 1.5-3.7 2.9-7.6 3.9-11.9.4 6.6-.2 12.6-1 18.4-.7 5.3-1.4 9.4-1.4 13.2 0 3.4 1.3 5.6 4 6.6-.6 6.4-1.3 13-1.8 19.2-.4 5.2-.7 9.7-.7 12.6 0 3.6 2.5 6.1 6 6.1s5.9-2.4 6.2-6c.3-4 1.2-11.4 2.3-19.2.5-3.5 1.4-5.6 2.5-5.6s2 2.1 2.5 5.6c1.1 7.8 2 15.2 2.3 19.2.3 3.6 2.7 6 6.2 6s6-2.5 6-6.1c0-2.9-.3-7.4-.7-12.6-.5-6.2-1.2-12.8-1.8-19.2 2.7-1 4-3.2 4-6.6 0-3.8-.7-7.9-1.4-13.2-.8-5.8-1.4-11.8-1-18.4 1 4.3 2.4 8.2 3.9 11.9.9 2.2 3 3.4 5.3 2.8 2.3-.6 3.6-3 2.6-5.4-1.6-3.8-3.3-8.2-4.3-13.4-1.4-7.1-1.9-14.6-3.6-20.5-1.8-6.2-6.8-10.3-13.4-12.6 2.5-1.9 4.4-5.2 4.4-9.5C59 10.9 54.6 6 48 6z';

export default function CirculoDeHoy({ plan, planHecho, onToggle, is_es, racha = 0 }) {
  const idxPorTipo = {};
  (plan || []).forEach((p, i) => {
    if (TIPOS.includes(p.tipo) && !(p.tipo in idxPorTipo)) idxPorTipo[p.tipo] = i;
  });
  const tiposPresentes = TIPOS.filter(t => idxPorTipo[t] !== undefined);
  const total = tiposPresentes.length || 3;
  const hechas = tiposPresentes.filter(t => planHecho.includes(idxPorTipo[t])).length;
  const pleno = total > 0 && hechas === total;
  const labels = is_es ? LABEL_ES : LABEL_EN;
  const estados = is_es ? ESTADOS_ES : ESTADOS_EN;

  return (
    <div style={{background:'linear-gradient(170deg,#0D3D3D 0%,#0A2A2A 100%)',borderRadius:'1.5rem',padding:'2rem 1.5rem 1.75rem',marginBottom:'1.25rem',textAlign:'center',position:'relative',overflow:'hidden'}}>
      <style>{`@keyframes lumeraCirculoGirar { from { transform: rotateY(0deg); } to { transform: rotateY(360deg); } }`}</style>
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

        <div style={{position:'absolute',inset:0,display:'flex',alignItems:'center',justifyContent:'center',perspective:'700px'}}>
          <svg width="84" height="132" viewBox="0 0 96 150" style={{animation:`lumeraCirculoGirar ${pleno ? '5s' : '14s'} linear infinite`,filter:pleno ? 'drop-shadow(0 0 20px rgba(201,147,90,0.85))' : 'none'}}>
            <defs>
              <linearGradient id="lumeraSilGrad" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#F3E4C8"/>
                <stop offset="100%" stopColor="#C9935A"/>
              </linearGradient>
            </defs>
            <path fill="url(#lumeraSilGrad)" opacity="0.92" d={SILUETA_PATH}/>
          </svg>
        </div>

        <div style={{position:'absolute',left:0,right:0,bottom:'22px',textAlign:'center'}}>
          <div style={{fontFamily:'Montserrat,sans-serif',fontSize:'2.5rem',fontWeight:800,letterSpacing:'-0.03em',color:'white',lineHeight:1}}>{hechas}/{total}</div>
          <div style={{fontFamily:'Montserrat,sans-serif',fontSize:'0.75rem',letterSpacing:'2px',textTransform:'uppercase',color:'rgba(255,255,255,0.55)',marginTop:'0.3rem'}}>{estados[hechas]}</div>
        </div>
      </div>

      <div style={{display:'flex',justifyContent:'center',gap:'0.6rem',marginTop:'1.5rem',flexWrap:'wrap'}}>
        {TIPOS.map((t) => {
          const idx = idxPorTipo[t];
          const hecho = idx !== undefined && planHecho.includes(idx);
          return (
            <button key={t} type="button" onClick={() => idx !== undefined && onToggle(idx)}
              style={{display:'flex',alignItems:'center',gap:'0.45rem',fontFamily:'Montserrat,sans-serif',fontSize:'0.8rem',color:'rgba(255,255,255,0.9)',background:hecho ? 'rgba(255,255,255,0.16)' : 'rgba(255,255,255,0.07)',border:'none',borderRadius:'99px',padding:'0.55rem 1rem',cursor:'pointer',opacity:hecho ? 1 : 0.7}}>
              <span style={{width:'9px',height:'9px',borderRadius:'50%',background:COLORES[t],display:'block',flexShrink:0}}/>
              {labels[t]}
            </button>
          );
        })}
      </div>
    </div>
  );
}
