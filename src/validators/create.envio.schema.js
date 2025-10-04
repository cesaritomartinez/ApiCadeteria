const Joi = require("joi");

const direccionSchema = Joi.object({
  calle: Joi.string().trim().required(),
  numero: Joi.string().trim().allow(''),
  ciudad: Joi.string().trim().required(),
  referencia: Joi.string().trim().allow(''),
});

// acepta category como string o como objeto { nombre, descripcion? }
const categoryObject = Joi.object({
  nombre: Joi.string().trim().required(),
  descripcion: Joi.string().trim().allow('', null),
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

  // ✅ Acepta string o { nombre, descripcion? } — opcional
  category: Joi.alternatives()
    .try(
      Joi.string().trim().allow(null, ''),
      categoryObject
    )
    .optional()
    .messages({
      'alternatives.types': 'La categoría debe ser texto o un objeto { nombre } válido'
    }),

  // ✅ También opcional por ObjectId
  categoryId: Joi.string().length(24).hex().optional()
})
// ✅ Evita que falle por claves extra como "categoria" si la normalización no corriera
.unknown(true);

module.exports = createEnvioSchema;
