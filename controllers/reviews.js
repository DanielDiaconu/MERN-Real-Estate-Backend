const Review = require("../models/Review");
const User = require("../models/User");
const ObjectId = require("mongodb").ObjectId;

exports.postReview = async (req, res) => {
  const newReview = new Review({
    description: req.body.data.description,
    rating: req.body.data.rating,
    userId: ObjectId(req.body.currentUser),
    profileUser: ObjectId(req.body.profileUser),
  });
  try {
    const review = await newReview.save();
    const populatedReview = await Review.populate(review, {
      path: "userId",
      select: ["fullName", "avatar"],
    });
    const total = await Review.countDocuments({
      profileUser: req.body.profileUser,
    });
    const user = await User.findByIdAndUpdate(req.body.profileUser, {
      $inc: { "rating.count": review.rating },
    });
    const updatedUserRating = await User.findByIdAndUpdate(
      req.body.profileUser,
      {
        "rating.average": (user.rating.count + parseInt(review.rating)) / total,
      },
      {
        new: true,
      }
    ).select("rating");

    res.status(200).json({
      populatedReview: populatedReview,
      userRating: updatedUserRating,
      total: total,
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.deleteReview = async (req, res) => {
  let { id } = req.params;
  try {
    const review = await Review.findByIdAndDelete(id);
    const total = await Review.countDocuments({
      profileUser: req.body.profileUser,
    });
    const user = await User.findByIdAndUpdate(req.body.profileUser, {
      $inc: { "rating.count": -review.rating },
    });

    let updatedUserRating;

    if (total === 0) {
      updatedUserRating = User.findByIdAndUpdate(
        req.body.profileUser,
        {
          "rating.average": 0,
        },
        { new: true }
      );
    } else {
      updatedUserRating = User.findByIdAndUpdate(
        req.body.profileUser,
        {
          "rating.average": (user.rating.count - review.rating) / total,
        },
        { new: true }
      );
    }

    const userRating = await updatedUserRating;

    res.status(200).json({ newRating: userRating, total: total });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.getHighlightedReview = async (req, res) => {
  let { id } = req.params;

  try {
    const review = await Review.find({ _id: id }).populate({
      path: "userId",
      select: ["fullName", "avatar"],
    });

    res.status(200).json(review);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
