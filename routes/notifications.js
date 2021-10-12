const {
  getNotifications,
  patchNotifications,
  getUserNotifications,
} = require("../controllers/notifications");

const router = require("express").Router();

router.get("/:id", (req, res) => {
  return getNotifications(req, res);
});

router.get("/user/:id", (req, res) => {
  return getUserNotifications(req, res);
});

router.patch("/:id", (req, res) => {
  return patchNotifications(req, res);
});

module.exports = router;
