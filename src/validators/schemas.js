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

const loginSchema = Joi.object({
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
});

const envioSchema = Joi.object({
  clienteId: Joi.number().integer().positive().required().messages({
    "number.base": "El clienteId debe ser un número",
    "number.integer": "El clienteId debe ser un número entero",
    "number.positive": "El clienteId debe ser un número positivo",
    "any.required": "El clienteId es obligatorio",
  }),
  origen: Joi.object({
    calle: Joi.string().min(2).max(100).required().messages({
      "string.min": "La calle de origen debe tener al menos 2 caracteres",
      "string.max": "La calle de origen no puede exceder 100 caracteres",
      "string.empty": "La calle de origen es requerida",
      "any.required": "La calle de origen es obligatoria",
    }),
    numero: Joi.number().integer().positive().required().messages({
      "number.base": "El número de origen debe ser un número",
      "number.integer": "El número de origen debe ser un número entero",
      "number.positive": "El número de origen debe ser un número positivo",
      "any.required": "El número de origen es obligatorio",
    }),
    ciudad: Joi.string().min(2).max(50).required().messages({
      "string.min": "La ciudad de origen debe tener al menos 2 caracteres",
      "string.max": "La ciudad de origen no puede exceder 50 caracteres",
      "string.empty": "La ciudad de origen es requerida",
      "any.required": "La ciudad de origen es obligatoria",
    }),
  }).required().messages({
    "any.required": "El origen es obligatorio",
  }),
  destino: Joi.object({
    calle: Joi.string().min(2).max(100).required().messages({
      "string.min": "La calle de destino debe tener al menos 2 caracteres",
      "string.max": "La calle de destino no puede exceder 100 caracteres",
      "string.empty": "La calle de destino es requerida",
      "any.required": "La calle de destino es obligatoria",
    }),
    numero: Joi.number().integer().positive().required().messages({
      "number.base": "El número de destino debe ser un número",
      "number.integer": "El número de destino debe ser un número entero",
      "number.positive": "El número de destino debe ser un número positivo",
      "any.required": "El número de destino es obligatorio",
    }),
    ciudad: Joi.string().min(2).max(50).required().messages({
      "string.min": "La ciudad de destino debe tener al menos 2 caracteres",
      "string.max": "La ciudad de destino no puede exceder 50 caracteres",
      "string.empty": "La ciudad de destino es requerida",
      "any.required": "La ciudad de destino es obligatoria",
    }),
  }).required().messages({
    "any.required": "El destino es obligatorio",
  }),
  fechaRetiro: Joi.string().pattern(/^\d{2}\/\d{2}\/\d{4}$/).required().messages({
    "string.pattern.base": "La fecha de retiro debe tener el formato DD/MM/YYYY",
    "string.empty": "La fecha de retiro es requerida",
    "any.required": "La fecha de retiro es obligatoria",
  }),
  horaRetiroAprox: Joi.string().pattern(/^\d{2}:\d{2}$/).optional().messages({
    "string.pattern.base": "La hora de retiro debe tener el formato HH:MM",
  }),
  tamanoPaquete: Joi.string().valid("chico", "mediano", "grande").required().messages({
    "any.only": "El tamaño del paquete debe ser 'chico', 'mediano' o 'grande'",
    "string.empty": "El tamaño del paquete es requerido",
    "any.required": "El tamaño del paquete es obligatorio",
  }),
  notas: Joi.string().max(200).optional().allow("").messages({
    "string.max": "Las notas no pueden exceder 200 caracteres",
  }),
  categoria: Joi.object({
    nombre: Joi.string().min(2).max(50).required().messages({
      "string.min": "El nombre de la categoría debe tener al menos 2 caracteres",
      "string.max": "El nombre de la categoría no puede exceder 50 caracteres",
      "string.empty": "El nombre de la categoría es requerido",
      "any.required": "El nombre de la categoría es obligatorio",
    }),
    descripcion: Joi.string().max(100).optional().allow("").messages({
      "string.max": "La descripción de la categoría no puede exceder 100 caracteres",
    }),
  }).optional(),
});

module.exports = { registerSchema, loginSchema, envioSchema };
