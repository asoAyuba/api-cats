const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const logger = require('./utils/logger');

// Ruta a la base de datos SQLite
const dbPath = path.resolve('/data', 'database.sqlite');

// Crear conexión a la base de datos
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    logger.error(`Error al conectar con SQLite: ${err.message}`);
    process.exit(1);
  } else {
    logger.info('Conectado a la base de datos SQLite.');
  }
});

module.exports = db;
