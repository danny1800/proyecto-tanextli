const { verificarToken } = require('../utils/token');

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'No autorizado: token faltante' });
  }
  try {
    req.user = verificarToken(authHeader.split(' ')[1]);
    next();
  } catch {
    return res.status(401).json({ error: 'Sesión expirada o token inválido' });
  }
};

module.exports = authMiddleware;
