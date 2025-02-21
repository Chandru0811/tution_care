import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import api from "../../config/URL";
import { toast } from "react-toastify";

const validationSchema = Yup.object({
  leadName: Yup.string().required("Lead name is required"),
  primaryEmail: Yup.string()
    .email("Invalid email format")
    .required("Primary email is required"),
  primaryMobile: Yup.string()
    .matches(/^\d{8}$/, "Mobile number must be 8 digits")
    .required("Primary mobile number is required"),
  subjectId: Yup.string().required("Subject is required"),
  gender: Yup.string().required("Gender is required"),
  dob: Yup.date().required("Date of Birth is required"),
  referBy: Yup.string().nullable(),
  parentName: Yup.string().required("Parent name is required"),
  // occupation: Yup.string().required("Occupation is required"),
  // parentMobile: Yup.string().matches(/^\d{8}$/, "Mobile number must be 10 digits"),
  parentEmail: Yup.string().email("Invalid email format"),
  address: Yup.string().required("Address is required"),
  postalCode: Yup.string()
    .matches(/^\d{6}$/, "Postal code must be 6 digits")
    .required("Postal code is required"),
  // preferredDay: Yup.string().required("Preferred day is required"),
  // preferredTimeSlot: Yup.string().required("Preferred time slot is required"),
  // marketingSource: Yup.string().required("Marketing source is required"),
  // remarks: Yup.string().nullable(),
  termsAndCondition: Yup.boolean()
    .oneOf([true], "You must accept the terms and conditions")
    .required("Terms and conditions must be accepted"),
});

