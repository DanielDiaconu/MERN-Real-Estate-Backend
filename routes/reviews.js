const { getHighlightedQuestion } = require("../controllers/questions");
const {
  postReview,
  deleteReview,
  getHighlitedReview,
  getHighlightedReview,
} = require("../controllers/reviews");

const router = require("express").Router();

router.get("/highlighted-review/:id", (req, res) => {
  return getHighlightedReview(req, res);
});

router.post("/", (req, res) => {
  return postReview(req, res);
});

router.delete("/:id", (req, res) => {
  return deleteReview(req, res);
});

module.exports = router;
