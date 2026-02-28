import React, { useEffect } from "react";
import { motion } from "framer-motion";
import { AlertCircle } from "lucide-react";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { useState } from "react";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import Navbar from "../Navbar/Navbar.jsx";
import Footer from "../Footer/Footer.jsx";

function AtsPage() {
  const [jobDesc, setJobDesc] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const [user, setUser] = useState({
    signedUrl: "",
  });
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}/ats/resume`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        setUser(response.data);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchData();
  }, []);

  const handleSubmit = async () => {
    if (!user?.signedUrl) {
      toast.error("Please upload your resume");
      return;
    }
    if (!jobDesc.trim()) {
      toast.error("Please enter a job description.");
      return;
    }
    setLoading(true);
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/ats`, {
        method: "POST",
        headers: {
          "content-type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ jobDesc }),
      });

      const data = await response.json();
      if (!response.ok) {
        toast.error(data.message || "An Error occurred. Please try again");
        return;
      }
      setResult(data);
    } catch (error) {
      toast.error("An Error occurred. Please try again");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div>
        <Toaster />
      </div>

      <div className="min-h-screen bg-indigo-50 flex flex-col">
        <Navbar />

        <main className="flex flex-col items-center justify-start flex-grow pt-20 pb-6 px-6 md:px-12 space-y-10">
          <h1 className="text-2xl text-center font-bold text-[#E35049] mb-6">
            AI-Powered Resume ATS Checker
          </h1>

          <section className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-5xl">
            <div className="border border-gray-500 rounded-2xl p-6  flex flex-col justify-top">
              <h3 className="text-lg font-semibold text-emerald-700 mb-4 text-center">
                Resume Preview
              </h3>

              {user?.signedUrl ? (
                <div className="w-full h-80">
                  <iframe
                    src={`${user?.signedUrl}#zoom=fitH&toolbar=0&navpanes=0&scrollbar=0`}
                    className="w-full h-full rounded-lg border border-gray-500"
                    title="Resume Preview"
                  ></iframe>
                </div>
              ) : (
                <div className="flex items-center justify-center h-80 text-gray-400 text-sm border-2 border-dashed border-gray-500 rounded-lg bg-white/50">
                  No PDF Uploaded
                </div>
              )}
            </div>

            <div className="border border-gray-500 rounded-2xl p-6  flex flex-col justify-center items-center ">
              <h3 className="text-lg font-semibold text-emerald-700 mb-4 text-center">
                Job Description
              </h3>
              <textarea
                value={jobDesc}
                onChange={(e) => setJobDesc(e.target.value)}
                className="w-full h-80 p-4 mb-8 bg-white/50 border-2  border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-1 focus:ring-gray-500"
                placeholder="Paste the job description here..."
              ></textarea>
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="w-48 bg-emerald-700 text-white py-2 rounded-lg font-medium hover:bg-emerald-800 transition hover:cursor-pointer flex justify-center items-center"
              >
                {loading ? (
                  <div className="w-8 h-8 border-4 border-white/40 border-t-white rounded-full animate-spin"></div>
                ) : (
                  "Check ATS Score"
                )}
              </button>
            </div>
          </section>

          {result ? (
            <div className=" border border-gray-500  rounded-2xl p-8 w-full max-w-5xl mx-auto mt-8">
              <h2 className="text-2xl font-semibold text-emerald-700 mb-6 text-center">
                ATS Resume Analysis Report
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                <div className="flex flex-col items-center justify-center  rounded-xl p-6 border border-gray-500">
                  <h3 className="text-lg font-semibold text-emerald-700 mb-2">
                    ATS Score
                  </h3>
                  <div className="w-36 h-36">
                    <CircularProgressbar
                      value={result.ats_score}
                      text={`${result.ats_score}%`}
                      styles={buildStyles({
                        textColor: "#059669",
                        pathColor: "#059669",
                        trailColor: "#a7f3d0",
                        textSize: "18px",
                      })}
                    />
                  </div>
                </div>

                <div className="flex flex-col items-center justify-center  rounded-xl p-6 border border-gray-500">
                  <h3 className="text-lg font-semibold text-emerald-700 mb-2">
                    Keyword Match
                  </h3>
                  <div className="w-full bg-emerald-200 rounded-full h-4">
                    <motion.div
                      className="bg-emerald-600 h-4 rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${result.keyword_match_percentage}%` }}
                      transition={{ duration: 1 }}
                    />
                  </div>
                  <p className="mt-2 text-emerald-700 font-medium">
                    {result.keyword_match_percentage}% Match
                  </p>
                </div>
              </div>

              <div className="mb-8">
                <h3 className="text-lg font-semibold text-emerald-700 mb-3">
                  Missing Keywords
                </h3>
                {result.missing_keywords &&
                result.missing_keywords.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {result.missing_keywords.map((keyword, i) => (
                      <span
                        key={i}
                        className="bg-red-100 text-red-700 text-sm font-medium px-3 py-1 rounded-full shadow-sm"
                      >
                        {keyword}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500">No missing keywords found 🎉</p>
                )}
              </div>

              <div>
                <h3 className="text-lg font-semibold text-emerald-700 mb-3">
                  Improvement Suggestions
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {result.suggestions.map((tip, i) => (
                    <div
                      key={i}
                      className="flex items-start gap-3 p-4 bg-indigo-100 rounded-xl  border border-gray-300"
                    >
                      <AlertCircle className="text-amber-600 w-5 h-5 mt-1" />

                      <p className="text-gray-700 text-sm">{tip}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <section className="  rounded-3xl p-8 w-full max-w-5xl relative text-center border border-gray-500">
              <p className="font-bold text-gray-500">
                Result will be shown here.....
              </p>
            </section>
          )}
        </main>
      </div>
      <Footer />
    </>
  );
}

export default AtsPage;
