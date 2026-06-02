'use client';
import dynamic from 'next/dynamic';

const LumeraApp = dynamic(() => import('./LumeraApp'), { ssr: false });

export default function LumeraPage() {
  return <LumeraApp />;
}
