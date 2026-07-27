const model = require(
  "../config/gemini"
);

const generateResume = async (
  req,
  res
) => {
  try {
    const {
      fullName,
      email,
      phone,
      skills,
      education,
      projects,
      experience,
    } = req.body;

    const prompt = `
You are a professional ATS Resume Writer.

Create a complete ATS-friendly resume.

Candidate Details:

Name: ${fullName}
Email: ${email}
Phone: ${phone}

Skills:
${skills}

Education:
${education}

Projects:
${projects}

Experience:
${experience}

Return ONLY the resume text.

Structure:

PROFESSIONAL SUMMARY

TECHNICAL SKILLS

PROJECTS

EXPERIENCE

EDUCATION
`;

    let result;

    try {
      result =
        await model.generateContent(
          prompt
        );
    } catch (error) {
      return res.status(500).json({
        message:
          "Gemini is busy. Please try again.",
      });
    }

    const resume =
      result.response.text();

    res.status(200).json({
      resume,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message:
        error.message,
    });
  }
};

module.exports = {
  generateResume,
};