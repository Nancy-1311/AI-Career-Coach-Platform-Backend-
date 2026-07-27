const mongoose = require("mongoose");

const jobMatchSchema =
  new mongoose.Schema(
    {
      userId: {
        type:
          mongoose.Schema.Types.ObjectId,
        ref: "User",
      },

      matchScore: Number,

      matchedSkills: [String],

      missingSkills: [String],

      recommendations: [String],
    },
    {
      timestamps: true,
    }
  );

module.exports = mongoose.model(
  "JobMatch",
  jobMatchSchema
);