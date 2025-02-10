import React, { useEffect, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import api from "../../../config/URL";
import { toast } from "react-toastify";
import fetchUserListWithoutFreelancerByCenterId from "../../List/UserListWithoutFreelancer";
import { format } from "date-fns";
import { Modal, Button } from "react-bootstrap";

const validationSchema = Yup.object({
  userId: Yup.number().required("*Employee Name is required"),
  deductionName: Yup.string().required("*Select the Deduction Name"),
  deductionMonth: Yup.string().required("*Select the Deduction Month"),
  deductionAmount: Yup.number()
    .typeError("*Deduction Amount must be a number")
    .required("*Deduction Amount is required")
    .positive("*Deduction Amount must be a positive value"),
});

function DeductionAdd({ onSuccess }) {
  const [userNamesData, setUserNameData] = useState(null);
  const [loadIndicator, setLoadIndicator] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const userName = localStorage.getItem("tmsuserName");
  const centerId = localStorage.getItem("tmscenterId");

  const handleClose = () => {
    setShowModal(false);
    formik.resetForm();
  };
  const handleShow = () => {
    formik.resetForm();
    setShowModal(true);
  };

  const formik = useFormik({
    initialValues: {
      centerId: centerId,
      userId: "",
      deductionName: "",
      deductionMonth: format(new Date(), "yyyy-MM"),
      deductionAmount: "",
      createdBy: userName,
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      setLoadIndicator(true);
      values.createdBy = userName;

      let selectedEmployeeName =
        userNamesData.find(
          (employee) => parseInt(values.userId) === employee.id
        )?.userNames || "--";

      let payload = {
        centerId :centerId,
        userId: values.userId,
        employeeName: selectedEmployeeName,
        deductionName: values.deductionName,
        deductionMonth: values.deductionMonth,
        deductionAmount: values.deductionAmount,
      };

      try {
        const response = await api.post(
          "/createUserDeduction",
          payload,
          { headers: { "Content-Type": "application/json" } }
        );

        if (response.status === 201) {
          onSuccess();
          toast.success(response.data.message);
          setShowModal(false);
        } else {
          toast.error(response.data.message);
        }
      } catch (error) {
        toast.error(error);
      } finally {
        setLoadIndicator(false);
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
      toast.error(error);
    }
  };

  useEffect(() => {
    fetchUserName();
  }, []);

  return (
    <div className="container-fluid">
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

      <Modal show={showModal} onHide={handleClose} size="lg" centered>
        <Modal.Header closeButton>
          <Modal.Title className="headColor">Add Deduction</Modal.Title>
        </Modal.Header>
        <form onSubmit={formik.handleSubmit}>
          <Modal.Body>
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
          </Modal.Body>

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
        </form>
      </Modal>
    </div>
  );
}

export default DeductionAdd;
