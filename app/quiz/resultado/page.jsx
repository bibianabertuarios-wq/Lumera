'use client';
import { useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

function RedirectInner() {
  const router = useRouter();
  const params = useSearchParams();

  useEffect(() => {
    router.replace('/bienvenida?' + params.toString());
  }, []);

  return (
    <div style={{minHeight:'100vh',background:'linear-gradient(180deg,#1a0f2e,#0D3D3D)',display:'flex',alignItems:'center',justifyContent:'center'}}>
      <p style={{color:'rgba(255,255,255,0.5)',fontFamily:'Montserrat,sans-serif',fontSize:'0.9rem'}}>Cargando...</p>
    </div>
  );
}

export default function ResultadoPage() {
  return (
    <Suspense fallback={
      <div style={{minHeight:'100vh',background:'linear-gradient(180deg,#1a0f2e,#0D3D3D)',display:'flex',alignItems:'center',justifyContent:'center'}}>
        <p style={{color:'rgba(255,255,255,0.5)',fontFamily:'Montserrat,sans-serif',fontSize:'0.9rem'}}>Cargando...</p>
      </div>
    }>
      <RedirectInner/>
    </Suspense>
  );
}
