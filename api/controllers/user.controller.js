const User = require("../models/user.model");
const { post } = require("../routes/user.route");
const { errorHandler } = require("../utils/error");
const bcryptjs = require("bcrypt");

exports.user = (req, res) => {
  res.json({
    message: "User details",
  });
};

// exports.updateUser = async (req, res, next) => {
//   const { username, email, password, profilePicture } = req.body;

//   const updateUserId = req.params.userId;

//   const existingUser = req.user;

//   if (updateUserId !== existingUser.id) {
//     return res.json(
//       errorHandler(401, "You are not allowed to update this user")
//     );
//   }

//   if (password) {
//     if (password.length < 6) {
//       return res.json(
//         errorHandler(401, "Password must be at least 6 characters ")
//       );
//     }
//   }

//   const hashPassword = bcryptjs.hashSync(password || "Abhi", 10);

//   if (username) {
//     if (username.length < 7 || username.length > 20) {
//       return res.json(
//         errorHandler(401, "Username must be between 7 and 20 characters")
//       );
//     }
//     if (username.includes(" ")) {
//       return res.json(errorHandler(401, "Username cannot container spaces "));
//     }
//     if (username !== username.toLowerCase()) {
//       return res.json(errorHandler(401, "Username must be lowercase "));
//     }
//     if (!username.match(/^[a-zA-Z0-9]+$/)) {
//       return res.json(
//         errorHandler(401, "Username can only container letter and numbers ")
//       );
//     }
//   }

//   try {
//     const updatedUser = await User.findByIdAndUpdate(
//       updateUserId,
//       {
//         $set: {
//           username: username,
//           email: email,
//           password: hashPassword,
//           profilePicture: profilePicture,
//         },
//       },
//       { new: true }
//     );
//     const { password, ...rest } = updatedUser._doc;
//     res.json({ user: rest, message: "Update Success " });
//   } catch (error) {
//     return res.status(400).json({ success: false, message: error.message });
//   }
// };

exports.updateUser = async (req, res, next) => {
  if (req.user.id !== req.params.userId) {
    return next(errorHandler(403, "You are not allowed to update this user"));
  }
  if (req.body.password) {
    if (req.body.password.length < 6) {
      return next(errorHandler(400, "Password must be at least 6 characters"));
    }
    req.body.password = bcryptjs.hashSync(req.body.password, 10);
  }
  if (req.body.username) {
    if (req.body.username.length < 7 || req.body.username.length > 20) {
      return next(
        errorHandler(400, "Username must be between 7 and 20 characters")
      );
    }
    if (req.body.username.includes(" ")) {
      return next(errorHandler(400, "Username cannot contain spaces"));
    }
    if (req.body.username !== req.body.username.toLowerCase()) {
      return next(errorHandler(400, "Username must be lowercase"));
    }
    if (!req.body.username.match(/^[a-zA-Z0-9]+$/)) {
      return next(
        errorHandler(400, "Username can only contain letters and numbers")
      );
    }
  }
  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.params.userId,
      {
        $set: {
          username: req.body.username,
          email: req.body.email,
          profilePicture: req.body.profilePicture,
          password: req.body.password,
        },
      },
      { new: true }
    );

    const { password, ...rest } = updatedUser._doc;
    res.status(200).json(rest);
  } catch (error) {
    next(error);
  }
};

exports.deleteUser = async (req, res) => {
  const deleteUserId = req.params.userId;
  const existingUser = req.user.id;

  if (!req.user.isAdmin && existingUser !== deleteUserId) {
    return res.json(
      errorHandler(401, "You are not allowed to delete this user")
    );
  }

  try {
    await User.findByIdAndDelete(deleteUserId);
    res.status(200).json({ success: true, message: "User has been deleted " });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

exports.signOut = (req, res) => {
  try {
    res.clearCookie("access-token");
    res.json({ success: true, message: "User has been signed out !" });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

exports.getUser = async (req, res, next) => {
  if (!req.user.isAdmin) {
    return next(errorHandler(403, " You are not allowed "));
  }

  const startIndex = parseInt(req.query.startIndex) || 0;
  const limit = parseInt(req.query.limit) || 9;
  const sortDirection = req.query.sort || "asc" ? 1 : -1;
  try {
    const users = await User.find()
      .sort({ createdAt: sortDirection })
      .skip(startIndex)
      .limit(limit);

    const usersWithoutPassword = users.map((user) => {
      const { password, ...rest } = user._doc;
      return rest;
    });

    const totalUser = await User.countDocuments();

    const now = new Date();

    const oneMonthAgo = new Date(
      now.getFullYear(),
      now.getMonth() - 1,
      now.getDate()
    );

    const lastMonthUsers = await User.countDocuments({
      createdAt: { $gte: oneMonthAgo },
    });

    res.status(200).json({
      success: true,
      users: usersWithoutPassword,
      totalUser,
      lastMonthUsers,
    });
  } catch (error) {
    next(error);
  }
};

exports.getUserById = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId);
    if (!user) {
      return next(errorHandler(404, "User not found"));
    }
    const { password, ...rest } = user._doc;
    res.status(200).json(rest);
  } catch (error) {
    next(error);
  }
};
