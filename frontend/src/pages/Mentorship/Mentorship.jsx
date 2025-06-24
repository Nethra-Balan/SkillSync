import React, { useState, useEffect } from "react";
import axios from "axios";
import styles from "./Mentorship.module.css";
import connectImage from "../../assets/images/loginConnect.png";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Navbar from "../../components/Navbar/Navbar";

const Mentorship = () => {
  const userId = localStorage.getItem("userId");
  const [activeTab, setActiveTab] = useState("find");
  const [skill, setSkill] = useState("");
  const [preferredTime, setPreferredTime] = useState("");
  const [mentorList, setMentorList] = useState([]);
  const [myRequests, setMyRequests] = useState([]);
  const [mentorRequests, setMentorRequests] = useState([]);

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    toast.success("Email copied to clipboard!");
  };

  const fetchRequests = async () => {
    if (!userId) return;
    try {
      const menteeRes = await axios.get(`http://localhost:5000/api/mentorship/mentee/${userId}`);
      const mentorRes = await axios.get(`http://localhost:5000/api/mentorship/mentor/${userId}`);
      setMyRequests(menteeRes.data);
      setMentorRequests(mentorRes.data);
    } catch (err) {
      console.error("Error fetching mentorship data:", err);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, [userId]);

  const createRequest = async (mentorId) => {
    if (!skill || !preferredTime || !mentorId) return;
    try {
      await axios.post("http://localhost:5000/api/mentorship/create", {
        skill,
        preferredTime,
        menteeId: userId,
        mentorId,
      });
      setSkill("");
      setPreferredTime("");
      toast.success("Request sent to mentor.");
      fetchRequests();
    } catch (err) {
      toast.error("Failed to send request.");
      console.error(err);
    }
  };

  const findMentors = async () => {
    try {
      const res = await axios.get(
        `http://localhost:5000/api/mentorship/match?skill=${encodeURIComponent(skill)}`
      );
      const filteredMentors = res.data.filter((mentor) => mentor._id !== userId);
      setMentorList(filteredMentors);
    } catch (err) {
      toast.error("Failed to find mentors.");
    }
  };

  const respond = async (reqId, status) => {
    try {
      await axios.post(`http://localhost:5000/api/mentorship/respond/${reqId}`, {
        status,
        mentorId: userId,
      });
      toast.success(`Request ${status}`);
      fetchRequests();
    } catch (err) {
      toast.error("Failed to respond.");
    }
  };

  const withdrawRequest = async (reqId) => {
    try {
      await axios.delete(`http://localhost:5000/api/mentorship/withdraw/${reqId}`);
      toast.success("Request withdrawn.");
      fetchRequests();
    } catch (err) {
      toast.error("Failed to withdraw.");
    }
  };

  return (
    <div className={styles.container}>
      <Navbar />
      <h1>Skill<span>Share</span></h1>
      <div className={styles.tabs}>
        <button
          className={`${styles.tabButton} ${activeTab === "find" ? styles.activeTab : ""}`}
          onClick={() => setActiveTab("find")}
        >
          Find Mentors
        </button>
        <button
          className={`${styles.tabButton} ${activeTab === "incoming" ? styles.activeTab : ""}`}
          onClick={() => setActiveTab("incoming")}
        >
          Mentorship Requests
        </button>
        <button
          className={`${styles.tabButton} ${activeTab === "sent" ? styles.activeTab : ""}`}
          onClick={() => setActiveTab("sent")}
        >
          Sent Requests
        </button>
      </div>

      <div className={styles.tabContent}>
        {activeTab === "find" && (
          <div className={styles.findMentor}>
            <h2>Find Your Mentor</h2>
            <div className={styles.inputRow}>
              <input
                placeholder="Skill"
                value={skill}
                onChange={(e) => setSkill(e.target.value)}
              />
              <input
                placeholder="Preferred Time"
                value={preferredTime}
                onChange={(e) => setPreferredTime(e.target.value)}
              />
              <button onClick={findMentors}><i className="bi bi-funnel-fill"></i></button>
            </div>

            <div className={styles.resultBox}>
              {mentorList.length === 0 ? (
                <div className={styles.placeholder}>
                  <img src={connectImage} alt="Connect" className={styles.placeholderImage} />
                  <p className={styles.placeholderText}>Start Connecting</p>
                </div>
              ) : (
                <div className={styles.scrollArea}>
                  <h3>Mentor Matches</h3>
                  <table className={styles.requestTable}>
                    <thead>
                      <tr>
                        <th>Name</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {mentorList.map((m) => (
                        <tr key={m._id}>
                          <td>{m.firstName} {m.lastName}</td>
                          <td>
                            <button onClick={() => createRequest(m._id)} className={styles.actionBtn}>
                              Request
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>

                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === "incoming" && (
          <div className={styles.scrollArea}>
            <h3>Pending Requests</h3>
            <table className={styles.requestTable}>
              <thead>
                <tr>
                  <th>Skill</th>
                  <th>Mentee</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {mentorRequests.filter(r => r.status === "pending").map((r) => (
                  <tr key={r._id}>
                    <td>{r.skill}</td>
                    <td>{r.menteeId.firstName} {r.menteeId.lastName}</td>
                    <td>
                      <button onClick={() => respond(r._id, "accepted")}>Accept</button>
                      <button onClick={() => respond(r._id, "declined")}>Decline</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <h3>Accepted Requests</h3>
            <table className={styles.requestTable}>
              <thead>
                <tr>
                  <th>Skill</th>
                  <th>Mentee</th>
                  <th>Contact</th>
                </tr>
              </thead>
              <tbody>
                {mentorRequests.filter(r => r.status === "accepted").map((r) => (
                  <tr key={r._id}>
                    <td>{r.skill}</td>
                    <td>{r.menteeId.firstName} {r.menteeId.lastName}</td>
                    <td>
                      <a href={`mailto:${r.menteeId.email}`}>Email</a>
                      <button onClick={() => copyToClipboard(r.menteeId.email)}>
                        <i className="bi bi-copy"></i>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === "sent" && (
          <div className={styles.scrollArea}>
            <h3>Sent Requests</h3>
            <table className={styles.requestTable}>
              <thead>
                <tr>
                  <th>Skill</th>
                  <th>Preferred Time</th>
                  <th>Status</th>
                  <th>Mentor</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {myRequests.map((r) => (
                  <tr key={r._id}>
                    <td>{r.skill}</td>
                    <td>{r.preferredTime}</td>
                    <td>{r.status}</td>
                    <td>{r.mentorId?.firstName  || "-"} {r.mentorId?.lastName  || "-"}</td>
                    <td>
                      {r.status === "pending" && (
                        <button onClick={() => withdrawRequest(r._id)}>Withdraw</button>
                      )}
                      {r.status === "accepted" && r.mentorId && (
                        <>
                          <a href={`mailto:${r.mentorId.email}`}>Email</a>
                          <button onClick={() => copyToClipboard(r.mentorId.email)}>
                            <i className="bi bi-copy"></i>
                          </button>
                        </>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} />
    </div>
  );
};

export default Mentorship;
