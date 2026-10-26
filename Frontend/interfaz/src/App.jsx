import { useEffect, useState } from 'react';
import AuthScreen from './pages/Auth/AuthScreen';
import { verificarSesion, cerrarSesion } from './services/authService';
import PruebaContenido from './components/PruebaContenido';

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

  return (
    <div>
      <PruebaContenido />

      <div style={{ padding: 20 }}>
        <p>Sesión iniciada como {usuario.correo}</p>
        <button onClick={salir}>Cerrar sesión</button>
      </div>
    </div>
  );
}