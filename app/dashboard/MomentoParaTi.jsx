'use client';

// UN MOMENTO PARA TI — música según cómo estás.
//
// No es una lista de canciones cerrada: son búsquedas de YouTube, igual que las rutinas
// de ejercicio de la app. Así ningún enlace se rompe con el tiempo ni dependemos de que
// un vídeo concreto siga disponible.
//
// El diseño sigue el "principio ISO" de musicoterapia (Altshuler, 1944): la música que
// mejor regula el ánimo es la que PRIMERO iguala cómo estás, y solo después te lleva hacia
// donde quieres ir. Por eso cada estado tiene dos pasos y no uno. Fuentes en el comentario
// de cada bloque.

const ESTADOS = [
  {
    id: 'animo',
    icono: '✨',
    es: { titulo: 'Quiero animarme', sub: 'Subir la energía' },
    en: { titulo: 'I want a lift', sub: 'Raise the energy' },
    // Salimpoor et al., Nature Neuroscience 2011: la música que provoca escalofríos libera
    // dopamina en el estriado. El efecto depende de que la música te guste y la conozcas,
    // no del género — por eso el primer paso son canciones que ya te sabes.
    ciencia_es: 'La música que te pone la piel de gallina libera dopamina en el cerebro, igual que otras recompensas. El efecto depende de que la canción te guste y te la sepas, no del estilo: por eso se empieza por lo tuyo y se sube desde ahí.',
    ciencia_en: 'Music that gives you goosebumps releases dopamine in the brain, like other rewards do. The effect depends on the song being yours and familiar, not on the genre: that is why you start with what you know and lift from there.',
    fuente: 'Salimpoor et al., Nature Neuroscience (2011)',
    pasos: [
      { es: 'Empieza por lo que ya te sabes', en: 'Start with what you know by heart', q_es: 'canciones que todos nos sabemos para cantar', q_en: 'feel good singalong classics' },
      { es: 'Y sube el ritmo', en: 'Then lift the tempo', q_es: 'musica alegre para bailar en casa', q_en: 'upbeat happy dance music at home' },
    ],
  },
  {
    id: 'llorar',
    icono: '🌧️',
    es: { titulo: 'Necesito llorar', sub: 'Dejarlo salir' },
    en: { titulo: 'I need to cry', sub: 'Let it out' },
    // Taruffi & Koelsch, PLOS ONE 2014 (772 personas): la música triste no hunde. Lo que
    // más se describe es nostalgia, paz y ternura, y sirve de consuelo y regulación
    // emocional. El segundo paso existe para acompañar la salida, no para quedarse ahí.
    ciencia_es: 'Escuchar música triste cuando lo estás pasando mal no te hunde más: en una encuesta a 772 personas, lo que más se describe es nostalgia, paz y consuelo, no tristeza a secas.',
    ciencia_en: "Listening to sad music when you're low doesn't sink you further: in a survey of 772 people, what came up most was nostalgia, peace and comfort, not plain sadness.",
    fuente: 'Taruffi y Koelsch, PLOS ONE (2014)',
    pasos: [
      { es: 'Acompaña lo que sientes', en: 'Meet how you feel', q_es: 'piano melancolico instrumental para llorar', q_en: 'melancholic piano instrumental' },
      { es: 'Y sal poco a poco', en: 'Then come back up slowly', q_es: 'musica serena esperanzadora instrumental', q_en: 'calm hopeful instrumental music' },
    ],
  },
  {
    id: 'desahogo',
    icono: '🔥',
    es: { titulo: 'Necesito desahogarme', sub: 'Soltar la tensión' },
    en: { titulo: 'I need to let off steam', sub: 'Release the tension' },
    // Principio ISO: con rabia o tensión alta, poner música suave de entrada no funciona
    // porque no conecta con el estado real. Primero se iguala la intensidad y después se baja.
    ciencia_es: 'Con la tensión alta, poner música suave de golpe no suele funcionar porque no conecta con cómo estás. En musicoterapia se iguala primero la intensidad y se baja después.',
    ciencia_en: "When tension is high, jumping straight to soft music rarely works because it doesn't connect with how you feel. In music therapy you match the intensity first, then come down.",
    fuente: 'Principio ISO · Altshuler (1944)',
    pasos: [
      { es: 'Iguala la intensidad', en: 'Match the intensity', q_es: 'rock potente para descargar energia', q_en: 'powerful rock to release energy' },
      { es: 'Y baja revoluciones', en: 'Then wind down', q_es: 'musica tempo medio para bajar revoluciones', q_en: 'mid tempo music to wind down' },
    ],
  },
  {
    id: 'calma',
    icono: '🌙',
    es: { titulo: 'Busco calma', sub: 'Bajar el ruido' },
    en: { titulo: 'I want calm', sub: 'Turn down the noise' },
    // Entrainment: a 60-80 BPM la música se acerca al pulso en reposo y el cuerpo tiende a
    // sincronizarse. Ensayos con música lenta muestran bajada de cortisol y subida de
    // oxitocina en saliva (Ooishi et al., PLOS ONE 2017).
    ciencia_es: 'A unos 60 pulsaciones por minuto la música se acerca a tu ritmo cardiaco en reposo y el cuerpo tiende a sincronizarse con ella. Medido en saliva, el cortisol baja y la oxitocina sube.',
    ciencia_en: 'At around 60 beats per minute music sits near your resting heart rate and the body tends to sync with it. Measured in saliva, cortisol drops and oxytocin rises.',
    fuente: 'Ooishi et al., PLOS ONE (2017)',
    pasos: [
      { es: 'Si vienes acelerada, empieza aquí', en: 'If you arrive wound up, start here', q_es: 'musica ambiental suave tempo medio', q_en: 'soft ambient music mid tempo' },
      { es: 'Y baja a 60 bpm', en: 'Then drop to 60 bpm', q_es: 'musica relajante 60 bpm piano lento', q_en: 'relaxing music 60 bpm slow piano' },
    ],
  },
];

