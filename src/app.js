const express = require("express");
const app = express();
const { StatusCodes } = require("http-status-codes");

const publicRouter = require("./routes/public.router");
const privateRouter = require("./routes/private.router");

app.use(express.json());

// Rutas públicas
app.use(publicRouter);
// Rutas privadas + middleware de autenticación dentro
app.use("/v1", privateRouter);

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

app.listen(3000, () => {
  console.log("Api escuchando en el puerto 3000");
});
