import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import Student from "../models/studentModel.js";
import HR from "../models/hrModel.js";

export const registerStudent = async (req, res) => {
  try {
    const { name, email, password } = req.body.basicDetails;
    const { role } = req.headers;
    if (role === "student") {
      const isAlreadySignedUp = await Student.findOne({
        "basicDetails.email": email.toLowerCase(),
      });
      if (isAlreadySignedUp) {
        return res.status(400).json({ message: "Already Signed up" });
      }

      const hashpassword = await bcrypt.hash(password, 10);

      const newStudent = new Student({
        basicDetails: {
          name: name.charAt(0).toUpperCase() + name.slice(1),
          email: email.toLowerCase(),
          password: hashpassword,
        },
      });
      await newStudent.save();

      const jwToken = jwt.sign(
        {
          id: newStudent._id,
          email: newStudent.basicDetails.email,
          role: "student",
        },
        process.env.JWT_SECRET,
        { expiresIn: "24h" }
      );
      res.status(201).json({
        message: "Registration successful",
        jwToken,
        email: newStudent.email,
        id: newStudent._id,
        isPremium: newStudent.basicDetails.isPremium,
        role: "student",
      });
    } else if (role === "hr") {
      const isAlreadySignedUp = await HR.findOne({ email });
      if (isAlreadySignedUp) {
        return res.status(400).json({ message: "Already Signed up" });
      }
      const hashpassword = await bcrypt.hash(password, 10);

      const newHR = new HR({
        name,
        email,
        password: hashpassword,
      });
      await newHR.save();
      const jwToken = jwt.sign(
        { id: newHR._id, email: newHR.email, role: "hr" },
        process.env.JWT_SECRET,
        { expiresIn: "24h" }
      );
      res.status(201).json({
        message: "Registration successful",
        jwToken,
        email: newHR.email,
        id: newHR._id,
        role: "hr",
      });
    } else {
      return res.status(400).json({ message: "Invalid role" });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const loginStudent = async (req, res) => {
  try {
    const { email, password } = req.body.basicDetails;
    const { role } = req.headers;

    if (role === "student") {
      const student = await Student.findOne({ "basicDetails.email": email.toLowerCase() });
      if (!student) {
        return res.status(400).json({ message: "Student not registered!" });
      }

      const checkPassword = await bcrypt.compare(
        password,
        student.basicDetails.password
      );

      if (!checkPassword) {
        return res.status(400).json({ message: "Incorrect password" });
      }

      const jwToken = jwt.sign(
        { id: student._id, email: student.basicDetails.email, role: "student" },
        process.env.JWT_SECRET,
        { expiresIn: "24h" }
      );

      res.json({
        message: "Login successful",
        jwToken,
        email: student.basicDetails.email,
        id: student._id,
        isPremium: student.basicDetails.isPremium,
        role: "student",
      });
    } else if (role === "hr") {
      const hr = await HR.findOne({ email });
      if (!hr) {
        return res.status(400).json({ message: "No records found for HR!" });
      }
      const checkPassword = await bcrypt.compare(password, hr.password);
      if (!checkPassword) {
        return res.status(400).json({ message: "Incorrect password" });
      }
      const jwToken = jwt.sign(
        { id: hr._id, email: hr.email, role: "hr" },
        process.env.JWT_SECRET,
        { expiresIn: "24h" }
      );
      res.json({
        message: "Login successful",
        jwToken,
        email: hr.email,
        id: hr._id,
        role: "hr",
      });
    } else {
      return res.status(400).json({ message: "Invalid role" });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
