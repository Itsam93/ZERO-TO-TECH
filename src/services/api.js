import axios from "axios";

const API = axios.create({
  baseURL: "https://ict-backend-fxsg.onrender.com/api",
  withCredentials: true,
});

/* ================= REQUEST INTERCEPTOR ================= */
API.interceptors.request.use(
  (req) => {
    const userToken = localStorage.getItem("userToken");
    const adminToken = localStorage.getItem("adminToken");

    const token = userToken || adminToken;

    if (token) {
      req.headers.Authorization = `Bearer ${token}`;
    }

    return req;
  },
  (error) => Promise.reject(error)
);

/* ================= RESPONSE INTERCEPTOR ================= */
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error?.response?.status === 401) {
      console.warn("Unauthorized request");
    }

    return Promise.reject(error);
  }
);

export default API;