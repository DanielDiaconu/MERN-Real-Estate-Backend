const User = require("../models/User");
const Question = require("../models/Question");
const Reply = require("../models/Reply");
const ObjectId = require("mongodb").ObjectId;

exports.getReplies = (req, res) => {};

exports.postReply = async (req, res) => {
  const { body } = req;
  const newReply = new Reply({
    replyBody: body.replyBody,
    userId: ObjectId(body.userId),
  });
  try {
    const reply = await newReply.save();
    await Question.findByIdAndUpdate(body.questionId, {
      $push: { replies: ObjectId(reply._id) },
    });
    res.status(200).json(reply);
  } catch (error) {
    req.status(400).json();
  }
};
