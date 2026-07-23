// TODO copy pendiente revisión Bibiana — formulación blanda, no diagnóstica.
// Motor de lecturas: convierte objetivo + síntoma principal (del quiz) + datos
// reales de la usuaria en una lectura diaria y un plan de 3 acciones, sin
// esperar a ninguna API (instantáneo). /api/lumi queda solo para el chat y
// la ampliación bajo demanda.

// Síntomas reales del quiz (app/quiz/page.jsx, pregunta "sintomas"), ES/EN → clave canónica.
const MAPA_SINTOMAS = {
  'cansancio constante': 'cansancio',
  'constant fatigue': 'cansancio',
  'antojos de dulce': 'antojos',
  'sugar cravings': 'antojos',
  'insomnio o despertar nocturno': 'insomnio',
  'insomnia or night waking': 'insomnio',
  'hinchazón': 'hinchazon',
  'bloating': 'hinchazon',
  'cambios de humor': 'animo',
  'mood changes': 'animo',
  'sofocos': 'sofocos',
  'hot flashes': 'sofocos',
  'bajo deseo sexual': 'libido',
  'low libido': 'libido',
  'niebla mental': 'niebla',
  'brain fog': 'niebla',
};

export function normalizarSintoma(raw) {
  if (!raw) return null;
  // sintoma_principal puede venir con varias opciones unidas por "|" — nos quedamos con la primera.
  const primero = String(raw).split('|')[0].trim().toLowerCase();
  return MAPA_SINTOMAS[primero] || null;
}

