import React from "react";
import { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import api from "../../../config/URL";
import { toast } from "react-toastify";

function ShgAdd({ onSuccess }) {
  const [show, setShow] = useState(false);
  const [loadIndicator, setLoadIndicator] = useState(false);
  const [isModified, setIsModified] = useState(false);

  const handleClose = () => {
    setShow(false);
    formik.resetForm();
  };
  const handleShow = () => {
    setShow(true);
    setIsModified(false);
  };
  const userName = localStorage.getItem("userName");

  const validationSchema = Yup.object({
    shgType: Yup.string()
      .required("*SHG Type is required") // SHG Type is required and must be a valid string
      .min(2, "*SHG Type must be at least 2 characters") // Optional: Minimum character length
      .max(100, "*SHG Type must not exceed 100 characters"), // Optional: Maximum character length
  
      shgAmount: Yup.number()
      .typeError("*SHG Amount must be a number") // Ensures value is a valid number
      .required("*SHG Amount is required") // Required validation
      .positive("*SHG Amount must be a positive number") // Only positive values allowed
      .test(
        "is-decimal",
        "*SHG Amount must have at most 2 decimal places", // Custom error message
        (value) => {
          // Test allows numbers with up to 2 decimal places
          return value ? /^\d+(\.\d{1,2})?$/.test(value) : true;
        }
      ), 
  });
  

  const formik = useFormik({
    initialValues: {
      shgType: "",
      shgAmount: "",
      createdBy: userName,
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      setLoadIndicator(true);
      // console.log(values);
      try {
        const response = await api.post("/createSHGSetting", values, {
          headers: {
            "Content-Type": "application/json",
          },
        });
        if (response.status === 201) {
          onSuccess();
          handleClose();
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
    enableReinitialize: true,
    validateOnChange: true,
    validateOnBlur: true,
    validate: (values) => {
      if (Object.values(values).some((value) => value.trim() !== "")) {
        setIsModified(true);
      } else {
        setIsModified(false);
      }
    },
  });

  return (
    <>
      <div className="mb-3 d-flex justify-content-end">
        <button
          type="button"
          className="btn btn-button btn-sm me-2"
          style={{ fontWeight: "600px !important" }}
          onClick={handleShow}
        >
          &nbsp; Add &nbsp;&nbsp; <i className="bx bx-plus"></i>
        </button>
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
          <Modal.Title className="headColor">Add SHG</Modal.Title>
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
              <div className="row">
                <div className="col-md-6 col-12 mb-2">
                  <label className="form-label">
                    SHG Type<span className="text-danger">*</span>
                  </label>
                  <input
                    type="text"
                    className={`form-control  ${
                      formik.touched.shgType && formik.errors.shgType
                        ? "is-invalid"
                        : ""
                    }`}
                    {...formik.getFieldProps("shgType")}
                  />
                  {formik.touched.shgType && formik.errors.shgType && (
                    <div className="invalid-feedback">
                      {formik.errors.shgType}
                    </div>
                  )}
                </div>
                <div className="col-md-6 col-12 mb-2">
                  <label className="form-label">
                    SHG Amount<span className="text-danger">*</span>
                  </label>
                  <input
                    type="text"
                    className={`form-control  ${
                      formik.touched.shgAmount && formik.errors.shgAmount
                        ? "is-invalid"
                        : ""
                    }`}
                    {...formik.getFieldProps("shgAmount")}
                  />
                  {formik.touched.shgAmount && formik.errors.shgAmount && (
                    <div className="invalid-feedback">
                      {formik.errors.shgAmount}
                    </div>
                  )}
                </div>
              </div>
            </div>
            <Modal.Footer className="mt-3">
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

export default ShgAdd;
