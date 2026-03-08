f = open('app/lumera/LumeraApp.jsx', 'r')
c = f.read()
f.close()
fixes = 0

# ── 1. BANNER TRIAL elegante ──
old1 = """                    {currentUser && currentUser.subscription_status !== 'active' && getTrialDaysLeft() > 0 && (
                        <div className={`${darkMode ? 'bg-gradient-to-r from-purple-900 to-pink-900' : 'bg-gradient-to-r from-rose-100 to-amber-100'} border-b ${darkMode ? 'border-gray-700' : 'border-rose-200'} px-4 py-3`}>
                            <div className="max-w-4xl mx-auto flex items-center justify-between flex-wrap gap-3">
                                <div className="flex items-center gap-3">
                                    <span className="text-2xl">
                                        {getTrialDaysLeft() === 3 ? '✨' : getTrialDaysLeft() === 2 ? '💜' : '⏰'}
                                    </span>
                                    <div>
                                        <p className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                                            {getTrialDaysLeft() === 3 && (language === 'es' 
                                                ? 'Día 1 de 3 de tu prueba gratuita'
                                                : 'Day 1 of 3 of your free trial')}
                                            {getTrialDaysLeft() === 2 && (language === 'es'
                                                ? 'Día 2 de 3 - ¿Ya viste tus planes personalizados?'
                                                : 'Day 2 of 3 - Have you seen your personalized plans?')}
                                            {getTrialDaysLeft() === 1 && (language === 'es'
                                                ? '⏰ Último día de tu prueba'
                                                : '⏰ Last day of your trial')}
                                        </p>
                                        <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                                            {getTrialDaysLeft() === 3 && (language === 'es'
                                                ? 'Explora todo Lumera sin límites'
                                                : 'Explore all of Lumera without limits')}
                                            {getTrialDaysLeft() === 2 && (language === 'es'
                                                ? 'Mañana es tu último día de acceso completo'
                                                : 'Tomorrow is your last day of full access')}
                                            {getTrialDaysLeft() === 1 && (language === 'es'
                                                ? 'Como agradecimiento: 20% off si te suscribes hoy'
                                                : 'As a thank you: 20% off if you subscribe today')}
                                        </p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => setShowPlanModal(true)}
                                    className={`px-4 py-2 rounded-full font-semibold whitespace-nowrap text-sm ${
                                        darkMode 
                                            ? 'bg-white text-purple-900 hover:bg-gray-100' 
                                            : 'bg-gradient-to-r from-rose-500 to-amber-500 text-white hover:opacity-90'"""
new1 = """                    {currentUser && currentUser.subscription_status !== 'active' && getTrialDaysLeft() > 0 && (
                        <div style={{background:darkMode?'rgba(201,147,90,0.12)':'linear-gradient(135deg,rgba(253,248,243,0.98),rgba(253,244,238,0.98))',borderBottom:'1px solid rgba(201,147,90,0.2)',padding:'0.75rem 1rem'}}>
                            <div style={{maxWidth:'900px',margin:'0 auto',display:'flex',alignItems:'center',justifyContent:'space-between',flexWrap:'wrap',gap:'0.75rem'}}>
                                <div style={{display:'flex',alignItems:'center',gap:'0.75rem'}}>
                                    <span style={{color:'#C9935A',fontSize:'1rem'}}>✦</span>
                                    <div>
                                        <p style={{fontFamily:"'Cormorant',serif",fontSize:'0.95rem',fontWeight:600,color:darkMode?'#e8d5c0':'#292524'}}>
                                            {getTrialDaysLeft() === 3 && (language === 'es' 
                                                ? 'Día 1 de 3 — Explora Lumera sin límites'
                                                : 'Day 1 of 3 — Explore Lumera freely')}
                                            {getTrialDaysLeft() === 2 && (language === 'es'
                                                ? 'Día 2 de 3 — ¿Ya exploraste tus planes?'
                                                : 'Day 2 of 3 — Have you seen your plans?')}
                                            {getTrialDaysLeft() === 1 && (language === 'es'
                                                ? 'Último día de tu prueba gratuita'
                                                : 'Last day of your free trial')}
                                        </p>
                                        <p style={{fontSize:'0.75rem',color:darkMode?'#a8a29e':'#78716c'}}>
                                            {getTrialDaysLeft() === 1 && (language === 'es'
                                                ? '20% de descuento si te suscribes hoy'
                                                : '20% off if you subscribe today')}
                                        </p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => setShowPlanModal(true)}
                                    style={{background:'linear-gradient(135deg,#C9935A,#e8c89f)',color:'white',border:'none',borderRadius:'9999px',padding:'0.45rem 1.1rem',fontSize:'0.8rem',fontWeight:600,cursor:'pointer',whiteSpace:'nowrap'}}
                                    className={`px-4 py-2 rounded-full font-semibold whitespace-nowrap text-sm ${
                                        darkMode 
                                            ? 'bg-white text-purple-900 hover:bg-gray-100' 
                                            : 'bg-gradient-to-r from-rose-500 to-amber-500 text-white hover:opacity-90'"""
