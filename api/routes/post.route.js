const express = require("express");
const router = express.Router();
const postController = require("../controllers/post.controller");
const VerifyToken = require("../utils/verifyUser");

router.post("/create", VerifyToken, postController.create);
router.get("/getposts", postController.getposts);

router.delete(
  "/deletepost/:postId/:userId",
  VerifyToken,
  postController.deletePost
);

router.put("/update/:postId/:userId", VerifyToken, postController.updatePost);

module.exports = router;
