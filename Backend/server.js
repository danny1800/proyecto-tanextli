const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const authRoutes = require('./src/routes/auth.routes');
const categoriasRoutes = require('./src/routes/categorias.routes');
const progresoRoutes = require('./src/routes/progreso.routes');

if (!process.env.JWT_SECRET) {
  console.error('Falta JWT_SECRET en el archivo .env');
  process.exit(1);
}

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({ origin: process.env.CLIENT_URL || 'http://localhost:5173' }));
app.use(express.json());

// Audios estáticos
app.use('/api/audios', express.static(path.join(__dirname, 'audios')));

// Rutas
app.use('/api', authRoutes);              // /api/registro, /api/login, /api/google-login, /api/perfil
app.use('/api/categorias', categoriasRoutes);
app.use('/api/progreso', progresoRoutes);

// Manejo de errores general
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: 'Error interno del servidor' });
});

app.listen(PORT, () => {
  console.log(`Servidor de Tanextli en http://localhost:${PORT}`);
});
