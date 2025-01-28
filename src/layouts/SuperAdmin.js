import React, { useEffect, useState } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import "../styles/sidebar.css";
import "boxicons/css/boxicons.min.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import Sidebar from "../components/common/Sidebar";
import Header from "../components/common/Header";
import Footer from "../components/common/Footer";
import ScrollToTop from "../pages/ScrollToTop";
import NewDashboard from "../pages/NewDashboard";
import { ToastContainer } from "react-bootstrap";
import SuperAdminSidebar from "../components/common/SuperAdminSidebar";

function SuperAdmin({ handleLogout }) {
  useEffect(() => {
    let sidebar = document.querySelector(".sidebar");
    let sidebarBtn = document.querySelector(".sidebarBtn");
    sidebarBtn.onclick = function () {
      sidebar.classList.toggle("active");
      if (sidebar.classList.contains("active")) {
        sidebarBtn.classList.replace("bx-menu", "bx-menu-alt-right");
      } else sidebarBtn.classList.replace("bx-menu-alt-right", "bx-menu");
    };
  }, []);

  return (
    <div>
      <BrowserRouter basename="/tms">
        <ToastContainer position="top-center" />
        <SuperAdminSidebar />
        <section className="home-section">
          <Header onLogout={handleLogout} />
          <ScrollToTop />
          <div className="home-content" style={{ minHeight: "95vh" }}>
            <Routes>
              {/* <Route path="/" element={<Dashboard />} /> */}
              <Route path="*" element={<NewDashboard />} />
              <Route path="/" element={<NewDashboard />} />
            </Routes>
          </div>
          <Footer />
        </section>
      </BrowserRouter>
    </div>
  );
}

export default SuperAdmin;
