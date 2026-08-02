// Motor de lecturas: convierte objetivo + síntoma principal (del quiz) + datos
// reales de la usuaria en una lectura diaria y un plan de 3 acciones, sin
// esperar a ninguna API (instantáneo). /api/lumi queda solo para el chat y
// la ampliación bajo demanda.
//
// ROTACIÓN DIARIA: cada acción (nutrición/movimiento/interior) tiene varias
// variantes reales, con base fisiológica, en vez de un único texto fijo.
// Cada columna tiene un número de variantes distinto y coprimo entre sí
// (nutrición 5, movimiento 6, interior 7) para que ninguna columna por
// separado se note en un ciclo corto, y la combinación de las tres no se
// repita hasta pasados 210 días (mcm(5,6,7)=210). El día de referencia es
// el día del mes (1-31), así que cambia todos los días sin depender de si
// hubo check-in.

// Check-in de hoy (5 emojis: Bien/Cansada/Con niebla/Regular/Hinchada) → reconocimiento breve,
// específico a ella (nunca "algunas mujeres..."), que se antepone a la lectura del día.
const RECONOCIMIENTO_ESTADO = {
  bien: { es: 'Hoy amaneces bien.', en: 'You wake up feeling good today.' },
  cansada: { es: 'Hoy amaneces cansada.', en: 'You wake up tired today.' },
  niebla: { es: 'Hoy notas la mente con niebla.', en: 'You notice your mind foggy today.' },
  regular: { es: 'Hoy amaneces regular.', en: 'You wake up so-so today.' },
  hinchada: { es: 'Hoy amaneces hinchada.', en: 'You wake up bloated today.' },
};

// El check-in guarda 'sintoma_hoy' como texto (bien/cansancio/niebla mental/regular/hinchazón).
// Este mapa recupera la clave del emoji original a partir de ese texto guardado.
const SINTOMA_HOY_A_ESTADO = { 'bien':'bien', 'cansancio':'cansada', 'niebla mental':'niebla', 'regular':'regular', 'hinchazón':'hinchada' };
export function estadoDesdeSintomaHoy(sintomaHoy) {
  return SINTOMA_HOY_A_ESTADO[sintomaHoy] || null;
}

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

