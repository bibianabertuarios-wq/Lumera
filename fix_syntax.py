f = open('app/lumera/LumeraApp.jsx', 'r')
lines = f.readlines()
f.close()

# Líneas 5068-5069 (idx 5067-5068) tienen cierre duplicado
# Buscar el patrón exacto
for i in range(5060, 5075):
    print(f"{i+1}: {lines[i].rstrip()}")
