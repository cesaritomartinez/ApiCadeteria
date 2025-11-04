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

// Usuarios - Cambio de plan
router.put("/users/plan", updatePlan); // Admin cambia plan de cualquier usuario
router.post("/users/upgrade-plan", upgradePlan); // Usuario cambia su propio plan
router.post("/users/downgrade-plan", downgradePlan); // Usuario cancela su plan premium

module.exports = router;
