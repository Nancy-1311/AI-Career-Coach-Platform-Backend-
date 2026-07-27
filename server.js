const express = require("express");
const cors = require("cors");
require("dotenv").config();
const connectDB = require("./config/db");

console.log(connectDB);

const app = express();


connectDB();

app.use(cors({
  origin: "https://ai-career-coach-platform-frontend.vercel.app/",
    credentials: true,
}));
app.use(express.json());

const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const feedbackRoutes = require(
  "./routes/feedbackRoutes"
);
const dashboardRoutes = require(
  "./routes/dashboardRoutes"
);
const analyticsRoutes =
  require(
    "./routes/analyticsRoutes"
  );

  const historyRoutes =
  require(
    "./routes/historyRoutes"
  );

  const atsRoutes = require(
  "./routes/atsRoutes"
);

const jobMatchRoutes = require(
  "./routes/jobMatchRoutes"
);

const coverLetterRoutes =
  require(
    "./routes/coverLetterRoutes"
  );

  const roadmapRoutes =
  require(
    "./routes/roadmapRoutes"
  );

  const resumeImproverRoutes = require("./routes/resumeImproverRoutes")
const resumeBuilderRoutes =
  require(
    "./routes/resumeBuilderRoutes"
  );

app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use(
  "/api/feedback",
  feedbackRoutes
);

const interviewRoutes = require(
  "./routes/interviewRoutes"
);

app.use(
  "/api/interviews",
  interviewRoutes
);

app.use(
  "/api/dashboard",
  dashboardRoutes
);

app.use(
  "/api/analytics",
  analyticsRoutes
);

app.use(
  "/api/history",
  historyRoutes
);

app.use(
  "/api/ats",
  atsRoutes
);

app.use(
  "/api/jobmatch",
  jobMatchRoutes
);

app.use(
  "/api/coverletter",
  coverLetterRoutes
);

app.use(
  "/api/roadmap",
  roadmapRoutes
);

app.use("/api/resume", resumeImproverRoutes)

const resumeRoutes = require("./routes/resumeRoutes");
app.use("/api/resumes", resumeRoutes);

app.use(
  "/api/resume-builder",
  resumeBuilderRoutes
);

app.get("/", (req, res) => {
  res.send("Backend Running");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});