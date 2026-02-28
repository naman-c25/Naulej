import React, { useState, useEffect, use } from "react";
import axios from "axios";
import Navbar from "../Navbar/Navbar.jsx";
import Footer from "../Footer/Footer.jsx";
import toast, { Toaster } from "react-hot-toast";


const HrDashboard = () => {
  const [jobsPost, setJobsPost] = useState([]);
  const [applications, setApplications] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const [jobsRes, applicationRes] = await Promise.all([
        axios.get(`${import.meta.env.VITE_API_BASE_URL}/hr/job-posted`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }),
        axios.get(`${import.meta.env.VITE_API_BASE_URL}/hr/applications`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }),
      ]);
      setJobsPost(jobsRes.data);
      setApplications(applicationRes.data);
    };
    fetchData();
  }, []);

  const handleDeleteJob = async (jobId) => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/hr/delete-job`,
        {
          params: { jobId: jobId },
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      if (response.status === 200) {
        setJobsPost((prevJobs) =>
          prevJobs.map((job) =>
            job.id === jobId ? { ...job, deleteStatus: true } : job
          )
        );
        toast.success(response.data.message);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error("Error deleting job");
      console.error("Error deleting job:", error);
    }
  };

  const handleResumeView = async (key) => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/hr/checkresume`,
        {
          params: { key: key },
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      window.open(res.data.url, "_blank");
    } catch (error) {
      console.error("Error fetching resume URL:", error);
    }
  };

  return (
    <>
      <div>
        <Toaster />
      </div>
      <div className="min-h-screen bg-indigo-50 p-6">
        <Navbar user="hr" />
        <h1 className="text-3xl font-bold mb-6 pt-16 text-center text-[#E35049]">
          Dashboard
        </h1>

        <div className="border border-gray-500 max-w-5xl mx-auto  p-6 rounded-xl overflow-x-auto">
          <h2 className="text-xl font-semibold mb-4 text-gray-700">
            Job Posted
          </h2>

          <table className="min-w-full text-center text-gray-600 border border-gray-300">
            <thead className="bg-gray-100 border-b">
              <tr>
                <th className="py-1 px-4 border-r">Sr.</th>
                <th className="py-1 px-4 border-r">Job Title</th>
                <th className="py-1 px-4 border-r">Package (₹)</th>
                <th className="py-1 px-4 border-r">Total Applications</th>
                <th className="py-1 px-4 border-r">Approval Status</th>
                <th className="py-1 px-4 ">Action</th>
              </tr>
            </thead>
            <tbody>
              {jobsPost?.length > 0 ? (
                jobsPost.map((post, index) => (
                  <tr key={post.id} className="border-b hover:bg-gray-50">
                    <td className="py-1 px-1 border-r">{index + 1}</td>
                    <td className="py-1 px-1 border-r">{post?.designation}</td>
                    <td className="py-1 px-1 border-r">{post?.salary}</td>
                    <td className=" px-1 text-center border-r">
                      <button className="bg-green-600 text-white font-bold px-4  rounded-md">
                        {post.totalApplications}
                      </button>
                    </td>
                    <td className=" px-1 text-center border-r">
                      {post.approvalStatus ? (
                        <button className="bg-green-600 text-white font-bold px-2  rounded-md">
                          Approved
                        </button>
                      ) : (
                        <button className="bg-orange-400 text-white font-bold px-2  rounded-md">
                          Pending
                        </button>
                      )}
                    </td>
                    <td className=" px-1 text-center">
                      {post.deleteStatus ? (
                        <button
                          className="bg-red-300 text-white font-bold px-2  rounded-md"
                          disabled
                        >
                          Deleted
                        </button>
                      ) : (
                        <button
                          onClick={() => handleDeleteJob(post?.id)}
                          className="bg-red-500 text-white font-bold px-2  rounded-md hover:cursor-pointer hover:bg-red-600 transition"
                        >
                          Delete
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="6"
                    className="text-center py-6 text-gray-500 italic"
                  >
                    No job posted yet...
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="border border-gray-500 max-w-5xl mx-auto  p-6 mt-8 rounded-xl overflow-x-auto">
          <h2 className="text-xl font-semibold mb-4 text-gray-700">
            Received Applications
          </h2>

          <table className="min-w-full text-center text-gray-600 border border-gray-300">
            <thead className="bg-gray-100 border-b">
              <tr>
                <th className="py-1 px-4 border-r">Sr.</th>
                <th className="py-1 px-4 border-r">Candidate Name</th>
                <th className="py-1 px-4 border-r">Email</th>
                <th className="py-1 px-4 border-r">Job Title</th>
                <th className="py-1 px-4">Resume</th>
              </tr>
            </thead>
            <tbody>
              {applications?.length > 0 ? (
                applications.map((application, index) => (
                  <tr
                    key={application.id}
                    className="border-b hover:bg-gray-50"
                  >
                    <td className="py-1 px-4 border-r">{index + 1}</td>
                    <td className="py-1 px-4 border-r">{application?.name}</td>
                    <td className="py-1 px-4 border-r">{application?.email}</td>
                    <td className="py-1 px-4 border-r">
                      {application?.designation}
                    </td>
                    <td className="py-1 px-4 text-center">
                      <button
                        onClick={() => handleResumeView(application?.resumeUrl)}
                        className="bg-green-600 text-white px-4 py-1 rounded-md hover:bg-green-700 hover:cursor-pointer transition"
                      >
                        View Resume
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="5"
                    className="text-center py-6 text-gray-500 italic"
                  >
                    No applications received yet...
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default HrDashboard;
