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
import { IoEyeOffOutline, IoEyeOutline } from "react-icons/io5";
import { useJsApiLoader } from "@react-google-maps/api";

const libraries = ["places"];
const PersonalAdd = forwardRef(
  ({ formData, setLoadIndicators, setFormData, handleNext }, ref) => {
    const { isLoaded } = useJsApiLoader({
      googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
      libraries,
    });
    const [idTypeData, setIdTypeData] = useState(null);
    const userName = localStorage.getItem("tmsuserName");
    const centerId = localStorage.getItem("tmscenterId");
    const userId = formData.user_id;
    const [roleData, setRoleData] = useState(null);
    const [centreData, setCentreData] = useState([]);
    const [countryData, setCountryData] = useState([]);
    const [citizenshipData, setCitizenshipData] = useState([]);
    const [nationalityData, setNationalityData] = useState([]);

    const validationSchema = Yup.object().shape({
      teacherName: Yup.string().required("*Name is required"),
      role: Yup.string().required("*Role is required"),
      countryTypeId: Yup.string().required("*Country is required"),
      dateOfBirth: Yup.date()
        .required("*Date of Birth is required")
        .max(new Date(), "*Date of Birth cannot be in the future"),
      idTypeId: Yup.string().required("*Id Type is required"),
      idNo: Yup.string().required("*Id No is required"),
      nationalityId: Yup.string().required("*Nationality is required"),
      citizenshipId: Yup.string().required("*Citizenship is required"),
      email: Yup.string()
        .email("*Invalid Email")
        .required("*Email is required"),
      gender: Yup.string().required("*Gender is required"),
      file: Yup.mixed()
        .required("*Photo is required")
        .test(
          "max-file-name-length",
          "*File name must be at most 50 characters",
          (value) => !value || value.name.length <= 50
        ),
      status: Yup.string().required("*Status is required"),

      password: Yup.string()
        .matches(/^\S*$/, "*Password must not contain spaces.")
        .required("*Enter the valid Password"),
      confirmPassword: Yup.string()
        .oneOf([Yup.ref("password"), null], "*Passwords must match")
        .required("*Confirm Password is required"),
      postalCode: Yup.string()
        .matches(/^\d{6}$/, "*Postal Code must be exactly 6 digits")
        .when([], {
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
        role: formData.role,
        teacherName: formData.teacherName,
        dateOfBirth: formData.dateOfBirth,
        idTypeId: formData.idTypeId,
        email: formData.email,
        password: formData.password,
        confirmPassword: formData.confirmPassword,
        idNo: formData.idNo,
        citizenshipId: formData.citizenshipId,
        nationalityId: formData.nationalityId || "",
        countryTypeId: formData.countryTypeId,
        file: formData.file || "",
        shortIntroduction: formData.shortIntroduction,
        gender: formData.gender,
        status: formData.status || "",
        address: formData.address || "",
        postalCode: formData.postalCode || "",
        lattitude: formData.lattitude || "",
        longitude: formData.longitude || "",
        createdBy: userName,
      },

      validationSchema: validationSchema,
      onSubmit: async (values) => {
        setLoadIndicators(true);
        values.createdBy = userName;
        // values.centerId = centerId;
        try {
          let response;
          const formData = new FormData();
          let nationalityName;
          if (values.nationalityId)
            nationalityName = nationalityData.find(
              (prv) => prv.id === parseInt(values.nationalityId)
            );
          // Add each data field manually to the FormData object
          formData.append("address", values.address);
          formData.append("postalCode", values.postalCode);
          formData.append("lattitude", values.lattitude);
          formData.append("longitude", values.longitude);
          formData.append("roleId", values.role);
          formData.append("centerId", centerId);
          formData.append("teacherName", values.teacherName);
          formData.append("dateOfBirth", values.dateOfBirth);
          formData.append("idTypeId", values.idTypeId);
          formData.append("idNo", values.idNo);
          formData.append("age", 25);
          formData.append("shortIntroduction", values.shortIntroduction || "");
          formData.append("gender", values.gender);
          formData.append("countryTypeId", values.countryTypeId);
          formData.append("nationalityId", values.nationalityId);
          formData.append("citizenshipId", values.citizenshipId);
          formData.append("status", values.status);
          formData.append("createdBy", userName);
          if (userId === null || userId === undefined) {
            formData.append("email", values.email);
            formData.append("password", values.password);
            formData.append("file", values.file);
            response = await api.post("/createUserWithProfileImage", formData, {
              headers: {
                "Content-Type": "multipart/form-data",
              },
            });
          } else {
            response = await api.put(`/updateUser/${userId}`, formData, {
              headers: {
                "Content-Type": "multipart/form-data",
              },
            });
          }

          if (response.status === 201 || response.status === 200) {
            const user_id = response.data.user_id || userId;
            toast.success(response.data.message);
            setFormData((prv) => ({ ...prv, ...values, user_id }));
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

    const [showPassword, setShowPassword] = React.useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = React.useState(false);

    const togglePasswordVisibility = () => {
      setShowPassword(!showPassword);
    };

    const toggleConfirmPasswordVisibility = () => {
      setShowConfirmPassword(!showConfirmPassword);
    };

    const fetchIDTypeData = async () => {
      try {
        const idTypeData = await fetchAllIDTypeWithIds(centerId);
        setIdTypeData(idTypeData);
      } catch (error) {
        toast.error(error);
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
    const rolesData = async () => {
      try {
        const response = await api.get(`/getUserRolesByCenterId/${centerId}`);
        setRoleData(response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    const fetchCNCData = async () => {
      try {
        const citizenship = await api.get(`/getAllCitizenshipTypeWithCenterId/${centerId}`);
        setCitizenshipData(citizenship.data);
        const country = await api.get(`/getAllCountryTypeWithCenterId/${centerId}`);
        setCountryData(country.data);
        const nationality = await api.get(`/getAllNationalityTypeWithCenterId/${centerId}`);
        setNationalityData(nationality.data);
      } catch (error) {
        toast.error(error);
      }
    };

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
      fetchIDTypeData();
      fetchCNCData();
      rolesData();
      centerData();
    }, []);

    useImperativeHandle(ref, () => ({
      personalAdd: formik.handleSubmit,
    }));

    if (!isLoaded) {
      return (
        <div className="loader-container d-flex align-items-center justify-content-center">
          <div class="loader"></div>
        </div>
      );
    }

    return (
      <form
        onSubmit={formik.handleSubmit}
        onKeyDown={(e) => {
          if (e.key === "Enter" && !formik.isSubmitting) {
            e.preventDefault(); // Prevent default form submission
          }
        }}
      >
        <div className="pb-4">
          <p className="headColor">Personal Information</p>
          <div className="container-fluid row d-flex my-4">
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
                name="countryTypeId"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.countryTypeId}
              >
                <option selected></option>
                {countryData &&
                  countryData.map((countryTypeId) => (
                    <option key={countryTypeId.id} value={countryTypeId.id}>
                      {countryTypeId.country}
                    </option>
                  ))}
              </select>
              {formik.touched.countryTypeId && formik.errors.countryTypeId && (
                <div className="error text-danger">
                  <small>{formik.errors.countryTypeId}</small>
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
              {formik.touched.nationalityId && formik.errors.nationalityId && (
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
                name="citizenshipId"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.citizenshipId}
              >
                <option selected></option>
                {citizenshipData &&
                    citizenshipData.map((citizenshipId) => (
                      <option
                        key={citizenshipId.id}
                        value={citizenshipId.id}
                      >
                        {citizenshipId.citizenship}
                      </option>
                    ))}
              </select>
              {formik.touched.citizenshipId && formik.errors.citizenshipId && (
                <div className="error text-danger">
                  <small>{formik.errors.citizenshipId}</small>
                </div>
              )}
            </div>
            {userId === undefined && (
              <>
                <div className="col-md-6 col-12 mb-2 mt-3">
                  <div className="form-group  col-sm ">
                    <label>Photo</label>
                    <span className="text-danger">*</span>
                    <input
                      type="file"
                      name="file"
                      accept="image/*"
                      className="form-control"
                      onChange={(event) => {
                        formik.setFieldValue("file", event.target.files[0]);
                      }}
                      onBlur={formik.handleBlur}
                    />
                    {formik.touched.file && formik.errors.file && (
                      <div className="error text-danger">
                        <small>{formik.errors.file}</small>
                      </div>
                    )}
                  </div>
                </div>
                <div className="col-md-6 col-12 mb-3">
                  <label>
                    Email ID<span className="text-danger">*</span>
                  </label>
                  <input
                    type="email"
                    className="form-control"
                    name="email"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.email}
                  />
                  {formik.touched.email && formik.errors.email && (
                    <div className="error text-danger ">
                      <small>{formik.errors.email}</small>
                    </div>
                  )}
                </div>
                <div className="col-md-6 col-12 mb-3">
                  <div className="mb-3">
                    <label>
                      Password<span className="text-danger">*</span>
                    </label>
                    <div className={`input-group mb-3`}>
                      <input
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter password"
                        className={`form-control ${
                          formik.touched.password && formik.errors.password
                            ? "is-invalid"
                            : ""
                        }`}
                        style={{
                          borderRadius: "3px",
                          borderRight: "none",
                          borderTopRightRadius: "0px",
                          borderBottomRightRadius: "0px",
                        }}
                        name="password"
                        {...formik.getFieldProps("password")}
                      />
                      <span
                        className={`input-group-text iconInputBackground`}
                        id="basic-addon1"
                        onClick={togglePasswordVisibility}
                        style={{ cursor: "pointer", borderRadius: "3px" }}
                      >
                        {showPassword ? <IoEyeOffOutline /> : <IoEyeOutline />}
                      </span>
                      {formik.touched.password && formik.errors.password && (
                        <div className="invalid-feedback">
                          {formik.errors.password}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                <div className="col-md-6 col-12 mb-3">
                  <label>
                    Confirm Password<span className="text-danger">*</span>
                  </label>
                  <div className={`input-group mb-3`}>
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="Enter confirm password"
                      className={`form-control ${
                        formik.touched.confirmPassword &&
                        formik.errors.confirmPassword
                          ? "is-invalid"
                          : ""
                      }`}
                      style={{
                        borderRadius: "3px",
                        borderRight: "none",
                        borderTopRightRadius: "0px",
                        borderBottomRightRadius: "0px",
                      }}
                      name="confirmPassword"
                      {...formik.getFieldProps("confirmPassword")}
                    />
                    <span
                      className={`input-group-text iconInputBackground`}
                      id="basic-addon1"
                      onClick={toggleConfirmPasswordVisibility}
                      style={{ cursor: "pointer", borderRadius: "3px" }}
                    >
                      {showConfirmPassword ? (
                        <IoEyeOffOutline />
                      ) : (
                        <IoEyeOutline />
                      )}
                    </span>
                    {formik.touched.confirmPassword &&
                      formik.errors.confirmPassword && (
                        <div className="invalid-feedback">
                          {formik.errors.confirmPassword}
                        </div>
                      )}
                  </div>
                </div>
              </>
            )}
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
            <div className="col-md-6 col-12 mb-3">
              <div className="form-group col-sm">
                <label>Status</label>
                <span className="text-danger">*</span>
                <select
                  type="text"
                  className="form-select"
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
            <div class="col-md-6 col-12 mb-3">
              <div class="form-group col-sm">
                <label>Role</label>
                <span className="text-danger">*</span>
                <select
                  type="text"
                  class="form-select"
                  name="role"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.role}
                >
                  <option selected></option>
                  {roleData &&
                    roleData.map((role) => (
                      <option key={role.id} value={role.id}>
                        {role.roleName}
                      </option>
                    ))}
                </select>
                {formik.touched.role && formik.errors.role && (
                  <div className="error text-danger ">
                    <small>{formik.errors.role}</small>
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
                    {formik.touched.postalCode && formik.errors.postalCode && (
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
      </form>
    );
  }
);

export default PersonalAdd;
