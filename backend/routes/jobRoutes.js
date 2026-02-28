import express from "express"
import { getJobs , createJob} from "../controllers/jobController.js";
import { authMiddleware,authorizeRole } from "../middleware/authMiddleware.js";
const router = express.Router();

router.get("/", authMiddleware, authorizeRole("student"), getJobs);
router.post("/", authMiddleware, authorizeRole("hr"), createJob);

export default router;