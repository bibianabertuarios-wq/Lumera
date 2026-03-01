'use client'
import { useState, useEffect } from 'react'
import { supabase } from './lib/supabase'
import OnboardingFlow from './components/Auth/OnboardingFlow'
import SignOutButton from './components/Auth/SignOutButton'

export default function Home() {
  const [session, setSession] = useState(null)
  const [loading, setLoading] = useState(true)
  const [onboardingDone, setOnboardingDone] = useState(false)

  useEffect(() => {
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      setSession(session)
      if (session) {
        const { data } = await supabase
          .from('profiles')
          .select('onboarding_complete')
          .eq('id', session.user.id)
          .single()
        setOnboardingDone(data?.onboarding_complete || false)
      }
      setLoading(false)
    })
    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
      if (!session) setOnboardingDone(false)
    })
  }, [])

  if (loading) return (
    <div style={{
      minHeight: '100vh', background: '#0D0B12',
      display: 'flex', alignItems: 'center',
      justifyContent: 'center', color: '#9B8BB4', fontSize: '32px'
    }}>🌙</div>
  )

  if (!session || !onboardingDone) return (
    <OnboardingFlow onComplete={() => setOnboardingDone(true)} />
  )

  return (
    <div style={{
      minHeight: '100vh', background: '#0D0B12',
      color: '#F0EBF8', display: 'flex',
      alignItems: 'center', justifyContent: 'center',
      fontFamily: 'Georgia, serif', fontSize: '24px'
    }}>
      🌙 Bienvenida, {session.user.email}
      <SignOutButton />
    </div>
  )
}
