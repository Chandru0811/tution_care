import React, { useState } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { useFormik } from "formik";
import * as Yup from "yup";
function DepartmentAdd() {
    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const validationSchema = Yup.object({
        departmentName: Yup.string().required("*Department Name is required"),
        departmentLead: Yup.string().required("*Department Lead is required"),
    });
    const formik = useFormik({
        initialValues: {
            departmentName: '',
            departmentLead: '',
            parentDepartment: '',
        },
        validationSchema: validationSchema,
        onSubmit: async (values) => {
            console.log("Department datas:", values);
        },
    });
    return (
        <>
            <button
                type="submit"
                className="btn btn-sm btn-button"
                onClick={handleShow}
            >
            Create Department
            </button>

            <Modal
                show={show}
                size="lg"
                aria-labelledby="contained-modal-title-vcenter"
                centered
                onHide={handleClose}
            >
                <Modal.Header closeButton>
                    <Modal.Title ><p className="headColor">Department</p></Modal.Title>
                </Modal.Header>
                <form onSubmit={formik.handleSubmit}>
                    <Modal.Body>
                        <div className="row">
                            <div className="col-md-6 col-12 mb-2">
                                <lable className="form-lable">Department Name<span className="text-danger">*</span></lable>
                                <div className="mb-3">
                                    <input
                                        type="text"
                                        className={`form-control  ${formik.touched.departmentName && formik.errors.departmentName
                                                ? "is-invalid"
                                                : ""
                                            }`}
                                        {...formik.getFieldProps("departmentName")}
                                    />
                                    {formik.touched.departmentName &&
                                        formik.errors.departmentName && (
                                            <div className="invalid-feedback">
                                                {formik.errors.departmentName}
                                            </div>
                                        )}
                                </div>
                            </div>
                            <div className="col-md-6 col-12 mb-2">
                                <lable className="form-lable">Department Lead<span className="text-danger">*</span></lable>
                                <div className="mb-3">
                                    <input
                                        type="text"
                                        className={`form-control  ${formik.touched.departmentLead && formik.errors.departmentLead
                                                ? "is-invalid"
                                                : ""
                                            }`}
                                        {...formik.getFieldProps("departmentLead")}
                                    />
                                    {formik.touched.departmentLead &&
                                        formik.errors.departmentLead && (
                                            <div className="invalid-feedback">
                                                {formik.errors.departmentLead}
                                            </div>
                                        )}
                                </div>
                            </div>
                            <div className="col-md-6 col-12 mb-2">
                                <lable className="form-lable">Parent Department</lable>
                                <div className="mb-3">
                                    <input
                                        type="text"
                                        className={`form-control  ${formik.touched.parentDepartment && formik.errors.parentDepartment
                                                ? "is-invalid"
                                                : ""
                                            }`}
                                        {...formik.getFieldProps("parentDepartment")}
                                    />
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

export default DepartmentAdd;
