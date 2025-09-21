const createEnvioSchema = require("../validators/create.envio.schema");
const { createError } = require("../utils/error");
const { StatusCodes } = require("http-status-codes");
const enviosService = require("../services/envios.service");

const registerEnvio = async (req, res) => {
  const { body } = req;

  if (!body) {
    res
      .status(StatusCodes.BAD_REQUEST)
      .json(createError("bad_request", "Invalid body"));
    return;
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
    const newEnvio = await enviosService.createEnvio(body, req.userId);
    res.status(StatusCodes.CREATED).json(newEnvio);
  } catch (error) {
    res
      .status(error.code || StatusCodes.INTERNAL_SERVER_ERROR)
      .json(createError(error.status || "internal_server_error", error.message));
  }
};

const getAllEnvios = async (req, res) => {
  try {
    let envios;

    // Si es admin, mostrar todos los envíos (implementar lógica admin después)
    // Por ahora, solo los envíos del usuario
    envios = await enviosService.getEnviosByUserId(req.userId);

    res.status(StatusCodes.OK).json(envios);
  } catch (error) {
    res
      .status(error.code || StatusCodes.INTERNAL_SERVER_ERROR)
      .json(createError(error.status || "internal_server_error", error.message));
  }
};

const getEnvioById = async (req, res) => {
  const envioId = req.params.id;

  try {
    const envio = await enviosService.findEnvioById(envioId, req.userId);
    res.status(StatusCodes.OK).json(envio);
  } catch (error) {
    res
      .status(error.code || StatusCodes.INTERNAL_SERVER_ERROR)
      .json(createError(error.status || "internal_server_error", error.message));
  }
};

const deleteEnvio = async (req, res) => {
  const envioId = req.params.id;

  try {
    await enviosService.deleteEnvio(envioId, req.userId);
    res.status(StatusCodes.NO_CONTENT).send();
  } catch (error) {
    res
      .status(error.code || StatusCodes.INTERNAL_SERVER_ERROR)
      .json(createError(error.status || "internal_server_error", error.message));
  }
};

const updateEnvio = async (req, res) => {
  const envioId = req.params.id;
  const { body } = req;

  if (!body || Object.keys(body).length === 0) {
    res
      .status(StatusCodes.BAD_REQUEST)
      .json(createError("bad_request", "Must provide at least one field to update"));
    return;
  }

  try {
    const updatedEnvio = await enviosService.updateEnvio(envioId, body, req.userId);
    res.status(StatusCodes.OK).json(updatedEnvio);
  } catch (error) {
    res
      .status(error.code || StatusCodes.INTERNAL_SERVER_ERROR)
      .json(createError(error.status || "internal_server_error", error.message));
  }
};

module.exports = {
  registerEnvio,
  getAllEnvios,
  getEnvioById,
  deleteEnvio,
  updateEnvio,
};
