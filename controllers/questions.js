const User = require("../models/User");
const Question = require("../models/Question");
const Reply = require("../models/Reply");
const ObjectId = require("mongodb").ObjectId;
const Property = require("../models/Property");

exports.getQuestions = async (req, res) => {
  let { id } = req.params;
  let filters = { propertyId: id };

  if (req.query.highlight) {
    filters._id = { $ne: req.query.highlight };
  }

  try {
    let query = Question.find(filters);

    query = query
      .populate({ path: "userId", select: ["fullName", "avatar"] })
      .populate({
        path: "replies",
        populate: { path: "userId", select: ["fullName", "avatar"] },
      });

    if (req.query.sort === "likes.count") {
      query = query.sort({ "likes.count": "desc" });
    } else if (req.query.sort === "isAnswered") {
      query = query.sort({ isAnswered: "desc" });
    } else {
      query = query.sort(req.query.sort);
    }

    const total = await Question.countDocuments(filters);
    const page = parseInt(req.query.page) || 1;
    const limit = req.query.highlight && page === 1 ? 4 : 5;
    const skip = (page - 1) * limit;

    query = query.skip(skip).limit(limit);

    const questions = await query;

    res.status(200).json({ results: questions, total });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.getHighlightedQuestion = async (req, res) => {
  let { id } = req.params;
  try {
    const question = await Question.find({ _id: id })
      .populate({ path: "userId", select: ["fullName", "avatar"] })
      .populate({
        path: "replies",
        populate: { path: "userId", select: ["fullName", "avatar"] },
      });
    res.status(200).json(question);
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

exports.deleteQuestion = async (req, res) => {
  let { id } = req.params;

  try {
    const question = await Question.deleteOne({ _id: id });
    await Reply.deleteMany({ questionId: id });
    res.status(200).json({ message: "Question deleted successfully!" });
  } catch (error) {
    res.status(400).json({ message: "An error occured , please try again!" });
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

exports.updateQuestionAnsweredState = async (req, res) => {
  let { id } = req.params;
  try {
    const question = await Question.findByIdAndUpdate(id, {
      isAnswered: req.body.answeredState,
    });
    res.status(200).json(question);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
