// Lumera — Pelvic Floor Challenge 21 Days
// Bilingual: es / en
// Usage: import { pelvicFloorChallenge } from './pelvicFloorChallenge'

export const pelvicFloorChallenge = {
  id: "pelvic-floor-21",
  durationDays: 21,

  meta: {
    es: {
      title: "Challenge Suelo Pélvico",
      subtitle: "21 días para recuperar el control",
      heroVideo: "/videos/pelvic-floor-hero.mp4",
      thumbnail: "/images/challenges/pelvic-floor-thumb.jpg",
    },
    en: {
      title: "Pelvic Floor Challenge",
      subtitle: "21 days to regain control",
      heroVideo: "/videos/pelvic-floor-hero.mp4",
      thumbnail: "/images/challenges/pelvic-floor-thumb.jpg",
    },
  },

  // ─── INTRODUCTION ────────────────────────────────────────────────────────────
  introduction: {
    es: {
      heading: "¿Por qué este challenge ahora?",
      body: `Durante la perimenopausia, los niveles de estrógeno comienzan a descender. Lo que muchas mujeres no saben es que el estrógeno no solo regula el ciclo menstrual — también mantiene la elasticidad y el tono de los músculos del suelo pélvico.

Al reducirse el estrógeno, estos músculos pierden fuerza progresivamente. El resultado: escapes de orina al reír, toser o saltar, sensación de pesadez pélvica, menor sensibilidad durante las relaciones íntimas, y mayor riesgo de prolapso con el paso de los años.

La buena noticia: el suelo pélvico responde muy bien al entrenamiento. Con solo unos minutos al día puedes recuperar el control, mejorar tu calidad de vida y proteger tu salud pélvica a largo plazo.

Este challenge te acompaña paso a paso para convertir los ejercicios Kegel en un hábito que tu cuerpo notará en pocas semanas.`,
      benefits: [
        "Reduce la incontinencia urinaria de esfuerzo",
        "Mejora la sensibilidad y el placer íntimo",
        "Previene el prolapso de órganos pélvicos",
        "Alivia la sensación de pesadez pélvica",
        "Refuerza la postura y la estabilidad lumbar",
      ],
    },
    en: {
      heading: "Why this challenge, why now?",
      body: `During perimenopause, estrogen levels begin to decline. What many women don't realize is that estrogen doesn't only regulate the menstrual cycle — it also maintains the elasticity and tone of the pelvic floor muscles.

As estrogen decreases, these muscles gradually lose strength. The result: leaks when laughing, coughing, or jumping, a feeling of pelvic heaviness, reduced sensation during intimacy, and a higher risk of prolapse over time.

The good news: the pelvic floor responds very well to training. Just a few minutes a day can restore control, improve your quality of life, and protect your pelvic health long-term.

This challenge guides you step by step to turn Kegel exercises into a habit your body will feel within weeks.`,
      benefits: [
        "Reduces stress urinary incontinence",
        "Improves intimate sensation and pleasure",
        "Prevents pelvic organ prolapse",
        "Relieves pelvic heaviness",
        "Supports posture and lumbar stability",
      ],
    },
  },

  // ─── HOW TO KEGEL (accordion) ────────────────────────────────────────────────
  howTo: {
    es: {
      title: "¿Cómo hacer el ejercicio Kegel correctamente?",
      video: "/videos/kegel-basic.mp4",
      steps: [
        {
          step: 1,
          title: "Identifica los músculos correctos",
          body: "Son los mismos que usas para detener el flujo de orina. No tenses abdomen, glúteos ni muslos — solo el suelo pélvico.",
        },
        {
          step: 2,
          title: "Contrae",
          body: "Aprieta esos músculos durante 3-5 segundos. Siente cómo se elevan hacia dentro.",
        },
        {
          step: 3,
          title: "Relaja completamente",
          body: "Suelta durante 3-5 segundos. La fase de relajación es igual de importante que la contracción.",
        },
        {
          step: 4,
          title: "Repite",
          body: "10-15 repeticiones, 3 veces al día. Puedes hacerlo sentada, tumbada o de pie — nadie lo notará.",
        },
      ],
      warning: "Evita contener la respiración. Respira con normalidad durante todo el ejercicio.",
    },
    en: {
      title: "How to do Kegel exercises correctly?",
      video: "/videos/kegel-basic.mp4",
      steps: [
        {
          step: 1,
          title: "Find the right muscles",
          body: "These are the same ones you use to stop the flow of urine. Do not tense your abdomen, glutes, or thighs — only the pelvic floor.",
        },
        {
          step: 2,
          title: "Contract",
          body: "Squeeze those muscles for 3-5 seconds. Feel them lifting inward and upward.",
        },
        {
          step: 3,
          title: "Release completely",
          body: "Let go for 3-5 seconds. The relaxation phase is just as important as the contraction.",
        },
        {
          step: 4,
          title: "Repeat",
          body: "10-15 reps, 3 times a day. You can do this sitting, lying down, or standing — no one will notice.",
        },
      ],
      warning: "Avoid holding your breath. Breathe normally throughout the exercise.",
    },
  },

  // ─── 21 DAYS ─────────────────────────────────────────────────────────────────
  // Weeks: 1 = Activation | 2 = Resistance | 3 = Consolidation
  days: [

    // ── WEEK 1: ACTIVACIÓN / ACTIVATION ────────────────────────────────────────

    {
      day: 1,
      week: 1,
      video: "/videos/kegel-basic.mp4",
      es: {
        title: "Conoce tu suelo pélvico",
        instruction: "Hoy no entrenas — hoy te presentas. Tómate 5 minutos para identificar los músculos del suelo pélvico. Intenta contraerlos una sola vez, despacio, y observa qué sientes.",
        scienceFact: "El suelo pélvico es un grupo de músculos en forma de hamaca que soporta el útero, la vejiga y el recto. En la perimenopausia, el descenso de estrógeno reduce su elasticidad hasta en un 30%.",
        duration: "5 min",
        reps: null,
      },
      en: {
        title: "Meet your pelvic floor",
        instruction: "Today you don't train — today you connect. Take 5 minutes to locate your pelvic floor muscles. Try contracting them once, slowly, and notice what you feel.",
        scienceFact: "The pelvic floor is a hammock-shaped muscle group supporting the uterus, bladder, and rectum. During perimenopause, declining estrogen can reduce its elasticity by up to 30%.",
        duration: "5 min",
        reps: null,
      },
    },

    {
      day: 2,
      week: 1,
      video: "/videos/kegel-basic.mp4",
      es: {
        title: "Primera contracción",
        instruction: "Contrae el suelo pélvico durante 3 segundos y suelta durante 3 segundos. Haz 10 repeticiones. Puedes hacerlo tumbada boca arriba con las rodillas flexionadas.",
        scienceFact: "Estudios clínicos demuestran que 6-8 semanas de ejercicios Kegel reducen los episodios de incontinencia urinaria de esfuerzo en un 56-70% en mujeres perimenopáusicas.",
        duration: "5 min",
        reps: "10 reps × 1 serie",
      },
      en: {
        title: "First contraction",
        instruction: "Contract your pelvic floor for 3 seconds and release for 3 seconds. Do 10 repetitions. You can do this lying on your back with knees bent.",
        scienceFact: "Clinical studies show that 6-8 weeks of Kegel exercises reduce stress urinary incontinence episodes by 56-70% in perimenopausal women.",
        duration: "5 min",
        reps: "10 reps × 1 set",
      },
    },

    {
      day: 3,
      week: 1,
      video: "/videos/kegel-breath.mp4",
      es: {
        title: "Kegel + respiración",
        instruction: "Inhala profundo. Al exhalar, contrae el suelo pélvico durante 3 segundos. Al inhalar, suelta completamente. Repite 10 veces. La respiración y el suelo pélvico trabajan juntos.",
        scienceFact: "El diafragma y el suelo pélvico se mueven de forma coordinada. Al exhalar, el suelo pélvico sube naturalmente — aprovecha ese movimiento para potenciar la contracción.",
        duration: "5-7 min",
        reps: "10 reps × 1 serie",
      },
      en: {
        title: "Kegel + breathing",
        instruction: "Inhale deeply. As you exhale, contract the pelvic floor for 3 seconds. As you inhale, release completely. Repeat 10 times. Your breath and pelvic floor work together.",
        scienceFact: "The diaphragm and pelvic floor move in coordination. On the exhale, the pelvic floor naturally rises — use this movement to enhance your contraction.",
        duration: "5-7 min",
        reps: "10 reps × 1 set",
      },
    },

    {
      day: 4,
      week: 1,
      video: "/videos/kegel-seated.mp4",
      es: {
        title: "Kegel sentada",
        instruction: "Siéntate en una silla con los pies apoyados en el suelo. Contrae 3 segundos, suelta 3 segundos. 10 repeticiones. Esta posición es ideal para practicar en el trabajo o en casa.",
        scienceFact: "La posición sentada activa el suelo pélvico de forma diferente a la posición tumbada. Practicar en distintas posiciones mejora la funcionalidad muscular en la vida cotidiana.",
        duration: "5-7 min",
        reps: "10 reps × 2 series",
      },
      en: {
        title: "Kegel seated",
        instruction: "Sit in a chair with feet flat on the floor. Contract for 3 seconds, release for 3 seconds. 10 repetitions. This position is ideal to practice at work or at home.",
        scienceFact: "The seated position activates the pelvic floor differently than lying down. Practicing in different positions improves muscular function in daily life.",
        duration: "5-7 min",
        reps: "10 reps × 2 sets",
      },
    },

    {
      day: 5,
      week: 1,
      video: "/videos/kegel-standing.mp4",
      es: {
        title: "Kegel de pie",
        instruction: "De pie, pies separados al ancho de caderas. Contrae el suelo pélvico 3 segundos, suelta 3 segundos. 10 repeticiones. Esta posición trabaja contra la gravedad — más exigente y más funcional.",
        scienceFact: "La posición de pie somete al suelo pélvico a mayor presión gravitacional. Entrenarlo así simula las condiciones reales de la vida diaria: caminar, subir escaleras, estornudar.",
        duration: "7 min",
        reps: "10 reps × 2 series",
      },
      en: {
        title: "Kegel standing",
        instruction: "Stand with feet hip-width apart. Contract the pelvic floor for 3 seconds, release for 3 seconds. 10 repetitions. This position works against gravity — more demanding and more functional.",
        scienceFact: "The standing position places greater gravitational pressure on the pelvic floor. Training this way simulates real daily life conditions: walking, climbing stairs, sneezing.",
        duration: "7 min",
        reps: "10 reps × 2 sets",
      },
    },

    {
      day: 6,
      week: 1,
      video: "/videos/kegel-basic.mp4",
      es: {
        title: "Las tres posiciones",
        instruction: "Hoy combines todo: 8 repeticiones tumbada, 8 sentada y 8 de pie. Observa en cuál posición sientes más control y en cuál te cuesta más — eso te dirá dónde trabajar más adelante.",
        scienceFact: "La variedad posicional en el entrenamiento del suelo pélvico mejora la coordinación neuromuscular, lo que se traduce en mayor control en situaciones cotidianas como la tos o el ejercicio.",
        duration: "10 min",
        reps: "8 reps × 3 posiciones",
      },
      en: {
        title: "Three positions",
        instruction: "Today you combine everything: 8 reps lying down, 8 seated, and 8 standing. Notice which position feels strongest and which is hardest — that tells you where to focus going forward.",
        scienceFact: "Positional variety in pelvic floor training improves neuromuscular coordination, resulting in better control in everyday situations like coughing or exercise.",
        duration: "10 min",
        reps: "8 reps × 3 positions",
      },
    },

    {
      day: 7,
      week: 1,
      video: "/videos/kegel-rest.mp4",
      es: {
        title: "Descanso activo — Semana 1 completada 🎉",
        instruction: "Hoy descansas del ejercicio activo. Dedica 5 minutos a respiración diafragmática profunda: inhala en 4 tiempos, exhala en 6. Esto relaja el suelo pélvico y consolida los avances de la semana.",
        scienceFact: "El suelo pélvico necesita relajarse tanto como contraerse. Un músculo que no sabe relajarse es tan disfuncional como uno débil. La hipertonía pélvica es tan común como la hipotonía.",
        duration: "5 min",
        reps: null,
      },
      en: {
        title: "Active rest — Week 1 complete 🎉",
        instruction: "Today you rest from active exercise. Spend 5 minutes on deep diaphragmatic breathing: inhale for 4 counts, exhale for 6. This relaxes the pelvic floor and consolidates the week's progress.",
        scienceFact: "The pelvic floor needs to relax as much as it contracts. A muscle that can't relax is as dysfunctional as a weak one. Pelvic hypertonicity is as common as hypotonicity.",
        duration: "5 min",
        reps: null,
      },
    },

    // ── WEEK 2: RESISTENCIA / RESISTANCE ───────────────────────────────────────

    {
      day: 8,
      week: 2,
      video: "/videos/kegel-long.mp4",
      es: {
        title: "Contracciones largas",
        instruction: "Esta semana aumentamos la intensidad. Contrae durante 5 segundos, suelta 5 segundos. 12 repeticiones. Siente cómo el músculo aguanta más tiempo bajo tensión.",
        scienceFact: "Aumentar progresivamente el tiempo de contracción desarrolla la resistencia muscular (fibras tipo I), que es la responsable del tono continuo que previene las pérdidas involuntarias.",
        duration: "10 min",
        reps: "12 reps × 2 series",
      },
      en: {
        title: "Long contractions",
        instruction: "This week we increase intensity. Contract for 5 seconds, release for 5 seconds. 12 repetitions. Feel the muscle holding tension for longer.",
        scienceFact: "Progressively increasing contraction time develops muscular endurance (type I fibers), responsible for the continuous tone that prevents involuntary leaks.",
        duration: "10 min",
        reps: "12 reps × 2 sets",
      },
    },

    {
      day: 9,
      week: 2,
      video: "/videos/kegel-pulses.mp4",
      es: {
        title: "Contracciones rápidas (pulsos)",
        instruction: "Contrae y suelta rápidamente, 1 segundo cada vez. 15 pulsos rápidos seguidos, descansa 10 segundos. Repite 3 veces. Estos 'pulsos' entrenan la respuesta refleja del músculo.",
        scienceFact: "Las contracciones rápidas entrenan las fibras musculares tipo II (contracción rápida), que son las que se activan en milisegundos ante un estornudo o un salto — previniendo las pérdidas de urgencia.",
        duration: "8 min",
        reps: "15 pulsos × 3 series",
      },
      en: {
        title: "Quick contractions (pulses)",
        instruction: "Contract and release quickly, 1 second each. 15 rapid pulses, rest 10 seconds. Repeat 3 times. These pulses train the muscle's reflex response.",
        scienceFact: "Fast contractions train type II muscle fibers (fast-twitch), which activate within milliseconds during a sneeze or jump — preventing urgency leaks.",
        duration: "8 min",
        reps: "15 pulses × 3 sets",
      },
    },

    {
      day: 10,
      week: 2,
      video: "/videos/kegel-combo.mp4",
      es: {
        title: "Combinación: lenta + rápida",
        instruction: "5 contracciones lentas (5 seg) + 10 pulsos rápidos = 1 serie. Descansa 15 segundos. Repite 3 series. Esta combinación trabaja ambos tipos de fibras musculares en una sola sesión.",
        scienceFact: "El suelo pélvico contiene aproximadamente 70% de fibras lentas (tono) y 30% de fibras rápidas (reacción). Un entrenamiento completo debe trabajar ambas para una protección real.",
        duration: "12 min",
        reps: "3 series combinadas",
      },
      en: {
        title: "Combo: slow + fast",
        instruction: "5 slow contractions (5 sec) + 10 fast pulses = 1 set. Rest 15 seconds. Repeat 3 sets. This combination works both muscle fiber types in a single session.",
        scienceFact: "The pelvic floor contains approximately 70% slow fibers (tone) and 30% fast fibers (reaction). A complete training must work both for real-life protection.",
        duration: "12 min",
        reps: "3 combined sets",
      },
    },

    {
      day: 11,
      week: 2,
      video: "/videos/challenges/kegel-walking.mp4",
      es: {
        title: "Kegel en movimiento",
        instruction: "Durante un paseo de 10-15 minutos, contrae el suelo pélvico cada vez que des el paso derecho. Mantén la contracción 2 pasos, suelta 2 pasos. Ritmo natural, sin forzar.",
        scienceFact: "Integrar el Kegel en actividades cotidianas como caminar entrena el músculo en condiciones funcionales reales, mejorando su capacidad de respuesta automática durante el movimiento.",
        duration: "10-15 min paseo",
        reps: "Ritmo libre",
      },
      en: {
        title: "Kegel in motion",
        instruction: "During a 10-15 minute walk, contract the pelvic floor each time you step with your right foot. Hold for 2 steps, release for 2 steps. Natural rhythm, no forcing.",
        scienceFact: "Integrating Kegel into daily activities like walking trains the muscle under real functional conditions, improving its automatic response during movement.",
        duration: "10-15 min walk",
        reps: "Free rhythm",
      },
    },

    {
      day: 12,
      week: 2,
      video: "/videos/kegel-seated.mp4",
      es: {
        title: "Integración en tu rutina",
        instruction: "Elige 3 momentos de hoy para hacer 10 Kegels: al despertar, al comer y antes de dormir. No busques el momento perfecto — encájalo en lo que ya haces.",
        scienceFact: "La adherencia a los ejercicios Kegel aumenta un 73% cuando se asocian a rutinas existentes (habit stacking) en lugar de planificarse como actividad independiente.",
        duration: "3 × 5 min a lo largo del día",
        reps: "10 reps × 3 momentos",
      },
      en: {
        title: "Integrate into your routine",
        instruction: "Choose 3 moments today for 10 Kegels: when you wake up, at lunch, and before bed. Don't look for the perfect moment — slot it into what you already do.",
        scienceFact: "Adherence to Kegel exercises increases by 73% when linked to existing routines (habit stacking) rather than planned as a standalone activity.",
        duration: "3 × 5 min throughout the day",
        reps: "10 reps × 3 moments",
      },
    },

    {
      day: 13,
      week: 2,
      video: "/videos/kegel-breath.mp4",
      es: {
        title: "Kegel + respiración diafragmática profunda",
        instruction: "Inhala 4 tiempos expandiendo el abdomen. Exhala 6 tiempos contrayendo el suelo pélvico desde abajo hacia arriba. 10 repeticiones lentas. Siente la conexión entre la respiración y el suelo pélvico.",
        scienceFact: "La presión intraabdominal sube cada vez que contenemos la respiración o empujamos. Aprender a gestionar esa presión con una buena respiración es clave para proteger el suelo pélvico a largo plazo.",
        duration: "10 min",
        reps: "10 respiraciones conscientes",
      },
      en: {
        title: "Kegel + deep diaphragmatic breathing",
        instruction: "Inhale 4 counts expanding your abdomen. Exhale 6 counts contracting the pelvic floor upward. 10 slow repetitions. Feel the connection between breath and pelvic floor.",
        scienceFact: "Intra-abdominal pressure rises every time we hold our breath or bear down. Learning to manage that pressure through proper breathing is key to protecting the pelvic floor long-term.",
        duration: "10 min",
        reps: "10 conscious breaths",
      },
    },

    {
      day: 14,
      week: 2,
      video: "/videos/kegel-rest.mp4",
      es: {
        title: "Revisión Semana 2 — Mitad del camino 💪",
        instruction: "Hoy reflexiona: ¿notas alguna diferencia respecto al día 1? Puede ser más conciencia corporal, menos escapes, más facilidad para encontrar los músculos. Anótalo — los cambios pequeños son los que duran.",
        scienceFact: "A los 14 días de entrenamiento consistente, los estudios muestran mejoras medibles en la fuerza muscular del suelo pélvico mediante manometría, incluso antes de que los síntomas mejoren visiblemente.",
        duration: "5 min reflexión",
        reps: null,
      },
      en: {
        title: "Week 2 review — Halfway there 💪",
        instruction: "Today reflect: do you notice any difference since day 1? It might be more body awareness, fewer leaks, or easier muscle activation. Write it down — small changes are the lasting ones.",
        scienceFact: "After 14 days of consistent training, studies show measurable improvements in pelvic floor muscle strength via manometry, even before symptoms visibly improve.",
        duration: "5 min reflection",
        reps: null,
      },
    },

    // ── WEEK 3: CONSOLIDACIÓN / CONSOLIDATION ──────────────────────────────────

    {
      day: 15,
      week: 3,
      video: "/videos/kegel-long.mp4",
      es: {
        title: "Series completas",
        instruction: "3 series de 15 contracciones lentas (5 seg contracción, 5 seg relajación), con 20 segundos de descanso entre series. Esta es tu sesión más completa hasta ahora.",
        scienceFact: "La progresión gradual de carga (más repeticiones, más series) es el principio de sobrecarga progresiva aplicado al suelo pélvico — el mismo principio que hace funcionar cualquier entrenamiento muscular.",
        duration: "15 min",
        reps: "15 reps × 3 series",
      },
      en: {
        title: "Full sets",
        instruction: "3 sets of 15 slow contractions (5 sec hold, 5 sec release), with 20 seconds rest between sets. This is your most complete session so far.",
        scienceFact: "Gradual load progression (more reps, more sets) is the principle of progressive overload applied to the pelvic floor — the same principle that makes any muscle training work.",
        duration: "15 min",
        reps: "15 reps × 3 sets",
      },
    },

    {
      day: 16,
      week: 3,
      video: "/videos/kegel-posture.mp4",
      es: {
        title: "Kegel + postura",
        instruction: "De pie, activa el suelo pélvico y al mismo tiempo alarga la columna (como si un hilo tirara de tu cabeza hacia el techo). Mantén 5 segundos. 10 repeticiones. El suelo pélvico y la postura están profundamente conectados.",
        scienceFact: "El suelo pélvico forma parte del 'core' junto con el diafragma, el transverso abdominal y el multífido lumbar. Activarlo mejora la estabilidad lumbar y reduce el dolor de espalda baja, muy frecuente en la perimenopausia.",
        duration: "10 min",
        reps: "10 reps × 2 series",
      },
      en: {
        title: "Kegel + posture",
        instruction: "Standing, activate the pelvic floor while lengthening your spine (as if a string pulls your head toward the ceiling). Hold 5 seconds. 10 repetitions. The pelvic floor and posture are deeply connected.",
        scienceFact: "The pelvic floor is part of the 'core' along with the diaphragm, transverse abdominis, and lumbar multifidus. Activating it improves lumbar stability and reduces lower back pain, very common in perimenopause.",
        duration: "10 min",
        reps: "10 reps × 2 sets",
      },
    },

    {
      day: 17,
      week: 3,
      video: "/videos/kegel-squat.mp4",
      es: {
        title: "Kegel + sentadilla",
        instruction: "Baja a una sentadilla suave (45°), relaja el suelo pélvico al bajar. Al subir, contrae. 10 repeticiones lentas. La sentadilla es el movimiento más funcional para el suelo pélvico — lo usamos cada vez que nos levantamos de una silla.",
        scienceFact: "Las sentadillas con activación del suelo pélvico mejoran la fuerza funcional pélvica un 40% más que los Kegel aislados, según estudios de fisioterapia de suelo pélvico.",
        duration: "10 min",
        reps: "10 reps × 2 series",
      },
      en: {
        title: "Kegel + squat",
        instruction: "Lower into a gentle squat (45°), releasing the pelvic floor on the way down. On the way up, contract. 10 slow repetitions. The squat is the most functional movement for the pelvic floor — we use it every time we stand up from a chair.",
        scienceFact: "Squats with pelvic floor activation improve functional pelvic strength 40% more than isolated Kegels alone, according to pelvic floor physiotherapy studies.",
        duration: "10 min",
        reps: "10 reps × 2 sets",
      },
    },

    {
      day: 18,
      week: 3,
      video: "/videos/kegel-basic.mp4",
      es: {
        title: "Suelo pélvico e intimidad",
        instruction: "Hoy es un día de conciencia, no de esfuerzo. Dedica 5 minutos a contracciones muy suaves y lentas. Conecta con la sensación de control y presencia en esa zona de tu cuerpo.",
        scienceFact: "Un suelo pélvico tonificado mejora la sensibilidad en las relaciones íntimas y puede aumentar la intensidad del orgasmo. Durante la perimenopausia, este beneficio es especialmente relevante dado el impacto hormonal en la libido.",
        duration: "5 min",
        reps: "10 reps suaves × 1 serie",
      },
      en: {
        title: "Pelvic floor and intimacy",
        instruction: "Today is a day of awareness, not effort. Spend 5 minutes on very gentle, slow contractions. Connect with the feeling of control and presence in that area of your body.",
        scienceFact: "A toned pelvic floor improves sensation during intimacy and can increase orgasm intensity. During perimenopause, this benefit is especially relevant given the hormonal impact on libido.",
        duration: "5 min",
        reps: "10 gentle reps × 1 set",
      },
    },

    {
      day: 19,
      week: 3,
      video: "/videos/kegel-functional.mp4",
      es: {
        title: "Kegel preventivo — toser, reír, saltar",
        instruction: "Practica el 'Kegel preventivo': contrae el suelo pélvico justo ANTES de toser, estornudar o saltar. Haz 10 toses simuladas con contracción previa. Este reflejo es el que elimina los escapes.",
        scienceFact: "El Kegel preventivo (pre-contraction) es la técnica más efectiva para eliminar la incontinencia de esfuerzo. Entrena el reflejo automático del músculo para que eventualmente ocurra sin pensar.",
        duration: "8 min",
        reps: "10 repeticiones funcionales",
      },
      en: {
        title: "Preventive Kegel — coughing, laughing, jumping",
        instruction: "Practice the 'preventive Kegel': contract the pelvic floor just BEFORE coughing, sneezing, or jumping. Do 10 simulated coughs with prior contraction. This reflex is what eliminates leaks.",
        scienceFact: "The preventive Kegel (pre-contraction) is the most effective technique for eliminating stress incontinence. It trains the muscle's automatic reflex to eventually happen without thinking.",
        duration: "8 min",
        reps: "10 functional repetitions",
      },
    },

    {
      day: 20,
      week: 3,
      video: "/videos/kegel-combo.mp4",
      es: {
        title: "Tu rutina personalizada",
        instruction: "Diseña tu propia sesión con lo que más has disfrutado estas 3 semanas: elige 2-3 ejercicios favoritos, decide las series y el momento del día. Esta es la rutina que vas a mantener.",
        scienceFact: "La personalización del ejercicio aumenta la adherencia a largo plazo hasta un 60%. El mejor ejercicio no es el más intenso — es el que harás de forma consistente el resto de tu vida.",
        duration: "10-15 min",
        reps: "A tu ritmo",
      },
      en: {
        title: "Your personalized routine",
        instruction: "Design your own session with what you've enjoyed most these 3 weeks: choose 2-3 favorite exercises, decide on sets and time of day. This is the routine you'll maintain.",
        scienceFact: "Exercise personalization increases long-term adherence by up to 60%. The best exercise isn't the most intense — it's the one you'll do consistently for the rest of your life.",
        duration: "10-15 min",
        reps: "Your own pace",
      },
    },

    {
      day: 21,
      week: 3,
      video: "/videos/kegel-celebration.mp4",
      es: {
        title: "21 días completados — ¡Lo has conseguido! 🎉",
        instruction: "Haz tu sesión completa favorita como celebración. Luego para un momento: llevas 21 días cuidando tu suelo pélvico de forma consistente. Eso es exactamente lo que tu cuerpo necesitaba.",
        scienceFact: "21 días de entrenamiento consistente son suficientes para establecer nuevas conexiones neuromusculares. Los beneficios del Kegel se mantienen siempre que el ejercicio continúe — como cualquier músculo, necesita uso para no perder lo ganado.",
        duration: "15 min",
        reps: "Sesión completa libre",
      },
      en: {
        title: "21 days completed — You did it! 🎉",
        instruction: "Do your favorite complete session as a celebration. Then pause for a moment: you've spent 21 days consistently caring for your pelvic floor. That's exactly what your body needed.",
        scienceFact: "21 days of consistent training are enough to establish new neuromuscular connections. Kegel benefits are maintained as long as the exercise continues — like any muscle, it needs use to keep what was gained.",
        duration: "15 min",
        reps: "Free full session",
      },
    },

  ],
};

// ─── VIDEO MAP ────────────────────────────────────────────────────────────────
// Update paths once videos are uploaded to Supabase Storage or /public/videos
//
// pelvic-floor-hero.mp4       → Video anatómico intro (suelo pélvico en 3D)
// kegel-basic.mp4             → Animación Kegel base (el primer video generado)
// kegel-breath.mp4            → Kegel + respiración
// kegel-seated.mp4            → Kegel sentada
// kegel-standing.mp4          → Kegel de pie
// kegel-long.mp4              → Contracciones largas
// kegel-pulses.mp4            → Pulsos rápidos
// kegel-combo.mp4             → Combinación lenta + rápida
// kegel-walking.mp4           → Kegel caminando
// kegel-posture.mp4           → Kegel + postura
// kegel-squat.mp4             → Kegel + sentadilla
// kegel-functional.mp4        → Kegel preventivo
// kegel-rest.mp4              → Descanso activo
// kegel-celebration.mp4       → Día 21 celebración