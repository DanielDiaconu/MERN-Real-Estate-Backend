const router = require("express").Router();
const { getReplies, postReply } = require("../controllers/replies");

router.get("/replies", (req, res) => {
  return getReplies(req, res);
});

router.post("/replies", (req, res) => {
  return postReply(req, res);
});

module.exports = router;
