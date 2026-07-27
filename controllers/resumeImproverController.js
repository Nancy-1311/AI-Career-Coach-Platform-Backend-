const Resume = require(
  "../models/Resume"
);

const model = require(
  "../config/gemini"
);

const improveResume = async (
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
You are a Senior Resume Writing Expert.

Analyze the resume below.

Resume:
${latestResume.extractedText}

Improve the resume.

Return ONLY valid JSON.

{
  "summary": "Improved professional summary",

  "improvedBullets": [
    {
      "original": "Original resume point",
      "improved": "Improved ATS-friendly version"
    }
  ],

  "keywordsAdded": [
    "React",
    "Node.js",
    "MongoDB"
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

    let resumeData;

    try {
      resumeData =
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

    res.status(200).json({
      summary:
        resumeData.summary ||
        "",

      improvedBullets:
        resumeData.improvedBullets ||
        [],

      keywordsAdded:
        resumeData.keywordsAdded ||
        [],
    });
  } catch (error) {
    console.error(
      "RESUME IMPROVER ERROR:"
    );

    console.error(error);

    res.status(500).json({
      message:
        error.message,
    });
  }
};

module.exports = {
  improveResume,
};