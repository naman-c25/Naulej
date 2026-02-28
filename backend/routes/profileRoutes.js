import express from "express";
import { getProfile, updateProfile } from "../controllers/profileController.js";
const router = express.Router();
import { authMiddleware,authorizeRole } from "../middleware/authMiddleware.js";

router.get("/", authMiddleware, authorizeRole("student"), getProfile);
router.put("/", authMiddleware, authorizeRole("student"), updateProfile);

export default router;