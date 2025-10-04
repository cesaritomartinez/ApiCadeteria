// src/documentation/swagger-setup.js
const swaggerUi = require('swagger-ui-express');
const baseDoc = require('./swagger.json');

module.exports = (app) => {
  const buildDoc = (req) => {
    const proto = (req.headers['x-forwarded-proto'] || req.protocol).split(',')[0];
    const host = req.get('host');
    const doc = JSON.parse(JSON.stringify(baseDoc)); // clonar
    doc.servers = [{ url: `${proto}://${host}`, description: 'Current host' }];
    return doc;
  };

  const uiOpts = {
    explorer: true,
    customSiteTitle: 'API Cadetería',
    swaggerOptions: { persistAuthorization: true },
  };

  // 1) Servir assets de Swagger UI bajo /docs
  app.use('/docs', swaggerUi.serve);

  // 2) Página de Swagger UI con SPEC embebido (SIN fetch)
  //    También desactivamos caché para evitar que Vercel te muestre una versión vieja.
  app.get('/docs', (req, res) => {
    res.set('Cache-Control', 'no-store');
    const spec = buildDoc(req);
    const html = swaggerUi.generateHTML(spec, uiOpts);
    res.send(html);
  });

  // 3) (opcional) JSON para debug rápido
  app.get('/docs-json', (req, res) => {
    res.set('Cache-Control', 'no-store');
    res.json(buildDoc(req));
  });
};
