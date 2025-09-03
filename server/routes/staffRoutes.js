const express = require("express");
const router = express.Router();
const {registerStaff,fetchStaff,updateStaff,reactivateStaff, deleteStaff} = require("../controllers/staffController");

router.post("/register-staff", registerStaff);
router.get("/get-staff/:businessId",fetchStaff);
router.put("/update/:id",updateStaff);

router.delete("/delete/:id", deleteStaff);
router.patch("/reactivate/:id",reactivateStaff);

module.exports= router;