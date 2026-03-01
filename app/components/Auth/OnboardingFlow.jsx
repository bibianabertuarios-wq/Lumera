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

const styles = {
  wrapper: {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #0D0B12 0%, #1C1828 100%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontFamily: 'system-ui, sans-serif',
    padding: '20px',
  },
  card: {
    background: 'rgba(255,255,255,0.04)',
    border: '1px solid rgba(155,139,180,0.2)',
    borderRadius: '24px',
    padding: '40px 36px',
    width: '100%',
    maxWidth: '440px',
  },
  logo: { textAlign: 'center', marginBottom: '28px' },
  logoMoon: { fontSize: '36px', marginBottom: '6px' },
  logoTitle: {
    fontFamily: 'Georgia, serif',
    fontSize: '24px',
    color: '#F0EBF8',
    fontWeight: '400',
    margin: '0 0 4px',
  },
  stepLabel: { color: '#7A7390', fontSize: '13px', margin: 0 },
  progress: {
    display: 'flex',
    gap: '6px',
    marginBottom: '28px',
  },
  progressDot: (active, done) => ({
    flex: 1,
    height: '3px',
    borderRadius: '2px',
    background: done ? '#9B8BB4' : active ? '#C9A84C' : 'rgba(255,255,255,0.1)',
    transition: 'background 0.3s',
  }),
  label: {
    display: 'block',
    color: '#9B8BB4',
    fontSize: '12px',
    letterSpacing: '0.08em',
    textTransform: 'uppercase',
    marginBottom: '8px',
  },
  input: {
    width: '100%',
    background: 'rgba(255,255,255,0.06)',
    border: '1px solid rgba(155,139,180,0.25)',
    borderRadius: '12px',
    padding: '13px 16px',
    color: '#F0EBF8',
    fontSize: '15px',
    outline: 'none',
    boxSizing: 'border-box',
    marginBottom: '16px',
  },
  row: { display: 'flex', gap: '12px' },
  btnPrimary: (disabled) => ({
    width: '100%',
    background: disabled ? 'rgba(155,139,180,0.3)' : 'linear-gradient(135deg, #9B8BB4, #C9A84C)',
    border: 'none',
    borderRadius: '12px',
    padding: '14px',
    color: disabled ? '#7A7390' : '#0D0B12',
    fontSize: '15px',
    fontWeight: '600',
    cursor: disabled ? 'not-allowed' : 'pointer',
    marginTop: '8px',
  }),
  btnSecondary: {
    background: 'transparent',
    border: '1px solid rgba(155,139,180,0.25)',
    borderRadius: '12px',
    padding: '14px',
    color: '#7A7390',
    fontSize: '14px',
    cursor: 'pointer',
    marginTop: '8px',
    width: '100%',
  },
  optionCard: (selected) => ({
    display: 'flex',
    alignItems: 'center',
    gap: '14px',
    padding: '14px 16px',
    background: selected ? 'rgba(155,139,180,0.15)' : 'rgba(255,255,255,0.04)',
    border: `1.5px solid ${selected ? '#9B8BB4' : 'rgba(155,139,180,0.15)'}`,
    borderRadius: '14px',
    cursor: 'pointer',
    marginBottom: '10px',
    transition: 'all 0.2s',
  }),
  optionEmoji: { fontSize: '24px' },
  optionLabel: { color: '#F0EBF8', fontSize: '15px', fontWeight: '500' },
  checkRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    padding: '10px 14px',
    background: 'rgba(255,255,255,0.03)',
    border: '1px solid rgba(155,139,180,0.12)',
    borderRadius: '10px',
    cursor: 'pointer',
    marginBottom: '8px',
  },
  checkbox: (checked) => ({
    width: '18px',
    height: '18px',
    borderRadius: '5px',
    border: `2px solid ${checked ? '#9B8BB4' : 'rgba(155,139,180,0.3)'}`,
    background: checked ? '#9B8BB4' : 'transparent',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    fontSize: '11px',
    color: 'white',
  }),
  checkLabel: { color: '#D0C8E0', fontSize: '14px' },
  error: { color: '#C4786A', fontSize: '13px', marginBottom: '12px', textAlign: 'center' },
  disclaimer: {
    background: 'rgba(201,168,76,0.08)',
    border: '1px solid rgba(201,168,76,0.2)',
    borderRadius: '10px',
    padding: '12px 14px',
    color: '#C9A84C',
    fontSize: '12px',
    lineHeight: '1.6',
    marginBottom: '20px',
  },
  langToggle: {
    display: 'flex',
    justifyContent: 'flex-end',
    marginBottom: '16px',
    gap: '8px',
  },
  langBtn: (active) => ({
    background: active ? 'rgba(155,139,180,0.2)' : 'transparent',
    border: `1px solid ${active ? '#9B8BB4' : 'rgba(155,139,180,0.2)'}`,
    borderRadius: '8px',
    padding: '4px 10px',
    color: active ? '#9B8BB4' : '#7A7390',
    fontSize: '12px',
    cursor: 'pointer',
  }),
  legalLink: { color: '#9B8BB4', textDecoration: 'underline', cursor: 'pointer' },
}

