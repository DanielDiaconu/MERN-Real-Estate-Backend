const router = require("express").Router();
const { getQuestions, postQuestion } = require("../controllers/questions");

router.get("/questions/:id", (req, res) => {
  return getQuestions(req, res);
});

router.post("/question", (req, res) => {
  return postQuestion(req, res);
});

module.exports = router;
