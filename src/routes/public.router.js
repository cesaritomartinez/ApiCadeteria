const express = require("express");
const StatusCodes = require("http-status-codes");
const router = express.Router();
const { usuarios } = require("../models/bd");
const { getISODate } = require("../utils/date");
const { registerSchema, loginSchema } = require("../validators/schemas");

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

// router.post("/register", (req, res) => {
//   if (!req.body) {
//     return res.status(StatusCodes.BAD_REQUEST).json({
//       error: "El body de la solicitud no puede estar vacío",
//     });
//   }

//   const { username, nombre, apellido, email, password, confirmPassword } =
//     req.body;

//   const { error } = registerSchema.validate(req.body);

//   if (error) {
//     console.log(error);
//     const errorMessage = error.details[0].message;
//     res.status(StatusCodes.BAD_REQUEST).json({
//       error: "bad_request",
//       message: errorMessage,
//     });
//     return;
//   }

//   //Confirmación de contraseñas
//   if (password !== confirmPassword) {
//     return res.status(StatusCodes.BAD_REQUEST).json({
//       error: "Las contrasenas no coinciden",
//     });
//   }

//   // De momento simulamos con un objeto "nuevoUsuario".
//   const nuevoUsuario = {
//     id: usuarios[usuarios.length - 1].id + 1,
//     username,
//     nombre,
//     apellido,
//     email,
//     password,
//     role: "cliente",
//     creadoEn: getISODate(),
//   };

//   // Respuesta exitosa
//   res.status(StatusCodes.CREATED).json({
//     message: "Usuario registrado con éxito",
//     usuario: nuevoUsuario,
//   });
// });

// //Endpoint de Login
// router.post("/login", (req, res) => {
//   if (!req.body) {
//     return res.status(StatusCodes.BAD_REQUEST).json({
//       error: "El body de la solicitud no puede estar vacío",
//     });
//   }

//   const { email, password } = req.body;

//   const { error } = loginSchema.validate(req.body);

//   if (error) {
//     console.log(error);
//     const errorMessage = error.details[0].message;
//     return res.status(StatusCodes.BAD_REQUEST).json({
//       error: "bad_request",
//       message: errorMessage,
//     });
//   }

//   // Buscar usuario por email
//   const usuario = usuarios.find((user) => user.email === email);

//   if (!usuario) {
//     return res.status(StatusCodes.UNAUTHORIZED).json({
//       error: "Credenciales inválidas",
//     });
//   }

//   // Verificar contraseña
//   if (usuario.password !== password) {
//     return res.status(StatusCodes.UNAUTHORIZED).json({
//       error: "Credenciales inválidas",
//     });
//   }

//   // Login exitoso
//   res.status(StatusCodes.OK).json({
//     message: `Bienvenido ${usuario.nombre} ${usuario.apellido}`,
//     usuario: {
//       id: usuario.id,
//       username: usuario.username,
//       email: usuario.email,
//       nombre: usuario.nombre,
//       apellido: usuario.apellido,
//       role: usuario.role,
//     },
//   });
// });

module.exports = router;
