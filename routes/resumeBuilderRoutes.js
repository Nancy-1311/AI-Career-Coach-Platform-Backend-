const express = require("express");

const {
  generateResume,
} = require(
  "../controllers/resumeBuilderController"
);

const protect = require(
  "../middleware/authMiddleware"
);

const router = express.Router();

router.post(
  "/generate",
  protect,
  generateResume
);

module.exports = router;