const mongoose = require("mongoose");

const direccionSchema = new mongoose.Schema(
  {
    calle: { type: String, required: true, trim: true },
    numero: { type: String, trim: true }, // acepta "1234" o "s/n"
    ciudad: { type: String, required: true, trim: true },
    referencia: { type: String, trim: true },
  },
  { _id: false }
);

const categoriaSchema = new mongoose.Schema(
  {
    nombre: { type: String, required: true, trim: true },
    descripcion: { type: String, trim: true },
  },
  { _id: false }
);

const envioSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    origen: { type: direccionSchema, required: true },
    destino: { type: direccionSchema, required: true },
    fechaRetiro: {
      type: Date,
      required: true,
      validate: {
        validator: (value) => value >= new Date().setHours(0, 0, 0, 0),
        message: "La fecha de retiro debe ser hoy o una fecha futura",
      },
    },
    horaRetiroAprox: {
      type: String,
      trim: true,
      match: [/^([01]\d|2[0-3]):[0-5]\d$/, "Hora inválida (HH:mm)"],
    },
    tamanoPaquete: {
      type: String,
      enum: ["chico", "mediano", "grande"],
      required: true,
    },
    notas: { type: String, trim: true, maxlength: 500 },
    categoria: { type: categoriaSchema, default: undefined },
    estado: {
      type: String,
      enum: ["pendiente", "en_ruta", "entregado", "cancelado"],
      default: "pendiente",
      index: true,
    },
    codigoSeguimiento: { type: String, trim: true, unique: true, sparse: true },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

module.exports = envioSchema;
