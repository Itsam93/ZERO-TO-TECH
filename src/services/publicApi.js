import axios from "axios";

const PUBLIC_API = axios.create({
  baseURL: "http://localhost:5000/api",
});

export default PUBLIC_API;