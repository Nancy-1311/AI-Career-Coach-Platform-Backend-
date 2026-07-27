const mongoose = require("mongoose");

const atsAnalysisSchema =
  new mongoose.Schema(
    {
      userId: {
        type:
          mongoose.Schema.Types.ObjectId,
        ref: "User",
      },

      resumeId: {
        type:
          mongoose.Schema.Types.ObjectId,
        ref: "Resume",
      },

      atsScore: Number,

      strengths: [String],

      weaknesses: [String],

      missingKeywords: [String],

      suggestions: [String],
    },
    {
      timestamps: true,
    }
  );

module.exports = mongoose.model(
  "ATSAnalysis",
  atsAnalysisSchema
);