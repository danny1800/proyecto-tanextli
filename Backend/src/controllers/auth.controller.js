const bcrypt = require('bcryptjs');
const Usuario = require('../models/usuario.model');
const { generarToken } = require('../utils/token');
const { firebaseAuth } = require('../config/firebaseAdmin');

const CORREO_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const normalizarCorreo = (c) => String(c || '').trim().toLowerCase();

const responderConSesion = (res, usuario, status = 200) =>
  res.status(status).json({ token: generarToken(usuario), usuario: Usuario.publico(usuario) });

// POST /api/registro
const registro = async (req, res) => {
  const nombre_usuario = String(req.body.nombre_usuario || '').trim();
  const correo = normalizarCorreo(req.body.correo);
  const { password } = req.body;

  if (!nombre_usuario || !correo || !password) {
    return res.status(400).json({ error: 'Llena todos los campos' });
  }
  if (!CORREO_REGEX.test(correo)) {
    return res.status(400).json({ error: 'El correo no es válido' });
  }
  if (password.length < 6) {
    return res.status(400).json({ error: 'La contraseña debe tener al menos 6 caracteres' });
  }
  if (Usuario.buscarPorCorreo(correo)) {
    return res.status(409).json({ error: 'Ese correo ya está registrado' });
  }

  const password_hash = await bcrypt.hash(password, 10);
  const nuevo = Usuario.crear({ nombre_usuario, correo, password_hash, proveedor: 'local' });
  return responderConSesion(res, nuevo, 201);
};

// POST /api/login
const login = async (req, res) => {
  const correo = normalizarCorreo(req.body.correo);
  const { password } = req.body;

  if (!correo || !password) {
    return res.status(400).json({ error: 'Escribe tu correo y contraseña' });
  }

  const usuario = Usuario.buscarPorCorreo(correo);
  if (!usuario) {
    return res.status(401).json({ error: 'Correo o contraseña incorrectos' });
  }
  // Cuentas creadas con Google no tienen contraseña
  if (!usuario.password_hash) {
    return res.status(400).json({ error: 'Esta cuenta se creó con Google. Usa "Continuar con Google".' });
  }

  const valido = await bcrypt.compare(password, usuario.password_hash);
  if (!valido) {
    return res.status(401).json({ error: 'Correo o contraseña incorrectos' });
  }
  return responderConSesion(res, usuario);
};

// POST /api/google-login  — recibe { idToken } desde el frontend
const googleLogin = async (req, res) => {
  const { idToken } = req.body;
  if (!idToken) {
    return res.status(400).json({ error: 'Falta el token de Google' });
  }

  let datosGoogle;
  try {
    // Verifica con Firebase que el token es real; NO se confía en el correo que mande el cliente
    datosGoogle = await firebaseAuth.verifyIdToken(idToken);
  } catch {
    return res.status(401).json({ error: 'No se pudo verificar la cuenta de Google' });
  }

  const correo = normalizarCorreo(datosGoogle.email);
  if (!correo) {
    return res.status(400).json({ error: 'Google no proporcionó un correo' });
  }

  let usuario = Usuario.buscarPorCorreo(correo);
  if (!usuario) {
    usuario = Usuario.crear({
      nombre_usuario: datosGoogle.name || 'Usuario de Google',
      correo,
      proveedor: 'google',
    });
  }
  return responderConSesion(res, usuario);
};

// GET /api/perfil  — para comprobar la sesión al recargar la página
const perfil = (req, res) => {
  const usuario = Usuario.buscarPorId(req.user.id);
  if (!usuario) return res.status(404).json({ error: 'Usuario no encontrado' });
  return res.json({ usuario: Usuario.publico(usuario) });
};

module.exports = { registro, login, googleLogin, perfil };
