const express = require("express");
const commentController = require("../controllers/comment.controller");
const VerifyToken = require("../utils/verifyUser");

const router = express.Router();

router.post("/create", VerifyToken, commentController.createComment);

module.exports = router;
