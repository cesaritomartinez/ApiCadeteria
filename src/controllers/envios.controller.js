const { envioSchema } = require("../validators/schemas");
const { createError } = require("../utils/error");
const { StatusCodes } = require("http-status-codes");
const { envios, findEnvioById, createEnvio, deleteEnvioById } = require("../models/bd");
const { getISODate } = require("../utils/date");

const registerEnvio = (req, res) => {
  if (!req.body) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json(
        createError(
          "bad_request",
          "El body de la solicitud no puede estar vacío"
        )
      );
  }

  // Validar con Joi
  const { error } = envioSchema.validate(req.body);

  if (error) {
    console.log(error);
    const errorMessage = error.details[0].message;
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json(createError("bad_request", errorMessage));
  }

  const {
    userId,
    origen,
    destino,
    fechaRetiro,
    horaRetiroAprox,
    tamanoPaquete,
    notas,
    categoria,
  } = req.body;

  // Crear nuevo envío
  const envio = createEnvio(
    userId,
    origen,
    destino,
    fechaRetiro,
    horaRetiroAprox,
    tamanoPaquete,
    notas,
    categoria
  );

  // Respuesta exitosa
  res.status(StatusCodes.CREATED).json({
    message: "Envio creado exitosamente",
    envio,
  });
};

const getAllEnvios = (req, res) => {
  if (envios.length === 0) {
    return res
      .status(StatusCodes.NOT_FOUND)
      .json(createError("not_found", "No se encontraron envíos"));
  }

  return res.status(StatusCodes.OK).json({
    envios,
  });
};

const getEnvioById = (req, res) => {
  const { id } = req.params;

  if (isNaN(id)) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json(createError("bad_request", "ID inválido"));
  }

  // const envio = envios.find((envios) => envios.envioId === Number(id));
  const envio = findEnvioById(id);
  console.log(envio);

  if (!envio || envio.length === 0) {
    return res
      .status(StatusCodes.NOT_FOUND)
      .json(createError("not_found", "Envio no encontrado"));
  }

  return res.status(StatusCodes.OK).json({
    envio,
  });
};

const deleteEnvio = (req, res) => {
  const { id } = req.params;

  if (isNaN(id)) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json(createError("bad_request", "ID inválido"));
  }

  const envio = findEnvioById(id);

  console.log("antes", envios.length);

  deleteEnvioById(id);

  console.log("despues", envios.length);

  if (!envio || envio.length === 0) {
    return res
      .status(StatusCodes.NOT_FOUND)
      .json(createError("not_found", "Envio no encontrado"));
  }

  return res.status(StatusCodes.OK).json({
    envio,
  });
};

module.exports = { registerEnvio, getAllEnvios, getEnvioById, deleteEnvio };
