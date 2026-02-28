import express from "express";
import jwt from "jsonwebtoken";
import passport from "../config/passport.js";
import Student from "../models/studentModel.js";
import HR from "../models/hrModel.js";

const router = express.Router();

router.get("/google", (req, res, next) => {
  const role = req.query.role || "student";
  const state = JSON.stringify({ role });
  passport.authenticate("google", {
    scope: ["profile", "email"],
    state,
    prompt: "select_account",
  })(req, res, next);
});

router.get(
  "/google/callback",
  passport.authenticate("google", { session: false }),
  async (req, res) => {
    const state = JSON.parse(req.query.state) || {};
    const role = state.role || "student";
    const { email, name } = req.user;

    let user;
    if (role === "student") {
      user = await Student.findOne({ "basicDetails.email": email });
      if (!user) {
        user = new Student({
          basicDetails: {
            name,
            email,
            password: "google_oauth",
            google: true,
          },
        });
        await user.save();
      }
    } else if (role === "hr") {
      user = await HR.findOne({ email });
      if (!user) {
        user = new HR({
          name,
          email,
          password: "google_oauth",
          google: true,
        });
        await user.save();
      }
    }

    const token = jwt.sign(
      { id: user._id, email, role },
      process.env.JWT_SECRET,
      { expiresIn: "24h" }
    );

    res.redirect(
      `${
        process.env.FRONTEND_URL
      }/auth/redirect?token=${token}&id=${encodeURIComponent(
        String(user._id)
      )}&email=${encodeURIComponent(email)}&role=${encodeURIComponent(role)}`
    );
  }
);

export default router;
