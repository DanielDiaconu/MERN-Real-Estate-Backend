const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
    max: 1024,
  },
  phone: {
    type: String,
    default: "",
  },
  address: {
    type: String,
    default: "",
  },
  avatar: {
    type: String,
    default: "1632580083413--02.jpg",
  },
  bio: {
    type: String,
    default: "",
  },
  wishlist: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Property",
    },
  ],
  myProperties: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Property",
    },
  ],
  funds: {
    type: Number,
    default: 50,
  },
  creditCards: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "CreditCard",
    },
  ],
});

module.exports = mongoose.model("User", userSchema);
