import { animaciones } from '../data/mascotaAnimaciones'
import '../styles/mascota.css'
import MascotaAnimada from './MascotaAnimada' // NUEVO: mascota animada por capas

// Uso:  <Mascota estado="saludo" mensaje="¡Hola!" tamano="grande" globo="arriba" />
//   estado:  reposo | saludo | feliz | celebra | animo   (ver data/mascotaAnimaciones.js)
//            NUEVO: también habla | escucha | piensa | sorpresa | error
//   mensaje: texto del globo de diálogo (opcional)
//   tamano:  pequeno | mediano | grande
//   globo:   arriba | derecha  (dónde queda el globo respecto a la mascota)

// NUEVO: tamaño en píxeles cuando la animación es de tipo 'capas'
const TAMANOS_CAPAS = { pequeno: 110, mediano: 180, grande: 260 }

function Mascota({ estado = 'reposo', mensaje, tamano = 'mediano', globo = 'arriba' }) {
  const animacion = animaciones[estado] || animaciones.reposo

  let medio
  if (animacion.tipo === 'capas') {
    // NUEVO: el globo lo sigue dibujando este componente, por eso no se pasa "mensaje"
    medio = (
      <MascotaAnimada estado={animacion.estado} tamano={TAMANOS_CAPAS[tamano] || 180} />
    )
  } else if (animacion.tipo === 'video') {
    medio = (
      <video
        key={estado}
        className="mascota-medio"
        src={animacion.src}
        autoPlay
        loop
        muted
        playsInline
        aria-label="Mascota de Tanextli"
      />
    )
  } else {
    // Para usar Lottie o Rive: instalar su librería y agregar otro caso aquí.
    medio = (
      <img
        key={estado}
        className="mascota-medio"
        src={animacion.src}
        alt="Mascota de Tanextli"
      />
    )
  }

  return (
    <div className={`mascota mascota-${tamano} mascota-globo-${globo}`}>
      {mensaje && <div className="mascota-globo" role="status">{mensaje}</div>}
      {medio}
    </div>
  )
}

export default Mascota