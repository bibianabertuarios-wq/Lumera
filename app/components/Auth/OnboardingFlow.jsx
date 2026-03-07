'use client'
import { useState } from 'react'
import { supabase } from '../../lib/supabase'

const t = {
  es: {
    step1: 'Crea tu cuenta',
    step2: 'Sobre ti',
    step3: 'Tu salud',
    step4: 'Tu objetivo',
    step5: 'Tu región',
    name: 'Nombre',
    age: 'Edad',
    weight: 'Peso (kg)',
    height: 'Altura (cm)',
    next: 'Continuar',
    back: 'Atrás',
    finish: 'Empezar mi journey 🌙',
    loading: 'Cargando...',
    restrictions: 'Selecciona las que apliquen',
    objective: '¿Cuál es tu objetivo principal?',
    region: '¿Dónde estás?',
    legal1: 'He leído y acepto la',
    legal2: 'Política de Privacidad',
    legal3: 'y los',
    legal4: 'Términos de Uso',
    legal5: 'Confirmo que tengo 18 años o más',
    legal6: 'Entiendo que Lumera no sustituye al médico',
    legalError: 'Debes aceptar todos los términos para continuar',
    disclaimer: '⚕️ Lumera es una herramienta de bienestar. No sustituye el consejo médico profesional.',
    welcome: 'Tu nuevo capítulo comienza ahora',
    welcomeSub: 'Lumera te acompaña a redescubrir la vitalidad en esta etapa. Ciencia y cuidado diseñados para ti.',
    objectives: [
      { id: 'hormonal', label: 'Equilibrio hormonal', emoji: '🌙' },
      { id: 'weight', label: 'Bajar de peso', emoji: '⚖️' },
      { id: 'strength', label: 'Ganar fuerza', emoji: '💪' },
    ],
    regions: [
      { id: 'emea', label: 'Europa / EMEA', emoji: '🇪🇺' },
      { id: 'latam', label: 'Latinoamérica', emoji: '🌎' },
      { id: 'usa', label: 'Estados Unidos', emoji: '🇺🇸' },
    ],
    restrictionsList: [
      { id: 'diabetes', label: 'Diabetes' },
      { id: 'lactose', label: 'Intolerancia a la lactosa' },
      { id: 'celiac', label: 'Celiaquía / Gluten' },
      { id: 'vegetarian', label: 'Vegetariana' },
      { id: 'vegan', label: 'Vegana' },
      { id: 'arthritis', label: 'Artritis' },
      { id: 'hypertension', label: 'Tensión alta' },
    ],
  },
  en: {
    step1: 'Create your account',
    step2: 'About you',
    step3: 'Your health',
    step4: 'Your goal',
    step5: 'Your region',
    name: 'Name',
    age: 'Age',
    weight: 'Weight (kg)',
    height: 'Height (cm)',
    next: 'Continue',
    back: 'Back',
    finish: 'Start my journey 🌙',
    loading: 'Loading...',
    restrictions: 'Select all that apply',
    objective: 'What is your main goal?',
    region: 'Where are you?',
    legal1: "I've read and accept the",
    legal2: 'Privacy Policy',
    legal3: 'and the',
    legal4: 'Terms of Use',
    legal5: 'I confirm I am 18 years or older',
    legal6: 'I understand Lumera does not replace medical advice',
    legalError: 'You must accept all terms to continue',
    disclaimer: '⚕️ Lumera is a wellness tool. It does not replace professional medical advice.',
    welcome: 'Your new chapter begins now',
    welcomeSub: 'Lumera guides you to rediscover vitality at this stage. Science and care designed for you.',
    objectives: [
      { id: 'hormonal', label: 'Hormonal balance', emoji: '🌙' },
      { id: 'weight', label: 'Lose weight', emoji: '⚖️' },
      { id: 'strength', label: 'Gain strength', emoji: '💪' },
    ],
    regions: [
      { id: 'emea', label: 'Europe / EMEA', emoji: '🇪🇺' },
      { id: 'latam', label: 'Latin America', emoji: '🌎' },
      { id: 'usa', label: 'United States', emoji: '🇺🇸' },
    ],
    restrictionsList: [
      { id: 'diabetes', label: 'Diabetes' },
      { id: 'lactose', label: 'Lactose intolerance' },
      { id: 'celiac', label: 'Celiac / Gluten-free' },
      { id: 'vegetarian', label: 'Vegetarian' },
      { id: 'vegan', label: 'Vegan' },
      { id: 'arthritis', label: 'Arthritis' },
      { id: 'hypertension', label: 'High blood pressure' },
    ],
  }
}

