// Firebase Admin solo se usa para VERIFICAR el token de Google que manda el frontend.
// Para verificar tokens basta con el projectId (no requiere llave de servicio).
const { initializeApp, getApps } = require('firebase-admin/app');
const { getAuth } = require('firebase-admin/auth');

if (!getApps().length) {
  initializeApp({ projectId: process.env.FIREBASE_PROJECT_ID });
}

module.exports = { firebaseAuth: getAuth() };
