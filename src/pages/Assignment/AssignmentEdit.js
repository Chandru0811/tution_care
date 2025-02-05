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
  batchTime: Yup.array()
    .of(Yup.string().required("*Batch Time is required"))
    .min(1, "*At least one Batch Time is required"),
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
  const [selectedBatchTimes, setSelectedBatchTimes] = useState([]);

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
      studentIds: [],
      files: [] || null,
    },
    // validationSchema: validationSchema,
    onSubmit: async (values) => {
      setLoadIndicator(true);
      try {
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
        const formData = new FormData();
        formData.append("centerId", centerId);
        formData.append("userId", 12);
        formData.append("day", values.day);
        formData.append("classListing", selectedClassName);
        formData.append("course", selectedCourseName);
        formData.append("courseId", values.course);
        formData.append("classId", values.classListing);
        formData.append("folderCategory", folderCategory);
        formData.append("batchTime", values.batchTime);
        formData.append("date", values.date);
        formData.append("expiredDate", values.expiredDate);
        formData.append("createdBy", userName);

        if (folderCategory === "group") {
          formData.append("isGroupUpload", true);
        } else {
          formData.append("isGroupUpload", false);
          formData.append("studentIds", JSON.stringify(values.studentIds));
        }

        // Append files
        if (values.files && values.files.length > 0) {
          values.files.forEach((file, index) =>
            formData.append(`files[${index}]`, file)
          );
        }

        // Send the request
        const response = await api.post(
          "/createAssignmentWithSingleOrGroup",
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );

        // Handle the response
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
          toast.error("Error deleting data:", error.message);
        }
      } finally {
        setLoadIndicator(false);
      }
    },
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

  const handleCenterChange = () => {
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
          Assignment Edit
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
              <span class="me-2 text-muted">Edit Assignment</span>
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
                <span className="fw-medium">Update</span>
              </button>
            </div>
          </div>

          <div className="container">
            <div className="row py-4">
              {/* <div class="col-md-6 col-12 mb-4">
                   <lable class="">
                     Centre<span class="text-danger">*</span>
                   </lable>
                   <select
                     {...formik.getFieldProps("center")}
                     name="center"
                     className={`form-select  ${
                       formik.touched.center && formik.errors.center
                         ? "is-invalid"
                         : ""
                     }`}
                     aria-label="Default select example"
                     onChange={handleCenterChange}
                   >
                     <option disabled></option>
                     {centerData &&
                       centerData.map((center) => (
                         <option key={center.id} value={center.id}>
                           {center.centerNames}
                         </option>
                       ))}
                   </select>
                   {formik.touched.center && formik.errors.center && (
                     <div className="invalid-feedback">{formik.errors.center}</div>
                   )}
                 </div> */}

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
              <div class="col-md-6 col-12 mb-3">
                {folderCategory === "group" ? (
                  <></>
                ) : (
                  <div className="">
                    <label className="form-label">Student Name</label>
                    <MultiSelect
                      options={studentData || []}
                      value={selectedStudents}
                      onChange={(selected) => {
                        setSelectedStudents(selected);
                        formik.setFieldValue(
                          "studentIds",
                          selected.map((option) => option.value) // Ensures studentIds is an array
                        );
                      }}
                      labelledBy="Select Student"
                      className={`form-multi-select ${
                        formik.touched.studentIds && formik.errors.studentIds
                          ? "is-invalid"
                          : ""
                      }`}
                    />
                    {formik.touched.studentIds && formik.errors.studentIds && (
                      <div className="invalid-feedback">
                        {formik.errors.studentIds}
                      </div>
                    )}
                  </div>
                )}
              </div>
              <div className="col-md-6 col-12 mb-4">
                <label className="">
                  Batch Time<span className="text-danger">*</span>
                </label>
                <MultiSelect
                  options={
                    batchData
                      ? batchData.map((time) => ({
                          label: normalizeTime(time),
                          value:
                            time.includes("AM") || time.includes("PM")
                              ? convertTo24Hour(time)
                              : time,
                        }))
                      : []
                  }
                  value={selectedBatchTimes}
                  onChange={(selected) => {
                    setSelectedBatchTimes(selected);
                    formik.setFieldValue(
                      "batchTime",
                      selected.map((option) => option.value)
                    );
                  }}
                  labelledBy="Select Batch Time"
                  className={`form-multi-select ${
                    formik.touched.batchTime && formik.errors.batchTime
                      ? "is-invalid"
                      : ""
                  }`}
                />
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
                {formik.touched.expiredDate && formik.errors.expiredDate && (
                  <div className="invalid-feedback">
                    {formik.errors.expiredDate}
                  </div>
                )}
              </div>

              {/* <div className="col-md-6 col-12 mb-2">
                   <div className="row">
                     <label>
                       Files<span className="text-danger">*</span>
                     </label>
                     <div className="input-group">
                       <input
                         className="form-control"
                         type="file"
                         multiple
                         accept="image/jpeg, image/png, application/pdf, application/msword, application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                         onChange={(event) => {
                           const files = Array.from(event.target.files);
                           formik.setFieldValue("files", files); // Update Formik field
                         }}
                       />
                     </div>
                     {formik.touched.files && formik.errors.files && (
                       <small className="text-danger">{formik.errors.files}</small>
                     )}
                     <label className="text-muted">
                       Note: Only JPG, PNG, PDF, DOC, or DOCX files are allowed.
                       Each file must be less than 5MB. Total size must be under
                       1GB, and file names must not exceed 50 characters.
                     </label>
                   </div>
                 </div> */}
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
                      accept="image/jpeg, image/png, application/pdf, application/msword, application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                      onChange={(event) => {
                        const files = Array.from(event.target.files);
                        let errors = [];

                        // Validate each file
                        files.forEach((file) => {
                          if (
                            ![
                              "image/jpeg",
                              "image/png",
                              "application/pdf",
                              "application/msword",
                              "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
                            ].includes(file.type)
                          ) {
                            errors.push(
                              `${file.name} is not an allowed file type.`
                            );
                          }

                          if (file.size > 5 * 1024 * 1024) {
                            errors.push(
                              `${file.name} exceeds the 5MB size limit.`
                            );
                          }

                          if (file.name.length > 50) {
                            errors.push(
                              `${file.name} has a name longer than 50 characters.`
                            );
                          }
                        });

                        // Check total size
                        const totalSize = files.reduce(
                          (total, file) => total + file.size,
                          0
                        );
                        if (totalSize > 1024 * 1024 * 1024) {
                          errors.push("Total file size exceeds 1GB.");
                        }

                        if (errors.length > 0) {
                          formik.setFieldError("files", errors.join(" "));
                        } else {
                          formik.setFieldValue("files", files); // Set files if valid
                          formik.setFieldError("files", null); // Clear errors
                        }
                      }}
                    />
                  </div>
                  {formik.errors.files && (
                    <small className="text-danger">{formik.errors.files}</small>
                  )}
                  <label className="text-muted">
                    Note: Only JPG, PNG, PDF, DOC, or DOCX files are allowed.
                    Each file must be less than 5MB. Total size must be under
                    1GB, and file names must not exceed 50 characters.
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}

export default AssignmentEdit;
