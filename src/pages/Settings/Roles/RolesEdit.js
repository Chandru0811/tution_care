import React from "react";
import { useState } from "react";
import { useFormik } from "formik";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import * as Yup from "yup";
import api from "../../../config/URL";
import { toast } from "react-toastify";

function RolesEdit({ id, onSuccess, handleMenuClose }) {
  const [show, setShow] = useState(false);
  const [loadIndicator, setLoadIndicator] = useState(false);
  const userName = localStorage.getItem("tmsuserName");
  const [isModified, setIsModified] = useState(false);
  const centerId = localStorage.getItem("tmscenterId");

  const getData = async () => {
    try {
      const response = await api.get(`/getUserRolesById/${id}`);
      formik.setValues(response.data);
    } catch (error) {
      console.error("Error fetching data ", error);
    }
  };

  const handleClose = () => {
    handleMenuClose();
    setShow(false);
  };
  const handleShow = () => {
    setShow(true);
    setIsModified(false);
    getData();
  };

  const validationSchema = Yup.object({
    name: Yup.string().required("*Name is required"),
    roleCategory: Yup.string().required("*Role Category is required"),
  });

  const formik = useFormik({
    initialValues: {
      name: "",
      roleCategory: "",
      centerId: centerId,
      updatedBy: userName,
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      setLoadIndicator(true);
      values.centerId = centerId;
      try {
        values.updatedBy = userName;
        const response = await api.put(`/updateUserRole/${id}`, values, {
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
        if (error.status === 403) {
          toast.warning("The role is protected and cannot be updated");
        } else {
          toast.error(error.message);
        }
      } finally {
        handleClose();
        setLoadIndicator(false);
      }
    },
    enableReinitialize: true,
    validateOnChange: true,
    validateOnBlur: true,
  });

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
        open={show}
        onClose={!isModified ? handleClose : null}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle className="headColor">
          Roles Edit{" "}
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
                <div className="col-12 mb-2">
                  <label className="form-label">
                    Name<span className="text-danger">*</span>
                  </label>
                  <input
                    onKeyDown={(e) => e.stopPropagation()}
                    type="text"
                    className={`form-control  ${
                      formik.touched.name && formik.errors.name
                        ? "is-invalid"
                        : ""
                    }`}
                    {...formik.getFieldProps("name")}
                  />
                  {formik.touched.name && formik.errors.name && (
                    <div className="invalid-feedback">{formik.errors.name}</div>
                  )}
                </div>
                <div className="col-12 mb-3">
                  <label className="form-label">Role Category</label>
                  <div className="input-group">
                    <select
                      name="roleCategory"
                      {...formik.getFieldProps("roleCategory")}
                      className={`form-select ${
                        formik.touched.roleCategory &&
                        formik.errors.roleCategory
                          ? "is-invalid"
                          : ""
                      }`}
                    >
                      <option value=""></option>
                      <option value="Teaching">Teaching</option>
                      <option value="Non_Teaching">Non Teaching</option>
                    </select>
                  </div>
                  {formik.touched.roleCategory &&
                    formik.errors.roleCategory && (
                      <div className="error text-danger">
                        <small>{formik.errors.roleCategory}</small>
                      </div>
                    )}
                </div>
              </div>
            </div>
          </DialogContent>
          <DialogActions>
            <button
              type="button"
              className="btn btn-border btn-sm"
              style={{ fontSize: "12px" }}
              onClick={handleClose}
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

export default RolesEdit;
