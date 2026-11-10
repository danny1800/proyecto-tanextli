const familiaLeccion1 = [
  { nahuatl: 'Cenchan', espanol: 'Familia', audio: null },
  { nahuatl: 'Papan', espanol: 'Padre', audio: null },
  { nahuatl: 'Maman', espanol: 'Madre', audio: null },
  { nahuatl: 'Noikniuj', espanol: 'Hermano', audio: null },
  { nahuatl: 'Noikniuj', espanol: 'Hermana', audio: null },
]

const familiaLeccion2 = [
  { nahuatl: 'Tatatsin', espanol: 'Abuelo', audio: null },
  { nahuatl: 'Nanatsin', espanol: 'Abuela', audio: null },
  { nahuatl: 'Noikniuj papan', espanol: 'Tío', audio: null },
  { nahuatl: 'Noikniuj maman', espanol: 'Tía', audio: null },
  { nahuatl: 'Nomajichniuj', espanol: 'Primo', audio: null },
]

const familiaLeccion3 = [
  { nahuatl: 'Nomajichniuj', espanol: 'Prima', audio: null },
  { nahuatl: 'Noixuiuj', espanol: 'Nieto', audio: null },
  { nahuatl: 'Noiuiuj', espanol: 'Nieta', audio: null },
  { nahuatl: 'Nokonemaj', espanol: 'Sobrino', audio: null },
  { nahuatl: 'Nokonemaj', espanol: 'Sobrina', audio: null },
  { nahuatl: 'Monnantsin', espanol: 'Suegra', audio: null },
  { nahuatl: 'Motatsin', espanol: 'Suegro', audio: null },
  { nahuatl: 'Noikniuj ni cihuat', espanol: 'Cuñada', audio: null },
  { nahuatl: 'Noikniuj ni tagat', espanol: 'Cuñado', audio: null },
]

const familiaLeccion4 = [
  { nahuatl: 'Okichpil', espanol: 'Niño', audio: null },
  { nahuatl: 'Suapil', espanol: 'Niña', audio: null },
  { nahuatl: 'Tagat', espanol: 'Señor', audio: null },
  { nahuatl: 'Cihuatsin', espanol: 'Señora', audio: null },
  { nahuatl: 'Wuehuet', espanol: 'Hombre', audio: null },
  { nahuatl: 'Lamat', espanol: 'Mujer', audio: null },
  { nahuatl: 'Pili', espanol: 'Bebé', audio: null },
  { nahuatl: 'Vevetsin', espanol: 'Viejo', audio: null },
  { nahuatl: 'Nanatsin', espanol: 'Vieja', audio: null },
  { nahuatl: 'Telpoch', espanol: 'Joven', audio: null },
]

export const contenidoLecciones = {
  familia: {
    1: { palabras: familiaLeccion1 },
    2: { palabras: familiaLeccion2 },
    3: { palabras: familiaLeccion3 },
    4: { palabras: familiaLeccion4 },
    // Lección final: repaso de las 29 palabras (sin "escuchar", solo actividades)
    5: {
      actividades: ['opcion', 'escritura'],
      palabras: [...familiaLeccion1, ...familiaLeccion2, ...familiaLeccion3, ...familiaLeccion4],
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

      frases: {
    // Lección 1: Saludos
    1: {
      actividades: ['escuchar', 'unir', 'opcion', 'escritura'],
      palabras: [
        { nahuatl: 'Piali', espanol: 'Hola', audio: null },
        { nahuatl: 'Kwali Tanecik', espanol: 'Buenos días', audio: null },
        { nahuatl: 'Kwali Tiotaki', espanol: 'Buenas tardes', audio: null },
        { nahuatl: 'Kwali Tapoyaui', espanol: 'Buenas noches', audio: null },
        { nahuatl: 'Tlasohkamatik', espanol: 'Gracias', audio: null },
      ],
    },
    // Lección 2: Conversación
    2: {
      actividades: ['escuchar', 'unir', 'opcion', 'escritura'],
      palabras: [
        { nahuatl: '¿Keni motokay?', espanol: '¿Cómo te llamas?', audio: null },
        { nahuatl: '¿Keni tietok?', espanol: '¿Cómo estás?', audio: null },
        { nahuatl: '¿Kani tiwala?', espanol: '¿De dónde eres?', audio: null },
        { nahuatl: 'Amo tlen', espanol: 'De nada', audio: null },
        { nahuatl: 'Kwali nica nietok', espanol: 'Estoy bien', audio: null },
        { nahuatl: '¿Toni tikneki?', espanol: '¿Qué necesitas?', audio: null },
      ],
    },
    
    // Lección 3: Expresiones
   /* 3: {
      actividades: ['escuchar', 'unir', 'opcion', 'escritura'],
      palabras: [
        { nahuatl: 'Ma kwali tonal tikpia', espanol: 'Que tengas un buen día', audio: null },
        { nahuatl: 'Ma kwali tioj', espanol: 'Que te vaya bien', audio: null },
        { nahuatl: 'Ixmopiali miak', espanol: 'Cuídate mucho', audio: null },
        { nahuatl: 'Ma tiyo Isewi', espanol: 'Que descanses', audio: null },
        { nahuatl: 'Ma tiakan', espanol: 'Hasta Luego', audio: null },
      ],
    },*/

    // Lección 4: Despedida
    4: {
      actividades: ['escuchar', 'unir', 'opcion', 'escritura'],
      palabras: [
        { nahuatl: 'Ma kwali tonal tikpia', espanol: 'Que tengas un buen día', audio: null },
        { nahuatl: 'Ma kwali tioj', espanol: 'Que te vaya bien', audio: null },
        { nahuatl: 'Ixmopiali miak', espanol: 'Cuídate mucho', audio: null },
        { nahuatl: 'Ma tiyo Isewi', espanol: 'Que descanses', audio: null },
        { nahuatl: 'Ma tiakan', espanol: 'Hasta Luego', audio: null },
      ],
    },
  },
}