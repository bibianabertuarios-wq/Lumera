f = open('app/lumera/LumeraApp.jsx', 'r')
c = f.read()
f.close()
fixes = 0

# ── 1. Cards dashboard: emojis → imágenes, accents → dorado ──
old1 = """                            {[
                                {icon:'📝',es:'Síntomas',en:'Symptoms',desc_es:'Registra cómo te sientes hoy',desc_en:'Log how you feel today',page:'symptoms',accent:'rgba(124,58,237,0.85)'},
                                {icon:'🍽️',es:'Nutrición',en:'Nutrition',desc_es:'Menú adaptado a ti',desc_en:'Menu adapted to you',page:'nutrition',accent:'rgba(236,72,153,0.85)'},
                                {icon:'💪',es:'Ejercicio',en:'Exercise',desc_es:'Rutina para esta etapa',desc_en:'Routine for this stage',page:'exercise',accent:'rgba(168,85,247,0.85)'},
                                {icon:'🧠',es:'LUMI',en:'LUMI',desc_es:'Tu coach personal',desc_en:'Your personal coach',page:'chat',accent:'rgba(244,63,94,0.85)'}
                            ].map((action,i) => (
                                <div key={i} onClick={() => setCurrentPage(action.page)}
                                    style={{position:'relative',borderRadius:'1.25rem',padding:'1.25rem 1rem',cursor:'pointer',overflow:'hidden',
                                        background: darkMode ? 'rgba(255,255,255,0.06)' : 'rgba(255,255,255,0.72)',
                                        backdropFilter:'blur(16px)',WebkitBackdropFilter:'blur(16px)',
                                        border: darkMode ? '1px solid rgba(255,255,255,0.1)' : '1px solid rgba(255,255,255,0.9)',
                                        boxShadow: darkMode ? '0 4px 24px rgba(0,0,0,0.3)' : '0 4px 24px rgba(124,58,237,0.1)',
                                        transition:'transform 0.15s'}}
                                    onMouseEnter={e=>{e.currentTarget.style.transform='scale(1.03)'}}
                                    onMouseLeave={e=>{e.currentTarget.style.transform='scale(1)'}}>
                                    <div style={{position:'absolute',top:'-1rem',right:'-1rem',width:'4rem',height:'4rem',borderRadius:'9999px',background:action.accent,filter:'blur(20px)',opacity:0.5,pointerEvents:'none'}}/>
                                    <div style={{fontSize:'1.75rem',marginBottom:'0.5rem'}}>{action.icon}</div>"""
new1 = """                            {[
                                {img:'/images/sintomas.png',es:'Síntomas',en:'Symptoms',desc_es:'Registra cómo te sientes hoy',desc_en:'Log how you feel today',page:'symptoms'},
                                {img:'/images/menu.png',es:'Nutrición',en:'Nutrition',desc_es:'Menú adaptado a ti',desc_en:'Menu adapted to you',page:'nutrition'},
                                {img:'/images/ejercicio.png',es:'Ejercicio',en:'Exercise',desc_es:'Rutina para esta etapa',desc_en:'Routine for this stage',page:'exercise'},
                                {img:'/images/lumi.png',es:'LUMI',en:'LUMI',desc_es:'Tu coach personal',desc_en:'Your personal coach',page:'chat'}
                            ].map((action,i) => (
                                <div key={i} onClick={() => setCurrentPage(action.page)}
                                    style={{position:'relative',borderRadius:'1.25rem',padding:'1.25rem 1rem',cursor:'pointer',overflow:'hidden',
                                        background: darkMode ? 'rgba(255,255,255,0.06)' : 'rgba(255,255,255,0.85)',
                                        backdropFilter:'blur(16px)',WebkitBackdropFilter:'blur(16px)',
                                        border: darkMode ? '1px solid rgba(201,147,90,0.15)' : '1px solid rgba(201,147,90,0.2)',
                                        boxShadow: darkMode ? '0 4px 24px rgba(0,0,0,0.3)' : '0 4px 20px rgba(201,147,90,0.1)',
                                        transition:'transform 0.15s'}}
                                    onMouseEnter={e=>{e.currentTarget.style.transform='scale(1.03)'}}
                                    onMouseLeave={e=>{e.currentTarget.style.transform='scale(1)'}}>
                                    <div style={{position:'absolute',top:'-1rem',right:'-1rem',width:'4rem',height:'4rem',borderRadius:'9999px',background:'rgba(201,147,90,0.3)',filter:'blur(20px)',opacity:0.4,pointerEvents:'none'}}/>
                                    <img src={action.img} style={{width:'36px',height:'36px',borderRadius:'50%',objectFit:'cover',marginBottom:'0.5rem'}} alt="" />"""
if old1 in c: c = c.replace(old1, new1); fixes += 1; print("✅ Cards dashboard imágenes")
else: print("❌ Cards dashboard")

# ── 2. Consejos: tips puede ser undefined ──
# Buscar la línea exacta del renderTips
old2 = '{(tips || []).map((tip, idx) => ('
if old2 in c:
    print("✅ Tips fix ya aplicado")
else:
    old2b = '{tips.map((tip, idx) => ('
    if old2b in c:
        c = c.replace(old2b, '{(tips || []).map((tip, idx) => (')
        fixes += 1
        print("✅ Tips fix aplicado")
    else:
        print("❌ Tips map — buscando...")
        idx = c.find('tips.map')
        if idx > 0: print(c[idx-20:idx+60])

# ── 3. getMythsAndTips — asegurar que tips siempre retorna array ──
old3 = 'const getMythsAndTips = () => {'
# Buscar el return de tips para ver si puede ser undefined
idx3 = c.find('const getMythsAndTips = () => {')
print(f"getMythsAndTips en idx: {idx3}, linea aprox {c[:idx3].count(chr(10))+1}")

f = open('app/lumera/LumeraApp.jsx', 'w')
f.write(c)
f.close()
print(f"\nTotal: {fixes}")
