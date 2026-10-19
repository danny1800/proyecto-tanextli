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
// ============================================================

export const animaciones = {
  reposo:  { tipo: 'imagen', src: '/mascota.png' }, // esperando, sin hablar
  saludo:  { tipo: 'imagen', src: '/mascota.png' }, // bienvenida y presentación
  feliz:   { tipo: 'imagen', src: '/mascota.png' }, // respuesta correcta
  celebra: { tipo: 'imagen', src: '/mascota.png' }, // terminar una lección
  animo:   { tipo: 'imagen', src: '/mascota.png' }, // cuando se equivoca
}

// Ejemplo de cómo quedaría con animaciones reales:
//   saludo: { tipo: 'video', src: '/mascota/saludo.webm' },
//   feliz:  { tipo: 'imagen', src: '/mascota/feliz.webp' },