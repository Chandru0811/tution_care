import React, { useEffect, useState } from "react";
import * as Yup from "yup";
import { useFormik } from "formik";
import { Link, useNavigate, useParams } from "react-router-dom";
import EditRegisteration from "./Edit/EditRegister";
import EditBreak from "./Edit/EditBreak";
import EditClass from "./Edit/EditClass";
import EditPackage from "./Edit/EditPackage";
import api from "../../config/URL";
import { toast } from "react-toastify";
import fetchAllCentreManager from "../List/CentreMangerList";
import Delete from "../../components/common/Delete";
import AddRegister from "./Add/AddRegister";
import AddBreak from "./Add/AddBreak";
import AddClass from "./Add/AddClass";
import AddPackage from "./Add/AddPackage";
import { Menu, MenuItem } from "@mui/material";
import User from "../../assets/clientimage/User.jpg";

const validationSchema = Yup.object().shape({
  centerName: Yup.string().required("*Centre Name is required"),
  code: Yup.string().required("*Code is required"),
  address: Yup.string().required("*Address is required"),
  // userId: Yup.string().required("*Select the Centre Manager"),
  mobile: Yup.string()
    .matches(/^\d{8}$/, "*Mobile Number must be exactly 8 digits")
    .required("*Mobile Number is required"),

  zipCode: Yup.string()
    .matches(/^\d{6}$/, "*Zip Code must be exactly 6 digits")
    .required("*Zip Code is required"),
  email: Yup.string()
    .matches(
      /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
      "*Enter a valid email address"
    )
    .required("*Email is required"),
  openingDate: Yup.date().required("*Date is required"),
  uenNumber: Yup.string().required("*UEN number is required"),
  bankName: Yup.string().required("*Bank Name is required"),
  bankBranch: Yup.string().required("*Bank Branch is required"),
  bankAccountNumber: Yup.string().required("*Bank Account Number is required"),
  bankAccountName: Yup.string().required("*Bank Account Name is required"),
  invoiceNotes: Yup.string()
    .notRequired()
    .max(200, "*The maximum length is 200 characters"),
  // file: Yup.mixed()
  //   .required("*File is required")
  //   .test(
  //     "max-file-name-length",
  //     "*File name must be at most 50 characters",
  //     (value) => !value || value.name.length <= 50
  //   ),
  target: Yup.number()
    .typeError("*Must be a number")
    .required("*Target is required")
    .positive("*Must be a positive number")
    .integer("*Must be a whole number"),
});

