const { envioSchema } = require("../validators/schemas");
const { createError } = require("../utils/error");
const { StatusCodes } = require("http-status-codes");
const {
  envios,
  findEnvioById,
  createEnvio,
  deleteEnvioById,
  updateEnvioService
} = require("../models/bd");
const { getISODate } = require("../utils/date");
const { parseToDate } = require("../utils/date");
const { shouldBlockCancellation } = require("../utils/date");
const { startOfDay } = require("../utils/date");

const registerEnvio = (req, res) => {

  const authUserId = req.userId; // capturo el userId del token

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
    // userId,
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
    authUserId,
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
  let enviosFiltrados;

  // Si es admin, mostrar todos los envíos
  if (req.userRole === "admin") {
    enviosFiltrados = envios;
  } else {
    // Si es cliente, mostrar solo sus envíos
    enviosFiltrados = envios.filter(envio => envio.userId === req.userId);
  }

  if (enviosFiltrados.length === 0) {
    return res
      .status(StatusCodes.NOT_FOUND)
      .json(createError("not_found", "No se encontraron envíos"));
  }

  return res.status(StatusCodes.OK).json({
    envios: enviosFiltrados,
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

  const role = (req.userRole);
  const requesterId = (Number(req.userId));

  if (role !== "admin" && envio.userId !== requesterId) {
    return res
      .status(StatusCodes.FORBIDDEN)
      .json(createError("forbidden", "No tenés permisos para ver este envío"));
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

  // buscar envio a borrar
  const envio = findEnvioById(id);
  if (!envio) {
    return res
      .status(StatusCodes.NOT_FOUND)
      .json(createError("not_found", "Envio no encontrado"));
  }

  //  permisos: admin borra todo; cliente solo si es suyo
  const role = String(req.userRole);
  const requesterId = Number(req.userId);
  if (role !== "admin" && envio.userId !== requesterId) {
    return res
      .status(StatusCodes.FORBIDDEN)
      .json(createError("forbidden", "No tenés permisos para eliminar este envío"));
  }

  // regla para clientes: solo antes del día de retiro (no el mismo día)
   if (role !== "admin") {
    const block = shouldBlockCancellation(envio.fechaRetiro);
    if (block === null) {
      // Fecha con formato inválido almacenada en el envío
      return res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json(createError("server_error", "Fecha de retiro inválida en el envío"));
    }

    if (block) {
      return res
        .status(StatusCodes.CONFLICT)
        .json(
          createError(
            "conflict",
            "No podés cancelar el envío el día del retiro o posteriormente"
          )
        );
    }
  }



  

  console.log("antes", envios.length);

  // deleteEnvioById(id);

  console.log("despues", envios.length);

  const ok = deleteEnvioById(id);
  if (!ok) {
    return res
      .status(StatusCodes.NOT_FOUND)
      .json(createError("not_found", "Envio no encontrado"));
  }

  return res.status(StatusCodes.NO_CONTENT).end(); // 204 sin body
};


const updateEnvio = (req, res) => {
  const envioId = Number(req.params.id);

  if (isNaN(envioId)) {
    res
      .status(StatusCodes.BAD_REQUEST)
      .json(createError("bad_request", "ID must be a number"));
    return;
  }

   // Buscar primeroel envio que vamos a modificar
  const envioActual = findEnvioById(envioId);
  if (!envioActual) {
    return res
      .status(StatusCodes.NOT_FOUND)
      .json(createError("not_found", "Envio no encontrado"));
  }

  // Autorización: admin puede todo; cliente solo si es suyo
  const role = String(req.userRole);
  const requesterId = Number(req.userId);
  if (role !== "admin" && envioActual.userId !== requesterId) {
    return res
      .status(StatusCodes.FORBIDDEN)
      .json(createError("forbidden", "No tenés permisos para modificar este envío"));
  }



  const { fechaRetiro, horaRetiroAprox, notas, estado } = req.body;

  if (
    [fechaRetiro, horaRetiroAprox, notas, estado].every((v) => v === undefined)
  ) {
    res
      .status(StatusCodes.BAD_REQUEST)
      .json(
        createError(
          "bad_request",
          "You must send at least one property: fechaRetiro, horaRetiroAprox, notas, or estado."
        )
      );
    return;
  }

 

  const envioUpdated = updateEnvioService(
    envioId,
    fechaRetiro,
    horaRetiroAprox,
    notas,
    estado
  );

  if (!envioUpdated) {
    res
      .status(StatusCodes.NOT_FOUND)
      .json(createError("not_found", `Envio with ID ${envioId} not found`));
    return;
  }

  if (envioUpdated.error) {
    // por si la service devuelve errores de validación
    res
      .status(StatusCodes.BAD_REQUEST)
      .json(createError("bad_request", envioUpdated.messages.join("; ")));
    return;
  }

  return res.status(StatusCodes.OK).json(envioUpdated);
};

module.exports = {
  registerEnvio,
  getAllEnvios,
  getEnvioById,
  deleteEnvio,
  updateEnvio,
};
