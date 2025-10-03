// src/server.js
require('dotenv').config();
const app = require('./app');

const port = process.env.PORT || 3006;
app.listen(port, () => {
  console.log("App started and listening in port " + port);
});
