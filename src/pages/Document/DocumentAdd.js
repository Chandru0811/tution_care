import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import api from "../../config/URL";
import { toast } from "react-toastify";
import fetchAllCoursesWithIdsC from "../List/CourseListByCenter";
import fetchAllClassesWithIdsC from "../List/ClassListByCourse";
let storedConfigure = {};

try {
  const rawConfig = localStorage.getItem("tmsappConfigInfo");

  // Ensure rawConfig is a valid string before parsing
  storedConfigure = rawConfig ? JSON.parse(rawConfig) : {};
} catch (error) {
  console.error("Error parsing tmsappConfigInfo:", error);

  // Clear the corrupted data from localStorage
  localStorage.removeItem("tmsappConfigInfo");

  // Use a default empty object
  storedConfigure = {};
}

const validationSchema = Yup.object({
  courseId: Yup.string().required(
    `*${storedConfigure?.course || "Course"} is required`
  ),
  userId: Yup.string().required(
    `*${storedConfigure?.employee || "Teacher"} is required`
  ),
  classId: Yup.string().required(
    `*${storedConfigure?.confClass || "Class"} Listing is required`
  ),
  folderCategoryListing: Yup.string().required("*FolderCategory is required"),
  date: Yup.string().required("*Date is required"),
  expiredDate: Yup.string().required("*Expired Date is required"),
});