// ---------------------------------------------------------------------------
// Banco de variantes por síntoma/objetivo. Cada columna (nutricion/movimiento/
// interior) es un array de variantes {es:{accion,porque}, en:{accion,porque}}.
// nutricion → 5 variantes · movimiento → 6 · interior → 7 (mcm = 210 días).
// ---------------------------------------------------------------------------
const BANCO = {
  hinchazon: {
    icons: { nutricion: '🍽', movimiento: '🚶‍♀️', interior: '🌙' },
    nutricion: [
      { es:{ accion:'Empieza el plato por la verdura (medio plato) y deja el hidrato (una taza) para el final', porque:'Cambia la velocidad a la que digieres y suaviza la subida de glucosa de después de comer.' },
        en:{ accion:'Start your plate with vegetables (half the plate), leave the carbs (one cup) for last', porque:'It changes how fast you digest and softens the glucose rise after eating.' } },
      { es:{ accion:'Reduce hoy la sal añadida y los ultraprocesados — dale sabor con limón, ajo o hierbas frescas', porque:'El exceso de sodio desequilibra tu proporción sodio-potasio, y es esa proporción, no la comida en sí, la que más retiene líquido.' },
        en:{ accion:'Cut back on added salt and processed food today — season with lemon, garlic or fresh herbs instead', porque:'Excess sodium throws off your sodium-potassium balance, and that balance — not the food itself — is what drives fluid retention.' } },
      { es:{ accion:'Evita hoy las bebidas con gas y el chicle', porque:'Ambos introducen aire extra en tu digestión, una de las causas más directas de la hinchazón visible.' },
        en:{ accion:'Skip carbonated drinks and chewing gum today', porque:'Both add extra air to your digestion, one of the most direct causes of visible bloating.' } },
      { es:{ accion:'Prueba a comer la fruta sola hoy, separada de las comidas principales', porque:'Combinada con otros alimentos que fermentan a otro ritmo, la fruta puede generar más gas del habitual.' },
        en:{ accion:'Try eating fruit on its own today, apart from main meals', porque:'Combined with other foods that ferment at a different pace, fruit can produce more gas than usual.' } },
      { es:{ accion:'Si notas que te hinchan, hoy reduce las legumbres muy secas o poco remojadas', porque:'Los oligosacáridos de las legumbres fermentan en el colon — remojarlas bien y cocinarlas a fondo reduce ese efecto.' },
        en:{ accion:'If they tend to bloat you, cut back today on very dry or under-soaked legumes', porque:'The oligosaccharides in legumes ferment in the colon — soaking and cooking them well reduces that effect.' } },
    ],
    movimiento: [
      { es:{ accion:'15 min de paseo justo al terminar de comer', porque:'Mover el cuerpo después de comer ayuda a que el estómago se vacíe mejor.' },
        en:{ accion:'15 min walk right after your meal', porque:'Moving after eating helps your stomach empty more comfortably.' } },
      { es:{ accion:'5 minutos de estiramiento suave de torso al despertar', porque:'Activa el tránsito intestinal y ayuda a liberar el aire acumulado durante la noche.' },
        en:{ accion:'5 minutes of gentle torso stretching on waking', porque:'It activates your gut transit and helps release air trapped overnight.' } },
      { es:{ accion:'Sube y baja escaleras un par de veces hoy, en vez de solo caminar llano', porque:'El movimiento vertical estimula el peristaltismo más que caminar en plano.' },
        en:{ accion:'Take the stairs up and down a couple of times today, not just flat walking', porque:'Vertical movement stimulates gut motility more than walking on flat ground.' } },
      { es:{ accion:'Postura de rodillas al pecho, 2 minutos antes de dormir', porque:'Es una postura clásica para liberar gases atrapados — notarás por qué se recomienda tanto.' },
        en:{ accion:'Knees-to-chest stretch, 2 minutes before bed', porque:'It is a classic position for releasing trapped gas — you will feel why it is so often recommended.' } },
      { es:{ accion:'Hazte un masaje suave en el abdomen en sentido de las agujas del reloj, 2 minutos', porque:'Sigue el sentido natural de tu colon y ayuda a mover el gas atrapado.' },
        en:{ accion:'Give your belly a gentle clockwise massage for 2 minutes', porque:'It follows the natural direction of your colon and helps move trapped gas along.' } },
      { es:{ accion:'Prueba yoga suave o posturas de torsión ligera hoy', porque:'Las torsiones suaves estimulan mecánicamente el tránsito intestinal.' },
        en:{ accion:'Try gentle yoga or light twisting poses today', porque:'Gentle twists mechanically stimulate gut transit.' } },
    ],
    interior: [
      { es:{ accion:'3 respiraciones lentas antes del primer bocado', porque:'Comer con el cuerpo en calma cambia cómo lo digieres. Un minuto, nada más.' },
        en:{ accion:'3 slow breaths before your first bite', porque:'Eating with a calm body changes how you digest. Just one minute.' } },
      { es:{ accion:'Come sin pantallas al menos una comida hoy', porque:'Comer distraída hace que tragues más aire y comas más rápido — ambas cosas empeoran la hinchazón.' },
        en:{ accion:'Eat at least one meal today without screens', porque:'Eating distracted makes you swallow more air and eat faster — both worsen bloating.' } },
      { es:{ accion:'Mastica cada bocado un poco más despacio hoy', porque:'Masticar poco obliga al estómago a trabajar de más y genera más gas al digerir.' },
        en:{ accion:'Chew each bite a little slower today', porque:'Under-chewing makes your stomach work harder and produces more gas during digestion.' } },
      { es:{ accion:'Prueba una infusión de manzanilla o hinojo después de comer', porque:'Ambas son carminativas — ayudan a expulsar el gas retenido de forma natural.' },
        en:{ accion:'Try a chamomile or fennel tea after eating', porque:'Both are carminative — they help release trapped gas naturally.' } },
      { es:{ accion:'Pon la mano en el abdomen y respira hacia ella, no hacia el pecho, un par de minutos', porque:'La respiración abdominal masajea el intestino desde dentro y relaja la tensión que agrava la hinchazón.' },
        en:{ accion:'Put your hand on your belly and breathe into it, not your chest, for a couple of minutes', porque:'Belly breathing massages your gut from the inside and eases the tension that worsens bloating.' } },
      { es:{ accion:'Evita hablar mientras comes muy rápido hoy, tómate tu tiempo', porque:'Comer y hablar deprisa a la vez multiplica el aire que tragas sin darte cuenta.' },
        en:{ accion:'Avoid talking while eating too fast today, take your time', porque:'Eating and talking fast at the same time multiplies the air you swallow without noticing.' } },
      { es:{ accion:'Anota qué comida de hoy te hinchó más', porque:'Ese registro es lo que me permite identificar tu propio disparador, no uno genérico.' },
        en:{ accion:'Note which meal bloated you most today', porque:'That log is what lets me spot your own trigger, not a generic one.' } },
    ],
  },

  cansancio: {
    icons: { nutricion: '💧', movimiento: '☀️', interior: '⏸️' },
    nutricion: [
      { es:{ accion:'2 vasos de agua al despertar, antes del café', porque:'La deshidratación leve ya reduce tu energía y tu foco — llegas deshidratada de la noche.' },
        en:{ accion:'2 glasses of water on waking, before coffee', porque:'Mild dehydration already lowers your energy and focus — you wake up dehydrated from the night.' } },
      { es:{ accion:'Añade proteína real a tu desayuno hoy: huevo, yogur griego o similar', porque:'Evita el bajón de energía a media mañana que sí provoca un desayuno solo de carbohidrato.' },
        en:{ accion:'Add real protein to breakfast today: eggs, Greek yoghurt or similar', porque:'It prevents the mid-morning energy crash that a carb-only breakfast tends to cause.' } },
      { es:{ accion:'Reduce el azúcar añadido en tu primera comida de hoy', porque:'El pico de glucosa temprano se paga con un bajón de energía un par de horas después, justo cuando más lo notas.' },
        en:{ accion:'Cut back on added sugar in your first meal today', porque:'An early glucose spike is paid back with an energy dip a couple of hours later, right when you notice it most.' } },
      { es:{ accion:'Reduce el alcohol hoy si sueles tomar algo por la noche', porque:'El alcohol fragmenta el sueño profundo, la fase que más repone tu energía física.' },
        en:{ accion:"Cut back on alcohol tonight if you usually have a drink", porque:'Alcohol fragments deep sleep, the phase that restores your physical energy most.' } },
      { es:{ accion:'Incluye hierro en alguna comida hoy: lentejas, espinacas o carne roja magra', porque:'El hierro bajo es una causa común de fatiga en mujeres, sobre todo con el ciclo aún activo.' },
        en:{ accion:'Include iron in a meal today: lentils, spinach or lean red meat', porque:'Low iron is a common cause of fatigue in women, especially with an active cycle.' } },
    ],
    movimiento: [
      { es:{ accion:'5 min de luz natural en la primera hora del día', porque:'La luz de la mañana ajusta tu reloj interno y adelanta la energía de todo el día.' },
        en:{ accion:'5 min of natural light in your first hour', porque:'Morning light resets your internal clock and lifts energy for the rest of the day.' } },
      { es:{ accion:'10 min de movimiento suave cuando notes la bajada de la tarde', porque:'Mover el cuerpo en el bajón de media tarde sube la energía más que otro café.' },
        en:{ accion:'10 min of gentle movement when the afternoon dip hits', porque:'Moving during the mid-afternoon slump lifts energy more than another coffee.' } },
      { es:{ accion:'Sal a caminar 5 minutos antes de sentarte a trabajar', porque:'El movimiento matutino sube el estado de alerta de forma más rápida y estable que la cafeína.' },
        en:{ accion:'Take a 5-minute walk before you sit down to work', porque:'Morning movement raises alertness faster and more steadily than caffeine.' } },
      { es:{ accion:'Estírate 2 minutos nada más levantarte, antes de mirar el móvil', porque:'Reactiva la circulación después de horas quieta y corta el impulso de coger el teléfono medio dormida.' },
        en:{ accion:'Stretch for 2 minutes right after waking, before checking your phone', porque:'It restarts circulation after hours still, and interrupts the half-asleep phone reach.' } },
      { es:{ accion:'Sal a caminar al aire libre en tu descanso de la comida', porque:'Combina luz, aire y movimiento — los tres factores que más rápido revierten la fatiga leve.' },
        en:{ accion:'Take a walk outdoors during your lunch break', porque:'It combines light, air and movement — the three factors that fastest reverse mild fatigue.' } },
      { es:{ accion:'Evita estar sentada más de 45 min seguidos hoy sin levantarte', porque:'El sedentarismo prolongado baja el flujo sanguíneo y con él, la energía percibida.' },
        en:{ accion:"Avoid sitting for more than 45 minutes straight today", porque:'Prolonged sitting lowers blood flow, and with it, perceived energy.' } },
    ],
    interior: [
      { es:{ accion:'Una pausa de 5 min sin pantallas a media mañana', porque:'El cortisol acumulado agota tu energía mental. Una pausa corta la recupera.' },
        en:{ accion:'A 5-min screen-free pause mid-morning', porque:'Built-up cortisol drains your mental energy. A short pause restores it.' } },
      { es:{ accion:'Anota a qué hora notas más energía y a qué hora menos', porque:'Ese patrón es la pista que necesito para ajustar tu plan a tu ritmo real, no a uno genérico.' },
        en:{ accion:'Note when you feel most energised today and when least', porque:'That pattern is exactly what I need to fit your plan to your real rhythm, not a generic one.' } },
      { es:{ accion:'Hoy prueba a delegar o posponer una tarea que no sea urgente', porque:'Reservar energía mental para lo importante es tan válido como reservarla físicamente.' },
        en:{ accion:'Try delegating or postponing one non-urgent task today', porque:'Saving mental energy for what matters is as valid as saving physical energy.' } },
      { es:{ accion:'Haz la tarea más exigente del día en tu franja de más energía, no a la fuerza por la mañana', porque:'Trabajar contra tu ritmo natural es una de las formas más silenciosas de agotarte.' },
        en:{ accion:'Do your hardest task in your highest-energy window, not by default in the morning', porque:'Working against your natural rhythm is one of the quietest ways to burn out.' } },
      { es:{ accion:'Cierra los ojos 5 minutos sin dormirte, solo para descansar la vista y la mente', porque:'Bajar el estímulo visual un momento reduce la fatiga mental de forma medible.' },
        en:{ accion:'Close your eyes for 5 minutes without sleeping, just to rest your eyes and mind', porque:'Lowering visual stimulation for a moment measurably reduces mental fatigue.' } },
      { es:{ accion:'Revisa si dormiste realmente 7h o menos anoche', porque:'El cansancio de hoy casi siempre se explica por la noche de ayer, más que por el día de hoy.' },
        en:{ accion:'Check whether you really slept 7h or less last night', porque:"Today's fatigue is almost always explained by last night, more than by today itself." } },
      { es:{ accion:'Haz una sola cosa importante hoy y date por satisfecha', porque:'El cansancio también es mental — reducir la lista de exigencias baja el gasto de energía cognitiva.' },
        en:{ accion:'Do just one important thing today and let that be enough', porque:'Fatigue is also mental — trimming your list of demands lowers cognitive energy spend.' } },
    ],
  },

  niebla: {
    icons: { nutricion: '🥑', movimiento: '💧', interior: '⏸️' },
    nutricion: [
      { es:{ accion:'Omega-3 en el desayuno: un puñado de nueces, medio aguacate o una palma de mano de salmón', porque:'El DHA es el principal ácido graso del cerebro y reduce la neuroinflamación que causa niebla.' },
        en:{ accion:'Omega-3 at breakfast: a handful of walnuts, half an avocado or a palm-sized piece of salmon', porque:"DHA is the brain's main fatty acid and reduces the neuroinflammation behind brain fog." } },
      { es:{ accion:'Reduce hoy el azúcar añadido y los ultraprocesados', porque:'Los picos de glucosa seguidos de bajones están entre las causas más directas de niebla mental.' },
        en:{ accion:'Cut back on added sugar and processed food today', porque:'Glucose spikes followed by crashes are among the most direct causes of brain fog.' } },
      { es:{ accion:'Añade un huevo o alguna fuente de colina a tu desayuno si puedes', porque:'La colina es precursora de un neurotransmisor clave para la memoria y la concentración.' },
        en:{ accion:'Add an egg or another choline source to breakfast if you can', porque:'Choline is a precursor to a neurotransmitter that is key for memory and focus.' } },
      { es:{ accion:'Reduce el alcohol hoy si puedes', porque:'Afecta la memoria a corto plazo incluso en cantidades moderadas, y su efecto dura más de lo que se nota.' },
        en:{ accion:'Cut back on alcohol today if you can', porque:'It affects short-term memory even in moderate amounts, and the effect lasts longer than you would notice.' } },
      { es:{ accion:'Añade antioxidantes hoy: arándanos, moras o té verde', porque:'Protegen a las neuronas del estrés oxidativo, uno de los factores ligados a la niebla mental.' },
        en:{ accion:'Add antioxidants today: blueberries, blackberries or green tea', porque:'They protect neurons from oxidative stress, one of the factors linked to brain fog.' } },
    ],
    movimiento: [
      { es:{ accion:'Botella de agua a la vista todo el día', porque:'Tu cerebro es 75% agua — una deshidratación del 2% ya nubla la memoria y el foco.' },
        en:{ accion:'Keep a water bottle in sight all day', porque:'Your brain is 75% water — 2% dehydration already clouds memory and focus.' } },
      { es:{ accion:'10 min de paseo a paso ligero, sin música ni pantalla', porque:'El movimiento aeróbico corto mejora el riego sanguíneo cerebral y la claridad casi al instante.' },
        en:{ accion:'10 min brisk walk, no music or screen', porque:'Short aerobic movement improves blood flow to the brain and clears fog almost instantly.' } },
      { es:{ accion:'Cambia de postura o de habitación cada hora si trabajas sentada', porque:'El movimiento frecuente, aunque sea pequeño, mantiene el flujo sanguíneo que la quietud prolongada reduce.' },
        en:{ accion:'Change position or room every hour if you work seated', porque:'Frequent small movement keeps up the blood flow that prolonged stillness reduces.' } },
      { es:{ accion:'Sal al exterior 5 minutos a media mañana', porque:'El aire fresco y la luz natural reactivan el estado de alerta mejor que un café más.' },
        en:{ accion:'Step outside for 5 minutes mid-morning', porque:'Fresh air and natural light reset your alertness better than another coffee.' } },
      { es:{ accion:'Haz una tarea manual hoy que no sea de pantalla: cocinar, ordenar, dibujar', porque:'Las tareas manuales activan zonas cerebrales distintas y descansan las que más agota la niebla mental.' },
        en:{ accion:"Do a hands-on task today that isn't a screen: cooking, tidying, drawing", porque:'Manual tasks engage different brain areas and rest the ones brain fog wears out most.' } },
      { es:{ accion:'Ventila bien tu espacio de trabajo hoy', porque:'El exceso de CO2 en espacios cerrados reduce de forma medible la claridad mental en pocas horas.' },
        en:{ accion:'Air out your workspace well today', porque:'Excess CO2 in closed rooms measurably reduces mental clarity within hours.' } },
    ],
    interior: [
      { es:{ accion:'Una sola tarea a la vez durante 25 min, sin cambiar de ventana', porque:'Cambiar de tarea constantemente es lo que más agota tu claridad mental, más que el cansancio en sí.' },
        en:{ accion:'One task at a time for 25 min, no tab-switching', porque:'Constantly switching tasks drains your mental clarity more than tiredness itself.' } },
      { es:{ accion:'Si puedes, échate 20 min de siesta o cierra los ojos 10 min', porque:'El descanso breve consolida memoria y le da al cerebro el reinicio que la cafeína no puede darle.' },
        en:{ accion:'If you can, nap for 20 min or close your eyes for 10', porque:'Short rest consolidates memory and gives your brain a reset caffeine cannot.' } },
      { es:{ accion:'Escribe a mano lo que tienes que recordar hoy, no solo en el móvil', porque:'Escribir a mano activa una codificación de memoria distinta y más profunda que escribir en pantalla.' },
        en:{ accion:'Write down what you need to remember today by hand, not just on your phone', porque:'Handwriting engages a deeper, different kind of memory encoding than typing.' } },
      { es:{ accion:'Silencia las notificaciones durante un bloque de 30 min hoy', porque:'Cada interrupción le cuesta al cerebro varios minutos recuperar el hilo — es la niebla que tú misma no ves venir.' },
        en:{ accion:'Mute notifications for one 30-min block today', porque:'Every interruption costs your brain several minutes to refocus — that is fog you do not see coming.' } },
      { es:{ accion:'Bebe agua antes de intentar recordar algo que se te resiste', porque:'Muchas veces lo que sientes como "no me viene la palabra" es simplemente sed disfrazada.' },
        en:{ accion:'Drink water before you try to recall something that is not coming to you', porque:'What feels like "I can\'t find the word" is often just thirst in disguise.' } },
      { es:{ accion:'Haz una lista corta de solo 3 prioridades para hoy', porque:'Demasiadas prioridades a la vez son de las causas más comunes de esa sensación de niebla.' },
        en:{ accion:'Make a short list of just 3 priorities for today', porque:'Too many priorities at once is one of the most common causes of that foggy feeling.' } },
      { es:{ accion:'Repite en voz alta lo que acabas de leer o decidir', porque:'Verbalizar refuerza la memoria de trabajo cuando notas que las ideas se te escapan.' },
        en:{ accion:'Say out loud what you just read or decided', porque:'Saying it out loud reinforces working memory when ideas keep slipping away.' } },
    ],
  },

  insomnio: {
    icons: { nutricion: '☕', movimiento: '🌡️', interior: '🚫' },
    nutricion: [
      { es:{ accion:'Última cafeína antes de las 14:00', porque:'La cafeína tarda hasta 8 horas en salir de tu cuerpo — sigue activa cuando intentas dormir.' },
        en:{ accion:'Last caffeine before 2pm', porque:'Caffeine takes up to 8 hours to leave your body — it is still active when you try to sleep.' } },
      { es:{ accion:'Cena ligera y evita el alcohol esta noche', porque:'El alcohol ayuda a dormirte pero fragmenta el sueño profundo — te despiertas más veces sin notarlo.' },
        en:{ accion:'Have a light dinner and skip alcohol tonight', porque:'Alcohol helps you fall asleep but fragments deep sleep — you wake up more without noticing.' } },
      { es:{ accion:'Prueba un puñado de almendras o un plátano de postre esta noche', porque:'Ambos aportan magnesio y triptófano, precursores naturales de la melatonina.' },
        en:{ accion:'Try a handful of almonds or a banana for dessert tonight', porque:'Both provide magnesium and tryptophan, natural precursors of melatonin.' } },
      { es:{ accion:'Evita las comidas muy picantes en la cena de hoy', porque:'Suben tu temperatura corporal justo cuando necesita bajar para iniciar el sueño.' },
        en:{ accion:'Avoid very spicy food at dinner today', porque:'It raises your body temperature right when it needs to drop to start sleep.' } },
      { es:{ accion:'Prueba una infusión de valeriana o pasiflora esta noche', porque:'Ambas cuentan con evidencia como apoyo suave para conciliar el sueño.' },
        en:{ accion:'Try a valerian or passionflower tea tonight', porque:'Both have evidence as gentle aids for falling asleep.' } },
    ],
    movimiento: [
      { es:{ accion:'Dormitorio a 18-20°C esta noche', porque:'Tu temperatura corporal debe bajar 1°C para iniciar el sueño profundo. El frío lo facilita.' },
        en:{ accion:'Bedroom at 18-20°C tonight', porque:'Your body temperature must drop 1°C to start deep sleep. A cool room helps that happen.' } },
      { es:{ accion:'20 min de movimiento suave por la tarde, no después de las 19h', porque:'El ejercicio por la tarde mejora la calidad del sueño; muy tarde, la retrasa.' },
        en:{ accion:'20 min of gentle movement in the afternoon, not after 7pm', porque:'Afternoon exercise improves sleep quality; too late, it delays it.' } },
      { es:{ accion:'Da un paseo corto después de cenar hoy', porque:'Ayuda a la digestión y adelanta la bajada de temperatura que tu cuerpo necesita para dormir profundo.' },
        en:{ accion:'Take a short walk after dinner today', porque:'It aids digestion and brings forward the temperature drop your body needs for deep sleep.' } },
      { es:{ accion:'Ducha templada, no muy caliente, una hora antes de dormir', porque:'El descenso de temperatura al salir de la ducha imita la caída térmica natural que induce el sueño.' },
        en:{ accion:'Warm — not hot — shower an hour before bed', porque:'The temperature drop after the shower mimics the natural thermal dip that triggers sleep.' } },
      { es:{ accion:'Evita el ejercicio intenso después de las 20h hoy', porque:'Sube tu temperatura y tu adrenalina justo cuando tu cuerpo debería estar bajando revoluciones.' },
        en:{ accion:'Avoid intense exercise after 8pm today', porque:'It raises temperature and adrenaline right when your body should be winding down.' } },
      { es:{ accion:'Sal a que te dé la luz del sol en algún momento del día', porque:'La exposición a luz diurna refuerza tu ritmo circadiano y mejora la calidad del sueño esa misma noche.' },
        en:{ accion:'Get some daylight at some point today', porque:"Daytime light exposure strengthens your circadian rhythm and improves tonight's sleep quality." } },
    ],
    interior: [
      { es:{ accion:'Sin pantallas 1h antes de dormir', porque:'La luz azul suprime la melatonina hasta 3 horas — sin ella, tu ciclo se regula solo.' },
        en:{ accion:'No screens 1h before bed', porque:'Blue light suppresses melatonin for up to 3 hours — without it, your cycle regulates itself.' } },
      { es:{ accion:'Escribe en un papel lo que te preocupa antes de acostarte', porque:'Sacarlo de la cabeza reduce los pensamientos que te mantienen despierta dando vueltas.' },
        en:{ accion:'Write down what is worrying you before bed', porque:'Getting it out of your head reduces the thoughts that keep you tossing and turning.' } },
      { es:{ accion:'Prepara mañana esta noche: ropa, agenda, lo que puedas', porque:'Reduce los pensamientos de última hora sobre la lista de mañana justo cuando intentas desconectar.' },
        en:{ accion:'Prep tomorrow tonight: clothes, agenda, whatever you can', porque:"It cuts down the last-minute thoughts about tomorrow's list right when you're trying to switch off." } },
      { es:{ accion:'Prueba la respiración 4-7-8: inhala 4, mantén 7, exhala 8, cuatro veces', porque:'Alargar la exhalación activa el sistema nervioso que te prepara para dormir.' },
        en:{ accion:'Try 4-7-8 breathing: inhale 4, hold 7, exhale 8, four times', porque:'A longer exhale activates the nervous system that prepares you for sleep.' } },
      { es:{ accion:'Atenúa las luces de casa la última hora antes de acostarte', porque:'La luz brillante por la noche retrasa la señal que le dice a tu cerebro que ya es de noche.' },
        en:{ accion:'Dim the lights at home in the last hour before bed', porque:"Bright light at night delays the signal that tells your brain it's nighttime." } },
      { es:{ accion:'Reserva la cama solo para dormir hoy, nada de trabajar desde ahí', porque:'Tu cerebro asocia la cama con la actividad que hagas en ella — refuerza que sea solo dormir.' },
        en:{ accion:'Keep the bed just for sleeping today, no working from there', porque:'Your brain associates the bed with whatever you do in it — reinforce that it is just for sleep.' } },
      { es:{ accion:'Si no te duermes en 20 min, levántate un momento y vuelve cuando tengas sueño real', porque:'Quedarte dando vueltas en la cama refuerza la asociación cama-insomnio a largo plazo.' },
        en:{ accion:"If you're not asleep in 20 min, get up for a moment and come back when truly sleepy", porque:'Tossing and turning in bed reinforces the bed-insomnia association long term.' } },
    ],
  },

  animo: {
    icons: { nutricion: '🌾', movimiento: '🚶‍♀️', interior: '🫁' },
    nutricion: [
      { es:{ accion:'Una ración extra de fibra hoy: un puñado de legumbres, media taza de avena o un plato de verdura', porque:'La fibra alimenta a la microbiota que fabrica gran parte de la serotonina de tu cuerpo — tu ánimo también se cocina en el intestino.' },
        en:{ accion:'An extra serving of fibre today: a handful of legumes, half a cup of oats or a plate of vegetables', porque:'Fibre feeds the gut bacteria that make most of your body\'s serotonin — your mood is also cooked in your gut.' } },
      { es:{ accion:'Prioriza el magnesio hoy: cacao puro, almendras o espinacas', porque:'El magnesio es de los primeros minerales que se agotan con el estrés, y su déficit está ligado a más irritabilidad y peor ánimo.' },
        en:{ accion:'Prioritise magnesium today: raw cacao, almonds or spinach', porque:'Magnesium is among the first minerals depleted by stress, and low levels are linked to more irritability and lower mood.' } },
      { es:{ accion:'No te saltes ninguna comida hoy, aunque sea pequeña', porque:'Las bajadas de glucosa por ayunos largos se sienten como cambios de humor, y muchas veces lo son.' },
        en:{ accion:"Don't skip any meal today, even a small one", porque:'Glucose dips from long gaps between meals feel like mood swings — and often are.' } },
      { es:{ accion:'Reduce el alcohol hoy si puedes', porque:'Aunque relaja al principio, el alcohol es depresor y empeora el ánimo horas después.' },
        en:{ accion:'Cut back on alcohol today if you can', porque:'Though it relaxes at first, alcohol is a depressant and worsens mood hours later.' } },
      { es:{ accion:'Incluye omega-3 hoy: pescado azul, nueces o semillas de lino', porque:'Está ligado a mejor regulación del ánimo a través de su efecto antiinflamatorio.' },
        en:{ accion:'Include omega-3 today: oily fish, walnuts or flaxseed', porque:"It's linked to better mood regulation through its anti-inflammatory effect." } },
    ],
    movimiento: [
      { es:{ accion:'20 min de movimiento suave, al aire libre si puedes', porque:'El movimiento libera endorfinas y baja el cortisol de forma medible en menos de media hora.' },
        en:{ accion:'20 min of gentle movement, outdoors if you can', porque:'Movement releases endorphins and measurably lowers cortisol in under half an hour.' } },
      { es:{ accion:'Baila o mueve el cuerpo con música que te guste, 10 min', porque:'El movimiento con música que disfrutas activa la dopamina más rápido que el ejercicio neutro.' },
        en:{ accion:'Dance or move to music you love, 10 min', porque:'Movement paired with music you enjoy triggers dopamine faster than neutral exercise.' } },
      { es:{ accion:'Sal a que te dé el sol un momento hoy, aunque sean 10 minutos', porque:'La luz natural sube la serotonina de forma directa — es uno de sus efectos más rápidos y menos conocidos.' },
        en:{ accion:'Get some sun today, even just 10 minutes', porque:'Natural light directly raises serotonin — one of its fastest, least-known effects.' } },
      { es:{ accion:'Estírate despacio mientras escuchas algo que te guste', porque:'Combinar movimiento suave con algo placentero baja el cortisol por dos vías a la vez.' },
        en:{ accion:'Stretch slowly while listening to something you enjoy', porque:'Combining gentle movement with something pleasurable lowers cortisol through two channels at once.' } },
      { es:{ accion:'Haz algo creativo hoy, aunque sean 10 minutos: dibujar, escribir, cocinar', porque:'La expresión creativa activa las mismas rutas de recompensa que el ejercicio, sin necesidad de esfuerzo físico.' },
        en:{ accion:'Do something creative today, even 10 minutes: drawing, writing, cooking', porque:'Creative expression activates the same reward pathways as exercise, no physical effort needed.' } },
      { es:{ accion:'Cuida una planta o pasa un rato cerca de la naturaleza hoy', porque:'El contacto con la naturaleza baja de forma medible el cortisol y mejora el ánimo en minutos.' },
        en:{ accion:'Tend a plant or spend time near nature today', porque:'Contact with nature measurably lowers cortisol and lifts mood within minutes.' } },
    ],
    interior: [
      { es:{ accion:'Respiración lenta, 4-6 veces por minuto, 2 minutos', porque:'Activa el nervio vago y baja el cortisol en minutos — es la vía más rápida para calmar el ánimo.' },
        en:{ accion:'Slow breathing, 4-6 breaths per minute, for 2 minutes', porque:'It activates the vagus nerve and lowers cortisol within minutes — the fastest way to steady your mood.' } },
      { es:{ accion:'Escribe 3 cosas que te hayan hecho sonreír hoy, por pequeñas que sean', porque:'Nombrar lo positivo activa circuitos de recompensa distintos a los que activa rumiar lo negativo.' },
        en:{ accion:'Write down 3 things that made you smile today, however small', porque:'Naming the positive activates different reward circuits than dwelling on the negative.' } },
      { es:{ accion:'Llama o escribe a alguien con quien te sientas bien, aunque sea un mensaje corto', porque:'La conexión social sube la oxitocina, que amortigua directamente el efecto del cortisol en tu ánimo.' },
        en:{ accion:'Call or text someone you feel good with, even a short message', porque:"Social connection raises oxytocin, which directly buffers cortisol's effect on your mood." } },
      { es:{ accion:'Pon una canción que te guste y escúchala entera, sin hacer nada más', porque:'La música activa el mismo sistema de recompensa que la comida o el ejercicio, sin ningún efecto secundario.' },
        en:{ accion:'Play a song you love and listen to the whole thing, nothing else', porque:'Music activates the same reward system as food or exercise, with no downside.' } },
      { es:{ accion:'Sal al exterior un momento y fíjate en algo concreto: un color, un sonido, un olor', porque:'Anclar la atención en el presente corta el bucle de pensamientos que alimenta el bajón de ánimo.' },
        en:{ accion:'Step outside for a moment and notice one specific thing: a colour, a sound, a smell', porque:'Anchoring your attention in the present interrupts the thought loop that feeds a low mood.' } },
      { es:{ accion:'Haz un acto pequeño de amabilidad hoy, aunque sea mínimo', porque:'Ayudar a otra persona activa el mismo circuito de recompensa que recibir ayuda.' },
        en:{ accion:'Do one small act of kindness today, however minor', porque:'Helping someone else activates the same reward circuit as receiving help.' } },
      { es:{ accion:'Permítete sentir lo que sientes hoy sin intentar arreglarlo enseguida', porque:'Resistirse a la emoción tiende a alargarla; nombrarla y dejarla estar suele acortarla.' },
        en:{ accion:'Let yourself feel what you feel today without rushing to fix it', porque:'Resisting an emotion tends to prolong it; naming it and letting it be usually shortens it.' } },
    ],
  },

  sofocos: {
    icons: { nutricion: '🌶️', movimiento: '🧊', interior: '🫁' },
    nutricion: [
      { es:{ accion:'Hoy prueba sin cafeína ni alcohol', porque:'Ambos dilatan los vasos sanguíneos y son de los disparadores más comunes de un sofoco.' },
        en:{ accion:'Try going without caffeine or alcohol today', porque:'Both dilate blood vessels and are among the most common hot flash triggers.' } },
      { es:{ accion:'Evita las comidas muy picantes o muy calientes hoy', porque:'Elevan tu temperatura corporal central y pueden disparar el sofoco igual que la cafeína.' },
        en:{ accion:'Avoid very spicy or very hot food today', porque:'They raise your core body temperature and can trigger a flash just like caffeine.' } },
      { es:{ accion:'Bebe agua fresca a sorbos durante todo el día, no solo cuando tengas sed', porque:'Mantenerte bien hidratada ayuda a tu cuerpo a regular mejor la temperatura.' },
        en:{ accion:'Sip cool water throughout the day, not just when thirsty', porque:'Staying well hydrated helps your body regulate temperature better.' } },
      { es:{ accion:'Prueba a añadir semillas de lino a tu desayuno hoy', porque:'Contienen lignanos con un efecto fitoestrogénico leve que a algunas mujeres les ayuda con los sofocos.' },
        en:{ accion:'Try adding flaxseed to breakfast today', porque:'It contains lignans with a mild phytoestrogenic effect that helps some women with hot flashes.' } },
      { es:{ accion:'Reduce el azúcar añadido hoy', porque:'Los picos de glucosa elevan la respuesta de tu sistema nervioso simpático, ligada a más sofocos.' },
        en:{ accion:'Cut back on added sugar today', porque:"Glucose spikes raise your body's sympathetic response, which is linked to more flashes." } },
    ],
    movimiento: [
      { es:{ accion:'Ropa en capas que puedas quitarte fácilmente', porque:'Poder enfriarte rápido corta el sofoco antes de que suba de intensidad.' },
        en:{ accion:'Wear layers you can remove easily', porque:'Being able to cool down fast cuts a hot flash short before it builds up.' } },
      { es:{ accion:'Lleva contigo agua fría o un abanico hoy', porque:'Bajar la temperatura de la piel rápido corta el sofoco antes de que suba de intensidad.' },
        en:{ accion:'Carry cold water or a fan with you today', porque:'Cooling your skin fast cuts a hot flash short before it intensifies.' } },
      { es:{ accion:'Evita el ejercicio intenso en las horas de más calor del día', porque:'El esfuerzo físico sube tu temperatura central justo cuando ya la tienes más sensible.' },
        en:{ accion:'Avoid intense exercise during the hottest hours of the day', porque:'Physical effort raises your core temperature right when it is already more sensitive.' } },
      { es:{ accion:'Elige tejidos naturales y transpirables para hoy si puedes', porque:'Dejan salir el calor mejor que las fibras sintéticas y reducen los sofocos por acumulación de calor.' },
        en:{ accion:'Choose natural, breathable fabrics today if you can', porque:'They release heat better than synthetics and reduce flashes caused by heat build-up.' } },
      { es:{ accion:'Duerme con menos capas o una ventana entreabierta esta noche', porque:'Un dormitorio más fresco reduce los sofocos nocturnos, de los que más interrumpen el sueño.' },
        en:{ accion:'Sleep with fewer layers or a window cracked open tonight', porque:'A cooler bedroom reduces night flashes, which disrupt sleep the most.' } },
      { es:{ accion:'Mantén algo de ejercicio moderado esta semana, no solo hoy', porque:'El ejercicio regular, no puntual, reduce la frecuencia de sofocos a medio plazo, aunque no el de hoy mismo.' },
        en:{ accion:'Keep up regular moderate exercise this week, not just today', porque:'Regular — not one-off — exercise reduces flash frequency over time, though not today\'s flashes specifically.' } },
    ],
    interior: [
      { es:{ accion:'Respiración lenta y profunda al notar el primer calor', porque:'Bajar la frecuencia respiratoria reduce la intensidad y duración del sofoco.' },
        en:{ accion:'Slow, deep breathing as soon as you feel the first heat', porque:'Slowing your breathing rate reduces how intense and how long the flash lasts.' } },
      { es:{ accion:'Identifica y anota qué pasaba justo antes del último sofoco', porque:'El estrés y las emociones intensas están entre los disparadores más comunes, y verlo escrito ayuda a anticiparlo.' },
        en:{ accion:'Notice and write down what was happening right before your last flash', porque:'Stress and intense emotions are among the most common triggers, and writing it down helps you get ahead of it.' } },
      { es:{ accion:'Busca un momento de calma a media tarde, antes de que suba tu estrés del día', porque:'El cortisol acumulado hace que los sofocos sean más frecuentes e intensos.' },
        en:{ accion:'Find a calm moment mid-afternoon, before the day\'s stress builds up', porque:'Built-up cortisol makes hot flashes more frequent and more intense.' } },
      { es:{ accion:'Cuando llegue el calor, para lo que estés haciendo un momento en vez de luchar contra él', porque:'Resistirlo activa más el sistema de alerta; dejarlo pasar acorta su duración real.' },
        en:{ accion:'When the heat hits, pause what you are doing instead of fighting it', porque:'Resisting it activates your alarm system more; letting it pass actually shortens it.' } },
      { es:{ accion:'Anota cuántos sofocos tuviste hoy y a qué hora', porque:'Ese registro es lo que me permite ver tu patrón real y ajustar tu plan la próxima semana.' },
        en:{ accion:'Note how many hot flashes you had today and when', porque:'That log is what lets me see your real pattern and adjust your plan next week.' } },
      { es:{ accion:'Practica relajación muscular progresiva 3 minutos hoy', porque:'Bajar la tensión general del cuerpo reduce la reactividad del centro que regula tu temperatura.' },
        en:{ accion:'Practise progressive muscle relaxation for 3 minutes today', porque:'Lowering overall body tension reduces the reactivity of the centre that regulates your temperature.' } },
      { es:{ accion:'Habla con naturalidad de tus sofocos si te apetece hoy, no los escondas', porque:'El estrés de ocultarlos y anticiparlos en público a menudo empeora la frecuencia real.' },
        en:{ accion:'Talk openly about your hot flashes today if you feel like it, no hiding them', porque:'The stress of hiding and anticipating them in public often makes the real frequency worse.' } },
    ],
  },

  antojos: {
    icons: { nutricion: '🥚', movimiento: '🚶‍♀️', interior: '💧' },
    nutricion: [
      { es:{ accion:'Proteína real en el desayuno: 2 huevos, un vaso de yogur griego o similar', porque:'La proteína del desayuno reduce los antojos de dulce por la tarde — es química, no fuerza de voluntad.' },
        en:{ accion:'Real protein at breakfast: 2 eggs, a glass of Greek yoghurt or similar', porque:'Protein at breakfast reduces afternoon sugar cravings — it is chemistry, not willpower.' } },
      { es:{ accion:'Añade grasa buena a tu desayuno: aguacate, aceite de oliva o frutos secos', porque:'Ralentiza la digestión y evita el bajón de glucosa que dispara el antojo un par de horas después.' },
        en:{ accion:'Add good fat to breakfast: avocado, olive oil or nuts', porque:'It slows digestion and prevents the glucose dip that triggers a craving a couple of hours later.' } },
      { es:{ accion:'No dejes pasar más de 4 horas sin comer algo hoy', porque:'El antojo intenso muchas veces es tu cuerpo pidiendo energía urgente después de un ayuno demasiado largo.' },
        en:{ accion:"Don't go more than 4 hours without eating something today", porque:'A strong craving is often your body urgently asking for energy after too long a gap.' } },
      { es:{ accion:'Duerme lo suficiente esta noche si puedes', porque:'Dormir poco sube la grelina y baja la leptina — sube literalmente el hambre y el antojo de dulce al día siguiente.' },
        en:{ accion:'Get enough sleep tonight if you can', porque:'Too little sleep raises ghrelin and lowers leptin — it literally increases hunger and sugar cravings the next day.' } },
      { es:{ accion:'No llegues con demasiada hambre a la compra o a cocinar hoy', porque:'Decidir con hambre extrema activa las mismas zonas cerebrales que la impulsividad.' },
        en:{ accion:'Avoid shopping or cooking while overly hungry today', porque:'Deciding on extreme hunger engages the same brain areas as impulsivity.' } },
    ],
    movimiento: [
      { es:{ accion:'2 min de caminar cuando llegue el antojo', porque:'Mover el cuerpo desvía la atención y baja el pico de glucosa que dispara las ganas de dulce.' },
        en:{ accion:'A 2-min walk when the craving hits', porque:'Moving shifts your focus and lowers the glucose spike that triggers the craving for sugar.' } },
      { es:{ accion:'Sal a que te dé el aire un momento cuando llegue el antojo', porque:'Cambiar de entorno corta el impulso automático — la mayoría de antojos duran menos de 10 minutos si no los sigues.' },
        en:{ accion:'Step outside for a moment when the craving hits', porque:"Changing your environment cuts the automatic impulse — most cravings last under 10 minutes if you don't act on them." } },
      { es:{ accion:'Lávate los dientes cuando notes ganas de picar algo dulce', porque:'El sabor a menta reduce el apetito por dulce de forma casi inmediata para mucha gente.' },
        en:{ accion:'Brush your teeth when you feel like reaching for something sweet', porque:'The taste of mint reduces the urge for sugar almost immediately for many people.' } },
      { es:{ accion:'Haz algo con las manos 5 minutos cuando llegue el antojo: ordenar, doblar ropa, lo que sea', porque:'Ocupar las manos reduce el picoteo automático casi tanto como ocupar la mente.' },
        en:{ accion:'Occupy your hands for 5 minutes when the craving hits: tidy up, fold laundry, anything', porque:'Occupying your hands cuts automatic snacking almost as much as occupying your mind.' } },
      { es:{ accion:'Cambia el dulce de sitio o sácalo de casa si puedes hoy', porque:'Reducir la disponibilidad inmediata baja notablemente la probabilidad de ceder al antojo automático.' },
        en:{ accion:'Move sweets out of sight or out of the house today if you can', porque:'Reducing immediate availability noticeably lowers the odds of giving in to an automatic craving.' } },
      { es:{ accion:'Ten a mano una alternativa que también te guste: fruta, yogur con canela', porque:'Tener una opción lista reduce la fricción de elegir algo distinto en el momento del antojo.' },
        en:{ accion:'Keep an alternative you also enjoy on hand: fruit, yoghurt with cinnamon', porque:'Having a ready option lowers the friction of choosing something else in the moment.' } },
    ],
    interior: [
      { es:{ accion:'Un vaso de agua antes de decidir', porque:'La sed se confunde muchas veces con hambre de dulce — el cuerpo pide una cosa y suena a otra.' },
        en:{ accion:'A glass of water before you decide', porque:'Thirst is often mistaken for a sugar craving — the body asks for one thing and it sounds like another.' } },
      { es:{ accion:'Espera 10 minutos antes de decidir si de verdad quieres ese dulce', porque:'El impulso baja de intensidad solo con dejarlo pasar un poco — no hace falta fuerza de voluntad, solo tiempo.' },
        en:{ accion:'Wait 10 minutes before deciding if you really want that sweet', porque:"The urge fades just by letting it sit a little — it takes time, not willpower." } },
      { es:{ accion:'Pregúntate si es hambre real o es cansancio o estrés disfrazado de antojo', porque:'Identificar la causa real cambia lo que de verdad necesitas en ese momento.' },
        en:{ accion:'Ask yourself if it is real hunger, or tiredness or stress in disguise', porque:'Naming the real cause changes what you actually need right now.' } },
      { es:{ accion:'Si decides comerlo, siéntate y disfrútalo despacio, sin culpa', porque:'Comerlo con atención plena satisface más con menos cantidad que comerlo rápido y de pie.' },
        en:{ accion:'If you do eat it, sit down and enjoy it slowly, no guilt', porque:'Eating it mindfully satisfies more with less than eating it fast and standing up.' } },
      { es:{ accion:'Anota a qué hora te dio el antojo más fuerte hoy', porque:'Ese dato es justo lo que necesito para ajustar tus comidas y adelantarme al antojo antes de que aparezca.' },
        en:{ accion:'Note what time your strongest craving hit today', porque:'That data is exactly what I need to adjust your meals and get ahead of the craving before it shows up.' } },
      { es:{ accion:'Fíjate si el antojo llega siempre a la misma hora', porque:'Un antojo que se repite a la misma hora suele ser una bajada de energía previsible, no falta de voluntad.' },
        en:{ accion:'Notice if the craving always hits around the same time', porque:'A craving that repeats at the same hour is usually a predictable energy dip, not a lack of willpower.' } },
      { es:{ accion:"Practica decir 'ahora no' en vez de 'nunca' cuando llegue el antojo", porque:'La prohibición total aumenta el deseo — darte permiso para más tarde reduce la urgencia de ahora.' },
        en:{ accion:"Practise saying 'not now' instead of 'never' when the craving hits", porque:'Total prohibition increases desire — giving yourself permission for later reduces the urgency of now.' } },
    ],
  },

  libido: {
    icons: { nutricion: '🥑', movimiento: '🚶‍♀️', interior: '🌙' },
    nutricion: [
      { es:{ accion:'Grasas buenas hoy: una cucharada de aceite de oliva, medio aguacate o un puñado de frutos secos', porque:'Tus hormonas sexuales se fabrican a partir de grasa — sin suficiente, la producción baja.' },
        en:{ accion:'Good fats today: a tablespoon of olive oil, half an avocado or a handful of nuts', porque:'Your sex hormones are built from fat — without enough, production drops.' } },
      { es:{ accion:'Prioriza el zinc hoy: semillas de calabaza, garbanzos o carne magra', porque:'El zinc participa directamente en la producción de hormonas sexuales.' },
        en:{ accion:'Prioritise zinc today: pumpkin seeds, chickpeas or lean meat', porque:'Zinc is directly involved in sex hormone production.' } },
      { es:{ accion:'Reduce el alcohol hoy si puedes', porque:'Aunque relaja al principio, a partir de dos copas reduce la sensibilidad y la producción hormonal.' },
        en:{ accion:'Cut back on alcohol today if you can', porque:'It may relax you at first, but past a couple of drinks it lowers sensitivity and hormone production.' } },
      { es:{ accion:'Reduce el azúcar y los ultraprocesados hoy', porque:'Afectan a la microbiota y a la inflamación general, ambas ligadas de forma indirecta a la salud hormonal y el deseo.' },
        en:{ accion:'Cut back on sugar and processed food today', porque:'They affect gut bacteria and overall inflammation, both indirectly linked to hormonal health and desire.' } },
      { es:{ accion:'Incluye vitamina D hoy si puedes: pescado azul, huevo o un rato de sol', porque:'Los niveles bajos de vitamina D se han asociado con menor deseo sexual en varios estudios.' },
        en:{ accion:'Include vitamin D today if you can: oily fish, eggs or some sun', porque:'Low vitamin D levels have been linked to lower sexual desire in several studies.' } },
    ],
    movimiento: [
      { es:{ accion:'20 min de movimiento que disfrutes, sin más objetivo que eso', porque:'El movimiento baja el cortisol acumulado, que es uno de los frenos más directos del deseo.' },
        en:{ accion:'20 min of movement you enjoy, no other goal', porque:'Movement lowers built-up cortisol, one of the most direct brakes on desire.' } },
      { es:{ accion:'Date un baño o ducha relajante sin prisa hoy', porque:'Bajar el estrés físico es de las formas más rápidas de quitarle el freno al deseo.' },
        en:{ accion:'Take a slow, relaxing bath or shower today', porque:'Lowering physical stress is one of the fastest ways to take the brake off desire.' } },
      { es:{ accion:'Camina o muévete al aire libre en algún momento del día', porque:'El movimiento en exterior baja el cortisol más que el mismo movimiento en interior.' },
        en:{ accion:'Walk or move outdoors at some point today', porque:'Movement outdoors lowers cortisol more than the same movement indoors.' } },
      { es:{ accion:'Haz algo de fuerza suave hoy, aunque sean 10 minutos', porque:'El ejercicio de fuerza apoya la producción de testosterona, hormona también implicada en el deseo femenino.' },
        en:{ accion:'Do some light strength work today, even 10 minutes', porque:'Strength training supports testosterone production, a hormone also involved in female desire.' } },
      { es:{ accion:'Baila o muévete de forma sensual contigo misma hoy, sin público ni juicio', porque:'Reconectar con el propio cuerpo en movimiento es, en sí mismo, parte del camino de vuelta al deseo.' },
        en:{ accion:'Dance or move sensually for yourself today, no audience, no judgement', porque:'Reconnecting with your own body through movement is, in itself, part of the way back to desire.' } },
      { es:{ accion:'Sal a que te dé el sol un rato hoy', porque:'La luz solar sube la vitamina D y la serotonina, ambas ligadas a mejor deseo.' },
        en:{ accion:'Get some sun today', porque:'Sunlight raises both vitamin D and serotonin, both linked to better desire.' } },
    ],
    interior: [
      { es:{ accion:'Prioriza dormir 7-8h esta noche', porque:'El descanso insuficiente baja directamente las hormonas relacionadas con el deseo al día siguiente.' },
        en:{ accion:'Prioritise 7-8h of sleep tonight', porque:'Not enough rest directly lowers desire-related hormones the next day.' } },
      { es:{ accion:'Dedica 10 min a algo que disfrutes sin ninguna otra finalidad', porque:'El deseo necesita espacio mental libre de tareas pendientes para poder aparecer.' },
        en:{ accion:'Spend 10 min on something you enjoy for no other reason', porque:'Desire needs mental space free of pending tasks to be able to show up.' } },
      { es:{ accion:'Baja el ritmo la última hora del día, sin pantallas ni tareas pendientes', porque:'El deseo casi nunca aparece con el sistema nervioso en modo alerta.' },
        en:{ accion:'Slow down in the last hour of the day, no screens or pending tasks', porque:'Desire almost never shows up while your nervous system is on high alert.' } },
      { es:{ accion:'Cuida tu cuerpo hoy de alguna forma, aunque sea una crema con calma', porque:'Reconectar con el propio cuerpo sin prisa es, en sí mismo, parte del camino de vuelta al deseo.' },
        en:{ accion:'Take a moment to care for your body today, even just unhurried lotion time', porque:'Reconnecting with your own body without rushing is, in itself, part of the way back to desire.' } },
      { es:{ accion:'Habla de cómo te sientes con alguien de confianza, si te apetece', porque:'El estrés no dicho es de los frenos más silenciosos del deseo — nombrarlo ya alivia.' },
        en:{ accion:'Talk about how you feel with someone you trust, if you feel like it', porque:'Unspoken stress is one of the quietest brakes on desire — naming it already helps.' } },
      { es:{ accion:'Reduce la carga mental hoy: escribe tu lista de pendientes y ciérrala por hoy', porque:'El deseo compite directamente con la sobrecarga mental — vaciar la cabeza le hace sitio.' },
        en:{ accion:"Lighten your mental load today: write your to-do list and close it for the day", porque:'Desire competes directly with mental overload — clearing your head makes room for it.' } },
      { es:{ accion:'Dedica un momento a agradecer algo de tu cuerpo hoy, no a corregirlo', porque:'La relación con el propio cuerpo influye directamente en cuánto espacio le das al deseo.' },
        en:{ accion:'Take a moment to appreciate something about your body today, not fix it', porque:'Your relationship with your own body directly shapes how much room you give to desire.' } },
    ],
  },
};

