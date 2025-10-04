// src/documentation/swagger-setup.js
const baseDoc = require('./swagger.json');

module.exports = (app) => {
  const buildDoc = (req) => {
    const proto = (req.headers['x-forwarded-proto'] || req.protocol).split(',')[0];
    const host = req.get('host');
    const doc = JSON.parse(JSON.stringify(baseDoc));
    doc.servers = [{ url: `${proto}://${host}`, description: 'Current host' }];
    return doc;
  };

  // JSON para debug (lo mantenemos)
  app.get('/docs-json', (req, res) => {
    res.set('Cache-Control', 'no-store');
    res.json(buildDoc(req));
  });

  // UI de Swagger usando assets del CDN (¡sin servir nada local!)
  app.get('/docs', (req, res) => {
    res.set('Cache-Control', 'no-store');
    const spec = buildDoc(req);
    const specString = JSON.stringify(spec); // embebemos el spec (sin fetch)
    res.send(`<!doctype html>
<html>
<head>
  <meta charset="utf-8" />
  <title>API Cadetería</title>
  <link rel="stylesheet" href="https://unpkg.com/swagger-ui-dist/swagger-ui.css" />
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <style>body { margin: 0; }</style>
</head>
<body>
  <div id="swagger-ui"></div>
  <script>
    window.__SPEC__ = ${specString};
  </script>
  <script src="https://unpkg.com/swagger-ui-dist/swagger-ui-bundle.js"></script>
  <script src="https://unpkg.com/swagger-ui-dist/swagger-ui-standalone-preset.js"></script>
  <script>
    window.addEventListener('load', () => {
      window.ui = SwaggerUIBundle({
        spec: window.__SPEC__,                // 👈 usamos el spec embebido (sin fetch)
        dom_id: '#swagger-ui',
        presets: [SwaggerUIBundle.presets.apis, SwaggerUIStandalonePreset],
        layout: "BaseLayout",
        persistAuthorization: true
      });
    });
  </script>
</body>
</html>`);
  });
};
