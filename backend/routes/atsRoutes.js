import express from "express";
import atsChecker from "../controllers/atsController.js";
import { authMiddleware ,authorizeRole} from "../middleware/authMiddleware.js";
import Student from "../models/studentModel.js";
import s3Client from "../config/s3Client.js";
import { GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
const router = express.Router();

router.post("/", authMiddleware, authorizeRole("student"), atsChecker);
router.get("/resume", authMiddleware, authorizeRole("student"), async (req, res) => {
  try {
    const userid = req.user.id;
    const student = await Student.findById(userid, {
      _id: 0,
      "resume.resumeUrl": 1,
    });

    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    let signedResumeUrl = null;
    if (student?.resume?.resumeUrl) {
      const command = new GetObjectCommand({
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: student.resume.resumeUrl,
      });
      signedResumeUrl = await getSignedUrl(s3Client, command, {
        expiresIn: 3000,
      });
    }

    res.json({ signedUrl: signedResumeUrl });
  } catch (error) {
    console.error("Error fetching resume:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

export default router;
