const express = require("express");
const router = express.Router();
const {registerService,getServices,updateService,deleteServices} = require("../controllers/servicesController")

router.post("/add-service", registerService);

router.get("/business/:businessId", getServices); //all services

router.get("/:id",getServices); //service by id

router.put("/:id",updateService);

router.delete("/:id",deleteServices);

module.exports = router;