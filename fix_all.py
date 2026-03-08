f = open('app/lumera/LumeraApp.jsx', 'r')
c = f.read()
f.close()
fixes = 0

# ── 1. BOTONES OBJETIVO EJERCICIO ──
old1 = """                        <div className="flex gap-4 overflow-x-auto pb-4">
                            {['strength', 'weightLoss', 'hormonal'].map((goal) => (
                                <button key={goal} onClick={() => setExerciseGoal(goal)} className={`px-6 py-3 rounded-lg font-semibold whitespace-nowrap transition ${exerciseGoal === goal ? 'bg-rose-500 text-white' : darkMode ? 'bg-gray-800 text-gray-300' : 'bg-gray-200 text-gray-700'}`}>
                                    {goal === 'strength' ? t[language].strength : goal === 'weightLoss' ? t[language].weightLoss : t[language].hormonal}
                                </button>
                            ))}
                        </div>"""
new1 = """                        <div className="flex gap-3 overflow-x-auto pb-4">
                            {['strength', 'weightLoss', 'hormonal'].map((goal) => (
                                <button key={goal} onClick={() => setExerciseGoal(goal)} style={{
                                    padding:'0.6rem 1.25rem', borderRadius:'9999px', fontWeight:600,
                                    whiteSpace:'nowrap', transition:'all 0.2s', border:'none', cursor:'pointer',
                                    background: exerciseGoal === goal ? 'linear-gradient(135deg,#C9935A,#e8c89f)' : darkMode ? 'rgba(255,255,255,0.08)' : 'rgba(201,147,90,0.1)',
                                    color: exerciseGoal === goal ? 'white' : darkMode ? '#e8d5c0' : '#92580a',
                                    boxShadow: exerciseGoal === goal ? '0 2px 10px rgba(201,147,90,0.4)' : 'none'
                                }}>
                                    {goal === 'strength' ? t[language].strength : goal === 'weightLoss' ? t[language].weightLoss : t[language].hormonal}
                                </button>
                            ))}
                        </div>"""
if old1 in c: c = c.replace(old1, new1); fixes += 1; print("✅ Botones objetivo")
else: print("❌ Botones objetivo")

# ── 2. TARJETAS EJERCICIO con acordeón ──
old2 = """                        <div className="space-y-6">
                            {exercises.map((ex, idx) => (
                                <div key={idx} className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-lg overflow-hidden`}>
                                    <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white p-6">
                                        <h3 className="text-2xl font-semibold mb-2">{ex.name}</h3>
                                        <div className="flex gap-4 text-sm flex-wrap">
                                            <span>⏱ {ex.duration}</span>
                                            <span>💪 {ex.difficulty}</span>
                                            <span>📅 {ex.freq}</span>
                                        </div>
                                    </div>

                                    <div className="p-6 space-y-4">
                                        <div className={`${darkMode ? 'bg-gray-700' : 'bg-yellow-50'} p-4 rounded-lg border-l-4 border-yellow-500`}>
                                            <p className={`text-sm font-semibold mb-2 ${darkMode ? 'text-yellow-300' : 'text-yellow-900'}`}>💡 {t[language].why}:</p>
                                            <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>{ex.why}</p>
                                        </div>

                                        {ex.steps && ex.steps.length > 0 && (
                                            <div className={`${darkMode ? 'bg-gray-700' : 'bg-green-50'} p-4 rounded-lg border-l-4 border-green-600`}>
                                                <p className={`text-sm font-semibold mb-3 ${darkMode ? 'text-green-300' : 'text-green-900'}`}>📋 {language === 'es' ? 'Cómo hacerlo' : 'How to do it'}:</p>
                                                <ol className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'} space-y-2 list-decimal list-inside`}>
                                                    {ex.steps.map((step, i) => (
                                                        <li key={i}>{step}</li>
                                                    ))}
                                                </ol>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>"""