// Cada entrada: lectura(d) → frase de héroe; plan(d) → 3 acciones (nutrición, movimiento, interior).
// d = { nombre, is_es, diasRegistrados, racha, objetivo }
const LECTURAS = {
  hinchazon: {
    lectura: (d) => d.is_es
      ? (d.diasRegistrados >= 3
          ? `${d.nombre}, llevas ${d.diasRegistrados} días registrando y la hinchazón sigue apareciendo. Eso apunta a cómo y cuándo comes, no a qué desayunas — hoy trabajamos justo eso.`
          : `${d.nombre}, la hinchazón es tu síntoma principal ahora mismo. Con estos primeros días registrados voy a ir afinando exactamente cuándo te aparece.`)
      : (d.diasRegistrados >= 3
          ? `${d.nombre}, you've logged ${d.diasRegistrados} days and the bloating keeps showing up. That points to how and when you eat, not what you have for breakfast — today we work on exactly that.`
          : `${d.nombre}, bloating is your main symptom right now. With these first logged days I'll start narrowing down exactly when it shows up for you.`),
    plan: (d) => d.is_es ? [
      { tipo:'nutricion', icono:'🍽', accion:'Empieza el plato por la verdura (medio plato) y deja el hidrato (una taza) para el final', porque:'Cambia la velocidad a la que digieres y suaviza la subida de glucosa de después de comer.' },
      { tipo:'movimiento', icono:'🚶‍♀️', accion:'15 min de paseo justo al terminar de comer', porque:'Mover el cuerpo después de comer ayuda a que el estómago se vacíe mejor.' },
      { tipo:'interior', icono:'🌙', accion:'3 respiraciones lentas antes del primer bocado', porque:'Comer con el cuerpo en calma cambia cómo lo digieres. Un minuto, nada más.' },
    ] : [
      { tipo:'nutricion', icono:'🍽', accion:'Start your plate with vegetables (half the plate), leave the carbs (one cup) for last', porque:'It changes how fast you digest and softens the glucose rise after eating.' },
      { tipo:'movimiento', icono:'🚶‍♀️', accion:'15 min walk right after your meal', porque:'Moving after eating helps your stomach empty more comfortably.' },
      { tipo:'interior', icono:'🌙', accion:'3 slow breaths before your first bite', porque:'Eating with a calm body changes how you digest. Just one minute.' },
    ],
  },
  cansancio: {
    lectura: (d) => d.is_es
      ? (d.diasRegistrados >= 3
          ? `${d.nombre}, ${d.diasRegistrados} días registrados y el cansancio sigue siendo lo primero que sientes. Antes de sumar más café, vamos a mirar tu energía desde la raíz — hidratación y luz de la mañana.`
          : `${d.nombre}, el cansancio es lo que más notas ahora mismo. Empezamos por lo que más rápido se nota: cómo arrancas la mañana.`)
      : (d.diasRegistrados >= 3
          ? `${d.nombre}, ${d.diasRegistrados} days logged and tiredness is still the first thing you feel. Before adding more coffee, let's look at your energy from the root — hydration and morning light.`
          : `${d.nombre}, tiredness is what you notice most right now. Let's start with what shows results fastest: how you start your morning.`),
    plan: (d) => d.is_es ? [
      { tipo:'nutricion', icono:'💧', accion:'2 vasos de agua al despertar, antes del café', porque:'La deshidratación leve ya reduce tu energía y tu foco — llegas deshidratada de la noche.' },
      { tipo:'movimiento', icono:'☀️', accion:'5 min de luz natural en la primera hora del día', porque:'La luz de la mañana ajusta tu reloj interno y adelanta la energía de todo el día.' },
      { tipo:'interior', icono:'⏸️', accion:'Una pausa de 5 min sin pantallas a media mañana', porque:'El cortisol acumulado agota tu energía mental. Una pausa corta la recupera.' },
    ] : [
      { tipo:'nutricion', icono:'💧', accion:'2 glasses of water on waking, before coffee', porque:'Mild dehydration already lowers your energy and focus — you wake up dehydrated from the night.' },
      { tipo:'movimiento', icono:'☀️', accion:'5 min of natural light in your first hour', porque:'Morning light resets your internal clock and lifts energy for the rest of the day.' },
      { tipo:'interior', icono:'⏸️', accion:'A 5-min screen-free pause mid-morning', porque:'Built-up cortisol drains your mental energy. A short pause restores it.' },
    ],
  },
  niebla: {
    lectura: (d) => d.is_es
      ? (d.diasRegistrados >= 3
          ? `${d.nombre}, en tus últimos ${d.diasRegistrados} días la niebla mental aparece una y otra vez. No es falta de esfuerzo — es hidratación y grasa buena en el cerebro. Hoy lo trabajamos desde ahí.`
          : `${d.nombre}, la niebla mental es lo que más te pesa ahora. Vamos a empezar por lo que el cerebro necesita primero: agua y omega-3.`)
      : (d.diasRegistrados >= 3
          ? `${d.nombre}, over your last ${d.diasRegistrados} days, brain fog keeps showing up. It's not a lack of effort — it's hydration and good fat for your brain. Today we work from there.`
          : `${d.nombre}, brain fog is what weighs on you most right now. Let's start with what your brain needs first: water and omega-3.`),
    plan: (d) => d.is_es ? [
      { tipo:'nutricion', icono:'🥑', accion:'Omega-3 en el desayuno: un puñado de nueces, medio aguacate o una palma de mano de salmón', porque:'El DHA es el principal ácido graso del cerebro y reduce la neuroinflamación que causa niebla.' },
      { tipo:'movimiento', icono:'💧', accion:'Botella de agua a la vista todo el día', porque:'Tu cerebro es 75% agua — una deshidratación del 2% ya nubla la memoria y el foco.' },
      { tipo:'interior', icono:'⏸️', accion:'Una sola tarea a la vez durante 25 min, sin cambiar de ventana', porque:'Cambiar de tarea constantemente es lo que más agota tu claridad mental, más que el cansancio en sí.' },
    ] : [
      { tipo:'nutricion', icono:'🥑', accion:'Omega-3 at breakfast: a handful of walnuts, half an avocado or a palm-sized piece of salmon', porque:'DHA is the brain\'s main fatty acid and reduces the neuroinflammation behind brain fog.' },
      { tipo:'movimiento', icono:'💧', accion:'Keep a water bottle in sight all day', porque:'Your brain is 75% water — 2% dehydration already clouds memory and focus.' },
      { tipo:'interior', icono:'⏸️', accion:'One task at a time for 25 min, no tab-switching', porque:'Constantly switching tasks drains your mental clarity more than tiredness itself.' },
    ],
  },
  insomnio: {
    lectura: (d) => d.is_es
      ? (d.diasRegistrados >= 3
          ? `${d.nombre}, en ${d.diasRegistrados} días registrados el sueño sigue siendo lo que más se resiente. Hoy preparamos la noche desde la tarde, no desde la cama.`
          : `${d.nombre}, el sueño es tu foco principal ahora. Empezamos por lo que más rápido cambia tu noche: la luz y el magnesio.`)
      : (d.diasRegistrados >= 3
          ? `${d.nombre}, over ${d.diasRegistrados} logged days, sleep keeps being what suffers most. Today we prepare the night starting in the afternoon, not in bed.`
          : `${d.nombre}, sleep is your main focus right now. Let's start with what changes your night fastest: light and magnesium.`),
    plan: (d) => d.is_es ? [
      { tipo:'nutricion', icono:'☕', accion:'Última cafeína antes de las 14:00', porque:'La cafeína tarda hasta 8 horas en salir de tu cuerpo — sigue activa cuando intentas dormir.' },
      { tipo:'movimiento', icono:'🌡️', accion:'Dormitorio a 18-20°C esta noche', porque:'Tu temperatura corporal debe bajar 1°C para iniciar el sueño profundo. El frío lo facilita.' },
      { tipo:'interior', icono:'🚫', accion:'Sin pantallas 1h antes de dormir', porque:'La luz azul suprime la melatonina hasta 3 horas — sin ella, tu ciclo se regula solo.' },
    ] : [
      { tipo:'nutricion', icono:'☕', accion:'Last caffeine before 2pm', porque:'Caffeine takes up to 8 hours to leave your body — it is still active when you try to sleep.' },
      { tipo:'movimiento', icono:'🌡️', accion:'Bedroom at 18-20°C tonight', porque:'Your body temperature must drop 1°C to start deep sleep. A cool room helps that happen.' },
      { tipo:'interior', icono:'🚫', accion:'No screens 1h before bed', porque:'Blue light suppresses melatonin for up to 3 hours — without it, your cycle regulates itself.' },
    ],
  },
  animo: {
    lectura: (d) => d.is_es
      ? (d.diasRegistrados >= 3
          ? `${d.nombre}, en tus ${d.diasRegistrados} días registrados el ánimo se mueve más de lo que te gustaría. Tiene una base biológica real — hoy la trabajamos desde el intestino y el movimiento.`
          : `${d.nombre}, los cambios de ánimo son lo que más notas ahora. Empezamos por algo que actúa rápido: fibra y movimiento suave.`)
      : (d.diasRegistrados >= 3
          ? `${d.nombre}, over your ${d.diasRegistrados} logged days your mood shifts more than you'd like. It has a real biological base — today we work on it through gut and movement.`
          : `${d.nombre}, mood swings are what you notice most right now. Let's start with something that acts fast: fibre and gentle movement.`),
    plan: (d) => d.is_es ? [
      { tipo:'nutricion', icono:'🌾', accion:'Una ración extra de fibra hoy: un puñado de legumbres, media taza de avena o un plato de verdura', porque:'La fibra alimenta bacterias que fabrican serotonina — tu ánimo también se cocina en el intestino.' },
      { tipo:'movimiento', icono:'🚶‍♀️', accion:'20 min de movimiento suave, al aire libre si puedes', porque:'El movimiento libera endorfinas y baja el cortisol de forma medible en menos de media hora.' },
      { tipo:'interior', icono:'🫁', accion:'Respiración lenta, 4-6 veces por minuto, 2 minutos', porque:'Activa el nervio vago y baja el cortisol en minutos — es la vía más rápida para calmar el ánimo.' },
    ] : [
      { tipo:'nutricion', icono:'🌾', accion:'An extra serving of fibre today: a handful of legumes, half a cup of oats or a plate of vegetables', porque:'Fibre feeds bacteria that make serotonin — your mood is also cooked in your gut.' },
      { tipo:'movimiento', icono:'🚶‍♀️', accion:'20 min of gentle movement, outdoors if you can', porque:'Movement releases endorphins and measurably lowers cortisol in under half an hour.' },
      { tipo:'interior', icono:'🫁', accion:'Slow breathing, 4-6 breaths per minute, for 2 minutes', porque:'It activates the vagus nerve and lowers cortisol within minutes — the fastest way to steady your mood.' },
    ],
  },
  sofocos: {
    lectura: (d) => d.is_es
      ? (d.diasRegistrados >= 3
          ? `${d.nombre}, en ${d.diasRegistrados} días registrados los sofocos siguen apareciendo. Hay disparadores concretos que puedes controlar hoy mismo.`
          : `${d.nombre}, los sofocos son tu síntoma principal ahora. Empezamos por los disparadores más comunes: cafeína, alcohol y capas de ropa.`)
      : (d.diasRegistrados >= 3
          ? `${d.nombre}, over ${d.diasRegistrados} logged days, hot flashes keep showing up. There are concrete triggers you can control starting today.`
          : `${d.nombre}, hot flashes are your main symptom right now. Let's start with the most common triggers: caffeine, alcohol and clothing layers.`),
    plan: (d) => d.is_es ? [
      { tipo:'nutricion', icono:'🌶️', accion:'Hoy prueba sin cafeína ni alcohol', porque:'Ambos dilatan los vasos sanguíneos y son de los disparadores más comunes de un sofoco.' },
      { tipo:'movimiento', icono:'🧊', accion:'Ropa en capas que puedas quitarte fácilmente', porque:'Poder enfriarte rápido corta el sofoco antes de que suba de intensidad.' },
      { tipo:'interior', icono:'🫁', accion:'Respiración lenta y profunda al notar el primer calor', porque:'Bajar la frecuencia respiratoria reduce la intensidad y duración del sofoco.' },
    ] : [
      { tipo:'nutricion', icono:'🌶️', accion:'Try going without caffeine or alcohol today', porque:'Both dilate blood vessels and are among the most common hot flash triggers.' },
      { tipo:'movimiento', icono:'🧊', accion:'Wear layers you can remove easily', porque:'Being able to cool down fast cuts a hot flash short before it builds up.' },
      { tipo:'interior', icono:'🫁', accion:'Slow, deep breathing as soon as you feel the first heat', porque:'Slowing your breathing rate reduces how intense and how long the flash lasts.' },
    ],
  },
  antojos: {
    lectura: (d) => d.is_es
      ? (d.diasRegistrados >= 3
          ? `${d.nombre}, en ${d.diasRegistrados} días registrados los antojos de dulce siguen apareciendo, sobre todo cuando baja tu energía. Es química, no falta de voluntad.`
          : `${d.nombre}, los antojos de dulce son lo que más notas ahora. Empezamos por lo que más los calma: proteína desde el desayuno.`)
      : (d.diasRegistrados >= 3
          ? `${d.nombre}, over ${d.diasRegistrados} logged days sugar cravings keep showing up, especially when your energy dips. That is chemistry, not a lack of willpower.`
          : `${d.nombre}, sugar cravings are what you notice most right now. Let's start with what calms them best: protein from breakfast.`),
    plan: (d) => d.is_es ? [
      { tipo:'nutricion', icono:'🥚', accion:'Proteína real en el desayuno: 2 huevos, un vaso de yogur griego o similar', porque:'La proteína del desayuno reduce los antojos de dulce por la tarde — es química, no fuerza de voluntad.' },
      { tipo:'movimiento', icono:'🚶‍♀️', accion:'2 min de caminar cuando llegue el antojo', porque:'Mover el cuerpo desvía la atención y baja el pico de glucosa que dispara las ganas de dulce.' },
      { tipo:'interior', icono:'💧', accion:'Un vaso de agua antes de decidir', porque:'La sed se confunde muchas veces con hambre de dulce — el cuerpo pide una cosa y suena a otra.' },
    ] : [
      { tipo:'nutricion', icono:'🥚', accion:'Real protein at breakfast: 2 eggs, a glass of Greek yoghurt or similar', porque:'Protein at breakfast reduces afternoon sugar cravings — it is chemistry, not willpower.' },
      { tipo:'movimiento', icono:'🚶‍♀️', accion:'A 2-min walk when the craving hits', porque:'Moving shifts your focus and lowers the glucose spike that triggers the craving for sugar.' },
      { tipo:'interior', icono:'💧', accion:'A glass of water before you decide', porque:'Thirst is often mistaken for a sugar craving — the body asks for one thing and it sounds like another.' },
    ],
  },
  libido: {
    lectura: (d) => d.is_es
      ? (d.diasRegistrados >= 3
          ? `${d.nombre}, en ${d.diasRegistrados} días registrados el deseo sigue bajo. Suele estar más unido al descanso y al estrés acumulado que a otra cosa.`
          : `${d.nombre}, el deseo bajo es lo que más te preocupa ahora. Empezamos por lo que más lo afecta de fondo: el descanso.`)
      : (d.diasRegistrados >= 3
          ? `${d.nombre}, over ${d.diasRegistrados} logged days your desire has stayed low. It is often more linked to rest and built-up stress than anything else.`
          : `${d.nombre}, low desire is what concerns you most right now. Let's start with what affects it most at the root: rest.`),
    plan: (d) => d.is_es ? [
      { tipo:'nutricion', icono:'🥑', accion:'Grasas buenas hoy: una cucharada de aceite de oliva, medio aguacate o un puñado de frutos secos', porque:'Tus hormonas sexuales se fabrican a partir de grasa — sin suficiente, la producción baja.' },
      { tipo:'movimiento', icono:'🚶‍♀️', accion:'20 min de movimiento que disfrutes, sin más objetivo que eso', porque:'El movimiento baja el cortisol acumulado, que es uno de los frenos más directos del deseo.' },
      { tipo:'interior', icono:'🌙', accion:'Prioriza dormir 7-8h esta noche', porque:'El descanso insuficiente baja directamente las hormonas relacionadas con el deseo al día siguiente.' },
    ] : [
      { tipo:'nutricion', icono:'🥑', accion:'Good fats today: a tablespoon of olive oil, half an avocado or a handful of nuts', porque:'Your sex hormones are built from fat — without enough, production drops.' },
      { tipo:'movimiento', icono:'🚶‍♀️', accion:'20 min of movement you enjoy, no other goal', porque:'Movement lowers built-up cortisol, one of the most direct brakes on desire.' },
      { tipo:'interior', icono:'🌙', accion:'Prioritise 7-8h of sleep tonight', porque:'Not enough rest directly lowers desire-related hormones the next day.' },
    ],
  },
};

