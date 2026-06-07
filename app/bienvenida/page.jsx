'use client';
import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { createClient } from '@supabase/supabase-js';

const sintomaFrase = (sintoma, is_es) => {
  const mapa = {
    'Siento un cansancio que no se va': is_es ? 'acabar con ese cansancio que no se va' : 'end that fatigue that never goes away',
    'Mi peso sube aunque no haya cambiado nada': is_es ? 'entender por qué tu peso no responde como antes' : 'understand why your weight stopped responding',
    'Me despierto a mitad de la noche': is_es ? 'recuperar ese sueño profundo que tanto necesitas' : 'recover the deep sleep you need so much',
    'Me cuesta concentrarme — neblina mental': is_es ? 'despejar esa niebla mental y recuperar tu claridad' : 'clear that brain fog and recover your clarity',
    'Mi estado de ánimo es una montaña rusa': is_es ? 'estabilizar tu estado de ánimo y recuperar tu equilibrio' : 'stabilise your mood and recover your balance',
    'Cansancio constante': is_es ? 'acabar con ese cansancio constante' : 'end that constant fatigue',
    'Cambios de humor': is_es ? 'estabilizar esos cambios de humor' : 'stabilise those mood changes',
  };
  return mapa[sintoma] || (is_es ? 'reconectar con tu cuerpo y tu energia' : 'reconnect with your body and energy');
};

