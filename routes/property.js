const { getSingleProperty } = require("../controllers/property");

const router = require("express").Router();

router.route("/:id").get(getSingleProperty);

module.exports = router;
