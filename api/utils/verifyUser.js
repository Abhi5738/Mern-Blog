const { errorHandler } = require("../utils/error");

const jwt = require("jsonwebtoken");

const VerifyToken = (req, res, next) => {
  const token = req.cookies.access_token;

  if (!token) {
    return res.json(errorHandler(401, "Unauthorized "));
  }
  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.json(errorHandler(401, "Unauthorized"));
    }
    req.user = user;
    next();
  });
};

module.exports = VerifyToken;
