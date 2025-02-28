import React, { useEffect, useState } from "react";
import Admin from "./layouts/Admin";
import "./styles/custom.css";
import "./styles/sidebar.css";
import Auth from "./layouts/Auth";
import api from "./config/URL";
import { updateScreens } from "./config/ScreenFilter";
import { updateModules } from "./config/ModuleFilter";
import { toast } from "react-toastify";
import SuperAdmin from "./layouts/SuperAdmin";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const role = localStorage.getItem("tmsrole");
  // const role = "TUITION_SUPER_ADMIN";

  useEffect(() => {
    const isAdminFromStorage = localStorage.getItem("tmsisAuthenticated");
    const isAdminBoolean = isAdminFromStorage === "true";
    if (isAuthenticated !== isAdminBoolean) {
      setIsAuthenticated(isAdminBoolean);
    }

    const interceptor = api.interceptors.response.use(
      (response) => response,

      (error) => {
        console.log("Error is", error.response);
        if (error.response?.status === 401) {
          toast.warning(error.response.data.message);
          handleLogout();
        }
        return Promise.reject(error);
      }
    );

    return () => {
      api.interceptors.response.eject(interceptor);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleLogin = async (id) => {
    setIsLoading(true);
    try {
      if (id) {
        if (id === 1) {
          setIsAuthenticated(true);
          localStorage.setItem("tmsisAuthenticated", true);
        } else {
          const response = await api.get(`/getAllRoleInfoById/${id}`);
          const rolePermissions = response.data;
          updateScreens(rolePermissions);
          setIsAuthenticated(true);
          localStorage.setItem("tmsisAuthenticated", true);
        }
      } else {
        setIsLoading(false);
        toast.error("Invalid email or password");
      }
    } catch (error) {
      console.error("Error during login:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.clear();
  };

  return (
    <div>
      {isLoading ? (
        <div className="loader-container">
          <div class="loading">
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
          </div>
        </div>
      ) : isAuthenticated ? (
        role === "TUITION_SUPER_ADMIN" ? (
          <SuperAdmin handleLogout={handleLogout} />
        ) : role !== "TUITION_SUPER_ADMIN" ? (
          <Admin handleLogout={handleLogout} />
        ) : (
          <Auth handleLogin={handleLogin} />
        )
      ) : (
        <Auth handleLogin={handleLogin} />
      )}
    </div>
  );
}

export default App;
