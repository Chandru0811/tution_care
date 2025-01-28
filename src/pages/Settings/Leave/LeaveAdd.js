import React from "react";
import { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import api from "../../../config/URL";
import { toast } from "react-toastify";

function LeaveAdd({ onSuccess }) {
  const [show, setShow] = useState(false);
  const [loadIndicator, setLoadIndicator] = useState(false);
  const userName  = localStorage.getItem('userName');
  const [isModified, setIsModified] = useState(false);


  const handleClose = () => {
    setShow(false);
    formik.resetForm();
  };
  const handleShow = () => {
    
    setShow(true);
    setIsModified(false); 
  };  const validationSchema = Yup.object({
    leaveType: Yup.string().required("*Leave Type is required"),
  });

  const formik = useFormik({
    initialValues: {
      leaveType: "",
      createdBy: userName,

    },
    validationSchema: validationSchema, // Assign the validation schema
    onSubmit: async (values) => {
      setLoadIndicator(true);
      // console.log(values);
      try {
        const response = await api.post("/createLeaveSetting", values, {
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
      if (Object.values(values).some(value => value.trim() !== "")) {
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
      <Modal show={show} size="md" onHide={handleClose} centered
       backdrop={isModified ? "static" : true} 
       keyboard={isModified ? false : true} >
        <Modal.Header closeButton>
          <Modal.Title className="headColor">Add Leave Type</Modal.Title>
        </Modal.Header>
         <form onSubmit={formik.handleSubmit} onKeyDown={(e) => {
          if (e.key === 'Enter' && !formik.isSubmitting) {
            e.preventDefault();  // Prevent default form submission
          }
        }}>
          <Modal.Body>
            <div className="container">
              <div className="row">
                <div className="col-12 mb-2">
                  <label className="form-label">
                    Leave Type<span className="text-danger">*</span>
                  </label>
                  <input
                    type="text"
                    className={`form-control  ${
                      formik.touched.leaveType && formik.errors.leaveType
                        ? "is-invalid"
                        : ""
                    }`}
                    {...formik.getFieldProps("leaveType")}
                  />
                  {formik.touched.leaveType && formik.errors.leaveType && (
                    <div className="invalid-feedback">
                      {formik.errors.leaveType}
                    </div>
                  )}
                </div>
              </div>
            </div>
            <Modal.Footer className="mt-3">
              <Button type="button" className="btn btn-sm btn-border bg-light text-dark" onClick={handleClose}>
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

export default LeaveAdd;
