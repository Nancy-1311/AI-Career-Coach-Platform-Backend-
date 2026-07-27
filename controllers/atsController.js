const ATSAnalysis = require(
  "../models/ATSAnalysis"
);

const Resume = require(
  "../models/Resume"
);

const model = require(
  "../config/gemini"
);

const analyzeResume = async (
  req,
  res
) => {
  try {
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
You are an ATS Resume Expert.

Analyze the resume below.

Resume:
${latestResume.extractedText}

Return ONLY valid JSON.

{
  "atsScore": 85,
  "strengths": [
    "Strength 1",
    "Strength 2"
  ],
  "weaknesses": [
    "Weakness 1",
    "Weakness 2"
  ],
  "missingKeywords": [
    "Keyword 1",
    "Keyword 2"
  ],
  "suggestions": [
    "Suggestion 1",
    "Suggestion 2"
  ]
}
`;

    let result;

    try {
      result =
        await model.generateContent(
          prompt
        );
    } catch (error) {
      console.error(
        "Gemini Error:",
        error
      );

      return res.status(500).json({
        message:
          "Gemini is busy. Please try again in a few seconds.",
      });
    }

    const text =
      result.response.text();

    const cleanedText =
      text
        .replace(/```json/g, "")
        .replace(/```/g, "")
        .trim();

    let analysisData;

    try {
      analysisData =
        JSON.parse(cleanedText);
    } catch (error) {
      console.error(
        "JSON Parse Error:"
      );

      console.error(
        cleanedText
      );

      return res.status(500).json({
        message:
          "Failed to parse AI response.",
      });
    }

    const analysis =
      await ATSAnalysis.create({
        userId: req.user.id,

        resumeId:
          latestResume._id,

        atsScore:
          analysisData.atsScore,

        strengths:
          analysisData.strengths || [],

        weaknesses:
          analysisData.weaknesses || [],

        missingKeywords:
          analysisData.missingKeywords || [],

        suggestions:
          analysisData.suggestions || [],
      });

    res.status(201).json(
      analysis
    );
  } catch (error) {
    console.error(
      "ATS ERROR:"
    );

    console.error(error);

    res.status(500).json({
      message:
        error.message,
    });
  }
};

module.exports = {
  analyzeResume,
};