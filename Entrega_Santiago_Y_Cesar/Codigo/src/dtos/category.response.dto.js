const buildCategoryDTOResponse = category => {
    return {
        id: category._id,
        name: category.name
    }
}

module.exports = buildCategoryDTOResponse
