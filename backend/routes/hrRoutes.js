import express from "express";
import { authMiddleware,authorizeRole } from "../middleware/authMiddleware.js";


import { getPostedJobs, getApplications , getsignedUrl,deleteJob} from "../controllers/hrDashboard.js";
const router = express.Router();


 router.get("/job-posted", authMiddleware, authorizeRole("hr"), getPostedJobs);
 router.get("/applications", authMiddleware, authorizeRole("hr"), getApplications);
 router.get("/checkresume", authMiddleware, authorizeRole("hr"), getsignedUrl);
router.get("/delete-job", authMiddleware, authorizeRole("hr"), deleteJob);
export default router;