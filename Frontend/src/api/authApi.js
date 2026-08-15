import api from "./url";

// Register
export const signupUser = async (userData) => {
  const response = await api.post("/auth/register", userData);
  return response.data;
};

// Login
export const loginUser = async (userData) => {
  const response = await api.post("/auth/login", userData);
  return response.data;
};

// Profile
export const getProfile = async () => {
  const response = await api.get("/auth/profile");
  return response.data;
};

// Logout
export const logoutUser = async () => {
  const response = await api.post("/auth/logout");
  return response.data;
};

// Forgot Password
export const forgotPassword = async (data) => {
  const response = await api.post("/auth/forgot-password", data);
  return response.data;
};

// Validate Reset Token
export const validateResetToken = async (token) => {
  const response = await api.get("/auth/validate-reset-token", { params: { token } });
  return response.data;
};

// Reset Password
export const resetPassword = async (data) => {
  const response = await api.post("/auth/reset-password", data);
  return response.data;
};