// Todas las llamadas de autenticación al backend y el manejo de la sesión.
import { signInWithPopup, signOut } from 'firebase/auth';
import { auth, googleProvider } from './firebase';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
const TOKEN_KEY = 'tanextli_token';
const USER_KEY = 'tanextli_user';

async function pedir(endpoint, { method = 'GET', body, token } = {}) {
  let response;
  try {
    response = await fetch(`${API_URL}${endpoint}`, {
      method,
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      body: body ? JSON.stringify(body) : undefined,
    });
  } catch {
    throw new Error('No hay conexión con el servidor. Revisa que el backend esté encendido.');
  }

  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data.error || 'Ocurrió un error, intenta de nuevo.');
  return data;
}

function guardarSesion({ token, usuario }) {
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(USER_KEY, JSON.stringify(usuario));
  return usuario;
}

export async function registrar({ nombre_usuario, correo, password }) {
  const data = await pedir('/registro', { method: 'POST', body: { nombre_usuario, correo, password } });
  return guardarSesion(data);
}

export async function iniciarSesion({ correo, password }) {
  const data = await pedir('/login', { method: 'POST', body: { correo, password } });
  return guardarSesion(data);
}

export async function iniciarConGoogle() {
  const result = await signInWithPopup(auth, googleProvider);
  const idToken = await result.user.getIdToken();
  // El backend verifica el token y obtiene de ahí el correo y el nombre
  const data = await pedir('/google-login', { method: 'POST', body: { idToken } });
  return guardarSesion(data);
}

export function obtenerToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export function obtenerUsuarioGuardado() {
  try {
    return JSON.parse(localStorage.getItem(USER_KEY));
  } catch {
    return null;
  }
}

// Revisa con el backend que el token guardado siga siendo válido
export async function verificarSesion() {
  const token = obtenerToken();
  if (!token) return null;
  try {
    const { usuario } = await pedir('/perfil', { token });
    localStorage.setItem(USER_KEY, JSON.stringify(usuario));
    return usuario;
  } catch {
    cerrarSesion();
    return null;
  }
}

export async function cerrarSesion() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
  await signOut(auth).catch(() => {});
}
