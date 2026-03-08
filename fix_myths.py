f = open('app/lumera/LumeraApp.jsx', 'r')
lines = f.readlines()
f.close()

start_myths = None
end_myths = None
start_tips = None
end_tips = None

for i, l in enumerate(lines):
    if 'key={`myths-${language}`}' in l and start_myths is None:
        start_myths = i
    if start_myths and end_myths is None and '};' in l and i > start_myths + 40:
        end_myths = i + 1
        break

for i, l in enumerate(lines):
    if 'key={`tips-${language}`}' in l and start_tips is None:
        start_tips = i
    if start_tips and end_tips is None and '};' in l and i > start_tips + 20:
        end_tips = i + 1
        break

print(f"myths: {start_myths+1}-{end_myths}, tips: {start_tips+1}-{end_tips}")
