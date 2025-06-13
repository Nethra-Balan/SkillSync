const mongoose = require("mongoose");

const resourceSchema = new mongoose.Schema({
  title: { type: String, required: true },
  skill: { type: String, required: true },
  uploaderId: { type: mongoose.Schema.Types.ObjectId, ref: "user", required: true },
  fileUrl: { type: String, required: true },
  ratings: [
    {
      userId: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
      rating: { type: Number, min: 1, max: 5 }
    }
  ]
}, { timestamps: true });

resourceSchema.virtual("averageRating").get(function () {
  if (this.ratings.length === 0) return 0;
  const total = this.ratings.reduce((sum, r) => sum + r.rating, 0);
  return total / this.ratings.length;
});

resourceSchema.set("toObject", { virtuals: true });
resourceSchema.set("toJSON", { virtuals: true });

module.exports = mongoose.model("Resource", resourceSchema);
