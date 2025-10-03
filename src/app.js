const express = require("express");
const app = express();
const { StatusCodes } = require("http-status-codes");
require("dotenv").config();

const publicRouter = require("./routes/public.router");
const privateRouter = require("./routes/private.router");
const loginRouter = require("./routes/login.router");
const signupRouter = require("./routes/signup.router");
const connectMongoDB = require("./repositories/mongo.client");

app.use(express.json());


// Rutas públicas
app.use("/public/v1", signupRouter);
app.use("/public/v1", loginRouter);
app.use(publicRouter);
// Rutas privadas + middleware de autenticación dentro
app.use("/v1", privateRouter);




// --- Swagger: montar explícito en /docs y /api/docs ---
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./documentation/swagger.json');

// /docs
app.use('/docs', swaggerUi.serve);
app.get('/docs', swaggerUi.setup(swaggerDocument));
app.get('/docs/swagger.json', (_req, res) => res.json(swaggerDocument));

// /api/docs (útil en Vercel si el handler vive bajo /api)
app.use('/api/docs', swaggerUi.serve);
app.get('/api/docs', swaggerUi.setup(swaggerDocument));
app.get('/api/docs/swagger.json', (_req, res) => res.json(swaggerDocument));



// 404 Not Found
app.use((req, res) => {
  res.status(StatusCodes.NOT_FOUND).json({
    error: "Ruta no encontrada",
    path: req.originalUrl,
  });
});

// Errores 500 - Internal Server Error
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    error: "Error interno del servidor",
    message: err.message,
  });
});

(async () => {
  try {
    await connectMongoDB();
    console.log("conexión mongoDB ok");

    const port = process.env.PORT;
    app.listen(port, () => {
      console.log("App started and listening in port " + port);
    });
  } catch (error) {
    console.log("Error conectando con mongoDB", error);
    process.exit(1);
  }
})();

module.exports = app;
