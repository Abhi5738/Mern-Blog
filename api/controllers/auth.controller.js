const User = require("../models/user.model");
const bcryptJs = require("bcrypt");
const { errorHandler } = require("../utils/error");
const jwt = require("jsonwebtoken");

exports.auth = async (req, res, next) => {
  const { username, email, password } = req.body;

  if (
    !username ||
    !email ||
    !password ||
    username === "" ||
    email === "" ||
    password === ""
  ) {
    return res.json(errorHandler(500, "All fields are required !"));
  }

  const user = await User.findOne({ email });
  if (user) {
    return res.json(errorHandler(500, "User already exist"));
  }

  const existingUserName = await User.findOne({ username });

  if (existingUserName) {
    return res.json(errorHandler(500, "User name is allready exists"));
  }

  const hashedPassword = bcryptJs.hashSync(password, 10);

  const newUser = new User({
    username:
      username.toLowerCase().split(" ").join("") +
      Math.random().toString().slice(2, 4),
    email,
    password: hashedPassword,
  });

  try {
    await newUser.save();

    return res.json({ success: true, message: "Signup Success !" });
  } catch (error) {
    return res.json(errorHandler(400, error.message));
  }
};

exports.signin = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password || email === "" || password === "") {
    return res.json(errorHandler(500, "All fields are required !"));
  }
  try {
    const validUser = await User.findOne({ email });

    if (!validUser) {
      return res.json(errorHandler(500, "User Not Found !"));
    }

    const validPassword = bcryptJs.compareSync(password, validUser.password);

    if (!validPassword) {
      return res.json(errorHandler(500, "Invalid Password !"));
    }

    const token = jwt.sign(
      {
        id: validUser._id,
        isAdmin: validUser.isAdmin,
      },
      process.env.JWT_SECRET
    );

    const { password: pass, ...rest } = validUser._doc;

    return res
      .status(200)
      .cookie("access_token", token, {
        httpOnly: true,
      })
      .json(rest);
  } catch (error) {
    return res.json(errorHandler(400, error.message));
  }
};

exports.google = async (req, res) => {
  const { name, email, googlePhotoUrl } = req.body;
  try {
    const user = await User.findOne({ email });

    if (user) {
      const token = jwt.sign(
        { id: user.id, profilePicture: googlePhotoUrl, isAdmin: user.isAdmin },
        process.env.JWT_SECRET
      );

      const { password, ...rest } = user._doc;

      return res
        .status(200)
        .cookie("access-token", token, {
          httpOnly: true,
        })
        .json(rest);
    } else {
      const generatePassword =
        Math.random().toString(36).slice(-8) +
        Math.random().toString(36).slice(-8);

      // password without hasing = ouxgrk5s0vd9nbwp

      const hashedPassword = bcryptJs.hashSync(generatePassword, 10);

      const newUser = new User({
        username:
          name.toLowerCase().split(" ").join("") +
          Math.random().toString().slice(2, 4),
        email,
        password: hashedPassword,
        profilePicture: googlePhotoUrl,
      });

      await newUser.save();
      const token = jwt.sign(
        {
          id: newUser._id,
          profilePicture: newUser.profilePicture,
          isAdmin: newUser.isAdmin,
        },
        process.env.JWT_SECRET
      );

      const { password, ...rest } = newUser._doc;
      return res
        .status(200)
        .cookie("access-token", token, {
          httpOnly: true,
        })
        .json(rest);
    }
  } catch (error) {
    return res.json(errorHandler(400, error.message));
  }
};
