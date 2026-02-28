import { useState, useEffect } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import icon from "../../images/googleIcon.png";
import { useDispatch } from "react-redux";
import { saveData } from "../../redux/authSlice.js";
import toast, { Toaster } from "react-hot-toast";
import Navbar from "../Navbar/Navbar";
import Footer from "../Footer/Footer";

const Register = () => {
  const [formData, setFormData] = useState({
    basicDetails: {
      name: "",
      email: "",
      password: "",
    },
  });
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [user, setUser] = useState("student");
  const [toggleUser, setToggleUser] = useState(false);
  useEffect(() => {
    setUser(toggleUser ? "hr" : "student");
  }, [toggleUser]);

  const [submit, setSubmit] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    const keys = name.split(".");
    if (keys.length === 2) {
      setFormData((prevData) => ({
        ...prevData,
        [keys[0]]: {
          ...prevData[keys[0]],
          [keys[1]]: value,
        },
      }));
    } else {
      setFormData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }
  };

  const validatePassword = (password) => {
    const minLength = 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumber = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    if(password.length <minLength){
      toast.error("Password must be at least 8 characters long");
      return false;
    }
    if(!hasUpperCase){
      toast.error("Password must contain at least one uppercase letter");
      return false;
    }
    if(!hasLowerCase){
      toast.error("Password must contain at least one lowercase letter");
      return false;
    }

    if(!hasNumber){
      toast.error("Password must contain at least one number");
      return false;
    }
    if(!hasSpecialChar){
      toast.error("Password must contain at least one special character");
      return false;
    }
    return true;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if(!validatePassword(formData.basicDetails.password)){
      return;
    }
    try {
      setSubmit(true);
      const res = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/students/register`,
        formData,
        { headers: { role: user } }
      );

      localStorage.setItem("token", res.data.jwToken);
      dispatch(
        saveData({
          token: res.data.jwToken,
          email: res.data.email,
          id: res.data.id,
          isPremium: res.data.isPremium,
          role: res.data.role,
        })
      );

      if (res.data.role === "student") {
        navigate("/dashboard");
      } else if (res.data.role === "hr") {
        navigate("/hr/dashboard");
      } else {
        navigate("/");
      }
    } catch (err) {
      setSubmit(false);
      toast.error(err.response?.data?.message || "Signup failed!");
    }
  };

  return (
    <>
      <div>
        <Toaster />
      </div>

      <div className="min-h-screen flex flex-col text-gray-800">
        <Navbar show={false} />

        <div className="flex flex-1 pt-12">
          <div className="hidden md:flex w-1/2 flex-col justify-center items-center bg-gradient-to-br from bg-[#994BD1] to-[#E35049]  text-white px-10 relative overflow-hidden">
            <div className="text-center z-10">
              <h1 className="text-5xl font-bold mb-4 drop-shadow-lg animate-fadeIn">
                Welcome to Naulej!
              </h1>
              <p className="text-lg text-gray-100 max-w-md mx-auto leading-relaxed">
                Empower your student journey. Manage academics, connect, and
                grow effortlessly.
              </p>
            </div>
          </div>

          <div className=" w-full md:w-1/2 flex flex-col justify-center items-center bg-indigo-50 px-8 md:px-12 lg:px-16 relative pt-10 pb-10">

           <h2 className="md:hidden text-3xl font-bold text-center text-[#E35049] mb-10">
                Welcome to Naulej!
              </h2>
          
            <div className="w-full max-w-md bg-white/80 border border-green-400  px-8 pb-8 pt-3 rounded-2xl">
              <div className="flex justify-end items-center mb-1 gap-1">
                <button
                  onClick={() => setToggleUser(!toggleUser)}
                  className={` w-10 h-5 flex items-center rounded-full p-1 transition-all duration-300 hover:cursor-pointer ${
                    toggleUser ? "bg-emerald-600" : "bg-gray-300"
                  }`}
                >
                  <div
                    className={`bg-white w-4 h-4 rounded-full transform transition-transform duration-300 ${
                      toggleUser ? "translate-x-4" : "translate-x-0"
                    }`}
                  />
                </button>
                <p
                  className={` ${
                    toggleUser ? "text-emerald-700" : "text-gray-500"
                  } text-xs font-bold`}
                >
                  HR
                </p>
              </div>

              <h2 className="text-3xl font-bold text-center text-emerald-700 mb-6">
                {toggleUser ? "HR Sign Up" : "Student Sign Up"}
              </h2>

              <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
                <input
                  type="text"
                  name="basicDetails.name"
                  placeholder="Full Name"
                  value={formData.basicDetails.name}
                  onChange={handleChange}
                  required
                  className="border border-gray-300 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-emerald-500 focus:outline-none transition"
                />

                <input
                  type="email"
                  name="basicDetails.email"
                  placeholder="Email Address"
                  value={formData.basicDetails.email}
                  onChange={handleChange}
                  required
                  className="border border-gray-300 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-emerald-500 focus:outline-none transition"
                />

                <input
                  type="password"
                  name="basicDetails.password"
                  placeholder="Password"
                  value={formData.basicDetails.password}
                  onChange={handleChange}
                  required
                  className="border border-gray-300 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-emerald-500 focus:outline-none transition"
                />

                <button
                  type="submit"
                  className="bg-emerald-600 text-white rounded-xl py-2.5 mt-2 font-semibold  transition hover:scale-[1.02] hover:cursor-pointer flex justify-center items-center"
                >
                  {submit ? (
                    <div className="w-8 h-8 border-4 border-white/40 border-t-white rounded-full animate-spin"></div>
                  ) : (
                    "SIGN UP"
                  )}
                </button>
              </form>

              <div className="flex items-center justify-center mt-6 mb-2">
                <div className="h-px w-1/4 bg-gray-300" />
                <span className="px-3 text-gray-500 text-sm">OR</span>
                <div className="h-px w-1/4 bg-gray-300" />
              </div>

              <button
                onClick={() =>
                  (window.location.href =
                    `${import.meta.env.VITE_API_BASE_URL}/auth/google?role=` + user)
                }
                className="w-full border border-gray-300 rounded-xl py-2.5 flex items-center justify-center gap-3 hover:bg-gray-200 transition font-medium text-gray-700 hover:cursor-pointer"
              >
                <img src={icon} alt="Google Logo" className="w-5 h-5 " />
                Sign up with Google
              </button>
              <div className="text-center mt-6">
                <Link
                  to="/login"
                  className="text-emerald-600 font-medium hover:text-emerald-700 transition"
                >
                  Already have an account? Login
                </Link>
              </div>
            </div>
      

          </div>
        </div>
      <Footer />
      </div>
    </>
  );
};

export default Register;
