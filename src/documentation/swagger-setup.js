const swaggerUi = require("swagger-ui-express");
const swaggerDocument = require("./swagger.json");

const customHtml = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>API Cadetería - Documentation</title>
    <link rel="stylesheet" type="text/css" href="./swagger-ui.css">
    <style>
        html { box-sizing: border-box; overflow: -moz-scrollbars-vertical; overflow-y: scroll; }
        *, *:before, *:after { box-sizing: inherit; }
        body { margin:0; padding:0; }
    </style>
</head>
<body>
    <div id="swagger-ui"></div>
    <script src="./swagger-ui-bundle.js"></script>
    <script src="./swagger-ui-standalone-preset.js"></script>
    <script>
        window.onload = function() {
            const ui = SwaggerUIBundle({
                spec: ${JSON.stringify(swaggerDocument)},
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
                persistAuthorization: true,
                onComplete: function() {
                    // Intentar cargar el token guardado
                    const savedToken = localStorage.getItem('swagger_auth_token');
                    if (savedToken) {
                        ui.preauthorizeApiKey('bearerAuth', savedToken);
                    }
                },
                responseInterceptor: function(response) {
                    // Interceptar respuesta del login
                    if (response.url.includes('/loginReal') && response.status === 200) {
                        try {
                            const data = JSON.parse(response.text);
                            if (data.token && data.token.token) {
                                const token = data.token.token;
                                // Guardar en localStorage
                                localStorage.setItem('swagger_auth_token', token);
                                // Autorizar automáticamente
                                ui.preauthorizeApiKey('bearerAuth', token);
                                console.log('✅ Token guardado y autorizado automáticamente');
                            }
                        } catch (e) {
                            console.error('Error al procesar respuesta de login:', e);
                        }
                    }
                    return response;
                }
            });

            window.ui = ui;
        };
    </script>
</body>
</html>
`;

const setupSwagger = (app) => {
  app.use(
    "/docs",
    swaggerUi.serveFiles(swaggerDocument, {}),
    (req, res) => {
      res.send(customHtml);
    }
  );
};

module.exports = setupSwagger;
