const mongoose = require("mongoose");

const connectMongoDB = async () => {
  const connectionURL = process.env.MONGO_DB_HOST;
  const dbName = process.env.MONGO_TODOS_DB_NAME;
  await mongoose.connect(`${connectionURL}/${dbName}`, {
    serverSelectionTimeoutMS: 10000,
  });
};

module.exports = connectMongoDB;
