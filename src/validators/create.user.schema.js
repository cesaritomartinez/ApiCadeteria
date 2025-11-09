const Joi = require("joi");

const createUserSchema = Joi.object({
  username: Joi.string().min(2).max(50).required(),
  password: Joi.string().min(4).required(),
  nombre: Joi.string().min(2).required(),
  apellido: Joi.string().min(2).required(),
  email: Joi.string().email().required().messages({
    "string.email": "Invalid email format. Should be: algo@mail.com",
  }),
  imageUrl: Joi.string(),
  empresa: Joi.string().min(2),
});

module.exports = createUserSchema;
