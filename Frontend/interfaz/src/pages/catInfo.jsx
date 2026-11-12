import { useParams, useNavigate, Link, Navigate } from 'react-router-dom'
import Sidebar from '../components/Sidebar'
import { categorias } from '../data/categorias'
import { actividadesDe, INFO_ACTIVIDADES } from '../data/actividades'
import { IconAltavoz, IconMicrofono, IconDocumento, IconLapiz } from '../components/Icons'
import '../styles/Catinfo.css'

const ICONOS = {
  microfono: IconMicrofono,
  altavoz: IconAltavoz,
  documento: IconDocumento,
  lapiz: IconLapiz,
}

function CategoriaIntro() {
  const { id } = useParams()
  const navigate = useNavigate()
  const categoria = categorias[id]

  if (!categoria) {
    return <Navigate to="/menu" replace />
  }

  // Las actividades que tiene cada lección de esta categoría (la de inicio y hasta 3 más)
  let numero = 0
  const tarjetas = actividadesDe(id, 1).map((tipo) => {
    const info = INFO_ACTIVIDADES[tipo]
    if (tipo !== 'escuchar') numero += 1
    return {
      tipo,
      icono: info.icono,
      texto: info.texto,
      titulo: tipo === 'escuchar' ? info.titulo : `Actividad ${numero}: ${info.titulo}`,
    }
  })

  return (
    <div className="menu-layout">
      <Sidebar />

      <main className="menu-contenido">
        <Link to="/menu" className="categoria-volver">← Volver al inicio</Link>

        <h1 className="intro-titulo">
          <span className="intro-hojas">🍃🍃</span>
          ¿Qué hay en cada lección?
          <span className="intro-hojas">🍃🍃</span>
        </h1>

        <div className="intro-grid">
          {tarjetas.map((t) => {
            const Icono = ICONOS[t.icono]
            return (
              <div key={t.tipo} className="intro-tarjeta">
                <Icono />
                <h3>{t.titulo}</h3>
                <p>{t.texto}</p>
              </div>
            )
          })}
        </div>

        <button className="intro-continuar" onClick={() => navigate(`/categoria/${id}/lecciones`)}>
          Continuar
        </button>
      </main>
    </div>
  )
}

export default CategoriaIntro