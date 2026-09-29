const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || 'secreto_tanextli';

app.use(cors());
app.use(express.json());

// Sirve archivos de audio estáticos desde la carpeta /audios
app.use('/api/audios', express.static(path.join(__dirname, 'audios')));

// Archivos JSON de persistencia
const USERS_FILE = path.join(__dirname, 'usuarios.json');
const CATEGORIES_FILE = path.join(__dirname, 'categorias.json');
const PROGRESS_FILE = path.join(__dirname, 'progreso.json');

const leerJSON = (filepath, defaultData = []) => {
  if (!fs.existsSync(filepath)) {
    fs.writeFileSync(filepath, JSON.stringify(defaultData, null, 2));
    return defaultData;
  }
  const raw = fs.readFileSync(filepath, 'utf-8');
  return JSON.parse(raw || '[]');
};

const escribirJSON = (filepath, data) => {
  fs.writeFileSync(filepath, JSON.stringify(data, null, 2));
};

// Middleware de Autenticación con JWT
const authMiddleware = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'No autorizado: Token faltante o inválido' });
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ error: 'No autorizado: Token inválido' });
  }
};

/* ==========================================
   2.1 ENDPOINTS Y COMPORTAMIENTO
   ========================================== */

// POST /api/registro
app.post('/api/registro', async (req, res) => {
  const { nombre_usuario, correo, password } = req.body;

  if (!nombre_usuario || !correo || !password) {
    return res.status(400).json({ error: 'Datos inválidos' });
  }

  const usuarios = leerJSON(USERS_FILE);
  const existe = usuarios.find(u => u.correo === correo);

  if (existe) {
    return res.status(400).json({ error: 'Correo ya registrado' });
  }

  const password_hash = await bcrypt.hash(password, 10);
  const nuevoUsuario = {
    id: Date.now(),
    nombre_usuario,
    correo,
    password_hash,
    creado_en: new Date().toISOString()
  };

  usuarios.push(nuevoUsuario);
  escribirJSON(USERS_FILE, usuarios);

  const token = jwt.sign({ id: nuevoUsuario.id, correo: nuevoUsuario.correo }, JWT_SECRET, { expiresIn: '7d' });

  return res.status(201).json({
    token,
    usuario: { id: nuevoUsuario.id, nombre_usuario: nuevoUsuario.nombre_usuario, correo: nuevoUsuario.correo }
  });
});

// POST /api/login
app.post('/api/login', async (req, res) => {
  const { correo, password } = req.body;

  if (!correo || !password) {
    return res.status(400).json({ error: 'Datos inválidos' });
  }

  const usuarios = leerJSON(USERS_FILE);
  const usuario = usuarios.find(u => u.correo === correo);

  if (!usuario) {
    return res.status(401).json({ error: 'Credenciales incorrectas' });
  }

  const valido = await bcrypt.compare(password, usuario.password_hash);
  if (!valido) {
    return res.status(401).json({ error: 'Credenciales incorrectas' });
  }

  const token = jwt.sign({ id: usuario.id, correo: usuario.correo }, JWT_SECRET, { expiresIn: '7d' });

  return res.status(200).json({
    token,
    usuario: { id: usuario.id, nombre_usuario: usuario.nombre_usuario, correo: usuario.correo }
  });
});

// POST /api/google-login (Acepta 'correo' o 'email' indistintamente)
app.post('/api/google-login', async (req, res) => {
  const correo = req.body.correo || req.body.email;
  const nombre_usuario = req.body.nombre_usuario || req.body.nombre || 'Usuario Google';

  if (!correo) {
    return res.status(400).json({ error: 'No se recibió un correo válido de Google' });
  }

  const usuarios = leerJSON(USERS_FILE);
  let usuario = usuarios.find(u => u.correo === correo);

  if (!usuario) {
    usuario = {
      id: Date.now(),
      nombre_usuario,
      correo,
      password_hash: null,
      creado_en: new Date().toISOString()
    };
    usuarios.push(usuario);
    escribirJSON(USERS_FILE, usuarios);
  }

  const token = jwt.sign({ id: usuario.id, correo: usuario.correo }, JWT_SECRET, { expiresIn: '7d' });

  return res.status(200).json({
    token,
    usuario: { id: usuario.id, nombre_usuario: usuario.nombre_usuario, correo: usuario.correo }
  });
});

