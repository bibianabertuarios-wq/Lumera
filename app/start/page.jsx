'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Start() {
  const [lang, setLang] = useState('es');
  const [open, setOpen] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const bl = navigator.language || 'es';
    setLang(bl.startsWith('es') ? 'es' : 'en');
  }, []);

  const is_es = lang === 'es';

  const sections = [
    {
      id: 0,
      emoji: '🧠',
      title: is_es ? 'LUMI, tu confidente 24/7' : 'LUMI, your confidante 24/7',
      body: is_es
        ? 'No es un chatbot. Es una guía biológica personal que aprende cómo te sientes, recuerda tu historial y te acompaña en tiempo real. A las 3am si hace falta.'
        : 'Not a chatbot. A personal biological guide that learns how you feel, remembers your history and supports you in real time. At 3am if needed.',
    },
    {
      id: 1,
      emoji: '🥗',
      title: is_es ? 'Nutrición que equilibra tus hormonas' : 'Nutrition that balances your hormones',
      body: is_es
        ? 'Menús adaptados a cómo te sientes esa semana. Tu ciclo, tus síntomas, tu energía real. Con La Lente Alquímica — fotografía tu comida y sabe al instante si te ayuda o te perjudica.'
        : 'Menus adapted to how you feel that week. Your cycle, your symptoms, your real energy. With the Alchemical Lens — photograph your meal and instantly know if it helps or hurts you.',
    },
    {
      id: 2,
      emoji: '🔍',
      title: is_es ? 'Entiende lo que te pasa — de verdad' : 'Understand what is happening — for real',
