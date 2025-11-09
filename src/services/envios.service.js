const { StatusCodes } = require("http-status-codes");
const buildEnvioDTOResponse = require("../dtos/envio.response.dto");
const Envio = require("../models/envio.model");
const Category = require("../models/category.model");

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


    if (queryParams.fecha) {
  // Un día puntual => [00:00:00.000Z, 23:59:59.999Z] del mismo día
  const inicio = utcStartOfDay(String(queryParams.fecha));
  const fin = utcEndOfDay(String(queryParams.fecha));
  query.fechaRetiro = { $gte: inicio, $lte: fin };
  
} else if (
  queryParams.fechaDesde || queryParams.startDate ||
  queryParams.fechaHasta || queryParams.endDate
) {
  // Rango INCLUSIVO en ambos extremos
  const start = String(queryParams.fechaDesde || queryParams.startDate || '');
  const end = String(queryParams.fechaHasta || queryParams.endDate || '');

  const rango = {};
  if (start) {
    rango.$gte = utcStartOfDay(start);
  }
  if (end) {
    rango.$lte = utcEndOfDay(end);  // Inclusivo hasta el final del día
  }
  query.fechaRetiro = rango;
  
} else {
  // 'semana' / 'mes' relativos a HOY
  const ultimos = String(queryParams.ultimos || queryParams.periodo || '').toLowerCase();
  if (ultimos === 'semana' || ultimos === 'mes') {
    const now = new Date();
    
    // Obtener "hoy" en formato YYYY-MM-DD en UTC
    const y = now.getUTCFullYear();
    const m = String(now.getUTCMonth() + 1).padStart(2, '0');
    const d = String(now.getUTCDate()).padStart(2, '0');
    const hoyYmd = `${y}-${m}-${d}`;

    // Calcular fecha de inicio (hace 7 o 30 días)
    const diasAtras = ultimos === 'semana' ? 7 : 30;
    const inicioDate = new Date(now);
    inicioDate.setUTCDate(inicioDate.getUTCDate() - diasAtras);
    
    const yInicio = inicioDate.getUTCFullYear();
    const mInicio = String(inicioDate.getUTCMonth() + 1).padStart(2, '0');
    const dInicio = String(inicioDate.getUTCDate()).padStart(2, '0');
    const inicioYmd = `${yInicio}-${mInicio}-${dInicio}`;

    const inicio = utcStartOfDay(inicioYmd);
    const fin = utcEndOfDay(hoyYmd);

    query.fechaRetiro = { $gte: inicio, $lte: fin };
  }
  console.log('🔍 Filtros recibidos:', queryParams);
console.log('🔍 Query MongoDB:', JSON.stringify(query.fechaRetiro));
}


    const allEnviosDB = await Envio.find(query)
      .populate('user', 'username email nombre apellido role plan empresa')
      .populate('category', 'name description')
      .sort({
        fechaRetiro: 1,
        createdAt: -1,
      });

    return allEnviosDB.map(buildEnvioDTOResponse);
  } catch (e) {

    const error = new Error("error getting all envios");
    error.status = "internal_server_error";
    error.code = StatusCodes.INTERNAL_SERVER_ERROR;
    throw error;
  }
};



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

  if (queryParams.fecha) {
  // Un día puntual => [00:00:00.000Z, 23:59:59.999Z] del mismo día
  const inicio = utcStartOfDay(String(queryParams.fecha));
  const fin = utcEndOfDay(String(queryParams.fecha));
  query.fechaRetiro = { $gte: inicio, $lte: fin };
  
} else if (
  queryParams.fechaDesde || queryParams.startDate ||
  queryParams.fechaHasta || queryParams.endDate
) {
  // Rango INCLUSIVO en ambos extremos
  const start = String(queryParams.fechaDesde || queryParams.startDate || '');
  const end = String(queryParams.fechaHasta || queryParams.endDate || '');

  const rango = {};
  if (start) {
    rango.$gte = utcStartOfDay(start);
  }
  if (end) {
    rango.$lte = utcEndOfDay(end);  // Inclusivo hasta el final del día
  }
  query.fechaRetiro = rango;
  
} else {
  // 'semana' / 'mes' relativos a HOY
  const ultimos = String(queryParams.ultimos || queryParams.periodo || '').toLowerCase();
  if (ultimos === 'semana' || ultimos === 'mes') {
    const now = new Date();
    
    // Obtener "hoy" en formato YYYY-MM-DD en UTC
    const y = now.getUTCFullYear();
    const m = String(now.getUTCMonth() + 1).padStart(2, '0');
    const d = String(now.getUTCDate()).padStart(2, '0');
    const hoyYmd = `${y}-${m}-${d}`;

    // Calcular fecha de inicio (hace 7 o 30 días)
    const diasAtras = ultimos === 'semana' ? 7 : 30;
    const inicioDate = new Date(now);
    inicioDate.setUTCDate(inicioDate.getUTCDate() - diasAtras);
    
    const yInicio = inicioDate.getUTCFullYear();
    const mInicio = String(inicioDate.getUTCMonth() + 1).padStart(2, '0');
    const dInicio = String(inicioDate.getUTCDate()).padStart(2, '0');
    const inicioYmd = `${yInicio}-${mInicio}-${dInicio}`;

    const inicio = utcStartOfDay(inicioYmd);
    const fin = utcEndOfDay(hoyYmd);

    query.fechaRetiro = { $gte: inicio, $lte: fin };
  }
}




    const userEnviosDB = await Envio.find(query)
      .populate('user', 'username email nombre apellido role plan empresa')
      .populate('category', 'name description')
      .sort({
        fechaRetiro: 1,
        createdAt: -1,
      });

    const enviosResponse = userEnviosDB.map((e) => buildEnvioDTOResponse(e));
    return enviosResponse;
  } catch (e) {

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
  let categoryId = null;

  // Si viene category como objeto { nombre }, convertir a string (por si algún flujo llama directo)
  if (envioData.category && typeof envioData.category === 'object') {
    envioData.category = String(envioData.category.nombre || '').trim();
  }

  // 1) Priorizar ID si viene
  if (envioData.categoryId) {
    const catById = await Category.findById(envioData.categoryId);
    if (!catById) {
      const error = new Error(`La categoría con id "${envioData.categoryId}" no existe`);
      error.status = "bad_request";
      error.code = StatusCodes.BAD_REQUEST;
      throw error;
    }
    categoryId = catById._id;
  }


  // 2) Si vino nombre, validar contra las existentes (case/acentos–insensible)
  else if (envioData.category) {
    const nameRaw = String(envioData.category).trim();

    let catByName = await Category
      .findOne({ name: nameRaw })
      .collation({ locale: 'es', strength: 1 });

    if (!catByName) {
      const escape = s => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      catByName = await Category.findOne({
        name: { $regex: `^${escape(nameRaw)}$`, $options: 'i' }
      });
    }

    if (!catByName) {
      const error = new Error(`La categoría "${envioData.category}" no existe`);
      error.status = "bad_request";
      error.code = StatusCodes.BAD_REQUEST;
      throw error;
    }
    categoryId = catByName._id;
  }

  const newEnvio = new Envio({
    user: userId,
    origen: envioData.origen,
    destino: envioData.destino,
    fechaRetiro: envioData.fechaRetiro,
    horaRetiroAprox: envioData.horaRetiroAprox,
    tamanoPaquete: envioData.tamanoPaquete,
    notas: envioData.notas,
    category: categoryId,
  });

  try {
    const savedEnvio = await newEnvio.save();
    //categoría para que el DTO tenga { id, nombre }
    await savedEnvio.populate({ path: 'category', select: 'name' });

    return buildEnvioDTOResponse(savedEnvio);
  } catch (e) {

    let error = new Error("error saving envio in database");
    error.status = "internal_server_error";
    error.code = StatusCodes.INTERNAL_SERVER_ERROR;
    throw error;
  }
};

