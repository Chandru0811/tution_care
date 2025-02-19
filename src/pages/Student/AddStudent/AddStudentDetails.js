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
import fetchAllRaceWithIds from "../../List/RaceList";
import fetchAllNationalityeWithIds from "../../List/NationalityAndCountryList";
import fetchAllStudentsWithIds from "../../List/StudentList";
import fetchAllLanguageWithIdsC from "../../List/LanguageList";

const validationSchema = Yup.object().shape({
  studentName: Yup.string().required("*Student Name is required"),
  dateOfBirth: Yup.date()
    .required("*Date of Birth is required")
    .max(
      new Date(new Date().setFullYear(new Date().getFullYear() - 1)),
      "*Date of Birth must be at least 1 year ago"
    ),
  studentEmail: Yup.string()
    .email("*Invalid Student Email")
    .required("*Student Email is required"),
  age: Yup.string().required("*Age is required"),
  gender: Yup.string().required("*Gender is required"),
  // schoolType: Yup.string().required("*School Type is required"),
  // schoolName: Yup.string().required("*School Name is required"),
  // allowMagazine: Yup.string().required("*Select a filed!"),
  // allowSocialMedia: Yup.string().required("*Select a filed"),
  // studentChineseName: Yup.string().required(
  //   "*Student Chinese Name is required"
  // ),
  file: Yup.mixed()
    .required("*File is required")
    .test(
      "max-file-name-length",
      "*File name must be at most 50 characters",
      (value) => !value || (value.name && value.name.length <= 50)
    ),
  // preAssessmentResult: Yup.string().required(
  //   "*Pre-Assessment Result is required!"
  // ),
  // medicalCondition: Yup.string().required(
  //   "*Medical Condition Result is required"
  // ),
  remark: Yup.string()
    .max(200, "*The maximum length is 200 characters")
    .notRequired(),
  // nationality: Yup.string().required("*Select a Nationality!"),
  languageId: Yup.string().required("*Primary Language is required"),
  // race: Yup.string().required("*Select a Race"),
});

