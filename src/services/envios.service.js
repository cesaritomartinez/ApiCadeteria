const { StatusCodes } = require("http-status-codes");
const buildEnvioDTOResponse = require("../dtos/envio.response.dto");
const Envio = require("../models/envio.model");

const findEnvioById = async (envioId, userId, userRole = "cliente") => {
  try {
    const envio = await findEnvioByIdInDB(envioId, userId, userRole);
    return buildEnvioDTOResponse(envio);
  } catch (error) {
    throw error;
  }
};

const getAllEnviosAdmin = async (queryParams = {}) => {
  try {
    const query = {};

    // Filtros simples
    if (queryParams.estado) {
      query.estado = queryParams.estado;
    }
    if (queryParams.tamanoPaquete) {
      // 'chico' | 'mediano' | 'grande'
      query.tamanoPaquete = String(queryParams.tamanoPaquete)
        .trim()
        .toLowerCase();
    }

    // Fechas
    if (queryParams.fecha) {
      query.fechaRetiro = new Date(queryParams.fecha); // 'YYYY-MM-DD'
    } else if (
      queryParams.fechaDesde ||
      queryParams.startDate ||
      queryParams.fechaHasta ||
      queryParams.endDate
    ) {
      const start = queryParams.fechaDesde || queryParams.startDate;
      const end = queryParams.fechaHasta || queryParams.endDate;

      query.fechaRetiro = {};
      if (start) query.fechaRetiro.$gte = new Date(start);
      if (end) query.fechaRetiro.$lte = new Date(end);
    } else {
      const ultimos = String(
        queryParams.ultimos || queryParams.periodo || ""
      ).toLowerCase();

      if (ultimos === "semana") {
        const hoy = new Date();
        hoy.setUTCHours(0, 0, 0, 0);
        const hace7 = new Date(hoy);
        hace7.setUTCDate(hoy.getUTCDate() - 7);
        const finHoy = new Date(hoy);
        finHoy.setUTCHours(23, 59, 59, 999);
        query.fechaRetiro = { $gte: hace7, $lte: finHoy };
      } else if (ultimos === "mes") {
        const hoy = new Date();
        hoy.setUTCHours(0, 0, 0, 0);
        const hace30 = new Date(hoy);
        hace30.setUTCDate(hoy.getUTCDate() - 30);
        const finHoy = new Date(hoy);
        finHoy.setUTCHours(23, 59, 59, 999);
        query.fechaRetiro = { $gte: hace30, $lte: finHoy };
      }
    }

    const allEnviosDB = await Envio.find(query).sort({
      fechaRetiro: 1,
      createdAt: -1,
    });

    return allEnviosDB.map(buildEnvioDTOResponse);
  } catch (e) {
    console.log("Error obteniendo todos los envios (admin)", e);
    const error = new Error("error getting all envios");
    error.status = "internal_server_error";
    error.code = StatusCodes.INTERNAL_SERVER_ERROR;
    throw error;
  }
};

// const getEnviosByUserId = async (userId, queryParams) => {
//   try {
//     console.log("🔍 Buscando envíos para userId:", userId);
//     const userEnviosDB = await Envio.find({ user: userId });
//     console.log("📦 Envíos encontrados en DB:", userEnviosDB.length);

//     let enviosResponse = userEnviosDB.map((envio) => {
//       return buildEnvioDTOResponse(envio);
//     });

//     console.log("✅ Envíos después del DTO:", enviosResponse.length);
//     return enviosResponse;
//   } catch (e) {
//     console.log("Error obteniendo envios del usuario", e);
//     let error = new Error("error getting envios for user");
//     error.status = "internal_server_error";
//     error.code = StatusCodes.INTERNAL_SERVER_ERROR;
//     throw error;
//   }
// };

