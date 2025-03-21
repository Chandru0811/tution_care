import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import api from "../../../config/URL";
import { toast } from "react-toastify";

function HolidayEdit() {
  const validationSchema = Yup.object({
    holidayName: Yup.string().required("*Holiday Name is required"),
    startDate: Yup.string().required("*Start Date is required"),
    endDate: Yup.string()
      .required("*End Date is required")
      .test(
        "is-greater",
        "*To Date should be later than From Date",
        function (value) {
          const { startDate } = this.parent;
          return !startDate || !value || new Date(value) >= new Date(startDate);
        }
      ),
    holidayDescription: Yup.string().required(
      "*Holiday Description is required"
    ),
  });
  const [loadIndicator, setLoadIndicator] = useState(false);
  const userName = localStorage.getItem("tmsuserName");
  const centerId = localStorage.getItem("tmscenterId");

  const navigate = useNavigate();
  const { id } = useParams();
  const formik = useFormik({
    initialValues: {
      centerId: centerId,
      holidayName: "",
      startDate: "",
      endDate: "",
      holidayDescription: "",
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      setLoadIndicator(true);
      console.log(values);
      try {
        const payload = {
          centerId:centerId,
          holidayName: values.holidayName,
          startDate: values.startDate,
          endDate: values.endDate,
          holidayDescription: values.holidayDescription,
          updatedBy: userName,
        };
        const response = await api.put(`/updateUserHoliday/${id}`, payload, {
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (response.status === 200) {
          toast.success(response.data.message);
          navigate("/holiday");
        } else {
          toast.error(response.data.message);
        }
      } catch (error) {
        toast.error(
          error.message || "An error occurred while submitting the form"
        );
      } finally {
        setLoadIndicator(false);
      }
    },
  });

  useEffect(() => {
    const getData = async () => {
      try {
        const response = await api.get(`/getAllUserHolidayById/${id}`);
        const formattedResponseData = {
          ...response.data,
          startDate: response.data.startDate.substring(0, 10),
          endDate: response.data.endDate.substring(0, 10),
        };
        formik.setValues(formattedResponseData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    getData();
  }, []);

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
          &nbsp;Staffing
          <span className="breadcrumb-separator"> &gt; </span>
        </li>
        <li>
          <Link to="/holiday" className="custom-breadcrumb">
            &nbsp;Holiday
          </Link>
          <span className="breadcrumb-separator"> &gt; </span>
        </li>
        <li className="breadcrumb-item active" aria-current="page">
          &nbsp;Holiday Edit
        </li>
      </ol>
      <form
        onSubmit={formik.handleSubmit}
        onKeyDown={(e) => {
          if (e.key === "Enter" && !formik.isSubmitting) {
            e.preventDefault(); // Prevent default form submission
          }
        }}
      >
        <div className="card">
          <div
            className="d-flex justify-content-between align-items-center p-1 mb-4 px-4"
            style={{ background: "#f5f7f9" }}
          >
            <div class="d-flex align-items-center">
              <div class="d-flex">
                <div class="dot active"></div>
              </div>
              <span class="me-2 text-muted">Edit Holiday</span>
            </div>
            <div className="my-2 pe-3 d-flex align-items-center">
              <Link to="/holiday">
                <button type="button " className="btn btn-sm btn-border">
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
                <span className="fw-medium">Update</span>
              </button>
            </div>
          </div>
          <div className="container-fluid px-4">
            <div className="row">
             
              <div className="col-lg-6 col-md-6 col-12">
                <div className="text-start mt-2 mb-3">
                  <lable className="form-lable">
                    Holiday Name<span className="text-danger">*</span>
                  </lable>
                  <input
                    type="text"
                    className={`form-control  ${
                      formik.touched.holidayName && formik.errors.holidayName
                        ? "is-invalid"
                        : ""
                    }`}
                    {...formik.getFieldProps("holidayName")}
                  />
                  {formik.touched.holidayName && formik.errors.holidayName && (
                    <div className="invalid-feedback">
                      {formik.errors.holidayName}
                    </div>
                  )}
                </div>
              </div>
              <div className="col-lg-6 col-md-6 col-12">
                <div className="text-start mt-2 mb-3">
                  <lable className="form-lable">
                    Start Date<span className="text-danger">*</span>
                  </lable>
                  <input
                    type="date"
                    className={`form-control  ${
                      formik.touched.startDate && formik.errors.startDate
                        ? "is-invalid"
                        : ""
                    }`}
                    {...formik.getFieldProps("startDate")}
                  />
                  {formik.touched.startDate && formik.errors.startDate && (
                    <div className="invalid-feedback">
                      {formik.errors.startDate}
                    </div>
                  )}
                </div>
              </div>
              <div className="col-lg-6 col-md-6 col-12">
                <div className="text-start mt-2 mb-3">
                  <lable className="form-lable">
                    End Date<span className="text-danger">*</span>
                  </lable>
                  <input
                    type="date"
                    className={`form-control  ${
                      formik.touched.endDate && formik.errors.endDate
                        ? "is-invalid"
                        : ""
                    }`}
                    {...formik.getFieldProps("endDate")}
                  />
                  {formik.touched.endDate && formik.errors.endDate && (
                    <div className="invalid-feedback">
                      {formik.errors.endDate}
                    </div>
                  )}
                </div>
              </div>
              <div className="col-lg-12 col-md-12 col-12">
                <div className="text-start mt-2 mb-3">
                  <lable className="form-lable">
                    Description<span className="text-danger">*</span>
                  </lable>
                  <textarea
                    type="text"
                    rows={5}
                    className={`form-control  ${
                      formik.touched.holidayDescription &&
                      formik.errors.holidayDescription
                        ? "is-invalid"
                        : ""
                    }`}
                    {...formik.getFieldProps("holidayDescription")}
                  />
                  {formik.touched.holidayDescription &&
                    formik.errors.holidayDescription && (
                      <div className="invalid-feedback">
                        {formik.errors.holidayDescription}
                      </div>
                    )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}

export default HolidayEdit;
