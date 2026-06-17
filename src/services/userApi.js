import api from "./api";

export const registerUser = (data) => {
  return api.post("/users/register", data);
};

export const loginUser = (data) => {
  return api.post("/users/login", data);
};

export const verifyEmail = (token) => {
  return api.get(`/users/verify-email/${token}`);
};

export const resendVerificationEmail = (email) => {
  return api.post("/users/resend-verification", { email });
};



export const getUserProfile = () => {
  return api.get("/users/profile");
};

export const updateUserProfile = (data) => {
  return api.put("/users/profile", data);
};



export const changePassword = (data) => {
  return api.put("/users/change-password", data);
};



export const getMyCourses = () => {
  return api.get("/courses/my-courses");
};

export const getMyResources = () => {
  return api.get("/resources/my-resources");
};