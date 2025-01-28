import React, { useState } from "react";
import * as Yup from "yup";
import { useFormik } from "formik";
import { Link, useNavigate } from "react-router-dom";
import api from "../../../config/URL";
import { toast } from "react-toastify";

const FILE_SIZE = 2 * 1024 * 1024; // 2MB
const SUPPORTED_FORMATS = ["image/jpg", "image/jpeg", "image/png", "image/gif"];

const validationSchema = Yup.object({
  menuLogo: Yup.mixed()
    .nullable()
    .required("Menu Logo is required")
    .test(
      "fileSize",
      "File size is too large. Max size is 2MB",
      (value) => !value || (value && value.size <= FILE_SIZE)
    )
    .test(
      "fileFormat",
      "Unsupported file format. Allowed: JPG, JPEG, PNG, GIF",
      (value) => !value || (value && SUPPORTED_FORMATS.includes(value.type))
    ),
  backgroundImage: Yup.mixed()
    .nullable()
    .required("Menu Background is required")
    .test(
      "fileSize",
      "File size is too large. Max size is 2MB",
      (value) => !value || (value && value.size <= FILE_SIZE)
    )
    .test(
      "fileFormat",
      "Unsupported file format. Allowed: JPG, JPEG, PNG, GIF",
      (value) => !value || (value && SUPPORTED_FORMATS.includes(value.type))
    ),
  menuTitle: Yup.string()
    .required("Menu title is required")
    .max(50, "Menu title must not exceed 50 characters"),
  heading: Yup.string()
    .required("Heading is required")
    .max(100, "Heading must not exceed 100 characters"),
  contentOne: Yup.string()
    .required("Content One is required")
    .max(500, "Content One must not exceed 500 characters"),
  contentTwo: Yup.string()
    .required("Content Two is required")
    .max(500, "Content Two must not exceed 500 characters"),
  cardOneHeading: Yup.string()
    .required("Card One Heading is required")
    .max(100, "Card One Heading must not exceed 100 characters"),
  cardOneContent: Yup.string()
    .required("Card One Content is required")
    .max(500, "Card One Content must not exceed 500 characters"),
  cardOneImage: Yup.mixed()
    .nullable()
    .required("Card One Image is required")
    .test(
      "fileSize",
      "File size is too large. Max size is 2MB",
      (value) => !value || (value && value.size <= FILE_SIZE)
    )
    .test(
      "fileFormat",
      "Unsupported file format. Allowed: JPG, JPEG, PNG, GIF",
      (value) => !value || (value && SUPPORTED_FORMATS.includes(value.type))
    ),
  cardTwoHeading: Yup.string()
    .required("Card Two Heading is required")
    .max(100, "Card Two Heading must not exceed 100 characters"),
  cardTwoContent: Yup.string()
    .required("Card Two Content is required")
    .max(500, "Card Two Content must not exceed 500 characters"),
  cardTwoImage: Yup.mixed()
    .nullable()
    .required("Card Two Image is required")
    .test(
      "fileSize",
      "File size is too large. Max size is 2MB",
      (value) => !value || (value && value.size <= FILE_SIZE)
    )
    .test(
      "fileFormat",
      "Unsupported file format. Allowed: JPG, JPEG, PNG, GIF",
      (value) => !value || (value && SUPPORTED_FORMATS.includes(value.type))
    ),
  cardThreeHeading: Yup.string()
    .required("Card Three Heading is required")
    .max(100, "Card Three Heading must not exceed 100 characters"),
  cardThreeContent: Yup.string()
    .required("Card Three Content is required")
    .max(500, "Card Three Content must not exceed 500 characters"),
  cardThreeImage: Yup.mixed()
    .nullable()
    .required("Card Three Image is required")
    .test(
      "fileSize",
      "File size is too large. Max size is 2MB",
      (value) => !value || (value && value.size <= FILE_SIZE)
    )
    .test(
      "fileFormat",
      "Unsupported file format. Allowed: JPG, JPEG, PNG, GIF",
      (value) => !value || (value && SUPPORTED_FORMATS.includes(value.type))
    ),
  finalContent: Yup.string()
    .required("Final Content is required")
    .max(1000, "Final Content must not exceed 1000 characters"),
});

