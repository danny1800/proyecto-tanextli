// Lectura/escritura de archivos JSON en /data.
// Cuando migren a MySQL, solo se reemplazan los modelos que usan esto.
const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', '..', 'data');

const ruta = (archivo) => path.join(DATA_DIR, archivo);

const leerJSON = (archivo, defaultData = []) => {
  const filepath = ruta(archivo);
  if (!fs.existsSync(filepath)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
    fs.writeFileSync(filepath, JSON.stringify(defaultData, null, 2));
    return defaultData;
  }
  const raw = fs.readFileSync(filepath, 'utf-8');
  return raw.trim() ? JSON.parse(raw) : defaultData;
};

const escribirJSON = (archivo, data) => {
  fs.mkdirSync(DATA_DIR, { recursive: true });
  fs.writeFileSync(ruta(archivo), JSON.stringify(data, null, 2));
};

module.exports = { leerJSON, escribirJSON };
