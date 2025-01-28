import React, { useEffect } from "react";
import { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import api from "../../config/URL";
import { toast } from "react-toastify";

function ReplacementAdd({
  attendanceData,
  onClickReplacement,
  attendanceDate,
  selectedStudent,
}) {
  const [show, setShow] = useState(false);
  const [loadIndicator, setLoadIndicator] = useState(false);
  const [isModified, setIsModified] = useState(false);
  const [attendanceDatas, setAttendanceData] = useState([]);
  const [batchData, setBatchData] = useState([]);

  const validationSchema = Yup.object({
    studentName: Yup.string().required("*Student Name is required"),
    studentId: Yup.string().required("*student ID is required"),
    // course: Yup.string().required("*Course is required"),
    // classCode: Yup.string().required("*Class Code is required"),
    absentDate: Yup.string().required("*Absent Date is required"),
    absentReason: Yup.string().required("*Absent Reason is required"),
    file: Yup.mixed()
      .required("*File is required")
      .test(
        "max-file-name-length",
        "*File name must be at most 50 characters",
        (value) => !value || value.name.length <= 50
      ),
  });

  const handleClose = () => {
    setShow(false);
    formik.resetForm();
    setBatchData([]);
  };

  const handleShow = () => {
    setShow(true);
    setIsModified(false);
  };

  const formik = useFormik({
    initialValues: {
      studentName: selectedStudent.studentName,
      studentId: selectedStudent?.studentUniqueId,
      course: attendanceData[0]?.course,
      classCode: attendanceData[0]?.classCode,
      absentDate: attendanceDate,
      preferredDay: "",
      preferredTiming: "",
      absentReason: "",
      otherReason: "",
      centerId: attendanceData[0]?.centerId,
      createdBy: "",
      classId: attendanceData[0]?.classId,
      courseId: attendanceData[0]?.courseId,
      file: null,
      remark: "",
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      setLoadIndicator(true);
      // console.log("values", values);
      const formData = new FormData();
      formData.append("studentName", values.studentName);
      formData.append("studentId", selectedStudent?.studentId);
      formData.append("course", values.course);
      formData.append("classCode", values.classCode);
      formData.append("absentDate", values.absentDate);
      formData.append("preferredDay", values.preferredDay);
      formData.append("preferredTiming", values.preferredTiming);
      formData.append("absentReason", values.absentReason);
      formData.append("otherReason", values.otherReason);
      formData.append("remark", values.remark);
      formData.append("file", values.file);
      formData.append("centerId", values.centerId);
      formData.append("classId", values.classId);
      formData.append("courseId", values.courseId);
      try {
        const response = await api.post(
          "/createStudentReplacementClass",
          formData
        );
        if (response.status === 201) {
          handleClose();
          onClickReplacement();
          toast.success(response.data.message);
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

  useEffect(() => {
    if (attendanceDate) {
      formik.setFieldValue("absentDate", attendanceDate);
    }
  }, [attendanceDate]);

  useEffect(() => {
    const getData = async () => {
      try {
        const response = await api.get("/getAllAbsentReason");
        setAttendanceData(response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    getData();
  }, []);
  const fetchBatchandTeacherData = async (day) => {
    try {
      const response = await api.get(`getTeacherWithBatchListByDay?day=${day}`);
      console.log("response.data.batchList", response.data.batchList);
      setBatchData(response.data.batchList);
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    if (formik.values.preferredDay) {
      fetchBatchandTeacherData(formik.values.preferredDay);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formik.values.preferredDay]);

  const formatTo12Hour = (time) => {
    const [hours, minutes] = time.split(":");
    let period = "AM";
    let hour = parseInt(hours, 10);

    if (hour === 0) {
      hour = 12;
    } else if (hour >= 12) {
      period = "PM";
      if (hour > 12) hour -= 12;
    }

    return `${hour}:${minutes} ${period}`;
  };

  const normalizeTime = (time) => {
    if (time.includes("AM") || time.includes("PM")) {
      return time;
    }

    return formatTo12Hour(time);
  };

  const convertTo24Hour = (time) => {
    const [timePart, modifier] = time.split(" ");
    let [hours, minutes] = timePart.split(":").map(Number);

    if (modifier === "PM" && hours < 12) {
      hours += 12;
    } else if (modifier === "AM" && hours === 12) {
      hours = 0;
    }

    return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(
      2,
      "0"
    )}`;
  };

  return (
    <>
      <div className="mb-3 d-flex justify-content-start">
        <label className="radio-button">
          <button
            type="button"
            className="btn btn-sm mt-3"
            onClick={handleShow}
            style={{ backgroundColor: "#fa994af5", color: "#fff" }}
          >
            Replacement Lesson Class
          </button>
        </label>
      </div>
      <Modal
        show={show}
        size="lg"
        onHide={handleClose}
        centered
        backdrop={isModified ? "static" : true}
        keyboard={isModified ? false : true}
      >
        <Modal.Header closeButton>
          <Modal.Title className="headColor">Add Replacement Class</Modal.Title>
        </Modal.Header>
        <form
          onSubmit={formik.handleSubmit}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !formik.isSubmitting) {
              e.preventDefault();
            }
          }}
        >
          <Modal.Body>
            <div className="container">
              <div className="row py-4">
                <div className="col-md-6 col-12 mb-2">
                  <label className="form-label">
                    Student Name<span className="text-danger">*</span>
                  </label>
                  <input
                    type="text"
                    readOnly
                    className={`form-control  ${
                      formik.touched.studentName && formik.errors.studentName
                        ? "is-invalid"
                        : ""
                    }`}
                    {...formik.getFieldProps("studentName")}
                  />
                  {formik.touched.studentName && formik.errors.studentName && (
                    <div className="invalid-feedback">
                      {formik.errors.studentName}
                    </div>
                  )}
                </div>
                <div className="col-md-6 col-12 mb-2">
                  <label className="form-label">
                    Student ID<span className="text-danger">*</span>
                  </label>
                  <input
                    type="text"
                    readOnly
                    className={`form-control  ${
                      formik.touched.studentId && formik.errors.studentId
                        ? "is-invalid"
                        : ""
                    }`}
                    {...formik.getFieldProps("studentId")}
                  />
                  {formik.touched.studentId && formik.errors.studentId && (
                    <div className="invalid-feedback">
                      {formik.errors.studentId}
                    </div>
                  )}
                </div>
                <div className="col-md-6 col-12 mb-2">
                  <label className="form-label">
                    Course<span className="text-danger">*</span>
                  </label>
                  <input
                    type="text"
                    readOnly
                    className={`form-control  ${
                      formik.touched.course && formik.errors.course
                        ? "is-invalid"
                        : ""
                    }`}
                    {...formik.getFieldProps("course")}
                  />
                  {formik.touched.course && formik.errors.course && (
                    <div className="invalid-feedback">
                      {formik.errors.course}
                    </div>
                  )}
                </div>
                <div className="col-md-6 col-12 mb-2">
                  <label className="form-label">
                    Class Code<span className="text-danger">*</span>
                  </label>
                  <input
                    type="text"
                    readOnly
                    className={`form-control  ${
                      formik.touched.classCode && formik.errors.classCode
                        ? "is-invalid"
                        : ""
                    }`}
                    {...formik.getFieldProps("classCode")}
                  />
                  {formik.touched.classCode && formik.errors.classCode && (
                    <div className="invalid-feedback">
                      {formik.errors.classCode}
                    </div>
                  )}
                </div>
                <div className="col-md-6 col-12 mb-2">
                  <label className="form-label">Preferred Day</label>
                  <select
                    {...formik.getFieldProps("preferredDay")}
                    class={`form-select  ${
                      formik.touched.preferredDay && formik.errors.preferredDay
                        ? "is-invalid"
                        : ""
                    }`}
                    aria-label="Default select example"
                  >
                    <option selected disabled></option>
                    <option value="MONDAY">MONDAY</option>
                    <option value="TUESDAY">TUESDAY</option>
                    <option value="WEDNESDAY">WEDNESDAY</option>
                    <option value="THURSDAY">THURSDAY</option>
                    <option value="FRIDAY">FRIDAY</option>
                    <option value="SATURDAY">SATURDAY</option>
                    <option value="SUNDAY">SUNDAY</option>
                  </select>
                  {formik.touched.preferredDay &&
                    formik.errors.preferredDay && (
                      <div className="invalid-feedback">
                        {formik.errors.preferredDay}
                      </div>
                    )}
                </div>
                <div className="col-md-6 col-12 mb-2">
                  <label className="form-label">Preferred Timing</label>
                  <select
                    {...formik.getFieldProps("preferredTiming")}
                    class={`form-select  ${
                      formik.touched.preferredTiming &&
                      formik.errors.preferredTiming
                        ? "is-invalid"
                        : ""
                    }`}
                  >
                    <option value="" disabled selected></option>
                    {batchData &&
                      batchData.map((time) => {
                        const displayTime = normalizeTime(time);
                        const valueTime =
                          time.includes("AM") || time.includes("PM")
                            ? convertTo24Hour(time)
                            : time;

                        return (
                          <option key={time} value={valueTime}>
                            {displayTime}
                          </option>
                        );
                      })}
                  </select>
                  {formik.touched.preferredTiming &&
                    formik.errors.preferredTiming && (
                      <div className="invalid-feedback">
                        {formik.errors.preferredTiming}
                      </div>
                    )}
                </div>
                <div className="col-md-6 col-12 mb-2">
                  <label className="form-label">
                    Absent Date<span className="text-danger">*</span>
                  </label>
                  <input
                    type="date"
                    name="absentDate"
                    value={attendanceDate}
                    className={`form-control ${
                      formik.touched.absentDate && formik.errors.absentDate
                        ? "is-invalid"
                        : ""
                    }`}
                    {...formik.getFieldProps("absentDate")}
                    readOnly
                  />
                  {formik.touched.absentDate && formik.errors.absentDate && (
                    <div className="invalid-feedback">
                      {formik.errors.absentDate}
                    </div>
                  )}
                </div>

                <div className="col-md-6 col-12 mb-2">
                  <label className="form-label">
                    Absent Reason<span className="text-danger">*</span>
                  </label>
                  <select
                    {...formik.getFieldProps("absentReason")}
                    class={`form-select  ${
                      formik.touched.absentReason && formik.errors.absentReason
                        ? "is-invalid"
                        : ""
                    }`}
                  >
                    <option selected></option>
                    {/* <option value="HOLIDAY">HOLIDAY</option>
                    <option value="STUDENT_SICK">STUDENT_SICK</option> */}
                    {attendanceDatas &&
                      attendanceDatas.map((attendance) => (
                        <option
                          key={attendance.id}
                          value={attendance.absentReason}
                        >
                          {attendance.absentReason}
                        </option>
                      ))}
                  </select>
                  {formik.touched.absentReason &&
                    formik.errors.absentReason && (
                      <div className="invalid-feedback">
                        {formik.errors.absentReason}
                      </div>
                    )}
                </div>

                <div className="col-md-6 col-12 mb-2">
                  <label className="form-label">Other Reason</label>
                  <input
                    type="text"
                    className={`form-control  ${
                      formik.touched.otherReason && formik.errors.otherReason
                        ? "is-invalid"
                        : ""
                    }`}
                    {...formik.getFieldProps("otherReason")}
                  />
                  {formik.touched.otherReason && formik.errors.otherReason && (
                    <div className="invalid-feedback">
                      {formik.errors.otherReason}
                    </div>
                  )}
                </div>
                <div className="col-md-6 col-12 mb-2">
                  <label className="form-label">Document</label>
                  <input
                    accept=".pdf, .doc, .docx, application/pdf, application/msword, application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                    type="file"
                    className={`form-control ${
                      formik.touched.file && formik.errors.file
                        ? "is-invalid"
                        : ""
                    }`}
                    onChange={(event) =>
                      formik.setFieldValue("file", event.currentTarget.files[0])
                    }
                  />
                  {formik.touched.file && formik.errors.file && (
                    <div className="invalid-feedback">{formik.errors.file}</div>
                  )}
                </div>
                <div className="col-md-12 col-12 mb-2">
                  <label className="form-label">Remark</label>
                  <textarea
                    className={`form-control  ${
                      formik.touched.remark && formik.errors.remark
                        ? "is-invalid"
                        : ""
                    }`}
                    {...formik.getFieldProps("remark")}
                  />
                  {formik.touched.remark && formik.errors.remark && (
                    <div className="invalid-feedback">
                      {formik.errors.remark}
                    </div>
                  )}
                </div>
              </div>
            </div>
            <Modal.Footer>
              <Button
                type="button"
                className="btn btn-sm btn-border bg-light text-dark"
                onClick={handleClose}
              >
                Cancel
              </Button>
              <Button
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
                Submit
              </Button>
            </Modal.Footer>
          </Modal.Body>
        </form>
      </Modal>
    </>
  );
}

export default ReplacementAdd;
