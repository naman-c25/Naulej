import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import Navbar from "../Navbar/Navbar";
import Footer from "../Footer/Footer";

function JobPortal() {
  const [jobOpenings, setJobOpenings] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const [popupState, setPopupState] = useState("loading");
  const isPremium = useSelector((state) => state.auth.isPremium);
  const id = useSelector((state) => state.auth.id);
  useEffect(() => {
    const fetchData = async () => {
      const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/jobs`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setJobOpenings(response.data);
    };
    fetchData();
  }, []);

  const handleApply = async (jobId) => {
    try {
      setShowPopup(true);
      setPopupState("loading");
      const response = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/apply/job/${jobId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setPopupState("success");
      setTimeout(() => {
        setShowPopup(false);
      }, 2000);
    } catch (error) {
      console.error("Error applying for job:", error);

      if (error.response) {
        const { status, data } = error.response;
        if (status === 400 && data.message === "already applied") {
          setPopupState("alreadyApplied");
        } else if (status === 400 && data.message === "resumeNotFound") {
          setPopupState("resumeNotFound");
        } else {
          setPopupState("error");
        }
      }

      setTimeout(() => {
        setShowPopup(false);
      }, 2000);
    }
  };

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white px-6 pb-6 pt-20">
        {showPopup && (
          <div className="fixed inset-0 flex items-center justify-center bg-black/60 backdrop-blur-xs  z-50 transition-all">
            <div className="bg-white text-gray-900 px-8 py-10 rounded-2xl shadow-2xl text-center animate-fadeIn w-80">
              {popupState === "loading" && (
                <>
                  <div className="flex justify-center mb-4">
                    <div className="w-12 h-12 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin"></div>
                  </div>
                  <p className="text-lg font-semibold text-emerald-700">
                    Please wait...
                  </p>
                  <p className="text-sm text-gray-500 mt-1">Applying for job</p>
                </>
              )}

              {popupState === "success" && (
                <>
                  <div className="flex justify-center mb-3">
                    <div className="w-14 h-14 bg-emerald-600 rounded-full flex items-center justify-center animate-scaleUp">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="w-8 h-8 text-white"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    </div>
                  </div>
                  <p className="text-lg font-semibold text-emerald-700">
                    Applied Successfully!
                  </p>
                </>
              )}
              {popupState === "alreadyApplied" && (
                <>
                  <div className="flex justify-center mb-3">
                    <div className="w-14 h-14 bg-red-500 rounded-full flex items-center justify-center animate-scaleUp">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="w-8 h-8 text-white"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </div>
                  </div>
                  <p className="text-lg font-semibold text-red-600">
                    You have already applied for this job!
                  </p>
                </>
              )}
              {popupState === "resumeNotFound" && (
                <>
                  <div className="flex justify-center mb-3">
                    <div className="w-14 h-14 bg-red-500 rounded-full flex items-center justify-center animate-scaleUp">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="w-8 h-8 text-white"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </div>
                  </div>
                  <p className="text-lg font-semibold text-red-600">
                    Please upload your resume to apply for this job!
                  </p>
                </>
              )}

              {popupState === "error" && (
                <>
                  <div className="flex justify-center mb-3">
                    <div className="w-14 h-14 bg-red-500 rounded-full flex items-center justify-center animate-scaleUp">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="w-8 h-8 text-white"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </div>
                  </div>
                  <p className="text-lg font-semibold text-red-600">
                    Something went wrong!
                  </p>
                </>
              )}
            </div>
          </div>
        )}

        <Navbar className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900" />
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-extrabold text-emerald-600">
            Current Job Openings
          </h1>
          <p className="text-gray-400 mt-3 text-lg">
            Explore exciting opportunities with top tech companies
          </p>
        </div>

        <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 max-w-6xl mx-auto text-center">
          {jobOpenings?.length ? (
            jobOpenings.map((job, index) => (
              <div
                key={index}
                className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition duration-300 transform hover:-translate-y-2"
              >
                {job?.isPremium && (
                  <div className="absolute top-3 right-3 bg-gradient-to-r from-yellow-400 to-amber-500 text-white text-xs font-semibold px-3 py-1 rounded-full shadow-md flex items-center gap-1">
                    <span>Premium</span>
                  </div>
                )}
                <div className="w-full h-44 bg-gray-800 flex items-center justify-center overflow-hidden">
                  {job?.imageUrl && (
                    <img
                      src={job?.imageUrl}
                      alt={job?.companyName}
                      className="max-w-[220px] max-h-[130px] p-4 pt-6 object-contain group-hover:scale-110 transition-transform duration-300"
                    />
                  )}
                </div>
                <div className="p-4 relative">
                  <div className="p-4">
                    <h2 className="text-2xl font-bold text-white mb-1">
                      {job?.companyName}
                    </h2>
                    {job?.salary && (
                      <p className="absolute top-3 right-3 bg-green-400 text-white rounded-full px-2 font-semibold mb-4">
                        ₹ {job?.salary}
                      </p>
                    )}
                    <h3 className="text-lg font-semibold text-[#994BD1] mb-1">
                      {job?.designation}
                    </h3>
                    <p className="text-gray-300 text-sm leading-relaxed mb-5">
                      {(() => {
                        const words = job?.description
                          ? job?.description.trim().split(" ")
                          : [];
                        return words.length > 35
                          ? words.slice(0, 35).join(" ") + " ...more"
                          : job?.description;
                      })()}
                    </p>

                    <div className="text-right ">
                      {!job?.isPremium || (job?.isPremium && isPremium) ? (
                        job?.isPremium && true ? (
                          <button
                            onClick={() => handleApply(job?._id)}
                            className="px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg font-medium hover:cursor-pointer text-white  transition hover:scale-105"
                          >
                            Apply Now →
                          </button>
                        ) : (
                          <a
                            key={index}
                            href={job?.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="group"
                          >
                            <button className="px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg font-medium hover:cursor-pointer text-white  transition hover:scale-105">
                              Apply Now →
                            </button>
                          </a>
                        )
                      ) : (
                        <Link to="/buy-premium">
                          <button className="px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg font-medium hover:cursor-pointer text-white  transition hover:scale-105">
                            Apply Now →
                          </button>
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center text-gray-400 col-span-3">
              No job openings available at the moment.
            </p>
          )}
        </div>
      </div>
      <Footer className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900" />
    </>
  );
}

export default JobPortal;
