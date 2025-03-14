import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import api from "../../config/URL";
import { toast } from "react-toastify";
import fetchAllCoursesWithIdsC from "../List/CourseListByCenter";
import fetchAllClassRoomWithCenterIds from "../List/ClassRoomList";
import { IoIosSettings } from "react-icons/io";

function ClassAdd() {
  const navigate = useNavigate();
  const [courseData, setCourseData] = useState(null);
  const [classRoomData, setClassRoomData] = useState(null);
  const [teacherData, setTeacherData] = useState(null);
  const [batchData, setBatchData] = useState(null);
  const [loadIndicator, setLoadIndicator] = useState(false);
  const centerId = localStorage.getItem("tmscenterId");
  const role = localStorage.getItem("tmsrole");
  const appConfigInfo = JSON.parse(localStorage.getItem("tmsappConfigInfo"));

  const validationSchema = Yup.object({
    courseId: Yup.string().required("*Course Name is required"),
    className: Yup.string().required("*Class Name is required"),
    classType: Yup.string().required("*Class Type is required"),
    userId: Yup.string().required("*Employee is required"),
    durationInHrs: Yup.number().required("*Duration Hours is required"),
    durationInMins: Yup.number().required("*Duration Minutes is required"),
    startDate: Yup.date().required("*Start Date is required"),
    endDate: Yup.date().required("*End Date is required"),
    startTime: Yup.string().required("*Start Time is required"),
    endTime: Yup.string().required("*End Time is required"),
    day: Yup.string().required("*Day is required"),
    remark: Yup.string()
      .max(200, "*The maximum length is 200 characters")
      .notRequired(),
  });

  const getEndDate = () => {
    const today = new Date();
    today.setMonth(today.getMonth() + 1);
    return today.toISOString().split("T")[0];
  };

  const formik = useFormik({
    initialValues: {
      centerId: centerId,
      courseId: "",
      className: "",
      courseName: "",
      classType: "",
      classCode: "",
      userId: "",
      teacherName: "",
      classId: "",
      durationInHrs: "",
      durationInMins: "",
      startDate: new Date().toISOString().split("T")[0],
      endDate: getEndDate(),
      startTime: "",
      endTime: "",
      day: "",
      remark: "",
      createdBy: role,
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      setLoadIndicator(true);
      values.createdBy = role;

      try {
        const response = await api.post("/createClassSchedules", values, {
          headers: {
            "Content-Type": "application/json",
          },
        });
        if (response.status === 201) {
          toast.success(response.data.message);
          navigate("/class");
        } else {
          toast.error(response.data.message);
        }
      } catch (error) {
        console.log(error);
        if (error.response.status === 409) {
          toast.warning(error?.response?.data?.message);
        } else {
          toast.error(error);
        }
      } finally {
        setLoadIndicator(false);
      }
    },
  });

  const fetchCourses = async () => {
    try {
      const courseData = await fetchAllCoursesWithIdsC(centerId);
      setCourseData(courseData);
      console.log("coursedataaa", courseData);
    } catch (error) {
      toast.error(error);
    }
  };

  const fetchClassRoom = async () => {
    try {
      const classId = await fetchAllClassRoomWithCenterIds(centerId);
      setClassRoomData(classId);
      console.log("first", setClassRoomData);
    } catch (error) {
      toast.error(error.message);
    }
  };

  const fetchBatchandTeacherData = async (day) => {
    try {
      const response = await api.get(
        `getTeacherWithBatchListByDay?day=${day}&centerId=${centerId}`
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
    fetchCourses();
    fetchClassRoom();
  }, [formik.values.day]);

  useEffect(() => {
    const getData = async () => {
      try {
        const response = await api.get(
          `/getAllCoursesById/${formik.values.courseId}`
        );
        formik.setFieldValue("durationInHrs", response.data.durationInHrs);
        formik.setFieldValue("durationInMins", response.data.durationInMins);
      } catch (error) {
        toast.error("Error Fetching Data ", error);
      }
    };
    if (formik.values.courseId) {
      getData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formik.values.courseId]);

  const calculateEndTime = () => {
    const { durationInHrs, durationInMins, startTime } = formik.values;
    if (!startTime) return;

    const [startHours, startMinutes] = startTime.split(":").map(Number);
    const endHours =
      (startHours +
        parseInt(durationInHrs) +
        Math.floor((startMinutes + parseInt(durationInMins)) / 60)) %
      24;
    const endMinutes = (startMinutes + parseInt(durationInMins)) % 60;

    const formattedEndTime = `${String(endHours).padStart(2, "0")}:${String(
      endMinutes
    ).padStart(2, "0")}`;
    formik.setFieldValue("endTime", formattedEndTime);
  };

  useEffect(() => {
    calculateEndTime();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    formik.values.durationInHrs,
    formik.values.durationInMins,
    formik.values.startTime,
  ]);

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
          &nbsp;{appConfigInfo.course}
          <span className="breadcrumb-separator"> &gt; </span>
        </li>
        <li>
          <Link to="/class" className="custom-breadcrumb">
            &nbsp;{appConfigInfo.confClass}
          </Link>
          <span className="breadcrumb-separator"> &gt; </span>
        </li>
        <li className="breadcrumb-item active" aria-current="page">
          &nbsp;{appConfigInfo.confClass} Add
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
              <span class="me-2 text-muted">Add {appConfigInfo.confClass}</span>
            </div>
            <div className="my-2 pe-3 d-flex align-items-center">
              <Link to="/class">
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
          <div className="container-fluid px-4">
            <div className="row">
              <div class="col-md-6 col-12 mb-4">
                <label>
                  {appConfigInfo.course}
                  <span class="text-danger">*</span>
                </label>
                <select
                  {...formik.getFieldProps("courseId")}
                  name="courseId"
                  className={`form-select   ${
                    formik.touched.courseId && formik.errors.courseId
                      ? "is-invalid"
                      : ""
                  }`}
                  aria-label="Default select example"
                  class="form-select "
                >
                  <option selected></option>
                  {courseData &&
                    courseData.map((courseId) => (
                      <option key={courseId.id} value={courseId.id}>
                        {courseId.courseNames}
                      </option>
                    ))}
                </select>
                {formik.touched.courseId && formik.errors.courseId && (
                  <div className="invalid-feedback">
                    {formik.errors.courseId}
                  </div>
                )}
              </div>
              <div class="col-md-6 col-12 mb-4">
                <label>
                  {appConfigInfo.confClass} Name
                  <span class="text-danger">*</span>
                </label>
                <input
                  name="className"
                  class="form-control "
                  type="text"
                  className={`form-control  ${
                    formik.touched.className && formik.errors.className
                      ? "is-invalid"
                      : ""
                  }`}
                  {...formik.getFieldProps("className")}
                />
                {formik.touched.className && formik.errors.className && (
                  <div className="invalid-feedback">
                    {formik.errors.className}
                  </div>
                )}
              </div>
              <div class="col-md-6 col-12 mb-4">
                <label>{appConfigInfo.confClass} Room</label>
                <select
                  {...formik.getFieldProps("classId")}
                  className={`form-select  ${
                    formik.touched.classId && formik.errors.classId
                      ? "is-invalid"
                      : ""
                  }`}
                  name="classId"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.classId}
                >
                  <option></option>
                  {classRoomData &&
                    classRoomData.map((classId) => (
                      <option key={classId.id} value={classId.id}>
                        {classId.classRoomName}
                      </option>
                    ))}
                </select>
                {formik.touched.classId && formik.errors.classId && (
                  <div className="invalid-feedback">
                    {formik.errors.classId}
                  </div>
                )}
              </div>
              <div class="col-md-6 col-12 mb-4">
                <label>
                  {appConfigInfo.confClass} Type
                  <span class="text-danger">*</span>
                </label>{" "}
                <br />
                <div class="form-check form-check-inline">
                  <input
                    class="form-check-input"
                    type="radio"
                    name="classType"
                    id="inlineRadio1"
                    value="Group"
                    onChange={formik.handleChange}
                    checked={formik.values.classType === "Group"}
                  />
                  <label class="form-check-label" for="inlineRadio1">
                    Group
                  </label>
                </div>
                <div class="form-check form-check-inline">
                  <input
                    class="form-check-input"
                    type="radio"
                    name="classType"
                    id="inlineRadio2"
                    value="Individual"
                    onChange={formik.handleChange}
                    checked={formik.values.classType === "Individual"}
                  />
                  <label class="form-check-label" for="inlineRadio2">
                    Individual
                  </label>
                </div>
                {formik.errors.classType && formik.touched.classType && (
                  <div className="text-danger  " style={{ fontSize: ".875em" }}>
                    {formik.errors.classType}
                  </div>
                )}
              </div>

              <div class="col-md-6 col-12 mb-4">
                <label>
                  Duration(Hrs)<span class="text-danger">*</span>
                </label>
                <select
                  {...formik.getFieldProps("durationInHrs")}
                  className={`form-select  ${
                    formik.touched.durationInHrs && formik.errors.durationInHrs
                      ? "is-invalid"
                      : ""
                  }`}
                  name="durationInHrs"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.durationInHrs}
                >
                  <option></option>
                  <option value="01">01</option>
                  <option value="02">02</option>
                  <option value="03">03</option>
                  <option value="04">04</option>
                  <option value="05">05</option>
                  <option value="06">06</option>
                  <option value="07">07</option>
                  <option value="08">08</option>
                  <option value="09">09</option>
                  <option value="10">10</option>
                </select>
                {formik.touched.durationInHrs &&
                  formik.errors.durationInHrs && (
                    <div className="invalid-feedback">
                      {formik.errors.durationInHrs}
                    </div>
                  )}
              </div>
              <div class="col-md-6 col-12 mb-4">
                <label>
                  Duration(Mins)<span class="text-danger">*</span>
                </label>
                <select
                  {...formik.getFieldProps("durationInMins")}
                  className={`form-select  ${
                    formik.touched.durationInMins &&
                    formik.errors.durationInMins
                      ? "is-invalid"
                      : ""
                  }`}
                  name="durationInMins"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.durationInMins}
                >
                  <option></option>
                  <option value="00">00</option>
                  <option value="15">15</option>
                  <option value="30">30</option>
                  <option value="45">45</option>
                </select>
                {formik.touched.durationInMins &&
                  formik.errors.durationInMins && (
                    <div className="invalid-feedback">
                      {formik.errors.durationInMins}
                    </div>
                  )}
              </div>
              <div class="col-md-6 col-12 mb-4">
                <label>
                  Day<span class="text-danger">*</span>
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
                <div className="d-flex justify-content-between align-items-center">
                  <label>
                  {appConfigInfo.employee}<span class="text-danger">*</span>
                  </label>

                  <Link to={`/teacher/add`} style={{ textDecoration: "none" }}>
                    <p className="stdSettings mb-0">
                      Add {appConfigInfo.employee}
                      <i className="bx bx-plus"></i>
                    </p>
                  </Link>
                </div>

                <select
                  {...formik.getFieldProps("userId")}
                  className={`form-select ${
                    formik.touched.userId && formik.errors.userId
                      ? "is-invalid"
                      : ""
                  }`}
                  name="userId"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.userId}
                >
                  <option selected></option>
                  {teacherData &&
                    teacherData.map((userId) => (
                      <option key={userId.teacherId} value={userId.teacherId}>
                        {userId.teacherName}
                      </option>
                    ))}
                </select>

                {formik.touched.userId && formik.errors.userId && (
                  <div className="invalid-feedback">{formik.errors.userId}</div>
                )}
              </div>

              <div class="col-md-6 col-12 mb-4">
                <label>
                  Start Date<span class="text-danger">*</span>
                </label>
                <input
                  {...formik.getFieldProps("startDate")}
                  className={`form-control  ${
                    formik.touched.startDate && formik.errors.startDate
                      ? "is-invalid"
                      : ""
                  }`}
                  name="startDate"
                  type="date"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.startDate}
                />
                {formik.touched.startDate && formik.errors.startDate && (
                  <div className="invalid-feedback">
                    {formik.errors.startDate}
                  </div>
                )}
              </div>
              <div class="col-md-6 col-12 mb-4">
                <label>
                  End Date<span class="text-danger">*</span>
                </label>
                <input
                  {...formik.getFieldProps("endDate")}
                  className={`form-control  ${
                    formik.touched.endDate && formik.errors.endDate
                      ? "is-invalid"
                      : ""
                  }`}
                  name="endDate"
                  type="date"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.endDate}
                />
                {formik.touched.endDate && formik.errors.endDate && (
                  <div className="invalid-feedback">
                    {formik.errors.endDate}
                  </div>
                )}
              </div>

              <div class="col-md-6 col-12 mb-4">
                <label>
                  Start Time<span class="text-danger">*</span>
                </label>
                <select
                  {...formik.getFieldProps("startTime")}
                  className={`form-select  ${
                    formik.touched.startTime && formik.errors.startTime
                      ? "is-invalid"
                      : ""
                  }`}
                  name="startTime"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.startTime}
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
                {formik.touched.startTime && formik.errors.startTime && (
                  <div className="invalid-feedback">
                    {formik.errors.startTime}
                  </div>
                )}
              </div>
              <div class="col-md-6 col-12 mb-4">
                <label>
                  End Time<span class="text-danger">*</span>
                </label>
                <input
                  {...formik.getFieldProps("endTime")}
                  className={`form-control  ${
                    formik.touched.endTime && formik.errors.endTime
                      ? "is-invalid"
                      : ""
                  }`}
                  name="endTime"
                  type="time"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.endTime}
                />
                {formik.touched.endTime && formik.errors.endTime && (
                  <div className="invalid-feedback">
                    {formik.errors.endTime}
                  </div>
                )}
              </div>

              <div className="col-md-6 col-12 mb-4">
                <label>Remark</label>
                <textarea
                  name="remark"
                  className={`form-control ${
                    formik.touched.remark && formik.errors.remark
                      ? "is-invalid"
                      : ""
                  }`}
                  {...formik.getFieldProps("remark")}
                  maxLength={200}
                />
                {formik.touched.remark && formik.errors.remark && (
                  <div className="invalid-feedback">{formik.errors.remark}</div>
                )}
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}

export default ClassAdd;
