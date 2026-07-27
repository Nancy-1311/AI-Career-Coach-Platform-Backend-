const JobMatch = require(
  "../models/JobMatch"
);

const Resume = require(
  "../models/Resume"
);

const model = require(
  "../config/gemini"
);

const analyzeJobMatch = async (
  req,
  res
) => {
  try {
    const { jobDescription } =
      req.body;

    const latestResume =
      await Resume.findOne({
        userId: req.user.id,
      }).sort({
        createdAt: -1,
      });

    if (!latestResume) {
      return res.status(404).json({
        message:
          "Resume not found",
      });
    }

    const prompt = `
You are an expert recruiter.

Compare the resume and job description.

Resume:
${latestResume.extractedText}

Job Description:
${jobDescription}

Return ONLY JSON:

{
  "matchScore": 85,
  "matchedSkills": [],
  "missingSkills": [],
  "recommendations": []
}
`;

    const result =
      await model.generateContent(
        prompt
      );

    const text =
      result.response
        .text()
        .replace(/```json/g, "")
        .replace(/```/g, "")
        .trim();

    const data =
      JSON.parse(text);

    const match =
      await JobMatch.create({
        userId: req.user.id,
        matchScore:
          data.matchScore,
        matchedSkills:
          data.matchedSkills,
        missingSkills:
          data.missingSkills,
        recommendations:
          data.recommendations,
      });

    res.status(201).json(
      match
    );
  } catch (error) {
    res.status(500).json({
      message:
        error.message,
    });
  }
};

module.exports = {
  analyzeJobMatch,
};