const getEnviosByUserId = async (userId, queryParams = {}) => {
  try {
    let query = { user: userId };

    // filtros simples
    if (queryParams.estado) {
      query.estado = queryParams.estado;
    }
    if (queryParams.tamanoPaquete) {
      query.tamanoPaquete = queryParams.tamanoPaquete; // 'chico' | 'mediano' | 'grande'
    }

    // ---- FECHAS ----
    // 1) fecha puntual (esperado: 'YYYY-MM-DD')
    if (queryParams.fecha) {
      query.fechaRetiro = new Date(queryParams.fecha);
    } else if (
      queryParams.fechaDesde ||
      queryParams.startDate ||
      queryParams.fechaHasta ||
      queryParams.endDate
    ) {
      // 2) rango: fechaDesde/fechaHasta (compat con startDate/endDate)
      const start = queryParams.fechaDesde || queryParams.startDate;
      const end = queryParams.fechaHasta || queryParams.endDate;

      query.fechaRetiro = {};
      if (start) query.fechaRetiro.$gte = new Date(start);
      if (end) query.fechaRetiro.$lte = new Date(end);
    } else {
      const ultimos = String(
        queryParams.ultimos || queryParams.periodo || ""
      ).toLowerCase();

      if (ultimos === "semana") {
        const hoy = new Date();
        hoy.setUTCHours(0, 0, 0, 0);
        const hace7 = new Date(hoy);
        hace7.setUTCDate(hoy.getUTCDate() - 7);
        const finHoy = new Date(hoy);
        finHoy.setUTCHours(23, 59, 59, 999);
        query.fechaRetiro = { $gte: hace7, $lte: finHoy };
      } else if (ultimos === "mes") {
        const hoy = new Date();
        hoy.setUTCHours(0, 0, 0, 0);
        const hace30 = new Date(hoy);
        hace30.setUTCDate(hoy.getUTCDate() - 30);
        const finHoy = new Date(hoy);
        finHoy.setUTCHours(23, 59, 59, 999);
        query.fechaRetiro = { $gte: hace30, $lte: finHoy };
      }
    }

    const userEnviosDB = await Envio.find(query).sort({
      fechaRetiro: 1,
      createdAt: -1,
    });

    const enviosResponse = userEnviosDB.map((e) => buildEnvioDTOResponse(e));
    return enviosResponse;
  } catch (e) {
    console.log("Error obteniendo envios del usuario", e);
    const error = new Error("error getting envios for user");
    error.status = "internal_server_error";
    error.code = StatusCodes.INTERNAL_SERVER_ERROR;
    throw error;
  }
};

