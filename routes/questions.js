const router = require("express").Router();
const {
  getQuestions,
  postQuestion,
  updateQuestionLikes,
  updateQuestionDislikes,
  deleteQuestion,
  updateQuestionAnsweredState,
  getHighlightedQuestion,
} = require("../controllers/questions");

router.get("/questions/:id", (req, res) => {
  return getQuestions(req, res);
});

router.get("/highlighted-question/:id", (req, res) => {
  return getHighlightedQuestion(req, res);
});

router.delete("/question/:id", (req, res) => {
  return deleteQuestion(req, res);
});

router.post("/question", (req, res) => {
  return postQuestion(req, res);
});

router.patch("/question-answered/:id", (req, res) => {
  return updateQuestionAnsweredState(req, res);
});

router.patch("/question-like/:id", (req, res) => {
  return updateQuestionLikes(req, res);
});

router.patch("/question-dislikes/:id", (req, res) => {
  return updateQuestionDislikes(req, res);
});

module.exports = router;
