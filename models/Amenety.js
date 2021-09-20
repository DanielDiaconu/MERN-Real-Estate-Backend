const mongoose = require("mongoose");

const amenetySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  icon: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("Amenety", amenetySchema);
