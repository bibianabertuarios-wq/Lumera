f = open('app/lumera/LumeraApp.jsx', 'r')
c = f.read()
f.close()

old = 'boxShadow:"0 4px 20px rgba(124,58,237,0.3)"}}}>'
new = 'boxShadow:"0 4px 20px rgba(201,147,90,0.25)"}}}>'
if old in c:
    c = c.replace(old, new)
    print("✅ Período botón shadow dorado")
else:
    # buscar contexto completo
    idx = c.find('rgba(124,58,237,0.3)')
    while idx > 0:
        print(f"L{c[:idx].count(chr(10))+1}: {c[max(0,idx-80):idx+30]}")
        idx = c.find('rgba(124,58,237,0.3)', idx+1)

f = open('app/lumera/LumeraApp.jsx', 'w')
f.write(c)
f.close()
