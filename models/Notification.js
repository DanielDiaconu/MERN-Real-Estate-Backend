const mongoose = require("mongoose");

const notificationsSchema = new mongoose.Schema({
  body: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
});

module.exports = mongoose.model("Notification", notificationsSchema);
