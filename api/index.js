const express = require("express");
const mongoose = require("mongoose");
const app = express();
const PORT = 3000;
const dotenv = require("dotenv");
const userRoutes = require("./routes/user.route");
const authRoutes = require("./routes/auth.route");
const postRoutes = require("../api/routes/post.route");
const commentRoutes = require("../api/routes/comment.route");
const cors = require("cors");
const CookieParser = require("cookie-parser");
const path = require("path");

app.use(cors()); // Enable CORS for all routes

dotenv.config();

app.use(express.json());

app.use(CookieParser());

mongoose
  .connect(process.env.MONGO)
  .then(() => {
    serverSelectionTimeoutMS: 5000; // 5 seconds
    socketTimeoutMS: 45000; // 45 seconds
    console.log("MongoDB connected successfully");
  })
  .catch((err) => {
    console.error("Error connecting to MongoDB:", err);
  });

__dirname = path.resolve();

app.listen(PORT, () => {
  console.log(`Server is running on port :${PORT} !`);
});

app.use("/api/user", userRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/post", postRoutes);
app.use("/api/comment", commentRoutes);

app.use(express.static(path.join(__dirname, "/client/dist")));

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "client", "dist", "index.html"));
});

app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error !";
  res.status(statusCode).json({
    success: false,
    statusCode,
    message,
  });
});
