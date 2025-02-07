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

const validationSchema = Yup.object().shape({
  centerId: Yup.string().required("*Centre is required"),
  studentName: Yup.string().required("*Student Name is required"),
  dateOfBirth: Yup.date()
    .required("*Date of Birth is required")
    .max(new Date(), "*Date of Birth cannot be in the future"),
  age: Yup.string()
    .matches(/^\d+$/, "*Age is required")
    .required("*Age is required"),
  gender: Yup.string().required("*Gender is required"),
  schoolType: Yup.string().required("*School Type is required"),
  schoolName: Yup.string().required("*School Name is required"),
  allowMagazine: Yup.string().required("*Select a filed"),
  allowSocialMedia: Yup.string().required("*Select a filed"),
  studentChineseName: Yup.string().required(
    "*Student Chinese Name is required"
  ),
  // profileImage: Yup.string().required("*Select a Profile Image!"),
  preAssessmentResult: Yup.string().required(
    "*Pre-Assessment Result is required"
  ),
  medicalCondition: Yup.string().required(
    "*Medical Condition Result is required"
  ),
  nationality: Yup.string().required("*Select a Nationality"),
  remark: Yup.string()
    .notRequired()
    .max(200, "*The maximum length is 200 characters"),
  primaryLanguageSpokenEnglish: Yup.string().required(
    "*Primary Language is required"
  ),
  race: Yup.string().required("*Select a Race"),
  referByStudent: Yup.string().required("*Refer By Student is required"),
  referByParent: Yup.string().required("*Refer By Parent is required"),
});

