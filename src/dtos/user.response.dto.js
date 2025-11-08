const buildUserDTOResponse = (user) => {
  return {
    id: user._id,
    username: user.username,
    email: user.email,
    nombre: user.nombre,
    apellido: user.apellido,
    role: user.role,
    plan: user.plan,
    imageUrl: user.imageUrl || "",
    fechaCreacion: user.createdAt,
    fechaActualizacion: user.updatedAt,
  };
};

module.exports = buildUserDTOResponse;
