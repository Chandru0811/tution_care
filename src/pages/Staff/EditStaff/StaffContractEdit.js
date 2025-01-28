import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useState,
} from "react";
import { useFormik } from "formik";
import { useNavigate } from "react-router-dom";
import api from "../../../config/URL";
import { toast } from "react-toastify";

import * as Yup from "yup";
import fetchAllCentersWithIds from "../../List/CenterList";

const validationSchema = Yup.object().shape({
  employer: Yup.string().required("*Employer is required"),
  employee: Yup.string().required("*Employee is required"),
  uen: Yup.string().required("*UEN is required"),
  addressOfEmployment: Yup.string().required("*Address is required"),
  nric: Yup.string().required("*NRIC is required"),
  userContractAddress: Yup.string().required("*Address is required"),
  jobTitle: Yup.string().required("*Job Title is required"),
  mainDuties: Yup.string().required("*Main Duties is required"),
  startDateOfEmployment: Yup.string().required(
    "*StartDate Of Employment is required"
  ),
  training: Yup.string().required("*Training is required"),
  userContractStartDate: Yup.string().required(
    "*Start Date Of Contract is required"
  ),
  contactPeriod: Yup.string().required("*Contract Period is required"),
  workingDays: Yup.array()
    .min(1, "*Working days are required")
    .required("*Working days are required"),
  userContractSalary: Yup.number()
    .typeError("*Salary Must be numbers")
    .required("*Salary is required"),
  salaryStartDate: Yup.string().required("*Start Date Of Salary is required"),
  userContractEndDate: Yup.string()
    .required("*End Date Of Contract is required")
    .test(
      "is-greater",
      "*End Date should be later than the Start Date",
      function (value) {
        const { userContractStartDate } = this.parent;
        return (
          !userContractStartDate ||
          new Date(value) >= new Date(userContractStartDate)
        );
      }
    ),
  contractDate: Yup.string().required("*Contract Date is required"),
  terminationNotice: Yup.string().required("*Termination Notice is required"),
  allowance: Yup.number().typeError("*Allowance Must be numbers").notRequired(),
});

