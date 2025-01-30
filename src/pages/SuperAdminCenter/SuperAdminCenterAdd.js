import { useFormik } from "formik";
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import * as Yup from "yup";
import api from "../../config/URL";
import { toast } from "react-toastify";
import fetchAllCentreManager from "../List/CentreMangerList";

const validationSchema = Yup.object().shape({
  name: Yup.string().required("*Name is required"),
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
});

function SuperAdminCenterAdd({ handleCenterChanged }) {
  const navigate = useNavigate();
  const [loadIndicator, setLoadIndicator] = useState(false);
  const [managerData, setmanagerData] = useState(null);
  const userName = localStorage.getItem("tmsuserName");

  useEffect(() => {
    fetchTeacher();
  }, []);

  const fetchTeacher = async () => {
    try {
      const manager = await fetchAllCentreManager();
      setmanagerData(manager);
    } catch (error) {
      toast.error(error);
    }
  };

  const formik = useFormik({
    initialValues: {
      name: "",
      centerName: "",
      email: "",
      mobile: "",
      address: "",
      zipCode: "",
      openingDate: "",
      uenNumber: "",
      gst: "",
      taxRegistrationNumber: "",
      bankName: "",
      bankBranch: "",
      bankAccountNumber: "",
      bankAccountName: "",
      target: "",
      file: null,
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      // let selectedTeacherName = "";
      setLoadIndicator(true);
      // managerData.forEach((teacher) => {
      //   if (parseInt(values.centerManager) === teacher.id) {
      //     selectedTeacherName = teacher.userNames || "--";
      //   }
      // });

      // Convert gst value to boolean
      // values.gst = values.gst === "true";
      const formData = new FormData();
      formData.append("name", values.name);
      formData.append("centerName", values.centerName);
      formData.append("email", values.email);
      formData.append("mobile", values.mobile);
      formData.append("address", values.address);
      formData.append("code", values.code);
      formData.append("userId", values.centerManager);
      formData.append("zipCode", values.zipCode);
      formData.append("openingDate", values.openingDate);
      formData.append("uenNumber", values.uenNumber);
      formData.append("gst", values.gst);
      formData.append("taxRegistrationNumber", values.taxRegistrationNumber);
      formData.append("bankName", values.bankName);
      formData.append("bankBranch", values.bankBranch);
      formData.append("bankAccountNumber", values.bankAccountNumber);
      formData.append("bankAccountName", values.bankAccountName);
      formData.append("invoiceNotes  ", values.invoiceNotes || " ");
      formData.append("file", values.file);
      formData.append("target", values.target);
      formData.append("createdBy", userName);

      // for (let [key, value] of formData.entries()) {
      //   console.log(`${key}: ${value}`);
      // }
      try {
        const response = await api.post("/createCenters", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        if (response.status === 201) {
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
          &nbsp;Organization Management
          <span className="breadcrumb-separator"> &gt; </span>
        </li>
        <li>
          <Link to="/center" className="custom-breadcrumb">
            &nbsp;Company Listing
          </Link>
          <span className="breadcrumb-separator"> &gt; </span>
        </li>
        <li className="breadcrumb-item active" aria-current="page">
          &nbsp;Company Listing Add
        </li>
      </ol>
      <form
        onSubmit={formik.handleSubmit}
      // onKeyDown={(e) => {
      //   if (e.key === "Enter" && !formik.isSubmitting) {
      //     e.preventDefault(); // Prevent default form submission
      //   }
      // }}
      >
        <div className="card">
          <div
            className="d-flex justify-content-between align-items-center p-1 mb-4 px-4"
            style={{ background: "#f5f7f9" }}
          >
            <div class="d-flex align-items-center">
              <div class="d-flex">
                <div class="dot active"></div>
              </div>
              <span class="me-2 text-muted">Add Company</span>
            </div>
            <div className="my-2 pe-3 d-flex align-items-center">
              <Link to="/companyregistration">
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
                    Name<span className="text-danger">*</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    className={`form-control  ${formik.touched.name && formik.errors.name
                      ? "is-invalid"
                      : ""
                      }`}
                    aria-label="Username"
                    aria-describedby="basic-addon1"
                    {...formik.getFieldProps("name")}
                  />
                  {formik.touched.name && formik.errors.name && (
                    <div className="invalid-feedback">
                      {formik.errors.name}
                    </div>
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
                    className={`form-control  ${formik.touched.centerName && formik.errors.centerName
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
                    className={`form-control   ${formik.touched.email && formik.errors.email
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
                    Mobile<span className="text-danger">*</span>
                  </label>
                  <input
                    {...formik.getFieldProps("mobile")}
                    type="text"
                    className={`form-control   ${formik.touched.mobile && formik.errors.mobile
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
                  <label for="exampleFormControlInput1" className="form-label">
                    Address<span className="text-danger">*</span>
                  </label>
                  <textarea
                    className={`form-control  ${formik.touched.address && formik.errors.address
                      ? "is-invalid"
                      : ""
                      }`}
                    {...formik.getFieldProps("address")}
                    id="exampleFormControlTextarea1"
                    rows="3"
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        // Allow the default behavior for Enter key
                        console.log("Enter key pressed: moving to the next line");
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
    </div>
  );
}

export default SuperAdminCenterAdd;
