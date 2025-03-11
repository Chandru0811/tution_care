import React, { useEffect } from "react";
import { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import api from "../../../config/URL";
import { toast } from "react-toastify";

function CpfAdd({ onSuccess }) {
  const [show, setShow] = useState(false);
  const [loadIndicator, setLoadIndicator] = useState(false);
  const [isModified, setIsModified] = useState(false);
  const centerId = localStorage.getItem("tmscenterId");
  const [citizenshipData, setCitizenshipData] = useState([]);

  const handleClose = () => {
    setShow(false);
    formik.resetForm();
  };
  const handleShow = () => {
    setShow(true);
    setIsModified(false);
  };
  const userName = localStorage.getItem("tmsuserName");

  const validationSchema = Yup.object({});

  const formik = useFormik({
    initialValues: {
      centerId: centerId,
      minAge: 0,
      maxAge: 0,
      cpfPerEmployee: 0,
      cpfPerEmployer: 0,
      citizenshipId: 0,
      createdBy: userName,
    },
    // validationSchema: validationSchema,
    onSubmit: async (values) => {
      setLoadIndicator(true);
      try {
        const response = await api.post("/createUserCpfPr", values, {
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
      const citizenship = await api.get(
        `/getAllCitizenshipTypeWithCenterId/${centerId}`
      );
      setCitizenshipData(citizenship.data);
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
          <Modal.Title className="headColor">Add CPF</Modal.Title>
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
                    Min Age<span className="text-danger">*</span>
                  </label>
                  <input
                    type="text"
                    name="minAge"
                    className={`form-control  ${
                      formik.touched.minAge && formik.errors.minAge
                        ? "is-invalid"
                        : ""
                    }`}
                    {...formik.getFieldProps("minAge")}
                  />
                  {formik.touched.minAge && formik.errors.minAge && (
                    <div className="invalid-feedback">
                      {formik.errors.minAge}
                    </div>
                  )}
                </div>
                <div className="col-md-6 col-12 mb-2">
                  <label className="form-label">
                    Max Age<span className="text-danger">*</span>
                  </label>
                  <input
                    type="text"
                    name="maxAge"
                    className={`form-control  ${
                      formik.touched.maxAge && formik.errors.maxAge
                        ? "is-invalid"
                        : ""
                    }`}
                    {...formik.getFieldProps("maxAge")}
                  />
                  {formik.touched.maxAge && formik.errors.maxAge && (
                    <div className="invalid-feedback">
                      {formik.errors.maxAge}
                    </div>
                  )}
                </div>
                <div className="col-md-6 col-12 mb-2 mt-3">
                  <label>Citizenship</label>
                  <span className="text-danger">*</span>
                  <select
                    className="form-select"
                    name="citizenshipId"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.citizenshipId}
                  >
                    <option selected></option>
                    {citizenshipData &&
                      citizenshipData.map((citizenshipId) => (
                        <option key={citizenshipId.id} value={citizenshipId.id}>
                          {citizenshipId.citizenship}
                        </option>
                      ))}
                  </select>
                  {formik.touched.citizenshipId &&
                    formik.errors.citizenshipId && (
                      <div className="error text-danger">
                        <small>{formik.errors.citizenshipId}</small>
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

export default CpfAdd;
