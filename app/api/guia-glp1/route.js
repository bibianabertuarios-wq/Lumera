export async function POST(req) {
  try {
    const { email, name, lang } = await req.json();
    
    const { createClient } = await import('@supabase/supabase-js');
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY
    );
    
    await supabase.from('guia_leads').insert([{ 
      email, name, lang, 
      created_at: new Date().toISOString() 
    }]);
    
    return Response.json({ ok: true });
  } catch(e) {
    console.error(e);
    return Response.json({ ok: false });
  }
}
