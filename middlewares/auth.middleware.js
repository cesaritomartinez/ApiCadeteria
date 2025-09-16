const { StatusCodes } = require("http-status-codes");
const { createError } = require("../src/utils/error");
const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
  //headers
  const token = req.headers["authorization"];
console.log(token)
  if (!token) {
    res
      .status(StatusCodes.UNAUTHORIZED)
      .json(createError("unauthorized", "Auth token was not provided"));
    console.log("No hay token");
    return;
  }
console.log('Auth header ->', req.headers.authorization);

  try {
    const verifiedJWT = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = verifiedJWT.userId;
    req.userRole = verifiedJWT.role;
    console.log(req.userId);
    console.log(req.userRole);
    console.log("devolucion token:", verifiedJWT);
    next();
  } catch (error) {
    res
      .status(StatusCodes.UNAUTHORIZED)
      .json(createError("unauthorized", "Invalid jwt"));
    return;
  }
};

module.exports = { authMiddleware };
