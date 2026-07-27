const express = require("express");

const protect = require(
  "../middleware/authMiddleware"
);

const {
  generateFeedback,
  getFeedbackByInterview,
} = require(
  "../controllers/feedbackController"
);

const router = express.Router();

router.post(
  "/generate",
  protect,
  generateFeedback
);

router.get(
  "/:interviewId",
  protect,
  getFeedbackByInterview
);

module.exports = router;