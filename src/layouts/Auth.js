import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import "../styles/client.css";
import { ToastContainer } from "react-toastify";
import NewLogin from "../pages/auth/NewLogin.js";
import CompanyRegister from "../pages/auth/CompanyRegister.js";
import NewLeadArrived from "../components/common/NewLeadArrived.js";

function Auth({ handleLogin }) {
  return (
    <BrowserRouter basename="/tuitions">
      <ToastContainer position="top-center" />
      {/* <TopBar /> */}
      {/* <Header /> */}
      <Routes>
        <Route path="/login" element={<NewLogin onLogin={handleLogin} />} />
        <Route path="/companyRegister" element={<CompanyRegister onLogin={handleLogin} />} />
        <Route path="/newLead/:token" element={<NewLeadArrived onLogin={handleLogin} />} />
        <Route path="*" element={<NewLogin onLogin={handleLogin} />} />
      </Routes>
      {/* <Footer /> */}
    </BrowserRouter>
  );
}

export default Auth;
