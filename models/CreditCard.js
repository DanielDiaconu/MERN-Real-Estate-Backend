const mongoose = require("mongoose");

const creditCardSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  number: {
    type: String,
    required: true,
  },
  month: {
    type: String,
    required: true,
  },
  year: {
    type: String,
    required: true,
  },
  cvv: {
    type: Number,
    required: true,
  },
  funds: {
    type: Number,
  },
});

module.exports = mongoose.model("CreditCard", creditCardSchema);
