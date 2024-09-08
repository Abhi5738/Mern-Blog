const express = require("express");
const commentController = require("../controllers/comment.controller");
const VerifyToken = require("../utils/verifyUser");

const router = express.Router();

router.post("/create", VerifyToken, commentController.createComment);
router.get("/getPostComments/:postId", commentController.getPostComments);

module.exports = router;