// Fallback por objetivo (día 1-2 sin síntoma registrado, o síntoma no reconocido).
const GENERAL_POR_OBJETIVO = {
  peso: {
    lectura: (d) => d.is_es
      ? `${d.nombre}, estamos empezando a conocer tu cuerpo. Con lo que registres estos días, tu plan se irá afinando — hoy arrancamos por lo más simple.`
      : `${d.nombre}, we're just starting to get to know your body. As you log these first days, your plan will get sharper — today we start with the simplest thing.`,
    plan: (d) => d.is_es ? [
      { tipo:'nutricion', icono:'🕗', accion:'Desayuna antes de las 9am con una palma de mano de proteína', porque:'El cortisol matutino está en su pico — la proteína lo estabiliza y frena el catabolismo muscular.' },
      { tipo:'movimiento', icono:'🚶', accion:'Camina 20 min después de comer', porque:'Reduce el pico de insulina postcomida hasta un 30%.' },
      { tipo:'interior', icono:'🌙', accion:'Cena antes de las 8pm', porque:'La sensibilidad a la insulina baja por la noche — cenar tarde almacena más grasa.' },
    ] : [
      { tipo:'nutricion', icono:'🕗', accion:'Breakfast before 9am with a palm-sized portion of protein', porque:'Morning cortisol peaks early — protein stabilises it and prevents muscle breakdown.' },
      { tipo:'movimiento', icono:'🚶', accion:'Walk 20 min after meals', porque:'Reduces the post-meal insulin spike by up to 30%.' },
      { tipo:'interior', icono:'🌙', accion:'Dinner before 8pm', porque:'Insulin sensitivity drops at night — a late dinner stores more fat.' },
    ],
  },
  energia: {
    lectura: (d) => d.is_es
      ? `${d.nombre}, estamos empezando a conocer tu cuerpo. Con lo que registres estos días, tu plan se irá afinando — hoy arrancamos por tu energía.`
      : `${d.nombre}, we're just starting to get to know your body. As you log these first days, your plan will get sharper — today we start with your energy.`,
    plan: (d) => d.is_es ? [
      { tipo:'nutricion', icono:'💧', accion:'2 vasos de agua al despertar', porque:'La deshidratación leve reduce el rendimiento cognitivo.' },
      { tipo:'movimiento', icono:'☀️', accion:'5 min de luz natural al empezar el día', porque:'Ajusta tu reloj interno y adelanta la energía del resto del día.' },
      { tipo:'interior', icono:'⏸️', accion:'Pausa de 5 min sin pantallas cada hora', porque:'El cortisol acumulado bloquea el foco — las micro-pausas lo regulan.' },
    ] : [
      { tipo:'nutricion', icono:'💧', accion:'2 glasses of water on waking', porque:'Mild dehydration reduces cognitive performance.' },
      { tipo:'movimiento', icono:'☀️', accion:'5 min of natural light to start the day', porque:'It resets your internal clock and lifts energy for the day ahead.' },
      { tipo:'interior', icono:'⏸️', accion:'5-min screen-free break every hour', porque:'Built-up cortisol blocks focus — micro-breaks regulate it.' },
    ],
  },
  sueno: {
    lectura: (d) => d.is_es
      ? `${d.nombre}, estamos empezando a conocer tu cuerpo. Con lo que registres estos días, tu plan se irá afinando — hoy preparamos tu noche.`
      : `${d.nombre}, we're just starting to get to know your body. As you log these first days, your plan will get sharper — today we prepare your night.`,
    plan: (d) => d.is_es ? [
      { tipo:'nutricion', icono:'☕', accion:'Última cafeína antes de las 14:00', porque:'La cafeína tarda hasta 8 horas en salir de tu cuerpo.' },
      { tipo:'movimiento', icono:'🌡️', accion:'Dormitorio a 18-20°C esta noche', porque:'Tu cuerpo necesita bajar 1°C para iniciar el sueño profundo.' },
      { tipo:'interior', icono:'🚫', accion:'Sin pantallas 1h antes de dormir', porque:'La luz azul suprime la melatonina hasta 3 horas.' },
    ] : [
      { tipo:'nutricion', icono:'☕', accion:'Last caffeine before 2pm', porque:'Caffeine takes up to 8 hours to leave your body.' },
      { tipo:'movimiento', icono:'🌡️', accion:'Bedroom at 18-20°C tonight', porque:'Your body needs to drop 1°C to start deep sleep.' },
      { tipo:'interior', icono:'🚫', accion:'No screens 1h before bed', porque:'Blue light suppresses melatonin for up to 3 hours.' },
    ],
  },
  hormonal: {
    lectura: (d) => d.is_es
      ? `${d.nombre}, estamos empezando a conocer tu cuerpo. Con lo que registres estos días, tu plan se irá afinando — hoy trabajamos las bases.`
      : `${d.nombre}, we're just starting to get to know your body. As you log these first days, your plan will get sharper — today we work on the basics.`,
    plan: (d) => d.is_es ? [
      { tipo:'nutricion', icono:'🥑', accion:'Grasas buenas en cada comida principal: una cucharada de aceite de oliva o un puñado de frutos secos', porque:'Tus hormonas se fabrican a partir de grasa — sin suficiente, la producción baja.' },
      { tipo:'movimiento', icono:'🏋️', accion:'20 min de fuerza o movimiento hoy', porque:'El ejercicio de fuerza es lo que más impacta tu metabolismo hormonal después de los 40.' },
      { tipo:'interior', icono:'🌙', accion:'Rutina fija para acostarte, misma hora', porque:'La regularidad del sueño estabiliza el eje hormonal más que la duración exacta.' },
    ] : [
      { tipo:'nutricion', icono:'🥑', accion:'Good fats at every main meal: a tablespoon of olive oil or a handful of nuts', porque:'Your hormones are built from fat — without enough, production drops.' },
      { tipo:'movimiento', icono:'🏋️', accion:'20 min of strength or movement today', porque:'Strength training has the biggest impact on hormonal metabolism after 40.' },
      { tipo:'interior', icono:'🌙', accion:'A fixed bedtime routine, same time', porque:'Sleep regularity stabilises your hormonal axis more than exact duration.' },
    ],
  },
  fuerza: {
    lectura: (d) => d.is_es
      ? `${d.nombre}, estamos empezando a conocer tu cuerpo. Con lo que registres estos días, tu plan se irá afinando — hoy arrancamos por lo esencial.`
      : `${d.nombre}, we're just starting to get to know your body. As you log these first days, your plan will get sharper — today we start with the essentials.`,
    plan: (d) => d.is_es ? [
      { tipo:'nutricion', icono:'🥩', accion:'Una palma de mano de proteína en cada comida principal hoy', porque:'Tu músculo necesita proteína constante para crecer — sin ella, el ejercicio no rinde igual.' },
      { tipo:'movimiento', icono:'🏋️', accion:'Entrena fuerza, 3 series al fallo', porque:'El ejercicio de fuerza es lo que más impacta tu metabolismo hormonal después de los 40.' },
      { tipo:'interior', icono:'✦', accion:'Duerme 8h — el músculo crece mientras duermes', porque:'Tu cuerpo regenera y crece durante el sueño, no durante el entrenamiento en sí.' },
    ] : [
      { tipo:'nutricion', icono:'🥩', accion:'A palm-sized portion of protein at every main meal today', porque:'Your muscle needs steady protein to grow — without it, training won\'t pay off the same.' },
      { tipo:'movimiento', icono:'🏋️', accion:'Strength train, 3 sets to failure', porque:'Strength training has the biggest impact on hormonal metabolism after 40.' },
      { tipo:'interior', icono:'✦', accion:'Sleep 8h — muscle grows while you sleep', porque:'Your body regenerates and grows during sleep, not during the workout itself.' },
    ],
  },
};

