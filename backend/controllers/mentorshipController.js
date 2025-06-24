const MentorshipRequest = require("../models/MentorshipRequest");
const { User } = require("../models/user");

const createMentorshipRequest = async (req, res) => {
  const { skill, preferredTime, menteeId, mentorId } = req.body;

  if (!skill || !preferredTime || !menteeId || !mentorId) {
    return res.status(400).json({ error: "All fields are required." });
  }

  try {
    const newRequest = new MentorshipRequest({
      skill,
      preferredTime,
      menteeId,
      mentorId,
      status: "pending",
    });

    await newRequest.save();
    res.status(201).json({ message: "Request sent to mentor", request: newRequest });
  } catch (err) {
    res.status(500).json({ error: "Failed to create mentorship request", details: err });
  }
};

const matchMentorsBySkill = async (req, res) => {
  const { skill } = req.query;
  try {
    const mentors = await User.find({
      skillsToTeach: { $elemMatch: { $regex: new RegExp(`^${skill}$`, "i") } }
    }).select("-password");

    res.json(mentors);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch mentors", details: err });
  }
};

const respondToMentorshipRequest = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  if (!["accepted", "declined"].includes(status)) {
    return res.status(400).json({ error: "Invalid status" });
  }

  try {
    const request = await MentorshipRequest.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (!request) {
      return res.status(404).json({ error: "Request not found" });
    }

    res.json({ message: `Request ${status}`, request });
  } catch (err) {
    res.status(500).json({ error: "Failed to respond to request", details: err });
  }
};

const getRequestsByMentee = async (req, res) => {
  try {
    const requests = await MentorshipRequest.find({ menteeId: req.params.menteeId })
      .populate("mentorId", "firstName lastName email");

    res.json(requests);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch mentee requests", details: err });
  }
};

const getRequestsForMentor = async (req, res) => {
  try {
    const requests = await MentorshipRequest.find({
      mentorId: req.params.mentorId,
    }).populate("menteeId", "firstName lastName email");

    res.json(requests);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch mentor requests", details: err });
  }
};


const withdrawMentorshipRequest = async (req, res) => {
  const { id } = req.params;

  try {
    const deletedRequest = await MentorshipRequest.findByIdAndDelete(id);
    if (!deletedRequest) {
      return res.status(404).json({ error: "Request not found" });
    }

    res.json({ message: "Request withdrawn successfully", request: deletedRequest });
  } catch (err) {
    res.status(500).json({ error: "Failed to withdraw request", details: err });
  }
};

module.exports = {
  createMentorshipRequest,
  matchMentorsBySkill,
  respondToMentorshipRequest,
  getRequestsByMentee,
  getRequestsForMentor,
  withdrawMentorshipRequest
};