// Fallback por objetivo (día 1-2 sin síntoma registrado, o síntoma no reconocido).
const BANCO_OBJETIVO = {
  peso: {
    icons: { nutricion: '🕗', movimiento: '🚶', interior: '🌙' },
    nutricion: [
      { es:{ accion:'Desayuna antes de las 9am con una palma de mano de proteína', porque:'El cortisol matutino está en su pico — la proteína lo estabiliza y frena el catabolismo muscular.' },
        en:{ accion:'Breakfast before 9am with a palm-sized portion of protein', porque:'Morning cortisol peaks early — protein stabilises it and prevents muscle breakdown.' } },
      { es:{ accion:'Empieza cada comida principal por la verdura o ensalada hoy', porque:'Comer fibra primero suaviza notablemente la subida de glucosa del resto del plato.' },
        en:{ accion:"Start every main meal with vegetables or salad today", porque:'Eating fibre first noticeably softens the glucose rise from the rest of the plate.' } },
      { es:{ accion:'Sirve tu plato en la cocina, no comas directamente del envase', porque:'Ver la ración completa reduce de forma medible cuánto acabas comiendo.' },
        en:{ accion:"Plate your food in the kitchen, don't eat straight from the container", porque:'Seeing the full portion measurably reduces how much you end up eating.' } },
      { es:{ accion:'Reduce las bebidas azucaradas y el alcohol hoy', porque:'Son de las fuentes de calorías más fáciles de reducir sin notar hambre real.' },
        en:{ accion:'Cut back on sugary drinks and alcohol today', porque:"They're among the easiest calorie sources to cut without feeling real hunger." } },
      { es:{ accion:'Prioriza hoy alimentos con volumen y poca densidad calórica: verdura, caldo, ensalada', porque:'Sacian por volumen antes de sumar muchas calorías.' },
        en:{ accion:'Prioritise high-volume, low-calorie-density foods today: vegetables, broth, salad', porque:'They fill you up by volume before adding many calories.' } },
    ],
    movimiento: [
      { es:{ accion:'Camina 20 min después de comer', porque:'Reduce el pico de insulina postcomida de forma notable.' },
        en:{ accion:'Walk 20 min after meals', porque:'It noticeably reduces the post-meal insulin spike.' } },
      { es:{ accion:'Sube escaleras en vez de ascensor todas las veces que puedas hoy', porque:'El movimiento breve y repetido a lo largo del día suma tanto como una sesión larga, y es más fácil de mantener.' },
        en:{ accion:'Take the stairs instead of the lift whenever you can today', porque:"Short, repeated movement through the day adds up as much as one long session, and is easier to sustain." } },
      { es:{ accion:'Añade 10 min de fuerza hoy, aunque sea con tu propio peso', porque:'El músculo es tu tejido más activo metabólicamente — cada kilo quema energía incluso en reposo.' },
        en:{ accion:'Add 10 min of strength work today, even just bodyweight', porque:'Muscle is your most metabolically active tissue — every kilo burns energy even at rest.' } },
      { es:{ accion:'Aparca más lejos o bájate una parada antes hoy', porque:'Los pasos que no notas son los que más fácil se sostienen en el tiempo.' },
        en:{ accion:'Park further away or get off one stop early today', porque:"The steps you don't notice are the ones that are easiest to keep up long term." } },
      { es:{ accion:'Añade 10 min de fuerza además del cardio de hoy', porque:'El músculo extra sube tu gasto calórico incluso en reposo, a diferencia del cardio solo.' },
        en:{ accion:"Add 10 min of strength on top of today's cardio", porque:'Extra muscle raises your calorie burn even at rest, unlike cardio alone.' } },
      { es:{ accion:'Camina mientras hablas por teléfono hoy en vez de sentarte', porque:'Sumar pasos a actividades que ya haces es de las formas más sostenibles de moverte más.' },
        en:{ accion:"Walk while you're on the phone today instead of sitting", porque:'Adding steps to things you already do is one of the most sustainable ways to move more.' } },
    ],
    interior: [
      { es:{ accion:'Cena antes de las 8pm', porque:'La sensibilidad a la insulina baja por la noche — cenar tarde almacena más grasa.' },
        en:{ accion:'Dinner before 8pm', porque:'Insulin sensitivity drops at night — a late dinner stores more fat.' } },
      { es:{ accion:'Duerme al menos 7 horas esta noche si puedes', porque:'Dormir poco sube la grelina, la hormona del hambre, al día siguiente.' },
        en:{ accion:'Sleep at least 7 hours tonight if you can', porque:'Sleeping too little raises ghrelin, your hunger hormone, the next day.' } },
      { es:{ accion:'Come sin pantallas al menos una comida hoy', porque:'Comer distraída te lleva a comer más sin darte cuenta.' },
        en:{ accion:'Eat at least one meal today without screens', porque:'Eating distracted leads you to eat more without noticing.' } },
      { es:{ accion:'Anota cómo te sentiste después de cada comida hoy', porque:'Ese registro es lo que me permite afinar tu plan a lo que de verdad te sienta bien, no a una tabla genérica.' },
        en:{ accion:'Note how you felt after each meal today', porque:'That log is what lets me tailor your plan to what truly works for you, not a generic chart.' } },
      { es:{ accion:'Bebe un vaso de agua antes de cada comida hoy', porque:'A veces la sed se confunde con hambre, y llegar hidratada a la mesa ayuda a comer la cantidad justa.' },
        en:{ accion:'Drink a glass of water before each meal today', porque:'Thirst is sometimes mistaken for hunger, and arriving hydrated helps you eat the right amount.' } },
      { es:{ accion:'Si te pesas hoy, hazlo a la misma hora y no le des demasiado peso a un solo dato', porque:'El peso fluctúa a diario por agua y digestión — la tendencia de varias semanas es lo que de verdad importa.' },
        en:{ accion:"If you weigh yourself today, do it at the same time and don't read too much into one number", porque:'Weight fluctuates daily from water and digestion — the trend over several weeks is what really matters.' } },
      { es:{ accion:'Fíjate si comiste hoy por hambre real o por otra razón', porque:'Distinguir el hambre física de la emocional es la base de cualquier cambio sostenible.' },
        en:{ accion:'Notice if you ate today from real hunger or another reason', porque:'Telling physical hunger apart from emotional hunger is the base of any lasting change.' } },
    ],
  },
  energia: {
    icons: { nutricion: '💧', movimiento: '☀️', interior: '⏸️' },
    nutricion: [
      { es:{ accion:'2 vasos de agua al despertar', porque:'La deshidratación leve reduce el rendimiento cognitivo.' },
        en:{ accion:'2 glasses of water on waking', porque:'Mild dehydration reduces cognitive performance.' } },
      { es:{ accion:'Desayuna con proteína, no solo carbohidrato', porque:'Evita el pico y bajón de glucosa que te deja sin energía a media mañana.' },
        en:{ accion:'Have protein at breakfast, not just carbs', porque:'It prevents the glucose spike and crash that leaves you drained mid-morning.' } },
      { es:{ accion:'Reduce el azúcar añadido en tu primera comida de hoy', porque:'El subidón rápido se paga con un bajón de energía un par de horas después.' },
        en:{ accion:'Cut back on added sugar in your first meal today', porque:'A fast sugar rush is paid back with an energy dip a couple of hours later.' } },
      { es:{ accion:'Combate el bajón de las 17h con un snack con proteína, no solo azúcar', porque:'Un snack solo de azúcar te da un pico y un bajón mayor una hora después.' },
        en:{ accion:'Beat the 5pm slump with a protein snack, not just sugar', porque:'A sugar-only snack gives you a spike and a bigger crash an hour later.' } },
      { es:{ accion:'Revisa si estás comiendo suficiente hoy, no solo bien', porque:'Comer muy poco también baja la energía — no es solo cuestión de calidad.' },
        en:{ accion:'Check whether you are eating enough today, not just well', porque:"Eating too little also lowers energy — it's not only about quality." } },
    ],
    movimiento: [
      { es:{ accion:'5 min de luz natural al empezar el día', porque:'Ajusta tu reloj interno y adelanta la energía del resto del día.' },
        en:{ accion:'5 min of natural light to start the day', porque:'It resets your internal clock and lifts energy for the day ahead.' } },
      { es:{ accion:'10 min de movimiento nada más levantarte, aunque sea suave', porque:'Activa la circulación y sube el estado de alerta más rápido que el café.' },
        en:{ accion:'10 min of movement right after waking, even gentle', porque:'It activates circulation and raises alertness faster than coffee.' } },
      { es:{ accion:'Sal a caminar en tu bajón de media tarde en vez de tomar más cafeína', porque:'El movimiento sube la energía de forma más estable y sin el bajón posterior de la cafeína.' },
        en:{ accion:'Take a walk during your afternoon slump instead of more caffeine', porque:'Movement raises energy more steadily, without the crash caffeine brings later.' } },
      { es:{ accion:'Estírate 2 minutos antes de mirar el móvil al despertar', porque:'Reactiva el cuerpo antes de que la mente se disperse con notificaciones.' },
        en:{ accion:'Stretch for 2 minutes before checking your phone on waking', porque:'It reactivates your body before your mind scatters into notifications.' } },
      { es:{ accion:'Sube y baja escaleras un par de veces cuando notes el bajón', porque:'El movimiento breve e intenso sube la energía más rápido que el movimiento suave prolongado.' },
        en:{ accion:'Take the stairs up and down a couple of times when the slump hits', porque:'Short, intense movement raises energy faster than prolonged gentle movement.' } },
      { es:{ accion:'Evita estar sentada más de una hora seguida hoy', porque:'El sedentarismo prolongado es de las causas más subestimadas de la fatiga diurna.' },
        en:{ accion:'Avoid sitting for more than an hour straight today', porque:'Prolonged sitting is one of the most underrated causes of daytime fatigue.' } },
    ],
    interior: [
      { es:{ accion:'Pausa de 5 min sin pantallas cada hora', porque:'El cortisol acumulado bloquea el foco — las micro-pausas lo regulan.' },
        en:{ accion:'5-min screen-free break every hour', porque:'Built-up cortisol blocks focus — micro-breaks regulate it.' } },
      { es:{ accion:'Anota a qué hora tienes más energía y a qué hora menos hoy', porque:'Con ese patrón puedo ayudarte a poner tus tareas importantes justo ahí.' },
        en:{ accion:'Note when you have most and least energy today', porque:'With that pattern I can help you place your important tasks right there.' } },
      { es:{ accion:'Haz la tarea más exigente del día en tu franja de más energía', porque:'Trabajar contra tu ritmo natural es de las formas más silenciosas de agotarte.' },
        en:{ accion:'Do your hardest task in your highest-energy window', porque:'Working against your natural rhythm is one of the quietest ways to burn out.' } },
      { es:{ accion:'Cierra los ojos 5 minutos sin dormirte a media tarde', porque:'Bajar el estímulo visual un momento reduce la fatiga mental de forma medible.' },
        en:{ accion:'Close your eyes for 5 minutes mid-afternoon, without sleeping', porque:'Lowering visual stimulation for a moment measurably reduces mental fatigue.' } },
      { es:{ accion:'Delega o pospón hoy una tarea que no sea urgente', porque:'Reservar energía para lo importante es tan válido como reservarla físicamente.' },
        en:{ accion:'Delegate or postpone one non-urgent task today', porque:'Saving energy for what matters is as valid as saving it physically.' } },
      { es:{ accion:'Revisa cuántas horas dormiste anoche realmente', porque:'La energía de hoy depende más de anoche que de cualquier otra cosa que hagas hoy.' },
        en:{ accion:'Check how many hours you actually slept last night', porque:"Today's energy depends more on last night than on anything else you do today." } },
      { es:{ accion:'Quita una obligación de tu día si puedes', porque:'La sobrecarga mental agota tanto como la física, y a veces más.' },
        en:{ accion:'Drop one obligation from your day if you can', porque:'Mental overload is as tiring as physical overload, sometimes more.' } },
    ],
  },
  sueno: {
    icons: { nutricion: '☕', movimiento: '🌡️', interior: '🚫' },
    nutricion: [
      { es:{ accion:'Última cafeína antes de las 14:00', porque:'La cafeína tarda hasta 8 horas en salir de tu cuerpo.' },
        en:{ accion:'Last caffeine before 2pm', porque:'Caffeine takes up to 8 hours to leave your body.' } },
      { es:{ accion:'Evita cenas copiosas o muy tarde hoy', porque:'Digerir de más justo antes de dormir sube tu temperatura cuando debería bajar.' },
        en:{ accion:'Avoid a heavy or very late dinner today', porque:'Digesting a lot right before bed raises your temperature when it should be dropping.' } },
      { es:{ accion:'Prueba un puñado de almendras o un plátano de postre esta noche', porque:'Ambos aportan magnesio y triptófano, precursores naturales de la melatonina.' },
        en:{ accion:'Try a handful of almonds or a banana for dessert tonight', porque:'Both provide magnesium and tryptophan, natural precursors of melatonin.' } },
      { es:{ accion:'Reduce el alcohol esta noche si sueles tomar algo', porque:'Ayuda a dormirte pero fragmenta las fases más reparadoras del sueño.' },
        en:{ accion:'Cut back on alcohol tonight if you usually have a drink', porque:'It helps you fall asleep but fragments the most restorative sleep phases.' } },
      { es:{ accion:'Cena algo con carbohidrato complejo esta noche: boniato, quinoa, avena', porque:'Favorece la disponibilidad de triptófano, precursor de la melatonina.' },
        en:{ accion:'Have some complex carbs at dinner tonight: sweet potato, quinoa, oats', porque:'It supports tryptophan availability, a precursor of melatonin.' } },
    ],
    movimiento: [
      { es:{ accion:'Dormitorio a 18-20°C esta noche', porque:'Tu cuerpo necesita bajar 1°C para iniciar el sueño profundo.' },
        en:{ accion:'Bedroom at 18-20°C tonight', porque:'Your body needs to drop 1°C to start deep sleep.' } },
      { es:{ accion:'Da un paseo corto después de cenar', porque:'Ayuda a la digestión y adelanta la bajada de temperatura que necesitas para dormir profundo.' },
        en:{ accion:'Take a short walk after dinner', porque:'It aids digestion and brings forward the temperature drop you need for deep sleep.' } },
      { es:{ accion:'Muévete durante el día, aunque sea 20 min de paseo', porque:'El ejercicio regular mejora la calidad del sueño más que casi cualquier otra rutina nocturna.' },
        en:{ accion:'Move during the day, even a 20-min walk', porque:'Regular exercise improves sleep quality more than almost any nighttime routine.' } },
      { es:{ accion:'Ducha templada una hora antes de dormir', porque:'El descenso de temperatura al salir de la ducha imita la caída térmica que induce el sueño.' },
        en:{ accion:'Warm shower an hour before bed', porque:'The temperature drop after the shower mimics the thermal dip that triggers sleep.' } },
      { es:{ accion:'Sal a que te dé la luz del día en algún momento hoy', porque:'La exposición a luz diurna refuerza el ritmo circadiano que regula tu sueño esta noche.' },
        en:{ accion:'Get some daylight at some point today', porque:"Daylight exposure strengthens the circadian rhythm that regulates tonight's sleep." } },
      { es:{ accion:'Evita el ejercicio intenso después de las 20h hoy', porque:'Sube tu temperatura y tu adrenalina justo cuando tu cuerpo debería bajar revoluciones.' },
        en:{ accion:'Avoid intense exercise after 8pm today', porque:'It raises temperature and adrenaline right when your body should be winding down.' } },
    ],
    interior: [
      { es:{ accion:'Sin pantallas 1h antes de dormir', porque:'La luz azul suprime la melatonina hasta 3 horas.' },
        en:{ accion:'No screens 1h before bed', porque:'Blue light suppresses melatonin for up to 3 hours.' } },
      { es:{ accion:'Prepara mañana esta noche: ropa, agenda, lo que puedas', porque:'Reduce los pensamientos de última hora que te mantienen despierta.' },
        en:{ accion:'Prep tomorrow tonight: clothes, agenda, whatever you can', porque:'It cuts the last-minute thoughts that keep you awake.' } },
      { es:{ accion:'Escribe lo que te preocupa antes de acostarte', porque:'Sacarlo de la cabeza reduce las vueltas mentales al apagar la luz.' },
        en:{ accion:'Write down what is worrying you before bed', porque:'Getting it out of your head reduces the mental spinning once the light is off.' } },
      { es:{ accion:'Prueba la respiración 4-7-8 al acostarte', porque:'Alargar la exhalación activa el sistema nervioso que te prepara para dormir.' },
        en:{ accion:'Try 4-7-8 breathing at bedtime', porque:'A longer exhale activates the nervous system that prepares you for sleep.' } },
      { es:{ accion:'Atenúa las luces de casa la última hora del día', porque:'La luz brillante retrasa la señal que le dice a tu cerebro que ya es de noche.' },
        en:{ accion:'Dim the lights at home in the last hour of the day', porque:"Bright light delays the signal that tells your brain it's nighttime." } },
      { es:{ accion:'Reserva la cama solo para dormir hoy', porque:'Tu cerebro asocia la cama con lo que haces en ella — refuerza que sea solo para dormir.' },
        en:{ accion:'Keep the bed just for sleeping today', porque:'Your brain associates the bed with whatever you do in it — reinforce that it is just for sleep.' } },
      { es:{ accion:'Si no te duermes en 20 min, levántate y vuelve cuando tengas sueño real', porque:'Dar vueltas en la cama refuerza la asociación cama-insomnio a largo plazo.' },
        en:{ accion:'If you are not asleep in 20 min, get up and come back when truly sleepy', porque:'Tossing and turning reinforces the bed-insomnia association long term.' } },
    ],
  },
  hormonal: {
    icons: { nutricion: '🥑', movimiento: '🏋️', interior: '🌙' },
    nutricion: [
      { es:{ accion:'Grasas buenas en cada comida principal: una cucharada de aceite de oliva o un puñado de frutos secos', porque:'Tus hormonas se fabrican a partir de grasa — sin suficiente, la producción baja.' },
        en:{ accion:'Good fats at every main meal: a tablespoon of olive oil or a handful of nuts', porque:'Your hormones are built from fat — without enough, production drops.' } },
      { es:{ accion:'Añade proteína a cada comida principal hoy', porque:'Estabiliza el azúcar en sangre, uno de los factores que más afecta al equilibrio hormonal.' },
        en:{ accion:'Add protein to every main meal today', porque:'It stabilises blood sugar, one of the factors that most affects hormonal balance.' } },
      { es:{ accion:'No te saltes comidas hoy, aunque sea algo pequeño', porque:'Los ayunos largos y no planeados suben el cortisol, que interfiere directamente con tus otras hormonas.' },
        en:{ accion:"Don't skip meals today, even something small", porque:'Long, unplanned gaps raise cortisol, which directly interferes with your other hormones.' } },
      { es:{ accion:'Reduce los ultraprocesados hoy', porque:'Están ligados a más inflamación de bajo grado, que interfiere con la señalización hormonal.' },
        en:{ accion:'Cut back on processed food today', porque:'It is linked to more low-grade inflammation, which interferes with hormonal signalling.' } },
      { es:{ accion:'Incluye fibra en cada comida principal hoy', porque:'Ayuda a tu cuerpo a eliminar el exceso de estrógeno de forma más eficiente.' },
        en:{ accion:'Include fibre in every main meal today', porque:"It helps your body clear excess oestrogen more efficiently." } },
    ],
    movimiento: [
      { es:{ accion:'20 min de fuerza o movimiento hoy', porque:'El ejercicio de fuerza es lo que más impacta tu metabolismo hormonal después de los 40.' },
        en:{ accion:'20 min of strength or movement today', porque:'Strength training has the biggest impact on hormonal metabolism after 40.' } },
      { es:{ accion:'20 min caminando a paso rápido hoy', porque:'El ejercicio cardiovascular moderado también mejora la sensibilidad a la insulina y baja el cortisol.' },
        en:{ accion:'20 min of brisk walking today', porque:'Moderate cardio also improves insulin sensitivity and lowers cortisol.' } },
      { es:{ accion:'Sal al exterior al menos 10 minutos hoy', porque:'La luz natural y el aire libre regulan directamente el eje del estrés, clave en el equilibrio hormonal.' },
        en:{ accion:'Get outside for at least 10 minutes today', porque:'Natural light and fresh air directly regulate your stress axis, key to hormonal balance.' } },
      { es:{ accion:'Estírate o haz algo de movilidad suave hoy si no toca entrenar fuerte', porque:'El movimiento suave regular sostiene el equilibrio hormonal casi tanto como el ejercicio intenso puntual.' },
        en:{ accion:"Stretch or do some gentle mobility today if a hard session isn't due", porque:'Regular gentle movement supports hormonal balance almost as much as occasional intense exercise.' } },
      { es:{ accion:'Evita el sedentarismo prolongado hoy, levántate cada hora', porque:'El movimiento frecuente mejora la sensibilidad a la insulina más que una sola sesión larga.' },
        en:{ accion:'Avoid prolonged sitting today, get up every hour', porque:'Frequent movement improves insulin sensitivity more than one long session.' } },
      { es:{ accion:"Prueba una actividad que disfrutes de verdad hoy, no solo la que 'toca'", porque:'El disfrute reduce el coste de cortisol del propio ejercicio, y eso también es parte del equilibrio hormonal.' },
        en:{ accion:"Try an activity you genuinely enjoy today, not just the one that's due", porque:"Enjoyment lowers the cortisol cost of exercise itself, and that's part of hormonal balance too." } },
    ],
    interior: [
      { es:{ accion:'Rutina fija para acostarte, misma hora', porque:'La regularidad del sueño estabiliza el eje hormonal más que la duración exacta.' },
        en:{ accion:'A fixed bedtime routine, same time', porque:'Sleep regularity stabilises your hormonal axis more than exact duration.' } },
      { es:{ accion:'Sal al exterior al menos 10 minutos hoy, si puedes con luz de mañana', porque:'La luz natural regula el cortisol matutino, la base de todo tu ritmo hormonal del día.' },
        en:{ accion:'Get outside for at least 10 minutes today, morning light if you can', porque:'Natural light regulates your morning cortisol, the base of your whole hormonal rhythm for the day.' } },
      { es:{ accion:'Practica 2-3 minutos de respiración lenta hoy', porque:'Bajar el cortisol de forma activa es una de las palancas más directas sobre tu equilibrio hormonal.' },
        en:{ accion:'Practise 2-3 minutes of slow breathing today', porque:'Actively lowering cortisol is one of the most direct levers on your hormonal balance.' } },
      { es:{ accion:'Anota cómo te sientes hoy, sin juzgarlo', porque:'Ese registro es lo que me permite ver tu ciclo real y ajustar tu plan a él, no a un promedio.' },
        en:{ accion:'Note how you feel today, no judgement', porque:'That log is what lets me see your real cycle and fit your plan to it, not an average.' } },
      { es:{ accion:'Reduce el alcohol hoy si puedes', porque:'El alcohol interfiere con la forma en que tu hígado procesa el estrógeno, sobre todo por la noche.' },
        en:{ accion:'Cut back on alcohol today if you can', porque:'Alcohol interferes with how your liver processes oestrogen, especially overnight.' } },
      { es:{ accion:'Reduce la cafeína después del mediodía hoy', porque:'Sostiene el cortisol elevado más tiempo del necesario, afectando al resto de tus hormonas.' },
        en:{ accion:'Cut back on caffeine after midday today', porque:'It keeps cortisol elevated longer than needed, affecting the rest of your hormones.' } },
      { es:{ accion:'Dedica 5 minutos a algo solo para ti hoy', porque:'El estrés crónico no reconocido es de los factores que más desequilibran el eje hormonal a largo plazo.' },
        en:{ accion:'Spend 5 minutes today on something just for you', porque:'Unrecognised chronic stress is one of the biggest long-term disruptors of your hormonal axis.' } },
    ],
  },
  fuerza: {
    icons: { nutricion: '🥩', movimiento: '🏋️', interior: '✦' },
    nutricion: [
      { es:{ accion:'Una palma de mano de proteína en cada comida principal hoy', porque:'Tu músculo necesita proteína constante para crecer — sin ella, el ejercicio no rinde igual.' },
        en:{ accion:'A palm-sized portion of protein at every main meal today', porque:"Your muscle needs steady protein to grow — without it, training won't pay off the same." } },
      { es:{ accion:'Añade un snack con proteína entre comidas hoy', porque:'Repartir la proteína a lo largo del día ayuda más a construir músculo que concentrarla en una sola comida.' },
        en:{ accion:'Add a protein snack between meals today', porque:'Spreading protein through the day builds more muscle than loading it into one meal.' } },
      { es:{ accion:'No entrenes en ayunas prolongadas si puedes evitarlo', porque:'Tener algo de energía disponible protege tu masa muscular durante el esfuerzo.' },
        en:{ accion:"Avoid training on a long fast if you can help it", porque:'Having some energy on board protects your muscle mass during effort.' } },
      { es:{ accion:'Incluye carbohidrato de calidad cerca de tu entreno hoy', porque:'Repone el glucógeno muscular y mejora tanto el rendimiento como la recuperación.' },
        en:{ accion:'Include quality carbs around your workout today', porque:'It replenishes muscle glycogen and improves both performance and recovery.' } },
      { es:{ accion:'Revisa que estás comiendo suficiente en total hoy, no solo proteína', porque:'Sin suficiente energía total, el cuerpo no prioriza construir músculo aunque comas proteína de sobra.' },
        en:{ accion:"Check you are eating enough overall today, not just protein", porque:"Without enough total energy, your body won't prioritise building muscle even with plenty of protein." } },
    ],
    movimiento: [
      { es:{ accion:'Entrena fuerza, 3 series al fallo', porque:'El ejercicio de fuerza es lo que más impacta tu metabolismo hormonal después de los 40.' },
        en:{ accion:'Strength train, 3 sets to failure', porque:'Strength training has the biggest impact on hormonal metabolism after 40.' } },
      { es:{ accion:'Si hoy no entrenas, camina con algo de peso (mochila) 15 min', porque:'Mantener el estímulo de carga, aunque sea ligero, evita perder el progreso en los días de descanso.' },
        en:{ accion:"If you're not training today, walk with some load (a backpack) for 15 min", porque:'Keeping some load stimulus, even light, prevents losing progress on rest days.' } },
      { es:{ accion:'Añade movilidad o estiramiento después de tu entreno hoy', porque:'Cuidar el rango de movimiento es lo que te permite seguir entrenando fuerte a largo plazo.' },
        en:{ accion:'Add mobility or stretching after your workout today', porque:'Looking after your range of motion is what lets you keep training hard long term.' } },
      { es:{ accion:'Prioriza técnica antes que peso hoy si notas fatiga', porque:'Una repetición bien hecha construye más músculo que varias mal hechas, y protege tus articulaciones.' },
        en:{ accion:'Prioritise form over weight today if you feel fatigued', porque:'One well-executed rep builds more muscle than several sloppy ones, and protects your joints.' } },
      { es:{ accion:'Varía el ejercicio de fuerza de hoy si llevas tiempo con la misma rutina', porque:'El cuerpo se adapta al mismo estímulo — variarlo cada cierto tiempo sigue generando progreso.' },
        en:{ accion:"Vary today's strength exercises if you've been doing the same routine for a while", porque:'Your body adapts to the same stimulus — changing it periodically keeps driving progress.' } },
      { es:{ accion:'Calienta bien antes de entrenar fuerza hoy, 5 minutos', porque:'Reduce el riesgo de lesión y mejora el rendimiento real de cada serie.' },
        en:{ accion:'Warm up properly before strength training today, 5 minutes', porque:'It lowers injury risk and improves the real output of every set.' } },
    ],
    interior: [
      { es:{ accion:'Duerme 8h — el músculo crece mientras duermes', porque:'Tu cuerpo regenera y crece durante el sueño, no durante el entrenamiento en sí.' },
        en:{ accion:'Sleep 8h — muscle grows while you sleep', porque:'Your body regenerates and grows during sleep, not during the workout itself.' } },
      { es:{ accion:'Bebe suficiente agua hoy, sobre todo si entrenaste', porque:'El músculo es en gran parte agua — una hidratación pobre frena directamente su recuperación.' },
        en:{ accion:'Drink enough water today, especially if you trained', porque:'Muscle is largely water — poor hydration directly slows its recovery.' } },
      { es:{ accion:'Anota cómo notaste el cuerpo en el entreno de hoy', porque:'Ese dato me ayuda a ajustar la intensidad a tu recuperación real, no a un plan genérico.' },
        en:{ accion:"Note how your body felt in today's workout", porque:'That data helps me adjust intensity to your real recovery, not a generic plan.' } },
      { es:{ accion:'Date un día de descanso activo si notas mucha fatiga', porque:'El músculo crece en la recuperación, no solo en el esfuerzo — descansar también es entrenar.' },
        en:{ accion:'Take an active rest day if you feel very fatigued', porque:'Muscle grows during recovery, not just effort — resting is training too.' } },
      { es:{ accion:'Prioriza una cena con proteína esta noche', porque:'La síntesis de proteína muscular sigue activa varias horas después de entrenar, y la cena es tu última ventana del día.' },
        en:{ accion:'Prioritise a protein dinner tonight', porque:'Muscle protein synthesis stays active for hours after training, and dinner is your last window of the day.' } },
      { es:{ accion:'Registra el peso o las repeticiones de hoy si entrenas', porque:'Ese dato es lo que me permite ver tu progreso real y ajustar la intensidad la próxima semana.' },
        en:{ accion:"Log today's weight or reps if you train", porque:'That data is what lets me see your real progress and adjust intensity next week.' } },
      { es:{ accion:'Prioriza el descanso entre series hoy, no lo acortes por prisa', porque:'Un descanso insuficiente entre series reduce la fuerza que puedes generar en la siguiente.' },
        en:{ accion:"Prioritise rest between sets today, don't rush it", porque:'Insufficient rest between sets reduces the force you can produce in the next one.' } },
    ],
  },
};

