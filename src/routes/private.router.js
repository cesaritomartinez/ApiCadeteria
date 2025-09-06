const express = require("express");
const { StatusCodes } = require("http-status-codes");
const router = express.Router();
const { envios } = require("../models/bd");
const { getISODate } = require("../utils/date");
const { authMiddleware } = require("../../middlewares/auth.middleware");
const { envioSchema } = require("../validators/schemas");

// Aplicar middleware de autenticación a todas las rutas privadas
router.use(authMiddleware);

// Endpoint para agregar un nuevo env�o
router.post("/envios", (req, res) => {
  if (!req.body) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      error: "El body de la solicitud no puede estar vacío",
    });
  }

  // Validar con Joi
  const { error } = envioSchema.validate(req.body);

  if (error) {
    console.log(error);
    const errorMessage = error.details[0].message;
    return res.status(StatusCodes.BAD_REQUEST).json({
      error: "bad_request",
      message: errorMessage,
    });
  }

  const {
    clienteId,
    origen,
    destino,
    fechaRetiro,
    horaRetiroAprox,
    tamanoPaquete,
    notas,
    categoria,
  } = req.body;

  // Crear nuevo envío
  const nuevoEnvio = {
    enviosId: envios.length > 0 ? envios[envios.length - 1].enviosId + 1 : 1,
    clienteId,
    origen,
    destino,
    fechaRetiro,
    horaRetiroAprox: horaRetiroAprox || "Sin especificar",
    tamanoPaquete,
    notas: notas || "",
    categoria: categoria || { nombre: "General", descripcion: "Envio general" },
    estado: "pendiente",
    creadoEn: getISODate(),
  };

  // Agregar a la lista de envíos
  envios.push(nuevoEnvio);

  // Respuesta exitosa
  res.status(StatusCodes.CREATED).json({
    message: "Envio creado exitosamente",
    envio: nuevoEnvio,
  });
});

module.exports = router;
