import mongoose from "mongoose";

const jobOpeningSchema = new mongoose.Schema(
  {
    companyName: {
      type: String,
      required: true,
    },
    designation: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    link: {
      type: String,
    },
    imageUrl: {
      type: String,
      required: true,
    },
    isPremium: {
      type: Boolean,
      default: true,
    },
    hrEmail: {
      type: String,
      required: true,
    },
    salary: {
      type: String,
      default: "--",
    },
    approvalStatus: {
      type: Boolean,
      default: false,
    },
    deleteStatus: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const Jobs = mongoose.model("Jobs", jobOpeningSchema);
export default Jobs;
