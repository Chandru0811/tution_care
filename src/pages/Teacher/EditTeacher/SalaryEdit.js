import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useState,
} from "react";
import { useFormik } from "formik";
import api from "../../../config/URL";
import { toast } from "react-toastify";

import * as Yup from "yup";
import fetchAllSalaryTypeWithIds from "../../List/SalaryTypeList";

const validationSchema = Yup.object().shape({
  salary: Yup.number()
    .typeError("*Salary must be a number")
    .positive("*Salary must be a positive number")
    .required("*Salary is required")
});

const SalaryEdit = forwardRef(
  ({ formData, setLoadIndicators, setFormData, handleNext }, ref) => {
    const userName = localStorage.getItem("tmsuserName");
    const centerId = localStorage.getItem("tmscenterId");
    const [id, setId] = useState();
    const [salaryTypeData, setSalaryTypeData] = useState(null);
    const fetchData = async () => {
      try {
        const salarytype = await fetchAllSalaryTypeWithIds(centerId);
        setSalaryTypeData(salarytype);
      } catch (error) {
        toast.error(error);
      }
    };

    useEffect(() => {
      fetchData();
    }, []);
    console.log("first", id);

    const formik = useFormik({
      initialValues: {
        salary: "",
        effectiveDate: "",
        salaryTypeId: "",
        updatedBy: userName,
      },
      validationSchema: validationSchema,
      onSubmit: async (values) => {
        setLoadIndicators(true);
        values.updatedBy = userName;
        values.centerId = centerId;
        console.log("Api Data:", values);
        try {
          if (id) {
            const response = await api.put(
              `/updateUserSalaryCreation/${id}`,
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
              `/createUserSalaryCreation/${formData.staff_id}`,
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
    });

    useEffect(() => {
      const getData = async () => {
        try {
          const response = await api.get(
            `/getAllUserById/${formData.staff_id}`
          );
          console.log("ofirst", response);
          if (
            response.data.userSalaryCreationModels &&
            response.data.userSalaryCreationModels.length > 0
          ) {
            console.log("cc", response.data.userSalaryCreationModels[0].id);
            setId(response.data.userSalaryCreationModels[0].id);
            formik.setValues({
              ...response.data.userSalaryCreationModels[0],
              salaryInfoId: response.data.userSalaryCreationModels[0].id,
              effectiveDate:
                response.data.userSalaryCreationModels[0].effectiveDate.substring(
                  0,
                  10
                ),
            });
          } else {
            formik.setValues({
              salaryInfoId: null,
              salary: "",
              effectiveDate: "",
              salaryTypeId: "",
            });
            // console.log("Salary ID:", formik.values.salaryId);
          }
        } catch (error) {
          console.error("Error fetching data:", error);
        }
      };
      // console.log(formik.values);
      getData();
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [formData]);

    useImperativeHandle(ref, () => ({
      salaryEdit: formik.handleSubmit,
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
            <p className="headColor my-4">Salary Information</p>
            <div class="row">
              <div class="col-md-6 col-12 mb-2 mt-3">
                <label>Salary</label>
                <span className="text-danger">*</span>
                <input
                  type="text"
                  className="form-control"
                  name="salary"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.salary}
                />
                {formik.touched.salary && formik.errors.salary && (
                  <div className="error text-danger ">
                    <small>{formik.errors.salary}</small>
                  </div>
                )}
              </div>
              <div class="col-md-6 col-12 mb-2 mt-3">
                <label>Effective Date</label>
                <input
                  type="date"
                  // onFocus={(e) => e.target.showPicker()}
                  className="form-control"
                  name="effectiveDate"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.effectiveDate}
                />
              </div>
              <div class="col-md-6 col-12 mb-2 mt-3">
                <label>Salary Type</label>
                <select
                  type="text"
                  className="form-select"
                  name="salaryTypeId"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.salaryTypeId}
                >
                  <option value=""></option>
                  {salaryTypeData &&
                    salaryTypeData.map((salaryId) => (
                      <option key={salaryId.id} value={salaryId.id}>
                        {salaryId.salaryType}
                      </option>
                    ))}
                </select>
              </div>
            </div>
          </div>
        </section>
      </form>
    );
  }
);
export default SalaryEdit;
