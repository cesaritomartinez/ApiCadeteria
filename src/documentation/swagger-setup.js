const swagger = require('swagger-ui-express');
const swaggerJsonDoc = require('./swagger.json');

module.exports = (app) => {
  app.use("/docs", swagger.serve, swagger.setup(swaggerJsonDoc));
};
