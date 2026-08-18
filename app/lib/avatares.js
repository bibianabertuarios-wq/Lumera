// CATÁLOGO DE SILUETAS — las variantes entre las que elige la usuaria.
//
// Cada una es un vídeo corto de la misma silueta girando, generado en Kling con el MISMO
// encuadre y la misma distancia de cámara: el Círculo de Hoy les aplica el mismo recorte
// y la misma máscara a todas, así que si una viene más cerca o más lejos se descuadra.
//
// Criterio de contenido: cuerpos de mujer real de 45-55 años, variados en tono de piel,
// pelo y complexión. Nada de figura atlética idealizada — esta app no le dice a nadie
// cómo debería ser su cuerpo.
//
// Para añadir una variante: deja el .mp4 en /public/videos/ y añade su entrada aquí.
// El resto de la app se actualiza sola.

export const AVATARES = [
  {
    id: 'clasica',
    video: '/videos/silueta-circulo.mp4',
    es: 'Silueta original',
    en: 'Original silhouette',
  },
];

export const AVATAR_POR_DEFECTO = 'clasica';

// Devuelve el vídeo de la variante elegida, con reserva a la de por defecto si la
// usuaria tiene guardada una variante que ya no existe en el catálogo.
export function getVideoAvatar(id) {
  const encontrada = AVATARES.find(a => a.id === id);
  return (encontrada || AVATARES.find(a => a.id === AVATAR_POR_DEFECTO) || AVATARES[0]).video;
}
