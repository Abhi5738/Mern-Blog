const express = require("express");
const router = express.Router();
const userController = require("../controllers/user.controller");
const VerifyToken = require("../utils/verifyUser");

router.get("/", userController.user);
router.put("/update/:userId", VerifyToken, userController.updateUser);
router.delete("/delete/:userId", VerifyToken, userController.deleteUser);
router.post("/signout/", VerifyToken, userController.signOut);
router.get("/getuser", VerifyToken, userController.getUser);
router.get("/getuser/:userId", userController.getUserById);

module.exports = router;
