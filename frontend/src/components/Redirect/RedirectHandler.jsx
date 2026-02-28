import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../../images/logo.png";
import { useDispatch } from "react-redux";
import { saveData } from "../../redux/authSlice.js";
const RedirectHandler = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get("token");
    const email = urlParams.get("email");
    const id = urlParams.get("id");
    const role = urlParams.get("role");

    if (token && email && id) {
      localStorage.setItem("token", token);
      dispatch(
        saveData({
          token,
          email,
          id,
          role,
        })
      );

      if (role === "student") {
        window.history.replaceState({}, document.title, "/dashboard");
        navigate("/dashboard", { replace: true });
      } else if (role === "hr") {
        window.history.replaceState({}, document.title, "/hr/dashboard");
        navigate("/hr/dashboard", { replace: true });
      } else {
        localStorage.clear();
        navigate("/login", { replace: true });
      }
    } else {
      navigate("/login", { replace: true });
    }
  }, []);

  return (
    <>
      <header className="fixed top-0 left-0 right-0 flex justify-between items-center bg-indigo-50 shadow-md p-4 px-8 z-10">
        <div className="flex items-center space-x-2">
          <img src={logo} alt="Logo" className="h-10 w-auto" />
        </div>
      </header>
      <div className="min-h-screen flex flex-col justify-center items-center bg-white text-white">
        <div className="bg-gray-600 backdrop-blur-lg px-10 py-6 rounded-2xl shadow-lg">
          <h2 className="text-2xl font-semibold mb-2 text-center">
            Verifying your account...
          </h2>
          <p className="text-gray-100 text-center text-sm">
            Please wait while we log you in securely.
          </p>
          <div className="mt-4 flex justify-center">
            <div className="w-10 h-10 border-4 border-white/40 border-t-white rounded-full animate-spin"></div>
          </div>
        </div>
      </div>
    </>
  );
};

export default RedirectHandler;
