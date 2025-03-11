import React, { useEffect, useState } from "react";
import { useFormik } from "formik";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import * as Yup from "yup";
import api from "../../../config/URL";
import { toast } from "react-toastify";

const validationSchema = Yup.object({});

function CpfEdit({ id, onSuccess, handleMenuClose }) {
  const [open, setOpen] = useState(false);
  const [loadIndicator, setLoadIndicator] = useState(false);
  const userName = localStorage.getItem("tmsuserName");
  const [isModified, setIsModified] = useState(false);
  const centerId = localStorage.getItem("tmscenterId");
  const [citizenshipData, setCitizenshipData] = useState([]);

  const getData = async () => {
    try {
      const response = await api.get(`/getAllUserCpfPrById/${id}`);
      formik.setValues(response.data);
    } catch (error) {
      console.error("Error fetching data ", error);
    }
  };

  const formik = useFormik({
    initialValues: {
      centerId: centerId,
      minAge: 0,
      maxAge: 0,
      cpfPerEmployee: 0,
      cpfPerEmployer: 0,
      citizenshipId: 0,
      updatedBy: userName,
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      setLoadIndicator(true);
      try {
        const response = await api.put(`/updateUserCpfPr/${id}`, values, {
          headers: {
            "Content-Type": "application/json",
          },
        });
        if (response.status === 201 || response.status === 200) {
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
      if (Object.values(values).some((value) => (value && typeof value === 'string' ? value.trim() !== "" : value))) {
        setIsModified(true);
      } else {
        setIsModified(false);
      }
    },
  });

  const handleClose = () => {
    handleMenuClose();
    setOpen(false);
  };
  const handleShow = () => {
    setOpen(true);
    setIsModified(false);
    getData();
  };

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
      <p
        style={{
          whiteSpace: "nowrap",
          width: "100%",
        }}
        className="text-start mb-0 menuitem-style"
        onClick={handleShow}
      >
        Edit
      </p>
      <Dialog
        open={open}
        onClose={isModified ? undefined : handleClose}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle className="headColor">
          SDL Edit{" "}
          <IconButton
            aria-label="close"
            onClick={handleClose}
            style={{ position: "absolute", right: 8, top: 8 }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <form
          onSubmit={formik.handleSubmit}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !formik.isSubmitting) {
              e.preventDefault(); // Prevent default form submission
            }
          }}
        >
          <DialogContent>
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
          </DialogContent>
          <DialogActions>
            <button
              type="button"
              onClick={handleClose}
              className="btn btn-border btn-sm"
              style={{ fontSize: "12px" }}
            >
              Cancel
            </button>
            <button
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
            </button>
          </DialogActions>
        </form>
      </Dialog>
    </>
  );
}

export default CpfEdit;
