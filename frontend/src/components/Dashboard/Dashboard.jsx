import React, { useEffect, useState, useRef } from "react";
import { FaGithub, FaLinkedin } from "react-icons/fa";
import { CgWebsite } from "react-icons/cg";
import { Link } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import axios from "axios";
import Footer from "../Footer/Footer.jsx";
import Navbar from "../Navbar/Navbar.jsx";

function Dashboard() {
  const fileInputRef = useRef(null);
  const [message, setMessage] = useState("");
  const [reload, setReload] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [user, setUser] = useState({
    basicDetails: {
      name: "",
      isPremium: "",
    },
    signedResumeUrl: "",
    signedProfileUrl: "",
    socialLinks: { github: "", linkedin: "", portfolio: "" },
  });

  const formatLink = (url) => {
    if (
      !url.toLowerCase().startsWith("https://") &&
      !url.toLowerCase().startsWith("http://")
    ) {
      return "https://" + url;
    }
    return url;
  };

  const handleDownload = () => {
    if (user?.signedResumeUrl) {
      window.open(user.signedResumeUrl, "_blank");
    } else {
      toast.error("No resume available for download");
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}/dashboard`,
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
  }, [reload]);

  const uploadpdf = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.type !== "application/pdf") {
      setMessage("❌ Please select a valid PDF file.");
      return;
    }

    setUploading(true);
    setMessage("⏳ Uploading...");

    const formData = new FormData();
    formData.append("pdf", file);

    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/upload/pdf`,
        {
          method: "POST",
          body: formData,
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      const data = await res.json();
      if (res.ok) {
        setMessage("✅ " + data.message);

        setReload(!reload);
      } else {
        setMessage("❌ " + (data.message || "Upload failed"));
      }
    } catch (error) {
      console.error(error);
      setMessage("❌ Error uploading file");
    } finally {
      setUploading(false);
    }
  };

  return (
    <>
      <div>
        <Toaster />
      </div>
      <div className="min-h-screen bg-indigo-50 flex flex-col">
        <Navbar />

        <main className="flex flex-col items-center justify-start flex-grow pt-25 pb-6 px-6 md:px-12 space-y-10">
          <section className=" rounded-3xl p-8 w-full max-w-5xl relative text-center border border-gray-500">
            <Link to="/profile">
              <button className="absolute right-6 top-6 border border-emerald-600 text-emerald-700 px-4 py-1 rounded-lg text-sm hover:bg-emerald-600 hover:text-white transition hover:cursor-pointer">
                Profile
              </button>
            </Link>

            <div className=" flex flex-col items-center gap-4">
              <div className="w-28 h-28 rounded-full border-2 border-emerald-600 flex items-center justify-center">
                <img
                  src={
                    user?.signedProfileUrl ||
                    "https://www.w3schools.com/howto/img_avatar.png"
                  }
                  alt="Profile"
                  draggable="false"
                  className="w-full h-full object-cover rounded-full"
                />
              </div>

              <h2 className="text-2xl font-semibold text-emerald-700">
                {user?.basicDetails?.name}
              </h2>

              <div className="flex gap-5 mt-2">
                {user?.socialLinks?.github && (
                  <a
                    href={formatLink(user?.socialLinks?.github)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-emerald-700 hover:text-emerald-900 text-2xl transition"
                  >
                    <FaGithub />
                  </a>
                )}
                {user?.socialLinks?.linkedin && (
                  <a
                    href={formatLink(user?.socialLinks?.linkedin)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-emerald-700 hover:text-emerald-900 text-2xl transition"
                  >
                    <FaLinkedin />
                  </a>
                )}
                {user?.socialLinks?.portfolio && (
                  <a
                    href={formatLink(user?.socialLinks?.portfolio)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-emerald-700  hover:text-emerald-900 text-2xl transition"
                  >
                    <CgWebsite />
                  </a>
                )}
              </div>
            </div>
          </section>

          <section className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-5xl">
            <div className=" rounded-2xl p-6 border border-gray-500 flex flex-col justify-between">
              <h3 className="text-lg font-semibold text-emerald-700 mb-4 text-center">
                Resume Preview
              </h3>

              {user?.signedResumeUrl ? (
                <div className="w-full h-64">
                  <iframe
                    src={`${user?.signedResumeUrl}#zoom=fitH&toolbar=0&navpanes=0&scrollbar=0`}
                    className="w-full h-full rounded-lg border border-gray-500"
                    title="Resume Preview"
                  ></iframe>
                </div>
              ) : (
                <div className="flex items-center justify-center h-64 text-gray-400 text-sm border-2 border-dashed border-gray-500 bg-white/50 rounded-lg ">
                  No PDF Uploaded
                </div>
              )}

              <div className="flex justify-center gap-4 mt-5">
                <button
                  disabled={uploading}
                  onClick={handleDownload}
                  className="bg-emerald-700 text-white px-5 py-2 rounded-lg text-sm font-medium hover:bg-emerald-800 hover:cursor-pointer transition"
                >
                  Download
                </button>
                <button
                  onClick={uploadpdf}
                  disabled={uploading}
                  className="border border-emerald-700 text-emerald-700 px-5 py-2 rounded-lg text-sm font-medium hover:bg-emerald-700 hover:text-white hover:cursor-pointer transition"
                >
                  {uploading ? "Updating.." : "Update"}
                </button>
                <input
                  type="file"
                  ref={fileInputRef}
                  accept="application/pdf"
                  onChange={handleFileChange}
                  style={{ display: "none" }}
                />
              </div>
              <div className=" flex justify-center">
                {message && (
                  <p className="mt-4 text-gray-700 text-sm bg-gray-100 p-2 rounded">
                    {message}
                  </p>
                )}
              </div>
            </div>

            <div className="rounded-2xl p-6 border border-gray-500 flex flex-col justify-center items-center gap-6 text-center">
              <h3 className="text-xl font-semibold text-emerald-700">
                Career Tools
              </h3>
              <p className="text-gray-600 text-sm max-w-xs">
                Access all your career growth essentials — apply for jobs, check
                your resume’s ATS compatibility, and more.
              </p>

              <div className="flex flex-col justify-center sm:flex-row  gap-4 mt-2">
                <div className=" border-2 border-emerald-500 rounded-xl p-4 w-full sm:w-[45%] ">
                  <h4 className="text-emerald-700 font-semibold mb-1">
                    ATS Score
                  </h4>
                  <p className="text-gray-600 text-xs mb-3">
                    Upload your resume and get an instant ATS score with keyword
                    analysis.
                  </p>
                  <Link to="/ats-checker">
                    <button className="w-full border border-emerald-700 text-emerald-700 py-2 rounded-lg font-medium hover: cursor-pointer hover:bg-emerald-700 hover:text-white transition">
                      Check Score
                    </button>
                  </Link>
                </div>

                <div className="border-2 border-emerald-500 rounded-xl p-4 w-full sm:w-[45%] ">
                  <h4 className="text-emerald-700 font-semibold mb-1">
                    Job Portal
                  </h4>
                  <p className="text-gray-600 text-xs mb-3">
                    Explore job opportunities and apply directly using your
                    optimized resume.
                  </p>
                  <Link to="/job-portal">
                    <button className="w-full border border-emerald-700 text-emerald-700 py-2 rounded-lg font-medium hover:cursor-pointer hover:bg-emerald-700 hover:text-white transition">
                      Visit Portal
                    </button>
                  </Link>
                </div>
              </div>
            </div>
          </section>
        </main>
      </div>
      <Footer />
    </>
  );
}

export default Dashboard;
