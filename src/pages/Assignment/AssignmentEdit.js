import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import api from "../../config/URL";
import { toast } from "react-toastify";
import fetchAllCoursesWithIdsC from "../List/CourseListByCenter";
import fetchAllClassesWithIdsC from "../List/ClassListByCourse";
import fetchAllTeacherListByCenter from "../List/TeacherListByCenter";
import fetchAllStudentListByCenter from "../List/StudentListByCenter";
import fetchAllCentersWithIds from "../List/CenterList";
import { MultiSelect } from "react-multi-select-component";

const validationSchema = Yup.object({
  // center: Yup.string().required("*Centre is required"),
  course: Yup.string().required("*Course is required"),
  userId: Yup.string().required("*Teacher is required"),
  day: Yup.string().required("*Days is required"),
  batchTime: Yup.string().required("*Batch Time is required"),
  classListing: Yup.string().required("*Class Listing is required"),
  folderCategoryListing: Yup.string().required("*FolderCategory is required"),
  date: Yup.string().required("*Date is required"),
  studentId: Yup.array()
    .of(Yup.string())
    .when("folderCategoryListing", {
      is: "individual",
      then: Yup.array()
        .min(1, "*Select at least one student")
        .required("*Student selection is required"),
      otherwise: Yup.array().notRequired(),
    }),
  files: Yup.mixed().required("*Assignment file is required"),
});

function AssignmentEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [folderCategory, setFolderCategory] = useState("group");
  const [centerData, setCenterData] = useState(null);
  const [classData, setClassData] = useState(null);
  const [courseData, setCourseData] = useState(null);
  const [studentData, setStudentData] = useState([]);
  const [selectedStudents, setSelectedStudents] = useState([]);
  const studentDataOptions = Array.isArray(studentData)
    ? studentData.map((std) => ({
        label: std.studentNames,
        value: std.id,
      }))
    : []; // Fallback to an empty array if studentData is invalid
  const [userData, setUserData] = useState(null);
  const [loadIndicator, setLoadIndicator] = useState(false);
  const userName = localStorage.getItem("tmsuserName");
  const centerId = localStorage.getItem("tmscenterId");
  const [batchData, setBatchData] = useState(null);

  const formik = useFormik({
    initialValues: {
      center: centerId,
      course: "",
      userId: "",
      classListing: "",
      date: "",
      day: "",
      expiredDate: "",
      folderCategoryListing: "group",
      batchTime: "",
      groupSelect: "",
      studentSelect: "",
      createdBy: userName,
      files: null,
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      setLoadIndicator(true);
      try {
        // const selectedValue = formik.values.center; // Assuming formik is in scope
        let selectedOptionName = "";
        let selectedClassName = "";
        let selectedCourseName = "";

        // centerData.forEach((center) => {
        //   if (parseInt(selectedValue) === center.id) {
        //     selectedOptionName = center.centerNames || "--";
        //   }
        // });

        // Find selected class name
        classData.forEach((cls) => {
          if (parseInt(values.classListing) === cls.id) {
            selectedClassName = cls.classNames || "--";
          }
        });

        // Find selected course name
        courseData.forEach((course) => {
          if (parseInt(values.course) === course.id) {
            selectedCourseName = course.courseNames || "--";
          }
        });

        let requestBody = {
          centerId: centerId,
          userId: values.userId,
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
          files: null,
        };

        if (folderCategory === "group") {
          requestBody.isGroupUpload = true;
        } else {
          requestBody.isGroupUpload = false;
          requestBody.studentId = values.studentSelect || [];
        }
        // console.log(requestBody);

        const response = await api.put(
          `/updateAssignmentFolders/${id}`,
          requestBody
        );

        if (response.status === 201) {
          toast.success(response.data.message);
          navigate("/assignment");
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

  const fetchData = async () => {
    try {
      const centerData = await fetchAllCentersWithIds();

      setCenterData(centerData);
    } catch (error) {
      toast.error(error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const fetchCourses = async (centerId) => {
    try {
      const courses = await fetchAllCoursesWithIdsC(centerId);
      setCourseData(courses);
    } catch (error) {
      toast.error(error);
    }
  };

  const fetchTeacher = async (centerId) => {
    try {
      const teacher = await fetchAllTeacherListByCenter(centerId);
      setUserData(teacher);
    } catch (error) {
      toast.error(error);
    }
  };

  const fetchStudent = async (centerId) => {
    try {
      const teacher = await fetchAllStudentListByCenter(centerId);
      setStudentData(teacher);
    } catch (error) {
      toast.error(error);
    }
  };

  const fetchClasses = async (courseId) => {
    try {
      const classes = await fetchAllClassesWithIdsC(courseId);
      setClassData(classes);
    } catch (error) {
      toast.error(error);
    }
  };

  const handleCenterChange = (event) => {
    formik.setFieldValue("center", centerId);
    fetchCourses(centerId);
    fetchTeacher(centerId);
    fetchStudent(centerId); // Fetch courses for the selected center
  };

  const fetchBatchandTeacherData = async (day) => {
    try {
      const response = await api.get(`getTeacherWithBatchListByDay?day=${day}`);
      setBatchData(response.data.batchList);
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    if (formik.values.day) {
      fetchBatchandTeacherData(formik.values.day);
    }
    handleCenterChange();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formik.values.day]);

  useEffect(() => {
    handleCenterChange();
  }, []);

  const getData = async () => {
    try {
      const response = await api.get(`/getAssignmentFolderById/${id}`);
      console.log("first", response.data);
      formik.setValues(response.data);
    } catch (error) {
      console.error("Error fetching data ", error);
    }
  };

  useEffect(() => {
    getData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

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
          Assignment Management
          <span className="breadcrumb-separator"> &gt; </span>
        </li>
        <li>
          <Link to="/document" className="custom-breadcrumb">
            Assignment
          </Link>
          <span className="breadcrumb-separator"> &gt; </span>
        </li>
        <li className="breadcrumb-item active" aria-current="page">
          Assignment Add
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
              <span class="me-2 text-muted">Add Document</span>
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
              <div class="col-md-6 col-12 mb-4">
                <lable class="">
                  Course<span class="text-danger">*</span>
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
                  Class Listing<span class="text-danger">*</span>
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
              <div class="col-md-6 col-12 mb-4">
                <lable class="">
                  Teacher<span class="text-danger">*</span>
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
                  <div className="invalid-feedback">{formik.errors.userId}</div>
                )}
              </div>
              <div className="col-md-6 col-12 mb-4">
                <label className="">
                  Days<span className="text-danger">*</span>
                </label>
                <select
                  {...formik.getFieldProps("day")}
                  className={`form-select  ${
                    formik.touched.day && formik.errors.day ? "is-invalid" : ""
                  }`}
                  name="day"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.day}
                >
                  <option></option>
                  <option value="MONDAY">Monday</option>
                  <option value="TUESDAY">Tuesday</option>
                  <option value="WEDNESDAY">Wednesday</option>
                  <option value="THURSDAY">Thursday</option>
                  <option value="FRIDAY">Friday</option>
                  <option value="SATURDAY">Saturday</option>
                  <option value="SUNDAY">Sunday</option>
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
                  <option value="">Select Batch Time</option>
                  {batchData?.map((time, index) => {
                    const displayTime = normalizeTime(time);
                    const valueTime =
                      time.includes("AM") || time.includes("PM")
                        ? convertTo24Hour(time)
                        : time;

                    return (
                      <option key={index} value={valueTime}>
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
              {/* Folder Category Selection */}
              <div className="col-md-6 col-12 mb-4">
                <label className="form-label">
                  Folder Category<span className="text-danger">*</span>
                </label>
                <div className="d-flex">
                  <div>
                    <input
                      className="form-check-input"
                      type="radio"
                      id="group"
                      name="folderCategoryListing"
                      value="group"
                      checked={folderCategory === "group"}
                      onChange={() => {
                        setFolderCategory("group");
                        formik.setFieldValue("folderCategoryListing", "group");
                        formik.setFieldValue("studentId", []); // Clear student selection
                        setSelectedStudents([]);
                      }}
                    />{" "}
                    <label htmlFor="group">Group</label>
                  </div>
                  &nbsp;&nbsp;&nbsp;
                  <div>
                    <input
                      className="form-check-input"
                      type="radio"
                      id="individual"
                      name="folderCategoryListing"
                      value="individual"
                      checked={folderCategory === "individual"}
                      onChange={() => {
                        setFolderCategory("individual");
                        formik.setFieldValue(
                          "folderCategoryListing",
                          "individual"
                        );
                      }}
                    />
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
              {/* Conditional Student Selection */}
              {folderCategory === "individual" && (
                <div className="col-md-6 col-12 mb-4">
                  <label className="form-label">
                    Student<span className="text-danger">*</span>
                  </label>
                  <MultiSelect
                    options={studentDataOptions}
                    value={selectedStudents}
                    onChange={(selected) => {
                      setSelectedStudents(selected);
                      formik.setFieldValue(
                        "studentId",
                        selected.map((option) => option.value)
                      );
                    }}
                    labelledBy="Select Students"
                    className={
                      formik.touched.studentId && formik.errors.studentId
                        ? "is-invalid"
                        : ""
                    }
                  />
                  {formik.touched.studentId && formik.errors.studentId && (
                    <div className="invalid-feedback">
                      {formik.errors.studentId}
                    </div>
                  )}
                </div>
              )}
              <div className="col-md-6 col-12 mb-2">
                <div className="row">
                  <label className="form-label">
                    Assignment<span className="text-danger">*</span>
                  </label>
                  <div className="input-group">
                    <input
                      className="form-control"
                      type="file"
                      multiple
                      accept=".jpeg, .png, .jpg, .pdf, .doc, .docx"
                      onChange={(event) => {
                        formik.setFieldValue("files", event.target.files[0]);
                      }}
                    />
                  </div>
                  {formik.touched.files && formik.errors.files && (
                    <small className="text-danger">{formik.errors.files}</small>
                  )}
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
                <label className="form-label">Expired Date</label>
                <input
                  name="expiredDate"
                  type="date"
                  className={`form-control  ${
                    formik.touched.expiredDate && formik.errors.expiredDate
                      ? "is-invalid"
                      : ""
                  }`}
                  {...formik.getFieldProps("expiredDate")}
                />
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}

export default AssignmentEdit;