export default function MomentoParaTi({ is_es, onClose }) {
  const abrir = (q) => window.open(`https://www.youtube.com/results?search_query=${encodeURIComponent(q)}`, '_blank', 'noopener');

  return (
    <div style={{position:'fixed',inset:0,background:'rgba(13,61,61,0.72)',zIndex:260,display:'flex',alignItems:'flex-end',justifyContent:'center'}} onClick={onClose}>
      <div style={{background:'#FBF7F0',borderRadius:'1.5rem 1.5rem 0 0',padding:'1.75rem 1.25rem 2rem',width:'100%',maxWidth:'520px',maxHeight:'88vh',overflowY:'auto'}} onClick={e=>e.stopPropagation()}>

        <div style={{textAlign:'center',marginBottom:'1.25rem'}}>
          <div style={{fontFamily:'Montserrat,sans-serif',fontSize:'0.65rem',fontWeight:700,color:'#C9935A',letterSpacing:'2px',marginBottom:'0.4rem'}}>
            ✦ {is_es ? 'UN MOMENTO PARA TI' : 'A MOMENT FOR YOU'}
          </div>
          <h2 style={{fontFamily:"'Cormorant Garamond',Georgia,serif",fontSize:'1.5rem',fontWeight:600,color:'#0D3D3D',lineHeight:1.25}}>
            {is_es ? '¿Cómo estás ahora mismo?' : 'How are you right now?'}
          </h2>
          <p style={{fontFamily:'Montserrat,sans-serif',fontSize:'0.8rem',color:'rgba(13,61,61,0.55)',marginTop:'0.4rem',lineHeight:1.55}}>
            {is_es
              ? 'En musicoterapia esto tiene nombre: principio ISO. La música que mejor regula el ánimo es la que primero acompaña cómo estás, y solo después te lleva a donde quieres ir. Por eso cada opción tiene dos pasos y no una lista suelta.'
              : "In music therapy this has a name: the ISO principle. The music that regulates mood best meets you where you are first, and only then takes you where you want to go. That's why each option has two steps rather than one loose playlist."}
          </p>
        </div>

        {ESTADOS.map(e => {
          const t = is_es ? e.es : e.en;
          return (
            <div key={e.id} style={{background:'white',border:'1px solid rgba(201,147,90,0.22)',borderRadius:'1rem',padding:'1.1rem 1.15rem',marginBottom:'0.85rem'}}>
              <div style={{display:'flex',alignItems:'baseline',gap:'0.5rem',marginBottom:'0.4rem'}}>
                <span style={{fontSize:'1.1rem'}}>{e.icono}</span>
                <div>
                  <div style={{fontFamily:"'Cormorant Garamond',Georgia,serif",fontSize:'1.2rem',fontWeight:600,color:'#0D3D3D',lineHeight:1.2}}>{t.titulo}</div>
                  <div style={{fontFamily:'Montserrat,sans-serif',fontSize:'0.68rem',color:'rgba(13,61,61,0.45)',textTransform:'uppercase',letterSpacing:'1px'}}>{t.sub}</div>
                </div>
              </div>

              {/* El porqué siempre visible y con la fuente: si no, parece una lista inventada. */}
              <div style={{background:'rgba(201,147,90,0.08)',borderLeft:'2px solid rgba(201,147,90,0.5)',borderRadius:'0 0.5rem 0.5rem 0',padding:'0.6rem 0.75rem',margin:'0.5rem 0 0.85rem'}}>
                <p style={{fontFamily:'Montserrat,sans-serif',fontSize:'0.78rem',color:'rgba(13,61,61,0.65)',lineHeight:1.55,margin:0}}>
                  {is_es ? e.ciencia_es : e.ciencia_en}
                </p>
                <p style={{fontFamily:'Montserrat,sans-serif',fontSize:'0.65rem',color:'rgba(13,61,61,0.42)',margin:'0.4rem 0 0',fontStyle:'italic'}}>
                  {is_es ? 'Estudio: ' : 'Study: '}{e.fuente}
                </p>
              </div>

              {e.pasos.map((p, i) => (
                <button key={i} type="button" onClick={()=>abrir(is_es ? p.q_es : p.q_en)}
                  style={{width:'100%',display:'flex',alignItems:'center',justifyContent:'space-between',gap:'0.6rem',background:i===0?'rgba(201,147,90,0.1)':'none',border:'1px solid rgba(201,147,90,0.3)',borderRadius:'0.7rem',padding:'0.65rem 0.85rem',marginBottom:'0.45rem',cursor:'pointer',textAlign:'left'}}>
                  <span style={{minWidth:0}}>
                    <span style={{display:'block',fontFamily:'Montserrat,sans-serif',fontSize:'0.6rem',fontWeight:700,color:'#C9935A',letterSpacing:'1px',textTransform:'uppercase'}}>
                      {i === 0 ? (is_es?'Paso 1':'Step 1') : (is_es?'Paso 2':'Step 2')}
                    </span>
                    <span style={{display:'block',fontFamily:'Montserrat,sans-serif',fontSize:'0.82rem',color:'#0D3D3D',fontWeight:600,marginTop:'0.1rem'}}>
                      {is_es ? p.es : p.en}
                    </span>
                  </span>
                  <span style={{fontSize:'0.75rem',color:'#A06030',whiteSpace:'nowrap',flexShrink:0,fontFamily:'Montserrat,sans-serif',fontWeight:600}}>
                    {is_es ? 'YouTube →' : 'YouTube →'}
                  </span>
                </button>
              ))}
            </div>
          );
        })}

        <p style={{fontFamily:'Montserrat,sans-serif',fontSize:'0.68rem',color:'rgba(13,61,61,0.4)',textAlign:'center',lineHeight:1.5,margin:'0.5rem 0 1rem'}}>
          {is_es
            ? 'Si un día la música no te alcanza, hablarlo con alguien de confianza también cuenta.'
            : "If some day music isn't enough, talking to someone you trust counts too."}
        </p>

        <button onClick={onClose} style={{width:'100%',background:'none',border:'none',color:'rgba(13,61,61,0.4)',fontFamily:'Montserrat,sans-serif',fontSize:'0.85rem',cursor:'pointer',padding:'0.6rem'}}>
          {is_es ? 'Cerrar' : 'Close'}
        </button>
      </div>
    </div>
  );
}
