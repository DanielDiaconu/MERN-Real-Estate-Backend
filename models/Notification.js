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
  readStatus: {
    type: Boolean,
    default: false,
  },
  notificationType: {
    type: String,
  },
  target: {
    parentEntity: {
      type: String,
    },
    entity: {
      type: String,
    },
  },
});

module.exports = mongoose.model("Notification", notificationsSchema);
