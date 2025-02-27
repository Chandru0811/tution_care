import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import api from "../../config/URL";
import { toast } from "react-toastify";

const validationSchema = Yup.object({
  name: Yup.string().required("Lead name is required"),
  email: Yup.string()
    .email("Invalid email format")
    .required("Primary email is required"),
  phone: Yup.string()
    .matches(/^\d{8}$/, "Mobile number must be 8 digits")
    .required("Primary mobile number is required"),
  gender: Yup.string().required("Gender is required"),
  dob: Yup.date().required("Date of Birth is required"),
  remarks: Yup.string().required("Remarks is required"),
  termsAndCondition: Yup.boolean()
    .oneOf([true], "Please accept the terms and conditions")
    .required("Terms and conditions must be accepted"),
});

function NewLeadArrived() {
  // const navigate = useNavigate();
  const { token } = useParams();
  const [loadIndicator, setLoadIndicator] = useState(false);
  console.log("Received Token:", token);

  const formik = useFormik({
    initialValues: {
      name: "",
      encodedCenterData: token || "",
      leadStatus: "NEW_WAITLIST" || "",
      email: "",
      phone: "",
      gender: "",
      dob: "",
      referredBy: "",
      marketingSource: "",
      remarks: "",
      termsAndCondition: false,
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      console.log("Create New Lead ::", values);
      setLoadIndicator(true);
      try {
        const response = await api.post("/createLeadDynamicFormWithOutToken", values, {
          headers: {
            "Content-Type": "application/json",
          },
        });
        if (response.status === 201) {
          toast.success("New Lead Register Successfully");
          // navigate("/lead");
          formik.resetForm();
        } else {
          toast.error(response.data.message);
        }
      } catch (error) {
        if (
          error?.response?.status === 409 ||
          error?.response?.status === 404
        ) {
          toast.warning(error?.response?.data?.message);
        } else {
          toast.error("Error submitting data: " + error.message);
        }
      } finally {
        setLoadIndicator(false);
      }
    },
  });

  useEffect(() => {
    if (formik.submitCount > 0 && Object.keys(formik.errors).length > 0) {
      const errorField = Object.keys(formik.errors)[0];
      const errorElement = document.querySelector(`[name="${errorField}"]`);
      if (errorElement) {
        errorElement.scrollIntoView({ behavior: "smooth", block: "center" });
        errorElement.focus();
      }
    }
  }, [formik.submitCount, formik.errors]);

  return (
    <div className="container my-4 newLead">
      <form
        onSubmit={formik.handleSubmit}
        onKeyDown={(e) => {
          if (e.key === "Enter" && !formik.isSubmitting) {
            e.preventDefault(); // Prevent default form submission
          }
        }}
      >
          <div className="container">
            <h1 style={{color:"#287f71"}} className="m-0">Welcome!</h1>
            <p style={{color:"#287f71"}} className="m-0">Help us understand you better...</p>
            <div className="row py-4">
              <div className="col-md-6 mb-3">
                <label className="form-label">
                  Name<span className="text-danger">*</span>
                </label>
                <input
                  name="name"
                  type="text"
                  className={`form-control ${
                    formik.touched.name && formik.errors.name
                      ? "is-invalid"
                      : ""
                  }`}
                  {...formik.getFieldProps("name")}
                />
                {formik.touched.name && formik.errors.name && (
                  <div className="invalid-feedback">
                    {formik.errors.name}
                  </div>
                )}
              </div>

              <div className="col-md-6 mb-3">
                <label className="form-label">
                  Email<span className="text-danger">*</span>
                </label>
                <input
                  name="email"
                  type="email"
                  className={`form-control ${
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

              <div className="col-md-6 mb-3">
                <label className="form-label">
                  Date of Birth<span className="text-danger">*</span>
                </label>
                <input
                  name="dob"
                  type="date"
                  className={`form-control ${
                    formik.touched.dob && formik.errors.dob ? "is-invalid" : ""
                  }`}
                  {...formik.getFieldProps("dob")}
                />
                {formik.touched.dob && formik.errors.dob && (
                  <div className="invalid-feedback">{formik.errors.dob}</div>
                )}
              </div>

              <div className="col-md-6 mb-3">
                <label className="form-label">
                  Mobile<span className="text-danger">*</span>
                </label>
                <input
                  name="phone"
                  type="text"
                  className={`form-control ${
                    formik.touched.phone && formik.errors.phone
                      ? "is-invalid"
                      : ""
                  }`}
                  {...formik.getFieldProps("phone")}
                />
                {formik.touched.phone &&
                  formik.errors.phone && (
                    <div className="invalid-feedback">
                      {formik.errors.phone}
                    </div>
                  )}
              </div>

              <div className="col-md-6 mb-3">
                <label className="form-label">
                  Gender<span className="text-danger">*</span>
                </label>
                <div>
                  <div className="form-check form-check-inline">
                    <input
                      className="form-check-input"
                      type="radio"
                      name="gender"
                      value="Male"
                      checked={formik.values.gender === "Male"}
                      onChange={formik.handleChange}
                    />
                    <label className="form-check-label">Male</label>
                  </div>
                  <div className="form-check form-check-inline">
                    <input
                      className="form-check-input"
                      type="radio"
                      name="gender"
                      value="Female"
                      checked={formik.values.gender === "Female"}
                      onChange={formik.handleChange}
                    />
                    <label className="form-check-label">Female</label>
                  </div>
                  {formik.touched.gender && formik.errors.gender && (
                    <div className="invalid-feedback d-block">
                      {formik.errors.gender}
                    </div>
                  )}
                </div>
              </div>
              <div className="col-md-6 mb-3">
               
              </div>
            

              <div className="col-md-6 mb-3">
                <label className="form-label">Refer By</label>
                <input
                  name="referredBy"
                  type="text"
                  className={`form-control ${
                    formik.touched.referredBy && formik.errors.referredBy
                      ? "is-invalid"
                      : ""
                  }`}
                  {...formik.getFieldProps("referredBy")}
                />
                {formik.touched.referredBy && formik.errors.referredBy && (
                  <div className="invalid-feedback">
                    {formik.errors.referredBy}
                  </div>
                )}
              </div>

              <div className="col-md-6 col-12 mb-3">
                <label className="form-label">Marketing Source</label>
                <div className="input-group ">
                  <select
                    name="marketingSource"
                    {...formik.getFieldProps("marketingSource")}
                    className={`form-select ${
                      formik.touched.marketingSource &&
                      formik.errors.marketingSource
                        ? "is-invalid"
                        : ""
                    }`}
                  >
                    <option selected></option>
                    <option value="Friends or Relatives">
                      Friends or Relatives
                    </option>
                    <option value="Facebook">Facebook</option>
                    <option value="Google">Google</option>
                    <option value="Others">Others</option>
                  </select>
                </div>
                {formik.touched.marketingSource &&
                  formik.errors.marketingSource && (
                    <div className="error text-danger">
                      <small>{formik.errors.marketingSource}</small>
                    </div>
                  )}
              </div>

              <div className="col-md-12 col-12">
                <div className="mb-3">
                  <div>
                    <label
                      for="exampleFormControlInput1"
                      className="form-label"
                    >
                      Remarks
                    </label><span className="text-danger">*</span>
                  </div>
                  <div className="">
                    <textarea
                      type="text"
                      name="remarks"
                      {...formik.getFieldProps("remarks")}
                      className={`form-control ${
                        formik.touched.remarks && formik.errors.Remarks
                          ? "is-invalid"
                          : ""
                      }`}
                    />
                    {formik.touched.remarks && formik.errors.remarks && (
                      <div className="error text-danger ">
                        <small>{formik.errors.remarks}</small>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="col-12 mt-3">
                <div className="form-check">
                  <input
                    type="checkbox"
                    name="termsAndCondition"
                    className={`form-check-input ${
                      formik.touched.termsAndCondition &&
                      formik.errors.termsAndCondition
                        ? "is-invalid"
                        : ""
                    }`}
                    {...formik.getFieldProps("termsAndCondition")}
                  />
                  <label className="form-check-label">
                    I agree of the terms and Condition
                    <span className="text-danger">*</span>
                  </label>
                  {formik.touched.termsAndCondition &&
                    formik.errors.termsAndCondition && (
                      <div className="invalid-feedback">
                        {formik.errors.termsAndCondition}
                      </div>
                    )}
                </div>
              </div>

              <div className="mt-4">
                <button
                  type="submit"
                  className="btn btn-button btn-md"
                  disabled={loadIndicator}
                >
                  {loadIndicator && (
                    <span
                      className="spinner-border spinner-border-sm me-2"
                      aria-hidden="true"
                    ></span>
                  )}
                  <span className="fw-medium">Submit</span>
                </button>
              </div>
            </div>
          </div>
      </form>
    </div>
  );
}

export default NewLeadArrived;
