const mongoose = require("mongoose");

const coverLetterSchema =
  new mongoose.Schema(
    {
      userId: {
        type:
          mongoose.Schema.Types.ObjectId,
        ref: "User",
      },

      company: String,

      role: String,

      content: String,
    },
    {
      timestamps: true,
    }
  );

module.exports = mongoose.model(
  "CoverLetter",
  coverLetterSchema
);