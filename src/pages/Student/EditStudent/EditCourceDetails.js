import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useState,
} from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import api from "../../../config/URL";
import { toast } from "react-toastify";
import fetchAllCoursesWithIds from "../../List/CourseList";

const validationSchema = Yup.object().shape({});

const EditCourseDetail = forwardRef(
  ({ formData, setLoadIndicators, handleNext }, ref) => {
    // console.log("FormData is ", formData.student_id)
    const [courseData, setCourseData] = useState(null);
    const userName  = localStorage.getItem('userName');


    const formik = useFormik({
      initialValues: {
        courseId: formData.courseId || "",
        startDate: formData.startDate || "",
        startTime: formData.startTime || "",
        courseDay: formData.courseDay || "",
        endDate: formData.endDate || "",
        endTime: formData.endTime || "",
        studentId: formData.id || "",
        updatedBy:userName,

      },
      validationSchema: validationSchema,
      onSubmit: async (data) => {
        console.log("Data is ", data);
        setLoadIndicators(true);
        try {
          if (data.courseDetailId !== null) {
            const response = await api.put(
              `/updateStudentCourseDetails/${data.courseDetailId}`,
              data,
              {
                headers: {
                  "Content-Type": "application/json",
                },
              }
            );
            if (response.status === 200) {
              toast.success(response.data.message);
              handleNext();
            } else {
              toast.error(response.data.message);
            }
          } else {
            const response = await api.post(
              `/createStudentCourseDetails`,
              data,
              {
                headers: {
                  "Content-Type": "application/json",
                },
              }
            );
            if (response.status === 201) {
              toast.success(response.data.message);
              handleNext();
            } else {
              toast.error(response.data.message);
            }
          }
        } catch (error) {
          toast.error(error);
        } finally {
          setLoadIndicators(false);
        }
      },
    });

    const fetchData = async () => {
      try {
        const courseData = await fetchAllCoursesWithIds();
        setCourseData(courseData);
      } catch (error) {
        toast.error(error);
      }
    };

    const getData = async () => {
      try {
        const response = await api.get(`/getAllStudentById/${formData.id}`);
        console.log(response.data);
        if (
          response.data.studentCourseDetailModels &&
          response.data.studentCourseDetailModels.length > 0
        ) {
          formik.setValues({
            ...response.data.studentCourseDetailModels[0],
            courseDetailId: response.data.studentCourseDetailModels[0].id,
            startDate:
              response.data.studentCourseDetailModels[0].startDate.substring(
                0,
                10
              ),
            endDate:
              response.data.studentCourseDetailModels[0].endDate.substring(
                0,
                10
              ),

            courseDay:
              response.data.studentCourseDetailModels[0].courseDay.substring(
                0,
                10
              ),
          });
          // setData(response.data);
          // console.log("StudentDetails",response.data);
        } else {
          // If there are no emergency contacts, set default values or handle the case as needed
          formik.setValues({
            courseDetailId: null,
            courseId: "",
            startDate: "",
            startTime: "",
            parentSignature: null || "",
            courseDay: "",
            endDate: "",
            endTime: "",
          });
        }
      } catch (error) {
        // console.error("Error fetching data:", error);
      }
    };

    useEffect(() => {
      fetchData();
      getData();
    }, []);

    useImperativeHandle(ref, () => ({
      coursedetail: formik.handleSubmit,
    }));

    return (
      <div className="container-fluid">
         <form onSubmit={formik.handleSubmit} onKeyDown={(e) => {
          if (e.key === 'Enter' && !formik.isSubmitting) {
            e.preventDefault();  // Prevent default form submission
          }
        }}>
          <div className="border-0 mb-5">
            <div className="mb-5">
              <div className="border-0 my-2 px-2">
                <p class="headColor">Course Detail</p>
                <div className="container py-3">
                  <div className="row">
                    <div className="col-lg-6 col-md-6 col-12">
                      <div className="text-start">
                        <label htmlFor="" className="mb-1 fw-medium">
                          <small>Course</small>
                        </label>
                        <br />
                        <select
                          name="courseId"
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          value={formik.values.courseId}
                          className="form-select"
                        >
                          <option selected></option>
                          {courseData &&
                            courseData.map((courseId) => (
                              <option key={courseId.id} value={courseId.id}>
                                {courseId.courseNames}
                              </option>
                            ))}
                        </select>
                      </div>
                      <div className="text-start mt-2">
                        <label htmlFor="" className="mb-1 fw-medium">
                          <small>Start Date</small>
                        </label>
                        <br />
                        <input
                          className="form-control  form-contorl-sm"
                          name="startDate"
                          type="date"
                          // onFocus={(e) => e.target.showPicker()}
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          value={formik.values.startDate}
                        />
                      </div>
                      <div className="text-start mt-2">
                        <label htmlFor="" className="mb-1 fw-medium">
                          <small>Start Time</small>
                        </label>
                        <br />
                        <input
                          className="form-control"
                          type="time"
     
                          name="startTime"
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          value={formik.values.startTime}
                        />
                      </div>
                    </div>
                    <div className="col-lg-6 col-md-6 col-12 px-5">
                      <div className="text-start">
                        <label htmlFor="" className="mb-1 fw-medium">
                          <small>Course Day</small>
                        </label>
                        <br />
                        <select
                          {...formik.getFieldProps("courseDay")}
                          class={`form-select  ${
                            formik.touched.courseDay && formik.errors.courseDay
                              ? "is-invalid"
                              : ""
                          }`}
                        >
                          <option></option>
                          <option value="MONDAY">MONDAY</option>
                          <option value="TUESDAY">TUESDAY</option>
                          <option value="WEDNESDAY">WEDNESDAY</option>
                          <option value="THURSDAY">THURSDAY</option>
                          <option value="FRIDAY">FRIDAY</option>
                          <option value="SATURDAY">SATURDAY</option>
                          <option value="SUNDAY">SUNDAY</option>
                        </select>
                      </div>
                      <div className="text-start mt-2">
                        <label htmlFor="" className="mb-1 fw-medium">
                          <small>End Date</small>
                        </label>
                        <br />
                        <input
                          className="form-control  form-contorl-sm"
                          name="endDate"
                          type="date"
                          // onFocus={(e) => e.target.showPicker()}
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          value={formik.values.endDate}
                        />
                      </div>
                      <div className="text-start mt-2">
                        <label htmlFor="" className="mb-1 fw-medium">
                          <small>End Time</small>
                        </label>
                        <br />
                        <input
                          className="form-control "
                          type="time"
     
                          name="endTime"
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          value={formik.values.endTime}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    );
  }
);

export default EditCourseDetail;