new2 = """                        <div className="space-y-4">
                            {exercises.map((ex, idx) => (
                                <details key={idx} style={{background:darkMode?'rgba(255,255,255,0.05)':'rgba(255,255,255,0.92)',borderRadius:'1.1rem',overflow:'hidden',border:'1px solid rgba(201,147,90,0.18)',boxShadow:'0 2px 12px rgba(0,0,0,0.04)'}}>
                                    <summary style={{padding:'1rem 1.25rem',cursor:'pointer',listStyle:'none',display:'flex',justifyContent:'space-between',alignItems:'center',background:'linear-gradient(135deg,rgba(201,147,90,0.12),rgba(232,200,159,0.08))'}}>
                                        <div>
                                            <h3 style={{fontFamily:"'Cormorant',serif",fontSize:'1.15rem',fontWeight:600,color:darkMode?'#e8d5c0':'#292524',marginBottom:'0.2rem'}}>
                                                <span style={{color:'#C9935A',marginRight:'0.4rem'}}>✦</span>{ex.name}
                                            </h3>
                                            <div style={{display:'flex',gap:'0.75rem',flexWrap:'wrap'}}>
                                                <span style={{fontSize:'0.72rem',color:'#C9935A',fontWeight:600}}>{ex.duration}</span>
                                                <span style={{fontSize:'0.72rem',color:'#92580a'}}>{ex.difficulty}</span>
                                                <span style={{fontSize:'0.72rem',color:'#78716c'}}>{ex.freq}</span>
                                            </div>
                                        </div>
                                        <span style={{color:'#C9935A',fontSize:'1.1rem',flexShrink:0}}>›</span>
                                    </summary>
                                    <div style={{padding:'1rem 1.25rem',display:'flex',flexDirection:'column',gap:'0.75rem'}}>
                                        <div style={{borderLeft:'3px solid #C9935A',paddingLeft:'0.75rem'}}>
                                            <p style={{fontSize:'0.8rem',fontWeight:600,color:'#C9935A',marginBottom:'0.2rem'}}>{t[language].why}</p>
                                            <p style={{fontSize:'0.85rem',color:darkMode?'#d6d3d1':'#57534e',lineHeight:1.5}}>{ex.why}</p>
                                        </div>
                                        {ex.steps && ex.steps.length > 0 && (
                                            <div style={{borderLeft:'3px solid rgba(201,147,90,0.4)',paddingLeft:'0.75rem'}}>
                                                <p style={{fontSize:'0.8rem',fontWeight:600,color:'#92580a',marginBottom:'0.4rem'}}>{language==='es'?'Cómo hacerlo':'How to do it'}</p>
                                                <ol style={{paddingLeft:'1rem',margin:0}}>
                                                    {ex.steps.map((step, i) => (
                                                        <li key={i} style={{fontSize:'0.82rem',color:darkMode?'#a8a29e':'#78716c',lineHeight:1.5,marginBottom:'0.25rem'}}>
                                                            <span style={{color:'#C9935A',fontWeight:700,marginRight:'0.3rem'}}>{i+1}.</span>{step}
                                                        </li>
                                                    ))}
                                                </ol>
                                            </div>
                                        )}
                                    </div>
                                </details>
                            ))}
                        </div>"""
if old2 in c: c = c.replace(old2, new2); fixes += 1; print("✅ Acordeón ejercicio")
else: print("❌ Acordeón ejercicio")

# ── 3. MENSAJE LUMI ejercicio (borde rojo → dorado) ──
old3 = """                        <div className={`${darkMode ? 'bg-rose-900' : 'bg-amber-50'} rounded-xl shadow p-5 border-l-4 border-rose-400`}>
                            <div className="flex items-start gap-3">
                                <span className="text-2xl">💜</span>
                                <p className={`text-sm ${darkMode ? 'text-purple-200' : 'text-rose-900'} font-medium leading-relaxed`}>
                                    {getLumiMessage('exercise')}
                                </p>
                            </div>
                        </div>"""
