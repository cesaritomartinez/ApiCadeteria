const mongoose = require("mongoose");
const envioSchema = require("../repositories/envio.schema");
const { envioSchema } = require("../validators/schemas");

const Envio = mongoose.model("Envio", envioSchema);

module.exports = Envio;
