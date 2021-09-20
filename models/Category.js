const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  iconName: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("Category", categorySchema);
