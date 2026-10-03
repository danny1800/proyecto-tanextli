import { NavLink } from 'react-router-dom'
import {
  IconInicio, IconFamilia, IconColores, IconFrases,
  IconNumeros, IconPerfil, IconConfiguracion, IconSalir,
} from './Icons'

function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="sidebar-logo">🍃 Tanextli</div>

      <nav className="sidebar-nav">
        <NavLink to="/menu" end className="sidebar-link">
          <IconInicio /> Inicio
        </NavLink>
        <NavLink to="/categoria/familia" className="sidebar-link">
          <IconFamilia /> Familia
        </NavLink>
        <NavLink to="/categoria/colores" className="sidebar-link">
          <IconColores /> Colores
        </NavLink>
        <NavLink to="/categoria/frases" className="sidebar-link">
          <IconFrases /> Frases
        </NavLink>
        <NavLink to="/categoria/numeros" className="sidebar-link">
          <IconNumeros /> Números
        </NavLink>
      </nav>

      <div className="sidebar-nav sidebar-nav-abajo">
        <NavLink to="/perfil" className="sidebar-link">
          <IconPerfil /> Perfil
        </NavLink>
        <NavLink to="/configuracion" className="sidebar-link">
          <IconConfiguracion /> Configuración
        </NavLink>
        <button className="sidebar-link sidebar-salir" onClick={() => console.log('Cerrar sesión: pendiente')}>
          <IconSalir /> Cerrar sesión
        </button>
      </div>
    </aside>
  )
}

export default Sidebar
