'use client';

import { AVATARES, AVATAR_POR_DEFECTO } from '../lib/avatares';

// SELECTOR DE SILUETA — se abre desde el propio Círculo de Hoy y también desde el perfil.
// Vive en su propio componente justamente para que los dos sitios muestren lo mismo y no
// haya que mantener dos listas.

export default function SelectorSilueta({ is_es, elegida, onElegir, onClose }) {
  const actual = elegida || AVATAR_POR_DEFECTO;

  return (
    <div style={{position:'fixed',inset:0,background:'rgba(13,61,61,0.72)',zIndex:265,display:'flex',alignItems:'flex-end',justifyContent:'center'}} onClick={onClose}>
      <div style={{background:'#FBF7F0',borderRadius:'1.5rem 1.5rem 0 0',padding:'1.75rem 1.25rem 2rem',width:'100%',maxWidth:'520px',maxHeight:'88vh',overflowY:'auto'}} onClick={e=>e.stopPropagation()}>

        <div style={{textAlign:'center',marginBottom:'1.25rem'}}>
          <div style={{fontFamily:'Montserrat,sans-serif',fontSize:'0.65rem',fontWeight:700,color:'#C9935A',letterSpacing:'2px',marginBottom:'0.4rem'}}>
            ✦ {is_es ? 'TU SILUETA' : 'YOUR SILHOUETTE'}
          </div>
          <h2 style={{fontFamily:"'Cormorant Garamond',Georgia,serif",fontSize:'1.4rem',fontWeight:600,color:'#0D3D3D',lineHeight:1.25}}>
            {is_es ? '¿Cuál se parece más a ti?' : 'Which one looks most like you?'}
          </h2>
          <p style={{fontFamily:'Montserrat,sans-serif',fontSize:'0.78rem',color:'rgba(13,61,61,0.55)',marginTop:'0.4rem',lineHeight:1.5}}>
            {is_es ? 'La verás cada día en tu círculo. Puedes cambiarla cuando quieras.' : "You'll see her every day in your circle. You can change her whenever you like."}
          </p>
        </div>

        <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:'0.6rem'}}>
          {AVATARES.map(a => {
            const activa = actual === a.id;
            return (
              <button key={a.id} type="button" onClick={()=>onElegir(a.id)}
                style={{padding:0,background:'#0D3D3D',border:activa?'2px solid #C9935A':'2px solid transparent',borderRadius:'0.75rem',overflow:'hidden',cursor:'pointer',position:'relative'}}>
                {a.imagen
                  ? <img src={a.imagen} alt="" loading="lazy" style={{width:'100%',aspectRatio:'3/4',objectFit:'cover',objectPosition:'center top',display:'block',opacity:activa?1:0.75}}/>
                  : <video src={a.video} muted loop autoPlay playsInline style={{width:'100%',aspectRatio:'3/4',objectFit:'cover',objectPosition:'center top',display:'block',opacity:activa?1:0.75}}/>}
                {activa && <span style={{position:'absolute',top:'0.3rem',right:'0.4rem',fontSize:'0.75rem',color:'#C9935A'}}>✓</span>}
                <span style={{display:'block',fontFamily:'Montserrat,sans-serif',fontSize:'0.6rem',color:'rgba(255,255,255,0.8)',padding:'0.3rem 0.2rem',lineHeight:1.2}}>
                  {is_es ? a.es : a.en}
                </span>
              </button>
            );
          })}
        </div>

        <button onClick={onClose} style={{width:'100%',background:'none',border:'none',color:'rgba(13,61,61,0.4)',fontFamily:'Montserrat,sans-serif',fontSize:'0.85rem',cursor:'pointer',padding:'1rem 0.6rem 0'}}>
          {is_es ? 'Listo' : 'Done'}
        </button>
      </div>
    </div>
  );
}
