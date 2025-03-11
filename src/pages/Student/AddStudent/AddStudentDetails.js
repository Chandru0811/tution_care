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
import { useJsApiLoader } from "@react-google-maps/api";

const appConfigInfo = JSON.parse(localStorage.getItem("tmsappConfigInfo"));
const libraries = ["places"];
const AddStudentDetails = forwardRef(
  ({ formData, setLoadIndicators, setFormData, handleNext, navigate }, ref) => {
    const { isLoaded } = useJsApiLoader({
      googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
      libraries,
    });
    const [studentData, setStudentData] = useState(null);
    const [imagePreviewUrl, setImagePreviewUrl] = useState(null);
    const [raceData, setRaceData] = useState(null);
    const [languageData, setLanguageData] = useState(null);
    const [nationalityData, setNationalityData] = useState([]);
    const userName = localStorage.getItem("tmsuserName");
    const centerId = localStorage.getItem("tmscenterId");
    const center = localStorage.getItem("tmscenterName");
    const studentId = formData.student_id;
    const [centreData, setCentreData] = useState([]);
    console.log("isGeoFenceForStudent", centreData?.isGeoFenceForStudent);
    const maxDate = new Date();
    maxDate.setFullYear(maxDate.getFullYear() - 1);

    const fetchData = async () => {
      try {
        const studentData = await fetchAllStudentsWithIds();
        setStudentData(studentData);
        const raceData = await fetchAllRaceWithIds();
        setRaceData(raceData);
        const languageData = await fetchAllLanguageWithIdsC();
        setLanguageData(languageData);
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

    const validationSchema = Yup.object().shape({
      studentName: Yup.string().required("Name is required"),
      dateOfBirth: Yup.date()
        .required("*Date of Birth is required")
        .max(
          new Date(new Date().setFullYear(new Date().getFullYear() - 1)),
          "*Date of Birth must be at least 1 year ago"
        ),
      studentEmail: Yup.string()
        .email("*Invalid Email")
        .required(" Email is required"),
      age: Yup.string().required("*Age is required"),
      gender: Yup.string().required("*Gender is required"),
      file: Yup.mixed()
        .required("*File is required")
        .test(
          "max-file-name-length",
          "*File name must be at most 50 characters",
          (value) => !value || (value.name && value.name.length <= 50)
        ),
      remark: Yup.string()
        .max(200, "*The maximum length is 200 characters")
        .notRequired(),
      languageId: Yup.string().required("*Primary Language is required"),
      postalCode: Yup.string().when([], {
        is: () => centreData?.isGeoFenceForStudent,
        then: (schema) => schema.required("*Postal Code is required"),
        otherwise: (schema) => schema.notRequired(),
      }),
      address: Yup.string().when([], {
        is: () => centreData?.isGeoFenceForStudent,
        then: (schema) => schema.required("*Address is required"),
        otherwise: (schema) => schema.notRequired(),
      }),
    });

    const formik = useFormik({
      initialValues: {
        centerId: centerId || "",
        studentName: formData.studentName || "",
        studentEmail: formData.studentEmail || "",
        studentChineseName: formData.studentChineseName || "",
        file: formData.file || "",
        age: formData.age || "",
        medicalCondition: formData.medicalCondition || "",
        dateOfBirth: formData.dateOfBirth || "",
        gender: formData.gender || "",
        preAssessmentResult: "No Assessment Performed" || "",
        race: formData.race || "",
        nationality: formData.nationality || "",
        languageId: formData.languageId || "",
        referByParent: formData.referByParent || "",
        referByStudent: formData.referByStudent || "",
        remark: formData.remark || "",
        address: formData.address || "",
        postalCode: formData.postalCode || "",
        longitude: "",
        lattitude: "",
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
          formDatas.append("nationality", values.nationality || "");
          formDatas.append("referByParent", values.referByParent || "");
          formDatas.append("referByStudent", values.referByStudent || "");
          formDatas.append("remark", values.remark || "");
          formDatas.append("centerId", centerId);
          formDatas.append("center", center);
          formDatas.append("languageId", values.languageId);
          formDatas.append("groupName", values.groupName);
          formDatas.append("file", values.file);
          formDatas.append("createdBy", userName);
          formDatas.append("lattitude", values.lattitude);
          formDatas.append("longitude", values.longitude);
          formDatas.append("address", values.address);
          formDatas.append("postalCode", values.postalCode);

          // for (let [key, value] of formDatas.entries()) {
          //   console.log(`${key}: ${value}`);
          // }
          let response;
          if (studentId === null || studentId === undefined) {
            response = await api.post(
              "/createStudentDetailsWithProfileImageLatest",
              formDatas,
              {
                headers: {
                  "Content-Type": "multipart/form-data",
                },
              }
            );
          } else {
            const updatedData = {
              studentName: values.studentName,
              studentEmail: values.studentEmail,
              studentChineseName: values.studentChineseName,
              dateOfBirth: values.dateOfBirth,
              age: values.age,
              gender: values.gender,
              medicalCondition: values.medicalCondition,
              nationality: values.nationality || "",
              referByParent: values.referByParent || "",
              referByStudent: values.referByStudent || "",
              remark: values.remark || "",
              centerId: centerId,
              center: center,
              languageId: values.languageId,
              groupName: values.groupName,
              createdBy: userName,
            };
            response = await api.put(
              `/updateStudentDetail/${studentId}`,
              updatedData,
              {
                headers: {
                  "Content-Type": "application/json",
                },
              }
            );
          }

          if (response.status === 201 || response.status === 200) {
            const student_id = response.data.student_id || studentId;
            if (response.data.student_id !== undefined) {
              const credentialsData = new FormData();
              credentialsData.append("studentId", student_id);

              await api.post("/sendStudentCredentials", credentialsData, {
                headers: {
                  "Content-Type": "multipart/form-data",
                },
              });
            }
            toast.success(response.data.message);
            setFormData((prv) => ({ ...prv, ...values, student_id }));
            if (navigate) {
              navigate("/student");
            } else {
              handleNext();
            }
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
              `/getLeadDynamicFormById/${formData.LeadId}`
            );

            const leadData = response.data;
            formik.setValues({
              centerId: centerId || "",
              studentName: leadData.name || "",
              studentEmail: leadData.email || "",
              leadId: leadData.id || "",
              studentChineseName: "",
              file: null || "",
              age: "",
              medicalCondition: "",
              dateOfBirth: leadData.dob || "",
              gender: leadData.gender || "",
              nationality: "",
              languageId: "",
              remark: leadData.remarks || "",
            });
            // console.log("Lead Data:", response.data);
          } catch (error) {
            console.error("Error fetching lead data:", error);
            // toast.error("Error fetching lead data");
          }
        }
      };
      getLeadDate();
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const fetchCoordinates = async (postalCode) => {
      if (!postalCode) return;

      const API_KEY = "AIzaSyCpzT4NCRo4A2-8s0pj8L-6L6LIdEGQkGU";
      const geoCodeURL = `https://maps.googleapis.com/maps/api/geocode/json?address=${postalCode}&key=${API_KEY}`;

      try {
        const response = await fetch(geoCodeURL);
        const data = await response.json();

        if (data.status !== "OK" || !data.results.length) {
          toast.error("Invalid postal code or no results found.");
          return;
        }

        const result = data.results[0];

        // Extract Address Components
        const addressComponents = result.address_components;
        const formattedAddress = result.formatted_address; // Full address
        const lattitude = result.geometry.location.lat;
        const longitude = result.geometry.location.lng;

        // Extracting City & State
        const city =
          addressComponents.find((comp) => comp.types.includes("locality"))
            ?.long_name || "";
        const state =
          addressComponents.find((comp) =>
            comp.types.includes("administrative_area_level_1")
          )?.long_name || "";
        const country =
          addressComponents.find((comp) => comp.types.includes("country"))
            ?.short_name || "";

        // Ensure the result is only from India (IN) or Singapore (SG)
        if (country !== "IN" && country !== "SG") {
          toast.error("Location must be in India or Singapore.");
          return;
        }
        formik.setFieldValue("postalCode", postalCode);
        formik.setFieldValue("address", formattedAddress); // Set full address
        formik.setFieldValue("lattitude", lattitude);
        formik.setFieldValue("longitude", longitude);
      } catch (error) {
        console.error("Error fetching coordinates:", error);
        toast.error("Error fetching coordinates. Please try again.");
      }
    };

    useEffect(() => {
      if (formik.values.dateOfBirth) {
        formik.setFieldValue("age", calculateAge(formik.values.dateOfBirth));
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [formik.values.dateOfBirth]);

    const centerData = async () => {
      try {
        const response = await api.get(`/getAllCenterById/${centerId}`);
        setCentreData(response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    const fetchNationalityData = async () => {
      try {
        const nationality = await api.get(`/getAllNationalityTypeWithCenterId/${centerId}`);
        setNationalityData(nationality.data);
      } catch (error) {
        toast.error(error);
      }
    };

    useEffect(() => {
      fetchData();
      centerData();
      fetchNationalityData();
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
              <p class="headColor">
                {appConfigInfo?.student || "Student"} Details
              </p>
              <div className="container">
                <div className="row mt-3">
                  <div className="col-lg-6 col-md-6 col-12">
                    <div className="text-start mt-4">
                      <label htmlFor="" className="mb-1 fw-medium">
                        <small>Name</small>
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
                        <small> Email</small>
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
                    {centreData?.isGeoFenceForStudent && (
                      <>
                        <div className="text-start mt-4">
                          <div className="form-group col-sm">
                            <label>Postal Code</label>
                            <span className="text-danger">*</span>
                            <input
                              className="form-control"
                              name="postalCode"
                              onChange={(e) => {
                                formik.handleChange(e);
                                if (
                                  e.target.value.length === 6 &&
                                  !isNaN(e.target.value) &&
                                  !e.target.value.includes(" ")
                                ) {
                                  fetchCoordinates(e.target.value);
                                  formik.setFieldValue(
                                    "address",
                                    formik.values.address || ""
                                  );
                                }
                              }}
                              onBlur={formik.handleBlur}
                              value={formik.values.postalCode}
                            />
                            {formik.touched.postalCode &&
                              formik.errors.postalCode && (
                                <div className="error text-danger">
                                  <small>{formik.errors.postalCode}</small>
                                </div>
                              )}
                          </div>
                        </div>
                        <div className="text-start mt-4">
                          <div className="form-group col-sm">
                            <label>Address</label>
                            <span className="text-danger">*</span>
                            <input
                              type="text"
                              className="form-control"
                              name="address"
                              onChange={formik.handleChange}
                              onBlur={formik.handleBlur}
                              value={formik.values.address}
                              readOnly
                            />
                            {formik.touched.address &&
                              formik.errors.address && (
                                <div className="error text-danger">
                                  <small>{formik.errors.address}</small>
                                </div>
                              )}
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                  <div className="col-lg-6 col-md-6 col-12 px-5">
                    <div className="text-start mt-4">
                      <label className="mb-1 fw-medium">
                        <small>Chinese Name (put N/A if not applicable)</small>
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
                    {(studentId === null || studentId === undefined) && (
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
                    )}

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
                    <input
                      type="hidden"
                      className="form-control"
                      name="la"
                      value={formik.values.la}
                    />
                    <input
                      type="hidden"
                      className="form-control"
                      name="lattitude"
                      value={formik.values.longitude}
                    />
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
