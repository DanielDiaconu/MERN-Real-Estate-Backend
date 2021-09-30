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
    questionId: body.questionId,
  });
  try {
    const reply = await newReply.save();
    const populatedReply = await Reply.populate(reply, {
      path: "userId",
      select: ["fullName", "avatar"],
    });

    await Question.findByIdAndUpdate(body.questionId, {
      $push: { replies: ObjectId(reply._id) },
    });
    res.status(200).json(populatedReply);
  } catch (error) {
    res.status(400).json({ message: error });
  }
};

exports.updateReplyLike = async (req, res) => {
  let { id } = req.params;

  try {
    const reply = await Reply.findById(id);

    if (reply.likes.userIds.includes(req.body.userId)) {
      await Reply.findByIdAndUpdate(id, {
        $pull: { "likes.userIds": req.body.userId },
        $inc: { "likes.count": -1 },
      });
    } else {
      await Reply.findByIdAndUpdate(id, {
        $push: { "likes.userIds": req.body.userId },
        $inc: { "likes.count": 1 },
      });

      if (reply.dislikes.userIds.includes(req.body.userId)) {
        await Reply.findByIdAndUpdate(id, {
          $inc: { "dislikes.count": -1 },
          $pull: { "dislikes.userIds": req.body.userId },
        });
      }
    }
    res.status(200).json({ success: "Reply like success!" });
  } catch (error) {
    res.status(400).json({ message: error });
  }
};

exports.updateReplyDislike = async (req, res) => {
  let { id } = req.params;

  try {
    const reply = await Reply.findById(id);

    if (reply.dislikes.userIds.includes(req.body.userId)) {
      await Reply.findByIdAndUpdate(id, {
        $pull: { "dislikes.userIds": req.body.userId },
        $inc: { "dislikes.count": -1 },
      });
    } else {
      await Reply.findByIdAndUpdate(id, {
        $push: { "dislikes.userIds": req.body.userId },
        $inc: { "dislikes.count": 1 },
      });

      if (reply.likes.userIds.includes(req.body.userId)) {
        await Reply.findByIdAndUpdate(id, {
          $inc: { "likes.count": -1 },
          $pull: { "likes.userIds": req.body.userId },
        });
      }
    }

    res.status(200).json({ message: "Reply Dislike Success!" });
  } catch (error) {
    res.status(400).json({ message: error });
  }
};