new3 = """                        <div style={{background:darkMode?'rgba(201,147,90,0.08)':'rgba(253,248,243,0.95)',borderRadius:'1.1rem',padding:'1rem 1.25rem',borderLeft:'3px solid #C9935A'}}>
                            <div style={{display:'flex',alignItems:'flex-start',gap:'0.75rem'}}>
                                <img src="/images/lumi.png" style={{width:'28px',height:'28px',borderRadius:'50%',objectFit:'cover',flexShrink:0}} alt="LUMI" />
                                <p style={{fontSize:'0.88rem',color:darkMode?'#e8d5c0':'#57534e',fontStyle:'italic',lineHeight:1.6}}>
                                    {getLumiMessage('exercise')}
                                </p>
                            </div>
                        </div>"""
if old3 in c: c = c.replace(old3, new3); fixes += 1; print("✅ LUMI message ejercicio")
else: print("❌ LUMI message ejercicio")

# ── 4. NUDGE FREE morado → dorado ──
old4 = """                        {getUserTier() === 'free' && (
                            <div className={`${darkMode ? 'bg-purple-900/40 border-purple-700' : 'bg-purple-50 border-purple-200'} rounded-xl p-4 border flex items-start gap-3`}>
                                <span className="text-xl">✨</span>
                                <div>
                                    <p className={`text-sm font-semibold ${darkMode ? 'text-purple-200' : 'text-purple-800'}`}>
                                        {language === 'es' ? 'Con Premium, estos ejercicios se adaptan cada día según cómo te sientes' : 'With Premium, these exercises adapt every day based on how you feel'}
                                    </p>
                                    <p className={`text-xs mt-1 ${darkMode ? 'text-purple-300' : 'text-purple-600'}`}>
                                        {language === 'es' 
                                            ? 'Si tienes dolor articular, bajo ánimo o estás en periodo, Lumera lo detecta y ajusta automáticamente.' 
                                            : 'If you have joint pain, low mood or are on your period, Lumera detects it and adjusts automatically.'}
                                    </p>
                                </div>
                            </div>
                        )}"""
new4 = """                        {getUserTier() === 'free' && (
                            <div style={{background:darkMode?'rgba(201,147,90,0.1)':'rgba(253,248,243,0.95)',borderRadius:'1.1rem',padding:'1rem 1.25rem',border:'1px solid rgba(201,147,90,0.25)',display:'flex',alignItems:'flex-start',gap:'0.75rem'}}>
                                <span style={{color:'#C9935A',fontSize:'1.1rem',flexShrink:0}}>✦</span>
                                <div>
                                    <p style={{fontSize:'0.85rem',fontWeight:600,color:darkMode?'#e8d5c0':'#92580a',marginBottom:'0.25rem'}}>
                                        {language === 'es' ? 'Con Premium, estos ejercicios se adaptan cada día según cómo te sientes' : 'With Premium, these exercises adapt every day based on how you feel'}
                                    </p>
                                    <p style={{fontSize:'0.78rem',color:darkMode?'#a8a29e':'#78716c',lineHeight:1.5}}>
                                        {language === 'es' 
                                            ? 'Si tienes dolor articular, bajo ánimo o estás en periodo, Lumera lo detecta y ajusta automáticamente.' 
                                            : 'If you have joint pain, low mood or are on your period, Lumera detects it and adjusts automatically.'}
                                    </p>
                                </div>
                            </div>
                        )}"""
if old4 in c: c = c.replace(old4, new4); fixes += 1; print("✅ Nudge free dorado")
else: print("❌ Nudge free")

