import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import api from "../../config/URL";
import { toast } from "react-toastify";

function SuperAdminCenterView() {
  const { id } = useParams();
  const [data, setData] = useState([]);

  useEffect(() => {
    const getData = async () => {
      try {
        const response = await api.get(`/getAllCenterById/${id}`);
        setData(response.data);
      } catch (error) {
        toast.error("Error Fetching Data", error);
      }
    };
    getData();
  }, [id]);

  return (
    <div className="container-fluid ">
      <ol
        className="breadcrumb my-3 px-2"
        style={{ listStyle: "none", padding: 0, margin: 0 }}
      >
        <li>
          <Link to="/" className="custom-breadcrumb">
            Home
          </Link>
          <span className="breadcrumb-separator"> &gt; </span>
        </li>
        <li>
          &nbsp;Centre Management
          <span className="breadcrumb-separator"> &gt; </span>
        </li>
        <li>
          <Link to="/center" className="custom-breadcrumb">
            &nbsp;Centre Listing
          </Link>
          <span className="breadcrumb-separator"> &gt; </span>
        </li>
        <li className="breadcrumb-item active" aria-current="page">
          &nbsp;Centre Listing view
        </li>
      </ol>
      <div className="card">
        <div
          className="d-flex px-4 justify-content-between align-items-center p-1 mb-4"
          style={{ background: "#f5f7f9" }}
        >
          <div class="d-flex align-items-center">
            <div class="d-flex">
              <div class="dot active"></div>
            </div>
            <span class="me-2 text-muted">View Centre</span>
          </div>
          <div className="my-2 pe-3 d-flex align-items-center">
            <Link to="/companyregistration">
              <button type="button " className="btn btn-sm btn-border   ">
                Back
              </button>
            </Link>
          </div>
        </div>
        <div className="container-fluid px-4">
          <div className="row pb-3">
            <div className="col-md-6 col-12">
              <div className="row mt-3  mb-2">
                <div className="col-6 ">
                  <p className="">Name</p>
                </div>
                <div className="col-6">
                  <p className="text-muted text-sm">: {data.name || "--"}</p>
                </div>
              </div>
            </div>
            <div className="col-md-6 col-12">
              <div className="row mt-3  mb-2">
                <div className="col-6 ">
                  <p className="">Centre Name</p>
                </div>
                <div className="col-6">
                  <p className="text-muted text-sm">
                    : {data.centerName || "--"}
                  </p>
                </div>
              </div>
            </div>
            <div className="col-md-6 col-12">
              <div className="row  mb-2">
                <div className="col-6">
                  <p className="">Email</p>
                </div>
                <div className="col-6">
                  <div
                    className="text-muted text-sm"
                    style={{
                      whiteSpace: "nowrap",
                      textOverflow: "ellipsis",
                      overflow: "hidden",
                    }}
                  >
                    : {data.email || "--"}
                  </div>
                </div>
              </div>
            </div>
            <div className="col-md-6 col-12">
              <div className="row  mb-2">
                <div className="col-6">
                  <p className="">Sender Email</p>
                </div>
                <div className="col-6">
                  <div
                    className="text-muted text-sm"
                    style={{
                      whiteSpace: "nowrap",
                      textOverflow: "ellipsis",
                      overflow: "hidden",
                    }}
                  >
                    : {data.senderMail || "--"}
                  </div>
                </div>
              </div>
            </div>
            <div className="col-md-6 col-12">
              <div className="row  mb-2">
                <div className="col-6  ">
                  <p className="">Mobile</p>
                </div>
                <div className="col-6">
                  <p className="text-muted text-sm">: {data.mobile || "--"}</p>
                </div>
              </div>
            </div>
            <div className="col-md-6 col-12">
              <div className="row  mb-2">
                <div className="col-6  ">
                  <p className="">App Type</p>
                </div>
                <div className="col-6">
                  <p className="text-muted text-sm">: {data.appName || "--"}</p>
                </div>
              </div>
            </div>
            <div className="col-md-6 col-12">
              <div className="row mb-2">
                <div className="col-6">
                  <p>Facial Recognizer (Student)</p>
                </div>
                <div className="col-6">
                  <p className="text-muted text-sm">
                    :{" "}
                    {data.isFacialRegForStudent === true
                      ? "Yes"
                      : data.isFacialRegForStudent === false
                      ? "No"
                      : "--"}
                  </p>
                </div>
              </div>
            </div>

            <div className="col-md-6 col-12">
              <div className="row mb-2">
                <div className="col-6">
                  <p>Geofence (Student)</p>
                </div>
                <div className="col-6">
                  <p className="text-muted text-sm">
                    :{" "}
                    {data.isGeoFenceForStudent === true
                      ? "Yes"
                      : data.isGeoFenceForStudent === false
                      ? "No"
                      : "--"}
                  </p>
                </div>
              </div>
            </div>

            <div className="col-md-6 col-12">
              <div className="row mb-2">
                <div className="col-6">
                  <p>Facial Recognizer (User/Employees)</p>
                </div>
                <div className="col-6">
                  <p className="text-muted text-sm">
                    :{" "}
                    {data.isFacialRegForTeacher === true
                      ? "Yes"
                      : data.isFacialRegForTeacher === false
                      ? "No"
                      : "--"}
                  </p>
                </div>
              </div>
            </div>

            <div className="col-md-6 col-12">
              <div className="row mb-2">
                <div className="col-6">
                  <p>Geofence (User/Employees)</p>
                </div>
                <div className="col-6">
                  <p className="text-muted text-sm">
                    :{" "}
                    {data.isGeoFenceForTeacher === true
                      ? "Yes"
                      : data.isGeoFenceForTeacher === false
                      ? "No"
                      : "--"}
                  </p>
                </div>
              </div>
            </div>

            <div className="col-md-6 col-12">
              <div className="row  mb-2">
                <div className="col-6  ">
                  <p className="">Status</p>
                </div>
                <div className="col-6">
                  <p className="text-muted text-sm">
                    : {data.centerStatus || "--"}
                  </p>
                </div>
              </div>
            </div>
            {data.centerStatus === "Trial" && (
              <div className="col-md-6 col-12">
                <div className="row  mb-2">
                  <div className="col-6  ">
                    <p className="">Trail Date</p>
                  </div>
                  <div className="col-6">
                    <p className="text-muted text-sm">
                      : {data.trialDate || "--"}
                    </p>
                  </div>
                </div>
              </div>
            )}
            <div className="col-md-6 col-12">
              <div className="row  mb-2">
                <div className="col-6  ">
                  <p className="">Postal Code</p>
                </div>
                <div className="col-6">
                  <p className="text-muted text-sm">: {data.zipCode || "--"}</p>
                </div>
              </div>
            </div>
            <div className="col-md-6 col-12">
              <div className="row  mb-2">
                <div className="col-6  ">
                  <p className="">Address</p>
                </div>
                <div className="col-6">
                  <p className="text-muted text-sm">: {data.address || "--"}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SuperAdminCenterView;
