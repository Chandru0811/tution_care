import React, { forwardRef, useEffect, useImperativeHandle } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import api from "../../../config/URL";
import { toast } from "react-toastify";

const validationSchema = Yup.object().shape({
  year: Yup.number()
    .min(1990, "*Year is required")
    .max(2050, "*Year is required")
    .required("*Year is required"),

  annualLeave: Yup.string()
    .matches(/^[0-9]+$/, "*Annual Leave Must be numbers")
    .required("*Annual Leave is required"),
  medicalLeave: Yup.string()
    .matches(/^[0-9]+$/, "*Medical Leave Must be numbers")
    .required("*Medical Leave is required"),
  otherLeave: Yup.string()
    .matches(/^[0-9]+$/, "*Other Leave Must be numbers")
    .required("*Other Leave is required"),
  carryForwardLeave: Yup.string()
    .matches(/^[0-9]+$/, "*Carry Forward Leave Must be numbers")
    .required("*Carry Forward Leave is required"),
});
const LeaveEdit = forwardRef(
  ({ formData, setLoadIndicators, setFormData, handleNext }, ref) => {
    const userName = localStorage.getItem("tmsuserName");
    const centerId = localStorage.getItem("tmscenterId");

    const formik = useFormik({
      initialValues: {
        year: "",
        annualLeave: "",
        medicalLeave: "",
        otherLeave: "",
        carryForwardLeave: "",
        updatedBy: userName,
      },
      validationSchema: validationSchema,

      onSubmit: async (values) => {
        setLoadIndicators(true);
        values.updatedBy = userName;
        values.centerId = centerId;
        // console.log("Api Data:", values);
        try {
          if (values.leaveId !== null) {
            const response = await api.put(
              `/updateUserLeaveCreation/${values.leaveId}`,
              values,
              {
                headers: {
                  "Content-Type": "application/json",
                },
              }
            );
            if (response.status === 200) {
              toast.success(response.data.message);
              setFormData((prv) => ({ ...prv, ...values }));
              handleNext();
            } else {
              toast.error(response.data.message);
            }
          } else {
            const response = await api.post(
              `/createUserLeaveCreation/${formData.staff_id}`,
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
              handleNext();
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

    useEffect(() => {
      const getData = async () => {
        try {
          const response = await api.get(
            `/getAllUserById/${formData.staff_id}`
          );
          if (
            response.data.userLeaveCreationModels &&
            response.data.userLeaveCreationModels.length > 0
          ) {
            formik.setValues({
              ...response.data.userLeaveCreationModels[0],
              leaveId: response.data.userLeaveCreationModels[0].id,
              year: response.data.userLeaveCreationModels[0].year.substring(
                0,
                10
              ),
            });
          } else {
            formik.setValues({
              leaveId: null,
              year: "",
              annualLeave: "",
              medicalLeave: "",
              otherLeave: "",
              carryForwardLeave: "",
            });
            // console.log("Leave ID:", formik.values.leaveId);
          }
        } catch (error) {
          console.error("Error fetching data:", error);
        }
      };
      // console.log(formik.values);
      getData();
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useImperativeHandle(ref, () => ({
      leaveEdit: formik.handleSubmit,
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
        <section>
          <div className="container-fluid" style={{ minHeight: "50vh" }}>
            <p className="headColor my-4">Leave Information</p>
            <div class="row">
              <div class="col-md-6 col-12 mb-2">
                <label>
                  Year<span class="text-danger">*</span>
                </label>
                <input
                  type="number"
                  className="form-control mt-3"
                  name="year"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.year}
                  // max={new Date().getFullYear()}
                  step="1"
                  placeholder="YYYY"
                />
                {formik.touched.year && formik.errors.year && (
                  <div className="error text-danger ">
                    <small>{formik.errors.year}</small>
                  </div>
                )}
              </div>
              <div class="col-md-6 col-12 mb-2">
                <label>
                  Annual Leave<span class="text-danger">*</span>
                </label>
                <input
                  type="text"
                  class="form-control    mt-3"
                  name="annualLeave"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.annualLeave}
                />
                {formik.touched.annualLeave && formik.errors.annualLeave && (
                  <div className="error text-danger ">
                    <small>{formik.errors.annualLeave}</small>
                  </div>
                )}
              </div>
              <div class="col-md-6 col-12 mb-2 mt-3 ">
                <label>
                  Medical Leave<span class="text-danger">*</span>
                </label>
                <input
                  type="text"
                  class="form-control    mt-3 "
                  name="medicalLeave"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.medicalLeave}
                />
                {formik.touched.medicalLeave && formik.errors.medicalLeave && (
                  <div className="error text-danger ">
                    <small>{formik.errors.medicalLeave}</small>
                  </div>
                )}
              </div>
              <div class="col-md-6 col-12 mb-2 mt-3">
                <label>
                  Other Leave<span class="text-danger">*</span>
                </label>
                <input
                  type="text"
                  class="form-control    mt-3"
                  name="otherLeave"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.otherLeave}
                />
                {formik.touched.otherLeave && formik.errors.otherLeave && (
                  <div className="error text-danger ">
                    <small>{formik.errors.otherLeave}</small>
                  </div>
                )}
              </div>
              <div class="col-md-6 col-12 mb-2 mt-3">
                <label>
                  Carry Forward Leave<span class="text-danger">*</span>
                </label>
                <input
                  type="text"
                  class="form-control    mt-3"
                  name="carryForwardLeave"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.carryForwardLeave}
                />
                {formik.touched.carryForwardLeave &&
                  formik.errors.carryForwardLeave && (
                    <div className="error text-danger ">
                      <small>{formik.errors.carryForwardLeave}</small>
                    </div>
                  )}
              </div>
            </div>
          </div>
        </section>
      </form>
    );
  }
);

export default LeaveEdit;
