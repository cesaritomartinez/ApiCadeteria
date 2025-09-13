const { createError } = require("../utils/error");
const StatusCodes = require("http-status-codes");
const createUserSchema = require("../validators/create.user.schema");

const { createUser, getUserByUsername } = require("../models/bd");

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

  const user = getUserByUsername(body.username); //usuario o undefined

  if (user) {
    res
      .status(StatusCodes.CONFLICT)
      .json(
        createError("conflict", `username ${body.username} already exists`)
      );
    return;
  }

  const newUser = await createUser(body);

  res.status(StatusCodes.OK).json(newUser);
};

module.exports = signup;
