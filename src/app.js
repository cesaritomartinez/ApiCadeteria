const express = require("express");
const app = express();

const publicRouter = require("./routes/public.router");
const privateRouter = require("./routes/private.router");

app.use(express.json());

// Rutas públicas
app.use(publicRouter);
// Middleware de autenticación
//...

// Rutas privadas
app.use("/v1", privateRouter);

// Ruta 404
// app.use('*', (req, res) => {
//   res.status(StatusCodes.NOT_FOUND).json({
//     error: 'Ruta no encontrada',
//     path: req.originalUrl
//   });
// });

app.listen(3000, () => {
  console.log("Api escuchando en el puerto 3000");
});
