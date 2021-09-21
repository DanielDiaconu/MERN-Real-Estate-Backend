const Property = require("../models/Property");

exports.getSingleProperty = async (req, res, next) => {
  let { id } = req.params;

  try {
    const property = await Property.findOneAndUpdate(
      { _id: id },
      {
        $inc: { views: 1 },
      }
    )
      .populate({
        path: "categoryId",
        select: ["name"],
      })
      .populate({ path: "cityId", select: ["name"] })
      .populate({
        path: "ownerId",
        select: ["firstName", "lastName", "email"],
      })
      .populate({ path: "amenities" });
    res.status(200).json(property);
  } catch (error) {
    res.json({ message: error });
  }
};

exports.updateProperty = async (req, res) => {
  let { id } = req.params;

  try {
    const property = await Property.findOneAndUpdate(
      {
        _id: id,
      },
      {
        standard: req.body.standard,
        pro: req.body.pro,
        premium: req.body.premium,
      },
      { new: true }
    );
    res.status(200).json(property);
  } catch (error) {
    res.status(400).json({ message: error });
  }
};
