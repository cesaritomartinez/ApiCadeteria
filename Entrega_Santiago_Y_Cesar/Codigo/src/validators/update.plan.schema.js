const Joi = require("joi");

const updatePlanSchema = Joi.object({
  userId: Joi.string().hex().length(24).required().messages({
    'string.hex': 'El ID del usuario debe ser un ObjectId válido',
    'string.length': 'El ID del usuario debe tener 24 caracteres',
    'any.required': 'El ID del usuario es requerido'
  })
});

module.exports = updatePlanSchema;
