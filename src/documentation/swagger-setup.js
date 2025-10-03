const swaggerUi = require("swagger-ui-express");
const swaggerDocument = require("./swagger.json");

module.exports = (app) => {
  app.use("/docs", swaggerUi.serve);
  app.get("/docs", swaggerUi.setup(swaggerDocument));
};
