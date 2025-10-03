const mongoose = require("mongoose");
const categorySchema = require("../repositories/category.schema");

const Category = mongoose.model("Category", categorySchema);

module.exports = Category;
