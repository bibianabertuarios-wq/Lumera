f = open('app/lumera/LumeraApp.jsx', 'r')
c = f.read()
f.close()
fixes = 0

replacements = [
    # Botones degradado morado → dorado
    ('"linear-gradient(135deg, #7c3aed, #ec4899)"', '"linear-gradient(135deg, #C9935A, #e8c89f)"'),
    ("'linear-gradient(135deg, #7c3aed, #ec4899)'", "'linear-gradient(135deg, #C9935A, #e8c89f)'"),
    # Sombras moradas → doradas
    ('"0 4px 20px rgba(124,58,237,0.3)"', '"0 4px 20px rgba(201,147,90,0.25)"'),
    ("'0 4px 20px rgba(124,58,237,0.3)'", "'0 4px 20px rgba(201,147,90,0.25)'"),
    ('"0 4px 24px rgba(124,58,237,0.5)"', '"0 4px 24px rgba(201,147,90,0.35)"'),
    ("'0 2px 8px rgba(124,58,237,0.3)'", "'0 2px 8px rgba(201,147,90,0.25)'"),
    # Borders morados → dorados en quiz
    ('"1px solid rgba(124,58,237,0.2)"', '"1px solid rgba(201,147,90,0.25)"'),
    ("'1px solid rgba(124,58,237,0.2)'", "'1px solid rgba(201,147,90,0.25)'"),
    # Backgrounds morados leves
    ('rgba(124,58,237,0.06)', 'rgba(201,147,90,0.06)'),
    # Quiz opciones seleccionadas
    ("darkMode ? 'bg-purple-900 border-purple-400' : 'bg-purple-50 border-purple-400'", 
     "darkMode ? 'bg-amber-900 border-amber-400' : 'bg-amber-50 border-amber-400'"),
]

for old, new in replacements:
    count = c.count(old)
    if count > 0:
        c = c.replace(old, new)
        fixes += count
        print(f"✅ {count}x: {old[:40]}")

print(f"\nTotal reemplazos: {fixes}")
f = open('app/lumera/LumeraApp.jsx', 'w')
f.write(c)
f.close()
