f = open('app/lumera/LumeraApp.jsx', 'r')
c = f.read()
f.close()

new_tips = """
            // CONSEJOS
            const renderTips = () => {
                const { tips } = getMythsAndTips();
                return (
                    <div className="pb-32 space-y-5" key={`tips-${language}`} style={{background:darkMode?'transparent':'linear-gradient(180deg,#fdf8f3,#fdf4ee)',minHeight:'100vh',padding:'1rem'}}>
                        <div style={{position:'relative',borderRadius:'1.25rem',overflow:'hidden',marginBottom:'0.5rem',height:'120px'}}>
                            <img src="/images/consejos.png" style={{width:'100%',height:'100%',objectFit:'cover',filter:'brightness(0.65)'}} alt="" />
                            <div style={{position:'absolute',inset:0,display:'flex',alignItems:'center',padding:'1.25rem'}}>
                                <div>
                                    <p style={{color:'rgba(255,255,255,0.8)',fontSize:'0.7rem',letterSpacing:'0.15em'}}>✦ LUMERA</p>
                                    <h2 style={{fontFamily:"'Cormorant',serif",fontSize:'1.8rem',fontWeight:500,color:'white',lineHeight:1.2}}>{t[language].tips}</h2>
                                </div>
                            </div>
                        </div>
                        {(tips || []).map((tip, idx) => (
                            <div key={idx} style={{background:darkMode?'rgba(255,255,255,0.05)':'rgba(255,255,255,0.9)',borderRadius:'1.1rem',overflow:'hidden',border:'1px solid rgba(201,147,90,0.15)',boxShadow:'0 2px 12px rgba(0,0,0,0.04)'}}>
                                <div style={{padding:'1rem 1.25rem',borderBottom:'1px solid rgba(201,147,90,0.1)',background:'linear-gradient(135deg,rgba(201,147,90,0.08),rgba(232,200,159,0.06))'}}>
                                    <h3 style={{fontFamily:"'Cormorant',serif",fontSize:'1.2rem',fontWeight:600,color:darkMode?'#e8d5c0':'#292524'}}>
                                        <span style={{color:'#C9935A',marginRight:'0.4rem'}}>✦</span>{tip.title}
                                    </h3>
                                </div>
                                <div style={{padding:'1rem 1.25rem',display:'flex',flexDirection:'column',gap:'0.75rem'}}>
                                    <div style={{borderLeft:'3px solid #C9935A',paddingLeft:'0.75rem'}}>
                                        <p style={{fontSize:'0.8rem',fontWeight:600,color:'#C9935A',marginBottom:'0.2rem'}}>{language==='es'?'Por que importa':'Why it matters'}</p>
                                        <p style={{fontSize:'0.85rem',color:darkMode?'#d6d3d1':'#57534e',lineHeight:1.5}}>{tip.why}</p>
                                    </div>
                                    <div style={{borderLeft:'3px solid rgba(201,147,90,0.4)',paddingLeft:'0.75rem'}}>
                                        <p style={{fontSize:'0.8rem',fontWeight:600,color:'#92580a',marginBottom:'0.2rem'}}>{language==='es'?'Como hacerlo':'How to do it'}</p>
                                        <p style={{fontSize:'0.85rem',color:darkMode?'#a8a29e':'#78716c',lineHeight:1.5,whiteSpace:'pre-line'}}>{tip.how}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                        {(!tips || tips.length === 0) && (
                            <div style={{background:'rgba(255,255,255,0.9)',borderRadius:'1.1rem',padding:'1.5rem',textAlign:'center'}}>
                                <p style={{color:'#78716c'}}>{language==='es'?'Cargando consejos...':'Loading tips...'}</p>
                            </div>
                        )}
                    </div>
                );
            };

"""

old = '            // COMUNIDAD\n            const renderCommunity = () => {'
new = new_tips + '            // COMUNIDAD\n            const renderCommunity = () => {'

if old in c:
    c = c.replace(old, new)
    print("✅ renderTips restaurado")
else:
    print("❌ No encontrado")

f = open('app/lumera/LumeraApp.jsx', 'w')
f.write(c)
f.close()
