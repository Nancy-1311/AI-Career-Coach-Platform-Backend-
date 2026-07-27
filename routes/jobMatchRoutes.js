const express = require("express");

const protect = require(
  "../middleware/authMiddleware"
);

const {
  analyzeJobMatch,
} = require(
  "../controllers/jobMatchController"
);

const router = express.Router();

router.post(
  "/analyze",
  protect,
  analyzeJobMatch
);

module.exports = router;