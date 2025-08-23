const express = require("express")

const router = express.Router();
const {fetchUsers} = require("../controllers/userController")

router.get("/getAllUsers",fetchUsers);

module.exports = router;