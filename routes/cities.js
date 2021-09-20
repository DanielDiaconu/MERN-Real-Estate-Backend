const { getCities } = require("../controllers/cities");

const router = require("express").Router();

router.route("/cities").get(getCities);

module.exports = router;
