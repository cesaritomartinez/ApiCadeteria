const express = require("express");

const signup = require("../controllers/signup.controller");

const router = express.Router();

router.post("/signup", signup);

module.exports = router;
