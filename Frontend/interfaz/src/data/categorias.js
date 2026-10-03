// Datos de ejemplo. Más adelante esto se reemplaza por lo que devuelva
// el backend: fetch('http://localhost:3000/api/categorias')

export const categorias = {
  familia: {
    titulo: 'Familia',
    descripcion: 'Aprende los nombres de los miembros de la familia',
    icono: '👪',
    color: 'naranja',
    lecciones: [
      { id: 1, palabra: 'Nantli', traduccion: 'Madre' },
      { id: 2, palabra: 'Tahtli', traduccion: 'Padre' },
      { id: 3, palabra: 'Ichpochtli', traduccion: 'Hija' },
      { id: 4, palabra: 'Telpochtli', traduccion: 'Hijo' },
      { id: 5, palabra: 'Icniuhtli', traduccion: 'Hermano/a' },
    ],
  },
  colores: {
    titulo: 'Colores',
    descripcion: 'Descubre los colores en náhuatl',
    icono: '🎨',
    color: 'morado',
    lecciones: [
      { id: 1, palabra: 'Chichiltic', traduccion: 'Rojo' },
      { id: 2, palabra: 'Xoxoctic', traduccion: 'Verde' },
      { id: 3, palabra: 'Iztac', traduccion: 'Blanco' },
      { id: 4, palabra: 'Tliltic', traduccion: 'Negro' },
      { id: 5, palabra: 'Coztic', traduccion: 'Amarillo' },
    ],
  },
  numeros: {
    titulo: 'Números',
    descripcion: 'Aprende a contar en náhuatl',
    icono: '🔢',
    color: 'azul',
    lecciones: [
      { id: 1, palabra: 'Ce', traduccion: 'Uno' },
      { id: 2, palabra: 'Ome', traduccion: 'Dos' },
      { id: 3, palabra: 'Yei', traduccion: 'Tres' },
      { id: 4, palabra: 'Nahui', traduccion: 'Cuatro' },
      { id: 5, palabra: 'Macuilli', traduccion: 'Cinco' },
    ],
  },
  frases: {
    titulo: 'Frases',
    descripcion: 'Aprende unas frases en náhuatl',
    icono: '💬',
    color: 'verde',
    lecciones: [
      { id: 1, palabra: 'Niltze', traduccion: 'Hola' },
      { id: 2, palabra: 'Tlazocamati', traduccion: 'Gracias' },
      { id: 3, palabra: 'Quen otimotlapaloa', traduccion: '¿Cómo estás?' },
      { id: 4, palabra: 'Ximopanolti', traduccion: 'Bienvenido' },
      { id: 5, palabra: 'Cualli tonalli', traduccion: 'Buen día' },
    ],
  },
}
