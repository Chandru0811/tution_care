import React, { useEffect } from "react";
import { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import api from "../../config/URL";
import { toast } from "react-toastify";

function SuperAdminShgAdd({ onSuccess }) {
  const [show, setShow] = useState(false);
  const [loadIndicator, setLoadIndicator] = useState(false);
  const [isModified, setIsModified] = useState(false);
  const centerId = localStorage.getItem("tmscenterId");
  const [nationalityData, setNationalityData] = useState([]);

  const handleClose = () => {
    setShow(false);
    formik.resetForm();
  };
  const handleShow = () => {
    setShow(true);
    setIsModified(false);
  };
  const userName = localStorage.getItem("tmsuserName");

  const validationSchema = Yup.object({
    salaryAmount: Yup.string().required("*Salary Amount is required"), // Optional: Maximum character length

    shgContribution: Yup.number()
      .typeError("*SHG Contribution must be a number") // Ensures value is a valid number
      .required("*SHG Contribution is required") // Required validation
      .positive("*SHG Contribution must be a positive number") // Only positive values allowed
      .test(
        "is-decimal",
        "*SHG Contribution must have at most 2 decimal places", // Custom error message
        (value) => {
          // Test allows numbers with up to 2 decimal places
          return value ? /^\d+(\.\d{1,2})?$/.test(value) : true;
        }
      ),

    nationalityId: Yup.string().required("*Nationality is required"),
  });

  const formik = useFormik({
    initialValues: {
      centerId: centerId,
      salaryAmount: "",
      shgContribution: "",
      nationalityId: "",
      createdBy: userName,
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      setLoadIndicator(true);
      try {
        const response = await api.post("/createUserShg", values, {
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
      if (
        Object.values(values).some((value) =>
          value && typeof value === "string" ? value.trim() !== "" : value
        )
      ) {
        setIsModified(true);
      } else {
        setIsModified(false);
      }
    },
  });

  const fetchCNCData = async () => {
    try {
      const nationality = await api.get(
        `/getAllNationalityTypeWithCenterId/${centerId}`
      );
      setNationalityData(nationality.data);
    } catch (error) {
      toast.error(error);
    }
  };

  useEffect(() => {
    fetchCNCData();
  }, []);

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
                    Salary Amount<span className="text-danger">*</span>
                  </label>
                  <input
                    type="text"
                    className={`form-control  ${
                      formik.touched.salaryAmount && formik.errors.salaryAmount
                        ? "is-invalid"
                        : ""
                    }`}
                    {...formik.getFieldProps("salaryAmount")}
                  />
                  {formik.touched.salaryAmount &&
                    formik.errors.salaryAmount && (
                      <div className="invalid-feedback">
                        {formik.errors.salaryAmount}
                      </div>
                    )}
                </div>
                <div className="col-md-6 col-12 mb-2">
                  <label className="form-label">
                    SHG Contribution<span className="text-danger">*</span>
                  </label>
                  <input
                    type="text"
                    className={`form-control  ${
                      formik.touched.shgContribution &&
                      formik.errors.shgContribution
                        ? "is-invalid"
                        : ""
                    }`}
                    {...formik.getFieldProps("shgContribution")}
                  />
                  {formik.touched.shgContribution &&
                    formik.errors.shgContribution && (
                      <div className="invalid-feedback">
                        {formik.errors.shgContribution}
                      </div>
                    )}
                </div>
                <div className="col-md-6 col-12 mb-2 mt-3">
                  <label>Nationality</label>
                  <span className="text-danger">*</span>
                  <select
                    className="form-select"
                    name="nationalityId"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.nationalityId}
                  >
                    <option selected></option>
                    {nationalityData &&
                      nationalityData.map((nationalityId) => (
                        <option key={nationalityId.id} value={nationalityId.id}>
                          {nationalityId.nationality}
                        </option>
                      ))}
                  </select>
                  {formik.touched.nationalityId &&
                    formik.errors.nationalityId && (
                      <div className="error text-danger">
                        <small>{formik.errors.nationalityId}</small>
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

export default SuperAdminShgAdd;
