// app/api/menu-semanal/route.js
// ─────────────────────────────────────────────────────────────
// FUNCIÓN AISLADA — genera un menú semanal personalizado con LUMI.
// No toca renderNutrition ni la tabla `menus` actual.
// ─────────────────────────────────────────────────────────────

import Anthropic from '@anthropic-ai/sdk';

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

Devuelve SOLO un objeto JSON válido, sin texto antes ni después, sin markdown, con esta forma exacta:
{
  "resumen": "1 frase cálida de LUMI sobre el enfoque de la semana",
  "tipDelDia": "1 tip corto ligado a cómo se siente hoy",
  "listaCompra": ["ingrediente 1", "ingrediente 2", "..."],
  "dias": [
    {
      "dia": "Lunes",
      "comidas": [
        {
          "tipo": "desayuno|almuerzo|snack|cena",
          "nombre": "nombre del plato",
          "horario": "hora sugerida (ej. 8:00)",
          "porQueHorario": "1 frase: por qué a esa hora (ritmo circadiano, insulina, cortisol...)",
          "kcal": 0,
          "proteina_g": 0, "carbos_g": 0, "grasas_g": 0,
          "ingredientes": ["ingrediente con cantidad casera (ej. 1 taza de arroz)"],
          "pasos": ["paso 1", "paso 2"],
          "paraQue": "1 frase: por qué te conviene, con base científica",
          "tipCocina": "1 truco de cocina corto",
          "sinTiempo": "versión rápida del plato para días de prisa"
        }
      ]
    }
  ]
}

Genera 7 días. Recuerda: puedes repetir base de plato hasta 3 días para que sea realista y económico.`;
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

Escribe TODO en ${lang}.`;
}

export async function POST(req) {
  try {
    const datos = await req.json();

    if (!datos.objetivo || !datos.tdee) {
      return Response.json(
        { error: 'Faltan datos obligatorios: objetivo y tdee' },
        { status: 400 }
      );
    }

    const system = construirSystem();
    const mensajeUsuario = construirMensajeUsuario(datos);

    const response = await anthropic.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 8000,
      system,
      messages: [{ role: 'user', content: mensajeUsuario }],
    });

    let raw = response.content?.[0]?.text || '';
    raw = raw.replace(/```json|```/g, '').trim();

    let menu;
    try {
      menu = JSON.parse(raw);
    } catch (e) {
      return Response.json(
        { error: 'El modelo no devolvió JSON válido', raw },
        { status: 502 }
      );
    }

    return Response.json({ ok: true, menu });
  } catch (err) {
    console.error('Menu semanal API error:', err.message);
    return Response.json({ error: err.message }, { status: 500 });
  }
}
