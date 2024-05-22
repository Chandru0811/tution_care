import { useState } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import * as yup from "yup";
import { useFormik } from "formik";
import { useNavigate } from "react-router-dom";
// import axios from "axios";
import { toast } from "react-toastify";
import api from "../../config/URL";

function SubjectAdd({ onSuccess }) {
  const [show, setShow] = useState(false);
  const navigate = useNavigate();
  const [loadIndicator, setLoadIndicator] = useState(false);


  const handleClose = () => {
    setShow(false);
    formik.resetForm();
  };
  
  const handleShow = () => setShow(true);

  const validationSchema = yup.object().shape({
    subject: yup.string().required("*Subject is required"),
    code: yup.string().required("*Code is required"),
    status: yup.string().required("*Status is required"),
  });

  const formik = useFormik({
    initialValues: {
      subject: "",
      code: "",
      status: "",
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      setLoadIndicator(true);
      // console.log(values);
      try {
        const response = await api.post("/createCourseSubject", values, {
          headers: {
            "Content-Type": "application/json",
          },
        });
        if (response.status === 201) {
          toast.success(response.data.message);
          navigate("/subject");
          onSuccess();
          handleClose();
        } else {
          toast.error(response.data.message);
        }
      } catch (error) {
        toast.error(error);
      }finally {
        setLoadIndicator(false);
      }
    },
  });

  return (
    <>
      <div className="d-flex justify-content-end">
        <button
          type="button"
          className="btn btn-button btn-sm"
          onClick={handleShow}
        >
            Add <i class="bx bx-plus"></i>
        </button>
      </div>

      <Modal
        show={show}
        onHide={handleClose}
        size="lg"
        aria-labelledby="contained-model-title-vcenter"
        centered
      >
        <form onSubmit={formik.handleSubmit}>
          <Modal.Header closeButton>
            <Modal.Title className="headColor">Add Subject</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div className="container">
              <div className="row py-4">
                <div className="col-md-6 col-12 mb-2">
                  <label className="form-label">
                    Subject<span className="text-danger">*</span>
                  </label>
                  <div className="input-group mb-3">
                    <input
                      type="text"
                      className={`form-control   ${
                        formik.touched.subject && formik.errors.subject
                          ? "is-invalid"
                          : ""
                      }`}
                      aria-label="Subject"
                      aria-describedby="basic-addon1"
                      {...formik.getFieldProps("subject")}
                    />
                    {formik.touched.subject && formik.errors.subject && (
                      <div className="invalid-feedback">
                        {formik.errors.subject}
                      </div>
                    )}
                  </div>
                </div>
                <div className="col-md-6 col-12 mb-2">
                  <label className="form-label">
                    Code<span className="text-danger">*</span>
                  </label>
                  <div className="input-group mb-3">
                    <input
                      type="text"
                      className={`form-control   ${
                        formik.touched.code && formik.errors.code
                          ? "is-invalid"
                          : ""
                      }`}
                      aria-label="code"
                      aria-describedby="basic-addon1"
                      {...formik.getFieldProps("code")}
                    />
                    {formik.touched.code && formik.errors.code && (
                      <div className="invalid-feedback">
                        {formik.errors.code}
                      </div>
                    )}
                  </div>
                </div>
                <div class="col-md-6 col-12 mb-2">
                  <lable class="">
                    Status<span class="text-danger">*</span>
                  </lable>
                  <div class="input-group mb-3">
                    <select
                      {...formik.getFieldProps("status")}
                      className={`form-select  ${
                        formik.touched.status && formik.errors.status
                          ? "is-invalid"
                          : ""
                      }`}
                      aria-label="Default select example"
                    >
                      <option selected></option>
                      <option value="Active">Active</option>
                      <option value="Inactive">Inactive</option>
                    </select>
                    {formik.touched.status && formik.errors.status && (
                      <div className="invalid-feedback">
                        {formik.errors.status}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary btn-sm" onClick={handleClose}>
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
        </form>
      </Modal>
    </>
  );
}

export default SubjectAdd;
