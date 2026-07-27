const express = require("express");

const {
  improveResume,
} = require(
  "../controllers/resumeImproverController"
);

const protect = require(
  "../middleware/authMiddleware"
);

const router = express.Router();

router.post(
  "/improve",
  protect,
  improveResume
);

module.exports = router;