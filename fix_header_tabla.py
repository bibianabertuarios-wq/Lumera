f = open('app/lumera/LumeraApp.jsx', 'r')
c = f.read()
f.close()
fixes = 0

# ── 1. Logo: quitar filter raro, usar solo la imagen con fondo blanco del header ──
old_filter = "filter:'invert(1) sepia(1) saturate(2) hue-rotate(5deg) brightness(0.85)'"
new_filter = "filter:'none',mixBlendMode:'multiply'"
count = c.count(old_filter)
if count > 0:
    c = c.replace(old_filter, new_filter)
    fixes += 1; print(f"✅ Logo filter limpio ({count})")
else: print("❌ Logo filter")

# ── 2. Header: más espacio para que "Lumera" no se corte ──
old_header = "className=\"max-w-6xl mx-auto px-4 py-4 flex justify-between items-center\""
new_header = "className=\"max-w-6xl mx-auto px-3 py-3 flex justify-between items-center\" style={{gap:'0.5rem'}}"
if old_header in c:
    c = c.replace(old_header, new_header)
    fixes += 1; print("✅ Header padding reducido")
else: print("❌ Header padding")

# ── 3. Sliders período: agregar clase lumera-slider ──
old_sl1 = 'onChange={(e) => setPeriodForm({...periodForm, intensity: parseInt(e.target.value)})} className="lumera-slider w-full"'
if old_sl1 in c:
    print("✅ Período sliders ya tienen lumera-slider")
else:
    old_sl1b = 'onChange={(e) => setPeriodForm({...periodForm, intensity: parseInt(e.target.value)})} className="w-full"'
    new_sl1b = 'onChange={(e) => setPeriodForm({...periodForm, intensity: parseInt(e.target.value)})} className="lumera-slider w-full"'
    if old_sl1b in c:
        c = c.replace(old_sl1b, new_sl1b)
        fixes += 1; print("✅ Período slider intensidad")
    else:
        print("❌ slider intensidad — buscar manualmente")
        idx = c.find('setPeriodForm({...periodForm, intensity')
        print(c[idx:idx+120])

# ── 4. Tabla: header morado → dorado ──
old_tabla_h = "background: 'linear-gradient(135deg, #7c3aed, #a855f7)', padding: '1.1rem 1.5rem'"
new_tabla_h = "background: 'linear-gradient(135deg, #C9935A, #e8c89f)', padding: '1.1rem 1.5rem'"
if old_tabla_h in c:
    c = c.replace(old_tabla_h, new_tabla_h)
    fixes += 1; print("✅ Tabla header dorado")
else: print("❌ Tabla header")

# ── 5. Tabla thead morado leve → dorado ──
old_thead = "darkMode ? 'rgba(124,58,237,0.15)' : 'rgba(201,147,90,0.06)'"
# ya está en dorado el light mode, solo fix darkmode
new_thead = "'rgba(201,147,90,0.1)'"
if old_thead in c:
    c = c.replace(old_thead, new_thead)
    fixes += 1; print("✅ Tabla thead dorado")
else: print("❌ Tabla thead")

# ── 6. Tabla: envolver en <details> acordeón ──
old_tabla_wrap = """                        {/* ── TABLA FREE vs PREMIUM ── */}
                        <div style={{background: bgCard, borderRadius: '1.25rem', overflow: 'hidden', border: `1px solid ${borderSoft}`, boxShadow: '0 2px 16px rgba(0,0,0,0.05)'}}>"""
new_tabla_wrap = """                        {/* ── TABLA FREE vs PREMIUM ── */}
                        <details style={{background: bgCard, borderRadius: '1.25rem', overflow: 'hidden', border: '1px solid rgba(201,147,90,0.2)', boxShadow: '0 2px 16px rgba(0,0,0,0.05)'}}>
                        <summary style={{listStyle:'none',cursor:'pointer'}}>"""
if old_tabla_wrap in c:
    c = c.replace(old_tabla_wrap, new_tabla_wrap)
    fixes += 1; print("✅ Tabla acordeón abre")
else: print("❌ Tabla wrap")

# Cerrar el </div> de la tabla → </details>
# Buscar después del CTA dorado
old_tabla_close = """                        </div>
                        {/* ── CTA PREMIUM ── */}"""
new_tabla_close = """                        </summary>
                        </details>
                        {/* ── CTA PREMIUM ── */}"""
if old_tabla_close in c:
    c = c.replace(old_tabla_close, new_tabla_close)
    fixes += 1; print("✅ Tabla acordeón cierra")
else: print("❌ Tabla cierre")

f = open('app/lumera/LumeraApp.jsx', 'w')
f.write(c)
f.close()
print(f"\nTotal: {fixes}")
