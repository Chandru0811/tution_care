import React, { useEffect, useRef, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import "datatables.net-dt";
import "datatables.net-responsive-dt";
import { toast } from "react-toastify";
import fetchAllCoursesWithIdsC from "../List/CourseListByCenter";
import api from "../../config/URL";
import { Link } from "react-router-dom";

const EmployeeAttendance = () => {
  const tableRef = useRef(null);
  const [datas, setDatas] = useState([]);
  const [courseData, setCourseData] = useState(null);
  const getCurrentDate = () => {
    const today = new Date();
    const formattedDate = `${today.getFullYear()}-${(
      "0" +
      (today.getMonth() + 1)
    ).slice(-2)}-${("0" + today.getDate()).slice(-2)}`;
    return formattedDate;
  };
  const [selectedDate, setSelectedDate] = useState(getCurrentDate());
  const centerId = localStorage.getItem("tmscenterId");
  const storedConfigure = JSON.parse(
    localStorage.getItem("tmsappConfigInfo") || "{}"
  );

  const validationSchema = Yup.object({});

  const formik = useFormik({
    initialValues: {
      centerId: centerId,
      courseId: "",
      attendanceDate: "",
      attendanceStatus: "",
      modeOfAttendance: "",
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      const payload = {
        centerId: values.centerId,
        courseId: values.courseId,
        attendanceDate: selectedDate,
        ...(values.modeOfAttendance && {
          modeOfAttendance: values.modeOfAttendance,
        }),
        ...(values.attendanceStatus && {
          attendanceStatus: values.attendanceStatus,
        }),
      };
      console.log("Payload:", payload);
      try {
        const response = await api.post(
          "getUserAttendanceByCenterIdAndDate",
          payload
        );
        if (response.status === 200) {
          setDatas(response.data);
        } else {
          toast.error("Unexpected response status: " + response.status);
        }
      } catch (error) {
        toast.error(error.message || "An error occurred while fetching data");
      }
    },
  });

  const fetchCourses = async (centerId) => {
    try {
      const courses = await fetchAllCoursesWithIdsC(centerId);
      if (courses.length > 0) {
        const defaultCourseId = courses[0].id;
        formik.setFieldValue("courseId", defaultCourseId);
        setCourseData(courses);
      } else {
        console.log("");
      }
    } catch (error) {
      toast.error(error.message || "Error fetching courses.");
    }
  };

  const clearFilter = () => {
    formik.resetForm();
  };

  useEffect(() => {
    fetchCourses(centerId);
  }, []);

  return (
    <div className="container-fluid my-3">
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
          Report Management
          <span className="breadcrumb-separator"> &gt; </span>
        </li>
        <li className="breadcrumb-item active" aria-current="page">
          {storedConfigure?.student || "Student"} Attendance Report
        </li>
      </ol>
      <form
        onSubmit={formik.handleSubmit}
        onKeyDown={(e) => {
          if (e.key === "Enter" && !formik.isSubmitting) {
            e.preventDefault();
          }
        }}
      >
        <div className="card">
          <div
            className="d-flex px-4 justify-content-between align-items-center p-1"
            style={{ background: "#f5f7f9" }}
          >
            <div class="d-flex align-items-center">
              <div class="d-flex">
                <div class="dot active"></div>
              </div>
              <span class="me-2 text-muted">
                Attendance {storedConfigure?.report || "Report"}
              </span>
            </div>
          </div>
          <div className="container-fluid">
            <div className="row my-4">
              <div className="col-md-4 col-12 mb-2">
                <label className="form-label">
                  {storedConfigure?.course || "Course"}
                </label>
                <select
                  {...formik.getFieldProps("courseId")}
                  className={`form-select ${
                    formik.touched.courseId && formik.errors.courseId
                      ? "is-invalid"
                      : ""
                  }`}
                >
                  <option value="" disabled>
                    Select a {storedConfigure?.course || "Course"}
                  </option>
                  {courseData &&
                    courseData.map((course) => (
                      <option key={course.id} value={course.id}>
                        {course.courseNames}
                      </option>
                    ))}
                </select>
                {formik.touched.courseId && formik.errors.courseId && (
                  <div className="invalid-feedback">
                    {formik.errors.courseId}
                  </div>
                )}
              </div>
              <div className="col-md-4 col-12 mb-2">
                <label className="form-label">Attendance Date</label>
                <input
                  {...formik.getFieldProps("attendanceDate")}
                  type="date"
                  onFocus={(e) => e.target.showPicker()}
                  className={`form-control ${
                    formik.touched.attendanceDate &&
                    formik.errors.attendanceDate
                      ? "is-invalid"
                      : ""
                  }`}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  value={selectedDate}
                />
                {formik.touched.attendanceDate &&
                  formik.errors.attendanceDate && (
                    <div className="invalid-feedback">
                      {formik.errors.attendanceDate}
                    </div>
                  )}
              </div>
              <div className="col-md-4 col-12">
                <label className="form-label">Status</label>
                <select
                  {...formik.getFieldProps("attendanceStatus")}
                  className={`form-select ${
                    formik.touched.attendanceStatus &&
                    formik.errors.attendanceStatus
                      ? "is-invalid"
                      : ""
                  }`}
                >
                  <option value="" disabled>
                    Select a status
                  </option>
                  <option value="present">Present</option>
                  <option value="absent">Absent</option>
                </select>
                {formik.touched.attendanceStatus &&
                  formik.errors.attendanceStatus && (
                    <div className="invalid-feedback">
                      {formik.errors.attendanceStatus}
                    </div>
                  )}
              </div>
              <div className="col-md-4 col-12">
                <label className="form-label">Mode Of Attendance</label>
                <select
                  {...formik.getFieldProps("modeOfAttendance")}
                  className={`form-select ${
                    formik.touched.modeOfAttendance &&
                    formik.errors.modeOfAttendance
                      ? "is-invalid"
                      : ""
                  }`}
                >
                  <option value="" disabled>
                    Select a Attendance
                  </option>
                  <option value="Is_Facial_Reg">Facial Reg</option>
                  <option value="Is_Geo_Fence">Geo Fence</option>
                </select>
                {formik.touched.modeOfAttendance &&
                  formik.errors.modeOfAttendance && (
                    <div className="invalid-feedback">
                      {formik.errors.modeOfAttendance}
                    </div>
                  )}
              </div>
              <div className="col-md-4 col-12 d-flex align-items-end">
                <button
                  type="button"
                  onClick={clearFilter}
                  className="btn btn-border btn-sm mt-3"
                >
                  Clear
                </button>
                <button
                  type="submit"
                  className="btn btn-button btn-sm mt-3 mx-3"
                >
                  Search
                </button>
              </div>
            </div>
          </div>
          <div className="container-fluid">
            <table ref={tableRef} className="table table-striped">
              <thead>
                <tr>
                  <th scope="col" style={{ whiteSpace: "nowrap" }}>
                    S No
                  </th>
                  <th scope="col">
                    {storedConfigure?.student || "Students"} ID
                  </th>
                  <th scope="col">
                    {storedConfigure?.student || "Students"} Name
                  </th>
                  <th scope="col">Centre</th>
                  <th scope="col">{storedConfigure?.course || "Course"}</th>
                  <th scope="col">
                    {storedConfigure?.confClass || "Class"} Code
                  </th>
                  <th scope="col">Status</th>
                </tr>
              </thead>
              <tbody>
                {datas &&
                  datas.map((data, index) => (
                    <tr key={index}>
                      <th scope="row">{index + 1}</th>
                      <td>{data.studentUniqueId}</td>
                      <td>{data.studentName}</td>
                      <td>{data.centerName}</td>
                      <td>{data.courseName}</td>
                      <td>{data.classCode}</td>
                      <td>
                        {data.attendanceStatus === "present" ? (
                          <span className="badge badges-Green">Present</span>
                        ) : data.attendanceStatus === "deposit" ? (
                          <span className="badge badges-Brown">
                            Deposit Deducted
                          </span>
                        ) : data.attendanceStatus === "class_replaced" ? (
                          <span className="badge badges-Orange">
                            {storedConfigure?.confClass || "Class"} Replaced
                          </span>
                        ) : data.attendanceStatus === "absent" ? (
                          <span className="badge badges-Red">Absent</span>
                        ) : (
                          <span className="badge badges-Gray">
                            Not Yet Attendance
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      </form>
    </div>
  );
};

export default EmployeeAttendance;
