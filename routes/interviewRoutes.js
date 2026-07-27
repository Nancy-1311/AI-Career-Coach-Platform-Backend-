const express = require("express");

const protect = require("../middleware/authMiddleware");

const {
  createInterview, getUserInterviews,
} = require("../controllers/interviewController");

const router = express.Router();

router.post(
  "/create",
  protect,
  createInterview
);

router.get(
  "/history",
  protect,
  getUserInterviews
);

module.exports = router;