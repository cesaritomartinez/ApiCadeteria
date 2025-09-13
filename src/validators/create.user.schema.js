const Joi = require("joi");

const createEnvioSchema = Joi.object({
  username: Joi.string().min(2).max(50).required(),
  password: Joi.string().min(4).required(),
  name: Joi.string().min(4).required(),
  lastname: Joi.string().min(4).required(),
  email: Joi.string().email().required().messages({
    "string.email": "Invalid email format. Should be: algo@mail.com",
  }),
});

module.exports = createEnvioSchema;
