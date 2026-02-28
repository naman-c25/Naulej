import Jobs from "../models/jobOpeningModel.js";

export const getJobs = async (req, res) => {
  try {
    const jobs = await Jobs.find({ approvalStatus: true, deleteStatus: false }).sort({ _id: -1 });
    res.json(jobs);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

export const createJob = async (req, res) => {
  try {
    const { companyName, designation, description, imageUrl, salary } =
      req.body;
    const hrEmail = req.user.email;
    const newJob = new Jobs({
      companyName,
      designation,
      description,
      imageUrl,
      hrEmail,
      salary,
    });

    await newJob.save();
    res.status(201).json(newJob);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};
