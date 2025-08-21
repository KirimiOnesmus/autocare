const express = require("express");
const router = express.Router();
const {businessRegistration,fetchBusiness,adminUpdateBusiness} = require("../controllers/businessController");

router.post("/register-business", businessRegistration);
router.get("/get-all-businesses",fetchBusiness);
router.put("/admin-update-business/:id",adminUpdateBusiness)


module.exports= router;