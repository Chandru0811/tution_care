import { useFormik } from "formik";
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import * as Yup from "yup";
import api from "../../config/URL";
import { toast } from "react-toastify";

const validationSchema = Yup.object().shape({
  appName: Yup.string().required("*App Name is required"),
  // appDescription: Yup.string().required("*App Description is required"),
  centreName: Yup.string().required("*Centre Name is required"),
  subject: Yup.string().required("*subject is required"),
  level: Yup.string().required("*Level is required"),
  course: Yup.string().required("*Course is required"),
  confClass: Yup.string().required("*Class is required"),
  lead: Yup.string().required("*Lead is required"),
  employee: Yup.string().required("Employee is required"),
  student: Yup.string().required("Student is required"),
  attendance: Yup.string().required("Attendance is required"),
  schedule: Yup.string().required("Schedule is required"),
  documentManagement: Yup.string().required("Document Management is required"),
  assignManagement: Yup.string().required("Assign Management is required"),
  invoice: Yup.string().required("Invoice is required"),
  referral: Yup.string().required("Referral is required"),
  report: Yup.string().required("Report is required"),
  settings: Yup.string().required("Settings is required"),
  message: Yup.string().required("Message is required"),
});

function ConfigurationAdd() {
  const navigate = useNavigate();
  const [loadIndicator, setLoadIndicator] = useState(false);
  const userName = localStorage.getItem("tmsuserName");

  const formik = useFormik({
    initialValues: {
      appName: "",
      appDescription: "",
      centreName: "Company",
      subject: "Subject",
      level: "Level",
      course: "Course",
      confClass: "Class",
      lead: "Lead",
      employee: "Employee",
      student: "Student",
      attendance: "Attendance",
      schedule: "Schedule",
      documentManagement: "Document Management",
      assignManagement: "AssignManagement",
      invoice: "Invoice",
      referral: "Rferal",
      report: "Report",
      settings: "Settings",
      message: "Message",
      isStudentInfo: true,
      isChildAbility: false,
      isParentInfo: false,
      isAddress: false,
      isAccountInfo: false,
      isMediaPosting: false,
      isStudentDetails: true,
      isParentsGuardian: false,
      isEmergencyContact: false,
      isCourseDetails: true,
      isTermsAndCondition: false,
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      console.log("values", values);
      setLoadIndicator(true);
      try {
        const response = await api.post("/createConfiguration", values, {
          headers: {
            "Content-Type": "Application/json",
          },
        });
        if (response.status === 201) {
          toast.success(response.data.message);
          navigate("/configuration");
        } else {
          toast.error(response.data.message);
        }
      } catch (error) {
        toast.error(error);
      } finally {
        setLoadIndicator(false);
      }
    },
    validateOnChange: false,
    validateOnBlur: true,
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
          &nbsp;Configuration Management
          <span className="breadcrumb-separator"> &gt; </span>
        </li>
        <li>
          <Link to="/configuration" className="custom-breadcrumb">
            &nbsp;Configuration
          </Link>
          <span className="breadcrumb-separator"> &gt; </span>
        </li>
        <li className="breadcrumb-item active" aria-current="page">
          &nbsp;Configuration Add
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
              <span className="me-2 text-muted">Add Configuration</span>
            </div>
            <div className="my-2 pe-3 d-flex align-items-center">
              <Link to="/configuration">
                <button type="button " className="btn btn-sm btn-border">
                  Back
                </button>
              </Link>
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
                    App Name<span className="text-danger">*</span>
                  </label>
                  <input
                    type="text"
                    name="appName"
                    className={`form-control  ${
                      formik.touched.appName && formik.errors.appName
                        ? "is-invalid"
                        : ""
                    }`}
                    aria-describedby="basic-addon1"
                    {...formik.getFieldProps("appName")}
                  />
                  {formik.touched.appName && formik.errors.appName && (
                    <div className="invalid-feedback">
                      {formik.errors.appName}
                    </div>
                  )}
                </div>
              </div>

              <div className="col-md-6 col-12">
                <div className="mb-5">
                  <label for="exampleFormControlInput1" className="form-label">
                    App Description
                  </label>
                  <textarea
                    className={`form-control  ${
                      formik.touched.appDescription &&
                      formik.errors.appDescription
                        ? "is-invalid"
                        : ""
                    }`}
                    {...formik.getFieldProps("appDescription")}
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
                  {formik.touched.appDescription &&
                    formik.errors.appDescription && (
                      <div className="invalid-feedback">
                        {formik.errors.appDescription}
                      </div>
                    )}
                </div>
              </div>
            </div>
            <div className="row">
              <h5>Lables</h5>
              <div className="col-md-3 col-12">
                <div className="mb-3">
                  <label for="exampleFormControlInput1" className="form-label">
                    Centre Name<span className="text-danger">*</span>
                  </label>
                  <input
                    type="text"
                    name="centreName"
                    className={`form-control  ${
                      formik.touched.centreName && formik.errors.centreName
                        ? "is-invalid"
                        : ""
                    }`}
                    aria-describedby="basic-addon1"
                    {...formik.getFieldProps("centreName")}
                  />
                  {formik.touched.centreName && formik.errors.centreName && (
                    <div className="invalid-feedback">
                      {formik.errors.centreName}
                    </div>
                  )}
                </div>
              </div>
              <div className="col-md-3 col-12">
                <div className="mb-3">
                  <label for="exampleFormControlInput1" className="form-label">
                    Subject<span className="text-danger">*</span>
                  </label>
                  <input
                    type="text"
                    name="subject"
                    className={`form-control  ${
                      formik.touched.subject && formik.errors.subject
                        ? "is-invalid"
                        : ""
                    }`}
                    aria-describedby="basic-addon1"
                    {...formik.getFieldProps("subject")}
                  />
                  {formik.touched.subject && formik.errors.subject && (
                    <div className="invalid-feedback">
                      {formik.errors.subject}
                    </div>
                  )}
                </div>
              </div>
              <div className="col-md-3 col-12">
                <div className="mb-3">
                  <label for="exampleFormControlInput1" className="form-label">
                    Level<span className="text-danger">*</span>
                  </label>
                  <input
                    type="text"
                    name="level"
                    className={`form-control  ${
                      formik.touched.level && formik.errors.level
                        ? "is-invalid"
                        : ""
                    }`}
                    aria-describedby="basic-addon1"
                    {...formik.getFieldProps("level")}
                  />
                  {formik.touched.level && formik.errors.level && (
                    <div className="invalid-feedback">
                      {formik.errors.level}
                    </div>
                  )}
                </div>
              </div>
              <div className="col-md-3 col-12">
                <div className="mb-3">
                  <label for="exampleFormControlInput1" className="form-label">
                    Course<span className="text-danger">*</span>
                  </label>
                  <input
                    type="text"
                    name="course"
                    className={`form-control  ${
                      formik.touched.course && formik.errors.course
                        ? "is-invalid"
                        : ""
                    }`}
                    aria-describedby="basic-addon1"
                    {...formik.getFieldProps("course")}
                  />
                  {formik.touched.course && formik.errors.course && (
                    <div className="invalid-feedback">
                      {formik.errors.course}
                    </div>
                  )}
                </div>
              </div>
              <div className="col-md-3 col-12">
                <div className="mb-3">
                  <label for="exampleFormControlInput1" className="form-label">
                    Class<span className="text-danger">*</span>
                  </label>
                  <input
                    type="text"
                    name="confClass"
                    className={`form-control  ${
                      formik.touched.confClass && formik.errors.confClass
                        ? "is-invalid"
                        : ""
                    }`}
                    aria-describedby="basic-addon1"
                    {...formik.getFieldProps("confClass")}
                  />
                  {formik.touched.confClass && formik.errors.confClass && (
                    <div className="invalid-feedback">
                      {formik.errors.confClass}
                    </div>
                  )}
                </div>
              </div>
              <div className="col-md-3 col-12">
                <div className="mb-3">
                  <label for="exampleFormControlInput1" className="form-label">
                    Lead<span className="text-danger">*</span>
                  </label>
                  <input
                    type="text"
                    name="lead"
                    className={`form-control  ${
                      formik.touched.lead && formik.errors.lead
                        ? "is-invalid"
                        : ""
                    }`}
                    aria-describedby="basic-addon1"
                    {...formik.getFieldProps("lead")}
                  />
                  {formik.touched.lead && formik.errors.lead && (
                    <div className="invalid-feedback">{formik.errors.lead}</div>
                  )}
                </div>
              </div>
              <div className="col-md-3 col-12">
                <div className="mb-3">
                  <label for="exampleFormControlInput1" className="form-label">
                    Employee<span className="text-danger">*</span>
                  </label>
                  <input
                    type="text"
                    name="employee"
                    className={`form-control  ${
                      formik.touched.employee && formik.errors.employee
                        ? "is-invalid"
                        : ""
                    }`}
                    aria-describedby="basic-addon1"
                    {...formik.getFieldProps("employee")}
                  />
                  {formik.touched.employee && formik.errors.employee && (
                    <div className="invalid-feedback">
                      {formik.errors.employee}
                    </div>
                  )}
                </div>
              </div>
              <div className="col-md-3 col-12">
                <div className="mb-3">
                  <label for="exampleFormControlInput1" className="form-label">
                    Student<span className="text-danger">*</span>
                  </label>
                  <input
                    type="text"
                    name="student"
                    className={`form-control  ${
                      formik.touched.student && formik.errors.student
                        ? "is-invalid"
                        : ""
                    }`}
                    aria-describedby="basic-addon1"
                    {...formik.getFieldProps("student")}
                  />
                  {formik.touched.student && formik.errors.student && (
                    <div className="invalid-feedback">
                      {formik.errors.student}
                    </div>
                  )}
                </div>
              </div>
              <div className="col-md-3 col-12">
                <div className="mb-3">
                  <label for="exampleFormControlInput1" className="form-label">
                    Attendance<span className="text-danger">*</span>
                  </label>
                  <input
                    type="text"
                    name="attendance"
                    className={`form-control  ${
                      formik.touched.attendance && formik.errors.attendance
                        ? "is-invalid"
                        : ""
                    }`}
                    aria-describedby="basic-addon1"
                    {...formik.getFieldProps("attendance")}
                  />
                  {formik.touched.attendance && formik.errors.attendance && (
                    <div className="invalid-feedback">
                      {formik.errors.attendance}
                    </div>
                  )}
                </div>
              </div>
              <div className="col-md-3 col-12">
                <div className="mb-3">
                  <label for="exampleFormControlInput1" className="form-label">
                    Schedule<span className="text-danger">*</span>
                  </label>
                  <input
                    type="text"
                    name="schedule"
                    className={`form-control  ${
                      formik.touched.schedule && formik.errors.schedule
                        ? "is-invalid"
                        : ""
                    }`}
                    aria-describedby="basic-addon1"
                    {...formik.getFieldProps("schedule")}
                  />
                  {formik.touched.schedule && formik.errors.schedule && (
                    <div className="invalid-feedback">
                      {formik.errors.schedule}
                    </div>
                  )}
                </div>
              </div>
              <div className="col-md-3 col-12">
                <div className="mb-3">
                  <label for="exampleFormControlInput1" className="form-label">
                    DocumentManagement<span className="text-danger">*</span>
                  </label>
                  <input
                    type="text"
                    name="documentManagement"
                    className={`form-control  ${
                      formik.touched.documentManagement &&
                      formik.errors.documentManagement
                        ? "is-invalid"
                        : ""
                    }`}
                    aria-describedby="basic-addon1"
                    {...formik.getFieldProps("documentManagement")}
                  />
                  {formik.touched.documentManagement &&
                    formik.errors.documentManagement && (
                      <div className="invalid-feedback">
                        {formik.errors.documentManagement}
                      </div>
                    )}
                </div>
              </div>
              <div className="col-md-3 col-12">
                <div className="mb-3">
                  <label for="exampleFormControlInput1" className="form-label">
                    AssignManagement<span className="text-danger">*</span>
                  </label>
                  <input
                    type="text"
                    name="assignManagement"
                    className={`form-control  ${
                      formik.touched.assignManagement &&
                      formik.errors.assignManagement
                        ? "is-invalid"
                        : ""
                    }`}
                    aria-describedby="basic-addon1"
                    {...formik.getFieldProps("assignManagement")}
                  />
                  {formik.touched.assignManagement &&
                    formik.errors.assignManagement && (
                      <div className="invalid-feedback">
                        {formik.errors.assignManagement}
                      </div>
                    )}
                </div>
              </div>
              <div className="col-md-3 col-12">
                <div className="mb-3">
                  <label for="exampleFormControlInput1" className="form-label">
                    Invoice<span className="text-danger">*</span>
                  </label>
                  <input
                    type="text"
                    name="invoice"
                    className={`form-control  ${
                      formik.touched.invoice && formik.errors.invoice
                        ? "is-invalid"
                        : ""
                    }`}
                    aria-describedby="basic-addon1"
                    {...formik.getFieldProps("invoice")}
                  />
                  {formik.touched.invoice && formik.errors.invoice && (
                    <div className="invalid-feedback">
                      {formik.errors.invoice}
                    </div>
                  )}
                </div>
              </div>
              <div className="col-md-3 col-12">
                <div className="mb-3">
                  <label for="exampleFormControlInput1" className="form-label">
                    Referral<span className="text-danger">*</span>
                  </label>
                  <input
                    type="text"
                    name="referral"
                    className={`form-control  ${
                      formik.touched.referral && formik.errors.referral
                        ? "is-invalid"
                        : ""
                    }`}
                    aria-describedby="basic-addon1"
                    {...formik.getFieldProps("referral")}
                  />
                  {formik.touched.referral && formik.errors.referral && (
                    <div className="invalid-feedback">
                      {formik.errors.referral}
                    </div>
                  )}
                </div>
              </div>
              <div className="col-md-3 col-12">
                <div className="mb-3">
                  <label for="exampleFormControlInput1" className="form-label">
                    Report<span className="text-danger">*</span>
                  </label>
                  <input
                    type="text"
                    name="report"
                    className={`form-control  ${
                      formik.touched.report && formik.errors.report
                        ? "is-invalid"
                        : ""
                    }`}
                    aria-describedby="basic-addon1"
                    {...formik.getFieldProps("report")}
                  />
                  {formik.touched.report && formik.errors.report && (
                    <div className="invalid-feedback">
                      {formik.errors.report}
                    </div>
                  )}
                </div>
              </div>
              <div className="col-md-3 col-12">
                <div className="mb-3">
                  <label for="exampleFormControlInput1" className="form-label">
                    Settings<span className="text-danger">*</span>
                  </label>
                  <input
                    type="text"
                    name="settings"
                    className={`form-control  ${
                      formik.touched.settings && formik.errors.settings
                        ? "is-invalid"
                        : ""
                    }`}
                    aria-describedby="basic-addon1"
                    {...formik.getFieldProps("settings")}
                  />
                  {formik.touched.settings && formik.errors.settings && (
                    <div className="invalid-feedback">
                      {formik.errors.settings}
                    </div>
                  )}
                </div>
              </div>
              <div className="col-md-3 col-12">
                <div className="mb-3">
                  <label for="exampleFormControlInput1" className="form-label">
                    Message<span className="text-danger">*</span>
                  </label>
                  <input
                    type="text"
                    name="message"
                    className={`form-control  ${
                      formik.touched.message && formik.errors.message
                        ? "is-invalid"
                        : ""
                    }`}
                    aria-describedby="basic-addon1"
                    {...formik.getFieldProps("message")}
                  />
                  {formik.touched.message && formik.errors.message && (
                    <div className="invalid-feedback">
                      {formik.errors.message}
                    </div>
                  )}
                </div>
              </div>
              <div className="row">
                <h5>Student Form</h5>
                <div className="col-md-4 col-12">
                  <div className="mb-3">
                    <input
                      className="form-check-input me-2"
                      type="checkbox"
                      checked={formik.values.isStudentDetails}
                      //   onChange={() =>
                      //     formik.setFieldValue(
                      //       "isStudentDetails",
                      //       !formik.values.isStudentDetails
                      //     )
                      //   }
                      disabled
                    />
                    <label className="form-check-label">Student Details</label>
                    {formik.touched.isStudentDetails &&
                      formik.errors.isStudentDetails && (
                        <div className="error text-danger">
                          <small>{formik.errorsvalues.isStudentDetails}</small>
                        </div>
                      )}
                  </div>
                </div>
                <div className="col-md-4 col-12">
                  <div className="mb-3">
                    <input
                      className="form-check-input me-2"
                      type="checkbox"
                      checked={formik.values.isParentsGuardian}
                      onChange={() =>
                        formik.setFieldValue(
                          "isParentsGuardian",
                          !formik.values.isParentsGuardian
                        )
                      }
                    />
                    <label className="form-check-label">
                      Parents / Guardian
                    </label>
                    {formik.touched.isParentsGuardian &&
                      formik.errors.isParentsGuardian && (
                        <div className="error text-danger">
                          <small>{formik.errorsvalues.isParentsGuardian}</small>
                        </div>
                      )}
                  </div>
                </div>
                <div className="col-md-4 col-12">
                  <div className="mb-3">
                    <input
                      className="form-check-input me-2"
                      type="checkbox"
                      checked={formik.values.isEmergencyContact}
                      onChange={() =>
                        formik.setFieldValue(
                          "isEmergencyContact",
                          !formik.values.isEmergencyContact
                        )
                      }
                    />
                    <label className="form-check-label">
                      Emergency Contact
                    </label>
                    {formik.touched.isEmergencyContact &&
                      formik.errors.isEmergencyContact && (
                        <div className="error text-danger">
                          <small>{formik.errorsvalues.isEmergencyContact}</small>
                        </div>
                      )}
                  </div>
                </div>
                <div className="col-md-4 col-12">
                  <div className="mb-3">
                    <input
                      className="form-check-input me-2"
                      type="checkbox"
                      checked={formik.values.isCourseDetails}
                      disabled
                    />
                    <label className="form-check-label">Course Details</label>
                    {formik.touched.isCourseDetails &&
                      formik.errors.isCourseDetails && (
                        <div className="error text-danger">
                          <small>{formik.errorsvalues.isCourseDetails}</small>
                        </div>
                      )}
                  </div>
                </div>
                <div className="col-md-4 col-12">
                  <div className="mb-3">
                    <input
                      className="form-check-input me-2"
                      type="checkbox"
                      checked={formik.values.isTermsAndCondition}
                      onChange={() =>
                        formik.setFieldValue(
                          "isTermsAndCondition",
                          !formik.values.isTermsAndCondition
                        )
                      }
                    />
                    <label className="form-check-label">
                      Terms and Conditions
                    </label>
                    {formik.touched.isTermsAndCondition &&
                      formik.errors.isTermsAndCondition && (
                        <div className="error text-danger">
                          <small>{formik.errorsvalues.isTermsAndCondition}</small>
                        </div>
                      )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}

export default ConfigurationAdd;
