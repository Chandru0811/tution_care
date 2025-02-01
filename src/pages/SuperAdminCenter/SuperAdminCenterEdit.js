import React, { useEffect, useState } from "react";
import * as Yup from "yup";
import { useFormik } from "formik";
import { Link, useNavigate, useParams } from "react-router-dom";
import EditRegisteration from "./Edit/EditRegister";
import EditBreak from "./Edit/EditBreak";
import EditClass from "./Edit/EditClass";
import EditPackage from "./Edit/EditPackage";
import api from "../../config/URL";
import { toast } from "react-toastify";
import fetchAllCentreManager from "../List/CentreMangerList";
import Delete from "../../components/common/Delete";

const validationSchema = Yup.object().shape({
  name: Yup.string().required("*Name is required"),
  centerName: Yup.string().required("*Company Name is required"),
  address: Yup.string().required("*Address is required"),
  mobile: Yup.string()
    .matches(
      /^(?:\+?65)?\s?(?:\d{4}\s?\d{4}|\d{3}\s?\d{3}\s?\d{4})$/,
      "*Invalid Phone Number"
    )
    .required("*Mobile Number is required"),
  email: Yup.string()
    .matches(
      /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
      "*Enter a valid email address"
    )
    .required("*Email is required"),
});

function SuperAdminCenterEdit({ handleCenterChanged }) {
  const { id } = useParams();
  const [data, setData] = useState([]);
  const [loadIndicator, setLoadIndicator] = useState(false);
  const [teacherData, setTeacherData] = useState(null);
  const navigate = useNavigate();
  const [taxTypeData, setTaxTypeData] = useState(null);
  const userName = localStorage.getItem("tmsuserName");

  useEffect(() => {
    fetchTeacher();
  }, []);
  const fetchTeacher = async () => {
    try {
      const manager = await fetchAllCentreManager();
      setTeacherData(manager);
    } catch (error) {
      toast.error(error);
    }
  };
  const formik = useFormik({
    initialValues: {
      name: "",
      centerName: "",
      email: "",
      mobile: "",
      address: "",
      updatedBy: userName,
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      setLoadIndicator(true);
      try {
        const response = await api.put(`/updateCenters/${id}`, values, {
          headers: {
            "Content-Type": "Application/json",
          },
        });
        if (response.status === 200) {
          toast.success(response.data.message);
          navigate("/companyregistration");
          handleCenterChanged();
        } else {
          toast.error(response.data.message);
        }
      } catch (error) {
        if (error.response.status === 409) {
          toast.warning(error?.response?.data?.message);
        } else {
          toast.error(error.response.data.message);
        }
      } finally {
        setLoadIndicator(false);
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

  const fetchTaxData = async () => {
    try {
      const response = await api.get("getAllTaxSetting");
      setTaxTypeData(response.data);
    } catch (error) {
      toast.error("Error fetching tax data:", error);
    }
  };

  useEffect(() => {
    const getData = async () => {
      const response = await api.get(`/getAllCenterById/${id}`);
      console.log("response", response.data);
      const formattedData = {
        ...response.data,
        openingDate: response.data.openingDate
          ? new Date(response.data.openingDate).toISOString().substring(0, 10)
          : null,
      };
      formik.setValues(formattedData);
      setData(response.data);
    };

    getData();
    fetchTeacher();
    fetchTaxData();
  }, [id]);

  const refreshData = async () => {
    try {
      const response = await api.get(`/getAllCenterById/${id}`);
      setData(response.data);
    } catch (error) {
      toast.error("Error Fetching Data");
    }
  };

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
          &nbsp;Organization Management
          <span className="breadcrumb-separator"> &gt; </span>
        </li>
        <li>
          <Link to="/center" className="custom-breadcrumb">
            &nbsp;Company Listing
          </Link>
          <span className="breadcrumb-separator"> &gt; </span>
        </li>
        <li className="breadcrumb-item active" aria-current="page">
          &nbsp;Company Listing Edit
        </li>
      </ol>
      <form
        onSubmit={formik.handleSubmit}
      // onKeyDown={(e) => {
      //   if (e.key === "Enter" && !formik.isSubmitting) {
      //     e.preventDefault(); // Prevent default form submission
      //   }
      // }}
      >
        <div className="card">
          <div
            className="d-flex px-4 justify-content-between align-items-center p-1 mb-4"
            style={{ background: "#f5f7f9" }}
          >
            <div class="d-flex align-items-center">
              <div class="d-flex">
                <div class="dot active"></div>
              </div>
              <span class="me-2 text-muted">Edit Company</span>
            </div>
            <div className="my-2 pe-3 d-flex align-items-center">
              <Link to="/companyregistration">
                <button type="button " className="btn btn-sm btn-border   ">
                  Back
                </button>
              </Link>
              &nbsp;&nbsp;
              <button
                type="submit"
                className="btn btn-button btn-sm"
                disabled={loadIndicator}
              >
                {loadIndicator && (
                  <span
                    className="spinner-border spinner-border-sm me-2"
                    aria-hidden="true"
                  ></span>
                )}
                Update
              </button>
            </div>
          </div>
          <div className="container-fluid px-4">
            <div className="row">
              <div className="col-md-6 col-12">
                <div className="mb-3">
                  <label for="exampleFormControlInput1" className="form-label">
                    Name<span className="text-danger">*</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    className={`form-control  ${formik.touched.name && formik.errors.name
                      ? "is-invalid"
                      : ""
                      }`}
                    aria-label="Username"
                    aria-describedby="basic-addon1"
                    {...formik.getFieldProps("name")}
                  />
                  {formik.touched.name && formik.errors.name && (
                    <div className="invalid-feedback">
                      {formik.errors.name}
                    </div>
                  )}
                </div>
              </div>
              <div className="col-md-6 col-12">
                <div className="mb-3">
                  <label for="exampleFormControlInput1" className="form-label">
                    Company Name<span className="text-danger">*</span>
                  </label>
                  <input
                    type="text"
                    name="centerName"
                    className={`form-control  ${formik.touched.centerName && formik.errors.centerName
                      ? "is-invalid"
                      : ""
                      }`}
                    aria-label="Username"
                    aria-describedby="basic-addon1"
                    {...formik.getFieldProps("centerName")}
                  />
                  {formik.touched.centerName && formik.errors.centerName && (
                    <div className="invalid-feedback">
                      {formik.errors.centerName}
                    </div>
                  )}
                </div>
              </div>
              <div className="col-md-6 col-12">
                <div className="mb-3">
                  <label for="exampleFormControlInput1" className="form-label">
                    Mobile<span className="text-danger">*</span>
                  </label>
                  <input
                    {...formik.getFieldProps("mobile")}
                    type="text"
                    className={`form-control   ${formik.touched.mobile && formik.errors.mobile
                      ? "is-invalid"
                      : ""
                      }`}
                  />
                  {formik.touched.mobile && formik.errors.mobile && (
                    <div className="invalid-feedback">
                      {formik.errors.mobile}
                    </div>
                  )}
                </div>
              </div>
              <div className="col-md-6 col-12">
                <div className="mb-3">
                  <label for="exampleFormControlInput1" className="form-label">
                    Email<span className="text-danger">*</span>
                  </label>
                  <input
                    {...formik.getFieldProps("email")}
                    type="text"
                    className={`form-control   ${formik.touched.email && formik.errors.email
                      ? "is-invalid"
                      : ""
                      }`}
                    aria-label="Username"
                    aria-describedby="basic-addon1"
                  />
                  {formik.touched.email && formik.errors.email && (
                    <div className="invalid-feedback">
                      {formik.errors.email}
                    </div>
                  )}
                </div>
              </div>
              <div className="col-md-6 col-12">
                <div className="mb-3">
                  <label for="exampleFormControlInput1" className="form-label">
                    Address<span className="text-danger">*</span>
                  </label>
                  <textarea
                    className={`form-control ${formik.touched.address && formik.errors.address
                      ? "is-invalid"
                      : ""
                      }`}
                    {...formik.getFieldProps("address")}
                    id="exampleFormControlTextarea1"
                    rows="3"
                    onBlur={formik.handleBlur}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        console.log("Enter key pressed: moving to the next line");
                      }
                    }}
                  ></textarea>
                  {formik.touched.address && formik.errors.address && (
                    <div className="invalid-feedback">
                      {formik.errors.address}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
          {/* <div className="container-fluid">
            <div className="row">
              <div className="col-md-12 col-12 mt-4">
                <h5 className="headColor mb-3">Company Registrations</h5>
                <table className="table table-border-solid">
                  <thead>
                    <tr>
                      <th scope="col" className="fw-medium">
                        S.No
                      </th>
                      <th scope="col" className="fw-medium">
                        Effective Date
                      </th>
                      <th scope="col" className="fw-medium">
                        Amount Including (GST)
                      </th>
                      <th scope="col" className="fw-medium">
                        Tax Type
                      </th>
                      <th scope="col" className="fw-medium text-center">
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.centerRegistrations &&
                      data.centerRegistrations.map((registration, index) => (
                        <tr key={index} className="mt-1">
                          <td>{index + 1}</td>
                          <td>
                            {registration.effectiveDate?.substring(0, 10)}
                          </td>
                          <td>{registration.amount}</td>
                          <td>
                            {taxTypeData &&
                              taxTypeData.map((tax) =>
                                parseInt(registration.taxId) === tax.id
                                  ? tax.taxType || "--"
                                  : ""
                              )}
                          </td>
                          <td className="text-center">
                            <EditRegisteration
                              id={registration.id}
                              onSuccess={refreshData}
                            />
                            <Delete
                              onSuccess={refreshData}
                              path={`/deleteCenterRegistrations/${registration.id}`}
                            />
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
              <div className="col-md-12 col-12 mt-4">
                <h5 className="headColor mb-3">Company Break</h5>
                <table class="table table-border-solid">
                  <thead>
                    <tr>
                      <th scope="col" className="fw-medium">
                        S.No
                      </th>
                      <th scope="col" className="fw-medium">
                        Break Name
                      </th>
                      <th scope="col" className="fw-medium">
                        From Date
                      </th>
                      <th scope="col" className="fw-medium">
                        To date
                      </th>
                      <th scope="col" className="fw-medium text-center">
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.centerBreaks &&
                      data.centerBreaks.map((centerBreak, index) => (
                        <tr key={index}>
                          <td>{index + 1}</td>
                          <td>{centerBreak.breakName}</td>
                          <td>{centerBreak.fromDate.substring(0, 10)}</td>
                          <td>{centerBreak.toDate.substring(0, 10)}</td>
                          <td className="text-center">
                            <EditBreak
                              id={centerBreak.id}
                              onSuccess={refreshData}
                            />
                            <Delete
                              onSuccess={refreshData}
                              path={`/deleteCenterBreaks/${centerBreak.id}`}
                            />
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
              <div className="col-md-12 col-12 mt-4">
                <h5 className="headColor mb-3">Company Classroom</h5>
                <div className="table-responsive">
                  <table class="table table-border-solid">
                    <thead>
                      <tr>
                        <th scope="col" className="fw-medium">
                          S.No
                        </th>
                        <th
                          scope="col"
                          className="fw-medium"
                          style={{ whiteSpace: "nowrap" }}
                        >
                          Classroom Name
                        </th>
                        <th
                          scope="col"
                          className="fw-medium"
                          style={{ whiteSpace: "nowrap" }}
                        >
                          Classroom Code
                        </th>
                        <th
                          scope="col"
                          className="fw-medium"
                          style={{ whiteSpace: "nowrap" }}
                        >
                          Classroom Type
                        </th>
                        <th
                          scope="col"
                          className="fw-medium"
                          style={{ whiteSpace: "nowrap" }}
                        >
                          Capacity
                        </th>
                        <th
                          scope="col"
                          className="fw-medium"
                          style={{ whiteSpace: "nowrap" }}
                        >
                          Description
                        </th>
                        <th scope="col" className="fw-medium ps-4">
                          Action
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {data.centerClassRooms &&
                        data.centerClassRooms.map((centerClassRoom, index) => (
                          <tr key={index}>
                            <td>{index + 1}</td>
                            <td>{centerClassRoom.classRoomName}</td>
                            <td>{centerClassRoom.classRoomCode}</td>
                            <td>{centerClassRoom.classRoomType}</td>
                            <td>{centerClassRoom.capacity}</td>
                            <td className="text-break">
                              {centerClassRoom.description}
                            </td>
                            <td>
                              <EditClass
                                id={centerClassRoom.id}
                                onSuccess={refreshData}
                              />
                              <Delete
                                onSuccess={refreshData}
                                path={`/deleteCenterClassRooms/${centerClassRoom.id}`}
                              />
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              </div>
              <div className="col-md-12 col-12 mt-4">
                <h5 className="headColor mb-3">Company Package</h5>
                <table class="table table-border-solid">
                  <thead>
                    <tr>
                      <th scope="col" className="fw-medium">
                        S.No
                      </th>
                      <th scope="col" className="fw-medium">
                        Package
                      </th>
                      <th scope="col" className="fw-medium">
                        Number Of Lesson
                      </th>
                      <th scope="col" className="fw-medium text-center">
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.centerPackages &&
                      data.centerPackages.map((centerPackage, index) => (
                        <tr key={index}>
                          <td>{index + 1}</td>
                          <td>{centerPackage.packageName || "--"}</td>
                          <td>{centerPackage.noOfLesson || "--"}</td>
                          <td className="text-center">
                            <EditPackage
                              id={centerPackage.id}
                              onSuccess={refreshData}
                            />
                            <Delete
                              onSuccess={refreshData}
                              path={`/deleteCenterPackages/${centerPackage.id}`}
                            />
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div> */}
        </div>
      </form>
    </div>
  );
}

export default SuperAdminCenterEdit;
