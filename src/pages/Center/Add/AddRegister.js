import React, { useState } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import * as yup from "yup";
import { useFormik } from "formik";
import toast from "react-hot-toast";
import api from "../../../config/URL";

function AddRegister({ id, onSuccess }) {
  const [show, setShow] = useState(false);
  const [loadIndicator, setLoadIndicator] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const validationSchema = yup.object().shape({
    registrationDate: yup.string().required("*Registeration Date is required"),
    effectiveDate: yup.string().required("*Effective Date is required"),
    amount: yup.string().typeError("Amount must be a number").required("*Amount is required"),
    taxType: yup.string().required("*Tax Type is required"),
  });
  const formik = useFormik({
    initialValues: {
      registrationDate: "",
      effectiveDate: "",
      amount: "",
      taxType: "",
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      setLoadIndicator(true);
      console.log(values);

      try {
        const response = await api.post(
          `/createTuitionRegistrations/${id}`,
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
        toast.error(error.message);
      }finally {
        setLoadIndicator(false);
      }
    },
  });

  return (
    <>
      <button
        style={{ whiteSpace: "nowrap" }}
        className="btn btn-normal"
        onClick={handleShow}
      >
          Add Registration Fees
      </button>

      <Modal
        show={show}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
        onHide={handleClose}
      >
        <form onSubmit={formik.handleSubmit}>
          <Modal.Header closeButton>
            <Modal.Title>
              <p className="headColor">Add Centre Registration Fees</p>
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div className="row">
              <div className="col-md-6 col-12 mb-2">
                <lable className="form-lable">
                  Registration Date<span className="text-danger">*</span>
                </lable>
                <div className="input-group mb-3">
                  <input
                    type="date"
                    className={`form-control   ${
                      formik.touched.registrationDate &&
                      formik.errors.registrationDate
                        ? "is-invalid"
                        : ""
                    }`}
                    {...formik.getFieldProps("registrationDate")}
                  />
                  {formik.touched.registrationDate &&
                    formik.errors.registrationDate && (
                      <div className="invalid-feedback">
                        {formik.errors.registrationDate}
                      </div>
                    )}
                </div>
              </div>
              <div className="col-md-6 col-12 mb-2">
                <lable className="">
                  Effective Date<span class="text-danger">*</span>
                </lable>
                <input
                  type="date"
                  className={`form-control    ${
                    formik.touched.effectiveDate && formik.errors.effectiveDate
                      ? "is-invalid"
                      : ""
                  }`}
                  {...formik.getFieldProps("effectiveDate")}
                />
                {formik.touched.effectiveDate &&
                  formik.errors.effectiveDate && (
                    <div className="invalid-feedback">
                      {formik.errors.effectiveDate}
                    </div>
                  )}
              </div>
              <div className="col-md-6 col-12 mb-2">
                <lable className="form-lable">
                  Amount (Including GST)<span className="text-danger">*</span>
                </lable>
                <div className="input-group mb-3">
                  <input
                    type="text"
                    className={`form-control    ${
                      formik.touched.amount && formik.errors.amount
                        ? "is-invalid"
                        : ""
                    }`}
                    {...formik.getFieldProps("amount")}
                  />
                  {formik.touched.amount && formik.errors.amount && (
                    <div className="invalid-feedback">
                      {formik.errors.amount}
                    </div>
                  )}
                </div>
              </div>
              <div className="col-md-6 col-12 mb-2">
                <lable className="">
                  Tax Type<span class="text-danger">*</span>
                </lable>
                <select
                  className={`form-select    ${
                    formik.touched.taxType && formik.errors.taxType
                      ? "is-invalid"
                      : ""
                  }`}
                  {...formik.getFieldProps("taxType")}
                >
                  <option selected></option>
                  <option value="Taxable">Taxable</option>
                  <option value="Non-Taxable">Non-Taxable</option>
                </select>
                {formik.touched.taxType && formik.errors.taxType && (
                  <div className="invalid-feedback">
                    {formik.errors.taxType}
                  </div>
                )}
              </div>
            </div>
          </Modal.Body>
          <Modal.Footer className="mt-3">
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

export default AddRegister;
