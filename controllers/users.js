const User = require("../models/User");
const bcrypt = require("bcryptjs");
const Property = require("../models/Property");
const ObjectId = require("mongodb").ObjectId;
const CreditCard = require("../models/CreditCard");
const Review = require("../models/Review");

exports.getUser = async (req, res) => {
  let { id } = req.params;
  try {
    const user = await User.findById(id).select("-password -creditCards");
    res.status(200).json(user);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.getProfileUser = async (req, res) => {
  let { id } = req.params;
  let filters = { profileUser: id };
  if (req.query.highlight) {
    filters._id = { $ne: req.query.highlight };
  }

  try {
    const user = await User.findById(id).select(
      "avatar name email phone reviews bio fullName rating"
    );
    let query = Review.find(filters).populate({
      path: "userId",
      select: ["fullName", "avatar"],
    });

    if (req.query.sort) {
      if (req.query.sort[0] === "-") {
        query = query.sort(req.query.sort);
      } else {
        query = query.sort(req.query.sort);
      }
    }

    const total = await Review.count({ profileUser: id });
    const page = parseInt(req.query.page) || 1;
    const limit = req.query.highlight && page === 1 ? 3 : 4;
    const skip = (page - 1) * limit;

    query = query.skip(skip).limit(limit);

    const reviews = await query;

    res.status(200).json({ user: user, reviews: reviews, total });
  } catch (error) {
    res.status(400).json({ message: error });
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
    let query = Property.find({
      _id: {
        $in: user.myProperties,
      },
    })
      .populate({ path: "cityId", select: "name" })
      .select("-gallery -amenities ");

    const total = await Property.countDocuments({
      _id: {
        $in: user.myProperties,
      },
    });
    if (req.query.page) {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 4;
      const skip = (page - 1) * limit;
      query = query.skip(skip).limit(limit);
    }

    const properties = await query;

    res.status(200).json({ properties: properties, total: total });
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
    const user = await User.findOneAndUpdate({ _id: id }, req.body, {
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

exports.updateUserFunds = async (req, res) => {
  let { id } = req.params;

  try {
    await User.findOneAndUpdate(
      { _id: id },
      { $inc: { funds: parseInt(req.body.funds) } },
      {
        new: true,
      }
    );
    await CreditCard.findByIdAndUpdate(req.body.cardId, {
      $inc: { funds: -req.body.funds },
    });
    res.status(200).json({ message: "Funds has been successfully added!" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
