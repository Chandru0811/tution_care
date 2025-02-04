import React, { useEffect, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import api from "../../../config/URL";
import { toast } from "react-toastify";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import fetchUserListWithoutFreelancerByCenterId from "../../List/UserListWithoutFreelancer";

const validationSchema = Yup.object({
  // centerId: Yup.string().required("*Center Name is required"),
  userId: Yup.string().required("*Employee Name is required"),
  deductionName: Yup.string().required("*Select the Deduction Name"),
  deductionMonth: Yup.string().required("*Select the Deduction Month"),
  deductionAmount: Yup.number()
    .typeError("*Deduction Amount must be a number")
    .required("*Deduction Amount is required")
    .positive("*Deduction Amount must be a positive value"),
});

function DeductionEdit({ id, onSuccess, handleMenuClose }) {
  const [userNamesData, setUserNameData] = useState(null);
  const [isModified, setIsModified] = useState(false);
  const [loadIndicator, setLoadIndicator] = useState(false);
  const [show, setShow] = useState(false);
  const userName = localStorage.getItem("tmsuserName");
  const centerId = localStorage.getItem("tmscenterId");
  const navigate = useNavigate();

  const getData = async () => {
    try {
      const response = await api.get(`/getAllUserDeductionById/${id}`);
      formik.setValues(response.data);
      fetchUserName(response.data.centerId);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  useEffect(() => {
    getData();
    fetchUserName();
  }, []);

  const handleClose = () => {
    handleMenuClose();
    setShow(false);
  };
  const handleShow = () => {
    setShow(true);
    setIsModified(false);
    getData();
  };

  const formik = useFormik({
    initialValues: {
      centerId: centerId,
      userId: "",
      deductionMonth: "",
      deductionAmount: "",
      deductionName: "",
      updatedBy: userName,
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      setLoadIndicator(true);
      values.updatedBy = userName;
      values.centerId = centerId;
      try {
        const response = await api.put(`/updateUserDeduction/${id}`, values, {
          headers: {
            "Content-Type": "application/json",
          },
        });
        if (response.status === 200) {
          onSuccess();
          toast.success(response.data.message);
          navigate("/deduction");
        } else {
          toast.error(response.data.message);
        }
      } catch (error) {
        toast.error(error.message);
      } finally {
        setLoadIndicator(false);
        handleClose();
      }
    },
  });

  const fetchUserName = async () => {
    try {
      const userNames = await fetchUserListWithoutFreelancerByCenterId(
        centerId
      );
      setUserNameData(userNames);
    } catch (error) {
      toast.error(error.message);
    }
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
        open={show}
        onClose={!isModified ? handleClose : null}
        fullWidth
        maxWidth="md"
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
            <div className="row">
              <div className="col-md-6 col-12 mb-3">
                <label className="form-label">Employee Name</label>
                <span className="text-danger">*</span>
                <select
                  {...formik.getFieldProps("userId")}
                  className={`form-select ${
                    formik.touched.userId && formik.errors.userId
                      ? "is-invalid"
                      : ""
                  }`}
                >
                  <option selected disabled></option>
                  {userNamesData?.map((user) => (
                    <option key={user.id} value={user.id}>
                      {user.userNames}
                    </option>
                  ))}
                </select>
                {formik.touched.userId && formik.errors.userId && (
                  <div className="invalid-feedback">{formik.errors.userId}</div>
                )}
              </div>

              <div className="col-md-6 col-12 mb-3">
                <label className="form-label">Deduction Name</label>
                <span className="text-danger">*</span>
                <select
                  {...formik.getFieldProps("deductionName")}
                  className={`form-select ${
                    formik.touched.deductionName && formik.errors.deductionName
                      ? "is-invalid"
                      : ""
                  }`}
                >
                  <option></option>
                  <option>CPF</option>
                  <option>LOP</option>
                  <option>LOAN INTEREST</option>
                </select>
                {formik.touched.deductionName &&
                  formik.errors.deductionName && (
                    <div className="invalid-feedback">
                      {formik.errors.deductionName}
                    </div>
                  )}
              </div>

              <div className="col-md-6 col-12 mb-3">
                <label className="form-label">Deduction Month</label>
                <span className="text-danger">*</span>
                <input
                  type="month"
                  className={`form-control ${
                    formik.touched.deductionMonth &&
                    formik.errors.deductionMonth
                      ? "is-invalid"
                      : ""
                  }`}
                  {...formik.getFieldProps("deductionMonth")}
                />
                {formik.touched.deductionMonth &&
                  formik.errors.deductionMonth && (
                    <div className="invalid-feedback">
                      {formik.errors.deductionMonth}
                    </div>
                  )}
              </div>

              <div className="col-md-6 col-12 mb-3">
                <label className="form-label">Deduction Amount</label>
                <span className="text-danger">*</span>
                <input
                  type="text"
                  className={`form-control ${
                    formik.touched.deductionAmount &&
                    formik.errors.deductionAmount
                      ? "is-invalid"
                      : ""
                  }`}
                  {...formik.getFieldProps("deductionAmount")}
                />
                {formik.touched.deductionAmount &&
                  formik.errors.deductionAmount && (
                    <div className="invalid-feedback">
                      {formik.errors.deductionAmount}
                    </div>
                  )}
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

export default DeductionEdit;
