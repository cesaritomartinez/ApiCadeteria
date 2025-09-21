const Joi = require("joi");

const direccionSchema = Joi.object({
  calle: Joi.string().trim().required(),
  numero: Joi.string().trim().allow(''),
  ciudad: Joi.string().trim().required(),
  referencia: Joi.string().trim().allow(''),
});

const categoriaSchema = Joi.object({
  nombre: Joi.string().trim().required(),
  descripcion: Joi.string().trim().allow(''),
});

const createEnvioSchema = Joi.object({
  origen: direccionSchema.required(),
  destino: direccionSchema.required(),
  fechaRetiro: Joi.date().min('now').required().messages({
    'date.min': 'La fecha de retiro debe ser hoy o una fecha futura'
  }),
  horaRetiroAprox: Joi.string().pattern(/^([01]\d|2[0-3]):[0-5]\d$/).allow('').messages({
    'string.pattern.base': 'Hora inválida (formato HH:mm)'
  }),
  tamanoPaquete: Joi.string().valid('chico', 'mediano', 'grande').required(),
  notas: Joi.string().trim().max(500).allow(''),
  categoria: categoriaSchema.allow(null)
});

module.exports = createEnvioSchema;