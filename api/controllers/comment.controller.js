const { errorHandler } = require("../utils/error");
const Comment = require("../models/comment.model");

exports.createComment = async (req, res, next) => {
  try {
    const { content, userId, postId } = req.body;

    if (!content) {
      return next(errorHandler(403, "Plz provi  "));
    }

    if (userId !== req.user.id) {
      return next(
        errorHandler(403, "You are not allowed to create this comment ")
      );
    }

    const newComment = await Comment({
      content,
      userId,
      postId,
    });
    await newComment.save();
    res.status(200).json(newComment);
  } catch (error) {
    next(error);
  }
};

exports.getPostComments = async (req, res, next) => {
  try {
    const comments = await Comment.find({ postId: req.params.postId }).sort({
      createdAt: -1,
    });
    res.status(200).json(comments);
  } catch (error) {
    next(error);
  }
};

exports.likeComment = async (req, res, next) => {
  try {
    const comment = await Comment.findById(req.params.commentId);

    if (!comment) {
      return next(errorHandler(404, "Comment not found "));
    }

    const userIndex = await comment.likes.indexOf(req.user.id);

    if (userIndex === -1) {
      comment.numberOfLikes += 1;
      comment.likes.push(req.user.id);
    } else {
      comment.numberOfLikes -= 1;
      comment.likes.splice(userIndex, 1);
    }
    await comment.save();
    res.status(200).json(comment);
  } catch (error) {
    next(error);
  }
};
