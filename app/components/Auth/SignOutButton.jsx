'use client'
import { supabase } from '../../lib/supabase'

export default function SignOutButton() {
  return (
    <button
      onClick={() => supabase.auth.signOut()}
      style={{
        position: 'fixed', bottom: '20px', right: '20px',
        background: 'rgba(155,139,180,0.2)',
        border: '1px solid rgba(155,139,180,0.3)',
        borderRadius: '10px',
        padding: '8px 16px',
        color: '#9B8BB4',
        fontSize: '13px',
        cursor: 'pointer'
      }}
    >
      Cerrar sesión
    </button>
  )
}
