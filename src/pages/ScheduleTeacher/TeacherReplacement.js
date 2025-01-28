import React, { useEffect } from "react";
import { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import api from "../../config/URL";
import { toast } from "react-toastify";
import fetchAllSubjectsWithIds from "../List/SubjectList";
import { MdOutlineModeEdit } from "react-icons/md";

function TeacherReplacement({ onSuccess }) {
  const [show, setShow] = useState(false);
  const [loadIndicator, setLoadIndicator] = useState(false);
  const [subjectData, setSubjectData] = useState(null);

  const handleClose = () => {
    setShow(false);
    formik.resetForm();
    setSubjectData(null);
  };

  const handleShow = () => {
    fetchData();
    setShow(true);
  };

  useEffect(() => {
    fetchData();
  }, [show]);

  const fetchData = async () => {
    try {
      const subject = await fetchAllSubjectsWithIds();
      setSubjectData(subject);
    } catch (error) {
      toast.error(error);
    }
  };

  // const validationSchema = Yup.object({
  //     level: Yup.string().required("*Level is required"),
  //     levelCode: Yup.string().required("*Level Code is required"),
  //     status: Yup.string().required("*Status is required"),
  //     subjectId: Yup.string().required("*Subject is required"),
  // });

  const formik = useFormik({
    initialValues: {
      level: "",
      levelCode: "",
      status: "",
      subjectId: "",
    },
    // validationSchema: validationSchema, // Assign the validation schema
    onSubmit: async (values) => {
      setLoadIndicator(true);

      // try {
      //     const response = await api.post("/createCourseLevels", values, {
      //         headers: {
      //             "Content-Type": "application/json",
      //         },
      //     });
      //     if (response.status === 201) {
      //         onSuccess();
      //         handleClose();
      //         toast.success(response.data.message);
      //     } else {
      //         toast.error(response.data.message);
      //     }
      // } catch (error) {
      //     toast.error(error);
      // } finally {
      //     setLoadIndicator(false);
      // }
    },
  });

  return (
    <>
      <div className="ms-2">
        <span onClick={handleShow}>
          {" "}
          <MdOutlineModeEdit /> &nbsp;&nbsp;Edit{" "}
        </span>
      </div>
      <Modal show={show} size="lg" onHide={handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title className="headColor">Teacher Replacement</Modal.Title>
        </Modal.Header>
        <form
          onSubmit={formik.handleSubmit}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !formik.isSubmitting) {
              e.preventDefault(); // Prevent default form submission
            }
          }}
        >
          <Modal.Body>
            <div className="container">
              <div className="row py-4">
                <div className="col-md-6 col-12 mb-2">
                  <label className="form-label">
                    Class Listing<span className="text-danger">*</span>
                  </label>
                  <select
                    {...formik.getFieldProps("subjectId")}
                    class={`form-select  ${
                      formik.touched.subjectId && formik.errors.subjectId
                        ? "is-invalid"
                        : ""
                    }`}
                  >
                    <option></option>
                    <option>Angular</option>
                    <option>Arty</option>
                  </select>
                  {formik.touched.subjectId && formik.errors.subjectId && (
                    <div className="invalid-feedback">
                      {formik.errors.subjectId}
                    </div>
                  )}
                </div>
                <div className="col-md-6 col-12 mb-2">
                  <label className="form-label">
                    Class Date<span className="text-danger">*</span>
                  </label>
                  <select
                    {...formik.getFieldProps("status")}
                    class={`form-select  ${
                      formik.touched.status && formik.errors.status
                        ? "is-invalid"
                        : ""
                    }`}
                    aria-label="Default select example"
                  >
                    <option selected></option>
                    <option value="">2024-07-06</option>
                    <option value="">2024-07-07</option>
                  </select>
                  {formik.touched.status && formik.errors.status && (
                    <div className="invalid-feedback">
                      {formik.errors.status}
                    </div>
                  )}
                </div>
                <div className="col-md-6 col-12 mb-2">
                  <label className="form-label">
                    Teacher<span className="text-danger">*</span>
                  </label>
                  <select
                    {...formik.getFieldProps("status")}
                    class={`form-select  ${
                      formik.touched.status && formik.errors.status
                        ? "is-invalid"
                        : ""
                    }`}
                    aria-label="Default select example"
                  >
                    <option selected></option>
                    <option value="">Raghul</option>
                    <option value="">Surya</option>
                  </select>
                  {formik.touched.status && formik.errors.status && (
                    <div className="invalid-feedback">
                      {formik.errors.status}
                    </div>
                  )}
                </div>

                <div className="col-md-6 col-12 mb-2">
                  <label className="form-label">
                    Remark<span className="text-danger">*</span>
                  </label>
                  <textarea
                    type="text"
                    className={`form-control  ${
                      formik.touched.levelCode && formik.errors.levelCode
                        ? "is-invalid"
                        : ""
                    }`}
                    {...formik.getFieldProps("levelCode")}
                  />
                  {formik.touched.levelCode && formik.errors.levelCode && (
                    <div className="invalid-feedback">
                      {formik.errors.levelCode}
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
              {/* <Button variant="danger" type="submit">
              Submit
            </Button> */}
            </Modal.Footer>
          </Modal.Body>
        </form>
      </Modal>
    </>
  );
}

export default TeacherReplacement;
