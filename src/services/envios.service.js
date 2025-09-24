const { StatusCodes } = require("http-status-codes");
const buildEnvioDTOResponse = require("../dtos/envio.response.dto");
const Envio = require("../models/envio.model");

const findEnvioById = async (envioId, userId) => {
  try {
    const envio = await findEnvioByIdInDB(envioId, userId);
    return buildEnvioDTOResponse(envio);
  } catch (error) {
    throw error;
  }
};

const getAllEnviosAdmin = async () => {
  try {
    const allEnviosDB = await Envio.find();
    let enviosResponse = allEnviosDB.map((envio) => {
      return buildEnvioDTOResponse(envio);
    });
    return enviosResponse;
  } catch (e) {
    console.log("Error obteniendo todos los envios", e);
    let error = new Error("error getting all envios");
    error.status = "internal_server_error";
    error.code = StatusCodes.INTERNAL_SERVER_ERROR;
    throw error;
  }
};

const getEnviosByUserId = async (userId) => {
  try {
    const userEnviosDB = await Envio.find({ user: userId });

    let enviosResponse = userEnviosDB.map((envio) => {
      return buildEnvioDTOResponse(envio);
    });

    return enviosResponse;
  } catch (e) {
    console.log("Error obteniendo envios del usuario", e);
    let error = new Error("error getting envios for user");
    error.status = "internal_server_error";
    error.code = StatusCodes.INTERNAL_SERVER_ERROR;
    throw error;
  }
};

const deleteEnvio = async (envioId, userId) => {
  try {
    const envio = await findEnvioByIdInDB(envioId, userId);
    await envio.deleteOne();
  } catch (error) {
    throw error;
  }
};

const createEnvio = async (envioData, userId) => {
  const newEnvio = new Envio({
    user: userId,
    origen: envioData.origen,
    destino: envioData.destino,
    fechaRetiro: envioData.fechaRetiro,
    horaRetiroAprox: envioData.horaRetiroAprox,
    tamanoPaquete: envioData.tamanoPaquete,
    notas: envioData.notas,
    categoria: envioData.categoria,
  });

  try {
    const savedEnvio = await newEnvio.save();
    return buildEnvioDTOResponse(savedEnvio);
  } catch (e) {
    console.log("error guardando envio en la base", e);
    let error = new Error("error saving envio in database");
    error.status = "internal_server_error";
    error.code = StatusCodes.INTERNAL_SERVER_ERROR;
    throw error;
  }
};

const updateEnvio = async (envioId, updateData, userId) => {
  try {
    const envio = await findEnvioByIdInDB(envioId, userId);

    Object.assign(envio, updateData);
    const updatedEnvio = await envio.save();
    return buildEnvioDTOResponse(updatedEnvio);
  } catch (error) {
    throw error;
  }
};

const findEnvioByIdInDB = async (envioId, userId) => {
  let envio;
  try {
    envio = await Envio.findById(envioId);
  } catch (e) {
    console.log("Error obteniendo el envio en la base", e);
    let error = new Error("error getting envio in database");
    (error.status = "internal_server_error"),
      (error.code = StatusCodes.INTERNAL_SERVER_ERROR);
    throw error;
  }

  if (!envio) {
    let error = new Error("envio was not found in database");
    (error.status = "not_found"), (error.code = StatusCodes.NOT_FOUND);
    throw error;
  }

  if (envio.user.toString() !== userId) {
    let error = new Error("not allowed to access this resource");
    (error.status = "forbidden"), (error.code = StatusCodes.FORBIDDEN);
    throw error;
  }
  return envio;
};

module.exports = {
  findEnvioById,
  getEnviosByUserId,
  getAllEnviosAdmin,
  deleteEnvio,
  createEnvio,
  updateEnvio,
};
