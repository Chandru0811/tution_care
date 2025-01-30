import React, { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { IoEyeOutline, IoEyeOffOutline } from "react-icons/io5";
import { toast } from "react-toastify";
import api from "../../config/URL";
import { Link, useNavigate } from "react-router-dom";
import Logo from "../../assets/images/ECSLOGO.png";

export default function CompanyRegister({ onLogin }) {
    const navigate = useNavigate();

    const validationSchema = Yup.object({
        name: Yup.string().required("*Name is required"),
        centerName: Yup.string().required("*Centre Name is required"),
        address: Yup.string().required("*Address is required"),
        mobile: Yup.string()
            .matches(
                /^(?:\+?65)?\s?(?:\d{4}\s?\d{4}|\d{3}\s?\d{3}\s?\d{4})$/,
                "*Invalid Phone Number"
            )
            .required("*Mobile Number is required"),
        email: Yup.string()
            .matches(
                /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                "*Enter a valid email address"
            )
            .required("*Email is required"),
    });

    const formik = useFormik({
        initialValues: {
            name: "",
            centerName: "",
            email: "",
            mobile: "",
            address: "",
        },
        validationSchema: validationSchema,
        onSubmit: async (values, { resetForm }) => {
            try {
                const response = await api.post("/createCenters", values, {
                    headers: {
                        "Content-Type": "application/json",
                    },
                });
                if (response.status === 201) {
                    resetForm();
                    toast.success(response.data.message);
                    navigate("/dashboard");
                } else {
                    toast.error(response.data.message);
                }
            } catch (error) {
                toast.error(error);
            }
        },
    });

    return (
        <section>
            <div className="container-fluid p-0">
                <div className="row m-0" style={{ minHeight: "100vh" }}>
                    <div className="col-md-6 col-12 left-section">
                        <img src={Logo} alt="Logo" className="ecs-logo" />
                        <h1 className="ecs-text">ECS CLOUD</h1>
                    </div>

                    <div className="col-md-6 col-12 d-flex flex-column justify-content-center align-items-center form-section">
                        <div className="card p-4">
                            <h4 className="card-title text-center mb-4">Company Register</h4>
                            <form
                                onSubmit={formik.handleSubmit}
                                onKeyDown={(e) => {
                                    if (e.key === "Enter" && !formik.isSubmitting) {
                                        e.preventDefault();
                                    }
                                }}
                            >
                                <div className="row">
                                    <div className="col-md-6 col-12">
                                        <div className="mb-3">
                                            <label for="exampleFormControlInput1" className="form-label">
                                                Name<span className="text-danger">*</span>
                                            </label>
                                            <input
                                                type="text"
                                                name="name"
                                                className={`form-control  ${formik.touched.name && formik.errors.name
                                                    ? "is-invalid"
                                                    : ""
                                                    }`}
                                                aria-label="Username"
                                                aria-describedby="basic-addon1"
                                                {...formik.getFieldProps("name")}
                                            />
                                            {formik.touched.name && formik.errors.name && (
                                                <div className="invalid-feedback">
                                                    {formik.errors.name}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    <div className="col-md-6 col-12">
                                        <div className="mb-3">
                                            <label for="exampleFormControlInput1" className="form-label">
                                                Centre Name<span className="text-danger">*</span>
                                            </label>
                                            <input
                                                type="text"
                                                name="centerName"
                                                className={`form-control  ${formik.touched.centerName && formik.errors.centerName
                                                    ? "is-invalid"
                                                    : ""
                                                    }`}
                                                aria-label="Username"
                                                aria-describedby="basic-addon1"
                                                {...formik.getFieldProps("centerName")}
                                            />
                                            {formik.touched.centerName && formik.errors.centerName && (
                                                <div className="invalid-feedback">
                                                    {formik.errors.centerName}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    <div className="col-md-6 col-12">
                                        <div className="mb-3">
                                            <label for="exampleFormControlInput1" className="form-label">
                                                Email<span className="text-danger">*</span>
                                            </label>
                                            <input
                                                {...formik.getFieldProps("email")}
                                                type="text"
                                                className={`form-control   ${formik.touched.email && formik.errors.email
                                                    ? "is-invalid"
                                                    : ""
                                                    }`}
                                                aria-label="Username"
                                                aria-describedby="basic-addon1"
                                            />
                                            {formik.touched.email && formik.errors.email && (
                                                <div className="invalid-feedback">
                                                    {formik.errors.email}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    <div className="col-md-6 col-12">
                                        <div className="mb-3">
                                            <label for="exampleFormControlInput1" className="form-label">
                                                Mobile<span className="text-danger">*</span>
                                            </label>
                                            <input
                                                {...formik.getFieldProps("mobile")}
                                                type="text"
                                                className={`form-control   ${formik.touched.mobile && formik.errors.mobile
                                                    ? "is-invalid"
                                                    : ""
                                                    }`}
                                            />
                                            {formik.touched.mobile && formik.errors.mobile && (
                                                <div className="invalid-feedback">
                                                    {formik.errors.mobile}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    <div className="col-12">
                                        <div className="mb-3">
                                            <label for="exampleFormControlInput1" className="form-label">
                                                Address<span className="text-danger">*</span>
                                            </label>
                                            <textarea
                                                className={`form-control  ${formik.touched.address && formik.errors.address
                                                    ? "is-invalid"
                                                    : ""
                                                    }`}
                                                {...formik.getFieldProps("address")}
                                                id="exampleFormControlTextarea1"
                                                rows="3"
                                                onKeyDown={(e) => {
                                                    if (e.key === "Enter") {
                                                        // Allow the default behavior for Enter key
                                                        console.log("Enter key pressed: moving to the next line");
                                                    }
                                                }}
                                            ></textarea>
                                            {formik.touched.address && formik.errors.address && (
                                                <div className="invalid-feedback">
                                                    {formik.errors.address}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                                <button
                                    type="submit"
                                    className="btn btn-danger mt-4 w-100"
                                    style={{
                                        height: "45px",
                                        borderRadius: "8px",
                                        // maxWidth:""
                                    }}
                                >
                                    Submit
                                </button>
                            </form>
                            <p className="text-center mt-3">
                                <Link
                                    to="/login"
                                    className="text-muted fw-medium"
                                    style={{ textDecoration: "none", fontSize: "14px" }}
                                >
                                    Login
                                </Link>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
