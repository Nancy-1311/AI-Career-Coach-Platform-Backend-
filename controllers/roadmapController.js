const Roadmap = require(
  "../models/Roadmap"
);

const model = require(
  "../config/gemini"
);

const generateRoadmap =
  async (req, res) => {
    try {
      const { role } = req.body;

      const prompt = `
You are an expert software mentor.

Create a detailed 8-week learning roadmap for:

${role}

Return ONLY the roadmap in plain text.
`;

      const result =
        await model.generateContent(
          prompt
        );

      const roadmapText =
        result.response.text();

      const roadmap =
        await Roadmap.create({
          userId: req.user.id,
          role,
          roadmap:
            roadmapText,
        });

      res.status(201).json(
        roadmap
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
  generateRoadmap,
};