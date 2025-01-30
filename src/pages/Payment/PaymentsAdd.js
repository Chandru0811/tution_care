import { useFormik } from "formik";
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import * as Yup from "yup";
import api from "../../config/URL";
import { toast } from "react-toastify";

function PaymentsAdd() {
  const navigate = useNavigate();
  const [loadIndicator, setLoadIndicator] = useState(false);
  const userName = localStorage.getItem("tmsuserName");
  const centerId = localStorage.getItem("tmscenterId");

  const validationSchema = Yup.object({});

  const formik = useFormik({
    initialValues: {
      centerId: centerId,
      studentId: "",
      receiptNo: "",
      paymentDate: "",
      paymentMethod: "",
      paymentReference: "",
      paidAmount: "0.0",
      back: "",
      accountNo: "",
      transactionNo: "",
      mobileNumber: "",
      file: null,
      remark: "",
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      console.log("Payment Data::", values);

      //   setLoadIndicator(true);
      //   const formData = new FormData();
      //   formData.append("centerName", values.centerName);
      //   formData.append("code", values.code);
      //   formData.append("userId", values.studentId);
      //   formData.append("address", values.address);
      //   formData.append("zipCode", values.zipCode);
      //   formData.append("mobile", values.mobile);
      //   formData.append("email", values.email);
      //   formData.append("openingDate", values.openingDate);
      //   formData.append("uenNumber", values.uenNumber);
      //   formData.append("gst", values.gst);
      //   formData.append("taxRegistrationNumber", values.taxRegistrationNumber);
      //   formData.append("bankName", values.bankName);
      //   formData.append("bankBranch", values.bankBranch);
      //   formData.append("bankAccountNumber", values.bankAccountNumber);
      //   formData.append("bankAccountName", values.bankAccountName);
      //   formData.append("invoiceNotes  ", values.invoiceNotes || " ");
      //   formData.append("file", values.file);
      //   formData.append("target", values.target);
      //   formData.append("createdBy", userName);

      //   try {
      //     const response = await api.post("/paymentCreate", formData, {
      //       headers: {
      //         "Content-Type": "multipart/form-data",
      //       },
      //     });
      //     if (response.status === 201) {
      //       toast.success(response.data.message);
      //       handleCenterChanged();
      //       navigate("/payments");
      //     } else {
      //       toast.error(response.data.message);
      //     }
      //   } catch (error) {
      //     toast.error(error);
      //   } finally {
      //     setLoadIndicator(false);
      //   }
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
          &nbsp;Invoice and Payment
          <span className="breadcrumb-separator"> &gt; </span>
        </li>
        <li>
          <Link to="/payment" className="custom-breadcrumb">
            &nbsp;Payment
          </Link>
          <span className="breadcrumb-separator"> &gt; </span>
        </li>
        <li className="breadcrumb-item active" aria-current="page">
          &nbsp;Payment Add
        </li>
      </ol>
      <form onSubmit={formik.handleSubmit}>
        <div className="card">
          <div
            className="d-flex justify-content-between align-items-center p-1 mb-4 px-4"
            style={{ background: "#f5f7f9" }}
          >
            <div class="d-flex align-items-center">
              <div class="d-flex">
                <div class="dot active"></div>
              </div>
              <span class="me-2 text-muted">Add Payment</span>
            </div>
            <div className="my-2 pe-3 d-flex align-items-center">
              <Link to="/payment">
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
                <span className="fw-medium">Save</span>
              </button>
            </div>
          </div>
          <div className="container-fluid px-4">
            <div className="row">
              <div className="col-md-6 col-12 mb-2">
                <label className="form-label">
                  Student Name<span className="text-danger">*</span>
                </label>
                <select
                  {...formik.getFieldProps("studentId")}
                  name="studentId"
                  className={`form-select  ${
                    formik.touched.studentId && formik.errors.studentId
                      ? "is-invalid"
                      : ""
                  }`}
                >
                  <option disabled selected></option>
                  {/* {studentData &&
                    studentData.map((std) => (
                      <option key={std.id} value={std.id}>
                        {std.studentNames}
                      </option>
                    ))} */}
                </select>
                {formik.touched.studentId && formik.errors.studentId && (
                  <div className="invalid-feedback">
                    {formik.errors.studentId}
                  </div>
                )}
              </div>
              <div className="col-md-6 col-12 mb-2">
                <div className="mb-3">
                  <label className="form-label">
                    Payment Date<span className="text-danger">*</span>
                  </label>
                  <input
                    name="paymentDate"
                    {...formik.getFieldProps("paymentDate")}
                    type="date"
                    className={`form-control  ${
                      formik.touched.paymentDate && formik.errors.paymentDate
                        ? "is-invalid"
                        : ""
                    }`}
                    placeholder=""
                  />
                  {formik.touched.paymentDate && formik.errors.paymentDate && (
                    <div className="invalid-feedback">
                      {formik.errors.paymentDate}
                    </div>
                  )}
                </div>
              </div>
              <div className="col-md-6 col-12 mb-2">
                <div className="mb-3">
                  <label className="form-label">
                    Payment Method<span className="text-danger">*</span>
                  </label>
                  <select
                    {...formik.getFieldProps("paymentMethod")}
                    name="paymentMethod"
                    className={`form-select  ${
                      formik.touched.paymentMethod &&
                      formik.errors.paymentMethod
                        ? "is-invalid"
                        : ""
                    }`}
                  >
                    <option disabled selected></option>
                    <option value="Cash">Cash</option>
                    <option value="Cheque">Cheque</option>
                    <option value="Internet Banking">Internet Banking</option>
                    <option value="Paynow">Paynow</option>
                    <option value="Paynow QR">Paynow QR</option>
                  </select>
                  {formik.touched.paymentMethod &&
                    formik.errors.paymentMethod && (
                      <div className="invalid-feedback">
                        {formik.errors.paymentMethod}
                      </div>
                    )}
                </div>
              </div>
              <div className="col-md-6 col-12 mb-2">
                <div className="mb-3">
                  <label className="form-label">Payment Reference</label>
                  <input
                    name="paymentReference"
                    {...formik.getFieldProps("paymentReference")}
                    type="text"
                    className={`form-control  ${
                      formik.touched.paymentReference &&
                      formik.errors.paymentReference
                        ? "is-invalid"
                        : ""
                    }`}
                    placeholder=""
                  />
                </div>
              </div>
              {/* Conditionally Rendered Fields */}
              {(formik.values.paymentMethod === "Cheque" ||
                formik.values.paymentMethod === "Internet Banking") && (
                <>
                  {/* Bank Name */}
                  <div className="col-md-6 col-12 mb-2">
                    <label className="form-label">
                      Bank<span className="text-danger">*</span>
                    </label>
                    <input
                      name="bank"
                      {...formik.getFieldProps("bank")}
                      type="text"
                      className={`form-control ${
                        formik.touched.bank && formik.errors.bank
                          ? "is-invalid"
                          : ""
                      }`}
                    />
                  </div>
                  <div className="col-md-6 col-12 mb-2">
                    <label className="form-label">Upload File</label>
                    <input
                      type="file"
                      name="file"
                      accept=".pdf,.doc,.docx,.png,.jpg,.jpeg"
                      className="form-control"
                      onChange={(event) => {
                        formik.setFieldValue("file", event.target.files[0]);
                      }}
                      onBlur={formik.handleBlur}
                    />
                  </div>
                </>
              )}
              {formik.values.paymentMethod === "Cheque" && (
                <div className="col-md-6 col-12 mb-2">
                  <label className="form-label">
                    Account No<span className="text-danger">*</span>
                  </label>
                  <input
                    name="accountNo"
                    {...formik.getFieldProps("accountNo")}
                    type="text"
                    className={`form-control ${
                      formik.touched.accountNo && formik.errors.accountNo
                        ? "is-invalid"
                        : ""
                    }`}
                  />
                </div>
              )}
              {formik.values.paymentMethod === "Internet Banking" && (
                <>
                  <div className="col-md-6 col-12 mb-2">
                    <label className="form-label">Transaction No</label>
                    <input
                      name="transactionNo"
                      {...formik.getFieldProps("transactionNo")}
                      type="text"
                      className={`form-control ${
                        formik.touched.transactionNo &&
                        formik.errors.transactionNo
                          ? "is-invalid"
                          : ""
                      }`}
                    />
                  </div>
                  <div className="col-md-6 col-12 mb-2">
                    <label className="form-label">Mobile Number</label>
                    <input
                      name="mobileNumber"
                      {...formik.getFieldProps("mobileNumber")}
                      type="text"
                      className={`form-control ${
                        formik.touched.mobileNumber &&
                        formik.errors.mobileNumber
                          ? "is-invalid"
                          : ""
                      }`}
                    />
                  </div>
                </>
              )}

              <div className="col-md-6 col-12 mb-2">
                <div className="mb-3">
                  <label className="form-label">Paid Amount</label>
                  <input
                    name="paidAmount"
                    {...formik.getFieldProps("paidAmount")}
                    type="text"
                    className={`form-control  ${
                      formik.touched.paidAmount && formik.errors.paidAmount
                        ? "is-invalid"
                        : ""
                    }`}
                  />
                </div>
              </div>
              <div className="col-12">
                <label className="form-label">Remark</label>
                <div class="input-group mb-3">
                  <textarea
                    name="reamrks"
                    class="form-control"
                    {...formik.getFieldProps("reamrks")}
                    id="reamrks"
                    rows="5"
                  ></textarea>
                </div>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}

export default PaymentsAdd;
