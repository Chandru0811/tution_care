import { useFormik } from "formik";
import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import * as Yup from "yup";
import api from "../../config/URL";
import { toast } from "react-toastify";
import fetchAllStudentListByCenter from "../List/StudentListByCenter";
import { MultiSelect } from "react-multi-select-component";
import { MdOutlineDownloadForOffline } from "react-icons/md";
import pdfLogo from "../../assets/images/Attactmentpdf.jpg";

function PaymentsEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loadIndicator, setLoadIndicator] = useState(false);
  const centerId = localStorage.getItem("tmscenterId");
  const [studentData, setStudentData] = useState(null);
  const [datas, setData] = useState(null);
  const [invoiceData, setInvoiceData] = useState([]);
  const [selectedInvoice, setSelectedInvoice] = useState([]);
  const invoiceOptions = invoiceData.map((invoice) => ({
    label: invoice.invoiceNumber,
    value: invoice.id,
    totalAmount: invoice.totalAmount,
  }));
  const storedConfigure = JSON.parse(
    localStorage.getItem("tmsappConfigInfo") || "{}"
  );
  const validationSchema = Yup.object({
    studentId: Yup.string().required("Student Name is required"),
    paymentDate: Yup.string().required("Payment Date is required"),
    paymentMethod: Yup.string().required("Payment Method is required"),
    invoiceIds: Yup.array()
      .of(Yup.string())
      .min(1, "Invoice is required")
      .required("Invoice is required"),
    bank: Yup.string()
      .nullable()
      .trim()
      .when("paymentMethod", {
        is: (val) => val === "Cheque" || val === "Internet Banking",
        then: (schema) => schema.required("Bank Name is required"),
        otherwise: (schema) => schema.notRequired(),
      }),

    accountNo: Yup.string()
      .nullable()
      .trim()
      .when("paymentMethod", {
        is: "Cheque",
        then: (schema) => schema.required("Account No is required"),
        otherwise: (schema) => schema.notRequired(),
      }),

    transactionNo: Yup.string()
      .nullable()
      .trim()
      .when("paymentMethod", {
        is: "Internet Banking",
        then: (schema) => schema.required("Transaction No is required"),
        otherwise: (schema) => schema.notRequired(),
      }),

    mobileNumber: Yup.string()
      .matches(/^\d{8}$/, "Mobile Number must be 8 digits")
      .nullable()
      .when("paymentMethod", {
        is: "Internet Banking",
        then: (schema) => schema.required("Mobile Number is required"),
        otherwise: (schema) => schema.notRequired(),
      }),

    file: Yup.mixed().notRequired(),
    remark: Yup.string().notRequired(),
  });

  // Formik Hook
  const formik = useFormik({
    initialValues: {
      centerId: centerId,
      studentId: "",
      receiptNo: "",
      paymentDate: "",
      paymentMethod: "",
      paymentReference: "",
      paidAmount: "",
      bank: "",
      accountNo: "",
      transactionNo: "",
      mobileNumber: "",
      file: null,
      remark: "",
      invoiceIds: [],
    },
    validationSchema: validationSchema,
    enableReinitialize: true,
    onSubmit: async (values) => {
      setLoadIndicator(true);
      const formData = new FormData();
      formData.append("centerId", centerId);
      formData.append("studentId", values.studentId);
      formData.append("invoiceIds", values.invoiceIds);
      formData.append("userId", values.studentId);
      formData.append("receiptNo", values.receiptNo);
      formData.append("paymentDate", values.paymentDate);
      formData.append("paymentMethod", values.paymentMethod);
      formData.append("paymentReference", values.paymentReference);
      formData.append("paidAmount", values.paidAmount);
      formData.append("bank", values.bank);
      formData.append("accountNo", values.accountNo);
      formData.append("transactionNo", values.transactionNo);
      formData.append("mobileNumber", values.mobileNumber);
      formData.append("remark", values.remark);

      // Append file if exists
      if (values.file) {
        formData.append("file", values.file);
      }

      try {
        const response = await api.put(`/updatePayment/${id}`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });

        if (response.status === 200) {
          toast.success(response.data.message);
          navigate("/payments");
        } else {
          toast.error(response.data.message);
        }
      } catch (error) {
        toast.error(
          error.response?.data?.message || "Failed to create payment"
        );
      } finally {
        setLoadIndicator(false);
      }
    },
    validateOnChange: false,
    validateOnBlur: true,
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

  const fetchStudent = async () => {
    try {
      const student = await fetchAllStudentListByCenter(centerId);
      setStudentData(student);
    } catch (error) {
      toast.error(error);
    }
  };

  const handleInvoiceChange = (selected) => {
    setSelectedInvoice(selected);
    const totalPaidAmount = selected.reduce(
      (sum, invoice) => sum + (invoice.totalAmount || 0),
      0
    );
    formik.setFieldValue(
      "invoiceIds",
      selected.map((option) => option.value)
    );
    formik.setFieldValue("paidAmount", totalPaidAmount);
  };

  const getData = async () => {
    try {
      const responses = await api.get(`/getCustomPaymentById/${id}`);
      setData(responses.data);

      formik.setValues(responses.data);
      if (responses.data?.studentId) {
        try {
          const response = await api.get(
            `/paymentInvoiceList?centerId=${centerId}&studentId=${responses.data?.studentId}`
          );
          setInvoiceData(response.data);
        } catch (error) {
          toast.error(error.message || "Error fetching invoices");
        }
      }
      if (responses.data?.invoiceIds) {
        formik.setFieldValue("invoiceIds", responses.data.invoiceIds);
      }
    } catch (error) {
      toast.error(error);
    }
  };

  useEffect(() => {
    if (invoiceData.length > 0 && datas?.invoiceIds) {
      const selectedInvoices = invoiceOptions.filter((option) =>
        datas.invoiceIds.includes(option.value)
      );
      setSelectedInvoice(selectedInvoices);
    }
  }, [invoiceData, datas?.invoiceIds]);

  useEffect(() => {
    getData();
    fetchStudent();
  }, []);

  const handleStudentChange = async (event) => {
    const studentId = event.target.value;
    formik.setFieldValue("studentId", studentId);
    formik.setFieldValue("invoiceIds", []);
    formik.setFieldValue("paidAmount", "");
    setSelectedInvoice([]);
    setInvoiceData([]);
    try {
      const response = await api.get(
        `/paymentInvoiceList?centerId=${centerId}&studentId=${studentId}`
      );
      setInvoiceData(response.data);
    } catch (error) {
      toast.error(error.message || "Error fetching invoices");
    }
  };

  const handlePaymethodChange = (event) => {
    const paymentMethod = event.target.value;
    formik.setFieldValue("paymentMethod", paymentMethod);

    formik.setFieldValue("bank", "");
    formik.setFieldValue("accountNo", "");
    formik.setFieldValue("transactionNo", "");
    formik.setFieldValue("mobileNumber", "");
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
          &nbsp; {storedConfigure?.invoice || "Invoice and Payment"}
          <span className="breadcrumb-separator"> &gt; </span>
        </li>
        <li>
          <Link to="/payments" className="custom-breadcrumb">
            &nbsp;Payment
          </Link>
          <span className="breadcrumb-separator"> &gt; </span>
        </li>
        <li className="breadcrumb-item active" aria-current="page">
          &nbsp;Payment Edit
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
              <span class="me-2 text-muted">Edit Payment</span>
            </div>
            <div className="my-2 pe-3 d-flex align-items-center">
              <Link to="/payments">
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
                  onChange={handleStudentChange}
                >
                  <option disabled selected></option>
                  {studentData &&
                    studentData.map((std) => (
                      <option key={std.id} value={std.id}>
                        {std.studentNames}
                      </option>
                    ))}
                </select>
                {formik.touched.studentId && formik.errors.studentId && (
                  <div className="invalid-feedback">
                    {formik.errors.studentId}
                  </div>
                )}
              </div>
              <div className="col-md-6 col-12 mb-2">
                <label className="form-label">
                  Invoice<span className="text-danger">*</span>
                </label>
                <MultiSelect
                  options={invoiceOptions}
                  value={selectedInvoice}
                  onChange={(selected) => handleInvoiceChange(selected)}
                  labelledBy="Select Student"
                  className={`form-multi-select ${
                    formik.touched.invoiceIds && formik.errors.invoiceIds
                      ? "is-invalid"
                      : ""
                  }`}
                />
                {formik.touched.invoiceIds && formik.errors.invoiceIds && (
                  <div className="invalid-feedback">
                    {formik.errors.invoiceIds}
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
                    onChange={handlePaymethodChange}
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
                    {formik.touched.bank && formik.errors.bank && (
                      <div className="invalid-feedback">
                        {formik.errors.bank}
                      </div>
                    )}
                  </div>
                  <div className="col-md-6 col-12 mb-2">
                    <label className="form-label">Upload File</label>
                    <input
                      type="file"
                      name="file"
                      accept=".pdf,.doc,.docx,.png,.jpg,.jpeg"
                      className="form-control mb-2"
                      onChange={(event) => {
                        formik.setFieldValue("file", event.target.files[0]);
                      }}
                      onBlur={formik.handleBlur}
                    />
                    {datas?.file && (
                      <div
                        class="card border-0 shadow"
                        style={{ width: "70%" }}
                      >
                        <div
                          onClick={(e) => e.stopPropagation()}
                          style={{ cursor: "not-allowed" }}
                        >
                          <img
                            class="card-img-top img-fluid"
                            style={{
                              height: "10rem",
                              pointerEvents: "none",
                              cursor: "not-allowed",
                            }}
                            src={pdfLogo}
                            alt="Resume preview"
                          />
                        </div>
                        <div
                          class="card-body d-flex justify-content-between align-items-center"
                          style={{ flexWrap: "wrap" }}
                        >
                          <p
                            class="card-title fw-semibold mb-0 text-wrap"
                            style={{
                              flex: 1,
                              whiteSpace: "nowrap",
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                            }}
                            title={datas?.file?.split("/").pop()}
                          >
                            {datas?.file?.split("/").pop()}
                          </p>
                          <a
                            href={datas?.file}
                            download
                            class="btn text-dark ms-2"
                            title="Download Resume"
                            style={{ flexShrink: 0 }}
                          >
                            <MdOutlineDownloadForOffline size={25} />
                          </a>
                        </div>
                      </div>
                    )}
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
                  {formik.touched.accountNo && formik.errors.accountNo && (
                    <div className="invalid-feedback">
                      {formik.errors.accountNo}
                    </div>
                  )}
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
                    {formik.touched.transactionNo &&
                      formik.errors.transactionNo && (
                        <div className="invalid-feedback">
                          {formik.errors.transactionNo}
                        </div>
                      )}
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
                    {formik.touched.mobileNumber &&
                      formik.errors.mobileNumber && (
                        <div className="invalid-feedback">
                          {formik.errors.mobileNumber}
                        </div>
                      )}
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
                    readOnly
                  />
                  {formik.touched.paidAmount && formik.errors.paidAmount && (
                    <div className="invalid-feedback">
                      {formik.errors.paidAmount}
                    </div>
                  )}
                </div>
              </div>
              <div className="col-12">
                <label className="form-label">Remark</label>
                <div class="input-group mb-3">
                  <textarea
                    name="remark"
                    class="form-control"
                    {...formik.getFieldProps("remark")}
                    id="remark"
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

export default PaymentsEdit;
