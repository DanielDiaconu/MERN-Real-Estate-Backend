const router = require("express").Router();
const {
  getReplies,
  postReply,
  updateReplyLike,
  updateReplyDislike,
  deleteReply,
} = require("../controllers/replies");

router.get("/replies", (req, res) => {
  return getReplies(req, res);
});

router.post("/replies", (req, res) => {
  return postReply(req, res);
});

router.delete("/replies/:id", (req, res) => {
  return deleteReply(req, res);
});

router.patch("/reply-like/:id", (req, res) => {
  return updateReplyLike(req, res);
});

router.patch("/reply-dislike/:id", (req, res) => {
  return updateReplyDislike(req, res);
});

module.exports = router;
