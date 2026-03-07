f = open('app/lumera/LumeraApp.jsx', 'r')
c = f.read()
f.close()

old1 = """                return (
                    <div className="pb-32 space-y-6" key={language} style={{background: bgPage}}>
                        {/* ── HERO TRIAL ── */}"""
new1 = """                return (
                    <div className="pb-32 space-y-6" key={language} style={{background: bgPage, position: 'relative'}}>
                        <video autoPlay loop muted playsInline src="/videos/Dashboard.mp4"
                            style={{position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover', zIndex: 0, pointerEvents: 'none', opacity: 0.18}} />
                        {/* ── HERO TRIAL ── */}"""

old2 = """                return (
                    <div className="pb-32 space-y-8" key={`nutrition-${language}`}>
                        <h2 className="text-3xl font-light gradient-text">{t[language].nutrition}</h2>"""
new2 = """                return (
                    <div className="pb-32 space-y-8" key={`nutrition-${language}`} style={{position: 'relative'}}>
                        <video autoPlay loop muted playsInline src="/videos/menu.mp4"
                            style={{position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover', zIndex: 0, pointerEvents: 'none', opacity: 0.18}} />
                        <h2 className="text-3xl font-light gradient-text">{t[language].nutrition}</h2>"""

old3 = """                return (
                    <div className="pb-32 space-y-8" key={`exercise-${language}`}>
                        <div>
                            <h2 className="text-3xl font-light gradient-text">{t[language].exercise}</h2>"""
new3 = """                return (
                    <div className="pb-32 space-y-8" key={`exercise-${language}`} style={{position: 'relative'}}>
                        <video autoPlay loop muted playsInline src="/videos/ejercicio.mp4"
                            style={{position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover', zIndex: 0, pointerEvents: 'none', opacity: 0.18}} />
                        <div>
                            <h2 className="text-3xl font-light gradient-text">{t[language].exercise}</h2>"""

if old1 in c: c = c.replace(old1, new1); print("✅ Home video OK")
else: print("❌ Home — no encontrado")

if old2 in c: c = c.replace(old2, new2); print("✅ Nutrición video OK")
else: print("❌ Nutrición — no encontrado")

if old3 in c: c = c.replace(old3, new3); print("✅ Ejercicio video OK")
else: print("❌ Ejercicio — no encontrado")

f = open('app/lumera/LumeraApp.jsx', 'w')
f.write(c)
f.close()
print("✅ Archivo guardado")
