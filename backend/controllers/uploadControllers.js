import Student from "../models/studentModel.js";
import pdf from "pdf-extraction";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import s3Client from "../config/s3Client.js";
import { getUrl } from "./getObject.js";

export const uploadPdf = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }
    const id = req.user.id;

    const fileBuffer = req.file.buffer;

    const result = await pdf(fileBuffer);
    const fileKey = `resumes/${id}.pdf`;

    const uploadParams = {
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: fileKey,
      Body: fileBuffer,
      ContentType: req.file.mimetype,
    };

    await s3Client.send(new PutObjectCommand(uploadParams));

    await Student.findByIdAndUpdate(id, {
      $set: {
        "resume.resumeText": result.text,
        "resume.resumeUrl": fileKey,
      },
    });

    res.status(200).json({ message: " PDF uploaded successfully" });
  } catch (error) {
    console.error("Error parsing PDF:", error);
    res.status(500).json({ message: "Error processing PDF" });
  }
};

export const uploadImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }
    const id = req.user.id;

    const fileBuffer = req.file.buffer;
    const fileKey = `profiles/${id}.img`;
    const uploadParams = {
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: fileKey,
      Body: fileBuffer,
      ContentType: req.file.mimetype,
    };

    await s3Client.send(new PutObjectCommand(uploadParams));

    await Student.findByIdAndUpdate(id, {
      $set: {
        "basicDetails.profileUrl": fileKey,
      },
    });

    const signedProfileUrl = await getUrl(fileKey);

    res
      .status(200)
      .json({ message: " Image uploaded successfully", signedProfileUrl });
  } catch (err) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};
