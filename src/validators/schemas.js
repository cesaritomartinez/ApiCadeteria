const Joi = require("joi");

const registerSchema = Joi.object({
  username: Joi.string().min(2).max(50).required(),
  nombre: Joi.string().min(2).max(50).required().messages({
    "string.min": "El nombre debe tener al menos 2 caracteres",
    "string.max": "El nombre no puede exceder 50 caracteres",
    "string.empty": "El nombre es requerido",
    "any.required": "El nombre es obligatorio",
  }),
  apellido: Joi.string().min(2).max(50).required(),
  email: Joi.string().email().required().messages({
    "string.email": "El email debe tener un formato válido",
    "string.empty": "El email es requerido",
    "any.required": "El email es obligatorio",
  }),
  password: Joi.string().min(4).required().messages({
    "string.min": "La contraseña debe tener al menos 4 caracteres",
    "string.empty": "La contraseña es requerida",
    "any.required": "La contraseña es obligatoria",
  }),
  confirmPassword: Joi.string().min(4).required().valid(Joi.ref("password")),
});

module.exports = registerSchema;
