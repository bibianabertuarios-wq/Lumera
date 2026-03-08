f = open('app/lumera/LumeraApp.jsx', 'r')
lines = f.readlines()
f.close()

for i in range(5060, 5075):
    print(f"{i+1}: {repr(lines[i].rstrip())}")
