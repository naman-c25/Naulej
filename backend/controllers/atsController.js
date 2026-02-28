import OpenAI from "openai";
import Student from "../models/studentModel.js";
const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export const atsChecker = async (req, res) => {
  try {
    const student = await Student.findById(req.user.id, {
      "resume.resumeText": 1,
      _id: 0,
    });
    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }
    const resumeText = student?.resume?.resumeText || "";
    const { jobDesc } = req.body;
    if (!resumeText) {
      return res.status(400).json({ message: "Please upload resume" });
    }
    if (!jobDesc) {
      return res
        .status(400)
        .json({ message: "Please provide job description" });
    }
    const prompt = `
You are an ATS (Applicant Tracking System) analyzer.
Analyze the following resume text against the provided job description.

Return your response STRICTLY in pure JSON format (no explanations, no extra text).

JSON format:
{
  "ats_score": number,
  "keyword_match_percentage": number,
  "missing_keywords": [string],
  "suggestions": [string]
}

---
Resume:
${resumeText}
---
Job Description:
${jobDesc}
    `;

    const response = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.3,
    });

    const resultText = response.choices[0].message.content.trim();

    let parsedResult;
    try {
      parsedResult = JSON.parse(resultText);
    } catch (err) {
      console.error("Error parsing in JSON", err);
      return res.status(500).json({
        message: "AI response was not valid JSON",
        rawResponse: resultText,
      });
    }
    res.json(parsedResult);
  } catch (error) {
    console.error("Error analyzing resume:", error);
    res.status(500).json({
      message: "Failed to analyze resume",
      error: error.message,
    });
  }
};
export default atsChecker;