const updateEnvio = async (envioId, updateData, userId, userRole = "cliente") => {
  try {
    const envio = await findEnvioByIdInDB(envioId, userId, userRole);
    const isAdmin = userRole === "admin";

    // --- REGLAS SOLO PARA CLIENTE ---
    if (!isAdmin) {
      if ("estado" in updateData) {
        const desired = String(updateData.estado).toLowerCase();
        if (desired !== "cancelado") {
          const error = new Error("Los clientes no pueden cambiar el estado del envío");
          error.status = "forbidden";
          error.code = StatusCodes.FORBIDDEN;
          throw error;
        }
      }

      // 2) El cliente solo puede cambiar fecha si es al menos 1 día antes
      if ("fechaRetiro" in updateData) {
        const todayUTC = new Date(); todayUTC.setUTCHours(0, 0, 0, 0);
        const fechaActualUTC = new Date(envio.fechaRetiro); fechaActualUTC.setUTCHours(0, 0, 0, 0);
        if (todayUTC >= fechaActualUTC) {
          const err = new Error("No se puede reprogramar la fecha el mismo día del retiro (ni después)");
          err.status = "bad_request";
          err.code = StatusCodes.BAD_REQUEST;
          throw err;
        }
      }
    }

    // 3) Validar categoría si viene (para ambos roles)
    // Priorizar categoryId si viene
    if ("categoryId" in updateData && updateData.categoryId) {
      const catById = await Category.findById(updateData.categoryId);
      if (!catById) {
        const error = new Error(`La categoría con id "${updateData.categoryId}" no existe`);
        error.status = "bad_request";
        error.code = StatusCodes.BAD_REQUEST;
        throw error;
      }
      envio.category = catById._id;
    }
    // Si no viene categoryId, buscar por nombre
    else if ("category" in updateData && updateData.category) {
      const category = await Category.findOne({ name: updateData.category });
      if (!category) {
        const error = new Error(`La categoría "${updateData.category}" no existe`);
        error.status = "bad_request";
        error.code = StatusCodes.BAD_REQUEST;
        throw error;
      }
      envio.category = category._id;
    }

    // Asignación manual de campos
    if (updateData.origen) envio.origen = updateData.origen;
    if (updateData.destino) envio.destino = updateData.destino;
    if (updateData.fechaRetiro) envio.fechaRetiro = updateData.fechaRetiro;
    if (updateData.horaRetiroAprox !== undefined) envio.horaRetiroAprox = updateData.horaRetiroAprox;
    if (updateData.tamanoPaquete) envio.tamanoPaquete = updateData.tamanoPaquete;
    if (updateData.notas !== undefined) envio.notas = updateData.notas;
    if (updateData.estado) envio.estado = updateData.estado;

    const updatedEnvio = await envio.save();
    // Poblar categoría para que el DTO tenga { id, nombre }
    await updatedEnvio.populate({ path: 'category', select: 'name description' });
    return buildEnvioDTOResponse(updatedEnvio);
  } catch (error) {
    throw error;
  }
};