const deleteEnvio = async (envioId, userId, userRole = "cliente") => {
  try {
    const envio = await findEnvioByIdInDB(envioId, userId, userRole);

    if (userRole === "cliente") {
      // Bloqueo si hoy es el mismo día del retiro (o después)
      const todayUTC = new Date();
      todayUTC.setUTCHours(0, 0, 0, 0);
      const fechaRetiroUTC = new Date(envio.fechaRetiro);
      fechaRetiroUTC.setUTCHours(0, 0, 0, 0);

      if (todayUTC >= fechaRetiroUTC) {
        const error = new Error(
          "No se puede cancelar el envío el mismo día del retiro (ni después)"
        );
        error.status = "bad_request";
        error.code = StatusCodes.BAD_REQUEST;
        throw error;
      }
    }

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

const updateEnvio = async (
  envioId,
  updateData,
  userId,
  userRole = "cliente"
) => {
  try {
    const envio = await findEnvioByIdInDB(envioId, userId, userRole);

    if (userRole === "cliente") {
      // 1) El cliente NO puede cambiar el estado
      if ("estado" in updateData) {
        const error = new Error(
          "Los clientes no pueden cambiar el estado del envío"
        );
        error.status = "forbidden";
        error.code = StatusCodes.FORBIDDEN;
        throw error;
      }
    }

    // 2) El cliente solo puede cambiar fecha si es al menos 1 día antes
    if ("fechaRetiro" in updateData) {
      const todayUTC = new Date();
      todayUTC.setUTCHours(0, 0, 0, 0);
      const fechaActualUTC = new Date(envio.fechaRetiro);
      fechaActualUTC.setUTCHours(0, 0, 0, 0);

      if (todayUTC >= fechaActualUTC) {
        const err = new Error(
          "No se puede reprogramar la fecha el mismo día del retiro (ni después)"
        );
        err.status = "bad_request";
        err.code = StatusCodes.BAD_REQUEST;
        throw err;
      }
    }
    Object.assign(envio, updateData);
    const updatedEnvio = await envio.save();
    return buildEnvioDTOResponse(updatedEnvio);
  } catch (error) {
    throw error;
  }
};

const findEnvioByIdInDB = async (envioId, userId, userRole = "cliente") => {
  let envio;
  try {
    envio = await Envio.findById(envioId);
  } catch (e) {
    if (!envio || envio === null || envio === undefined) {
      let error = new Error("envio was not found in database");
      (error.status = "not_found"), (error.code = StatusCodes.NOT_FOUND);
      throw error;
    }
    console.log("Error obteniendo el envio en la base", e);
    let error = new Error("error getting envio in database Taradito");
    (error.status = "internal_server_error"),
      (error.code = StatusCodes.INTERNAL_SERVER_ERROR);
    throw error;
  }

  if (userRole !== "admin" && envio.user.toString() !== userId) {
    let error = new Error("not allowed to access this resource");
    (error.status = "forbidden"), (error.code = StatusCodes.FORBIDDEN);
    throw error;
  }

  return envio;
};

const filtrarEnvios = (envios, filtros) => {
  let enviosFiltrados = envios;
  console.log("🔍 Filtros recibidos:", filtros);
  console.log("📦 Envíos antes del filtro:", enviosFiltrados.length);

  // Filtrar por estado
  if (filtros.estado) {
    console.log("Filtrando por estado:", filtros.estado);
    enviosFiltrados = enviosFiltrados.filter(
      (envio) => envio.estado === filtros.estado
    );
    console.log(
      "Envíos después de filtrar por estado:",
      enviosFiltrados.length
    );
  }

  // Filtrar por fecha específica
  if (filtros.fecha) {
    console.log("Filtrando por fecha:", filtros.fecha);
    enviosFiltrados = enviosFiltrados.filter((envio) => {
      const fechaEnvio = new Date(envio.fechaRetiro)
        .toISOString()
        .split("T")[0];
      const fechaFiltro = filtros.fecha;
      console.log(
        `Comparando: ${fechaEnvio} vs ${fechaFiltro} para envío ID: ${envio.id}`
      );
      return fechaEnvio === fechaFiltro;
    });
    console.log("Envíos después de filtrar por fecha:", enviosFiltrados.length);
  }

  // Filtrar por rango de fechas
  if (filtros.fechaDesde) {
    const fechaDesde = new Date(filtros.fechaDesde);
    enviosFiltrados = enviosFiltrados.filter(
      (envio) => new Date(envio.fechaRetiro) >= fechaDesde
    );
  }

  if (filtros.fechaHasta) {
    const fechaHasta = new Date(filtros.fechaHasta);
    fechaHasta.setHours(23, 59, 59, 999); // Hasta el final del día
    enviosFiltrados = enviosFiltrados.filter(
      (envio) => new Date(envio.fechaRetiro) <= fechaHasta
    );
  }

  return enviosFiltrados;
};

//cuenta la cantidad de envios con estado pendiente de un usuario
const countPendientesByUser = async (userId) => {
  return Envio.countDocuments({ user: userId, estado: "pendiente" });
};

module.exports = {
  findEnvioById,
  getEnviosByUserId,
  getAllEnviosAdmin,
  deleteEnvio,
  createEnvio,
  updateEnvio,
  filtrarEnvios,
  countPendientesByUser,
};
