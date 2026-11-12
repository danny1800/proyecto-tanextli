// ============================================================
// Actividades de las lecciones
// ------------------------------------------------------------
// Tipos de actividad que existen:
//   escuchar      Escucha y repite (práctica con el micrófono). Es la del inicio.
//   escuchaElige  Escucha la palabra y elige su significado (botones en español)
//   leeElige      Lee la palabra en español y elige cómo se dice (botones en náhuatl)
//   escritura     Escribe la palabra en náhuatl
//   unir          Une cada palabra con su pareja
//   opcion        Escucha la palabra y elige cómo se escribe (botones en náhuatl)
//
// Cada lección tiene la actividad de inicio y hasta 3 actividades distintas.
// ============================================================

import { contenidoLecciones } from './lecciones'

// Texto y ícono de cada actividad (se usa en la pantalla "¿Qué hay en cada lección?")
export const INFO_ACTIVIDADES = {
  escuchar: {
    titulo: 'Escucha y repite',
    texto: 'Escucha la palabra en náhuatl y repítela con tu voz',
    icono: 'microfono',
  },
  escuchaElige: {
    titulo: 'Escucha y elige',
    texto: 'Escucha la palabra y elige su significado en español',
    icono: 'altavoz',
  },
  leeElige: {
    titulo: 'Lee y elige',
    texto: 'Lee la palabra en español y elige cómo se dice en náhuatl',
    icono: 'documento',
  },
  escritura: {
    titulo: 'Escribe',
    texto: 'Escribe la palabra en náhuatl',
    icono: 'lapiz',
  },
  unir: {
    titulo: 'Une las parejas',
    texto: 'Une cada palabra con su pareja',
    icono: 'documento',
  },
  opcion: {
    titulo: 'Escucha y elige',
    texto: 'Escucha la palabra y elige cómo se escribe en náhuatl',
    icono: 'altavoz',
  },
}

// Actividades por categoría: todas sus lecciones (menos el repaso final) usan las mismas.
// Las categorías que no estén aquí usan lo que diga cada lección en lecciones.js.
export const ACTIVIDADES_POR_CATEGORIA = {
  familia: ['escuchar', 'escuchaElige', 'escritura', 'leeElige'],
}

export const ACTIVIDADES_POR_DEFECTO = ['escuchar', 'opcion', 'escritura']

export function actividadesDe(categoriaId, leccionId, esFinal = false) {
  const propias =
    contenidoLecciones[categoriaId] && contenidoLecciones[categoriaId][leccionId]
      ? contenidoLecciones[categoriaId][leccionId].actividades
      : null
  if (esFinal) return propias || ACTIVIDADES_POR_DEFECTO
  return ACTIVIDADES_POR_CATEGORIA[categoriaId] || propias || ACTIVIDADES_POR_DEFECTO
}