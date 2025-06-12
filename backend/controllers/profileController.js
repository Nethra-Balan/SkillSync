const { User } = require("../models/user");

const getProfile = async (req, res) => {
	try {
		const user = await User.findById(req.params.id);
		if (!user) return res.status(404).json({ message: "User not found" });
		res.json(user);
	} catch (err) {
		console.error(err);
		res.status(500).json({ message: "Server error" });
	}
};

const normalizeToArray = (value) => {
	try {
		if (!value) return [];
		if (Array.isArray(value)) return value;
		return JSON.parse(value);
	} catch (err) {
		return [value];
	}
};



const updateProfile = async (req, res) => {
	try {
		const update = {
			bio: req.body.bio || "",
			skillsToTeach: normalizeToArray(req.body.skillsToTeach),
	        skillsToLearn: normalizeToArray(req.body.skillsToLearn)
		};

		if (req.file) {
			update.profilePicture = `/uploads/${req.file.filename}`;
		}

		const user = await User.findByIdAndUpdate(req.params.id, update, { new: true });
		if (!user) return res.status(404).json({ message: "User not found" });

		res.json(user);
	} catch (err) {
		console.error(err);
		res.status(500).json({ message: "Update failed" });
	}
};

module.exports = {
	getProfile,
	updateProfile,
};
