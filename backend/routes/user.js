const express = require("express");
const router = express.Router();
const userController = require("../controller/user.js");
const { verify, isLoggedIn, verifyAdmin } = require("../auth.js")




router.post("/register",userController.registerUser);
router.post("/login", userController.loginUser);


// wahahaha 


module.exports = router;