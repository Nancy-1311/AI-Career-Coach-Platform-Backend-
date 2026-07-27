const express = require("express");

const protect = require(
  "../middleware/authMiddleware"
);

const {
  generateCoverLetter,
} = require(
  "../controllers/coverLetterController"
);

const router =
  express.Router();

router.post(
  "/generate",
  protect,
  generateCoverLetter
);

module.exports = router;