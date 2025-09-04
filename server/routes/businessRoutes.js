const express = require("express");
const router = express.Router();
const {
    businessRegistration,
    fetchBusiness,
    adminUpdateBusiness,
    ownerFetchAllBusinesses, 
    getBusinessById,
    ownerUpdateBusiness,
    busines_hours,
    getAllBusiness,
    getCustomerBussinessById
} = require("../controllers/businessController");

//admin routes
router.post("/register-business", businessRegistration);
router.get("/get-all-businesses",fetchBusiness);
router.put("/admin-update-business/:id",adminUpdateBusiness);
//owner routes
router.get("/owners-businesses/:id",ownerFetchAllBusinesses);
router.get("/business/:businessId",getBusinessById);
router.put("/owner-update/:businessId", ownerUpdateBusiness);
router.put("/business-hours/:businessId", busines_hours);
// customer
router.get("/businesses", getAllBusiness);
router.get("/businesses/:id", getCustomerBussinessById)



module.exports= router;