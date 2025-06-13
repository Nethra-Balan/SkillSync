const Post = require("../models/Post");

const createPost = async (req, res) => {
  const { title, content, skill, userId } = req.body;
  if (!title || !content || !skill || !userId) return res.status(400).json({ error: "Missing fields" });

  try {
    const post = new Post({ title, content, skill, userId });
    await post.save();
    res.status(201).json(post);
  } catch (err) {
    res.status(500).json({ error: "Failed to create post", details: err });
  }
};

const getAllPosts = async (req, res) => {
  const { skill } = req.query;
  try {
    const filter = skill ? { skill: { $regex: skill, $options: "i" } } : {};
    const posts = await Post.find(filter).populate("userId", "firstName lastName").sort({ createdAt: -1 });
    res.json(posts);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch posts", details: err });
  }
};

const getPostById = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)
      .populate("userId", "firstName lastName")
      .populate("comments.userId", "firstName lastName");
    if (!post) return res.status(404).json({ error: "Post not found" });
    res.json(post);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch post", details: err });
  }
};

const addComment = async (req, res) => {
  const { text, userId } = req.body;
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ error: "Post not found" });

    post.comments.push({ text, userId });
    await post.save();
    res.json({ message: "Comment added", post });
  } catch (err) {
    res.status(500).json({ error: "Failed to add comment", details: err });
  }
};

const likePost = async (req, res) => {
  const { userId } = req.body;
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ error: "Post not found" });

    const index = post.likes.indexOf(userId);
    if (index > -1) {
      post.likes.splice(index, 1);
    } else {
      post.likes.push(userId);
    }
    await post.save();
    res.json({ message: "Updated like status", post });
  } catch (err) {
    res.status(500).json({ error: "Failed to like post", details: err });
  }
};

module.exports = {
  createPost,
  getAllPosts,
  getPostById,
  addComment,
  likePost
};
