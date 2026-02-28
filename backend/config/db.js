import mongoose from "mongoose";

const mongo_url = process.env.MONGO_URL;
mongoose
  .connect(mongo_url)
  .then(() => console.log("MongoDB connected..."))
  .catch((err) => console.log("Mongodb connection error:", err));
