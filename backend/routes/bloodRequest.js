const express = require("express");
const router = express.Router();
const bloodRequestController = require("../controller/bloodRequest.js");
const { verify } = require("../auth.js");

// Blood Request routes
router.post("/create", verify, bloodRequestController.createBloodRequest);
router.get("/", bloodRequestController.getAllBloodRequests);
router.get("/my-requests", verify, bloodRequestController.getUserBloodRequests);
router.get("/search-donors", bloodRequestController.searchCompatibleDonors);
router.get("/:id", bloodRequestController.getBloodRequestById);
router.put("/:id/status", verify, bloodRequestController.updateBloodRequestStatus);

// Donor response routes
router.post("/:id/respond", verify, bloodRequestController.respondToBloodRequest);
router.get("/:id/responses", verify, bloodRequestController.getBloodRequestResponses);

module.exports = router;