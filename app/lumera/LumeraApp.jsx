
                                {/* MAS - contenido complementario */}
                                <div style={{marginBottom:"1rem"}}>
                                    <p style={{fontSize:"0.62rem",color:"#B8997A",fontWeight:700,letterSpacing:"0.14em",textTransform:"uppercase",marginBottom:"0.75rem"}}>{language==="es"?"MAS":"MORE"}</p>
                                    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"0.6rem"}}>
                                        {[
                                            {img:"/images/carta_intimidad.png",es:"Bienestar intimo",en:"Intimate wellness",page:"symptoms",des:"Reconexion y suelo pelvico",den:"Reconnection \& pelvic floor"},
                                            {img:"/images/mitos.png",es:"Mitos",en:"Myths",page:"symptoms",des:"Lo que no te han contado",den:"What nobody told you"},
                                            {img:"/images/consejos.png",es:"Consejos",en:"Tips",page:"symptoms",des:"Tips de LUMI para hoy",den:"LUMI tips for today"},
                                            {img:"/images/escaner_preview.png",es:"Comunidad",en:"Community",page:"symptoms",des:"Proximamente",den:"Coming soon"},
                                        ].map((item,i)=>(
                                            <div key={i} className="gc gch" onClick={()=>setCurrentPage(item.page)} style={{padding:"1rem",display:"flex",alignItems:"center",gap:"0.75rem"}}>
                                                <img src={item.img} style={{width:"42px",height:"42px",borderRadius:"50%",objectFit:"cover",flexShrink:0,border:"1px solid rgba(184,115,51,0.3)",boxShadow:"0 0 12px rgba(184,115,51,0.15)"}} onError={e=>{e.target.style.display="none"}}/>
                                                <div>
                                                    <p style={{fontSize:"0.88rem",fontWeight:600,color:"#F0EDE8",fontFamily:"x27Cormorantx27,serif"}}>{language==="es"?item.es:item.en}</p>
                                                    <p style={{fontSize:"0.7rem",color:"rgba(184,115,51,0.7)"}}>{language==="es"?item.des:item.den}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
