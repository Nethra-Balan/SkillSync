const Resource = require("../models/Resource");

const uploadResource = async (req, res) => {
  const { title, skill, uploaderId } = req.body;
  const file = req.file;
  if (!title || !skill || !uploaderId || !file)
    return res.status(400).json({ error: "Missing fields" });

  try {
    const newResource = new Resource({
      title,
      skill,
      uploaderId,
      fileUrl: `/uploads/${file.filename}`
    });
    await newResource.save();
    res.status(201).json(newResource);
  } catch (err) {
    res.status(500).json({ error: "Upload failed", details: err });
  }
};

const getResourcesBySkill = async (req, res) => {
  const { skill } = req.query;
  try {
    const query = skill ? { skill: new RegExp(`^${skill}`, "i")} : {};
    const resources = await Resource.find(query).populate("uploaderId", "firstName lastName")
      .lean();

    resources.sort((a, b) => {
      const avgA = a.ratings?.length ? a.ratings.reduce((s, r) => s + r.rating, 0) / a.ratings.length : 0;
      const avgB = b.ratings?.length ? b.ratings.reduce((s, r) => s + r.rating, 0) / b.ratings.length : 0;
      return avgB - avgA;
    });

    res.json(resources);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch resources", details: err });
  }
};

const rateResource = async (req, res) => {
  const { resourceId } = req.params;
  const { userId, rating } = req.body;
  if (!userId || !rating)
    return res.status(400).json({ error: "Missing userId or rating" });

  try {
    const resource = await Resource.findById(resourceId);
    if (!resource) return res.status(404).json({ error: "Resource not found" });

    const existing = resource.ratings.find(r => r.userId.toString() === userId);
    if (existing) {
      existing.rating = rating;
    } else {
      resource.ratings.push({ userId, rating });
    }

    await resource.save();
    res.json({ message: "Rating submitted", resource });
  } catch (err) {
    res.status(500).json({ error: "Failed to rate", details: err });
  }
};

module.exports = { uploadResource, getResourcesBySkill, rateResource };
