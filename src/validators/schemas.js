const Joi = require('joi');

const registerSchema = Joi.object({
    username: Joi.string().min(2).max(50).required().messages({
    'string.min': 'El nombre debe tener al menos 2 caracteres',
    'string.max': 'El nombre no puede exceder 50 caracteres',
    'string.empty': 'El nombre es requerido',
    'any.required': 'El nombre es obligatorio'}),
    nombre: Joi.string().min(2).max(50).required(),
    apellido: Joi.string().min(2).max(50).required(),
})

module.exports = registerSchema;

// const nuevoUsuario = {
//         clienteId : clientes[clientes.length-1].clienteId +1,
//         username
//         nombre,
//         apellido
//         email,
//         plan: "Plus", //valor por defecto
//         creadoEn: getISODate()

