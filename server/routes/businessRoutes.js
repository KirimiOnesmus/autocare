const express = require("express");
const router = express.Router();
const {businessRegistration} = require("../controllers/businessController");

router.post("/register-business", businessRegistration);

module.exports= router;