// lectura(d) — mensaje de héroe del día, sin cambios respecto a antes.
const LECTURAS_TEXTO = {
  hinchazon: (d) => d.is_es
    ? (d.diasRegistrados >= 3
        ? `${d.nombre}, llevas ${d.diasRegistrados} días registrando y la hinchazón sigue apareciendo. Eso apunta a cómo y cuándo comes, no a qué desayunas — hoy trabajamos justo eso.`
        : `${d.nombre}, la hinchazón es tu síntoma principal ahora mismo. Con estos primeros días registrados voy a ir afinando exactamente cuándo te aparece.`)
    : (d.diasRegistrados >= 3
        ? `${d.nombre}, you've logged ${d.diasRegistrados} days and the bloating keeps showing up. That points to how and when you eat, not what you have for breakfast — today we work on exactly that.`
        : `${d.nombre}, bloating is your main symptom right now. With these first logged days I'll start narrowing down exactly when it shows up for you.`),
  cansancio: (d) => d.is_es
    ? (d.diasRegistrados >= 3
        ? `${d.nombre}, ${d.diasRegistrados} días registrados y el cansancio sigue siendo lo primero que sientes. Antes de sumar más café, vamos a mirar tu energía desde la raíz — hidratación y luz de la mañana.`
        : `${d.nombre}, el cansancio es lo que más notas ahora mismo. Empezamos por lo que más rápido se nota: cómo arrancas la mañana.`)
    : (d.diasRegistrados >= 3
        ? `${d.nombre}, ${d.diasRegistrados} days logged and tiredness is still the first thing you feel. Before adding more coffee, let's look at your energy from the root — hydration and morning light.`
        : `${d.nombre}, tiredness is what you notice most right now. Let's start with what shows results fastest: how you start your morning.`),
  niebla: (d) => d.is_es
    ? (d.diasRegistrados >= 3
        ? `${d.nombre}, en tus últimos ${d.diasRegistrados} días la niebla mental aparece una y otra vez. No es falta de esfuerzo — es hidratación y grasa buena en el cerebro. Hoy lo trabajamos desde ahí.`
        : `${d.nombre}, la niebla mental es lo que más te pesa ahora. Vamos a empezar por lo que el cerebro necesita primero: agua y omega-3.`)
    : (d.diasRegistrados >= 3
        ? `${d.nombre}, over your last ${d.diasRegistrados} days, brain fog keeps showing up. It's not a lack of effort — it's hydration and good fat for your brain. Today we work from there.`
        : `${d.nombre}, brain fog is what weighs on you most right now. Let's start with what your brain needs first: water and omega-3.`),
  insomnio: (d) => d.is_es
    ? (d.diasRegistrados >= 3
        ? `${d.nombre}, en ${d.diasRegistrados} días registrados el sueño sigue siendo lo que más se resiente. Hoy preparamos la noche desde la tarde, no desde la cama.`
        : `${d.nombre}, el sueño es tu foco principal ahora. Empezamos por lo que más rápido cambia tu noche: la luz y el magnesio.`)
    : (d.diasRegistrados >= 3
        ? `${d.nombre}, over ${d.diasRegistrados} logged days, sleep keeps being what suffers most. Today we prepare the night starting in the afternoon, not in bed.`
        : `${d.nombre}, sleep is your main focus right now. Let's start with what changes your night fastest: light and magnesium.`),
  animo: (d) => d.is_es
    ? (d.diasRegistrados >= 3
        ? `${d.nombre}, en tus ${d.diasRegistrados} días registrados el ánimo se mueve más de lo que te gustaría. Tiene una base biológica real — hoy la trabajamos desde el intestino y el movimiento.`
        : `${d.nombre}, los cambios de ánimo son lo que más notas ahora. Empezamos por algo que actúa rápido: fibra y movimiento suave.`)
    : (d.diasRegistrados >= 3
        ? `${d.nombre}, over your ${d.diasRegistrados} logged days your mood shifts more than you'd like. It has a real biological base — today we work on it through gut and movement.`
        : `${d.nombre}, mood swings are what you notice most right now. Let's start with something that acts fast: fibre and gentle movement.`),
  sofocos: (d) => d.is_es
    ? (d.diasRegistrados >= 3
        ? `${d.nombre}, en ${d.diasRegistrados} días registrados los sofocos siguen apareciendo. Hay disparadores concretos que puedes controlar hoy mismo.`
        : `${d.nombre}, los sofocos son tu síntoma principal ahora. Empezamos por los disparadores más comunes: cafeína, alcohol y capas de ropa.`)
    : (d.diasRegistrados >= 3
        ? `${d.nombre}, over ${d.diasRegistrados} logged days, hot flashes keep showing up. There are concrete triggers you can control starting today.`
        : `${d.nombre}, hot flashes are your main symptom right now. Let's start with the most common triggers: caffeine, alcohol and clothing layers.`),
  antojos: (d) => d.is_es
    ? (d.diasRegistrados >= 3
        ? `${d.nombre}, en ${d.diasRegistrados} días registrados los antojos de dulce siguen apareciendo, sobre todo cuando baja tu energía. Es química, no falta de voluntad.`
        : `${d.nombre}, los antojos de dulce son lo que más notas ahora. Empezamos por lo que más los calma: proteína desde el desayuno.`)
    : (d.diasRegistrados >= 3
        ? `${d.nombre}, over ${d.diasRegistrados} logged days sugar cravings keep showing up, especially when your energy dips. That is chemistry, not a lack of willpower.`
        : `${d.nombre}, sugar cravings are what you notice most right now. Let's start with what calms them best: protein from breakfast.`),
  libido: (d) => d.is_es
    ? (d.diasRegistrados >= 3
        ? `${d.nombre}, en ${d.diasRegistrados} días registrados el deseo sigue bajo. Suele estar más unido al descanso y al estrés acumulado que a otra cosa.`
        : `${d.nombre}, el deseo bajo es lo que más te preocupa ahora. Empezamos por lo que más lo afecta de fondo: el descanso.`)
    : (d.diasRegistrados >= 3
        ? `${d.nombre}, over ${d.diasRegistrados} logged days your desire has stayed low. It is often more linked to rest and built-up stress than anything else.`
        : `${d.nombre}, low desire is what concerns you most right now. Let's start with what affects it most at the root: rest.`),
};

