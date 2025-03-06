import React, { useCallback, useEffect, useState } from "react";
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
  subjectId: Yup.string().required("Subject is required"),
  gender: Yup.string().required("Gender is required"),
  dob: Yup.date().required("Date of Birth is required"),
  referredBy: Yup.string().nullable(),
  // parentName: Yup.string().required("Parent name is required"),
  // parentEmail: Yup.string().email("Invalid email format"),
  // address: Yup.string().required("Address is required"),
  postalCode: Yup.string()
    .matches(/^\d{6}$/, "Postal code must be 6 digits")
    .required("Postal code is required"),
  termsAndCondition: Yup.boolean()
    .oneOf([true], "Please accept the terms and conditions")
    .required("Terms and conditions must be accepted"),
});

function NewLeadsEdit() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [loadIndicator, setLoadIndicator] = useState(false);
  const userName = localStorage.getItem("tmsemail");
  const centerId = localStorage.getItem("tmscenterId");
  const [subjectData, setSubjectData] = useState([]);
  const [studentData, setStudentData] = useState([]);
  const storedConfigure = JSON.parse(
    localStorage.getItem("tmsappConfigInfo") || "{}"
  );
  const [batchData, setBatchData] = useState(null);

  const formik = useFormik({
    initialValues: {
      centerId: centerId,
      name: "",
      leadStatus: "NEW_WAITLIST" || "",
      email: "",
      phone: "",
      subjectId: "",
      studentId: "",
      gender: "",
      dob: "",
      referredBy: "",
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
      setLoadIndicator(true);
      try {
        const response = await api.put(`/updateLeadDynamicForm/${id}`, values, {
          headers: {
            "Content-Type": "application/json",
          },
        });
        if (response.status === 200) {
          toast.success(response.data.message);
          navigate("/lead/lead");
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
  const fetchStudent = async () => {
    try {
      const response = await api.get(
        `getIdsAndStudentNamesByCenterId/${centerId}`
      );
      setStudentData(response.data);
    } catch (error) {
      toast.error(error);
    }
  };

  const getData = useCallback(async () => {
    setLoadIndicator(true);
    try {
      const response = await api.get(`/getLeadDynamicFormById/${id}`);
      formik.setValues(response.data);
      console.log("getLeadDynamicFormById ::", response.data);
    } catch (error) {
      console.error("Error fetching data ", error);
    } finally {
      setLoadIndicator(false);
    }
  }, [id]);
  console.log("Loaded", formik.values.termsAndCondition);
  useEffect(() => {
    getData();
  }, [getData]);

  useEffect(() => {
    fetchSubject();
    fetchStudent();
  }, []);

  const fetchBatchandTeacherData = async (preferredDay) => {
    try {
      const response = await api.get(
        `getTeacherWithBatchListByDay?centerId=${centerId}&day=${preferredDay}`
      );
      setBatchData(response.data.batchList);
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    if (formik.values.preferredDay) {
      fetchBatchandTeacherData(formik.values.preferredDay);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formik.values.preferredDay]);

  const formatTo12Hour = (time) => {
    const [hours, minutes] = time.split(":");
    let period = "AM";
    let hour = parseInt(hours, 10);

    if (hour === 0) {
      hour = 12;
    } else if (hour >= 12) {
      period = "PM";
      if (hour > 12) hour -= 12;
    }

    return `${hour}:${minutes} ${period}`;
  };

  const normalizeTime = (time) => {
    if (time.includes("AM") || time.includes("PM")) {
      return time;
    }

    return formatTo12Hour(time);
  };

  const convertTo24Hour = (time) => {
    const [timePart, modifier] = time.split(" ");
    let [hours, minutes] = timePart.split(":").map(Number);

    if (modifier === "PM" && hours < 12) {
      hours += 12;
    } else if (modifier === "AM" && hours === 12) {
      hours = 0;
    }

    return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(
      2,
      "0"
    )}`;
  };

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
          {storedConfigure?.lead || "Lead"} Edit
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
                Edit {storedConfigure?.lead || "Lead"}
              </span>
            </div>
            <div className="my-2 pe-3 d-flex align-items-center">
              <Link to="/lead/lead">
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
                  <div className="invalid-feedback">{formik.errors.name}</div>
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
                  <div className="invalid-feedback">{formik.errors.email}</div>
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
                {formik.touched.phone && formik.errors.phone && (
                  <div className="invalid-feedback">{formik.errors.phone}</div>
                )}
              </div>

              <div className="col-md-6 col-12 mb-2">
                <label className="form-label">Subject</label>
                <span className="text-danger">*</span>
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
                <label className="form-label">Parent Name</label>
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
                <label className="form-label">Parent Email</label>
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

              <div className="col-md-6 col-12 mb-4">
                <label className="form-label">Preferred Time Slot</label>
                <select
                  {...formik.getFieldProps("preferredTimeSlot")}
                  className={`form-select ${
                    formik.touched.preferredTimeSlot &&
                    formik.errors.preferredTimeSlot
                      ? "is-invalid"
                      : ""
                  }`}
                >
                  <option value="" disabled>
                    Select a Time
                  </option>
                  {batchData &&
                    batchData.map((time) => {
                      const displayTime = normalizeTime(time);
                      const valueTime =
                        time.includes("AM") || time.includes("PM")
                          ? convertTo24Hour(time)
                          : time;

                      return (
                        <option key={time} value={valueTime}>
                          {displayTime}
                        </option>
                      );
                    })}
                </select>
                {formik.touched.preferredTimeSlot &&
                  formik.errors.preferredTimeSlot && (
                    <div className="invalid-feedback">
                      {formik.errors.preferredTimeSlot}
                    </div>
                  )}
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
                  readOnly
                />
                {formik.touched.referredBy && formik.errors.referredBy && (
                  <div className="invalid-feedback">
                    {formik.errors.referredBy}
                  </div>
                )}
              </div>

              <div className="col-md-6 col-12 mb-2">
                <label className="form-label">Refer By Student Confirm</label>
                <select
                  className={`form-select  ${
                    formik.touched.studentId && formik.errors.studentId
                      ? "is-invalid"
                      : ""
                  }`}
                  {...formik.getFieldProps("studentId")}
                >
                  <option selected></option>
                  {studentData &&
                    studentData.map((studentId) => (
                      <option key={studentId.studentId} value={studentId.id}>
                        {studentId.studentNames}
                      </option>
                    ))}
                </select>
                {formik.touched.studentId && formik.errors.studentId && (
                  <div className="invalid-feedback">
                    {formik.errors.studentId}
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
              <div className="col-md-6 mb-3">
                <label className="form-label">Postal Code</label>
                <span className="text-danger">*</span>
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

              <div className="col-md-6 col-12">
                <div className="mb-3">
                  <div>
                    <label
                      for="exampleFormControlInput1"
                      className="form-label"
                    >
                      Address
                      {/* <span className="text-danger">*</span> */}
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

              <div className="col-md-6 col-12">
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
                    checked={formik.values.termsAndCondition}
                    className={`form-check-input ${
                      formik.touched.termsAndCondition &&
                      formik.errors.termsAndCondition
                        ? "is-invalid"
                        : ""
                    }`}
                    {...formik.getFieldProps("termsAndCondition")}
                  />
                  <label className="form-check-label">
                    I agree of the terms and Condition.
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

export default NewLeadsEdit;
