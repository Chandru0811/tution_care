// api.js
import axios from "axios";

const api = axios.create({
  baseURL: "http://13.213.208.92:7080/ecstuitionsg/api/",
  // baseURL: "https://hrisasia.com/ecssms/api/",
  // baseURL: "http://hrisasia.com:7443/ecstuitionsg/api/",
});

// Add a request interceptor
api.interceptors.request.use(
  function (config) {
    const token = localStorage.getItem("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  function (error) {
    return Promise.reject(error);
  }
);

export default api;