export default function OnboardingFlow({ onComplete }) {
  const [lang, setLang] = useState('es')
  const [step, setStep] = useState(0)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [legalPrivacy, setLegalPrivacy] = useState(false)
  const [legal18, setLegal18] = useState(false)
  const [legalMedical, setLegalMedical] = useState(false)
  const [name, setName] = useState('')
  const [age, setAge] = useState('')
  const [weight, setWeight] = useState('')
  const [height, setHeight] = useState('')
  const [restrictions, setRestrictions] = useState([])
  const [objective, setObjective] = useState('')
  const [region, setRegion] = useState('')

  const tx = t[lang]
  const totalSteps = 5

  function toggleRestriction(id) {
    setRestrictions(prev =>
      prev.includes(id) ? prev.filter(r => r !== id) : [...prev, id]
    )
  }

  async function handleStep1() {
    if (!legalPrivacy || !legal18 || !legalMedical) {
      setError(tx.legalError)
      return
    }
    setLoading(true)
    setError('')
    const { error } = await supabase.auth.signUp({ email, password })
    if (error) {
      const { error: loginError } = await supabase.auth.signInWithPassword({ email, password })
      if (loginError) { setError(loginError.message); setLoading(false); return }
    }
    setLoading(false)
    setStep(2)
  }

  async function handleFinish() {
    setLoading(true)
    setError('')
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('No user found')
      await supabase.from('profiles').upsert({
        id: user.id,
        name,
        age: parseInt(age),
        weight: parseFloat(weight),
        height: parseFloat(height),
        restrictions,
        objective,
        region,
        language: lang,
        onboarding_complete: true,
        updated_at: new Date().toISOString(),
      })
      onComplete()
    } catch (e) {
      setError(e.message)
    }
    setLoading(false)
  }

  // ── Colores del sistema Lumera ──
  const purple = '#7c3aed'
  const pink = '#ec4899'
  const textMain = '#292524'
  const textSub = '#78716c'
  const borderGlass = 'rgba(255,255,255,0.85)'
  const bgGlass = 'rgba(255,255,255,0.65)'

  const inputStyle = {
    width: '100%',
    background: 'rgba(255,255,255,0.7)',
    border: '1px solid rgba(124,58,237,0.2)',
    borderRadius: '14px',
    padding: '14px 16px',
    color: textMain,
    fontSize: '15px',
    outline: 'none',
    boxSizing: 'border-box',
    marginBottom: '14px',
    backdropFilter: 'blur(8px)',
    fontFamily: 'system-ui, sans-serif',
  }

  const btnPrimary = (disabled) => ({
    width: '100%',
    background: disabled
      ? 'rgba(124,58,237,0.3)'
      : 'linear-gradient(135deg, #7c3aed, #a855f7 55%, #ec4899)',
    border: 'none',
    borderRadius: '9999px',
    padding: '15px',
    color: 'white',
    fontSize: '15px',
    fontWeight: '700',
    cursor: disabled ? 'not-allowed' : 'pointer',
    marginTop: '8px',
    boxShadow: disabled ? 'none' : '0 4px 20px rgba(124,58,237,0.35)',
    letterSpacing: '0.02em',
  })

  const btnSecondary = {
    width: '100%',
    background: 'transparent',
    border: '1px solid rgba(124,58,237,0.25)',
    borderRadius: '9999px',
    padding: '13px',
    color: textSub,
    fontSize: '14px',
    cursor: 'pointer',
    marginTop: '8px',
  }

  const optionCard = (selected) => ({
    display: 'flex',
    alignItems: 'center',
    gap: '14px',
    padding: '14px 16px',
    background: selected ? 'rgba(124,58,237,0.1)' : 'rgba(255,255,255,0.6)',
    border: `1.5px solid ${selected ? purple : 'rgba(124,58,237,0.15)'}`,
    borderRadius: '16px',
    cursor: 'pointer',
    marginBottom: '10px',
    transition: 'all 0.2s',
    backdropFilter: 'blur(8px)',
  })

  const checkRow = {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '10px',
    padding: '11px 14px',
    background: 'rgba(255,255,255,0.5)',
    border: '1px solid rgba(124,58,237,0.12)',
    borderRadius: '12px',
    cursor: 'pointer',
    marginBottom: '8px',
    backdropFilter: 'blur(8px)',
  }

  const checkbox = (checked) => ({
    width: '18px',
    height: '18px',
    minWidth: '18px',
    borderRadius: '5px',
    border: `2px solid ${checked ? purple : 'rgba(124,58,237,0.3)'}`,
    background: checked ? purple : 'transparent',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '11px',
    color: 'white',
    marginTop: '1px',
  })

  return (
    <div style={{
      minHeight: '100vh',
      width: '100%',
      position: 'relative',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px',
      boxSizing: 'border-box',
      background: '#faf7f5',
    }}>

      {/* ── VIDEO FONDO ── */}
      <video
        src="/videos/Dashboard.mp4"
        autoPlay loop muted playsInline
        style={{
          position: 'fixed',
          top: 0, left: 0,
          width: '100%', height: '100%',
          objectFit: 'cover',
          opacity: 0.22,
          zIndex: 0,
          pointerEvents: 'none',
        }}
      />

      {/* ── OVERLAY GRADIENTE SUAVE ── */}
      <div style={{
        position: 'fixed',
        top: 0, left: 0,
        width: '100%', height: '100%',
        background: 'linear-gradient(160deg, rgba(250,245,242,0.7) 0%, rgba(240,230,250,0.5) 100%)',
        zIndex: 1,
        pointerEvents: 'none',
      }} />

      {/* ── TARJETA GLASSMORPHISM ── */}
      <div style={{
        position: 'relative',
        zIndex: 10,
        width: '100%',
        maxWidth: '440px',
        background: bgGlass,
        backdropFilter: 'blur(24px)',
        WebkitBackdropFilter: 'blur(24px)',
        border: `1px solid ${borderGlass}`,
        borderRadius: '2rem',
        padding: '2.5rem 2rem',
        boxShadow: '0 8px 48px rgba(124,58,237,0.12), 0 2px 8px rgba(0,0,0,0.06)',
      }}>

        {/* Lang toggle */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '1rem', gap: '8px' }}>
          {['es', 'en'].map(l => (
            <button key={l} onClick={() => setLang(l)} style={{
              background: lang === l ? 'rgba(124,58,237,0.12)' : 'transparent',
              border: `1px solid ${lang === l ? purple : 'rgba(124,58,237,0.2)'}`,
              borderRadius: '8px',
              padding: '4px 12px',
              color: lang === l ? purple : textSub,
              fontSize: '12px',
              fontWeight: lang === l ? 700 : 400,
              cursor: 'pointer',
            }}>{l.toUpperCase()}</button>
          ))}
        </div>

        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
          <div style={{ fontSize: '2rem', marginBottom: '4px' }}>🌙</div>
          <h1 style={{
            fontFamily: "'Cormorant', Georgia, serif",
            fontSize: '1.8rem',
            fontWeight: 400,
            color: textMain,
            margin: '0 0 4px',
            letterSpacing: '0.02em',
          }}>Lumera</h1>
          <p style={{
            fontSize: '0.78rem',
            color: textSub,
            margin: 0,
            letterSpacing: '0.06em',
            textTransform: 'uppercase',
          }}>{tx[`step${step}`]}</p>
        </div>

        {/* Barra progreso */}
        <div style={{ display: 'flex', gap: '6px', marginBottom: '1.75rem' }}>
          {[1,2,3,4,5].map(i => (
            <div key={i} style={{
              flex: 1, height: '4px', borderRadius: '9999px',
              background: i < step
                ? 'linear-gradient(90deg, #7c3aed, #ec4899)'
                : i === step
                  ? 'rgba(124,58,237,0.5)'
                  : 'rgba(124,58,237,0.12)',
              transition: 'background 0.3s',
            }} />
          ))}
        </div>

        {error && (
          <p style={{ color: '#e11d48', fontSize: '13px', marginBottom: '12px', textAlign: 'center', background: 'rgba(225,29,72,0.08)', borderRadius: '10px', padding: '8px 12px' }}>
            {error}
          </p>
        )}

        {/* ── STEP 1: Auth + Legal ── */}
        {step === 0 && (
          <div style={{ textAlign: 'center' }}>
            {/* Video decorativo esquina */}
            <div style={{
              width: '120px', height: '120px', borderRadius: '9999px',
              overflow: 'hidden', margin: '0 auto 1.5rem',
              border: '1px solid rgba(255,255,255,0.6)',
              boxShadow: '0 4px 24px rgba(124,58,237,0.15)',
            }}>
              <video src="/videos/menu.mp4" autoPlay loop muted playsInline
                style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
            <p style={{ fontSize: '0.72rem', fontWeight: 700, color: '#a855f7', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '0.75rem' }}>
              ✦ LUMERA
            </p>
            <h2 style={{
              fontFamily: "'Cormorant', Georgia, serif",
              fontSize: '2rem', fontWeight: 400, color: '#292524',
              lineHeight: 1.2, marginBottom: '1rem',
            }}>
              {lang === 'es' ? 'Tu nuevo capítulo
comienza ahora' : 'Your new chapter
begins now'}
            </h2>
            <p style={{ fontSize: '0.88rem', color: '#78716c', lineHeight: 1.7, marginBottom: '2rem', padding: '0 0.5rem' }}>
              {lang === 'es'
                ? 'Lumera te acompaña a redescubrir la vitalidad en esta etapa. Ciencia y cuidado diseñados para ti.'
                : 'Lumera guides you to rediscover vitality at this stage. Science and care designed for you.'}
            </p>
            <button
              onClick={() => setStep(1)}
              style={{
                width: '100%',
                background: 'linear-gradient(135deg, #7c3aed, #a855f7 55%, #ec4899)',
                border: 'none', borderRadius: '9999px', padding: '16px',
                color: 'white', fontSize: '15px', fontWeight: '700',
                cursor: 'pointer', boxShadow: '0 4px 24px rgba(124,58,237,0.4)',
                letterSpacing: '0.02em', marginBottom: '1rem',
              }}
            >
              {lang === 'es' ? '✨ Abrazar mi transformación' : '✨ Embrace my transformation'}
            </button>
            <p style={{ fontSize: '0.75rem', color: '#a8a29e' }}>
              {lang === 'es' ? 'Gratis · Sin tarjeta · Cancela cuando quieras' : 'Free · No card · Cancel anytime'}
            </p>
          </div>
        )}

        {step === 1 && (
          <div>
            {/* Headline de bienvenida */}
            <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
              <h2 style={{
                fontFamily: "'Cormorant', Georgia, serif",
                fontSize: '1.5rem',
                fontWeight: 400,
                color: textMain,
                lineHeight: 1.3,
                marginBottom: '0.5rem',
              }}>{tx.welcome}</h2>
              <p style={{ fontSize: '0.83rem', color: textSub, lineHeight: 1.6 }}>{tx.welcomeSub}</p>
            </div>

            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              style={inputStyle}
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              style={inputStyle}
            />

            <div style={{
              background: 'rgba(124,58,237,0.05)',
              border: '1px solid rgba(124,58,237,0.15)',
              borderRadius: '12px',
              padding: '10px 14px',
              color: textSub,
              fontSize: '12px',
              lineHeight: '1.6',
              marginBottom: '16px',
            }}>{tx.disclaimer}</div>

            {[
              { checked: legalPrivacy, set: setLegalPrivacy, content: (
                <span style={{ fontSize: '13px', color: textSub, lineHeight: 1.5 }}>
                  {tx.legal1} <a href={lang === 'es' ? '/privacidad' : '/privacy'} target="_blank" style={{ color: purple, textDecoration: 'underline' }}>{tx.legal2}</a> {tx.legal3} <a href={lang === 'es' ? '/terminos' : '/terms'} target="_blank" style={{ color: purple, textDecoration: 'underline' }}>{tx.legal4}</a>
                </span>
              )},
              { checked: legal18, set: setLegal18, content: <span style={{ fontSize: '13px', color: textSub }}>{tx.legal5}</span> },
              { checked: legalMedical, set: setLegalMedical, content: <span style={{ fontSize: '13px', color: textSub }}>{tx.legal6}</span> },
            ].map((item, i) => (
              <div key={i} style={checkRow} onClick={() => item.set(!item.checked)}>
                <div style={checkbox(item.checked)}>{item.checked ? '✓' : ''}</div>
                {item.content}
              </div>
            ))}

            <button
              style={btnPrimary(loading || !email || !password)}
              onClick={handleStep1}
              disabled={loading || !email || !password}
            >{loading ? tx.loading : tx.next}</button>
          </div>
        )}

        {/* ── STEP 2: Datos personales ── */}
        {step === 2 && (
          <div>
            <label style={{ display: 'block', fontSize: '12px', color: textSub, letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: '6px' }}>{tx.name}</label>
            <input type="text" value={name} onChange={e => setName(e.target.value)} style={inputStyle} />

            <label style={{ display: 'block', fontSize: '12px', color: textSub, letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: '6px' }}>{tx.age}</label>
            <input type="number" value={age} onChange={e => setAge(e.target.value)} style={inputStyle} min="18" max="99" />

            <div style={{ display: 'flex', gap: '12px' }}>
              <div style={{ flex: 1 }}>
                <label style={{ display: 'block', fontSize: '12px', color: textSub, letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: '6px' }}>{tx.weight}</label>
                <input type="number" value={weight} onChange={e => setWeight(e.target.value)} style={inputStyle} />
              </div>
              <div style={{ flex: 1 }}>
                <label style={{ display: 'block', fontSize: '12px', color: textSub, letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: '6px' }}>{tx.height}</label>
                <input type="number" value={height} onChange={e => setHeight(e.target.value)} style={inputStyle} />
              </div>
            </div>

            <button style={btnPrimary(!name || !age || !weight || !height)} onClick={() => setStep(3)} disabled={!name || !age || !weight || !height}>{tx.next}</button>
            <button style={btnSecondary} onClick={() => setStep(1)}>{tx.back}</button>
          </div>
        )}

        {/* ── STEP 3: Restricciones ── */}
        {step === 3 && (
          <div>
            <p style={{ fontSize: '13px', color: textSub, marginBottom: '16px' }}>{tx.restrictions}</p>
            {tx.restrictionsList.map(r => (
              <div key={r.id} style={checkRow} onClick={() => toggleRestriction(r.id)}>
                <div style={checkbox(restrictions.includes(r.id))}>{restrictions.includes(r.id) ? '✓' : ''}</div>
                <span style={{ fontSize: '14px', color: textMain }}>{r.label}</span>
              </div>
            ))}
            <button style={btnPrimary(false)} onClick={() => setStep(4)}>{tx.next}</button>
            <button style={btnSecondary} onClick={() => setStep(2)}>{tx.back}</button>
          </div>
        )}

        {/* ── STEP 4: Objetivo ── */}
        {step === 4 && (
          <div>
            <p style={{ fontSize: '13px', color: textSub, marginBottom: '16px' }}>{tx.objective}</p>
            {tx.objectives.map(o => (
              <div key={o.id} style={optionCard(objective === o.id)} onClick={() => setObjective(o.id)}>
                <span style={{ fontSize: '1.75rem' }}>{o.emoji}</span>
                <span style={{ fontSize: '15px', fontWeight: 500, color: objective === o.id ? purple : textMain }}>{o.label}</span>
                {objective === o.id && <span style={{ marginLeft: 'auto', color: purple, fontSize: '1rem' }}>✓</span>}
              </div>
            ))}
            <button style={btnPrimary(!objective)} onClick={() => setStep(5)} disabled={!objective}>{tx.next}</button>
            <button style={btnSecondary} onClick={() => setStep(3)}>{tx.back}</button>
          </div>
        )}

        {/* ── STEP 5: Región ── */}
        {step === 5 && (
          <div>
            <p style={{ fontSize: '13px', color: textSub, marginBottom: '16px' }}>{tx.region}</p>
            {tx.regions.map(r => (
              <div key={r.id} style={optionCard(region === r.id)} onClick={() => setRegion(r.id)}>
                <span style={{ fontSize: '1.75rem' }}>{r.emoji}</span>
                <span style={{ fontSize: '15px', fontWeight: 500, color: region === r.id ? purple : textMain }}>{r.label}</span>
                {region === r.id && <span style={{ marginLeft: 'auto', color: purple, fontSize: '1rem' }}>✓</span>}
              </div>
            ))}
            <button style={btnPrimary(loading || !region)} onClick={handleFinish} disabled={loading || !region}>
              {loading ? tx.loading : tx.finish}
            </button>
            <button style={btnSecondary} onClick={() => setStep(4)}>{tx.back}</button>
          </div>
        )}

      </div>
    </div>
  )
}