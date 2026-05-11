import api from "./api";

/* ================= AUTH ================= */

/**
 * Register new user
 */
export const registerUser = (data) => {
  return api.post("/users/register", data);
};

/**
 * Login user
 */
export const loginUser = (data) => {
  return api.post("/users/login", data);
};

/**
 * Verify email token
 */
export const verifyEmail = (token) => {
  return api.get(`/users/verify-email/${token}`);
};

/**
 * Resend verification email
 */
export const resendVerificationEmail = (email) => {
  return api.post("/users/resend-verification", { email });
};

/* ================= USER PROFILE ================= */

/**
 * Get logged-in user profile
 * (token automatically injected via interceptor)
 */
export const getUserProfile = () => {
  return api.get("/users/profile");
};

/**
 * Update user profile (name, email, etc.)
 */
export const updateUserProfile = (data) => {
  return api.put("/users/profile", data);
};

/* ================= SECURITY ================= */

/**
 * Change user password
 */
export const changePassword = (data) => {
  return api.put("/users/change-password", data);
};

/* ================= USER COURSES ================= */

/**
 * Get courses enrolled by user
 */
export const getMyCourses = () => {
  return api.get("/courses/my-courses");
};

export const getMyResources = () => {
  return api.get("/resources/my-resources");
};