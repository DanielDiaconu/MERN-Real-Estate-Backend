const Property = require("../models/Property");
const User = require("../models/User");

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
  console.log(id, req.body);
  try {
    await Property.findOneAndUpdate(
      {
        _id: id,
      },
      {
        standard: req.body.data.standard,
        pro: req.body.data.pro,
        premium: req.body.data.premium,
      }
    );

    await User.findOneAndUpdate(
      { _id: req.body.userId },
      {
        $inc: { funds: -req.body.funds },
      }
    );

    res.send(200);
  } catch (error) {
    res.status(400).json({ message: error });
  }
};
