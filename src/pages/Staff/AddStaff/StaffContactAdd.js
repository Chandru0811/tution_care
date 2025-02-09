import React, { forwardRef, useImperativeHandle } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";
import api from "../../../config/URL";

const validationSchema = Yup.object().shape({
  contactNumber: Yup.string()
  .matches(/^\d{8}$/, "*Contact Number must be exactly 8 digits")
  .required("*Mobile Number is required"),
  address: Yup.string().required("*Address is required"),
  postalCode: Yup.string()
  .matches(/^\d{6}$/, "*Postal Code must be exactly 6 digits")
  .required("*Zip Code is required"),
});
const StaffContactAdd = forwardRef(
  ({ formData, setLoadIndicators, setFormData, handleNext }, ref) => {
    const userName = localStorage.getItem("tmsuserName");
    const centerId = localStorage.getItem("tmscenterId");

    const formik = useFormik({
      initialValues: {
        contactNumber: formData.contactNumber,
        address: formData.address,
        postalCode: formData.postalCode,
        centerId: centerId,
        createdBy: userName,
      },
      validationSchema: validationSchema,
      onSubmit: async (values) => {
        setLoadIndicators(true);
        values.createdBy = userName;
        values.centerId = centerId;
        try {
          const response = await api.post(
            `/createUserContactInfo/${formData.user_id}`,
            values,
            {
              headers: {
                "Content-Type": "application/json",
              },
            }
          );
          if (response.status === 201 || response.status === 200) {
            toast.success(response.data.message);
            setFormData((prv) => ({ ...prv, ...values }));
            handleNext();
          } else {
            toast.error(response.data.message);
          }
        } catch (error) {
          // console.log("Suma: ", error);
          if (error?.response?.status === 409) {
            toast.warning(error?.response?.data?.message);
          } else {
            toast.error(
              "Error Submiting data ",
              error?.response?.data?.message
            );
          }
        } finally {
          setLoadIndicators(false);
        }
      },
    });

    useImperativeHandle(ref, () => ({
      staffContactAdd: formik.handleSubmit,
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
          <div className="container-fluid">
            <p className="headColor my-4">Contact Information</p>
            <div class="row">
              {/* <div class="col-md-6 col-12 mb-2 mt-3">
                <label>
                  Email Id<span class="text-danger">*</span>
                </label>
                <input
                  type="email"
                  className="form-control"
                  name="email"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.email}
                />
                {formik.touched.email && formik.errors.email && (
                  <div className="error text-danger ">
                    <small>{formik.errors.email}</small>
                  </div>
                )}
              </div> */}
              <div class="col-md-6 col-12 mb-2 mt-3">
                <label>
                  Contact Number<span class="text-danger">*</span>
                </label>
                <input
                  type="text"
                  className="form-control"
                  name="contactNumber"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.contactNumber}
                  maxLength="8"
                  onKeyPress={(e) => !/[0-9]/.test(e.key) && e.preventDefault()}
                />
                {formik.touched.contactNumber &&
                  formik.errors.contactNumber && (
                    <div className="error text-danger ">
                      <small>{formik.errors.contactNumber}</small>
                    </div>
                  )}
              </div>
              <div class="col-md-6 col-12 mb-2 mt-3">
                <label>
                  Address<span class="text-danger">*</span>
                </label>
                <textarea
                  type="text"
                  className="form-control"
                  name="address"
                  rows="3"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.address}
                />
                {formik.touched.address && formik.errors.address && (
                  <div className="error text-danger ">
                    <small>{formik.errors.address}</small>
                  </div>
                )}
              </div>
              <div class="col-md-6 col-12 mb-2 mt-3">
                <label>
                  Postal Code<span class="text-danger">*</span>
                </label>
                <input
                  type="text"
                  className="form-control"
                  name="postalCode"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.postalCode}
                  maxLength="6"
                  onKeyPress={(e) => !/[0-9]/.test(e.key) && e.preventDefault()}
                />
                {formik.touched.postalCode && formik.errors.postalCode && (
                  <div className="error text-danger ">
                    <small>{formik.errors.postalCode}</small>
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

export default StaffContactAdd;