const LECTURAS_TEXTO_OBJETIVO = {
  peso: (d) => d.is_es
    ? `${d.nombre}, estamos empezando a conocer tu cuerpo. Con lo que registres estos días, tu plan se irá afinando — hoy arrancamos por lo más simple.`
    : `${d.nombre}, we're just starting to get to know your body. As you log these first days, your plan will get sharper — today we start with the simplest thing.`,
  energia: (d) => d.is_es
    ? `${d.nombre}, estamos empezando a conocer tu cuerpo. Con lo que registres estos días, tu plan se irá afinando — hoy arrancamos por tu energía.`
    : `${d.nombre}, we're just starting to get to know your body. As you log these first days, your plan will get sharper — today we start with your energy.`,
  sueno: (d) => d.is_es
    ? `${d.nombre}, estamos empezando a conocer tu cuerpo. Con lo que registres estos días, tu plan se irá afinando — hoy preparamos tu noche.`
    : `${d.nombre}, we're just starting to get to know your body. As you log these first days, your plan will get sharper — today we prepare your night.`,
  hormonal: (d) => d.is_es
    ? `${d.nombre}, estamos empezando a conocer tu cuerpo. Con lo que registres estos días, tu plan se irá afinando — hoy trabajamos las bases.`
    : `${d.nombre}, we're just starting to get to know your body. As you log these first days, your plan will get sharper — today we work on the basics.`,
  fuerza: (d) => d.is_es
    ? `${d.nombre}, estamos empezando a conocer tu cuerpo. Con lo que registres estos días, tu plan se irá afinando — hoy arrancamos por lo esencial.`
    : `${d.nombre}, we're just starting to get to know your body. As you log these first days, your plan will get sharper — today we start with the essentials.`,
};

