const express = require("express");
const router = express.Router();
const {verify} = require("../auth.js");
const {
    getUserNotifications,
    markAsRead,
    markAllAsRead,
    dismissNotification,
    clickNotification,
    getNotificationStats
} = require("../controller/notification.js");

// [ROUTE] GET /api/notifications - Get user notifications (Protected)
router.get("/", verify, getUserNotifications);

// [ROUTE] GET /api/notifications/stats - Get notification statistics (Protected)
router.get("/stats", verify, getNotificationStats);

// [ROUTE] PUT /api/notifications/mark-all-read - Mark all notifications as read (Protected)
router.put("/mark-all-read", verify, markAllAsRead);

// [ROUTE] PUT /api/notifications/:id/read - Mark notification as read (Protected)
router.put("/:id/read", verify, markAsRead);

// [ROUTE] PUT /api/notifications/:id/click - Track notification click (Protected)
router.put("/:id/click", verify, clickNotification);

// [ROUTE] PUT /api/notifications/:id/dismiss - Dismiss notification (Protected)
router.put("/:id/dismiss", verify, dismissNotification);

module.exports = router;