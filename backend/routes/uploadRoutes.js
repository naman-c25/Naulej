import express from "express";
import { uploadPdf, uploadImage } from "../controllers/uploadControllers.js";
import { authMiddleware ,authorizeRole} from "../middleware/authMiddleware.js";
import { upload } from "../middleware/uploadMiddleware.js";
const router = express.Router();

router.post("/pdf", authMiddleware, authorizeRole("student"), upload.single("pdf"), uploadPdf);

router.post("/image", authMiddleware, authorizeRole("student"), upload.single("image"), uploadImage);

export default router;