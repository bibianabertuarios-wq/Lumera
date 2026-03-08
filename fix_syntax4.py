f = open('app/lumera/LumeraApp.jsx', 'r')
lines = f.readlines()
f.close()

del lines[5068]

f = open('app/lumera/LumeraApp.jsx', 'w')
f.writelines(lines)
f.close()
print("OK")
