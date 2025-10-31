const { createError } = require('../utils/error');
const { StatusCodes } = require('http-status-codes');

const categoriesService = require('../services/category.service');

const getCategories = async (req, res) => {
    try {
        let categories = await categoriesService.getCategories();
        res.status(StatusCodes.OK).json(categories);
    } catch (error) {
        res.status(error.code || 500).json(createError(error.status, error.message));
    }
}

module.exports = { getCategories }