function CmsCourseAdd() {
  const [loadIndicator, setLoadIndicator] = useState(false);
  const userName = localStorage.getItem("userName");
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      menuLogo: null || "",
      menuTitle: "",

      backgroundImage: null || "",
      heading: "",
      contentOne: "",
      contentTwo: "",

      cardOneHeading: "",
      cardOneImage: null || "",
      cardOneContent: "",

      cardTwoHeading: "",
      cardTwoImage: null || "",
      cardTwoContent: "",

      cardThreeHeading: "",
      cardThreeImage: null || "",
      cardThreeContent: "",

      finalContent: "",
      createdBy: "",
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      setLoadIndicator(true);
      const formData = new FormData();
      // Append form values to formData
      formData.append("menuTitle", values.menuTitle);
      formData.append("heading", values.heading);
      formData.append("contentOne", values.contentOne);
      formData.append("contentTwo", values.contentTwo);
      formData.append("cardOneHeading", values.cardOneHeading);
      formData.append("cardOneContent", values.cardOneContent);
      formData.append("cardTwoHeading", values.cardTwoHeading);
      formData.append("cardTwoContent", values.cardTwoContent);
      formData.append("cardThreeHeading", values.cardThreeHeading);
      formData.append("cardThreeContent", values.cardThreeContent);
      formData.append("finalContent", values.finalContent);
      formData.append("createdBy", userName);

      // File Upload
      if (values.menuLogo) {
        formData.append("menuLogo", values.menuLogo);
      }
      if (values.backgroundImage) {
        formData.append("backgroundImage", values.backgroundImage);
      }
      if (values.cardOneImage) {
        formData.append("cardOneImage", values.cardOneImage);
      }
      if (values.cardTwoImage) {
        formData.append("cardTwoImage", values.cardTwoImage);
      }
      if (values.cardThreeImage) {
        formData.append("cardThreeImage", values.cardThreeImage);
      }

      try {
        const response = await api.post("/createCoursesSave", formData);
        if (response.status === 201) {
          toast.success(response.data.message);
          navigate("/cms/CmsCourses");
        } else {
          toast.error(response.data.message);
        }
      } catch (error) {
        toast.error(
          error.message || "An error occurred while submitting the form"
        );
      } finally {
        setLoadIndicator(false);
      }
      console.log("Courses Data:", values);
    },
  });

  return (
    <div className="container-fluid">
      <ol
        className="breadcrumb my-3"
        style={{ listStyle: "none", padding: 0, margin: 0 }}
      >
        <li>
          <Link to="/" className="custom-breadcrumb">
            Home
          </Link>
          <span className="breadcrumb-separator"> &gt; </span>
        </li>
        <li>
          Content Management
          <span className="breadcrumb-separator"> &gt; </span>
        </li>
        <li>
          <Link to="/cms/CmsCourses" className="custom-breadcrumb">
            Courses
          </Link>
          <span className="breadcrumb-separator"> &gt; </span>
        </li>
        <li className="breadcrumb-item active" aria-current="page">
          Courses Add
        </li>
      </ol>

      <form
        onSubmit={formik.handleSubmit}
        onKeyDown={(e) => {
          if (e.key === "Enter" && !formik.isSubmitting) {
            e.preventDefault(); // Prevent default form submission
          }
        }}
      >
        <div className="card">
          <div
            className="d-flex justify-content-between align-items-center p-1 mb-4 px-4"
            style={{ background: "#f5f7f9" }}
          >
            <div class="d-flex align-items-center">
              <div class="d-flex">
                <div class="dot active"></div>
              </div>
              <span class="me-2 text-muted">Course</span>
            </div>
            <div className="my-2 pe-3 d-flex align-items-center">
              <Link to="/cms/CmsCourses">
                <button type="button " className="btn btn-sm btn-border">
                  Back
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
                <span className="fw-medium">Save</span>
              </button>
            </div>
          </div>
          <div className="container-fluid px-4">
            <div className="row mt-3">
              <div className="col-lg-6 col-md-6 col-12 px-5">
                <div className="text-start mt-3">
                  <label htmlFor="" className="mb-1 fw-medium">
                    Menu Logo<span className="text-danger">*</span>
                  </label>
                  <br />
                  <input
                    type="file"
                    name="menuLogo"
                    className={`form-control ${formik.touched.menuLogo && formik.errors.menuLogo
                      ? "is-invalid"
                      : ""
                      }`}
                    // {...formik.getFieldProps("menuLogo")}
                    accept=".jpeg,.jpg,.png,.gif,.bmp,.webp"
                    onChange={(e) =>
                      formik.setFieldValue("menuLogo", e.target.files[0])
                    }
                  />
                  {formik.touched.menuLogo && formik.errors.menuLogo && (
                    <div className="invalid-feedback">
                      {formik.errors.menuLogo}
                    </div>
                  )}
                </div>
                <div className="text-start mt-3">
                  <label htmlFor="" className="mb-1 fw-medium">
                    Background Image<span className="text-danger">*</span>
                  </label>
                  <br />
                  <input
                    type="file"
                    name="backgroundImage"
                    className={`form-control ${formik.touched.backgroundImage &&
                      formik.errors.backgroundImage
                      ? "is-invalid"
                      : ""
                      }`}
                    // {...formik.getFieldProps("backgroundImage")}
                    accept=".jpeg,.jpg,.png,.gif,.bmp,.webp"
                    onChange={(e) =>
                      formik.setFieldValue("backgroundImage", e.target.files[0])
                    }
                  />
                  {formik.touched.backgroundImage &&
                    formik.errors.backgroundImage && (
                      <div className="invalid-feedback">
                        {formik.errors.backgroundImage}
                      </div>
                    )}
                </div>
                <div className="text-start mt-3">
                  <label htmlFor="" className="mb-1 fw-medium">
                    First Content<span class="text-danger">*</span>
                  </label>
                  <br />
                  <textarea
                    rows={5}
                    name="contentOne"
                    {...formik.getFieldProps("contentOne")}
                    className={`form-control  ${formik.touched.contentOne && formik.errors.contentOne
                      ? "is-invalid"
                      : ""
                      }`}
                    type="text"
                    placeholder="Enter Content"
                  />
                  {formik.touched.contentOne && formik.errors.contentOne && (
                    <div className="text-danger" style={{ fontSize: ".875em" }}>
                      {formik.errors.contentOne}
                    </div>
                  )}
                </div>
              </div>

              <div className="col-lg-6 col-md-6 col-12 px-5">
                <div className="text-start mt-3">
                  <label htmlFor="" className="mb-1 fw-medium">
                    Menu Title<span className="text-danger">*</span>
                  </label>
                  <br />
                  <input
                    name="menuTitle"
                    {...formik.getFieldProps("menuTitle")}
                    className={`form-control ${formik.touched.menuTitle && formik.errors.menuTitle
                      ? "is-invalid"
                      : ""
                      }`}
                    type="text"
                  />
                  {formik.touched.menuTitle && formik.errors.menuTitle && (
                    <div className="invalid-feedback">
                      {formik.errors.menuTitle}
                    </div>
                  )}
                </div>
                <div className="text-start mt-3">
                  <label htmlFor="" className="mb-1 fw-medium">
                    Heading<span className="text-danger">*</span>
                  </label>
                  <br />
                  <input
                    name="heading"
                    {...formik.getFieldProps("heading")}
                    className={`form-control ${formik.touched.heading && formik.errors.heading
                      ? "is-invalid"
                      : ""
                      }`}
                    type="text"
                  />
                  {formik.touched.heading && formik.errors.heading && (
                    <div className="invalid-feedback">
                      {formik.errors.heading}
                    </div>
                  )}
                </div>
                <div className="text-start mt-3">
                  <label htmlFor="" className="mb-1 fw-medium">
                    Second Content<span class="text-danger">*</span>
                  </label>
                  <br />
                  <textarea
                    rows={5}
                    name="contentTwo"
                    {...formik.getFieldProps("contentTwo")}
                    className={`form-control  ${formik.touched.contentTwo && formik.errors.contentTwo
                      ? "is-invalid"
                      : ""
                      }`}
                    type="text"
                    placeholder="Enter Content"
                  />
                  {formik.touched.contentTwo && formik.errors.contentTwo && (
                    <div className="text-danger" style={{ fontSize: ".875em" }}>
                      {formik.errors.contentTwo}
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div className="row mt-5">
              <h5 className="px-5">Card 1</h5>
              <div className="row px-5">
                <div className="col-lg-6 col-md-6 col-12 text-start mt-3">
                  <label htmlFor="" className="mb-1 fw-medium">
                    Card Heading<span className="text-danger">*</span>
                  </label>
                  <br />
                  <input
                    name="cardOneHeading"
                    {...formik.getFieldProps("cardOneHeading")}
                    className={`form-control ${formik.touched.cardOneHeading &&
                      formik.errors.cardOneHeading
                      ? "is-invalid"
                      : ""
                      }`}
                    type="text"
                  />
                  {formik.touched.cardOneHeading &&
                    formik.errors.cardOneHeading && (
                      <div className="invalid-feedback">
                        {formik.errors.cardOneHeading}
                      </div>
                    )}
                </div>
                <div className="col-lg-6 col-md-6 col-12 text-start mt-3">
                  <label htmlFor="" className="mb-1 fw-medium">
                    Card Image<span className="text-danger">*</span>
                  </label>
                  <br />
                  <input
                    type="file"
                    name="cardOneImage"
                    className={`form-control ${formik.touched.cardOneImage && formik.errors.cardOneImage
                      ? "is-invalid"
                      : ""
                      }`}
                    // {...formik.getFieldProps("cardOneImage")}
                    accept=".jpeg,.jpg,.png,.gif,.bmp,.webp"
                    onChange={(e) =>
                      formik.setFieldValue("cardOneImage", e.target.files[0])
                    }
                  />
                  {formik.touched.cardOneImage && formik.errors.cardOneImage && (
                    <div className="invalid-feedback">
                      {formik.errors.cardOneImage}
                    </div>
                  )}
                </div>
              </div>
              <div className="col-lg-12 col-md-12 col-12 px-5">
                <div className="text-start mt-3">
                  <label htmlFor="" className="mb-1 fw-medium">
                    Card Content<span class="text-danger">*</span>
                  </label>
                  <br />
                  <textarea
                    rows={10}
                    name="cardOneContent"
                    {...formik.getFieldProps("cardOneContent")}
                    className={`form-control  ${formik.touched.cardOneContent &&
                      formik.errors.cardOneContent
                      ? "is-invalid"
                      : ""
                      }`}
                    type="text"
                    placeholder="Enter Content"
                  />
                  {formik.touched.cardOneContent &&
                    formik.errors.cardOneContent && (
                      <div className="text-danger" style={{ fontSize: ".875em" }}>
                        {formik.errors.cardOneContent}
                      </div>
                    )}
                </div>
              </div>
            </div>
            <div className="row mt-5">
              <h5 className="px-5">Card 2</h5>
              <div className="row px-5">
                <div className="col-lg-6 col-md-6 col-12 text-start mt-3">
                  <label htmlFor="" className="mb-1 fw-medium">
                    Card Heading<span className="text-danger">*</span>
                  </label>
                  <br />
                  <input
                    name="cardTwoHeading"
                    {...formik.getFieldProps("cardTwoHeading")}
                    className={`form-control ${formik.touched.cardTwoHeading &&
                      formik.errors.cardTwoHeading
                      ? "is-invalid"
                      : ""
                      }`}
                    type="text"
                  />
                  {formik.touched.cardTwoHeading &&
                    formik.errors.cardTwoHeading && (
                      <div className="invalid-feedback">
                        {formik.errors.cardTwoHeading}
                      </div>
                    )}
                </div>
                <div className="col-lg-6 col-md-6 col-12 text-start mt-3">
                  <label htmlFor="" className="mb-1 fw-medium">
                    Card Image<span className="text-danger">*</span>
                  </label>
                  <br />
                  <input
                    type="file"
                    name="cardTwoImage"
                    className={`form-control ${formik.touched.cardTwoImage && formik.errors.cardTwoImage
                      ? "is-invalid"
                      : ""
                      }`}
                    // {...formik.getFieldProps("cardTwoImage")}
                    accept=".jpeg,.jpg,.png,.gif,.bmp,.webp"
                    onChange={(e) =>
                      formik.setFieldValue("cardTwoImage", e.target.files[0])
                    }
                  />
                  {formik.touched.cardTwoImage && formik.errors.cardTwoImage && (
                    <div className="invalid-feedback">
                      {formik.errors.cardTwoImage}
                    </div>
                  )}
                </div>
              </div>
              <div className="col-lg-12 col-md-12 col-12 px-5">
                <div className="text-start mt-3">
                  <label htmlFor="" className="mb-1 fw-medium">
                    Card Content<span class="text-danger">*</span>
                  </label>
                  <br />
                  <textarea
                    rows={10}
                    name="cardTwoContent"
                    {...formik.getFieldProps("cardTwoContent")}
                    className={`form-control  ${formik.touched.cardTwoContent &&
                      formik.errors.cardTwoContent
                      ? "is-invalid"
                      : ""
                      }`}
                    type="text"
                    placeholder="Enter Content"
                  />
                  {formik.touched.cardTwoContent &&
                    formik.errors.cardTwoContent && (
                      <div className="text-danger" style={{ fontSize: ".875em" }}>
                        {formik.errors.cardTwoContent}
                      </div>
                    )}
                </div>
              </div>
            </div>
            <div className="row mt-5">
              <h5 className="px-5">Card 3</h5>
              <div className="row px-5">
                <div className="col-lg-6 col-md-6 col-12 text-start mt-3">
                  <label htmlFor="" className="mb-1 fw-medium">
                    Card Heading<span className="text-danger">*</span>
                  </label>
                  <br />
                  <input
                    name="cardThreeHeading"
                    {...formik.getFieldProps("cardThreeHeading")}
                    className={`form-control ${formik.touched.cardThreeHeading &&
                      formik.errors.cardThreeHeading
                      ? "is-invalid"
                      : ""
                      }`}
                    type="text"
                  />
                  {formik.touched.cardThreeHeading &&
                    formik.errors.cardThreeHeading && (
                      <div className="invalid-feedback">
                        {formik.errors.cardThreeHeading}
                      </div>
                    )}
                </div>
                <div className="col-lg-6 col-md-6 col-12 text-start mt-3">
                  <label htmlFor="" className="mb-1 fw-medium">
                    Card Image<span className="text-danger">*</span>
                  </label>
                  <br />
                  <input
                    type="file"
                    name="cardThreeImage"
                    className={`form-control ${formik.touched.cardThreeImage &&
                      formik.errors.cardThreeImage
                      ? "is-invalid"
                      : ""
                      }`}
                    // {...formik.getFieldProps("cardThreeImage")}
                    accept=".jpeg,.jpg,.png,.gif,.bmp,.webp"
                    onChange={(e) =>
                      formik.setFieldValue("cardThreeImage", e.target.files[0])
                    }
                  />
                  {formik.touched.cardThreeImage &&
                    formik.errors.cardThreeImage && (
                      <div className="invalid-feedback">
                        {formik.errors.cardThreeImage}
                      </div>
                    )}
                </div>
              </div>
              <div className="col-lg-12 col-md-12 col-12 px-5">
                <div className="text-start mt-3">
                  <label htmlFor="" className="mb-1 fw-medium">
                    Card Content<span class="text-danger">*</span>
                  </label>
                  <br />
                  <textarea
                    rows={10}
                    name="cardThreeContent"
                    {...formik.getFieldProps("cardThreeContent")}
                    className={`form-control  ${formik.touched.cardThreeContent &&
                      formik.errors.cardThreeContent
                      ? "is-invalid"
                      : ""
                      }`}
                    type="text"
                    placeholder="Enter Content"
                  />
                  {formik.touched.cardThreeContent &&
                    formik.errors.cardThreeContent && (
                      <div className="text-danger" style={{ fontSize: ".875em" }}>
                        {formik.errors.cardThreeContent}
                      </div>
                    )}
                </div>
              </div>
            </div>
            <div className="row mt-5">
              <div className="col-lg-12 col-md-12 col-12 px-5">
                <div className="text-start mt-3">
                  <label htmlFor="" className="mb-1 fw-medium">
                    Final Content<span class="text-danger">*</span>
                  </label>
                  <br />
                  <textarea
                    rows={10}
                    name="finalContent"
                    {...formik.getFieldProps("finalContent")}
                    className={`form-control  ${formik.touched.finalContent && formik.errors.finalContent
                      ? "is-invalid"
                      : ""
                      }`}
                    type="text"
                    placeholder="Enter Content"
                  />
                  {formik.touched.finalContent && formik.errors.finalContent && (
                    <div className="text-danger" style={{ fontSize: ".875em" }}>
                      {formik.errors.finalContent}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}

export default CmsCourseAdd;
