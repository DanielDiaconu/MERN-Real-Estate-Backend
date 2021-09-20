const mongoose = require("mongoose");

const citiesSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  cityIcon: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("City", citiesSchema);
