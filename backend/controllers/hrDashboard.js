import Jobs from "../models/jobOpeningModel.js";
import Application from "../models/application.js";
import Student from "../models/studentModel.js";
import { getUrl } from "./getObject.js";

export const getPostedJobs = async (req, res) => {
  try {
    const hrEmail = req.user.email;
    const jobs = await Jobs.find({ hrEmail }).sort({ _id: -1 });

    const jobData = await Promise.all(
      jobs.map(async (job) => {
        const totalApplications = await Application.countDocuments({
          jobId: job._id,
        });
        return {
          id: job._id,
          designation: job.designation,
          salary: job.salary,
          totalApplications,
          approvalStatus: job.approvalStatus,
          deleteStatus: job.deleteStatus,

        };
      })
    );
    res.status(200).json(jobData);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching HR jobs" });
  }
};


export const getApplications = async (req, res) => {
  try {
    const hrEmail = req.user.email;
    const applications = await Application.find({ hrEmail })
      .populate("studentId")
      .populate("jobId");

    const data = applications.map((application) => ({
      id: application.id,
      name: application.studentId?.basicDetails.name,
      email: application.studentId?.basicDetails.email,
      designation: application.jobId?.designation,
      resumeUrl: application.studentId?.resume.resumeUrl,
    }));
    res.status(200).json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching HR application" });
  }
};

export const getsignedUrl = async (req, res) => {
  const { key } = req.query;
  try {
    const url = await getUrl(key);
    res.status(200).json({ url });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching signed URL" });
  }
};
export const deleteJob = async (req, res) => {
  const { jobId } = req.query;
  try {
    await Jobs.findByIdAndUpdate(jobId, { deleteStatus: true });
    res.status(200).json({ message: "Job deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error deleting job" });
  }
};
