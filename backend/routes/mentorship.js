const express = require("express");
const router = express.Router();
const {
  createMentorshipRequest,
  matchMentorsBySkill,
  respondToMentorshipRequest,
  getRequestsByMentee,
  getRequestsForMentor,
  withdrawMentorshipRequest
} = require("../controllers/mentorshipController");

router.post("/create", createMentorshipRequest);
router.get("/match", matchMentorsBySkill);
router.post("/respond/:id", respondToMentorshipRequest);
router.get("/mentee/:menteeId", getRequestsByMentee);
router.get("/mentor/:mentorId", getRequestsForMentor);
router.delete("/withdraw/:id", withdrawMentorshipRequest);

module.exports = router;
