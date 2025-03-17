import React, { useState } from "react";
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

const validationSchema = Yup.object({});

function SuperAdminSdlEdit({ id, onSuccess, handleMenuClose }) {
  const [open, setOpen] = useState(false);
  const [loadIndicator, setLoadIndicator] = useState(false);
  const userName = localStorage.getItem("tmsuserName");
  const [isModified, setIsModified] = useState(false);
  const centerId = localStorage.getItem("tmscenterId");

  const getData = async () => {
    try {
      const response = await api.get(`/getAllUserSdlById/${id}`);
      // formik.setFieldValue("shgAmount", response.data.shgAmount);
      // formik.setFieldValue("shgType", response.data.shgType);
      formik.setValues(response.data);
    } catch (error) {
      console.error("Error fetching data ", error);
    }
  };

  const formik = useFormik({
    initialValues: {
      centerId: centerId,
      salaryAmount: "",
      sdlPayable: "",
      sdlRate: "",
      updatedBy: userName,
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      setLoadIndicator(true);
      try {
        const response = await api.put(`/updateUserSdl/${id}`, values, {
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
                    SDL Amount<span className="text-danger">*</span>
                  </label>
                  <input
                    type="text"
                    name="sdlAmount"
                    className={`form-control  ${
                      formik.touched.sdlAmount && formik.errors.sdlAmount
                        ? "is-invalid"
                        : ""
                    }`}
                    {...formik.getFieldProps("sdlAmount")}
                  />
                  {formik.touched.sdlAmount && formik.errors.sdlAmount && (
                    <div className="invalid-feedback">
                      {formik.errors.sdlAmount}
                    </div>
                  )}
                </div>
                <div className="col-md-6 col-12 mb-2">
                  <label className="form-label">
                    SDL Payable<span className="text-danger">*</span>
                  </label>
                  <input
                    type="text"
                    name="sdlPayable"
                    className={`form-control  ${
                      formik.touched.sdlPayable && formik.errors.sdlPayable
                        ? "is-invalid"
                        : ""
                    }`}
                    {...formik.getFieldProps("sdlPayable")}
                  />
                  {formik.touched.sdlPayable && formik.errors.sdlPayable && (
                    <div className="invalid-feedback">
                      {formik.errors.sdlPayable}
                    </div>
                  )}
                </div>
                <div className="col-md-6 col-12 mb-2">
                  <label className="form-label">
                    SDL Rate<span className="text-danger">*</span>
                  </label>
                  <input
                    type="text"
                    name="sdlrate"
                    className={`form-control  ${
                      formik.touched.sdlrate && formik.errors.sdlrate
                        ? "is-invalid"
                        : ""
                    }`}
                    {...formik.getFieldProps("sdlrate")}
                  />
                  {formik.touched.sdlrate && formik.errors.sdlrate && (
                    <div className="invalid-feedback">
                      {formik.errors.sdlrate}
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

export default SuperAdminSdlEdit;
