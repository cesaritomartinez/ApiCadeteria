const express = require("express");
const StatusCodes = require("http-status-codes");
const router = express.Router();

// Endpoint de prueba (ping)
router.get("/", (req, res) => {
  res.status(StatusCodes.OK).json({ message: "Api Cadeteria it`s works" });
});

module.exports = router;
