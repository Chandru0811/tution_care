import React from "react";
import { Link } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";

function UsersAdd() {
  const validationSchema = Yup.object({
    firstName: Yup.string().required("*First Name is required"),
    lastName: Yup.string().required("*Last Name is required"),
    dptName: Yup.string().required("*Department Name is required"),
    workLocation: Yup.string().required("*Work Location is required"),
    empID: Yup.string().required("*Employee Id is required"),
    empEmail: Yup.string()
    .matches(
      /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
      "*Enter a valid email address"
    )
    .required("*Email is required"),
  });

  const formik = useFormik({
    initialValues: {
      firstName: "",
      lastName:"",
      empID:"",
      empEmail:"",
      dptName:"",
      workLocation:"",
      designation:""
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      console.log("User Datas:", values);
    },
  });

  return (
    <div className="container-fluid minHeight m-0">
      <div
        className="card shadow border-0 mb-2 top-header">
        <div className="container-fluid py-4">
          <div className="row align-items-center">
            <div className="col">
              <div className="d-flex align-items-center gap-4">
                <h1 className="h4 ls-tight headingColor">Create Users</h1>
              </div>
            </div>
            <div className="col-auto">
              <div className="hstack gap-2 justify-content-end">
                <Link to="/users">
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

          {/* User Information */}
          <div className="container fw-bold fs-5 my-4">
            User Information
          </div>
          <div className="container mb-5">
            <div className="row py-4">
              <div className="col-md-6 col-12 mb-2">
                <lable className="form-lable">
                 First Name<span className="text-danger">*</span>
                </lable>
                <div className="mb-3">
                  <input
                    type="text"
                    name="firstName"
                    className={`form-control ${
                      formik.touched.firstName && formik.errors.firstName
                        ? "is-invalid"
                        : ""
                    }`}
                    {...formik.getFieldProps("firstName")}
                  />
                  {formik.touched.firstName &&
                    formik.errors.firstName && (
                      <div className="invalid-feedback">
                        {formik.errors.firstName}
                      </div>
                    )}
                </div>
              </div>
              <div className="col-md-6 col-12 mb-2">
                <lable className="form-lable">
                 Last Name<span className="text-danger">*</span>
                </lable>
                <div className="mb-3">
                  <input
                    type="text"
                    name="lastName"
                    className={`form-control  ${
                      formik.touched.lastName && formik.errors.lastName
                        ? "is-invalid"
                        : ""
                    }`}
                    {...formik.getFieldProps("lastName")}
                  />
                  {formik.touched.lastName &&
                    formik.errors.lastName && (
                      <div className="invalid-feedback">
                        {formik.errors.lastName}
                      </div>
                    )}
                </div>
              </div>

              <div className="col-md-6 col-12 mb-2">
                <lable className="form-lable">
                    Emplaoyee Id <span className="text-danger">*</span>
                </lable>
                <div className="mb-3">
                  <input
                    type="text"
                    name="empID"
                    className={`form-control ${
                      formik.touched.empID && formik.errors.empID
                        ? "is-invalid"
                        : ""
                    }`}
                    {...formik.getFieldProps("empID")}
                  />
                  {formik.touched.empID &&
                    formik.errors.empID && (
                      <div className="invalid-feedback">
                        {formik.errors.empID}
                      </div>
                    )}
                </div>
              </div>
              <div className="col-md-6 col-12 mb-2">
                <lable className="form-lable">
                 Email ID<span className="text-danger">*</span>
                </lable>
                <div className="mb-3">
                  <input
                    type="text"
                    name="empEmail"
                    className={`form-control  ${
                      formik.touched.empEmail && formik.errors.empEmail
                        ? "is-invalid"
                        : ""
                    }`}
                    {...formik.getFieldProps("empEmail")}
                  />
                  {formik.touched.empEmail &&
                    formik.errors.empEmail && (
                      <div className="invalid-feedback">
                        {formik.errors.empEmail}
                      </div>
                    )}
                </div>
              </div>

              <div className="col-md-6 col-12 mb-2">
                <lable className="form-lable">
                  Department Name<span className="text-danger">*</span>
                </lable>
                <select
                  name="dptName"
                  {...formik.getFieldProps("dptName")}
                  className={`form-select    ${
                    formik.touched.dptName && formik.errors.dptName
                      ? "is-invalid"
                      : ""
                  }`}>
                  <option selected>None</option>
                  <option value="React Js">React Js</option>
                  <option value="Angular">Angular</option>
                  <option value="Java">Java</option>
                  <option value="Python">Python</option>
                </select>
                {formik.touched.dptName && formik.errors.dptName && (
                <div className="invalid-feedback">
                  {formik.errors.dptName}
                </div>
              )}
              </div>
              <div className="col-md-6 col-12 mb-2">
                <lable className="form-lable">
                    Work Location<span className="text-danger">*</span>
                </lable>
                <div className="mb-3">
                  <input
                    type="text"
                    name="workLocation"
                    className={`form-control  ${
                      formik.touched.workLocation && formik.errors.workLocation
                        ? "is-invalid"
                        : ""
                    }`}
                    {...formik.getFieldProps("workLocation")}
                  />
                  {formik.touched.workLocation &&
                    formik.errors.workLocation && (
                      <div className="invalid-feedback">
                        {formik.errors.workLocation}
                      </div>
                    )}
                </div>
              </div>

              <div className="col-md-6 col-12 mb-2">
                <lable className="form-lable">
                    Designation<span className="text-danger">*</span>
                </lable>
                <div className="mb-3">
                  <input
                    type="text"
                    name="designation"
                    className={`form-control  ${
                      formik.touched.designation && formik.errors.designation
                        ? "is-invalid"
                        : ""
                    }`}
                    {...formik.getFieldProps("designation")}
                  />
                  {formik.touched.designation &&
                    formik.errors.designation && (
                      <div className="invalid-feedback">
                        {formik.errors.designation}
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

export default UsersAdd;
