import express from "express";
import { applyForJob } from "../controllers/applyController.js";
import { authMiddleware,authorizeRole } from "../middleware/authMiddleware.js";
const router = express.Router();

router.post("/job/:jobId", authMiddleware, authorizeRole("student"), applyForJob);

export default router;
