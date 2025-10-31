const User = require("../models/user.model");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { StatusCodes } = require("http-status-codes");
const buildUserDTOResponse = require("../dtos/user.response.dto");

const doLogin = async ({ username, password }) => {
  const user = await User.findOne({ username }).select("+password");

  if (!user) {
    
    return null;
  }

  if (!password || !user.password) {
    return null;
  }

  const compareResult = await bcrypt.compare(password, user.password);

  if (!compareResult) {
    return null;
  }

  const token = jwt.sign(
    {
      username: user.username,
      name: user.nombre,
      userId: user._id.toString(),
      role: user.role,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "1h",
    }
  );

 
  return { token: token, user: buildUserDTOResponse(user) };
};

const registerUser = async ({
  username,
  password,
  nombre,
  apellido,
  email,
}) => {
  if (await getUserByUserName(username)) {
    let error = new Error("user already exists");
    error.status = "conflict";
    error.code = StatusCodes.CONFLICT;
    throw error;
  }

  if (await getUserByEmail(email)) {
    let error = new Error("mail already exists");
    error.status = "conflict";
    error.code = StatusCodes.CONFLICT;
    throw error;
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = new User({
    username: username,
    password: hashedPassword,
    nombre: nombre,
    apellido: apellido,
    email: email,
  });

  try {
    const savedUser = await newUser.save();
    const userDTO = buildUserDTOResponse(savedUser);
    return userDTO;
  } catch (error) {
    
    let e = new Error("error saving user in database");
    e.status = "internal_server_error";
    e.code = StatusCodes.INTERNAL_SERVER_ERROR;
    throw e;
  }
};

const getUserByUserName = async (username) =>
  await User.findOne({ username: username });

const getUserByEmail = async (email) =>
  await User.findOne({ email: email });

const updateUserPlan = async (userId) => {
  try {
    // Buscar el usuario por ID
    const user = await User.findById(userId);

    if (!user) {
      const error = new Error("Usuario no encontrado");
      error.status = "not_found";
      error.code = StatusCodes.NOT_FOUND;
      throw error;
    }

    // Validar que el usuario esté en plan "plus"
    if (user.plan !== "plus") {
      const error = new Error("Solo los usuarios con plan 'plus' pueden actualizar a 'premium'");
      error.status = "bad_request";
      error.code = StatusCodes.BAD_REQUEST;
      throw error;
    }

    // Actualizar el plan a premium
    user.plan = "premium";
    const updatedUser = await user.save();

    return buildUserDTOResponse(updatedUser);
  } catch (error) {
    throw error;
  }
};

module.exports = {
  doLogin,
  registerUser,
  updateUserPlan,
};
