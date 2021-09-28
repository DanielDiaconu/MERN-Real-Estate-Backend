const router = require("express").Router();
const {
  getQuestions,
  postQuestion,
  updateQuestionLikes,
  updateQuestionDislikes,
} = require("../controllers/questions");

router.get("/questions/:id", (req, res) => {
  return getQuestions(req, res);
});

router.post("/question", (req, res) => {
  return postQuestion(req, res);
});

router.patch("/question-like/:id", (req, res) => {
  return updateQuestionLikes(req, res);
});

router.patch("/question-dislikes/:id", (req, res) => {
  return updateQuestionDislikes(req, res);
});
module.exports = router;
