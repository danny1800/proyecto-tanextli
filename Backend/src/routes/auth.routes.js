const { Router } = require('express');
const { registro, login, googleLogin, perfil } = require('../controllers/auth.controller');
const authMiddleware = require('../middlewares/auth.middleware');

const router = Router();

router.post('/registro', registro);
router.post('/login', login);
router.post('/google-login', googleLogin);
router.get('/perfil', authMiddleware, perfil);

module.exports = router;
