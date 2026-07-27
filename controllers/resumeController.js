const { PassThrough } = require("stream");
const pdfParse = require("pdf-parse");

const cloudinary = require("../config/cloudinary");
const Resume = require("../models/Resume");

const uploadBufferToCloudinary = (
  buffer,
  options = {}
) => {
  return new Promise((resolve, reject) => {
    const uploadStream =
      cloudinary.uploader.upload_stream(
        {
          folder: "ai-interview-resumes",
          resource_type: "auto",
          ...options,
        },
        (error, result) => {
          if (error) return reject(error);
          resolve(result);
        }
      );

    const stream = new PassThrough();

    stream.end(buffer);
    stream.pipe(uploadStream);
  });
};

const uploadResume = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        message: "Please upload a PDF resume",
      });
    }

    // Extract PDF Text
    const pdfData = await pdfParse(
      req.file.buffer
    );

    const extractedText =
      pdfData.text || "";

    // Upload PDF To Cloudinary
    const uploadResult =
      await uploadBufferToCloudinary(
        req.file.buffer,
        {
          public_id: `${Date.now()}-${req.file.originalname.replace(
            /\s+/g,
            "_"
          )}`,
        }
      );

    // Save To MongoDB
    const resume = await Resume.create({
      userId: req.user.id,
      originalName:
        req.file.originalname,
      fileUrl:
        uploadResult.secure_url,
      publicId:
        uploadResult.public_id,
      extractedText,
    });

    res.status(201).json({
      message:
        "Resume uploaded and parsed successfully",
      extractedText,
      resume,
    });
  } catch (error) {
    console.error(
      "RESUME UPLOAD ERROR:",
      error
    );

    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  uploadResume,
};