f = open('app/lumera/LumeraApp.jsx', 'r')
lines = f.readlines()
f.close()

# Eliminar línea 5069 (idx 5068) que es el </div> duplicado
del lines[5068]

f = open('app/lumera/LumeraApp.jsx', 'w')
f.writelines(lines)
f.close()
print("OK - línea duplicada eliminada")
