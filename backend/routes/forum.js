const express = require("express");
const router = express.Router();
const {
  createPost,
  getAllPosts,
  getPostById,
  addComment,
  likePost
} = require("../controllers/forumController");

router.post("/post", createPost);
router.get("/posts", getAllPosts);
router.get("/post/:id", getPostById);
router.post("/post/:id/comment", addComment);
router.post("/post/:id/like", likePost);

module.exports = router;
