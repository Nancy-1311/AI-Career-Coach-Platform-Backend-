const mongoose = require("mongoose");

const roadmapSchema =
  new mongoose.Schema(
    {
      userId: {
        type:
          mongoose.Schema.Types.ObjectId,
        ref: "User",
      },

      role: String,

      roadmap: String,
    },
    {
      timestamps: true,
    }
  );

module.exports = mongoose.model(
  "Roadmap",
  roadmapSchema
);