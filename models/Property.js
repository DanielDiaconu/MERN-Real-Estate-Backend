const { number } = require("@hapi/joi");
const mongoose = require("mongoose");

const propertiesSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  thumbnail: {
    type: String,
    required: true,
  },
  bedrooms: {
    type: Number,
    required: true,
  },
  bathrooms: {
    type: Number,
    required: true,
  },
  area: {
    type: Number,
    required: true,
  },
  built: {
    type: Number,
    required: true,
  },
  categoryId: { type: mongoose.Schema.Types.ObjectId, ref: "Category" },
  overview: {
    type: String,
    required: true,
  },
  catsAllowed: {
    type: Boolean,
    required: true,
  },
  dogsAllowed: {
    type: Boolean,
    required: true,
  },
  views: {
    type: Number,
    required: true,
  },
  publishedDate: {
    type: Date,
  },
  ownerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },

  cityId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "City",
    required: true,
  },
  amenities: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Amenety",
      required: true,
    },
  ],
  date: {
    type: Date,
    default: Date.now,
  },
  gallery: {
    type: [String],
  },
  standard: {
    type: Boolean,
    default: false,
  },
  premium: {
    type: Boolean,
    default: false,
  },
  pro: {
    type: Boolean,
    default: false,
  },
});

module.exports = mongoose.model("Property", propertiesSchema);
