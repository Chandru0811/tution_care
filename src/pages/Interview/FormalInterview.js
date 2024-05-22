import React from "react";
import { Link } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";

function FormalInterview() {
  const validationSchema = Yup.object({
    interviewName: Yup.string().required("*Selete a Interview Name is required"),
    departmentName: Yup.string().required("*Department Name is required"),
    candidateName: Yup.string().required("*Candidate Name is required"),
    postingTitle: Yup.string().required("*Posting Title is required"),
    from: Yup.string().required("*From Date & Time is required"),
    to: Yup.string().required("*To Date & Time is required"),
    interview: Yup.string().required("*Interview is required"),
    interviewOwner: Yup.string().required("*Interview Owner is required"),
    location: Yup.string().required("*Location is required"),
    assessmentName: Yup.string().required("*Assessment Name is required"),
    reminder: Yup.string().required("*Selete a Reminder is required"),

  });

  const formik = useFormik({
    initialValues: {
      interviewName: "",
      departmentName: "",
      candidateName: "", 
      postingTitle: "", 
      from: "",
      to: "", 
      interview: "", 
      interviewOwner: "", 
      location: "", 
      assessmentName: "", 
      reminder: "", 
      schedule:"",
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      console.log("Formal Datas:", values);
    },
  });

  return (
    <div className="container-fluid minHeight m-0">
      <div className="card shadow border-0 mb-2 top-header">
        <div className="container-fluid py-4">
          <div className="row align-items-center">
            <div className="col">
              <div className="d-flex align-items-center gap-4">
                <h1 className="h4 ls-tight headingColor">
                  Create Formal Interview
                </h1>
              </div>
            </div>
            <div className="col-auto">
              <div className="hstack gap-2 justify-content-end">
                <Link to="/interview">
                  <button type="submit" className="btn btn-sm btn-light">
                    <span>Back</span>
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
      <form onSubmit={formik.handleSubmit}>
        <div className="card shadow border-0 my-2">
          <div className="row mt-3 me-2">
            <div className="col-12 text-end">
              <button type="submit" className="btn btn-button">
                Save
              </button>
            </div>
          </div>
          <div className="container fw-bold fs-5 my-4">Formal Interview</div>
          <div className="container mb-5">
            <div className="row py-4">
              <div className="col-md-6 col-12 mb-2">
                <label className="form-label">
                  Interview Name<span className="text-danger">*</span>
                </label>
                <select
                  name="interviewName"
                  {...formik.getFieldProps("interviewName")}
                  className={`form-select ${
                    formik.touched.interviewName && formik.errors.interviewName
                      ? "is-invalid"
                      : ""
                  }`}
                >
                  <option value="">None</option>
                  <option value="Internal Interview">Internal Interview</option>
                  <option value="General Interview">General Interview</option>
                  <option value="Online Interview">Online Interview</option>
                  <option value="Phone Interview">Phone Interview</option>
                  <option value="Level 1 Interview">Level 1 Interview</option>
                  <option value="Level 2 Interview">Level 2 Interview</option>
                  <option value="Level 3 Interview">Level 3 Interview</option>
                </select>
                {formik.touched.interviewName &&
                  formik.errors.interviewName && (
                    <div className="invalid-feedback">
                      {formik.errors.interviewName}
                    </div>
                  )}
              </div>
              <div className="col-md-6 col-12 mb-2">
                <label className="form-label">
                  Candidate Name<span className="text-danger">*</span>
                </label>
                <div className="mb-3">
                  <input
                    type="text"
                    name="candidateName"
                    className={`form-control ${
                      formik.touched.candidateName &&
                      formik.errors.candidateName
                        ? "is-invalid"
                        : ""
                    }`}
                    {...formik.getFieldProps("candidateName")}
                  />
                  {formik.touched.candidateName &&
                    formik.errors.candidateName && (
                      <div className="invalid-feedback">
                        {formik.errors.candidateName}
                      </div>
                    )}
                </div>
              </div>
              <div className="col-md-6 col-12 mb-2">
                <label className="form-label">
                  Deaprtment Name<span className="text-danger">*</span>
                </label>
                <select
                  name="departmentName"
                  {...formik.getFieldProps("departmentName")}
                  className={`form-select ${
                    formik.touched.departmentName && formik.errors.departmentName
                      ? "is-invalid"
                      : ""
                  }`}
                >
                  <option value="">None</option>
                  <option value="React js">React js</option>
                  <option value="Java">Java</option>
                  <option value="Flutter">Flutter</option>
                </select>
                {formik.touched.departmentName &&
                  formik.errors.departmentName && (
                    <div className="invalid-feedback">
                      {formik.errors.departmentName}
                    </div>
                  )}
              </div>
              <div className="col-md-6 col-12 mb-2">
                <label className="form-label">
                  Posting Title<span className="text-danger">*</span>
                </label>
                <div className="mb-3">
                  <input
                    type="text"
                    name="postingTitle"
                    className={`form-control ${
                      formik.touched.postingTitle && formik.errors.postingTitle
                        ? "is-invalid"
                        : ""
                    }`}
                    {...formik.getFieldProps("postingTitle")}
                  />
                  {formik.touched.postingTitle &&
                    formik.errors.postingTitle && (
                      <div className="invalid-feedback">
                        {formik.errors.postingTitle}
                      </div>
                    )}
                </div>
              </div>
              <div className="col-md-6 col-12 mb-2">
                <label className="form-label">
                  From<span className="text-danger">*</span>
                </label>
                <input
                  type="datetime-local"
                  className={`form-control ${
                    formik.touched.from && formik.errors.from
                      ? "is-invalid"
                      : ""
                  }`}
                  {...formik.getFieldProps("from")}
                />
                {formik.touched.from && formik.errors.from && (
                  <div className="invalid-feedback">{formik.errors.from}</div>
                )}
              </div>
              <div className="col-md-6 col-12 mb-2">
                <label className="form-label">
                  To<span className="text-danger">*</span>
                </label>
                <input
                  type="datetime-local"
                  className={`form-control ${
                    formik.touched.to && formik.errors.to ? "is-invalid" : ""
                  }`}
                  {...formik.getFieldProps("to")}
                />
                {formik.touched.to && formik.errors.to && (
                  <div className="invalid-feedback">{formik.errors.to}</div>
                )}
              </div>
              <div className="col-md-6 col-12 mb-2">
                <label className="form-label">
                  Interview(s)<span className="text-danger">*</span>
                </label>
                <div className="mb-3">
                  <input
                    type="text"
                    name="interview"
                    className={`form-control ${
                      formik.touched.interview && formik.errors.interview
                        ? "is-invalid"
                        : ""
                    }`}
                    {...formik.getFieldProps("interview")}
                  />
                  {formik.touched.interview && formik.errors.interview && (
                    <div className="invalid-feedback">
                      {formik.errors.interview}
                    </div>
                  )}
                </div>
              </div>
              <div className="col-md-6 col-12 mb-2">
                <label className="form-label">
                  Interview Owner<span className="text-danger">*</span>
                </label>
                <div className="mb-3">
                  <input
                    type="text"
                    name="interviewOwner"
                    className={`form-control ${
                      formik.touched.interviewOwner &&
                      formik.errors.interviewOwner
                        ? "is-invalid"
                        : ""
                    }`}
                    {...formik.getFieldProps("interviewOwner")}
                  />
                  {formik.touched.interviewOwner &&
                    formik.errors.interviewOwner && (
                      <div className="invalid-feedback">
                        {formik.errors.interviewOwner}
                      </div>
                    )}
                </div>
              </div>
              <div className="col-md-6 col-12 mb-2">
                <label className="form-label">
                  Location<span className="text-danger">*</span>
                </label>
                <div className="mb-3">
                  <input
                    type="text"
                    name="location"
                    className={`form-control ${
                      formik.touched.location && formik.errors.location
                        ? "is-invalid"
                        : ""
                    }`}
                    {...formik.getFieldProps("location")}
                  />
                  {formik.touched.location && formik.errors.location && (
                    <div className="invalid-feedback">
                      {formik.errors.location}
                    </div>
                  )}
                </div>
              </div> 
              <div className="col-md-6 col-12 mb-2">
                <label className="form-label">
                  Assessment Name<span className="text-danger">*</span>
                </label>
                <div className="mb-3">
                  <input
                    type="text"
                    name="assessmentName"
                    className={`form-control ${
                      formik.touched.assessmentName && formik.errors.assessmentName
                        ? "is-invalid"
                        : ""
                    }`}
                    {...formik.getFieldProps("assessmentName")}
                  />
                  {formik.touched.assessmentName && formik.errors.assessmentName && (
                    <div className="invalid-feedback">
                      {formik.errors.assessmentName}
                    </div>
                  )}
                </div>
              </div>
              <div className="col-md-6 col-12 mb-2">
                <label className="form-label">
                  Reminder<span className="text-danger">*</span>
                </label>
                <select
                  name="reminder"
                  {...formik.getFieldProps("reminder")}
                  className={`form-select ${
                    formik.touched.reminder && formik.errors.reminder
                      ? "is-invalid"
                      : ""
                  }`}
                >
                  <option value="">None</option>
                  <option value="At Time Of event">At Time Of event</option>
                  <option value="5 minutes before">5 minutes before</option>
                  <option value="10 minutes before">10 minutes before</option>
                  <option value="15 minutes before">15 minutes before</option>
                  <option value="30 minutes before">30 minutes before</option>
                  <option value="1 hour before">1 hour before</option>
                  <option value="2 hour before">2 hour before</option>
                  <option value="1 day before">1 day before</option>
                  <option value="2 day before">2 day before</option>
                </select>
                {formik.touched.reminder && formik.errors.reminder && (
                  <div className="invalid-feedback">
                    {formik.errors.reminder}
                  </div>
                )}
              </div>           
              <div className="col-md-6 col-12 mb-2">
                <label className="form-label">Schedule Comments</label>
                <div className="mb-3">
                  <div className="form-floating">
                    <textarea
                      rows="5"
                      className="form-control"
                      {...formik.getFieldProps("schedule")}
                    />
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

export default FormalInterview;
