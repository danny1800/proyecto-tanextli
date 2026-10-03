// Toda la lógica de guardado de usuarios vive aquí.
// Para pasar a MySQL, se reescribe este archivo manteniendo las mismas funciones.
const { leerJSON, escribirJSON } = require('../utils/jsonStore');

const ARCHIVO = 'usuarios.json';

const buscarPorCorreo = (correo) =>
  leerJSON(ARCHIVO).find((u) => u.correo === correo) || null;

const buscarPorId = (id) =>
  leerJSON(ARCHIVO).find((u) => u.id === id) || null;

const crear = ({ nombre_usuario, correo, password_hash = null, proveedor = 'local' }) => {
  const usuarios = leerJSON(ARCHIVO);
  const nuevo = {
    id: Date.now(),
    nombre_usuario,
    correo,
    password_hash,
    proveedor, // 'local' | 'google'
    rol: 'estudiante', // estudiante | docente | administrador
    creado_en: new Date().toISOString(),
  };
  usuarios.push(nuevo);
  escribirJSON(ARCHIVO, usuarios);
  return nuevo;
};

// Lo que se puede mandar al frontend (sin password_hash)
const publico = (u) => ({
  id: u.id,
  nombre_usuario: u.nombre_usuario,
  correo: u.correo,
  rol: u.rol,
});

module.exports = { buscarPorCorreo, buscarPorId, crear, publico };
