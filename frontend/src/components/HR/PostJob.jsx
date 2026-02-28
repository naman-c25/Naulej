import React, { useState } from "react";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import Navbar from "../Navbar/Navbar";
import Footer from "../Footer/Footer";

const PostJob = () => {
  const [jobData, setJobData] = useState({
    companyName: "",
    designation: "",
    description: "",
    salary: "",
    imageUrl: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setJobData({ ...jobData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${import.meta.env.VITE_API_BASE_URL}/jobs`, jobData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      toast.success("Job Posted Successfully!");
      setJobData({
        companyName: "",
        designation: "",
        description: "",
        salary: "",
        imageUrl: "",
      });
    } catch (error) {
      console.error(error);
      toast.error("Failed to post job");
    }
  };

  return (
    <>
      <div>
        <Toaster />
      </div>

      <div className="min-h-screen bg-indigo-50 px-6 flex flex-col items-center">
        <Navbar user="hr" />

        <h1 className="text-3xl font-bold mb-8 pt-20 text-[#E35049]">
          Post a New Job
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full mb-6 max-w-6xl">
          <form
            onSubmit={handleSubmit}
            className="border border-gray-500 p-6 rounded-xl  space-y-2"
          >
            <div>
              <label className="block mb-1 font-medium text-emerald-600">
                Company Name
              </label>
              <input
                type="text"
                name="companyName"
                value={jobData?.companyName}
                onChange={handleChange}
                required
                placeholder="e.g. Google India"
                className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring focus:ring-gray-500"
              />
            </div>

            <div>
              <label className="block mb-1 font-medium text-emerald-600">
                Job Title
              </label>
              <input
                type="text"
                name="designation"
                value={jobData?.designation}
                onChange={handleChange}
                required
                placeholder="e.g. Frontend Developer"
                className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring focus:ring-gray-500"
              />
            </div>

            <div>
              <label className="block mb-1 font-medium text-emerald-600">
                Job Description
              </label>
              <textarea
                name="description"
                value={jobData?.description}
                onChange={handleChange}
                rows="4"
                required
                placeholder="Write the job role, requirements, and skills..."
                className="w-full border border-gray-300 resize-none rounded-md p-2 focus:outline-none focus:ring focus:ring-gray-500"
              />
            </div>

            <div>
              <label className="block mb-1 font-medium text-emerald-600">
                Salary
              </label>
              <input
                type="text"
                name="salary"
                value={jobData?.salary}
                onChange={handleChange}
                required
                placeholder="e.g. ₹8,00,000 per annum"
                className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring focus:ring-gray-500"
              />
            </div>

            <div>
              <label className="block mb-1 font-medium text-emerald-600">
                Image Url
              </label>
              <input
                type="text"
                name="imageUrl"
                value={jobData?.imageUrl}
                onChange={handleChange}
                required
                placeholder="e.g. https://example.com/image.jpg"
                className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring focus:ring-gray-500"
              />
            </div>
            <div className="pt-6">
               <button
              type="submit"
              className="w-full bg-emerald-600 text-white py-2 rounded-md hover:bg-emerald-700 hover:cursor-pointer transition"
            >
              Post Job
            </button>
            </div>

           
          </form>

          <div className="border border-gray-500 p-6 rounded-xl flex flex-col items-center text-center">
            <h2 className="text-xl font-bold mb-4 text-emerald-600">
              Job Preview
            </h2>
            <div className="relative w-full h-full bg-gray-700 backdrop-blur-lg border border-white/20 rounded-2xl shadow-lg overflow-hidden ">
              <div className="absolute top-3 right-3 bg-gradient-to-r from-yellow-400 to-amber-500 text-white text-xs font-semibold px-3 py-1 rounded-full shadow-md flex items-center gap-1">
                <span>Preview</span>
              </div>

              <div className="w-full h-44 bg-gray-800 flex items-center justify-center overflow-hidden">
                {jobData?.imageUrl ? (
                  <img
                    src={jobData?.imageUrl}
                    alt="Company Logo"
                    className="max-w-[120px] max-h-[100px]"
                  />
                ) : (
                  <div className="text-gray-400 text-sm">No Image Uploaded</div>
                )}
              </div>

              <div className="p-4 relative">
                <h2 className="text-2xl font-bold mb-2 pt-2 text-white">
                  {jobData?.companyName || "Company Name"}
                </h2>

                <h3 className="text-lg font-bold text-[#ed9f4c] mb-3">
                  {jobData?.designation || "Job Title"}
                </h3>

                <p className="text-gray-300 text-sm leading-relaxed mb-5 px-8">
                  {jobData?.description
                    ? jobData?.description.length > 500
                      ? jobData?.description.slice(0, 500) + " more..."
                      : jobData?.description
                    : "Job Description will appear here..."}
                </p>

                {jobData?.salary && (
                  <p className="absolute top-3 right-3 bg-green-400 text-white rounded-full px-2 font-semibold mb-4">
                    ₹ {jobData?.salary}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
};

export default PostJob;
