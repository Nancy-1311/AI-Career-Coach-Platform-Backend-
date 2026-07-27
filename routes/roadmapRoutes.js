const express = require("express");

const protect = require(
  "../middleware/authMiddleware"
);

const {
  generateRoadmap,
} = require(
  "../controllers/roadmapController"
);

const router =
  express.Router();

router.post(
  "/generate",
  protect,
  generateRoadmap
);

module.exports = router;