function normalizarObjetivo(raw) {
  const o = (raw || '').toLowerCase();
  if (o.includes('peso') || o.includes('weight')) return 'peso';
  if (o.includes('músculo') || o.includes('muscle') || o.includes('fuerza') || o.includes('strength')) return 'fuerza';
  if (o.includes('hormonal') || o.includes('equilibrio') || o.includes('balance')) return 'hormonal';
  if (o.includes('energía') || o.includes('energy') || o.includes('vitalidad') || o.includes('vitality')) return 'energia';
  if (o.includes('sueño') || o.includes('sleep') || o.includes('dormir')) return 'sueno';
  return 'hormonal';
}

// Condiciones reales del quiz (pregunta "condiciones") que tienen adaptación de nutrición.
// El resto (hipotiroidismo, SOP, endometriosis, miomas, menopausia quirúrgica, otra) no
// tiene aquí una adaptación propia — no se inventa etiqueta si no hay nada real que adaptar.
const MAPA_CONDICIONES = {
  'hipertensión': 'hipertension',
  'high blood pressure': 'hipertension',
  'diabetes o resistencia a la insulina': 'diabetes',
  'diabetes or insulin resistance': 'diabetes',
  'fibromialgia': 'fibromialgia',
  'fibromyalgia': 'fibromialgia',
};

