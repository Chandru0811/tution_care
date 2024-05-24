import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import api from "../../config/URL";
import { toast } from "react-toastify";
// import fetchAllCentersWithIds from "../List/CenterList";
// import fetchAllCoursesWithIds from "../List/CourseList";

function ClassAdd() {
  const navigate = useNavigate();
  const [centerData, setCenterData] = useState(null);
  const [courseData, setCourseData] = useState(null);
  const [loadIndicator, setLoadIndicator] = useState(false);

  const fetchData = async () => {
    // try {
    //   const centerData = await fetchAllCentersWithIds();
    //   const courseData = await fetchAllCoursesWithIds();
    //   setCenterData(centerData);
    //   setCourseData(courseData);
    // } catch (error) {
    //   toast.error(error);
    // }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const validationSchema = Yup.object({
    centerId: Yup.string().required("*Centre Name is required"),
    courseId: Yup.string().required("*Course Name is required"),
    className: Yup.string().required("*Class Name is required"),
    classType: Yup.string().required("*Class Type is required"),
    durationInHrs: Yup.number().required("*Duration is required"),
  });
  const formik = useFormik({
    initialValues: {
      centerId: "",
      courseId: "",
      className: "",
      classType: "",
      durationInHrs: "",
      remark: "",
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      setLoadIndicator(true);
      const selectedValue = formik.values.centerId; // Assuming formik is in scope
      let selectedOptionName = "";

      centerData.forEach((center) => {
        if (parseInt(selectedValue) === center.id) {
          selectedOptionName = center.centerNames || "--";
        }
      });

      values.centerName = selectedOptionName;

      console.log(values);

      try {
        const response = await api.post("/createCourseClassListings", values, {
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
        toast.error(error);
      } finally {
        setLoadIndicator(false);
      }
    },
  });

  return (
    <div className="container-fluid  center">
        <form onSubmit={formik.handleSubmit}>
          <div className="card shadow border-0 mb-2 top-header">
            <div className="my-3 d-flex justify-content-between">
              <div className="ms-3">
                <h2>Add Class</h2>
              </div>
              <div>
                <Link to="/class">
                  <button type="button " className="btn btn-sm btn-border">
                    Back
                  </button>
                </Link>
                &nbsp;&nbsp;
                <button
                  type="submit"
                  className="btn btn-button btn-sm me-3"
                  disabled={loadIndicator}
                >
                  {loadIndicator && (
                    <span
                      className="spinner-border spinner-border-sm me-2"
                      aria-hidden="true"
                    ></span>
                  )}
                  Save
                </button>
              </div>
            </div>
          </div>
          <div className="minHeight container card shadow border-0 mb-2 top-header p-5">
            <div className="row py-4">
              <div class="col-md-6 col-12 mb-4">
                <lable class="">
                  Centre<span class="text-danger">*</span>
                </lable>
                <select
                  {...formik.getFieldProps("centerId")}
                  name="centerId"
                  className={`form-select form-select-sm  ${
                    formik.touched.centerId && formik.errors.centerId
                      ? "is-invalid"
                      : ""
                  }`}
                  aria-label="Default select example"
                  class="form-select form-select-sm"
                >
                  <option selected></option>
                  {centerData &&
                    centerData.map((centerId) => (
                      <option key={centerId.id} value={centerId.id}>
                        {centerId.centerNames}
                      </option>
                    ))}
                </select>
                {formik.touched.centerId && formik.errors.centerId && (
                  <div className="invalid-feedback">
                    {formik.errors.centerId}
                  </div>
                )}
              </div>
              <div class="col-md-6 col-12 mb-4">
                <label>
                  Course<span class="text-danger">*</span>
                </label>
                <select
                  {...formik.getFieldProps("courseId")}
                  name="courseId"
                  className={`form-select form-select-sm  ${
                    formik.touched.courseId && formik.errors.courseId
                      ? "is-invalid"
                      : ""
                  }`}
                  aria-label="Default select example"
                  class="form-select form-select-sm"
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
                  Class Name<span class="text-danger">*</span>
                </label>
                <input
                  name="className"
                  class="form-control form-control-sm"
                  type="text"
                  className={`form-control form-control-sm ${
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
                <label>
                  Class Type<span class="text-danger">*</span>
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
                  Duration<span class="text-danger">*</span>
                </label>
                <select
                  {...formik.getFieldProps("durationInHrs")}
                  className={`form-select form-select-sm ${
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
                  <option value="1.00">1.00 hr</option>
                  <option value="1.30">1.30 hr</option>
                </select>
                {formik.touched.durationInHrs &&
                  formik.errors.durationInHrs && (
                    <div className="invalid-feedback">
                      {formik.errors.durationInHrs}
                    </div>
                  )}
              </div>
              <div class="col-md-6 col-12 mb-4">
                <label>Remark</label>
                <textarea
                  name="remark"
                  class="form-control form-control-sm"
                  type="text"
                  className={`form-control form-control-sm ${
                    formik.touched.remark && formik.errors.remark
                      ? "is-invalid"
                      : ""
                  }`}
                  {...formik.getFieldProps("remark")}
                />
                {formik.touched.remark && formik.errors.remark && (
                  <div className="invalid-feedback">{formik.errors.remark}</div>
                )}
              </div>
            </div>
          </div>
        </form>
      </div>
  );
}

export default ClassAdd;