function DocumentAdd() {
  const navigate = useNavigate();
  const centerId = localStorage.getItem("tmscenterId");
  const tmsuserId = localStorage.getItem("tmsuserId");
  const [folderCategory, setFolderCategory] = useState("group");
  const [classData, setClassData] = useState(null);
  const [courseData, setCourseData] = useState(null);
  const [studentData, setStudentData] = useState(false);
  const [userData, setUserData] = useState(null);
  const [loadIndicator, setLoadIndicator] = useState(false);
  const userName = localStorage.getItem("tmsuserName");

  const formik = useFormik({
    initialValues: {
      centerId: centerId,
      courseId: "",
      classId: "",
      userId: tmsuserId || "",
      studentId: "",
      date: "",
      isGroupUpload: true,
      expiredDate: "",
      folderCategoryListing: "group",
      createdBy: userName,
      files: [],
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      setLoadIndicator(true);
      try {
        const formData = new FormData();
        if (folderCategory === "group") {
          values.isGroupUpload = true;
        } else {
          values.isGroupUpload = false;
          values.studentId = values.studentId;
        }
        formData.append("centerId", centerId || "");
        formData.append("courseId", values.courseId || "");
        formData.append("classId", values.classId || "");
        formData.append("studentId", values.studentId || "");
        formData.append("userId", tmsuserId || values.userId || "");
        formData.append("folderCategory", folderCategory || "");
        formData.append("date", values.date || "");
        formData.append("expiredDate", values.expiredDate || "");
        values.files.forEach((file) => {
          formData.append("files", file || []);
        });
        formData.append("createdBy", userName || "");

        const response = await api.post(
          "/uploadStudentFilesWithSingleOrGroup",
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );

        if (response.status === 201) {
          toast.success(response.data.message);
          navigate("/document");
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
          toast.error("Error deleting data:", error);
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

  const fetchCourses = async () => {
    try {
      if (!tmsuserId) {
        const courses = await fetchAllCoursesWithIdsC(centerId);
        setCourseData(courses);
      } else {
        const response = await api.get(
          `getOptimizedCourseInfo?centerId=${centerId}&userId=${tmsuserId}`
        );
        setCourseData(response.data);
      }
    } catch (error) {
      toast.error(error);
    }
  };

  const fetchClasses = async (courseId) => {
    try {
      if (!tmsuserId) {
        const classes = await fetchAllClassesWithIdsC(courseId);
        setClassData(classes);
      } else {
        const response = await api.get(
          `getOptimizedClassInfo?centerId=${centerId}&userId=${tmsuserId}&courseId=${courseId}`
        );
        setClassData(response.data);
      }
    } catch (error) {
      toast.error(error);
    }
  };

  const fetchTeacher = async () => {
    try {
      const response = await api.get(
        `/getTeacherListByCenterScheduleId/${centerId}`
      );
      setUserData(response.data);
    } catch (error) {
      toast.error(error);
    }
  };

  const fetchStudent = async () => {
    try {
      const response = await api.get(
        `/getIdsAndStudentNamesByScheduleCenterId/${centerId}`
      );
      setStudentData(response.data);
    } catch (error) {
      toast.error(error);
    }
  };

  useEffect(() => {
    if (formik.values.date) {
      const calculatedExpiredDate = calculateExpiryDate(formik.values.date);
      formik.setFieldValue("expiredDate", calculatedExpiredDate);
    }
  }, [formik.values.date]);

  const calculateExpiryDate = (date) => {
    if (!date) return "";

    const selectedDate = new Date(date);
    if (isNaN(selectedDate.getTime())) return "";

    const expiryDate = new Date(
      selectedDate.getTime() + 30 * 24 * 60 * 60 * 1000
    );

    const year = expiryDate.getFullYear();
    const month = String(expiryDate.getMonth() + 1).padStart(2, "0");
    const day = String(expiryDate.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const handleCourseChange = (event) => {
    setClassData(null);
    const course = event.target.value;
    formik.setFieldValue("courseId", course);
    fetchClasses(course); // Fetch class for the selected center
  };

  useEffect(() => {
    fetchCourses();
    fetchStudent();
    if (!tmsuserId) {
      fetchTeacher();
    }
  }, []);

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
          {storedConfigure?.documentManagement || "Document Management"}
          <span className="breadcrumb-separator"> &gt; </span>
        </li>
        <li>
          <Link to="/document" className="custom-breadcrumb">
            {storedConfigure?.documentManagement || "Document"}
          </Link>
          <span className="breadcrumb-separator"> &gt; </span>
        </li>
        <li className="breadcrumb-item active" aria-current="page">
          {storedConfigure?.documentManagement || "Document"} Add
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
            <div class="d-flex align-items-center">
              <div class="d-flex">
                <div class="dot active"></div>
              </div>
              <span class="me-2 text-muted">
                Add {storedConfigure?.documentManagement || "Document"}
              </span>
            </div>
            <div className="my-2 pe-3 d-flex align-items-center">
              <Link to="/document">
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
              <div class="col-md-6 col-12 mb-4">
                <lable class="">
                  {storedConfigure?.course || "Course"}
                  <span class="text-danger">*</span>
                </lable>
                <select
                  {...formik.getFieldProps("courseId")}
                  name="courseId"
                  className={`form-select    ${
                    formik.touched.courseId && formik.errors.courseId
                      ? "is-invalid"
                      : ""
                  }`}
                  aria-label="Default select example"
                  onChange={handleCourseChange}
                >
                  <option selected></option>
                  {courseData &&
                    courseData.map((courses) => (
                      <option key={courses.id} value={courses.id}>
                        {courses.courseNames}
                      </option>
                    ))}
                </select>
                {formik.touched.courseId && formik.errors.courseId && (
                  <div className="invalid-feedback">
                    {formik.errors.courseId}
                  </div>
                )}
              </div>
              <div class="col-md-6 col-12 mb-4 d-flex flex-column justify-content-end">
                <lable class="">
                  {storedConfigure?.confClass || "Class"} Listing
                  <span class="text-danger">*</span>
                </lable>
                <select
                  {...formik.getFieldProps("classId")}
                  name="classId"
                  className={`form-select    ${
                    formik.touched.classId && formik.errors.classId
                      ? "is-invalid"
                      : ""
                  }`}
                >
                  <option selected></option>
                  {classData &&
                    classData.map((classes) => (
                      <option key={classes.id} value={classes.id}>
                        {classes.classNames}
                      </option>
                    ))}
                </select>
                {formik.touched.classId && formik.errors.classId && (
                  <div className="invalid-feedback">
                    {formik.errors.classId}
                  </div>
                )}
              </div>
              {tmsuserId === null ? (
                <div class="col-md-6 col-12 mb-4">
                  <lable class="">
                    {storedConfigure?.employee || "Teacher"}
                    <span class="text-danger">*</span>
                  </lable>
                  <select
                    {...formik.getFieldProps("userId")}
                    name="userId"
                    className={`form-select  ${
                      formik.touched.userId && formik.errors.userId
                        ? "is-invalid"
                        : ""
                    }`}
                    aria-label="Default select example"
                  >
                    <option disabled></option>
                    {userData &&
                      userData.map((userId) => (
                        <option key={userId.id} value={userId.id}>
                          {userId.teacherNames}
                        </option>
                      ))}
                  </select>
                  {formik.touched.userId && formik.errors.userId && (
                    <div className="invalid-feedback">
                      {formik.errors.userId}
                    </div>
                  )}
                </div>
              ) : (
                <></>
              )}
              <div className="col-md-6 col-12 mb-2">
                <div className="row">
                  <label>
                    Files<span className="text-danger">*</span>
                  </label>
                  <div className="input-group">
                    <input
                      className="form-control"
                      type="file"
                      multiple
                      accept="image/jpeg, image/png, video/mp4"
                      onChange={(event) => {
                        const files = Array.from(event.target.files);
                        formik.setFieldValue("files", files);
                      }}
                    />
                  </div>
                  {formik.touched.files && formik.errors.files && (
                    <small className="text-danger">{formik.errors.files}</small>
                  )}
                  <label className="text-muted">
                    Note: Files must be JPG, PNG, or MP4, and the total size
                    must be below 1GB. Each file name should not exceed 50
                    characters.
                  </label>
                </div>
              </div>

              <div className="col-md-6 col-12 mb-4">
                <label className="form-label">
                  Date<span className="text-danger">*</span>
                </label>
                <div className="input-group mb-3">
                  <input
                    name="date"
                    type="date"
                    className={`form-control  ${
                      formik.touched.date && formik.errors.date
                        ? "is-invalid"
                        : ""
                    }`}
                    {...formik.getFieldProps("date")}
                  />
                  {formik.touched.date && formik.errors.date && (
                    <div className="invalid-feedback">{formik.errors.date}</div>
                  )}
                </div>
              </div>

              <div className="col-md-6 col-12 mb-4">
                <label className="form-label">
                  Expired Date<span className="text-danger">*</span>
                </label>
                <input
                  name="expiredDate"
                  type="date"
                  className={`form-control  ${
                    formik.touched.expiredDate && formik.errors.expiredDate
                      ? "is-invalid"
                      : ""
                  }`}
                  {...formik.getFieldProps("expiredDate")}
                  value={calculateExpiryDate(formik.values.date)}
                />
                {formik.touched.expiredDate && formik.errors.expiredDate && (
                  <div className="invalid-feedback">
                    {formik.errors.expiredDate}
                  </div>
                )}
              </div>
              <div className="col-md-6 col-12 mb-4">
                <label className="form-label">
                  Folder Category<span className="text-danger">*</span>
                </label>
                <div className="d-flex">
                  <div>
                    <input
                      className="form-check-input "
                      type="radio"
                      id="group"
                      name="folderCategoryListing"
                      value="group"
                      checked={folderCategory === "group"}
                      onChange={() => setFolderCategory("group")}
                    />{" "}
                    &nbsp;
                    <label htmlFor="group">Group</label>
                  </div>
                  &nbsp;&nbsp;&nbsp;
                  <div>
                    <input
                      className="form-check-input "
                      type="radio"
                      id="individual"
                      name="folderCategoryListing"
                      value="individual"
                      checked={folderCategory === "individual"}
                      onChange={() => setFolderCategory("individual")}
                    />
                    &nbsp;
                    <label htmlFor="individual">Individual</label>
                  </div>
                </div>
                {formik.touched.folderCategoryListing &&
                  formik.errors.folderCategoryListing && (
                    <div className="invalid-feedback">
                      {formik.errors.folderCategoryListing}
                    </div>
                  )}
              </div>
              <div class="col-md-6 col-12 mb-3">
                {folderCategory === "group" ? (
                  <></>
                ) : (
                  <div className="">
                    <label className="form-label">
                      {storedConfigure?.student || "Student"} Name
                    </label>
                    <select
                      {...formik.getFieldProps("studentId")}
                      className={`form-select   ${
                        formik.touched.studentId && formik.errors.studentId
                          ? "is-invalid"
                          : ""
                      }`}
                    >
                      <option selected></option>
                      {studentData &&
                        studentData.map((student) => (
                          <option key={student.id} value={student.id}>
                            {student.studentNames}
                          </option>
                        ))}
                    </select>
                    {formik.touched.studentId && formik.errors.studentId && (
                      <div className="invalid-feedback">
                        {formik.errors.studentId}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}

export default DocumentAdd;
