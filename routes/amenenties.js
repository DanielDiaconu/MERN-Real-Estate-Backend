const { getAmeneties } = require("../controllers/ameneties");

const router = require("express").Router();

router.route("/ameneties").get(getAmeneties);
module.exports = router;
