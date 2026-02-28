import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  token: localStorage.getItem("token") || null,
  email: null,
  id: null,
  role: null,
  isAuthenticated: false,
  isPremium: false,
  loading: true,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    saveData: (state, action) => {
      const { token, email, id, isPremium, role } = action.payload;
      state.token = token;
      state.email = email;
      state.id = id;
      state.isPremium = isPremium;
      state.role = role;
      state.isAuthenticated = true;
      localStorage.setItem("token", token);
      state.loading = false;
    },
    logout: (state) => {
      state.token = null;
      state.email = null;
      state.id = null;
      state.role = null;
      state.isPremium = false;
      state.isAuthenticated = false;
      localStorage.removeItem("token");
      state.loading = false;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
  },
});

export const { saveData, logout, setLoading } = authSlice.actions;
export default authSlice.reducer;
