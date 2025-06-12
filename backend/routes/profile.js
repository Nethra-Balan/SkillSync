const express = require("express");
const router = express.Router();
const upload = require("../middleware/upload");
const { getProfile, updateProfile } = require("../controllers/profileController");

router.get("/:id", getProfile);
router.put("/:id", upload.single("profilePicture"), updateProfile);

module.exports = router;
