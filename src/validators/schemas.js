const Joi = require("joi");

const registerSchema = Joi.object({
  username: Joi.string().min(2).max(50).required(),
  nombre: Joi.string().min(2).max(50).required(),
  apellido: Joi.string().min(2).max(50).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(4).required(),
  confirmPassword: Joi.string().min(4).required().valid(Joi.ref("password")),
});

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(4).required(),
});

const envioSchema = Joi.object({
  userId: Joi.number().integer().positive().required(),
  origen: Joi.object({
    calle: Joi.string().min(2).max(100).required(),
    numero: Joi.number().integer().positive().required(),
    ciudad: Joi.string().min(2).max(50).required(),
  }).required(),
  destino: Joi.object({
    calle: Joi.string().min(2).max(100).required(),
    numero: Joi.number().integer().positive().required(),
    ciudad: Joi.string().min(2).max(50).required(),
  }).required(),
  fechaRetiro: Joi.string().pattern(/^\d{2}\/\d{2}\/\d{4}$/).required(),
  horaRetiroAprox: Joi.string().pattern(/^\d{2}:\d{2}$/).optional(),
  tamanoPaquete: Joi.string().valid("chico", "mediano", "grande").required(),
  notas: Joi.string().max(200).optional().allow(""),
  categoria: Joi.object({
    nombre: Joi.string().min(2).max(50).required(),
    descripcion: Joi.string().max(100).optional().allow(""),
  }).optional(),
});

module.exports = { registerSchema, loginSchema, envioSchema };