if old1 in c: c = c.replace(old1, new1); fixes += 1; print("✅ Banner trial")
else: print("❌ Banner trial")

# ── 2. PERÍODO sliders accent-rose → lumera-slider ──
old2 = """                                    <input type="range" min="1" max="10" value={periodForm.intensity} onChange={(e) => setPeriodForm({...periodForm, intensity: parseInt(e.target.value)})} className="w-full accent-rose-500"/>
                                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{periodForm.intensity}/10</p>
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold mb-2">{language === 'es' ? 'Duración (días)' : 'Duration (days)'}</label>
                                    <input type="range" min="1" max="10" value={periodForm.duration} onChange={(e) => setPeriodForm({...periodForm, duration: parseInt(e.target.value)})} className="w-full accent-rose-500"/>
                                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{periodForm.duration} {language === 'es' ? 'días' : 'days'}</p>"""
new2 = """                                    <input type="range" min="1" max="10" value={periodForm.intensity} onChange={(e) => setPeriodForm({...periodForm, intensity: parseInt(e.target.value)})} className="lumera-slider w-full" style={{'--val':periodForm.intensity}}/>
                                    <p style={{fontSize:'0.8rem',color:'#C9935A',fontWeight:600,marginTop:'0.25rem'}}>{periodForm.intensity}/10</p>
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold mb-2">{language === 'es' ? 'Duración (días)' : 'Duration (days)'}</label>
                                    <input type="range" min="1" max="10" value={periodForm.duration} onChange={(e) => setPeriodForm({...periodForm, duration: parseInt(e.target.value)})} className="lumera-slider w-full" style={{'--val':periodForm.duration}}/>
                                    <p style={{fontSize:'0.8rem',color:'#C9935A',fontWeight:600,marginTop:'0.25rem'}}>{periodForm.duration} {language === 'es' ? 'días' : 'days'}</p>"""
if old2 in c: c = c.replace(old2, new2); fixes += 1; print("✅ Período sliders")
else: print("❌ Período sliders")

# ── 3. PERÍODO fondo crema + imagen ──
old3 = """                    <div className="pb-32 space-y-8" key={`period-${language}`}>
                        <h2 className="text-3xl font-light gradient-text">{t[language].period}</h2>

                        <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-lg p-6 space-y-6`}>
                            <h3 className="font-semibold text-lg">{language === 'es' ? 'Registra tu período' : 'Record your period'}</h3>"""
new3 = """                    <div className="pb-32 space-y-5" key={`period-${language}`} style={{background:darkMode?'transparent':'linear-gradient(180deg,#fdf8f3,#fdf4ee)',minHeight:'100vh',padding:'1rem'}}>
                        <div style={{position:'relative',borderRadius:'1.25rem',overflow:'hidden',marginBottom:'0.5rem',height:'110px'}}>
                            <img src="/images/periodo.png" style={{width:'100%',height:'100%',objectFit:'cover',filter:'brightness(0.65)'}} alt="" />
                            <div style={{position:'absolute',inset:0,display:'flex',alignItems:'center',padding:'1.25rem'}}>
                                <div>
                                    <p style={{color:'rgba(255,255,255,0.8)',fontSize:'0.7rem',letterSpacing:'0.15em'}}>✦ LUMERA</p>
                                    <h2 style={{fontFamily:"'Cormorant',serif",fontSize:'1.8rem',fontWeight:500,color:'white',lineHeight:1.2}}>{t[language].period}</h2>
                                </div>
                            </div>
                        </div>

                        <div style={{background:darkMode?'rgba(255,255,255,0.05)':'rgba(255,255,255,0.92)',borderRadius:'1.1rem',padding:'1.25rem',border:'1px solid rgba(201,147,90,0.15)'}}>
                            <h3 style={{fontFamily:"'Cormorant',serif",fontSize:'1.1rem',fontWeight:600,color:darkMode?'#e8d5c0':'#292524',marginBottom:'1rem'}}>{language === 'es' ? 'Registra tu período' : 'Record your period'}</h3>"""
if old3 in c: c = c.replace(old3, new3); fixes += 1; print("✅ Período fondo")
else: print("❌ Período fondo")

f = open('app/lumera/LumeraApp.jsx', 'w')
f.write(c)
f.close()
print(f"\nTotal: {fixes}/3")
