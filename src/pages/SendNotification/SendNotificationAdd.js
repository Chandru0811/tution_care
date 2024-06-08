import React from "react";
import { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import api from "../../config/URL";
import toast from "react-hot-toast";
// import { useNavigate } from "react-router-dom";

function SendNotificationAdd({ onSuccess }) {
  // const navigate = useNavigate();
  const [show, setShow] = useState(false);
  const [loadIndicator, setLoadIndicator] = useState(false);


  const handleClose = () => {
    setShow(false);
    formik.resetForm();
  };

  const handleShow = () => setShow(true);

  const validationSchema = Yup.object({
    messageTitle: Yup.string().required("*messageTitle is required"),
    messageDescription: Yup.string().required("*messageDescription is required"),

  });

  const formik = useFormik({
    initialValues: {
      messageTitle: "",
      messageDescription: ""
    
    },
    validationSchema: validationSchema, // Assign the validation schema
    onSubmit: async (values) => {
      setLoadIndicator(true);
      console.log("pushNotification:", values);
      try {
        const response = await api.post(`/sendTuitionCarePushNotifications`, values, {
          headers: {
            "Content-Type": "application/json",
            //Authorization: `Bearer ${token}`,
          },
        });
        if (response.status === 201) {
      
          
          handleClose();
          onSuccess();
          toast.success(response.data.message);
        
        } else {
          toast.error(response.data.message);
        }
      } catch (error) {
        toast.error("Failed: " + error.message);
      }finally {
        setLoadIndicator(false);
      }
    },
  });

  return (
    <>
      <div className=" d-flex justify-content-end">
        <button
          type="button"
          className="btn btn-button btn-sm"
          onClick={handleShow}
        >
              Add <i class="bx bx-plus"></i>
        </button>
      </div>
      <Modal show={show} size="lg" onHide={handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title className="headColor">Add Notification</Modal.Title>
        </Modal.Header>
        <form onSubmit={formik.handleSubmit}>
          <Modal.Body>
            <div className="container">
              <div className="row mb-3">
                <div className="col-md-12 col-12 mb-2">
                  <label className="form-label">
                    Title<span className="text-danger">*</span>
                  </label>
                  <input
                    type="text"
                    name="title"
                    className={`form-control form-control-sm  ${
                      formik.touched.messageTitle && formik.errors.messageTitle
                        ? "is-invalid"
                        : ""
                    }`}
                    {...formik.getFieldProps("messageTitle")}
                  />
                  {formik.touched.messageTitle && formik.errors.messageTitle && (
                    <div className="invalid-feedback">
                      {formik.errors.messageTitle}
                    </div>
                  )}
                </div>
                <div className="col-md-12 col-12 mb-2">
                  <label className="form-label">
                    Message<span className="text-danger">*</span>
                  </label>
                  <textarea
                    type="text"
                    name="message"
                    rows={5}
                    className={`form-control form-control-sm  ${
                      formik.touched.messageDescription && formik.errors.messageDescription
                        ? "is-invalid"
                        : ""
                    }`}
                    {...formik.getFieldProps("messageDescription")}
                  />
                  {formik.touched.messageDescription && formik.errors.messageDescription && (
                    <div className="invalid-feedback">
                      {formik.errors.messageDescription}
                    </div>
                  )}
                </div>
              </div>
            </div>
            <Modal.Footer>
              <Button type="button" variant="secondary btn-sm" onClick={handleClose}>
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
               Save
              </Button>
            </Modal.Footer>
          </Modal.Body>
        </form>
      </Modal>
    </>
  );
}

export default SendNotificationAdd;
