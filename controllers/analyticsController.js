const Feedback = require("../models/Feedback");

const getPerformanceTrend =
  async (req, res) => {
    try {
      const feedbacks =
        await Feedback.find({
          userId: req.user.id,
        }).sort({
          createdAt: 1,
        });

      const trend =
        feedbacks.map(
          (item, index) => ({
            interview:
              index + 1,
            score:
              item.overallScore,
          })
        );

      res.json(trend);
    } catch (error) {
      res.status(500).json({
        message:
          error.message,
      });
    }
  };

module.exports = {
  getPerformanceTrend,
};