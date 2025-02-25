import React, { useCallback, useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import api from "../../config/URL";

function NewLeadsView() {
  const { id } = useParams();
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(true);
  const storedConfigure = JSON.parse(
    localStorage.getItem("tmsappConfigInfo") || "{}"
  );

  const getData = useCallback(async () => {
    setLoading(true);
    try {
      const response = await api.get(`/getLeadDynamicFormById/${id}`);
      setData(response.data);
    } catch (error) {
      console.error("Error fetching data ", error);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    getData();
  }, [getData]);

  return (
    <div className="container-fluid ">
      <ol
        className="breadcrumb my-3"
        style={{ listStyle: "none", padding: 0, margin: 0 }}
      >
        <li>
          <Link to="/" className="custom-breadcrumb">
            Home
          </Link>
          <span className="breadcrumb-separator"> &gt; </span>
        </li>
        <li>
          {storedConfigure?.lead || "Lead Management"}
          <span className="breadcrumb-separator"> &gt; </span>
        </li>
        <li>
          <Link to="/assignment" className="custom-breadcrumb">
            {storedConfigure?.lead || "Lead"}
          </Link>
          <span className="breadcrumb-separator"> &gt; </span>
        </li>
        <li className="breadcrumb-item active" aria-current="page">
          {storedConfigure?.lead || "Lead"} View
        </li>
      </ol>
      <div>
        <div className="card">
          <div
            className="d-flex px-4 justify-content-between align-items-center p-1 mb-4"
            style={{ background: "#f5f7f9" }}
          >
            <div class="d-flex align-items-center">
              <div class="d-flex">
                <div class="dot active"></div>
              </div>
              <span class="me-2 text-muted">{storedConfigure?.lead || "Lead"} View</span>
            </div>
            <div className="my-2 pe-3 d-flex align-items-center">
              <Link to="/lead/lead">
                <button type="button " className="btn btn-sm btn-border   ">
                  Back
                </button>
              </Link>
              &nbsp;&nbsp;
            </div>
          </div>
          <div className="container-fluid">
            <div className="row mt-2 pb-3">
              <div className="col-md-6 col-12">
                <div className="row mb-2">
                  <div className="col-6">
                    <p className="fw-medium">Name</p>
                  </div>
                  <div className="col-6 text-start">
                    <p className="text-muted text-sm"> : {data.name || "--"}</p>
                  </div>
                </div>
              </div>
              <div className="col-md-6 col-12">
                <div className="row mb-2">
                  <div className="col-6">
                    <p className="fw-medium">Email</p>
                  </div>
                  <div className="col-6 text-start">
                    <p className="text-muted text-sm">
                      {" "}
                      : {data.email || "--"}
                    </p>
                  </div>
                </div>
              </div>
              <div className="col-md-6 col-12 mb-3">
                <div className="row">
                  <div className="col-6">
                    <p className="fw-medium">Mobile</p>
                  </div>
                  <div className="col-6 text-start">
                    <p className="text-muted">: {data.phone || "--"}</p>
                  </div>
                </div>
              </div>
              <div className="col-md-6 col-12 mb-3">
                <div className="row">
                  <div className="col-6">
                    <p className="fw-medium">Gender</p>
                  </div>
                  <div className="col-6 text-start">
                    <p className="text-muted">: {data.gender || "--"}</p>
                  </div>
                </div>
              </div>
              <div className="col-md-6 col-12">
                <div className="row mb-2">
                  <div className="col-6">
                    <p className="fw-medium">Subject</p>
                  </div>
                  <div className="col-6 text-start">
                    <p className="text-muted text-sm">
                      : {data.subjectName || "--"}
                    </p>
                  </div>
                </div>
              </div>
              <div className="col-md-6 col-12">
                <div className="row mb-2">
                  <div className="col-6">
                    <p className="fw-medium">Date of Birth</p>
                  </div>
                  <div className="col-6 text-start">
                    <p className="text-muted text-sm">: {data.dob || "--"}</p>
                  </div>
                </div>
              </div>
              <div className="col-md-6 col-12">
                <div className="row mb-2">
                  <div className="col-6">
                    <p className="fw-medium">Parent Name</p>
                  </div>
                  <div className="col-6 text-start">
                    <p className="text-muted text-sm">
                      : {data.parentName || "--"}
                    </p>
                  </div>
                </div>
              </div>
              <div className="col-md-6 col-12">
                <div className="row mb-2">
                  <div className="col-6">
                    <p className="fw-medium">Parent Email</p>
                  </div>
                  <div className="col-6 text-start">
                    <p className="text-muted text-sm">
                      : {data.parentEmail || "--"}
                    </p>
                  </div>
                </div>
              </div>
              <div className="col-md-6 col-12">
                <div className="row mb-2">
                  <div className="col-6">
                    <p className="fw-medium">Parent Mobile</p>
                  </div>
                  <div className="col-6 text-start">
                    <p className="text-muted text-sm">
                      : {data.parentMobile || "--"}
                    </p>
                  </div>
                </div>
              </div>
              <div className="col-md-6 col-12">
                <div className="row mb-2">
                  <div className="col-6">
                    <p className="fw-medium">Occupation</p>
                  </div>
                  <div className="col-6 text-start">
                    <p className="text-muted text-sm">
                      : {data.occupation || "--"}
                    </p>
                  </div>
                </div>
              </div>
              <div className="col-md-6 col-12">
                <div className="row mb-2">
                  <div className="col-6">
                    <p className="fw-medium">Preferred Day</p>
                  </div>
                  <div className="col-6 text-start">
                    <p className="text-muted text-sm">
                      : {data.preferredDay || "--"}
                    </p>
                  </div>
                </div>
              </div>
              <div className="col-md-6 col-12">
                <div className="row mb-2">
                  <div className="col-6">
                    <p className="fw-medium">Preferred Time Slot</p>
                  </div>
                  <div className="col-6 text-start">
                    <p className="text-muted text-sm">
                      : {data.preferredTimeSlot || "--"}
                    </p>
                  </div>
                </div>
              </div>
              <div className="col-md-6 col-12">
                <div className="row mb-2">
                  <div className="col-6">
                    <p className="fw-medium">Refer By Student</p>
                  </div>
                  <div className="col-6 text-start">
                    <p className="text-muted text-sm">
                      : {data.studentName || data.referredBy || "--"}
                    </p>
                  </div>
                </div>
              </div>
              <div className="col-md-6 col-12">
                <div className="row mb-2">
                  <div className="col-6">
                    <p className="fw-medium">Marketing Source</p>
                  </div>
                  <div className="col-6 text-start">
                    <p className="text-muted text-sm">
                      : {data.marketingSource || "--"}
                    </p>
                  </div>
                </div>
              </div>
              <div className="col-md-6 col-12">
                <div className="row mb-2">
                  <div className="col-6">
                    <p className="fw-medium">Postal Code</p>
                  </div>
                  <div className="col-6 text-start">
                    <p className="text-muted text-sm">
                      : {data.postalCode || "--"}
                    </p>
                  </div>
                </div>
              </div>
              <div className="col-md-6 col-12">
                <div className="row mb-2">
                  <div className="col-6">
                    <p className="fw-medium">Address</p>
                  </div>
                  <div className="col-6 text-start">
                    <p className="text-muted text-sm">
                      : {data.address || "--"}
                    </p>
                  </div>
                </div>
              </div>
              <div className="col-md-6 col-12">
                <div className="row mb-2">
                  <div className="col-6">
                    <p className="fw-medium">Remarks</p>
                  </div>
                  <div className="col-6 text-start">
                    <p className="text-muted text-sm">
                      : {data.remarks || "--"}
                    </p>
                  </div>
                </div>
              </div>
              <div className="col-md-6 col-12">
                <div className="row mb-2">
                  <div className="col-6">
                    <p className="fw-medium">Terms And Condition</p>
                  </div>
                  <div className="col-6 text-start">
                    <p className="text-muted text-sm">
                      : {data.termsAndCondition === true ? "Yes" : "No"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default NewLeadsView;
