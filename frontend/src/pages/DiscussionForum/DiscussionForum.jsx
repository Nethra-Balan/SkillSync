import React, { useEffect, useState } from "react";
import axios from "axios";
import styles from "./DiscussionForum.module.css";
import defaultProfile from "../../assets/images/default-profile.png";
import NavBar from "../../components/NavBar/NavBar";

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
      <NavBar />
      <h2>Skill<span>Space</span></h2>


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


      <div className={styles.postsGrid}>
        {[...posts]
          .sort((a, b) => (b.likes?.length || 0) - (a.likes?.length || 0))
          .map((post) => (

            <div
              key={post._id}
              className={styles.postCard}
              onClick={() => fetchPostDetails(post._id)}
            >
              <h4>{post.title}</h4>
              <div className={styles.postTags}>
                <p><strong><i class="bi bi-tag-fill"></i>{post.skill}</strong> </p>
                <p><strong><i className={`bi bi-suit-heart-fill ${styles.heartIcon}`}></i></strong> {post.likes?.length || 0}</p>
              </div>
              <div className={styles.userInfo}>
                <img
                  src={post.userId.profilePicture ? `http://localhost:5000${post.userId.profilePicture}` : defaultProfile}
                  alt="profile"
                  className={styles.profilePic}
                />
                <p><strong>{post.userId?.firstName} {post.userId?.lastName}</strong></p>
              </div>
            </div>
          ))}
      </div>

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
                <button className={styles.closeBtn} onClick={() => setShowCreateModal(false)}>×</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showDetailsModal && selectedPost && (
        <div className={styles.modal}>
          <div className={styles.modalContent}>
            <h3>{selectedPost.title}</h3>
            <div className={styles.postTags}>
              <p><strong><i class="bi bi-tag-fill"></i>{selectedPost.skill}</strong> </p>
              <button
                className={styles.iconBtn}
                onClick={() => likePost(selectedPost._id)}
              >
                <i
                  className={`bi bi-suit-heart-fill`}
                  style={{ color: selectedPost.likes.includes(userId) ? "red" : "white" }}
                ></i>
              </button>

            </div>
            <p>{selectedPost.content}</p>

            <h4>Comments</h4>
            <div className={styles.chatBox}>
              {selectedPost.comments.length === 0 ? (
                <p>No comments yet.</p>
              ) : (
                selectedPost.comments.map((c, i) => (
                  <div key={i} className={styles.commentBubble}>
                    <strong>{c.userId.firstName}:</strong> {c.text}
                  </div>
                ))
              )}
            </div>


            <div className={styles.commentBox}>
              <input
                placeholder="Write a comment"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
              />
              <button
                className={styles.iconBtn}
                onClick={() => addComment(selectedPost._id)}
              >
                <i className="bi bi-send-fill"></i>
              </button>

            </div>
            <button className={styles.closeBtn} onClick={() => setShowDetailsModal(false)}>×</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DiscussionForum;
