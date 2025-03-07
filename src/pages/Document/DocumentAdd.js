import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import api from "../../config/URL";
import { toast } from "react-toastify";
import fetchAllCoursesWithIdsC from "../List/CourseListByCenter";
import fetchAllClassesWithIdsC from "../List/ClassListByCourse";
import fetchAllTeacherListByCenter from "../List/TeacherListByCenter";
import fetchAllStudentListByCenter from "../List/StudentListByCenter";
const storedConfigure = JSON.parse(
  localStorage.getItem("tmsappConfigInfo") || "{}"
);
const validationSchema = Yup.object({
  course: Yup.string().required(
    `*${storedConfigure?.course || "Course"} is required`
  ),
  userId: Yup.string().required(
    `*${storedConfigure?.employee || "Teacher"} is required`
  ),
  day: Yup.string().required("*Days is required"),
  batchTime: Yup.string().required("*Batch Time is required"),
  classListing: Yup.string().required(
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
  const [batchData, setBatchData] = useState(null);
  const [dayData, setDayData] = useState(null);

  const formik = useFormik({
    initialValues: {
      center: centerId,
      course: "",
      userId: tmsuserId || "",
      classListing: "",
      date: "",
      day: "",
      expiredDate: "",
      folderCategoryListing: "group",
      batchTime: "",
      groupSelect: "",
      studentSelect: "",
      createdBy: userName,
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      setLoadIndicator(true);
      try {
        // Assuming formik is in scope
        let selectedOptionName = "";
        let selectedClassName = "";
        let selectedCourseName = "";

        classData.forEach((cls) => {
          if (parseInt(values.classListing) === cls.id) {
            selectedClassName = cls.classNames || "--";
          }
        });

        courseData.forEach((course) => {
          if (parseInt(values.course) === course.id) {
            selectedCourseName = course.courseNames || "--";
          }
        });

        let requestBody = {
          centerId: centerId,
          userId: tmsuserId || values.userId,
          day: values.day,
          center: selectedOptionName,
          classListing: selectedClassName,
          course: selectedCourseName,
          courseId: values.course,
          classId: values.classListing,
          folderCategory: folderCategory,
          batchTime: values.batchTime,
          date: values.date,
          expiredDate: values.expiredDate,
          createdBy: userName,
        };

        if (folderCategory === "group") {
          requestBody.isGroupUpload = true;
        } else {
          requestBody.isGroupUpload = false;
          requestBody.studentId = values.studentSelect;
        }

        const response = await api.post(
          "/uploadStudentFilesWithSingleOrGroup",
          requestBody
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
        console.log("setCourseData::", response.data);
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

  const fetchDayData = async () => {
    if (tmsuserId) {
      try {
        const response = await api.get(
          `getOptimizedWorkingDaysInfo?centerId=${centerId}&userId=${tmsuserId}`
        );
        const days = response.data.workingDays;
        setDayData(days || []);
      } catch (error) {
        toast.error(error.message);
      }
    }
  };

  const fetchBatchandTeacherData = async (day) => {
    try {
      const response = await api.get(
        `getTeacherWithBatchListByScheduleDay?centerId=${centerId}&day=${day}`
      );
      setBatchData(response.data.batchList);
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    if (formik.values.day) {
      fetchBatchandTeacherData(formik.values.day);
    }
  }, [formik.values.day]);

  useEffect(() => {
    fetchCourses();
    fetchStudent();
    if (!tmsuserId) {
      fetchTeacher();
    }
    fetchDayData();
  }, []);

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

  const handleCourseChange = (event) => {
    setClassData(null);
    const course = event.target.value;
    formik.setFieldValue("course", course);
    fetchClasses(course); // Fetch class for the selected center
  };

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
                  {...formik.getFieldProps("course")}
                  name="course"
                  className={`form-select    ${
                    formik.touched.course && formik.errors.course
                      ? "is-invalid"
                      : ""
                  }`}
                  aria-label="Default select example"
                  onChange={handleCourseChange}
                >
                  <option disabled></option>
                  {courseData &&
                    courseData.map((courses) => (
                      <option key={courses.id} value={courses.id}>
                        {courses.courseNames}
                      </option>
                    ))}
                </select>
                {formik.touched.course && formik.errors.course && (
                  <div className="invalid-feedback">{formik.errors.course}</div>
                )}
              </div>

              <div class="col-md-6 col-12 mb-4 d-flex flex-column justify-content-end">
                <lable class="">
                  {storedConfigure?.confClass || "Class"} Listing
                  <span class="text-danger">*</span>
                </lable>
                <select
                  {...formik.getFieldProps("classListing")}
                  name="classListing"
                  className={`form-select    ${
                    formik.touched.classListing && formik.errors.classListing
                      ? "is-invalid"
                      : ""
                  }`}
                  aria-label="Default select example"
                >
                  <option disabled></option>
                  {classData &&
                    classData.map((classes) => (
                      <option key={classes.id} value={classes.id}>
                        {classes.classNames}
                      </option>
                    ))}
                </select>
                {formik.touched.classListing && formik.errors.classListing && (
                  <div className="invalid-feedback">
                    {formik.errors.classListing}
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
              <div className="col-md-6 col-12 mb-4">
                <label>
                  Days<span className="text-danger">*</span>
                </label>
                <select
                  {...formik.getFieldProps("day")}
                  className={`form-select ${
                    formik.touched.day && formik.errors.day ? "is-invalid" : ""
                  }`}
                  name="day"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.day}
                >
                  {tmsuserId ? (
                    dayData && dayData.length > 0 ? (
                      <>
                        <option selected></option>
                        {dayData.map((day, index) => (
                          <option key={index} value={day}>
                            {day.charAt(0).toUpperCase() +
                              day.slice(1).toLowerCase()}
                          </option>
                        ))}
                      </>
                    ) : (
                      <option value="">No Days available</option>
                    )
                  ) : (
                    <>
                      <option value="">Select a day</option>
                      <option value="MONDAY">Monday</option>
                      <option value="TUESDAY">Tuesday</option>
                      <option value="WEDNESDAY">Wednesday</option>
                      <option value="THURSDAY">Thursday</option>
                      <option value="FRIDAY">Friday</option>
                      <option value="SATURDAY">Saturday</option>
                      <option value="SUNDAY">Sunday</option>
                    </>
                  )}
                </select>

                {formik.touched.day && formik.errors.day && (
                  <div className="invalid-feedback">{formik.errors.day}</div>
                )}
              </div>

              <div className="col-md-6 col-12 mb-4">
                <label className="">
                  Batch Time<span className="text-danger">*</span>
                </label>
                <select
                  {...formik.getFieldProps("batchTime")}
                  className={`form-select ${
                    formik.touched.batchTime && formik.errors.batchTime
                      ? "is-invalid"
                      : ""
                  }`}
                >
                  <option></option>
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
                {formik.touched.batchTime && formik.errors.batchTime && (
                  <div className="invalid-feedback">
                    {formik.errors.batchTime}
                  </div>
                )}
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
              {/* Radio buttons for selecting folder category */}
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

              <div class="col-md-6 col-12 mb-3">
                {folderCategory === "group" ? (
                  <></>
                ) : (
                  <div className="">
                    <label className="form-label">
                      {storedConfigure?.student || "Student"} Name
                    </label>
                    <select
                      {...formik.getFieldProps("studentSelect")}
                      className={`form-select   ${
                        formik.touched.studentSelect &&
                        formik.errors.studentSelect
                          ? "is-invalid"
                          : ""
                      }`}
                    >
                      <option disabled></option>
                      {studentData &&
                        studentData.map((student) => (
                          <option key={student.id} value={student.id}>
                            {student.studentNames}
                          </option>
                        ))}
                    </select>
                    {formik.touched.studentSelect &&
                      formik.errors.studentSelect && (
                        <div className="invalid-feedback">
                          {formik.errors.studentSelect}
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