function CenterEdit({ handleCenterChanged }) {
  const { id } = useParams();
  const [data, setData] = useState([]);
  const [loadIndicator, setLoadIndicator] = useState(false);
  const [teacherData, setTeacherData] = useState(null);
  const navigate = useNavigate();
  const [taxTypeData, setTaxTypeData] = useState(null);

  const [imagePreviewUrl, setImagePreviewUrl] = useState(null);
  const [imagePreviewUrl1, setImagePreviewUrl1] = useState(null);
  const [imagePreviewUrl2, setImagePreviewUrl2] = useState(null);

  const userName = localStorage.getItem("tmsuserName");
  const centerId = localStorage.getItem("tmscenterId");
  const [menuAnchor, setMenuAnchor] = useState(null);

  useEffect(() => {
    fetchTeacher();
  }, []);
  const fetchTeacher = async () => {
    try {
      const manager = await fetchAllCentreManager();
      setTeacherData(manager);
    } catch (error) {
      toast.error(error);
    }
  };
  const formik = useFormik({
    initialValues: {
      centerName: "",
      code: "",
      userId: "",
      address: "",
      zipCode: "",
      mobile: "",
      email: "",
      openingDate: "",
      uenNumber: "",
      gst: "",
      taxRegistrationNumber: "",
      bankName: "",
      bankBranch: "",
      bankAccountNumber: "",
      bankAccountName: "",
      invoiceNotes: "",
      target: "",
      file: null,
      profile: null,
      logo: null,
      updatedBy: userName,
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      setLoadIndicator(true);
      setLoadIndicator(true);
      const formData = new FormData();
      formData.append("centerName", values.centerName);
      formData.append("code", values.code);
      if (values.userId) {
        formData.append("userId", values.userId);
      }
      formData.append("address", values.address);
      formData.append("zipCode", values.zipCode);
      formData.append("mobile", values.mobile);
      formData.append("email", values.email);
      formData.append("openingDate", values.openingDate);
      formData.append("uenNumber", values.uenNumber);
      formData.append("gst", values.gst);
      formData.append("taxRegistrationNumber", values.taxRegistrationNumber);
      formData.append("bankName", values.bankName);
      formData.append("bankBranch", values.bankBranch);
      formData.append("bankAccountNumber", values.bankAccountNumber);
      formData.append("bankAccountName", values.bankAccountName);
      formData.append("invoiceNotes", values.invoiceNotes);
      formData.append("file", values.file);
      formData.append("profile", values.profile);
      formData.append("logo", values.logo);
      formData.append("updatedBy", userName);
      formData.append("target", values.target);
      try {
        const response = await api.put(`/updateCenters/${id}`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        if (response.status === 200) {
          toast.success(response.data.message);
          navigate("/companyRegister");
          handleCenterChanged();
        } else {
          toast.error(response.data.message);
        }
      } catch (error) {
        if (error.response.status === 409) {
          toast.warning(error?.response?.data?.message);
        } else {
          toast.error(error.response.data.message);
        }
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

  const fetchTaxData = async () => {
    try {
      const response = await api.get("getAllTaxSetting");
      setTaxTypeData(response.data);
    } catch (error) {
      toast.error("Error fetching tax data:", error);
    }
  };

  useEffect(() => {
    const getData = async () => {
      const response = await api.get(`/getAllCenterById/${id}`);
      console.log("response", response.data);
      const formattedData = {
        ...response.data,
        openingDate: response.data.openingDate
          ? new Date(response.data.openingDate).toISOString().substring(0, 10)
          : null,
      };
      formik.setValues(formattedData);
      setData(response.data);
    };

    getData();
    fetchTeacher();
    fetchTaxData();
  }, [id]);

  const refreshData = async () => {
    try {
      const response = await api.get(`/getAllCenterById/${id}`);
      setData(response.data);
    } catch (error) {
      toast.error("Error Fetching Data");
    }
  };

  const handleMenuClose = () => setMenuAnchor(null);

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
          &nbsp;Company Management
          <span className="breadcrumb-separator"> &gt; </span>
        </li>
        <li>
          <Link to="/companyRegister" className="custom-breadcrumb">
            &nbsp;Company Listing
          </Link>
          <span className="breadcrumb-separator"> &gt; </span>
        </li>
        <li className="breadcrumb-item active" aria-current="page">
          &nbsp;Company Listing Edit
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
            className="d-flex px-4 justify-content-between align-items-center p-1 mb-4"
            style={{ background: "#f5f7f9" }}
          >
            <div class="d-flex align-items-center">
              <div class="d-flex">
                <div class="dot active"></div>
              </div>
              <span class="me-2 text-muted">Edit Centre</span>
            </div>
            <div className="my-2 pe-3 d-flex align-items-center">
              <Link to="/companyRegister">
                <button type="button " className="btn btn-sm btn-border   ">
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
                Update
              </button>
            </div>
          </div>
          <div className="container-fluid px-4">
            <div className="row">
              <div className="col-md-6 col-12">
                <div className="mb-3">
                  <label for="exampleFormControlInput1" className="form-label">
                    Company Name<span className="text-danger">*</span>
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
                    Code<span className="text-danger">*</span>
                  </label>
                  <input
                    {...formik.getFieldProps("code")}
                    type="text"
                    className={`form-control  ${
                      formik.touched.code && formik.errors.code
                        ? "is-invalid"
                        : ""
                    }`}
                    placeholder=""
                  />
                  {formik.touched.code && formik.errors.code && (
                    <div className="invalid-feedback">{formik.errors.code}</div>
                  )}
                </div>
              </div>
              <div className="col-md-6 col-12 mb-3">
                <label className="form-label">Company Manager</label>
                <select
                  {...formik.getFieldProps("userId")}
                  name="userId"
                  className={`form-select  ${
                    formik.touched.userId && formik.errors.userId
                      ? "is-invalid"
                      : ""
                  }`}
                >
                  <option selected></option>
                  {teacherData &&
                    teacherData.map((manager) => (
                      <option key={manager.id} value={manager.id}>
                        {manager.userNames}
                      </option>
                    ))}
                </select>
                {formik.touched.userId && formik.errors.userId && (
                  <div className="invalid-feedback">{formik.errors.userId}</div>
                )}
              </div>
              <div className="col-md-6 col-12">
                <div className="mb-3">
                  <label for="exampleFormControlInput1" className="form-label">
                    Address<span className="text-danger">*</span>
                  </label>
                  <textarea
                    className={`form-control ${
                      formik.touched.address && formik.errors.address
                        ? "is-invalid"
                        : ""
                    }`}
                    {...formik.getFieldProps("address")}
                    id="exampleFormControlTextarea1"
                    rows="3"
                    onBlur={formik.handleBlur}
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
              <div className="col-md-6 col-12">
                <div className="mb-3">
                  <label htmlFor="zipCode" className="form-label">
                    Zip Code<span className="text-danger">*</span>
                  </label>
                  <input
                    {...formik.getFieldProps("zipCode")}
                    type="text"
                    maxLength="6"
                    inputMode="numeric"
                    onKeyPress={(e) =>
                      !/[0-9]/.test(e.key) && e.preventDefault()
                    }
                    // pattern="\d{6}"
                    className={`form-control ${
                      formik.touched.zipCode && formik.errors.zipCode
                        ? "is-invalid"
                        : ""
                    }`}
                  />
                  {formik.touched.zipCode && formik.errors.zipCode && (
                    <div className="invalid-feedback">
                      {formik.errors.zipCode}
                    </div>
                  )}
                </div>
              </div>

              <div className="col-md-6 col-12">
                <div className="mb-3">
                  <label htmlFor="mobile" className="form-label">
                    Mobile<span className="text-danger">*</span>
                  </label>
                  <input
                    {...formik.getFieldProps("mobile")}
                    type="text"
                    maxLength="8"
                    onKeyPress={(e) =>
                      !/[0-9]/.test(e.key) && e.preventDefault()
                    }
                    className={`form-control ${
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
                    Opening Date<span className="text-danger">*</span>
                  </label>
                  <input
                    {...formik.getFieldProps("openingDate")}
                    type="date"
                    // onFocus={(e) => e.target.showPicker()}
                    className={`form-control   ${
                      formik.touched.openingDate && formik.errors.openingDate
                        ? "is-invalid"
                        : ""
                    }`}
                    aria-label="Username"
                    aria-describedby="basic-addon1"
                  />
                  {formik.touched.openingDate && formik.errors.openingDate && (
                    <div className="invalid-feedback">
                      {formik.errors.openingDate}
                    </div>
                  )}
                </div>
              </div>
              <div className="col-md-6 col-12">
                <div className="mb-3">
                  <div>
                    <label
                      for="exampleFormControlInput1"
                      className="form-label"
                    >
                      GST<span className="text-danger">*</span>
                    </label>
                  </div>
                  <div className="form-check form-check-inline">
                    <input
                      className="form-check-input"
                      type="radio"
                      name="gst"
                      id="inlineRadio1"
                      value="true"
                      onChange={() => formik.setFieldValue("gst", true)}
                      checked={formik.values.gst === true}
                    />
                    <label className="form-check-label" htmlFor="inlineRadio1">
                      Yes
                    </label>
                  </div>
                  <div className="form-check form-check-inline">
                    <input
                      className="form-check-input"
                      type="radio"
                      name="gst"
                      id="inlineRadio2"
                      value="false"
                      onChange={() => formik.setFieldValue("gst", false)}
                      checked={formik.values.gst === false}
                    />
                    <label className="form-check-label" htmlFor="inlineRadio2">
                      No
                    </label>
                  </div>
                  {formik.errors.gst && formik.touched.gst && (
                    <div
                      className="text-danger  "
                      style={{ fontSize: ".875em" }}
                    >
                      {formik.errors.gst}
                    </div>
                  )}
                </div>
              </div>
              <div className="col-md-6 col-12">
                <div className="mb-3">
                  <label for="exampleFormControlInput1" className="form-label">
                    UEN Number<span class="text-danger">*</span>
                  </label>
                  <input
                    {...formik.getFieldProps("uenNumber")}
                    type="text"
                    className={`form-control ${
                      formik.touched.uenNumber && formik.errors.uenNumber
                        ? "is-invalid"
                        : ""
                    }`}
                  />
                  {formik.touched.uenNumber && formik.errors.uenNumber && (
                    <div className="invalid-feedback">
                      {formik.errors.uenNumber}
                    </div>
                  )}
                </div>
              </div>
              <div className="col-md-6 col-12">
                <div className="mb-3">
                  <label for="exampleFormControlInput1" className="form-label">
                    TAX Registration Number
                  </label>
                  <input
                    {...formik.getFieldProps("taxRegistrationNumber")}
                    type="text"
                    className={`form-control   ${
                      formik.touched.taxRegistrationNumber &&
                      formik.errors.taxRegistrationNumber
                        ? "is-invalid"
                        : ""
                    }`}
                  />
                  {formik.touched.taxRegistrationNumber &&
                    formik.errors.taxRegistrationNumber && (
                      <div className="invalid-feedback">
                        {formik.errors.taxRegistrationNumber}
                      </div>
                    )}
                </div>
              </div>
              <div className="col-md-6 col-12">
                <div className="mb-3">
                  <label for="exampleFormControlInput1" className="form-label">
                    Bank Name<span className="text-danger">*</span>
                  </label>
                  <input
                    {...formik.getFieldProps("bankName")}
                    type="text"
                    className={`form-control    ${
                      formik.touched.bankName && formik.errors.bankName
                        ? "is-invalid"
                        : ""
                    }`}
                  />
                  {formik.touched.bankName && formik.errors.bankName && (
                    <div className="invalid-feedback">
                      {formik.errors.bankName}
                    </div>
                  )}
                </div>
              </div>
              <div className="col-md-6 col-12">
                <div className="mb-3">
                  <label for="exampleFormControlInput1" className="form-label">
                    Bank Branch<span className="text-danger">*</span>
                  </label>
                  <input
                    {...formik.getFieldProps("bankBranch")}
                    type="text"
                    className={`form-control   ${
                      formik.touched.bankBranch && formik.errors.bankBranch
                        ? "is-invalid"
                        : ""
                    }`}
                  />
                  {formik.touched.bankBranch && formik.errors.bankBranch && (
                    <div className="invalid-feedback">
                      {formik.errors.bankBranch}
                    </div>
                  )}
                </div>
              </div>
              <div className="col-md-6 col-12">
                <div className="mb-3">
                  <label for="exampleFormControlInput1" className="form-label">
                    Bank Account Name<span className="text-danger">*</span>
                  </label>
                  <input
                    {...formik.getFieldProps("bankAccountName")}
                    type="text"
                    className={`form-control    ${
                      formik.touched.bankAccountName &&
                      formik.errors.bankAccountName
                        ? "is-invalid"
                        : ""
                    }`}
                  />
                  {formik.touched.bankAccountName &&
                    formik.errors.bankAccountName && (
                      <div className="invalid-feedback">
                        {formik.errors.bankAccountName}
                      </div>
                    )}
                </div>
              </div>
              <div className="col-md-6 col-12">
                <div className="mb-3">
                  <label for="exampleFormControlInput1" className="form-label">
                    Bank Account Number<span className="text-danger">*</span>
                  </label>
                  <input
                    {...formik.getFieldProps("bankAccountNumber")}
                    type="text"
                    className={`form-control    ${
                      formik.touched.bankAccountNumber &&
                      formik.errors.bankAccountNumber
                        ? "is-invalid"
                        : ""
                    }`}
                  />
                  {formik.touched.bankAccountNumber &&
                    formik.errors.bankAccountNumber && (
                      <div className="invalid-feedback">
                        {formik.errors.bankAccountNumber}
                      </div>
                    )}
                </div>
              </div>
              <div className="col-md-6 col-12">
                <div className="mb-3">
                  <label for="exampleFormControlInput1" className="form-label">
                    Target<span className="text-danger">*</span>
                  </label>
                  <input
                    {...formik.getFieldProps("target")}
                    type="text"
                    className={`form-control   ${
                      formik.touched.target && formik.errors.target
                        ? "is-invalid"
                        : ""
                    }`}
                  />
                  {formik.touched.target && formik.errors.target && (
                    <div className="invalid-feedback">
                      {formik.errors.target}
                    </div>
                  )}
                </div>
              </div>
              <div className="col-md-4 col-12">
                <div className="text-start mt-2">
                  <label htmlFor="" className="mb-1 fw-medium">
                    <small>QR Code</small>
                    <span className="text-danger">*</span>
                  </label>
                  <br />
                  <input
                    type="file"
                    accept=".png"
                    name="file"
                    className="form-control"
                    onChange={(event) => {
                      const file = event.target.files[0];
                      formik.setFieldValue("file", file);
                      if (file) {
                        const previewUrl = URL.createObjectURL(file);
                        setImagePreviewUrl(previewUrl);
                      } else {
                        setImagePreviewUrl(null);
                      }
                    }}
                    onBlur={formik.handleBlur}
                  />
                  {formik.touched.file && formik.errors.file && (
                    <div className="error text-danger">
                      <small>{formik.errors.file}</small>
                    </div>
                  )}
                </div>
                {imagePreviewUrl && (
                  <div className="mt-3">
                    <img
                      src={imagePreviewUrl || User}
                      alt="Qr Code"
                      className="w-25"
                    />
                  </div>
                )}
                {/* <img
                  src={data.qrCode}
                  className="img-fluid ms-2 w-50 rounded mt-2"
                  alt="QR"
                /> */}
              </div>
              <div className="col-md-4 col-12">
                <div className="text-start mt-2">
                  <label htmlFor="" className="mb-1 fw-medium">
                    <small>Company Logo</small>
                    <span className="text-danger">*</span>
                  </label>
                  <br />
                  <input
                    type="file"
                    accept=".png*"
                    name="logo"
                    className="form-control"
                    onChange={(event) => {
                      const logo = event.target.files[0];
                      formik.setFieldValue("logo", logo);
                      if (logo) {
                        const previewUrl1 = URL.createObjectURL(logo);
                        setImagePreviewUrl1(previewUrl1);
                      } else {
                        setImagePreviewUrl1(null);
                      }
                    }}
                    onBlur={formik.handleBlur}
                  />
                  {formik.touched.logo && formik.errors.logo && (
                    <div className="error text-danger">
                      <small>{formik.errors.logo}</small>
                    </div>
                  )}
                </div>
                {imagePreviewUrl1 && (
                  <div className="mt-3">
                    <img
                      src={imagePreviewUrl1 || User}
                      alt="Company Logo"
                      className="w-25"
                    />
                  </div>
                )}
              </div>

              <div className="col-md-4 col-12">
                <div className="text-start mt-2">
                  <label htmlFor="" className="mb-1 fw-medium">
                    <small>Profile Image</small>
                    <span className="text-danger">*</span>
                  </label>
                  <br />
                  <input
                    type="file"
                    accept=".png"
                    name="profile"
                    className="form-control"
                    onChange={(event) => {
                      const profile = event.target.files[0];
                      formik.setFieldValue("profile", profile);
                      if (profile) {
                        const previewUrl2 = URL.createObjectURL(profile);
                        setImagePreviewUrl2(previewUrl2);
                      } else {
                        setImagePreviewUrl2(null);
                      }
                    }}
                    onBlur={formik.handleBlur}
                  />
                  {formik.touched.profile && formik.errors.profile && (
                    <div className="error text-danger">
                      <small>{formik.errors.profile}</small>
                    </div>
                  )}
                </div>
                {imagePreviewUrl2 && (
                  <div className="mt-3">
                    <img
                      src={imagePreviewUrl2 || User}
                      alt="Profile Image"
                      className="w-25"
                    />
                  </div>
                )}
                {/* <img
                  src={data.profile}
                  className="img-fluid ms-2 w-50 rounded mt-2"
                  alt="Profile"
                /> */}
              </div>
              <div className="col-12">
                <label for="exampleFormControlInput1" className="form-label">
                  Invoice Notes
                </label>
                <div class="input-group mb-3">
                  <textarea
                    class="form-control"
                    name="invoiceNotes"
                    {...(formik.getFieldProps("invoiceNotes") || " ")}
                    id="invoiceNotes"
                    rows="5"
                  ></textarea>
                </div>
              </div>
            </div>
          </div>
          <div className="container-fluid">
            <div className="row">
              {/* Centre Registrations */}
              <div className="col-md-12 col-12 mt-4">
                <div className="d-flex justify-content-between align-items-center">
                  <div class="d-flex align-items-start">
                    <h5 className="headColor mb-3">Company Registrations</h5>
                  </div>
                  <div className="my-2 pe-3 d-flex align-items-center">
                    <AddRegister
                      id={centerId}
                      onSuccess={refreshData}
                      handleMenuClose={handleMenuClose}
                    />
                  </div>
                </div>
                <Menu
                  id="action-menu"
                  anchorEl={menuAnchor}
                  open={Boolean(menuAnchor)}
                  onClose={handleMenuClose}
                >
                  <MenuItem></MenuItem>
                </Menu>

                <table className="table table-border-solid">
                  <thead>
                    <tr>
                      <th scope="col" className="fw-medium text-center">
                        S.No
                      </th>
                      <th scope="col" className="fw-medium text-center">
                        Effective Date
                      </th>
                      <th scope="col" className="fw-medium text-center">
                        Amount Including (GST)
                      </th>
                      <th scope="col" className="fw-medium text-center">
                        Tax Type
                      </th>
                      <th scope="col" className="fw-medium text-center">
                        Action
                      </th>
                      {/* <th scope="col" className="fw-medium">
                    Delete
                  </th> */}
                    </tr>
                  </thead>
                  <tbody>
                    {data.centerRegistrations &&
                      data.centerRegistrations.map((registration, index) => (
                        <tr key={index} className="mt-1">
                          <td className="text-center">{index + 1}</td>
                          <td className="text-center">
                            {registration.effectiveDate?.substring(0, 10)}
                          </td>
                          <td className="text-center">{registration.amount}</td>
                          <td className="text-center">
                            {taxTypeData &&
                              taxTypeData.map((tax) =>
                                parseInt(registration.taxId) === tax.id
                                  ? tax.taxType || "--"
                                  : ""
                              )}
                          </td>
                          <td className="text-center p-0">
                            <EditRegisteration
                              id={registration.id}
                              onSuccess={refreshData}
                            />
                            <Delete
                              onSuccess={refreshData}
                              path={`/deleteCenterRegistrations/${registration.id}`}
                            />
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
              {/* Centre Break */}
              <div className="col-md-12 col-12 mt-4">
                <div className="d-flex justify-content-between align-items-center">
                  <div class="d-flex align-items-start">
                    <h5 className="headColor mb-3">Company Break</h5>
                  </div>
                  <div className="my-2 pe-3 d-flex align-items-center">
                    <AddBreak
                      id={centerId}
                      onSuccess={refreshData}
                      handleMenuClose={handleMenuClose}
                    />
                  </div>
                </div>
                <Menu
                  id="action-menu"
                  anchorEl={menuAnchor}
                  open={Boolean(menuAnchor)}
                  onClose={handleMenuClose}
                >
                  <MenuItem></MenuItem>
                </Menu>
                <table class="table table-border-solid">
                  <thead>
                    <tr>
                      <th scope="col" className="fw-medium text-center">
                        S.No
                      </th>
                      <th scope="col" className="fw-medium text-center">
                        Break Name
                      </th>
                      <th scope="col" className="fw-medium text-center">
                        From Date
                      </th>
                      <th scope="col" className="fw-medium text-center">
                        To date
                      </th>
                      <th scope="col" className="fw-medium text-center">
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.centerBreaks &&
                      data.centerBreaks.map((centerBreak, index) => (
                        <tr key={index}>
                          <td className="text-center">{index + 1}</td>
                          <td className="text-center">
                            {centerBreak.breakName}
                          </td>
                          <td className="text-center">
                            {centerBreak.fromDate.substring(0, 10)}
                          </td>
                          <td className="text-center">
                            {centerBreak.toDate.substring(0, 10)}
                          </td>
                          <td className="text-center p-0">
                            <EditBreak
                              id={centerBreak.id}
                              onSuccess={refreshData}
                            />
                            <Delete
                              onSuccess={refreshData}
                              path={`/deleteCenterBreaks/${centerBreak.id}`}
                            />
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
              {/* class Room  */}
              <div className="col-md-12 col-12 mt-4">
                <div className="d-flex justify-content-between align-items-center">
                  <div class="d-flex align-items-start">
                    <h5 className="headColor mb-3">Company Classroom</h5>
                  </div>
                  <div className="my-2 pe-3 d-flex align-items-center">
                    <AddClass
                      id={centerId}
                      onSuccess={refreshData}
                      handleMenuClose={handleMenuClose}
                    />
                  </div>
                </div>
                <Menu
                  id="action-menu"
                  anchorEl={menuAnchor}
                  open={Boolean(menuAnchor)}
                  onClose={handleMenuClose}
                >
                  <MenuItem></MenuItem>
                </Menu>
                <div className="table-responsive">
                  <table class="table table-border-solid">
                    <thead>
                      <tr>
                        <th scope="col" className="fw-medium text-center">
                          S.No
                        </th>
                        <th
                          scope="col"
                          className="fw-medium text-center"
                          style={{ whiteSpace: "nowrap" }}
                        >
                          Classroom Name
                        </th>
                        <th
                          scope="col"
                          className="fw-medium text-center"
                          style={{ whiteSpace: "nowrap" }}
                        >
                          Classroom Code
                        </th>
                        <th
                          scope="col"
                          className="fw-medium text-center"
                          style={{ whiteSpace: "nowrap" }}
                        >
                          Classroom Type
                        </th>
                        <th
                          scope="col"
                          className="fw-medium text-center"
                          style={{ whiteSpace: "nowrap" }}
                        >
                          Capacity
                        </th>
                        <th
                          scope="col"
                          className="fw-medium text-center"
                          style={{ whiteSpace: "nowrap" }}
                        >
                          Description
                        </th>
                        <th scope="col" className="fw-medium text-center ps-4">
                          Action
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {data.centerClassRooms &&
                        data.centerClassRooms.map((centerClassRoom, index) => (
                          <tr key={index}>
                            <td className="text-center">{index + 1}</td>
                            <td className="text-center">
                              {centerClassRoom.classRoomName}
                            </td>
                            <td className="text-center">
                              {centerClassRoom.classRoomCode}
                            </td>
                            <td className="text-center">
                              {centerClassRoom.classRoomType}
                            </td>
                            <td className="text-center">
                              {centerClassRoom.capacity}
                            </td>
                            <td className="text-break">
                              {centerClassRoom.description}
                            </td>
                            <td className="text-center p-0">
                              <EditClass
                                id={centerClassRoom.id}
                                onSuccess={refreshData}
                              />
                              <Delete
                                onSuccess={refreshData}
                                path={`/deleteCenterClassRooms/${centerClassRoom.id}`}
                              />
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              </div>
              {/* Package  */}
              <div className="col-md-12 col-12 mt-4">
                <div className="d-flex justify-content-between align-items-center">
                  <div class="d-flex align-items-start">
                    <h5 className="headColor mb-3">Company Package</h5>
                  </div>
                  <div className="my-2 pe-3 d-flex align-items-center">
                    <AddPackage
                      id={centerId}
                      onSuccess={refreshData}
                      handleMenuClose={handleMenuClose}
                    />
                  </div>
                </div>
                <Menu
                  id="action-menu"
                  anchorEl={menuAnchor}
                  open={Boolean(menuAnchor)}
                  onClose={handleMenuClose}
                >
                  <MenuItem></MenuItem>
                </Menu>
                <table class="table table-border-solid">
                  <thead>
                    <tr>
                      <th scope="col" className="fw-medium text-center">
                        S.No
                      </th>
                      <th scope="col" className="fw-medium text-center">
                        Package
                      </th>
                      <th scope="col" className="fw-medium text-center">
                        Number Of Lesson
                      </th>
                      <th scope="col" className="fw-medium text-center">
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.centerPackages &&
                      data.centerPackages.map((centerPackage, index) => (
                        <tr key={index}>
                          <td className="text-center">{index + 1}</td>
                          <td className="text-center">
                            {centerPackage.packageName || "--"}
                          </td>
                          <td className="text-center">
                            {centerPackage.noOfLesson || "--"}
                          </td>
                          <td className="text-center p-0">
                            <EditPackage
                              id={centerPackage.id}
                              onSuccess={refreshData}
                            />
                            <Delete
                              onSuccess={refreshData}
                              path={`/deleteCenterPackages/${centerPackage.id}`}
                            />
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}

export default CenterEdit;