# ── 5. MODAL PREMIUM colores + IVA ──
old5 = """                                <div className="bg-gradient-to-r from-rose-400 to-amber-300 text-white p-6">
                                    <h3 className="font-bold text-2xl mb-1">{language === 'es' ? 'Elige tu plan' : 'Choose your plan'}</h3>
                                    <p className="text-sm opacity-90">{language === 'es' ? 'Cancela cuando quieras' : 'Cancel anytime'}</p>
                                </div>"""
new5 = """                                <div style={{background:'linear-gradient(135deg,#C9935A,#e8c89f)',padding:'1.5rem',color:'white'}}>
                                    <p style={{fontSize:'0.7rem',letterSpacing:'0.15em',opacity:0.85,marginBottom:'0.25rem'}}>✦ LUMERA</p>
                                    <h3 style={{fontFamily:"'Cormorant',serif",fontSize:'1.8rem',fontWeight:500,marginBottom:'0.25rem'}}>{language === 'es' ? 'Elige tu plan' : 'Choose your plan'}</h3>
                                    <p style={{fontSize:'0.8rem',opacity:0.85}}>{language === 'es' ? 'Cancela cuando quieras · Precios + IVA' : 'Cancel anytime · Prices excl. VAT'}</p>
                                </div>"""
if old5 in c: c = c.replace(old5, new5); fixes += 1; print("✅ Modal header")
else: print("❌ Modal header")

# ── 6. MODAL botón mensual borde → dorado ──
old6 = """                                    <button onClick={() => { setShowPlanModal(false); handleSubscribe('monthly'); }} className={`w-full ${darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-50 hover:bg-gray-100'} rounded-xl p-5 text-left border-2 border-transparent hover:border-rose-400 transition`}>"""
new6 = """                                    <button onClick={() => { setShowPlanModal(false); handleSubscribe('monthly'); }} style={{width:'100%',background:darkMode?'rgba(255,255,255,0.05)':'rgba(253,248,243,0.8)',borderRadius:'1rem',padding:'1.1rem 1.25rem',textAlign:'left',border:'1.5px solid rgba(201,147,90,0.2)',cursor:'pointer',transition:'all 0.2s'}} onMouseOver={e=>e.currentTarget.style.borderColor='#C9935A'} onMouseOut={e=>e.currentTarget.style.borderColor='rgba(201,147,90,0.2)'}>"""
if old6 in c: c = c.replace(old6, new6); fixes += 1; print("✅ Modal botón mensual")
else: print("❌ Modal botón mensual")

# ── 7. PRECIO mensual color → dorado ──
old7 = """                                                <div className="text-2xl font-bold text-rose-500">{PRICES[userRegion].monthly}</div>
                                                <div className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{language === 'es' ? 'por mes' : 'per month'}</div>"""
new7 = """                                                <div style={{fontSize:'1.5rem',fontWeight:700,color:'#C9935A'}}>{PRICES[userRegion].monthly}</div>
                                                <div style={{fontSize:'0.72rem',color:'#78716c'}}>{language === 'es' ? 'por mes + IVA' : 'per month + VAT'}</div>"""
if old7 in c: c = c.replace(old7, new7); fixes += 1; print("✅ Precio mensual")
else: print("❌ Precio mensual")

# ── 8. MODAL botón anual borde → dorado ──
old8 = """                                    <button onClick={() => { setShowPlanModal(false); handleSubscribe('annual'); }} className={`w-full bg-gradient-to-r from-rose-50 to-amber-50 ${darkMode ? 'from-rose-900/20 to-amber-900/20' : ''} rounded-xl p-5 text-left border-2 border-rose-400 hover:border-rose-500 transition relative`}>
                                        <div className="absolute top-2 right-2 bg-rose-500 text-white text-xs font-bold px-2 py-1 rounded-full">{language === 'es' ? `Ahorra ${PRICES[userRegion].annualSavings}` : `Save ${PRICES[userRegion].annualSavings}`}</div>"""