const AddStudentDetails = forwardRef(
  ({ formData, setLoadIndicators, setFormData, handleNext }, ref) => {
    const [imagePreviewUrl, setImagePreviewUrl] = useState(null);
    const userName  = localStorage.getItem('userName');


    const formik = useFormik({
      initialValues: {
        centerId: formData.centerId || "",
        studentName: formData.studentName || "",
        studentChineseName: formData.studentChineseName || "",
        profileImage: null || "",
        age: formData.age || "",
        medicalCondition: formData.medicalCondition || "",
        dateOfBirth: formData.dateOfBirth || "",
        gender: formData.gender || "",
        schoolType: formData.schoolType || "",
        schoolName: formData.schoolName || "",
        preAssessmentResult: formData.preAssessmentResult || "",
        race: formData.race || "",
        nationality: formData.nationality || "",
        primaryLanguageSpokenEnglish: true,
        primaryLanguageSpokenChinese: false,
        referByParent: formData.referByParent || "",
        referByStudent: formData.referByStudent || "",
        remark: formData.remark || "",
        allowMagazine: false || "",
        allowSocialMedia: false || "",
        updatedBy:userName,

      },
      validationSchema: validationSchema,
      onSubmit: async (data) => {
        setLoadIndicators(true);
        setFormData((prv) => ({ ...prv, ...data }));
        console.log("Api Data:", data);
        try {
          const allowMagazine = data.allowMagazine === "Yes" ? true : false;
          const allowSocialMedia =
            data.allowSocialMedia === "Yes" ? true : false;
          const updatedData = {
            ...data,
            allowMagazine: allowMagazine,
            allowSocialMedia: allowSocialMedia,
          };
          // const formData = new FormData();
          // formData.append("profileImage", data.profileImage);

          const response = await api.put(
            `/updateStudentDetail/${formData.id}`,
            updatedData,
            {
              headers: {
                "Content-Type": "application/json",
              },
            }
          );
          if (response.status === 200) {
            toast.success(response.data.message);
            setFormData((prv) => ({ ...prv, ...data }));
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
      const getData = async () => {
        try {
          const response = await api.get(`/getAllStudentById/${formData.id}`);
          const { allowMagazine, allowSocialMedia, ...otherData } =
            response.data;
          const updatedValues = {
            ...otherData,
            allowMagazine: allowMagazine ? "Yes" : "No",
            allowSocialMedia: allowSocialMedia ? "Yes" : "No",
          };
          formik.setValues(updatedValues);
        } catch (error) {
          console.error("Error fetching data:", error);
        }
      };
      getData();
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useImperativeHandle(ref, () => ({
      EditDetails: formik.handleSubmit,
    }));

    return (
      <div className="container-fluid">
         <form onSubmit={formik.handleSubmit} onKeyDown={(e) => {
          if (e.key === 'Enter' && !formik.isSubmitting) {
            e.preventDefault();  // Prevent default form submission
          }
        }}>
          <div className=" border-0 mb-5">
            <div className="mb-3">
              <p class="headColor">Student Details</p>
              <div className="container">
                <div className="row mt-3">
          
                  <div className="col-lg-6 col-md-6 col-12 px-5">
                    <div className="text-start mt-2">
                      <label htmlFor="" className="mb-1 fw-medium">
                        <small>Student Name / as per ID</small>
                        <span className="text-danger">*</span>
                      </label>
                      <br />
                      <input
                        name="studentName"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.studentName}
                        className="form-control "
                        type="text"
                      />
                      {formik.touched.studentName &&
                        formik.errors.studentName && (
                          <div className="text-danger">
                            <small>{formik.errors.studentName}</small>
                          </div>
                        )}
                    </div>
                    <div className="text-start mt-4">
                      <label htmlFor="file" className="fw-medium">
                        <small>Profile Image</small>
                        <span className="text-danger">*</span>
                      </label>
                      <br />
                      <input
                        type="file"
                        name="file"
                        className="form-control"
                        onChange={(event) => {
                          const file = event.target.files[0];
                          formik.setFieldValue("file", file);
                          if (file) {
                            const previewUrl = URL.createObjectURL(file);
                            setImagePreviewUrl(previewUrl);
                          } else {
                            setImagePreviewUrl(null);
                          }
                        }}
                        onBlur={formik.handleBlur}
                        accept=".jpg, .jpeg, .png"
                      />
                      {formik.touched.file && formik.errors.file && (
                        <div className="error text-danger">
                          <small>{formik.errors.file}</small>
                        </div>
                      )}
                      {imagePreviewUrl && (
                        <div className="mt-3">
                          <img
                            src={imagePreviewUrl}
                            alt="Profile Preview"
                            className="w-25"
                          />
                        </div>
                      )}
                    </div>
                    <div className="text-start mt-4">
                      <label htmlFor="" className=" fw-medium">
                        <small>Age</small>
                        <span className="text-danger">*</span>
                      </label>
                      <br />
                      <input
                        className="form-control "
                        type="text"
                        name="age"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.age}
                      />
                      {formik.touched.age && formik.errors.age && (
                        <div className="text-danger">
                          <small>{formik.errors.age}</small>
                        </div>
                      )}
                    </div>
                    <div className="text-start mt-4">
                      <label htmlFor="" className=" fw-medium">
                        <small>Medical Condition</small>
                        <span className="text-danger">*</span>
                      </label>
                      <br />
                      <input
                        className="form-control "
                        type="text"
                        name="medicalCondition"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.medicalCondition}
                      />
                      {formik.touched.medicalCondition &&
                        formik.errors.medicalCondition && (
                          <div className="error text-danger ">
                            <small>{formik.errors.medicalCondition}</small>
                          </div>
                        )}
                    </div>
                    <div className="text-start mt-4">
                      <label htmlFor="" className="mb-1 fw-medium">
                        <small>School Name</small>
                        <span className="text-danger">*</span>
                      </label>
                      <br />
                      <input
                        name="schoolName"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.schoolName}
                        className="form-control "
                        type="text"
                      />
                      {formik.touched.schoolName &&
                        formik.errors.schoolName && (
                          <div className="text-danger">
                            <small>{formik.errors.schoolName}</small>
                          </div>
                        )}
                    </div>
                    <div className="text-start mt-3">
                      <label className="mb-1 fw-medium">
                        <small>Race</small>
                        <span className="text-danger">*</span>
                      </label>
                      <br />
                      <select
                        name="race"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.race}
                        className="form-select "
                        aria-label=". example"
                      >
                        <option selected></option>
                        <option value="Chinese">Chinese</option>
                        <option value="Malay">Malay</option>
                        <option value="Indian ">Indian </option>
                        <option value="Eurasian ">Eurasian </option>
                      </select>
                      {formik.touched.race && formik.errors.race && (
                        <div className="error text-danger ">
                          <small>{formik.errors.race}</small>
                        </div>
                      )}
                    </div>
                    <div className="text-start mt-4">
                      <label htmlFor="" className=" fw-medium">
                        <small>Primary Language Spoken</small>
                        <span className="text-danger">*</span>
                      </label>
                      <br />
                      <input
                        className="form-control"
                        type="text"
                        name="primaryLanguageSpokenEnglish"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.primaryLanguageSpokenEnglish}
                      />
                      {formik.touched.primaryLanguageSpokenEnglish &&
                        formik.errors.primaryLanguageSpokenEnglish && (
                          <div className="error text-danger ">
                            <small>
                              {formik.errors.primaryLanguageSpokenEnglish}
                            </small>
                          </div>
                        )}
                    </div>
                    <div className="text-start mt-4">
                      <label htmlFor="" className="mb-1 fw-medium">
                        <small>Refer By Student</small>
                        <span className="text-danger">*</span>
                      </label>
                      <br />
                      <input
                        name="referByStudent"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.referByStudent}
                        className="form-control"
                      />
                      {formik.touched.referByStudent &&
                        formik.errors.referByStudent && (
                          <div className="error text-danger ">
                            <small>{formik.errors.referByStudent}</small>
                          </div>
                        )}
                    </div>
                  </div>
                </div>
                <div className="text-start mt-4">
                  <label htmlFor="" className="mb-1 fw-medium">
                    <small>Remark</small>
                    <span className="text-danger">*</span>
                  </label>
                  <br />
                  <textarea
                    name="remark"
                    className="form-control "
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.remark}
                    type="text"
                    style={{
                      height: "7rem",
                    }}
                  />
                  {formik.touched.remark && formik.errors.remark && (
                    <div className="error text-danger ">
                      <small>{formik.errors.remark}</small>
                    </div>
                  )}
                </div>

                <div className="mb-5">
                  <div className="row mt-5">
                    <h6 className="text-start" style={{ color: "#ff7500" }}>
                      Videography/Photography
                    </h6>
                    <div className="col-lg-6 col-sm-12 mt-3 ps-4">
                      <label>
                        <small>
                          <b>
                            Allow display in Facility Bulletin / Magazine /
                            Advert
                          </b>
                        </small>
                        <span className="text-danger">*</span>
                        <div className="text-start mt-2">
                          <input
                            className="form-check-input mx-2"
                            type="radio"
                            name="allowMagazine"
                            value="yes"
                            checked={formik.values.allowMagazine === "yes"}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                          />
                          &nbsp; Yes &nbsp;&nbsp;&nbsp;
                          <input
                            className="form-check-input mx-2"
                            type="radio"
                            name="allowMagazine"
                            value="No"
                            checked={formik.values.allowMagazine === "No"}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                          />
                          &nbsp; No
                          {formik.touched.allowMagazine &&
                            formik.errors.allowMagazine && (
                              <div className="error text-danger">
                                <small>{formik.errors.allowMagazine}</small>
                              </div>
                            )}
                        </div>
                      </label>
                    </div>
                    <div className="col-lg-6 col-sm-12 mt-3">
                      <label>
                        <small>
                          <b>Allow display on Social Media</b>
                        </small>
                        <span className="text-danger">*</span>
                        <div className="text-start mt-2">
                          <input
                            className="form-check-input mx-2"
                            type="radio"
                            name="allowSocialMedia"
                            value="yes"
                            checked={formik.values.allowSocialMedia === "yes"}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                          />
                          &nbsp; Yes &nbsp;&nbsp;&nbsp;
                          <input
                            className="form-check-input mx-2"
                            type="radio"
                            name="allowSocialMedia"
                            value="No"
                            checked={formik.values.allowSocialMedia === "No"}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                          />
                          &nbsp; No
                          {formik.touched.allowSocialMedia &&
                            formik.errors.allowSocialMedia && (
                              <div className="error text-danger">
                                <small>{formik.errors.allowSocialMedia}</small>
                              </div>
                            )}
                        </div>
                      </label>
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
export default AddStudentDetails;
