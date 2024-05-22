import React, { useState } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import * as yup from "yup";
import { useFormik } from "formik";
import { toast } from "react-toastify";
import api from "../../../config/URL";

function AddBreak({ id, onSuccess }) {
  const [show, setShow] = useState(false);
  const [loadIndicator, setLoadIndicator] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const validationSchema = yup.object().shape({
    breakName: yup.string().required("*Break Name is required"),
    fromDate: yup.string().required("*From Date is required"),
    toDate: yup.string().required("*To Date is required"),
  });
  const formik = useFormik({
    initialValues: {
      breakName: "",
      fromDate: "",
      toDate: "",
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      setLoadIndicator(true);
      console.log("Form values:", values);
      try {
        const response = await api.post(
          `/createCenterBreaks/${id}`,
          values,
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        if (response.status === 201) {
          toast.success(response.data.message);
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
      <button
        style={{ whiteSpace: "nowrap", width: '100%' }}
        className="btn btn-normal"
        onClick={handleShow}
      >
          Add <i class="bx bx-plus"></i>Centre Break
      </button>

      <Modal
        show={show}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
        onHide={handleClose}
      >
        <form onSubmit={formik.handleSubmit} >
        <Modal.Header closeButton>
          <Modal.Title ><p className="headColor">Add Centre Break</p></Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="row">
            <div className="col-md-6 col-12 mb-2">
              <lable className="form-lable">Break Name<span className="text-danger">*</span></lable>
              <div className="input-group mb-3">
                <input
                  type="data"
                  className={`form-control   ${
                    formik.touched.breakName && formik.errors.breakName
                      ? "is-invalid"
                      : ""
                  }`}
                  {...formik.getFieldProps("breakName")}           
                       />
                         {formik.touched.breakName && formik.errors.breakName && (
                    <div className="invalid-feedback">
                      {formik.errors.breakName}
                    </div>
                  )}
              </div>
            </div>
            <div className="col-md-6 col-12 mb-2">
              <lable>
                From Date<span class="text-danger">*</span>
              </lable>
              <input
                type="date"
                className={`form-control   ${
                  formik.touched.fromDate && formik.errors.fromDate
                    ? "is-invalid"
                    : ""
                }`}
                {...formik.getFieldProps("fromDate")} 
              />
              {formik.touched.fromDate && formik.errors.fromDate && (
                    <div className="invalid-feedback">
                      {formik.errors.fromDate}
                    </div>
                  )}
            </div>
            <div class="col-md-6 col-12 mb-2">
              <lable className="form-lable">To Date<span className="text-danger">*</span></lable>
              <div class="input-group mb-3">
                <input
                  type="date"
                  className={`form-control   ${
                    formik.touched.toDate && formik.errors.toDate
                      ? "is-invalid"
                      : ""
                  }`}
                  {...formik.getFieldProps("toDate")} 
                />
                  {formik.touched.toDate && formik.errors.toDate && (
                    <div className="invalid-feedback">
                      {formik.errors.toDate}
                    </div>
                  )}
              </div>
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer className="mt-3">
          <Button variant="secondary btn-sm"  onClick={handleClose}>
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

export default AddBreak;
