const express = require('express');
const AdminNotifications = require('../../models/adminNotifications');
const router = express.Router();

// Fetch notifications for the logged-in admin
router.get("/", async (req, res) => {
  try {
    const notifications = await AdminNotifications.find().sort({ createdAt: -1 });
    res.json(notifications);
  } catch (error) {
    res.status(500).json({ message: "Error fetching notifications" });
  }
});

// Mark notification as read
router.put("/:id/read", async (req, res) => {
  try {
    await AdminNotifications.findByIdAndUpdate(req.params.id, { isRead: true });
    res.json({ message: "Notification marked as read" });
  } catch (error) {
    res.status(500).json({ message: "Error updating notification" });
  }
});

// Delete a notification
router.delete("/:id", async (req, res) => {
  try {
    await AdminNotifications.findByIdAndDelete(req.params.id);
    res.json({ message: "Notification deleted" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting notification" });
  }
});

module.exports = router;
