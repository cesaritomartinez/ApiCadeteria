const express = require("express");
const StatusCodes = require("http-status-codes");
const router = express.Router();
const { clientes } = require("../models/bd");
const { getISODate } = require("../utils/date");
const registerSchema = require("../validators/schemas");

// Endpoint de prueba (ping)
router.get("/ping", (req, res) => {
  res.status(StatusCodes.OK).json({ message: "pong" });
});

// Endpoint de Registro

// "clienteId": clienteId++,
//     "username": "juanperez",
//     "email": "juanperez@example.com",
//     "password": "1234",
//     "plan": "plus",
//     "createdAt": "2025-09-06"

router.post("/register", (req, res) => {
  if (!req.body) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      error: "El body de la solicitud no puede estar vacío",
    });
  }

  const { username, nombre, apellido, email, password, confirmPassword } =
    req.body;

  const { error } = registerSchema.validate(req.body);

  if (error) {
    console.log(error);
    const errorMessage = error.details[0].message;
    res.status(StatusCodes.BAD_REQUEST).json({
      error: "bad_request",
      message: errorMessage,
    });
    return;
  }

  //Confirmación de contraseñas
  if (password !== confirmPassword) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      error: "Las contrasenas no coinciden",
    });
  }

  // De momento simulamos con un objeto "nuevoUsuario".
  const nuevoUsuario = {
    clienteId: clientes[clientes.length - 1].clienteId + 1,
    username,
    nombre,
    apellido,
    email,
    password,
    creadoEn: getISODate(),
  };

  // Respuesta exitosa
  res.status(StatusCodes.CREATED).json({
    message: "Usuario registrado con éxito",
    usuario: nuevoUsuario,
  });
});

//Endpoint de Loguin

module.exports = router;
