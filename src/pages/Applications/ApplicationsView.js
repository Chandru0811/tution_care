import React from "react";
import { Link } from "react-router-dom";
import { FaPlus } from "react-icons/fa6";
import SendEmail from "../Templates/SendEmail";
function ApplicationsView() {
  return (
    <div className="container-fluid minHeight">
      <div className="card shadow border-0 mb-2 top-header">
        <div className="container-fluid py-4">
          <div className="row align-items-center">
            <div className="row align-items-center">
              <div className="col">
                <div className="d-flex align-items-center gap-4">
                  <h1 className="h4 ls-tight headingColor">React Developer</h1>
                </div>
              </div>
              <div className="col-auto">
                <div className="hstack gap-2 justify-content-start">
                  <Link to="/applications">
                    <button type="submit" className="btn btn-sm btn-light">
                      <span>Back</span>
                    </button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="card shadow border-0 mb-2 minHeight">
        <div className="hstack gap-2 justify-content-end px-4 pt-4">
        {/* <button
            type="submit"
            className="btn btn-sm btn-button rounded-5 sendMail"
            style={{ padding: "0", width: "38px", height: "38px" }}
          >
            <span>
              <IoIosSend className="fs-4" />
            </span>
          </button> */}

          <SendEmail/>

          <div className="dropdown mx-2">
            <button
              className="btn btn-primary dropdown-toggle py-2"
              type="button"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              <FaPlus /> Interview
            </button>
            <ul className="dropdown-menu">
              <li>
                <Link className="dropdown-item" to="/interview/formal">
                  Formal Interview
                </Link>
              </li>
              <li>
                <Link className="dropdown-item" to="/interview/record">
                  Record Interview
                </Link>
              </li>
              <li>
                <Link className="dropdown-item" to="/interview/live">
                  Live Interview
                </Link>
              </li>
              <li>
                <Link className="dropdown-item" to="/interview/logan">
                  Log an Intervieww
                </Link>
              </li>
            </ul>
          </div>
         
          <button type="submit" className="btn btn-sm btn-button">
            <span>Submit To Hiring Manager</span>
          </button>
        </div>
        <div className="container-fluid fw-bold fs-5 my-2">
          Basic Information
        </div>
        <div className="container">
          <div className="row mt-2 p-3">
            <div className="col-md-6 col-12">
              <div className="row mb-3">
                <div className="col-6 d-flex justify-content-start align-items-center">
                  <p className="text-sm">
                    <b>Application ID</b>
                  </p>
                </div>
                <div className="col-6">
                  <p className="text text-sm">: ZR_3_APP </p>
                </div>
              </div>
            </div>
            <div className="col-md-6 col-12">
              <div className="row mb-3">
                <div className="col-6 d-flex justify-content-start align-items-center">
                  <p className="text-sm">
                    <b>Application Name</b>
                  </p>
                </div>
                <div className="col-6">
                  <p className="text-muted text-sm">: User01 </p>
                </div>
              </div>
            </div>
            <div className="col-md-6 col-12">
              <div className="row mb-3">
                <div className="col-6 d-flex justify-content-start align-items-center">
                  <p className="text-sm">
                    <b>Phone</b>
                  </p>
                </div>
                <div className="col-6">
                  <p className="text text-sm">: 901332312</p>
                </div>
              </div>
            </div>
            <div className="col-md-6 col-12">
              <div className="row mb-3">
                <div className="col-6 d-flex justify-content-start align-items-center">
                  <p className="text-sm">
                    <b>Email</b>
                  </p>
                </div>
                <div className="col-6">
                  <p className="text-muted text-sm">: User123@Gmail.Com </p>
                </div>
              </div>
            </div>
            <div className="col-md-6 col-12">
              <div className="row mb-3">
                <div className="col-6 d-flex justify-content-start align-items-center">
                  <p className="text-sm">
                    <b>Posting Title</b>
                  </p>
                </div>
                <div className="col-6">
                  <p className="text-muted text-sm">: -- </p>
                </div>
              </div>
            </div>
            <div className="col-md-6 col-12">
              <div className="row mb-3">
                <div className="col-6 d-flex justify-content-start align-items-center">
                  <p className="text-sm">
                    <b>Job Opening ID</b>
                  </p>
                </div>
                <div className="col-6">
                  <p className="text-muted text-sm">: ZR_3_APP </p>
                </div>
              </div>
            </div>
            <div className="col-md-6 col-12">
              <div className="row mb-3">
                <div className="col-6 d-flex justify-content-start align-items-center">
                  <p className="text-sm">
                    <b>Department Name</b>
                  </p>
                </div>
                <div className="col-6">
                  <p className="text-muted text-sm">: -- </p>
                </div>
              </div>
            </div>
            <div className="col-md-6 col-12">
              <div className="row mb-3">
                <div className="col-6 d-flex justify-content-start align-items-center">
                  <p className="text-sm">
                    <b>Assessment Recruiters</b>
                  </p>
                </div>
                <div className="col-6">
                  <p className="text-muted text-sm">: -- </p>
                </div>
              </div>
            </div>
            <div className="col-md-6 col-12">
              <div className="row mb-3">
                <div className="col-6 d-flex justify-content-start align-items-center">
                  <p className="text-sm">
                    <b>Account Manager</b>
                  </p>
                </div>
                <div className="col-6">
                  <p className="text-muted text-sm">: -- </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ApplicationsView;
