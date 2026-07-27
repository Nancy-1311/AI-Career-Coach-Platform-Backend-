const express = require("express");

const protect = require(
  "../middleware/authMiddleware"
);

const {
  analyzeResume,
} = require(
  "../controllers/atsController"
);

const router = express.Router();

router.post(
  "/analyze",
  protect,
  analyzeResume
);

module.exports = router;