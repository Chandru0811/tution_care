import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import api from "../../../config/URL";
import toast from "react-hot-toast";
import fetchAllCentersWithIds from "../../List/CenterList";
import fetchAllEmployeeListByCenter from "../../List/EmployeeList";
import { format } from "date-fns";

const validationSchema = Yup.object({
  tuitionId: Yup.number().required("*Center Name is required"),
  userNames: Yup.number().required("*Employee Name is required"),
  deductionName: Yup.string().required("*Select the Deduction Name"),
  deductionMonth: Yup.string().required("*Select the Deduction Month"),
  deductionAmount: Yup.string().required("*Deduction Amount is required"),
});

function DeductionAdd() {
  const [centerData, setCenterData] = useState(null);
  const [userNamesData, setUserNameData] = useState(null);
  const [loadIndicator, setLoadIndicator] = useState(false);
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      tuitionId: "",
      userNames: "",
      deductionName: "",
      deductionMonth: "",
      deductionAmount: "",
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      setLoadIndicator(true);
      console.log("Attendance Emp:", values);
      let selectedCenterName = "";
      let selectedEmployeeName = "";

      centerData.forEach((center) => {
        if (parseInt(values.tuitionId) === center.id) {
          selectedCenterName = center.centerNames || "--";
        }
      });

      userNamesData.forEach((employee) => {
        if (parseInt(values.userNames) === employee.id) {
          selectedEmployeeName = employee.userNames || "--";
        }
      });

      let payload = {
        tuitionId: values.tuitionId,
        tuitionCareName: selectedCenterName,
        userId: values.userNames,
        employeeName: selectedEmployeeName,
        deductionName: values.deductionName,
        deductionMonth: values.deductionMonth,
        deductionAmount: values.deductionAmount,
      };

      try {
        const response = await api.post("/createUserDeduction", payload, {
          headers: {
            "Content-Type": "application/json",
          },
        });
        if (response.status === 201) {
          toast.success(response.data.message);
          navigate("/deduction");
        } else {
          toast.error(response.data.message);
        }
      } catch (error) {
        toast.error(error.message);
      } finally {
        setLoadIndicator(false);
      }
    },
  });

  const handleCenterChange = async (event) => {
    setUserNameData(null);
    const tuitionId = event.target.value;
    console.log("tuitionId", tuitionId);
    formik.setFieldValue("tuitionId", tuitionId);
    try {
      await fetchUserName(tuitionId);
    } catch (error) {
      toast.error(error.message);
    }
  };

  const fetchData = async () => {
    try {
      const centers = await fetchAllCentersWithIds();
      setCenterData(centers);
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const fetchUserName = async (tuitionId) => {
    try {
      console.log("tuitionId", tuitionId);
      const userNames = await fetchAllEmployeeListByCenter(tuitionId);
      setUserNameData(userNames);
      console.log("userNamesData", userNamesData);
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    const currentMonth = format(new Date(), "yyyy-MM");
    formik.setFieldValue("deductionMonth", currentMonth);
  }, []);

  return (
    <div className="container-fluid center">
      <form onSubmit={formik.handleSubmit}>
        <div className="card shadow border-0 mb-2 top-header">
          <div className="container-fluid py-4">
            <div className="row align-items-center">
              <div className="col">
                <div className="d-flex align-items-center gap-4">
                  <h2 className="h2 ls-tight headingColor">Add Deduction </h2>
                </div>
              </div>
              <div className="col-auto">
                <div className="hstack gap-2 justify-content-end">
                  <Link to="/deduction">
                    <button type="submit" className="btn btn-sm btn-light">
                      <span>Back</span>
                    </button>
                  </Link>
                  &nbsp;&nbsp;
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
                    Save
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="minHeight card shadow border-0 mb-2 top-header">
          <div className="container p-5">
            <div className="row">
              <div className="row mt-3">
                <div className="col-md-6 col-12 mb-3">
                  <label className="form-label">Centre Name</label>
                  <span className="text-danger">*</span>
                  <select
                    {...formik.getFieldProps("tuitionId")}
                    className={`form-select form-select-sm ${
                      formik.touched.tuitionId && formik.errors.tuitionId
                        ? "is-invalid"
                        : ""
                    }`}
                    aria-label="Default select example"
                    onChange={handleCenterChange}
                  >
                    <option selected disabled></option>
                    {centerData &&
                      centerData.map((center) => (
                        <option key={center.id} value={center.id}>
                          {center.centerNames}
                        </option>
                      ))}
                  </select>
                  {formik.touched.tuitionId && formik.errors.tuitionId && (
                    <div className="invalid-feedback">
                      {formik.errors.tuitionId}
                    </div>
                  )}
                </div>
                <div className="col-md-6 col-12 mb-3">
                  <label className="form-label">Employee Name</label>
                  <select
                    {...formik.getFieldProps("userNames")}
                    class={`form-select form-select-sm  ${
                      formik.touched.userNames && formik.errors.userNames
                        ? "is-invalid"
                        : ""
                    }`}
                  >
                    <option selected disabled></option>
                    {userNamesData &&
                      userNamesData.map((userName) => (
                        <option key={userName.id} value={userName.id}>
                          {userName.userNames}
                        </option>
                      ))}
                  </select>
                  {formik.touched.userNames && formik.errors.userNames && (
                    <div className="invalid-feedback">
                      {formik.errors.userNames}
                    </div>
                  )}
                </div>
                <div className="col-md-6 col-12 mb-3">
                  <label className="form-label">Deduction Name</label>
                  <span className="text-danger">*</span>
                  <select
                    {...formik.getFieldProps("deductionName")}
                    className={`form-select form-select-sm ${
                      formik.touched.deductionName &&
                      formik.errors.deductionName
                        ? "is-invalid"
                        : ""
                    }`}
                    aria-label="Default select example"
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
                  <label className="form-label">
                    Deduction Month<span className="text-danger">*</span>
                  </label>
                  <input
                    type="month"
                    className={`form-control form-control-sm ${
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
                  <label className="form-label">
                    Deduction Amount<span className="text-danger">*</span>
                  </label>
                  <input
                    type="text"
                    className={`form-control form-control-sm ${
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
                {/* <div className="col-md-6 col-12">
                <div className="text-start mb-3">
                  <label className="form-label">
                    Total Deduction Amount<span className="text-danger">*</span>
                  </label>
                  <input
                    type="text"
                    className={`form-control form-control-sm ${
                      formik.touched.totalDeductionAmount &&
                      formik.errors.totalDeductionAmount
                        ? "is-invalid"
                        : ""
                    }`}
                    {...formik.getFieldProps("totalDeductionAmount")}
                  />
                  {formik.touched.totalDeductionAmount &&
                    formik.errors.totalDeductionAmount && (
                      <div className="invalid-feedback">
                        {formik.errors.totalDeductionAmount}
                      </div>
                    )}
                </div>
              </div> */}
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}

export default DeductionAdd;
