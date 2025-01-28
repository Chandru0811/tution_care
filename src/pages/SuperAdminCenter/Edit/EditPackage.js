import React, { useEffect, useState } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import * as yup from "yup";
import { useFormik } from "formik";
import api from "../../../config/URL";
import { toast } from "react-toastify";
import { BiEditAlt } from "react-icons/bi";

function EditPackage({ id, onSuccess }) {
  const [show, setShow] = useState(false);
  const [loadIndicator, setLoadIndicator] = useState(false);
  const [isModified, setIsModified] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => {
    setShow(true);
    setIsModified(false);
  };

  const validationSchema = yup.object().shape({
    packageName: yup.string().required("*Package Name is required"),
    noOfLesson: yup
      .number()
      .integer("Must be an integer")
      .typeError("Must be a number")
      .positive("Must be positive")
      .required("*Number of Lesson is required"),
  });
  const formik = useFormik({
    initialValues: {
      packageName: "",
      noOfLesson: "",
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      setLoadIndicator(true);
      try {
        const response = await api.put(`/updateCenterPackages/${id}`, values, {
          headers: {
            "Content-Type": "application/json",
          },
        });
        if (response.status === 200) {
          toast.success(response.data.message);
          onSuccess();
          handleClose();
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
    enableReinitialize: true,
    validateOnChange: true,
    validateOnBlur: true,
    validate: (values) => {
      if (
        Object.values(values).some(
          (value) => typeof value === "string" && value.trim() !== ""
        )
      ) {
        setIsModified(true);
      } else {
        setIsModified(false);
      }
    },
  });
  useEffect(() => {
    const getData = async () => {
      try {
        const response = await api.get(`/getAllCenterPackagesById/${id}`);
        formik.setValues(response.data);
      } catch (error) {
        toast.error("Error Fetching Data");
      }
    };

    getData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <>
      <button type="button"
        style={{
          whiteSpace: "nowrap",
        }}
        className="btn btn-normal text-start" onClick={handleShow}>
        <BiEditAlt />
      </button>

      <Modal
        show={show}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
        onHide={handleClose}
        backdrop={isModified ? "static" : true}
        keyboard={isModified ? false : true}
      >
        <form
          onSubmit={formik.handleSubmit}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !formik.isSubmitting) {
              e.preventDefault(); // Prevent default form submission
            }
          }}
        >
          <Modal.Header closeButton>
            <Modal.Title>
              <p className="headColor">Edit Package</p>
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div className="row">
              <div class="col-md-6 col-12 mb-2">
                <lable className="form-lable">
                  Package Name<span className="text-danger">*</span>
                </lable>
                <div class="input-group mb-3">
                  <input
                    type="text"
                    className={`form-control   ${
                      formik.touched.packageName && formik.errors.packageName
                        ? "is-invalid"
                        : ""
                    }`}
                    {...formik.getFieldProps("packageName")}
                  />
                  {formik.touched.packageName && formik.errors.packageName && (
                    <div className="invalid-feedback">
                      {formik.errors.packageName}
                    </div>
                  )}
                </div>
              </div>
              <div className="col-md-6 col-12 mb-2">
                <label>
                  Number of Lesson<span className="text-danger">*</span>
                </label>
                <select
                  className={`form-select ${
                    formik.touched.quantity && formik.errors.quantity
                      ? "is-invalid"
                      : ""
                  }`}
                  {...formik.getFieldProps("noOfLesson")}
                  style={{ width: "100%" }}
                >
                  <option value=""></option>
                  {Array.from({ length: 100 }, (_, i) => i + 1).map(
                    (number) => (
                      <option key={number} value={number}>
                        {number}
                      </option>
                    )
                  )}
                </select>
                {formik.touched.noOfLesson && formik.errors.noOfLesson && (
                  <div className="invalid-feedback">
                    {formik.errors.noOfLesson}
                  </div>
                )}
              </div>
            </div>
          </Modal.Body>
          <Modal.Footer className="mt-5">
            <Button
              className="btn btn-sm btn-border bg-light text-dark"
              onClick={handleClose}
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={formik.handleSubmit}
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
          </Modal.Footer>
        </form>
      </Modal>
    </>
  );
}

export default EditPackage;
