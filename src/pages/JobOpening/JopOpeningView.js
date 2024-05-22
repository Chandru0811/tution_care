import React from "react";
import { Link } from "react-router-dom";

function JopOpeningView() {
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
                  <Link to="/jobOpening">
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
      <div className="card shadow border-0 mb-2">
        {/* Job Opening Information */}
        <div className="container-fluid fw-bold fs-5 my-2">
          Job Opening Information
        </div>
        <div className="container">
          <div className="row mt-2 p-3">
            <div className="col-md-6 col-12">
              <div className="row mb-3">
                <div className="col-6 d-flex justify-content-start align-items-center">
                  <p className="text-sm">
                    <b>Posting Title</b>
                  </p>
                </div>
                <div className="col-6">
                  <p className="text-muted text-sm">: React Developer </p>
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
                  <p className="text-muted text-sm">: React Js </p>
                </div>
              </div>
            </div>
            <div className="col-md-6 col-12">
              <div className="row mb-3">
                <div className="col-6 d-flex justify-content-start align-items-center">
                  <p className="text-sm">
                    <b>Number Positions</b>
                  </p>
                </div>
                <div className="col-6">
                  <p className="text-muted text-sm">: 20</p>
                </div>
              </div>
            </div>
            <div className="col-md-6 col-12">
              <div className="row mb-3">
                <div className="col-6 d-flex justify-content-start align-items-center">
                  <p className="text-sm">
                    <b>Job Type</b>
                  </p>
                </div>
                <div className="col-6">
                  <p className="text-muted text-sm">: Full Time</p>
                </div>
              </div>
            </div>
            <div className="col-md-6 col-12">
              <div className="row mb-3">
                <div className="col-6 d-flex justify-content-start align-items-center">
                  <p className="text-sm">
                    <b>Title</b>
                  </p>
                </div>
                <div className="col-6">
                  <p className="text-muted text-sm">: Developer </p>
                </div>
              </div>
            </div>
            <div className="col-md-6 col-12">
              <div className="row mb-3">
                <div className="col-6 d-flex justify-content-start align-items-center">
                  <p className="text-sm">
                    <b>Work Experience</b>
                  </p>
                </div>
                <div className="col-6">
                  <p className="text-muted text-sm">: 1-3 year</p>
                </div>
              </div>
            </div>
            <div className="col-md-6 col-12">
              <div className="row mb-3">
                <div className="col-6 d-flex justify-content-start align-items-center">
                  <p className="text-sm">
                    <b>Target Date</b>
                  </p>
                </div>
                <div className="col-6">
                  <p className="text-muted text-sm">: 01-01-2024</p>
                </div>
              </div>
            </div>
            <div className="col-md-6 col-12">
              <div className="row mb-3">
                <div className="col-6 d-flex justify-content-start align-items-center">
                  <p className="text-sm">
                    <b>Date Opend</b>
                  </p>
                </div>
                <div className="col-6">
                  <p className="text-muted text-sm">: 10-04-2024</p>
                </div>
              </div>
            </div>
            <div className="col-md-6 col-12">
              <div className="row mb-3">
                <div className="col-6 d-flex justify-content-start align-items-center">
                  <p className="text-sm">
                    <b>Assigned Recruiter</b>
                  </p>
                </div>
                <div className="col-6">
                  <p className="text-muted text-sm">: User01</p>
                </div>
              </div>
            </div>
            <div className="col-md-6 col-12">
              <div className="row mb-3">
                <div className="col-6 d-flex justify-content-start align-items-center">
                  <p className="text-sm">
                    <b>Salary</b>
                  </p>
                </div>
                <div className="col-6">
                  <p className="text-muted text-sm">: 20,000</p>
                </div>
              </div>
            </div>
            <div className="col-md-6 col-12">
              <div className="row mb-3">
                <div className="col-6 d-flex justify-content-start align-items-center">
                  <p className="text-sm">
                    <b>Job Opening Status </b>
                  </p>
                </div>
                <div className="col-6">
                  <p className="text-muted text-sm">: In-Progress</p>
                </div>
              </div>
            </div>
            <div className="col-md-6 col-12">
              <div className="row mb-3">
                <div className="col-6 d-flex justify-content-start align-items-center">
                  <p className="text-sm">
                    <b>Industry</b>
                  </p>
                </div>
                <div className="col-6">
                  <p className="text-muted text-sm">: Education</p>
                </div>
              </div>
            </div>
            <div className="col-md-16 col-12">
              <div className="row mb-3">
                <div className="col-3 d-flex justify-content-start align-items-center">
                  <p className="text-sm">
                    <b>Required Skills </b>
                  </p>
                </div>
                <div className="col-9">
                  <p className="text-muted text-sm">: Ajax , Node Js ,Java</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Address Information */}
        <div className="container-fluid fw-bold fs-5 my-2">
          Address Information
        </div>
        <div className="container">
          <div className="row mt-2 p-3">
            <div className="col-md-6 col-12">
              <div className="row mb-3">
                <div className="col-6 d-flex justify-content-start align-items-center">
                  <p className="text-sm">
                    <b>City</b>
                  </p>
                </div>
                <div className="col-6">
                  <p className="text-muted text-sm">: Thanjavur </p>
                </div>
              </div>
            </div>
            <div className="col-md-6 col-12">
              <div className="row mb-3">
                <div className="col-6 d-flex justify-content-start align-items-center">
                  <p className="text-sm">
                    <b>State/Province</b>
                  </p>
                </div>
                <div className="col-6">
                  <p className="text-muted text-sm">: TamilNadu</p>
                </div>
              </div>
            </div>
            <div className="col-md-6 col-12">
              <div className="row mb-3">
                <div className="col-6 d-flex justify-content-start align-items-center">
                  <p className="text-sm">
                    <b>Country</b>
                  </p>
                </div>
                <div className="col-6">
                  <p className="text-muted text-sm">: India</p>
                </div>
              </div>
            </div>
            <div className="col-md-6 col-12">
              <div className="row mb-3">
                <div className="col-6 d-flex justify-content-start align-items-center">
                  <p className="text-sm">
                    <b>Zip/Postal Code</b>
                  </p>
                </div>
                <div className="col-6">
                  <p className="text-muted text-sm">: 613001</p>
                </div>
              </div>
            </div>
            <div className="col-md-16 col-12">
              <div className="row mb-3">
                <div className="col-3 d-flex justify-content-start align-items-center">
                  <p className="text-sm">
                    <b>Description</b>
                  </p>
                </div>
                <div className="col-9">
                  <p className="text-muted text-sm">
                   : React, sometimes referred to as a frontend JavaScript
                    framework, is a JavaScript library created by Facebook.React
                    is a tool for building UI components.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default JopOpeningView;