new8 = """                                    <button onClick={() => { setShowPlanModal(false); handleSubscribe('annual'); }} style={{width:'100%',background:darkMode?'rgba(201,147,90,0.08)':'rgba(253,248,243,0.95)',borderRadius:'1rem',padding:'1.1rem 1.25rem',textAlign:'left',border:'1.5px solid #C9935A',cursor:'pointer',position:'relative',transition:'all 0.2s'}}>
                                        <div style={{position:'absolute',top:'0.5rem',right:'0.5rem',background:'linear-gradient(135deg,#C9935A,#e8c89f)',color:'white',fontSize:'0.7rem',fontWeight:700,padding:'0.2rem 0.6rem',borderRadius:'9999px'}}>{language === 'es' ? `Ahorra ${PRICES[userRegion].annualSavings}` : `Save ${PRICES[userRegion].annualSavings}`}</div>"""
if old8 in c: c = c.replace(old8, new8); fixes += 1; print("✅ Modal botón anual")
else: print("❌ Modal botón anual")

# ── 9. PRECIO anual color → dorado ──
old9 = """                                                <div className="text-2xl font-bold text-rose-500">{PRICES[userRegion].annual}</div>
                                                <div className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{language === 'es' ? 'por año' : 'per year'}</div>
                                                <div className={`text-xs line-through ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>{PRICES[userRegion].annualOriginal}</div>"""
new9 = """                                                <div style={{fontSize:'1.5rem',fontWeight:700,color:'#C9935A'}}>{PRICES[userRegion].annual}</div>
                                                <div style={{fontSize:'0.72rem',color:'#78716c'}}>{language === 'es' ? 'por año + IVA' : 'per year + VAT'}</div>
                                                <div style={{fontSize:'0.72rem',textDecoration:'line-through',color:'#a8a29e'}}>{PRICES[userRegion].annualOriginal}</div>"""
if old9 in c: c = c.replace(old9, new9); fixes += 1; print("✅ Precio anual")
else: print("❌ Precio anual")

# ── 10. MITOS (aun pendiente) ──
old10 = '                    <div className="pb-32 space-y-6" key={`myths-${language}`}>'
new10 = '                    <div className="pb-32 space-y-5" key={`myths-${language}`} style={{background:darkMode?"transparent":"linear-gradient(180deg,#fdf8f3,#fdf4ee)",minHeight:"100vh",padding:"1rem"}}>'
if old10 in c: c = c.replace(old10, new10); fixes += 1; print("✅ Mitos fondo")
else: print("❌ Mitos fondo (ya aplicado o no encontrado)")

# ── 11. TIPS (aun pendiente) ──
old11 = '                    <div className="pb-32 space-y-6" key={`tips-${language}`}>'
new11 = '                    <div className="pb-32 space-y-5" key={`tips-${language}`} style={{background:darkMode?"transparent":"linear-gradient(180deg,#fdf8f3,#fdf4ee)",minHeight:"100vh",padding:"1rem"}}>'
if old11 in c: c = c.replace(old11, new11); fixes += 1; print("✅ Tips fondo")
else: print("❌ Tips fondo (ya aplicado o no encontrado)")

# ── 12. SÍNTOMAS emojis → ✦ ──
old12 = """                                    { key: 'sleep', label: language === 'es' ? 'Calidad del sueño' : 'Sleep quality', emoji: '😴' },
                                    { key: 'energy', label: language === 'es' ? 'Nivel de energía' : 'Energy level', emoji: '⚡' },
                                    { key: 'mood', label: language === 'es' ? 'Ánimo' : 'Mood', emoji: '😊' },
                                    { key: 'hotFlashes', label: language === 'es' ? 'Sofocos' : 'Hot flashes', emoji: '🔥' },
                                    { key: 'anxiety', label: language === 'es' ? 'Ansiedad' : 'Anxiety', emoji: '😰' },
                                    { key: 'vaginalDryness', label: language === 'es' ? 'Sequedad vaginal' : 'Vaginal dryness', emoji: '💧' },
                                    { key: 'brainFog', label: language === 'es' ? 'Niebla mental' : 'Brain fog', emoji: '🌫️' },
                                    { key: 'memory', label: language === 'es' ? 'Memoria/Claridad' : 'Memory/Clarity', emoji: '🧠' }"""
