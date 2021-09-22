const {
  getCreditCards,
  postCreditCard,
  deleteCreditCard,
} = require("../controllers/creditCards");

const router = require("express").Router();

router.get("/credit-cards/:id", (req, res) => {
  return getCreditCards(req, res);
});

router.post("/credit-cards/:id", (req, res) => {
  return postCreditCard(req, res);
});

router.delete("/credit-cards/:id", (req, res) => {
  return deleteCreditCard(req, res);
});

module.exports = router;
