// api.js

import axios from "axios";

const api = axios.create({
  // baseURL: "http://13.213.208.92:7080/ecssms/api/",
  baseURL: "http://13.213.208.92:8083/ecstution/api/",
  // baseURL: "https://artylearning.com/artylearning/api/",
});

//   Add <i class="bx bx-plus"></i>a request interceptor
api.interceptors.request.use(
  function (config) {
    const token = sessionStorage.getItem("token");
    // const token =
    //   "eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJNYW5pa2FuZGFuIiwiaWF0IjoxNzE3NDgwNjY4LCJleHAiOjE3MjI2NjQ2Njh9.NoWhw0cyfqqmbg_P6fbSBWmgyojILyI7rAs_aN9jWFtVIe1YYKJxXSIF3KVDPl7xaCtcOUcYInXj4K6QpwKtag";
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
