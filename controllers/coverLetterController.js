const CoverLetter = require(
  "../models/CoverLetter"
);

const model = require(
  "../config/gemini"
);

const generateCoverLetter =
  async (req, res) => {
    try {
      const {
        company,
        role,
      } = req.body;

      const prompt = `
Generate a professional cover letter.

Company:
${company}

Role:
${role}

Return ONLY the cover letter text.
`;

      const result =
        await model.generateContent(
          prompt
        );

      const content =
        result.response.text();

      const coverLetter =
        await CoverLetter.create({
          userId: req.user.id,
          company,
          role,
          content,
        });

      res.status(201).json(
        coverLetter
      );
    } catch (error) {
      console.error(error);

      res.status(500).json({
        message:
          error.message,
      });
    }
  };

module.exports = {
  generateCoverLetter,
};