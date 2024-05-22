import React from "react";
import { Link } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";

function CandidateEdit() {
  const validationSchema = Yup.object({
    candidateName: Yup.string().required("*Candidate Name is required"),
    phone: Yup.string().required("*Phone Number is required"),
    email: Yup.string().required("*Email is required"),
    secondaryEmail: Yup.string().required("*Secondary Email is required"),
    street: Yup.string().required("*Street is required"),
    zip: Yup.string().required("*Zipcode is required"),
    city: Yup.string().required("*City is required"),
    state: Yup.string().required("State is required"),
    country: Yup.string().required("*Country is required"),
    experience: Yup.string().required("*Experience is required"),
    qualification: Yup.string().required("*Highest Qualification is required"),
    jobTitle: Yup.string().required("*Current Job Title is required"),
    employer: Yup.string().required("*Current Employer is required"),
    expectedSalary: Yup.string().required("*Expected Salary is required"),
    currentSalary: Yup.string().required("*Current Salary is required"),
    skill: Yup.string().required("*Skill is required"),
    resume: Yup.string().required("*Upload a File is required")
  });

  const formik = useFormik({
    initialValues: {
      candidateName: "Ragul",
      phone: "98401487771",
      email: "ragul@gmail.com",
      secondaryEmail: "raghul@gmail.com",
      description: "Test",
      street: "Dubai Main Road",
      zip: "67892",
      city: "Chennai",
      state: "TamilNadu",
      country: "India",
      experience:"1 Year",
      qualification:"M.C.A",
      jobTitle:"Project-Lead",
      employer:"ECS Cloud",
      expectedSalary:"35000",
      currentSalary:"15000",
      skill:"React js",
      resume:"",
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      console.log("Job Opening Datas:", values);
    },
  });

  return (
    <div className="container-fluid minHeight m-0">
      <div className="card shadow border-0 mb-2 top-header">
        <div className="container-fluid py-4">
          <div className="row align-items-center">
            <div className="col">
              <div className="d-flex align-items-center gap-4">
                <h1 className="h4 ls-tight headingColor">Create Candidate</h1>
              </div>
            </div>
            <div className="col-auto">
              <div className="hstack gap-2 justify-content-end">
                <Link to="/candidates">
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
          <div className="container fw-bold fs-5 my-4">Basic Info</div>
          <div className="container mb-5">
            <div className="row py-4">
              <div className="col-md-6 col-12 mb-2">
                <lable className="form-lable">
                  Candidate Name<span className="text-danger">*</span>
                </lable>
                <div className="mb-3">
                  <input
                    type="text"
                    name="candidateName"
                    className={`form-control  ${
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
                <lable className="form-lable">
                  Phone<span className="text-danger">*</span>
                </lable>
                <div className="mb-3">
                  <input
                    type="text"
                    name="phone"
                    className={`form-control  ${
                      formik.touched.phone && formik.errors.phone
                        ? "is-invalid"
                        : ""
                    }`}
                    {...formik.getFieldProps("phone")}
                  />
                  {formik.touched.phone && formik.errors.phone && (
                    <div className="invalid-feedback">
                      {formik.errors.phone}
                    </div>
                  )}
                </div>
              </div>
              <div className="col-md-6 col-12 mb-2">
                <lable className="form-lable">
                  Email<span className="text-danger">*</span>
                </lable>
                <div className="mb-3">
                  <input
                    type="email"
                    name="email"
                    className={`form-control  ${
                      formik.touched.email && formik.errors.email
                        ? "is-invalid"
                        : ""
                    }`}
                    {...formik.getFieldProps("email")}
                  />
                  {formik.touched.email && formik.errors.email && (
                    <div className="invalid-feedback">
                      {formik.errors.email}
                    </div>
                  )}
                </div>
              </div>
              <div className="col-md-6 col-12 mb-2">
                <lable className="form-lable">
                  Secondary Email<span className="text-danger">*</span>
                </lable>
                <div className="mb-3">
                  <input
                    type="email"
                    name="secondaryEmail"
                    className={`form-control  ${
                      formik.touched.secondaryEmail &&
                      formik.errors.secondaryEmail
                        ? "is-invalid"
                        : ""
                    }`}
                    {...formik.getFieldProps("secondaryEmail")}
                  />
                  {formik.touched.secondaryEmail &&
                    formik.errors.secondaryEmail && (
                      <div className="invalid-feedback">
                        {formik.errors.secondaryEmail}
                      </div>
                    )}
                </div>
              </div>
              <div className="col-md-6 col-12 mb-2">
                <label className="form-label">Description</label>
                <div className="mb-3">
                  <div className="form-floating">
                    <textarea
                      rows="5"
                      className="form-control"
                      {...formik.getFieldProps("description")}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Address Information */}
          <div className="container fw-bold fs-5 mt-3">Address Information</div>
          <div className="container mb-5">
            <div className="row py-4">
              <div className="col-md-6 col-12 mb-2">
                <lable className="form-lable">Street</lable><span className="text-danger">*</span>
                <div className="mb-3">
                  <input
                    type="text"
                    name="street"
                    className={`form-control  ${
                      formik.touched.street &&
                      formik.errors.street
                        ? "is-invalid"
                        : ""
                    }`}
                    {...formik.getFieldProps("street")}
                  />
                   {formik.touched.street &&
                    formik.errors.street && (
                      <div className="invalid-feedback">
                        {formik.errors.street}
                      </div>
                    )}
                </div>
              </div>
              <div className="col-md-6 col-12 mb-2">
                <lable className="form-lable">Zip/Postal Code</lable><span className="text-danger">*</span>
                <div className="mb-3">
                  <input
                    type="text"
                    name="zip"
                    className={`form-control  ${
                      formik.touched.zip &&
                      formik.errors.zip
                        ? "is-invalid"
                        : ""
                    }`}
                    {...formik.getFieldProps("zip")}
                  />
                    {formik.touched.zip &&
                    formik.errors.zip && (
                      <div className="invalid-feedback">
                        {formik.errors.zip}
                      </div>
                    )}
                </div>
              </div>
              <div className="col-md-6 col-12 mb-2">
                <lable className="form-lable">City</lable><span className="text-danger">*</span>
                <div className="mb-3">
                  <input
                    type="text"
                    name="city"
                    className={`form-control  ${
                      formik.touched.city &&
                      formik.errors.city
                        ? "is-invalid"
                        : ""
                    }`}
                    {...formik.getFieldProps("zip")}
                  />
                    {formik.touched.city &&
                    formik.errors.city && (
                      <div className="invalid-feedback">
                        {formik.errors.city}
                      </div>
                    )}
                </div>
              </div>
              <div className="col-md-6 col-12 mb-2">
                <lable className="form-lable">State/Province</lable><span className="text-danger">*</span>
                <div className="mb-3">
                  <input
                    type="text"
                    name="state"
                    className={`form-control  ${
                      formik.touched.state &&
                      formik.errors.state
                        ? "is-invalid"
                        : ""
                    }`}
                    {...formik.getFieldProps("state")}
                  />
                     {formik.touched.state &&
                    formik.errors.state && (
                      <div className="invalid-feedback">
                        {formik.errors.state}
                      </div>
                    )}
                </div>
              </div>
              <div className="col-md-6 col-12 mb-2">
                <lable className="form-lable">Country</lable><span className="text-danger">*</span>
                <div className="mb-3">
                  <input
                    type="text"
                    name="country"
                    className={`form-control  ${
                      formik.touched.country &&
                      formik.errors.country
                        ? "is-invalid"
                        : ""
                    }`}
                    {...formik.getFieldProps("country")}
                  />
                   {formik.touched.country &&
                    formik.errors.country && (
                      <div className="invalid-feedback">
                        {formik.errors.country}
                      </div>
                    )}
                </div>
              </div>
            </div>
          </div>

          {/* Professional Detail */}
          <div className="container fw-bold fs-5 my-4">Basic Info</div>
          <div className="container mb-5">
            <div className="row py-4">
              <div className="col-md-6 col-12 mb-2">
                <lable className="form-lable">
                  Experience In Years<span className="text-danger">*</span>
                </lable>
                <div className="mb-3">
                  <input
                    type="text"
                    name="experience"
                    className={`form-control  ${
                      formik.touched.experience && formik.errors.experience
                        ? "is-invalid"
                        : ""
                    }`}
                    {...formik.getFieldProps("experience")}
                  />
                  {formik.touched.experience && formik.errors.experience && (
                    <div className="invalid-feedback">
                      {formik.errors.experience}
                    </div>
                  )}
                </div>
              </div>
              <div className="col-md-6 col-12 mb-2">
                <label className="form-label m-0">
                  Highest Qualification Held
                  <span className="text-danger">*</span>
                </label>
                <select
                  name="qualification"
                  {...formik.getFieldProps("qualification")}
                  className={`form-select ${
                    formik.touched.qualification && formik.errors.qualification
                      ? "is-invalid"
                      : ""
                  }`}
                >
                  <option value="">None</option>
                  <option value="M.C.A">M.C.A</option>
                  <option value="B.E">B.E</option>
                  <option value="B.Sc">B.Sc</option>
                  <option value="M.S">M.S</option>
                  <option value="B.Tech">B.Tech</option>
                </select>
                {formik.touched.qualification &&
                  formik.errors.qualification && (
                    <div className="invalid-feedback">
                      {formik.errors.qualification}
                    </div>
                  )}
              </div>
              <div className="col-md-6 col-12 mb-2">
                <label className="form-label m-0">
                  Current Job Title<span className="text-danger">*</span>
                </label>
                <select
                  name="jobTitle"
                  {...formik.getFieldProps("jobTitle")}
                  className={`form-select ${
                    formik.touched.jobTitle && formik.errors.jobTitle
                      ? "is-invalid"
                      : ""
                  }`}
                >
                  <option value="">None</option>
                  <option value="Fresher">Fresher</option>
                  <option value="Project-Lead" >Project-Lead</option>
                  <option value="Project-Manager">Project-Manager</option>
                </select>
                {formik.touched.jobTitle && formik.errors.jobTitle && (
                  <div className="invalid-feedback">
                    {formik.errors.jobTitle}
                  </div>
                )}
              </div>
              <div className="col-md-6 col-12 mb-2">
                <lable className="form-lable">
                  Current Employer<span className="text-danger">*</span>
                </lable>
                <div className="mb-3">
                  <input
                    type="text"
                    name="employer"
                    className={`form-control  ${
                      formik.touched.employer && formik.errors.employer
                        ? "is-invalid"
                        : ""
                    }`}
                    {...formik.getFieldProps("employer")}
                  />
                  {formik.touched.employer && formik.errors.employer && (
                    <div className="invalid-feedback">
                      {formik.errors.employer}
                    </div>
                  )}
                </div>
              </div>
              <div className="col-md-6 col-12 mb-2">
                <lable className="form-lable">
                  Expected Salary<span className="text-danger">*</span>
                </lable>
                <div className="mb-3">
                  <input
                    type="text"
                    name="expectedSalary"
                    className={`form-control  ${
                      formik.touched.expectedSalary &&
                      formik.errors.expectedSalary
                        ? "is-invalid"
                        : ""
                    }`}
                    {...formik.getFieldProps("expectedSalary")}
                  />
                  {formik.touched.expectedSalary &&
                    formik.errors.expectedSalary && (
                      <div className="invalid-feedback">
                        {formik.errors.expectedSalary}
                      </div>
                    )}
                </div>
              </div>
              <div className="col-md-6 col-12 mb-2">
                <lable className="form-lable">
                  Current Salary<span className="text-danger">*</span>
                </lable>
                <div className="mb-3">
                  <input
                    type="text"
                    name="currentSalary"
                    className={`form-control  ${
                      formik.touched.currentSalary &&
                      formik.errors.currentSalary
                        ? "is-invalid"
                        : ""
                    }`}
                    {...formik.getFieldProps("currentSalary")}
                  />
                  {formik.touched.currentSalary &&
                    formik.errors.currentSalary && (
                      <div className="invalid-feedback">
                        {formik.errors.currentSalary}
                      </div>
                    )}
                </div>
              </div>
              <div className="col-md-6 col-12 mb-2">
                <lable className="form-lable">
                  Skill Set<span className="text-danger">*</span>
                </lable>
                <div className="mb-3">
                  <input
                    type="text"
                    name="skill"
                    className={`form-control  ${
                      formik.touched.skill && formik.errors.skill
                        ? "is-invalid"
                        : ""
                    }`}
                    {...formik.getFieldProps("skill")}
                  />
                  {formik.touched.skill && formik.errors.skill && (
                    <div className="invalid-feedback">
                      {formik.errors.skill}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Attachment Information */}
          <div className="container fw-bold fs-5 my-4">
            Attachment Information
          </div>
          <div className="container mb-5">
            <div className="row py-4">
              <div className="col-md-6 col-12 mb-2">
                <lable className="form-lable">
                  Resume<span className="text-danger">*</span>
                </lable>
                <div className="mb-3">
                  <input
                    type="file"
                    name="resume"
                    className={`form-control  ${
                      formik.touched.resume && formik.errors.resume
                        ? "is-invalid"
                        : ""
                    }`}
                    {...formik.getFieldProps("resume")}
                  />
                  {formik.touched.resume && formik.errors.resume && (
                    <div className="invalid-feedback">
                      {formik.errors.resume}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}

export default CandidateEdit;