function normalizarCondiciones(raw) {
  const lista = Array.isArray(raw) ? raw : (raw ? [raw] : []);
  const claves = lista.map(c => MAPA_CONDICIONES[String(c).trim().toLowerCase()]).filter(Boolean);
  return [...new Set(claves)];
}

// Prioridad si hay varias: la más específica para el plato de hoy va primero.
const ORDEN_CONDICIONES = ['diabetes', 'hipertension', 'fibromialgia'];

// TODO copy pendiente revisión Bibiana — formulación blanda, no diagnóstica
const ADAPTACION_CONDICION = {
  diabetes: {
    es: { accion: 'Verdura primero, proteína después, y el hidrato (una taza) al final — nunca el hidrato solo', porque: 'El orden en que comes suaviza el pico de glucosa hasta un 30%, aunque comas exactamente lo mismo.', etiqueta: 'Adaptado a tu diabetes: el orden del plato importa tanto como lo que comes.' },
    en: { accion: 'Vegetables first, protein next, and the carbs (one cup) last — never carbs alone', porque: 'The order you eat in softens the glucose spike by up to 30%, even eating exactly the same food.', etiqueta: "Adapted for your diabetes: the order of your plate matters as much as what's on it." },
  },
  hipertension: {
    es: { accion: 'Hoy sin sal añadida — dale sabor con limón, ajo o hierbas frescas', porque: 'El potasio de la verdura ayuda a tu tensión más que reducir la sal por sí sola.', etiqueta: 'Adaptado a tu tensión: sin sal añadida, con potasio de la verdura.' },
    en: { accion: 'No added salt today — flavour with lemon, garlic or fresh herbs', porque: 'Potassium from vegetables helps your blood pressure more than cutting salt alone.', etiqueta: 'Adapted for your blood pressure: no added salt, with potassium from vegetables.' },
  },
  fibromialgia: {
    es: { accion: 'Come cada 3-4 horas hoy — evita ayunos largos', porque: 'Los picos y bajones de glucosa agravan el dolor y la fatiga en fibromialgia.', etiqueta: 'Adaptado a tu fibromialgia: comidas regulares, sin ayunos largos.' },
    en: { accion: 'Eat every 3-4 hours today — avoid long fasts', porque: 'Glucose spikes and dips make fibromyalgia pain and fatigue worse.', etiqueta: 'Adapted for your fibromyalgia: regular meals, no long fasts.' },
  },
};

