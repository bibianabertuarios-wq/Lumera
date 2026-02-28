'use client'
import { useState } from 'react'
import { supabase } from '../../lib/supabase'

export default function AuthForm({ onLogin }) {
  const [mode, setMode] = useState('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')

  async function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)
    setError('')
    setMessage('')

    if (mode === 'login') {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) setError(error.message)
      else onLogin(data.session)
    } else if (mode === 'register') {
      const { error } = await supabase.auth.signUp({ email, password })
      if (error) setError(error.message)
      else setMessage('Revisa tu email para confirmar tu cuenta 🌙')
    } else if (mode === 'reset') {
      const { error } = await supabase.auth.resetPasswordForEmail(email)
      if (error) setError(error.message)
      else setMessage('Te hemos enviado un email para resetear tu contraseña 🌙')
    }
    setLoading(false)
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0D0B12 0%, #1C1828 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: 'system-ui, sans-serif'
    }}>
      <div style={{
        background: 'rgba(255,255,255,0.05)',
        border: '1px solid rgba(155,139,180,0.2)',
        borderRadius: '24px',
        padding: '48px 40px',
        width: '100%',
        maxWidth: '420px',
        margin: '20px'
      }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{ fontSize: '48px', marginBottom: '8px' }}>🌙</div>
          <h1 style={{
            fontFamily: 'Georgia, serif',
            fontSize: '28px',
            color: '#F0EBF8',
            fontWeight: '400',
            margin: '0 0 4px'
          }}>Lumera</h1>
          <p style={{ color: '#7A7390', fontSize: '14px', margin: 0 }}>
            {mode === 'login' ? 'Bienvenida de vuelta' : 
             mode === 'register' ? 'Empieza tu journey' : 
             'Resetea tu contraseña'}
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '16px' }}>
            <input
              type="email"
              placeholder="tu@email.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              style={{
                width: '100%',
                background: 'rgba(255,255,255,0.07)',
                border: '1px solid rgba(155,139,180,0.3)',
                borderRadius: '12px',
                padding: '14px 16px',
                color: '#F0EBF8',
                fontSize: '15px',
                outline: 'none',
                boxSizing: 'border-box'
              }}
            />
          </div>

          {mode !== 'reset' && (
            <div style={{ marginBottom: '24px' }}>
              <input
                type="password"
                placeholder="Contraseña"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                style={{
                  width: '100%',
                  background: 'rgba(255,255,255,0.07)',
                  border: '1px solid rgba(155,139,180,0.3)',
                  borderRadius: '12px',
                  padding: '14px 16px',
                  color: '#F0EBF8',
                  fontSize: '15px',
                  outline: 'none',
                  boxSizing: 'border-box'
                }}
              />
            </div>
          )}

          {error && (
            <p style={{ color: '#C4786A', fontSize: '13px', marginBottom: '16px', textAlign: 'center' }}>
              {error}
            </p>
          )}

          {message && (
            <p style={{ color: '#7A9E7E', fontSize: '13px', marginBottom: '16px', textAlign: 'center' }}>
              {message}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              background: 'linear-gradient(135deg, #9B8BB4, #C9A84C)',
              border: 'none',
              borderRadius: '12px',
              padding: '14px',
              color: '#0D0B12',
              fontSize: '15px',
              fontWeight: '600',
              cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.7 : 1,
              marginBottom: '20px'
            }}
          >
            {loading ? 'Cargando...' : 
             mode === 'login' ? 'Entrar' : 
             mode === 'register' ? 'Crear cuenta' : 
             'Enviar email'}
          </button>
        </form>

        <div style={{ textAlign: 'center', fontSize: '13px', color: '#7A7390' }}>
          {mode === 'login' && (
            <>
              <span
                onClick={() => setMode('register')}
                style={{ color: '#9B8BB4', cursor: 'pointer' }}
              >¿No tienes cuenta? Regístrate</span>
              <br /><br />
              <span
                onClick={() => setMode('reset')}
                style={{ color: '#7A7390', cursor: 'pointer' }}
              >¿Olvidaste tu contraseña?</span>
            </>
          )}
          {mode === 'register' && (
            <span onClick={() => setMode('login')} style={{ color: '#9B8BB4', cursor: 'pointer' }}>
              ¿Ya tienes cuenta? Entra
            </span>
          )}
          {mode === 'reset' && (
            <span onClick={() => setMode('login')} style={{ color: '#9B8BB4', cursor: 'pointer' }}>
              ← Volver al login
            </span>
          )}
        </div>
      </div>
    </div>
  )
}