export default function OnboardingFlow({ onComplete }) {
  const [lang, setLang] = useState('es')
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  // Step 1 - Auth
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [legalPrivacy, setLegalPrivacy] = useState(false)
  const [legal18, setLegal18] = useState(false)
  const [legalMedical, setLegalMedical] = useState(false)

  // Step 2 - Personal
  const [name, setName] = useState('')
  const [age, setAge] = useState('')
  const [weight, setWeight] = useState('')
  const [height, setHeight] = useState('')

  // Step 3 - Restrictions
  const [restrictions, setRestrictions] = useState([])

  // Step 4 - Objective
  const [objective, setObjective] = useState('')

  // Step 5 - Region
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
      // Try login if already exists
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

  return (
    <div style={styles.wrapper}>
      <div style={styles.card}>

        {/* Lang toggle */}
        <div style={styles.langToggle}>
          <button style={styles.langBtn(lang === 'es')} onClick={() => setLang('es')}>ES</button>
          <button style={styles.langBtn(lang === 'en')} onClick={() => setLang('en')}>EN</button>
        </div>

        {/* Logo */}
        <div style={styles.logo}>
          <div style={styles.logoMoon}>🌙</div>
          <h1 style={styles.logoTitle}>Lumera</h1>
          <p style={styles.stepLabel}>{tx[`step${step}`]}</p>
        </div>

        {/* Progress */}
        <div style={styles.progress}>
          {[1,2,3,4,5].map(i => (
            <div key={i} style={styles.progressDot(i === step, i < step)} />
          ))}
        </div>

        {error && <p style={styles.error}>{error}</p>}

        {/* ── STEP 1: Auth + Legal ── */}
        {step === 1 && (
          <div>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              style={styles.input}
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              style={styles.input}
            />

            <div style={styles.disclaimer}>{tx.disclaimer}</div>

            {/* Legal checkboxes */}
            <div style={styles.checkRow} onClick={() => setLegalPrivacy(!legalPrivacy)}>
              <div style={styles.checkbox(legalPrivacy)}>{legalPrivacy ? '✓' : ''}</div>
              <span style={styles.checkLabel}>
                {tx.legal1} <a href={lang === 'es' ? '/privacidad' : '/privacy'} target="_blank" style={styles.legalLink}>{tx.legal2}</a> {tx.legal3} <a href={lang === 'es' ? '/terminos' : '/terms'} target="_blank" style={styles.legalLink}>{tx.legal4}</a>
              </span>
            </div>

            <div style={styles.checkRow} onClick={() => setLegal18(!legal18)}>
              <div style={styles.checkbox(legal18)}>{legal18 ? '✓' : ''}</div>
              <span style={styles.checkLabel}>{tx.legal5}</span>
            </div>

            <div style={styles.checkRow} onClick={() => setLegalMedical(!legalMedical)}>
              <div style={styles.checkbox(legalMedical)}>{legalMedical ? '✓' : ''}</div>
              <span style={styles.checkLabel}>{tx.legal6}</span>
            </div>

            <button
              style={styles.btnPrimary(loading || !email || !password)}
              onClick={handleStep1}
              disabled={loading || !email || !password}
            >
              {loading ? tx.loading : tx.next}
            </button>
          </div>
        )}

        {/* ── STEP 2: Personal data ── */}
        {step === 2 && (
          <div>
            <label style={styles.label}>{tx.name}</label>
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              style={styles.input}
            />
            <label style={styles.label}>{tx.age}</label>
            <input
              type="number"
              value={age}
              onChange={e => setAge(e.target.value)}
              style={styles.input}
              min="18" max="99"
            />
            <div style={styles.row}>
              <div style={{ flex: 1 }}>
                <label style={styles.label}>{tx.weight}</label>
                <input type="number" value={weight} onChange={e => setWeight(e.target.value)} style={styles.input} />
              </div>
              <div style={{ flex: 1 }}>
                <label style={styles.label}>{tx.height}</label>
                <input type="number" value={height} onChange={e => setHeight(e.target.value)} style={styles.input} />
              </div>
            </div>
            <button
              style={styles.btnPrimary(!name || !age || !weight || !height)}
              onClick={() => setStep(3)}
              disabled={!name || !age || !weight || !height}
            >{tx.next}</button>
            <button style={styles.btnSecondary} onClick={() => setStep(1)}>{tx.back}</button>
          </div>
        )}

        {/* ── STEP 3: Restrictions ── */}
        {step === 3 && (
          <div>
            <p style={{ color: '#7A7390', fontSize: '13px', marginBottom: '16px' }}>{tx.restrictions}</p>
            {tx.restrictionsList.map(r => (
              <div key={r.id} style={styles.checkRow} onClick={() => toggleRestriction(r.id)}>
                <div style={styles.checkbox(restrictions.includes(r.id))}>
                  {restrictions.includes(r.id) ? '✓' : ''}
                </div>
                <span style={styles.checkLabel}>{r.label}</span>
              </div>
            ))}
            <button style={styles.btnPrimary(false)} onClick={() => setStep(4)}>{tx.next}</button>
            <button style={styles.btnSecondary} onClick={() => setStep(2)}>{tx.back}</button>
          </div>
        )}

        {/* ── STEP 4: Objective ── */}
        {step === 4 && (
          <div>
            <p style={{ color: '#7A7390', fontSize: '13px', marginBottom: '16px' }}>{tx.objective}</p>
            {tx.objectives.map(o => (
              <div key={o.id} style={styles.optionCard(objective === o.id)} onClick={() => setObjective(o.id)}>
                <span style={styles.optionEmoji}>{o.emoji}</span>
                <span style={styles.optionLabel}>{o.label}</span>
              </div>
            ))}
            <button style={styles.btnPrimary(!objective)} onClick={() => setStep(5)} disabled={!objective}>{tx.next}</button>
            <button style={styles.btnSecondary} onClick={() => setStep(3)}>{tx.back}</button>
          </div>
        )}

        {/* ── STEP 5: Region ── */}
        {step === 5 && (
          <div>
            <p style={{ color: '#7A7390', fontSize: '13px', marginBottom: '16px' }}>{tx.region}</p>
            {tx.regions.map(r => (
              <div key={r.id} style={styles.optionCard(region === r.id)} onClick={() => setRegion(r.id)}>
                <span style={styles.optionEmoji}>{r.emoji}</span>
                <span style={styles.optionLabel}>{r.label}</span>
              </div>
            ))}
            <button
              style={styles.btnPrimary(loading || !region)}
              onClick={handleFinish}
              disabled={loading || !region}
            >{loading ? tx.loading : tx.finish}</button>
            <button style={styles.btnSecondary} onClick={() => setStep(4)}>{tx.back}</button>
          </div>
        )}

      </div>
    </div>
  )
}
