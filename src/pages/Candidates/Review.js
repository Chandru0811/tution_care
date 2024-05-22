import { useState } from "react";
// import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { useFormik } from "formik";
import * as Yup from "yup";
import { FaStar } from "react-icons/fa6";

function Review() {
  const [rating, setRating] = useState(null);
  const [hover, setHover] = useState();

  const [show, setShow] = useState(false);
  const [reviewType, setReviewType] = useState("General");

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const validationSchema = Yup.object({});

  const formik = useFormik({
    initialValues: {
      comments: "",
      rating: null,
      chooseAssesment: "",
      selectType: "",
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      console.log(values);
      handleClose(); // Close modal after submission
    },
  });

  return (
    <>
      <button
        onClick={handleShow}
        type="button"
        className="btn btn-sm border-none shadow-none p-0"
      >
        Review
      </button>

      <Modal show={show} onHide={handleClose} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Submit Review</Modal.Title>
        </Modal.Header>
        <form onSubmit={formik.handleSubmit}>
          <Modal.Body>
            <div className="container d-flex justify-content-start align-items-center mb-5">
              <input
                type="radio"
                name="Review"
                value="General"
                className="form-check-input my-0"
                checked={reviewType === "General"} // Check if reviewType is "General"
                onChange={() => setReviewType("General")} // Update reviewType to "General"
              />
              <p className="mx-2 my-0">General Review</p>
              <input
                type="radio"
                name="Review"
                value="Screening"
                className="form-check-input ms-4 my-0"
                checked={reviewType === "Screening"} // Check if reviewType is "Screening"
                onChange={() => setReviewType("Screening")} // Update reviewType to "Screening"
              />
              <p className="mx-2 my-0">Screening Review</p>
            </div>

            {reviewType === "General" && (
              <div className="container" id="General">
                <div className="col-md-12 col-12 mb-2">Rating: {rating}</div>
                <div className="col-md-12 col-12 mb-2">
                  {[...Array(5)].map((star, index) => {
                    const ratingValue = index + 1;

                    return (
                      <label key={index}>
                        <input
                          type="radio"
                          name="rating"
                          value={ratingValue}
                          onClick={() => {
                            setRating(ratingValue);
                            formik.setFieldValue("rating", ratingValue);
                          }}
                          style={{ visibility: "hidden" }}
                        />
                        <FaStar
                          className="star"
                          color={
                            ratingValue <= (hover || rating)
                              ? "#ffc107"
                              : "#e4e5e9"
                          }
                          size={25}
                          onMouseEnter={() => setHover(ratingValue)}
                          onMouseLeave={() => setHover(null)}
                        />
                      </label>
                    );
                  })}
                </div>
                <div className="col-md-12 col-12 mb-2">
                  <label className="form-lable">Comments</label>
                  <div className="mb-3">
                    <textarea
                      type="text"
                      rows={6}
                      className="form-control"
                      name="comments"
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      value={formik.values.comments}
                    />
                  </div>
                </div>
              </div>
            )}
            {reviewType === "Screening" && (
              <div className="container" id="Screening">
                <div className="col-md-7 col-12 my-4">
                  <lable className="form-lable">Select Type</lable>
                  <select
                    name="selectType"
                    {...formik.getFieldProps("selectType")}
                    className={`form-select    ${
                      formik.touched.selectType && formik.errors.selectType
                        ? "is-invalid"
                        : ""
                    }`}
                  >
                    <option selected></option>
                    <option value="Pre-Screening">Pre-Screening</option>
                  </select>
                </div>
                <div className="col-md-7 col-12 my-3">
                  <lable className="form-lable">Choose Assessments</lable>
                  <select
                    name="chooseAssesment"
                    {...formik.getFieldProps("chooseAssesment")}
                    className={`form-select    ${
                      formik.touched.chooseAssesment &&
                      formik.errors.chooseAssesment
                        ? "is-invalid"
                        : ""
                    }`}
                  >
                    <option selected></option>
                    <option value="Candidate General Assessment">
                      Candidate General Assessment
                    </option>
                    <option value="Java Developer">Java Developer</option>
                    <option value="ReactJs Developer">ReactJs Developer</option>
                  </select>
                </div>
              </div>
            )}
          </Modal.Body>
          <Modal.Footer>
            <button
              className="btn btn-secondary"
              type="button"
              onClick={handleClose}
            >
              Close
            </button>
            <button className="btn btn-primary" type="submit">
              Submit
            </button>
          </Modal.Footer>
        </form>
      </Modal>
    </>
  );
}

export default Review;
