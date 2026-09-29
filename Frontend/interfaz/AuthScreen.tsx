import React, { useState } from 'react';
import { auth, googleProvider, signInWithPopup } from './firebase';

export const AuthScreen: React.FC = () => {
  const [isRegistering, setIsRegistering] = useState(false);
  const [nombreUsuario, setNombreUsuario] = useState('');
  const [correo, setCorreo] = useState('');
  const [password, setPassword] = useState('');
  const [mensaje, setMensaje] = useState<{ texto: string; tipo: 'success' | 'error' } | null>(null);

  const toggleMode = () => {
    setIsRegistering(!isRegistering);
    setMensaje(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMensaje(null);

    const endpoint = isRegistering ? '/api/registro' : '/api/login';
    const payload = isRegistering 
      ? { nombre_usuario: nombreUsuario, correo, password }
      : { correo, password };

    try {
      const response = await fetch(`http://localhost:5000${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Ocurrió un error en la solicitud.');
      }

      if (data.token) {
        localStorage.setItem('tanextli_token', data.token);
      }
      if (data.usuario) {
        localStorage.setItem('tanextli_user', JSON.stringify(data.usuario));
      }

      if (!isRegistering && data.usuario) {
        alert(`¡Bienvenido/a ${data.usuario.nombre_usuario || 'a Tanextli'}!`);
      }

      setMensaje({ texto: isRegistering ? 'Registro exitoso' : 'Inicio de sesión exitoso', tipo: 'success' });
    } catch (err: any) {
      setMensaje({ texto: err.message || 'Error al conectar con el servidor', tipo: 'error' });
    }
  };

  const handleGoogleSignIn = async () => {
    setMensaje(null);
    try {
      googleProvider.setCustomParameters({
        prompt: 'select_account'
      });

      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;

      const emailUsuario = user.email || user.providerData?.[0]?.email;
      const nombreUsuarioGoogle = user.displayName || user.providerData?.[0]?.displayName || 'Usuario de Google';

      if (!emailUsuario) {
        setMensaje({ texto: 'Google no proporcionó una dirección de correo.', tipo: 'error' });
        return;
      }

      const idToken = await user.getIdToken();

      const response = await fetch('http://localhost:5000/api/google-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          idToken,
          correo: emailUsuario,
          email: emailUsuario,
          nombre_usuario: nombreUsuarioGoogle,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        if (data.token) localStorage.setItem('tanextli_token', data.token);
        if (data.usuario) localStorage.setItem('tanextli_user', JSON.stringify(data.usuario));
        alert(`¡Bienvenido/a ${data.usuario?.nombre_usuario || 'a Tanextli'}!`);
        setMensaje({ texto: 'Autenticación con Google exitosa', tipo: 'success' });
      } else {
        setMensaje({ texto: data.error || 'Error en autenticación con Google', tipo: 'error' });
      }
    } catch (error: any) {
      console.error(error);
      if (
        error.code === 'auth/popup-closed-by-user' || 
        error.code === 'auth/cancelled-popup-request'
      ) {
        return;
      }
      setMensaje({ texto: 'Error al iniciar sesión con Google', tipo: 'error' });
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        {/* LADO IZQUIERDO */}
        <div style={styles.leftPanel}>
          <div style={styles.circleBg1} />
          <div style={styles.circleBg2} />
          
          <span style={styles.topSubtitle}>APRENDE NÁHUATL</span>
          <h1 style={styles.leftTitle}>Tanextli</h1>
          <p style={styles.leftDescription}>
            ¡Bienvenido a Tanextli!<br />
            Conecta con tu lengua,<br />
            nuestra raíz.
          </p>

          <div style={styles.mascotContainer}>
            <div style={{
              width: '180px',
              height: '180px',
              borderRadius: '50%',
              backgroundColor: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 8px 25px rgba(0,0,0,0.1)',
              margin: '0 auto',
              overflow: 'hidden',
              padding: '8px'
            }}>
              <img 
                src="/mascota.png" 
                alt="Mascota Tanextli" 
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'contain'
                }} 
              />
            </div>
          </div>
        </div>

        {/* LADO DERECHO */}
        <div style={styles.rightPanel}>
          <h2 style={styles.brandTitle}>Tanextli</h2>
          <p style={styles.brandTagline}>Aprende náhuatl de forma fácil</p>

          <h3 style={styles.formTitle}>
            {isRegistering ? 'Crear cuenta' : 'Inicia sesión'}
          </h3>

          <form onSubmit={handleSubmit} style={styles.form}>
            {isRegistering && (
              <div style={styles.inputGroup}>
                <label style={styles.label}>👤 Nombre de usuario</label>
                <input
                  type="text"
                  placeholder="Ingresa tu nombre de usuario"
                  value={nombreUsuario}
                  onChange={(e) => setNombreUsuario(e.target.value)}
                  style={styles.input}
                  required
                />
              </div>
            )}

            <div style={styles.inputGroup}>
              <label style={styles.label}>✉️ Correo electrónico</label>
              <input
                type="email"
                placeholder="Ingresa tu correo electrónico"
                value={correo}
                onChange={(e) => setCorreo(e.target.value)}
                style={styles.input}
                required
              />
            </div>

            <div style={styles.inputGroup}>
              <label style={styles.label}>🔒 Contraseña</label>
              <input
                type="password"
                placeholder="Ingresa tu contraseña"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={styles.input}
                required
              />
            </div>

            {!isRegistering && (
              <div style={{ textAlign: 'right', marginTop: -5, marginBottom: 15 }}>
                <a href="#forgot" style={styles.forgotLink}>¿Olvidaste tu contraseña?</a>
              </div>
            )}

            <button type="submit" style={styles.primaryBtn}>
              {isRegistering ? 'Registrarse' : 'Iniciar sesión'}
            </button>
          </form>

          <div style={styles.dividerContainer}>
            <div style={styles.dividerLine} />
            <div style={styles.dividerDot} />
            <div style={styles.dividerLine} />
          </div>

          <button type="button" onClick={handleGoogleSignIn} style={styles.googleBtn}>
            <span style={{ fontSize: '18px', fontWeight: 'bold', color: '#4285F4' }}>G</span>
            <span>¿Continuar con Google?</span>
          </button>

          <div style={styles.toggleContainer}>
            <span style={styles.toggleText}>
              {isRegistering ? '¿Ya tienes cuenta?' : '¿No tienes cuenta?'}
            </span>
            <span onClick={toggleMode} style={styles.toggleLink}>
              {isRegistering ? ' Inicia sesión' : ' Crear cuenta'}
            </span>
          </div>

          {mensaje && (
            <div style={{
              ...styles.message,
              backgroundColor: mensaje.tipo === 'success' ? '#e6f4ea' : '#fce8e6',
              color: mensaje.tipo === 'success' ? '#137333' : '#c5221f',
              borderColor: mensaje.tipo === 'success' ? '#a8dab5' : '#f5c2c0'
            }}>
              {mensaje.texto}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100vh',
    backgroundColor: '#f4f6f8',
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    padding: '20px',
  },
  card: {
    display: 'flex',
    width: '100%',
    maxWidth: '900px',
    minHeight: '580px',
    backgroundColor: '#ffffff',
    borderRadius: '20px',
    boxShadow: '0 10px 30px rgba(0,0,0,0.08)',
    overflow: 'hidden',
  },
  leftPanel: {
    flex: 1,
    backgroundColor: '#d8f3dc',
    padding: '40px 30px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'space-between',
    position: 'relative',
    textAlign: 'center',
    overflow: 'hidden',
  },
  circleBg1: {
    position: 'absolute',
    top: '-30px',
    left: '-30px',
    width: '140px',
    height: '140px',
    borderRadius: '50%',
    backgroundColor: '#c7f9cc',
    opacity: 0.6,
  },
  circleBg2: {
    position: 'absolute',
    bottom: '-40px',
    right: '-40px',
    width: '180px',
    height: '180px',
    borderRadius: '50%',
    backgroundColor: '#b7e4c7',
    opacity: 0.5,
  },
  topSubtitle: {
    color: '#2d6a4f',
    fontSize: '14px',
    fontWeight: '700',
    letterSpacing: '1px',
    zIndex: 1,
  },
  leftTitle: {
    color: '#1b4332',
    fontSize: '48px',
    fontWeight: '800',
    margin: '10px 0',
    zIndex: 1,
  },
  leftDescription: {
    color: '#2d6a4f',
    fontSize: '16px',
    fontWeight: '600',
    lineHeight: '1.4',
    zIndex: 1,
  },
  mascotContainer: {
    zIndex: 1,
    marginTop: '15px',
  },
  rightPanel: {
    flex: 1.1,
    padding: '40px 50px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
  },
  brandTitle: {
    fontSize: '32px',
    fontWeight: '800',
    color: '#1b4332',
    margin: 0,
  },
  brandTagline: {
    fontSize: '14px',
    color: '#52b788',
    marginTop: '4px',
    marginBottom: '25px',
    fontWeight: '500',
  },
  formTitle: {
    fontSize: '18px',
    fontWeight: '700',
    color: '#1b4332',
    marginBottom: '20px',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
  },
  inputGroup: {
    display: 'flex',
    flexDirection: 'column',
    marginBottom: '15px',
  },
  label: {
    fontSize: '12px',
    color: '#2d6a4f',
    marginBottom: '6px',
    fontWeight: '600',
  },
  input: {
    padding: '12px 14px',
    borderRadius: '8px',
    border: '1px solid #ccc',
    fontSize: '13px',
    outline: 'none',
  },
  forgotLink: {
    fontSize: '11px',
    color: '#52b788',
    textDecoration: 'none',
  },
  primaryBtn: {
    backgroundColor: '#1b4332',
    color: '#ffffff',
    border: 'none',
    padding: '12px',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: '700',
    cursor: 'pointer',
    marginTop: '5px',
  },
  dividerContainer: {
    display: 'flex',
    alignItems: 'center',
    margin: '20px 0',
  },
  dividerLine: {
    flex: 1,
    height: '1px',
    backgroundColor: '#e0e0e0',
  },
  dividerDot: {
    width: '10px',
    height: '10px',
    borderRadius: '50%',
    border: '1px solid #b0b0b0',
    margin: '0 8px',
  },
  googleBtn: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '10px',
    backgroundColor: '#ffffff',
    border: '1px solid #cccccc',
    padding: '10px',
    borderRadius: '8px',
    fontSize: '13px',
    color: '#555555',
    cursor: 'pointer',
  },
  toggleContainer: {
    textAlign: 'center',
    marginTop: '20px',
    fontSize: '12px',
  },
  toggleText: {
    color: '#666666',
  },
  toggleLink: {
    color: '#1b4332',
    fontWeight: '700',
    cursor: 'pointer',
  },
  message: {
    marginTop: '15px',
    padding: '10px',
    borderRadius: '6px',
    fontSize: '12px',
    textAlign: 'center',
    border: '1px solid',
  },
};