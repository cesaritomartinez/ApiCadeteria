const mongoose = require("mongoose");

// Cache de la conexión para Vercel (reutilizar en requests subsecuentes)
let cachedConnection = null;

const connectMongoDB = async () => {
  // Si ya existe una conexión activa, reutilizarla
  if (cachedConnection && mongoose.connection.readyState === 1) {
    return cachedConnection;
  }

  try {
    const connectionURL = process.env.MONGO_DB_HOST;
    const dbName = process.env.MONGO_TODOS_DB_NAME;

    if (!connectionURL || !dbName) {
      throw new Error("Variables de entorno MONGO_DB_HOST y MONGO_TODOS_DB_NAME son requeridas");
    }

    // Configuración optimizada para Vercel y MongoDB Atlas
    const connection = await mongoose.connect(`${connectionURL}/${dbName}`, {
      serverSelectionTimeoutMS: 8000, // Tiempo para seleccionar servidor (8s es razonable para cold starts)
      connectTimeoutMS: 10000, // Tiempo para establecer conexión inicial
      socketTimeoutMS: 45000, // Tiempo para operaciones (45s es el máximo de Vercel en plan hobby)
      maxPoolSize: 10, // Pool de conexiones
      minPoolSize: 1,
      maxIdleTimeMS: 30000, // Mantener conexiones idle por 30s
      bufferCommands: false, // No bufferear comandos si no hay conexión
      retryWrites: true, // Reintentar escrituras automáticamente
      retryReads: true, // Reintentar lecturas automáticamente
    });

    cachedConnection = connection;
    console.log("MongoDB conectado exitosamente");
    return connection;
  } catch (error) {
    console.error("Error conectando a MongoDB:", error.message);
    cachedConnection = null;
    throw error;
  }
};

// Middleware para garantizar conexión antes de cada request
const ensureConnection = async (req, res, next) => {
  try {
    await connectMongoDB();
    next();
  } catch (error) {
    console.error("Error en middleware de conexión:", error);
    res.status(503).json({
      error: "Servicio no disponible",
      message: "No se pudo conectar a la base de datos",
    });
  }
};

module.exports = connectMongoDB;
module.exports.ensureConnection = ensureConnection;
