const User = require("../models/User");
const bcrypt = require("bcryptjs");
const Property = require("../models/Property");
const ObjectId = require("mongodb").ObjectId;

exports.getUser = async (req, res) => {
  let { id } = req.params;
  try {
    const user = await User.findById(id).select("-password -creditCards");
    res.status(200).json(user);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.getUserWishlist = async (req, res) => {
  let { id } = req.params;
  try {
    const user = await User.findById(id);
    const wishlist = await Property.find({
      _id: {
        $in: user.wishlist,
      },
    })
      .populate({ path: "cityId", select: "name" })
      .select("-gallery -amenities ");

    res.status(200).json(wishlist);
  } catch (error) {
    res.status(400).json({ message: error });
  }
};

exports.updateUserWishlist = async (req, res) => {
  let { id } = req.params;
  try {
    const user = await User.findOneAndUpdate(
      {
        _id: id,
      },
      {
        $set: {
          wishlist:
            req.body.length > 0
              ? req.body.map((item) => ObjectId(item))
              : req.body,
        },
      },
      { new: true }
    );
    res.status(200).json(user.wishlist);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.getUserProperties = async (req, res) => {
  let { id } = req.params;
  try {
    const user = await User.findById(id);
    const properties = await Property.find({
      _id: {
        $in: user.myProperties,
      },
    })
      .populate({ path: "cityId", select: "name" })
      .select("-gallery -amenities ");

    res.status(200).json(properties);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.updateUser = async (req, res) => {
  let { id } = req.params;
  try {
    if (req.file) {
      req.body.avatar = req.file.filename;
    }
    const user = await User.findOneAndUpdate(id, req.body, {
      new: true,
    }).select("-password");
    res.status(200).json(user);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.updateUserPassword = async (req, res) => {
  let { id } = req.params;

  const user = await User.findById(id);

  const hashedPass = user.password;
  const plainPass = req.body.password;

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(req.body.password, salt);

  try {
    await User.findOneAndUpdate(
      { _id: id },
      {
        $set: {
          password: hashedPassword,
        },
      }
    );
    res
      .status(200)
      .json({ message: "Password has been updated successfully!" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.getUserPromotePropery = async (req, res) => {
  let { id } = req.params;

  try {
    const property = await Property.findById(id);
    res.status(200).json(property);
  } catch (error) {
    res.status(400).json({ message: error });
  }
};