const MAPA_RESTRICCIONES = {
  'vegetariana': 'vegetariana', 'vegetarian': 'vegetariana',
  'vegana': 'vegana', 'vegan': 'vegana',
  'sin gluten': 'sin_gluten', 'gluten-free': 'sin_gluten',
  'sin lácteos': 'sin_lacteos', 'dairy-free': 'sin_lacteos',
};

function normalizarRestriccion(raw) {
  return MAPA_RESTRICCIONES[(raw || '').trim().toLowerCase()] || null;
}

// Ajusta la fuente de proteína/lácteos/gluten del texto SOLO si de verdad hay conflicto.
// Si no hay nada que cambiar, no se toca el texto ni se muestra etiqueta.
function ajustarPorRestriccion(accion, restriccionKey, is_es) {
  const conflictos = {
    vegetariana: /salmón|pescado|carne|salmon|fish|meat/i,
    vegana: /salmón|pescado|carne|huevo|yogur|queso|lácte|salmon|fish|meat|egg|yoghurt|cheese|dairy/i,
    sin_gluten: /avena|pan\b|trigo|oat|bread|wheat/i,
    sin_lacteos: /yogur|queso|leche|yoghurt|cheese|milk/i,
  };
  const reemplazos = {
    vegetariana: { es: 'huevo, queso o legumbres', en: 'eggs, cheese or legumes' },
    vegana: { es: 'legumbres, tofu o frutos secos', en: 'legumes, tofu or nuts' },
    sin_gluten: { es: 'avena certificada sin gluten o quinoa', en: 'certified gluten-free oats or quinoa' },
    sin_lacteos: { es: 'bebida vegetal o alternativa sin lácteos', en: 'plant milk or a dairy-free alternative' },
  };
  const etiquetas = {
    vegetariana: { es: 'Adaptado a que eres vegetariana.', en: "Adapted because you're vegetarian." },
    vegana: { es: 'Adaptado a que eres vegana, sin lácteos ni huevo.', en: "Adapted because you're vegan, no dairy or egg." },
    sin_gluten: { es: 'Sin gluten, como me dijiste.', en: 'Gluten-free, as you told me.' },
    sin_lacteos: { es: 'Sin lácteos, como me dijiste.', en: 'Dairy-free, as you told me.' },
  };
  const patron = conflictos[restriccionKey];
  if (!patron || !patron.test(accion)) return null;
  const nuevaAccion = accion.replace(patron, reemplazos[restriccionKey][is_es ? 'es' : 'en']);
  return { accion: nuevaAccion, etiqueta: etiquetas[restriccionKey][is_es ? 'es' : 'en'] };
}

