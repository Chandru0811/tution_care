import React, { useEffect, useState } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import "../styles/sidebar.css";
import "boxicons/css/boxicons.min.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import Footer from "../components/common/Footer";
import ScrollToTop from "../pages/ScrollToTop";
import NewDashboard from "../pages/NewDashboard";
import SuperAdminSidebar from "../components/common/SuperAdminSidebar";
import SuperAdminCenter from "../pages/SuperAdminCenter/SuperAdminCenter";
import SuperAdminCenterAdd from "../pages/SuperAdminCenter/SuperAdminCenterAdd";
import SuperAdminCenterEdit from "../pages/SuperAdminCenter/SuperAdminCenterEdit";
import SuperAdminCenterView from "../pages/SuperAdminCenter/SuperAdminCenterView";
import ModuleAccess from "../pages/ModuleAccess/ModuleAccess";
import SuperAdminHeader from "../components/common/SuperAdminHeader";
import { toast, ToastContainer } from "react-toastify";
import Configuration from "../pages/Configuration/Configuration";
import ConfigurationAdd from "../pages/Configuration/ConfigurationAdd";
import ConfigurationEdit from "../pages/Configuration/ConfigurationEdit";
import ConfigurationView from "../pages/Configuration/ConfigurationView";
import fetchAllCentersWithIds from "../pages/List/CenterList";

function SuperAdmin({ handleLogout }) {
  const [centerChange, setCenterChange] = useState(0);
  const selectedCenterId = localStorage.getItem("tmsselectedCenterId");
  const [centerData, setCenterData] = useState(null);
  const [selectedCenter, setSelectedCenter] = useState("");
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

  const handleCenterChanged = () => {
    setCenterChange((prevCount) => prevCount + 1);
    console.log("centerChange", centerChange);
  };

  const handleCenterChange = (e) => {
    const centerId = e.target.value;
    setSelectedCenter(centerId);
    localStorage.setItem("tmsselectedCenterId", centerId);
    console.log("Selected Center:", centerId);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const centerData = await fetchAllCentersWithIds();
        setCenterData(centerData);
        if (selectedCenterId !== null && selectedCenterId !== "undefined") {
          setSelectedCenter(selectedCenterId);
          localStorage.setItem("tmsselectedCenterId", selectedCenterId);
        } else if (centerData && centerData.length > 0) {
          setSelectedCenter(centerData[0].id);
          localStorage.setItem("tmsselectedCenterId", centerData[0].id); // Set in localStorage
        }
      } catch (error) {
        toast.error(error.message);
      }
    };

    fetchData();
  }, []);

  return (
    <div>
      <BrowserRouter basename="/tuitions">
        <ToastContainer position="top-center" />
        <SuperAdminSidebar />
        <section className="home-section">
          <SuperAdminHeader
            onLogout={handleLogout}
            handleCenterChange={handleCenterChange}
            centerData={centerData}
            selectedCenter={selectedCenter}
          />
          <ScrollToTop />
          <div className="home-content" style={{ minHeight: "95vh" }}>
            <Routes>
              {/* <Route path="/" element={<Dashboard />} /> */}
              <Route path="*" element={<NewDashboard />} />
              <Route path="/" element={<NewDashboard />} />

              {/* SuperAdminCenter */}
              <Route
                path="/companyregistration"
                element={<SuperAdminCenter />}
              />
              <Route
                path="/companyregistration/add"
                element={<SuperAdminCenterAdd />}
              />
              <Route
                path="/companyregistration/edit/:id"
                element={<SuperAdminCenterEdit />}
              />
              <Route
                path="/companyregistration/view/:id"
                element={<SuperAdminCenterView />}
              />

              {/* Configuration */}
              <Route path="/configuration" element={<Configuration />} />
              <Route path="/configuration/add" element={<ConfigurationAdd />} />
              <Route
                path="/configuration/edit/:id"
                element={<ConfigurationEdit />}
              />
              <Route
                path="/configuration/view/:id"
                element={<ConfigurationView />}
              />

              {/* Setting */}
              <Route path="/moduleaccess" element={<ModuleAccess />} />
            </Routes>
          </div>
          <Footer />
        </section>
      </BrowserRouter>
    </div>
  );
}

export default SuperAdmin;
