import { createClient } from '@supabase/supabase-js'

// Cliente único de Supabase para toda la app cliente (browser).
// IMPORTANTE: no crear más instancias de createClient() en páginas o componentes —
// cada instancia adicional trae su propio GoTrueClient y comparten la misma clave de
// localStorage, lo que Supabase advierte que "puede producir comportamiento indefinido"
// (sesiones que no se leen bien justo después de login/navegación, etc.).
// Importa siempre este `supabase` en vez de llamar a createClient() de nuevo.
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://pyekwpmbdnmglrjieexc.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB5ZWt3cG1iZG5tZ2xyamllZXhjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjU0ODM0OTgsImV4cCI6MjA4MTA1OTQ5OH0.zQl7GF3E6BhDqW3bEMixAbdDcOsW8BsFOBeAGa-5bzY'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
