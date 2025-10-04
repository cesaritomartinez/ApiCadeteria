// src/documentation/swagger-setup.js
const swaggerUi = require('swagger-ui-express');
const baseDoc = require('./swagger.json');

module.exports = (app) => {
  const buildDoc = (req) => {
    const proto = (req.headers['x-forwarded-proto'] || req.protocol).split(',')[0];
    const host = req.get('host');
    const doc = JSON.parse(JSON.stringify(baseDoc)); // clonar
    // Forzar server actual (evita mixed-content y dominios viejos)
    doc.servers = [{ url: `${proto}://${host}`, description: 'Current host' }];
    return doc;
  };

  const uiOpts = {
    explorer: true,
    customSiteTitle: 'API Cadetería',
    swaggerOptions: { persistAuthorization: true },
  };

  // 1) servir assets estáticos de swagger (CSS/JS)
  app.use('/swagger', swaggerUi.serve);

  // 2) página de Swagger UI con el SPEC embebido (SIN fetch a /swagger.json)
  app.get('/swagger', (req, res) => {
    const spec = buildDoc(req);
    const html = swaggerUi.generateHTML(spec, uiOpts);
    res.send(html);
  });

  // 3) endpoint de JSON para debug (opcional)
  app.get('/swagger-json', (req, res) => res.json(buildDoc(req)));
};
