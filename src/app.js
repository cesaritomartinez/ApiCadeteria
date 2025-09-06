const express = require('express');
const app = express();
const StatusCodes = require('http-status-codes');
const publicRouter = require('./routes/public.router');

app.use(express.json());
app.use(publicRouter)




// Ruta 404
// app.use('*', (req, res) => {
//   res.status(StatusCodes.NOT_FOUND).json({
//     error: 'Ruta no encontrada',
//     path: req.originalUrl
//   });
// });

app.listen(3000 , () => {
    console.log('Servidor en ejecucion en http://localhost:300');
})


