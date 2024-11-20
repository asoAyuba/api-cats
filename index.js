const express = require('express');
const coloniesRoutes = require('./src/routes/colonies');
const catsRoutes = require('./src/routes/cats');
const logger = require('./src/utils/logger');
const metrics = require('./src/utils/metrics');

const app = express();
const PORT = 4000;

// Middleware para procesar JSON
app.use(express.json());

// Rutas para colonias y gatos
app.use('/colonies', coloniesRoutes);
app.use('/cats', catsRoutes);

// Endpoint de métricas para Grafana
app.get('/metrics', async (req, res) => {
  try {
    const metricsData = await metrics.getMetrics();
    res.set('Content-Type', metrics.contentType);
    res.send(metricsData);
  } catch (err) {
    logger.error(`Error al obtener métricas: ${err.message}`);
    res.status(500).send('Error interno al obtener métricas');
  }
});

// Inicio del servidor
app.listen(PORT, () => {
  logger.info(`Servicio de colonias felinas corriendo en http://localhost:${PORT}`);
});