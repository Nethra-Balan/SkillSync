import React, { useEffect, useState } from "react";
import axios from "axios";
import styles from "./DiscussionForum.module.css"; // optional styling

const DiscussionForum = () => {
  const userId = localStorage.getItem("userId"); // get logged-in user
  const [posts, setPosts] = useState([]);
  const [selectedPost, setSelectedPost] = useState(null);

  const [skillFilter, setSkillFilter] = useState("");
  const [newPost, setNewPost] = useState({ title: "", content: "", skill: "" });
  const [newComment, setNewComment] = useState("");

  
  const fetchPosts = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/forum/posts", {
        params: skillFilter ? { skill: skillFilter } : {}
      });
      setPosts(res.data);
    } catch (err) {
      console.error("Failed to fetch posts");
    }
  };

  
  const fetchPostDetails = async (postId) => {
    try {
      const res = await axios.get(`http://localhost:5000/api/forum/post/${postId}`);
      setSelectedPost(res.data);
    } catch (err) {
      console.error("Failed to load post");
    }
  };

  const createPost = async (e) => {
    e.preventDefault();
    if (!newPost.title || !newPost.content || !newPost.skill) return;
    try {
      await axios.post("http://localhost:5000/api/forum/post", { ...newPost, userId });
      setNewPost({ title: "", content: "", skill: "" });
      fetchPosts();
    } catch (err) {
      console.error("Post creation failed");
    }
  };

  const addComment = async (postId) => {
    if (!newComment.trim()) return;
    try {
      await axios.post(`http://localhost:5000/api/forum/post/${postId}/comment`, {
        text: newComment,
        userId
      });
      setNewComment("");
      fetchPostDetails(postId);
    } catch {
      console.error("Comment failed");
    }
  };

  const likePost = async (postId) => {
    try {
      await axios.post(`http://localhost:5000/api/forum/post/${postId}/like`, { userId });
      fetchPostDetails(postId);
    } catch {
      console.error("Like failed");
    }
  };

  useEffect(() => {
  fetchPosts();
  setSelectedPost(null); 
}, [skillFilter]);


  return (
  <div className={styles.forum}>
    <h2>Discussion Forum</h2>

    {/* Filter */}
    <input
      className={styles.input}
      placeholder="Search posts by skill"
      value={skillFilter}
      onChange={(e) => setSkillFilter(e.target.value)}
    />

    {/* Create Post */}
    <form onSubmit={createPost} className={styles.form}>
      <h3>New Discussion</h3>
      <input
        placeholder="Title"
        value={newPost.title}
        onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
      />
      <input
        placeholder="Skill"
        value={newPost.skill}
        onChange={(e) => setNewPost({ ...newPost, skill: e.target.value })}
      />
      <textarea
        placeholder="Describe your issue / discussion"
        value={newPost.content}
        onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
      />
      <button type="submit">Post</button>
    </form>

    {/* Posts & Details */}
    <div className={styles.postsGrid}>
      {posts.map((post) => (
        <div
          key={post._id}
          className={`${styles.postCard} ${selectedPost?._id === post._id ? styles.activeCard : ""}`}
          onClick={() => fetchPostDetails(post._id)}
        >
          <h4>{post.title}</h4>
          <p><strong>Skill:</strong> {post.skill}</p>
          <p><strong>By:</strong> {post.userId?.firstName} {post.userId?.lastName}</p>
          <p><strong>Likes:</strong> {post.likes?.length || 0}</p>
        </div>
      ))}
    </div>

    {/* Post Details (right pane or below) */}
    {selectedPost && (
      <div className={styles.postDetails}>
        <h3>{selectedPost.title}</h3>
        <p><strong>Skill:</strong> {selectedPost.skill}</p>
        <p>{selectedPost.content}</p>
        <p>Likes: {selectedPost.likes.length}</p>
        <button onClick={() => likePost(selectedPost._id)}>👍 Like</button>

        <h4>Comments</h4>
        <ul>
          {selectedPost.comments.map((c, i) => (
            <li key={i}><strong>{c.userId.firstName}:</strong> {c.text}</li>
          ))}
        </ul>

        <input
          placeholder="Write a comment"
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
        />
        <button onClick={() => addComment(selectedPost._id)}>Comment</button>
      </div>
    )}
  </div>
);

};

export default DiscussionForum;
