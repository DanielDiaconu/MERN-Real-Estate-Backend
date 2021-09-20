const City = require("../models/City");

exports.getCities = async (req, res) => {
  try {
    const cities = await City.find();
    res.status(200).json(cities);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
