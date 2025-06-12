import React, { useState, useEffect } from "react";
import axios from "axios";

const Mentorship = () => {
  const userId = localStorage.getItem("userId");
  const [skill, setSkill] = useState("");
  const [preferredTime, setPreferredTime] = useState("");
  const [mentorList, setMentorList] = useState([]);
  const [myRequests, setMyRequests] = useState([]);
  const [mentorRequests, setMentorRequests] = useState([]);

  const fetchRequests = async () => {
    if (!userId) return;
    try {
      const menteeRes = await axios.get(`http://localhost:5000/api/mentorship/mentee/${userId}`);
      const mentorRes = await axios.get(`http://localhost:5000/api/mentorship/mentor/${userId}`);
      setMyRequests(menteeRes.data);
      setMentorRequests(mentorRes.data); // only pending will be returned
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
      alert("Request sent to mentor.");
      fetchRequests();
    } catch (err) {
      alert("Failed to send request.");
      console.error(err);
    }
  };

  const findMentors = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/mentorship/match?skill=${encodeURIComponent(skill)}`);
      setMentorList(res.data);
    } catch (err) {
      alert("Failed to find mentors.");
    }
  };

  const respond = async (reqId, status) => {
    try {
      await axios.post(`http://localhost:5000/api/mentorship/respond/${reqId}`, { status, mentorId: userId });
      setMentorRequests(prev => prev.filter(r => r._id !== reqId)); // remove from view
      alert(`Request ${status}`);
    } catch (err) {
      console.error(err);
      alert("Failed to respond.");
    }
  };

  const withdrawRequest = async (reqId) => {
    try {
      await axios.delete(`http://localhost:5000/api/mentorship/withdraw/${reqId}`);
      setMyRequests(prev => prev.filter(r => r._id !== reqId));
      alert("Request withdrawn.");
    } catch (err) {
      alert("Failed to withdraw.");
    }
  };

  return (
    <div style={{ maxWidth: 900, margin: "2rem auto", padding: "1rem" }}>
      <h2>Create Mentorship Request</h2>
      <input
        placeholder="Skill"
        value={skill}
        onChange={(e) => setSkill(e.target.value)}
        style={{ marginRight: "0.5rem" }}
      />
      <input
        placeholder="Preferred Time"
        value={preferredTime}
        onChange={(e) => setPreferredTime(e.target.value)}
      />
      <button onClick={findMentors} style={{ marginLeft: "0.5rem" }}>
        Find Mentors
      </button>

      {mentorList.length > 0 && (
        <>
          <h3>Mentor Matches</h3>
          <ul>
            {mentorList.map((m) => (
              <li key={m._id}>
                {m.firstName} {m.lastName} ({m.email}){" "}
                <button onClick={() => createRequest(m._id)}>Request</button>
              </li>
            ))}
          </ul>
        </>
      )}

      <h3>My Requests (Mentee)</h3>
      <ul>
        {myRequests.map((r) => (
          <li key={r._id}>
            Skill: {r.skill} | Time: {r.preferredTime} | Status: {r.status}
            {r.status === "pending" && (
              <button
                style={{ marginLeft: "0.5rem" }}
                onClick={() => withdrawRequest(r._id)}
              >
                Withdraw
              </button>
            )}
          </li>
        ))}
      </ul>

      <h3>Incoming Requests (As Mentor)</h3>
      <ul>
        {mentorRequests.map((r) => (
          <li key={r._id}>
            {r.skill} requested by {r.menteeId.firstName} {r.menteeId.lastName} (
            {r.menteeId.email})
            <button
              onClick={() => respond(r._id, "accepted")}
              style={{ marginLeft: "0.5rem" }}
            >
              Accept
            </button>
            <button onClick={() => respond(r._id, "declined")}>Decline</button>
          </li>
        ))}
        {mentorRequests.length === 0 && <li>No new requests</li>}
      </ul>
    </div>
  );
};

export default Mentorship;
