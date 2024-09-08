const express = require("express");
const commentController = require("../controllers/comment.controller");
const VerifyToken = require("../utils/verifyUser");

const router = express.Router();

router.post("/create", VerifyToken, commentController.createComment);
router.get("/getPostComments/:postId", commentController.getPostComments);
router.put(
  "/likeComment/:commentId",
  VerifyToken,
  commentController.likeComment
);

router.put(
  "/editComment/:commentId",
  VerifyToken,
  commentController.editComment
);

router.delete(
  "/deleteComment/:commentId",
  VerifyToken,
  commentController.deleteComment
);

module.exports = router;
