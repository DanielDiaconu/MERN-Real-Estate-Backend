const Notification = require("../models/Notification");
const User = require("../models/User");

exports.getNotifications = async (req, res) => {
  let { id } = req.params;
  try {
    const notifications = await Notification.find({
      userId: id,
    })
      .sort({ createdAt: "desc" })
      .limit(6);
    const total = await Notification.countDocuments({
      userId: id,
      readStatus: false,
    });
    res.status(200).json({ results: notifications, total: total });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.patchNotifications = async (req, res) => {
  let { id } = req.params;
  try {
    const notifications = await Notification.updateMany(
      {
        userId: id,
        readStatus: false,
      },
      {
        $set: { readStatus: true },
      }
    );
    res.status(200).json(notifications);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.getUserNotifications = async (req, res) => {
  let { id } = req.params;
  try {
    let query = Notification.find({ userId: id });

    const total = await Notification.countDocuments({ userId: id });
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    query = query.skip(skip).limit(limit);

    const notifications = await query;
    res.status(200).json({ results: notifications, total: total });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
