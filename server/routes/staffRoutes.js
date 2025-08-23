const express = require("express");
const router = express.Router();
const {registerStaff,fetchStaff} = require("../controllers/staffController");

router.post("/register-staff", registerStaff);
router.get("/get-staff/:ownerId",fetchStaff);

module.exports= router;