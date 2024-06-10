import React, { useEffect } from "react";
import { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { useNavigate } from "react-router-dom";
import { FaEdit } from "react-icons/fa";
import fetchAllCentersWithIds from "../List/CenterList";
import toast from "react-hot-toast";
import fetchAllCoursesWithIdsC from "../List/CourseListByCenter";
import fetchAllClassesWithIdsC from "../List/ClassListByCourse";
import fetchAllTeachersWithIds from "../List/TeacherList";
import api from "../../config/URL";

function ScheduleTeacherEdit({ id, onSuccess }) {
  const [show, setShow] = useState(false);
  const [centerData, setCenterData] = useState(null);
  const [courseData, setCourseData] = useState(null);
  const [classData, setClassData] = useState(null);
  const [teacherData, setTeacherData] = useState(null);
  const [loadIndicator, setLoadIndicator] = useState(false);
  const navigate = useNavigate();

  const handleClose = () => {
    setShow(false);
    formik.resetForm();
    setCourseData(null);
    setClassData(null);
  };

  const handleShow = async () => {
    try {
      const response = await api.get(`/getAllScheduleTeacherById/${id}`);
      formik.setValues(response.data);
      setShow(true);
    } catch (error) {
      console.error("Error fetching data:", error.message);
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
      toast.error(error.message);
    }
  };

  const fetchCourses = async (tuitionId) => {
    try {
      const courses = await fetchAllCoursesWithIdsC(tuitionId);
      setCourseData(courses);
    } catch (error) {
      toast.error(error.message);
    }
  };

  const fetchClasses = async (courseId) => {
    try {
      const classes = await fetchAllClassesWithIdsC(courseId);
      setClassData(classes);
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
    tuitionId: Yup.string().required("*Centre is required"),
    courseId: Yup.string().required("*Course  is required"),
    classId: Yup.string().required("*Class is required"),
    days: Yup.string().required("*Days is required"),
    userId: Yup.string().required("*Teacher is required"),
    // batch: Yup.string().required("From Time is required"),
  });

  const formik = useFormik({
    initialValues: {
      tuitionId: "",
      courseId: "",
      classId: "",
      centerName: "",
      className: "",
      course: "",
      days: "",
      userId: "",
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

      centerData.forEach((center) => {
        if (parseInt(values.tuitionId) === center.id) {
          selectedCenterName = center.tuitionCareName || "--";
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

      let requestBody = {
        tuitionId: values.tuitionId,
        centerName: selectedCenterName,
        className: selectedClassName,
        classId: values.classId,
        course: selectedCourseName,
        courseId: values.courseId,
        // batch: values.batch || batch12hr,
        userId: values.userId,
        teacher: selectedTeacherName,
        days: values.days,
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
        toast.error(error.message);
      } finally {
        setLoadIndicator(false);
      }
    },
  });

  const handleCenterChange = (event) => {
    const tuitionId = event.target.value;
    formik.setFieldValue("tuitionId", tuitionId);
    fetchCourses(tuitionId); // Fetch courses for the selected center
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
      <Modal show={show} size="lg" onHide={handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title className="headColor">
            Update Schedule Teacher
          </Modal.Title>
        </Modal.Header>
        <form onSubmit={formik.handleSubmit}>
          <Modal.Body>
            <div className="container">
              <div className="row">
                <div className="col-md-6 col-12 mb-2">
                  <label className="form-label">
                    Centre<span className="text-danger">*</span>
                  </label>
                  <select
                    {...formik.getFieldProps("tuitionId")}
                    className={`form-select form-select-sm ${
                      formik.touched.tuitionId && formik.errors.tuitionId
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
                  {formik.touched.tuitionId && formik.errors.tuitionId && (
                    <div className="invalid-feedback">
                      {formik.errors.tuitionId}
                    </div>
                  )}
                </div>
                <div className="col-md-6 col-12 mb-2">
                  <label className="form-label">
                    Course<span className="text-danger">*</span>
                  </label>
                  <select
                    {...formik.getFieldProps("courseId")}
                    class={`form-select form-select-sm  ${
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
                    class={`form-select form-select-sm  ${
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
                    class={`form-select form-select-sm  ${
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
                    class={`form-select form-select-sm  ${
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
              </div>
            </div>
            <Modal.Footer className="mt-3">
              <Button
                type="button"
                variant="secondary btn-sm"
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