// Construye el plan de 3 acciones eligiendo la variante correspondiente al día
// (idxN mod 5, idxM mod 6, idxI mod 7) de cada columna del banco.
function construirPlan(d, banco) {
  const idioma = d.is_es ? 'es' : 'en';
  const nutricionV = banco.nutricion[d.idxN % banco.nutricion.length][idioma];
  const movimientoV = banco.movimiento[d.idxM % banco.movimiento.length][idioma];
  const interiorV = banco.interior[d.idxI % banco.interior.length][idioma];
  return [
    { tipo: 'nutricion', icono: banco.icons.nutricion, accion: nutricionV.accion, porque: nutricionV.porque },
    { tipo: 'movimiento', icono: banco.icons.movimiento, accion: movimientoV.accion, porque: movimientoV.porque },
    { tipo: 'interior', icono: banco.icons.interior, accion: interiorV.accion, porque: interiorV.porque },
  ];
}

const LECTURAS = Object.fromEntries(
  Object.keys(BANCO).map((clave) => [
    clave,
    { lectura: LECTURAS_TEXTO[clave], plan: (d) => construirPlan(d, BANCO[clave]) },
  ])
);

const GENERAL_POR_OBJETIVO = Object.fromEntries(
  Object.keys(BANCO_OBJETIVO).map((clave) => [
    clave,
    { lectura: LECTURAS_TEXTO_OBJETIVO[clave], plan: (d) => construirPlan(d, BANCO_OBJETIVO[clave]) },
  ])
);

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
export function getLecturaDelDia({ nombre, objetivo, sintoma, is_es, diasRegistrados = 0, racha = 0, restricciones, condiciones, tdee, estadoHoy }) {
  const claveSintoma = normalizarSintoma(sintoma);
  const claveObjetivo = normalizarObjetivo(objetivo);
  const entrada = (claveSintoma && LECTURAS[claveSintoma]) || GENERAL_POR_OBJETIVO[claveObjetivo];

  // Índice de rotación diaria: contador continuo de días desde el epoch
  // (no el día del mes) con un módulo distinto por columna (5/6/7, coprimos
  // entre sí) para que ninguna columna se note en un ciclo corto y la terna
  // completa no se repita hasta pasados 210 días. Usar el día del mes (1-31)
  // provocaría una repetición ocasional justo al cambiar de mes, porque los
  // meses no son múltiplos exactos de 5/6/7 — el contador continuo elimina
  // esa costura por completo.
  const diaEpoch = Math.floor(Date.now() / 86400000);
  const d = {
    nombre: nombre || (is_es ? 'Hola' : 'Hi'),
    is_es, diasRegistrados, racha, objetivo: claveObjetivo,
    idxN: diaEpoch % 5,
    idxM: diaEpoch % 6,
    idxI: diaEpoch % 7,
  };
  const reconocimiento = estadoHoy && RECONOCIMIENTO_ESTADO[estadoHoy] ? RECONOCIMIENTO_ESTADO[estadoHoy][is_es ? 'es' : 'en'] + ' ' : '';

  // Flecha corta desde el consejo de hoy hacia el programa semanal correspondiente
  // (el semanal sigue atado al objetivo, esto solo enlaza a él desde el consejo diario).
  const ENLACE_SEMANAL = {
    nutricion: { link: '/lumera?tab=nutrition', linkLabel: is_es ? 'Ver menú semanal →' : 'See weekly menu →' },
    movimiento: { link: '/lumera?tab=exercise', linkLabel: is_es ? 'Ver ejercicio semanal →' : 'See weekly exercise →' },
  };

  const plan = entrada.plan(d).map(item => {
    const enlace = ENLACE_SEMANAL[item.tipo] || {};

    if (item.tipo !== 'nutricion') return { ...item, ...enlace };

    // Prioridad: una condición médica real (si aplica) reemplaza la acción de nutrición.
    const clavesCondicion = normalizarCondiciones(condiciones);
    const condicionAplicable = ORDEN_CONDICIONES.find(c => clavesCondicion.includes(c));
    if (condicionAplicable) {
      const ad = ADAPTACION_CONDICION[condicionAplicable][is_es ? 'es' : 'en'];
      return { ...item, ...enlace, accion: ad.accion, porque: ad.porque, etiqueta: ad.etiqueta };
    }

    // Si no hay condición, ajustamos por restricción alimentaria solo si el texto entra en conflicto.
    const claveRestriccion = normalizarRestriccion(restricciones);
    if (claveRestriccion) {
      const ajuste = ajustarPorRestriccion(item.accion, claveRestriccion, is_es);
      if (ajuste) return { ...item, ...enlace, accion: ajuste.accion, etiqueta: ajuste.etiqueta };
    }

    return { ...item, ...enlace };
  });

  return {
    lectura: reconocimiento + entrada.lectura(d),
    plan,
    objetivoKcal: calcularObjetivoKcal(tdee, claveObjetivo),
  };
}
