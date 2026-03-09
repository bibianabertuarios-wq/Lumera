f = open('app/lumera/LumeraApp.jsx', 'r')
c = f.read()
f.close()
fixes = 0

# ── 1. Logo filter correcto (dorado real) ──
old_filter = "filter:'brightness(0) invert(0.4) sepia(1) saturate(0.5) hue-rotate(300deg)'"
new_filter = "filter:'invert(1) sepia(1) saturate(2) hue-rotate(5deg) brightness(0.85)'"
count = c.count(old_filter)
if count > 0:
    c = c.replace(old_filter, new_filter)
    fixes += 1; print(f"✅ Logo filter dorado ({count})")
else: print("❌ Logo filter")

# ── 2. Badge Premium morado → dorado en header ──
old_badge = """                                <div className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full">
                                        <span className="text-white text-sm font-semibold">✦ Premium</span>
                                    </div>"""
new_badge = """                                <div style={{display:'flex',alignItems:'center',gap:'0.4rem',padding:'0.4rem 1rem',borderRadius:'9999px',background:'linear-gradient(135deg,#C9935A,#e8c89f)'}}>
                                        <span style={{color:'white',fontSize:'0.8rem',fontWeight:600}}>✦ Premium</span>
                                    </div>"""
if old_badge in c: c = c.replace(old_badge, new_badge); fixes += 1; print("✅ Badge Premium dorado")
else: print("❌ Badge Premium")

# ── 3. Tabla header morado → dorado ──
old_th = """                                        <th style={{padding: '0.75rem 1rem', textAlign: 'center', color: '#7c3aed', fontWeight: 700}}>
                                            ✦ Premium
                                        </th>"""
new_th = """                                        <th style={{padding: '0.75rem 1rem', textAlign: 'center', color: '#C9935A', fontWeight: 700}}>
                                            ✦ Premium
                                        </th>"""
if old_th in c: c = c.replace(old_th, new_th); fixes += 1; print("✅ Tabla th dorado")
else: print("❌ Tabla th")

# ── 4. CTA morado → dorado ──
old_cta = """                        <div style={{
                            background: 'linear-gradient(135deg, #7c3aed 0%, #a855f7 55%, #ec4899 100%)',
                            borderRadius: '1.5rem',
                            padding: '2rem 1.75rem',
                            textAlign: 'center',
                            color: 'white',
                            boxShadow: '0 8px 32px rgba(124,58,237,0.25)'
                        }}>"""
new_cta = """                        <div style={{
                            background: 'linear-gradient(135deg, #C9935A 0%, #e8c89f 100%)',
                            borderRadius: '1.5rem',
                            padding: '2rem 1.75rem',
                            textAlign: 'center',
                            color: 'white',
                            boxShadow: '0 8px 32px rgba(201,147,90,0.25)'
                        }}>"""
if old_cta in c: c = c.replace(old_cta, new_cta); fixes += 1; print("✅ CTA dorado")
else: print("❌ CTA")

# ── 5. Período botón morado → dorado ──
old_period_btn = "className={`w-full py-3 rounded-xl font-semibold text-white ${darkMode ? 'bg-purple-600 hover:bg-purple-700' : 'bg-gradient-to-r from-rose-400 to-amber-400 hover:opacity-90'}"
new_period_btn = "style={{width:'100%',padding:'0.75rem',borderRadius:'0.75rem',fontWeight:600,color:'white',background:'linear-gradient(135deg,#C9935A,#e8c89f)',border:'none',cursor:'pointer'}} className=\"\""
if old_period_btn in c: c = c.replace(old_period_btn, new_period_btn); fixes += 1; print("✅ Período botón dorado")
else:
    # buscar variante
    idx = c.find('Registrar y recibir')
    if idx > 0:
        print(f"Período botón en idx {idx}: {c[max(0,idx-150):idx+30]}")
    else: print("❌ Período botón no encontrado")

# ── 6. Período input border → dorado ──
old_input = "className={`w-full px-4 py-2 border rounded-lg ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'border-gray-300'}`}/>"
new_input = "style={{width:'100%',padding:'0.5rem 1rem',border:'1px solid rgba(201,147,90,0.3)',borderRadius:'0.6rem',background:darkMode?'rgba(255,255,255,0.05)':'white',color:darkMode?'white':'#292524',outline:'none'}}/>"
count2 = c.count(old_input)
if count2 > 0: c = c.replace(old_input, new_input); fixes += 1; print(f"✅ Período inputs dorado ({count2})")
else: print("❌ Período inputs")

f = open('app/lumera/LumeraApp.jsx', 'w')
f.write(c)
f.close()
print(f"\nTotal: {fixes}/6")
