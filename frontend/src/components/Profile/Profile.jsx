import React, { useEffect, useState, useRef } from "react";
import { FaEdit } from "react-icons/fa";
import { FaCheckCircle } from "react-icons/fa";
import { FaUserEdit } from "react-icons/fa";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import Navbar from "../Navbar/Navbar.jsx";
import Footer from "../Footer/Footer.jsx";

const Profile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/profile`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        setUser(response.data);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchData();
  }, []);

  const handleSubmit = async () => {
    try {
      await axios.put(`${import.meta.env.VITE_API_BASE_URL}/profile`, user, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setIsEditing(false);
      toast.success("Profile updated successfully!");
    } catch (error) {
      console.error("Error updating user data:", error);
      toast.error("Failed to update profile.");
    }
  };

  const [user, setUser] = useState({
    basicDetails: {
      name: "",
      email: "",
      mobile: "",
      description: "",
    },
    academicDetails: {
      collegeName: "",
      course: "",
      year: "",
      cgpa: "",
      intermediateBoard: "",
      intermediatePercentage: "",
      highSchoolBoard: "",
      highSchoolPercentage: "",
    },
    socialLinks: {
      github: "",
      linkedin: "",
      portfolio: "",
    },
    signedProfileUrl: "",
  });

  const handleEditToggle = () => {
    if (isEditing) {
      handleSubmit();
    }
    setIsEditing(!isEditing);
  };
  const handleUpload = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (
      file.type !== "image/jpeg" &&
      file.type !== "image/png" &&
      file.type !== "image/jpg"
    ) {
      toast.error("Please select a valid image file.");
      return;
    }
    const formData = new FormData();
    formData.append("image", file);

    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/upload/image`, {
        method: "POST",
        body: formData,
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      const data = await response.json();
      if (response.ok) {
        setUser((prevData) => ({
          ...prevData,
          signedProfileUrl: data.signedProfileUrl,
        }));
        toast.success("Image uploaded successfully");
      } else {
        toast.error("Error uploading image");
      }
    } catch (error) {
      console.error("Error uploading profile image", error);
    } 
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    const keys = name.split(".");
    if (keys.length === 2) {
      setUser((prevData) => ({
        ...prevData,
        [keys[0]]: {
          ...prevData[keys[0]],
          [keys[1]]: value,
        },
      }));
    } else {
      setUser((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }
  };
  const labels = {
    collegeName: "College Name",
    course: "Course",
    year: "Year",
    cgpa: "CGPA",
    intermediateBoard: "Intermediate Board",
    intermediatePercentage: "Intermediate %",
    highSchoolBoard: "High School Board",
    highSchoolPercentage: "High School %",
  };

  return (
    <>
      <div>
        <Toaster />
      </div>
      <div className="min-h-screen bg-indigo-50 flex flex-col items-center pt-10 pb-10 px-4 space-y-8">
        <Navbar />
        <div className="w-full max-w-4xl pt-15 flex justify-end">
          <button
            onClick={handleEditToggle}
            className="flex items-center gap-2 bg-emerald-600  text-white px-2 py-2 rounded-md text-sm font-semibold hover:bg-emerald-700 hover:cursor-pointer transition"
          >
            {isEditing ? (
              <>
                save <FaCheckCircle className="text-lg" />
              </>
            ) : (
              <>
                Edit <FaUserEdit className="text-lg" />
              </>
            )}
          </button>
        </div>

        <div className="w-full max-w-4xl rounded-2xl border border-gray-500 p-8 relative">
          {isEditing ? (
            <div className="flex justify-center mb-6 ">
              <div className="relative">
                <img
                  src={
                    user?.signedProfileUrl ||
                    "https://www.w3schools.com/howto/img_avatar.png"
                  }
                  onClick={handleUpload}
                  alt="Avatar"
                  draggable="false"
                  className="w-28 h-28 rounded-full border-2 border-emerald-600 object-cover hover:cursor-pointer"
                />
                <div className="absolute top-0 right-0 border-white text-black">
                  <FaEdit />
                </div>
              </div>
            </div>
          ) : (
            <div className="flex justify-center mb-6">
              <img
                src={
                  user?.signedProfileUrl ||
                  "https://www.w3schools.com/howto/img_avatar.png"
                }
                alt="Avatar"
                draggable="false"
                className="w-28 h-28 rounded-full border-2 border-emerald-600 object-cover"
              />
            </div>
          )}
          <input
            type="file"
            ref={fileInputRef}
            accept="image/*"
            onChange={handleFileChange}
            style={{ display: "none" }}
          />

          <section>
            <h2 className="text-xl font-semibold text-emerald-700 mb-6">
              Basic Details
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-left">
              <div className="border border-gray-300 rounded-xl px-4 py-2  ">
                <label className="block text-sm font-semibold text-emerald-600 mb-1 ">
                  Name
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    name="basicDetails.name"
                    value={user?.basicDetails?.name}
                    onChange={handleChange}
                    className="w-full border border-gray-500 rounded-lg px-3 py-2 focus:ring-1 focus:ring-gray-500 outline-none"
                  />
                ) : (
                  <p className="text-gray-700 font-medium text-base break-words">
                    {user?.basicDetails?.name}
                  </p>
                )}
              </div>

              <div className="border border-gray-300 rounded-xl px-4 py-2 ">
                <label className="block text-sm font-semibold text-emerald-600 mb-1 ">
                  Email
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    value={user?.basicDetails?.email}
                    readOnly
                    className="w-full  border border-gray-500 rounded-lg px-3 py-2 text-gray-600 cursor-not-allowed"
                  />
                ) : (
                  <p className="text-gray-700 font-medium text-base break-words">
                    {user?.basicDetails?.email}
                  </p>
                )}
              </div>

              <div className=" border border-gray-300 rounded-xl px-4 py-2 ">
                <label className="block text-sm font-semibold text-emerald-600 mb-1 ">
                  Mobile No
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    name="basicDetails.mobile"
                    value={user?.basicDetails?.mobile}
                    onChange={handleChange}
                    className="w-full border border-gray-500 rounded-lg px-3 py-2 focus:ring-1 focus:ring-gray-500 outline-none"
                  />
                ) : (
                  <p className="text-gray-700 font-medium text-base break-words">
                    {user?.basicDetails?.mobile}
                  </p>
                )}
              </div>
            </div>
            <div className="border border-gray-300 rounded-xl mt-6 px-4 py-2 ">
              <label className="block text-sm font-semibold text-emerald-600 mb-1 ">
                Description
              </label>
              {isEditing ? (
                <input
                  type="text"
                  name="basicDetails.description"
                  value={user?.basicDetails?.description}
                  onChange={handleChange}
                  className="w-full border border-gray-500 rounded-lg px-3 py-2 focus:ring-1 focus:ring-gray-500 outline-none"
                />
              ) : (
                <p className="text-gray-700 font-medium text-base break-words">
                  {user?.basicDetails?.description}
                </p>
              )}
            </div>
          </section>
        </div>

        <div className="w-full max-w-4xl  rounded-2xl border border-gray-500 p-8">
          <h2 className="text-xl font-semibold text-emerald-700 mb-6">
            Academic Details
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            {[
              "collegeName",
              "course",
              "year",
              "cgpa",
              "intermediateBoard",
              "intermediatePercentage",
              "highSchoolBoard",
              "highSchoolPercentage",
            ].map((field, index) => (
              <div
                key={index}
                className="border border-gray-300 rounded-xl px-4 py-2"
              >
                <label className="block text-sm font-semibold text-emerald-600 mb-1 capitalize">
                  {labels[field]}
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    name={`academicDetails.${field}`}
                    value={user?.academicDetails?.[field] || ""}
                    onChange={handleChange}
                    className="w-full border border-gray-500 rounded-lg px-3 py-2 focus:ring-1 focus:ring-gray-500 outline-none"
                  />
                ) : (
                  <p className="text-gray-700 font-medium text-base break-words">
                    {user?.academicDetails?.[field] || " "}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="w-full max-w-4xl  rounded-2xl border border-gray-600 p-8">
          <h2 className="text-xl font-semibold text-emerald-700 mb-6">
            Social Links
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {["github", "linkedin", "portfolio"].map((field, index) => (
              <div
                key={index}
                className=" border border-gray-300 rounded-xl px-4 py-2"
              >
                <label className="block text-sm font-semibold text-emerald-600 mb-1 tracking-wide capitalize">
                  {field.charAt(0).toUpperCase() + field.slice(1)}
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    placeholder="https://naulej.com"
                    name={`socialLinks.${field}`}
                    value={user?.socialLinks?.[field] || ""}
                    onChange={handleChange}
                    className="w-full border border-gray-500 rounded-lg px-3 py-2 focus:ring-1 focus:ring-gray-500 outline-none"
                  />
                ) : (
                  <p className="text-gray-700 font-medium text-base break-words">
                    {user?.socialLinks?.[field] || " "}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
};

export default Profile;
