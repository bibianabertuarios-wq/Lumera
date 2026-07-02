cat > /tmp/paso2.patch << 'PATCHEOF'
diff --git a/app/lumera/LumeraApp.jsx b/app/lumera/LumeraApp.jsx
index 3ed13b6..0ef5572 100644
--- a/app/lumera/LumeraApp.jsx
+++ b/app/lumera/LumeraApp.jsx
@@ -159,6 +159,201 @@ import './lumera.css'
             );
         }
 
+        // ── PASO 2: LumiMensaje — reconocimiento + dato biológico + una acción ──
+        // BORRADOR: contenido pendiente de revisión científica antes de considerarse final.
+        function getMomentoDia() {
+            const h = new Date().getHours();
+            if (h < 12) return 'manana';
+            if (h < 19) return 'tarde';
+            return 'noche';
+        }
+
+        const MENSAJES_LUMI = {
+            es: {
+                menstrual: {
+                    manana: [
+                        'Buenos días, {nombre}. Tus hormonas están en su punto más bajo hoy y tu cuerpo pide recogimiento. No es debilidad, es renovación.',
+                        '{nombre}, hoy tu cuerpo sangra y se repara a la vez. Ir más despacio no es fallar, es lo que toca.',
+                    ],
+                    tarde: [
+                        '{nombre}, si hoy todo pesa un poco más, es tu biología pidiendo pausa. Bajar el ritmo estos días es invertir en el resto del ciclo.',
+                        'Con el estrógeno tan bajo, {nombre}, el cansancio de esta tarde tiene explicación. No necesitas empujar más.',
+                    ],
+                    noche: [
+                        'Esta noche tu cuerpo repara más que nunca, {nombre}. El descanso de hoy es la energía de la semana que viene.',
+                        '{nombre}, dormir bien esta noche ayuda directamente a tu próxima fase folicular. Prioriza la cama.',
+                    ],
+                },
+                folicular: {
+                    manana: [
+                        'Buenos días, {nombre}. Tu estrógeno empieza a subir: más claridad, más energía. Esta es tu fase de arrancar cosas.',
+                        '{nombre}, hoy tu cerebro asimila mejor y tu ánimo tiende a subir. Aprovecha la mañana para lo importante.',
+                    ],
+                    tarde: [
+                        '{nombre}, en fase folicular tu cuerpo responde mejor al movimiento. Buen momento para lo que llevas posponiendo.',
+                        'Tu energía suele subir en esta fase, {nombre}. Si puedes moverte hoy, tu cuerpo te lo va a agradecer.',
+                    ],
+                    noche: [
+                        'Buen cierre de día, {nombre}. En esta fase tu sueño suele ser más profundo: acuéstate a tu hora y mañana lo notarás.',
+                        '{nombre}, tu cuerpo está construyendo reservas para la ovulación. Un buen descanso esta noche ayuda a eso.',
+                    ],
+                },
+                ovulatoria: {
+                    manana: [
+                        'Buenos días, {nombre}. Estás en tu pico de estrógeno: energía, ánimo y comunicación al máximo. Si hay algo importante esta semana, hoy es el día.',
+                        '{nombre}, tu cuerpo está en su ventana más alta del ciclo. Aprovecha esta claridad mientras dura.',
+                    ],
+                    tarde: [
+                        '{nombre}, estos días tu cuerpo tolera mejor el esfuerzo y tu mente está más ágil. Es tu ventana alta del ciclo, úsala sin culpa.',
+                        'Tu energía está en su pico, {nombre}. Buen momento para el ejercicio de fuerza si te apetece.',
+                    ],
+                    noche: [
+                        'Día alto, {nombre}. Después del pico viene el descenso: cena temprano y ligero para que la transición sea suave.',
+                        '{nombre}, mañana empieza el cambio hacia fase lútea. Aprovecha esta noche para descansar bien y llegar con reservas.',
+                    ],
+                },
+                lutea: {
+                    manana: [
+                        'Buenos días, {nombre}. Fase lútea: tu progesterona sube y es normal sentir menos chispa. No es pereza, es biología.',
+                        '{nombre}, en esta fase el cuerpo pide algo más de calma. Vas a rendir igual, solo que con otro ritmo.',
+                    ],
+                    tarde: [
+                        '{nombre}, si esta tarde notas más hambre o menos paciencia, no es falta de voluntad: tu cuerpo gasta más energía en esta fase.',
+                        'La irritabilidad de hoy tiene un nombre, {nombre}: progesterona alta. Trátate con la misma ciencia que exigirías a un médico.',
+                    ],
+                    noche: [
+                        'Esta fase es sensible al cortisol nocturno, {nombre}. Cena antes de las 20:30 y baja pantallas: tu progesterona te lo devolverá en sueño.',
+                        '{nombre}, dormir bien en fase lútea ayuda a suavizar los síntomas de los próximos días. Prioriza esta noche.',
+                    ],
+                },
+                sinCiclo: {
+                    manana: [
+                        'Buenos días, {nombre}. Sin ciclo que marque el ritmo, tu cuerpo sigue el suyo propio: el circadiano. Empezar el día con luz natural le ayuda a regularse.',
+                        '{nombre}, hoy tu energía depende más de sueño y rutina que de hormonas cíclicas. Un buen desayuno con proteína marca la diferencia.',
+                    ],
+                    tarde: [
+                        '{nombre}, a media tarde el cortisol tiende a bajar de forma natural. Si notas un bajón, es normal, no necesitas cafeína extra.',
+                        'Tu cuerpo agradece constancia más que intensidad, {nombre}. Un paseo corto esta tarde ayuda más de lo que parece.',
+                    ],
+                    noche: [
+                        'Esta noche, {nombre}, cenar temprano y bajar pantallas ayuda a que tu cortisol nocturno no se dispare.',
+                        '{nombre}, sin ciclo que lo marque, es tu rutina de sueño la que más protege tu energía del día siguiente. Cuídala hoy.',
+                    ],
+                },
+            },
+            en: {
+                menstrual: {
+                    manana: [
+                        'Good morning, {nombre}. Your hormones are at their lowest today and your body is asking for rest. That is not weakness, it is renewal.',
+                        '{nombre}, your body is bleeding and repairing at the same time today. Slowing down is not failing, it is what today calls for.',
+                    ],
+                    tarde: [
+                        '{nombre}, if everything feels heavier today, that is your biology asking for a pause. Slowing down now is an investment in the rest of your cycle.',
+                        'With oestrogen this low, {nombre}, today\'s tiredness has an explanation. You do not need to push harder.',
+                    ],
+                    noche: [
+                        'Tonight your body repairs more than ever, {nombre}. Today\'s rest is next week\'s energy.',
+                        '{nombre}, sleeping well tonight directly supports your upcoming follicular phase. Prioritise bed.',
+                    ],
+                },
+                folicular: {
+                    manana: [
+                        'Good morning, {nombre}. Your oestrogen is starting to rise: more clarity, more energy. This is your phase for starting things.',
+                        '{nombre}, today your brain absorbs information better and your mood tends to lift. Use the morning for what matters.',
+                    ],
+                    tarde: [
+                        '{nombre}, in the follicular phase your body responds better to movement. Good time for what you have been putting off.',
+                        'Your energy tends to rise in this phase, {nombre}. If you can move today, your body will thank you.',
+                    ],
+                    noche: [
+                        'Good way to close the day, {nombre}. In this phase your sleep tends to be deeper: go to bed on time and you will notice it tomorrow.',
+                        '{nombre}, your body is building reserves for ovulation. Good rest tonight supports that.',
+                    ],
+                },
+                ovulatoria: {
+                    manana: [
+                        'Good morning, {nombre}. You are at your oestrogen peak: energy, mood and communication at their best. If something important is coming up this week, today is the day.',
+                        '{nombre}, your body is in its highest window of the cycle. Use this clarity while it lasts.',
+                    ],
+                    tarde: [
+                        '{nombre}, these days your body handles effort better and your mind is sharper. This is your high window, use it without guilt.',
+                        'Your energy is at its peak, {nombre}. Good time for strength training if you feel like it.',
+                    ],
+                    noche: [
+                        'High day, {nombre}. After the peak comes the decline: eat dinner early and light so the transition is smooth.',
+                        '{nombre}, tomorrow the shift toward the luteal phase begins. Use tonight to rest well and go in with reserves.',
+                    ],
+                },
+                lutea: {
+                    manana: [
+                        'Good morning, {nombre}. Luteal phase: your progesterone rises and it is normal to feel less spark. That is not laziness, it is biology.',
+                        '{nombre}, in this phase your body asks for a bit more calm. You will perform just as well, only at a different pace.',
+                    ],
+                    tarde: [
+                        '{nombre}, if this afternoon you notice more hunger or less patience, it is not a lack of willpower: your body spends more energy in this phase.',
+                        'Today\'s irritability has a name, {nombre}: high progesterone. Treat yourself with the same science you would expect from a doctor.',
+                    ],
+                    noche: [
+                        'This phase is sensitive to night-time cortisol, {nombre}. Eat dinner before 8:30pm and put screens down: your progesterone will pay it back in sleep.',
+                        '{nombre}, sleeping well in the luteal phase softens the symptoms of the coming days. Prioritise tonight.',
+                    ],
+                },
+                sinCiclo: {
+                    manana: [
+                        'Good morning, {nombre}. Without a cycle setting the pace, your body still follows its own: the circadian one. Starting the day with natural light helps regulate it.',
+                        '{nombre}, today your energy depends more on sleep and routine than on cyclical hormones. A good protein breakfast makes a difference.',
+                    ],
+                    tarde: [
+                        '{nombre}, mid-afternoon cortisol naturally tends to dip. If you feel a slump, that is normal, you do not need extra caffeine.',
+                        'Your body responds better to consistency than intensity, {nombre}. A short walk this afternoon helps more than it seems.',
+                    ],
+                    noche: [
+                        'Tonight, {nombre}, eating dinner early and putting screens down helps keep your night-time cortisol from spiking.',
+                        '{nombre}, with no cycle marking the way, your sleep routine is what protects tomorrow\'s energy the most. Look after it tonight.',
+                    ],
+                },
+            },
+        };
+
+        const ACCIONES_HOY = {
+            es: {
+                menstrual: ['Magnesio 300mg antes de dormir', 'Proteína en el desayuno, sin prisa'],
+                folicular: ['Empieza hoy lo que llevas posponiendo', 'Añade un entrenamiento de fuerza esta semana'],
+                ovulatoria: ['Aprovecha hoy para lo importante', 'Programa hoy una conversación difícil'],
+                lutea: ['Cena antes de las 20:30', 'Respiración 4-7-8 antes de comer'],
+                sinCiclo: ['10 minutos de luz solar por la mañana', 'Cena temprano y baja pantallas esta noche'],
+            },
+            en: {
+                menstrual: ['300mg magnesium before sleep', 'Protein at breakfast, no rush'],
+                folicular: ['Start today what you keep postponing', 'Add one strength session this week'],
+                ovulatoria: ['Use today for what matters most', 'Schedule that difficult conversation today'],
+                lutea: ['Eat dinner before 8:30pm', '4-7-8 breathing before meals'],
+                sinCiclo: ['10 minutes of morning sunlight', 'Eat dinner early and put screens down tonight'],
+            },
+        };
+
+        function LumiMensaje({ nombre, infoCiclo, language = 'es' }) {
+            const momento = getMomentoDia();
+            const key = (infoCiclo && infoCiclo.tieneCiclo) ? infoCiclo.fase : 'sinCiclo';
+            const dict = MENSAJES_LUMI[language] || MENSAJES_LUMI.es;
+            const accDict = ACCIONES_HOY[language] || ACCIONES_HOY.es;
+            const opciones = (dict[key] && dict[key][momento]) || dict.sinCiclo[momento];
+            const dia = new Date().getDate();
+            const texto = opciones[dia % opciones.length].split('{nombre}').join(nombre || '');
+            const accOpciones = accDict[key] || accDict.sinCiclo;
+            const mision = accOpciones[dia % accOpciones.length];
+            return (
+                <div className="lum-msg">
+                    <div className="lum-msg-head">
+                        <div className="lum-msg-avatar">L</div>
+                        <span>LUMI</span>
+                    </div>
+                    <p className="lum-msg-texto">{texto}</p>
+                    <p className="lum-msg-cta">{language === 'es' ? `Hoy solo una cosa: ${mision} →` : `Just one thing today: ${mision} →`}</p>
+                </div>
+            );
+        }
+
         const LumeraApp = () => {
             const [language, setLanguage] = useState(() => { if (typeof window === 'undefined') return 'es'; const saved = localStorage.getItem('lumeraLang'); if (saved) return saved; const browserLang = navigator.language || navigator.userLanguage || 'es'; return browserLang.startsWith('es') ? 'es' : 'en'; });
 
@@ -4064,57 +4259,14 @@ query = query.eq('region', region.toUpperCase());
                                         <p style={{fontSize:'0.82rem',color:'rgba(245,230,211,0.8)',fontStyle:'italic',fontFamily:"'Cormorant',serif",lineHeight:1.5}}>{language==='es'?'Registra cómo te sientes hoy — LUMI ajusta todo a tu ritmo.':'Log how you feel today — LUMI adjusts everything to your rhythm.'}</p>
                                     </div>
                                 )}
