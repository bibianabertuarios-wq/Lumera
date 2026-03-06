f = open('app/lumera/LumeraApp.jsx', 'r')
c = f.read()
f.close()

old = """<h2 style={{fontFamily: \"'Cormorant', serif\", fontSize: '1.45rem', fontWeight: 500, color: textMain, marginBottom: '1rem'}}>
                                {language === 'es' ? '¿Cómo sacar el máximo a Lumera?' : 'How to get the most from Lumera?'}
                            </h2>
                            <div style={{display: 'flex', flexDirection: 'column', gap: '0.85rem'}}>"""

new = """<div onClick={() => setShowHowTo(prev => !prev)} style={{display:'flex',alignItems:'center',justifyContent:'space-between',cursor:'pointer',marginBottom: showHowTo ? '1rem' : 0}}>
                                <h2 style={{fontFamily: \"'Cormorant', serif\", fontSize: '1.45rem', fontWeight: 500, color: textMain, margin:0}}>
                                    {language === 'es' ? '¿Cómo sacar el máximo a Lumera?' : 'How to get the most from Lumera?'}
                                </h2>
                                <span style={{fontSize:'1.2rem', color: textSub}}>{showHowTo ? '⌃' : '⌄'}</span>
                            </div>
                            {showHowTo && <div style={{display: 'flex', flexDirection: 'column', gap: '0.85rem'}}>"""

if old in c:
    c = c.replace(old, new)
    f = open('app/lumera/LumeraApp.jsx', 'w')
    f.write(c)
    f.close()
    print('Done')
else:
    print('Not found')
