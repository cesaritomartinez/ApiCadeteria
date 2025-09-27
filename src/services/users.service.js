const User = require("../models/user.model");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { StatusCodes } = require("http-status-codes");
const buildUserDTOResponse = require("../dtos/user.response.dto");

const doLogin = async ({ username, password }) => {
  const user = await User.findOne({ username }).select("+password");

  if (!user) {
    console.log("Usuario no encontrado:", username);
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

  // return {
  //   username: user.username,
  //   name: user.nombre,
  //   userId: user,
  //   role: user.role,
  // };
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
    console.log("Error saving user in database", error);
    let e = new Error("error saving user in database");
    e.status = "internal_server_error";
    e.code = StatusCodes.INTERNAL_SERVER_ERROR;
    throw e;
  }
};



module.exports = {
  doLogin,
  registerUser,
};