// GET /api/categorias
app.get('/api/categorias', (req, res) => {
  const data = leerJSON(CATEGORIES_FILE, [
    { id: 1, nombre: 'Animales' },
    { id: 2, nombre: 'Colores' },
    { id: 3, nombre: 'Números' },
    { id: 4, nombre: 'Familia' },
    { id: 5, nombre: 'Comida' },
    { id: 6, nombre: 'Cuerpo Humano' },
    { id: 7, nombre: 'Naturaleza' },
    { id: 8, nombre: 'Objetos del Hogar' }
  ]);

  const categorias = data.map(c => ({ id: c.id, nombre: c.nombre }));
  res.status(200).json(categorias);
});

// GET /api/categorias/:id/palabras
app.get('/api/categorias/:id/palabras', (req, res) => {
  const catId = parseInt(req.params.id, 10);
  const data = leerJSON(CATEGORIES_FILE);

  const categoria = data.find(c => c.id === catId);
  if (!categoria) {
    return res.status(404).json({ error: 'Categoría no encontrada' });
  }

  res.status(200).json(categoria.palabras || []);
});

// GET /api/progreso
app.get('/api/progreso', authMiddleware, (req, res) => {
  const usuarioId = req.user.id;
  const { categoria_id } = req.query;

  const progreso = leerJSON(PROGRESS_FILE);
  let resultado = progreso.filter(p => p.usuario_id === usuarioId);

  if (categoria_id) {
    resultado = resultado.filter(p => p.categoria_id === parseInt(categoria_id, 10));
  }

  res.status(200).json(resultado);
});

// POST /api/progreso
app.post('/api/progreso', authMiddleware, (req, res) => {
  const usuarioId = req.user.id;
  const { palabra_id, categoria_id } = req.body;

  if (!palabra_id) {
    return res.status(400).json({ error: 'Se requiere palabra_id' });
  }

  const progreso = leerJSON(PROGRESS_FILE);
  const existe = progreso.find(p => p.usuario_id === usuarioId && p.palabra_id === palabra_id);

  if (existe) {
    return res.status(400).json({ error: 'Ya existe progreso para esta palabra (usar PATCH)' });
  }

  const nuevoRegistro = {
    id: Date.now(),
    usuario_id: usuarioId,
    palabra_id,
    categoria_id: categoria_id || null,
    completado: true,
    veces_practicada: 1,
    ultima_practica: new Date().toISOString()
  };

  progreso.push(nuevoRegistro);
  escribirJSON(PROGRESS_FILE, progreso);

  res.status(201).json(nuevoRegistro);
});

// PATCH /api/progreso/:palabra_id
app.patch('/api/progreso/:palabra_id', authMiddleware, (req, res) => {
  const usuarioId = req.user.id;
  const palabraId = parseInt(req.params.palabra_id, 10);
  const { completado } = req.body;

  const progreso = leerJSON(PROGRESS_FILE);
  const index = progreso.findIndex(p => p.usuario_id === usuarioId && p.palabra_id === palabraId);

  if (index === -1) {
    return res.status(404).json({ error: 'No existe progreso registrado para esa palabra' });
  }

  progreso[index].veces_practicada += 1;
  progreso[index].ultima_practica = new Date().toISOString();
  if (typeof completado === 'boolean') {
    progreso[index].completado = completado;
  }

  escribirJSON(PROGRESS_FILE, progreso);
  res.status(200).json(progreso[index]);
});

app.listen(PORT, () => {
  console.log(`Servidor de Tanextli ejecutándose en http://localhost:${PORT}`);
});