function BienvenidaInner() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [aceptaTerminos, setAceptaTerminos] = useState(false);
  const [error, setError] = useState('');
  const [visible, setVisible] = useState(false);
  const router = useRouter();
  const params = useSearchParams();

  const lang = params.get('lang') || 'es';
  const is_es = lang === 'es';
  const nombre = params.get('nombre') || (is_es ? 'tu' : 'you');
  const sintoma = params.get('sintoma') || params.get('sintomas') || '';
  const frase = sintomaFrase(sintoma.split('|')[0], is_es);

  useEffect(() => {
    setTimeout(() => setVisible(true), 100);
  }, []);

  const handleActivar = async () => {
    if (!email || !password) {
      setError(is_es ? 'Por favor introduce tu email y contraseña.' : 'Please enter your email and password.');
      return;
    }
    if (!aceptaTerminos) {
      setError(is_es ? 'Debes aceptar los términos para continuar.' : 'You must accept the terms to continue.');
      return;
    }
    setLoading(true);
    setError('');

    const supabase = createClient(
      'https://pyekwpmbdnmglrjieexc.supabase.co',
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB5ZWt3cG1iZG5tZ2xyamllZXhjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjU0ODM0OTgsImV4cCI6MjA4MTA1OTQ5OH0.zQl7GF3E6BhDqW3bEMixAbdDcOsW8BsFOBeAGa-5bzY'
    );

    const { error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          nombre,
          sintoma_principal: sintoma.split('|')[0],
          objetivo: params.get('objetivo') || '',
          ciclo: params.get('ciclo') || '',
          peso: params.get('peso') || '',
          talla: params.get('talla') || '',
          actividad: params.get('actividad') || '',
        }
      }
    });

    let userId = null;

    if (signUpError && signUpError.message.includes('already registered')) {
      const { data: loginData, error: loginError } = await supabase.auth.signInWithPassword({ email, password });
      if (loginError) {
        setError(is_es ? 'Email o contrasena incorrectos.' : 'Incorrect email or password.');
        setLoading(false);
        return;
      }
      userId = loginData?.user?.id;
    } else if (signUpError) {
      setError(signUpError.message);
      setLoading(false);
      return;
    } else {
      // Nuevo registro - obtener sesion
      const { data: { session } } = await supabase.auth.getSession();
      userId = session?.user?.id;
    }

    // Guardar perfil en Supabase
    if (userId) {
      await supabase.from('users').upsert({
        id: userId,
        email,
        profile_name: nombre,
        sintoma_principal: sintoma.split('|')[0],
        objetivo: params.get('objetivo') || '',
        ciclo: params.get('ciclo') || '',
        peso: parseFloat(params.get('peso')) || null,
        talla: parseFloat(params.get('talla')) || null,
        actividad: params.get('actividad') || '',
        language: lang,
        updated_at: new Date().toISOString()
      });
    }

    router.push('/dashboard');
  };

  return (
    <>
      <style dangerouslySetInnerHTML={{__html:`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;0,700;1,400&family=Montserrat:wght@400;500;600;700&display=swap');
        *{box-sizing:border-box;margin:0;padding:0;}
        .fade{opacity:0;transform:translateY(20px);transition:opacity 0.8s ease,transform 0.8s ease;}
        .fade.in{opacity:1;transform:translateY(0);}
        .d1{transition-delay:0.1s;} .d2{transition-delay:0.3s;} .d3{transition-delay:0.5s;} .d4{transition-delay:0.7s;}
        .input-field{width:100%;background:rgba(255,255,255,0.06);border:1px solid rgba(201,147,90,0.3);border-radius:0.75rem;padding:1rem 1.25rem;color:white;font-size:1rem;font-family:'Cormorant Garamond',Georgia,serif;outline:none;transition:border-color 0.2s ease;margin-bottom:0.75rem;}
        .input-field::placeholder{color:rgba(255,255,255,0.35);}
        .input-field:focus{border-color:#C9935A;}
        .btn-activar{width:100%;background:linear-gradient(135deg,#C9935A,#A06030);border:none;border-radius:0.75rem;padding:1.15rem;color:white;font-size:1.05rem;font-family:Montserrat,sans-serif;font-weight:700;cursor:pointer;box-shadow:0 4px 24px rgba(201,147,90,0.35);transition:transform 0.2s ease;margin-top:0.5rem;}
        .btn-activar:hover{transform:translateY(-2px);}
        .btn-activar:disabled{opacity:0.6;cursor:not-allowed;transform:none;}
      `}}/>
      <div style={{minHeight:'100vh',display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',padding:'2.5rem 1.5rem 2.5rem 1.5rem',background:'linear-gradient(180deg,#1a0f2e 0%,#0D3D3D 100%)',fontFamily:"'Cormorant Garamond',Georgia,serif"}}>
        <div style={{maxWidth:'440px',width:'100%'}}>

          <div className={`fade d1 ${visible?'in':''}`} style={{textAlign:'center',marginBottom:'2rem'}}>
            <div style={{fontFamily:'Montserrat,sans-serif',fontSize:'0.7rem',fontWeight:700,color:'#C9935A',letterSpacing:'3px',marginBottom:'1rem'}}>✦ LUMERA</div>
            <h1 style={{fontSize:'clamp(1.5rem,4vw,2rem)',fontWeight:700,color:'white',lineHeight:1.2,marginBottom:'0.75rem'}}>
              {is_es ? `${nombre}, bienvenida a tu primer día.` : `${nombre}, welcome to your first day.`}
            </h1>
            <p style={{fontSize:'1.1rem',fontStyle:'italic',color:'#C9935A',lineHeight:1.6}}>
              {is_es ? 'Tu reconexión empieza ahora.' : 'Your reconnection starts now.'}
            </p>
          </div>

          <div className={`fade d2 ${visible?'in':''}`} style={{background:'rgba(255,255,255,0.04)',border:'1px solid rgba(201,147,90,0.2)',borderLeft:'4px solid #C9935A',borderRadius:'0 1rem 1rem 0',padding:'1.25rem 1.5rem',marginBottom:'2rem'}}>
            <p style={{fontSize:'1.05rem',lineHeight:1.8,fontStyle:'italic',color:'rgba(255,255,255,0.85)'}}>
              {is_es
                ? `He preparado todo para ayudarte a ${frase} y recuperar el bienestar que mereces.`
                : `I have prepared everything to help you ${frase} and recover the wellbeing you deserve.`}
            </p>
          </div>

          <div className={`fade d3 ${visible?'in':''}`}>
            <div style={{fontFamily:'Montserrat,sans-serif',fontSize:'0.72rem',fontWeight:700,color:'rgba(255,255,255,0.4)',letterSpacing:'2px',textTransform:'uppercase',marginBottom:'1rem',textAlign:'center'}}>
              {is_es ? 'Crea tu acceso seguro' : 'Create your secure access'}
            </div>
            <p style={{fontSize:'0.9rem',fontStyle:'italic',color:'rgba(255,255,255,0.45)',textAlign:'center',marginBottom:'1.25rem',lineHeight:1.6}}>
              {is_es ? 'Para guardar tu plan hormonal y que solo tú puedas ver tu progreso.' : 'To save your hormonal plan so only you can see your progress.'}
            </p>
            <input type="email" className="input-field" placeholder={is_es ? 'Tu correo electrónico...' : 'Your email address...'} value={email} onChange={e=>setEmail(e.target.value)} onKeyDown={e=>e.key==='Enter'&&handleActivar()}/>
            <input type="password" className="input-field" placeholder={is_es ? 'Crea una contraseña segura...' : 'Create a secure password...'} value={password} onChange={e=>setPassword(e.target.value)} onKeyDown={e=>e.key==='Enter'&&handleActivar()}/>
            {error && <p style={{color:'#F87171',fontSize:'0.85rem',fontFamily:'Montserrat,sans-serif',marginBottom:'0.75rem',textAlign:'center'}}>{error}</p>}
            <div style={{display:'flex',alignItems:'flex-start',gap:'0.75rem',marginBottom:'1rem',cursor:'pointer'}} onClick={()=>setAceptaTerminos(!aceptaTerminos)}>
              <div style={{width:'18px',height:'18px',borderRadius:'4px',border:'1.5px solid rgba(201,147,90,0.5)',background:aceptaTerminos?'#C9935A':'transparent',flexShrink:0,marginTop:'2px',display:'flex',alignItems:'center',justifyContent:'center',color:'white',fontSize:'0.7rem'}}>
                {aceptaTerminos?'✓':''}
              </div>
              <p style={{fontSize:'0.82rem',color:'rgba(255,255,255,0.45)',lineHeight:1.5,fontFamily:'Montserrat,sans-serif'}}>
                {is_es ? <span>Acepto la <a href='/privacidad' target='_blank' style={{color:'#C9935A',textDecoration:'underline'}}>Política de Privacidad</a> y los <a href='/terminos' target='_blank' style={{color:'#C9935A',textDecoration:'underline'}}>Términos de Uso</a> de Lumera.</span> : <span>I accept the <a href='/privacy' target='_blank' style={{color:'#C9935A',textDecoration:'underline'}}>Privacy Policy</a> and <a href='/terms' target='_blank' style={{color:'#C9935A',textDecoration:'underline'}}>Terms of Use</a> of Lumera.</span>}
              </p>
            </div>
            <button className="btn-activar" onClick={handleActivar} disabled={loading}>
              {loading ? (is_es?'Activando tu plan...':'Activating your plan...') : (is_es?'Activar mi plan y entrar':'Activate my plan and enter')}
            </button>
            <p style={{textAlign:'center',fontSize:'0.75rem',color:'rgba(255,255,255,0.25)',fontFamily:'Montserrat,sans-serif',marginTop:'0.75rem',lineHeight:1.5}}>
              {is_es ? 'Sin tarjeta de crédito. Cancela cuando quieras.' : 'No credit card. Cancel anytime.'}
            </p>
          </div>

          <div className={`fade d4 ${visible?'in':''}`} style={{textAlign:'center',marginTop:'1.5rem'}}>
            <p style={{fontSize:'0.85rem',color:'rgba(255,255,255,0.3)',fontFamily:'Montserrat,sans-serif'}}>
              {is_es ? 'Ya tienes cuenta? ' : 'Already have an account? '}
              <span onClick={()=>router.push('/lumera')} style={{color:'#C9935A',cursor:'pointer',textDecoration:'underline'}}>
                {is_es ? 'Entrar aqui' : 'Sign in here'}
              </span>
            </p>
          </div>

        </div>
      </div>
    </>
  );
}

export default function BienvenidaPage() {
  return (
    <Suspense fallback={
      <div style={{minHeight:'100vh',background:'linear-gradient(180deg,#1a0f2e,#0D3D3D)',display:'flex',alignItems:'center',justifyContent:'center'}}>
        <p style={{color:'rgba(255,255,255,0.5)',fontFamily:'Montserrat,sans-serif',fontSize:'0.9rem'}}>Cargando...</p>
      </div>
    }>
      <BienvenidaInner/>
    </Suspense>
  );
}
