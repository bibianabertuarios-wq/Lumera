// CATÁLOGO DE SILUETAS — las variantes entre las que elige la usuaria.
//
// Cada variante puede ser una IMAGEN o un vídeo:
//   { id, imagen: '/images/…png' }  → se anima con CSS, respirando (lo preferido)
//   { id, video:  '/videos/…mp4' }  → se reproduce en bucle
//
// Las imágenes son la vía buena: generarlas cuesta una fracción de lo que cuesta un
// vídeo, pesan KB en vez de MB, y la respiración la hace el navegador — así que además
// se puede acelerar o frenar según cómo esté ella, cosa que un vídeo no permite igual
// de bien. El ritmo lo controla el Círculo de Hoy.
//
// Lo único obligatorio es que TODAS compartan el mismo encuadre y la misma distancia de
// cámara: el círculo les aplica el mismo recorte y la misma máscara a todas.
//
// Criterio de contenido: mujeres reales de 45-55, variadas en tono de piel, pelo y
// complexión. Nada de figura atlética idealizada — esta app no le dice a nadie cómo
// debería ser su cuerpo.
//
// Para añadir una variante: deja el archivo en /public/ y añade su entrada aquí.

export const AVATARES = [
  {
    id: 'clasica',
    video: '/videos/silueta-circulo.mp4',
    es: 'Silueta original',
    en: 'Original silhouette',
  },
  {
    id: 'canas-corto',
    imagen: '/images/avatar-canas-corto.png',
    es: 'Pelo corto cano',
    en: 'Short grey hair',
  },
  {
    id: 'castano-largo',
    imagen: '/images/avatar-castano-largo.png',
    es: 'Melena castaña',
    en: 'Long brown hair',
  },
];

export const AVATAR_POR_DEFECTO = 'clasica';

// Devuelve la variante elegida, con reserva a la de por defecto si la usuaria tiene
// guardada una que ya no existe en el catálogo (por ejemplo si se retiró).
export function getAvatar(id) {
  const encontrada = AVATARES.find(a => a.id === id);
  return encontrada || AVATARES.find(a => a.id === AVATAR_POR_DEFECTO) || AVATARES[0];
}
