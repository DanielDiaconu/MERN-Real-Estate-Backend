const router = require("express").Router();
const {
  getReplies,
  postReply,
  updateReplyLike,
  updateReplyDislike,
} = require("../controllers/replies");

router.get("/replies", (req, res) => {
  return getReplies(req, res);
});

router.post("/replies", (req, res) => {
  return postReply(req, res);
});

router.patch("/reply-like/:id", (req, res) => {
  return updateReplyLike(req, res);
});

router.patch("/reply-dislike/:id", (req, res) => {
  return updateReplyDislike(req, res);
});

module.exports = router;
