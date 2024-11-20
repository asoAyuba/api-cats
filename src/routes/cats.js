const express = require('express');
const db = require('../db');
const logger = require('../utils/logger');
const metrics = require('../utils/metrics');

const router = express.Router();

router.get('/:colonyId', (req, res) => {
  const { colonyId } = req.params;
  db.all('SELECT * FROM cats WHERE colony_id = ?', [colonyId], (err, rows) => {
    if (err) {
      logger.error(`Error al obtener gatos: ${err.message}`);
      res.status(500).json({ error: err.message });
    } else {
      metrics.incrementRequestCount(`GET /cats/${colonyId}`);
      res.json(rows);
    }
  });
});

router.post('/:colonyId', (req, res) => {
  const { colonyId } = req.params;
  const { name, age, gender } = req.body;
  db.run('INSERT INTO cats (name, age, gender, colony_id) VALUES (?, ?, ?, ?)', [name, age, gender, colonyId], function (err) {
    if (err) {
      logger.error(`Error al añadir gato: ${err.message}`);
      res.status(500).json({ error: err.message });
    } else {
      metrics.incrementRequestCount(`POST /cats/${colonyId}`);
      res.json({ id: this.lastID });
    }
  });
});

module.exports = router;
