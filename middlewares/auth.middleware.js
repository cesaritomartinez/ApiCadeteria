const { StatusCodes } = require("http-status-codes");
const { createError } = require("../src/utils/error");

const authMiddleware = (req, res, next) => {
  //headers
  const token = req.headers["authorization"];

  if (!token) {
    res
      .status(StatusCodes.UNAUTHORIZED)
      .json(createError("unauthorized", "Auth token was not provided"));
    console.log("No hay token");
    return;
  }

  if (token !== "clavesecreta") {
    // llevar a .env
    res
      .status(StatusCodes.UNAUTHORIZED)
      .json(createError("unauthorized", "Invalid token"));
    console.log("Token no valido");
    return;
  }

  console.log("Token correcto.");
  next();
};

module.exports = { authMiddleware };
