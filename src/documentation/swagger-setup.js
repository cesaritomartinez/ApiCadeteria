const swaggerDocument = require("./swagger.json");

module.exports = (app) => {
  // Servir el JSON
  app.get("/docs/swagger.json", (req, res) => {
    res.json(swaggerDocument);
  });

  // Servir HTML estático con Swagger UI desde CDN
  app.get("/docs", (req, res) => {
    const html = `
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <title>API Cadetería - Documentación</title>
  <link rel="stylesheet" href="https://unpkg.com/swagger-ui-dist@5.10.5/swagger-ui.css" />
</head>
<body>
  <div id="swagger-ui"></div>
  <script src="https://unpkg.com/swagger-ui-dist@5.10.5/swagger-ui-bundle.js"></script>
  <script src="https://unpkg.com/swagger-ui-dist@5.10.5/swagger-ui-standalone-preset.js"></script>
  <script>
    window.onload = function() {
      window.ui = SwaggerUIBundle({
        url: "/docs/swagger.json",
        dom_id: '#swagger-ui',
        presets: [
          SwaggerUIBundle.presets.apis,
          SwaggerUIStandalonePreset
        ],
        layout: "StandaloneLayout",
        deepLinking: true,
        persistAuthorization: true
      });
    };
  </script>
</body>
</html>`;
    res.send(html);
  });
};
