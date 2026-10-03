import { useState } from 'react';
import { registrar, iniciarSesion, iniciarConGoogle } from '../../services/authService';
import './AuthScreen.css';

export default function AuthScreen({ onLogin }) {
  const [esRegistro, setEsRegistro] = useState(false);
  const [form, setForm] = useState({ nombre_usuario: '', correo: '', password: '' });
  const [mensaje, setMensaje] = useState(null); // { texto, tipo: 'success' | 'error' }
  const [cargando, setCargando] = useState(false);

  const cambiar = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const alternarModo = () => {
    setEsRegistro(!esRegistro);
    setMensaje(null);
  };

  const enviar = async (e) => {
    e.preventDefault();
    setMensaje(null);
    setCargando(true);
    try {
      const usuario = esRegistro ? await registrar(form) : await iniciarSesion(form);
      onLogin?.(usuario);
    } catch (err) {
      setMensaje({ texto: err.message, tipo: 'error' });
    } finally {
      setCargando(false);
    }
  };

  const entrarConGoogle = async () => {
    setMensaje(null);
    setCargando(true);
    try {
      const usuario = await iniciarConGoogle();
      onLogin?.(usuario);
    } catch (err) {
      // Si el usuario cierra la ventana de Google no mostramos error
      if (err.code !== 'auth/popup-closed-by-user' && err.code !== 'auth/cancelled-popup-request') {
        setMensaje({ texto: err.message || 'No se pudo entrar con Google', tipo: 'error' });
      }
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="auth">
      <div className="auth__card">
        {/* LADO IZQUIERDO */}
        <aside className="auth__left">
          <div className="auth__circle auth__circle--1" />
          <div className="auth__circle auth__circle--2" />

          <span className="auth__subtitle">APRENDE NÁHUATL</span>
          <h1 className="auth__left-title">Tanextli</h1>
          <p className="auth__left-text">
            ¡Bienvenido a Tanextli!<br />
            Conecta con tu lengua,<br />
            nuestra raíz.
          </p>

          <div className="auth__mascota">
            <img src="/mascota.png" alt="Mascota de Tanextli" />
          </div>
        </aside>

        {/* LADO DERECHO */}
        <main className="auth__right">
          <h2 className="auth__brand">Tanextli</h2>
          <p className="auth__tagline">Aprende náhuatl de forma fácil</p>

          <h3 className="auth__form-title">{esRegistro ? 'Crear cuenta' : 'Inicia sesión'}</h3>

          <form onSubmit={enviar} className="auth__form">
            {esRegistro && (
              <div className="auth__group">
                <label htmlFor="nombre_usuario">👤 Nombre de usuario</label>
                <input
                  id="nombre_usuario"
                  name="nombre_usuario"
                  type="text"
                  placeholder="Ingresa tu nombre de usuario"
                  value={form.nombre_usuario}
                  onChange={cambiar}
                  required
                />
              </div>
            )}

            <div className="auth__group">
              <label htmlFor="correo">✉️ Correo electrónico</label>
              <input
                id="correo"
                name="correo"
                type="email"
                placeholder="Ingresa tu correo electrónico"
                value={form.correo}
                onChange={cambiar}
                autoComplete="email"
                required
              />
            </div>

            <div className="auth__group">
              <label htmlFor="password">🔒 Contraseña</label>
              <input
                id="password"
                name="password"
                type="password"
                placeholder={esRegistro ? 'Mínimo 6 caracteres' : 'Ingresa tu contraseña'}
                value={form.password}
                onChange={cambiar}
                autoComplete={esRegistro ? 'new-password' : 'current-password'}
                minLength={esRegistro ? 6 : undefined}
                required
              />
            </div>

            {!esRegistro && (
              <div className="auth__forgot">
                <a href="#forgot">¿Olvidaste tu contraseña?</a>
              </div>
            )}

            <button type="submit" className="auth__btn-primary" disabled={cargando}>
              {cargando ? 'Cargando…' : esRegistro ? 'Registrarse' : 'Iniciar sesión'}
            </button>
          </form>

          <div className="auth__divider">
            <span /><i /><span />
          </div>

          <button type="button" onClick={entrarConGoogle} className="auth__btn-google" disabled={cargando}>
            <svg width="18" height="18" viewBox="0 0 48 48" aria-hidden="true">
              <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.7 32.7 29.2 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34 6.1 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.4-.4-3.5z"/>
              <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.7 15.1 19 12 24 12c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34 6.1 29.3 4 24 4 16.3 4 9.7 8.3 6.3 14.7z"/>
              <path fill="#4CAF50" d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2C29.2 35.1 26.7 36 24 36c-5.2 0-9.6-3.3-11.3-8l-6.5 5C9.5 39.6 16.2 44 24 44z"/>
              <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.2-2.2 4.2-4.1 5.6l6.2 5.2C37 39.2 44 34 44 24c0-1.3-.1-2.4-.4-3.5z"/>
            </svg>
            <span>Continuar con Google</span>
          </button>

          <p className="auth__toggle">
            {esRegistro ? '¿Ya tienes cuenta?' : '¿No tienes cuenta?'}{' '}
            <button type="button" onClick={alternarModo}>
              {esRegistro ? 'Inicia sesión' : 'Crear cuenta'}
            </button>
          </p>

          {mensaje && (
            <div className={`auth__message auth__message--${mensaje.tipo}`} role="alert">
              {mensaje.texto}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
