const express = require("express");
const multer = require("multer");
const {
  getUser,
  updateUser,
  updateUserPassword,
  getUserWishlist,
  getUserProperties,
  updateUserWishlist,
  getUserPromotePropery,
  updateProperty,
  updateUserFunds,
  updateUserFundsAfterPromote,
  getProfileUser,
} = require("../controllers/users");
const verifyToken = require("../verifyToken");
const router = express.Router();

const fileStorageEngine = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./public/images/avatars");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "--" + file.originalname);
  },
});

let upload = multer({ storage: fileStorageEngine });

router.get("/wishlist/:id", (req, res) => {
  return getUserWishlist(req, res);
});

router.get("/promote/:id", (req, res) => {
  return getUserPromotePropery(req, res);
});

router.get("/my-properties/:id", (req, res) => {
  return getUserProperties(req, res);
});

router.patch("/update-wishlist/:id", (req, res) => {
  return updateUserWishlist(req, res);
});

router.patch("/deposit-funds/:id", (req, res) => {
  return updateUserFunds(req, res);
});

router.get("/profile-user/:id", (req, res) => {
  return getProfileUser(req, res);
});

router.get("/:id", verifyToken, (req, res) => {
  return getUser(req, res);
});

router.put("/:id", verifyToken, upload.single("avatar"), (req, res) => {
  return updateUser(req, res);
});

router.patch("/security/:id", (req, res) => {
  return updateUserPassword(req, res);
});

module.exports = router;
