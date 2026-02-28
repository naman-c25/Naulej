import logo from "../../images/logo.png";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../redux/authSlice.js";

function Navbar({ className = "bg-indigo-50", user = "student", show = true }) {
  const isPremium = useSelector((state) => state.auth.isPremium);
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const handleLogout = () => {
    dispatch(logout());
  };
  const handleButton = () => {
    if (location.pathname === "/hr/dashboard") {
      navigate("/hr/post-job");
    } else if (location.pathname === "/hr/post-job") {
      navigate("/hr/dashboard");
    }
  };

  return (
    <>
      <section
        className={`fixed top-0 left-0 right-0 flex justify-between items-center ${className} border-b-1 border-emerald-700  py-2 px-6 z-10`}
      >
        <div className="flex items-center space-x-2 ">
          <Link to="/">
            <img src={logo} alt="Logo" className="w-25 h-10" />
          </Link>
        </div>

        {show && (
          <div className="flex gap-3 ">
            {user === "student" ? (
              isPremium ? (
                <div className=" bg-gradient-to-r from-yellow-400 to-amber-500 mr-4 text-white text-xs font-semibold px-3 rounded-full shadow-md flex items-center gap-1">
                  <span>Premium</span>
                </div>
              ) : (
                <Link to="/buy-premium">
                  <button className="bg-emerald-700 text-white px-2 py-1 rounded-lg text-sm font-medium hover:bg-emerald-800 transition hover:cursor-pointer">
                    Premium
                  </button>
                </Link>
              )
            ) : (
              <button
                onClick={handleButton}
                className="bg-emerald-700 text-white px-2 py-1 rounded-lg text-sm font-medium hover:bg-emerald-800 transition hover:cursor-pointer"
              >
                {location.pathname === "/hr/dashboard"
                  ? "Post Job"
                  : "Dashboard"}
              </button>
            )}

            <button
              onClick={handleLogout}
              className="border border-emerald-700 text-emerald-700 px-2 py-1 rounded-lg text-sm font-medium hover:bg-emerald-700 hover:text-white transition hover:cursor-pointer"
            >
              Logout
            </button>
          </div>
        )}
      </section>
    </>
  );
}

export default Navbar;
