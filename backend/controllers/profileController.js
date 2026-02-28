import Student from "../models/studentModel.js";
import { S3Client } from "@aws-sdk/client-s3";
import { GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import s3Client from "../config/s3Client.js";

export const getProfile = async (req, res) => {
  try {
    const student = await Student.findById(req.user.id).select(
      "-basicDetails.password -resume -_id"
    );
    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    let signedProfileUrl = null;

    if (student.basicDetails.profileUrl) {
      const command = new GetObjectCommand({
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: student.basicDetails.profileUrl,
      });
      signedProfileUrl = await getSignedUrl(s3Client, command, {
        expiresIn: 300,
      });
    }

    res.status(200).json({
      ...student.toObject(),
      signedProfileUrl,
    });
  } catch (err) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};
export const updateProfile = async (req, res) => {
  try {
    const { basicDetails, academicDetails, socialLinks } = req.body;

    const basic = {};
    if (basicDetails?.name) basic["basicDetails.name"] = basicDetails.name;
    if (basicDetails?.mobile)
      basic["basicDetails.mobile"] = basicDetails.mobile;
    if (basicDetails?.description)
      basic["basicDetails.description"] = basicDetails.description;
    const updatedDetails = {
      ...basic,
      academicDetails,
      socialLinks,
    };

    const student = await Student.findByIdAndUpdate(
      req.user.id,
      { $set: updatedDetails },
      { new: true, runValidators: true }
    ).select("-basicDetails.password -resume -_id");
    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }
    res.status(200).json(student);
  } catch (err) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};
