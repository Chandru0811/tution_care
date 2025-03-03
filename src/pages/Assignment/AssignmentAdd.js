import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import api from "../../config/URL";
import { toast } from "react-toastify";
import fetchAllCoursesWithIdsC from "../List/CourseListByCenter";
import fetchAllClassesWithIdsC from "../List/ClassListByCourse";
import fetchAllStudentListByCenter from "../List/StudentListByCenter";
import { MultiSelect } from "react-multi-select-component";
import { MdOutlineCancel } from "react-icons/md";

function AssignmentAdd() {
  const navigate = useNavigate();
  const [folderCategory, setFolderCategory] = useState("group");
  const [classData, setClassData] = useState(null);
  const [courseData, setCourseData] = useState(null);
  const [studentData, setStudentData] = useState(false);
  const [loadIndicator, setLoadIndicator] = useState(false);
  const userName = localStorage.getItem("tmsuserName");
  const centerId = localStorage.getItem("tmscenterId");
  const [batchData, setBatchData] = useState(null);
  const [selectedStudents, setSelectedStudents] = useState([]);
  const [selectedBatchTimes, setSelectedBatchTimes] = useState([]);
  const [teacherData, setTeacherData] = useState(null);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const storedConfigure = JSON.parse(
    localStorage.getItem("tmsappConfigInfo") || "{}"
  );

  const validationSchema = Yup.object({
    assignmentName: Yup.string().required(
      `* ${storedConfigure?.assignManagement || "Assignment"} Name is required`
    ),
    course: Yup.string().required(
      `* ${storedConfigure?.course || "Course"} is required`
    ),
    userId: Yup.string().required("*Teacher is required"),
    day: Yup.string().required("*Days is required"),
    batchTime: Yup.array()
      .of(Yup.string().required("*Batch Time is required"))
      .min(1, "*At least one Batch Time is required"),
    classListing: Yup.string().required(
      `* ${storedConfigure?.confClass || "Class"} Listing is required`
    ),
    folderCategory: Yup.string().required("*FolderCategory is required"),
    date: Yup.string().required("*Date is required"),
    files: Yup.array()
      .min(1, "*At least one file must be uploaded")
      .test(
        "fileType",
        "Only JPG, PNG, PDF, DOC, and DOCX files are allowed",
        (files) =>
          files &&
          files.every((file) =>
            [
              "image/jpeg",
              "image/png",
              "application/pdf",
              "application/msword",
              "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
            ].includes(file.type)
          )
      )
      .test(
        "fileSize",
        "Each file must be less than 5MB",
        (files) => files && files.every((file) => file.size <= 5 * 1024 * 1024)
      )
      .test(
        "totalFileSize",
        "Total upload size must not exceed 1GB",
        (files) =>
          files &&
          files.reduce((total, file) => total + file.size, 0) <=
            1024 * 1024 * 1024
      )
      .test(
        "fileNameLength",
        "File names must not exceed 50 characters",
        (files) => files && files.every((file) => file.name.length <= 50)
      ),
  });

  const formik = useFormik({
    initialValues: {
      center: centerId,
      assignmentName: "",
      course: "",
      userId: "",
      classListing: "",
      date: "",
      day: "",
      expiredDate: "",
      folderCategory: "group",
      batchTime: "",
      groupSelect: "",
      studentSelect: "",
      createdBy: userName,
      studentIds: [],
      assignmentReason: "",
      files: [] || null,
    },
    validationSchema: validationSchema,
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
        formData.append("userId", values.userId);
        formData.append("assignmentName", values.assignmentName);
        formData.append("assignmentReason", values.assignmentReason);
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
          formData.append("studentIds", values.studentIds.join(",")); // Convert array to comma-separated string
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

  const fetchCourses = async () => {
    try {
      const courses = await fetchAllCoursesWithIdsC(centerId);
      setCourseData(courses);
    } catch (error) {
      toast.error(error);
    }
  };

  const fetchStudent = async () => {
    try {
      const response = await api.get(
        `/getIdsAndStudentNamesByScheduleCenterId/${centerId}`
      ); // API call to fetch students
      if (Array.isArray(response.data)) {
        // Ensure the response is an array
        const mappedStudents = response.data?.map((student) => ({
          label: student.studentNames, // Display value in MultiSelect
          value: student.id, // Underlying value
        }));
        setStudentData(mappedStudents);
      } else {
        throw new Error("Invalid student data format");
      }
    } catch (error) {
      toast.error("Failed to fetch student data: " + error.message);
      setStudentData([]); // Clear data if error occurs
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

  const handleFileChange = (event) => {
    const newFiles = Array.from(event.target.files);
    let errors = [];

    // Validate each file
    newFiles.forEach((file) => {
      if (
        ![
          "image/jpeg",
          "image/png",
          "application/pdf",
          "application/msword",
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        ].includes(file.type)
      ) {
        errors.push(`${file.name} is not an allowed file type.`);
      }

      if (file.size > 5 * 1024 * 1024) {
        errors.push(`${file.name} exceeds the 5MB size limit.`);
      }

      if (file.name.length > 50) {
        errors.push(`${file.name} has a name longer than 50 characters.`);
      }
    });

    // Check total file size (including new files)
    const totalSize = [...uploadedFiles, ...newFiles].reduce(
      (total, file) => total + file.size,
      0
    );
    if (totalSize > 1024 * 1024 * 1024) {
      errors.push("Total file size exceeds 1GB.");
    }

    if (errors.length > 0) {
      // Show all errors at once
      alert(errors.join("\n"));
    } else {
      const updatedFiles = [...uploadedFiles, ...newFiles];
      setUploadedFiles(updatedFiles); // Update the uploaded files state
      formik.setFieldValue("files", updatedFiles);
    }
  };

  // Handle file removal
  const handleFileRemove = (index) => {
    const filteredFiles = uploadedFiles.filter((_, i) => i !== index); // Remove the file at the given index
    setUploadedFiles(filteredFiles); // Update the uploaded files state after removal

    // If there are no more files, reset the file input (simulate clearing the input field)
    if (filteredFiles.length === 0) {
      const fileInput = document.querySelector('input[type="file"]');
      if (fileInput) {
        fileInput.value = ""; // Clear the input field programmatically
      }
    }
  };
  const fetchBatchandTeacherData = async (day) => {
    try {
      const response = await api.get(
        `getTeacherWithBatchListByScheduleDay?day=${day}&centerId=${centerId}`
      );
      setTeacherData(response.data.teacherList);
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
    fetchCourses(centerId);
    // fetchTeacher(centerId);
    fetchStudent(centerId);
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
          {storedConfigure?.assignManagement || "Assignment Management"}
          <span className="breadcrumb-separator"> &gt; </span>
        </li>
        <li>
          <Link to="/assignment" className="custom-breadcrumb">
            {storedConfigure?.assignManagement || "Assignment"}
          </Link>
          <span className="breadcrumb-separator"> &gt; </span>
        </li>
        <li className="breadcrumb-item active" aria-current="page">
          {storedConfigure?.assignManagement || "Assignment"} Add
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
                Add {storedConfigure?.assignManagement || "Assignment"}
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
              <div className="col-md-6 col-12 mb-4">
                <label className="form-label">
                  {storedConfigure?.assignManagement || "Assignment"} Name
                  <span className="text-danger">*</span>
                </label>
                <div className="input-group mb-3">
                  <input
                    name="text"
                    type="assignmentName"
                    className={`form-control  ${
                      formik.touched.assignmentName &&
                      formik.errors.assignmentName
                        ? "is-invalid"
                        : ""
                    }`}
                    {...formik.getFieldProps("assignmentName")}
                  />
                  {formik.touched.assignmentName &&
                    formik.errors.assignmentName && (
                      <div className="invalid-feedback">
                        {formik.errors.assignmentName}
                      </div>
                    )}
                </div>
              </div>
              <div className="col-md-6 col-12 mb-4">
                <label className="form-label">
                  {storedConfigure?.course || "Course"}
                  <span className="text-danger">*</span>
                </label>
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
              <div className="col-md-6 col-12 mb-4">
                <label className="form-label">
                  {storedConfigure?.confClass || "Class"} Listing
                  <span className="text-danger">*</span>
                </label>
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
              <div className="col-md-6 col-12 mb-4">
                <label className="form-label">
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
                <label className="form-label">
                  Teacher<span className="text-danger">*</span>
                </label>
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
                  {teacherData &&
                    teacherData.map((userId) => (
                      <option key={userId.id} value={userId.teacherId}>
                        {userId.teacherName}
                      </option>
                    ))}
                </select>
                {formik.touched.userId && formik.errors.userId && (
                  <div className="invalid-feedback">{formik.errors.userId}</div>
                )}
              </div>
              <div className="col-md-6 col-12 mb-4">
                <label className="form-label">
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
                      name="folderCategory"
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
                      name="folderCategory"
                      value="individual"
                      checked={folderCategory === "individual"}
                      onChange={() => setFolderCategory("individual")}
                    />
                    &nbsp;
                    <label htmlFor="individual">Individual</label>
                  </div>
                </div>
                {formik.touched.folderCategory &&
                  formik.errors.folderCategory && (
                    <div className="invalid-feedback">
                      {formik.errors.folderCategory}
                    </div>
                  )}
              </div>
              <div className="col-md-6 col-12 mb-3">
                {folderCategory === "group" ? (
                  <></>
                ) : (
                  <div className="">
                    <label className="form-label">
                      {storedConfigure?.student || "Student"} Name
                    </label>
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
                <label className="form-label">Expiry Date</label>
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

              <div className="col-md-6 col-12 mb-2">
                {/* <div className="row">
                  <label className="form-label">
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
                </div> */}
                <div className="row">
                  <label className="form-label">
                    Files <span className="text-danger">*</span>
                  </label>
                  <input
                    className="form-control"
                    type="file"
                    multiple
                    accept="image/jpeg, image/png, application/pdf, application/msword, application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                    onChange={handleFileChange}
                  />
                  {/* Display the file count inside or near the input field */}
                  {/* <div className="file-count-display">
                    {uploadedFiles.length > 0
                      ? `${uploadedFiles.length} file(s) selected`
                      : "No files selected"}
                  </div> */}
                  {formik.errors.files && (
                    <small className="text-danger">{formik.errors.files}</small>
                  )}
                </div>

                {/* Display selected files with removal options */}
                {uploadedFiles.length > 0 && (
                  <div className="mt-3">
                    <h6>Uploaded Files:</h6>
                    <ul className="list-group">
                      {uploadedFiles.map((file, index) => (
                        <li
                          key={index}
                          className="list-group-item d-flex justify-content-between align-items-center"
                        >
                          <span>{file.name}</span>
                          <MdOutlineCancel
                            onClick={() => handleFileRemove(index)} // Call remove function on click
                            className="text-danger"
                          />
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                <p className="text-muted mt-2">
                  <strong>Note:</strong> Only JPG, PNG, PDF, DOC, or DOCX files
                  are allowed. Each file must be less than 5MB. Total size must
                  be under 1GB, and file names must not exceed 50 characters.
                </p>
              </div>

              <div className="col-md-6 col-12 mb-4">
                <label className="form-label">
                  {storedConfigure?.assignManagement || "Assignment"} Reason
                </label>
                <textarea
                  name="assignmentReason"
                  className={`form-control  ${
                    formik.touched.assignmentReason &&
                    formik.errors.assignmentReason
                      ? "is-invalid"
                      : ""
                  }`}
                  rows={5}
                  {...formik.getFieldProps("assignmentReason")}
                />
                {formik.touched.assignmentReason &&
                  formik.errors.assignmentReason && (
                    <div className="invalid-feedback">
                      {formik.errors.assignmentReason}
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

export default AssignmentAdd;
