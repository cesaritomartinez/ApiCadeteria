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
        validator: function (value) {
          // si NO cambiaste la fecha en este update, no revalides
          if (!this.isModified("fechaRetiro")) return true;

          // comparar contra HOY en UTC (medianoche)
          const todayUTC = new Date();
          todayUTC.setUTCHours(0, 0, 0, 0);
          return value >= todayUTC;
        },
        message: "La fecha de retiro debe ser una fecha futura",
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
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: false,
    },
    estado: {
      type: String,
      enum: ["pendiente", "en_ruta", "entregado", "cancelado"],
      default: "pendiente",
      index: true,
    },
    codigoSeguimiento: { type: String, trim: true, unique: true, sparse: true },
    comprobantePagoUrl: { type: String, trim: true },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

module.exports = envioSchema;
