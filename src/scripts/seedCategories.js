const mongoose = require('mongoose');
require('dotenv').config();
const Category = require('../models/category.model');

const categories = [
  { name: 'Documentos' },
  { name: 'Electrónicos' },
  { name: 'Ropa y Textiles' },
  { name: 'Alimentos' },
  { name: 'Medicamentos' },
  { name: 'Libros y Materiales Educativos' },
  { name: 'Productos de Cuidado Personal' },
  { name: 'Artículos Frágiles' },
  { name: 'Flores y Plantas' },
  { name: 'Otros' }
];

const seedCategories = async () => {
  try {
    const connectionURL = process.env.MONGO_DB_HOST;
    const dbName = process.env.MONGO_TODOS_DB_NAME;
    await mongoose.connect(`${connectionURL}/${dbName}`, {
      serverSelectionTimeoutMS: 10000,
    });
    console.log('Conexión a MongoDB establecida');

    // Limpiar categorías existentes (opcional)
    await Category.deleteMany({});
    console.log('Categorías anteriores eliminadas');

    // Insertar nuevas categorías
    const result = await Category.insertMany(categories);
    console.log(`${result.length} categorías creadas exitosamente`);

    await mongoose.connection.close();
    console.log('Conexión cerrada');
  } catch (error) {
    console.error('Error al crear categorías:', error);
    process.exit(1);
  }
};

seedCategories();
