const Joi = require("joi");

const direccionSchema = Joi.object({
  calle: Joi.string().trim(),
  numero: Joi.string().trim().allow(''),
  ciudad: Joi.string().trim(),
  referencia: Joi.string().trim().allow(''),
});

const updateEnvioSchema = Joi.object({
  origen: direccionSchema,
  destino: direccionSchema,
  fechaRetiro: Joi.date().min('now').messages({
    'date.min': 'La fecha de retiro debe ser una fecha futura'
  }),
  horaRetiroAprox: Joi.string().pattern(/^([01]\d|2[0-3]):[0-5]\d$/).allow('').messages({
    'string.pattern.base': 'Hora inválida (formato HH:mm)'
  }),
  tamanoPaquete: Joi.string().valid('chico', 'mediano', 'grande'),
  notas: Joi.string().trim().max(500).allow(''),
  category: Joi.string().trim().allow(null, '').messages({
    'string.base': 'La categoría debe ser un texto válido'
  }),
  estado: Joi.string().valid('pendiente', 'en_ruta', 'entregado', 'cancelado')
}).min(1).messages({
  'object.min': 'Debe proporcionar al menos un campo para actualizar'
});

module.exports = updateEnvioSchema;
