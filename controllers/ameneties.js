const Amenety = require("../models/Amenety");

exports.getAmeneties = async (req, res) => {
  try {
    const ameneties = await Amenety.find();
    res.status(200).json(ameneties);
  } catch (error) {
    res.status(400).json({ message: error });
  }
};
