import React, { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { IoEyeOutline, IoEyeOffOutline } from "react-icons/io5";
import { toast } from "react-toastify";
import api from "../../config/URL";
import { Link, useNavigate } from "react-router-dom";
import Logo from "../../assets/images/TMS_LOGO.png";

export default function NewLogin({ onLogin }) {
  const [loadIndicator, setLoadIndicator] = useState(false);
  const navigate = useNavigate();

  const validationSchema = Yup.object({
    email: Yup.string()
      .email("*Invalid email address")
      .required("*Email is required"),
    password: Yup.string()
      .matches(/^\S*$/, "*Password must not contain spaces.")
      .required("*Enter the valid Password"),
  });

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: validationSchema,
    onSubmit: async (values, { resetForm }) => {
      setLoadIndicator(true);
      try {
        const response = await api.post(`smsLogin`, values, {
          headers: {
            "Content-Type": "application/json",
          },
        });
        if (response.status === 200) {
          const { role } = response.data;
          if (role === "SMS_PARENT") {
            toast.warning(
              "You don't have access to the website. Please log in using Artylearning mobile app."
            );
          } else {
            toast.success(response.data.message);
            localStorage.setItem("tmscenterId", response.data.centerId);
            localStorage.setItem("tmsroleId", response.data.roleId);
            localStorage.setItem("tmsrole", response.data.role);
            localStorage.setItem("tmstoken", response.data.accessToken);
            localStorage.setItem("tmsuserId", response.data.userId);
            localStorage.setItem("tmscenterName", response.data.centerName);
            localStorage.setItem("tmsemail", values.email);
            onLogin(response.data.roleId);
            navigate("/dashboard");
          }
        } else {
          toast.error(response.data.message);
        }
      } catch (error) {
        if (error?.response?.status === 409) {
          toast.warning("Wrong username or password!");
        } else {
          toast.error(error?.response?.data?.message);
        }
      } finally {
        setLoadIndicator(false);
        resetForm();
      }
    },
  });

  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <section>
      <div className="container-fluid p-0">
        <div className="row m-0" style={{ minHeight: "100vh" }}>
          <div className="col-md-6 col-12 left-section">
            <img src={Logo} alt="Logo" className="ecs-logo" style={{borderRadius:"50%"}} />
            <h1 className="ecs-text">ECS Schools</h1>
          </div>

          <div className="col-md-6 col-12 d-flex flex-column justify-content-center align-items-center form-section">
            <div
              className="card shadow p-4"
              style={{
                width: "100%",
                maxWidth: "400px",
                borderRadius: "15px",
              }}
            >
              <div className="card-body">
                <h3 className="card-title text-center mb-4">Login</h3>
                <form
                  onSubmit={formik.handleSubmit}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !formik.isSubmitting) {
                      e.preventDefault();
                    }
                  }}
                >
                  <div className="mb-3">
                    <label className="form-label fw-semibold">
                      Email address
                    </label>
                    <input
                      type="email"
                      className={`form-control ${
                        formik.touched.email && formik.errors.email
                          ? "is-invalid"
                          : ""
                      }`}
                      placeholder="Enter email"
                      {...formik.getFieldProps("email")}
                    />
                    {formik.touched.email && formik.errors.email && (
                      <div className="invalid-feedback">
                        {formik.errors.email}
                      </div>
                    )}
                  </div>
                  <div className="mb-3">
                    <label className="form-label fw-medium">Password</label>
                    <div className="input-group">
                      <input
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter password"
                        className={`form-control ${
                          formik.touched.password && formik.errors.password
                            ? "is-invalid"
                            : ""
                        }`}
                        {...formik.getFieldProps("password")}
                      />
                      <span
                        className="input-group-text"
                        onClick={togglePasswordVisibility}
                        style={{ cursor: "pointer" }}
                      >
                        {showPassword ? <IoEyeOffOutline /> : <IoEyeOutline />}
                      </span>
                    </div>
                    {formik.touched.password && formik.errors.password && (
                      <div className="invalid-feedback">
                        {formik.errors.password}
                      </div>
                    )}
                  </div>
                  {/* <div className="text-end">
                    <Link
                      to="/password"
                      className="text-muted fw-medium"
                      style={{ textDecoration: "none", fontSize: "14px" }}
                    >
                      Forgot Password?
                    </Link>
                  </div> */}
                  <button
                    type="submit"
                    className="btn btn-danger mt-4 w-100"
                    style={{
                      height: "45px",
                      borderRadius: "8px",
                    }}
                    disabled={loadIndicator}
                  >
                    {loadIndicator && (
                      <span
                        className="spinner-border spinner-border-sm me-2"
                        aria-hidden="true"
                      ></span>
                    )}
                    <span className="fw-medium">Submit</span>
                  </button>
                </form>
                <p className="text-center mt-3">
                  <Link
                    to="/companyRegister"
                    className="text-muted fw-medium"
                    style={{ textDecoration: "none", fontSize: "14px" }}
                  >
                    Company Register
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
