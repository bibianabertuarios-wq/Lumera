import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

function semanaISO(fecha = new Date()) {
  const d = new Date(Date.UTC(fecha.getFullYear(), fecha.getMonth(), fecha.getDate()));
  const dayNum = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  const weekNo = Math.ceil((((d - yearStart) / 86400000) + 1) / 7);
  return `${d.getUTCFullYear()}-W${String(weekNo).padStart(2, '0')}`;
}

export async function POST(req) {
  try {
    const datos = await req.json();
    const { userId, idioma, presupuesto } = datos;

    if (!userId || !idioma) {
      return Response.json(
        { error: 'Faltan datos obligatorios: userId e idioma' },
        { status: 400 }
      );
    }

    const semana = semanaISO();

    const { data: existente, error: errorLectura } = await supabase
      .from('menu_semanal_cache')
      .select('menu, presupuesto, created_at')
      .eq('user_id', userId)
      .eq('semana_iso', semana)
      .eq('locale', idioma)
      .maybeSingle();

    if (errorLectura) {
      console.error('Error leyendo cache menu_semanal:', errorLectura.message);
    }

    if (existente) {
      return Response.json({
        ok: true,
        origen: 'cache',
        semana,
        menu: existente.menu,
      });
    }

    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://getlumera.app';
    const respGeneracion = await fetch(`${baseUrl}/api/menu-semanal`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...datos, idioma }),
    });

    const resultado = await respGeneracion.json();

    if (!resultado.ok) {
      return Response.json(resultado, { status: respGeneracion.status });
    }

    const { error: errorGuardado } = await supabase
      .from('menu_semanal_cache')
      .upsert({
        user_id: userId,
        semana_iso: semana,
        locale: idioma,
        presupuesto: presupuesto || null,
        menu: resultado.menu,
      }, { onConflict: 'user_id,semana_iso,locale' });

    if (errorGuardado) {
      console.error('Error guardando cache menu_semanal:', errorGuardado.message);
    }

    return Response.json({
      ok: true,
      origen: 'generado',
      semana,
      menu: resultado.menu,
    });
  } catch (err) {
    console.error('Menu de la semana API error:', err.message);
    return Response.json({ error: err.message }, { status: 500 });
  }
}
