import mongoose from "mongoose";

const developerSchema = new mongoose.Schema(
  {
    price: {
      type: Number,
      default: 199,
      required: true,
    }
  },
  { timestamps: true }
);

const Developer = mongoose.model("Developer", developerSchema);

export default Developer;