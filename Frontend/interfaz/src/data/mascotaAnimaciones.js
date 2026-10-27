// ============================================================
// Animaciones de la mascota
// ------------------------------------------------------------
// Aquí se registra qué archivo se muestra en cada estado.
// Quien haga la animación solo tiene que:
//   1. Copiar sus archivos a la carpeta  public/mascota/
//   2. Cambiar la ruta de cada estado en este archivo.
//
// tipo: 'imagen' (png, gif, webp, svg)  o  'video' (webm, mp4)
// Los videos se reproducen en bucle y sin sonido.
//
// NUEVO: tipo 'capas' = mascota animada por capas (brazo, orejas, ojos, boca...).
//   No lleva src: lleva  estado  con uno de estos valores:
//   reposo | saludando | hablando | escuchando | pensando | feliz |
//   celebrando | triste | sorprendida | error
// ============================================================

export const animaciones = {
  // Lo que había antes (imagen fija), por si se quiere volver:
  // reposo:  { tipo: 'imagen', src: '/mascota.png' }, // esperando, sin hablar
  // saludo:  { tipo: 'imagen', src: '/mascota.png' }, // bienvenida y presentación
  // feliz:   { tipo: 'imagen', src: '/mascota.png' }, // respuesta correcta
  // celebra: { tipo: 'imagen', src: '/mascota.png' }, // terminar una lección
  // animo:   { tipo: 'imagen', src: '/mascota.png' }, // cuando se equivoca

  reposo:  { tipo: 'capas', estado: 'reposo' },     // esperando, sin hablar
  saludo:  { tipo: 'capas', estado: 'saludando' },  // bienvenida y presentación
  feliz:   { tipo: 'capas', estado: 'feliz' },      // respuesta correcta
  celebra: { tipo: 'capas', estado: 'celebrando' }, // terminar una lección
  animo:   { tipo: 'capas', estado: 'triste' },     // cuando se equivoca

  // NUEVO: estados extra (se usan igual:  <Mascota estado="habla" />)
  habla:    { tipo: 'capas', estado: 'hablando' },
  escucha:  { tipo: 'capas', estado: 'escuchando' },
  piensa:   { tipo: 'capas', estado: 'pensando' },
  sorpresa: { tipo: 'capas', estado: 'sorprendida' },
  error:    { tipo: 'capas', estado: 'error' },
}

// Ejemplo de cómo quedaría con animaciones reales:
//   saludo: { tipo: 'video', src: '/mascota/saludo.webm' },
//   feliz:  { tipo: 'imagen', src: '/mascota/feliz.webp' },