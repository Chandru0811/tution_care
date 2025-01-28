import React, { useEffect } from "react";
import { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import fetchAllCentersWithIds from "../List/CenterList";
import { toast } from "react-toastify";
import fetchAllCoursesWithIdsC from "../List/CourseListByCenter";
import fetchAllClassesWithIdsC from "../List/ClassListByCourse";
import api from "../../config/URL";
import fetchAllTeacherListByCenter from "../List/TeacherListByCenter";
import fetchAllClassRoomWithCenterIds from "../List/ClassRoomList";
import fetchAvailableTeacherDays from "../List/AvailableTeacherDays";

const validationSchema = Yup.object({
  centerId: Yup.string().required("*Centre is required"),
  courseId: Yup.string().required("*Course  is required"),
  classId: Yup.string().required("*Class is required"),
  days: Yup.string().required("*Days is required"),
  userId: Yup.string().required("*Teacher is required"),
  classRoom: Yup.string().required("*Class Room is required"),
  startDate: Yup.string().required("*Start Date is required"),
  endDate: Yup.string().required("*End Date is required"),
  // batch: Yup.string().required("*From Time is required"),
});

function ScheduleTeacherAdd({ onSuccess }) {
  const [show, setShow] = useState(false);
  const [centerData, setCenterData] = useState(null);
  const [courseData, setCourseData] = useState(null);
  const [classData, setClassData] = useState(null);
  const [daysData, setDaysData] = useState([]);
  console.log("Days:", daysData);

  const [teacherData, setTeacherData] = useState(null);
  const [classRoomData, setClassRoomData] = useState(null);
  const [loadIndicator, setLoadIndicator] = useState(false);
  const userName = localStorage.getItem("userName");
  const [isModified, setIsModified] = useState(false);
  const daysOfWeek = [
    "SUNDAY",
    "MONDAY",
    "TUESDAY",
    "WEDNESDAY",
    "THURSDAY",
    "FRIDAY",
    "SATURDAY",
  ];
  const getNextDateForDay = (selectedDay) => {
    const today = new Date();
    const dayIndex = daysOfWeek.indexOf(selectedDay);
    const nextDate = new Date(today);

    nextDate.setDate(today.getDate() + ((dayIndex + 7 - today.getDay()) % 7));
    return nextDate.toISOString().split("T")[0];
  };

  const handleClose = () => {
    setShow(false);
    formik.resetForm();
    setCourseData(null);
    setClassData(null);
    setDaysData(null);
    setTeacherData(null);
    setClassRoomData(null);
  };

  const handleShow = () => {
    setShow(true);
    setIsModified(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const centers = await fetchAllCentersWithIds();
      setCenterData(centers);
    } catch (error) {
      toast.error(error.message);
    }
  };

  const fetchCourses = async (centerId) => {
    try {
      const courses = await fetchAllCoursesWithIdsC(centerId);
      setCourseData(courses);
    } catch (error) {
      toast.error(error.message);
    }
  };

  const fetchTeacher = async (centerId) => {
    try {
      const teacher = await fetchAllTeacherListByCenter(centerId);
      setTeacherData(teacher);
    } catch (error) {
      toast.error(error.message);
    }
  };
  const handleClassChange = (event) => {
    const { value } = event.target;
    formik.setFieldValue("classId", value);
  };

  const fetchClasses = async (courseId) => {
    try {
      const classes = await fetchAllClassesWithIdsC(courseId);
      setClassData(classes);
    } catch (error) {
      toast.error(error.message);
    }
  };
  const fetchClassRoom = async (centerId) => {
    try {
      const classRoom = await fetchAllClassRoomWithCenterIds(centerId);
      setClassRoomData(classRoom);
      console.log("first", setClassRoomData);
    } catch (error) {
      toast.error(error.message);
    }
  };

  const fetchDays = async (userId) => {
    try {
      const teachersDays = await fetchAvailableTeacherDays(userId);
      setDaysData(teachersDays);
    } catch (error) {
      toast.error(error);
    }
  };

  const formik = useFormik({
    initialValues: {
      centerId: "",
      courseId: "",
      classId: "",
      days: "",
      userId: "",
      startDate: "",
      endDate: "",
      classRoom: "",
      // batch: "",
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      // const batch12hr = convertTo12Hour(values.batch);
      // values.batch = batch12hr;
      setLoadIndicator(true);
      let selectedCenterName = "";
      let selectedClassName = "";
      let selectedCourseName = "";
      let selectedTeacherName = "";
      let selectedClassRoomName = "";

      centerData.forEach((center) => {
        if (parseInt(values.centerId) === center.id) {
          selectedCenterName = center.centerNames || "--";
        }
      });

      // Find selected class name
      classData.forEach((cls) => {
        if (parseInt(values.classId) === cls.id) {
          selectedClassName = cls.classNames || "--";
        }
      });

      // Find selected course name
      courseData.forEach((course) => {
        if (parseInt(values.courseId) === course.id) {
          selectedCourseName = course.courseNames || "--";
        }
      });

      teacherData.forEach((teacher) => {
        if (parseInt(values.userId) === teacher.id) {
          selectedTeacherName = teacher.teacherNames || "--";
        }
      });
      classRoomData.forEach((classRoom) => {
        if (parseInt(values.classRoom) === classRoom.id) {
          selectedClassRoomName = classRoom.classRoomName || "--";
        }
      });

      let requestBody = {
        centerId: values.centerId,
        centerName: selectedCenterName,
        className: selectedClassName,
        classId: values.classId,
        course: selectedCourseName,
        courseId: values.courseId,
        // batch: batch12hr,
        userId: values.userId,
        teacher: selectedTeacherName,
        days: values.days,
        startDate: values.startDate,
        endDate: values.endDate,
        classRoom: selectedClassRoomName,
        createdBy: userName,
      };

      // console.log(requestBody);
      try {
        const response = await api.post(
          "/createMultipleSchedulesWithBatches",
          requestBody,
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        if (response.status === 201) {
          toast.success(response.data.message);
          onSuccess();
          handleClose();
        } else {
          toast.error(response.data.message);
        }
      } catch (error) {
        if (error.response.status === 409) {
          toast.warning(error?.response?.data?.message);
        } else {
          toast.error(error.response.data.message);
        }
      } finally {
        setLoadIndicator(false);
      }
    },
    enableReinitialize: true,
    validateOnChange: true,
    validateOnBlur: true,
    validate: (values) => {
      if (Object.values(values).some((value) => value.trim() !== "")) {
        setIsModified(true);
      } else {
        setIsModified(false);
      }
    },
  });

  // const handleCenterChange = (event) => {
  //   setCourseData(null);
  //   setClassData(null);
  //   setTeacherData(null);
  //   const centerId = event.target.value;
  //   formik.setFieldValue("centerId", centerId);
  //   console.log("object1",centerId)
  //   fetchCourses(centerId);
  //   fetchTeacher(centerId);
  //   fetchClassRoom(centerId);
  //   formik.resetForm();
  // };

  const handleCenterChange = (event) => {
    const centerId = event.target.value;

    // Reset specific dependent form fields
    formik.setFieldValue("centerId", centerId); // Set centerId
    formik.setFieldValue("courseId", ""); // Reset courseId
    formik.setFieldValue("classId", ""); // Reset classId
    formik.setFieldValue("userId", ""); // Reset teacher/userId
    formik.setFieldValue("days", ""); // Reset days
    formik.setFieldValue("classRoom", ""); // Reset classRoom

    // Reset the dependent data arrays in the state
    setCourseData(null);
    setClassData(null);
    setTeacherData(null);
    setDaysData(null);
    setClassRoomData(null);

    // Fetch new data for the selected center
    fetchCourses(centerId);
    fetchTeacher(centerId);
    fetchClassRoom(centerId);
  };

  const handleTeacherChange = (event) => {
    const userId = event.target.value;
    console.log("object2", userId);
    formik.setFieldValue("userId", userId);
    fetchDays(userId);
  };

  const handleCourseChange = (event) => {
    setClassData(null);
    const courseId = event.target.value;
    formik.setFieldValue("courseId", courseId);
    fetchClasses(courseId); // Fetch class for the selected center
  };

  useEffect(() => {
    if (daysData) {
      console.log("Available Days:", daysData);
    }
  }, [daysData]);

  return (
    <>
      <div className="mb-3 d-flex justify-content-end">
        <button
          type="button"
          className="btn btn-button btn-sm"
          onClick={handleShow}
        >
          Add <i class="bx bx-plus"></i>
        </button>
      </div>
      <Modal
        show={show}
        size="lg"
        onHide={handleClose}
        centered
        backdrop={isModified ? "static" : true}
        keyboard={isModified ? false : true}
      >
        <Modal.Header closeButton>
          <Modal.Title className="headColor">Add Schedule Teacher</Modal.Title>
        </Modal.Header>
        <form
          onSubmit={formik.handleSubmit}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !formik.isSubmitting) {
              e.preventDefault(); // Prevent default form submission
            }
          }}
        >
          <Modal.Body>
            <div className="container">
              <div className="row py-4">
                <div className="col-md-6 col-12 mb-2">
                  <label className="form-label">
                    Centre<span className="text-danger">*</span>
                  </label>
                  <select
                    {...formik.getFieldProps("centerId")}
                    className={`form-select ${
                      formik.touched.centerId && formik.errors.centerId
                        ? "is-invalid"
                        : ""
                    }`}
                    aria-label="Default select example"
                    onChange={handleCenterChange}
                  >
                    <option></option>
                    {centerData &&
                      centerData.map((center) => (
                        <option key={center.id} value={center.id}>
                          {center.centerNames}
                        </option>
                      ))}
                  </select>
                  {formik.touched.centerId && formik.errors.centerId && (
                    <div className="invalid-feedback">
                      {formik.errors.centerId}
                    </div>
                  )}
                </div>
                <div className="col-md-6 col-12 mb-2">
                  <label className="form-label">
                    Course<span className="text-danger">*</span>
                  </label>
                  <select
                    {...formik.getFieldProps("courseId")}
                    class={`form-select  ${
                      formik.touched.courseId && formik.errors.courseId
                        ? "is-invalid"
                        : ""
                    }`}
                    onChange={handleCourseChange}
                  >
                    <option></option>
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
                <div className="col-md-6 col-12 mb-2 d-flex flex-column justify-content-end">
                  <label className="form-label">
                    Class<span className="text-danger">*</span>
                  </label>
                  <select
                    {...formik.getFieldProps("classId")}
                    class={`form-select  ${
                      formik.touched.classId && formik.errors.classId
                        ? "is-invalid"
                        : ""
                    }`}
                    onChange={handleClassChange}
                  >
                    <option></option>
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
                {/* <div className="col-md-6 col-12 mb-2">
                  <label className="form-label">
                    Batch <span className="text-danger">*</span>
                  </label>
                  <input
                    type="time"
     
                    className={`form-control  ${
                      formik.touched.batch && formik.errors.batch
                        ? "is-invalid"
                        : ""
                    }`}
                    {...formik.getFieldProps("batch")}
                  />

                  {formik.touched.batch && formik.errors.batch && (
                    <div className="invalid-feedback">
                      {formik.errors.batch}
                    </div>
                  )}
                </div> */}{" "}
                <div className="col-md-6 col-12 mb-2">
                  <label className="form-label">
                    Teacher<span className="text-danger">*</span>
                  </label>
                  <select
                    {...formik.getFieldProps("userId")}
                    class={`form-select  ${
                      formik.touched.userId && formik.errors.userId
                        ? "is-invalid"
                        : ""
                    }`}
                    onChange={handleTeacherChange}
                  >
                    <option></option>
                    {teacherData &&
                      teacherData.map((teacher) => (
                        <option key={teacher.id} value={teacher.id}>
                          {teacher.teacherNames}
                        </option>
                      ))}
                  </select>
                  {formik.touched.userId && formik.errors.userId && (
                    <div className="invalid-feedback">
                      {formik.errors.userId}
                    </div>
                  )}
                </div>
                {/* <div className="col-md-6 col-12 mb-2">
                  <label className="form-label">
                    Days<span className="text-danger">*</span>
                  </label>
                  <input
                    {...formik.getFieldProps("days")}
                    class={`form-control  ${
                      formik.touched.days && formik.errors.days
                        ? "is-invalid"
                        : ""
                    }`}
                    readOnly
                  />
                  {formik.touched.days && formik.errors.days && (
                    <div className="invalid-feedback">{formik.errors.days}</div>
                  )}
                </div> */}
                <div className="col-md-6 col-12 mb-2">
                  <label className="form-label">
                    Days<span className="text-danger">*</span>
                  </label>
                  <select
                    {...formik.getFieldProps("days")}
                    class={`form-select  ${
                      formik.touched.days && formik.errors.days
                        ? "is-invalid"
                        : ""
                    }`}
                    onChange={(e) => {
                      formik.handleChange(e);
                      const selectedDay = e.target.value;
                      const nextAvailableDate = getNextDateForDay(selectedDay);
                      formik.setFieldValue("startDate", nextAvailableDate); // Automatically set the closest date
                    }}
                  >
                    <option value=""></option>
                    {daysData &&
                      daysData.map((day, index) => (
                        <option key={index} value={day}>
                          {day}
                        </option>
                      ))}
                  </select>
                  {formik.touched.days && formik.errors.days && (
                    <div className="invalid-feedback">{formik.errors.days}</div>
                  )}
                </div>
                <div className="col-md-6 col-12 mb-2">
                  <label className="form-label">
                    Class Room<span className="text-danger">*</span>
                  </label>
                  <select
                    {...formik.getFieldProps("classRoom")}
                    class={`form-select  ${
                      formik.touched.classRoom && formik.errors.classRoom
                        ? "is-invalid"
                        : ""
                    }`}
                  >
                    <option value=""></option>
                    {classRoomData &&
                      classRoomData.map((classRoom) => (
                        <option key={classRoom.id} value={classRoom.id}>
                          {classRoom.classRoomName}
                        </option>
                      ))}
                  </select>
                  {formik.touched.classRoom && formik.errors.classRoom && (
                    <div className="invalid-feedback">
                      {formik.errors.classRoom}
                    </div>
                  )}
                </div>
                <div className="col-md-6 col-12 mb-2">
                  <label className="form-label">
                    Start Date<span className="text-danger">*</span>
                  </label>
                  <input
                    type="date"
                    name="startDate"
                    {...formik.getFieldProps("startDate")}
                    className={`form-control  ${
                      formik.touched.startDate && formik.errors.startDate
                        ? "is-invalid"
                        : ""
                    }`}
                    min={
                      formik.values.days
                        ? getNextDateForDay(formik.values.days)
                        : ""
                    }
                  />
                  {formik.touched.startDate && formik.errors.startDate && (
                    <div className="invalid-feedback">
                      {formik.errors.startDate}
                    </div>
                  )}
                </div>
                <div className="col-md-6 col-12 mb-2">
                  <label className="form-label">
                    End Date<span className="text-danger">*</span>
                  </label>
                  <input
                    type="date"
                    name="endDate"
                    {...formik.getFieldProps("endDate")}
                    className={`form-control ${
                      formik.touched.endDate && formik.errors.endDate
                        ? "is-invalid"
                        : ""
                    }`}
                    // Add one day to the start date so that the end date only allows dates after the start date
                    min={
                      formik.values.startDate
                        ? new Date(
                            new Date(formik.values.startDate).setDate(
                              new Date(formik.values.startDate).getDate() + 1
                            )
                          )
                            .toISOString()
                            .split("T")[0]
                        : new Date().toISOString().split("T")[0]
                    }
                  />
                  {formik.touched.endDate && formik.errors.endDate && (
                    <div className="invalid-feedback">
                      {formik.errors.endDate}
                    </div>
                  )}
                </div>
              </div>
            </div>
            <Modal.Footer>
              <Button
                type="button"
                className="btn btn-sm btn-border bg-light text-dark"
                onClick={handleClose}
              >
                Cancel
              </Button>
              <Button
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
                Submit
              </Button>
            </Modal.Footer>
          </Modal.Body>
        </form>
      </Modal>
    </>
  );
}

export default ScheduleTeacherAdd;
