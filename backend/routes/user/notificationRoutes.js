const express = require('express');
const Notifications = require('../../models/notifications');
const router = express.Router();

router.get("/get", async (req, res) => {
  try {
    const notifications = await Notifications.find().sort({ createdAt: -1 });
    res.json(notifications);
  } catch (error) {
    res.status(500).json({ message: "Error fetching notifications" });
  }
});

router.put("/:id/read", async (req, res) => {
  try {
    await Notifications.findByIdAndUpdate(req.params.id, { isRead: true });
    res.json({ message: "Notification marked as read" });
  } catch (error) {
    res.status(500).json({ message: "Error updating notification" });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    await Notifications.findByIdAndDelete(req.params.id);
    res.json({ message: "Notification deleted" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting notification" });
  }
});

module.exports = router;
