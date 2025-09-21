const { envioSchema } = require("../validators/schemas");
const { createError } = require("../utils/error");
const { StatusCodes } = require("http-status-codes");
const {
  envios,
  findEnvioById,
  createEnvio,
  deleteEnvioById,
  updateEnvioService,
} = require("../models/bd");
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
  let enviosFiltrados;

  // Si es admin, mostrar todos los envíos
  if (req.userRole === "admin") {
    enviosFiltrados = envios;
  } else {
    // Si es cliente, mostrar solo sus envíos
    enviosFiltrados = envios.filter((envio) => envio.userId === req.userId);
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

const updateEnvio = (req, res) => {
  const envioId = Number(req.params.id);

  if (isNaN(envioId)) {
    res
      .status(StatusCodes.BAD_REQUEST)
      .json(createError("bad_request", "ID must be a number"));
    return;
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

// Controller del repo del profe para mudar :

// const bd = require("../models/bd");
// const { createError } = require("../utils/errors");
// const StatusCodes = require("http-status-codes");
// const createTodoSchema = require("../validators/create.todo.schema");

// const todosService = require("../services/todos.service");

// const getTodos = async (req, res) => {
//req.query
/* 
        if (req.query.completed !== undefined) {
            console.log("existe el query param")
            const completedBool = req.query.completed === "true"; //true - false
            todos = todos.filter(todo => todo.completed === completedBool);
        }
     */
//   try {
//     let todos = await todosService.getTodosByUserId(req.userId);
//     res.status(StatusCodes.OK).json(todos);
//   } catch (error) {
//     res
//       .status(error.code || 500)
//       .json(createError(error.status, error.message));
//   }
// };

// const getTodoById = async (req, res) => {
//   //capturar el ID que viene en la url /:id
//   const todoId = req.params.id;
//   console.log(todoId);

//   try {
//     const todo = await todosService.findTodoById(todoId, req.userId); //busco el todo en mi bd por id
//     res.status(StatusCodes.OK).json(todo);
//   } catch (error) {
//     res
//       .status(error.code || 500)
//       .json(createError(error.status, error.message));
//   }
// };

// const deleteTodo = async (req, res) => {
//   const todoId = req.params.id;
//   try {
//     await todosService.deleteTodo(todoId, req.userId);
//     res.status(StatusCodes.NO_CONTENT).send();
//   } catch (error) {
//     res
//       .status(error.code || 500)
//       .json(createError(error.status, error.message));
//   }
// };

// const createTodo = async (req, res) => {
//   //capturamos el body del request entrante

//   const { body } = req;

//   if (!body) {
//     res
//       .status(StatusCodes.BAD_REQUEST)
//       .json(createError("bad_request", "Invalid body"));
//     return;
//   }

//   const { error } = createTodoSchema.validate(body);

//   if (error) {
//     console.log(error);
//     const errorMessage = error.details[0].message;
//     res
//       .status(StatusCodes.BAD_REQUEST)
//       .json(createError("bad_request", errorMessage));
//     return;
//   }

//   const { title, category } = body;

//   try {
//     const newTodo = await todosService.createTodo(title, category, req.userId);
//     res.status(StatusCodes.CREATED).json(newTodo);
//   } catch (error) {
//     res
//       .status(error.code || 500)
//       .json(createError(error.status, error.message));
//   }
// };

// const updateTodo = async (req, res) => {
//   const todoId = req.params.id;

//   const { completed } = req.body;

//   if (completed === undefined) {
//     res
//       .status(StatusCodes.BAD_REQUEST)
//       .json(createError("bad_request", "Missing completed property"));
//     return;
//   }

//   try {
//     const updatedTodo = await todosService.updateTodo(
//       todoId,
//       completed,
//       req.userId
//     );
//     res.status(StatusCodes.OK).json(updatedTodo);
//   } catch (error) {
//     res
//       .status(error.code || 500)
//       .json(createError(error.status, error.message));
//   }
// };

// module.exports = {
//   getTodos,
//   getTodoById,
//   deleteTodo,
//   createTodo,
//   updateTodo,
// };
