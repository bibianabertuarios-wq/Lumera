import { createClient } from '@supabase/supabase-js';
import Anthropic from '@anthropic-ai/sdk';

// La generación completa de 7 días puede tardar ~45-50s (a veces más); antes esto se
// repartía entre dos funciones serverless (esta + /api/menu-semanal) que competían
// por el mismo límite de tiempo, lo que provocaba el error intermitente. Ahora se
// genera en una sola llamada, directa a Claude, sin salto de red intermedio.
export const maxDuration = 90;

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const PRESUPUESTO = {
  hormiga:    'Modo hormiga: ingredientes básicos y económicos, aprovechar sobras, nada caro ni de difícil acceso.',
  equilibrio: 'Modo equilibrio: coste medio, algún ingrediente algo más especial pero sin excesos.',
  capricho:   'Modo capricho: sin límite de coste, puede incluir ingredientes premium o menos habituales.',
};

const OBJETIVO_FOCO = {
  'Perder peso':               'déficit calórico suave respecto al TDEE, alta saciedad (proteína + fibra + volumen), baja carga glucémica.',
  'Ganar energía y vitalidad': 'estabilidad de glucosa durante el día, hierro y B12, sin picos que provoquen bajones.',
  'Equilibrio hormonal':       'grasas saludables, fibra para el eje estrógeno-microbiota, crucíferas, omega-3.',
  'Ganar fuerza y masa muscular': 'proteína suficiente repartida en las comidas (~1.6 g/kg), en torno al mantenimiento calórico.',
  'Dormir mejor':              'cena ligera y temprana, triptófano + magnesio por la noche, evitar cafeína tarde.',
};

function construirSystem() {
  return `Eres LUMI, la asesora nutricional de Lumera.

REGLAS INNEGOCIABLES:
1. Base científica REAL. Nada inventado. Si algo no tiene respaldo, no lo afirmes.
2. Ajusta las calorías del día al TDEE dado, repartidas en las comidas — no lo recalcules.
3. Productos LOCALES y asequibles según región y presupuesto. Nada de ingredientes exóticos en Modo hormiga.
4. El menú puede REUTILIZAR la misma base de plato hasta 3 días (la gente cocina para varios días). No 7 recetas totalmente distintas.
5. Respeta las restricciones y condiciones SIEMPRE, por encima de cualquier otra preferencia.
6. Nunca lenguaje médico ni diagnóstico. Nunca "cura", "trata", "controla". Tono cercano, correcto, que se entienda.
7. Prohibido usar las palabras "menopausia", "perimenopausia" o "IA" en el texto visible.
8. El síntoma del día NO cambia el menú entero — solo aporta un tip corto.

LÍMITES DE LONGITUD ESTRICTOS (muy importante, para que la respuesta quepa entera):
- "resumen": máximo 20 palabras
- "tipDelDia": máximo 15 palabras
- "porQueHorario": máximo 12 palabras
- "paraQue": máximo 15 palabras
- "tipCocina": máximo 10 palabras
- "sinTiempo": máximo 15 palabras
- "pasos": máximo 4 pasos, cada uno máximo 8 palabras
- "ingredientes": solo "cantidad + nombre", sin frases largas
No escribas frases completas con conectores largos. Ve directa al grano, estilo nota, no párrafo.

Devuelve SOLO un objeto JSON válido, sin texto antes ni después, sin markdown, con esta forma exacta:
{
  "resumen": "frase corta",
  "tipDelDia": "tip corto",
  "listaCompra": ["ingrediente 1", "ingrediente 2", "..."],
  "dias": [
    {
      "dia": "Lunes",
      "comidas": [
        {
          "tipo": "desayuno|almuerzo|snack|cena",
          "nombre": "nombre del plato",
          "horario": "hora sugerida (ej. 8:00)",
          "porQueHorario": "frase muy corta",
          "kcal": 0,
          "proteina_g": 0, "carbos_g": 0, "grasas_g": 0,
          "ingredientes": ["cantidad + ingrediente"],
          "pasos": ["paso corto", "paso corto"],
          "paraQue": "frase muy corta",
          "tipCocina": "truco muy corto",
          "sinTiempo": "versión rápida, muy corta"
        }
      ]
    }
  ]
}

Genera 7 días completos. Recuerda: puedes repetir base de plato hasta 3 días. PRIORIDAD: que quepan los 7 días enteros respetando los límites de longitud, antes que hacerlos más largos.`;
}

function construirMensajeUsuario(datos) {
  const {
    nombre, objetivo, region, restricciones, condiciones,
    sintomaHoy, presupuesto, tdee, idioma,
  } = datos;

  const foco = OBJETIVO_FOCO[objetivo] || 'alimentación equilibrada y sostenible.';
  const presu = PRESUPUESTO[presupuesto] || PRESUPUESTO.equilibrio;
  const lang = idioma === 'en' ? 'inglés' : 'español';

  return `Diseña el menú semanal de ${nombre}.

DATOS DE ${nombre.toUpperCase()}:
- Objetivo: ${objetivo} → foco nutricional: ${foco}
- Calorías objetivo/día (TDEE ya calculado, NO lo recalcules): ${tdee} kcal
- Región (usa SOLO productos locales y de temporada de esta zona): ${region}
- Presupuesto: ${presu}
- Restricciones dietéticas (respétalas siempre): ${restricciones || 'ninguna'}
- Condiciones de salud a tener en cuenta: ${condiciones || 'ninguna'}
- Cómo se siente hoy: ${sintomaHoy || 'sin dato'}

Escribe TODO en ${lang}. Recuerda: textos MUY cortos en cada campo.`;
}

function semanaISO(fecha = new Date()) {
  const d = new Date(Date.UTC(fecha.getFullYear(), fecha.getMonth(), fecha.getDate()));
  const dayNum = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  const weekNo = Math.ceil((((d - yearStart) / 86400000) + 1) / 7);
  return `${d.getUTCFullYear()}-W${String(weekNo).padStart(2, '0')}`;
}

async function generarMenu(datos) {
  if (!datos.objetivo || !datos.tdee) {
    return { error: 'Faltan datos obligatorios: objetivo y tdee', status: 400 };
  }

  const system = construirSystem();
  const mensajeUsuario = construirMensajeUsuario(datos);

  const response = await anthropic.messages.create({
    model: 'claude-haiku-4-5-20251001',
    max_tokens: 16000,
    system,
    messages: [{ role: 'user', content: mensajeUsuario }],
  });

  if (response.stop_reason === 'max_tokens') {
    return {
      error: 'La respuesta se cortó por límite de tokens (max_tokens). Sube max_tokens o recorta más el prompt.',
      stop_reason: response.stop_reason,
      status: 502,
    };
  }

  let raw = response.content?.[0]?.text || '';
  raw = raw.replace(/```json|```/g, '').trim();

  let menu;
  try {
    menu = JSON.parse(raw);
  } catch (e) {
    return { error: 'El modelo no devolvió JSON válido', raw, status: 502 };
  }

  return { menu };
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

    const resultado = await generarMenu({ ...datos, idioma });

    if (resultado.error) {
      console.error('Menu de la semana - error de generación:', resultado.error);
      return Response.json(resultado, { status: resultado.status || 502 });
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
