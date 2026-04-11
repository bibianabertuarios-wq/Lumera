import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export async function POST(req) {
  try {
    const { email, name, lang } = await req.json();
    await supabase.from('guia_leads').insert([{ email, name, lang, created_at: new Date().toISOString() }]);
    return Response.json({ ok: true });
  } catch(e) {
    return Response.json({ ok: false });
  }
}
