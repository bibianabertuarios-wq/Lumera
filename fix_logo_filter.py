f = open('app/lumera/LumeraApp.jsx', 'r')
c = f.read()
f.close()

old = 'style={{width:\'36px\',height:\'36px\',objectFit:\'contain\',mixBlendMode:\'multiply\'}}'
new = 'style={{width:\'36px\',height:\'36px\',objectFit:\'contain\',filter:\'brightness(0) invert(0.4) sepia(1) saturate(0.5) hue-rotate(300deg)\'}}'
count = c.count(old)
if count > 0:
    c = c.replace(old, new)
    print(f"✅ Logo filter ({count} instancias)")
else:
    print("❌ no encontrado - buscando...")
    idx = c.find('lumera_icon_nobg')
    while idx > 0:
        print(c[idx:idx+120])
        idx = c.find('lumera_icon_nobg', idx+1)

# Ahora el mensaje LUMI en ejercicio y nutrición
old_lumi_ex = """                        <div style={{background:darkMode?'rgba(201,147,90,0.08)':'rgba(253,248,243,0.95)',borderRadius:'1.1rem',padding:'1rem 1.25rem',borderLeft:'3px solid #C9935A'}}>
                            <div style={{display:'flex',alignItems:'flex-start',gap:'0.75rem'}}>
                                <img src="/images/lumi.png" style={{width:'28px',height:'28px',borderRadius:'50%',objectFit:'cover',flexShrink:0}} alt="LUMI" />
                                <p style={{fontSize:'0.88rem',color:darkMode?'#e8d5c0':'#57534e',fontStyle:'italic',lineHeight:1.6}}>
                                    {getLumiMessage('exercise')}
                                </p>
                            </div>
                        </div>"""
if old_lumi_ex in c:
    print("✅ LUMI ejercicio ya OK")
else:
    # buscar versión vieja
    old_lumi_ex2 = "className={`${darkMode ? 'bg-rose-900' : 'bg-amber-50'} rounded-xl shadow p-5 border-l-4 border-rose-400`}"
    if old_lumi_ex2 in c:
        print("encontrada versión vieja LUMI ejercicio")
    # buscar getLumiMessage exercise
    idx2 = c.find("getLumiMessage('exercise')")
    print(c[max(0,idx2-200):idx2+50])

f = open('app/lumera/LumeraApp.jsx', 'w')
f.write(c)
f.close()
