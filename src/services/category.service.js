const Category = require('../models/category.model');
const { StatusCodes } = require('http-status-codes');
const buildCategoryDTOResponse = require('../dtos/category.response.dto')

const getCategories = async () => {
    const categories = await Category.find();

    if (!categories) {
        return null;
    }

    const categoriesResponse = categories.map(category => buildCategoryDTOResponse(category));
    return categoriesResponse;
}

module.exports = {
    getCategories
};
