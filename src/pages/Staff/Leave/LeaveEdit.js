import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
// import fetchAllTeacherListByCenter from "../../List/TeacherListByCenter";
import fetchAllCentersWithIds from "../../List/CenterList";
import { toast } from "react-toastify";
import api from "../../../config/URL";
import pdfLogo from "../../../assets/images/Attactmentpdf.jpg";
import { MdOutlineDownloadForOffline } from "react-icons/md";

const validationSchema = Yup.object({
  leaveTypeId: Yup.string().required("*Select a Leave Type"),
  fromDate: Yup.string().required("*From Date is required"),
  toDate: Yup.string()
    .required("*To Date is required")
    .test(
      "is-greater",
      "*To Date should be later than From Date",
      function (value) {
        const { fromDate } = this.parent;
        return !fromDate || !value || new Date(value) >= new Date(fromDate);
      }
    ),
  dayType: Yup.string().required("*Day Type is required"),
  leaveReason: Yup.string().required("*Leave Reason is required"),
  file: Yup.mixed()
    .notRequired()
    .test(
      "max-file-name-length",
      "*File name must be at most 50 characters",
      (value) => !value || (value.name && value.name.length <= 50)
    ),
});

function LeaveEdit() {
  const { id } = useParams();
  const [centerData, setCenterData] = useState(null);
  const [datas, setDatas] = useState([]);
  const [leavedatas, setLeaveDatas] = useState([]);
  console.log("Datas:", datas);
  const userId = localStorage.getItem("userId");
  const centerId = localStorage.getItem("centerId");
  const navigate = useNavigate();
  const [loadIndicator, setLoadIndicator] = useState(false);
  const [daysDifference, setDaysDifference] = useState(0);
  const [leaveTypeData, setLeaveTypeData] = useState([]);
  const userName = localStorage.getItem("userName");

  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0]
  );

  const formik = useFormik({
    initialValues: {
      userId: userId,
      centerId: "",
      centerName: "",
      employeeName: "",
      leaveTypeId: "",
      noOfDays: "",
      fromDate: "",
      toDate: "",
      requestDate: "",
      approverName: "",
      dayType: "",
      leaveStatus: "",
      leaveReason: "",
      file: "",
    },
    validationSchema: validationSchema,

    onSubmit: async (data) => {
      setLoadIndicator(true);
      let selectedCenterName = "";

      if (centerData) {
        centerData.forEach((center) => {
          if (parseInt(centerId) === center.id) {
            selectedCenterName = center.centerNames || "--";
          }
        });
      }
      try {
        const formDatas = new FormData();
        formDatas.append("userId", userId);
        formDatas.append("centerName", selectedCenterName);
        formDatas.append("employeeName", datas && datas.employeeName);
        formDatas.append("leaveTypeId", data.leaveTypeId);
        formDatas.append("noOfDays", data.noOfDays);
        formDatas.append("fromDate", data.fromDate);
        formDatas.append("toDate", data.toDate);
        formDatas.append("dayType", data.dayType);
        formDatas.append("leaveReason", data.leaveReason);
        formDatas.append("leaveStatus", "PENDING");
        formDatas.append("file", data.file);
        formDatas.append("updatedBy", userName);

        const response = await api.put(
          `/updateUserLeaveRequestWithAttachment/${id}`,
          formDatas,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
        if (response.status === 201) {
          toast.success(response.data.message);
          navigate("/leave");
        } else {
          toast(response.data.message);
        }
      } catch (error) {
        if (error.response.status === 409) {
          toast.warning(error?.response?.data?.message);
        } else {
          toast.error(error?.response?.data?.message);
        }
      } finally {
        setLoadIndicator(false);
      }
    },
  });

  const calculateDays = (fromDate, toDate) => {
    const fromDateObj = new Date(fromDate);
    const toDateObj = new Date(toDate);
    const difference = toDateObj.getTime() - fromDateObj.getTime();
    const daysDifference = Math.ceil(difference / (1000 * 3600 * 24)) + 1;
    formik.setFieldValue("noOfDays", daysDifference);
    return daysDifference;
  };

  const fetchData = async () => {
    try {
      const centers = await fetchAllCentersWithIds();
      setCenterData(centers);
    } catch (error) {
      toast.error(error);
    }
  };

  const fetchLeaveType = async () => {
    try {
      const response = await api.get(`getAllLeaveSetting`);
      setLeaveTypeData(response.data); // Assuming response.data is an array
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    fetchData();
    fetchLeaveType();
  }, []);

  useEffect(() => {
    const getData = async () => {
      try {
        const response = await api.get(
          `/getUserLeaveRequestByUserId/${userId}`
        );
        setDatas(response.data);
      } catch (error) {
        toast.error("Error Fetching Data : ", error);
      }
    };
    getData();
  }, []);

  useEffect(() => {
    const getData = async () => {
      try {
        const response = await api.get(`/getUserLeaveRequestById/${id}`);
        setLeaveDatas(response.data);
        formik.setValues(response.data);
        const daysDiff = calculateDays(
          response.data.fromDate,
          response.data.toDate
        );
        setDaysDifference(daysDiff);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    getData();
  }, [id]);

  return (
    <section>
      <div className="container">
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
            &nbsp;Staffing
            <span className="breadcrumb-separator"> &gt; </span>
          </li>
          <li>
            <Link to="/leave" className="custom-breadcrumb">
              &nbsp;Leave Request{" "}
              <span className="breadcrumb-separator"> &gt; </span>
            </Link>
          </li>
          <li className="breadcrumb-item active" aria-current="page">
            &nbsp;Leave Request Edit
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
                <span class="me-2 text-muted">Edit Leave</span>
              </div>
              <div className="my-2 pe-3 d-flex align-items-center">
                <Link to="/leave">
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
                <div className="col-md-6 col-12 mb-3">
                  <label className="form-label">
                    Employee Name<span className="text-danger">*</span>
                  </label>
                  <input
                    type="text"
                    name="employeeName"
                    className="form-control"
                    value={datas && datas.employeeName}
                    readOnly
                  />
                  <input
                    type="hidden"
                    name="userId"
                    value={datas && datas.userId}
                    {...formik.getFieldProps("userId")}
                  />
                </div>

                <div className="col-md-6 col-12 mb-3">
                  <label className="form-label">
                    Leave Type<span className="text-danger">*</span>
                  </label>
                  <select
                    className={`form-select  ${
                      formik.touched.leaveTypeId && formik.errors.leaveTypeId
                        ? "is-invalid"
                        : ""
                    }`}
                    {...formik.getFieldProps("leaveTypeId")}
                  >
                    <option selected></option>
                    {leaveTypeData &&
                      leaveTypeData.map((leave) => (
                        <option key={leave.id} value={leave.id}>
                          {leave.leaveType}
                        </option>
                      ))}
                  </select>
                  {formik.touched.leaveTypeId && formik.errors.leaveTypeId && (
                    <div className="invalid-feedback">
                      {formik.errors.leaveTypeId}
                    </div>
                  )}
                </div>

                <div className="col-md-6 col-12 mb-3">
                  <label className="form-label">
                    From Date<span className="text-danger">*</span>
                  </label>
                  <input
                    type="date"
                    // onFocus={(e) => e.target.showPicker()}
                    className={`form-control  ${
                      formik.touched.fromDate && formik.errors.fromDate
                        ? "is-invalid"
                        : ""
                    }`}
                    {...formik.getFieldProps("fromDate")}
                    onChange={(e) => {
                      formik.handleChange(e);
                      const daysDiff = calculateDays(
                        e.target.value,
                        formik.values.toDate
                      );
                      setDaysDifference(daysDiff);
                    }}
                  />
                  {formik.touched.fromDate && formik.errors.fromDate && (
                    <div className="invalid-feedback">
                      {formik.errors.fromDate}
                    </div>
                  )}
                </div>

                <div className="col-md-6 col-12 mb-3">
                  <label className="form-label">
                    To Date<span className="text-danger">*</span>
                  </label>
                  <input
                    type="date"
                    // onFocus={(e) => e.target.showPicker()}
                    className={`form-control  ${
                      formik.touched.toDate && formik.errors.toDate
                        ? "is-invalid"
                        : ""
                    }`}
                    {...formik.getFieldProps("toDate")}
                    onChange={(e) => {
                      formik.handleChange(e);
                      const daysDiff = calculateDays(
                        formik.values.fromDate,
                        e.target.value || "0"
                      );
                      setDaysDifference(daysDiff);
                    }}
                  />
                  {formik.touched.toDate && formik.errors.toDate && (
                    <div className="invalid-feedback">
                      {formik.errors.toDate}
                    </div>
                  )}
                </div>

                <div className="col-md-6 col-12 mb-3">
                  <label className="form-label">
                    No.Of.Days<span className="text-danger">*</span>
                  </label>
                  <input
                    type="text"
                    name="noOfDays"
                    className={`form-control  ${
                      formik.touched.noOfDays && formik.errors.noOfDays
                        ? "is-invalid"
                        : ""
                    }`}
                    {...formik.getFieldProps("noOfDays")}
                    value={daysDifference || "0"}
                    readOnly
                  />
                  {formik.touched.noOfDays && formik.errors.noOfDays && (
                    <div className="invalid-feedback">
                      {formik.errors.noOfDays}
                    </div>
                  )}
                </div>

                <div className="col-md-6 col-12 mb-3">
                  <label className="form-label">
                    Day Type<span className="text-danger">*</span>
                  </label>
                  <input
                    type="text"
                    className={`form-control  ${
                      formik.touched.dayType && formik.errors.dayType
                        ? "is-invalid"
                        : ""
                    }`}
                    {...formik.getFieldProps("dayType")}
                  />
                  {formik.touched.dayType && formik.errors.dayType && (
                    <div className="invalid-feedback">
                      {formik.errors.dayType}
                    </div>
                  )}
                </div>
                <div className="col-md-6 col-12 mb-3">
                  <label className="form-label">Attachment</label>
                  <input
                    type="file"
                    className="form-control"
                    name="file"
                    accept=".jpg,.jpeg,.png,.pdf"
                    onChange={(event) => {
                      formik.setFieldValue(
                        "file",
                        event.currentTarget.files[0]
                      );
                    }}
                    onBlur={formik.handleBlur}
                  />
                  {formik.touched.file && formik.errors.file && (
                    <div className="error text-danger">
                      <small>{formik.errors.file}</small>
                    </div>
                  )}
                  <div className="mt-3">
                    {formik.values.file instanceof File ? (
                      formik.values.file.type.startsWith("image/") ? (
                        <img
                          src={URL.createObjectURL(formik.values.file)}
                          alt="Preview"
                          className="img-fluid"
                        />
                      ) : formik.values.file.type === "application/pdf" ? (
                        <div
                          className="card border-0 shadow"
                          style={{ width: "70%" }}
                        >
                          <div
                            onClick={(e) => e.stopPropagation()}
                            style={{ cursor: "not-allowed" }}
                          >
                            <img
                              className="card-img-top img-fluid"
                              style={{
                                height: "10rem",
                                pointerEvents: "none",
                                cursor: "not-allowed",
                              }}
                              src={
                                leavedatas.attachment.endsWith(".pdf")
                                  ? pdfLogo
                                  : leavedatas.attachment
                              }
                              alt="Attachment Preview"
                            />
                          </div>
                          <div
                            className="card-body d-flex justify-content-between align-items-center"
                            style={{ flexWrap: "wrap" }}
                          >
                            <p
                              className="card-title fw-semibold mb-0 text-wrap"
                              style={{
                                flex: 1,
                                whiteSpace: "nowrap",
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                              }}
                              title={formik.values.file.name.split("/").pop()}
                            >
                              {formik.values.file.name.split("/").pop()}
                            </p>
                            <a
                              href={URL.createObjectURL(formik.values.file)}
                              download
                              className="btn text-dark ms-2"
                              title="Download Attachment"
                              style={{ flexShrink: 0 }}
                            >
                              <MdOutlineDownloadForOffline size={25} />
                            </a>
                          </div>
                        </div>
                      ) : (
                        <p className="text-muted">
                          Unsupported file type for preview
                        </p>
                      )
                    ) : leavedatas?.attachment ? (
                      <div
                        className="card border-0 shadow"
                        style={{ width: "70%" }}
                      >
                        <div
                          onClick={(e) => e.stopPropagation()}
                          style={{ cursor: "not-allowed" }}
                        >
                          <img
                            className="card-img-top img-fluid"
                            style={{
                              height: "10rem",
                              pointerEvents: "none",
                              cursor: "not-allowed",
                            }}
                            src={
                              leavedatas.attachment.endsWith(".pdf")
                                ? pdfLogo
                                : leavedatas.attachment
                            }
                            alt="Attachment Preview"
                          />
                        </div>
                        <div
                          className="card-body d-flex justify-content-between align-items-center"
                          style={{ flexWrap: "wrap" }}
                        >
                          <p
                            className="card-title fw-semibold mb-0 text-wrap"
                            style={{
                              flex: 1,
                              whiteSpace: "nowrap",
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                            }}
                            title={leavedatas.attachment.split("/").pop()}
                          >
                            {leavedatas.attachment.split("/").pop()}
                          </p>
                          <a
                            href={leavedatas.attachment}
                            download
                            className="btn text-dark ms-2"
                            title="Download Attachment"
                            style={{ flexShrink: 0 }}
                          >
                            <MdOutlineDownloadForOffline size={25} />
                          </a>
                        </div>
                      </div>
                    ) : null}
                  </div>
                </div>

                <div className="col-md-6 col-12 mb-3">
                  <label className="form-label">
                    Leave Reason<span className="text-danger">*</span>
                  </label>
                  <textarea
                    rows={5}
                    className={`form-control  ${
                      formik.touched.leaveReason && formik.errors.leaveReason
                        ? "is-invalid"
                        : ""
                    }`}
                    {...formik.getFieldProps("leaveReason")}
                  ></textarea>
                  {formik.touched.leaveReason && formik.errors.leaveReason && (
                    <div className="invalid-feedback">
                      {formik.errors.leaveReason}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </section>
  );
}

export default LeaveEdit;
