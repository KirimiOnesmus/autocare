const express = require("express");
const router = express.Router();
const {registerService,getServices,updateService,deleteServices} = require("../controllers/servicesController")

router.post("/add-service", registerService);

router.get("/getService/:businessId", getServices); 

router.put("/update/:id", updateService); 

router.delete("/delete/:id", deleteServices);

module.exports = router;