import { useParams, Link, Navigate } from 'react-router-dom'
import Sidebar from '../components/Sidebar'
import { categorias } from '../data/categorias'
import '../styles/categoria.css'

function Categoria() {
  const { id } = useParams()
  const categoria = categorias[id]
  const leccionesCompletadas = 0

  if (!categoria) {
    return <Navigate to="/menu" replace />
  }

  return (
    <div className="menu-layout">
      <Sidebar />

      <main className="menu-contenido">
        <Link to={`/categoria/${id}`} className="categoria-volver">← Volver</Link>

        <header className={`categoria-header categoria-${categoria.color}`}>
          <span className="categoria-header-icono">{categoria.icono}</span>
          <div>
            <h2>{categoria.titulo}</h2>
            <p>{categoria.descripcion}</p>
          </div>
        </header>

        <div className="lecciones-camino">
          {categoria.lecciones.map((leccion, index) => {
            const completada = index < leccionesCompletadas
            const siguiente = index === leccionesCompletadas
            const bloqueada = !completada && !siguiente

            return (
              <Link
                key={leccion.id}
                to={bloqueada ? '#' : `/categoria/${id}/leccion/${leccion.id}`}
                className={`leccion-nodo ${completada ? 'completada' : ''} ${siguiente ? 'siguiente' : ''} ${bloqueada ? 'bloqueada' : ''}`}
                onClick={(e) => bloqueada && e.preventDefault()}
              >
                <span className="leccion-numero">
                  {completada ? '✓' : leccion.id}
                </span>
                <span className="leccion-nombre">{leccion.palabra}</span>
              </Link>
            )
          })}
        </div>
      </main>
    </div>
  )
}

export default Categoria
