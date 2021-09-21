const {
  getSingleProperty,
  updateProperty,
} = require("../controllers/property");

const router = require("express").Router();

router.route("/:id").get(getSingleProperty);
router.route("/promote/:id").patch(updateProperty);

module.exports = router;
