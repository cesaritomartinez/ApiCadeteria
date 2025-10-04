const Joi = require("joi");

const direccionSchema = Joi.object({
  calle: Joi.string().trim().required(),
  numero: Joi.string().trim().allow(''),
  ciudad: Joi.string().trim().required(),
  referencia: Joi.string().trim().allow(''),
});

const createEnvioSchema = Joi.object({
  origen: direccionSchema.required(),
  destino: direccionSchema.required(),
  fechaRetiro: Joi.date().min('now').required().messages({
    'date.min': 'La fecha de retiro debe ser hoy o una fecha futura'
  }),
  horaRetiroAprox: Joi.string()
    .pattern(/^([01]\d|2[0-3]):[0-5]\d$/)
    .allow('') // si querés también null: .allow('', null)
    .messages({ 'string.pattern.base': 'Hora inválida (formato HH:mm)' }),
  tamanoPaquete: Joi.string().valid('chico', 'mediano', 'grande').required(),
  notas: Joi.string().trim().max(500).allow(''),

  // OPCIONAL: por nombre
  category: Joi.string().trim().allow(null, '').messages({
    'string.base': 'La categoría debe ser un texto válido'
  }),

  // OPCIONAL: por ObjectId
  categoryId: Joi.string().length(24).hex().optional()
})
  // No rechazar claves extra (p.ej., "categoria" del Swagger viejo)
  .unknown(true);

module.exports = createEnvioSchema;
