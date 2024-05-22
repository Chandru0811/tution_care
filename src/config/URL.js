// api.js

import axios from "axios";

const api = axios.create({
  // baseURL: "http://13.213.208.92:7080/ecssms/api/",
  baseURL: "https://hrisasia.com/ecssms/api/",
  // baseURL: "https://artylearning.com/artylearning/api/",
});

//   Add <i class="bx bx-plus"></i>a request interceptor
api.interceptors.request.use(
  function (config) {
    const token = sessionStorage.getItem("token");

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
