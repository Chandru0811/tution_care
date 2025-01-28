import React, { useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import * as Yup from "yup";
import { useFormik } from "formik";
import { useState } from "react";
import api from "../../config/URL";
import { toast } from "react-toastify";
import fetchAllCoursesWithIdsC from "../List/CourseListByCenter";
import fetchAllPackageListByCenter from "../List/PackageListByCenter";
import fetchAllStudentListByCenter from "../List/StudentListByCenter";
import { ImCancelCircle } from "react-icons/im";
import { Modal, Button } from "react-bootstrap";
import fetchAllCentersWithStudentList from "../List/CenterAvailableStudentLidt";

const invoiceItemSchema = Yup.object().shape({
  item: Yup.string().required("Item name is required"),
  itemAmount: Yup.number()
    .required("Item amount is required")
    .min(0, "Item amount must be a positive number or zero"),
  taxType: Yup.string().required("Tax type is required"),
  gstAmount: Yup.number()
    .required("GST amount is required")
    .min(0, "GST amount must be a positive number or zero"),

  totalAmount: Yup.number()
    .required("Total amount is required")
    .min(0, "Total amount must be a positive number or zero"),
});

const validationSchema = Yup.object({
  centerId: Yup.string().required("*Select a Centre"),
  parent: Yup.string().required("*Select a parent"),
  studentId: Yup.string().required("*Select a Student"),
  courseId: Yup.string().required("*Select a Course"),
  // schedule: Yup.string().required("*Select a Schedule"),
  invoiceDate: Yup.string().required("*Invoice Date is required"),
  dueDate: Yup.string().required("*Due Date is required"),
  packageId: Yup.string().required("*Package is required"),
  invoicePeriodTo: Yup.string().required("*Invoice Period To is required"),
  invoicePeriodFrom: Yup.string().required("*Invoice Period From is required"),
  receiptAmount: Yup.number()
    .required("*Receipt Amount is required")
    .typeError("*Must be a Number"),
   invoiceItems: Yup.array()
      .of(invoiceItemSchema)
      .required("Invoice items are required"),
  remark: Yup.string()
    .max(200, "*The maximum length is 200 characters")
    .notRequired(),
});

export default function InvoiceEdit() {
  const [rows, setRows] = useState([{}]);
  const { id } = useParams();
  const navigate = useNavigate();
  const [centerData, setCenterData] = useState(null);
  const [courseData, setCourseData] = useState(null);
  const [studentData, setStudentData] = useState(null);
  const [packageData, setPackageData] = useState(null);
  const [taxData, setTaxData] = useState([]);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [loadIndicator, setLoadIndicator] = useState(false);
  const userName = localStorage.getItem("userName");

  const lessonOptions = [];
  for (let i = 1; i <= 50; i++) {
    lessonOptions.push(
      <option key={i} value={i}>
        {i}
      </option>
    );
  }

  const formik = useFormik({
    initialValues: {
      centerId: "",
      parent: "",
      studentId: "",
      courseId: "",
      schedule: "",
      noOfLessons: "",
      remark: "",
      invoiceDate: "",
      dueDate: "",
      packageId: "",
      invoicePeriodTo: "",
      invoicePeriodFrom: "",
      // subTotal: "",
      receiptAmount: "",
      creditAdviceOffset: "",
      gst: "",
      updatedBy: userName,
      totalAmount: "",

      invoiceItems: [
        {
          id: "",
          item: "",
          itemAmount: "",
          taxType: "",
          gstAmount: "",
          totalAmount: "",
        },
      ],
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      setLoadIndicator(true);
      const payload = {
        generateInvoice: {
          centerId: values.centerId,
          parent: values.parent,
          studentId: values.studentId,
          courseId: values.courseId,
          schedule: values.schedule,
          invoiceDate: values.invoiceDate,
          noOfLessons: values.noOfLessons,
          dueDate: values.dueDate,
          packageId: values.packageId,
          invoicePeriodFrom: values.invoicePeriodFrom,
          invoicePeriodTo: values.invoicePeriodTo,
          // subTotal: parseFloat(values.subTotal), // Ensure numerical values are parsed correctly
          gst: parseFloat(values.gst), // Ensure numerical values are parsed correctly
          creditAdviceOffset: parseFloat(values.creditAdviceOffset), // Ensure numerical values are parsed correctly
          totalAmount: parseFloat(values.totalAmount), // Ensure numerical values are parsed correctly
          remark: values.remark,
          updatedBy: userName,
          receiptAmount: parseFloat(values.receiptAmount), // Ensure numerical values are parsed correctly
        },
        invoiceItemsList: values.invoiceItems.map((item) => ({
          id: item.id,
          item: item.item,
          itemAmount: parseFloat(item.itemAmount), // Ensure numerical values are parsed correctly
          taxType: item.taxType,
          gstAmount: parseFloat(item.gstAmount), // Ensure numerical values are parsed correctly
          totalAmount: parseFloat(item.totalAmount), // Ensure numerical values are parsed correctly
          updatedBy: userName,
        })),
      };
      try {
        const response = await api.put(
          `/updateGenerateInvoiceWithInvoiceItems/${id}`,
          payload,
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        if (response.status === 200) {
          toast.success(" Invoice Generated Update successfully");
          navigate("/invoice");
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

  const fetchData = async (id) => {
    try {
      const centerId = id; // Set the default center ID
      const centerData = await fetchAllCentersWithStudentList();
      setCenterData(centerData);

      const studentData = await fetchAllStudentListByCenter(centerId);
      setStudentData(studentData);

      if (formik.centerId) {
        try {
          const packages = await fetchAllPackageListByCenter(formik.centerId);
          setPackageData(packages);
        } catch (error) {
          toast.error(error);
        }
      }
    } catch (error) {
      toast.error(error);
    }
  };

  const fetchTaxData = async () => {
    try {
      const response = await api.get("getAllTaxSetting");
      setTaxData(response.data);
    } catch (error) {
      toast.error("Error fetching tax data:", error);
    }
  };

  const fetchCourses = async (centerId) => {
    try {
      const courses = await fetchAllCoursesWithIdsC(centerId);
      setCourseData(courses);
    } catch (error) {
      toast.error(error);
    }
  };

  const fetchPackage = async (centerId) => {
    try {
      const courses = await fetchAllPackageListByCenter(centerId);
      setPackageData(courses);
    } catch (error) {
      toast.error(error);
    }
  };

  const fetchStudent = async (centerId) => {
    try {
      const studentId = await fetchAllStudentListByCenter(centerId);
      setStudentData(studentId);
    } catch (error) {
      toast.error(error);
    }
  };

  const handleCenterChange = (event) => {
    setCourseData(null);
    setPackageData(null);
    setStudentData(null);
    const centerId = event.target.value;
    formik.setFieldValue("centerId", centerId);
    fetchCourses(centerId);
    fetchPackage(centerId);
    fetchStudent(centerId);
  };

  // NEW Code
  const handleSelectChange = (index, value) => {
    const selectedTax = taxData.find((tax) => tax.id === parseInt(value));
    const gstRate = selectedTax ? selectedTax.rate : 0;
    const totalAmount =
      parseFloat(formik.values.invoiceItems[index]?.totalAmount) || 0;

    // Recalculate itemAmount based on totalAmount and gstRate
    const gstAmount = (totalAmount * gstRate) / 100;
    const itemAmount = totalAmount - gstAmount;

    const updatedRows = [...rows];
    updatedRows[index] = {
      ...updatedRows[index],
      taxType: value,
      itemAmount: itemAmount.toFixed(2),
      gstAmount: gstAmount.toFixed(2),
      totalAmount: totalAmount.toFixed(2), // Keep totalAmount unchanged
    };
    setRows(updatedRows);

    formik.setFieldValue(`invoiceItems[${index}].taxType`, value);
    formik.setFieldValue(
      `invoiceItems[${index}].itemAmount`,
      itemAmount.toFixed(2)
    );
    formik.setFieldValue(
      `invoiceItems[${index}].gstAmount`,
      gstAmount.toFixed(2)
    );
    formik.setFieldValue(
      `invoiceItems[${index}].totalAmount`,
      totalAmount.toFixed(2)
    );
  };

  const handelTotalAmountChange = (index, value) => {
    const selectedTaxType = formik.values.invoiceItems[index]?.taxType;
    const selectedTax = taxData.find(
      (tax) => tax.id === parseInt(selectedTaxType)
    );

    const gstRate = selectedTax ? selectedTax.rate : 0;
    const totalAmount = parseFloat(value) || 0;
    const itemAmount1 = (totalAmount * gstRate) / 100;
    const gstAmount = itemAmount1;
    const itemAmount = totalAmount - gstAmount;

    const updatedRows = [...rows];
    updatedRows[index] = {
      ...updatedRows[index],
      itemAmount: itemAmount.toFixed(2),
      gstAmount: gstAmount.toFixed(2),
      totalAmount: value,
    };
    setRows(updatedRows);

    formik.setFieldValue(
      `invoiceItems[${index}].itemAmount`,
      itemAmount.toFixed(2)
    );
    formik.setFieldValue(
      `invoiceItems[${index}].gstAmount`,
      gstAmount.toFixed(2)
    );
    formik.setFieldValue(`invoiceItems[${index}].totalAmount`, value);
  };

  useEffect(() => {
    const getData = async () => {
      try {
        const response = await api.get(`/getAllGenerateInvoicesById/${id}`);
        console.log("Invoice Data byID :: ",response.data.remark);
        
        const formattedResponseData = {
          ...response.data,
          invoiceDate: response.data.invoiceDate.substring(0, 10),
          dueDate: response.data.dueDate.substring(0, 10),
          invoicePeriodFrom: response.data.invoicePeriodFrom.substring(0, 10),
          invoicePeriodTo: response.data.invoicePeriodTo.substring(0, 10),
        };
        formik.setValues(formattedResponseData);
        setRows(response.data.invoiceItems);
        formik.setFieldValue("centerId", response.data.centerId);

        fetchCourses(response.data.centerId);
        fetchPackage(response.data.centerId);
        fetchData(response.data.centerId);
        // console.log("Response:", response);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    getData();
    fetchTaxData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    // Calculate total Item Amounts
    const totalItemAmount = formik.values.invoiceItems?.reduce(
      (total, item) => {
        // Ensure the item is defined and has an itemAmount property
        if (item && item.itemAmount) {
          return total + parseFloat(item.itemAmount || 0);
        }
        return total;
      },
      0
    );
    // formik.setFieldValue("creditAdviceOffset", totalItemAmount.toFixed(2));

    // Calculate total GST
    const totalGst = formik.values.invoiceItems?.reduce((total, item) => {
      // Ensure the item is defined and has a gstAmount property
      if (item && item.gstAmount) {
        return total + parseFloat(item.gstAmount || 0);
      }
      return total;
    }, 0);
    formik.setFieldValue("gst", totalGst.toFixed(2));

    // Calculate total Amount
    const totalAmount = formik.values.invoiceItems?.reduce((total, item) => {
      // Ensure the item is defined and has a totalAmount property
      if (item && item.totalAmount) {
        return total + parseFloat(item.totalAmount || 0);
      }
      return total;
    }, 0);
    formik.setFieldValue("totalAmount", totalAmount.toFixed(2));
  }, [formik.values.invoiceItems]);

  const handleRowDelete = (index) => {
    const selectedItem = formik.values.invoiceItems[index];

    if (!selectedItem || !selectedItem.item) {
      const updatedInvoiceItems = formik.values.invoiceItems.filter(
        (_, i) => i !== index
      );
      setRows(updatedInvoiceItems);
      formik.setFieldValue("invoiceItems", updatedInvoiceItems);
      return;
    }
    // Database data
    if (selectedItem.id) {
      setItemToDelete({ ...selectedItem, index });
      setShowDeleteModal(true);
    } else {
      const updatedInvoiceItems = formik.values.invoiceItems.filter(
        (_, i) => i !== index
      );
      setRows(updatedInvoiceItems);
      formik.setFieldValue("invoiceItems", updatedInvoiceItems);
    }
  };

  const handleAddRow = () => {
    const newItem = {
      id: null,
      item: "",
      itemAmount: "",
      taxType: "",
      gstAmount: "",
      totalAmount: "",
    };
    setRows([...rows, newItem]);
    formik.setFieldValue("invoiceItems", [
      ...formik.values.invoiceItems,
      newItem,
    ]);
  };

  return (
    <div className="container-fluid">
      <ol
        className="breadcrumb my-3"
        style={{ listStyle: "none", padding: 0, margin: 0 }}
      >
        <li>
          <Link to="/" className="custom-breadcrumb">
            Home
          </Link>
          <span className="breadcrumb-separator"> &gt; </span>
        </li>
        <li>
          Invoice and Payment
          <span className="breadcrumb-separator"> &gt; </span>
        </li>
        <li>
          <Link to="/invoice" className="custom-breadcrumb">
            Invoice
          </Link>
          <span className="breadcrumb-separator"> &gt; </span>
        </li>
        <li className="breadcrumb-item active" aria-current="page">
          Invoice Edit
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
            className="d-flex px-4 justify-content-between align-items-center p-1 mb-4"
            style={{ background: "#f5f7f9" }}
          >
            <div class="d-flex align-items-center">
              <div class="d-flex">
                <div class="dot active"></div>
              </div>
              <span class="me-2 text-muted">Edit Invoice</span>
            </div>
            <div className="my-2 pe-3 d-flex align-items-center">
              <Link to="/invoice">
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
                Generate
              </button>
            </div>
          </div>
          <div className="container-fluid py-3">
            <div className="row mt-3">
              <div className="col-lg-6 col-md-6 col-12 px-5">
                <div className="text-start mt-3">
                  <label htmlFor="" className="mb-1 fw-medium">
                    Centre<span class="text-danger">*</span>
                  </label>
                  <br />
                  <select
                    {...formik.getFieldProps("centerId")}
                    name="centerId"
                    className={`form-select ${
                      formik.touched.centerId && formik.errors.centerId
                        ? "is-invalid"
                        : ""
                    }`}
                    onChange={handleCenterChange}
                    disabled
                  >
                    <option selected></option>
                    {centerData &&
                      centerData.map((centerId) => (
                        <option key={centerId.id} value={centerId.id}>
                          {centerId.centerName}
                        </option>
                      ))}
                  </select>
                  {formik.touched.centerId && formik.errors.centerId && (
                    <div className="invalid-feedback">
                      {formik.errors.centerId}
                    </div>
                  )}
                </div>
                <div className="text-start mt-3">
                  <label htmlFor="" className="mb-1 fw-medium">
                    Parent<span class="text-danger">*</span>
                  </label>
                  <br />
                  <input
                    {...formik.getFieldProps("parent")}
                    className={`form-control  ${
                      formik.touched.parent && formik.errors.parent
                        ? "is-invalid"
                        : ""
                    }`}
                    type="text"
                    disabled
                  />
                  {formik.touched.parent && formik.errors.parent && (
                    <div className="invalid-feedback">
                      {formik.errors.parent}
                    </div>
                  )}
                </div>
                <div className="text-start mt-3">
                  <label htmlFor="" className="mb-1 fw-medium">
                    Student<span class="text-danger">*</span>
                  </label>
                  <br />
                  <select
                    name="studentId"
                    {...formik.getFieldProps("studentId")}
                    className={`form-select ${
                      formik.touched.studentId && formik.errors.studentId
                        ? "is-invalid"
                        : ""
                    }`}
                    disabled
                  >
                    <option selected></option>
                    {studentData &&
                      studentData.map((studentId) => (
                        <option key={studentId.id} value={studentId.id}>
                          {studentId.studentNames}
                        </option>
                      ))}
                  </select>
                  {formik.touched.studentId && formik.errors.studentId && (
                    <div className="invalid-feedback">
                      {formik.errors.studentId}
                    </div>
                  )}
                </div>
                <div className="text-start mt-3">
                  <label htmlFor="" className="mb-1 fw-medium">
                    Course<span class="text-danger">*</span>
                  </label>
                  <br />
                  <select
                    name="courseId"
                    {...formik.getFieldProps("courseId")}
                    className={`form-select ${
                      formik.touched.courseId && formik.errors.courseId
                        ? "is-invalid"
                        : ""
                    }`}
                    disabled
                  >
                    <option></option>
                    {courseData &&
                      courseData.map((courseId) => (
                        <option key={courseId.id} value={courseId.id}>
                          {courseId.courseNames}
                        </option>
                      ))}
                  </select>
                  {formik.touched.courseId && formik.errors.courseId && (
                    <div className="invalid-feedback">
                      {formik.errors.courseId}
                    </div>
                  )}
                </div>
                <div className="text-start mt-3">
                  <label htmlFor="" className="mb-1 fw-medium">
                    Schedule
                  </label>
                  <br />
                  <input
                    name="schedule"
                    {...formik.getFieldProps("schedule")}
                    className={`form-control ${
                      formik.touched.schedule && formik.errors.schedule
                        ? "is-invalid"
                        : ""
                    }`}
                    readOnly
                  />
                  {formik.touched.schedule && formik.errors.schedule && (
                    <div className="invalid-feedback">
                      {formik.errors.schedule}
                    </div>
                  )}
                </div>
                <div className="text-start mt-3">
                  <label htmlFor="" className="mb-1 fw-medium">
                    Package<span class="text-danger">*</span>
                  </label>
                  <br />
                  <select
                    {...formik.getFieldProps("packageId")}
                    className={`form-select ${
                      formik.touched.packageId && formik.errors.packageId
                        ? "is-invalid"
                        : ""
                    }`}
                    disabled
                  >
                    <option selected></option>
                    {packageData &&
                      packageData.map((packages) => (
                        <option key={packages.id} value={packages.id}>
                          {packages.packageNames}
                        </option>
                      ))}
                  </select>
                  {formik.touched.packageId && formik.errors.packageId && (
                    <div className="invalid-feedback">
                      {formik.errors.packageId}
                    </div>
                  )}
                </div>

                <div className="text-start mt-3">
                  <label htmlFor="" className="mb-1 fw-medium">
                    Remarks
                  </label>
                  <br />
                  <textarea
                    name="remark"
                    {...formik.getFieldProps("remark")}
                    className="form-control "
                    type="text"
                    style={{
                      height: "7rem",
                    }}
                    maxLength={200}
                    onKeyDown={(e) => {
                      // Allow "Enter" inside the textarea to create a new line
                      if (e.key === "Enter") {
                        e.stopPropagation(); // Prevent the event from bubbling up to the parent
                      }
                    }}
                  />
                </div>
              </div>
              <div className="col-lg-6 col-md-6 col-12 px-5">
                <div className="text-start mt-3">
                  <label htmlFor="" className="mb-1 fw-medium">
                    Invoice Date<span className="text-danger">*</span>
                  </label>
                  <br />
                  <input
                    {...formik.getFieldProps("invoiceDate")}
                    className={`form-control ${
                      formik.touched.invoiceDate && formik.errors.invoiceDate
                        ? "is-invalid"
                        : ""
                    }`}
                    type="date"
                  />
                  {formik.touched.invoiceDate && formik.errors.invoiceDate && (
                    <div className="invalid-feedback">
                      {formik.errors.invoiceDate}
                    </div>
                  )}
                </div>

                <div className="text-start mt-3">
                  <label htmlFor="" className="mb-1 fw-medium">
                    Due Date<span className="text-danger">*</span>
                  </label>
                  <br />
                  <input
                    {...formik.getFieldProps("dueDate")}
                    className={`form-control ${
                      formik.touched.dueDate && formik.errors.dueDate
                        ? "is-invalid"
                        : ""
                    }`}
                    type="date"
                    // Set the minimum due date to the selected invoice date
                    min={
                      formik.values.invoiceDate ||
                      new Date().toISOString().split("T")[0]
                    }
                  />
                  {formik.touched.dueDate && formik.errors.dueDate && (
                    <div className="invalid-feedback">
                      {formik.errors.dueDate}
                    </div>
                  )}
                </div>

                <div className="text-start mt-3">
                  <label htmlFor="" className="mb-1 fw-medium">
                    Invoice Period From<span class="text-danger">*</span>
                  </label>
                  <br />
                  <input
                    name="invoicePeriodFrom"
                    {...formik.getFieldProps("invoicePeriodFrom")}
                    className={`form-control  ${
                      formik.touched.invoicePeriodFrom &&
                      formik.errors.invoicePeriodFrom
                        ? "is-invalid"
                        : ""
                    }`}
                    type="date"
                  />
                  {formik.touched.invoicePeriodFrom &&
                    formik.errors.invoicePeriodFrom && (
                      <div className="invalid-feedback">
                        {formik.errors.invoicePeriodFrom}
                      </div>
                    )}
                </div>
                <div className="text-start mt-3">
                  <label htmlFor="" className="mb-1 fw-medium">
                    Invoice Period To<span class="text-danger">*</span>
                  </label>
                  <br />
                  <input
                    name="invoicePeriodTo"
                    {...formik.getFieldProps("invoicePeriodTo")}
                    className={`form-control  ${
                      formik.touched.invoicePeriodTo &&
                      formik.errors.invoicePeriodTo
                        ? "is-invalid"
                        : ""
                    }`}
                    type="date"
                  />
                  {formik.touched.invoicePeriodTo &&
                    formik.errors.invoicePeriodTo && (
                      <div className="invalid-feedback">
                        {formik.errors.invoicePeriodTo}
                      </div>
                    )}
                </div>

                <div className="text-start mt-3">
                  <label htmlFor="" className="mb-1 fw-medium">
                    Receipt Amount<span class="text-danger">*</span>
                  </label>
                  <br />
                  <input
                    name="receiptAmount"
                    {...formik.getFieldProps("receiptAmount")}
                    className={`form-control  ${
                      formik.touched.receiptAmount &&
                      formik.errors.receiptAmount
                        ? "is-invalid"
                        : ""
                    }`}
                    type="text"
                    placeholder=""
                  />
                  {formik.touched.receiptAmount &&
                    formik.errors.receiptAmount && (
                      <div
                        className="text-danger"
                        style={{ fontSize: ".875em" }}
                      >
                        {formik.errors.receiptAmount}
                      </div>
                    )}
                </div>
                {/* <div className="text-start mt-3">
                  <label htmlFor="" className="mb-1 fw-medium">
                    Number of Lesson
                  </label>
                  <br />
                  <select
                    name="noOfLessons"
                    {...formik.getFieldProps("noOfLessons")}
                    class="form-select "
                    aria-label="Default select example"
                  >
                    <option value="" selected></option>
                    {lessonOptions}
                  </select>
                </div> */}
                <div className="text-start mt-3">
                  <label htmlFor="" className="mb-1 fw-medium">
                    Number of Lesson
                  </label>
                  <br />
                  <input
                    id="noOfLessons"
                    name="noOfLessons"
                    type="text"
                    className="form-control"
                    {...formik.getFieldProps("noOfLessons")}
                    value={formik.values.noOfLessons || ""}
                    onChange={(e) => {
                      formik.setFieldValue("noOfLessons", e.target.value);
                    }}
                    readOnly
                  />
                </div>
              </div>
            </div>

            <div className="row mt-5 pt-5 flex-nowrap">
              <div className="col-12">
                <div className="table-responsive table-bordered">
                  <table className="table table-light table-nowrap">
                    <thead className="thead-light">
                      <tr>
                        <th>
                          Item<span className="text-danger">*</span>
                        </th>
                        <th>
                          Item Amount (Exc GST)
                          <span className="text-danger">*</span>
                        </th>
                        <th>
                          Tax Type<span className="text-danger">*</span>
                        </th>
                        <th>
                          GST Amount<span className="text-danger">*</span>
                        </th>
                        <th>
                          Total Amount (Inc GST)
                          <span className="text-danger">*</span>
                        </th>
                        <th></th>
                      </tr>
                    </thead>
                    <tbody>
                      {rows.map((row, index) => {
                        const isNonDeletable =
                          row.item === "Registration Fee" ||
                          row.item === "Course Fee" ||
                          row.item === "Deposit Fee";

                        return (
                          <tr key={index}>
                            <td>
                              <input
                                {...formik.getFieldProps(
                                  `invoiceItems[${index}].item`
                                )}
                                className={`form-control ${
                                  formik.touched.invoiceItems?.[index]?.item &&
                                  formik.errors.invoiceItems?.[index]?.item
                                    ? "is-invalid"
                                    : ""
                                }`}
                                type="text"
                                style={{ width: "80%" }}
                              />
                              {formik.touched.invoiceItems?.[index]?.item &&
                                formik.errors.invoiceItems?.[index]?.item && (
                                  <div className="invalid-feedback">
                                    {formik.errors.invoiceItems[index].item}
                                  </div>
                                )}
                            </td>
                            <td>
                              <input
                                {...formik.getFieldProps(
                                  `invoiceItems[${index}].itemAmount`
                                )}
                                className={`form-control ${
                                  formik.touched.invoiceItems?.[index]
                                    ?.itemAmount &&
                                  formik.errors.invoiceItems?.[index]
                                    ?.itemAmount
                                    ? "is-invalid"
                                    : ""
                                }`}
                                type="number"
                                min={0}
                                style={{ width: "80%" }}
                                onChange={formik.handleChange}
                                readOnly
                              />
                              {formik.touched.invoiceItems?.[index]
                                ?.itemAmount &&
                                formik.errors.invoiceItems?.[index]
                                  ?.itemAmount && (
                                  <div className="invalid-feedback">
                                    {
                                      formik.errors.invoiceItems[index]
                                        .itemAmount
                                    }
                                  </div>
                                )}
                            </td>
                            <td>
                              <select
                                className={`form-select ${
                                  formik.touched.invoiceItems?.[index]
                                    ?.taxType &&
                                  formik.errors.invoiceItems?.[index]?.taxType
                                    ? "is-invalid"
                                    : ""
                                }`}
                                {...formik.getFieldProps(
                                  `invoiceItems[${index}].taxType`
                                )}
                                style={{ width: "100%" }}
                                onChange={(e) =>
                                  handleSelectChange(index, e.target.value)
                                }
                              >
                                <option value=""></option>
                                {taxData &&
                                  taxData.map((tax) => (
                                    <option key={tax.id} value={tax.id}>
                                      {`${tax.taxType} ${tax.rate}%`}
                                    </option>
                                  ))}
                              </select>
                              {formik.touched.invoiceItems?.[index]?.taxType &&
                                formik.errors.invoiceItems?.[index]
                                  ?.taxType && (
                                  <div className="invalid-feedback">
                                    {formik.errors.invoiceItems[index].taxType}
                                  </div>
                                )}
                            </td>
                            <td>
                              <input
                                {...formik.getFieldProps(
                                  `invoiceItems[${index}].gstAmount`
                                )}
                                className="form-control"
                                type="text"
                                style={{ width: "80%" }}
                                readOnly
                                onChange={formik.handleChange}
                              />
                            </td>
                            <td>
                              <input
                                onInput={(event) => {
                                  event.target.value =
                                    event.target.value.replace(/[^0-9]/g, "");
                                }}
                                {...formik.getFieldProps(
                                  `invoiceItems[${index}].totalAmount`
                                )}
                                className="form-control"
                                type="text"
                                style={{ width: "80%" }}
                                onChange={(e) =>
                                  handelTotalAmountChange(index, e.target.value)
                                }
                              />
                            </td>
                            <td>
                              {!isNonDeletable && (
                                <button
                                  type="button"
                                  className="btn btn-white border-white"
                                  onClick={() => handleRowDelete(index)}
                                >
                                  <ImCancelCircle className="fs-6 fw-medium text-danger" />
                                </button>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            <div className="row mt-3">
              <div className="col-12 text-end mt-3">
                <button
                  className="btn btn-sm text-white"
                  type="button"
                  style={{
                    fontWeight: "600px !important",
                    background: "#eb862a",
                  }}
                  onClick={handleAddRow}
                >
                  Add Row
                </button>
              </div>
              <div className="col-lg-6 col-md-6 col-12"></div>
              <div className="col-lg-6 col-md-6 col-12">
                <div className="">
                  <div className="text-start mt-3">
                    <label htmlFor="" className="mb-1 fw-medium">
                      Credit Advise Offset
                    </label>
                    <br />
                    <input
                      {...formik.getFieldProps("creditAdviceOffset")}
                      className="form-control"
                      type="text"
                      placeholder=""
                      readOnly
                    />
                  </div>
                  <div className="text-start mt-3">
                    <label htmlFor="" className="mb-1 fw-medium">
                      GST Amount
                    </label>
                    <br />
                    <input
                      {...formik.getFieldProps("gst")}
                      className="form-control  "
                      type="text"
                      placeholder=""
                      readOnly
                    />
                  </div>
                  <div className="text-start mt-3">
                    <label htmlFor="" className="mb-1 fw-medium">
                      Total Amount
                    </label>
                    <br />
                    <input
                      {...formik.getFieldProps("totalAmount")}
                      className="form-control  "
                      type="text"
                      placeholder=""
                      readOnly
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </form>
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Deletion</Modal.Title>
        </Modal.Header>
        <Modal.Body>Are you sure you want to delete this item?</Modal.Body>
        <Modal.Footer>
          <Button
            className="btn btn-sm btn-border bg-light text-dark"
            onClick={() => setShowDeleteModal(false)}
          >
            Cancel
          </Button>
          <Button
            variant="danger"
            onClick={async () => {
              // Perform deletion on confirm
              try {
                const response = await api.delete(
                  `deleteInvoiceItems/${itemToDelete.id}`
                );
                if (response.status === 201) {
                  // Remove the item from formik values and rows
                  const updatedInvoiceItems = formik.values.invoiceItems.filter(
                    (_, i) => i !== itemToDelete.index
                  );
                  setRows(updatedInvoiceItems);
                  formik.setFieldValue("invoiceItems", updatedInvoiceItems);
                  toast.success(response.data.message);
                } else {
                  toast.error(response.data.message);
                }
              } catch (error) {
                console.error("Error deleting data:", error);
              }
              setShowDeleteModal(false); // Close the modal after deletion
            }}
          >
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
