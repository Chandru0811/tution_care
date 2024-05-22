import React, { useState } from 'react';
import { Link } from "react-router-dom";
import { RxDragHandleDots2 } from "react-icons/rx";
import Card from 'react-bootstrap/Card';
import { FaRegTrashCan, FaPlus, FaRegThumbsUp, FaStar } from "react-icons/fa6";
import { useFormik } from "formik";
import * as Yup from "yup";

function InterviewerAssessmentEdit() {

    const validationSchema = Yup.object({
        assessmentName: Yup.string().required("*Assessment name is required"),
        type: Yup.string().required("*Select a type"),
    });

    const formik = useFormik({
        initialValues: {
            assessmentName: "Screening Interview",
            type: "Behavioural Interview",
            ratingType: "Thumb Rating",
        },
        validationSchema: validationSchema,
        onSubmit: async (values) => {
            console.log("Interviewer Assessment Datas:", values);
        },
    });

    const [rows, setRows] = useState([{}]);

    return (
        <div className="container-fluid minHeight m-0">
            <div
                className="card shadow border-0 mb-2 top-header">
                <div className="container-fluid py-4">
                    <div className="row align-items-center">
                        <div className="col">
                            <div className="d-flex align-items-center gap-4">
                                <h1 className="h4 ls-tight headingColor">Edit Interviewer Assessment</h1>
                            </div>
                        </div>
                        <div className="col-auto">
                            <div className="hstack gap-2 justify-content-end">
                                <Link to="/assessment">
                                    <button type="button" className="btn btn-sm btn-light">
                                        <span>Back</span>
                                    </button>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <form onSubmit={formik.handleSubmit}>
                <div className="card shadow border-0 my-2">
                    <div className="row mt-3 me-2">
                        <div className="col-12 text-end">
                            <button type="submit" className="btn btn-button">
                                Update
                            </button>
                        </div>
                    </div>
                    <div className="container fw-bold fs-5 my-4">
                        Assessment Information
                    </div>
                    <div className="container mb-5">
                        <div className="row py-4">
                            <div className="col-md-6 col-12 mb-3">
                                <lable className="form-lable">
                                    Assessment Name<span className="text-danger">*</span>
                                </lable>
                                <input type="text"
                                    {...formik.getFieldProps('assessmentName')}
                                    className={`form-control ${formik.touched.assessmentName && formik.errors.assessmentName ? "is-invalid" : ""}`} />
                                {formik.touched.assessmentName && formik.errors.assessmentName && (
                                    <div className="invalid-feedback">{formik.errors.assessmentName}</div>
                                )}
                            </div>
                            <div className="col-md-6 col-12 mb-3">
                                <lable className="form-lable">
                                    Type<span className="text-danger">*</span>
                                </lable>
                                <select {...formik.getFieldProps('type')}
                                    className={`form-select ${formik.touched.type && formik.errors.type ? "is-invalid" : ""}`}>
                                    <option value="None" selected>None</option>
                                    <option value="General" >General</option>
                                    <option value="Behavioural Interview" >Behavioural Interview</option>
                                    <option value="Pre-Screening" >Pre-Screening</option>
                                    <option value="Behavioural Screening" >Behavioural Screening</option>
                                    <option value="Background Screening" >Background Screening</option>
                                </select>
                                {formik.touched.type && formik.errors.type && (
                                    <div className="invalid-feedback">{formik.errors.type}</div>
                                )}
                            </div>
                            <div className="col-md-6 col-12 mb-3">
                                <lable className="form-lable">
                                    Rating Type
                                </lable>
                                <div className='mt-2'>
                                <div className="form-check form-check-inline">
                                    <input className="form-check-input" type="radio" name="ratingType" value="Thumb Rating"
                                    onChange={formik.handleChange} 
                                    checked={formik.values.ratingType === "Thumb Rating"}/>
                                    <label className="form-check-label"><FaRegThumbsUp className='mb-1' color="#1673FF" /> Thumb Rating</label>
                                </div>
                                <div className="form-check form-check-inline">
                                    <input className="form-check-input mx-2" type="radio" name="ratingType" value="Star Rating" 
                                     onChange={formik.handleChange}
                                     checked={formik.values.ratingType === "Star Rating"}/>
                                    <label className="form-check-label"><FaStar className='text-warning mb-1' /> Star Rating</label>
                                </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="container fw-bold fs-5 my-4">
                        Assessment Questionnaire
                    </div>
                    <div className="card mx-5 mb-5">
                        <Card>
                            <Card.Header style={{ backgroundColor: "#f5f5f5" }}><RxDragHandleDots2 className='mb-1' />Competency Title</Card.Header>
                            <Card.Body>
                                <Card.Text>
                                    <div className='container'>
                                        {rows.map((row, index) => (
                                            <div key={index}>
                                                <div className='row'>
                                                    <div className='col-11 mb-3'>
                                                        <input type="text"
                                                            className='form-control form-control-lg'
                                                            {...formik.getFieldProps(`questions.${index}`)}
                                                            placeholder='Question' />
                                                    </div>
                                                    <div className="col-1 text-end d-flex justify-content-center align-items-center">
                                                        {index > 0 && (
                                                            <button
                                                                type="button"
                                                                className="btn btn-no-border"
                                                                style={{ border: "none", boxShadow: "none" }}
                                                                onClick={() => setRows((pr) => pr.filter((_, i) => i !== index))}
                                                            >
                                                                <FaRegTrashCan color="red" size={20} />
                                                            </button>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                        <button type="button" className="mt-3" style={{ color: "#1673FF", background: "#fff" }} onClick={() => setRows((pr) => [...pr, {}])}>
                                            <FaPlus />   Add <i class="bx bx-plus"></i>Question
                                        </button>
                                    </div>
                                </Card.Text>
                            </Card.Body>
                        </Card>
                    </div>
                </div>
            </form>
        </div>
    )
}

export default InterviewerAssessmentEdit;