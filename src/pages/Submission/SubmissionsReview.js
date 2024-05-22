import { useState } from "react";
import Modal from "react-bootstrap/Modal";
import { useFormik } from "formik";
import * as Yup from "yup";
import { FaStar } from "react-icons/fa6";

function SubmissionsReview() {
  const [rating, setRating] = useState(null);
  const [hover, setHover] = useState();

  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const validationSchema = Yup.object({});

  const formik = useFormik({
    initialValues: {
      comments: "",
      rating: null,
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
        className="btn btn-sm btn-button"
      >
        Review Submissions
      </button>

      <Modal show={show} onHide={handleClose} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Hiring Manager Review</Modal.Title>
        </Modal.Header>
        <form onSubmit={formik.handleSubmit}>
          <Modal.Body>
            <div className="container">
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
              Approve
            </button>
          </Modal.Footer>
        </form>
      </Modal>
    </>
  );
}

export default SubmissionsReview;
