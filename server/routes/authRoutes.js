const verify = require("../middleware/authMiddleware");
const {registerUser,loginUser,updateCustomerProfile,getCustomerProfile} = require("../controllers/authController");
const express = require ("express");
const router = express.Router();

router.post("/login",loginUser);
router.post("/register",registerUser);
router.get("/profile",getCustomerProfile);
router.patch("/profile/:id",updateCustomerProfile);

module.exports =router;
