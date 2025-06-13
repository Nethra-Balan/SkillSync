const express = require("express");
const router = express.Router();
const upload = require("../middleware/uploadResource");
const {
  uploadResource,
  getResourcesBySkill,
  rateResource
} = require("../controllers/resourceController");

router.post("/upload", upload.single("file"), uploadResource);
router.get("/", getResourcesBySkill);
router.post("/rate/:resourceId", rateResource);

module.exports = router;
