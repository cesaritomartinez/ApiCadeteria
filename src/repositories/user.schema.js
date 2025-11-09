const mongoose = require("mongoose");
const userSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, trim: true, unique: true },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      unique: true,
    },
    password: { type: String, required: true, select: false },
    nombre: { type: String, required: true, trim: true },
    apellido: { type: String, required: true, trim: true },
    role: { type: String, enum: ["admin", "cliente"], default: "cliente" },
    plan: { type: String, enum: ["plus", "premium"], default: "plus" },
    imageUrl: {type: String, trim: true, default: "", required: false },
    empresa: { type: String, trim: true, default: "", required: false },
  },
  { timestamps: true, versionKey: false }
);
module.exports = userSchema;