const StaffContractEdit = forwardRef(
  ({ formData, setLoadIndicators, setFormData }, ref) => {
    const navigate = useNavigate();
    const userName = localStorage.getItem("userName");
    const [centerData, setCenterData] = useState(null);
    const [employerData, setEmployerData] = useState(null);
    const [datas, setDatas] = useState();
    const [workingDays, setWorkingDays] = useState();

    console.log("workingDays:",workingDays);
    

    const formik = useFormik({
      initialValues: {
        employer: formData.employer || "",
        employee: formData.teacherName || "",
        uen: formData.uen || "",
        addressOfEmployment: formData.addressOfEmployment || "",
        detailsEmployee: formData.detailsEmployee || "",
        nric: formData.nric || "",
        userContractAddress: formData.address || "",
        jobTitle: formData.jobTitle || "",
        mainDuties: formData.mainDuties || "",
        startDateOfEmployment: formData.startDate || "",
        training: formData.training || "",
        allowance: formData.allowance || "",
        userContractStartDate: formData.startDate || "",
        contactPeriod: formData.contactPeriod || "",
        probation: formData.probation || "",
        workingDays: formData.workingDays || "",
        userContractSalary: formData.salary || "",
        salaryStartDate: formData.effectiveDate || "",
        userContractEndDate: formData.endDate || "",
        payNow: formData.payNow || "",
        internetBanking: formData.internetBanking || "",
        contractDate: formData.contractDate || "",
        terminationNotice: formData.terminationNotice || "",
        updatedBy: userName,
      },
      validationSchema: validationSchema,
      onSubmit: async (values) => {
        setLoadIndicators(true);
        values.updatedBy = userName;
        // console.log("Api Data:", values);
        try {
          if (values.contractId !== null) {
            const response = await api.put(
              `/updateUserContractCreation/${values.contractId}`,
              values,
              {
                headers: {
                  "Content-Type": "application/json",
                },
              }
            );
            if (response.status === 200) {
              toast.success("Staff Contract Updated Successfully");
              setFormData((prv) => ({ ...prv, ...values }));
              navigate("/staff");
            } else {
              toast.error(response.data.message);
            }
          } else {
            const response = await api.post(
              `/createUserContractCreation/${formData.staff_id}`,
              values,
              {
                headers: {
                  "Content-Type": "application/json",
                },
              }
            );
            if (response.status === 201) {
              toast.success(response.data.message);
              setFormData((prv) => ({ ...prv, ...values }));
              navigate("/staff");
            } else {
              toast.error(response.data.message);
            }
          }
        } catch (error) {
          toast.error(error);
        } finally {
          setLoadIndicators(false);
        }
      },
      validateOnChange: false, // Enable validation on change
      validateOnBlur: true, // Enable validation on blur
    });

    // Function to scroll to the first error field
    const scrollToError = (errors) => {
      const errorField = Object.keys(errors)[0]; // Get the first error field
      const errorElement = document.querySelector(`[name="${errorField}"]`); // Find the DOM element
      if (errorElement) {
        errorElement.scrollIntoView({ behavior: "smooth", block: "center" });
        errorElement.focus(); // Set focus to the error element
      }
    };

    // Watch for form submit and validation errors
    useEffect(() => {
      if (formik.submitCount > 0 && Object.keys(formik.errors).length > 0) {
        scrollToError(formik.errors);
      }
    }, [formik.submitCount, formik.errors]);

    const fetchData = async () => {
      try {
        const centerData = await fetchAllCentersWithIds();
        setCenterData(centerData);
      } catch (error) {
        toast.error(error);
      }
    };
    // const filteredCenters = centerData?.filter((center) =>
    //   formData.centerIds.includes(center.id)
    // );
    const getData1 = async (id) => {
      try {
        const response = await api.get(`/getAllCenterById/${id}`);
        formik.setFieldValue("uen", response.data.uenNumber);
        formik.setFieldValue("addressOfEmployment", response.data.address);
        // console.log("response", response.data);
      } catch (error) {
        console.error("Error Fetching Data", error);
      }
    };

    const calculateContractPeriod = (startDate, endDate) => {
      if (startDate && endDate && endDate >= startDate) {
        let start = new Date(startDate);
        let end = new Date(endDate);

        let years = end.getFullYear() - start.getFullYear();
        let months = end.getMonth() - start.getMonth();
        let days = end.getDate() - start.getDate();

        // Adjust the days and months if necessary
        if (days < 0) {
          months -= 1;
          days += new Date(
            start.getFullYear(),
            start.getMonth() + 1,
            0
          ).getDate(); // days in the previous month
        }

        if (months < 0) {
          years -= 1;
          months += 12;
        }

        const contractPeriod = `${years} years, ${months} months, ${days} days`;
        formik.setFieldValue("contactPeriod", contractPeriod);
      } else {
        // If the end date is before the start date or not provided, set the contract period to an empty string or handle it accordingly
        formik.setFieldValue("contactPeriod", "");
      }
    };

    useEffect(() => {
      const getData = async () => {
        try {
          const response = await api.get(
            `/getAllUserById/${formData.staff_id}`
          );
          const employerData = response.data.userAccountInfo[0].centers;
          setEmployerData(employerData);
          console.log("employerData", employerData);
          setWorkingDays(response.data.userAccountInfo[0].workingDays);
          if (
            response.data.userContractCreationModels &&
            response.data.userContractCreationModels.length > 0
          ) {
            setDatas(response.data.userContractCreationModels[0]);

            const contractData = response.data.userContractCreationModels[0];
            formik.setValues({
              ...contractData,
              employee: formData.teacherName || response.data.teacherName || "",
              userContractAddress:
                formData.address ||
                response.data.userContactInfo[0].address ||
                "",
              startDateOfEmployment:
                formData.startDate ||
                response.data.userAccountInfo[0].startDate ||
                "",
              userContractStartDate:
                formData.startDate ||
                response.data.userAccountInfo[0].startDate ||
                "",
              workingDays:
                formData.workingDays ||
                response.data.userAccountInfo[0].workingDays ||
                "",
              userContractSalary:
                formData.salary ||
                response.data.userSalaryCreationModels[0].salary ||
                "",
              contractDate:
                formData.contractDate ||
                response.data.userAccountInfo[0].startDate ||
                "",

              contractId: contractData.id,
              startDateOfEmployment: contractData.startDateOfEmployment
                ? contractData.startDateOfEmployment.substring(0, 10)
                : "",
              userContractStartDate: contractData.userContractStartDate
                ? contractData.userContractStartDate.substring(0, 10)
                : "",
              userContractEndDate: contractData.userContractEndDate
                ? contractData.userContractEndDate.substring(0, 10)
                : "",
              contractDate: contractData.contractDate
                ? contractData.contractDate.substring(0, 10)
                : "",
              salaryStartDate: contractData.salaryStartDate
                ? contractData.salaryStartDate.substring(0, 10)
                : "",
            });
          } else {
            formik.setValues({
              contractId: null,
              employer: formData.employer || "",
              uen: formData.uen || "",
              employee: formData.teacherName || response.data.teacherName || "",
              addressOfEmployment: formData.addressOfEmployment || "",
              detailsEmployee: formData.detailsEmployee || "",
              nric: formData.nric || "",
              userContractAddress:
                formData.address ||
                response.data.userContactInfo[0].address ||
                "",
              jobTitle: formData.jobTitle || "",
              mainDuties: formData.mainDuties || "",
              startDateOfEmployment:
                formData.startDate ||
                response.data.userAccountInfo[0].startDate ||
                "",
              training: formData.training || "",
              allowance: formData.allowance || "",
              userContractStartDate:
                formData.startDate ||
                response.data.userAccountInfo[0].startDate ||
                "",
              contactPeriod: formData.contactPeriod || "",
              probation: formData.probation || "",
              workingDays:
                formData.workingDays ||
                response.data.userAccountInfo[0].workingDays ||
                "",
              userContractSalary:
                formData.salary ||
                response.data.userSalaryCreationModels[0].salary ||
                "",
              salaryStartDate: formData.effectiveDate || "",
              userContractEndDate: formData.endDate || "",
              payNow: formData.payNow || "",
              internetBanking: formData.internetBanking || "",
              contractDate:
                formData.contractDate ||
                response.data.userAccountInfo[0].startDate ||
                "",
              terminationNotice: formData.terminationNotice || "",
            });
            console.log("Contract ID:", formik.values.contractId);
          }
        } catch (error) {
          console.error("Error Fetching Data");
        }
      };
      console.log(formik.values);
      getData();
      fetchData();
      window.scrollTo({ top: 0, left: 0, behavior: "instant" });
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
      // Set the contractDate to match the userContractStartDate initially
      if (formik.values.userContractStartDate) {
        formik.setFieldValue(
          "contractDate",
          formik.values.userContractStartDate
        );
      }
    }, [formik.values.userContractStartDate]);

    useImperativeHandle(ref, () => ({
      staffContractEdit: formik.handleSubmit,
    }));

    return (
      <form
        onSubmit={formik.handleSubmit}
        onKeyDown={(e) => {
          if (e.key === "Enter" && !formik.isSubmitting) {
            e.preventDefault(); // Prevent default form submission
          }
        }}
      >
        <div className="container-fluid">
          <p className="headColor my-4">Contract Information</p>
          <div className="container-fluid mt-5" style={{ minHeight: "95vh" }}>
            <span className="mt-3 fw-bold">Details of EMPLOYER</span>
            <div class="row mt-4">
              <div class="col-md-6 col-12 mb-2 mt-3">
                <label>Employer</label>
                <span className="text-danger">*</span>
                <select
                  type="text"
                  className="form-select"
                  name="employer"
                  onChange={(e) => {
                    const selectedId = e.target.value;
                    formik.setFieldValue("employer", selectedId);
                    getData1(selectedId);
                  }}
                  onBlur={formik.handleBlur}
                  value={formik.values.employer}
                >
                  <option selected></option>
                  {employerData?.map((center) => (
                    <option key={center.id} value={center.id}>
                      {center.centerName}
                    </option>
                  ))}
                </select>
                {formik.touched.employer && formik.errors.employer && (
                  <div className="error text-danger ">
                    <small>{formik.errors.employer}</small>
                  </div>
                )}
              </div>
              <div class="col-md-6 col-12 mb-2 mt-3">
                <label>UEN</label>
                <span className="text-danger">*</span>
                <input
                  type="text"
                  className="form-control"
                  name="uen"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.uen}
                  readOnly
                />
                {formik.touched.uen && formik.errors.uen && (
                  <div className="error text-danger ">
                    <small>{formik.errors.uen}</small>
                  </div>
                )}
              </div>
            </div>
            <div class="col-md-6 col-12 mb-2 mt-3">
              <label>Address of Employment</label>
              <span className="text-danger">*</span>
              <input
                type="text"
                className="form-control"
                name="addressOfEmployment"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.addressOfEmployment}
                readOnly={datas?.addressOfEmployment}
              />
              {formik.touched.addressOfEmployment &&
                formik.errors.addressOfEmployment && (
                  <div className="error text-danger ">
                    <small>{formik.errors.addressOfEmployment}</small>
                  </div>
                )}
            </div>
            <div class="row mt-3 ">
              <span className="mt-3 fw-bold ">Details of EMPLOYEE</span>
              <div class="col-md-6 col-12 mb-2 mt-3">
                <label>Employee</label>
                <span className="text-danger">*</span>
                <input
                  type="text"
                  className="form-control"
                  name="employee"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.employee}
                  readOnly
                />
                {formik.touched.employee && formik.errors.employee && (
                  <div className="error text-danger ">
                    <small>{formik.errors.employee}</small>
                  </div>
                )}
              </div>
              <div class="col-md-6 col-12 mb-2 mt-3">
                <label>NRIC</label>
                <span className="text-danger">*</span>
                <input
                  type="text"
                  className="form-control"
                  name="nric"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.nric}
                />
                {formik.touched.nric && formik.errors.nric && (
                  <div className="error text-danger ">
                    <small>{formik.errors.nric}</small>
                  </div>
                )}
              </div>
              <div class="col-md-6 col-12 mb-2 mt-3">
                <label>Address</label>
                <span className="text-danger">*</span>
                <input
                  type="text"
                  className="form-control"
                  name="userContractAddress"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.userContractAddress}
                  readOnly
                />
                {formik.touched.userContractAddress &&
                  formik.errors.userContractAddress && (
                    <div className="error text-danger ">
                      <small>{formik.errors.userContractAddress}</small>
                    </div>
                  )}
              </div>
              <div class="col-md-6 col-12 mb-2 mt-3">
                <label>Job Title</label>
                <span className="text-danger">*</span>
                <input
                  type="text"
                  className="form-control"
                  name="jobTitle"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.jobTitle}
                />
                {formik.touched.jobTitle && formik.errors.jobTitle && (
                  <div className="error text-danger ">
                    <small>{formik.errors.jobTitle}</small>
                  </div>
                )}
              </div>
              <div class="col-md-6 col-12 mb-2 mt-3">
                <label>Main Duties</label>
                <span className="text-danger">*</span>
                <input
                  type="text"
                  className="form-control"
                  name="mainDuties"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.mainDuties}
                />
                {formik.touched.mainDuties && formik.errors.mainDuties && (
                  <div className="error text-danger ">
                    <small>{formik.errors.mainDuties}</small>
                  </div>
                )}
              </div>
              <div className="col-md-6 col-12 mb-2 mt-3">
                <label>Start Date of Employment</label>
                <span className="text-danger">*</span>
                <input
                  type="date"
                  // onFocus={(e) => e.target.showPicker()}
                  className="form-control"
                  name="startDateOfEmployment"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.startDateOfEmployment}
                  min={new Date().toISOString().split("T")[0]}
                  readOnly
                />
                {formik.touched.startDateOfEmployment &&
                  formik.errors.startDateOfEmployment && (
                    <div className="error text-danger">
                      <small>{formik.errors.startDateOfEmployment}</small>
                    </div>
                  )}
              </div>
              <div class="col-md-6 col-12 mb-2 mt-3">
                <label>Training</label>
                <span className="text-danger">*</span>
                <input
                  type="text"
                  className="form-control"
                  name="training"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.training}
                />
                {formik.touched.training && formik.errors.training && (
                  <div className="error text-danger ">
                    <small>{formik.errors.training}</small>
                  </div>
                )}
              </div>
              <div class="col-md-6 col-12 mb-2 mt-3">
                <label>Allowance</label>
                <input
                  type="text"
                  className="form-control"
                  name="allowance"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.allowance}
                />
                {formik.touched.allowance && formik.errors.allowance && (
                  <div className="error text-danger ">
                    <small>{formik.errors.allowance}</small>
                  </div>
                )}
              </div>
              <div className="col-md-6 col-12 mb-2 mt-3">
                <label>Contract Start Date</label>
                <span className="text-danger">*</span>
                <input
                  type="date"
                  // onFocus={(e) => e.target.showPicker()}
                  className="form-control"
                  name="userContractStartDate"
                  onChange={(e) => {
                    formik.handleChange(e);

                    const startDate = e.target.value;
                    formik.setFieldValue("contractDate", startDate); // Automatically set Contract Date

                    // Recalculate contract period if end date is already selected
                    if (formik.values.userContractEndDate) {
                      const endDate = new Date(
                        formik.values.userContractEndDate
                      );
                      calculateContractPeriod(new Date(startDate), endDate);
                    }
                  }}
                  onBlur={formik.handleBlur}
                  value={formik.values.userContractStartDate}
                  readOnly
                />
                {formik.touched.userContractStartDate &&
                  formik.errors.userContractStartDate && (
                    <div className="error text-danger">
                      <small>{formik.errors.userContractStartDate}</small>
                    </div>
                  )}
              </div>
              <div className="col-md-6 col-12 mb-2 mt-3">
                <label>Contract End Date</label>
                <span className="text-danger">*</span>
                <input
                  type="date"
                  // onFocus={(e) => e.target.showPicker()}
                  className="form-control"
                  name="userContractEndDate"
                  onChange={(e) => {
                    formik.handleChange(e);
                    const startDate = new Date(
                      formik.values.userContractStartDate
                    );
                    const endDate = new Date(e.target.value);
                    calculateContractPeriod(startDate, endDate);
                  }}
                  onBlur={formik.handleBlur}
                  value={formik.values.userContractEndDate}
                />
                {formik.touched.userContractEndDate &&
                  formik.errors.userContractEndDate && (
                    <div className="error text-danger">
                      <small>{formik.errors.userContractEndDate}</small>
                    </div>
                  )}
              </div>
              <div className="col-md-6 col-12 mb-2 mt-3">
                <label>Contract Period</label>
                <span className="text-danger">*</span>
                <input
                  type="text"
                  className="form-control"
                  name="contactPeriod"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.contactPeriod}
                  readOnly
                />
                {formik.touched.contactPeriod &&
                  formik.errors.contactPeriod && (
                    <div className="error text-danger">
                      <small>{formik.errors.contactPeriod}</small>
                    </div>
                  )}
              </div>
              <div class="col-md-6 col-12 mb-2 mt-3">
                <label>Probation (Day)</label>
                <input
                  type="text"
                  className="form-control"
                  name="probation"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.probation}
                />
              </div>
              <div className="col-md-6 col-12 mb-2 mt-3">
                <label>
                  Working Days<span className="text-danger">*</span>
                </label>
                <div className="mt-2 d-flex justify-content-between mt-3">
                  {[
                    "MONDAY",
                    "TUESDAY",
                    "WEDNESDAY",
                    "THURSDAY",
                    "FRIDAY",
                    "SATURDAY",
                    "SUNDAY",
                  ].map((day, index) => (
                    <div className="checkbox-container" key={day}>
                      <input
                        type="checkbox"
                        className="form-check-input"
                        id={`myCheckbox${index + 1}`}
                        value={day}
                        name="workingDays"
                        checked={
                          formik.values.workingDays &&
                          formik.values.workingDays.includes(day)
                        }
                        onChange={(e) => {
                          formik.handleChange(e);
                        }}
                        onBlur={formik.handleBlur}
                        disabled={workingDays && workingDays.length > 0}
                      />
                      <label
                        htmlFor={`myCheckbox${index + 1}`}
                        className="custom-checkbox"
                      >
                        <div className="inner-square"></div>
                      </label>
                      <label
                        htmlFor={`myCheckbox${index + 1}`}
                        className="mx-1"
                      >
                        {day.slice(0, 3)}
                      </label>
                    </div>
                  ))}
                </div>
                {formik.touched.workingDays && formik.errors.workingDays && (
                  <div className="error text-danger">
                    <small>{formik.errors.workingDays}</small>
                  </div>
                )}
              </div>

              <div class="col-md-6 col-12 mb-2 mt-3">
                <label>Salary</label>
                <span className="text-danger">*</span>
                <input
                  type="text"
                  className="form-control"
                  name="userContractSalary"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.userContractSalary}
                  readOnly
                />
                {formik.touched.userContractSalary &&
                  formik.errors.userContractSalary && (
                    <div className="error text-danger ">
                      <small>{formik.errors.userContractSalary}</small>
                    </div>
                  )}
              </div>
              <div class="col-md-6 col-12 mb-2 mt-3">
                <label>Salary Start Date</label>
                <span className="text-danger">*</span>
                <input
                  type="date"
                  // onFocus={(e) => e.target.showPicker()}
                  className="form-control"
                  name="salaryStartDate"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.salaryStartDate}
                  min={new Date().toISOString().split("T")[0]}
                />
                {formik.touched.salaryStartDate &&
                  formik.errors.salaryStartDate && (
                    <div className="error text-danger ">
                      <small>{formik.errors.salaryStartDate}</small>
                    </div>
                  )}
              </div>

              <div class="row mt-3">
                <span className="mt-3 fw-bold">Bank Account Details</span>
                <div class="col-md-6 col-12 mb-2 mt-3">
                  <label>Pay Now</label>
                  <input
                    type="text"
                    className="form-control"
                    name="payNow"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.payNow}
                  />
                </div>
                <div class="col-md-6 col-12 mb-2 mt-3">
                  <label>Internet Banking</label>
                  <input
                    type="text"
                    className="form-control"
                    name="internetBanking"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.internetBanking}
                  />
                </div>
                <div class="col-md-6 col-12 mb-2 mt-3">
                  <label>Contract Date</label>
                  <span className="text-danger">*</span>
                  <input
                    type="date"
                    // onFocus={(e) => e.target.showPicker()}
                    className="form-control"
                    name="contractDate"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.contractDate}
                    readOnly
                  />
                  {formik.touched.contractDate &&
                    formik.errors.contractDate && (
                      <div className="error text-danger ">
                        <small>{formik.errors.contractDate}</small>
                      </div>
                    )}
                </div>
                <div class="col-md-6 col-12 mb-2 mt-3">
                  <label>Termination Notice (Month)</label>
                  <span className="text-danger">*</span>
                  <input
                    type="text"
                    className="form-control"
                    name="terminationNotice"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.terminationNotice}
                  />
                  {formik.touched.terminationNotice &&
                    formik.errors.terminationNotice && (
                      <div className="error text-danger ">
                        <small>{formik.errors.terminationNotice}</small>
                      </div>
                    )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </form>
    );
  }
);

export default StaffContractEdit;
