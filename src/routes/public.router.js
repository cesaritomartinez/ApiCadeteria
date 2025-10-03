const express = require("express");
const StatusCodes = require("http-status-codes");
const router = express.Router();
const categoryController = require("../controllers/category.controller");

// Endpoint de prueba (ping)
router.get("/", (req, res) => {
  res.status(StatusCodes.OK).json({ message: "Api Cadeteria it`s works" });
});

// Categorías (público)
router.get("/public/v1/categories", categoryController.getCategories);

module.exports = router;
