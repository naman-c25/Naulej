import express from "express";
import 'dotenv/config'
import "./config/db.js"
import bodyParser from "body-parser";
import studentRoutes from "./routes/studentRoutes.js";
import passport from "passport"
import authRoutes from './routes/authRoutes.js'
import "./config/passport.js"
import cors from "cors";
import authenticate from "./routes/authenticate.js"
import jobRoutes from "./routes/jobRoutes.js";
import atsRoutes from "./routes/atsRoutes.js";
import profileRoutes from "./routes/profileRoutes.js";
import dashboardRoutes from "./routes/dashboardRoutes.js";
import paymentRoutes from "./routes/paymentRoutes.js";
import uploadRoutes from "./routes/uploadRoutes.js";
import applyRoutes from "./routes/applyRoutes.js";
import hrRoutes from "./routes/hrRoutes.js";


const app = express();
app.use(bodyParser.json());
app.use(passport.initialize());
app.use(cors({
     origin:process.env.FRONTEND_URL,
}));
app.use("/authenticate",authenticate)
app.use("/students", studentRoutes);
app.use("/auth",authRoutes);
app.use("/jobs",jobRoutes);
app.use("/ats",atsRoutes);
app.use("/profile", profileRoutes);
app.use("/dashboard",dashboardRoutes);
app.use("/payment",paymentRoutes);
app.use("/upload",uploadRoutes)
app.use("/apply",applyRoutes);
app.use("/hr",hrRoutes);

app.get("/test",(req,res)=>{
    res.send("API is working");
})


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
