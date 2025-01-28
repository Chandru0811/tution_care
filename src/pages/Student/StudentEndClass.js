import React, { useEffect, useState } from "react";
import * as Yup from "yup";
import { useFormik } from "formik";
import { Link, useNavigate, useParams, useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";
import api from "../../config/URL";
import fetchAllClassesWithIds from "../List/ClassList";
import fetchAllCoursesWithIdsC from "../List/CourseListByCenter";
import fetchAllClassesWithIdsC from "../List/ClassListByCourse";

const validationSchema = Yup.object().shape({
  currentCourse: Yup.string().required("*Select a Current Course"),
  currentClass: Yup.string().required("*Select a Current Class"),
  lastLessonDate: Yup.string().required("*Select a Last Lesson"),
  reason: Yup.string().required("*Select a Reason"),
  otherReason: Yup.string().required("*Other Reason is required"),
  centerRemark: Yup.string()
    .required("*Leave Reason is required")
    .max(200, "*The maximum length is 200 characters"),
  parentRemark: Yup.string()
    .required("*Leave Reason is required")
    .max(200, "*The maximum length is 200 characters"),
});

const StudentEndClass = () => {
  // const navigate = useNavigate();
  const navigate = useNavigate();
  const { id } = useParams();
  const [courseData, setCourseData] = useState(null);
  const [classData, setClassData] = useState(null);
  const [searchParams] = useSearchParams();
  const centerId = searchParams.get("centerId");
  // console.log(id);
  const formik = useFormik({
    initialValues: {
      currentCourse: "",
      currentClass: "",
      lastLessonDate: "",
      reason: "",
      otherReason: "",
      centerRemark: "",
      parentRemark: "",
    },
    validationSchema: validationSchema,

    onSubmit: async (values) => {
      values.studentId = id;
      try {
        const response = await api.post("/createStudentEndClass", values, {
          headers: {
            "Content-Type": "application/json",
          },
        });
        if (response.status === 201) {
          toast.success(response.data.message);
          navigate(`/student/view/${id}`);
        } else {
          toast.error(response.data.message);
        }
      } catch (error) {
        toast.error(error);
      }
    },
  });

  const fetchData = async () => {
    try {
      const course = await fetchAllCoursesWithIdsC(centerId);
      setCourseData(course);
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

  const handleCourseChange = (event) => {
    const courseId = event.target.value;
    formik.setFieldValue("currentCourse", courseId);
    fetchClasses(courseId); // Fetch class for the selected center
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    const getData = async () => {
      try {
        const response = await api.get(`/getAllStudentDetails/${id}`);
        if (response.data.studentCourseDetailModels.length > 0) {
          const formattedResponseData = {
            ...response.data.studentCourseDetailModels[0],
            currentCourse: response.data.studentCourseDetailModels[0].courseId,
          };
          formik.setValues(formattedResponseData);
        } else {
          console.log("Value not present in the table");
        }
      } catch (error) {
        console.log("Error Fetching Form Data");
      }
    };

    getData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
          &nbsp;Student Management
          <span className="breadcrumb-separator"> &gt; </span>
        </li>
        <li>
          <Link to="/student" className="custom-breadcrumb">
            &nbsp;Student Listing{" "}
          </Link>
          <span className="breadcrumb-separator"> &gt; </span>
        </li>
        <li>
          <Link to={`/student/view/${id}`} className="custom-breadcrumb">
            &nbsp;Student View
          </Link>
          <span className="breadcrumb-separator"> &gt; </span>
        </li>
        <li className="breadcrumb-item active" aria-current="page">
          &nbsp;Student End Class
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
            className="d-flex justify-content-between align-items-center p-1 mb-4 px-4"
            style={{ background: "#f5f7f9" }}
          >
            <div class="d-flex align-items-center">
              <div class="d-flex">
                <div class="dot active"></div>
              </div>
              <span class="me-2 text-muted">Student End Class</span>
            </div>
            <div className="my-2 pe-3 d-flex align-items-center">
              <Link to={`/student/view/${id}`}>
                <button type="button " className="btn btn-sm btn-border">
                  Back
                </button>
              </Link>
              &nbsp;&nbsp;
              <button type="submit" className="btn btn-button btn-sm">
                <span className="fw-medium">Update</span>
              </button>
            </div>
          </div>
          <div className="container-fluid px-4">
            <div className="row">
              <div className="col-md-6 col-12 mb-4">
                <label className="form-label m-0">
                  Current Course <span className="text-danger">*</span>
                </label>
                <select
                  {...formik.getFieldProps("currentCourse")}
                  className={`form-select  ${
                    formik.touched.currentCourse && formik.errors.currentCourse
                      ? "is-invalid"
                      : ""
                  }`}
                  onChange={handleCourseChange}
                >
                  <option disabled></option>
                  {courseData &&
                    courseData.map((course) => (
                      <option key={course.id} value={course.id}>
                        {course.courseNames}
                      </option>
                    ))}
                </select>
                {formik.touched.currentCourse &&
                  formik.errors.currentCourse && (
                    <div className="invalid-feedback">
                      {formik.errors.currentCourse}
                    </div>
                  )}
              </div>

              <div className="col-md-6 col-12 mb-4">
                <lable className="form-lable">
                  Current Class<span className="text-danger">*</span>
                </lable>
                <select
                  {...formik.getFieldProps("currentClass")}
                  className={`form-select  ${
                    formik.touched.currentClass && formik.errors.currentClass
                      ? "is-invalid"
                      : ""
                  }`}
                  // onChange={handleClassChange}
                >
                  <option selected></option>
                  {classData &&
                    classData.map((classes) => (
                      <option key={classes.id} value={classes.id}>
                        {classes.classNames}
                      </option>
                    ))}
                </select>
                {formik.touched.currentClass && formik.errors.currentClass && (
                  <div className="invalid-feedback">
                    {formik.errors.currentClass}
                  </div>
                )}
              </div>

              <div className="col-md-6 col-12 mb-2">
                <lable className="form-lable">
                  Last Lesson Date<span className="text-danger">*</span>
                </lable>
                <div className="input-group mb-3">
                  <input
                    type="date"
                    className={`form-control  ${
                      formik.touched.lastLessonDate &&
                      formik.errors.lastLessonDate
                        ? "is-invalid"
                        : ""
                    }`}
                    aria-describedby="basic-addon1"
                    {...formik.getFieldProps("lastLessonDate")}
                  />
                  {formik.touched.lastLessonDate &&
                    formik.errors.lastLessonDate && (
                      <div className="invalid-feedback">
                        {formik.errors.lastLessonDate}
                      </div>
                    )}
                </div>
              </div>
              <div className="col-md-6 col-12 mb-2">
                <lable className="form-lable">
                  Reason<span className="text-danger">*</span>
                </lable>
                <select
                  {...formik.getFieldProps("reason")}
                  className={`form-select    ${
                    formik.touched.reason && formik.errors.reason
                      ? "is-invalid"
                      : ""
                  }`}
                  aria-label="Default select example"
                >
                  <option selected></option>
                  <option value="Withdraw">Withdraw</option>
                  <option value="Graduate ">Graduate</option>
                </select>
                {formik.touched.reason && formik.errors.reason && (
                  <div className="invalid-feedback">{formik.errors.reason}</div>
                )}
              </div>
            </div>
            <div className=" mb-4">
              <lable className="form-lable">
                Other Reason<span className="text-danger">*</span>
              </lable>

              <textarea
                className={`form-control   ${
                  formik.touched.otherReason && formik.errors.otherReason
                    ? "is-invalid"
                    : ""
                }`}
                {...formik.getFieldProps("otherReason")}
              ></textarea>
              {formik.touched.otherReason && formik.errors.otherReason && (
                <div className="invalid-feedback">
                  {formik.errors.otherReason}
                </div>
              )}
            </div>
            <div className=" mb-4">
              <lable className="form-lable">
                Centre Remark<span className="text-danger">*</span>
              </lable>

              <textarea
                className={`form-control   ${
                  formik.touched.centerRemark && formik.errors.centerRemark
                    ? "is-invalid"
                    : ""
                }`}
                {...formik.getFieldProps("centerRemark")}
              ></textarea>
              {formik.touched.centerRemark && formik.errors.centerRemark && (
                <div className="invalid-feedback">
                  {formik.errors.centerRemark}
                </div>
              )}
            </div>
            <div className=" mb-4">
              <lable className="form-lable">
                Parent Remark<span className="text-danger">*</span>
              </lable>

              <textarea
                className={`form-control   ${
                  formik.touched.parentRemark && formik.errors.parentRemark
                    ? "is-invalid"
                    : ""
                }`}
                {...formik.getFieldProps("parentRemark")}
              ></textarea>
              {formik.touched.parentRemark && formik.errors.parentRemark && (
                <div className="invalid-feedback">
                  {formik.errors.parentRemark}
                </div>
              )}
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default StudentEndClass;
