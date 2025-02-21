import { useFormik } from "formik";
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import * as Yup from "yup";
import api from "../../config/URL";
import { toast } from "react-toastify";
import { Modal } from "react-bootstrap";

const validationSchema = Yup.object().shape({
  name: Yup.string().required("*Name is required"),
  configId: Yup.string().required("*App Type is required"),
  centerName: Yup.string().required("*Centre Name is required"),
  address: Yup.string().required("*Address is required"),
  mobile: Yup.string()
    .matches(
      /^(?:\+?65)?\s?(?:\d{4}\s?\d{4}|\d{3}\s?\d{3}\s?\d{4})$/,
      "*Invalid Phone Number"
    )
    .required("*Mobile Number is required"),
  email: Yup.string()
    .matches(
      /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
      "*Enter a valid email address"
    )
    .required("*Email is required"),
  senderMail: Yup.string()
    .matches(
      /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
      "*Enter a valid email address"
    )
    .required("*Email is required"),
    trialDate: Yup.date().test(
      "is-required-if-trial",
      "Trial date is required",
      function (value) {
        const { centerStatus } = this.parent;
        if (centerStatus === "Trial") {
          if (!value) {
            return false;
          }
          if (new Date(value) < new Date()) {
            return this.createError({ message: "Date cannot be in the past" });
          }
        }
        return true;
      }
    ),
});

