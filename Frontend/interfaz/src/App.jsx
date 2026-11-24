import { useEffect, useState } from 'react'
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom'
import AuthScreen from './pages/Auth/AuthScreen'
import { verificarSesion } from './services/authService'
import Menu from './pages/Menu'
import CategoriaIntro from './pages/catInfo'
import Categoria from './pages/Categoria'
import AcercaDe from './pages/acercaDe'
import Cargando from './components/Cargando'
import NoEncontrada from './pages/NoEncontrada'
import Onboarding from './pages/Onboarding'
import { onboardingPendiente, marcarOnboardingCompletado } from './services/onboarding'
import Leccion from './pages/Leccion'
import Perfil from './pages/Perfil'
import Configuracion from './pages/Configuracion'
import { aplicarPreferencias } from './services/preferencias'
import './styles/preferencias.css'

// Aplica la letra grande / animaciones guardadas desde que abre la app
aplicarPreferencias()

// SOLO PARA DESARROLLO: si lo pones en true, la app entra directo con un usuario de prueba
// y NO pide login (y "Cerrar sesión" no te llevará al login).
// Déjalo en false para que la app funcione normal, y NO lo subas en true al repositorio.
const SALTAR_LOGIN = false
const USUARIO_DE_PRUEBA = { nombre_usuario: 'Edgar', correo: 'edgar@dev.com' }

function App() {
  const [usuario, setUsuario] = useState(SALTAR_LOGIN ? USUARIO_DE_PRUEBA : null)
  const [revisando, setRevisando] = useState(!SALTAR_LOGIN)
  const navigate = useNavigate()
  const [, setBienvenidaVista] = useState(0)

  // Al abrir la app, revisa si ya había una sesión iniciada
  useEffect(() => {
    if (SALTAR_LOGIN) return
    verificarSesion().then((u) => {
      setUsuario(u)
      setRevisando(false)
    })
  }, [])

  if (revisando) return <Cargando />

  // Sin sesión: cualquier ruta (/menu, /categoria/...) muestra el login
  if (!usuario) return <AuthScreen onLogin={setUsuario} />

  if (onboardingPendiente(usuario)) {
    return (
      <Onboarding
        onTerminar={() => {
          marcarOnboardingCompletado(usuario)
          setBienvenidaVista((n) => n + 1)
        }}
      />
    )
  }

  return (
    <Routes>
      <Route path="/" element={<Navigate to="/menu" replace />} />
      <Route path="/menu" element={<Menu usuario={usuario} />} />
      <Route path="/categoria/:id" element={<CategoriaIntro />} />
      <Route path="/categoria/:id/lecciones" element={<Categoria />} />
      <Route path="/categoria/:id/leccion/:leccionId" element={<Leccion />} />
      <Route path="/perfil" element={<Perfil usuario={usuario} />} />
      <Route path="/configuracion" element={<Configuracion usuario={usuario} />} />
      <Route path="/acerca-de" element={<AcercaDe />} />
      <Route path="/bienvenida" element={<Onboarding onTerminar={() => navigate('/menu')} />} />
      {/* Cualquier otra dirección muestra la página de "no encontrada" */}
      <Route path="*" element={<NoEncontrada />} />
    </Routes>
  )
}

export default App