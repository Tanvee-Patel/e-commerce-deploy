const mongoose = require('mongoose')

const adminNotificationsSchema = new mongoose.Schema({
   userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
   message: { type: String, required: true },
   isRead: { type: Boolean, default: false },
   createdAt: { type: Date, default: Date.now },
})

module.exports = mongoose.model("AdminNotifications", adminNotificationsSchema)