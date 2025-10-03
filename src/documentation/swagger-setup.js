// src/documentation/swagger-setup.js
const swaggerUi = require('swagger-ui-express');
const baseDoc = require('./swagger.json');

module.exports = (app) => {
  const buildDoc = (req) => {
    // En Vercel el protocolo real viene en x-forwarded-proto
    const proto = (req.headers['x-forwarded-proto'] || req.protocol).split(',')[0];
    const host = req.get('host');

    const doc = JSON.parse(JSON.stringify(baseDoc));
    doc.servers = [{ url: `${proto}://${host}`, description: 'Current host' }];
    return doc;
  };

  // JSON crudo (útil para probar)
  app.get('/docs/swagger.json', (req, res) => {
    res.json(buildDoc(req));
  });

  // Swagger UI
  app.use('/docs', (req, res, next) => {
    const doc = buildDoc(req);
    return swaggerUi.serve(req, res, () =>
      swaggerUi.setup(doc, {
        explorer: true,
        swaggerOptions: { persistAuthorization: true },
      })(req, res, next)
    );
  });
};
