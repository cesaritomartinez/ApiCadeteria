const User = require("../models/user.model");
const Envio = require("../models/envio.model");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { StatusCodes } = require("http-status-codes");
const buildUserDTOResponse = require("../dtos/user.response.dto");

// Límite de envíos pendientes para plan plus
const MAX_PLAN_PLUS = parseInt(process.env.MAX_PLAN_PLUS) || 10;

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
    plan: user.plan,
  },
  process.env.JWT_SECRET,
  { expiresIn: "1h" }
);

 
  return { token: token, user: buildUserDTOResponse(user) };
};

const registerUser = async ({ username, password, nombre, apellido, email, imageUrl, empresa }) => {
  if (await getUserByUserName(username)) {
    const error = new Error("user already exists");
    error.status = "conflict";
    error.code = StatusCodes.CONFLICT;
    throw error;
  }

  if (await getUserByEmail(email)) {
    const error = new Error("mail already exists");
    error.status = "conflict";
    error.code = StatusCodes.CONFLICT;
    throw error;
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = new User({
    username,
    password: hashedPassword,
    nombre,
    apellido,
    email,
    imageUrl: imageUrl || "",
    empresa: empresa || "",
  });

  try {
    const savedUser = await newUser.save();

    // ⚠️ Asegurate que el DTO NO incluya password
    const userDTO = buildUserDTOResponse(savedUser); 
    // Debe tener al menos: id, username, nombre, apellido, email, role, plan

    // 🎯 Mismo estilo que tu doLogin (agregamos plan por consistencia)
    const tokenStr = jwt.sign(
      {
        username: userDTO.username,
        name: userDTO.nombre,
        userId: userDTO.id,
        role: userDTO.role,
        plan: userDTO.plan, // si tu DTO lo incluye; si no, usar savedUser.plan
      },
      process.env.JWT_SECRET,
      { expiresIn: "1h" } // podés usar "7d" si querés sesión más larga
    );

    // ✅ Devolver MISMO FORMATO que el login
    return {
      token: {
        token: tokenStr,
        user: userDTO,
      },
    };
  } catch (error) {
    const e = new Error("error saving user in database");
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

const downgradeUserPlan = async (userId) => {
  try {
    const user = await User.findById(userId);

    if (!user) {
      const error = new Error("Usuario no encontrado");
      error.status = "not_found";
      error.code = StatusCodes.NOT_FOUND;
      throw error;
    }

    // Validar que el usuario esté en plan "premium"
    if (user.plan !== "premium") {
      const error = new Error(
        "Solo los usuarios con plan 'premium' pueden cancelar a 'plus'"
      );
      error.status = "bad_request";
      error.code = StatusCodes.BAD_REQUEST;
      throw error;
    }

    // Validar que el usuario no tenga más de 10 envíos pendientes
    const enviosPendientes = await Envio.countDocuments({
      user: userId,
      estado: "pendiente"
    });

    if (enviosPendientes > MAX_PLAN_PLUS) {
      const error = new Error(
        `No puedes cancelar tu plan premium porque tienes ${enviosPendientes} envíos pendientes. El plan plus solo permite hasta ${MAX_PLAN_PLUS} envíos pendientes.`
      );
      error.status = "bad_request";
      error.code = StatusCodes.BAD_REQUEST;
      throw error;
    }

    // Actualizar el plan a plus
    user.plan = "plus";
    const updatedUser = await user.save();

    return buildUserDTOResponse(updatedUser);
  } catch (error) {
    throw error;
  }
};

const getAllUsers = async () => {
  try {
    const users = await User.find()
      .select('-password') // Excluir password por seguridad
      .sort({ fechaCreacion: -1 }); // Ordenar por más recientes primero

    return users.map(user => buildUserDTOResponse(user));
  } catch (error) {
    const err = new Error("Error obteniendo usuarios de la base de datos");
    err.status = "internal_server_error";
    err.code = StatusCodes.INTERNAL_SERVER_ERROR;
    throw err;
  }
};

const updateUserImageUrl = async (userId, imageUrl) => {
  try {
    const user = await User.findById(userId);

    if (!user) {
      const error = new Error("Usuario no encontrado");
      error.status = "not_found";
      error.code = StatusCodes.NOT_FOUND;
      throw error;
    }

    user.imageUrl = imageUrl;
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
  downgradeUserPlan,
  getAllUsers,
  updateUserImageUrl,
};
