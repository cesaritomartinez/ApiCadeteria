const { createError } = require("../utils/error");
const StatusCodes = require("http-status-codes");
const createUserSchema = require("../validators/create.user.schema");

const usersService = require("../services/users.service");

const signup = async (req, res) => {
  const { body } = req;

  if (!body) {
    res
      .status(StatusCodes.BAD_REQUEST)
      .json(createError("bad_request", "Invalid body"));
    return;
  }

  const { error } = createUserSchema.validate(body);

  if (error) {
    const errorMessage = error.details[0].message;
    res
      .status(StatusCodes.BAD_REQUEST)
      .json(createError("bad_request", errorMessage));
    return;
  }

  try {
    const newUser = await usersService.registerUser(body);
    res.status(StatusCodes.CREATED).json(newUser);
  } catch (error) {
    if (error.status === "conflict") {
      res
        .status(StatusCodes.CONFLICT)
        .json(createError("conflict", error.message));
    } else {
      res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json(createError("internal_server_error", error.message));
    }
  }
};

module.exports = signup;
