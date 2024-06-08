import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import fetchAllCentersWithIds from "../List/CenterList";
import toast from "react-hot-toast";
import api from "../../config/URL";
import fetchAllEmployeeListByCenter from "../List/EmployeeList";
// import { format } from "date-fns";

const validationSchema = Yup.object({
  tuitionId: Yup.string().required("*Centre name is required"),
  userId: Yup.string().required("*Employee name is required"),
  date: Yup.string().required("*Date is required"),
  attendanceStatus: Yup.string().required("*Attendance status is required"),
  modeOfWorking: Yup.string().required("*Mode of working is required"),
  checkIn: Yup.string().required("*Check-in is required"),
  checkOut: Yup.string().required("*Check-out is required"),
  otStartTime: Yup.string().required("*OT start time is required"),
  otEndTime: Yup.string().required("*OT end time is required"),
  attendanceRemark: Yup.string().required("*Attendance remark is required"),
});

function StaffingAttendanceAdd() {
  const [centerData, setCenterData] = useState(null);
  const [userNamesData, setUserNameData] = useState(null);
  const [loadIndicator, setLoadIndicator] = useState(false);
  // const currentDate = format(new Date(), "yyyy-MM-dd");
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      tuitionId: "",
      userId: "",
      // date: currentDate,
      attendanceStatus: "",
      modeOfWorking: "",
      checkIn: "",
      checkOut: "",
      checkInmode: "",
      checkOutmode: "",
      otStartTime: "",
      otEndTime: "",
      attendanceRemark: "",
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      setLoadIndicator(true);
      console.log("Attendance Emp:", values);
      let selectedCenterName = "";
      let selectedEmployeeName = "";

      centerData.forEach((center) => {
        if (parseInt(values.tuitionId) === center.id) {
          selectedCenterName = center.centerNames || "--";
        }
      });

      userNamesData.forEach((employee) => {
        if (parseInt(values.userId) === employee.id) {
          selectedEmployeeName = employee.userNames || "--";
        }
      });

      let payload = {
        tuitionId: values.tuitionId,
        centerName: selectedCenterName,
        userId: values.userId,
        employeeName: selectedEmployeeName,
        date: values.date,
        attendanceStatus: values.attendanceStatus,
        modeOfWorking: values.modeOfWorking,
        checkIn: values.checkIn,
        checkOut: values.checkOut,
        checkInmode: values.checkInmode,
        checkOutmode: values.checkOutmode,
        otStartTime: values.otStartTime,
        otEndTime: values.otEndTime,
        attendanceRemark: values.attendanceRemark,
      };

      try {
        const response = await api.post("/createUserAttendance", payload, {
          headers: {
            "Content-Type": "application/json",
          },
        });
        if (response.status === 201) {
          toast.success(response.data.message);
          navigate("/staffing/attendance");
        } else {
          toast.error(response.data.message);
        }
      } catch (error) {
        toast.error(error);
      } finally {
        setLoadIndicator(false);
      }
    },
  });

  const handleCenterChange = async (event) => {
    setUserNameData(null);
    const tuitionId = event.target.value;
    formik.setFieldValue("tuitionId", tuitionId);
    try {
      await fetchUserName(tuitionId);
    } catch (error) {
      toast.error(error);
    }
  };

  const fetchData = async () => {
    try {
      const centers = await fetchAllCentersWithIds();
      setCenterData(centers);
    } catch (error) {
      toast.error(error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const fetchUserName = async (tuitionId) => {
    try {
      const userNames = await fetchAllEmployeeListByCenter(tuitionId);
      setUserNameData(userNames);
    } catch (error) {
      toast.error(error);
    }
  };

  return (
    <section className="AttendanceAdd p-3">
      <div className="container-fluid">
        <div className="container">
          <form onSubmit={formik.handleSubmit}>
            <div className="card shadow border-0 mb-2 top-header">
              <div className="container-fluid py-4">
                <div className="row align-items-center">
                  <div className="col">
                    <div className="d-flex align-items-center gap-4">
                      <h2 className="h2 ls-tight headingColor">
                        Add Staffing Attendance
                      </h2>
                    </div>
                  </div>
                  <div className="col-auto">
                    <div className="hstack gap-2 justify-content-end">
                      <Link to="/staffing/attendance">
                        <button type="submit" className="btn btn-sm btn-light">
                          <span>Back</span>
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
                        Save
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="card shadow border-0 mb-2 top-header">
            <div className="container p-5">
            <div className="row mt-3">
              <div className="col-md-6 col-12 mb-3 ">
                <lable className="">Centre Name</lable>
                <span className="text-danger">*</span>
                <select
                  {...formik.getFieldProps("tuitionId")}
                  className={`form-select ${
                    formik.touched.tuitionId && formik.errors.tuitionId
                      ? "is-invalid"
                      : ""
                  }`}
                  aria-label="Default select example"
                  onChange={handleCenterChange}
                >
                  <option selected disabled></option>
                  {centerData &&
                    centerData.map((center) => (
                      <option key={center.id} value={center.id}>
                        {center.centerNames}
                      </option>
                    ))}
                </select>
                {formik.touched.tuitionId && formik.errors.tuitionId && (
                  <div className="invalid-feedback">
                    {formik.errors.tuitionId}
                  </div>
                )}
              </div>

              <div className="col-md-6 col-12 mb-3 ">
                <lable className="">Employee Name</lable>
                <select
                  {...formik.getFieldProps("userId")}
                  class={`form-select  ${
                    formik.touched.userId && formik.errors.userId
                      ? "is-invalid"
                      : ""
                  }`}
                >
                  <option selected disabled></option>
                  {userNamesData &&
                    userNamesData.map((userName) => (
                      <option key={userName.id} value={userName.id}>
                        {userName.userNames}
                      </option>
                    ))}
                </select>
                {formik.touched.userId && formik.errors.userId && (
                  <div className="invalid-feedback">{formik.errors.userId}</div>
                )}
              </div>

              <div className="col-md-6 col-12 mb-3 ">
                <lable className="">Date</lable>
                <span className="text-danger">*</span>
                <input
                  type="date"
                  className={`form-control ${
                    formik.touched.date && formik.errors.date
                      ? "is-invalid"
                      : ""
                  }`}
                  {...formik.getFieldProps("date")}
                />
                {formik.touched.date && formik.errors.date && (
                  <div className="invalid-feedback">{formik.errors.date}</div>
                )}
              </div>
              <div className="col-md-6 col-12 mb-3 ">
                <lable className="">Attendance Status</lable>
                <span className="text-danger">*</span>
                <select
                  className={`form-select ${
                    formik.touched.attendanceStatus &&
                    formik.errors.attendanceStatus
                      ? "is-invalid"
                      : ""
                  }`}
                  {...formik.getFieldProps("attendanceStatus")}
                  aria-label="Default select example"
                >
                  <option selected></option>
                  <option value="Present">Present</option>
                  <option value="Absent">Absent</option>
                </select>
                {formik.touched.attendanceStatus &&
                  formik.errors.attendanceStatus && (
                    <div className="invalid-feedback">
                      {formik.errors.attendanceStatus}
                    </div>
                  )}
              </div>
              <div className="col-md-6 col-12 mb-3 ">
                <lable className="">Mode Of Working</lable>
                <span className="text-danger">*</span>
                <select
                  className={`form-select ${
                    formik.touched.modeOfWorking && formik.errors.modeOfWorking
                      ? "is-invalid"
                      : ""
                  }`}
                  {...formik.getFieldProps("modeOfWorking")}
                  aria-label="Default select example"
                >
                  <option selected></option>
                  <option value="WORK_FROM_HOME">Work From Home</option>
                  <option value="WORK_FROM_OFFICE">Work From Office</option>
                </select>
                {formik.touched.modeOfWorking &&
                  formik.errors.modeOfWorking && (
                    <div className="invalid-feedback">
                      {formik.errors.modeOfWorking}
                    </div>
                  )}
              </div>
              <div className="col-md-6 col-12 mb-3 ">
                <lable className="">Check In</lable>
                <span className="text-danger">*</span>
                <input
                  type="time"
                  className={`form-control ${
                    formik.touched.checkIn && formik.errors.checkIn
                      ? "is-invalid"
                      : ""
                  }`}
                  {...formik.getFieldProps("checkIn")}
                />
                {formik.touched.checkIn && formik.errors.checkIn && (
                  <div className="invalid-feedback">
                    {formik.errors.checkIn}
                  </div>
                )}
              </div>
              <div className="col-md-6 col-12 mb-3 ">
                <lable className="">Check Out</lable>
                <span className="text-danger">*</span>
                <input
                  type="time"
                  className={`form-control ${
                    formik.touched.checkOut && formik.errors.checkOut
                      ? "is-invalid"
                      : ""
                  }`}
                  {...formik.getFieldProps("checkOut")}
                />
                {formik.touched.checkOut && formik.errors.checkOut && (
                  <div className="invalid-feedback">
                    {formik.errors.checkOut}
                  </div>
                )}
              </div>
              {/* <div className="col-md-6 col-12 mb-3 ">
                <lable className="">Check In Mode</lable>
                <span className="text-danger">*</span>
                <select
                  className={`form-select ${
                    formik.touched.checkInmode && formik.errors.checkInmode
                      ? "is-invalid"
                      : ""
                  }`}
                  {...formik.getFieldProps("checkInmode")}
                  aria-label="Default select example"
                >
                  <option selected></option>
                  <option value="Tap In">Tap In</option>
                  <option value="Face Recognition">Face Recognition</option>
                </select>
                {formik.touched.checkInmode && formik.errors.checkInmode && (
                  <div className="invalid-feedback">
                    {formik.errors.checkInmode}
                  </div>
                )}
              </div>
              <div className="col-md-6 col-12 mb-3 ">
                <lable className="">Check Out Mode</lable>
                <span className="text-danger">*</span>
                <select
                  className={`form-select ${
                    formik.touched.checkOutmode && formik.errors.checkOutmode
                      ? "is-invalid"
                      : ""
                  }`}
                  {...formik.getFieldProps("checkOutmode")}
                  aria-label="Default select example"
                >
                  <option selected></option>
                  <option value="Tap Out">Tap Out</option>
                  <option value="Face Recognition">Face Recognition</option>
                </select>
                {formik.touched.checkOutmode && formik.errors.checkOutmode && (
                  <div className="invalid-feedback">
                    {formik.errors.checkOutmode}
                  </div>
                )}
              </div> */}
              <div className="col-md-6 col-12 mb-3 ">
                <lable className="">OT Start Time</lable>
                <span className="text-danger">*</span>
                <input
                  type="time"
                  className={`form-control ${
                    formik.touched.otStartTime && formik.errors.otStartTime
                      ? "is-invalid"
                      : ""
                  }`}
                  {...formik.getFieldProps("otStartTime")}
                />
                {formik.touched.otStartTime && formik.errors.otStartTime && (
                  <div className="invalid-feedback">
                    {formik.errors.otStartTime}
                  </div>
                )}
              </div>
              <div className="col-md-6 col-12 mb-3 ">
                <lable className="">OT End Time</lable>
                <span className="text-danger">*</span>
                <input
                  type="time"
                  className={`form-control  ${
                    formik.touched.otEndTime && formik.errors.otEndTime
                      ? "is-invalid"
                      : ""
                  }`}
                  {...formik.getFieldProps("otEndTime")}
                />
                {formik.touched.otEndTime && formik.errors.otEndTime && (
                  <div className="invalid-feedback">
                    {formik.errors.otEndTime}
                  </div>
                )}
              </div>
              <div className="col-md-6 col-12">
                <div className="text-start mt-2">
                  <lable className="form-lable">Attendance Remark</lable>
                  <span className="text-danger">*</span>
                  <br />
                  <textarea
                    id="floatingTextarea2"
                    style={{ height: "100px" }}
                    className={`form-control  ${
                      formik.touched.attendanceRemark &&
                      formik.errors.attendanceRemark
                        ? "is-invalid"
                        : ""
                    }`}
                    {...formik.getFieldProps("attendanceRemark")}
                  />
                  {formik.touched.attendanceRemark &&
                    formik.errors.attendanceRemark && (
                      <div className="invalid-feedback">
                        {formik.errors.attendanceRemark}
                      </div>
                    )}
                </div>
              </div>
            </div>
            </div>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}

export default StaffingAttendanceAdd;
