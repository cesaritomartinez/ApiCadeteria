const mongoose = require("mongoose");
const userSchema = require("../repositories/user.schema");

const User = mongoose.model("User", userSchema);

module.exports = User;
