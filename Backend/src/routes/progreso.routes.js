// Movido tal cual desde el server.js original (ahora protegido por el middleware)
const { Router } = require('express');
const { leerJSON, escribirJSON } = require('../utils/jsonStore');
const authMiddleware = require('../middlewares/auth.middleware');

const router = Router();
const ARCHIVO = 'progreso.json';

router.use(authMiddleware);

// GET /api/progreso?categoria_id=
router.get('/', (req, res) => {
  const { categoria_id } = req.query;
  let resultado = leerJSON(ARCHIVO).filter((p) => p.usuario_id === req.user.id);
  if (categoria_id) {
    resultado = resultado.filter((p) => p.categoria_id === parseInt(categoria_id, 10));
  }
  res.json(resultado);
});

// POST /api/progreso
router.post('/', (req, res) => {
  const { palabra_id, categoria_id } = req.body;
  if (!palabra_id) return res.status(400).json({ error: 'Se requiere palabra_id' });

  const progreso = leerJSON(ARCHIVO);
  if (progreso.find((p) => p.usuario_id === req.user.id && p.palabra_id === palabra_id)) {
    return res.status(400).json({ error: 'Ya existe progreso para esta palabra (usar PATCH)' });
  }

  const nuevo = {
    id: Date.now(),
    usuario_id: req.user.id,
    palabra_id,
    categoria_id: categoria_id || null,
    completado: true,
    veces_practicada: 1,
    ultima_practica: new Date().toISOString(),
  };
  progreso.push(nuevo);
  escribirJSON(ARCHIVO, progreso);
  res.status(201).json(nuevo);
});

// PATCH /api/progreso/:palabra_id
router.patch('/:palabra_id', (req, res) => {
  const palabraId = parseInt(req.params.palabra_id, 10);
  const { completado } = req.body;
  const progreso = leerJSON(ARCHIVO);
  const i = progreso.findIndex((p) => p.usuario_id === req.user.id && p.palabra_id === palabraId);
  if (i === -1) return res.status(404).json({ error: 'No existe progreso registrado para esa palabra' });

  progreso[i].veces_practicada += 1;
  progreso[i].ultima_practica = new Date().toISOString();
  if (typeof completado === 'boolean') progreso[i].completado = completado;

  escribirJSON(ARCHIVO, progreso);
  res.json(progreso[i]);
});

module.exports = router;
