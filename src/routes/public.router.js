const express = require("express");
const StatusCodes = require("http-status-codes");
const router = express.Router();

// Endpoint de prueba (ping)
router.get("/ping", (req, res) => {
  res.status(StatusCodes.OK).json({ message: "pong" });
});

module.exports = router;
