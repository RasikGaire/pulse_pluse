const express = require("express");
const router = express.Router();
const userController = require("../controller/user.js");
const { verify, isLoggedIn, verifyAdmin } = require("../auth.js")




router.post("/register",userController.registerUser);
router.post("/login", userController.loginUser);

// Profile routes
router.get("/profile", verify, userController.getProfile);
router.put("/profile", verify, userController.updateProfile);
router.put("/profile/password", verify, userController.changePassword);

// Donor routes
router.get("/donors", userController.getAllDonors);
router.get("/donors/search", userController.searchDonors);

// wahahaha 


module.exports = router;