function NewLeadsAdd() {
  const navigate = useNavigate();
  const [loadIndicator, setLoadIndicator] = useState(false);
  const userName = localStorage.getItem("tmsemail");
  const centerId = localStorage.getItem("tmscenterId");
  const [subjectData, setSubjectData] = useState(null);
  const storedConfigure = JSON.parse(
    localStorage.getItem("tmsappConfigInfo") || "{}"
  );

  const formik = useFormik({
    initialValues: {
      center: centerId,
      leadName: "",
      leadStatus: "NEW_WAITLIST" || "",
      primaryEmail: "",
      primaryMobile: "",
      subjectId: "",
      gender: "",
      dob: "",
      referBy: "",
      parentName: "",
      occupation: "",
      parentMobile: "",
      parentEmail: "",
      address: "",
      postalCode: "",
      preferredDay: "",
      preferredTimeSlot: "",
      marketingSource: "",
      remarks: "",
      termsAndCondition: false,
      createdBy: userName,
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      console.log("Create New Lead ::", values);
      // setLoadIndicator(true);
      // try {
      //   const response = await api.post("/creatNewLead", values, {
      //     headers: {
      //       "Content-Type": "application/json",
      //     },
      //   });
      //   if (response.status === 201) {
      //     toast.success(response.data.message);
      //     navigate("/lead");
      //   } else {
      //     toast.error(response.data.message);
      //   }
      // } catch (error) {
      //   if (
      //     error?.response?.status === 409 ||
      //     error?.response?.status === 404
      //   ) {
      //     toast.warning(error?.response?.data?.message);
      //   } else {
      //     toast.error("Error submitting data: " + error.message);
      //   }
      // } finally {
      //   setLoadIndicator(false);
      // }
    },
  });

  const fetchSubject = async () => {
    try {
      const response = await api.get(
        `/getCourseSubjectsByCenterId/${centerId}`
      );
      setSubjectData(response.data);
    } catch (error) {
      toast.error(error);
    }
  };

  useEffect(() => {
    fetchSubject();
  }, []);

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
    <div className="container">
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
          {storedConfigure?.lead || "Lead"} Add
        </li>
      </ol>
      <form
        onSubmit={formik.handleSubmit}
        onKeyDown={(e) => {
          if (e.key === "Enter" && !formik.isSubmitting) {
            e.preventDefault(); // Prevent default form submission
          }
        }}
      >
        <div className="card">
          <div
            className="d-flex justify-content-between align-items-center p-1 mb-4 px-4"
            style={{ background: "#f5f7f9" }}
          >
            <div className="d-flex align-items-center">
              <div className="d-flex">
                <div className="dot active"></div>
              </div>
              <span className="me-2 text-muted">
                Add {storedConfigure?.lead || "Lead"}
              </span>
            </div>
            <div className="my-2 pe-3 d-flex align-items-center">
              <Link to="/assignment">
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

          <div className="container">
            <div className="row py-4">
              <div className="col-md-6 mb-3">
                <label className="form-label">
                  Name<span className="text-danger">*</span>
                </label>
                <input
                  name="leadName"
                  type="text"
                  className={`form-control ${
                    formik.touched.leadName && formik.errors.leadName
                      ? "is-invalid"
                      : ""
                  }`}
                  {...formik.getFieldProps("leadName")}
                />
                {formik.touched.leadName && formik.errors.leadName && (
                  <div className="invalid-feedback">
                    {formik.errors.leadName}
                  </div>
                )}
              </div>

              <div className="col-md-6 mb-3">
                <label className="form-label">
                  Email<span className="text-danger">*</span>
                </label>
                <input
                  name="primaryEmail"
                  type="email"
                  className={`form-control ${
                    formik.touched.primaryEmail && formik.errors.primaryEmail
                      ? "is-invalid"
                      : ""
                  }`}
                  {...formik.getFieldProps("primaryEmail")}
                />
                {formik.touched.primaryEmail && formik.errors.primaryEmail && (
                  <div className="invalid-feedback">
                    {formik.errors.primaryEmail}
                  </div>
                )}
              </div>

              <div className="col-md-6 mb-3">
                <label className="form-label">
                  Mobile<span className="text-danger">*</span>
                </label>
                <input
                  name="primaryMobile"
                  type="text"
                  className={`form-control ${
                    formik.touched.primaryMobile && formik.errors.primaryMobile
                      ? "is-invalid"
                      : ""
                  }`}
                  {...formik.getFieldProps("primaryMobile")}
                />
                {formik.touched.primaryMobile && formik.errors.primaryMobile && (
                  <div className="invalid-feedback">
                    {formik.errors.primaryMobile}
                  </div>
                )}
              </div>

              <div className="col-md-6 col-12 mb-2">
                <label className="form-label">
                  Subject
                </label><span className="text-danger">*</span>
                <select
                  className={`form-select  ${
                    formik.touched.subjectId && formik.errors.subjectId
                      ? "is-invalid"
                      : ""
                  }`}
                  {...formik.getFieldProps("subjectId")}
                >
                  <option selected></option>
                  {subjectData &&
                    subjectData.map((subjectId) => (
                      <option key={subjectId.subjectId} value={subjectId.id}>
                        {subjectId.subject}
                      </option>
                    ))}
                </select>
                {formik.touched.subjectId && formik.errors.subjectId && (
                  <div className="invalid-feedback">
                    {formik.errors.subjectId}
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
                  Parent Name<span className="text-danger">*</span>
                </label>
                <input
                  name="parentName"
                  type="text"
                  className={`form-control ${
                    formik.touched.parentName && formik.errors.parentName
                      ? "is-invalid"
                      : ""
                  }`}
                  {...formik.getFieldProps("parentName")}
                />
                {formik.touched.parentName && formik.errors.parentName && (
                  <div className="invalid-feedback">
                    {formik.errors.parentName}
                  </div>
                )}
              </div>

              <div className="col-md-6 mb-3">
                <label className="form-label">
                  Parent Email<span className="text-danger">*</span>
                </label>
                <input
                  name="parentEmail"
                  type="email"
                  className={`form-control ${
                    formik.touched.parentEmail && formik.errors.parentEmail
                      ? "is-invalid"
                      : ""
                  }`}
                  {...formik.getFieldProps("parentEmail")}
                />
                {formik.touched.parentEmail && formik.errors.parentEmail && (
                  <div className="invalid-feedback">
                    {formik.errors.parentEmail}
                  </div>
                )}
              </div>

              <div className="col-md-6 mb-3">
                <label className="form-label">Parent Mobile</label>
                <input
                  name="parentMobile"
                  type="text"
                  className={`form-control ${
                    formik.touched.parentMobile && formik.errors.parentMobile
                      ? "is-invalid"
                      : ""
                  }`}
                  {...formik.getFieldProps("parentMobile")}
                />
                {formik.touched.parentMobile && formik.errors.parentMobile && (
                  <div className="invalid-feedback">
                    {formik.errors.parentMobile}
                  </div>
                )}
              </div>

              <div className="col-md-6 mb-3">
                <label className="form-label">Occupation</label>
                <input
                  name="occupation"
                  type="text"
                  className={`form-control ${
                    formik.touched.occupation && formik.errors.occupation
                      ? "is-invalid"
                      : ""
                  }`}
                  {...formik.getFieldProps("occupation")}
                />
                {formik.touched.occupation && formik.errors.occupation && (
                  <div className="invalid-feedback">
                    {formik.errors.occupation}
                  </div>
                )}
              </div>

              <div className="col-md-6 col-12 mb-3">
                <label className="form-label">Preferred Day</label>
                <div className="input-group">
                  <select
                    name="preferredDay"
                    {...formik.getFieldProps("preferredDay")}
                    className={`form-select ${
                      formik.touched.preferredDay && formik.errors.preferredDay
                        ? "is-invalid"
                        : ""
                    }`}
                  >
                    <option value="">Select a day</option>
                    <option value="MONDAY">Monday</option>
                    <option value="TUESDAY">Tuesday</option>
                    <option value="WEDNESDAY">Wednesday</option>
                    <option value="THURSDAY">Thursday</option>
                    <option value="FRIDAY">Friday</option>
                    <option value="SATURDAY">Saturday</option>
                    <option value="SUNDAY">Sunday</option>
                  </select>
                </div>
                {formik.touched.preferredDay && formik.errors.preferredDay && (
                  <div className="error text-danger">
                    <small>{formik.errors.preferredDay}</small>
                  </div>
                )}
              </div>

              <div className="col-md-6 col-12 mb-3">
                <label className="form-label">Preferred Time</label>
                <div className="input-group">
                  <select
                    name="preferredTimeSlot"
                    {...formik.getFieldProps("preferredTimeSlot")}
                    className={`form-select ${
                      formik.touched.preferredTimeSlot &&
                      formik.errors.preferredTimeSlot
                        ? "is-invalid"
                        : ""
                    }`}
                  >
                    <option value="">Select a Time</option>
                    <option value="3.30PM">3.30PM</option>
                    <option value="5.00PM">5.00PM</option>
                    <option value="7.00PM">7.00PM</option>
                    <option value="9AM - 12NN">9.00AM</option>
                    <option value="12NN - 3PM">12.00AM</option>
                    <option value="3PM - 6PM">6.00PM</option>
                  </select>
                </div>
                {formik.touched.preferredTimeSlot &&
                  formik.errors.preferredTimeSlot && (
                    <div className="error text-danger">
                      <small>{formik.errors.preferredTimeSlot}</small>
                    </div>
                  )}
              </div>

              <div className="col-md-6 mb-3">
                <label className="form-label">
                  Refer By<span className="text-danger">*</span>
                </label>
                <input
                  name="referBy"
                  type="text"
                  className={`form-control ${
                    formik.touched.referBy && formik.errors.referBy
                      ? "is-invalid"
                      : ""
                  }`}
                  {...formik.getFieldProps("referBy")}
                />
                {formik.touched.referBy && formik.errors.referBy && (
                  <div className="invalid-feedback">
                    {formik.errors.referBy}
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
                      formik.touched.marketingSource && formik.errors.marketingSource
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

              <div className="col-md-6 col-12">
                <div className="mb-3">
                  <div>
                    <label
                      for="exampleFormControlInput1"
                      className="form-label"
                    >
                      Address
                      <span className="text-danger">*</span>
                    </label>
                  </div>
                  <div className="">
                    <textarea
                      type="text"
                      name="address"
                      {...formik.getFieldProps("address")}
                      className={`form-control ${
                        formik.touched.address && formik.errors.address
                          ? "is-invalid"
                          : ""
                      }`}
                    />
                    {formik.touched.address && formik.errors.address && (
                      <div className="error text-danger ">
                        <small>{formik.errors.address}</small>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="col-md-6 mb-3">
                <label className="form-label">Postal Code</label><span className="text-danger">*</span>
                <input
                  name="postalCode"
                  type="text"
                  className={`form-control ${
                    formik.touched.postalCode && formik.errors.postalCode
                      ? "is-invalid"
                      : ""
                  }`}
                  {...formik.getFieldProps("postalCode")}
                />
                {formik.touched.postalCode && formik.errors.postalCode && (
                  <div className="invalid-feedback">
                    {formik.errors.postalCode}
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
                    </label>
                  </div>
                  <div className="">
                    <textarea
                      type="text"
                      name="remarks"
                      {...formik.getFieldProps("remarks")}
                      className={`form-control ${
                        formik.touched.remarks && formik.errors.remarks
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

              {/** Terms and Conditions */}
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
                    By submitting this form, I confirm that I agree on releasing
                    the above details.
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
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}

export default NewLeadsAdd;
