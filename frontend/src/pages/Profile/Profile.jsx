import React, { useEffect, useState } from "react";
import axios from "axios";
import styles from "./Profile.module.css";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

import defaultProfile from "../../assets/images/default-profile.png";

const Profile = () => {
    const userId = localStorage.getItem("userId");

    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");

    const [bio, setBio] = useState("");
    const [editBio, setEditBio] = useState(false);

    const [profilePicture, setProfilePicture] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(defaultProfile);

    const [skillsToTeach, setSkillsToTeach] = useState([]);
    const [skillsToLearn, setSkillsToLearn] = useState([]);
    const [inputTeach, setInputTeach] = useState("");
    const [inputLearn, setInputLearn] = useState("");

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const res = await axios.get(`http://localhost:5000/api/profile/${userId}`);
                const data = res.data;

                setFirstName(data.firstName || "");
                setLastName(data.lastName || "");
                setEmail(data.email || "");

                setBio(data.bio || "Hi there! Let's Sync");
                if (data.profilePicture) {
                    setPreviewUrl(`http://localhost:5000${data.profilePicture}`);
                }
                setSkillsToTeach(data.skillsToTeach || []);
                setSkillsToLearn(data.skillsToLearn || []);
            } catch (err) {
                console.error("Failed to fetch profile:", err);
            }
        };
        if (userId) {
            fetchProfile();
        }
    }, [userId]);

    const handleImageChange = (e) => {
        setProfilePicture(e.target.files[0]);
        setPreviewUrl(URL.createObjectURL(e.target.files[0]));
    };

    const addSkill = (type) => {
        if (type === "teach" && inputTeach.trim()) {
            setSkillsToTeach((prev) => [...prev, inputTeach.trim()]);
            setInputTeach("");
        } else if (type === "learn" && inputLearn.trim()) {
            setSkillsToLearn((prev) => [...prev, inputLearn.trim()]);
            setInputLearn("");
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append("bio", bio);

        skillsToTeach.forEach((skill) => {
            formData.append("skillsToTeach[]", skill);
        });

        skillsToLearn.forEach((skill) => {
            formData.append("skillsToLearn[]", skill);
        });

        if (profilePicture) {
            formData.append("profilePicture", profilePicture);
        }

        try {
            await axios.put(`http://localhost:5000/api/profile/${userId}`, formData);
            toast.success("Profile updated successfully!");
        } catch (err) {
            console.error("Update failed:", err);
            toast.error("Failed to update profile.");
        }
    };


    return (
        <div className={styles.profilePage}>
            <div className={styles.profileContainer}>
                <form onSubmit={handleSubmit} encType="multipart/form-data" className={styles.profileForm}>
                    <h1>Profile</h1>

                    <div className={styles.profileImageWrapper}>
                        <img src={previewUrl} alt="Profile" className={styles.profileImage} />
                        <label htmlFor="profileUpload" className={styles.cameraIcon}><i class="bi bi-camera-fill"></i></label>
                        <input
                            id="profileUpload"
                            type="file"
                            accept="image/*"
                            onChange={handleImageChange}
                            className={styles.hiddenInput}
                        />
                    </div>

                    <div className={styles.basicInfo}>
                        <h2><strong>{firstName} {lastName}</strong> </h2>
                        <h5><strong></strong> {email}</h5>
                    </div>

                    <div className={styles.bioContainer}>
                        <strong></strong>
                        {editBio ? (
                            <>
                                <input
                                    type="text"
                                    value={bio}
                                    onChange={(e) => setBio(e.target.value)}
                                    autoFocus
                                />
                                <button type="button" onClick={() => setEditBio(false)}><i class="bi bi-check-circle-fill"></i></button>
                            </>
                        ) : (
                            <>
                                <span className={styles.bioText}>{bio}</span>
                                <span className={styles.editIcon} onClick={() => setEditBio(true)}><i class="bi bi-pencil-fill"></i></span>
                            </>
                        )}
                    </div>

                    <div className={styles.skillContainer}>
                        <div className={styles.skillVault}>
                            <label>SkillVault</label>
                            <div className={styles.skillInput}>
                                <input
                                    type="text"
                                    value={inputTeach}
                                    onChange={(e) => setInputTeach(e.target.value)}
                                />
                                <button type="button" onClick={() => addSkill("teach")}>+</button>
                            </div>
                            <ul>
                                {skillsToTeach.map((skill, idx) => (
                                    <li key={idx}>{skill}</li>
                                ))}
                            </ul>
                        </div>

                        <div className={styles.skillQuest}>
                            <label>SkillQuest</label>
                            <div className={styles.skillInput}>
                                <input
                                    type="text"
                                    value={inputLearn}
                                    onChange={(e) => setInputLearn(e.target.value)}
                                />
                                <button type="button" onClick={() => addSkill("learn")}>+</button>
                            </div>
                            <ul>
                                {skillsToLearn.map((skill, idx) => (
                                    <li key={idx}>{skill}</li>
                                ))}
                            </ul>
                        </div>

                    </div>
                    <button type="submit" className={styles.submitBtn}>
                        Save Changes
                    </button>
                </form>
            </div>
            <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} />
        </div>
    );
};

export default Profile;
