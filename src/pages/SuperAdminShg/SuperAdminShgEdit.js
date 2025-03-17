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
import api from "../../config/URL";
import { toast } from "react-toastify";

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

function SuperAdminShgEdit({ id, onSuccess, handleMenuClose }) {
  const [open, setOpen] = useState(false);
  const [loadIndicator, setLoadIndicator] = useState(false);
  const userName = localStorage.getItem("tmsuserName");
  const [isModified, setIsModified] = useState(false);
  const centerId = localStorage.getItem("tmscenterId");
  const [nationalityData, setNationalityData] = useState([]);

  const getData = async () => {
    try {
      const response = await api.get(`/getAllUserShgById/${id}`);
      formik.setValues(response.data);
    } catch (error) {
      console.error("Error fetching data ", error);
    }
  };

  const formik = useFormik({
    initialValues: {
      centerId: centerId,
      salaryAmount: "",
      shgContribution: "",
      nationalityId: "",
      updatedBy: userName,
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      setLoadIndicator(true);
      try {
        const response = await api.put(`/updateUserShg/${id}`, values, {
          headers: {
            "Content-Type": "application/json",
          },
        });
        if (response.status === 200) {
          onSuccess();

          toast.success(response.data.message);
        } else {
          toast.error(response.data.message);
        }
      } catch (error) {
        toast.error(error);
      } finally {
        handleClose();
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
          SHG Edit{" "}
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

export default SuperAdminShgEdit;
