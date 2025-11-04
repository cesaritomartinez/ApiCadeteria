const express = require("express");
const cors = require("cors")
const app = express();
const { StatusCodes } = require("http-status-codes");
const setupSwagger = require("./documentation/swagger-setup");
require("dotenv").config();

const publicRouter = require("./routes/public.router");
const privateRouter = require("./routes/private.router");
const loginRouter = require("./routes/login.router");
const signupRouter = require("./routes/signup.router");

const connectMongoDB = require("./repositories/mongo.client");

// CORS - ANTES DE TODO
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }
  next();
});

app.use(express.json());

// Middleware para garantizar conexión a MongoDB en TODAS las requests
// Esto es crucial para Vercel donde cada request puede ser en una instancia nueva
app.use(async (req, res, next) => {
  try {
    await connectMongoDB();
    next();
  } catch (error) {
    console.error("Error conectando a MongoDB:", error.message);
    res.status(503).json({
      error: "Servicio no disponible",
      message: "No se pudo conectar a la base de datos",
    });
  }
});

// Swagger documentation (ANTES de todo para que funcione en Vercel)
setupSwagger(app);

// Rutas públicas
app.use("/public/v1", signupRouter);
app.use("/public/v1", loginRouter);
app.use(publicRouter);

// Rutas privadas + middleware de autenticación dentro
app.use("/v1", privateRouter);

// 404 Not Found (SIEMPRE al final)
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

// Arranque del servidor
if (process.env.NODE_ENV !== 'production') {
  const port = process.env.PORT || 3006;

  // En desarrollo, conectar ANTES de iniciar el servidor
  connectMongoDB()
    .then(() => {
      console.log("✅ MongoDB conectado");
      app.listen(port, () => {
        console.log(`🚀 Servidor escuchando en puerto ${port}`);
      });
    })
    .catch((error) => {
      console.error("❌ Error fatal conectando a MongoDB:", error.message);
      console.error("Stack:", error.stack);
      process.exit(1);
    });
}
// En producción (Vercel), el middleware maneja la conexión automáticamente con caché

// Exportar para Vercel (serverless)
module.exports = app;
