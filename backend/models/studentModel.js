import mongoose from "mongoose";

const basicDetailsSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      require: true,
    },
    email: {
      type: String,
      require: true,
    },
    password: {
      type: String,
      require: true,
    },
    mobile: {
      type: String,
    },
    description: {
      type: String,
    },
    profileUrl: {
      type: String,
    },
    isPremium: {
      type: Boolean,
      default: false,
    },
    google: {
      type: Boolean,
      default: false,
    },
  },
  { _id: false }
);

const academicDetailsSchema = new mongoose.Schema(
  {
    collegeName: { type: String },
    course: { type: String },
    year: { type: String },
    cgpa: { type: String },
    intermediateBoard: { type: String },
    intermediatePercentage: { type: String },
    highSchoolBoard: { type: String },
    highSchoolPercentage: { type: String },
  },
  { _id: false }
);

const resumeSchema = new mongoose.Schema(
  {
    resumeUrl: { type: String },
    resumeText: { type: String },
  },
  { _id: false }
);

const socialLinksSchema = new mongoose.Schema(
  {
    github: { type: String },
    linkedin: { type: String },
    portfolio: { type: String },
  },
  { _id: false }
);

const studentSchema = new mongoose.Schema(
  {
    basicDetails: basicDetailsSchema,
    academicDetails: academicDetailsSchema,
    resume: resumeSchema,
    socialLinks: socialLinksSchema,
  },
  { timestamps: true }
);
studentSchema.index({ "basicDetails.email": 1 }, { unique: true });
const Student = mongoose.model("Student", studentSchema);

export default Student;
