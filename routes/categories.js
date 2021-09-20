const { getCategories } = require("../controllers/categories");

const router = require("express").Router();

router.route("/categories").get(getCategories);

module.exports = router;