new12 = """                                    { key: 'sleep', label: language === 'es' ? 'Calidad del sueño' : 'Sleep quality' },
                                    { key: 'energy', label: language === 'es' ? 'Nivel de energía' : 'Energy level' },
                                    { key: 'mood', label: language === 'es' ? 'Ánimo' : 'Mood' },
                                    { key: 'hotFlashes', label: language === 'es' ? 'Sofocos' : 'Hot flashes' },
                                    { key: 'anxiety', label: language === 'es' ? 'Ansiedad' : 'Anxiety' },
                                    { key: 'vaginalDryness', label: language === 'es' ? 'Sequedad vaginal' : 'Vaginal dryness' },
                                    { key: 'brainFog', label: language === 'es' ? 'Niebla mental' : 'Brain fog' },
                                    { key: 'memory', label: language === 'es' ? 'Memoria/Claridad' : 'Memory/Clarity' }"""
if old12 in c: c = c.replace(old12, new12); fixes += 1; print("✅ Síntomas sin emojis")
else: print("❌ Síntomas emojis (ya aplicado)")

# ── 13. SÍNTOMAS label con emoji → ✦ ──
old13 = '                                            <label className="text-sm font-semibold">{item.emoji} {item.label}</label>'
new13 = '                                            <label style={{fontSize:"0.85rem",fontWeight:600,color:darkMode?"#e8d5c0":"#57534e"}}><span style={{color:"#C9935A",marginRight:"0.3rem"}}>✦</span>{item.label}</label>'
if old13 in c: c = c.replace(old13, new13); fixes += 1; print("✅ Síntomas label ✦")
else: print("❌ Síntomas label (ya aplicado)")

# ── 14. SÍNTOMAS slider accent-rose → lumera-slider ──
old14 = '                                        <input type="range" min="0" max="10" value={symptomForm[item.key]} onChange={(e) => setSymptomForm({...symptomForm, [item.key]: parseInt(e.target.value)})} className="w-full accent-rose-500"/>'
new14 = '                                        <input type="range" min="0" max="10" value={symptomForm[item.key]} onChange={(e) => setSymptomForm({...symptomForm, [item.key]: parseInt(e.target.value)})} className="lumera-slider w-full" style={{"--val":symptomForm[item.key]}}/>'
if old14 in c: c = c.replace(old14, new14); fixes += 1; print("✅ Slider dorado")
else: print("❌ Slider (ya aplicado)")

# ── 15. HEADER logo mix-blend ──
old15 = '<img src="/images/lumera_icon_nobg.png" style={{width:"36px",height:"36px",objectFit:"contain"}} alt="Lumera" />'
new15 = '<img src="/images/lumera_icon_nobg.png" style={{width:"36px",height:"36px",objectFit:"contain",mixBlendMode:"multiply"}} alt="Lumera" />'
if old15 in c: c = c.replace(old15, new15); fixes += 1; print("✅ Logo mix-blend")
else: print("❌ Logo mix-blend")

# ── 16. HEADER botón Premium 💎 → ✦ ──
old16 = '💎 {language === \'es\' ? \'Hazte Premium\' : \'Go Premium\'}'
new16 = '✦ {language === \'es\' ? \'Hazte Premium\' : \'Go Premium\'}'
if old16 in c: c = c.replace(old16, new16); fixes += 1; print("✅ Premium ✦")
else: print("❌ Premium ✦ (ya aplicado)")

f = open('app/lumera/LumeraApp.jsx', 'w')
f.write(c)
f.close()
print(f"\nTotal fixes: {fixes}/16")