function SuperAdminCenterAdd({ handleCenterChanged }) {
  const navigate = useNavigate();
  const [appData, setAppData] = useState(null);
  const [loadIndicator, setLoadIndicator] = useState(false);
  const userName = localStorage.getItem("tmsuserName");
  const [showModal, setShowModal] = useState(false);
  const [status, setStatus] = useState("Pending");
  const handleClose = () => setShowModal(false);
  const handleShow = () => setShowModal(true);
  useEffect(() => {
    const today = new Date();
    today.setDate(today.getDate() + 30);
    const formattedDate = today.toISOString().split("T")[0];
    formik.setFieldValue("trialDate", formattedDate);
  }, []);

  const formik = useFormik({
    initialValues: {
      name: "",
      centerName: "",
      centerStatus: "Pending",
      trialDate: "",
      email: "",
      senderMail: "",
      mobile: "",
      address: "",
      leadManagement: false,
      staffManagement: false,
      documentManagement: false,
      referalManagement: false,
      assessmentManagement: false,
      reportManagement: false,
      messages: false,
      file: null,
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      setLoadIndicator(true);
      try {
        const response = await api.post("/tuitionRegister", values, {
          headers: {
            "Content-Type": "Application/json",
          },
        });
        if (response.status === 201) {
          await api.put(
            `/statusApproval/${response.data.id}?newStatus=${values.centerStatus}`
          );
          toast.success(response.data.message);
          handleCenterChanged();
          navigate("/companyregistration");
        } else {
          toast.error(response.data.message);
        }
      } catch (error) {
        toast.error(error);
      } finally {
        setLoadIndicator(false);
      }
    },
    validateOnChange: false, // Enable validation on change
    validateOnBlur: true, // Enable validation on blur
  });

  // Function to scroll to the first error field
  const scrollToError = (errors) => {
    const errorField = Object.keys(errors)[0]; // Get the first error field
    const errorElement = document.querySelector(`[name="${errorField}"]`); // Find the DOM element
    if (errorElement) {
      errorElement.scrollIntoView({ behavior: "smooth", block: "center" });
      errorElement.focus(); // Set focus to the error element
    }
  };

  // Watch for form submit and validation errors
  useEffect(() => {
    if (formik.submitCount > 0 && Object.keys(formik.errors).length > 0) {
      scrollToError(formik.errors);
    }
  }, [formik.submitCount, formik.errors]);

  const handleAllow = () => {
    setShowModal(false);
  };
  const fetchData = async () => {
    try {
      const response = await api.get(`/getAllConfiguration`);
      setAppData(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  const handleStatusChange = (e) => {
    const value = e.target.value;
    setStatus(value);
    formik.setFieldValue("centerStatus", value);
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="container-fluid">
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
          &nbsp;Centre Listing Add
        </li>
      </ol>
      <form onSubmit={formik.handleSubmit}>
        <div className="card">
          <div
            className="d-flex justify-content-between align-items-center p-1 mb-4 px-4"
            style={{ background: "#f5f7f9" }}
          >
            <div className="d-flex align-items-center">
              <div className="d-flex">
                <div className="dot active"></div>
              </div>
              <span className="me-2 text-muted">Add Centre</span>
            </div>
            <div className="my-2 pe-3 d-flex align-items-center">
              <Link to="/companyregistration">
                <button type="button " className="btn btn-sm btn-border">
                  Back
                </button>
              </Link>
              &nbsp;&nbsp;
              <button
                type="button"
                className="btn btn-warning btn-sm text-white"
                onClick={handleShow}
              >
                Allow Access
              </button>
              &nbsp;&nbsp;
              <button
                type="submit"
                className="btn btn-button btn-sm"
                disabled={loadIndicator}
              >
                {loadIndicator && (
                  <span
                    className="spinner-border spinner-border-sm me-2"
                    aria-hidden="true"
                  ></span>
                )}
                <span className="fw-medium">Save</span>
              </button>
            </div>
          </div>
          <div className="container-fluid px-4">
            <div className="row">
              <div className="col-md-6 col-12">
                <div className="mb-3">
                  <label for="exampleFormControlInput1" className="form-label">
                    Name<span className="text-danger">*</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    className={`form-control  ${
                      formik.touched.name && formik.errors.name
                        ? "is-invalid"
                        : ""
                    }`}
                    aria-label="Username"
                    aria-describedby="basic-addon1"
                    {...formik.getFieldProps("name")}
                  />
                  {formik.touched.name && formik.errors.name && (
                    <div className="invalid-feedback">{formik.errors.name}</div>
                  )}
                </div>
              </div>
              <div className="col-md-6 col-12">
                <div className="mb-3">
                  <label for="exampleFormControlInput1" className="form-label">
                    Centre Name<span className="text-danger">*</span>
                  </label>
                  <input
                    type="text"
                    name="centerName"
                    className={`form-control  ${
                      formik.touched.centerName && formik.errors.centerName
                        ? "is-invalid"
                        : ""
                    }`}
                    aria-label="Username"
                    aria-describedby="basic-addon1"
                    {...formik.getFieldProps("centerName")}
                  />
                  {formik.touched.centerName && formik.errors.centerName && (
                    <div className="invalid-feedback">
                      {formik.errors.centerName}
                    </div>
                  )}
                </div>
              </div>
              <div className="col-md-6 col-12">
                <div className="mb-3">
                  <label for="exampleFormControlInput1" className="form-label">
                    Email<span className="text-danger">*</span>
                  </label>
                  <input
                    {...formik.getFieldProps("email")}
                    type="text"
                    className={`form-control   ${
                      formik.touched.email && formik.errors.email
                        ? "is-invalid"
                        : ""
                    }`}
                    aria-label="Username"
                    aria-describedby="basic-addon1"
                  />
                  {formik.touched.email && formik.errors.email && (
                    <div className="invalid-feedback">
                      {formik.errors.email}
                    </div>
                  )}
                </div>
              </div>
              <div className="col-md-6 col-12">
                <div className="mb-3">
                  <label for="exampleFormControlInput1" className="form-label">
                    Sender Email<span className="text-danger">*</span>
                  </label>
                  <input
                    {...formik.getFieldProps("senderMail")}
                    type="text"
                    className={`form-control   ${
                      formik.touched.senderMail && formik.errors.senderMail
                        ? "is-invalid"
                        : ""
                    }`}
                    aria-label="Username"
                    aria-describedby="basic-addon1"
                  />
                  {formik.touched.senderMail && formik.errors.senderMail && (
                    <div className="invalid-feedback">
                      {formik.errors.senderMail}
                    </div>
                  )}
                </div>
              </div>

              <div className="col-md-6 col-12">
                <div className="mb-3">
                  <label for="exampleFormControlInput1" className="form-label">
                    Mobile<span className="text-danger">*</span>
                  </label>
                  <input
                    {...formik.getFieldProps("mobile")}
                    type="text"
                    className={`form-control   ${
                      formik.touched.mobile && formik.errors.mobile
                        ? "is-invalid"
                        : ""
                    }`}
                  />
                  {formik.touched.mobile && formik.errors.mobile && (
                    <div className="invalid-feedback">
                      {formik.errors.mobile}
                    </div>
                  )}
                </div>
              </div>
              <div className="col-md-6 col-12">
                <div className="mb-3">
                  <label className="form-label">
                    App Type<span class="text-danger">*</span>
                  </label>
                  <select
                    {...formik.getFieldProps("configId")}
                    className={`form-select ${
                      formik.touched.configId && formik.errors.configId
                        ? "is-invalid"
                        : ""
                    }`}
                  >
                    <option selected></option>
                    {appData &&
                      appData.map((configId) => (
                        <option key={configId.id} value={configId.id}>
                          {configId.appName}
                        </option>
                      ))}
                  </select>
                  {formik.touched.configId && formik.errors.configId && (
                    <div className="invalid-feedback">
                      {formik.errors.configId}
                    </div>
                  )}
                </div>
              </div>
              <div className="col-md-6 col-12">
                <div className="mb-3">
                  <label className="form-label">
                    Status<span className="text-danger">*</span>
                  </label>
                  <select
                    {...formik.getFieldProps("centerStatus")}
                    onChange={handleStatusChange}
                    className={`form-select ${
                      formik.touched.centerStatus && formik.errors.centerStatus
                        ? "is-invalid"
                        : ""
                    }`}
                  >
                    <option value="Pending">Pending</option>
                    <option value="Trial">Trial</option>
                    <option value="Approve">Approve</option>
                    <option value="Rejected">Reject</option>
                  </select>
                  {formik.touched.centerStatus &&
                    formik.errors.centerStatus && (
                      <div className="invalid-feedback">
                        {formik.errors.centerStatus}
                      </div>
                    )}
                </div>
              </div>

              {status === "Trial" && (
                <div className="col-md-6 col-12">
                  <div className="mb-3">
                    <label className="form-label">
                      Trial Date<span className="text-danger">*</span>
                    </label>
                    <input
                      type="date"
                      {...formik.getFieldProps("trialDate")}
                      className={`form-control ${
                        formik.touched.trialDate && formik.errors.trialDate
                          ? "is-invalid"
                          : ""
                      }`}
                      min={new Date().toISOString().split("T")[0]}
                    />
                    {formik.touched.trialDate && formik.errors.trialDate && (
                      <div className="invalid-feedback">
                        {formik.errors.trialDate}
                      </div>
                    )}
                  </div>
                </div>
              )}
              <div className="col-12">
                <div className="mb-3">
                  <label for="exampleFormControlInput1" className="form-label">
                    Address<span className="text-danger">*</span>
                  </label>
                  <textarea
                    className={`form-control  ${
                      formik.touched.address && formik.errors.address
                        ? "is-invalid"
                        : ""
                    }`}
                    {...formik.getFieldProps("address")}
                    id="exampleFormControlTextarea1"
                    rows="3"
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        // Allow the default behavior for Enter key
                        console.log(
                          "Enter key pressed: moving to the next line"
                        );
                      }
                    }}
                  ></textarea>
                  {formik.touched.address && formik.errors.address && (
                    <div className="invalid-feedback">
                      {formik.errors.address}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </form>

      {/* Modal for Access Modules */}
      <Modal show={showModal} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>Access Modules</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="table-responsive">
            <table className="table">
              <thead>
                <tr>
                  <th scope="col">Access Module</th>
                  <th scope="col">Enable</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { label: "Lead Management", key: "leadManagement" },
                  { label: "Staff Management", key: "staffManagement" },
                  { label: "Document Management", key: "documentManagement" },
                  {
                    label: "Assessment Management",
                    key: "assessmentManagement",
                  },
                  { label: "Referral Management", key: "referalManagement" },
                  { label: "Report Management", key: "reportManagement" },
                  { label: "Messages", key: "messages" },
                ].map(({ label, key }) => (
                  <tr key={key}>
                    <td>{label}</td>
                    <td className="text-center">
                      <div className="form-check form-switch">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          checked={formik.values[key]}
                          style={{ cursor: "pointer" }}
                          onChange={() =>
                            formik.setFieldValue(key, !formik.values[key])
                          }
                        />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <button
            type="button"
            className="btn btn-border btn-sm"
            onClick={handleClose}
          >
            Cancel
          </button>
          <button
            type="button"
            className="btn btn-button btn-sm"
            onClick={handleAllow}
          >
            Allow
          </button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default SuperAdminCenterAdd;
