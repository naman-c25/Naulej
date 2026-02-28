import express from "express";
import { authMiddleware, authorizeRole } from "../middleware/authMiddleware.js";
import Student from "../models/studentModel.js";
import s3Client from "../config/s3Client.js";
import { GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const router = express.Router();

router.get("/", authMiddleware, authorizeRole("student"), async (req, res) => {
  try {
    const student = await Student.findById(req.user.id, {
      _id: 0,
      "basicDetails.name": 1,
      "basicDetails.profileUrl": 1,
      "basicDetails.isPremium": 1,
      socialLinks: 1,
      "resume.resumeUrl": 1,
    });
    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    let signedResumeUrl = null;
    let signedProfileUrl = null;
    if (student?.resume?.resumeUrl) {
      const command = new GetObjectCommand({
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: student.resume.resumeUrl,
      });
      signedResumeUrl = await getSignedUrl(s3Client, command, {
        expiresIn: 300,
      });
    }

    if (student.basicDetails.profileUrl) {
      const command = new GetObjectCommand({
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: student.basicDetails.profileUrl,
      });
      signedProfileUrl = await getSignedUrl(s3Client, command, {
        expiresIn: 300,
      });
    }

    res.json({
      ...student.toObject(),
      signedResumeUrl,
      signedProfileUrl,
    });
  } catch (error) {
    console.error("Error fetching dashboard data:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

export default router;
