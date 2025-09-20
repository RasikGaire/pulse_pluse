const express = require("express");
const router = express.Router();
const bloodBankController = require("../controller/bloodBank.js");
const { verify, verifyAdmin } = require("../auth.js");

// Blood Bank routes
router.get("/", bloodBankController.getAllBloodBanks);
router.get("/search", bloodBankController.searchBloodBanksByType);
router.get("/availability-summary", bloodBankController.getBloodAvailabilitySummary);
router.get("/:id", bloodBankController.getBloodBankById);
router.post("/create", verify, verifyAdmin, bloodBankController.createBloodBank);
router.put("/:id/inventory", verify, verifyAdmin, bloodBankController.updateBloodInventory);

module.exports = router;