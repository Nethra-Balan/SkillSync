import React, { useState, useEffect } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import styles from "./Resources.module.css";
import defaultProfile from "../../assets/images/default-profile.png";
import Navbar from "../../components/Navbar/Navbar";

const Resources = () => {
  const userId = localStorage.getItem("userId");

  const [skillFilter, setSkillFilter] = useState("");
  const [resources, setResources] = useState([]);

  const [file, setFile] = useState(null);
  const [title, setTitle] = useState("");
  const [uploadSkill, setUploadSkill] = useState("");

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      fetchResources();
    }, 200);

    return () => clearTimeout(delayDebounce);
  }, [skillFilter]);


  const fetchResources = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/resources", {
        params: skillFilter ? { skill: skillFilter } : {}
      });
      setResources(res.data);
    } catch (err) {
      console.error(err);
      toast.error("Error loading resources");
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!title || !uploadSkill || !file) return toast.warn("All fields required");

    const fd = new FormData();
    fd.append("title", title);
    fd.append("skill", uploadSkill);
    fd.append("uploaderId", userId);
    fd.append("file", file);

    try {
      await axios.post("http://localhost:5000/api/resources/upload", fd);
      toast.success("Uploaded!");
      setTitle(""); setUploadSkill(""); setFile(null);
      fetchResources();
    } catch (err) {
      console.error(err);
      toast.error("Upload failed");
    }
  };

  const handleRating = async (resourceId, rating) => {
    try {
      await axios.post(`http://localhost:5000/api/resources/rate/${resourceId}`, { userId, rating });
      toast.success("Thank you for rating!");
      fetchResources();
    } catch {
      toast.error("Rating failed");
    }
  };

  const averageRating = (r) => {
    if (!r || r.length === 0) return 0;
    const sum = r.reduce((tot, x) => tot + x.rating, 0);
    return (sum / r.length).toFixed(1);
  };

  return (
    <div className={styles.page}>
      
      <Navbar />
      <ToastContainer autoClose={2000} />
      <h1>Skill<span>Stack</span></h1>
      <h3>Contribute</h3>
      <form className={styles.uploadForm} onSubmit={handleUpload}>
      
        <input
          className={styles.input}
          placeholder="Title"
          value={title}
          onChange={e => setTitle(e.target.value)}
        />
        <input
          className={styles.input}
          placeholder="Skill"
          value={uploadSkill}
          onChange={e => setUploadSkill(e.target.value)}
        />
        <input
          type="file"
          id="fileUpload"
          accept=".pdf,image/*"
          style={{ display: "none" }}
          onChange={e => setFile(e.target.files[0])}
        />

        <label htmlFor="fileUpload" className={styles.uploadIconBtn}>
          <i class="bi bi-file-earmark-arrow-up-fill"></i>
        </label>
        <button type="submit" className={styles.btn}>Upload</button>
      </form>


      <h3>Resources</h3>
      <div className={styles.controls}>
        <input
          className={styles.input}
          placeholder="Filter by skill"
          value={skillFilter}
          onChange={e => setSkillFilter(e.target.value)}
        />
        <button className={styles.searchbtn} onClick={fetchResources}><i class="bi bi-search-heart-fill"></i></button>
      </div>

      
      <div className={styles.grid}>
        {resources.map(res => (
          <div key={res._id} className={styles.card}>
            <div className={styles.cardHeader}>
              <p className={styles.title}>{res.title}</p>
              <a href={res.fileUrl.startsWith('http') ? res.fileUrl : `http://localhost:5000${res.fileUrl}`} download target="_blank" rel="noopener noreferrer">
                📄 View
              </a>
            </div>


            <div className={styles.avatarName}>
              <img className={styles.avatar} src={res.uploaderId.profilePicture ? `http://localhost:5000${res.uploaderId.profilePicture}` : defaultProfile} alt="profile" />
              <span>{res.uploaderId?.firstName} {res.uploaderId?.lastName}</span>
            </div>

            <p><strong>Rating:</strong> {averageRating(res.ratings)}</p>

            <div className={styles.rating}>
              {[1, 2, 3, 4, 5].map(v => (
                <span
                  key={v}
                  className={v <= averageRating(res.ratings) ? styles.selectedStar : styles.star}
                  onClick={() => handleRating(res._id, v)}
                >★</span>
              ))}
            </div>
          </div>

        ))}
      </div>
    </div>
  );
};

export default Resources;
