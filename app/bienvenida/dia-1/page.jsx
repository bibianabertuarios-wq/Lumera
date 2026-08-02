'use client';

/**
 * Lumera — Pantalla Día 1 (mapa de bienvenida)
 * ------------------------------------------------------------
 * El gate vive en app/dashboard/page.jsx: al cargar, si el perfil tiene
 * onboarding_dia1_completo = false (o null), redirige aquí antes de
 * mostrar el dashboard — sin importar si llegó por alta o por login.
 * Al terminar, handleFinish guarda nombre preferido + hora de comida,
 * pone onboarding_dia1_completo = true, y entra a /dashboard (o a
 * /escaner si eligió medirse ahora).
 */

import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '../../lib/supabase';

const C = {
  copper: '#C9935A',
  copperL: '#E0B076',
  green: '#16302A',
  soft: '#93A79D',
  serif: '"Cormorant Garamond", serif',
  sans: '"Montserrat", system-ui, sans-serif',
};

// Bucket de "¿a qué hora sueles comer?" → hora real guardada (afinable luego en Yo).
const HORA_COMIDA_POR_BUCKET = { 'antes-13': '12:30', '13-14': '13:30', 'tarde': '15:00' };

export default function BienvenidaDia1() {
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [paso, setPaso] = useState(1);
  const [nombre, setNombre] = useState('');
  const [horaComidaBucket, setHoraComidaBucket] = useState('13-14');
  const [medir, setMedir] = useState('ahora');
  const [guardando, setGuardando] = useState(false);

  useEffect(() => {
    (async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) { router.push('/start'); return; }
      const { data: profile } = await supabase.from('users').select('*').eq('id', session.user.id).single();
      const is_es = (profile?.language || 'es') === 'es';
      setUser({
        id: session.user.id,
        nombre: profile?.profile_name || '',
        objetivo: profile?.objetivo || profile?.goal || '',
        sintoma: profile?.sintoma_principal || '',
        restricciones: profile?.restricciones || '',
        edad: profile?.age || null,
        region: profile?.region || '',
        is_es,
      });
      setNombre(profile?.profile_name || '');
      setLoading(false);
    })();
  }, []);

  const is_es = user?.is_es !== false;

  const known = useMemo(() => {
    if (!user) return [];
    const chips = [];
    if (user.objetivo) chips.push(is_es ? `Tu objetivo: ${user.objetivo}` : `Your goal: ${user.objetivo}`);
    if (user.sintoma) chips.push(user.sintoma);
    if (user.restricciones && !['ninguna','none'].includes(user.restricciones.toLowerCase())) chips.push(user.restricciones);
    if (user.edad) chips.push(is_es ? `${user.edad} años` : `${user.edad} years old`);
    return chips;
  }, [user, is_es]);

  const stops = useMemo(() => (is_es ? [
    { n: 1, here: true, tag: 'EMPIEZAS AQUÍ', t: 'Entender tu cuerpo', s: 'Cada día me dices cómo estás y yo te devuelvo qué significa. Sin dietas raras y sin contar nada.' },
    { n: 2, t: 'Hacerlo tuyo', s: 'Con lo que me vas contando, ajusto el plan a tus horarios, a tu cuerpo y a lo que sí puedes sostener.' },
    { n: 3, t: 'Convertirlo en hábito', s: 'Cosas pequeñas, repetidas. Yo te aviso a su hora — tú solo tienes que aparecer.' },
    { n: 4, t: 'Notar el cambio', s: 'Primero por dentro (más energía, menos hinchazón) y después por fuera. Aquí lo vas viendo.' },
  ] : [
    { n: 1, here: true, tag: 'YOU START HERE', t: 'Understand your body', s: 'Every day you tell me how you feel and I tell you what it means. No fad diets, no counting anything.' },
    { n: 2, t: 'Make it yours', s: 'With what you tell me, I adjust the plan to your schedule, your body, and what you can actually sustain.' },
    { n: 3, t: 'Turn it into habit', s: 'Small things, repeated. I remind you when it\'s time — you just show up.' },
    { n: 4, t: 'Notice the change', s: 'First on the inside (more energy, less bloating), then on the outside. Here you see both.' },
  ]), [is_es]);

  function next() {
    setPaso(p => Math.min(p + 1, 5));
    if (typeof window !== 'undefined') window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  async function handleFinish() {
    setGuardando(true);
    try {
      await supabase.from('users').update({
        profile_name: nombre || user.nombre || null,
        hora_comida: HORA_COMIDA_POR_BUCKET[horaComidaBucket] || '13:30',
        onboarding_dia1_completo: true,
      }).eq('id', user.id);
    } catch (e) {
      console.error('Error guardando Día 1:', e.message || e);
    }
    setGuardando(false);
    next();
  }

  function entrar() {
    router.push(medir === 'ahora' ? '/escaner' : '/dashboard');
  }

  if (loading || !user) {
    return (
      <div style={{ minHeight:'100vh', background:'#ded7ca', display:'flex', alignItems:'center', justifyContent:'center' }}>
        <p style={{ fontFamily: C.sans, color:'rgba(22,48,42,0.5)', fontSize:'0.9rem' }}>
          {is_es ? 'Cargando...' : 'Loading...'}
        </p>
      </div>
    );
  }

  const total = 5;

  return (
    <div style={s.page}>
      <div style={s.phone}>
        <div style={s.glow} />
        <div style={s.scr}>

          {/* 1 · PRESENTACIÓN (Bibiana, la creadora, en primera persona) */}
          {paso === 1 && (
            <div style={s.step}>
              <div style={s.mark}>✦ Lumera</div>
              <Lumi ini="B" nombre="BIBIANA" rol={is_es ? 'la fundadora de Lumera' : 'the founder of Lumera'} />
              {is_es ? (
                <>
                  <h1 style={s.h1}>Antes de empezar,<br /><b style={s.b}>me presento.</b></h1>
                  <p style={s.p}>Vengo de la bioquímica, la nutrición clínica y la tecnología de los alimentos — y de ahí sale todo lo que Lumi te va a contar: nada de modas, solo lo que de verdad sostiene el cuerpo por dentro.</p>
                  <p style={s.p}>También soy madre, y este año me toca cumplir los cuarenta. Así que esto no es teoría: es lo que necesito yo también.</p>
                  <p style={{ ...s.p, color: C.copperL }}>Vamos a cuidarte desde dentro para que te veas bien por fuera.</p>
                  <p style={s.handoff}>A partir de aquí te acompaña <b style={{ color: C.copperL }}>Lumi</b>, que es como llamo a la guía que he construido con todo esto dentro.</p>
                </>
              ) : (
                <>
                  <h1 style={s.h1}>Before we start,<br /><b style={s.b}>let me introduce myself.</b></h1>
                  <p style={s.p}>I come from biochemistry, clinical nutrition and food technology — and that's where everything Lumi tells you comes from: no fads, only what truly sustains the body from within.</p>
                  <p style={s.p}>I'm also a mother, and this year I turn forty. So this isn't theory — it's what I need too.</p>
                  <p style={{ ...s.p, color: C.copperL }}>We're going to care for you from the inside so you feel good on the outside.</p>
                  <p style={s.handoff}>From here on, <b style={{ color: C.copperL }}>Lumi</b> is with you — that's what I call the guide I built with all of this inside it.</p>
                </>
              )}
              <button style={s.btn} onClick={next}>{is_es ? 'Empezar →' : 'Start →'}</button>
            </div>
          )}

          {/* 2 · LO QUE YA SÉ DE TI */}
          {paso === 2 && (
            <div style={s.step}>
              <Lumi ini="L" nombre="LUMI" rol={is_es ? 'tu guía a partir de hoy' : 'your guide from today'} />
              <h1 style={s.h1}>{is_es ? <>Esto es lo que <b style={s.b}>ya sé de ti.</b></> : <>This is what <b style={s.b}>I already know about you.</b></>}</h1>
              <p style={s.pSans}>
                {is_es ? 'No voy a preguntarte otra vez lo que ya me contaste en el cuestionario. Arrancamos con esto:' : "I won't ask you again what you already told me in the quiz. We start with this:"}
              </p>
              <div style={s.know}>
                {known.map((k, i) => (
                  <span key={i} style={{ ...s.chip, animationDelay: `${i * 0.09}s` }}>{k}</span>
                ))}
              </div>
              <p style={{ ...s.pSans, marginTop: 20 }}>
                {is_es ? 'Con esto ya puedo darte un plan. Y cada día que me cuentes cómo estás, lo afino un poco más a ti.' : "With this I can already give you a plan. And every day you tell me how you feel, I fine-tune it a little more to you."}
              </p>
              <button style={s.btn} onClick={next}>{is_es ? 'Ver mi camino →' : 'See my path →'}</button>
            </div>
          )}

          {/* 3 · EL MAPA */}
          {paso === 3 && (
            <div style={s.step}>
              <Lumi ini="L" nombre="LUMI" rol={is_es ? 'este es el recorrido' : "here's the journey"} />
              <h1 style={s.h1}>{is_es ? <>Tu camino,<br /><b style={s.b}>paso a paso.</b></> : <>Your path,<br /><b style={s.b}>step by step.</b></>}</h1>
              <div style={{ marginTop: 6 }}>
                {stops.map((st, i) => (
                  <div key={st.n} style={{ ...s.stop, animationDelay: `${i * 0.18}s` }}>
                    {i < stops.length - 1 && <span style={s.stopLine} />}
                    <span style={{ ...s.dot, ...(st.here ? s.dotHere : null) }}>{st.n}</span>
                    <div>
                      {st.tag && <span style={s.tagPill}>{st.tag}</span>}
                      <div style={s.stT}>{st.t}</div>
                      <div style={s.stS}>{st.s}</div>
                    </div>
                  </div>
                ))}
              </div>
              <div style={s.nodate}>
                {is_es
                  ? 'No te voy a poner una fecha. Esto no es un sprint: es una carrera de fondo, un cambio para quedarse — y estaré contigo en todo el proceso.'
                  : "I won't put a date on it. This isn't a sprint: it's a long-distance race, a change that's meant to stay — and I'll be with you all the way through."}
              </div>
              <button style={s.btn} onClick={next}>{is_es ? 'Vamos allá →' : "Let's go →"}</button>
            </div>
          )}

          {/* 4 · LAS 3 COSAS QUE FALTAN */}
          {paso === 4 && (
            <div style={s.step}>
              <Lumi ini="L" nombre="LUMI" rol={is_es ? 'solo tres cosas y empezamos' : "just three things and we start"} />
              <h1 style={s.h1}>{is_es ? <>Tres cosas<br /><b style={s.b}>y nada más.</b></> : <>Three things<br /><b style={s.b}>and nothing else.</b></>}</h1>

              {!user.nombre && (
                <div style={s.q}>
                  <div style={s.ql}>{is_es ? '¿CÓMO TE LLAMO?' : 'WHAT SHOULD I CALL YOU?'}</div>
                  <input
                    style={s.inp}
                    placeholder={is_es ? 'Tu nombre' : 'Your name'}
                    value={nombre}
                    onChange={(e) => setNombre(e.target.value)}
                  />
                </div>
              )}

              <div style={s.q}>
                <div style={s.ql}>{is_es ? '¿A QUÉ HORA SUELES COMER?' : 'WHAT TIME DO YOU USUALLY EAT LUNCH?'}</div>
                <div style={s.opts}>
                  {(is_es
                    ? [['antes-13', 'Antes de las 13h'], ['13-14', 'Sobre las 13-14h'], ['tarde', 'Más tarde']]
                    : [['antes-13', 'Before 1pm'], ['13-14', 'Around 1-2pm'], ['tarde', 'Later']]
                  ).map(([v, l]) => (
                    <button key={v} style={{ ...s.opt, ...(horaComidaBucket === v ? s.optOn : null) }} onClick={() => setHoraComidaBucket(v)}>{l}</button>
                  ))}
                </div>
              </div>

              <div style={s.q}>
                <div style={s.ql}>{is_es ? 'TU PUNTO DE PARTIDA' : 'YOUR STARTING POINT'}</div>
                <p style={{ ...s.pSans, marginBottom: 10 }}>
                  {is_es ? 'Una medición hoy, y la siguiente en 30 días. Nada de fotos a diario.' : "One measurement today, and the next in 30 days. No daily photos."}
                </p>
                <div style={s.opts}>
                  {(is_es
                    ? [['ahora', '📷 Medir ahora'], ['luego', 'Lo hago luego']]
                    : [['ahora', '📷 Measure now'], ['luego', "I'll do it later"]]
                  ).map(([v, l]) => (
                    <button key={v} style={{ ...s.opt, ...(medir === v ? s.optOn : null) }} onClick={() => setMedir(v)}>{l}</button>
                  ))}
                </div>
              </div>

              <button style={s.btn} onClick={handleFinish} disabled={guardando}>
                {guardando ? (is_es ? 'Guardando...' : 'Saving...') : (is_es ? 'Crear mi plan →' : 'Create my plan →')}
              </button>
            </div>
          )}

          {/* 5 · LISTO */}
          {paso === 5 && (
            <div style={s.step}>
              <Lumi ini="L" nombre="LUMI" rol={is_es ? 'ya está' : 'all set'} />
              <h1 style={s.h1}>
                {is_es ? <>Tu plan está<br /><b style={s.b}>listo{nombre ? `, ${nombre}` : ''}.</b></> : <>Your plan is<br /><b style={s.b}>ready{nombre ? `, ${nombre}` : ''}.</b></>}
              </h1>
              <p style={s.p}>
                {is_es ? 'Empezamos por lo primero: entender tu cuerpo. Hoy solo tienes que decirme cómo amaneces — del resto me encargo yo.' : "We start with the first thing: understanding your body. Today you just need to tell me how you woke up — I take care of the rest."}
              </p>
              <p style={{ ...s.p, color: C.copperL }}>{is_es ? 'Estoy aquí para ti. Todos los días.' : "I'm here for you. Every day."}</p>
              <button style={s.btn} onClick={entrar}>{is_es ? 'Entrar en Lumera →' : 'Enter Lumera →'}</button>
            </div>
          )}

          {/* progreso */}
          <div style={s.prog}>
            {Array.from({ length: total }).map((_, i) => (
              <span key={i} style={{ ...s.pg, ...(i < paso ? s.pgOn : null) }} />
            ))}
          </div>
        </div>
      </div>

      <style>{keyframes}</style>
    </div>
  );
}

