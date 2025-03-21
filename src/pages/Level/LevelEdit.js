import React from "react";
import { useState } from "react";
import { useFormik } from "formik";
import Button from "react-bootstrap/Button";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import * as Yup from "yup";
import api from "../../config/URL";
import { toast } from "react-toastify";
import fetchAllSubjectsWithIds from "../List/SubjectList";

function Edit({ id, onSuccess, handleMenuClose }) {
  const [open, setOpen] = useState(false);
  const [loadIndicator, setLoadIndicator] = useState(false);
  const [subjectData, setSubjectData] = useState(null);
  const [isModified, setIsModified] = useState(false);
  const role = localStorage.getItem("tmsrole");
  const appConfigInfo = JSON.parse(localStorage.getItem("tmsappConfigInfo"));

  const fetchData = async () => {
    try {
      const subject = await fetchAllSubjectsWithIds();
      setSubjectData(subject);
    } catch (error) {
      toast.error(error);
    }
  };

  const getData = async () => {
    try {
      const response = await api.get(`/getAllCourseLevels/${id}`);
      formik.setValues(response.data);
    } catch (error) {
      console.error("Error fetching data ", error);
    }
  };

  const validationSchema = Yup.object({
    level: Yup.string().required(`*${appConfigInfo.subject} is required`),
    levelCode: Yup.string().required(`*${appConfigInfo.subject} Code is required`),
    status: Yup.string().required("*Status is required"),
    subjectId: Yup.string().required(`*${appConfigInfo.subject} is required`),
  });

  const formik = useFormik({
    initialValues: {
      level: "",
      levelCode: "",
      status: "",
      subjectId: "",
      updatedBy: role,
    },
    validationSchema: validationSchema, // Assign the validation schema
    onSubmit: async (values) => {
      setLoadIndicator(true);
       values.updatedBy= role;
      try {
        const response = await api.put(`/updateCourseLevel/${id}`, values, {
          headers: {
            "Content-Type": "application/json",
          },
        });
        if (response.status === 200) {
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
        Object.values(values).some(
          (value) => typeof value === "string" && value.trim() !== ""
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
    formik.resetForm();
    setOpen(false);
    setSubjectData(null);
  };

  const handleOpen = () => {
    fetchData();
    getData();
    setOpen(true);
    setIsModified(false);
  };

  return (
    <>
      <p
      className="text-start mb-0 menuitem-style"
        onClick={handleOpen}
        style={{
          whiteSpace: "nowrap",
          width: "100%",
        }}
      >
        Edit
      </p>

      <Dialog
        open={open}
        onClose={handleClose}
        fullWidth
        maxWidth="md"
        disableBackdropClick={isModified}
        disableEscapeKeyDown={isModified}
      >
        <DialogTitle className="headColor">Edit {appConfigInfo.level}</DialogTitle>
        <form
          onSubmit={formik.handleSubmit}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !formik.isSubmitting) {
              e.preventDefault();
            }
          }}
        >
          <DialogContent>
            <div className="container">
              <div className="row py-4">
                <div className="col-md-6 col-12 mb-2">
                  <label className="form-label">
                  {appConfigInfo.subject}<span className="text-danger">*</span>
                  </label>
                  <select
                    {...formik.getFieldProps("subjectId")}
                    className={`form-select  ${
                      formik.touched.subjectId && formik.errors.subjectId
                        ? "is-invalid"
                        : ""
                    }`}
                  >
                    <option></option>
                    {subjectData &&
                      subjectData.map((subject) => (
                        <option key={subject.id} value={subject.id}>
                          {subject.subject}
                        </option>
                      ))}
                  </select>
                  {formik.touched.subjectId && formik.errors.subjectId && (
                    <div className="invalid-feedback">
                      {formik.errors.subjectId}
                    </div>
                  )}
                </div>
                <div className="col-md-6 col-12 mb-2">
                  <label className="form-label">
                    Status<span className="text-danger">*</span>
                  </label>
                  <select
                    {...formik.getFieldProps("status")}
                    className={`form-select  ${
                      formik.touched.status && formik.errors.status
                        ? "is-invalid"
                        : ""
                    }`}
                    aria-label="Default select example"
                  >
                    <option selected></option>
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                  {formik.touched.status && formik.errors.status && (
                    <div className="invalid-feedback">
                      {formik.errors.status}
                    </div>
                  )}
                </div>
                <div className="col-md-6 col-12 mb-2">
                  <label className="form-label">
                  {appConfigInfo.level}<span className="text-danger">*</span>
                  </label>
                  <input
                  onKeyDown={(e) => e.stopPropagation()}
                    type="text"
                    className={`form-control  ${
                      formik.touched.level && formik.errors.level
                        ? "is-invalid"
                        : ""
                    }`}
                    {...formik.getFieldProps("level")}
                  />
                  {formik.touched.level && formik.errors.level && (
                    <div className="invalid-feedback">
                      {formik.errors.level}
                    </div>
                  )}
                </div>
                <div className="col-md-6 col-12 mb-2">
                  <label className="form-label">
                  {appConfigInfo.level} Code<span className="text-danger">*</span>
                  </label>
                  <input
                    onKeyDown={(e) => e.stopPropagation()}
                    type="text"
                    className={`form-control  ${
                      formik.touched.levelCode && formik.errors.levelCode
                        ? "is-invalid"
                        : ""
                    }`}
                    {...formik.getFieldProps("levelCode")}
                  />
                  {formik.touched.levelCode && formik.errors.levelCode && (
                    <div className="invalid-feedback">
                      {formik.errors.levelCode}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </DialogContent>
          <DialogActions>
            <Button
              className="btn btn-sm btn-border bg-light text-dark"
              onClick={handleClose}
            >
              Cancel
            </Button>
            <button
              type="submit"
              onSubmit={formik.handleSubmit}
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

export default Edit;
