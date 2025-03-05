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
import fetchAllIDTypeWithIds from "../../List/IDTypeList";
import fetchAllNationality from "../../List/NationalityAndCountryList";
import { useJsApiLoader } from "@react-google-maps/api";

const libraries = ["places"];
const PersonalEdit = forwardRef(
  ({ formData, setLoadIndicators, setFormData, handleNext }, ref) => {
    const [idTypeData, setIdTypeData] = useState(null);
    const [nationalityData, setNationalityData] = useState(null);
    const userName = localStorage.getItem("tmsuserName");
    const centerId = localStorage.getItem("tmscenterId");
    const [roleData, setRoleData] = useState(null);

    const [centreData, setCentreData] = useState([]);
    console.log("isGeoFenceForTeacher", centreData?.isGeoFenceForTeacher);
    const { isLoaded } = useJsApiLoader({
      googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
      libraries,
    });
    const validationSchema = Yup.object().shape({
      teacherName: Yup.string().required("*Teacher Name is required"),
      role: Yup.string().required("*Role is required"),
      countryId: Yup.string().required("*Country is required"),
      dateOfBirth: Yup.date()
        .required("*Date of Birth is required")
        .max(new Date(), "*Date of Birth cannot be in the future"),
      idTypeId: Yup.string().required("*Id Type is required"),
      idNo: Yup.string().required("*Id No is required"),
      nationalityId: Yup.string().required("*Nationality is required"),
      citizenship: Yup.string().required("*Citizenship is required"),
      // file: Yup.mixed()
      //   .required("*Photo is required")
      //   .test(
      //     "max-file-name-length",
      //     "*File name must be at most 50 characters",
      //     (value) => !value || value.name.length <= 50
      //   ),
      status: Yup.string().required("*Status is required"),
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

    const formik = useFormik({
      initialValues: {
        teacherName: formData.teacherName || "",
        dateOfBirth: formData.dateOfBirth || "",
        idTypeId: formData.idTypeId || "",
        idNo: formData.idNo || "",
        nationalityId: formData.nationalityId || "",
        citizenship: formData.citizenship || "",
        photo: formData.photo || "",
        employeeType: null || null,
        countryId: formData.countryId,
        nationality: formData.nationality || "",
        status: formData.status || "",
        age: 0,
        shortIntroduction: formData.shortIntroduction || "",
        gender: formData.gender || "",
        email: formData.email || "",
        password: formData.password || "",
        roleId: formData.roleId || "",
        lattitude: formData.lattitude || "",
        longitude: formData.longitude || "",
        updatedBy: userName,
        postalCode: formData.postalCode || "", // Ensure it's included
        address: formData.address || "", // Ensure it's included
      },
      validationSchema: validationSchema,
      onSubmit: async (data) => {
        setLoadIndicators(true);
        try {
          const formDatas = new FormData();

          formDatas.append("teacherName", data.teacherName);
          formDatas.append("dateOfBirth", data.dateOfBirth);
          formDatas.append("idTypeId", data.idTypeId);
          formDatas.append("idNo", data.idNo);
          formDatas.append("nationalityId", data.nationalityId);
          formDatas.append("countryId", data.countryId);
          formDatas.append("citizenship", data.citizenship);
          formDatas.append("status", data.status);
          formDatas.append("gender", data.gender);
          formDatas.append("roleId", data.roleId);
          formDatas.append("shortIntroduction", data.shortIntroduction);
          formDatas.append("updatedBy", userName);
          formDatas.append("lattitude", data.lattitude);
          formDatas.append("longitude", data.longitude);
          formDatas.append("address", data.address);
          formDatas.append("postalCode", data.postalCode);
          const response = await api.put(
            `/updateUser/${formData.staff_id}`,
            formDatas,
            {
              headers: {
                "Content-Type": "multipart/form-data",
              },
            }
          );

          if (response.status === 200) {
            toast.success(response.data.message);
            setFormData((prev) => ({ ...prev, ...data }));
            handleNext();
          } else {
            toast.error(response.data.message);
          }
        } catch (error) {
          if (error?.response?.status === 409) {
            toast.warning("ID Number already exists!");
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
      const getData = async () => {
        try {
          const response = await api.get(
            `/getAllUserById/${formData.staff_id}`
          );
          const dateOfBirth = response.data.dateOfBirth.substring(0, 10);
          const role = response.data.roleId;
          setFormData((prev) => ({
            ...prev,
            ...response.data,
            roleId: role, // Include role in formData
          }));
          // console.log(response)
          formik.setValues({
            ...response.data,
            dateOfBirth: dateOfBirth,
            // shortIntroduction: formData.shortIntroduction || "",
          });
        } catch (error) {
          console.error("Error fetching data:", error);
        }
      };
      getData();
      window.scrollTo({ top: 0, left: 0, behavior: "instant" });
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const fetchIDTypeData = async () => {
      try {
        const idTypeData = await fetchAllIDTypeWithIds(centerId);
        setIdTypeData(idTypeData);
      } catch (error) {
        toast.error(error);
      }
    };

    const fetchCitizenShipData = async () => {
      try {
        const nationalityData = await fetchAllNationality(centerId);
        setNationalityData(nationalityData);
      } catch (error) {
        toast.error(error);
      }
    };
    const rolesData = async () => {
      try {
        const response = await api.get(`/getUserRolesByCenterId/${centerId}`);
        setRoleData(response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    const centerData = async () => {
      try {
        const response = await api.get(`/getAllCenterById/${centerId}`);
        setCentreData(response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    useEffect(() => {
      fetchIDTypeData();
      fetchCitizenShipData();
      rolesData();
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
        // Update form fields using Formik
        formik.setFieldValue("postalCode", postalCode);
        formik.setFieldValue("address", formattedAddress); // Set full address
        formik.setFieldValue("lattitude", lattitude);
        formik.setFieldValue("longitude", longitude);
      } catch (error) {
        console.error("Error fetching coordinates:", error);
        toast.error("Error fetching coordinates. Please try again.");
      }
    };

    useImperativeHandle(ref, () => ({
      personalEdit: formik.handleSubmit,
    }));

    return (
      <form
        onSubmit={formik.handleSubmit}
        onKeyDown={(e) => {
          if (e.key === "Enter" && !formik.isSubmitting) {
            e.preventDefault(); // Prevent default form submission
          }
        }}
      >
        <section>
          <div className="container-fluid">
            <p className="headColor my-4">Personal Information</p>
            <div className="row">
              <div className="col-md-6 col-12 mb-2 mt-3">
                <label>
                  Name<span className="text-danger">*</span>
                </label>
                <input
                  type="text"
                  className="form-control"
                  name="teacherName"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.teacherName}
                />
                {formik.touched.teacherName && formik.errors.teacherName && (
                  <div className="error text-danger ">
                    <small>{formik.errors.teacherName}</small>
                  </div>
                )}
              </div>
              <div className="col-md-6 col-12 mb-2 mt-3">
                <label>
                  Date Of Birth<span className="text-danger">*</span>
                </label>
                <input
                  type="date"
                  // onFocus={(e) => e.target.showPicker()}
                  name="dateOfBirth"
                  className="form-control"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.dateOfBirth}
                />
                {formik.touched.dateOfBirth && formik.errors.dateOfBirth && (
                  <div className="error text-danger ">
                    <small>{formik.errors.dateOfBirth}</small>
                  </div>
                )}
              </div>
              <div className="col-md-6 col-12 mb-2 mt-3">
                <label>ID Type</label>
                <span className="text-danger">*</span>
                <select
                  type="text"
                  className="form-select"
                  name="idTypeId"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.idTypeId}
                >
                  <option value=""></option>
                  {idTypeData &&
                    idTypeData.map((idTypeId) => (
                      <option key={idTypeId.id} value={idTypeId.id}>
                        {idTypeId.idType}
                      </option>
                    ))}
                </select>
                {formik.touched.idTypeId && formik.errors.idTypeId && (
                  <div className="error text-danger ">
                    <small>{formik.errors.idTypeId}</small>
                  </div>
                )}
              </div>
              <div className="col-md-6 col-12 mb-2 mt-3">
                <label>
                  ID No<span className="text-danger">*</span>
                </label>
                <input
                  type="text"
                  className="form-control"
                  name="idNo"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.idNo}
                />
                {formik.touched.idNo && formik.errors.idNo && (
                  <div className="error text-danger ">
                    <small>{formik.errors.idNo}</small>
                  </div>
                )}
              </div>
              <div className="col-md-6 col-12 mb-2 mt-3">
                <label>Country</label>
                <span className="text-danger">*</span>
                <select
                  className="form-select"
                  name="countryId"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.countryId}
                >
                  <option selected></option>
                  {nationalityData &&
                    nationalityData.map((countryId) => (
                      <option key={countryId.id} value={countryId.id}>
                        {countryId.country}
                      </option>
                    ))}
                </select>
                {formik.touched.countryId && formik.errors.countryId && (
                  <div className="error text-danger">
                    <small>{formik.errors.countryId}</small>
                  </div>
                )}
              </div>
              <div className="col-md-6 col-12 mb-2 mt-3">
                <label>Nationality</label>
                <span className="text-danger">*</span>
                <select
                  className="form-select"
                  name="nationalityId"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.nationalityId}
                >
                  <option selected></option>
                  {nationalityData &&
                    nationalityData.map((nationalityId) => (
                      <option key={nationalityId.id} value={nationalityId.id}>
                        {nationalityId.nationality}
                      </option>
                    ))}
                </select>
                {formik.touched.nationalityId &&
                  formik.errors.nationalityId && (
                    <div className="error text-danger">
                      <small>{formik.errors.nationalityId}</small>
                    </div>
                  )}
              </div>
              <div className="col-md-6 col-12 mb-2 mt-3">
                <label>Citizenship</label>
                <span className="text-danger">*</span>
                <select
                  className="form-select"
                  name="citizenship"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.citizenship}
                >
                  <option selected></option>
                  <option value="1st Year PR">1st Year PR</option>
                  <option value="2nd Year PR">2nd Year PR</option>
                  <option value="3rd Year PR">3rd Year PR</option>
                  {/* {nationalityData &&
                           nationalityData.map((citizenship) => (
                             <option
                               key={citizenship.id}
                               value={citizenship.citizenship}
                             >
                               {citizenship.citizenship}
                             </option>
                           ))} */}
                </select>
                {formik.touched.citizenship && formik.errors.citizenship && (
                  <div className="error text-danger">
                    <small>{formik.errors.citizenship}</small>
                  </div>
                )}
              </div>
              <div class="col-md-6 col-12 mb-2 mt-3">
                <div class="form-group col-sm">
                  <label>Status</label>
                  <span className="text-danger">*</span>
                  <select
                    type="text"
                    class="form-select"
                    name="status"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.status}
                  >
                    <option value=""></option>
                    <option value={"ACTIVE"}>Active</option>
                    <option value={"RESIGNED"}>Resigned</option>
                  </select>
                  {formik.touched.status && formik.errors.status && (
                    <div className="error text-danger ">
                      <small>{formik.errors.status}</small>
                    </div>
                  )}
                </div>
              </div>
              <div className="col-md-6 col-12 mb-2 mt-3">
                <label>
                  Gender<span className="text-danger">*</span>
                </label>
                <div className="d-flex mt-2 gap-3 mt-3">
                  <div className="form-check">
                    <input
                      type="radio"
                      className="form-check-input"
                      id="male"
                      name="gender"
                      value="Male"
                      checked={formik.values.gender === "Male"}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                    />

                    <label className="form-check-label" htmlFor="male">
                      Male
                    </label>
                  </div>
                  <div className="form-check">
                    <input
                      type="radio"
                      className="form-check-input"
                      id="female"
                      name="gender"
                      value="Female"
                      checked={formik.values.gender === "Female"}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                    />
                    <label className="form-check-label" htmlFor="female">
                      Female
                    </label>
                  </div>
                </div>
                {formik.touched.gender && formik.errors.gender ? (
                  <div className="error text-danger ">
                    <small>{formik.errors.gender}</small>
                  </div>
                ) : null}
              </div>
              <div class="col-md-6 col-12 mb-2 mt-3">
                <div class="form-group col-sm">
                  <label>Role</label>
                  <span className="text-danger">*</span>
                  <select
                    type="text"
                    class="form-select"
                    name="roleId"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.roleId}
                  >
                    <option selected></option>
                    {roleData &&
                      roleData.map((role) => (
                        <option key={role.id} value={role.id}>
                          {role.roleName}
                        </option>
                      ))}
                  </select>
                  {formik.touched.roleId && formik.errors.roleId && (
                    <div className="error text-danger ">
                      <small>{formik.errors.roleId}</small>
                    </div>
                  )}
                </div>
              </div>
              <input
                type="hidden"
                className="form-control"
                name="lattitude"
                value={formik.values.lattitude}
              />
              <input
                type="hidden"
                className="form-control"
                name="lattitude"
                value={formik.values.longitude}
              />
              {centreData?.isGeoFenceForTeacher && (
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
                      {formik.touched.address && formik.errors.address && (
                        <div className="error text-danger">
                          <small>{formik.errors.address}</small>
                        </div>
                      )}
                    </div>
                  </div>
                </>
              )}
            </div>
            <div className="row mt-2">
              <div className="col-12">
                <label>Short Introduction</label>
                <textarea
                  type="text"
                  className="form-control"
                  rows="4"
                  name="shortIntroduction"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.shortIntroduction}
                />
                {formik.touched.shortIntroduction &&
                  formik.errors.shortIntroduction && (
                    <div className="error text-danger ">
                      <small>{formik.errors.shortIntroduction}</small>
                    </div>
                  )}
              </div>
            </div>
          </div>
        </section>
      </form>
    );
  }
);

export default PersonalEdit;
