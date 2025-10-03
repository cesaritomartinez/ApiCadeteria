const swaggerDocument = require("./swagger.json");
const path = require("path");

const setupSwagger = (app) => {
  console.log("setupSwagger called - registering /docs and /swagger.json routes");

  // Servir el JSON de Swagger
  app.get("/swagger.json", (req, res) => {
    console.log("GET /swagger.json");
    res.setHeader("Content-Type", "application/json");
    res.send(swaggerDocument);
  });

  // Servir Swagger UI con CDN (compatible con Vercel)
  app.get("/docs", (req, res) => {
    console.log("GET /docs");
    const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>API Cadetería - Documentation</title>
  <link rel="stylesheet" href="https://unpkg.com/swagger-ui-dist@5.9.0/swagger-ui.css">
  <style>
    body { margin: 0; padding: 0; }
  </style>
</head>
<body>
  <div id="swagger-ui"></div>
  <script src="https://unpkg.com/swagger-ui-dist@5.9.0/swagger-ui-bundle.js"></script>
  <script src="https://unpkg.com/swagger-ui-dist@5.9.0/swagger-ui-standalone-preset.js"></script>
  <script>
    window.onload = function() {
      const ui = SwaggerUIBundle({
        url: window.location.origin + "/swagger.json",
        dom_id: '#swagger-ui',
        deepLinking: true,
        presets: [
          SwaggerUIBundle.presets.apis,
          SwaggerUIStandalonePreset
        ],
        plugins: [
          SwaggerUIBundle.plugins.DownloadUrl
        ],
        layout: "StandaloneLayout",
        persistAuthorization: true
      });
      window.ui = ui;
    };
  </script>
</body>
</html>`;
    res.send(html);
  });
};

module.exports = setupSwagger;
