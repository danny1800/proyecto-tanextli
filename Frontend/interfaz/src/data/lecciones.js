const familiaLeccion1 = [
  { nahuatl: 'Cenchan', espanol: 'Familia', audio: '/audios/familia/familia-principal/familia.m4a' },
  { nahuatl: 'Papan', espanol: 'Padre', audio: '/audios/familia/familia-principal/padre.m4a' },
  { nahuatl: 'Maman', espanol: 'Madre', audio: '/audios/familia/familia-principal/madre.m4a' },
  { nahuatl: 'Noikniuj', espanol: 'Hermano', audio: '/audios/familia/familia-principal/hermano.m4a' },
  { nahuatl: 'Noikniuj', espanol: 'Hermana', audio: '/audios/familia/familia-principal/hermana.m4a' },
]

const familiaLeccion2 = [
  { nahuatl: 'Tatatsin', espanol: 'Abuelo', audio: '/audios/familia/familia-extendida/abuelo.m4a' },
  { nahuatl: 'Nanatsin', espanol: 'Abuela', audio: '/audios/familia/familia-extendida/abuela.m4a' },
  { nahuatl: 'Noikniuj papan', espanol: 'Tío', audio: '/audios/familia/familia-extendida/tio.m4a' },
  { nahuatl: 'Noikniuj maman', espanol: 'Tía', audio: '/audios/familia/familia-extendida/tia.m4a' },
  { nahuatl: 'Nomajichniuj', espanol: 'Primo', audio: '/audios/familia/familia-extendida/primo.m4a' },
  { nahuatl: 'Nomajichniuj', espanol: 'Prima', audio: '/audios/familia/familia-extendida/prima.m4a' },
]

const familiaLeccion3 = [
  { nahuatl: 'Noixuiuj', espanol: 'Nieto', audio: '/audios/familia/mas-familiares/nieto.m4a' },
  { nahuatl: 'Noiuiuj', espanol: 'Nieta', audio: '/audios/familia/mas-familiares/nieta.m4a' },
  { nahuatl: 'Nokonemaj', espanol: 'Sobrino', audio: '/audios/familia/mas-familiares/sobrino.m4a' },
  { nahuatl: 'Nokonemaj', espanol: 'Sobrina', audio: '/audios/familia/mas-familiares/sobrina.m4a' },
  { nahuatl: 'Monnantsin', espanol: 'Suegra', audio: '/audios/familia/mas-familiares/suegra.m4a' },
  { nahuatl: 'Motatsin', espanol: 'Suegro', audio: '/audios/familia/mas-familiares/suegro.m4a' },
  { nahuatl: 'Noikniuj ni cihuat', espanol: 'Cuñada', audio: '/audios/familia/mas-familiares/cunada.m4a' },
  { nahuatl: 'Noikniuj ni tagat', espanol: 'Cuñado', audio: '/audios/familia/mas-familiares/cunado.m4a' },
]

const familiaLeccion4 = [
  { nahuatl: 'Okichpil', espanol: 'Niño', audio: '/audios/familia/personas/nino.m4a' },
  { nahuatl: 'Suapil', espanol: 'Niña', audio: '/audios/familia/personas/nina.m4a' },
  { nahuatl: 'Tagat', espanol: 'Señor', audio: '/audios/familia/personas/senor.m4a' },
  { nahuatl: 'Cihuatsin', espanol: 'Señora', audio: '/audios/familia/personas/senora.m4a' },
  { nahuatl: 'Wuehuet', espanol: 'Hombre', audio: '/audios/familia/personas/hombre.m4a' },
  { nahuatl: 'Lamat', espanol: 'Mujer', audio: '/audios/familia/personas/mujer.m4a' },
  { nahuatl: 'Pili', espanol: 'Bebé', audio: '/audios/familia/personas/bebe.m4a' },
  { nahuatl: 'Telpoch', espanol: 'Joven', audio: '/audios/familia/personas/joven.m4a' },
]

// ---------- Números (palabras de Palabras_Tanextl_v2_nahualt.xlsx) ----------
// AQUÍ VA EL AUDIO: cuando estén grabados, cambien  audio: null  por la ruta.
// Las rutas acordadas están en contenido.json, por ejemplo:
//   '/audios/numeros/del-1-5/1.m4a'  (el archivo va en public/audios/numeros/del-1-5/)
//
// Aquí sí se usa "unir": cada número se escribe distinto en náhuatl.

const numerosLeccion1 = [
  { nahuatl: 'Se', espanol: 'Uno', audio: null },
  { nahuatl: 'Ome', espanol: 'Dos', audio: null },
  { nahuatl: 'Eyi', espanol: 'Tres', audio: null },
  { nahuatl: 'Nahui', espanol: 'Cuatro', audio: null },
  { nahuatl: 'Makuil', espanol: 'Cinco', audio: null },
]

const numerosLeccion2 = [
  { nahuatl: 'Chikuase', espanol: 'Seis', audio: null },
  { nahuatl: 'Chikame', espanol: 'Siete', audio: null },
  { nahuatl: 'Chikeyi', espanol: 'Ocho', audio: null },
  { nahuatl: 'Chiknahui', espanol: 'Nueve', audio: null },
  { nahuatl: 'Mahtlaktli', espanol: 'Diez', audio: null },
]

const numerosLeccion3 = [
  { nahuatl: 'Mahtlaktli ihwan se', espanol: 'Once', audio: null },
  { nahuatl: 'Mahtlaktli ihwan ome', espanol: 'Doce', audio: null },
  { nahuatl: 'Mahtlaktli ihwan eyi', espanol: 'Trece', audio: null },
  { nahuatl: 'Mahtlaktli ihwan nahui', espanol: 'Catorce', audio: null },
  { nahuatl: 'Kaxtolli', espanol: 'Quince', audio: null },
]

const numerosLeccion4 = [
  { nahuatl: 'Kaxtolli ihwan se', espanol: 'Dieciséis', audio: null },
  { nahuatl: 'Kaxtolli ihwan ome', espanol: 'Diecisiete', audio: null },
  { nahuatl: 'Kaxtolli ihwan eyi', espanol: 'Dieciocho', audio: null },
  { nahuatl: 'Kaxtolli ihwan nahui', espanol: 'Diecinueve', audio: null },
  { nahuatl: 'Sempowalli', espanol: 'Veinte', audio: null },
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

  numeros: {
    1: { actividades: ['escuchar', 'unir', 'opcion', 'escritura'], palabras: numerosLeccion1 },
    2: { actividades: ['escuchar', 'unir', 'opcion', 'escritura'], palabras: numerosLeccion2 },
    3: { actividades: ['escuchar', 'unir', 'opcion', 'escritura'], palabras: numerosLeccion3 },
    4: { actividades: ['escuchar', 'unir', 'opcion', 'escritura'], palabras: numerosLeccion4 },
    // Lección final: repaso de los 20 números
    5: {
      actividades: ['opcion', 'escritura'],
      palabras: [...numerosLeccion1, ...numerosLeccion2, ...numerosLeccion3, ...numerosLeccion4],
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