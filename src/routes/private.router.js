const express = require("express");
const router = express.Router();
const { authMiddleware } = require("../middlewares/auth.middleware");
const {
  registerEnvio,
  getAllEnvios,
  getEnvioById,
  deleteEnvio,
  updateEnvio,
} = require("../controllers/envios.controller");
const {
  updatePlan,
  upgradePlan,
  downgradePlan,
  getAllUsers,
  updateMyImage,
} = require("../controllers/users.controller");

// Aplicar middleware de autenticación a todas las rutas privadas
router.use(authMiddleware);

// Endpoint para agregar un nuevo env�o
router.post("/envios", registerEnvio);

// Listado envios con filtros opcionales
router.get("/envios", getAllEnvios);

router.get("/envios/:id", getEnvioById);

router.put("/envios/:id", updateEnvio);

router.delete("/envios/:id", deleteEnvio); // Eliminar envios

// Usuarios - Gestión
router.get("/users", getAllUsers); // Admin obtiene lista de usuarios
router.put("/users/plan", updatePlan); // Admin cambia plan de cualquier usuario
router.post("/users/upgrade-plan", upgradePlan); // Usuario cambia su propio plan
router.post("/users/downgrade-plan", downgradePlan); // Usuario cancela su plan premium
// Usuarios - Actualizar SOLO la foto del usuario autenticado
router.put("/users/me/image", updateMyImage);

module.exports = router;
