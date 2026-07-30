// Tu camino — marco continuo, no un roadmap que se "acaba".
// Semana 0: Entender tu cuerpo (primera semana, sea trial o ya premium).
// Semana 1 en adelante: Evolucionar contigo — cada semana natural rota por un foco
// temático distinto (nutrición / movimiento / constancia) y vuelve a empezar el ciclo.
// Nunca hay un final: siempre hay "la semana que viene". Desde HITO_SEMANAS aparece
// además un reconocimiento de constancia (no bloquea ni sustituye la semana en curso).

export const DIAS_AUTO_COMPLETA = 4;
export const HITO_SEMANAS = 8;

const TEMAS_CICLO = (is_es) => is_es ? [
  {
    titulo: 'Ajusta tu alimentación',
    tareas: [
      { key: 'probar_menu', label: 'Revisa tu menú semanal', link: '/lumera?tab=nutrition' },
      { key: 'lente_alquimica', label: 'Fotografía un plato con la Lente Alquímica', link: '/lumera?tab=nutrition' },
    ],
  },
  {
    titulo: 'Cuida tu movimiento',
    tareas: [
      { key: 'rutina_personalizada', label: 'Haz tu rutina personalizada', link: '/lumera?tab=exercise' },
      { key: 'reto_suelo_pelvico', label: 'Prueba el reto de suelo pélvico', link: '/lumera?tab=exercise' },
    ],
  },
  {
    titulo: 'Cuida tu constancia',
    tareas: [
      { key: 'revisar_recordatorios', label: 'Revisa tus recordatorios', link: null },
      { key: 'hablar_lumi', label: 'Cuéntale a LUMI cómo vas', link: '/lumera?tab=chat' },
    ],
  },
] : [
  {
    titulo: 'Adjust your eating',
    tareas: [
      { key: 'probar_menu', label: 'Check your weekly menu', link: '/lumera?tab=nutrition' },
      { key: 'lente_alquimica', label: 'Photograph a meal with the Alchemical Lens', link: '/lumera?tab=nutrition' },
    ],
  },
  {
    titulo: 'Take care of your movement',
    tareas: [
      { key: 'rutina_personalizada', label: 'Do your personalised routine', link: '/lumera?tab=exercise' },
      { key: 'reto_suelo_pelvico', label: 'Try the pelvic floor challenge', link: '/lumera?tab=exercise' },
    ],
  },
  {
    titulo: 'Take care of your consistency',
    tareas: [
      { key: 'revisar_recordatorios', label: 'Check your reminders', link: null },
      { key: 'hablar_lumi', label: 'Tell LUMI how it is going', link: '/lumera?tab=chat' },
    ],
  },
];

// Semanas continuas desde el alta — nunca se topa, sigue subiendo siempre.
export function getSemanaContigo(createdAt) {
  if (!createdAt) return 0;
  const dias = Math.floor((Date.now() - new Date(createdAt).getTime()) / 86400000);
  return Math.max(0, Math.floor(dias / 7));
}

// Contenido de la semana en curso: la primera semana es "entender tu cuerpo",
// a partir de ahí se rota indefinidamente por los temas del ciclo.
export function getFaseSemana(semana, is_es) {
  if (semana === 0) {
    return {
      fase: 'entender',
      titulo: is_es ? 'Entender tu cuerpo' : 'Understand your body',
      subtitulo: is_es
        ? 'Cada día me dices cómo estás y yo te devuelvo qué significa.'
        : 'Every day you tell me how you feel and I tell you what it means.',
      tareas: is_es ? [
        { key: 'registrar_sintomas', label: 'Registra tu síntoma cada día', link: '/lumera?tab=symptoms' },
        { key: 'hablar_lumi', label: 'Habla con LUMI al menos una vez', link: '/lumera?tab=chat' },
      ] : [
        { key: 'registrar_sintomas', label: 'Log your symptom every day', link: '/lumera?tab=symptoms' },
        { key: 'hablar_lumi', label: 'Talk to LUMI at least once', link: '/lumera?tab=chat' },
      ],
    };
  }
  const temas = TEMAS_CICLO(is_es);
  const tema = temas[(semana - 1) % temas.length];
  return {
    fase: 'evolucionar',
    titulo: is_es ? 'Evolucionar contigo' : 'Evolving with you',
    subtitulo: tema.titulo,
    tareas: tema.tareas,
  };
}

// Cuenta días distintos con actividad registrada (check-in o síntoma detallado)
// dentro de la semana natural en curso.
export function contarDiasEnSemanaActual({ semana, createdAt, checkinFechas, symptomFechas }) {
  if (!createdAt) return 0;
  const inicioPlan = new Date(createdAt);
  const inicioSemana = new Date(inicioPlan.getTime() + semana * 7 * 86400000);
  const finSemana = new Date(inicioSemana.getTime() + 7 * 86400000);
  const fechasUnicas = new Set();
  [...(checkinFechas || []), ...(symptomFechas || [])].forEach((f) => {
    if (!f) return;
    const d = new Date(f + 'T00:00:00');
    if (d >= inicioSemana && d < finSemana) fechasUnicas.add(f);
  });
  return fechasUnicas.size;
}
