import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useState,
} from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";
import api from "../../../config/URL";
import fetchAllStudentListByCenter from "../../List/StudentListByCenter";

const validationSchema = Yup.object().shape({});

const Addrelation = forwardRef(
  ({ formData, setLoadIndicators, setFormData, handleNext }, ref) => {
    const [studentData, setStudentData] = useState(null);
    const userName = localStorage.getItem("tmsuserName");
    const centerId = localStorage.getItem("tmscenterId");

    const fetchStudent = async () => {
      try {
        const student = await fetchAllStudentListByCenter(centerId);
        setStudentData(student);
      } catch (error) {
        toast.error(error);
      }
    };

    const formik = useFormik({
      initialValues: {
        studentRelationCenter: formData.studentRelationCenter || "",
        centerId: formData.studentRelationCenter || "",
        studentRelation: formData.studentRelation || "",
        studentRelationStudentName: formData.studentRelationStudentName || "",
        createdBy: userName,
      },
      validationSchema: validationSchema,
      onSubmit: async (data) => {
        setLoadIndicators(true);
        try {
          const requestData = { ...data, studentId: formData.student_id };
          const response = await api.post(
            `/createStudentRelations`,
            requestData,
            {
              headers: {
                "Content-Type": "application/json",
              },
            }
          );
          if (response.status === 201) {
            toast.success(response.data.message);
            setFormData((prv) => ({ ...prv, ...data }));
            // console.log("Form data is ",formData)
            handleNext();
          } else {
            toast.error(response.data.message);
          }
        } catch (error) {
          toast.error(error);
        } finally {
          setLoadIndicators(false);
        }
      },
    });

    useEffect(() => {
      const getLeadDate = async () => {
        if (formData.LeadId) {
          try {
            const response = await api.get(
              `/getLeadDynamicFormById/${formData.LeadId}`
            );

            const leadData = response.data;
            formik.setValues({
              studentRelationCenter: leadData.centerId || "",
              studentRelation: leadData.studentRelation || "",
              studentRelationStudentName: "Father",
            });
            console.log("Lead Data:", response.data);
          } catch (error) {
            console.error("Error fetching lead data:", error);
            toast.error("Error fetching lead data");
          }
        }
      };
      getLeadDate();
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
      fetchStudent();
    }, []);

    useImperativeHandle(ref, () => ({
      StudentRelation: formik.handleSubmit,
    }));

    return (
      <div className="container-fluid">
        <form
          onSubmit={formik.handleSubmit}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !formik.isSubmitting) {
              e.preventDefault(); // Prevent default form submission
            }
          }}
        >
          <div className="border-0 mb-5">
            <div className="mb-5">
              <div className="border-0 my-2 px-2">
                <p class="headColor">Student Relation</p>
                <div className="container py-3">
                  <div className="row">
                    <div className="col-lg-6 col-md-6 col-12">
                      <label htmlFor="" className="mb-1 fw-medium">
                        <small>Student Name</small>
                      </label>
                      <br />
                      <input
                        className="form-control"
                        type="text"
                        name="studentRelationStudentName"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.studentRelationStudentName}
                      />
                      {/* <select
                        {...formik.getFieldProps("studentRelationStudentName")}
                        className={`form-select ${
                          formik.touched.studentRelationStudentName &&
                          formik.errors.studentRelationStudentName
                            ? "is-invalid"
                            : ""
                        }`}
                      >
                        <option selected></option>
                        {studentData &&
                          studentData.map((student) => (
                            <option
                              key={student.id}
                              value={student.id === formData.student_id}
                            >
                              {student.studentNames ? "" : student.studentNames}
                            </option>
                          ))}
                        {studentData &&
                          studentData
                            .filter(
                              (student) => student.id !== formData.student_id
                            ) // Filter students with matching id
                            .map((student) => (
                              <option key={student.id} value={student.id}>
                                {student.studentNames}{" "}
                              </option>
                            ))}
                      </select> */}
                      {formik.touched.studentRelationStudentName &&
                        formik.errors.studentRelationStudentName && (
                          <div className="text-danger">
                            <small>
                              {formik.errors.studentRelationStudentName}
                            </small>
                          </div>
                        )}
                    </div>
                    <div className="col-lg-6 col-md-6 col-12">
                      <label htmlFor="" className="mb-1 fw-medium">
                        <small>Relation</small>
                      </label>
                      <br />
                      <select
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.studentRelation}
                        className="form-select "
                        name="studentRelation"
                      >
                        <option value=""></option>
                        <option value="Mother">Mother</option>
                        <option value="Father">Father</option>
                        <option value="Brother">Brother</option>
                        <option value="Sister">Sister</option>
                      </select>
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
export default Addrelation;
