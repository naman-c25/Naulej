import Application from "../models/application.js";
import Jobs from "../models/jobOpeningModel.js";
import Student from "../models/studentModel.js";
export const applyForJob = async (req, res) => {
  try {
    const studentId = req.user.id;

    const student = await Student.findById(studentId, {
      "resume.resumeUrl": 1,
    });
    if (!student || !student.resume || !student.resume.resumeUrl) {
      return res.status(400).json({ message: "resumeNotFound" });
    }

    const { jobId } = req.params;
    const job = await Jobs.findById(jobId);
    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    const hrEmail = job.hrEmail;

    const alreadyApplied = await Application.findOne({ studentId, jobId });
    if (alreadyApplied) {
      res.status(400).json({ message: "already applied" });
      return;
    }

    const application = await Application.create({
      studentId,
      jobId,
      hrEmail,
    });

    res
      .status(201)
      .json({ message: "Application submitted successfully", application });
  } catch (error) {
    console.error("Error applying for job:", error);
    res.status(500).json({ message: "Server error" });
  }
};
