import axios from "axios";

const API = process.env.REACT_APP_BACKEND_URL;

const axiosInstance = axios.create({
  baseURL: API,
});

axiosInstance.interceptors.request.use((config) => {
  const token = sessionStorage.getItem("token");
  if (token) {
    config.headers["client-token"] = token;
  }
  return config;
});

export default axiosInstance;