const findEnvioByIdInDB = async (envioId, userId, userRole = "cliente") => {
  let envio;
  try {
    envio = await Envio.findById(envioId)
      .populate('user', 'username email nombre apellido role plan empresa')
      .populate('category', 'name description');
  } catch (e) {
    // ID con formato inválido -> CastError => 400
    if (e.name === "CastError") {
      const err = new Error("invalid envio id");
      err.status = "bad_request";
      err.code = StatusCodes.BAD_REQUEST;
      throw err;
    }
    // Otros problemas de DB -> 500
    const err = new Error("error getting envio in database");
    err.status = "internal_server_error";
    err.code = StatusCodes.INTERNAL_SERVER_ERROR;
    throw err;
  }

  // ID válido pero no existe -> 404
  if (!envio) {
    const err = new Error("envio was not found in database");
    err.status = "not_found";
    err.code = StatusCodes.NOT_FOUND;
    throw err;
  }

  // Autorización -> 403 (salvo admin)
  let ownerId;
  if (envio.user) {
    // Si user está poblado como objeto, extraer _id o id
    ownerId = envio.user._id ? String(envio.user._id) : (envio.user.id ? String(envio.user.id) : String(envio.user));
  } else {
    // Si user es null/undefined, el envío está huérfano - solo admin puede acceder
    ownerId = null;
  }

  if (userRole !== "admin" && ownerId !== String(userId)) {
    console.log('Authorization failed:', {
      userRole,
      ownerId,
      userId: String(userId),
      userField: envio.user
    });
    const err = new Error("not allowed to access this resource");
    err.status = "forbidden";
    err.code = StatusCodes.FORBIDDEN;
    throw err;
  }


  return envio;
};

const filtrarEnvios = (envios, filtros) => {
  let enviosFiltrados = envios;


  // Filtrar por estado
  if (filtros.estado) {

    enviosFiltrados = enviosFiltrados.filter(
      (envio) => envio.estado === filtros.estado
    );

  }

  // Filtrar por fecha específica
  if (filtros.fecha) {

    enviosFiltrados = enviosFiltrados.filter((envio) => {
      const fechaEnvio = new Date(envio.fechaRetiro)
        .toISOString()
        .split("T")[0];
      const fechaFiltro = filtros.fecha;

      return fechaEnvio === fechaFiltro;
    });

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


// Convierte 'YYYY-MM-DD' a ISOString del inicio del día en UTC
function utcStartOfDay(isoYmd) {
  // Asegurarse que sea string y extraer solo YYYY-MM-DD
  const dateStr = String(isoYmd).substring(0, 10);
  return new Date(dateStr + 'T00:00:00.000Z');
}

// Convierte 'YYYY-MM-DD' a ISOString del final del día en UTC
function utcEndOfDay(isoYmd) {
  // Asegurarse que sea string y extraer solo YYYY-MM-DD
  const dateStr = String(isoYmd).substring(0, 10);
  return new Date(dateStr + 'T23:59:59.999Z');
}



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