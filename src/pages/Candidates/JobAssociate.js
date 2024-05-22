import { useState } from "react";
import Modal from "react-bootstrap/Modal";
import { RiFolderSettingsFill } from "react-icons/ri";
import { useFormik } from "formik";
import * as Yup from "yup";

function Example() {
  const validationSchema = Yup.object({
    jobOpening: Yup.string().required("*Selete a Job Opening is required"),
    applicationStatus: Yup.string().required(
      "*Selete a Application Status is required"
    ),
  });

  const formik = useFormik({
    initialValues: {
      jobOpening: "",
      applicationStatus: "",
      comments: "",
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      console.log(values);
    },
  });

  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  return (
    <>
      <button onClick={handleShow} type="button" className="btn btn-sm shadow-none border-none">
        <RiFolderSettingsFill />
      </button>

      <Modal size="lg" show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Associate Job Opening</Modal.Title>
        </Modal.Header>
        <form onSubmit={formik.handleSubmit}>
          <Modal.Body>
            <div className="row">
              <div className="col-md-6 col-12 mb-2">
                <label className="form-label">
                  Choose Job Opening<span className="text-danger">*</span>
                </label>
                <select
                  name="jobOpening"
                  {...formik.getFieldProps("jobOpening")}
                  className={`form-select ${
                    formik.touched.jobOpening && formik.errors.jobOpening
                      ? "is-invalid"
                      : ""
                  }`}
                >
                  <option value="">None</option>
                  <option value="React Developer">React Developer</option>
                  <option value="Java Developer">Java Developer</option>
                  <option value="Angular Developer">Angular Developer</option>
                </select>
                {formik.touched.jobOpening && formik.errors.jobOpening && (
                  <div className="invalid-feedback">
                    {formik.errors.jobOpening}
                  </div>
                )}
              </div>
              <div className="col-md-6 col-12 mb-2">
                <label className="form-label">
                  Select Application Status
                  <span className="text-danger">*</span>
                </label>
                <select
                  name="applicationStatus"
                  {...formik.getFieldProps("applicationStatus")}
                  className={`form-select ${
                    formik.touched.applicationStatus &&
                    formik.errors.applicationStatus
                      ? "is-invalid"
                      : ""
                  }`}
                >
                  <option value="">None</option>
                  <option value="In Review">In Review</option>
                  <option value="Qualified">Qualified</option>
                  <option value="Junk Candidate">Junk Candidate</option>
                  <option value="Associated">Associated</option>
                  <option value="Applied">Applied</option>
                  <option value="Rejected">Rejected</option>
                </select>
                {formik.touched.applicationStatus &&
                  formik.errors.applicationStatus && (
                    <div className="invalid-feedback">
                      {formik.errors.applicationStatus}
                    </div>
                  )}
              </div>
              <div className="col-md-6 col-12 mb-2">
                <label className="form-label">Comments</label>
                <div className="mb-3">
                  <div className="form-floating">
                    <textarea
                      rows="5"
                      className="form-control"
                      {...formik.getFieldProps("comments")}
                    />
                  </div>
                </div>
              </div>
            </div>
          </Modal.Body>
          <Modal.Footer>
            <button
              className="btn btn-sm btn-light"
              type="button"
              onClick={handleClose}
            >
              Close
            </button>
            <button type="submit" className="btn btn-sm btn-button">
              Associate
            </button>
          </Modal.Footer>
        </form>
      </Modal>
    </>
  );
}

export default Example;
