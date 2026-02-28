import axios from "axios";
import { saveData, logout, setLoading } from "./authSlice.js";

export const verifyToken = () => async (dispatch) => {
  dispatch(setLoading(true));
  const token = localStorage.getItem("token");

  if (!token) {
    dispatch(logout());
    return;
  }
  try {
    const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/authenticate`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (res.data.valid && res.data.email && res.data.id) {
      dispatch(
        saveData({
          token,
          email: res.data.email,
          id: res.data.id,
          isPremium: res.data.isPremium,
          role: res.data.role,
        })
      );
    } else {
      dispatch(logout());
      localStorage.clear();
    }
  } catch (error) {
    console.error("Invalid token:", error);
    dispatch(logout());
    localStorage.clear();
  } finally {
    dispatch(setLoading(false));
  }
};
