// Lecciones de ejemplo para las categorías que todavía no tienen contenido real
const leccionesEjemplo = [
  { id: 1, titulo: 'Parte 1', palabras: 5 },
  { id: 2, titulo: 'Parte 2', palabras: 5 },
  { id: 3, titulo: 'Parte 3', palabras: 5 },
  { id: 4, titulo: 'Repaso', final: true },
]

export const categorias = {
  familia: {
    titulo: 'Familia',
    descripcion: 'Aprende los nombres de los miembros de la familia',
    icono: '👪',
    color: 'naranja',
    lecciones: [
      { id: 1, titulo: 'Familia', palabras: 5 },
      { id: 2, titulo: 'Familia extendida', palabras: 5 },
      { id: 3, titulo: 'Más familiares', palabras: 9 },
      { id: 4, titulo: 'Personas', palabras: 10 },
      { id: 5, titulo: 'Repaso', final: true },
    ],
  },
  colores: {
    titulo: 'Colores',
    descripcion: 'Descubre los colores en náhuatl',
    icono: '🎨',
    color: 'morado',
    lecciones: leccionesEjemplo,
  },
  numeros: {
    titulo: 'Números',
    descripcion: 'Aprende a contar en náhuatl',
    icono: '🔢',
    color: 'azul',
    lecciones: leccionesEjemplo,
  },
  frases: {
    titulo: 'Frases',
    descripcion: 'Aprende unas frases en náhuatl',
    icono: '💬',
    color: 'verde',
    lecciones: leccionesEjemplo,
  },
}
