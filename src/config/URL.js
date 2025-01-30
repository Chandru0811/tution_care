// api.js
import axios from "axios";

const api = axios.create({
  baseURL: "http://13.213.208.92:7080/ecstuitionsg/api/",
  // baseURL: "https://hrisasia.com/ecstuitionsg/api/",
});

// Add a request interceptor
api.interceptors.request.use(
  function (config) {
    const token = localStorage.getItem("tmstoken");

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
