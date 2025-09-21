const { createError } = require("../utils/error");
const StatusCodes = require("http-status-codes");
const jwt = require("jsonwebtoken");
const loginSchema = require("../validators/login.schema");

const { doLogin } = require("../models/bd");

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

  const user = await User.findOne({ username: body.username });
  // (1) const user = await doLogin(body);

  console.log(user);

  res.status(StatusCodes.OK).send();

  if (!user) {
    res
      .status(StatusCodes.UNAUTHORIZED)
      .json(createError("unathorize", "Invalid credentials"));
    return;
  }

  const token = jwt.sign(user, process.env.JWT_SECRET, { expiresIn: "1h" });

  res.status(StatusCodes.OK).json({ token: token });
};

module.exports = login;
