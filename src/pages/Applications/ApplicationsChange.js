import React, { useState } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { VscGitPullRequestGoToChanges } from "react-icons/vsc";
import { useFormik } from "formik";
import * as Yup from "yup";
function ApplicationsChange() {
    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const validationSchema = Yup.object({
        applicationStatus: Yup.string().required("*Application Status is required"),
        jobOpenings: Yup.string().required("*Job Openings is required"),
        comments: Yup.string().required("*Comments is required"),
    });
    const formik = useFormik({
        initialValues: {
            applicationStatus: "",
            jobOpenings: "",
            comments: "",
        },
        validationSchema: validationSchema,
        onSubmit: async (values) => {
            console.log("Applications datas:", values);
        },
    });
    return (
        <>
            <button
                className="btn btn-sm shadow-none border-none"
                onClick={handleShow}
            >
                <VscGitPullRequestGoToChanges />
            </button>

            <Modal
                show={show}
                size="lg"
                aria-labelledby="contained-modal-title-vcenter"
                centered
                onHide={handleClose}
            >
                <Modal.Header closeButton>
                    <Modal.Title ><p className="headColor">Change Status</p></Modal.Title>
                </Modal.Header>
                <form onSubmit={formik.handleSubmit}>
                    <Modal.Body>
                        <div className="row">
                            <div className="col-md-6 col-12 mb-2">
                                <lable className="form-lable">Select Application Status<span className="text-danger">*</span></lable>
                                <div className="mb-3">
                                    <select
                                        type="text"
                                        className={`form-select  ${formik.touched.applicationStatus && formik.errors.applicationStatus
                                                ? "is-invalid"
                                                : ""
                                            }`}
                                        {...formik.getFieldProps("applicationStatus")}>
                                    <option></option>
                                    <option value="In progress">In progress</option>
                                    <option value="on Hold">On Hold</option>
                                    <option value="Waiting For Approval">Waiting For Approval</option>
                                    </select>
                                    {formik.touched.applicationStatus &&
                                        formik.errors.applicationStatus && (
                                            <div className="invalid-feedback">
                                                {formik.errors.applicationStatus}
                                            </div>
                                        )}
                                </div>
                            </div>
                            <div className="col-md-6 col-12 mb-2">
                                <lable className="form-lable">
                                    Job Openings<span className="text-danger">*</span>
                                </lable>
                                <select className={`form-select  ${formik.touched.jobOpenings && formik.errors.jobOpenings
                                        ? "is-invalid"
                                        : ""
                                    }`}
                                    {...formik.getFieldProps("jobOpenings")}>
                                    <option></option>
                                    <option value="Applied">Applied</option>
                                    <option value="Qualified">Qualified</option>
                                    <option value="Junk">Junk</option>
                                    <option value="Submissions">Submissions</option>
                                    <option value="Rejected">Rejected</option>
                                    <option value="On Hold">On Hold</option>
                                    <option value="Offered">Offered</option>
                                    <option value="Hired">Hired</option>
                                </select>
                                {formik.touched.jobOpenings &&
                                    formik.errors.jobOpenings && (
                                        <div className="invalid-feedback">
                                            {formik.errors.jobOpenings}
                                        </div>
                                    )}
                            </div>
                            <div className="col-md-6 col-12 mb-2">
                                <lable className="form-lable">Comments<span className="text-danger">*</span></lable>
                                <div className="mb-3">
                                    <textarea id="exampleFormControlTextarea1" rows="3" className={`form-control form-control-sm ${formik.touched.comments && formik.errors.comments
                                            ? "is-invalid"
                                            : ""
                                        }`}
                                        {...formik.getFieldProps("comments")}
                                    ></textarea>
                                    {formik.touched.comments &&
                                        formik.errors.comments && (
                                            <div className="invalid-feedback">
                                                {formik.errors.comments}
                                            </div>
                                        )}
                                </div>
                            </div>
                        </div>
                        <Modal.Footer className="mt-3">
                            <Button variant="light" className="btn" onClick={handleClose}>
                                Cancel
                            </Button>
                            <Button variant="primary" type="submit" className="btn btn-button">
                                Save
                            </Button>

                        </Modal.Footer>
                    </Modal.Body>
                </form>
            </Modal>
        </>
    );
}

export default ApplicationsChange;
