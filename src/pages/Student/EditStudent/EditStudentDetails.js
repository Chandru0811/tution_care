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
const storedConfigure = JSON.parse(
  localStorage.getItem("tmsappConfigInfo") || "{}"
);

const EditStudentDetails = forwardRef(
  ({ formData, setLoadIndicators, setFormData, handleNext, navigate }, ref) => {
    const [studentData, setStudentData] = useState(null);
    const [raceData, setRaceData] = useState(null);
    const [nationalityData, setNationalityData] = useState(null);
    const [languageData, setLanguageData] = useState(null);

    const userName = localStorage.getItem("tmsuserName");
    const centerId = localStorage.getItem("tmscenterId");
    const [centreData, setCentreData] = useState([]);
    console.log("isGeoFenceForTeacher", centreData?.isGeoFenceForTeacher);
    const validationSchema = Yup.object().shape({
      studentName: Yup.string().required(
        `*${storedConfigure?.student || "Student"} Name is required`
      ),
      dateOfBirth: Yup.date()
        .required("*Date of Birth is required")
        .max(new Date(), "*Date of Birth cannot be in the future"),
      age: Yup.string().required("*Age is required"),
      gender: Yup.string().required("*Gender is required"),
      studentEmail: Yup.string()
        .email(`*Invalid ${storedConfigure?.student || "Student"} Email`)
        .required(
          `*${storedConfigure?.student || "Student"} Email is required`
        ),
      remark: Yup.string()
        .max(200, "*The maximum length is 200 characters")
        .notRequired(),
      primaryLanguage: Yup.string().required("*Primary Language is required"),
      postalCode: Yup.string().when([], {
        is: () => centreData?.isGeoFenceForTeacher,
        then: (schema) => schema.required("*Postal Code is required"),
        otherwise: (schema) => schema.notRequired(),
      }),
      address: Yup.string().when([], {
        is: () => centreData?.isGeoFenceForTeacher,
        then: (schema) => schema.required("*Address is required"),
        otherwise: (schema) => schema.notRequired(),
      }),
    });

    const fetchData = async () => {
      try {
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
      const birthDate = new Date(dob);
      const today = new Date();

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
        primaryLanguage: true,
        referByParent: formData.referByParent || "",
        referByStudent: formData.referByStudent || "",
        address: formData.address || "",
        postalCode: formData.postalCode || "",
        lattitude: formData.lattitude || "",
        longitude: formData.longitude || "",
        remark: formData.remark || "",
        allowMagazine: true || "",
        allowSocialMedia: true || "",
        updatedBy: userName,
      },
      validationSchema: validationSchema,
      onSubmit: async (data) => {
        setLoadIndicators(true);
        setFormData((prv) => ({ ...prv, ...data }));
        try {
          const updatedData = {
            ...data,
            allowMagazine: data.allowMagazine === true, // Ensure boolean
            allowSocialMedia: data.allowSocialMedia === true, // Ensure boolean
          };

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
            if (navigate) {
              navigate("/student");
            } else {
              handleNext();
            }
          } else {
            toast.error(response.data.message);
          }
        } catch (error) {
          toast.error(error);
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

    const centerData = async () => {
      try {
        const response = await api.get(`/getAllCenterById/${centerId}`);
        setCentreData(response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    useEffect(() => {
      const getData = async () => {
        try {
          const response = await api.get(`/getAllStudentById/${formData.id}`);
          const { allowMagazine, allowSocialMedia, ...otherData } =
            response.data;
          const updatedValues = {
            ...otherData,
            allowMagazine: allowMagazine === true, // Ensure it's strictly boolean
            allowSocialMedia: allowSocialMedia === true, // Ensure it's strictly boolean
          };

          formik.setValues(updatedValues);
        } catch (error) {
          console.error("Error fetching data:", error);
        }
      };
      getData();
      fetchData();
      centerData();
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
    }, [formik.values.dateOfBirth]);

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
                {storedConfigure?.student || "Student"} Details
              </p>
              <div className="container-fluid">
                <div className="row mt-3">
                  <div className="col-lg-6 col-md-6 col-12">
                    <div className="text-start mt-2">
                      <label htmlFor="" className="mb-1 fw-medium">
                        <small>
                          {storedConfigure?.student || "Student"} Name / as per
                          ID
                        </small>
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
                        <small>
                          {storedConfigure?.student || "Student"} Email
                        </small>
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
                      <br />
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
                      <br />
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
                          <div className="error text-danger">
                            <small>{formik.errors.nationality}</small>
                          </div>
                        )}
                    </div>
                    {centreData?.isGeoFenceForStudent && (
                      <>
                        <div className="col-md-6 col-12 mb-3">
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
                      </>
                    )}
                  </div>
                  <div className="col-lg-6 col-md-6 col-12 px-5">
                    <div className="text-start mt-4">
                      <label className=" fw-medium">
                        <small>
                          {storedConfigure?.student || "Student"} Chinese Name
                          (put N/A if not applicable)
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
                      <label htmlFor="" className=" fw-medium">
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
                        readOnly
                      />
                      {formik.touched.age && formik.errors.age && (
                        <div className="text-danger">
                          <small>{formik.errors.age}</small>
                        </div>
                      )}
                    </div>
                    <div className="text-start mt-4">
                      <label htmlFor="" className=" fw-medium">
                        <small>Primary Language Spoken</small>
                        <span className="text-danger">*</span>
                      </label>
                      <br />
                      <select
                        name="primaryLanguage"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.primaryLanguage}
                        className="form-select"
                      >
                        <option selected></option>
                        {languageData &&
                          languageData.map((languageId) => (
                            <option
                              key={languageId.id}
                              value={languageId.language}
                            >
                              {languageId.languageName}
                            </option>
                          ))}
                      </select>
                      {formik.touched.primaryLanguage &&
                        formik.errors.primaryLanguage && (
                          <div className="error text-danger ">
                            <small>{formik.errors.primaryLanguage}</small>
                          </div>
                        )}
                    </div>
                    {centreData?.isGeoFenceForStudent && (
                      <>
                        <div className="col-md-6 col-12 mb-3">
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
export default EditStudentDetails;
