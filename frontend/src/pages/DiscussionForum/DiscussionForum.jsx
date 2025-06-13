import React, { useEffect, useState } from "react";
import axios from "axios";
import styles from "./DiscussionForum.module.css";

const DiscussionForum = () => {
  const userId = localStorage.getItem("userId");

  const [posts, setPosts] = useState([]);
  const [selectedPost, setSelectedPost] = useState(null);
  const [skillFilter, setSkillFilter] = useState("");

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  const [newPost, setNewPost] = useState({ title: "", content: "", skill: "" });
  const [newComment, setNewComment] = useState("");

  const fetchPosts = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/forum/posts", {
        params: skillFilter ? { skill: skillFilter } : {}
      });
      setPosts(res.data);
    } catch {
      console.error("Failed to fetch posts");
    }
  };

  const fetchPostDetails = async (postId) => {
    try {
      const res = await axios.get(`http://localhost:5000/api/forum/post/${postId}`);
      setSelectedPost(res.data);
      setShowDetailsModal(true);
    } catch {
      console.error("Failed to load post");
    }
  };

  const createPost = async (e) => {
    e.preventDefault();
    if (!newPost.title || !newPost.content || !newPost.skill) return;
    try {
      await axios.post("http://localhost:5000/api/forum/post", { ...newPost, userId });
      setNewPost({ title: "", content: "", skill: "" });
      setShowCreateModal(false);
      fetchPosts();
    } catch {
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
      <h2>Skill<span>Space</span></h2>

      {/* Top Controls */}
      <div className={styles.topControls}>
        <input
          className={styles.input}
          placeholder="Search a skill"
          value={skillFilter}
          onChange={(e) => setSkillFilter(e.target.value)}
        />
        <button className={styles.contributeBtn} onClick={() => setShowCreateModal(true)}>
          <i class="bi bi-plus-lg"></i>
        </button>
      </div>

      {/* Posts */}
      <div className={styles.postsGrid}>
        {posts.map((post) => (
          <div
            key={post._id}
            className={styles.postCard}
            onClick={() => fetchPostDetails(post._id)}
          >
            <h4>{post.title}</h4>
            <p><strong><i class="bi bi-tag-fill"></i></strong> {post.skill}</p>
            <p><strong></strong> {post.userId?.firstName} {post.userId?.lastName}</p>
            <p><strong><i class="bi bi-suit-heart-fill"></i></strong> {post.likes?.length || 0}</p>
          </div>
        ))}
      </div>

      {/* Create Post Modal */}
      {showCreateModal && (
        <div className={styles.modal}>
          <div className={styles.modalContent}>
            <h3>New Discussion</h3>
            <form onSubmit={createPost} className={styles.form}>
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
              <div className={styles.buttonRow}>
                <button type="submit">Post</button>
                <button type="button" onClick={() => setShowCreateModal(false)}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Post Details Modal */}
      {showDetailsModal && selectedPost && (
        <div className={styles.modal}>
          <div className={styles.modalContent}>
            <h3>{selectedPost.title}</h3>
            <p><strong>Skill:</strong> {selectedPost.skill}</p>
            <p>{selectedPost.content}</p>
            <p>Likes: {selectedPost.likes.length}</p>
            <button onClick={() => likePost(selectedPost._id)}>👍 Like</button>

            <h4>Comments</h4>
            <div className={styles.chatBox}>
              {selectedPost.comments.map((c, i) => (
                <div key={i} className={styles.commentBubble}>
                  <strong>{c.userId.firstName}:</strong> {c.text}
                </div>
              ))}
            </div>

            <input
              placeholder="Write a comment"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
            />
            <button onClick={() => addComment(selectedPost._id)}>Comment</button>
            <button onClick={() => setShowDetailsModal(false)}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DiscussionForum;
