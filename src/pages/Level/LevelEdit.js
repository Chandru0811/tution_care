import React from "react";
import { useState, useEffect } from "react";
import { useFormik } from "formik";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { FaEdit } from "react-icons/fa";
import * as Yup from "yup";
import api from "../../config/URL";
import toast from "react-hot-toast";

function Edit({ id, onSuccess }) {
  const [show, setShow] = useState(false);
  const [loadIndicator, setLoadIndicator] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const validationSchema = Yup.object({
    level: Yup.string().required("*Level is required"),
    levelCode: Yup.string().required("*Level Code is required"),
    status: Yup.string().required("*Status is required"),
  });

  const formik = useFormik({
    initialValues: {
      level: "",
      levelCode: "",
      status: "",
    },
    validationSchema: validationSchema, // Assign the validation schema
    onSubmit: async (values) => {
      // console.log(values);
      setLoadIndicator(true);
      try {
        const response = await api.put(`/updateCourseLevel/${id}`, values, {
          headers: {
            "Content-Type": "application/json",
          },
        });
        if (response.status === 200) {
          onSuccess();
          handleClose();
          toast.success(response.data.message);
        } else {
          toast.error(response.data.message);
        }
      } catch (error) {
        toast.error(error.message);
      } finally {
        setLoadIndicator(false);
      }
    },
  });

  useEffect(() => {
    const getData = async () => {
      try {
        const response = await api.get(`/getAllCourseLevels/${id}`);
        formik.setValues(response.data);
      } catch (error) {
        console.error("Error fetching data ", error.message);
      }
    };

    getData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <button className="btn btn-sm" onClick={handleShow}>
        <FaEdit />
      </button>
      <Modal
        show={show}
        onHide={handleClose}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title className="headColor">Update Level</Modal.Title>
        </Modal.Header>
        <form onSubmit={formik.handleSubmit}>
          <Modal.Body>
            <div className="row">
              <div className="col-md-6 col-12 mb-2">
                <label className="form-label">
                  Level<span className="text-danger">*</span>
                </label>
                <input
                  type="text"
                  className={`form-control form-control-sm  ${
                    formik.touched.level && formik.errors.level
                      ? "is-invalid"
                      : ""
                  }`}
                  {...formik.getFieldProps("level")}
                />
                {formik.touched.level && formik.errors.level && (
                  <div className="invalid-feedback">{formik.errors.level}</div>
                )}
              </div>
              <div className="col-md-6 col-12 mb-2">
                <label className="form-label">
                  Level Code<span className="text-danger">*</span>
                </label>
                <input
                  type="text"
                  className={`form-control form-control-sm  ${
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
              <div className="col-md-6 col-12 mb-2">
                <label className="form-label">
                  Status<span className="text-danger">*</span>
                </label>
                <select
                  {...formik.getFieldProps("status")}
                  class={`form-select form-select-sm  ${
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
                  <div className="invalid-feedback">{formik.errors.status}</div>
                )}
              </div>
            </div>

            <Modal.Footer className="mt-3">
              <Button
                type="button"
                variant="secondary btn-sm"
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
                Update
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

export default Edit;
