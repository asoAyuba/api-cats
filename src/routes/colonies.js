const express = require('express');
const db = require('../db');
const logger = require('../utils/logger');
const metrics = require('../utils/metrics');

const router = express.Router();

router.get('/', (req, res) => {
  db.all('SELECT * FROM colonies', [], (err, rows) => {
    if (err) {
      logger.error(`Error al obtener colonias: ${err.message}`);
      res.status(500).json({ error: err.message });
    } else {
      metrics.incrementRequestCount('GET /colonies');
      res.json(rows);
    }
  });
});

router.post('/', (req, res) => {
  const { name, location } = req.body;
  db.run('INSERT INTO colonies (name, location) VALUES (?, ?)', [name, location], function (err) {
    if (err) {
      logger.error(`Error al crear colonia: ${err.message}`);
      res.status(500).json({ error: err.message });
    } else {
      metrics.incrementRequestCount('POST /colonies');
      res.json({ id: this.lastID });
    }
  });
});

module.exports = router;
