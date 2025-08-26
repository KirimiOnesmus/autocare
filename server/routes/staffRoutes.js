const express = require("express");
const router = express.Router();
const {registerStaff,fetchStaff} = require("../controllers/staffController");

router.post("/register-staff", registerStaff);
router.get("/get-staff/:ids",fetchStaff);

module.exports= router;