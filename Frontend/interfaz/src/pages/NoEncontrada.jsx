import { Link } from 'react-router-dom'
import Sidebar from '../components/Sidebar'
import '../styles/noEncontrada.css'

function NoEncontrada() {
  return (
    <div className="menu-layout">
      <Sidebar />

      <main className="menu-contenido">
        <div className="nf-contenedor">
          <div className="nf-tarjeta">
            <img src="/mascota.png" alt="Mascota de Tanextli" className="nf-mascota" />
            <p className="nf-codigo">404</p>
            <h1>Esta página no existe</h1>
            <p className="nf-texto">
              Parece que el camino que buscas no está aquí. Puede que la dirección esté
              mal escrita o que la página se haya movido.
            </p>
            <Link to="/menu" className="nf-boton">Volver al inicio</Link>
          </div>
        </div>
      </main>
    </div>
  )
}

export default NoEncontrada