const express = require("express");
const router = express.Router();
const {verify, verifyAdmin} = require("../auth.js");
const {
    createContactMessage,
    getAllContactMessages,
    getContactMessageById,
    updateContactMessageStatus,
    getContactStatistics
} = require("../controller/contact.js");

// [ROUTE] POST /api/contact - Create new contact message (Public)
router.post("/", createContactMessage);

// [ROUTE] GET /api/contact - Get all contact messages (Admin only)
router.get("/", verify, verifyAdmin, getAllContactMessages);

// [ROUTE] GET /api/contact/statistics - Get contact statistics (Admin only)
router.get("/statistics", verify, verifyAdmin, getContactStatistics);

// [ROUTE] GET /api/contact/:id - Get contact message by ID (Admin only)
router.get("/:id", verify, verifyAdmin, getContactMessageById);

// [ROUTE] PUT /api/contact/:id/status - Update contact message status (Admin only)
router.put("/:id/status", verify, verifyAdmin, updateContactMessageStatus);

module.exports = router;