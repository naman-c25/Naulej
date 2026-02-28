import React from "react";
import { Link } from "react-router-dom";
import logo from "../../images/logo.png";
import Footer from "../Footer/Footer";
function PageNotFound() {
  return (
    <>
      <section className="fixed top-0 left-0 right-0 flex justify-between items-center border-b-1 border-emerald-700 bg-indigo-50 px-6 py-2 z-50">
        <div className="flex items-center space-x-2 ">
          <img src={logo} alt="Logo" className="w-25 h-10" />
        </div>

        <div className="flex space-x-6">
          <Link
            to="/login"
            className="bg-white  font-bold text-[#994BD1] px-4 py-1 rounded-xl border border-[#E35049] hover:bg- transition hover:scale-105 "
          >
            Login
          </Link>
          <Link
            to="/signup"
            className="bg-white font-bold text-[#994BD1] border border-[#E35049] px-4 py-1 rounded-xl   transition hover:scale-105"
          >
            Sign Up
          </Link>
        </div>
      </section>
      <div className="min-h-screen flex flex-col justify-center items-center bg-indigo-50 text-gray-800 px-4">
        <h1 className="text-6xl font-bold mb-4">404</h1>
        <p className="text-2xl mb-8">
          Oops! The page you're looking for doesn't exist.
        </p>
        <Link
          to="/"
          className="bg-[#994BD1] text-white px-6 py-3 rounded-lg  transition hover:scale-105"
        >
          Go Back Home
        </Link>
      </div>
      <Footer />
    </>
  );
}

export default PageNotFound;
