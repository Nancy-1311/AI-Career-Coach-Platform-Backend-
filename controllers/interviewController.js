const Interview = require("../models/Interview");
const Resume = require("../models/Resume");
const Feedback = require("../models/Feedback");
const model = require("../config/gemini");

const createInterview = async (req, res) => {
  try {
    const {
      role,
      level,
      topic,
      questionCount,
    } = req.body;

    const latestResume =
      await Resume.findOne({
        userId: req.user.id,
      }).sort({
        createdAt: -1,
      });

    const resumeText =
      latestResume?.extractedText || "";

    let questions = [];

    try {
      console.log("ROLE:", role);
      console.log("LEVEL:", level);
      console.log("TOPIC:", topic);
      console.log(
        "QUESTION COUNT:",
        questionCount
      );

      const prompt = `
You are an expert technical interviewer.

Candidate Resume:
${resumeText}

Target Role:
${role}

Experience Level:
${level}

Topic:
${topic}

Generate EXACTLY ${questionCount} interview questions.

Rules:
1. Questions must match the role.
2. Questions must match the experience level.
3. Questions must focus on the selected topic.
4. Use information from the resume when possible.
5. Return ONLY a JSON array.
6. Do NOT use markdown.
7. Do NOT wrap in \`\`\`json.
8. Do NOT return explanations.

Example:

[
  "Question 1",
  "Question 2",
  "Question 3"
]
`;

      console.log(
        "GENERATING QUESTIONS..."
      );

      const result =
        await model.generateContent(
          prompt
        );

      const geminiText =
        result.response.text();

      console.log(
        "RAW RESPONSE START"
      );
      console.log(geminiText);
      console.log(
        "RAW RESPONSE END"
      );

      try {
        const cleanedText =
          geminiText
            .replace(
              /```json/g,
              ""
            )
            .replace(
              /```/g,
              ""
            )
            .trim();

        questions =
          JSON.parse(
            cleanedText
          );

        if (
          !Array.isArray(
            questions
          )
        ) {
          throw new Error(
            "Response is not an array"
          );
        }
      } catch (parseError) {
        console.log(
          "JSON PARSE FAILED - USING FALLBACK"
        );

        questions = geminiText
          .split("\n")
          .map((q) =>
            q
              .replace(
                /^\d+[\).\-\s]*/,
                ""
              )
              .replace(
                /^["']/,
                ""
              )
              .replace(
                /["'],?$/,
                ""
              )
              .trim()
          )
          .filter(
            (q) =>
              q &&
              q !== "[" &&
              q !== "]" &&
              q !==
                "```json" &&
              q !== "```"
          );
      }

      questions = questions
        .filter(Boolean)
        .slice(
          0,
          Number(
            questionCount
          )
        );

      console.log(
        "FINAL QUESTIONS:",
        questions.length
      );
    } catch (geminiError) {
      console.error(
        "GEMINI QUESTION GENERATION ERROR:"
      );

      console.error(
        geminiError
      );

      questions = [
        "Tell me about yourself.",
        "Explain your most recent project.",
        "What is React?",
        "What are React Hooks?",
        "Explain Virtual DOM.",
        "What is Node.js?",
        "What is Express.js?",
        "What is MongoDB?",
        "Explain JWT Authentication.",
        "Difference between SQL and NoSQL?",
      ];
    }

    const interview =
      await Interview.create({
        userId:
          req.user.id,
        role,
        level,
        topic,
        questionCount,
        questions,
      });

    res.status(201).json(
      interview
    );
  } catch (error) {
    console.error(
      "INTERVIEW ERROR:"
    );

    console.error(error);

    res.status(500).json({
      message:
        error.message,
    });
  }
};

const getUserInterviews =
  async (req, res) => {
    try {
      const interviews =
        await Interview.find({
          userId:
            req.user.id,
        }).sort({
          createdAt: -1,
        });

      const interviewsWithFeedback =
        await Promise.all(
          interviews.map(
            async (
              interview
            ) => {
              const feedback =
                await Feedback.findOne(
                  {
                    interviewId:
                      interview._id,
                    userId:
                      req.user
                        .id,
                  }
                );

              return {
                ...interview.toObject(),
                hasFeedback:
                  !!feedback,
              };
            }
          )
        );

      res
        .status(200)
        .json(
          interviewsWithFeedback
        );
    } catch (error) {
      res.status(500).json({
        message:
          error.message,
      });
    }
  };

module.exports = {
  createInterview,
  getUserInterviews,
};

