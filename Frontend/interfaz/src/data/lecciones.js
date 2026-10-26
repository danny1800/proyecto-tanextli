// ============================================================
// Contenido de las lecciones
// ------------------------------------------------------------
// contenidoLecciones[categoria][numeroDeLeccion] = { actividades, palabras }
//
// actividades: el orden de los pasos de la lección. Puedes quitar o reordenar:
//   'escuchar'  → escucha y repite (una pantalla por palabra)
//   'unir'      → unir cada palabra con su pareja (una sola pantalla)
//   'opcion'    → opción múltiple (una pantalla por palabra)
//   'escritura' → escribir la palabra (una pantalla por palabra)
// Si no pones "actividades", se usa: escuchar, opcion, escritura.
//
// Cada palabra lleva:
//   nahuatl:  la palabra en náhuatl (como se escribe)
//   espanol:  su traducción
//   audio:    ruta del audio (opcional). Los audios van en public/audios/<categoria>/
//   imagen:   ruta de una imagen (opcional). Va en public/imagenes/
//   colorHex: color que se muestra (opcional, para la categoría Colores)
//
// Las lecciones que no aparezcan aquí muestran "estará lista muy pronto".
// ============================================================

export const contenidoLecciones = {
  familia: {
    1: {
      palabras: [
        { nahuatl: 'Tahtli', espanol: 'Padre', audio: '/audios/familia/tahtli.mp3' },
        { nahuatl: 'Nantli', espanol: 'Madre', audio: '/audios/familia/nantli.mp3' },
        // REEMPLAZA estas tres palabras de ejemplo por las reales de la lección 1:
        { nahuatl: 'Palabra 3', espanol: 'Ejemplo 3' },
        { nahuatl: 'Palabra 4', espanol: 'Ejemplo 4' },
        { nahuatl: 'Palabra 5', espanol: 'Ejemplo 5' },
      ],
    },
  },

      colores: {
    // Lección 1: colores básicos
    1: {
      actividades: ['escuchar', 'unir', 'opcion', 'escritura'],
      palabras: [
        { nahuatl: 'Chichiltik', espanol: 'Rojo', audio: '/audios/colores/rojo.m4a', colorHex: '#e53935' },
        { nahuatl: 'Kostik', espanol: 'Amarillo', audio: '/audios/colores/amarillo.m4a', colorHex: '#fdd835' },
        { nahuatl: 'Azultik', espanol: 'Azul', audio: '/audios/colores/azul.m4a', colorHex: '#1e88e5' }, // falta grabar este audio
        { nahuatl: 'Tiltik', espanol: 'Negro', audio: '/audios/colores/negro.m4a', colorHex: '#212121' },
        { nahuatl: 'Istak', espanol: 'Blanco', audio: '/audios/colores/blanco.m4a', colorHex: '#ffffff' },
      ],
    },
    // Lección 2: colores secundarios
    2: {
      actividades: ['escuchar', 'unir', 'opcion', 'escritura'],
      palabras: [
        { nahuatl: 'Xoxoktik', espanol: 'Verde', audio: '/audios/colores/verde.m4a', colorHex: '#43a047' },
        { nahuatl: 'Chilkostik', espanol: 'Naranja', audio: '/audios/colores/naranja.m4a', colorHex: '#fb8c00' },
        { nahuatl: 'Kaniojtik', espanol: 'Morado', audio: '/audios/colores/morado.m4a', colorHex: '#8e24aa' },
        { nahuatl: 'Xochipaltik', espanol: 'Rosa', audio: '/audios/colores/rosa.m4a', colorHex: '#f48fb1' },
        { nahuatl: 'Tenextik', espanol: 'Gris', audio: '/audios/colores/gris.m4a', colorHex: '#9e9e9e' },
        { nahuatl: 'Tilkostik', espanol: 'Café', audio: '/audios/colores/cafe.m4a', colorHex: '#6d4c41' },
      ],
    },
  },
}