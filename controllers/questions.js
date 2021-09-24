const User = require("../models/User");
const Question = require("../models/Question");
const Reply = require("../models/Reply");
const ObjectId = require("mongodb").ObjectId;
const Property = require("../models/Property");

exports.getQuestions = async (req, res) => {
  let { id } = req.params;
  try {
    const questions = await Question.find({
      propertyId: id,
    })
      .populate({ path: "userId", select: ["fullName", "avatar"] })
      .populate({
        path: "replies",
        populate: { path: "userId", select: ["fullName", "avatar"] },
      });
    res.status(200).json(questions);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.postQuestion = async (req, res) => {
  const { body } = req;

  const newQuestion = new Question({
    questionBody: body.questionBody,
    userId: ObjectId(body.userId),
    propertyId: ObjectId(body.propertyId),
  });

  try {
    const question = await newQuestion.save();
    await Property.findByIdAndUpdate(body.propertyId, {
      $push: { questions: ObjectId(body.propertyId) },
    });
    res.status(200).json(question);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
