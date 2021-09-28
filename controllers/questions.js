const User = require("../models/User");
const Question = require("../models/Question");
const Reply = require("../models/Reply");
const ObjectId = require("mongodb").ObjectId;
const Property = require("../models/Property");
const { findById } = require("../models/User");

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
    const populatedQuestion = await Question.populate(question, {
      path: "userId",
      select: ["fullName", "avatar"],
    });

    await Property.findByIdAndUpdate(body.propertyId, {
      $push: { questions: ObjectId(body.propertyId) },
    });
    res.status(200).json(populatedQuestion);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.updateQuestionLikes = async (req, res) => {
  let { id } = req.params;

  try {
    const question = await Question.findById(id);

    if (question.likes.userIds.includes(req.body.userId)) {
      await Question.findByIdAndUpdate(id, {
        $pull: { "likes.userIds": req.body.userId },
        $inc: { "likes.count": -1 },
      });
    } else {
      await Question.findByIdAndUpdate(id, {
        $push: { "likes.userIds": req.body.userId },
        $inc: { "likes.count": 1 },
      });

      if (question.dislikes.userIds.includes(req.body.userId)) {
        await Question.findByIdAndUpdate(id, {
          $inc: { "dislikes.count": -1 },
          $pull: { "dislikes.userIds": req.body.userId },
        });
      }
    }

    res.status(200).json({ success: "Likes success!" });
  } catch (error) {
    res.status(400).json({ message: error });
  }
};

exports.updateQuestionDislikes = async (req, res) => {
  let { id } = req.params;

  try {
    const question = await Question.findById(id);

    if (question.dislikes.userIds.includes(req.body.userId)) {
      await Question.findByIdAndUpdate(id, {
        $pull: { "dislikes.userIds": req.body.userId },
        $inc: { "dislikes.count": -1 },
      });
    } else {
      await Question.findByIdAndUpdate(id, {
        $push: { "dislikes.userIds": req.body.userId },
        $inc: { "dislikes.count": 1 },
      });

      if (question.likes.userIds.includes(req.body.userId)) {
        await Question.findByIdAndUpdate(id, {
          $inc: { "likes.count": -1 },
          $pull: { "likes.userIds": req.body.userId },
        });
      }
    }

    res.status(200).json({ message: "Dislikes Success !" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
