import React, { useEffect } from "react";
import { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
// import { useNavigate } from "react-router-dom";
import { FaEdit } from "react-icons/fa";
import fetchAllCentersWithIds from "../List/CenterList";
import { toast } from "react-toastify";
import fetchAllCoursesWithIdsC from "../List/CourseListByCenter";
import fetchAllClassesWithIdsC from "../List/ClassListByCourse";
import fetchAllTeachersWithIds from "../List/TeacherList";
import api from "../../config/URL";
import fetchAllClassRoomWithCenterIds from "../List/ClassRoomList";

function ScheduleTeacherEdit({ id, onSuccess }) {
  const [show, setShow] = useState(false);
  const [centerData, setCenterData] = useState(null);
  const [courseData, setCourseData] = useState(null);
  const [classData, setClassData] = useState(null);
  const [teacherData, setTeacherData] = useState(null);
  const [classRoomData, setClassRoomData] = useState(null);
  const [loadIndicator, setLoadIndicator] = useState(false);
  const userName = localStorage.getItem("userName");
  const [isModified, setIsModified] = useState(false);

  // const navigate = useNavigate();

  const handleClose = () => {
    setShow(false);
    formik.resetForm();
    setCourseData(null);
    setClassData(null);
    setClassRoomData(null);
  };

  const handleShow = async () => {
    try {
      const response = await api.get(`/getAllScheduleTeacherById/${id}`);
      formik.setValues(response.data);
      setShow(true);
      setIsModified(false);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setShow(true);
    }
  };

  const fetchData = async () => {
    try {
      const centers = await fetchAllCentersWithIds();
      const teacher = await fetchAllTeachersWithIds();
      setCenterData(centers);
      setTeacherData(teacher);
    } catch (error) {
      toast.error(error);
    }
  };

  const fetchCourses = async (centerId) => {
    try {
      const courses = await fetchAllCoursesWithIdsC(centerId);
      setCourseData(courses);
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
  const fetchClassRoom = async (centerId) => {
    try {
      const classRoom = await fetchAllClassRoomWithCenterIds(centerId);
      setClassRoomData(classRoom);
    } catch (error) {
      toast.error(error.message);
    }
  };

  // const fetchTeacher = async (teacherId) => {
  //   try {
  //     const teachers = await fetchAllTeachersWithIdsC(teacherId);
  //     setClassData(teachers);
  //   } catch (error) {
  //     toast.error(error);
  //   }
  // };

  useEffect(() => {
    fetchData();
  }, []);

  const validationSchema = Yup.object({
    centerId: Yup.string().required("*Centre is required"),
    courseId: Yup.string().required("*Course  is required"),
    classId: Yup.string().required("*Class is required"),
    days: Yup.string().required("*Days is required"),
    userId: Yup.string().required("*Teacher is required"),
    classRoom: Yup.string().required("*Class Room is required"),
    startDate: Yup.string().required("*Start Date is required"),
    endDate: Yup.string().required("*End Date is required"),
    // batch: Yup.string().required("From Time is required"),
  });

  const formik = useFormik({
    initialValues: {
      centerId: "",
      courseId: "",
      classId: "",
      centerName: "",
      className: "",
      course: "",
      days: "",
      userId: "",
      startDate: "",
      endDate: "",
      classRoom: "",
      // batch: "",
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      setLoadIndicator(true);
      // const batch12hr = convertTo12Hour(values.batch);
      // values.batch = batch12hr;
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
        // batch: values.batch || batch12hr,
        userId: values.userId,
        teacher: selectedTeacherName,
        days: values.days,
        startDate: values.startDate,
        endDate: values.endDate,
        classRoom: selectedClassRoomName,
        updatedBy: userName,
      };

      // console.log(requestBody);
      try {
        const response = await api.put(
          `/updateScheduleTeacher/${id}`,
          requestBody,
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        if (response.status === 200) {
          toast.success(response.data.message);
          onSuccess();
          handleClose();
        } else {
          toast.error(response.data.message);
        }
      } catch (error) {
        toast.error(error);
      } finally {
        setLoadIndicator(false);
      }
    },
    enableReinitialize: true,
    validateOnChange: true,
    validateOnBlur: true,
    validate: (values) => {
      if (
        Object.values(values).some(
          (value) => typeof value === "string" && value.trim() !== ""
        )
      ) {
        setIsModified(true);
      } else {
        setIsModified(false);
      }
    },
  });

  const handleCenterChange = (event) => {
    const centerId = event.target.value;
    formik.setFieldValue("centerId", centerId);
    fetchCourses(centerId); // Fetch courses for the selected center
    fetchClassRoom(centerId); // Fetch courses for the selected center
  };

  const handleCourseChange = (event) => {
    const courseId = event.target.value;
    formik.setFieldValue("courseId", courseId);
    fetchClasses(courseId); // Fetch class for the selected center
  };

  // const convertTo12Hour = (time24h) => {
  //   let [hours, minutes] = time24h.split(":");
  //   let modifier = "AM";

  //   if (parseInt(hours) >= 12) {
  //     modifier = "PM";
  //     hours = (parseInt(hours) - 12).toString();
  //   }

  //   if (hours === "0") {
  //     hours = "12";
  //   }

  //   return `${hours}:${minutes} ${modifier}`;
  // };

  return (
    <>
      <div className="">
        <button className="btn btn-sm" onClick={handleShow}>
          <FaEdit />
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
          <Modal.Title className="headColor">Edit schedule Teacher</Modal.Title>
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
                    <option disabled></option>
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
                    <option value={formik.values.courseId}>
                      {formik.values.course}
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
                    // onChange={handleClassChange}
                  >
                    <option value={formik.values.classId}>
                      {formik.values.className}
                    </option>
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
     
                    className={`form-control ${
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
                  >
                    <option disabled></option>
                    <option value="MONDAY">MONDAY</option>
                    <option value="TUESDAY">TUESDAY</option>
                    <option value="WEDNESDAY">WEDNESDAY</option>
                    <option value="THURSDAY">THURSDAY</option>
                    <option value="FRIDAY">FRIDAY</option>
                    <option value="SATURDAY">SATURDAY</option>
                    <option value="SUNDAY">SUNDAY</option>
                  </select>
                  {formik.touched.days && formik.errors.days && (
                    <div className="invalid-feedback">{formik.errors.days}</div>
                  )}
                </div>
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
                  >
                    <option selected></option>
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
                    <option></option>
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
                    {...formik.getFieldProps("startDate")}
                    class={`form-control  ${
                      formik.touched.startDate && formik.errors.startDate
                        ? "is-invalid"
                        : ""
                    }`}
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
                    {...formik.getFieldProps("endDate")}
                    class={`form-control  ${
                      formik.touched.endDate && formik.errors.endDate
                        ? "is-invalid"
                        : ""
                    }`}
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
                Update
              </Button>
            </Modal.Footer>
          </Modal.Body>
        </form>
      </Modal>
    </>
  );
}

export default ScheduleTeacherEdit;
