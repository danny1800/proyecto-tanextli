// Movido tal cual desde el server.js original
const { Router } = require('express');
const { leerJSON } = require('../utils/jsonStore');

const router = Router();
const ARCHIVO = 'categorias.json';

const CATEGORIAS_DEFAULT = [
  { id: 1, nombre: 'Animales' },
  { id: 2, nombre: 'Colores' },
  { id: 3, nombre: 'Números' },
  { id: 4, nombre: 'Familia' },
  { id: 5, nombre: 'Comida' },
  { id: 6, nombre: 'Cuerpo Humano' },
  { id: 7, nombre: 'Naturaleza' },
  { id: 8, nombre: 'Objetos del Hogar' },
];

// GET /api/categorias
router.get('/', (req, res) => {
  const data = leerJSON(ARCHIVO, CATEGORIAS_DEFAULT);
  res.json(data.map((c) => ({ id: c.id, nombre: c.nombre })));
});

// GET /api/categorias/:id/palabras
router.get('/:id/palabras', (req, res) => {
  const catId = parseInt(req.params.id, 10);
  const categoria = leerJSON(ARCHIVO, CATEGORIAS_DEFAULT).find((c) => c.id === catId);
  if (!categoria) return res.status(404).json({ error: 'Categoría no encontrada' });
  res.json(categoria.palabras || []);
});

module.exports = router;
