'use client'
import { useState, useEffect } from 'react'
import { supabase } from './lib/supabase'
import AuthForm from './components/Auth/AuthForm'

export default function Home() {
  const [session, setSession] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setLoading(false)
    })
    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })
  }, [])

  if (loading) return (
    <div style={{
      minHeight: '100vh',
      background: '#0D0B12',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: '#9B8BB4',
      fontSize: '24px'
    }}>🌙</div>
  )

  if (!session) return <AuthForm onLogin={setSession} />

  return (
    <div style={{
      minHeight: '100vh',
      background: '#0D0B12',
      color: '#F0EBF8',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: 'Georgia, serif',
      fontSize: '24px'
    }}>
      🌙 Bienvenida, {session.user.email}
    </div>
  )
}
