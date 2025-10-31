const { createError } = require("../utils/error");
const StatusCodes = require("http-status-codes");
const jwt = require("jsonwebtoken");
const loginSchema = require("../validators/login.schema");

const usersService = require("../services/users.service");

// (1) explicar
const User = require("../models/user.model");

const login = async (req, res) => {
  const { body } = req;

  if (!body) {
    res
      .status(StatusCodes.BAD_REQUEST)
      .json(createError("bad_request", "Invalid body"));
    return;
  }

  const { error } = loginSchema.validate(body);

  if (error) {
    const errorMessage = error.details[0].message;
    res
      .status(StatusCodes.BAD_REQUEST)
      .json(createError("bad_request", errorMessage));
    return;
  }

 
  const token = await usersService.doLogin(body);

  

  if (!token) {
    res
      .status(StatusCodes.UNAUTHORIZED)
      .json(createError("unauthorized", "Invalid credentials"));
    return;
  }

  

  res.status(StatusCodes.OK).json({ token: token });
};

module.exports = login;
