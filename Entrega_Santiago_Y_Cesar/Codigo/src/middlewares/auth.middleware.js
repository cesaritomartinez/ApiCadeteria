const { StatusCodes } = require("http-status-codes");
const { createError } = require("../utils/error");
const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
  //headers
  let token = req.headers["authorization"];

  if (!token) {
    res
      .status(StatusCodes.UNAUTHORIZED)
      .json(createError("unauthorized", "Auth token was not provided"));
    
    return;
  }

  // Si el token viene con el prefijo "Bearer ", lo removemos
  if (token.startsWith("Bearer ")) {
    token = token.substring(7);
  }

  try {
    const verifiedJWT = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = verifiedJWT.userId;
    req.userRole = verifiedJWT.role;
    
    next();
  } catch (error) {
    res
      .status(StatusCodes.UNAUTHORIZED)
      .json(createError("unauthorized", "Invalid jwt"));
    return;
  }
};

module.exports = { authMiddleware };
