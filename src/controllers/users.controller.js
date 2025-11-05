const { createError } = require('../utils/error');
const { StatusCodes } = require('http-status-codes');
const usersService = require('../services/users.service');
const updatePlanSchema = require('../validators/update.plan.schema');

const updatePlan = async (req, res) => {
  try {
    const userRole = req.userRole; // Viene del middleware de autenticación

    // Validar que solo los admin pueden cambiar planes
    if (userRole !== 'admin') {
      return res.status(StatusCodes.FORBIDDEN).json(
        createError('forbidden', 'Solo los administradores pueden cambiar planes de usuario')
      );
    }

    // Validar el body con Joi
    const { error, value } = updatePlanSchema.validate(req.body);
    if (error) {
      return res.status(StatusCodes.BAD_REQUEST).json(
        createError('bad_request', error.details[0].message)
      );
    }

    const { userId } = value;
    const updatedUser = await usersService.updateUserPlan(userId);

    res.status(StatusCodes.OK).json(updatedUser);
  } catch (error) {
    res.status(error.code || StatusCodes.INTERNAL_SERVER_ERROR).json(
      createError(error.status, error.message)
    );
  }
};

const upgradePlan = async (req, res) => {
  try {
    const userId = req.userId; // Usuario autenticado desde el middleware
    const updatedUser = await usersService.updateUserPlan(userId);
    res.status(StatusCodes.OK).json(updatedUser);
  } catch (error) {
    res.status(error.code || StatusCodes.INTERNAL_SERVER_ERROR).json(
      createError(error.status, error.message)
    );
  }
};

const downgradePlan = async (req, res) => {
  try {
    const userId = req.userId; // Usuario autenticado desde el middleware
    const updatedUser = await usersService.downgradeUserPlan(userId);
    res.status(StatusCodes.OK).json(updatedUser);
  } catch (error) {
    res.status(error.code || StatusCodes.INTERNAL_SERVER_ERROR).json(
      createError(error.status, error.message)
    );
  }
};

const getAllUsers = async (req, res) => {
  try {
    const userRole = req.userRole;

    // Solo admin puede obtener la lista de usuarios
    if (userRole !== 'admin') {
      return res.status(StatusCodes.FORBIDDEN).json(
        createError('forbidden', 'Solo los administradores pueden ver la lista de usuarios')
      );
    }

    const users = await usersService.getAllUsers();
    res.status(StatusCodes.OK).json(users);
  } catch (error) {
    res.status(error.code || StatusCodes.INTERNAL_SERVER_ERROR).json(
      createError(error.status, error.message)
    );
  }
};

module.exports = { updatePlan, upgradePlan, downgradePlan, getAllUsers };
