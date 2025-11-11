const Joi = require("joi");

const updateUserImageSchema = Joi.object({
  imageUrl: Joi.string().uri().trim().required().messages({
    "string.uri": "imageUrl debe ser una URL válida",
    "any.required": "imageUrl es requerido",
  }),
});

module.exports = updateUserImageSchema;
