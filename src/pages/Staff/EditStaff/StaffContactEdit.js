import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
} from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import api from "../../../config/URL";
import { toast } from "react-toastify";

const validationSchema = Yup.object().shape({
  // email: Yup.string()
  //   .email('Invalid email format')
  //   // .matches(/^[a-zA-Z0-9._%+-]+@gmail\.com$/, 'Invalid Email')
  //   .required('Email is required'),
  contactNumber: Yup.string()
    .matches(
      /^(?:\+?65)?\s?(?:\d{4}\s?\d{4}|\d{3}\s?\d{3}\s?\d{4})$/,
      "*Invalid Phone Number"
    )
    .required("*Contact Number is required"),
  address: Yup.string().required("*Address is required"),
  postalCode: Yup.string()
    .matches(/^[0-9]+$/, "*Postal Code Must be numbers")
    .required("*Postal Code is required"),
});

const StaffContactEdit = forwardRef(
  ({ formData, setLoadIndicators, setFormData, handleNext }, ref) => {
    console.log("form", formData);
    const userName = localStorage.getItem("tmsuserName");
    const centerId = localStorage.getItem("tmscenterId");

    const formik = useFormik({
      initialValues: {
        // email: "",
        contactNumber: "",
        address: "",
        postalCode: "",
        updatedBy: userName,
        centerId: centerId,
      },
      validationSchema: validationSchema,
      onSubmit: async (values) => {
        setLoadIndicators(true);
        values.updatedBy = userName;
        values.centerId = centerId;
        // console.log("Api Data:", values);
        try {
          if (values.contactId !== null) {
            const response = await api.put(
              `/updateUserContactInfo/${values.contactId}`,
              values,
              {
                headers: {
                  "Content-Type": "application/json",
                },
              }
            );
            if (response.status === 200 || response.status === 201) {
              toast.success(response.data.message);
              setFormData((prv) => ({ ...prv, ...values }));
              handleNext();
            } else {
              toast.error(response.data.message);
            }
          } else {
            const response = await api.post(
              `/createUserContactInfoWithCenterId/${formData.staff_id}`,
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
          }
        } catch (error) {
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

    useEffect(() => {
      const getData = async () => {
        try {
          const response = await api.get(
            `/getAllUserById/${formData.staff_id}`
          );
          if (
            response.data.userContactInfo &&
            response.data.userContactInfo.length > 0
          ) {
            formik.setValues({
              ...response.data.userContactInfo[0],
              contactId: response.data.userContactInfo[0].id,
            });
          } else {
            formik.setValues({
              contactId: null,
              // email: "",
              contactNumber: "",
              address: "",
              postalCode: "",
            });
            // console.log("Contact ID:", formik.values.contactId);
          }
        } catch (error) {
          toast.error("Error Fetching Data");
        }
      };

      // console.log(formik.values);
      getData();
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useImperativeHandle(ref, () => ({
      staffContactEdit: formik.handleSubmit,
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
                  readOnly={datas?.email}                
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

export default StaffContactEdit;
