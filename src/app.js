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

// Swagger documentation (ANTES de todo para que funcione en Vercel)
setupSwagger(app);

// CORS
const allowedOrigins = [
  "http://localhost:5173",
  "https://apicadeteria-oiruptoqe-sanei1509s-projects.vercel.app",
  "https://apicadeteria-m0l7xry84-cesars-projects-2539e6a6.vercel.app",
  // Agrega aquí otros orígenes permitidos
];

app.use(cors({
  origin: (origin, callback) => {
    // Permitir requests sin origin (como desde Postman o apps móviles)
    if (!origin) return callback(null, true);

    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("No permitido por CORS"));
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Origin", "X-Requested-With", "Content-Type", "Accept", "Authorization"]
}));




app.use(express.json());

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

// Conexión a MongoDB
connectMongoDB().catch(console.error);

// Arranque del servidor (solo en desarrollo local, no en Vercel)
if (process.env.NODE_ENV !== 'production') {
  const port = process.env.PORT || 3006;
  app.listen(port, () => {
    console.log("App started and listening in port " + port);
  });
}

// Exportar para Vercel (serverless)
module.exports = app;
