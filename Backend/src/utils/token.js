const jwt = require('jsonwebtoken');

const generarToken = (usuario) =>
  jwt.sign({ id: usuario.id, correo: usuario.correo }, process.env.JWT_SECRET, { expiresIn: '7d' });

const verificarToken = (token) => jwt.verify(token, process.env.JWT_SECRET);

module.exports = { generarToken, verificarToken };
