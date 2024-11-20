const client = require('prom-client');

const requestCounter = new client.Counter({
  name: 'http_requests_total',
  help: 'Total de solicitudes HTTP recibidas',
  labelNames: ['method', 'route'],
});

const incrementRequestCount = (route) => {
  requestCounter.inc({ method: 'GET', route });
};

module.exports = {
  contentType: client.register.contentType,
  getMetrics: client.register.metrics,
  incrementRequestCount,
};
