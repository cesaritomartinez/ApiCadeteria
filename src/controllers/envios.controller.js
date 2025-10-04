const createEnvioSchema = require("../validators/create.envio.schema");
const updateEnvioSchema = require("../validators/update.envio.schema");
const { createError } = require("../utils/error");
const { StatusCodes } = require("http-status-codes");
const enviosService = require("../services/envios.service");
const usersService = require("../services/users.service");
const User = require("../models/user.model");


const registerEnvio = async (req, res) => {
  const { body } = req;

  if (!body) {
    res
      .status(StatusCodes.BAD_REQUEST)
      .json(createError("bad_request", "Invalid body"));
    return;
  }

  //  Normalizar alias y tipos ANTES de validar
  if (body?.categoria && !body.category && !body.categoryId) {
    const c = body.categoria;
    body.category =
      (typeof c === "object")
        ? String(c.nombre || "").trim()
        : String(c || "").trim();
    delete body.categoria; // evita que Joi la rechace
  }

  // Si viene "category" como objeto { nombre, ... } -> convierte a string
  if (body?.category && typeof body.category === "object") {
    body.category = String(body.category.nombre || "").trim();
  }

  const { error } = createEnvioSchema.validate(body);

  if (error) {
    const errorMessage = error.details[0].message;
    res
      .status(StatusCodes.BAD_REQUEST)
      .json(createError("bad_request", errorMessage));
    return;
  }

  try {
        // plan del usuario (default: plus)
      const user = await User.findById(req.userId);
      if (!user) {
      return res
        .status(StatusCodes.UNAUTHORIZED)
        .json(createError("unauthorized", "Usuario no encontrado"));
    }

      let plan = 'plus';
      if (user && user.plan) {
        plan = String(user.plan).toLowerCase();
      }

      if (plan === 'plus') {
      const pendientes = await enviosService.countPendientesByUser(req.userId);
      // si ya tiene 10 pendientes, NO crear (el nuevo no cuenta porque todavía no existe)
      if (pendientes >= process.env.MAX_PLAN_PLUS) {
        return res
          .status(StatusCodes.FORBIDDEN)
          .json(createError(
            "forbidden",
            `Límite alcanzado: máximo ${process.env.MAX_PLAN_PLUS} envíos pendientes para el plan PLUS`
          ));
      }
    }

    const newEnvio = await enviosService.createEnvio(body, req.userId);
    res.status(StatusCodes.CREATED).json(newEnvio);
  } catch (error) {
    res
      .status(error.code || StatusCodes.INTERNAL_SERVER_ERROR)
      .json(
        createError(error.status || "internal_server_error", error.message)
      );
  }
};

const getAllEnvios = async (req, res) => {
  try {
    let envios;
    let filtros = req.query;
    let enviosFiltrados;

    // Si es admin, mostrar todos los envíos (implementar lógica admin después)
    // Por ahora, solo los envíos del usuario

    if (req.userRole === "admin") {
      envios = await enviosService.getAllEnviosAdmin(filtros);
    } else {
      envios = await enviosService.getEnviosByUserId(req.userId, req.query);
    }

    //enviosFiltrados = enviosService.filtrarEnvios(envios, filtros);
    console.log("Envios filtrados", enviosFiltrados);

    res.status(StatusCodes.OK).json(envios);
  } catch (error) {
    res
      .status(error.code || StatusCodes.INTERNAL_SERVER_ERROR)
      .json(
        createError(error.status || "internal_server_error", error.message)
      );
  }
};

const getEnvioById = async (req, res) => {
  const envioId = req.params.id;
  const { userId, userRole } = req;

  try {
    const envio = await enviosService.findEnvioById(envioId, userId, userRole);
    res.status(StatusCodes.OK).json(envio);
  } catch (error) {
    res
      .status(error.code || StatusCodes.INTERNAL_SERVER_ERROR)
      .json(
        createError(error.status || "internal_server_error", error.message)
      );
  }
};

const deleteEnvio = async (req, res) => {
  const envioId = req.params.id;
  const { userId, userRole } = req;

  try {
    await enviosService.deleteEnvio(envioId, userId, userRole);
    res.status(StatusCodes.NO_CONTENT).send();
  } catch (error) {
    res
      .status(error.code || StatusCodes.INTERNAL_SERVER_ERROR)
      .json(
        createError(error.status || "internal_server_error", error.message)
      );
  }
};

const updateEnvio = async (req, res) => {
  const envioId = req.params.id;
  const { body } = req;

  // Validar con Joi
  const { error, value } = updateEnvioSchema.validate(body);
  if (error) {
    const errorMessage = error.details[0].message;
    res
      .status(StatusCodes.BAD_REQUEST)
      .json(createError("bad_request", errorMessage));
    return;
  }

  try {
    const { userId, userRole } = req;
    const updatedEnvio = await enviosService.updateEnvio(
      envioId,
      value,
      userId,
      userRole
    );
    res.status(StatusCodes.OK).json(updatedEnvio);
  } catch (error) {
    res
      .status(error.code || StatusCodes.INTERNAL_SERVER_ERROR)
      .json(
        createError(error.status || "internal_server_error", error.message)
      );
  }
};

module.exports = {
  registerEnvio,
  getAllEnvios,
  getEnvioById,
  deleteEnvio,
  updateEnvio,
};
