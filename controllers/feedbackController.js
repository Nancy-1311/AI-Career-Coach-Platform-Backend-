const Feedback = require("../models/Feedback");
const model = require("../config/gemini");

const generateFeedback = async (
  req,
  res
) => {
  try {
    const {
      interviewId,
      questions,
      answers,
    } = req.body;

    const prompt = `
You are an expert technical interviewer.

Evaluate the candidate answers.

Questions:
${JSON.stringify(questions)}

Answers:
${JSON.stringify(answers)}

Return ONLY valid JSON in this format:

{
  "overallScore": 85,
  "technicalKnowledge": 88,
  "communication": 82,
  "problemSolving": 86,
  "strengths": [
    "Strength 1",
    "Strength 2",
    "Strength 3"
  ],
  "improvements": [
    "Improvement 1",
    "Improvement 2",
    "Improvement 3"
  ],
  "recommendation": "Your recommendation"
}
`;

    const result =
      await model.generateContent(prompt);

    const response =
      result.response;

    const text =
      response.text();

    const cleanedText =
      text
        .replace(/```json/g, "")
        .replace(/```/g, "")
        .trim();

    const feedbackData =
      JSON.parse(cleanedText);

    const feedback =
      await Feedback.create({
        userId: req.user.id,
        interviewId,

        overallScore:
          feedbackData.overallScore,

        technicalKnowledge:
          feedbackData.technicalKnowledge,

        communication:
          feedbackData.communication,

        problemSolving:
          feedbackData.problemSolving,

        strengths:
          feedbackData.strengths,

        improvements:
          feedbackData.improvements,

        recommendation:
          feedbackData.recommendation,
      });

    res.status(201).json(
      feedback
    );

  } catch (error) {
    console.error(
      "FEEDBACK ERROR:"
    );
    console.error(error);

    res.status(500).json({
      message: error.message,
    });
  }
};

const getFeedbackByInterview =
  async (req, res) => {
    try {
      const feedback =
        await Feedback.findOne({
          interviewId:
            req.params.interviewId,
          userId: req.user.id,
        });

      if (!feedback) {
        return res.status(404).json({
          message:
            "Feedback not found",
        });
      }

      res.status(200).json(
        feedback
      );
    } catch (error) {
      res.status(500).json({
        message: error.message,
      });
    }
  };

module.exports = {
  generateFeedback,
   getFeedbackByInterview,
};