-                                {symptoms && symptoms.length >= 2 && (()=>{
-                                    const last7=symptoms.slice(-7);
-                                    const avg=(k)=>{const v=last7.map(s=>s[k]||0).filter(x=>x>0);return v.length?v.reduce((a,b)=>a+b,0)/v.length:0};
-                                    const trd=(k)=>{if(last7.length<2)return 0;const h=Math.floor(last7.length/2);const r=last7.slice(-h).map(s=>s[k]||0);const o=last7.slice(0,h).map(s=>s[k]||0);return(r.reduce((a,b)=>a+b,0)/r.length)-(o.reduce((a,b)=>a+b,0)/o.length)};
-                                    const eA=avg('energy'),sA=avg('sleep'),mA=avg('mood'),aA=avg('anxiety');
-                                    const sT=trd('sleep'),eT=trd('energy'),mT=trd('mood');
-                                    const pr=[];
-                                    if(sT<-0.5)pr.push(language==='es'?'🌙 Tu sueño ha bajado. Los próximos días pueden traer más cansancio.':'🌙 Sleep has dropped. Coming days may bring more fatigue.');
-                                    else if(sT>0.5)pr.push(language==='es'?'🌙 Estás durmiendo mejor. Más energía en los próximos días.':'🌙 Sleeping better. More energy coming up.');
-                                    if(eT<-0.5)pr.push(language==='es'?'⚡ Energía bajando. Añade proteína y magnesio esta semana.':'⚡ Energy declining. Add protein and magnesium this week.');
-                                    else if(eT>0.5)pr.push(language==='es'?'⚡ Energía subiendo. Aprovecha este pico.':'⚡ Energy rising. Use this peak.');
-                                    if(aA>=3.5)pr.push(language==='es'?'🌊 Ansiedad presente. Respiración 4-7-8 antes de comer.':'🌊 Anxiety present. 4-7-8 breathing before meals.');
-                                    if(mT<-0.5)pr.push(language==='es'?'🌿 Ánimo fluctuante. Omega-3 y luz solar matutina.':'🌿 Mood fluctuating. Omega-3s and morning sunlight.');
-                                    if(pr.length===0)pr.push(language==='es'?'✦ Patrones estables esta semana. Tu cuerpo está respondiendo.':'✦ Stable patterns this week. Your body is responding.');
-                                    const ac=[sA<3?(language==='es'?'Magnesio 300mg antes de dormir':'300mg magnesium before sleep'):null,eA<3?(language==='es'?'Proteína en desayuno':'Protein at breakfast'):null,aA>=3.5?(language==='es'?'Respiración 4-7-8 x3 al día':'4-7-8 breathing x3 daily'):null,mA<3?(language==='es'?'10 min luz solar por la mañana':'10 min morning sunlight'):null].filter(Boolean);
+                                {(() => {
+                                    const cicloCodeMsg = getCicloCode(currentUser?.ciclo);
+                                    const infoCicloMsg = getFaseCicloInfo(cicloCodeMsg, periodLog);
                                     return (
-                                        <div className="gc" style={{marginBottom:'1rem',padding:'1.5rem',position:'relative',overflow:'hidden'}}>
-                                            <div style={{position:'absolute',top:0,left:0,right:0,height:'3px',background:'linear-gradient(90deg,#B8997A,#E8C878,#B8997A)'}}/>
-                                            <div style={{display:'flex',alignItems:'center',gap:'0.6rem',marginBottom:'1rem'}}>
-                                                <img src="/images/lumi.png" style={{width:'40px',height:'40px',borderRadius:'50%',objectFit:'cover',flexShrink:0,border:'2px solid rgba(184,115,51,0.5)',boxShadow:'0 0 12px rgba(184,115,51,0.3)'}} onError={e=>{e.target.style.display='none'}} alt="LUMI"/>
-                                                <div>
-                                                    <p style={{fontSize:'0.62rem',color:'#B8997A',fontWeight:700,letterSpacing:'0.14em',textTransform:'uppercase'}}>LUMI PREDICTIVA</p>
-                                                    <p style={{fontFamily:"'Cormorant',serif",fontSize:'1.1rem',color:'#F0EDE8',fontWeight:500}}>{language==='es'?'Esta semana te espera esto':'This week ahead for you'}</p>
-                                                </div>
-                                            </div>
-                                            {pr.slice(0,2).map((p,i)=>(
-                                                <div key={i} style={{background:'rgba(184,115,51,0.08)',border:'1px solid rgba(184,115,51,0.18)',borderRadius:'0.75rem',padding:'0.75rem 1rem',marginBottom:'0.6rem'}}>
-                                                    <p style={{fontSize:'0.87rem',color:'rgba(245,230,211,0.88)',lineHeight:1.55}}>{p}</p>
-                                                </div>
-                                            ))}
-                                            {ac.length>0&&(<div style={{marginTop:'0.75rem'}}>
-                                                <p style={{fontSize:'0.62rem',color:'#B8997A',fontWeight:700,letterSpacing:'0.12em',textTransform:'uppercase',marginBottom:'0.5rem'}}>ACCIONES ESTA SEMANA</p>
-                                                {ac.slice(0,3).map((a,i)=>(
-                                                    <div key={i} style={{display:'flex',alignItems:'center',gap:'0.5rem',marginBottom:'0.35rem'}}>
-                                                        <div style={{width:'5px',height:'5px',borderRadius:'50%',background:'#B8997A',flexShrink:0}}/>
-                                                        <p style={{fontSize:'0.82rem',color:'rgba(212,149,106,0.9)'}}>{a}</p>
-                                                    </div>
-                                                ))}
-                                            </div>)}
-                                            <div style={{marginTop:'1rem',paddingTop:'0.75rem',borderTop:'1px solid rgba(184,115,51,0.15)',display:'flex',alignItems:'center',gap:'0.5rem'}}>
-                                                <img src="/images/lumi.png" style={{width:'22px',height:'22px',borderRadius:'50%',objectFit:'cover'}} onError={e=>{e.target.style.display='none'}} alt="LUMI"/>
-                                                <p style={{fontSize:'0.75rem',color:'rgba(184,115,51,0.7)',fontStyle:'italic',fontFamily:"'Cormorant',serif"}}>{`LUMI · ${last7.length} ${language==='es'?'registros analizados':'entries analysed'}`}</p>
-                                            </div>
-                                        </div>
+                                        <LumiMensaje nombre={userName} infoCiclo={infoCicloMsg} language={language} />
                                     );
                                 })()}
 
-
-
-
                                 {/* SABIAS QUE */}
                                 {(()=>{
                                     const tips = language==='es'?[
diff --git a/app/lumera/lumera.css b/app/lumera/lumera.css
index 8c29322..431f210 100644
--- a/app/lumera/lumera.css
+++ b/app/lumera/lumera.css
@@ -207,3 +207,10 @@
 .lum-barra-track { height: 5px; background: #EDE3D4; border-radius: 3px; }
 .lum-barra-fill { height: 5px; background: #C9935A; border-radius: 3px; transition: width .6s ease; }
 .lum-anillo-wrap { background: #FFFFFF; border: 0.5px solid #E7DCCB; border-radius: 14px; padding: 16px; margin-bottom: 12px; }
+
+/* ── PASO 2: LumiMensaje ── */
+.lum-msg { background: rgba(184,115,51,0.08); border: 1px solid rgba(184,115,51,0.25); border-radius: 1rem; padding: 1.1rem 1.25rem; margin-bottom: 1rem; }
+.lum-msg-head { display: flex; align-items: center; gap: 8px; margin-bottom: 8px; font-size: 12px; letter-spacing: 0.1em; text-transform: uppercase; color: #B8997A; font-weight: 700; }
+.lum-msg-avatar { width: 26px; height: 26px; border-radius: 50%; background: #C9935A; color: #fff; display: flex; align-items: center; justify-content: center; font-size: 13px; flex-shrink: 0; }
+.lum-msg-texto { margin: 0; font-size: 0.95rem; color: rgba(245,230,211,0.9); line-height: 1.6; font-family: 'Cormorant', serif; font-style: italic; }
+.lum-msg-cta { margin: 12px 0 0; font-size: 0.85rem; color: #C9935A; font-weight: 600; }
PATCHEOF
git apply /tmp/paso2.patch