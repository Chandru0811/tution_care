import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import ChangePassword from "./ChangePassword";
import { BiLogOut } from "react-icons/bi";
import { CiCalendarDate } from "react-icons/ci";
import { GrUserSettings } from "react-icons/gr";
import api from "../../config/URL";

function Header({ onLogout }) {
  const navigate = useNavigate();
  const userName = localStorage.getItem("tmsuserName");
  const centerId = localStorage.getItem("tmscenterId");
  const userEmail = localStorage.getItem("tmsemail");
  const role = localStorage.getItem("tmsrole")?.replace(/_/g, " ");
  const [data, setData] = useState([]);

  const handleLogOutClick = () => {
    document.body.classList.remove("offcanvas-backdrop", "modal-open");
    document.body.style.overflow = "auto";
    document.body.style.paddingRight = "0px";
    onLogout();
    navigate("/login");
  };

  const getData = async () => {
    try {
      const response = await api.get(`/getAllCenterById/${centerId}`);
      setData(response.data);
    } catch (error) {
      toast.error("Error Fetching Data");
    }
  };

  useEffect(() => {
    getData();
  }, []);

  return (
    <nav>
      <div className="d-flex align-items-center justify-content-between pt-2 pb-2 px-2">
        <div className="sidebar-button">
          <i className="bx bx-menu sidebarBtn"></i>
        </div>

        <div className="d-flex align-items-center justify-content-evenly">
          <Link to={"/calendar"}>
            <button className="btn" type="button">
              <CiCalendarDate
                style={{
                  color: "#287f71",
                  fontSize: "30px",
                  fontWeight: "bolder",
                }}
              />
            </button>
          </Link>
          <div className="position-relative me-3">
            <span className="badge bg-primary rounded-pill">
              {data.centerName || "ECS School"}
            </span>
            {/* <img
              src={data.logo}
              width={50} // Increased for better visibility
              height={50}
              className="img-fluid ms-2 rounded mt-2"
              alt="Center Logo"
            /> */}
          </div>
          <button
            className="btn border border-1 rounded-circle"
            type="button"
            data-bs-toggle="offcanvas"
            data-bs-target="#offcanvasRight"
            aria-controls="offcanvasRight"
          >
            <i className="fa fa-user" style={{ color: "#eb862a" }}></i>
          </button>
        </div>
      </div>

      <div
        className="offcanvas offcanvas-end"
        id="offcanvasRight"
        tabIndex="-1"
        aria-labelledby="offcanvasRightLabel"
      >
        <div className="offcanvas-header d-flex justify-content-end">
          <button
            type="button"
            className="btn-close"
            data-bs-dismiss="offcanvas"
            aria-label="Close"
          ></button>
        </div>
        <div className="offcanvas-body d-flex flex-column">
          <div className="flex-grow-1">
            <div className="text-center">
              <h3 className="cname_canvas" style={{ fontSize: "30px" }}>
                {data.centerName || "ECS School"}
              </h3>
            </div>
            <div className="text-center mt-3">
              <i
                className="fa-duotone fa-solid fa-user"
                style={{
                  color: "#e99e5e",
                  background: "#fce6cf",
                  borderRadius: "100%",
                  padding: "20px",
                  cursor: "pointer",
                  fontSize: "4rem",
                }}
              ></i>
            </div>

            <div className="list-group list-group-flush pt-4 text-center">
              <p>{userName?.replace(/_/g, " ")}</p>
              <p>{userEmail}</p>
              <p>{role}</p>
            </div>
            <div
              className="text-center cursor-pointer"
              data-bs-dismiss="offcanvas"
            >
              <Link
                to={`/companyRegister/edit/${centerId}`}
                style={{ textDecoration: "none", color: "inherit" }}
                onMouseEnter={(e) => (e.target.style.color = "rgb(233,158,94)")}
                onMouseLeave={(e) => (e.target.style.color = "inherit")}
              >
                <GrUserSettings className="mx-2" />
                <span>Edit Company</span>
              </Link>
            </div>
          </div>

          <div className="mt-auto gap-2">
            <div className="row">
              <div className="col-md-6 col-12">
                <button
                  className="btn btn-button mt-3 w-100"
                  onClick={handleLogOutClick}
                >
                  <BiLogOut /> Logout
                </button>
              </div>
              <div className="col-md-6 col-12" data-bs-dismiss="offcanvas">
                {/* <Link to="/changepassword" >
                  <button className="btn btn-danger mt-3 w-100"  data-bs-dismiss="offcanvas">
                    Change password
                  </button>
                </Link> */}
                <ChangePassword />
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Header;