const AddStudentDetails = forwardRef(
  ({ formData, setLoadIndicators, setFormData, handleNext }, ref) => {
    const [studentData, setStudentData] = useState(null);
    const [imagePreviewUrl, setImagePreviewUrl] = useState(null);
    const [raceData, setRaceData] = useState(null);
    const [languageData, setLanguageData] = useState(null);
    const [nationalityData, setNationalityData] = useState(null);
    const userName = localStorage.getItem("tmsuserName");
    const centerId = localStorage.getItem("tmscenterId");
    const center = localStorage.getItem("tmscenterName");

    // console.log("FormData is ", formData);

    const maxDate = new Date();
    maxDate.setFullYear(maxDate.getFullYear() - 1);

    const fetchData = async () => {
      try {
        // const centerData = await fetchAllCentersWithIds();
        // setCenterData(centerData);

        const studentData = await fetchAllStudentsWithIds();
        setStudentData(studentData);

        const raceData = await fetchAllRaceWithIds();
        setRaceData(raceData);

        const languageData = await fetchAllLanguageWithIdsC();
        setLanguageData(languageData);

        const nationality = await fetchAllNationalityeWithIds(centerId);
        setNationalityData(nationality);
      } catch (error) {
        toast.error(error);
      }
    };

    const calculateAge = (dob) => {
      if (!dob) return "0 years, 0 months"; // Default value if dob is not provided

      const birthDate = new Date(dob);
      const today = new Date();

      if (isNaN(birthDate.getTime())) return "0 years, 0 months"; // Handle invalid date

      let years = today.getFullYear() - birthDate.getFullYear();
      let months = today.getMonth() - birthDate.getMonth();

      if (months < 0) {
        years--;
        months += 12;
      }

      return `${years} years, ${months} months`;
    };

    const formik = useFormik({
      initialValues: {
        centerId: centerId || "",
        studentName: formData.studentName || "",
        studentEmail: formData.studentEmail || "",
        studentChineseName: formData.studentChineseName || "",
        file: null || "",
        age: formData.age || "",
        medicalCondition: formData.medicalCondition || "",
        dateOfBirth: formData.dateOfBirth || "",
        gender: formData.gender || "",
        schoolType: formData.schoolType || "",
        schoolName: formData.schoolName || "",
        preAssessmentResult: "No Assessment Performed" || "",
        race: formData.race || "",
        nationality: formData.nationality || "",
        languageId: formData.languageId || "",
        referByParent: formData.referByParent || "",
        referByStudent: formData.referByStudent || "",
        remark: formData.remark || "",
        allowMagazine: formData.allowMagazine || "",
        allowSocialMedia: formData.allowSocialMedia || "",
        createdby: userName,
      },
      validationSchema: validationSchema,
      onSubmit: async (values) => {
        setLoadIndicators(true);
        values.centerId = centerId;
        try {
          const formDatas = new FormData();

          // Add each data field manually to the FormData object
          formDatas.append("studentName", values.studentName);
          formDatas.append("studentEmail", values.studentEmail);
          formDatas.append("leadId", formData.LeadId || "");
          formDatas.append("studentChineseName", values.studentChineseName);
          formDatas.append("dateOfBirth", values.dateOfBirth);
          formDatas.append("age", values.age);
          formDatas.append("gender", values.gender);
          formDatas.append("medicalCondition", values.medicalCondition);
          formDatas.append("schoolType", values.schoolType);
          formDatas.append("schoolName", values.schoolName);
          formDatas.append("preAssessmentResult", values.preAssessmentResult);
          formDatas.append("race", values.race);
          formDatas.append("nationality", values.nationality || "");
          formDatas.append("referByParent", values.referByParent || "");
          formDatas.append("referByStudent", values.referByStudent || "");
          formDatas.append("remark", values.remark || "");
          formDatas.append("allowMagazine", values.allowMagazine);
          formDatas.append("allowSocialMedia", values.allowSocialMedia);
          formDatas.append("centerId", centerId);
          formDatas.append("center", center);
          formDatas.append("languageId", values.languageId);
          formDatas.append("groupName", values.groupName);
          formDatas.append("file", values.file);
          formDatas.append("createdBy", userName);

          // for (let [key, value] of formDatas.entries()) {
          //   console.log(`${key}: ${value}`);
          // }

          const response = await api.post(
            "/createStudentDetailsWithProfileImageLatest",
            formDatas,
            {
              headers: {
                "Content-Type": "multipart/form-data",
              },
            }
          );

          if (response.status === 201) {
            const student_id = response.data.student_id;
            const credentialsData = new FormData();
            credentialsData.append("studentId", student_id);

            await api.post("/sendStudentCredentials", credentialsData, {
              headers: {
                "Content-Type": "multipart/form-data",
              },
            });
            toast.success(response.data.message);
            setFormData((prv) => ({ ...prv, ...values, student_id }));
            handleNext();
          } else {
            toast.error(response.data.message);
          }
        } catch (error) {
          if (error?.response?.status === 409) {
            toast.warning(error?.response?.data?.message);
          } else {
            toast.error(error?.response?.data?.message);
          }
        } finally {
          setLoadIndicators(false);
        }
      },
      validateOnChange: false, // Enable validation on change
      validateOnBlur: true, // Enable validation on blur
    });

    // Function to scroll to the first error field
    const scrollToError = (errors) => {
      const errorField = Object.keys(errors)[0]; // Get the first error field
      const errorElement = document.querySelector(`[name="${errorField}"]`); // Find the DOM element
      if (errorElement) {
        errorElement.scrollIntoView({ behavior: "smooth", block: "center" });
        errorElement.focus(); // Set focus to the error element
      }
    };

    // Watch for form submit and validation errors
    useEffect(() => {
      if (formik.submitCount > 0 && Object.keys(formik.errors).length > 0) {
        scrollToError(formik.errors);
      }
    }, [formik.submitCount, formik.errors]);

    useEffect(() => {
      const getLeadDate = async () => {
        // console.log(formData.LeadId)
        if (formData.LeadId) {
          try {
            const response = await api.get(
              `/getAllLeadInfoById/${formData.LeadId}`
            );

            const leadData = response.data;
            formik.setValues({
              centerId: leadData.centerId || "",
              studentName: leadData.studentName || "",
              leadId: leadData.id || "",
              studentChineseName: leadData.studentChineseName || "",
              file: null || "",
              age: leadData.dateOfBirth
                ? calculateAge(leadData.dateOfBirth)
                : "0 years, 0 months",
              medicalCondition: leadData.medicalCondition || "",
              dateOfBirth: leadData.dateOfBirth.substring(0, 10) || "",
              gender: leadData.gender || "",
              schoolType: leadData.schoolType || "",
              schoolName: leadData.nameOfSchool || "",
              preAssessmentResult:
                leadData.gradeCategory || "No Assessment Performed",
              race: leadData.ethnicGroup || "",
              nationality: leadData.nationality || "",
              languageId: leadData.languageId || "",
              referByParent: leadData.referByParentName || "",
              referByStudent: leadData.referByStudentName || "",
              remark: leadData.remark || "",
              allowMagazine: leadData.allowMagazine || "",
              allowSocialMedia: leadData.allowSocialMedia || "",
            });
            // console.log("Lead Data:", response.data);
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
      if (formik.values.dateOfBirth) {
        formik.setFieldValue("age", calculateAge(formik.values.dateOfBirth));
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [formik.values.dateOfBirth]);

    useEffect(() => {
      fetchData();
    }, []);

    useImperativeHandle(ref, () => ({
      StudentDetails: formik.handleSubmit,
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
          <div className=" border-0 mb-5">
            <div className="mb-3">
              <p class="headColor">Student Details</p>
              <div className="container">
                <div className="row mt-3">
                  <div className="col-lg-6 col-md-6 col-12">
                    <div className="text-start mt-4">
                      <label htmlFor="" className="mb-1 fw-medium">
                        <small>Student Name</small>
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
                      <label htmlFor="" className="mb-1 fw-medium">
                        <small>Student Email</small>
                        <span className="text-danger">*</span>
                      </label>
                      <br />
                      <input
                        name="studentEmail"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.studentEmail}
                        className="form-control "
                        type="text"
                      />
                      {formik.touched.studentEmail &&
                        formik.errors.studentEmail && (
                          <div className="text-danger">
                            <small>{formik.errors.studentEmail}</small>
                          </div>
                        )}
                    </div>
                    <div className="text-start mt-4">
                      <label htmlFor="" className="mb-1 fw-medium">
                        <small>Date Of Birth</small>
                        <span className="text-danger">*</span>
                      </label>
                      <br />
                      <input
                        className="form-control  form-contorl-sm"
                        name="dateOfBirth"
                        type="date"
                        // onFocus={(e) => e.target.showPicker()}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.dateOfBirth}
                        // max={maxDate.toISOString().split("T")[0]}
                      />
                      {formik.touched.dateOfBirth &&
                        formik.errors.dateOfBirth && (
                          <div className="error text-danger ">
                            <small>{formik.errors.dateOfBirth}</small>
                          </div>
                        )}
                    </div>
                    <div className="text-start mt-4">
                      <label htmlFor="" className="mb-1 fw-medium">
                        <small>Gender</small>
                        <span className="text-danger">*</span>
                      </label>
                      <div className="mt-1">
                        <input
                          className="form-check-input mx-2"
                          type="radio"
                          name="gender"
                          value="Male"
                          checked={formik.values.gender === "Male"}
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                        />
                        <span style={{ color: "gray" }}>Male</span> &nbsp;&nbsp;
                        <input
                          className="form-check-input mx-2"
                          type="radio"
                          name="gender"
                          value="Female"
                          checked={formik.values.gender === "Female"}
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                        />
                        <span style={{ color: "gray" }}>Female</span>
                      </div>
                      {formik.touched.gender && formik.errors.gender && (
                        <div className="error text-danger">
                          <small>{formik.errors.gender}</small>
                        </div>
                      )}
                    </div>
                    {/* <div className="text-start mt-4">
                      <label htmlFor="" className="fw-medium">
                        <small>School Type</small>
                        <span className="text-danger">*</span>
                      </label>
                      <br />
                      <div className="mt-1">
                        <input
                          className="form-check-input mx-2"
                          type="radio"
                          name="schoolType"
                          value="CHILDCARE"
                          checked={formik.values.schoolType === "CHILDCARE"}
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                        />
                        <span style={{ color: "gray" }}>Childcare</span>{" "}
                        &nbsp;&nbsp;
                        <input
                          className="form-check-input mx-2"
                          type="radio"
                          name="schoolType"
                          value="KINDERGARTEN"
                          checked={formik.values.schoolType === "KINDERGARTEN"}
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                        />
                        <span style={{ color: "gray" }}>Kindergarten</span>{" "}
                        &nbsp;&nbsp;
                        <input
                          className="form-check-input mx-2"
                          type="radio"
                          name="schoolType"
                          value="OTHERS"
                          checked={formik.values.schoolType === "OTHERS"}
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                        />
                        <span style={{ color: "gray" }}>Others</span>
                      </div>
                      {formik.touched.schoolType &&
                        formik.errors.schoolType && (
                          <div className="error text-danger">
                            <small>{formik.errors.schoolType}</small>
                          </div>
                        )}
                    </div> */}
                    {/* <div className="text-start mt-4">
                      <label htmlFor="" className="mb-1 fw-medium">
                        <small>Pre-Assessment Result</small>
                      </label>
                      <br />
                      <input
                        className="form-control "
                        type="text"
                        name="preAssessmentResult"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.preAssessmentResult}
                        readOnly
                      />
                    </div> */}
                    <div className="text-start mt-4">
                      <label htmlFor="" className="mb-1 fw-medium">
                        <small>Nationality</small>
                      </label>
                      <select
                        name="nationality"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.nationality}
                        className="form-select"
                      >
                        <option selected></option>
                        {nationalityData &&
                          nationalityData.map((nationalityId) => (
                            <option
                              key={nationalityId.id}
                              value={nationalityId.nationality}
                            >
                              {nationalityId.nationality}
                            </option>
                          ))}
                      </select>
                      {formik.touched.nationality &&
                        formik.errors.nationality && (
                          <div className="error text-danger ">
                            <small>{formik.errors.nationality}</small>
                          </div>
                        )}
                    </div>
                    {/* <div className="text-start mt-4">
                      <label htmlFor="" className=" fw-medium">
                        <small>Refered By Parent</small>
                      </label>
                      <br />
                      <input
                        name="referByParent"
                        className="form-control"
                        type="text"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.referByParent}
                        readOnly
                      />
                      {formik.touched.referByParent &&
                        formik.errors.referByParent && (
                          <div className="error text-danger ">
                            <small>{formik.errors.referByParent}</small>
                          </div>
                        )}
                    </div> */}
                  </div>
                  <div className="col-lg-6 col-md-6 col-12 px-5">
                    <div className="text-start mt-4">
                      <label className="mb-1 fw-medium">
                        <small>
                          Student Chinese Name (put N/A if not applicable)
                          {/* <span className="text-danger">*</span> */}
                        </small>
                        &nbsp;
                      </label>
                      <br />
                      <input
                        className="form-control "
                        type="text"
                        name="studentChineseName"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.studentChineseName}
                      />
                      {formik.touched.studentChineseName &&
                        formik.errors.studentChineseName && (
                          <div className="text-danger">
                            <small>{formik.errors.studentChineseName}</small>
                          </div>
                        )}
                    </div>
                    <div className="text-start mt-4">
                      <label htmlFor="file" className="mb-1 fw-medium">
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
                      <label htmlFor="age" className="mb-1 fw-medium">
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
                        readOnly
                      />
                      {formik.touched.age && formik.errors.age && (
                        <div className="text-danger">
                          <small>{formik.errors.age}</small>
                        </div>
                      )}
                    </div>
                    <div className="text-start mt-4">
                      <label className="mb-1 fw-medium">
                        <small>Medical Condition</small>
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
                    {/* <div className="text-start mt-4">
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
                    </div> */}
                    {/* <div className="text-start mt-3">
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
                        className="form-select"
                      >
                        <option selected></option>
                        {raceData &&
                          raceData.map((raceId) => (
                            <option key={raceId.id} value={raceId.race}>
                              {raceId.race}
                            </option>
                          ))}
                      </select>
                      {formik.touched.race && formik.errors.race && (
                        <div className="error text-danger ">
                          <small>{formik.errors.race}</small>
                        </div>
                      )}
                    </div> */}
                    <div className="text-start mt-4">
                      <label htmlFor="" className="mb-1 fw-medium">
                        <small>Primary Language Spoken</small>
                        <span className="text-danger">*</span>
                      </label>
                      <br />
                      <select
                        name="languageId"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.languageId}
                        className="form-select"
                      >
                        <option selected></option>
                        {languageData &&
                          languageData.map((languageId) => (
                            <option key={languageId.id} value={languageId.id}>
                              {languageId.languageName}
                            </option>
                          ))}
                      </select>
                      {formik.touched.languageId &&
                        formik.errors.languageId && (
                          <div className="error text-danger ">
                            <small>{formik.errors.languageId}</small>
                          </div>
                        )}
                    </div>
                    {/* <div className="text-start mt-4">
                      <label htmlFor="" className="mb-1 fw-medium">
                        <small>Refer By Student</small>
                      </label>
                      <br />
                      <input
                        className="form-control "
                        type="text"
                        name="referByStudent"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.referByStudent}
                        readOnly
                      />
                      {formik.touched.referByStudent &&
                        formik.errors.referByStudent && (
                          <div className="error text-danger ">
                            <small>{formik.errors.referByStudent}</small>
                          </div>
                        )}
                    </div> */}
                  </div>
                </div>
                <div className="text-start mt-4">
                  <label htmlFor="" className="mb-1 fw-medium">
                    <small>Remark</small>
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
                    maxLength={200}
                  />
                  {formik.touched.remark && formik.errors.remark && (
                    <div className="error text-danger">
                      <small>{formik.errors.remark}</small>
                    </div>
                  )}
                </div>

                {/* <div className="mb-5">
                </div> */}
              </div>
            </div>
          </div>
        </form>
      </div>
    );
  }
);
export default AddStudentDetails;