function Lumi({ ini, nombre, rol }) {
  return (
    <div style={s.lum}>
      <div style={s.av}>{ini}</div>
      <div>
        <div style={s.lumN}>{nombre}</div>
        <div style={s.lumR}>{rol}</div>
      </div>
    </div>
  );
}

const keyframes = `
@keyframes lum-fade{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:none}}
@keyframes lum-pop{from{opacity:0;transform:scale(.9)}to{opacity:1;transform:none}}
@media (prefers-reduced-motion: reduce){
  [data-anim]{animation:none !important}
}
`;

const s = {
  page: { minHeight: '100vh', background: '#ded7ca', display: 'flex', justifyContent: 'center', alignItems: 'flex-start', padding: '18px 10px', fontFamily: C.sans },
  phone: { width: '100%', maxWidth: 412, background: `linear-gradient(175deg, #1B3830, #101F1B)`, borderRadius: 32, overflow: 'hidden', boxShadow: '0 22px 55px rgba(20,35,30,.45)', position: 'relative', minHeight: 720 },
  glow: { position: 'absolute', inset: 0, background: 'radial-gradient(90% 55% at 78% 6%, rgba(201,147,90,.20), transparent 62%), radial-gradient(70% 40% at 10% 96%, rgba(224,176,118,.10), transparent 60%)', pointerEvents: 'none' },
  scr: { position: 'relative', padding: '26px 22px 70px', color: '#F3ECDF' },
  step: { animation: 'lum-fade .55s ease both' },
  mark: { fontFamily: C.serif, fontSize: 20, color: C.copperL, letterSpacing: 1, marginBottom: 26 },

  lum: { display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 },
  av: { width: 46, height: 46, borderRadius: '50%', background: `linear-gradient(140deg, ${C.copperL}, #B57C42)`, color: '#fff', fontFamily: C.serif, fontSize: 22, fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center', flex: 'none', boxShadow: '0 0 0 5px rgba(224,176,118,.14)' },
  lumN: { fontSize: 11, letterSpacing: 1.8, fontWeight: 700, color: C.copperL },
  lumR: { fontFamily: C.serif, fontSize: 15, fontStyle: 'italic', color: C.soft },

  h1: { fontFamily: C.serif, fontSize: 31, fontWeight: 500, lineHeight: 1.22, marginBottom: 14 },
  b: { color: C.copperL, fontWeight: 600 },
  p: { fontFamily: C.serif, fontSize: 18.5, fontStyle: 'italic', lineHeight: 1.5, color: '#DCD3C4', marginBottom: 14 },
  pSans: { fontFamily: C.sans, fontSize: 14, lineHeight: 1.6, color: '#B4C2BA' },
  handoff: { fontFamily: C.sans, fontSize: 13, lineHeight: 1.6, color: C.soft, marginTop: 18, borderTop: '1px solid rgba(224,176,118,.18)', paddingTop: 16 },

  btn: { marginTop: 26, width: '100%', background: C.copper, color: '#fff', border: 'none', fontFamily: C.sans, fontWeight: 700, fontSize: 15, padding: 16, borderRadius: 16, cursor: 'pointer', boxShadow: '0 10px 26px rgba(201,147,90,.32)' },

  know: { display: 'flex', flexWrap: 'wrap', gap: 8, margin: '18px 0 4px' },
  chip: { fontSize: 12.5, fontWeight: 600, background: 'rgba(224,176,118,.13)', border: '1px solid rgba(224,176,118,.32)', color: '#EBD9BC', borderRadius: 20, padding: '8px 13px', opacity: 0, animation: 'lum-pop .45s ease forwards' },

  stop: { display: 'flex', gap: 15, alignItems: 'flex-start', position: 'relative', paddingBottom: 26, opacity: 0, animation: 'lum-fade .5s ease forwards' },
  stopLine: { position: 'absolute', left: 17, top: 34, bottom: -2, width: 2, background: 'linear-gradient(180deg, rgba(224,176,118,.5), rgba(224,176,118,.12))' },
  dot: { width: 36, height: 36, borderRadius: '50%', flex: 'none', border: '2px solid rgba(224,176,118,.45)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: C.serif, fontSize: 16, fontWeight: 600, color: C.copperL, background: 'rgba(224,176,118,.08)', zIndex: 1 },
  dotHere: { background: C.copper, borderColor: C.copper, color: '#fff', boxShadow: '0 0 0 6px rgba(201,147,90,.18)' },
  tagPill: { display: 'inline-block', fontSize: 9.5, letterSpacing: 1.6, fontWeight: 700, color: C.green, background: C.copperL, borderRadius: 5, padding: '3px 8px', marginBottom: 6 },
  stT: { fontFamily: C.serif, fontSize: 21, fontWeight: 600, lineHeight: 1.2 },
  stS: { fontSize: 12.5, color: '#A8B8AF', lineHeight: 1.5, marginTop: 4 },
  nodate: { marginTop: 4, fontFamily: C.serif, fontStyle: 'italic', fontSize: 16, color: C.soft, lineHeight: 1.45, borderTop: '1px solid rgba(224,176,118,.18)', paddingTop: 16 },

  q: { marginBottom: 22 },
  ql: { fontSize: 11, letterSpacing: 1.8, fontWeight: 700, color: C.copperL, marginBottom: 9 },
  opts: { display: 'flex', gap: 8, flexWrap: 'wrap' },
  opt: { background: 'rgba(255,255,255,.06)', border: '1.5px solid rgba(224,176,118,.28)', color: '#EBD9BC', borderRadius: 13, padding: '11px 15px', fontFamily: C.sans, fontSize: 13.5, fontWeight: 600, cursor: 'pointer' },
  optOn: { background: C.copper, borderColor: C.copper, color: '#fff' },
  inp: { width: '100%', background: 'rgba(255,255,255,.06)', border: '1.5px solid rgba(224,176,118,.28)', borderRadius: 13, padding: '13px 15px', color: '#fff', fontFamily: C.sans, fontSize: 14, outline: 'none' },

  prog: { display: 'flex', gap: 6, marginTop: 30 },
  pg: { flex: 1, height: 3, borderRadius: 3, background: 'rgba(224,176,118,.2)' },
  pgOn: { background: C.copperL },
};