// Objetivo diario de referencia a partir del TDEE ya calculado en el registro (Mifflin-St Jeor).
// Nunca se muestra como titular ni por acción — solo como dato secundario del día.
function calcularObjetivoKcal(tdee, claveObjetivo) {
  if (!tdee) return null;
  if (claveObjetivo === 'peso') return Math.round((tdee - 400) / 10) * 10;
  if (claveObjetivo === 'fuerza') return Math.round((tdee + 250) / 10) * 10;
  return Math.round(tdee / 10) * 10;
}

// API principal: instantánea, sin llamadas de red.
export function getLecturaDelDia({ nombre, objetivo, sintoma, is_es, diasRegistrados = 0, racha = 0, restricciones, condiciones, tdee }) {
  const claveSintoma = normalizarSintoma(sintoma);
  const claveObjetivo = normalizarObjetivo(objetivo);
  const entrada = (claveSintoma && LECTURAS[claveSintoma]) || GENERAL_POR_OBJETIVO[claveObjetivo];
  const d = { nombre: nombre || (is_es ? 'Hola' : 'Hi'), is_es, diasRegistrados, racha, objetivo: claveObjetivo };

  const plan = entrada.plan(d).map(item => {
    if (item.tipo !== 'nutricion') return item;

    // Prioridad: una condición médica real (si aplica) reemplaza la acción de nutrición.
    const clavesCondicion = normalizarCondiciones(condiciones);
    const condicionAplicable = ORDEN_CONDICIONES.find(c => clavesCondicion.includes(c));
    if (condicionAplicable) {
      const ad = ADAPTACION_CONDICION[condicionAplicable][is_es ? 'es' : 'en'];
      return { ...item, accion: ad.accion, porque: ad.porque, etiqueta: ad.etiqueta };
    }

    // Si no hay condición, ajustamos por restricción alimentaria solo si el texto entra en conflicto.
    const claveRestriccion = normalizarRestriccion(restricciones);
    if (claveRestriccion) {
      const ajuste = ajustarPorRestriccion(item.accion, claveRestriccion, is_es);
      if (ajuste) return { ...item, accion: ajuste.accion, etiqueta: ajuste.etiqueta };
    }

    return item;
  });

  return {
    lectura: entrada.lectura(d),
    plan,
    objetivoKcal: calcularObjetivoKcal(tdee, claveObjetivo),
  };
}
