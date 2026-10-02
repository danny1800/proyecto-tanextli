import { useEffect, useState } from 'react';
import AuthScreen from './pages/Auth/AuthScreen';
import { verificarSesion, cerrarSesion } from './services/authService';

export default function App() {
  const [usuario, setUsuario] = useState(null);
  const [revisando, setRevisando] = useState(true);

  // Al abrir la app, revisa si ya había una sesión iniciada
  useEffect(() => {
    verificarSesion().then((u) => {
      setUsuario(u);
      setRevisando(false);
    });
  }, []);

  const salir = async () => {
    await cerrarSesion();
    setUsuario(null);
  };

  if (revisando) return null;

  if (!usuario) return <AuthScreen onLogin={setUsuario} />;

  // Aquí va el menú principal / Home de la app (reemplazar este bloque)
  return (
    <div style={{ padding: 40, fontFamily: 'Segoe UI, sans-serif' }}>
      <h1>¡Hola, {usuario.nombre_usuario}!</h1>
      <p>Sesión iniciada como {usuario.correo}</p>
      <button onClick={salir}>Cerrar sesión</button>
    </div>
  );
}
