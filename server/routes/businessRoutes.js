const express = require("express");
const router = express.Router();
const {businessRegistration,fetchBusiness,adminUpdateBusiness,ownerFetchAllBusinesses, getBusinessById,ownerUpdateBusiness} = require("../controllers/businessController");

//admin routes
router.post("/register-business", businessRegistration);
router.get("/get-all-businesses",fetchBusiness);
router.put("/admin-update-business/:id",adminUpdateBusiness);
//owner routes
router.get("/owners-businesses/:id",ownerFetchAllBusinesses);
router.get("/business/:businessId",getBusinessById);
router.put("/owner-update/:businessId", ownerUpdateBusiness)


module.exports= router;