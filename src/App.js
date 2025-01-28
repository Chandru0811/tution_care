import React, { useEffect, useState } from "react";
import Admin from "./layouts/Admin";
import "./styles/custom.css";
import "./styles/sidebar.css";
import Auth from "./layouts/Auth";
import api from "./config/URL";
import { updateScreens } from "./config/ScreenFilter";
import { toast } from "react-toastify";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const isAdminFromStorage = localStorage.getItem("isAuthenticated");
    const isAdminBoolean = isAdminFromStorage === "true";
    if (isAuthenticated !== isAdminBoolean) {
      setIsAuthenticated(isAdminBoolean);
    }

    const interceptor = api.interceptors.response.use(
      (response) => response,

      (error) => {
        console.log("Error is", error.response);
        if (error.response?.status === 401) {
          toast.warning("Session Experied!! Please Login");
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
        // alert(id)
        const response = await api.get(`/getAllRoleInfoById/${id}`);
        const rolePermissions = response.data;
        updateScreens(rolePermissions);
        setIsAuthenticated(true);
        localStorage.setItem("isAuthenticated", true);
        // localStorage.setItem("userName", userName);
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
    localStorage.removeItem("isAuthenticated");
    localStorage.removeItem("screens");
    localStorage.removeItem("roleId");
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    localStorage.removeItem("userName");
    localStorage.removeItem("loginUserId");
    localStorage.removeItem("centerId");
    localStorage.removeItem("selectedCenterId");
    localStorage.removeItem("email");
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
        <Admin handleLogout={handleLogout} />
      ) : (
        <Auth handleLogin={handleLogin} />
      )}
    </div>
  );
}

export default App;
