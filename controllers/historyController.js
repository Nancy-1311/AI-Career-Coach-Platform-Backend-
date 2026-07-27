const Feedback = require("../models/Feedback");

const getHistory = async (
  req,
  res
) => {
  try {
    const history =
      await Feedback.find({
        userId: req.user.id,
      })
        .populate(
          "interviewId"
        )
        .sort({
          createdAt: -1,
        });

    res.json(history);
  } catch (error) {
    res.status(500).json({
      message:
        error.message,
    });
  }
};

module.exports = {
  getHistory,
};