import React from "react";
import { Link } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";

function OfferEdit() {
  const validationSchema = Yup.object({
    postingTitle: Yup.string().required("*Posting Title is required"),
    departmentName: Yup.string().required("*Department Name is required"),
    candidateName: Yup.string().required("*Candidate Name is required"),
    compensationAmount: Yup.string().required(
      "*Compensation Amount is required"
    ),
    employeeType: Yup.string().required("*Employee Type is required"),
    expectedJoiningDate: Yup.string().required(
      "*Expected Joining Date is required"
    ),
    offerOwner: Yup.string().required("*Offer Owner is required"),
    expiryDate: Yup.string().required("*Expiry Date is required"),
  });

  const formik = useFormik({
    initialValues: {
      postingTitle: "React Js",
      departmentName: "Angular",
      candidateName: "Ragul",
      compensationAmount: "$",
      employeeType: "Permanent",
      expectedJoiningDate: "2024-03-23",
      offerOwner: "Ragul",
      expiryDate: "2025-03-23",
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      console.log("Offers Datas:", values);
    },
  });

  return (
    <div className="container-fluid minHeight m-0">
      <div className="card shadow border-0 mb-2 top-header">
        <div className="container-fluid py-4">
          <div className="row align-items-center">
            <div className="col">
              <div className="d-flex align-items-center gap-4">
                <h1 className="h4 ls-tight headingColor">Update Offers</h1>
              </div>
            </div>
            <div className="col-auto">
              <div className="hstack gap-2 justify-content-end">
                <Link to="/offer">
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
              <button type="submit" className="btn btn-button mx-2">
                Save & Send
              </button>
              <button type="submit" className="btn btn-button mx-2">
                Update
              </button>
            </div>
          </div>

          {/* Offers Information */}
          <div className="container fw-bold fs-5 my-4">Basic Information</div>
          <div className="container mb-5">
            <div className="row py-4">
              <div className="col-md-6 col-12 mb-2">
                <lable className="form-lable">
                  Posting Title<span className="text-danger">*</span>
                </lable>
                <select
                  name="postingTitle"
                  {...formik.getFieldProps("postingTitle")}
                  className={`form-select    ${
                    formik.touched.postingTitle && formik.errors.postingTitle
                      ? "is-invalid"
                      : ""
                  }`}
                >
                  <option selected></option>
                  <option value="React Js">React Js</option>
                  <option value="Angular">Angular</option>
                  <option value="Java">Java</option>
                  <option value="Python">Python</option>
                </select>
                {formik.touched.postingTitle && formik.errors.postingTitle && (
                  <div className="invalid-feedback">
                    {formik.errors.postingTitle}
                  </div>
                )}
              </div>
              <div className="col-md-6 col-12 mb-2">
                <lable className="form-lable">
                  Department Name<span className="text-danger">*</span>
                </lable>
                <select
                  name="departmentName"
                  {...formik.getFieldProps("departmentName")}
                  className={`form-select    ${
                    formik.touched.departmentName &&
                    formik.errors.departmentName
                      ? "is-invalid"
                      : ""
                  }`}
                >
                  <option selected></option>
                  <option value="React Js">React Js</option>
                  <option value="Angular">Angular</option>
                  <option value="Java">Java</option>
                  <option value="Python">Python</option>
                </select>
                {formik.touched.departmentName &&
                  formik.errors.departmentName && (
                    <div className="invalid-feedback">
                      {formik.errors.departmentName}
                    </div>
                  )}
              </div>
              <div className="col-md-6 col-12 mb-2">
                <lable className="form-lable">
                  Candidate Name<span className="text-danger">*</span>
                </lable>
                <select
                  name="candidateName"
                  {...formik.getFieldProps("candidateName")}
                  className={`form-select    ${
                    formik.touched.candidateName && formik.errors.candidateName
                      ? "is-invalid"
                      : ""
                  }`}
                >
                  <option selected></option>
                  <option value="Ragul">Ragul</option>
                  <option value="Saravanan">Saravanan</option>
                  <option value="chandru">chandru</option>
                  <option value="Suriya">Suriya</option>
                </select>
                {formik.touched.candidateName &&
                  formik.errors.candidateName && (
                    <div className="invalid-feedback">
                      {formik.errors.candidateName}
                    </div>
                  )}
              </div>
              <div className="col-md-6 col-12 mb-2">
                <lable className="form-lable">Choose Offer Template</lable>
                <select
                  name="chooseOfferTemplate"
                  {...formik.getFieldProps("chooseOfferTemplate")}
                  className={`form-select ${
                    formik.touched.chooseOfferTemplate &&
                    formik.errors.chooseOfferTemplate
                      ? "is-invalid"
                      : ""
                  }`}
                >
                  <option selected></option>
                  <option value="Offer of Employment">
                    Offer of Employment
                  </option>
                  <option value="Offer of Contract">Offer of Contract</option>
                </select>
              </div>
            </div>
          </div>

          {/* Employment Information */}
          <div className="container fw-bold fs-5 mt-3">
            Employment Information
          </div>
          <div className="container mb-5">
            <div className="row py-4">
              <div className="col-md-6 col-12 mb-2">
                <lable className="form-lable">
                  Compensation Amount<span className="text-danger">*</span>
                </lable>
                <div className="mb-3">
                  <input
                    type="text"
                    name="compensationAmount"
                    className={`form-control  ${
                      formik.touched.compensationAmount &&
                      formik.errors.compensationAmount
                        ? "is-invalid"
                        : ""
                    }`}
                    {...formik.getFieldProps("compensationAmount")}
                  />
                  {formik.touched.compensationAmount &&
                    formik.errors.compensationAmount && (
                      <div className="invalid-feedback">
                        {formik.errors.compensationAmount}
                      </div>
                    )}
                </div>
              </div>
              <div className="col-md-6 col-12 mb-2">
                <lable className="form-lable">
                  Employee Type<span className="text-danger">*</span>
                </lable>
                <select
                  name="employeeType"
                  {...formik.getFieldProps("employeeType")}
                  className={`form-select    ${
                    formik.touched.employeeType && formik.errors.employeeType
                      ? "is-invalid"
                      : ""
                  }`}
                >
                  <option selected></option>
                  <option value="Permanent">Permanent</option>
                  <option value="Training">Training</option>
                </select>
                {formik.touched.employeeType && formik.errors.employeeType && (
                  <div className="invalid-feedback">
                    {formik.errors.employeeType}
                  </div>
                )}
              </div>
              <div className="col-md-6 col-12 mb-2">
                <lable className="form-lable">
                  Expected Joining Date<span className="text-danger">*</span>
                </lable>
                <div className="mb-3">
                  <input
                    type="date"
                    name="expectedJoiningDate"
                    className={`form-control  ${
                      formik.touched.expectedJoiningDate &&
                      formik.errors.expectedJoiningDate
                        ? "is-invalid"
                        : ""
                    }`}
                    {...formik.getFieldProps("expectedJoiningDate")}
                  />
                  {formik.touched.expectedJoiningDate &&
                    formik.errors.expectedJoiningDate && (
                      <div className="invalid-feedback">
                        {formik.errors.expectedJoiningDate}
                      </div>
                    )}
                </div>
              </div>
              <div className="col-md-6 col-12 mb-2">
                <lable className="form-lable">
                  Offer Owner<span className="text-danger">*</span>
                </lable>
                <select
                  name="offerOwner"
                  {...formik.getFieldProps("offerOwner")}
                  className={`form-select    ${
                    formik.touched.offerOwner && formik.errors.offerOwner
                      ? "is-invalid"
                      : ""
                  }`}
                >
                  <option selected></option>
                  <option value="Ragul">Ragul</option>
                  <option value="Saravanan">Saravanan</option>
                  <option value="chandru">chandru</option>
                  <option value="Suriya">Suriya</option>
                </select>
                {formik.touched.offerOwner && formik.errors.offerOwner && (
                  <div className="invalid-feedback">
                    {formik.errors.offerOwner}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Other Information */}
          <div className="container fw-bold fs-5 my-4">Other Information</div>
          <div className="container mb-5">
            <div className="row py-4">
              <div className="col-md-6 col-12 mb-2">
                <lable className="form-lable">
                  Expiry Date<span className="text-danger">*</span>
                </lable>
                <div className="mb-3">
                  <input
                    type="date"
                    name="expiryDate"
                    className={`form-control  ${
                      formik.touched.expiryDate && formik.errors.expiryDate
                        ? "is-invalid"
                        : ""
                    }`}
                    {...formik.getFieldProps("expiryDate")}
                  />
                  {formik.touched.expiryDate && formik.errors.expiryDate && (
                    <div className="invalid-feedback">
                      {formik.errors.expiryDate}
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

export default OfferEdit;
