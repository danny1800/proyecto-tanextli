import { useEffect, useState } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import AuthScreen from './pages/Auth/AuthScreen'
import { verificarSesion, cerrarSesion } from './services/authService'
import Menu from './pages/Menu'
import CategoriaIntro from './pages/catInfo'
import Categoria from './pages/Categoria'

function App() {
  const [usuario, setUsuario] = useState(null)
  const [revisando, setRevisando] = useState(true)

  // Al abrir la app, revisa si ya había una sesión iniciada
  useEffect(() => {
    verificarSesion().then((u) => {
      setUsuario(u)
      setRevisando(false)
    })
  }, [])

  // Todavía no está conectado al botón "Cerrar sesión" del menú lateral
  const salir = async () => {
    await cerrarSesion()
    setUsuario(null)
  }

  if (revisando) return null

  if (!usuario) return <AuthScreen onLogin={setUsuario} />

  return (
    <Routes>
      <Route path="/" element={<Navigate to="/menu" replace />} />
      <Route path="/menu" element={<Menu />} />
      <Route path="/categoria/:id" element={<CategoriaIntro />} />
      <Route path="/categoria/:id/lecciones" element={<Categoria />} />
    </Routes>
  )
}

export default App