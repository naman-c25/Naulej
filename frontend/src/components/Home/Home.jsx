import React from "react";
import {Link} from 'react-router-dom'
import logo from '../../images/logo.png'
import Footer from "../Footer/Footer.jsx";

function Home() {
  return (
  <>
    <div className="min-h-screen bg-indigo-50 text-gray-800">
      
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
      <section className="flex flex-col items-center text-center pt-20  px-6 ">
        <h1 className="text-5xl font-extrabold mb-4 text-[#E35049]">
          Empower Your Career with{" "}
          <span className="font-serif bg-clip-text text-transparent bg-gradient-to-r from-[#994BD1] to-[#E35049]">NAULEJ</span>
        </h1>

        <p className="text-lg text-gray-600 max-w-2xl mb-8">
          Your one-stop student dashboard to manage profiles, upload resumes,
          analyze ATS scores, and apply for real job opportunities — all in one
          place.
        </p>

     
      </section>

      <section className="px-6 pt-6 text-center">
        <h2 className="text-3xl font-bold text-[#E35049] mb-4">
          What is Naulej?
        </h2>
        <p className="text-gray-600 max-w-3xl mx-auto">
          Naulej is an all-in-one student career management platform that helps
          you build professional profiles, track academics, upload and manage
          resumes, and improve your hiring chances using smart ATS score
          analysis. Explore job openings posted by HRs and apply directly — your
          complete career toolkit.
        </p>
      </section>

      <section className="py-16  px-6">
        <h2 className="text-3xl font-bold text-center text-[#E35049] mb-12">
          Key Features
        </h2>
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {[
            {
              title: "Student Profile",
              desc: "Update and manage your personal and academic details easily.",
              icon: "👤",
            },
            {
              title: "Resume Upload",
              desc: "Securely upload and access your resume anytime.",
              icon: "📄",
            },
            {
              title: "ATS Score Checker",
              desc: "Analyze your resume against job descriptions instantly.",
              icon: "🧠",
            },
            {
              title: "Job Openings",
              desc: "Explore latest HR job posts and apply directly.",
              icon: "💼",
            },
            {
              title: "Career Insights",
              desc: "Track your growth and improve your hiring potential.",
              icon: "📊",
            },
            {
              title: "Secure & Reliable",
              desc: "Your data is encrypted and safe with us.",
              icon: "🔒",
            },
          ].map((feature, index) => (
            <div
              key={index}
              className="bg-white shadow-md  p-6 rounded-2xl text-center  transition"
            >
              <div className="text-4xl mb-4">{feature.icon}</div>
              <h3 className="text-xl font-semibold text-[#994BD1] mb-2">
                {feature.title}
              </h3>
              <p className="text-gray-600">{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="pb-16 px-6 text-center ">
        <h2 className="text-3xl md:text-4xl font-bold text-[#E35049] mb-8">
          Designed for Students. Built for Opportunities.
        </h2>

        <div className="max-w-2xl mx-auto text-left">
          <ul className="list-disc marker:text-indigo-400  text-lg text-gray-700 space-y-3">
            <li>Easy-to-use and intuitive dashboard</li>
            <li>Secure storage for academic data and resumes</li>
            <li>Smart AI-driven ATS analysis</li>
            <li>Accessible anywhere, anytime</li>
          </ul>
        </div>
      </section>

      <section className=" text-gray-700 pb-16 text-center px-6">
        <h2 className="text-3xl text-[#E35049] font-bold mb-4">
          Ready to take your first step towards success?
        </h2>
        <p className="mb-8 text-lg">
          Create your free account today and start building your career with
          confidence.
        </p>
        <Link
          to="/signup"
          className="bg-white text-[#994BD1] px-6 py-3 rounded-xl font-semibold hover:border-2 hover:border-[#E35049]  hover:shadow-lg transition"
        >
          Sign Up Now
        </Link>
      </section>
    </div>
    <Footer />
    </>
  );
}

export default Home;
