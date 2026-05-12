import axios from "axios";

const PUBLIC_API = axios.create({
  baseURL: "https://ict-backend-fxsg.onrender.com/api",
});

export default PUBLIC_API;