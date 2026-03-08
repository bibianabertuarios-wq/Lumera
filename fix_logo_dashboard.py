f = open('app/lumera/LumeraApp.jsx', 'r')
c = f.read()
f.close()
fixes = 0

# ── 1. Logo mix-blend ambas instancias ──
old_logo = '<img src="/images/lumera_icon_nobg.png" style={{width:\'36px\',height:\'36px\',objectFit:\'contain\'}} alt="Lumera" />'
new_logo = '<img src="/images/lumera_icon_nobg.png" style={{width:\'36px\',height:\'36px\',objectFit:\'contain\',mixBlendMode:\'multiply\'}} alt="Lumera" />'
count = c.count(old_logo)
if count > 0:
    c = c.replace(old_logo, new_logo)
    fixes += 1
    print(f"✅ Logo mix-blend ({count} instancias)")
else:
    print("❌ Logo - buscando variante...")
    idx = c.find('lumera_icon_nobg')
    print(c[idx:idx+150])

# ── 2. Header h1 Lumera - reducir tamaño para que no se corte ──
old_h1 = '<h1 className="text-2xl font-light gradient-text">Lumera</h1>'
new_h1 = '<h1 style={{fontFamily:"\'Cormorant\',serif",fontSize:"1.3rem",fontWeight:400,background:"linear-gradient(135deg,#C9935A,#e8c89f)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>Lumera</h1>'
if old_h1 in c:
    c = c.replace(old_h1, new_h1)
    fixes += 1
    print("✅ Header h1 reducido")
else:
    print("❌ Header h1")

# ── 3. Dashboard emojis en grid cards ──
old_emoji1 = '<span style={{fontSize: \'2rem\', marginBottom: \'0.5rem\', display: \'block\'}}>📝</span>'
new_emoji1 = '<img src="/images/sintomas.png" style={{width:\'32px\',height:\'32px\',borderRadius:\'50%\',objectFit:\'cover\',marginBottom:\'0.5rem\'}} alt="" />'
if old_emoji1 in c: c = c.replace(old_emoji1, new_emoji1); fixes += 1; print("✅ Card síntomas img")
else: print("❌ Card síntomas emoji - buscando...")

# Buscar todos los emojis en cards del dashboard
import re
# Patrones típicos de emojis en cards
emoji_cards = [
    ('📝', '/images/sintomas.png'),
    ('🍽️', '/images/menu.png'),
    ('💪', '/images/ejercicio.png'),
    ('🤖', '/images/lumi.png'),
]

# ── 4. Período - quitar accent-blue residual ──
old_blue = 'className="w-full accent-rose-500"'
new_blue_slider = 'className="lumera-slider w-full"'
count2 = c.count(old_blue)
if count2 > 0:
    c = c.replace(old_blue, new_blue_slider)
    fixes += 1
    print(f"✅ accent-rose → lumera-slider ({count2})")
else:
    print("❌ accent-rose no encontrado (ya aplicado)")

# ── 5. Consejos - error de tips.map cuando tips undefined ──
old_tips_map = '{tips.map((tip, idx) => ('
new_tips_map = '{(tips || []).map((tip, idx) => ('
if old_tips_map in c:
    c = c.replace(old_tips_map, new_tips_map)
    fixes += 1
    print("✅ Consejos tips || [] fix")
else:
    print("❌ tips.map no encontrado")

f = open('app/lumera/LumeraApp.jsx', 'w')
f.write(c)
f.close()
print(f"\nTotal: {fixes}")
