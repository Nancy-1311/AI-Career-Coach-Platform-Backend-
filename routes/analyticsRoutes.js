const express =
  require("express");

const protect =
  require(
    "../middleware/authMiddleware"
  );

const {
  getPerformanceTrend,
} = require(
  "../controllers/analyticsController"
);

const router =
  express.Router();

router.get(
  "/trend",
  protect,
  getPerformanceTrend
);

module.exports = router;