const Feedback = require("../models/Feedback");

const getDashboardStats = async (
  req,
  res
) => {
  try {
    const feedbacks =
      await Feedback.find({
        userId: req.user.id,
      }).sort({
        createdAt: -1,
      });

    const totalInterviews =
      feedbacks.length;

    const averageScore =
      totalInterviews > 0
        ? Math.round(
            feedbacks.reduce(
              (sum, item) =>
                sum +
                item.overallScore,
              0
            ) / totalInterviews
          )
        : 0;

    const highestScore =
      totalInterviews > 0
        ? Math.max(
            ...feedbacks.map(
              (item) =>
                item.overallScore
            )
          )
        : 0;

    const latestScore =
      feedbacks[0]?.overallScore ||
      0;

    res.json({
      totalInterviews,
      averageScore,
      highestScore,
      latestScore,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  getDashboardStats,
};