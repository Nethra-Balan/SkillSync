const mongoose = require("mongoose");

const mentorshipRequestSchema = new mongoose.Schema({
  skill: { type: String, required: true },
  preferredTime: { type: String, required: true },
  menteeId: { type: mongoose.Schema.Types.ObjectId, ref: "user", required: true },
  mentorId: { type: mongoose.Schema.Types.ObjectId, ref: "user", required: true}, 
  status: { type: String, enum: ["pending", "accepted", "declined"], default: "pending" },
}, { timestamps: true });

module.exports = mongoose.model("MentorshipRequest", mentorshipRequestSchema);
