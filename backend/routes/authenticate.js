import express from "express";
import jwt, { decode } from "jsonwebtoken";
import Student from "../models/studentModel.js";
const router = express.Router();

router.get("/", async (req, res) => {
  const jwToken = req.header("Authorization")?.replace("Bearer ", "");

  if (!jwToken)
    return res.status(401).json({ valid: false, message: "No token provided" });
  try {
    const decoded = jwt.verify(jwToken, process.env.JWT_SECRET);
    if (decoded.role === "student") {
      const student = await Student.findById(decoded.id, {
        "basicDetails.isPremium": 1,
      });
      return res
        .status(200)
        .json({
          valid: true,
          email: decoded.email,
          id: decoded.id,
          isPremium: student.basicDetails.isPremium,
          role: decoded.role,
        });
    } else if (decoded.role === "hr") {
      return res
        .status(200)
        .json({
          valid: true,
          email: decoded.email,
          id: decoded.id,
          role: decoded.role,
        });
    }
  } catch (err) {
    return res
      .status(401)
      .json({ valid: false, message: "Invalid or expired token" });
  }
});

export default router;
