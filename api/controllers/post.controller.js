const Post = require("../models/post.model");
const { errorHandler } = require("../utils/error");

exports.create = async (req, res, next) => {
  const { title, content, image, category } = req.body;

  if (!req.user.isAdmin) {
    return next(errorHandler(403, "You are not allowed to create a post "));
  }
  if (!title || !content) {
    return next(errorHandler(400, "Please provide all required fields"));
  }

  const slug = title
    .split(" ")
    .join("-")
    .toLowerCase()
    .replace(/[^a-zA-Z0-9-]/g, "-");

  try {
    const existingPost = await Post.findOne({ slug });
    if (existingPost) {
      return next(errorHandler(400, "A post with this slug already exists."));
    }
  } catch (error) {
    return next(errorHandler(400, "Error checking slug in database."));
  }

  const newPost = new Post({
    title,
    content,
    slug,
    image,
    userId: req.user.id,
    category,
  });

  try {
    const savedPost = await newPost.save();
    res.json({
      success: true,
      message: "Post added success",
      data: savedPost,
    });
  } catch (error) {
    return res.json(errorHandler(500, error.message));
  }
};

exports.getposts = async (req, res, next) => {
  const startIndex = parseInt(req.query.startIndex) || 0;
  const limit = parseInt(req.query.limit) || 9;
  const sortDirection = req.query.order === "asc" ? 1 : -1;

  try {
    const posts = await Post.find({
      ...(req.query.userId && { userId: req.query.userId }),
      ...(req.query.category && { category: req.query.category }),
      ...(req.query.slug && { slug: req.query.slug }),
      ...(req.query.postId && { _id: req.query.postId }),
      ...(req.query.searchTerm && {
        $or: [
          { title: { $regex: req.query.searchTerm, $options: "i" } },
          { content: { $regex: req.query.searchTerm, $options: "i" } },
        ],
      }),
    })
      .sort({ updatedAt: sortDirection })
      .skip(startIndex)
      .limit(limit);

    const totalPosts = await Post.countDocuments(); // Calculate totalPost in the database .||

    const now = new Date(); // This variable is contain  current date and time .||

    const oneMonthAgo = new Date(
      now.getFullYear(),
      now.getMonth() - 1,
      now.getDate()
    ); // This variable is contain current Day and month and year . ||

    const lastMonthPosts = await Post.countDocuments({
      createdAt: { $gte: oneMonthAgo },
    });

    return res
      .status(200)
      .json({ success: true, posts, lastMonthPosts, totalPosts });
  } catch (error) {
    next(error);
  }
};

exports.deletePost = async (req, res, next) => {
  if (!req.user.isAdmin || req.user.id !== req.params.userId) {
    return next(errorHandler(403, " You are not allowed to delete this post "));
  }
  try {
    await Post.findByIdAndDelete(req.params.postId);
    return res.json({ success: true, message: "Post delete Success" });
  } catch (error) {
    return next(error);
  }
};

exports.updatePost = async (req, res, next) => {
  if (!req.user.isAdmin || req.user.id !== req.params.userId) {
    return next(errorHandler(403, " You are not allowed "));
  }

  try {
    const updatedPost = await Post.findByIdAndUpdate(
      req.params.postId,
      {
        $set: {
          title: req.body.title,
          content: req.body.content,
          image: req.body.image,
          category: req.body.category,
        },
      },
      { new: true }
    );

    if (!updatedPost) {
      return next(errorHandler(404, "Post not found"));
    }
    res.status(200).json(updatedPost);
  } catch (error) {
    next(error);
  }
};
