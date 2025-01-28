import React, { useEffect, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { IoIosCloseCircleOutline } from "react-icons/io";
import { MdAdd } from "react-icons/md";
import api from "../../config/URL";
import { toast } from "react-toastify";

function AddMore({
  courseId,
  attendanceDate,
  batchTime,
  userId,
  feedbackData,
  onSuccess,
}) {
  const [show, setShow] = useState(false);
  const [lessonData, setLessonData] = useState([]);
  console.log("FeedBack Data:", feedbackData);

  const validationSchema = Yup.object().shape({
    items: Yup.array().of(
      Yup.object().shape({
        lessonNo: Yup.string().required("*Lesson number is required"),
        curriculumCode: Yup.string().required("*Curriculum code is required"),
        nextClassAdvice: Yup.string().required(
          "*Next class advice is required"
        ),
        // pace: Yup.string().required("Pace is required"),
      })
    ),
  });

  const formik = useFormik({
    initialValues: {
      items: [
        {
          lessonNo: "",
          curriculumCode: "",
          nextClassAdvice: "",
          curriculumId: "",
          pace: "",
        },
      ],
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      try {
        const additionalValues = {
          attendanceDate: attendanceDate,
          batchTime: batchTime,
          userId: userId,
        };

        const payload = values.items.map((item) => ({
          ...item,
          ...additionalValues,
        }));
        const response = await api.post(`createFeedbackAttendances`, payload);
        if (response.status === 201) {
          onSuccess();
          toast.success(response.data.message);

          handleClose();
        } else {
          toast.error(response.data.message);
        }
      } catch (error) {
        toast.error("Error Creating Data ", error?.response?.data?.message);
      }
    },
  });

  const getLessonData = async () => {
    try {
      const response = await api.get(`active/${courseId}`);
      setLessonData(response.data);
    } catch (error) {
      toast.error("Error Fetching Data ", error?.response?.data?.message);
    }
  };

  const handleDelete = async (id, index) => {
    if (!id) {
      // For new (unsaved) rows, directly remove the row from Formik values
      const updatedItems = [...formik.values.items];
      updatedItems.splice(index, 1);
      formik.setFieldValue("items", updatedItems);
      // toast.info("Unsaved feedback removed.");
      return;
    }

    try {
      // API call for saved feedback
      const response = await api.delete(`deleteFeedbackAttendance/${id}`);
      if (response.status === 201) {
        toast.success("Feedback removed successfully!");
        // Update the Formik items array
        const updatedItems = [...formik.values.items];
        updatedItems.splice(index, 1);
        formik.setFieldValue("items", updatedItems);
      } else {
        toast.error("Error removing feedback!");
      }
    } catch (error) {
      toast.error("Error removing feedback ", error?.response?.data?.message);
    }
  };

  useEffect(() => {
    const fetchCurriculumCodes = async () => {
      const promises = formik.values.items.map(async (item, index) => {
        if (item.lessonNo !== "") {
          try {
            const response = await api.get(`curriculumCode/${item.lessonNo}`);
            console.log("Lesson Response is ", response.data);
            formik.setFieldValue(
              `items[${index}].curriculumCode`,
              response.data.curriculumCode
            );
            formik.setFieldValue(`items[${index}].curriculumId`, item.lessonNo);
          } catch (error) {
            console.log("Error Fetching Data ", error?.response?.data?.message);
          }
        }
      });
      await Promise.all(promises);
    };
    fetchCurriculumCodes();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formik.values.items]);

  const handleClose = () => {
    formik.resetForm();
    setShow(false);
  };
  const handleShow = () => {
    getLessonData();
    if (feedbackData && feedbackData.length !== 0) {
      formik.setFieldValue("items", feedbackData);
    } else {
      formik.setFieldValue("items", [
        {
          lessonNo: "",
          curriculumCode: "",
          nextClassAdvice: "",
          curriculumId: "",
          pace: "",
        },
      ]);
    }
    setShow(true);
  };

  console.log("Formik Values is ", formik.values);
  return (
    <>
      <button
        className="btn btn-button2 btn-sm"
        onClick={handleShow}
        style={{ backgroundColor: "#fa994af5" }}
      >
        Add More Info
      </button>
      <Modal show={show} size="xl" onHide={handleClose} centered>
        <Modal.Header closeButton>Attendance</Modal.Header>
        <form onSubmit={formik.handleSubmit}>
          <Modal.Body>
            <div className="container">
              {formik.values.items.map((item, index) => (
                <div key={index}>
                  <div className="row">
                    <div className="col-1 text-end d-flex justify-content-center align-items-start">
                      <button
                        type="button"
                        className="btn mt-2"
                        style={{ marginBottom: "5.0rem" }}
                        onClick={() => handleDelete(item.id, index)}
                      >
                        <IoIosCloseCircleOutline
                          style={{
                            fontSize: "2rem",
                            color: "red",
                            background: "none",
                          }}
                        />
                      </button>
                    </div>
                    <div className="col-md-3 col-6 mb-4">
                      <label className="form-label">
                        Lesson No<span className="text-danger">*</span>
                      </label>
                      <select
                        {...formik.getFieldProps(`items[${index}].lessonNo`)}
                        className={`form-select ${
                          formik.touched.items?.[index]?.lessonNo &&
                          formik.errors.items?.[index]?.lessonNo
                            ? "is-invalid"
                            : ""
                        }`}
                        aria-label="Default select example"
                      >
                        <option></option>
                        {lessonData &&
                          lessonData.map((lesson) => (
                            <option key={lesson.id} value={lesson.id}>
                              {lesson.lessonNo}
                            </option>
                          ))}
                      </select>
                      {formik.touched.items?.[index]?.lessonNo &&
                      formik.errors.items?.[index]?.lessonNo ? (
                        <div className="invalid-feedback">
                          {formik.errors.items[index].lessonNo}
                        </div>
                      ) : null}
                    </div>
                    <div className="col-md-3 col-6 mb-4">
                      <label className="form-label">
                        Curriculum Code<span className="text-danger">*</span>
                      </label>
                      <input
                        type="text"
                        className={`form-control ${
                          formik.touched.items?.[index]?.curriculumCode &&
                          formik.errors.items?.[index]?.curriculumCode
                            ? "is-invalid"
                            : ""
                        }`}
                        {...formik.getFieldProps(
                          `items[${index}].curriculumCode`
                        )}
                        readOnly
                      />
                      {formik.touched.items?.[index]?.curriculumCode &&
                      formik.errors.items?.[index]?.curriculumCode ? (
                        <div className="invalid-feedback">
                          {formik.errors.items[index].curriculumCode}
                        </div>
                      ) : null}
                    </div>
                    <div
                      className={`col-md-3 col-6 mb-4 ${
                        formik.touched.items?.[index]?.nextClassAdvice &&
                        formik.errors.items?.[index]?.nextClassAdvice
                          ? "is-invalid"
                          : ""
                      }`}
                    >
                      <label className="form-label">
                        Next Class Advice<span className="text-danger">*</span>
                      </label>
                      <div>
                        <input
                          type="radio"
                          id={`items[${index}].nextClassAdvice-competent`}
                          name={`items[${index}].nextClassAdvice`}
                          value="Competent"
                          checked={
                            formik.values.items[index]?.nextClassAdvice ===
                            "Competent"
                          }
                          onChange={formik.handleChange}
                          onBlur={() =>
                            formik.setFieldTouched(
                              `items[${index}].nextClassAdvice`,
                              true
                            )
                          }
                          className="form-check-input"
                        />
                        &nbsp;&nbsp;
                        <label
                          className="form-check-label"
                          htmlFor={`items[${index}].nextClassAdvice-competent`}
                        >
                          Competent
                        </label>
                      </div>
                      <div>
                        <input
                          type="radio"
                          id={`items[${index}].nextClassAdvice-revision`}
                          name={`items[${index}].nextClassAdvice`}
                          value="Require Revision"
                          checked={
                            formik.values.items[index]?.nextClassAdvice ===
                            "Require Revision"
                          }
                          onChange={formik.handleChange}
                          onBlur={() =>
                            formik.setFieldTouched(
                              `items[${index}].nextClassAdvice`,
                              true
                            )
                          }
                          className="form-check-input"
                        />
                        &nbsp;&nbsp;
                        <label
                          className="form-check-label"
                          htmlFor={`items[${index}].nextClassAdvice-revision`}
                        >
                          Require Revision
                        </label>
                      </div>
                      {formik.touched.items?.[index]?.nextClassAdvice &&
                      formik.errors.items?.[index]?.nextClassAdvice ? (
                        <div className="invalid-feedback d-block">
                          {formik.errors.items[index].nextClassAdvice}
                        </div>
                      ) : null}
                    </div>

                    <div className="col-md-2 col-6 mb-4">
                      <label className="form-label">Pace</label>
                      <div>
                        <input
                          type="radio"
                          id={`items[${index}].pace-fast`}
                          name={`items[${index}].pace`}
                          value="Fast (F)"
                          checked={
                            formik.values.items[index]?.pace === "Fast (F)"
                          }
                          onChange={formik.handleChange}
                          className={`form-check-input ${
                            formik.touched.items?.[index]?.pace &&
                            formik.errors.items?.[index]?.pace
                              ? "is-invalid"
                              : ""
                          }`}
                        />
                        &nbsp;&nbsp;
                        <label
                          className="form-check-label"
                          htmlFor={`items[${index}].pace-fast`}
                        >
                          Fast (F)
                        </label>
                      </div>
                      <div>
                        <input
                          type="radio"
                          id={`items[${index}].pace-normal`}
                          name={`items[${index}].pace`}
                          value="Normal (N)"
                          checked={
                            formik.values.items[index]?.pace === "Normal (N)"
                          }
                          onChange={formik.handleChange}
                          className={`form-check-input ${
                            formik.touched.items?.[index]?.pace &&
                            formik.errors.items?.[index]?.pace
                              ? "is-invalid"
                              : ""
                          }`}
                        />
                        &nbsp;&nbsp;
                        <label
                          className="form-check-label"
                          htmlFor={`items[${index}].pace-normal`}
                        >
                          Normal (N)
                        </label>
                      </div>
                      <div>
                        <input
                          type="radio"
                          id={`items[${index}].pace-slow`}
                          name={`items[${index}].pace`}
                          value="Slow (S)"
                          checked={
                            formik.values.items[index].pace === "Slow (S)"
                          }
                          onChange={formik.handleChange}
                          className={`form-check-input ${
                            formik.touched.items?.[index]?.pace &&
                            formik.errors.items?.[index]?.pace
                              ? "is-invalid"
                              : ""
                          }`}
                        />
                        &nbsp;&nbsp;
                        <label
                          className="form-check-label"
                          htmlFor={`items[${index}].pace-slow`}
                        >
                          Slow (S)
                        </label>
                      </div>
                      {formik.touched.items?.[index]?.pace &&
                      formik.errors.items?.[index]?.pace ? (
                        <div className="invalid-feedback">
                          {formik.errors.items[index].pace}
                        </div>
                      ) : null}
                    </div>
                  </div>
                </div>
              ))}
              <div className="row mb-5">
                <div className="col-12">
                  <button
                    type="button"
                    className="btn btn-light"
                    onClick={() =>
                      formik.setFieldValue("items", [
                        ...formik.values.items,
                        {
                          lessonNo: "",
                          curriculumCode: "",
                          nextClassAdvice: "",
                          pace: "",
                        },
                      ])
                    }
                  >
                    <MdAdd /> Add More
                  </button>
                </div>
              </div>
            </div>
            <Modal.Footer>
              <button
                type="button"
                className="btn btn-sm btn-border text-dark"
                onClick={handleClose}
              >
                Cancel
              </button>
              <button type="submit" className="btn btn-sm btn-button">
                Submit
              </button>
            </Modal.Footer>
          </Modal.Body>
        </form>
      </Modal>
    </>
  );
}

export default AddMore;
