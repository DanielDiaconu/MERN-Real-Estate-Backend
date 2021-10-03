const { postReview, deleteReview } = require("../controllers/reviews");

const router = require("express").Router();

router.post("/", (req, res) => {
  return postReview(req, res);
});

router.delete("/:id", (req, res) => {
  return deleteReview(req, res);
});

module.exports = router;
