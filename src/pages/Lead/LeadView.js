import React, { useEffect, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import api from "../../config/URL";
import fetchAllCentersWithIds from "../List/CenterList";
import fetchAllSubjectsWithIds from "../List/SubjectList";
import { toast } from "react-toastify";
import { ImCross } from "react-icons/im";
import { TiTick } from "react-icons/ti";
import Modal from "react-bootstrap/Modal";
import { jsPDF } from "jspdf";
import "jspdf-autotable";
import Logo from "../../assets/images/Logo.png";
import html2canvas from "html2canvas";
import "boxicons";
import AssesmentPdf from "./AssesmentPdf";
import fetchAllStudentsWithIds from "../List/StudentList";

function Leadview() {
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);
  console.log("Lead Data:", data);
  const [doassesmentData, setDoassesmentData] = useState([]);
  const [arrangeassesmentData, setArrangeassesmentData] = useState([]);

  // console.log("Doassesment Data:", doassesmentData.leadDoAssessmentAlphabet[0].recognitionOfSoundA);
  const [paymentStatus, setPaymentStatus] = useState("PENDING");

  // Payment Status & Summary Modal

  const [showPaymentStatusModal, setShowPaymentStatusModal] = useState(false);
  const [showSummaryModal, setShowSummaryModal] = useState(false);

  const handleClose = () => {
    setShowPaymentStatusModal(false);
    setShowSummaryModal(false);
  };

  // const handlePaymentStatusShow = () => setShowPaymentStatusModal(true);
  // const handleSummaryShow = () => setShowSummaryModal(true);

  // console.log(data);

  const [centerData, setCenterData] = useState(null);
  const [studentData, setStudentData] = useState(null);
  const [subjectData, setSubjectData] = useState(null);
  console.log("subject", subjectData);
  const fetchData = async () => {
    try {
      const centerData = await fetchAllCentersWithIds();
      const studentData = await fetchAllStudentsWithIds();
      const subjectData = await fetchAllSubjectsWithIds();
      setCenterData(centerData);
      setStudentData(studentData);
      setSubjectData(subjectData);
    } catch (error) {
      toast.error(error);
    }
  };

  const handleSavePaymentStatus = async () => {
    try {
      const response = await api.put(`/updateLeadInfo/${id}`, {
        paymentStatus,
      });
      if (response.status === 200) {
        toast.success(response.data.message);
        handleClose(); // Close the modal after successful update
        try {
          if (paymentStatus === "PAID") {
            const migrateResponse = await api.post(`/leadToStudentMigrate`, {
              leadId: id,
              status: "paid",
            });
            if (migrateResponse.status === 201) {
              toast.success(migrateResponse.data.message);
            } else {
              toast.error(migrateResponse.data.message);
            }
          }
        } catch (error) {
          console.log("Error Payment Response", error?.response?.status);
          if (error?.response?.status === 409) {
            toast.warning(error?.response?.data.message);
          } else if (error?.response?.status === 404) {
            toast.warning(error?.response?.data.message);
          } else {
            toast.error(error?.response?.data.message);
          }
        }
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error("Error updating payment status");
    }
  };

  useEffect(() => {
    const getData = async () => {
      try {
        const response = await api.get(`/getAllLeadInfoWithReferrerById/${id}`);
        setData(response.data);
        setPaymentStatus(response.data.paymentStatus);
      } catch (error) {
        toast.error("Error Fetch Data ", error);
      }
      // console.log("Lead  :",response);
    };

    const getAssesmentData = async () => {
      try {
        const response = await api.get(`/getLeadAssessmentDataByLeadId/${id}`);
        setDoassesmentData(response.data);
      } catch (error) {
        toast.error("Error Fetch Data ", error);
      }
    };

    const getArrangeAssesmentData = async () => {
      try {
        const response = await api.get(`/getAllLeadInfoById/${id}`);
        setArrangeassesmentData(response.data);
      } catch (error) {
        toast.error("Error Fetch Data ", error);
      }
    };

    getData();
    getAssesmentData();
    getArrangeAssesmentData();
    fetchData();
  }, [id]);

  const daysOrder = [
    "SUNDAY",
    "MONDAY",
    "TUESDAY",
    "WEDNESDAY",
    "THURSDAY",
    "FRIDAY",
    "SATURDAY",
  ];

  const sortedPreferredDays = data.preferredDay
    ? data.preferredDay.sort(
        (a, b) => daysOrder.indexOf(a) - daysOrder.indexOf(b)
      )
    : [];

  return (
    <>
      <Modal
        show={showPaymentStatusModal}
        onHide={handleClose}
        animation={false}
      >
        <Modal.Header closeButton>
          <Modal.Title>Payment Status</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div>
            <div className="text-start mt-4">
              <select
                name="paymentStatus"
                onChange={(e) => setPaymentStatus(e.target.value)}
                // onBlur={formik.handleBlur}
                // value={formik.values.paymentStatus}
                value={paymentStatus}
                className="form-select"
                aria-label="example"
              >
                <option value="PENDING" selected>
                  Pending
                </option>
                <option value="PAID">Paid</option>
                <option value="REJECTED">Rejected</option>
              </select>
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <button
            className="btn btn-border btn-sm"
            type="button"
            onClick={handleClose}
          >
            Close
          </button>
          <button
            className="btn btn-button btn-sm"
            type="submit"
            onClick={handleSavePaymentStatus}
          >
            Save
          </button>
        </Modal.Footer>
      </Modal>
      <Modal show={showSummaryModal} onHide={handleClose} animation={false}>
        <Modal.Header closeButton>
          <Modal.Title>Summary</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div>
            <ul>
              <div className="row">
                <div className="d-flex align-items-center mb-3">
                  <box-icon
                    name="check-circle"
                    type="solid"
                    color="#0bda5d"
                  ></box-icon>
                  &nbsp; &nbsp;
                  <li className="list-unstyled d-flex text-start">
                    Student Information
                  </li>
                </div>
              </div>
              <div className="d-flex align-items-center mb-3">
                <box-icon
                  name="x-circle"
                  type="solid"
                  color="#d42615"
                ></box-icon>
                &nbsp; &nbsp;
                <li className="list-unstyled d-flex align-items-center">
                  Child Ability
                </li>
              </div>
              <div className="d-flex align-items-center mb-3">
                <box-icon
                  name="x-circle"
                  type="solid"
                  color="#d42615"
                ></box-icon>
                &nbsp; &nbsp;
                <li className="list-unstyled d-flex align-items-center">
                  Parent Information &nbsp; &nbsp;
                </li>
              </div>
              <div className="d-flex align-items-center mb-3">
                <box-icon
                  name="check-circle"
                  type="solid"
                  color="#0bda5d"
                ></box-icon>
                &nbsp; &nbsp;
                <li className="list-unstyled d-flex align-items-center">
                  Address
                </li>
              </div>
              <div className="d-flex align-items-center mb-3">
                <box-icon
                  name="x-circle"
                  type="solid"
                  color="#d42615"
                ></box-icon>
                &nbsp; &nbsp;
                <li className="list-unstyled d-flex align-items-center">
                  Account Information
                </li>
              </div>
              <div className="d-flex align-items-center mb-3">
                <box-icon
                  name="check-circle"
                  type="solid"
                  color="#0bda5d"
                ></box-icon>
                &nbsp; &nbsp;
                <li className="list-unstyled d-flex align-items-center">
                  Authorised Person Address
                </li>
              </div>
            </ul>
          </div>
        </Modal.Body>
        {/* <Modal.Footer> */}
        {/* <button
            className="btn btn-border btn-sm"
            type="button"
            onClick={handleClose}
          >
            Close
          </button>
          <button
            className="btn btn-button btn-sm"
            type="submit"
            onClick={handleClose}
          >
            Save
          </button> */}
        {/* </Modal.Footer> */}
      </Modal>
      <div className="mb-5">
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
            Lead Management
            <span className="breadcrumb-separator"> &gt; </span>
          </li>
          <li>
            <Link to="/lead/lead" className="custom-breadcrumb">
              Lead Listing
            </Link>
            <span className="breadcrumb-separator"> &gt; </span>
          </li>
          <li className="breadcrumb-item active" aria-current="page">
            Lead View
          </li>
        </ol>
        <div className="container-fluid minHeight">
          <div className=" products">
            <div class="container-fluid py-4">
              <div class="row d-flex  justify-content-end">
                <div class="col-auto ">
                  <div class="hstack gap-2 ">
                    <Link to="/lead/lead">
                      <button type="button" class="btn btn-border btn-sm">
                        <span>Back</span>
                      </button>
                    </Link>

                    {doassesmentData.leadDoAssessmentAlphabet &&
                    doassesmentData.leadDoAssessmentAlphabet.length > 0 &&
                    doassesmentData.leadDoAssessmentArtyPursuers &&
                    doassesmentData.leadDoAssessmentArtyPursuers.length > 0 &&
                    doassesmentData.leadDoAssessmentModel &&
                    doassesmentData.leadDoAssessmentModel.length > 0 ? (
                      <>
                        <AssesmentPdf doassesmentData={doassesmentData} />
                      </>
                    ) : (
                      <></>
                    )}

                    {data.leadStatus === "ARRANGING_ASSESSMENT" ? (
                      <Link to={`/lead/lead/assessment/${id}`}>
                        <button type="button" className="btn btn-border btn-sm">
                          <span>Do Assessment</span>
                        </button>
                      </Link>
                    ) : data.leadStatus === "ASSESSMENT_DONE" ? (
                      <></>
                    ) : (
                      <></>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="container-fluid">
          <div class="accordion" id="accordionExample">
            {/* Lead Information */}
            <div class="accordion-item">
              <h2 class="accordion-header">
                <button
                  class="accordion-button"
                  type="button"
                  data-bs-toggle="collapse"
                  data-bs-target="#collapseOne"
                  aria-expanded="true"
                  aria-controls="collapseOne"
                >
                  <b>Lead Information</b>
                </button>
              </h2>
              <div
                id="collapseOne"
                class="accordion-collapse collapse show"
                data-bs-parent="#accordionExample"
              >
                <div class="accordion-body">
                  <div className="container-fluid">
                    <div className="row  m-3">
                      <h5 className="headColor mt-2 mb-4">
                        Student Information
                      </h5>
                      <div className="col-md-6 col-12">
                        <div className="row mb-2">
                          <div className="col-6 d-flex  align-items-center">
                            <p className="text-sm fw-medium">Student Name</p>
                          </div>
                          <div className="col-6">
                            <p className="text-muted text-sm">
                              : {data.studentName || "--"}
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="col-md-6 col-12">
                        <div className="row mb-2">
                          <div className="col-6 d-flex  align-items-center">
                            <p className="text-sm fw-medium ">Date Of Birth</p>
                          </div>
                          <div className="col-6">
                            <p className="text-muted text-sm">
                              :{" "}
                              {data.dateOfBirth
                                ? data.dateOfBirth.substring(0, 10)
                                : "--"}
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="col-md-6 col-12">
                        <div className="row mb-2">
                          <div className="col-6 d-flex  align-items-center">
                            <p className="text-sm fw-medium">Gender</p>
                          </div>
                          <div className="col-6">
                            <p className="text-muted text-sm">
                              : {data.gender || "--"}
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="col-md-6 col-12">
                        <div className="row mb-2">
                          <div className="col-6 d-flex  align-items-center">
                            <p className="text-sm fw-medium ">Subject</p>
                          </div>
                          <div className="col-6">
                            <p className="text-muted text-sm">
                              {/* : {data.subject || "--"} */}:{" "}
                              {subjectData &&
                                subjectData.map((subject) =>
                                  parseInt(data.subjectId) === subject.id
                                    ? subject.subjects || "--"
                                    : ""
                                )}
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="col-md-6 col-12">
                        <div className="row mb-2">
                          <div className="col-6 d-flex  align-items-center">
                            <p className="text-sm fw-medium ">
                              Medical Condition
                            </p>
                          </div>
                          <div className="col-6">
                            <p className="text-muted text-sm">
                              : {data.medicalCondition || "--"}
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="col-md-6 col-12">
                        <div className="row mb-2">
                          <div className="col-6 d-flex  align-items-center">
                            <p className="text-sm fw-medium ">Ethnic Group</p>
                          </div>
                          <div className="col-6">
                            <p className="text-muted text-sm">
                              : {data.ethnicGroup || "--"}
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="col-md-6 col-12">
                        <div className="row mb-2">
                          <div className="col-6 d-flex align-items-center">
                            <p className="text-sm fw-medium">Status</p>
                          </div>
                          <div className="col-6">
                            <p className="text-muted text-sm">
                              :{" "}
                              {data.leadStatus
                                ? data.leadStatus
                                    .split("_")
                                    .map(
                                      (word) =>
                                        word.charAt(0).toUpperCase() +
                                        word.slice(1).toLowerCase()
                                    )
                                    .join(" ")
                                : "--"}
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="col-md-6 col-12">
                        <div className="row mb-2">
                          <div className="col-6 d-flex  align-items-center">
                            <p className="text-sm fw-medium ">School Type</p>
                          </div>
                          <div className="col-6">
                            <p className="text-muted text-sm">
                              : {data.schoolType || "--"}
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="col-md-6 col-12">
                        <div className="row mb-2">
                          <div className="col-6 d-flex  align-items-center">
                            <p className="text-sm fw-medium ">Name Of School</p>
                          </div>
                          <div className="col-6">
                            <p className="text-muted text-sm">
                              : {data.nameOfSchool || "--"}
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="col-md-6 col-12">
                        <div className="row mb-2">
                          <div className="col-6 d-flex  align-items-center">
                            <p className="text-sm fw-medium ">Centre</p>
                          </div>
                          <div className="col-6">
                            <p className="text-muted text-sm">
                              :{" "}
                              {centerData &&
                                centerData.map((center) =>
                                  parseInt(data.centerId) === center.id
                                    ? center.centerNames || "--"
                                    : ""
                                )}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="container-fluid">
                    <div className="row  m-3">
                      <h5 className="headColor mt-5 mb-4">Child Ability</h5>
                      <div className="col-md-6 col-12">
                        <div className="row mb-2">
                          <div className="col-6 d-flex  align-items-center">
                            <p className="text-sm fw-medium">Pencil Grip</p>
                          </div>
                          <div className="col-6">
                            <p className="text-muted text-sm">
                              : {data.pencilGrip || "--"}
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="col-md-6 col-12">
                        <div className="row mb-2">
                          <div className="col-6 d-flex  align-items-center">
                            <p className="text-sm fw-medium ">Writing</p>
                          </div>
                          <div className="col-6">
                            <p className="text-muted text-sm">
                              : {data.writing || "--"}
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="col-md-6 col-12">
                        <div className="row mb-2">
                          <div className="col-6 d-flex  align-items-center">
                            <p className="text-sm fw-medium">Recognize A-Z</p>
                          </div>
                          <div className="col-6">
                            <p className="text-muted text-sm">
                              : {data.recognizeAToZ || "--"}
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="col-md-6 col-12">
                        <div className="row mb-2">
                          <div className="col-6 d-flex  align-items-center">
                            <p className="text-sm fw-medium ">
                              Write A-Z(Uppercase)
                            </p>
                          </div>
                          <div className="col-6">
                            <p className="text-muted text-sm">
                              : {data.writeUpperAToZ ? "Yes" : "No"}
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="col-md-6 col-12">
                        <div className="row mb-2">
                          <div className="col-6 d-flex  align-items-center">
                            <p className="text-sm fw-medium ">
                              Write a-z(lowercase)
                            </p>
                          </div>
                          <div className="col-6">
                            <p className="text-muted text-sm">
                              : {data.writeLowerAToZ ? "Yes" : "No"}
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="col-md-6 col-12">
                        <div className="row mb-2">
                          <div className="col-6 d-flex  align-items-center">
                            <p className="text-sm fw-medium ">Sounds of a-z</p>
                          </div>
                          <div className="col-6">
                            <p className="text-muted text-sm">
                              : {data.soundOfAToZ ? "Yes" : "No"}
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="col-md-6 col-12">
                        <div className="row mb-2">
                          <div className="col-6 d-flex  align-items-center">
                            <p className="text-sm fw-medium ">
                              Can read simple sentence
                            </p>
                          </div>
                          <div className="col-6">
                            <p className="text-muted text-sm">
                              : {data.canReadSimpleSentence ? "Yes" : "No"}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="container-fluid">
                    <div className="row  m-3">
                      <h5 className="headColor mt-5 mb-4">
                        Parent Information
                      </h5>
                      <div className="d-flex justify-content-between">
                        <div></div>
                        <div>
                          {data.primaryContactMother ? (
                            <p className="badge text-bg-primary">primary</p>
                          ) : null}
                        </div>
                      </div>
                      <div className="col-md-6 col-12">
                        <div className="row mb-2">
                          <div className="col-6 d-flex  align-items-center">
                            <p className="text-sm fw-medium ">
                              Mother's Full Name
                            </p>
                          </div>
                          <div className="col-6">
                            <p className="text-muted text-sm">
                              : {data.mothersFullName || "--"}
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="col-md-6 col-12">
                        <div className="row mb-2">
                          <div className="col-6 d-flex  align-items-center">
                            <p className="text-sm fw-medium ">
                              Mother's Occupation
                            </p>
                          </div>
                          <div className="col-6">
                            <p className="text-muted text-sm">
                              : {data.mothersOccupation || "--"}
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="col-md-6 col-12">
                        <div className="row mb-2">
                          <div className="col-6 d-flex  align-items-center">
                            <p className="text-sm fw-medium ">
                              Mother's Date Of Birth
                            </p>
                          </div>
                          <div className="col-6">
                            <p className="text-muted text-sm">
                              :{" "}
                              {data.mothersDateOfBirth
                                ? data.mothersDateOfBirth.substring(0, 10)
                                : "--"}
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="col-md-6 col-12">
                        <div className="row mb-2">
                          <div className="col-6 d-flex  align-items-center">
                            <p className="text-sm fw-medium">
                              Mother's Mobile Number
                            </p>
                          </div>
                          <div className="col-6">
                            <p className="text-muted text-sm">
                              : {data.mothersMobileNumber || ""}
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="col-md-6 col-12">
                        <div className="row mb-2">
                          <div className="col-6 d-flex  align-items-center">
                            <p className="text-sm fw-medium ">
                              Mother's Monthly Income{" "}
                            </p>
                          </div>
                          <div className="col-6">
                            <p className="text-muted text-sm">
                              : {data.monthlyIncomeOfMother || "--"}
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="col-md-6 col-12">
                        <div className="row mb-2">
                          <div className="col-6 d-flex  align-items-center">
                            <p className="text-sm fw-medium ">
                              Mother's Email Address
                            </p>
                          </div>
                          <div className="col-6">
                            <p className="text-muted text-sm">
                              : {data.mothersEmailAddress || "--"}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="d-flex justify-content-between">
                      <div></div>
                      <div>
                        {data.primaryContactFather ? (
                          <p className="badge text-bg-primary">primary</p>
                        ) : null}
                      </div>
                    </div>
                    <div className="row  m-3">
                      <div className="col-md-6 col-12">
                        <div className="row mb-2">
                          <div className="col-6 d-flex  align-items-center">
                            <p className="text-sm fw-medium ">
                              Father's Full Name
                            </p>
                          </div>
                          <div className="col-6">
                            <p className="text-muted text-sm">
                              : {data.fathersFullName || "--"}
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="col-md-6 col-12">
                        <div className="row mb-2">
                          <div className="col-6 d-flex  align-items-center">
                            <p className="text-sm fw-medium ">
                              Father's Occupation
                            </p>
                          </div>
                          <div className="col-6">
                            <p className="text-muted text-sm">
                              : {data.fathersOccupation || "--"}
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="col-md-6 col-12">
                        <div className="row mb-2">
                          <div className="col-6 d-flex  align-items-center">
                            <p className="text-sm fw-medium ">
                              Father's Date Of Birth
                            </p>
                          </div>
                          <div className="col-6">
                            <p className="text-muted text-sm">
                              :{" "}
                              {data.fathersDateOfBirth
                                ? data.fathersDateOfBirth.substring(0, 10)
                                : "--"}
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="col-md-6 col-12">
                        <div className="row mb-2">
                          <div className="col-6 d-flex  align-items-center">
                            <p className="text-sm fw-medium">
                              Father's Mobile Number
                            </p>
                          </div>
                          <div className="col-6">
                            <p className="text-muted text-sm">
                              : {data.fathersMobileNumber || ""}
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="col-md-6 col-12">
                        <div className="row mb-2">
                          <div className="col-6 d-flex  align-items-center">
                            <p className="text-sm fw-medium ">
                              Father's Monthly Income
                            </p>
                          </div>
                          <div className="col-6">
                            <p className="text-muted text-sm">
                              : {data.monthlyIncomeOfFather || "--"}
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="col-md-6 col-12">
                        <div className="row mb-2">
                          <div className="col-6 d-flex  align-items-center">
                            <p className="text-sm fw-medium ">
                              Father's Email Address
                            </p>
                          </div>
                          <div className="col-6">
                            <p className="text-muted text-sm">
                              : {data.fathersEmailAddress || "--"}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="container-fluid">
                    <div className="row  m-3">
                      <h5 className="headColor mt-5 mb-4">
                        Address Information
                      </h5>
                      <div className="col-md-6 col-12">
                        <div className="row mb-2">
                          <div className="col-6 d-flex  align-items-center">
                            <p className="text-sm fw-medium">Address</p>
                          </div>
                          <div className="col-6">
                            <p className="text-muted text-sm">
                              : {data.address || "--"}
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="col-md-6 col-12">
                        <div className="row mb-2">
                          <div className="col-6 d-flex  align-items-center">
                            <p className="text-sm fw-medium ">Postal Code</p>
                          </div>
                          <div className="col-6">
                            <p className="text-muted text-sm">
                              : {data.postalCode || "--"}
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="col-md-6 col-12">
                        <div className="row mb-2">
                          <div className="col-6 d-flex  align-items-center">
                            <p className="text-sm fw-medium">
                              Emergency Contact Name
                            </p>
                          </div>
                          <div className="col-6">
                            <p className="text-muted text-sm">
                              : {data.nameOfEmergency || "--"}
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="col-md-6 col-12">
                        <div className="row mb-2">
                          <div className="col-6 d-flex  align-items-center">
                            <p className="text-sm fw-medium ">
                              Emergency Contact NRIC
                            </p>
                          </div>
                          <div className="col-6">
                            <p className="text-muted text-sm">
                              : {data.emergencyNric || ""}
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="col-md-6 col-12">
                        <div className="row mb-2">
                          <div className="col-6 d-flex  align-items-center">
                            <p className="text-sm fw-medium ">
                              Emergency Contact Mobile
                            </p>
                          </div>
                          <div className="col-6">
                            <p className="text-muted text-sm">
                              : {data.emergencyContact || ""}
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="col-md-6 col-12">
                        <div className="row mb-2">
                          <div className="col-6 d-flex  align-items-center">
                            <p className="text-sm fw-medium ">
                              Relation To Child
                            </p>
                          </div>
                          <div className="col-6">
                            <p className="text-muted text-sm">
                              : {data.relationToChild || ""}
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="col-md-6 col-12">
                        <div className="row mb-2">
                          <div className="col-6 d-flex  align-items-center">
                            <p className="text-sm fw-medium ">
                              Name Of Authorised Person To Take child From Class
                            </p>
                          </div>
                          <div className="col-6">
                            <p className="text-muted text-sm">
                              : {data.nameOfAuthorised || ""}
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="col-md-6 col-12">
                        <div className="row mb-2">
                          <div className="col-6 d-flex  align-items-center">
                            <p className="text-sm fw-medium ">
                              Relation To Child Of Authorised Person To Take
                              Child From Class
                            </p>
                          </div>
                          <div className="col-6">
                            <p className="text-muted text-sm">
                              : {data.relationToChils || data.relation || ""}
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="col-md-6 col-12">
                        <div className="row mb-2">
                          <div className="col-6 d-flex  align-items-center">
                            <p className="text-sm fw-medium ">
                              NRIC/FIN No. Authorised Person To Take Child From
                              Class
                            </p>
                          </div>
                          <div className="col-6">
                            <p className="text-muted text-sm">
                              : {data.noAuthorisedNric || ""}
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="col-md-6 col-12">
                        <div className="row mb-2">
                          <div className="col-6 d-flex  align-items-center">
                            <p className="text-sm fw-medium ">
                              Contact Number Authorised Person To Take Child
                              From Class
                            </p>
                          </div>
                          <div className="col-6">
                            <p className="text-muted text-sm">
                              : {data.contactOfAuthorised || ""}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="container-fluid">
                    <div className="row m-3">
                      <h5 className="headColor mt-5  mb-4">
                        Account Information
                      </h5>
                      <div className="col-md-6 col-12">
                        <div className="row mb-2">
                          <div className="col-6 d-flex  align-items-center">
                            <p className="text-sm fw-medium ">
                              Refer Center Name
                            </p>
                          </div>
                          <div className="col-6">
                            <p className="text-muted text-sm">
                              : {data.referedStudentCenterName || "--"}
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="col-md-6 col-12">
                        <div className="row mb-2">
                          <div className="col-6 d-flex  align-items-center">
                            <p className="text-sm fw-medium ">Refer By</p>
                          </div>
                          <div className="col-6">
                            <p className="text-muted text-sm">
                              :{" "}
                              {studentData &&
                                studentData.map((std) =>
                                  parseInt(data.referBy) === std.id
                                    ? std.studentNames || "--"
                                    : ""
                                )}
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="col-md-6 col-12">
                        <div className="row mb-2">
                          <div className="col-6 d-flex">
                            <p className="text-sm fw-medium ">Preferred Day</p>
                          </div>
                          <div className="col-6">
                            <p className="text-muted text-sm">
                              :{" "}
                              {sortedPreferredDays.length > 0
                                ? sortedPreferredDays.join(", ")
                                : "--"}
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="col-md-6 col-12">
                        <div className="row mb-2">
                          <div className="col-6 d-flex">
                            <p className="text-sm fw-medium ">
                              Preferred Timeslot
                            </p>
                          </div>
                          <div className="col-6">
                            <p className="text-muted text-sm">
                              :{" "}
                              {data.preferredTimeSlot
                                ? data.preferredTimeSlot.join(", ")
                                : "--"}
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="col-md-6 col-12">
                        <div className="row mb-2">
                          <div className="col-6 d-flex  align-items-center">
                            <p className="text-sm fw-medium ">
                              Marketing Source
                            </p>
                          </div>
                          <div className="col-6">
                            <p className="text-muted text-sm">
                              : {data.marketingSource || "--"}
                            </p>
                          </div>
                        </div>
                      </div>
                      {/* <div className="col-md-6 col-12">
                        <div className="row mb-2">
                          <div className="col-6 d-flex  align-items-center">
                            <p className="text-sm fw-medium ">
                              Name Of Referral
                            </p>
                          </div>
                          <div className="col-6">
                            <p className="text-muted text-sm">
                              : {data.nameOfReferral || "--"}
                            </p>
                          </div>
                        </div>
                      </div> */}
                      <div className="col-md-6 col-12">
                        <div className="row mb-2">
                          <div className="col-6 d-flex  align-items-center">
                            <p className="text-sm fw-medium ">Enquiry Date</p>
                          </div>
                          <div className="col-6">
                            <p className="text-muted text-sm">
                              :{" "}
                              {data.enquiryDate?.substring(0, 10) ||
                                data.createdAt?.substring(0, 10) ||
                                ""}
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="col-md-6 col-12">
                        <div className="row mb-2">
                          <div className="col-6 d-flex">
                            <p className="text-sm fw-medium ">Remarks</p>
                          </div>
                          <div className="col-6">
                            <p className="text-muted text-sm">
                              : {data.remark || "--"}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {data?.assessmentArrange?.length > 0 && (
              <div className="accordion-item">
                <h2 className="accordion-header">
                  <button
                    className="accordion-button"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#collapseTwo"
                    aria-expanded="true"
                    aria-controls="collapseTwo"
                  >
                    <b>Arranging Assessment</b>
                  </button>
                </h2>
                <div
                  id="collapseTwo"
                  className="accordion-collapse collapse show"
                  data-bs-parent="#accordionExample"
                >
                  <div className="accordion-body">
                    <div className="container-fluid">
                      <div className="row">
                        <h5 className="headColor mt-2 mb-4">
                          Arranging Assessment
                        </h5>
                        {data?.assessmentArrange?.map((arrange, index) => (
                          <div key={index} className="row">
                            <div className="col-md-6 col-12">
                              <div className="row mb-2">
                                <div className="col-6 d-flex align-items-center">
                                  <p className="text-sm fw-medium">Centre</p>
                                </div>
                                <div className="col-6">
                                  <p className="text-muted text-sm">
                                    :{" "}
                                    {centerData &&
                                      centerData.map((center) =>
                                        parseInt(data.centerId) === center.id
                                          ? center.centerNames || "--"
                                          : ""
                                      )}
                                  </p>
                                </div>
                              </div>
                            </div>
                            <div className="col-md-6 col-12">
                              <div className="row mb-2">
                                <div className="col-6 d-flex align-items-center">
                                  <p className="text-sm fw-medium">
                                    Student Name
                                  </p>
                                </div>
                                <div className="col-6">
                                  <p className="text-muted text-sm">
                                    : {data.studentName || "--"}
                                  </p>
                                </div>
                              </div>
                            </div>
                            <div className="col-md-6 col-12">
                              <div className="row mb-2">
                                <div className="col-6 d-flex align-items-center">
                                  <p className="text-sm fw-medium">
                                    Assessment
                                  </p>
                                </div>
                                <div className="col-6">
                                  <p className="text-muted text-sm">
                                    : {arrange.assessment || "--"}
                                  </p>
                                </div>
                              </div>
                            </div>
                            <div className="col-md-6 col-12">
                              <div className="row mb-2">
                                <div className="col-6 d-flex align-items-center">
                                  <p className="text-sm fw-medium">
                                    Assessment Date
                                  </p>
                                </div>
                                <div className="col-6">
                                  <p className="text-muted text-sm">
                                    : {arrange.assessmentDate || "--"}
                                  </p>
                                </div>
                              </div>
                            </div>
                            <div className="col-md-6 col-12">
                              <div className="row mb-2">
                                <div className="col-6 d-flex align-items-center">
                                  <p className="text-sm fw-medium">
                                    Start Time
                                  </p>
                                </div>
                                <div className="col-6">
                                  <p className="text-muted text-sm">
                                    : {arrange.time || "--"}
                                  </p>
                                </div>
                              </div>
                            </div>
                            <div className="col-md-6 col-12">
                              <div className="row mb-2">
                                <div className="col-6 d-flex align-items-center">
                                  <p className="text-sm fw-medium">Remark</p>
                                </div>
                                <div className="col-6">
                                  <p className="text-muted text-sm">
                                    : {arrange.remarks || "--"}
                                  </p>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {arrangeassesmentData.assessmentArrange &&
            arrangeassesmentData.assessmentArrange.length > 0 ? (
              <>
                {/* Arrange Assessment */}
                <div class="accordion-item">
                  <h2 class="accordion-header">
                    <button
                      class="accordion-button collapsed"
                      type="button"
                      data-bs-toggle="collapse"
                      data-bs-target="#collapseTwo"
                      aria-expanded="false"
                      aria-controls="collapseTwo"
                    >
                      <b>Arranging Assessment Information</b>
                    </button>
                  </h2>
                  <div
                    id="collapseTwo"
                    class="accordion-collapse collapse"
                    data-bs-parent="#accordionExample"
                  >
                    <div class="accordion-body">
                      {/* Child Particulars */}
                      <div className="container-fluid">
                        <div className="row  m-3">
                          <div className="d-flex justify-content-between">
                            <h5 className="headColor mt-2 mb-4">
                              Leads Assessment Booking
                            </h5>
                            {/* <button
                            onClick={generatePDF}
                            className="btn btn-border btn-sm mx-3"
                            style={{ padding: "2px 8px", fontSize: "0.8rem" }}
                          >
                            Generate PDF
                          </button> */}
                          </div>

                          <div className="col-md-6 col-12">
                            <div className="row mb-2">
                              <div className="col-6 d-flex  align-items-center">
                                <p className="text-sm fw-medium">
                                  Student Name
                                </p>
                              </div>
                              <div className="col-6">
                                <p className="text-muted text-sm">
                                  :{" "}
                                  {arrangeassesmentData &&
                                  arrangeassesmentData.assessmentArrange &&
                                  arrangeassesmentData.assessmentArrange
                                    .length > 0 &&
                                  arrangeassesmentData.assessmentArrange[0]
                                    ? arrangeassesmentData.assessmentArrange[0]
                                        .studentName
                                    : "--"}
                                </p>
                              </div>
                            </div>
                          </div>

                          <div className="col-md-6 col-12">
                            <div className="row mb-2">
                              <div className="col-6 d-flex align-items-center">
                                <p className="text-sm fw-medium">Assessment</p>
                              </div>
                              <div className="col-6">
                                <p className="text-muted text-sm">
                                  :{" "}
                                  {arrangeassesmentData &&
                                  arrangeassesmentData.assessmentArrange &&
                                  arrangeassesmentData.assessmentArrange
                                    .length > 0 &&
                                  arrangeassesmentData.assessmentArrange[0] &&
                                  arrangeassesmentData.assessmentArrange[0]
                                    .assessmentDate
                                    ? arrangeassesmentData.assessmentArrange[0]
                                        .assessment
                                    : "--"}
                                </p>
                              </div>
                            </div>
                          </div>

                          <div className="col-md-6 col-12">
                            <div className="row mb-2">
                              <div className="col-6 d-flex align-items-center">
                                <p className="text-sm fw-medium">Date</p>
                              </div>
                              <div className="col-6">
                                <p className="text-muted text-sm">
                                  :{" "}
                                  {arrangeassesmentData &&
                                  arrangeassesmentData.assessmentArrange &&
                                  arrangeassesmentData.assessmentArrange
                                    .length > 0 &&
                                  arrangeassesmentData.assessmentArrange[0] &&
                                  arrangeassesmentData.assessmentArrange[0]
                                    .assessmentDate
                                    ? arrangeassesmentData.assessmentArrange[0]
                                        .assessmentDate
                                    : "--"}
                                </p>
                              </div>
                            </div>
                          </div>

                          <div className="col-md-6 col-12">
                            <div className="row mb-2">
                              <div className="col-6 d-flex align-items-center">
                                <p className="text-sm fw-medium">Time</p>
                              </div>
                              <div className="col-6">
                                <p className="text-muted text-sm">
                                  :{" "}
                                  {arrangeassesmentData &&
                                  arrangeassesmentData.assessmentArrange &&
                                  arrangeassesmentData.assessmentArrange
                                    .length > 0 &&
                                  arrangeassesmentData.assessmentArrange[0] &&
                                  arrangeassesmentData.assessmentArrange[0].time
                                    ? arrangeassesmentData.assessmentArrange[0]
                                        .time
                                    : "--"}
                                </p>
                              </div>
                            </div>
                          </div>

                          <div className="col-md-6 col-12">
                            <div className="row mb-2">
                              <div className="col-6 d-flex  align-items-center">
                                <p className="text-sm fw-medium ">Remark</p>
                              </div>
                              <div className="col-6">
                                <p className="text-muted text-sm">
                                  :{" "}
                                  {arrangeassesmentData &&
                                  arrangeassesmentData.assessmentArrange &&
                                  arrangeassesmentData.assessmentArrange
                                    .length > 0 &&
                                  arrangeassesmentData.assessmentArrange[0] &&
                                  arrangeassesmentData.assessmentArrange[0]
                                    .remarks
                                    ? arrangeassesmentData.assessmentArrange[0]
                                        .remarks
                                    : "--"}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <></>
            )}

            {/* Arrange Assessment */}
            {doassesmentData.leadDoAssessmentAlphabet &&
            doassesmentData.leadDoAssessmentAlphabet.length > 0 &&
            doassesmentData.leadDoAssessmentArtyPursuers &&
            doassesmentData.leadDoAssessmentArtyPursuers.length > 0 &&
            doassesmentData.leadDoAssessmentModel &&
            doassesmentData.leadDoAssessmentModel.length > 0 ? (
              <>
                {/* Assessment Information */}
                <div class="accordion-item">
                  <h2 class="accordion-header">
                    <button
                      class="accordion-button collapsed"
                      type="button"
                      data-bs-toggle="collapse"
                      data-bs-target="#collapseThree"
                      aria-expanded="false"
                      aria-controls="collapseThree"
                    >
                      <b>Assessment Information</b>
                    </button>
                  </h2>
                  <div
                    id="collapseThree"
                    class="accordion-collapse collapse"
                    data-bs-parent="#accordionExample"
                  >
                    <div class="accordion-body">
                      <div className="bg-light rounded-3 text-center text-muted text-sm p-2">
                        <span className="headColor">"</span> Hi parent your
                        childern secured Grade{" "}
                        <span className="text-success fw-bold">
                          {(doassesmentData &&
                            doassesmentData.leadDoAssessmentModel &&
                            doassesmentData.leadDoAssessmentModel.length > 0 &&
                            doassesmentData.leadDoAssessmentModel[0] &&
                            doassesmentData.leadDoAssessmentAlphabet &&
                            doassesmentData.leadDoAssessmentAlphabet[0] &&
                            doassesmentData.leadDoAssessmentAlphabet[0]
                              .gradeCategory) ||
                            "--"}{" "}
                        </span>
                        <span className="headColor">"</span>
                        {/* Grade & Level is{" "}
                                <span className="text-danger fw-bold">
                                {(doassesmentData &&
                                  doassesmentData.leadDoAssessmentModel &&
                                  doassesmentData.leadDoAssessmentModel.length >
                                    0 &&
                                  doassesmentData.leadDoAssessmentModel[0] &&
                                  doassesmentData.leadDoAssessmentAlphabet &&
                                  doassesmentData.leadDoAssessmentAlphabet[0] &&
                                  doassesmentData.leadDoAssessmentAlphabet[0]
                                    .gradeLevel) ||
                                  "--"}

                                </span>
                                
                                {" "}
                                {doassesmentData &&
                                doassesmentData.leadDoAssessmentModel?.length >
                                  0 &&
                                doassesmentData.leadDoAssessmentAlphabet?.[0]
                                  ?.gradeLevel === "Worst Case" ? (
                                  <> Please improve your child's skills</>
                                ) : null}
                                " */}
                      </div>
                      {/* Child Particulars */}
                      <div className="container-fluid">
                        <div className="row  m-3">
                          <div className="d-flex justify-content-between">
                            <h5 className="headColor mt-2 mb-4">
                              Child Particulars
                            </h5>
                          </div>

                          <div className="col-md-6 col-12">
                            <div className="row mb-2">
                              <div className="col-6 d-flex  align-items-center">
                                <p className="text-sm fw-medium">Name</p>
                              </div>
                              <div className="col-6">
                                <p className="text-muted text-sm">
                                  :{" "}
                                  {doassesmentData &&
                                  doassesmentData.leadDoAssessmentModel &&
                                  doassesmentData.leadDoAssessmentModel.length >
                                    0 &&
                                  doassesmentData.leadDoAssessmentModel[0]
                                    ? doassesmentData.leadDoAssessmentModel[0]
                                        .name
                                    : "--"}
                                </p>
                              </div>
                            </div>
                          </div>
                          <div className="col-md-6 col-12">
                            <div className="row mb-2">
                              <div className="col-6 d-flex align-items-center">
                                <p className="text-sm fw-medium">
                                  Assessment Date
                                </p>
                              </div>
                              <div className="col-6">
                                <p className="text-muted text-sm">
                                  :{" "}
                                  {doassesmentData &&
                                  doassesmentData.leadDoAssessmentModel &&
                                  doassesmentData.leadDoAssessmentModel.length >
                                    0 &&
                                  doassesmentData.leadDoAssessmentModel[0] &&
                                  doassesmentData.leadDoAssessmentModel[0]
                                    .assessmentDate
                                    ? doassesmentData.leadDoAssessmentModel[0].assessmentDate.substring(
                                        0,
                                        10
                                      )
                                    : "--"}
                                </p>
                              </div>
                            </div>
                          </div>
                          <div className="col-md-6 col-12">
                            <div className="row mb-2">
                              <div className="col-6 d-flex  align-items-center">
                                <p className="text-sm fw-medium">Age</p>
                              </div>
                              <div className="col-6">
                                <p className="text-muted text-sm">
                                  :{" "}
                                  {doassesmentData &&
                                  doassesmentData.leadDoAssessmentModel &&
                                  doassesmentData.leadDoAssessmentModel.length >
                                    0 &&
                                  doassesmentData.leadDoAssessmentModel[0] &&
                                  doassesmentData.leadDoAssessmentModel[0].age
                                    ? doassesmentData.leadDoAssessmentModel[0]
                                        .age
                                    : "--"}
                                </p>
                              </div>
                            </div>
                          </div>
                          <div className="col-md-6 col-12">
                            <div className="row mb-2">
                              <div className="col-6 d-flex  align-items-center">
                                <p className="text-sm fw-medium ">
                                  Date Of Birth
                                </p>
                              </div>
                              <div className="col-6">
                                <p className="text-muted text-sm">
                                  :{" "}
                                  {doassesmentData &&
                                  doassesmentData.leadDoAssessmentModel &&
                                  doassesmentData.leadDoAssessmentModel.length >
                                    0 &&
                                  doassesmentData.leadDoAssessmentModel[0] &&
                                  doassesmentData.leadDoAssessmentModel[0].year
                                    ? doassesmentData.leadDoAssessmentModel[0].year.substring(
                                        0,
                                        10
                                      )
                                    : "--"}
                                </p>
                              </div>
                            </div>
                          </div>
                          <div className="col-md-6 col-12">
                            <div className="row mb-2">
                              <div className="col-6 d-flex  align-items-center">
                                <p className="text-sm fw-medium ">
                                  Picture Taken (To Send To Prospective Parents)
                                </p>
                              </div>
                              <div className="col-6">
                                <p className="text-muted text-sm">
                                  :{" "}
                                  {doassesmentData &&
                                  doassesmentData.leadDoAssessmentModel &&
                                  doassesmentData.leadDoAssessmentModel.length >
                                    0 &&
                                  doassesmentData.leadDoAssessmentModel[0] &&
                                  doassesmentData.leadDoAssessmentModel[0]
                                    .pictureToken
                                    ? doassesmentData.leadDoAssessmentModel[0]
                                        .pictureToken
                                    : "--"}
                                </p>
                              </div>
                            </div>
                          </div>
                          <div className="col-md-6 col-12">
                            <div className="row mb-2">
                              <div className="col-6 d-flex  align-items-center">
                                <p className="text-sm fw-medium ">
                                  Payment Mode
                                </p>
                              </div>
                              <div className="col-6">
                                <p className="text-muted text-sm">
                                  :{" "}
                                  {doassesmentData &&
                                  doassesmentData.leadDoAssessmentModel &&
                                  doassesmentData.leadDoAssessmentModel.length >
                                    0 &&
                                  doassesmentData.leadDoAssessmentModel[0] &&
                                  doassesmentData.leadDoAssessmentModel[0]
                                    .paymentMode
                                    ? doassesmentData.leadDoAssessmentModel[0]
                                        .paymentMode
                                    : "--"}
                                </p>
                              </div>
                            </div>
                          </div>
                          <div className="col-md-6 col-12">
                            <div className="row mb-2">
                              <div className="col-6 d-flex  align-items-center">
                                <p className="text-sm fw-medium ">
                                  Time Slot Offered
                                </p>
                              </div>
                              <div className="col-6">
                                <p className="text-muted text-sm">
                                  :{" "}
                                  {doassesmentData &&
                                  doassesmentData.leadDoAssessmentModel &&
                                  doassesmentData.leadDoAssessmentModel.length >
                                    0 &&
                                  doassesmentData.leadDoAssessmentModel[0] &&
                                  doassesmentData.leadDoAssessmentModel[0]
                                    .timeSlotOffered
                                    ? doassesmentData.leadDoAssessmentModel[0]
                                        .timeSlotOffered
                                    : "--"}
                                </p>
                              </div>
                            </div>
                          </div>
                          <div className="col-md-6 col-12">
                            <div className="row mb-2">
                              <div className="col-6 d-flex  align-items-center">
                                <p className="text-sm fw-medium ">
                                  Referred By(Student Name)
                                </p>
                              </div>
                              <div className="col-6">
                                <p className="text-muted text-sm">
                                  :{" "}
                                  {doassesmentData &&
                                  doassesmentData.leadDoAssessmentModel &&
                                  doassesmentData.leadDoAssessmentModel.length >
                                    0 &&
                                  doassesmentData.leadDoAssessmentModel[0] &&
                                  doassesmentData.leadDoAssessmentModel[0]
                                    .referredBy
                                    ? doassesmentData.leadDoAssessmentModel[0]
                                        .referredBy
                                    : "--"}
                                </p>
                              </div>
                            </div>
                          </div>
                          <div className="col-md-6 col-12">
                            <div className="row mb-2">
                              <div className="col-6 d-flex  align-items-center">
                                <p className="text-sm fw-medium ">
                                  T-Shirt Size
                                </p>
                              </div>
                              <div className="col-6">
                                <p className="text-muted text-sm">
                                  :{" "}
                                  {doassesmentData &&
                                  doassesmentData.leadDoAssessmentModel &&
                                  doassesmentData.leadDoAssessmentModel.length >
                                    0 &&
                                  doassesmentData.leadDoAssessmentModel[0] &&
                                  doassesmentData.leadDoAssessmentModel[0]
                                    .tshirtSize
                                    ? doassesmentData.leadDoAssessmentModel[0]
                                        .tshirtSize
                                    : "--"}
                                </p>
                              </div>
                            </div>
                          </div>
                          <div className="col-md-6 col-12">
                            <div className="row mb-2">
                              <div className="col-6 d-flex  align-items-center">
                                <p className="text-sm fw-medium ">
                                  Level Assessed
                                </p>
                              </div>
                              <div className="col-6">
                                <p className="text-muted text-sm">
                                  :{" "}
                                  {doassesmentData &&
                                  doassesmentData.leadDoAssessmentModel &&
                                  doassesmentData.leadDoAssessmentModel.length >
                                    0 &&
                                  doassesmentData.leadDoAssessmentModel[0] &&
                                  doassesmentData.leadDoAssessmentModel[0]
                                    .levelAssessed
                                    ? doassesmentData.leadDoAssessmentModel[0]
                                        .levelAssessed
                                    : "--"}
                                </p>
                              </div>
                            </div>
                          </div>
                          <div className="col-md-6 col-12">
                            <div className="row mb-2">
                              <div className="col-6 d-flex  align-items-center">
                                <p className="text-sm fw-medium ">Sibling(s)</p>
                              </div>
                              <div className="col-6">
                                <p className="text-muted text-sm">
                                  :{" "}
                                  {doassesmentData &&
                                  doassesmentData.leadDoAssessmentModel &&
                                  doassesmentData.leadDoAssessmentModel.length >
                                    0 &&
                                  doassesmentData.leadDoAssessmentModel[0] &&
                                  doassesmentData.leadDoAssessmentModel[0]
                                    .sibling
                                    ? doassesmentData.leadDoAssessmentModel[0]
                                        .sibling
                                    : "--"}
                                </p>
                              </div>
                            </div>
                          </div>
                          <div className="col-md-6 col-12">
                            <div className="row mb-2">
                              <div className="col-6 d-flex  align-items-center">
                                <p className="text-sm fw-medium ">
                                  Where Did You Here From ?
                                </p>
                              </div>
                              <div className="col-6">
                                <p className="text-muted text-sm">
                                  :{" "}
                                  {doassesmentData &&
                                  doassesmentData.leadDoAssessmentModel &&
                                  doassesmentData.leadDoAssessmentModel.length >
                                    0 &&
                                  doassesmentData.leadDoAssessmentModel[0] &&
                                  doassesmentData.leadDoAssessmentModel[0]
                                    .whereFrom
                                    ? doassesmentData.leadDoAssessmentModel[0]
                                        .whereFrom
                                    : "--"}
                                </p>
                              </div>
                            </div>
                          </div>
                          <div className="col-md-6 col-12">
                            <div className="row mb-2">
                              <div className="col-6 d-flex  align-items-center">
                                <p className="text-sm fw-medium ">Remark</p>
                              </div>
                              <div className="col-6">
                                <p className="text-muted text-sm">
                                  :{" "}
                                  {doassesmentData &&
                                  doassesmentData.leadDoAssessmentModel &&
                                  doassesmentData.leadDoAssessmentModel.length >
                                    0 &&
                                  doassesmentData.leadDoAssessmentModel[0] &&
                                  doassesmentData.leadDoAssessmentModel[0]
                                    .remarks
                                    ? doassesmentData.leadDoAssessmentModel[0]
                                        .remarks
                                    : "--"}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Child Pencil Grip */}
                      <div className="container-fluid">
                        <div className="row  m-3">
                          <h5 className="headColor mt-5 mb-4">
                            Child Pencil Grip
                          </h5>
                          <div className="col-12">
                            <div className="row mb-2">
                              <div className="col-3 d-flex  align-items-center">
                                <p className="text-sm fw-medium">Pencil Grip</p>
                              </div>
                              <div className="col-9">
                                <p className="text-muted text-sm">
                                  : (
                                  {doassesmentData &&
                                  doassesmentData.leadDoAssessmentModel &&
                                  doassesmentData.leadDoAssessmentModel.length >
                                    0 &&
                                  doassesmentData.leadDoAssessmentModel[0] &&
                                  doassesmentData.leadDoAssessmentModel[0]
                                    .pencilGrip
                                    ? doassesmentData.leadDoAssessmentModel[0]
                                        .pencilGrip
                                    : "--"}
                                  )&nbsp;
                                  {doassesmentData &&
                                  doassesmentData.leadDoAssessmentModel &&
                                  doassesmentData.leadDoAssessmentModel.length >
                                    0 &&
                                  doassesmentData.leadDoAssessmentModel[0] &&
                                  doassesmentData.leadDoAssessmentModel[0]
                                    .pencilGripHandle
                                    ? doassesmentData.leadDoAssessmentModel[0]
                                        .pencilGripHandle
                                    : "--"}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Arty Beliver & Arty Dreamers */}
                      <div className="container-fluid">
                        <div className="row  m-3">
                          <h5 className="headColor mt-5 mb-4">
                            Arty Beliver & Arty Dreamers
                          </h5>
                          <div className="col-md-6 col-12">
                            <div className="row mb-2">
                              <div className="col-6 d-flex  align-items-center">
                                <p className="text-sm fw-medium ">
                                  Comprehending Of Instructions
                                </p>
                              </div>
                              <div className="col-6">
                                <p className="text-muted text-sm">
                                  :{" "}
                                  {doassesmentData &&
                                  doassesmentData.leadDoAssessmentModel &&
                                  doassesmentData.leadDoAssessmentModel.length >
                                    0 &&
                                  doassesmentData.leadDoAssessmentModel[0] &&
                                  doassesmentData.leadDoAssessmentModel[0]
                                    .comprehendingOfInstruction
                                    ? doassesmentData.leadDoAssessmentModel[0]
                                        .comprehendingOfInstruction
                                    : "--"}
                                </p>
                              </div>
                            </div>
                          </div>
                          <div className="col-md-6 col-12">
                            <div className="row mb-2">
                              <div className="col-6 d-flex  align-items-center">
                                <p className="text-sm fw-medium ">Remarks</p>
                              </div>
                              <div className="col-6">
                                <p className="text-muted text-sm">
                                  :{" "}
                                  {doassesmentData &&
                                  doassesmentData.leadDoAssessmentModel &&
                                  doassesmentData.leadDoAssessmentModel.length >
                                    0 &&
                                  doassesmentData.leadDoAssessmentModel[0] &&
                                  doassesmentData.leadDoAssessmentModel[0]
                                    .artyRemarks
                                    ? doassesmentData.leadDoAssessmentModel[0]
                                        .artyRemarks
                                    : "--"}
                                </p>
                              </div>
                            </div>
                          </div>
                          <div className="col-md-6 col-12">
                            <div className="row mb-2">
                              <div className="col-6 d-flex  align-items-center">
                                <p className="text-sm fw-medium ">
                                  Verbal Language Development
                                </p>
                              </div>
                              <div className="col-6">
                                <p className="text-muted text-sm">
                                  :{" "}
                                  {doassesmentData &&
                                  doassesmentData.leadDoAssessmentModel &&
                                  doassesmentData.leadDoAssessmentModel.length >
                                    0 &&
                                  doassesmentData.leadDoAssessmentModel[0] &&
                                  doassesmentData.leadDoAssessmentModel[0]
                                    .verbalLanguageDevelopment
                                    ? doassesmentData.leadDoAssessmentModel[0]
                                        .verbalLanguageDevelopment
                                    : "--"}
                                </p>
                              </div>
                            </div>
                          </div>
                          <div className="col-md-6 col-12">
                            <div className="row mb-2">
                              <div className="col-6 d-flex  align-items-center">
                                <p className="text-sm fw-medium ">
                                  Attention Milestone
                                </p>
                              </div>
                              <div className="col-6">
                                <p className="text-muted text-sm">
                                  :{" "}
                                  {doassesmentData &&
                                  doassesmentData.leadDoAssessmentModel &&
                                  doassesmentData.leadDoAssessmentModel.length >
                                    0 &&
                                  doassesmentData.leadDoAssessmentModel[0] &&
                                  doassesmentData.leadDoAssessmentModel[0]
                                    .attentionMilestone
                                    ? doassesmentData.leadDoAssessmentModel[0]
                                        .attentionMilestone
                                    : "--"}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Alphabet */}
                      {doassesmentData.leadDoAssessmentAlphabet &&
                      doassesmentData.leadDoAssessmentAlphabet.length > 0 ? (
                        <div className="container-fluid">
                          <div className="row  m-3">
                            <h5 className="headColor mt-5 mb-4">Alphabet</h5>
                            <div className="table-responsive">
                              <table class="table">
                                <thead className="table-warning">
                                  <tr>
                                    <th scope="col">Alphabets</th>
                                    <th scope="col">A</th>
                                    <th scope="col">B</th>
                                    <th scope="col">C</th>
                                    <th scope="col">D</th>
                                    <th scope="col">E</th>
                                    <th scope="col">F</th>
                                    <th scope="col">G</th>
                                    <th scope="col">H</th>
                                    <th scope="col">I</th>
                                    <th scope="col">J</th>
                                    <th scope="col">K</th>
                                    <th scope="col">L</th>
                                    <th scope="col">M</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  <tr>
                                    <th scope="row">Recognition of sounds</th>
                                    <td>
                                      {doassesmentData &&
                                      doassesmentData.leadDoAssessmentModel &&
                                      doassesmentData.leadDoAssessmentModel
                                        .length > 0 &&
                                      doassesmentData
                                        .leadDoAssessmentModel[0] &&
                                      doassesmentData.leadDoAssessmentAlphabet &&
                                      doassesmentData
                                        .leadDoAssessmentAlphabet[0] &&
                                      doassesmentData.leadDoAssessmentAlphabet &&
                                      doassesmentData
                                        .leadDoAssessmentAlphabet[0] &&
                                      doassesmentData
                                        .leadDoAssessmentAlphabet[0]
                                        .recognitionOfSoundA ? (
                                        <TiTick
                                          style={{
                                            color: "green",
                                            fontSize: "25px",
                                          }}
                                        />
                                      ) : (
                                        <ImCross style={{ color: "red" }} />
                                      )}
                                    </td>
                                    <td>
                                      {doassesmentData &&
                                      doassesmentData.leadDoAssessmentModel &&
                                      doassesmentData.leadDoAssessmentModel
                                        .length > 0 &&
                                      doassesmentData
                                        .leadDoAssessmentModel[0] &&
                                      doassesmentData.leadDoAssessmentAlphabet &&
                                      doassesmentData
                                        .leadDoAssessmentAlphabet[0] &&
                                      doassesmentData
                                        .leadDoAssessmentAlphabet[0]
                                        .recognitionOfSoundB ? (
                                        <TiTick
                                          style={{
                                            color: "green",
                                            fontSize: "25px",
                                          }}
                                        />
                                      ) : (
                                        <ImCross style={{ color: "red" }} />
                                      )}
                                    </td>
                                    <td>
                                      {doassesmentData &&
                                      doassesmentData.leadDoAssessmentModel &&
                                      doassesmentData.leadDoAssessmentModel
                                        .length > 0 &&
                                      doassesmentData
                                        .leadDoAssessmentModel[0] &&
                                      doassesmentData.leadDoAssessmentAlphabet &&
                                      doassesmentData
                                        .leadDoAssessmentAlphabet[0] &&
                                      doassesmentData
                                        .leadDoAssessmentAlphabet[0]
                                        .recognitionOfSoundC ? (
                                        <TiTick
                                          style={{
                                            color: "green",
                                            fontSize: "25px",
                                          }}
                                        />
                                      ) : (
                                        <ImCross style={{ color: "red" }} />
                                      )}
                                    </td>
                                    <td>
                                      {doassesmentData &&
                                      doassesmentData.leadDoAssessmentModel &&
                                      doassesmentData.leadDoAssessmentModel
                                        .length > 0 &&
                                      doassesmentData
                                        .leadDoAssessmentModel[0] &&
                                      doassesmentData.leadDoAssessmentAlphabet &&
                                      doassesmentData
                                        .leadDoAssessmentAlphabet[0] &&
                                      doassesmentData
                                        .leadDoAssessmentAlphabet[0]
                                        .recognitionOfSoundD ? (
                                        <TiTick
                                          style={{
                                            color: "green",
                                            fontSize: "25px",
                                          }}
                                        />
                                      ) : (
                                        <ImCross style={{ color: "red" }} />
                                      )}
                                    </td>
                                    <td>
                                      {doassesmentData &&
                                      doassesmentData.leadDoAssessmentModel &&
                                      doassesmentData.leadDoAssessmentModel
                                        .length > 0 &&
                                      doassesmentData
                                        .leadDoAssessmentModel[0] &&
                                      doassesmentData.leadDoAssessmentAlphabet &&
                                      doassesmentData
                                        .leadDoAssessmentAlphabet[0] &&
                                      doassesmentData
                                        .leadDoAssessmentAlphabet[0]
                                        .recognitionOfSoundE ? (
                                        <TiTick
                                          style={{
                                            color: "green",
                                            fontSize: "25px",
                                          }}
                                        />
                                      ) : (
                                        <ImCross style={{ color: "red" }} />
                                      )}
                                    </td>
                                    <td>
                                      {doassesmentData &&
                                      doassesmentData.leadDoAssessmentModel &&
                                      doassesmentData.leadDoAssessmentModel
                                        .length > 0 &&
                                      doassesmentData
                                        .leadDoAssessmentModel[0] &&
                                      doassesmentData.leadDoAssessmentAlphabet &&
                                      doassesmentData
                                        .leadDoAssessmentAlphabet[0] &&
                                      doassesmentData
                                        .leadDoAssessmentAlphabet[0]
                                        .recognitionOfSoundF ? (
                                        <TiTick
                                          style={{
                                            color: "green",
                                            fontSize: "25px",
                                          }}
                                        />
                                      ) : (
                                        <ImCross style={{ color: "red" }} />
                                      )}
                                    </td>
                                    <td>
                                      {doassesmentData &&
                                      doassesmentData.leadDoAssessmentModel &&
                                      doassesmentData.leadDoAssessmentModel
                                        .length > 0 &&
                                      doassesmentData
                                        .leadDoAssessmentModel[0] &&
                                      doassesmentData.leadDoAssessmentAlphabet &&
                                      doassesmentData
                                        .leadDoAssessmentAlphabet[0] &&
                                      doassesmentData
                                        .leadDoAssessmentAlphabet[0]
                                        .recognitionOfSoundG ? (
                                        <TiTick
                                          style={{
                                            color: "green",
                                            fontSize: "25px",
                                          }}
                                        />
                                      ) : (
                                        <ImCross style={{ color: "red" }} />
                                      )}
                                    </td>
                                    <td>
                                      {doassesmentData &&
                                      doassesmentData.leadDoAssessmentModel &&
                                      doassesmentData.leadDoAssessmentModel
                                        .length > 0 &&
                                      doassesmentData
                                        .leadDoAssessmentModel[0] &&
                                      doassesmentData.leadDoAssessmentAlphabet &&
                                      doassesmentData
                                        .leadDoAssessmentAlphabet[0] &&
                                      doassesmentData
                                        .leadDoAssessmentAlphabet[0]
                                        .recognitionOfSoundH ? (
                                        <TiTick
                                          style={{
                                            color: "green",
                                            fontSize: "25px",
                                          }}
                                        />
                                      ) : (
                                        <ImCross style={{ color: "red" }} />
                                      )}
                                    </td>
                                    <td>
                                      {doassesmentData &&
                                      doassesmentData.leadDoAssessmentModel &&
                                      doassesmentData.leadDoAssessmentModel
                                        .length > 0 &&
                                      doassesmentData
                                        .leadDoAssessmentModel[0] &&
                                      doassesmentData.leadDoAssessmentAlphabet &&
                                      doassesmentData
                                        .leadDoAssessmentAlphabet[0] &&
                                      doassesmentData
                                        .leadDoAssessmentAlphabet[0]
                                        .recognitionOfSoundI ? (
                                        <TiTick
                                          style={{
                                            color: "green",
                                            fontSize: "25px",
                                          }}
                                        />
                                      ) : (
                                        <ImCross style={{ color: "red" }} />
                                      )}
                                    </td>
                                    <td>
                                      {doassesmentData &&
                                      doassesmentData.leadDoAssessmentModel &&
                                      doassesmentData.leadDoAssessmentModel
                                        .length > 0 &&
                                      doassesmentData
                                        .leadDoAssessmentModel[0] &&
                                      doassesmentData.leadDoAssessmentAlphabet &&
                                      doassesmentData
                                        .leadDoAssessmentAlphabet[0] &&
                                      doassesmentData
                                        .leadDoAssessmentAlphabet[0]
                                        .recognitionOfSoundJ ? (
                                        <TiTick
                                          style={{
                                            color: "green",
                                            fontSize: "25px",
                                          }}
                                        />
                                      ) : (
                                        <ImCross style={{ color: "red" }} />
                                      )}
                                    </td>
                                    <td>
                                      {doassesmentData &&
                                      doassesmentData.leadDoAssessmentModel &&
                                      doassesmentData.leadDoAssessmentModel
                                        .length > 0 &&
                                      doassesmentData
                                        .leadDoAssessmentModel[0] &&
                                      doassesmentData.leadDoAssessmentAlphabet &&
                                      doassesmentData
                                        .leadDoAssessmentAlphabet[0] &&
                                      doassesmentData
                                        .leadDoAssessmentAlphabet[0]
                                        .recognitionOfSoundK ? (
                                        <TiTick
                                          style={{
                                            color: "green",
                                            fontSize: "25px",
                                          }}
                                        />
                                      ) : (
                                        <ImCross style={{ color: "red" }} />
                                      )}
                                    </td>
                                    <td>
                                      {doassesmentData &&
                                      doassesmentData.leadDoAssessmentModel &&
                                      doassesmentData.leadDoAssessmentModel
                                        .length > 0 &&
                                      doassesmentData
                                        .leadDoAssessmentModel[0] &&
                                      doassesmentData.leadDoAssessmentAlphabet &&
                                      doassesmentData
                                        .leadDoAssessmentAlphabet[0] &&
                                      doassesmentData
                                        .leadDoAssessmentAlphabet[0]
                                        .recognitionOfSoundL ? (
                                        <TiTick
                                          style={{
                                            color: "green",
                                            fontSize: "25px",
                                          }}
                                        />
                                      ) : (
                                        <ImCross style={{ color: "red" }} />
                                      )}
                                    </td>
                                    <td>
                                      {doassesmentData &&
                                      doassesmentData.leadDoAssessmentModel &&
                                      doassesmentData.leadDoAssessmentModel
                                        .length > 0 &&
                                      doassesmentData
                                        .leadDoAssessmentModel[0] &&
                                      doassesmentData.leadDoAssessmentAlphabet &&
                                      doassesmentData
                                        .leadDoAssessmentAlphabet[0] &&
                                      doassesmentData
                                        .leadDoAssessmentAlphabet[0]
                                        .recognitionOfSoundM ? (
                                        <TiTick
                                          style={{
                                            color: "green",
                                            fontSize: "25px",
                                          }}
                                        />
                                      ) : (
                                        <ImCross style={{ color: "red" }} />
                                      )}
                                    </td>
                                  </tr>
                                  <tr>
                                    <th scope="row">Recognition of letters</th>
                                    <td>
                                      {doassesmentData &&
                                      doassesmentData.leadDoAssessmentModel &&
                                      doassesmentData.leadDoAssessmentModel
                                        .length > 0 &&
                                      doassesmentData
                                        .leadDoAssessmentModel[0] &&
                                      doassesmentData.leadDoAssessmentAlphabet &&
                                      doassesmentData
                                        .leadDoAssessmentAlphabet[0] &&
                                      doassesmentData
                                        .leadDoAssessmentAlphabet[0]
                                        .recognitionOfLetterA ? (
                                        <TiTick
                                          style={{
                                            color: "green",
                                            fontSize: "25px",
                                          }}
                                        />
                                      ) : (
                                        <ImCross style={{ color: "red" }} />
                                      )}
                                    </td>
                                    <td>
                                      {doassesmentData &&
                                      doassesmentData.leadDoAssessmentModel &&
                                      doassesmentData.leadDoAssessmentModel
                                        .length > 0 &&
                                      doassesmentData
                                        .leadDoAssessmentModel[0] &&
                                      doassesmentData.leadDoAssessmentAlphabet &&
                                      doassesmentData
                                        .leadDoAssessmentAlphabet[0] &&
                                      doassesmentData
                                        .leadDoAssessmentAlphabet[0]
                                        .recognitionOfLetterB ? (
                                        <TiTick
                                          style={{
                                            color: "green",
                                            fontSize: "25px",
                                          }}
                                        />
                                      ) : (
                                        <ImCross style={{ color: "red" }} />
                                      )}
                                    </td>
                                    <td>
                                      {doassesmentData &&
                                      doassesmentData.leadDoAssessmentModel &&
                                      doassesmentData.leadDoAssessmentModel
                                        .length > 0 &&
                                      doassesmentData
                                        .leadDoAssessmentModel[0] &&
                                      doassesmentData.leadDoAssessmentAlphabet &&
                                      doassesmentData
                                        .leadDoAssessmentAlphabet[0] &&
                                      doassesmentData
                                        .leadDoAssessmentAlphabet[0]
                                        .recognitionOfLetterC ? (
                                        <TiTick
                                          style={{
                                            color: "green",
                                            fontSize: "25px",
                                          }}
                                        />
                                      ) : (
                                        <ImCross style={{ color: "red" }} />
                                      )}
                                    </td>
                                    <td>
                                      {doassesmentData &&
                                      doassesmentData.leadDoAssessmentModel &&
                                      doassesmentData.leadDoAssessmentModel
                                        .length > 0 &&
                                      doassesmentData
                                        .leadDoAssessmentModel[0] &&
                                      doassesmentData.leadDoAssessmentAlphabet &&
                                      doassesmentData
                                        .leadDoAssessmentAlphabet[0] &&
                                      doassesmentData
                                        .leadDoAssessmentAlphabet[0]
                                        .recognitionOfLetterD ? (
                                        <TiTick
                                          style={{
                                            color: "green",
                                            fontSize: "25px",
                                          }}
                                        />
                                      ) : (
                                        <ImCross style={{ color: "red" }} />
                                      )}
                                    </td>
                                    <td>
                                      {doassesmentData &&
                                      doassesmentData.leadDoAssessmentModel &&
                                      doassesmentData.leadDoAssessmentModel
                                        .length > 0 &&
                                      doassesmentData
                                        .leadDoAssessmentModel[0] &&
                                      doassesmentData.leadDoAssessmentAlphabet &&
                                      doassesmentData
                                        .leadDoAssessmentAlphabet[0] &&
                                      doassesmentData
                                        .leadDoAssessmentAlphabet[0]
                                        .recognitionOfLetterE ? (
                                        <TiTick
                                          style={{
                                            color: "green",
                                            fontSize: "25px",
                                          }}
                                        />
                                      ) : (
                                        <ImCross style={{ color: "red" }} />
                                      )}
                                    </td>
                                    <td>
                                      {doassesmentData &&
                                      doassesmentData.leadDoAssessmentModel &&
                                      doassesmentData.leadDoAssessmentModel
                                        .length > 0 &&
                                      doassesmentData
                                        .leadDoAssessmentModel[0] &&
                                      doassesmentData.leadDoAssessmentAlphabet &&
                                      doassesmentData
                                        .leadDoAssessmentAlphabet[0] &&
                                      doassesmentData
                                        .leadDoAssessmentAlphabet[0]
                                        .recognitionOfLetterF ? (
                                        <TiTick
                                          style={{
                                            color: "green",
                                            fontSize: "25px",
                                          }}
                                        />
                                      ) : (
                                        <ImCross style={{ color: "red" }} />
                                      )}
                                    </td>
                                    <td>
                                      {doassesmentData &&
                                      doassesmentData.leadDoAssessmentModel &&
                                      doassesmentData.leadDoAssessmentModel
                                        .length > 0 &&
                                      doassesmentData
                                        .leadDoAssessmentModel[0] &&
                                      doassesmentData.leadDoAssessmentAlphabet &&
                                      doassesmentData
                                        .leadDoAssessmentAlphabet[0] &&
                                      doassesmentData
                                        .leadDoAssessmentAlphabet[0]
                                        .recognitionOfLetterG ? (
                                        <TiTick
                                          style={{
                                            color: "green",
                                            fontSize: "25px",
                                          }}
                                        />
                                      ) : (
                                        <ImCross style={{ color: "red" }} />
                                      )}
                                    </td>
                                    <td>
                                      {doassesmentData &&
                                      doassesmentData.leadDoAssessmentModel &&
                                      doassesmentData.leadDoAssessmentModel
                                        .length > 0 &&
                                      doassesmentData
                                        .leadDoAssessmentModel[0] &&
                                      doassesmentData.leadDoAssessmentAlphabet &&
                                      doassesmentData
                                        .leadDoAssessmentAlphabet[0] &&
                                      doassesmentData
                                        .leadDoAssessmentAlphabet[0]
                                        .recognitionOfLetterH ? (
                                        <TiTick
                                          style={{
                                            color: "green",
                                            fontSize: "25px",
                                          }}
                                        />
                                      ) : (
                                        <ImCross style={{ color: "red" }} />
                                      )}
                                    </td>
                                    <td>
                                      {doassesmentData &&
                                      doassesmentData.leadDoAssessmentModel &&
                                      doassesmentData.leadDoAssessmentModel
                                        .length > 0 &&
                                      doassesmentData
                                        .leadDoAssessmentModel[0] &&
                                      doassesmentData.leadDoAssessmentAlphabet &&
                                      doassesmentData
                                        .leadDoAssessmentAlphabet[0] &&
                                      doassesmentData
                                        .leadDoAssessmentAlphabet[0]
                                        .recognitionOfLetterI ? (
                                        <TiTick
                                          style={{
                                            color: "green",
                                            fontSize: "25px",
                                          }}
                                        />
                                      ) : (
                                        <ImCross style={{ color: "red" }} />
                                      )}
                                    </td>
                                    <td>
                                      {doassesmentData &&
                                      doassesmentData.leadDoAssessmentModel &&
                                      doassesmentData.leadDoAssessmentModel
                                        .length > 0 &&
                                      doassesmentData
                                        .leadDoAssessmentModel[0] &&
                                      doassesmentData.leadDoAssessmentAlphabet &&
                                      doassesmentData
                                        .leadDoAssessmentAlphabet[0] &&
                                      doassesmentData
                                        .leadDoAssessmentAlphabet[0]
                                        .recognitionOfLetterJ ? (
                                        <TiTick
                                          style={{
                                            color: "green",
                                            fontSize: "25px",
                                          }}
                                        />
                                      ) : (
                                        <ImCross style={{ color: "red" }} />
                                      )}
                                    </td>
                                    <td>
                                      {doassesmentData &&
                                      doassesmentData.leadDoAssessmentModel &&
                                      doassesmentData.leadDoAssessmentModel
                                        .length > 0 &&
                                      doassesmentData
                                        .leadDoAssessmentModel[0] &&
                                      doassesmentData.leadDoAssessmentAlphabet &&
                                      doassesmentData
                                        .leadDoAssessmentAlphabet[0] &&
                                      doassesmentData
                                        .leadDoAssessmentAlphabet[0]
                                        .recognitionOfLetterK ? (
                                        <TiTick
                                          style={{
                                            color: "green",
                                            fontSize: "25px",
                                          }}
                                        />
                                      ) : (
                                        <ImCross style={{ color: "red" }} />
                                      )}
                                    </td>
                                    <td>
                                      {doassesmentData &&
                                      doassesmentData.leadDoAssessmentModel &&
                                      doassesmentData.leadDoAssessmentModel
                                        .length > 0 &&
                                      doassesmentData
                                        .leadDoAssessmentModel[0] &&
                                      doassesmentData.leadDoAssessmentAlphabet &&
                                      doassesmentData
                                        .leadDoAssessmentAlphabet[0] &&
                                      doassesmentData
                                        .leadDoAssessmentAlphabet[0]
                                        .recognitionOfLetterL ? (
                                        <TiTick
                                          style={{
                                            color: "green",
                                            fontSize: "25px",
                                          }}
                                        />
                                      ) : (
                                        <ImCross style={{ color: "red" }} />
                                      )}
                                    </td>
                                    <td>
                                      {doassesmentData &&
                                      doassesmentData.leadDoAssessmentModel &&
                                      doassesmentData.leadDoAssessmentModel
                                        .length > 0 &&
                                      doassesmentData
                                        .leadDoAssessmentModel[0] &&
                                      doassesmentData.leadDoAssessmentAlphabet &&
                                      doassesmentData
                                        .leadDoAssessmentAlphabet[0] &&
                                      doassesmentData
                                        .leadDoAssessmentAlphabet[0]
                                        .recognitionOfLetterM ? (
                                        <TiTick
                                          style={{
                                            color: "green",
                                            fontSize: "25px",
                                          }}
                                        />
                                      ) : (
                                        <ImCross style={{ color: "red" }} />
                                      )}
                                    </td>
                                  </tr>
                                  <tr>
                                    <th scope="row">Writing</th>
                                    <td>
                                      {doassesmentData &&
                                      doassesmentData.leadDoAssessmentModel &&
                                      doassesmentData.leadDoAssessmentModel
                                        .length > 0 &&
                                      doassesmentData
                                        .leadDoAssessmentModel[0] &&
                                      doassesmentData.leadDoAssessmentAlphabet &&
                                      doassesmentData
                                        .leadDoAssessmentAlphabet[0] &&
                                      doassesmentData
                                        .leadDoAssessmentAlphabet[0]
                                        .writingLetterA ? (
                                        <TiTick
                                          style={{
                                            color: "green",
                                            fontSize: "25px",
                                          }}
                                        />
                                      ) : (
                                        <ImCross style={{ color: "red" }} />
                                      )}
                                    </td>
                                    <td>
                                      {doassesmentData &&
                                      doassesmentData.leadDoAssessmentModel &&
                                      doassesmentData.leadDoAssessmentModel
                                        .length > 0 &&
                                      doassesmentData
                                        .leadDoAssessmentModel[0] &&
                                      doassesmentData.leadDoAssessmentAlphabet &&
                                      doassesmentData
                                        .leadDoAssessmentAlphabet[0] &&
                                      doassesmentData
                                        .leadDoAssessmentAlphabet[0]
                                        .writingLetterB ? (
                                        <TiTick
                                          style={{
                                            color: "green",
                                            fontSize: "25px",
                                          }}
                                        />
                                      ) : (
                                        <ImCross style={{ color: "red" }} />
                                      )}
                                    </td>
                                    <td>
                                      {doassesmentData &&
                                      doassesmentData.leadDoAssessmentModel &&
                                      doassesmentData.leadDoAssessmentModel
                                        .length > 0 &&
                                      doassesmentData
                                        .leadDoAssessmentModel[0] &&
                                      doassesmentData.leadDoAssessmentAlphabet &&
                                      doassesmentData
                                        .leadDoAssessmentAlphabet[0] &&
                                      doassesmentData
                                        .leadDoAssessmentAlphabet[0]
                                        .writingLetterC ? (
                                        <TiTick
                                          style={{
                                            color: "green",
                                            fontSize: "25px",
                                          }}
                                        />
                                      ) : (
                                        <ImCross style={{ color: "red" }} />
                                      )}
                                    </td>
                                    <td>
                                      {doassesmentData &&
                                      doassesmentData.leadDoAssessmentModel &&
                                      doassesmentData.leadDoAssessmentModel
                                        .length > 0 &&
                                      doassesmentData
                                        .leadDoAssessmentModel[0] &&
                                      doassesmentData.leadDoAssessmentAlphabet &&
                                      doassesmentData
                                        .leadDoAssessmentAlphabet[0] &&
                                      doassesmentData
                                        .leadDoAssessmentAlphabet[0]
                                        .writingLetterD ? (
                                        <TiTick
                                          style={{
                                            color: "green",
                                            fontSize: "25px",
                                          }}
                                        />
                                      ) : (
                                        <ImCross style={{ color: "red" }} />
                                      )}
                                    </td>
                                    <td>
                                      {doassesmentData &&
                                      doassesmentData.leadDoAssessmentModel &&
                                      doassesmentData.leadDoAssessmentModel
                                        .length > 0 &&
                                      doassesmentData
                                        .leadDoAssessmentModel[0] &&
                                      doassesmentData.leadDoAssessmentAlphabet &&
                                      doassesmentData
                                        .leadDoAssessmentAlphabet[0] &&
                                      doassesmentData
                                        .leadDoAssessmentAlphabet[0]
                                        .writingLetterE ? (
                                        <TiTick
                                          style={{
                                            color: "green",
                                            fontSize: "25px",
                                          }}
                                        />
                                      ) : (
                                        <ImCross style={{ color: "red" }} />
                                      )}
                                    </td>
                                    <td>
                                      {doassesmentData &&
                                      doassesmentData.leadDoAssessmentModel &&
                                      doassesmentData.leadDoAssessmentModel
                                        .length > 0 &&
                                      doassesmentData
                                        .leadDoAssessmentModel[0] &&
                                      doassesmentData.leadDoAssessmentAlphabet &&
                                      doassesmentData
                                        .leadDoAssessmentAlphabet[0] &&
                                      doassesmentData
                                        .leadDoAssessmentAlphabet[0]
                                        .writingLetterF ? (
                                        <TiTick
                                          style={{
                                            color: "green",
                                            fontSize: "25px",
                                          }}
                                        />
                                      ) : (
                                        <ImCross style={{ color: "red" }} />
                                      )}
                                    </td>
                                    <td>
                                      {doassesmentData &&
                                      doassesmentData.leadDoAssessmentModel &&
                                      doassesmentData.leadDoAssessmentModel
                                        .length > 0 &&
                                      doassesmentData
                                        .leadDoAssessmentModel[0] &&
                                      doassesmentData.leadDoAssessmentAlphabet &&
                                      doassesmentData
                                        .leadDoAssessmentAlphabet[0] &&
                                      doassesmentData
                                        .leadDoAssessmentAlphabet[0]
                                        .writingLetterG ? (
                                        <TiTick
                                          style={{
                                            color: "green",
                                            fontSize: "25px",
                                          }}
                                        />
                                      ) : (
                                        <ImCross style={{ color: "red" }} />
                                      )}
                                    </td>
                                    <td>
                                      {doassesmentData &&
                                      doassesmentData.leadDoAssessmentModel &&
                                      doassesmentData.leadDoAssessmentModel
                                        .length > 0 &&
                                      doassesmentData
                                        .leadDoAssessmentModel[0] &&
                                      doassesmentData.leadDoAssessmentAlphabet &&
                                      doassesmentData
                                        .leadDoAssessmentAlphabet[0] &&
                                      doassesmentData
                                        .leadDoAssessmentAlphabet[0]
                                        .writingLetterH ? (
                                        <TiTick
                                          style={{
                                            color: "green",
                                            fontSize: "25px",
                                          }}
                                        />
                                      ) : (
                                        <ImCross style={{ color: "red" }} />
                                      )}
                                    </td>
                                    <td>
                                      {doassesmentData &&
                                      doassesmentData.leadDoAssessmentModel &&
                                      doassesmentData.leadDoAssessmentModel
                                        .length > 0 &&
                                      doassesmentData
                                        .leadDoAssessmentModel[0] &&
                                      doassesmentData.leadDoAssessmentAlphabet &&
                                      doassesmentData
                                        .leadDoAssessmentAlphabet[0] &&
                                      doassesmentData
                                        .leadDoAssessmentAlphabet[0]
                                        .writingLetterI ? (
                                        <TiTick
                                          style={{
                                            color: "green",
                                            fontSize: "25px",
                                          }}
                                        />
                                      ) : (
                                        <ImCross style={{ color: "red" }} />
                                      )}
                                    </td>
                                    <td>
                                      {doassesmentData &&
                                      doassesmentData.leadDoAssessmentModel &&
                                      doassesmentData.leadDoAssessmentModel
                                        .length > 0 &&
                                      doassesmentData
                                        .leadDoAssessmentModel[0] &&
                                      doassesmentData.leadDoAssessmentAlphabet &&
                                      doassesmentData
                                        .leadDoAssessmentAlphabet[0] &&
                                      doassesmentData
                                        .leadDoAssessmentAlphabet[0]
                                        .writingLetterJ ? (
                                        <TiTick
                                          style={{
                                            color: "green",
                                            fontSize: "25px",
                                          }}
                                        />
                                      ) : (
                                        <ImCross style={{ color: "red" }} />
                                      )}
                                    </td>
                                    <td>
                                      {doassesmentData &&
                                      doassesmentData.leadDoAssessmentModel &&
                                      doassesmentData.leadDoAssessmentModel
                                        .length > 0 &&
                                      doassesmentData
                                        .leadDoAssessmentModel[0] &&
                                      doassesmentData.leadDoAssessmentAlphabet &&
                                      doassesmentData
                                        .leadDoAssessmentAlphabet[0] &&
                                      doassesmentData
                                        .leadDoAssessmentAlphabet[0]
                                        .writingLetterK ? (
                                        <TiTick
                                          style={{
                                            color: "green",
                                            fontSize: "25px",
                                          }}
                                        />
                                      ) : (
                                        <ImCross style={{ color: "red" }} />
                                      )}
                                    </td>
                                    <td>
                                      {doassesmentData &&
                                      doassesmentData.leadDoAssessmentModel &&
                                      doassesmentData.leadDoAssessmentModel
                                        .length > 0 &&
                                      doassesmentData
                                        .leadDoAssessmentModel[0] &&
                                      doassesmentData.leadDoAssessmentAlphabet &&
                                      doassesmentData
                                        .leadDoAssessmentAlphabet[0] &&
                                      doassesmentData
                                        .leadDoAssessmentAlphabet[0]
                                        .writingLetterL ? (
                                        <TiTick
                                          style={{
                                            color: "green",
                                            fontSize: "25px",
                                          }}
                                        />
                                      ) : (
                                        <ImCross style={{ color: "red" }} />
                                      )}
                                    </td>
                                    <td>
                                      {doassesmentData &&
                                      doassesmentData.leadDoAssessmentModel &&
                                      doassesmentData.leadDoAssessmentModel
                                        .length > 0 &&
                                      doassesmentData
                                        .leadDoAssessmentModel[0] &&
                                      doassesmentData.leadDoAssessmentAlphabet &&
                                      doassesmentData
                                        .leadDoAssessmentAlphabet[0] &&
                                      doassesmentData
                                        .leadDoAssessmentAlphabet[0]
                                        .writingLetterM ? (
                                        <TiTick
                                          style={{
                                            color: "green",
                                            fontSize: "25px",
                                          }}
                                        />
                                      ) : (
                                        <ImCross style={{ color: "red" }} />
                                      )}
                                    </td>
                                  </tr>
                                  <tr>
                                    <th scope="row">Beginning Sound</th>
                                    <td>
                                      {doassesmentData &&
                                      doassesmentData.leadDoAssessmentModel &&
                                      doassesmentData.leadDoAssessmentModel
                                        .length > 0 &&
                                      doassesmentData
                                        .leadDoAssessmentModel[0] &&
                                      doassesmentData.leadDoAssessmentAlphabet &&
                                      doassesmentData
                                        .leadDoAssessmentAlphabet[0] &&
                                      doassesmentData
                                        .leadDoAssessmentAlphabet[0]
                                        .beginningSoundA ? (
                                        <TiTick
                                          style={{
                                            color: "green",
                                            fontSize: "25px",
                                          }}
                                        />
                                      ) : (
                                        <ImCross style={{ color: "red" }} />
                                      )}
                                    </td>
                                    <td>
                                      {doassesmentData &&
                                      doassesmentData.leadDoAssessmentModel &&
                                      doassesmentData.leadDoAssessmentModel
                                        .length > 0 &&
                                      doassesmentData
                                        .leadDoAssessmentModel[0] &&
                                      doassesmentData.leadDoAssessmentAlphabet &&
                                      doassesmentData
                                        .leadDoAssessmentAlphabet[0] &&
                                      doassesmentData
                                        .leadDoAssessmentAlphabet[0]
                                        .beginningSoundA ? (
                                        <TiTick
                                          style={{
                                            color: "green",
                                            fontSize: "25px",
                                          }}
                                        />
                                      ) : (
                                        <ImCross style={{ color: "red" }} />
                                      )}
                                    </td>
                                    <td>
                                      {doassesmentData &&
                                      doassesmentData.leadDoAssessmentModel &&
                                      doassesmentData.leadDoAssessmentModel
                                        .length > 0 &&
                                      doassesmentData
                                        .leadDoAssessmentModel[0] &&
                                      doassesmentData.leadDoAssessmentAlphabet &&
                                      doassesmentData
                                        .leadDoAssessmentAlphabet[0] &&
                                      doassesmentData
                                        .leadDoAssessmentAlphabet[0]
                                        .beginningSoundC ? (
                                        <TiTick
                                          style={{
                                            color: "green",
                                            fontSize: "25px",
                                          }}
                                        />
                                      ) : (
                                        <ImCross style={{ color: "red" }} />
                                      )}
                                    </td>
                                    <td>
                                      {doassesmentData &&
                                      doassesmentData.leadDoAssessmentModel &&
                                      doassesmentData.leadDoAssessmentModel
                                        .length > 0 &&
                                      doassesmentData
                                        .leadDoAssessmentModel[0] &&
                                      doassesmentData.leadDoAssessmentAlphabet &&
                                      doassesmentData
                                        .leadDoAssessmentAlphabet[0] &&
                                      doassesmentData
                                        .leadDoAssessmentAlphabet[0]
                                        .beginningSoundD ? (
                                        <TiTick
                                          style={{
                                            color: "green",
                                            fontSize: "25px",
                                          }}
                                        />
                                      ) : (
                                        <ImCross style={{ color: "red" }} />
                                      )}
                                    </td>
                                    <td>
                                      {doassesmentData &&
                                      doassesmentData.leadDoAssessmentModel &&
                                      doassesmentData.leadDoAssessmentModel
                                        .length > 0 &&
                                      doassesmentData
                                        .leadDoAssessmentModel[0] &&
                                      doassesmentData.leadDoAssessmentAlphabet &&
                                      doassesmentData
                                        .leadDoAssessmentAlphabet[0] &&
                                      doassesmentData
                                        .leadDoAssessmentAlphabet[0]
                                        .beginningSoundE ? (
                                        <TiTick
                                          style={{
                                            color: "green",
                                            fontSize: "25px",
                                          }}
                                        />
                                      ) : (
                                        <ImCross style={{ color: "red" }} />
                                      )}
                                    </td>
                                    <td>
                                      {doassesmentData &&
                                      doassesmentData.leadDoAssessmentModel &&
                                      doassesmentData.leadDoAssessmentModel
                                        .length > 0 &&
                                      doassesmentData
                                        .leadDoAssessmentModel[0] &&
                                      doassesmentData.leadDoAssessmentAlphabet &&
                                      doassesmentData
                                        .leadDoAssessmentAlphabet[0] &&
                                      doassesmentData
                                        .leadDoAssessmentAlphabet[0]
                                        .beginningSoundF ? (
                                        <TiTick
                                          style={{
                                            color: "green",
                                            fontSize: "25px",
                                          }}
                                        />
                                      ) : (
                                        <ImCross style={{ color: "red" }} />
                                      )}
                                    </td>
                                    <td>
                                      {doassesmentData &&
                                      doassesmentData.leadDoAssessmentModel &&
                                      doassesmentData.leadDoAssessmentModel
                                        .length > 0 &&
                                      doassesmentData
                                        .leadDoAssessmentModel[0] &&
                                      doassesmentData.leadDoAssessmentAlphabet &&
                                      doassesmentData
                                        .leadDoAssessmentAlphabet[0] &&
                                      doassesmentData
                                        .leadDoAssessmentAlphabet[0]
                                        .beginningSoundG ? (
                                        <TiTick
                                          style={{
                                            color: "green",
                                            fontSize: "25px",
                                          }}
                                        />
                                      ) : (
                                        <ImCross style={{ color: "red" }} />
                                      )}
                                    </td>
                                    <td>
                                      {doassesmentData &&
                                      doassesmentData.leadDoAssessmentModel &&
                                      doassesmentData.leadDoAssessmentModel
                                        .length > 0 &&
                                      doassesmentData
                                        .leadDoAssessmentModel[0] &&
                                      doassesmentData.leadDoAssessmentAlphabet &&
                                      doassesmentData
                                        .leadDoAssessmentAlphabet[0] &&
                                      doassesmentData
                                        .leadDoAssessmentAlphabet[0]
                                        .beginningSoundH ? (
                                        <TiTick
                                          style={{
                                            color: "green",
                                            fontSize: "25px",
                                          }}
                                        />
                                      ) : (
                                        <ImCross style={{ color: "red" }} />
                                      )}
                                    </td>
                                    <td>
                                      {doassesmentData &&
                                      doassesmentData.leadDoAssessmentModel &&
                                      doassesmentData.leadDoAssessmentModel
                                        .length > 0 &&
                                      doassesmentData
                                        .leadDoAssessmentModel[0] &&
                                      doassesmentData.leadDoAssessmentAlphabet &&
                                      doassesmentData
                                        .leadDoAssessmentAlphabet[0] &&
                                      doassesmentData
                                        .leadDoAssessmentAlphabet[0]
                                        .beginningSoundI ? (
                                        <TiTick
                                          style={{
                                            color: "green",
                                            fontSize: "25px",
                                          }}
                                        />
                                      ) : (
                                        <ImCross style={{ color: "red" }} />
                                      )}
                                    </td>
                                    <td>
                                      {doassesmentData &&
                                      doassesmentData.leadDoAssessmentModel &&
                                      doassesmentData.leadDoAssessmentModel
                                        .length > 0 &&
                                      doassesmentData
                                        .leadDoAssessmentModel[0] &&
                                      doassesmentData.leadDoAssessmentAlphabet &&
                                      doassesmentData
                                        .leadDoAssessmentAlphabet[0] &&
                                      doassesmentData
                                        .leadDoAssessmentAlphabet[0]
                                        .beginningSoundJ ? (
                                        <TiTick
                                          style={{
                                            color: "green",
                                            fontSize: "25px",
                                          }}
                                        />
                                      ) : (
                                        <ImCross style={{ color: "red" }} />
                                      )}
                                    </td>
                                    <td>
                                      {doassesmentData &&
                                      doassesmentData.leadDoAssessmentModel &&
                                      doassesmentData.leadDoAssessmentModel
                                        .length > 0 &&
                                      doassesmentData
                                        .leadDoAssessmentModel[0] &&
                                      doassesmentData.leadDoAssessmentAlphabet &&
                                      doassesmentData
                                        .leadDoAssessmentAlphabet[0] &&
                                      doassesmentData
                                        .leadDoAssessmentAlphabet[0]
                                        .beginningSoundK ? (
                                        <TiTick
                                          style={{
                                            color: "green",
                                            fontSize: "25px",
                                          }}
                                        />
                                      ) : (
                                        <ImCross style={{ color: "red" }} />
                                      )}
                                    </td>
                                    <td>
                                      {doassesmentData &&
                                      doassesmentData.leadDoAssessmentModel &&
                                      doassesmentData.leadDoAssessmentModel
                                        .length > 0 &&
                                      doassesmentData
                                        .leadDoAssessmentModel[0] &&
                                      doassesmentData.leadDoAssessmentAlphabet &&
                                      doassesmentData
                                        .leadDoAssessmentAlphabet[0] &&
                                      doassesmentData
                                        .leadDoAssessmentAlphabet[0]
                                        .beginningSoundL ? (
                                        <TiTick
                                          style={{
                                            color: "green",
                                            fontSize: "25px",
                                          }}
                                        />
                                      ) : (
                                        <ImCross style={{ color: "red" }} />
                                      )}
                                    </td>
                                    <td>
                                      {doassesmentData &&
                                      doassesmentData.leadDoAssessmentModel &&
                                      doassesmentData.leadDoAssessmentModel
                                        .length > 0 &&
                                      doassesmentData
                                        .leadDoAssessmentModel[0] &&
                                      doassesmentData.leadDoAssessmentAlphabet &&
                                      doassesmentData
                                        .leadDoAssessmentAlphabet[0] &&
                                      doassesmentData
                                        .leadDoAssessmentAlphabet[0]
                                        .beginningSoundM ? (
                                        <TiTick
                                          style={{
                                            color: "green",
                                            fontSize: "25px",
                                          }}
                                        />
                                      ) : (
                                        <ImCross style={{ color: "red" }} />
                                      )}
                                    </td>
                                  </tr>
                                  {/* <tr>
                                    <th scope="row">Written Strokes</th>
                                    <td>
                                      {doassesmentData &&
                                      doassesmentData.leadDoAssessmentModel &&
                                      doassesmentData.leadDoAssessmentModel
                                        .length > 0 &&
                                      doassesmentData
                                        .leadDoAssessmentModel[0] &&
                                      doassesmentData.leadDoAssessmentAlphabet &&
                                      doassesmentData
                                        .leadDoAssessmentAlphabet[0] &&
                                      doassesmentData
                                        .leadDoAssessmentAlphabet[0]
                                        .writingLetterA ? (
                                        <TiTick
                                          style={{
                                            color: "green",
                                            fontSize: "25px",
                                          }}
                                        />
                                      ) : (
                                        <ImCross style={{ color: "red" }} />
                                      )}
                                    </td>
                                    <td>
                                      {doassesmentData &&
                                      doassesmentData.leadDoAssessmentModel &&
                                      doassesmentData.leadDoAssessmentModel
                                        .length > 0 &&
                                      doassesmentData
                                        .leadDoAssessmentModel[0] &&
                                      doassesmentData.leadDoAssessmentAlphabet &&
                                      doassesmentData
                                        .leadDoAssessmentAlphabet[0] &&
                                      doassesmentData
                                        .leadDoAssessmentAlphabet[0]
                                        .writingLetterB ? (
                                        <TiTick
                                          style={{
                                            color: "green",
                                            fontSize: "25px",
                                          }}
                                        />
                                      ) : (
                                        <ImCross style={{ color: "red" }} />
                                      )}
                                    </td>
                                    <td>
                                      {doassesmentData &&
                                      doassesmentData.leadDoAssessmentModel &&
                                      doassesmentData.leadDoAssessmentModel
                                        .length > 0 &&
                                      doassesmentData
                                        .leadDoAssessmentModel[0] &&
                                      doassesmentData.leadDoAssessmentAlphabet &&
                                      doassesmentData
                                        .leadDoAssessmentAlphabet[0] &&
                                      doassesmentData
                                        .leadDoAssessmentAlphabet[0]
                                        .writingLetterC ? (
                                        <TiTick
                                          style={{
                                            color: "green",
                                            fontSize: "25px",
                                          }}
                                        />
                                      ) : (
                                        <ImCross style={{ color: "red" }} />
                                      )}
                                    </td>
                                    <td>
                                      {doassesmentData &&
                                      doassesmentData.leadDoAssessmentModel &&
                                      doassesmentData.leadDoAssessmentModel
                                        .length > 0 &&
                                      doassesmentData
                                        .leadDoAssessmentModel[0] &&
                                      doassesmentData.leadDoAssessmentAlphabet &&
                                      doassesmentData
                                        .leadDoAssessmentAlphabet[0] &&
                                      doassesmentData
                                        .leadDoAssessmentAlphabet[0]
                                        .writingLetterD ? (
                                        <TiTick
                                          style={{
                                            color: "green",
                                            fontSize: "25px",
                                          }}
                                        />
                                      ) : (
                                        <ImCross style={{ color: "red" }} />
                                      )}
                                    </td>
                                    <td>
                                      {doassesmentData &&
                                      doassesmentData.leadDoAssessmentModel &&
                                      doassesmentData.leadDoAssessmentModel
                                        .length > 0 &&
                                      doassesmentData
                                        .leadDoAssessmentModel[0] &&
                                      doassesmentData.leadDoAssessmentAlphabet &&
                                      doassesmentData
                                        .leadDoAssessmentAlphabet[0] &&
                                      doassesmentData
                                        .leadDoAssessmentAlphabet[0]
                                        .writingLetterE ? (
                                        <TiTick
                                          style={{
                                            color: "green",
                                            fontSize: "25px",
                                          }}
                                        />
                                      ) : (
                                        <ImCross style={{ color: "red" }} />
                                      )}
                                    </td>
                                    <td>
                                      {doassesmentData &&
                                      doassesmentData.leadDoAssessmentModel &&
                                      doassesmentData.leadDoAssessmentModel
                                        .length > 0 &&
                                      doassesmentData
                                        .leadDoAssessmentModel[0] &&
                                      doassesmentData.leadDoAssessmentAlphabet &&
                                      doassesmentData
                                        .leadDoAssessmentAlphabet[0] &&
                                      doassesmentData
                                        .leadDoAssessmentAlphabet[0]
                                        .writingLetterF ? (
                                        <TiTick
                                          style={{
                                            color: "green",
                                            fontSize: "25px",
                                          }}
                                        />
                                      ) : (
                                        <ImCross style={{ color: "red" }} />
                                      )}
                                    </td>
                                    <td>
                                      {doassesmentData &&
                                      doassesmentData.leadDoAssessmentModel &&
                                      doassesmentData.leadDoAssessmentModel
                                        .length > 0 &&
                                      doassesmentData
                                        .leadDoAssessmentModel[0] &&
                                      doassesmentData.leadDoAssessmentAlphabet &&
                                      doassesmentData
                                        .leadDoAssessmentAlphabet[0] &&
                                      doassesmentData
                                        .leadDoAssessmentAlphabet[0]
                                        .writingLetterG ? (
                                        <TiTick
                                          style={{
                                            color: "green",
                                            fontSize: "25px",
                                          }}
                                        />
                                      ) : (
                                        <ImCross style={{ color: "red" }} />
                                      )}
                                    </td>
                                    <td>
                                      {doassesmentData &&
                                      doassesmentData.leadDoAssessmentModel &&
                                      doassesmentData.leadDoAssessmentModel
                                        .length > 0 &&
                                      doassesmentData
                                        .leadDoAssessmentModel[0] &&
                                      doassesmentData.leadDoAssessmentAlphabet &&
                                      doassesmentData
                                        .leadDoAssessmentAlphabet[0] &&
                                      doassesmentData
                                        .leadDoAssessmentAlphabet[0]
                                        .writingLetterH ? (
                                        <TiTick
                                          style={{
                                            color: "green",
                                            fontSize: "25px",
                                          }}
                                        />
                                      ) : (
                                        <ImCross style={{ color: "red" }} />
                                      )}
                                    </td>
                                    <td>
                                      {doassesmentData &&
                                      doassesmentData.leadDoAssessmentModel &&
                                      doassesmentData.leadDoAssessmentModel
                                        .length > 0 &&
                                      doassesmentData
                                        .leadDoAssessmentModel[0] &&
                                      doassesmentData.leadDoAssessmentAlphabet &&
                                      doassesmentData
                                        .leadDoAssessmentAlphabet[0] &&
                                      doassesmentData
                                        .leadDoAssessmentAlphabet[0]
                                        .writingLetterI ? (
                                        <TiTick
                                          style={{
                                            color: "green",
                                            fontSize: "25px",
                                          }}
                                        />
                                      ) : (
                                        <ImCross style={{ color: "red" }} />
                                      )}
                                    </td>
                                    <td>
                                      {doassesmentData &&
                                      doassesmentData.leadDoAssessmentModel &&
                                      doassesmentData.leadDoAssessmentModel
                                        .length > 0 &&
                                      doassesmentData
                                        .leadDoAssessmentModel[0] &&
                                      doassesmentData.leadDoAssessmentAlphabet &&
                                      doassesmentData
                                        .leadDoAssessmentAlphabet[0] &&
                                      doassesmentData
                                        .leadDoAssessmentAlphabet[0]
                                        .writingLetterJ ? (
                                        <TiTick
                                          style={{
                                            color: "green",
                                            fontSize: "25px",
                                          }}
                                        />
                                      ) : (
                                        <ImCross style={{ color: "red" }} />
                                      )}
                                    </td>
                                    <td>
                                      {doassesmentData &&
                                      doassesmentData.leadDoAssessmentModel &&
                                      doassesmentData.leadDoAssessmentModel
                                        .length > 0 &&
                                      doassesmentData
                                        .leadDoAssessmentModel[0] &&
                                      doassesmentData.leadDoAssessmentAlphabet &&
                                      doassesmentData
                                        .leadDoAssessmentAlphabet[0] &&
                                      doassesmentData
                                        .leadDoAssessmentAlphabet[0]
                                        .writingLetterK ? (
                                        <TiTick
                                          style={{
                                            color: "green",
                                            fontSize: "25px",
                                          }}
                                        />
                                      ) : (
                                        <ImCross style={{ color: "red" }} />
                                      )}
                                    </td>
                                    <td>
                                      {doassesmentData &&
                                      doassesmentData.leadDoAssessmentModel &&
                                      doassesmentData.leadDoAssessmentModel
                                        .length > 0 &&
                                      doassesmentData
                                        .leadDoAssessmentModel[0] &&
                                      doassesmentData.leadDoAssessmentAlphabet &&
                                      doassesmentData
                                        .leadDoAssessmentAlphabet[0] &&
                                      doassesmentData
                                        .leadDoAssessmentAlphabet[0]
                                        .writingLetterL ? (
                                        <TiTick
                                          style={{
                                            color: "green",
                                            fontSize: "25px",
                                          }}
                                        />
                                      ) : (
                                        <ImCross style={{ color: "red" }} />
                                      )}
                                    </td>
                                    <td>
                                      {doassesmentData &&
                                      doassesmentData.leadDoAssessmentModel &&
                                      doassesmentData.leadDoAssessmentModel
                                        .length > 0 &&
                                      doassesmentData
                                        .leadDoAssessmentModel[0] &&
                                      doassesmentData.leadDoAssessmentAlphabet &&
                                      doassesmentData
                                        .leadDoAssessmentAlphabet[0] &&
                                      doassesmentData
                                        .leadDoAssessmentAlphabet[0]
                                        .writingLetterM ? (
                                        <TiTick
                                          style={{
                                            color: "green",
                                            fontSize: "25px",
                                          }}
                                        />
                                      ) : (
                                        <ImCross style={{ color: "red" }} />
                                      )}
                                    </td>
                                  </tr> */}
                                </tbody>
                              </table>
                            </div>
                            <div className="table-responsive">
                              <table class="table">
                                <thead className="table-warning">
                                  <tr>
                                    <th scope="col">Alphabets</th>
                                    <th scope="col">N</th>
                                    <th scope="col">O</th>
                                    <th scope="col">P</th>
                                    <th scope="col">Q</th>
                                    <th scope="col">R</th>
                                    <th scope="col">S</th>
                                    <th scope="col">T</th>
                                    <th scope="col">U</th>
                                    <th scope="col">V</th>
                                    <th scope="col">W</th>
                                    <th scope="col">X</th>
                                    <th scope="col">Y</th>
                                    <th scope="col">Z</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  <tr>
                                    <th scope="row">Recognition of sounds</th>
                                    <td>
                                      {doassesmentData &&
                                      doassesmentData.leadDoAssessmentModel &&
                                      doassesmentData.leadDoAssessmentModel
                                        .length > 0 &&
                                      doassesmentData
                                        .leadDoAssessmentModel[0] &&
                                      doassesmentData.leadDoAssessmentAlphabet &&
                                      doassesmentData
                                        .leadDoAssessmentAlphabet[0] &&
                                      doassesmentData
                                        .leadDoAssessmentAlphabet[0]
                                        .recognitionOfSoundN ? (
                                        <TiTick
                                          style={{
                                            color: "green",
                                            fontSize: "25px",
                                          }}
                                        />
                                      ) : (
                                        <ImCross style={{ color: "red" }} />
                                      )}
                                    </td>
                                    <td>
                                      {doassesmentData &&
                                      doassesmentData.leadDoAssessmentModel &&
                                      doassesmentData.leadDoAssessmentModel
                                        .length > 0 &&
                                      doassesmentData
                                        .leadDoAssessmentModel[0] &&
                                      doassesmentData.leadDoAssessmentAlphabet &&
                                      doassesmentData
                                        .leadDoAssessmentAlphabet[0] &&
                                      doassesmentData
                                        .leadDoAssessmentAlphabet[0]
                                        .recognitionOfSoundO ? (
                                        <TiTick
                                          style={{
                                            color: "green",
                                            fontSize: "25px",
                                          }}
                                        />
                                      ) : (
                                        <ImCross style={{ color: "red" }} />
                                      )}
                                    </td>
                                    <td>
                                      {doassesmentData &&
                                      doassesmentData.leadDoAssessmentModel &&
                                      doassesmentData.leadDoAssessmentModel
                                        .length > 0 &&
                                      doassesmentData
                                        .leadDoAssessmentModel[0] &&
                                      doassesmentData.leadDoAssessmentAlphabet &&
                                      doassesmentData
                                        .leadDoAssessmentAlphabet[0] &&
                                      doassesmentData
                                        .leadDoAssessmentAlphabet[0]
                                        .recognitionOfSoundP ? (
                                        <TiTick
                                          style={{
                                            color: "green",
                                            fontSize: "25px",
                                          }}
                                        />
                                      ) : (
                                        <ImCross style={{ color: "red" }} />
                                      )}
                                    </td>
                                    <td>
                                      {doassesmentData &&
                                      doassesmentData.leadDoAssessmentModel &&
                                      doassesmentData.leadDoAssessmentModel
                                        .length > 0 &&
                                      doassesmentData
                                        .leadDoAssessmentModel[0] &&
                                      doassesmentData.leadDoAssessmentAlphabet &&
                                      doassesmentData
                                        .leadDoAssessmentAlphabet[0] &&
                                      doassesmentData
                                        .leadDoAssessmentAlphabet[0]
                                        .recognitionOfSoundQ ? (
                                        <TiTick
                                          style={{
                                            color: "green",
                                            fontSize: "25px",
                                          }}
                                        />
                                      ) : (
                                        <ImCross style={{ color: "red" }} />
                                      )}
                                    </td>
                                    <td>
                                      {doassesmentData &&
                                      doassesmentData.leadDoAssessmentModel &&
                                      doassesmentData.leadDoAssessmentModel
                                        .length > 0 &&
                                      doassesmentData
                                        .leadDoAssessmentModel[0] &&
                                      doassesmentData.leadDoAssessmentAlphabet &&
                                      doassesmentData
                                        .leadDoAssessmentAlphabet[0] &&
                                      doassesmentData
                                        .leadDoAssessmentAlphabet[0]
                                        .recognitionOfSoundR ? (
                                        <TiTick
                                          style={{
                                            color: "green",
                                            fontSize: "25px",
                                          }}
                                        />
                                      ) : (
                                        <ImCross style={{ color: "red" }} />
                                      )}
                                    </td>
                                    <td>
                                      {doassesmentData &&
                                      doassesmentData.leadDoAssessmentModel &&
                                      doassesmentData.leadDoAssessmentModel
                                        .length > 0 &&
                                      doassesmentData
                                        .leadDoAssessmentModel[0] &&
                                      doassesmentData.leadDoAssessmentAlphabet &&
                                      doassesmentData
                                        .leadDoAssessmentAlphabet[0] &&
                                      doassesmentData
                                        .leadDoAssessmentAlphabet[0]
                                        .recognitionOfSoundS ? (
                                        <TiTick
                                          style={{
                                            color: "green",
                                            fontSize: "25px",
                                          }}
                                        />
                                      ) : (
                                        <ImCross style={{ color: "red" }} />
                                      )}
                                    </td>
                                    <td>
                                      {doassesmentData &&
                                      doassesmentData.leadDoAssessmentModel &&
                                      doassesmentData.leadDoAssessmentModel
                                        .length > 0 &&
                                      doassesmentData
                                        .leadDoAssessmentModel[0] &&
                                      doassesmentData.leadDoAssessmentAlphabet &&
                                      doassesmentData
                                        .leadDoAssessmentAlphabet[0] &&
                                      doassesmentData
                                        .leadDoAssessmentAlphabet[0]
                                        .recognitionOfSoundT ? (
                                        <TiTick
                                          style={{
                                            color: "green",
                                            fontSize: "25px",
                                          }}
                                        />
                                      ) : (
                                        <ImCross style={{ color: "red" }} />
                                      )}
                                    </td>
                                    <td>
                                      {doassesmentData &&
                                      doassesmentData.leadDoAssessmentModel &&
                                      doassesmentData.leadDoAssessmentModel
                                        .length > 0 &&
                                      doassesmentData
                                        .leadDoAssessmentModel[0] &&
                                      doassesmentData.leadDoAssessmentAlphabet &&
                                      doassesmentData
                                        .leadDoAssessmentAlphabet[0] &&
                                      doassesmentData
                                        .leadDoAssessmentAlphabet[0]
                                        .recognitionOfSoundU ? (
                                        <TiTick
                                          style={{
                                            color: "green",
                                            fontSize: "25px",
                                          }}
                                        />
                                      ) : (
                                        <ImCross style={{ color: "red" }} />
                                      )}
                                    </td>
                                    <td>
                                      {doassesmentData &&
                                      doassesmentData.leadDoAssessmentModel &&
                                      doassesmentData.leadDoAssessmentModel
                                        .length > 0 &&
                                      doassesmentData
                                        .leadDoAssessmentModel[0] &&
                                      doassesmentData.leadDoAssessmentAlphabet &&
                                      doassesmentData
                                        .leadDoAssessmentAlphabet[0] &&
                                      doassesmentData
                                        .leadDoAssessmentAlphabet[0]
                                        .recognitionOfSoundV ? (
                                        <TiTick
                                          style={{
                                            color: "green",
                                            fontSize: "25px",
                                          }}
                                        />
                                      ) : (
                                        <ImCross style={{ color: "red" }} />
                                      )}
                                    </td>
                                    <td>
                                      {doassesmentData &&
                                      doassesmentData.leadDoAssessmentModel &&
                                      doassesmentData.leadDoAssessmentModel
                                        .length > 0 &&
                                      doassesmentData
                                        .leadDoAssessmentModel[0] &&
                                      doassesmentData.leadDoAssessmentAlphabet &&
                                      doassesmentData
                                        .leadDoAssessmentAlphabet[0] &&
                                      doassesmentData
                                        .leadDoAssessmentAlphabet[0]
                                        .recognitionOfSoundW ? (
                                        <TiTick
                                          style={{
                                            color: "green",
                                            fontSize: "25px",
                                          }}
                                        />
                                      ) : (
                                        <ImCross style={{ color: "red" }} />
                                      )}
                                    </td>
                                    <td>
                                      {doassesmentData &&
                                      doassesmentData.leadDoAssessmentModel &&
                                      doassesmentData.leadDoAssessmentModel
                                        .length > 0 &&
                                      doassesmentData
                                        .leadDoAssessmentModel[0] &&
                                      doassesmentData.leadDoAssessmentAlphabet &&
                                      doassesmentData
                                        .leadDoAssessmentAlphabet[0] &&
                                      doassesmentData
                                        .leadDoAssessmentAlphabet[0]
                                        .recognitionOfSoundX ? (
                                        <TiTick
                                          style={{
                                            color: "green",
                                            fontSize: "25px",
                                          }}
                                        />
                                      ) : (
                                        <ImCross style={{ color: "red" }} />
                                      )}
                                    </td>
                                    <td>
                                      {doassesmentData &&
                                      doassesmentData.leadDoAssessmentModel &&
                                      doassesmentData.leadDoAssessmentModel
                                        .length > 0 &&
                                      doassesmentData
                                        .leadDoAssessmentModel[0] &&
                                      doassesmentData.leadDoAssessmentAlphabet &&
                                      doassesmentData
                                        .leadDoAssessmentAlphabet[0] &&
                                      doassesmentData
                                        .leadDoAssessmentAlphabet[0]
                                        .recognitionOfSoundY ? (
                                        <TiTick
                                          style={{
                                            color: "green",
                                            fontSize: "25px",
                                          }}
                                        />
                                      ) : (
                                        <ImCross style={{ color: "red" }} />
                                      )}
                                    </td>
                                    <td>
                                      {doassesmentData &&
                                      doassesmentData.leadDoAssessmentModel &&
                                      doassesmentData.leadDoAssessmentModel
                                        .length > 0 &&
                                      doassesmentData
                                        .leadDoAssessmentModel[0] &&
                                      doassesmentData.leadDoAssessmentAlphabet &&
                                      doassesmentData
                                        .leadDoAssessmentAlphabet[0] &&
                                      doassesmentData
                                        .leadDoAssessmentAlphabet[0]
                                        .recognitionOfSoundZ ? (
                                        <TiTick
                                          style={{
                                            color: "green",
                                            fontSize: "25px",
                                          }}
                                        />
                                      ) : (
                                        <ImCross style={{ color: "red" }} />
                                      )}
                                    </td>
                                  </tr>
                                  <tr>
                                    <th scope="row">Recognition of letters</th>
                                    <td>
                                      {doassesmentData &&
                                      doassesmentData.leadDoAssessmentModel &&
                                      doassesmentData.leadDoAssessmentModel
                                        .length > 0 &&
                                      doassesmentData
                                        .leadDoAssessmentModel[0] &&
                                      doassesmentData.leadDoAssessmentAlphabet &&
                                      doassesmentData
                                        .leadDoAssessmentAlphabet[0] &&
                                      doassesmentData
                                        .leadDoAssessmentAlphabet[0]
                                        .recognitionOfLetterN ? (
                                        <TiTick
                                          style={{
                                            color: "green",
                                            fontSize: "25px",
                                          }}
                                        />
                                      ) : (
                                        <ImCross style={{ color: "red" }} />
                                      )}
                                    </td>
                                    <td>
                                      {doassesmentData &&
                                      doassesmentData.leadDoAssessmentModel &&
                                      doassesmentData.leadDoAssessmentModel
                                        .length > 0 &&
                                      doassesmentData
                                        .leadDoAssessmentModel[0] &&
                                      doassesmentData.leadDoAssessmentAlphabet &&
                                      doassesmentData
                                        .leadDoAssessmentAlphabet[0] &&
                                      doassesmentData
                                        .leadDoAssessmentAlphabet[0]
                                        .recognitionOfLetterO ? (
                                        <TiTick
                                          style={{
                                            color: "green",
                                            fontSize: "25px",
                                          }}
                                        />
                                      ) : (
                                        <ImCross style={{ color: "red" }} />
                                      )}
                                    </td>
                                    <td>
                                      {doassesmentData &&
                                      doassesmentData.leadDoAssessmentModel &&
                                      doassesmentData.leadDoAssessmentModel
                                        .length > 0 &&
                                      doassesmentData
                                        .leadDoAssessmentModel[0] &&
                                      doassesmentData.leadDoAssessmentAlphabet &&
                                      doassesmentData
                                        .leadDoAssessmentAlphabet[0] &&
                                      doassesmentData
                                        .leadDoAssessmentAlphabet[0]
                                        .recognitionOfLetterP ? (
                                        <TiTick
                                          style={{
                                            color: "green",
                                            fontSize: "25px",
                                          }}
                                        />
                                      ) : (
                                        <ImCross style={{ color: "red" }} />
                                      )}
                                    </td>
                                    <td>
                                      {doassesmentData &&
                                      doassesmentData.leadDoAssessmentModel &&
                                      doassesmentData.leadDoAssessmentModel
                                        .length > 0 &&
                                      doassesmentData
                                        .leadDoAssessmentModel[0] &&
                                      doassesmentData.leadDoAssessmentAlphabet &&
                                      doassesmentData
                                        .leadDoAssessmentAlphabet[0] &&
                                      doassesmentData
                                        .leadDoAssessmentAlphabet[0]
                                        .recognitionOfLetterQ ? (
                                        <TiTick
                                          style={{
                                            color: "green",
                                            fontSize: "25px",
                                          }}
                                        />
                                      ) : (
                                        <ImCross style={{ color: "red" }} />
                                      )}
                                    </td>
                                    <td>
                                      {doassesmentData &&
                                      doassesmentData.leadDoAssessmentModel &&
                                      doassesmentData.leadDoAssessmentModel
                                        .length > 0 &&
                                      doassesmentData
                                        .leadDoAssessmentModel[0] &&
                                      doassesmentData.leadDoAssessmentAlphabet &&
                                      doassesmentData
                                        .leadDoAssessmentAlphabet[0] &&
                                      doassesmentData
                                        .leadDoAssessmentAlphabet[0]
                                        .recognitionOfLetterR ? (
                                        <TiTick
                                          style={{
                                            color: "green",
                                            fontSize: "25px",
                                          }}
                                        />
                                      ) : (
                                        <ImCross style={{ color: "red" }} />
                                      )}
                                    </td>
                                    <td>
                                      {doassesmentData &&
                                      doassesmentData.leadDoAssessmentModel &&
                                      doassesmentData.leadDoAssessmentModel
                                        .length > 0 &&
                                      doassesmentData
                                        .leadDoAssessmentModel[0] &&
                                      doassesmentData.leadDoAssessmentAlphabet &&
                                      doassesmentData
                                        .leadDoAssessmentAlphabet[0] &&
                                      doassesmentData
                                        .leadDoAssessmentAlphabet[0]
                                        .recognitionOfLetterS ? (
                                        <TiTick
                                          style={{
                                            color: "green",
                                            fontSize: "25px",
                                          }}
                                        />
                                      ) : (
                                        <ImCross style={{ color: "red" }} />
                                      )}
                                    </td>
                                    <td>
                                      {doassesmentData &&
                                      doassesmentData.leadDoAssessmentModel &&
                                      doassesmentData.leadDoAssessmentModel
                                        .length > 0 &&
                                      doassesmentData
                                        .leadDoAssessmentModel[0] &&
                                      doassesmentData.leadDoAssessmentAlphabet &&
                                      doassesmentData
                                        .leadDoAssessmentAlphabet[0] &&
                                      doassesmentData
                                        .leadDoAssessmentAlphabet[0]
                                        .recognitionOfLetterT ? (
                                        <TiTick
                                          style={{
                                            color: "green",
                                            fontSize: "25px",
                                          }}
                                        />
                                      ) : (
                                        <ImCross style={{ color: "red" }} />
                                      )}
                                    </td>
                                    <td>
                                      {doassesmentData &&
                                      doassesmentData.leadDoAssessmentModel &&
                                      doassesmentData.leadDoAssessmentModel
                                        .length > 0 &&
                                      doassesmentData
                                        .leadDoAssessmentModel[0] &&
                                      doassesmentData.leadDoAssessmentAlphabet &&
                                      doassesmentData
                                        .leadDoAssessmentAlphabet[0] &&
                                      doassesmentData
                                        .leadDoAssessmentAlphabet[0]
                                        .recognitionOfLetterU ? (
                                        <TiTick
                                          style={{
                                            color: "green",
                                            fontSize: "25px",
                                          }}
                                        />
                                      ) : (
                                        <ImCross style={{ color: "red" }} />
                                      )}
                                    </td>
                                    <td>
                                      {doassesmentData &&
                                      doassesmentData.leadDoAssessmentModel &&
                                      doassesmentData.leadDoAssessmentModel
                                        .length > 0 &&
                                      doassesmentData
                                        .leadDoAssessmentModel[0] &&
                                      doassesmentData.leadDoAssessmentAlphabet &&
                                      doassesmentData
                                        .leadDoAssessmentAlphabet[0] &&
                                      doassesmentData
                                        .leadDoAssessmentAlphabet[0]
                                        .recognitionOfLetterV ? (
                                        <TiTick
                                          style={{
                                            color: "green",
                                            fontSize: "25px",
                                          }}
                                        />
                                      ) : (
                                        <ImCross style={{ color: "red" }} />
                                      )}
                                    </td>
                                    <td>
                                      {doassesmentData &&
                                      doassesmentData.leadDoAssessmentModel &&
                                      doassesmentData.leadDoAssessmentModel
                                        .length > 0 &&
                                      doassesmentData
                                        .leadDoAssessmentModel[0] &&
                                      doassesmentData.leadDoAssessmentAlphabet &&
                                      doassesmentData
                                        .leadDoAssessmentAlphabet[0] &&
                                      doassesmentData
                                        .leadDoAssessmentAlphabet[0]
                                        .recognitionOfLetterW ? (
                                        <TiTick
                                          style={{
                                            color: "green",
                                            fontSize: "25px",
                                          }}
                                        />
                                      ) : (
                                        <ImCross style={{ color: "red" }} />
                                      )}
                                    </td>
                                    <td>
                                      {doassesmentData &&
                                      doassesmentData.leadDoAssessmentModel &&
                                      doassesmentData.leadDoAssessmentModel
                                        .length > 0 &&
                                      doassesmentData
                                        .leadDoAssessmentModel[0] &&
                                      doassesmentData.leadDoAssessmentAlphabet &&
                                      doassesmentData
                                        .leadDoAssessmentAlphabet[0] &&
                                      doassesmentData
                                        .leadDoAssessmentAlphabet[0]
                                        .recognitionOfLetterX ? (
                                        <TiTick
                                          style={{
                                            color: "green",
                                            fontSize: "25px",
                                          }}
                                        />
                                      ) : (
                                        <ImCross style={{ color: "red" }} />
                                      )}
                                    </td>
                                    <td>
                                      {doassesmentData &&
                                      doassesmentData.leadDoAssessmentModel &&
                                      doassesmentData.leadDoAssessmentModel
                                        .length > 0 &&
                                      doassesmentData
                                        .leadDoAssessmentModel[0] &&
                                      doassesmentData.leadDoAssessmentAlphabet &&
                                      doassesmentData
                                        .leadDoAssessmentAlphabet[0] &&
                                      doassesmentData
                                        .leadDoAssessmentAlphabet[0]
                                        .recognitionOfLetterY ? (
                                        <TiTick
                                          style={{
                                            color: "green",
                                            fontSize: "25px",
                                          }}
                                        />
                                      ) : (
                                        <ImCross style={{ color: "red" }} />
                                      )}
                                    </td>
                                    <td>
                                      {doassesmentData &&
                                      doassesmentData.leadDoAssessmentModel &&
                                      doassesmentData.leadDoAssessmentModel
                                        .length > 0 &&
                                      doassesmentData
                                        .leadDoAssessmentModel[0] &&
                                      doassesmentData.leadDoAssessmentAlphabet &&
                                      doassesmentData
                                        .leadDoAssessmentAlphabet[0] &&
                                      doassesmentData
                                        .leadDoAssessmentAlphabet[0]
                                        .recognitionOfLetterZ ? (
                                        <TiTick
                                          style={{
                                            color: "green",
                                            fontSize: "25px",
                                          }}
                                        />
                                      ) : (
                                        <ImCross style={{ color: "red" }} />
                                      )}
                                    </td>
                                  </tr>
                                  <tr>
                                    <th scope="row">Writing</th>
                                    <td>
                                      {doassesmentData &&
                                      doassesmentData.leadDoAssessmentModel &&
                                      doassesmentData.leadDoAssessmentModel
                                        .length > 0 &&
                                      doassesmentData
                                        .leadDoAssessmentModel[0] &&
                                      doassesmentData.leadDoAssessmentAlphabet &&
                                      doassesmentData
                                        .leadDoAssessmentAlphabet[0] &&
                                      doassesmentData
                                        .leadDoAssessmentAlphabet[0]
                                        .writingLetterN ? (
                                        <TiTick
                                          style={{
                                            color: "green",
                                            fontSize: "25px",
                                          }}
                                        />
                                      ) : (
                                        <ImCross style={{ color: "red" }} />
                                      )}
                                    </td>
                                    <td>
                                      {doassesmentData &&
                                      doassesmentData.leadDoAssessmentModel &&
                                      doassesmentData.leadDoAssessmentModel
                                        .length > 0 &&
                                      doassesmentData
                                        .leadDoAssessmentModel[0] &&
                                      doassesmentData.leadDoAssessmentAlphabet &&
                                      doassesmentData
                                        .leadDoAssessmentAlphabet[0] &&
                                      doassesmentData
                                        .leadDoAssessmentAlphabet[0]
                                        .writingLetterO ? (
                                        <TiTick
                                          style={{
                                            color: "green",
                                            fontSize: "25px",
                                          }}
                                        />
                                      ) : (
                                        <ImCross style={{ color: "red" }} />
                                      )}
                                    </td>
                                    <td>
                                      {doassesmentData &&
                                      doassesmentData.leadDoAssessmentModel &&
                                      doassesmentData.leadDoAssessmentModel
                                        .length > 0 &&
                                      doassesmentData
                                        .leadDoAssessmentModel[0] &&
                                      doassesmentData.leadDoAssessmentAlphabet &&
                                      doassesmentData
                                        .leadDoAssessmentAlphabet[0] &&
                                      doassesmentData
                                        .leadDoAssessmentAlphabet[0]
                                        .writingLetterP ? (
                                        <TiTick
                                          style={{
                                            color: "green",
                                            fontSize: "25px",
                                          }}
                                        />
                                      ) : (
                                        <ImCross style={{ color: "red" }} />
                                      )}
                                    </td>
                                    <td>
                                      {doassesmentData &&
                                      doassesmentData.leadDoAssessmentModel &&
                                      doassesmentData.leadDoAssessmentModel
                                        .length > 0 &&
                                      doassesmentData
                                        .leadDoAssessmentModel[0] &&
                                      doassesmentData.leadDoAssessmentAlphabet &&
                                      doassesmentData
                                        .leadDoAssessmentAlphabet[0] &&
                                      doassesmentData
                                        .leadDoAssessmentAlphabet[0]
                                        .writingLetterQ ? (
                                        <TiTick
                                          style={{
                                            color: "green",
                                            fontSize: "25px",
                                          }}
                                        />
                                      ) : (
                                        <ImCross style={{ color: "red" }} />
                                      )}
                                    </td>
                                    <td>
                                      {doassesmentData &&
                                      doassesmentData.leadDoAssessmentModel &&
                                      doassesmentData.leadDoAssessmentModel
                                        .length > 0 &&
                                      doassesmentData
                                        .leadDoAssessmentModel[0] &&
                                      doassesmentData.leadDoAssessmentAlphabet &&
                                      doassesmentData
                                        .leadDoAssessmentAlphabet[0] &&
                                      doassesmentData
                                        .leadDoAssessmentAlphabet[0]
                                        .writingLetterR ? (
                                        <TiTick
                                          style={{
                                            color: "green",
                                            fontSize: "25px",
                                          }}
                                        />
                                      ) : (
                                        <ImCross style={{ color: "red" }} />
                                      )}
                                    </td>
                                    <td>
                                      {doassesmentData &&
                                      doassesmentData.leadDoAssessmentModel &&
                                      doassesmentData.leadDoAssessmentModel
                                        .length > 0 &&
                                      doassesmentData
                                        .leadDoAssessmentModel[0] &&
                                      doassesmentData.leadDoAssessmentAlphabet &&
                                      doassesmentData
                                        .leadDoAssessmentAlphabet[0] &&
                                      doassesmentData
                                        .leadDoAssessmentAlphabet[0]
                                        .writingLetterS ? (
                                        <TiTick
                                          style={{
                                            color: "green",
                                            fontSize: "25px",
                                          }}
                                        />
                                      ) : (
                                        <ImCross style={{ color: "red" }} />
                                      )}
                                    </td>
                                    <td>
                                      {doassesmentData &&
                                      doassesmentData.leadDoAssessmentModel &&
                                      doassesmentData.leadDoAssessmentModel
                                        .length > 0 &&
                                      doassesmentData
                                        .leadDoAssessmentModel[0] &&
                                      doassesmentData.leadDoAssessmentAlphabet &&
                                      doassesmentData
                                        .leadDoAssessmentAlphabet[0] &&
                                      doassesmentData
                                        .leadDoAssessmentAlphabet[0]
                                        .writingLetterT ? (
                                        <TiTick
                                          style={{
                                            color: "green",
                                            fontSize: "25px",
                                          }}
                                        />
                                      ) : (
                                        <ImCross style={{ color: "red" }} />
                                      )}
                                    </td>
                                    <td>
                                      {doassesmentData &&
                                      doassesmentData.leadDoAssessmentModel &&
                                      doassesmentData.leadDoAssessmentModel
                                        .length > 0 &&
                                      doassesmentData
                                        .leadDoAssessmentModel[0] &&
                                      doassesmentData.leadDoAssessmentAlphabet &&
                                      doassesmentData
                                        .leadDoAssessmentAlphabet[0] &&
                                      doassesmentData
                                        .leadDoAssessmentAlphabet[0]
                                        .writingLetterU ? (
                                        <TiTick
                                          style={{
                                            color: "green",
                                            fontSize: "25px",
                                          }}
                                        />
                                      ) : (
                                        <ImCross style={{ color: "red" }} />
                                      )}
                                    </td>
                                    <td>
                                      {doassesmentData &&
                                      doassesmentData.leadDoAssessmentModel &&
                                      doassesmentData.leadDoAssessmentModel
                                        .length > 0 &&
                                      doassesmentData
                                        .leadDoAssessmentModel[0] &&
                                      doassesmentData.leadDoAssessmentAlphabet &&
                                      doassesmentData
                                        .leadDoAssessmentAlphabet[0] &&
                                      doassesmentData
                                        .leadDoAssessmentAlphabet[0]
                                        .writingLetterV ? (
                                        <TiTick
                                          style={{
                                            color: "green",
                                            fontSize: "25px",
                                          }}
                                        />
                                      ) : (
                                        <ImCross style={{ color: "red" }} />
                                      )}
                                    </td>
                                    <td>
                                      {doassesmentData &&
                                      doassesmentData.leadDoAssessmentModel &&
                                      doassesmentData.leadDoAssessmentModel
                                        .length > 0 &&
                                      doassesmentData
                                        .leadDoAssessmentModel[0] &&
                                      doassesmentData.leadDoAssessmentAlphabet &&
                                      doassesmentData
                                        .leadDoAssessmentAlphabet[0] &&
                                      doassesmentData
                                        .leadDoAssessmentAlphabet[0]
                                        .writingLetterW ? (
                                        <TiTick
                                          style={{
                                            color: "green",
                                            fontSize: "25px",
                                          }}
                                        />
                                      ) : (
                                        <ImCross style={{ color: "red" }} />
                                      )}
                                    </td>
                                    <td>
                                      {doassesmentData &&
                                      doassesmentData.leadDoAssessmentModel &&
                                      doassesmentData.leadDoAssessmentModel
                                        .length > 0 &&
                                      doassesmentData
                                        .leadDoAssessmentModel[0] &&
                                      doassesmentData.leadDoAssessmentAlphabet &&
                                      doassesmentData
                                        .leadDoAssessmentAlphabet[0] &&
                                      doassesmentData
                                        .leadDoAssessmentAlphabet[0]
                                        .writingLetterX ? (
                                        <TiTick
                                          style={{
                                            color: "green",
                                            fontSize: "25px",
                                          }}
                                        />
                                      ) : (
                                        <ImCross style={{ color: "red" }} />
                                      )}
                                    </td>
                                    <td>
                                      {doassesmentData &&
                                      doassesmentData.leadDoAssessmentModel &&
                                      doassesmentData.leadDoAssessmentModel
                                        .length > 0 &&
                                      doassesmentData
                                        .leadDoAssessmentModel[0] &&
                                      doassesmentData.leadDoAssessmentAlphabet &&
                                      doassesmentData
                                        .leadDoAssessmentAlphabet[0] &&
                                      doassesmentData
                                        .leadDoAssessmentAlphabet[0]
                                        .writingLetterY ? (
                                        <TiTick
                                          style={{
                                            color: "green",
                                            fontSize: "25px",
                                          }}
                                        />
                                      ) : (
                                        <ImCross style={{ color: "red" }} />
                                      )}
                                    </td>
                                    <td>
                                      {doassesmentData &&
                                      doassesmentData.leadDoAssessmentModel &&
                                      doassesmentData.leadDoAssessmentModel
                                        .length > 0 &&
                                      doassesmentData
                                        .leadDoAssessmentModel[0] &&
                                      doassesmentData.leadDoAssessmentAlphabet &&
                                      doassesmentData
                                        .leadDoAssessmentAlphabet[0] &&
                                      doassesmentData
                                        .leadDoAssessmentAlphabet[0]
                                        .writingLetterZ ? (
                                        <TiTick
                                          style={{
                                            color: "green",
                                            fontSize: "25px",
                                          }}
                                        />
                                      ) : (
                                        <ImCross style={{ color: "red" }} />
                                      )}
                                    </td>
                                  </tr>
                                  <tr>
                                    <th scope="row">Beginning Sound</th>
                                    <td>
                                      {doassesmentData &&
                                      doassesmentData.leadDoAssessmentModel &&
                                      doassesmentData.leadDoAssessmentModel
                                        .length > 0 &&
                                      doassesmentData
                                        .leadDoAssessmentModel[0] &&
                                      doassesmentData.leadDoAssessmentAlphabet &&
                                      doassesmentData
                                        .leadDoAssessmentAlphabet[0] &&
                                      doassesmentData
                                        .leadDoAssessmentAlphabet[0]
                                        .beginningSoundN ? (
                                        <TiTick
                                          style={{
                                            color: "green",
                                            fontSize: "25px",
                                          }}
                                        />
                                      ) : (
                                        <ImCross style={{ color: "red" }} />
                                      )}
                                    </td>
                                    <td>
                                      {doassesmentData &&
                                      doassesmentData.leadDoAssessmentModel &&
                                      doassesmentData.leadDoAssessmentModel
                                        .length > 0 &&
                                      doassesmentData
                                        .leadDoAssessmentModel[0] &&
                                      doassesmentData.leadDoAssessmentAlphabet &&
                                      doassesmentData
                                        .leadDoAssessmentAlphabet[0] &&
                                      doassesmentData
                                        .leadDoAssessmentAlphabet[0]
                                        .beginningSoundO ? (
                                        <TiTick
                                          style={{
                                            color: "green",
                                            fontSize: "25px",
                                          }}
                                        />
                                      ) : (
                                        <ImCross style={{ color: "red" }} />
                                      )}
                                    </td>
                                    <td>
                                      {doassesmentData &&
                                      doassesmentData.leadDoAssessmentModel &&
                                      doassesmentData.leadDoAssessmentModel
                                        .length > 0 &&
                                      doassesmentData
                                        .leadDoAssessmentModel[0] &&
                                      doassesmentData.leadDoAssessmentAlphabet &&
                                      doassesmentData
                                        .leadDoAssessmentAlphabet[0] &&
                                      doassesmentData
                                        .leadDoAssessmentAlphabet[0]
                                        .beginningSoundP ? (
                                        <TiTick
                                          style={{
                                            color: "green",
                                            fontSize: "25px",
                                          }}
                                        />
                                      ) : (
                                        <ImCross style={{ color: "red" }} />
                                      )}
                                    </td>
                                    <td>
                                      {doassesmentData &&
                                      doassesmentData.leadDoAssessmentModel &&
                                      doassesmentData.leadDoAssessmentModel
                                        .length > 0 &&
                                      doassesmentData
                                        .leadDoAssessmentModel[0] &&
                                      doassesmentData.leadDoAssessmentAlphabet &&
                                      doassesmentData
                                        .leadDoAssessmentAlphabet[0] &&
                                      doassesmentData
                                        .leadDoAssessmentAlphabet[0]
                                        .beginningSoundQ ? (
                                        <TiTick
                                          style={{
                                            color: "green",
                                            fontSize: "25px",
                                          }}
                                        />
                                      ) : (
                                        <ImCross style={{ color: "red" }} />
                                      )}
                                    </td>
                                    <td>
                                      {doassesmentData &&
                                      doassesmentData.leadDoAssessmentModel &&
                                      doassesmentData.leadDoAssessmentModel
                                        .length > 0 &&
                                      doassesmentData
                                        .leadDoAssessmentModel[0] &&
                                      doassesmentData.leadDoAssessmentAlphabet &&
                                      doassesmentData
                                        .leadDoAssessmentAlphabet[0] &&
                                      doassesmentData
                                        .leadDoAssessmentAlphabet[0]
                                        .beginningSoundR ? (
                                        <TiTick
                                          style={{
                                            color: "green",
                                            fontSize: "25px",
                                          }}
                                        />
                                      ) : (
                                        <ImCross style={{ color: "red" }} />
                                      )}
                                    </td>
                                    <td>
                                      {doassesmentData &&
                                      doassesmentData.leadDoAssessmentModel &&
                                      doassesmentData.leadDoAssessmentModel
                                        .length > 0 &&
                                      doassesmentData
                                        .leadDoAssessmentModel[0] &&
                                      doassesmentData.leadDoAssessmentAlphabet &&
                                      doassesmentData
                                        .leadDoAssessmentAlphabet[0] &&
                                      doassesmentData
                                        .leadDoAssessmentAlphabet[0]
                                        .beginningSoundS ? (
                                        <TiTick
                                          style={{
                                            color: "green",
                                            fontSize: "25px",
                                          }}
                                        />
                                      ) : (
                                        <ImCross style={{ color: "red" }} />
                                      )}
                                    </td>
                                    <td>
                                      {doassesmentData &&
                                      doassesmentData.leadDoAssessmentModel &&
                                      doassesmentData.leadDoAssessmentModel
                                        .length > 0 &&
                                      doassesmentData
                                        .leadDoAssessmentModel[0] &&
                                      doassesmentData.leadDoAssessmentAlphabet &&
                                      doassesmentData
                                        .leadDoAssessmentAlphabet[0] &&
                                      doassesmentData
                                        .leadDoAssessmentAlphabet[0]
                                        .beginningSoundT ? (
                                        <TiTick
                                          style={{
                                            color: "green",
                                            fontSize: "25px",
                                          }}
                                        />
                                      ) : (
                                        <ImCross style={{ color: "red" }} />
                                      )}
                                    </td>
                                    <td>
                                      {doassesmentData &&
                                      doassesmentData.leadDoAssessmentModel &&
                                      doassesmentData.leadDoAssessmentModel
                                        .length > 0 &&
                                      doassesmentData
                                        .leadDoAssessmentModel[0] &&
                                      doassesmentData.leadDoAssessmentAlphabet &&
                                      doassesmentData
                                        .leadDoAssessmentAlphabet[0] &&
                                      doassesmentData
                                        .leadDoAssessmentAlphabet[0]
                                        .beginningSoundU ? (
                                        <TiTick
                                          style={{
                                            color: "green",
                                            fontSize: "25px",
                                          }}
                                        />
                                      ) : (
                                        <ImCross style={{ color: "red" }} />
                                      )}
                                    </td>
                                    <td>
                                      {doassesmentData &&
                                      doassesmentData.leadDoAssessmentModel &&
                                      doassesmentData.leadDoAssessmentModel
                                        .length > 0 &&
                                      doassesmentData
                                        .leadDoAssessmentModel[0] &&
                                      doassesmentData.leadDoAssessmentAlphabet &&
                                      doassesmentData
                                        .leadDoAssessmentAlphabet[0] &&
                                      doassesmentData
                                        .leadDoAssessmentAlphabet[0]
                                        .beginningSoundV ? (
                                        <TiTick
                                          style={{
                                            color: "green",
                                            fontSize: "25px",
                                          }}
                                        />
                                      ) : (
                                        <ImCross style={{ color: "red" }} />
                                      )}
                                    </td>
                                    <td>
                                      {doassesmentData &&
                                      doassesmentData.leadDoAssessmentModel &&
                                      doassesmentData.leadDoAssessmentModel
                                        .length > 0 &&
                                      doassesmentData
                                        .leadDoAssessmentModel[0] &&
                                      doassesmentData.leadDoAssessmentAlphabet &&
                                      doassesmentData
                                        .leadDoAssessmentAlphabet[0] &&
                                      doassesmentData
                                        .leadDoAssessmentAlphabet[0]
                                        .beginningSoundW ? (
                                        <TiTick
                                          style={{
                                            color: "green",
                                            fontSize: "25px",
                                          }}
                                        />
                                      ) : (
                                        <ImCross style={{ color: "red" }} />
                                      )}
                                    </td>
                                    <td>
                                      {doassesmentData &&
                                      doassesmentData.leadDoAssessmentModel &&
                                      doassesmentData.leadDoAssessmentModel
                                        .length > 0 &&
                                      doassesmentData
                                        .leadDoAssessmentModel[0] &&
                                      doassesmentData.leadDoAssessmentAlphabet &&
                                      doassesmentData
                                        .leadDoAssessmentAlphabet[0] &&
                                      doassesmentData
                                        .leadDoAssessmentAlphabet[0]
                                        .beginningSoundX ? (
                                        <TiTick
                                          style={{
                                            color: "green",
                                            fontSize: "25px",
                                          }}
                                        />
                                      ) : (
                                        <ImCross style={{ color: "red" }} />
                                      )}
                                    </td>
                                    <td>
                                      {doassesmentData &&
                                      doassesmentData.leadDoAssessmentModel &&
                                      doassesmentData.leadDoAssessmentModel
                                        .length > 0 &&
                                      doassesmentData
                                        .leadDoAssessmentModel[0] &&
                                      doassesmentData.leadDoAssessmentAlphabet &&
                                      doassesmentData
                                        .leadDoAssessmentAlphabet[0] &&
                                      doassesmentData
                                        .leadDoAssessmentAlphabet[0]
                                        .beginningSoundY ? (
                                        <TiTick
                                          style={{
                                            color: "green",
                                            fontSize: "25px",
                                          }}
                                        />
                                      ) : (
                                        <ImCross style={{ color: "red" }} />
                                      )}
                                    </td>
                                    <td>
                                      {doassesmentData &&
                                      doassesmentData.leadDoAssessmentModel &&
                                      doassesmentData.leadDoAssessmentModel
                                        .length > 0 &&
                                      doassesmentData
                                        .leadDoAssessmentModel[0] &&
                                      doassesmentData.leadDoAssessmentAlphabet &&
                                      doassesmentData
                                        .leadDoAssessmentAlphabet[0] &&
                                      doassesmentData
                                        .leadDoAssessmentAlphabet[0]
                                        .beginningSoundZ ? (
                                        <TiTick
                                          style={{
                                            color: "green",
                                            fontSize: "25px",
                                          }}
                                        />
                                      ) : (
                                        <ImCross style={{ color: "red" }} />
                                      )}
                                    </td>
                                  </tr>
                                  {/* <tr>
                                    <th scope="row">Written Strokes</th>
                                    <td>
                                      {doassesmentData &&
                                      doassesmentData.leadDoAssessmentModel &&
                                      doassesmentData.leadDoAssessmentModel
                                        .length > 0 &&
                                      doassesmentData
                                        .leadDoAssessmentModel[0] &&
                                      doassesmentData.leadDoAssessmentAlphabet &&
                                      doassesmentData
                                        .leadDoAssessmentAlphabet[0] &&
                                      doassesmentData
                                        .leadDoAssessmentAlphabet[0]
                                        .writingLetterN ? (
                                        <TiTick
                                          style={{
                                            color: "green",
                                            fontSize: "25px",
                                          }}
                                        />
                                      ) : (
                                        <ImCross style={{ color: "red" }} />
                                      )}
                                    </td>
                                    <td>
                                      {doassesmentData &&
                                      doassesmentData.leadDoAssessmentModel &&
                                      doassesmentData.leadDoAssessmentModel
                                        .length > 0 &&
                                      doassesmentData
                                        .leadDoAssessmentModel[0] &&
                                      doassesmentData.leadDoAssessmentAlphabet &&
                                      doassesmentData
                                        .leadDoAssessmentAlphabet[0] &&
                                      doassesmentData
                                        .leadDoAssessmentAlphabet[0]
                                        .writingLetterO ? (
                                        <TiTick
                                          style={{
                                            color: "green",
                                            fontSize: "25px",
                                          }}
                                        />
                                      ) : (
                                        <ImCross style={{ color: "red" }} />
                                      )}
                                    </td>
                                    <td>
                                      {doassesmentData &&
                                      doassesmentData.leadDoAssessmentModel &&
                                      doassesmentData.leadDoAssessmentModel
                                        .length > 0 &&
                                      doassesmentData
                                        .leadDoAssessmentModel[0] &&
                                      doassesmentData.leadDoAssessmentAlphabet &&
                                      doassesmentData
                                        .leadDoAssessmentAlphabet[0] &&
                                      doassesmentData
                                        .leadDoAssessmentAlphabet[0]
                                        .writingLetterP ? (
                                        <TiTick
                                          style={{
                                            color: "green",
                                            fontSize: "25px",
                                          }}
                                        />
                                      ) : (
                                        <ImCross style={{ color: "red" }} />
                                      )}
                                    </td>
                                    <td>
                                      {doassesmentData &&
                                      doassesmentData.leadDoAssessmentModel &&
                                      doassesmentData.leadDoAssessmentModel
                                        .length > 0 &&
                                      doassesmentData
                                        .leadDoAssessmentModel[0] &&
                                      doassesmentData.leadDoAssessmentAlphabet &&
                                      doassesmentData
                                        .leadDoAssessmentAlphabet[0] &&
                                      doassesmentData
                                        .leadDoAssessmentAlphabet[0]
                                        .writingLetterQ ? (
                                        <TiTick
                                          style={{
                                            color: "green",
                                            fontSize: "25px",
                                          }}
                                        />
                                      ) : (
                                        <ImCross style={{ color: "red" }} />
                                      )}
                                    </td>
                                    <td>
                                      {doassesmentData &&
                                      doassesmentData.leadDoAssessmentModel &&
                                      doassesmentData.leadDoAssessmentModel
                                        .length > 0 &&
                                      doassesmentData
                                        .leadDoAssessmentModel[0] &&
                                      doassesmentData.leadDoAssessmentAlphabet &&
                                      doassesmentData
                                        .leadDoAssessmentAlphabet[0] &&
                                      doassesmentData
                                        .leadDoAssessmentAlphabet[0]
                                        .writingLetterR ? (
                                        <TiTick
                                          style={{
                                            color: "green",
                                            fontSize: "25px",
                                          }}
                                        />
                                      ) : (
                                        <ImCross style={{ color: "red" }} />
                                      )}
                                    </td>
                                    <td>
                                      {doassesmentData &&
                                      doassesmentData.leadDoAssessmentModel &&
                                      doassesmentData.leadDoAssessmentModel
                                        .length > 0 &&
                                      doassesmentData
                                        .leadDoAssessmentModel[0] &&
                                      doassesmentData.leadDoAssessmentAlphabet &&
                                      doassesmentData
                                        .leadDoAssessmentAlphabet[0] &&
                                      doassesmentData
                                        .leadDoAssessmentAlphabet[0]
                                        .writingLetterS ? (
                                        <TiTick
                                          style={{
                                            color: "green",
                                            fontSize: "25px",
                                          }}
                                        />
                                      ) : (
                                        <ImCross style={{ color: "red" }} />
                                      )}
                                    </td>
                                    <td>
                                      {doassesmentData &&
                                      doassesmentData.leadDoAssessmentModel &&
                                      doassesmentData.leadDoAssessmentModel
                                        .length > 0 &&
                                      doassesmentData
                                        .leadDoAssessmentModel[0] &&
                                      doassesmentData.leadDoAssessmentAlphabet &&
                                      doassesmentData
                                        .leadDoAssessmentAlphabet[0] &&
                                      doassesmentData
                                        .leadDoAssessmentAlphabet[0]
                                        .writingLetterT ? (
                                        <TiTick
                                          style={{
                                            color: "green",
                                            fontSize: "25px",
                                          }}
                                        />
                                      ) : (
                                        <ImCross style={{ color: "red" }} />
                                      )}
                                    </td>
                                    <td>
                                      {doassesmentData &&
                                      doassesmentData.leadDoAssessmentModel &&
                                      doassesmentData.leadDoAssessmentModel
                                        .length > 0 &&
                                      doassesmentData
                                        .leadDoAssessmentModel[0] &&
                                      doassesmentData.leadDoAssessmentAlphabet &&
                                      doassesmentData
                                        .leadDoAssessmentAlphabet[0] &&
                                      doassesmentData
                                        .leadDoAssessmentAlphabet[0]
                                        .writingLetterU ? (
                                        <TiTick
                                          style={{
                                            color: "green",
                                            fontSize: "25px",
                                          }}
                                        />
                                      ) : (
                                        <ImCross style={{ color: "red" }} />
                                      )}
                                    </td>
                                    <td>
                                      {doassesmentData &&
                                      doassesmentData.leadDoAssessmentModel &&
                                      doassesmentData.leadDoAssessmentModel
                                        .length > 0 &&
                                      doassesmentData
                                        .leadDoAssessmentModel[0] &&
                                      doassesmentData.leadDoAssessmentAlphabet &&
                                      doassesmentData
                                        .leadDoAssessmentAlphabet[0] &&
                                      doassesmentData
                                        .leadDoAssessmentAlphabet[0]
                                        .writingLetterV ? (
                                        <TiTick
                                          style={{
                                            color: "green",
                                            fontSize: "25px",
                                          }}
                                        />
                                      ) : (
                                        <ImCross style={{ color: "red" }} />
                                      )}
                                    </td>
                                    <td>
                                      {doassesmentData &&
                                      doassesmentData.leadDoAssessmentModel &&
                                      doassesmentData.leadDoAssessmentModel
                                        .length > 0 &&
                                      doassesmentData
                                        .leadDoAssessmentModel[0] &&
                                      doassesmentData.leadDoAssessmentAlphabet &&
                                      doassesmentData
                                        .leadDoAssessmentAlphabet[0] &&
                                      doassesmentData
                                        .leadDoAssessmentAlphabet[0]
                                        .writingLetterW ? (
                                        <TiTick
                                          style={{
                                            color: "green",
                                            fontSize: "25px",
                                          }}
                                        />
                                      ) : (
                                        <ImCross style={{ color: "red" }} />
                                      )}
                                    </td>
                                    <td>
                                      {doassesmentData &&
                                      doassesmentData.leadDoAssessmentModel &&
                                      doassesmentData.leadDoAssessmentModel
                                        .length > 0 &&
                                      doassesmentData
                                        .leadDoAssessmentModel[0] &&
                                      doassesmentData.leadDoAssessmentAlphabet &&
                                      doassesmentData
                                        .leadDoAssessmentAlphabet[0] &&
                                      doassesmentData
                                        .leadDoAssessmentAlphabet[0]
                                        .writingLetterX ? (
                                        <TiTick
                                          style={{
                                            color: "green",
                                            fontSize: "25px",
                                          }}
                                        />
                                      ) : (
                                        <ImCross style={{ color: "red" }} />
                                      )}
                                    </td>
                                    <td>
                                      {doassesmentData &&
                                      doassesmentData.leadDoAssessmentModel &&
                                      doassesmentData.leadDoAssessmentModel
                                        .length > 0 &&
                                      doassesmentData
                                        .leadDoAssessmentModel[0] &&
                                      doassesmentData.leadDoAssessmentAlphabet &&
                                      doassesmentData
                                        .leadDoAssessmentAlphabet[0] &&
                                      doassesmentData
                                        .leadDoAssessmentAlphabet[0]
                                        .writingLetterY ? (
                                        <TiTick
                                          style={{
                                            color: "green",
                                            fontSize: "25px",
                                          }}
                                        />
                                      ) : (
                                        <ImCross style={{ color: "red" }} />
                                      )}
                                    </td>
                                    <td>
                                      {doassesmentData &&
                                      doassesmentData.leadDoAssessmentModel &&
                                      doassesmentData.leadDoAssessmentModel
                                        .length > 0 &&
                                      doassesmentData
                                        .leadDoAssessmentModel[0] &&
                                      doassesmentData.leadDoAssessmentAlphabet &&
                                      doassesmentData
                                        .leadDoAssessmentAlphabet[0] &&
                                      doassesmentData
                                        .leadDoAssessmentAlphabet[0]
                                        .writingLetterZ ? (
                                        <TiTick
                                          style={{
                                            color: "green",
                                            fontSize: "25px",
                                          }}
                                        />
                                      ) : (
                                        <ImCross style={{ color: "red" }} />
                                      )}
                                    </td>
                                  </tr> */}
                                </tbody>
                              </table>
                            </div>
                            <div className="col-md-6 col-12">
                              <div className="row mb-2">
                                <div className="col-6 d-flex  align-items-center">
                                  <p className="text-sm fw-medium ">
                                    Association
                                  </p>
                                </div>
                                <div className="col-6">
                                  <p className="text-muted text-sm">
                                    :
                                    {doassesmentData &&
                                    doassesmentData.leadDoAssessmentModel &&
                                    doassesmentData.leadDoAssessmentModel
                                      .length > 0 &&
                                    doassesmentData.leadDoAssessmentModel[0] &&
                                    doassesmentData.leadDoAssessmentAlphabet &&
                                    doassesmentData
                                      .leadDoAssessmentAlphabet[0] &&
                                    doassesmentData.leadDoAssessmentAlphabet[0]
                                      .association
                                      ? "Yes"
                                      : "No"}
                                  </p>
                                </div>
                              </div>
                            </div>
                            <div className="col-md-6 col-12">
                              <div className="row mb-2">
                                <div className="col-6 d-flex  align-items-center">
                                  <p className="text-sm fw-medium ">Remarks</p>
                                </div>
                                <div className="col-6">
                                  <p className="text-muted text-sm">
                                    :{" "}
                                    {doassesmentData &&
                                    doassesmentData.leadDoAssessmentModel &&
                                    doassesmentData.leadDoAssessmentModel
                                      .length > 0 &&
                                    doassesmentData.leadDoAssessmentModel[0] &&
                                    doassesmentData.leadDoAssessmentAlphabet &&
                                    doassesmentData
                                      .leadDoAssessmentAlphabet[0] &&
                                    doassesmentData.leadDoAssessmentAlphabet[0]
                                      .alphabetRemarks
                                      ? doassesmentData
                                          .leadDoAssessmentAlphabet[0]
                                          .alphabetRemarks
                                      : "--"}
                                  </p>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="text-center">
                          <p>Alphabet Information not available </p>
                        </div>
                      )}

                      {/* Arty Pursuers */}
                      {doassesmentData.leadDoAssessmentArtyPursuers &&
                      doassesmentData.leadDoAssessmentArtyPursuers.length >
                        0 ? (
                        <div className="container-fluid">
                          <div className="row m-3">
                            <h5 className="headColor mt-5  mb-4">
                              Arty Pursuers
                            </h5>
                            <div className="col-12">
                              <div className="row mb-2">
                                <div className="col-md-3 col-6 d-flex  align-items-center">
                                  <p className="text-sm fw-medium ">
                                    Sight Words
                                  </p>
                                </div>
                                <div className="col-md-9 col-6">
                                  <p className="text-muted text-sm">
                                    :{" "}
                                    {doassesmentData &&
                                    doassesmentData.leadDoAssessmentModel &&
                                    doassesmentData.leadDoAssessmentModel
                                      .length > 0 &&
                                    doassesmentData.leadDoAssessmentModel[0] &&
                                    doassesmentData.leadDoAssessmentAlphabet &&
                                    doassesmentData
                                      .leadDoAssessmentAlphabet[0] &&
                                    doassesmentData
                                      .leadDoAssessmentArtyPursuers[0]
                                      .sightWords
                                      ? doassesmentData.leadDoAssessmentArtyPursuers[0].sightWords.join(
                                          " , "
                                        )
                                      : "--"}
                                  </p>
                                </div>
                              </div>
                            </div>
                            <hr />
                            <div className="table-responsive">
                              <table class="table">
                                <thead className="table-warning">
                                  <tr>
                                    <th scope="col">CVC</th>
                                    <th scope="col">A</th>
                                    <th scope="col">E</th>
                                    <th scope="col">I</th>
                                    <th scope="col">O</th>
                                    <th scope="col">U</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  <tr>
                                    <th scope="row">Real</th>
                                    <td>
                                      Hag{" "}
                                      {doassesmentData &&
                                      doassesmentData.leadDoAssessmentModel &&
                                      doassesmentData.leadDoAssessmentModel
                                        .length > 0 &&
                                      doassesmentData
                                        .leadDoAssessmentModel[0] &&
                                      doassesmentData.leadDoAssessmentAlphabet &&
                                      doassesmentData
                                        .leadDoAssessmentAlphabet[0] &&
                                      doassesmentData
                                        .leadDoAssessmentArtyPursuers[0]
                                        .realHag ? (
                                        <TiTick
                                          style={{
                                            color: "green",
                                            fontSize: "25px",
                                          }}
                                        />
                                      ) : (
                                        <ImCross style={{ color: "red" }} />
                                      )}
                                    </td>
                                    <td>
                                      Keg{" "}
                                      {doassesmentData &&
                                      doassesmentData.leadDoAssessmentModel &&
                                      doassesmentData.leadDoAssessmentModel
                                        .length > 0 &&
                                      doassesmentData
                                        .leadDoAssessmentModel[0] &&
                                      doassesmentData.leadDoAssessmentAlphabet &&
                                      doassesmentData
                                        .leadDoAssessmentAlphabet[0] &&
                                      doassesmentData
                                        .leadDoAssessmentArtyPursuers[0]
                                        .realKeg ? (
                                        <TiTick
                                          style={{
                                            color: "green",
                                            fontSize: "25px",
                                          }}
                                        />
                                      ) : (
                                        <ImCross style={{ color: "red" }} />
                                      )}
                                    </td>
                                    <td>
                                      Dip{" "}
                                      {doassesmentData &&
                                      doassesmentData.leadDoAssessmentModel &&
                                      doassesmentData.leadDoAssessmentModel
                                        .length > 0 &&
                                      doassesmentData
                                        .leadDoAssessmentModel[0] &&
                                      doassesmentData.leadDoAssessmentAlphabet &&
                                      doassesmentData
                                        .leadDoAssessmentAlphabet[0] &&
                                      doassesmentData
                                        .leadDoAssessmentArtyPursuers[0]
                                        .realDip ? (
                                        <TiTick
                                          style={{
                                            color: "green",
                                            fontSize: "25px",
                                          }}
                                        />
                                      ) : (
                                        <ImCross style={{ color: "red" }} />
                                      )}
                                    </td>
                                    <td>
                                      Lot{" "}
                                      {doassesmentData &&
                                      doassesmentData.leadDoAssessmentModel &&
                                      doassesmentData.leadDoAssessmentModel
                                        .length > 0 &&
                                      doassesmentData
                                        .leadDoAssessmentModel[0] &&
                                      doassesmentData.leadDoAssessmentAlphabet &&
                                      doassesmentData
                                        .leadDoAssessmentAlphabet[0] &&
                                      doassesmentData
                                        .leadDoAssessmentArtyPursuers[0]
                                        .realLot ? (
                                        <TiTick
                                          style={{
                                            color: "green",
                                            fontSize: "25px",
                                          }}
                                        />
                                      ) : (
                                        <ImCross style={{ color: "red" }} />
                                      )}
                                    </td>
                                    <td>
                                      Bud{" "}
                                      {doassesmentData &&
                                      doassesmentData.leadDoAssessmentModel &&
                                      doassesmentData.leadDoAssessmentModel
                                        .length > 0 &&
                                      doassesmentData
                                        .leadDoAssessmentModel[0] &&
                                      doassesmentData.leadDoAssessmentAlphabet &&
                                      doassesmentData
                                        .leadDoAssessmentAlphabet[0] &&
                                      doassesmentData
                                        .leadDoAssessmentArtyPursuers[0]
                                        .realBud ? (
                                        <TiTick
                                          style={{
                                            color: "green",
                                            fontSize: "25px",
                                          }}
                                        />
                                      ) : (
                                        <ImCross style={{ color: "red" }} />
                                      )}
                                    </td>
                                  </tr>
                                  <tr>
                                    <th scope="row">Spelling</th>
                                    <td>
                                      {doassesmentData &&
                                      doassesmentData.leadDoAssessmentModel &&
                                      doassesmentData.leadDoAssessmentModel
                                        .length > 0 &&
                                      doassesmentData
                                        .leadDoAssessmentModel[0] &&
                                      doassesmentData.leadDoAssessmentAlphabet &&
                                      doassesmentData
                                        .leadDoAssessmentAlphabet[0] &&
                                      doassesmentData
                                        .leadDoAssessmentArtyPursuers[0]
                                        .realHagSpelling
                                        ? doassesmentData
                                            .leadDoAssessmentArtyPursuers[0]
                                            .realHagSpelling
                                        : "--"}
                                    </td>
                                    <td>
                                      {doassesmentData &&
                                      doassesmentData.leadDoAssessmentModel &&
                                      doassesmentData.leadDoAssessmentModel
                                        .length > 0 &&
                                      doassesmentData
                                        .leadDoAssessmentModel[0] &&
                                      doassesmentData.leadDoAssessmentAlphabet &&
                                      doassesmentData
                                        .leadDoAssessmentAlphabet[0] &&
                                      doassesmentData
                                        .leadDoAssessmentArtyPursuers[0]
                                        .realKegSpelling
                                        ? doassesmentData
                                            .leadDoAssessmentArtyPursuers[0]
                                            .realKegSpelling
                                        : "--"}
                                    </td>
                                    <td>
                                      {doassesmentData &&
                                      doassesmentData.leadDoAssessmentModel &&
                                      doassesmentData.leadDoAssessmentModel
                                        .length > 0 &&
                                      doassesmentData
                                        .leadDoAssessmentModel[0] &&
                                      doassesmentData.leadDoAssessmentAlphabet &&
                                      doassesmentData
                                        .leadDoAssessmentAlphabet[0] &&
                                      doassesmentData
                                        .leadDoAssessmentArtyPursuers[0]
                                        .realDipSpelling
                                        ? doassesmentData
                                            .leadDoAssessmentArtyPursuers[0]
                                            .realDipSpelling
                                        : "--"}
                                    </td>
                                    <td>
                                      {doassesmentData &&
                                      doassesmentData.leadDoAssessmentModel &&
                                      doassesmentData.leadDoAssessmentModel
                                        .length > 0 &&
                                      doassesmentData
                                        .leadDoAssessmentModel[0] &&
                                      doassesmentData.leadDoAssessmentAlphabet &&
                                      doassesmentData
                                        .leadDoAssessmentAlphabet[0] &&
                                      doassesmentData
                                        .leadDoAssessmentArtyPursuers[0]
                                        .realLotSpelling
                                        ? doassesmentData
                                            .leadDoAssessmentArtyPursuers[0]
                                            .realLotSpelling
                                        : "--"}
                                    </td>
                                    <td>
                                      {doassesmentData &&
                                      doassesmentData.leadDoAssessmentModel &&
                                      doassesmentData.leadDoAssessmentModel
                                        .length > 0 &&
                                      doassesmentData
                                        .leadDoAssessmentModel[0] &&
                                      doassesmentData.leadDoAssessmentAlphabet &&
                                      doassesmentData
                                        .leadDoAssessmentAlphabet[0] &&
                                      doassesmentData
                                        .leadDoAssessmentArtyPursuers[0]
                                        .realBudSpelling
                                        ? doassesmentData
                                            .leadDoAssessmentArtyPursuers[0]
                                            .realBudSpelling
                                        : "--"}
                                    </td>
                                  </tr>
                                  <tr>
                                    <th scope="row">Non sense</th>
                                    <td>
                                      Zam{" "}
                                      {doassesmentData &&
                                      doassesmentData.leadDoAssessmentModel &&
                                      doassesmentData.leadDoAssessmentModel
                                        .length > 0 &&
                                      doassesmentData
                                        .leadDoAssessmentModel[0] &&
                                      doassesmentData.leadDoAssessmentAlphabet &&
                                      doassesmentData
                                        .leadDoAssessmentAlphabet[0] &&
                                      doassesmentData
                                        .leadDoAssessmentArtyPursuers[0]
                                        .nonSenseZam ? (
                                        <TiTick
                                          style={{
                                            color: "green",
                                            fontSize: "25px",
                                          }}
                                        />
                                      ) : (
                                        <ImCross style={{ color: "red" }} />
                                      )}
                                    </td>
                                    <td>
                                      Den{" "}
                                      {doassesmentData &&
                                      doassesmentData.leadDoAssessmentModel &&
                                      doassesmentData.leadDoAssessmentModel
                                        .length > 0 &&
                                      doassesmentData
                                        .leadDoAssessmentModel[0] &&
                                      doassesmentData.leadDoAssessmentAlphabet &&
                                      doassesmentData
                                        .leadDoAssessmentAlphabet[0] &&
                                      doassesmentData
                                        .leadDoAssessmentArtyPursuers[0]
                                        .nonSenseDen ? (
                                        <TiTick
                                          style={{
                                            color: "green",
                                            fontSize: "25px",
                                          }}
                                        />
                                      ) : (
                                        <ImCross style={{ color: "red" }} />
                                      )}
                                    </td>
                                    <td>
                                      Wip{" "}
                                      {doassesmentData &&
                                      doassesmentData.leadDoAssessmentModel &&
                                      doassesmentData.leadDoAssessmentModel
                                        .length > 0 &&
                                      doassesmentData
                                        .leadDoAssessmentModel[0] &&
                                      doassesmentData.leadDoAssessmentAlphabet &&
                                      doassesmentData
                                        .leadDoAssessmentAlphabet[0] &&
                                      doassesmentData
                                        .leadDoAssessmentArtyPursuers[0]
                                        .nonSenseWip ? (
                                        <TiTick
                                          style={{
                                            color: "green",
                                            fontSize: "25px",
                                          }}
                                        />
                                      ) : (
                                        <ImCross style={{ color: "red" }} />
                                      )}
                                    </td>
                                    <td>
                                      Sot{" "}
                                      {doassesmentData &&
                                      doassesmentData.leadDoAssessmentModel &&
                                      doassesmentData.leadDoAssessmentModel
                                        .length > 0 &&
                                      doassesmentData
                                        .leadDoAssessmentModel[0] &&
                                      doassesmentData.leadDoAssessmentAlphabet &&
                                      doassesmentData
                                        .leadDoAssessmentAlphabet[0] &&
                                      doassesmentData
                                        .leadDoAssessmentArtyPursuers[0]
                                        .nonSenseSot ? (
                                        <TiTick
                                          style={{
                                            color: "green",
                                            fontSize: "25px",
                                          }}
                                        />
                                      ) : (
                                        <ImCross style={{ color: "red" }} />
                                      )}
                                    </td>
                                    <td>
                                      Yub{" "}
                                      {doassesmentData &&
                                      doassesmentData.leadDoAssessmentModel &&
                                      doassesmentData.leadDoAssessmentModel
                                        .length > 0 &&
                                      doassesmentData
                                        .leadDoAssessmentModel[0] &&
                                      doassesmentData.leadDoAssessmentAlphabet &&
                                      doassesmentData
                                        .leadDoAssessmentAlphabet[0] &&
                                      doassesmentData
                                        .leadDoAssessmentArtyPursuers[0]
                                        .nonSenseYub ? (
                                        <TiTick
                                          style={{
                                            color: "green",
                                            fontSize: "25px",
                                          }}
                                        />
                                      ) : (
                                        <ImCross style={{ color: "red" }} />
                                      )}
                                    </td>
                                  </tr>
                                  <tr>
                                    <th scope="row">Spelling</th>
                                    <td>
                                      {doassesmentData &&
                                      doassesmentData.leadDoAssessmentModel &&
                                      doassesmentData.leadDoAssessmentModel
                                        .length > 0 &&
                                      doassesmentData
                                        .leadDoAssessmentModel[0] &&
                                      doassesmentData.leadDoAssessmentAlphabet &&
                                      doassesmentData
                                        .leadDoAssessmentAlphabet[0] &&
                                      doassesmentData
                                        .leadDoAssessmentArtyPursuers[0]
                                        .nonSenseZamSpelling
                                        ? doassesmentData
                                            .leadDoAssessmentArtyPursuers[0]
                                            .nonSenseZamSpelling
                                        : "--"}
                                    </td>
                                    <td>
                                      {doassesmentData &&
                                      doassesmentData.leadDoAssessmentModel &&
                                      doassesmentData.leadDoAssessmentModel
                                        .length > 0 &&
                                      doassesmentData
                                        .leadDoAssessmentModel[0] &&
                                      doassesmentData.leadDoAssessmentAlphabet &&
                                      doassesmentData
                                        .leadDoAssessmentAlphabet[0] &&
                                      doassesmentData
                                        .leadDoAssessmentArtyPursuers[0]
                                        .nonSenseDenSpelling
                                        ? doassesmentData
                                            .leadDoAssessmentArtyPursuers[0]
                                            .nonSenseDenSpelling
                                        : "--"}
                                    </td>
                                    <td>
                                      {doassesmentData &&
                                      doassesmentData.leadDoAssessmentModel &&
                                      doassesmentData.leadDoAssessmentModel
                                        .length > 0 &&
                                      doassesmentData
                                        .leadDoAssessmentModel[0] &&
                                      doassesmentData.leadDoAssessmentAlphabet &&
                                      doassesmentData
                                        .leadDoAssessmentAlphabet[0] &&
                                      doassesmentData
                                        .leadDoAssessmentArtyPursuers[0]
                                        .nonSenseWipSpelling
                                        ? doassesmentData
                                            .leadDoAssessmentArtyPursuers[0]
                                            .nonSenseWipSpelling
                                        : "--"}
                                    </td>
                                    <td>
                                      {doassesmentData &&
                                      doassesmentData.leadDoAssessmentModel &&
                                      doassesmentData.leadDoAssessmentModel
                                        .length > 0 &&
                                      doassesmentData
                                        .leadDoAssessmentModel[0] &&
                                      doassesmentData.leadDoAssessmentAlphabet &&
                                      doassesmentData
                                        .leadDoAssessmentAlphabet[0] &&
                                      doassesmentData
                                        .leadDoAssessmentArtyPursuers[0]
                                        .nonSenseSotSpelling
                                        ? doassesmentData
                                            .leadDoAssessmentArtyPursuers[0]
                                            .nonSenseSotSpelling
                                        : "--"}
                                    </td>
                                    <td>
                                      {doassesmentData &&
                                      doassesmentData.leadDoAssessmentModel &&
                                      doassesmentData.leadDoAssessmentModel
                                        .length > 0 &&
                                      doassesmentData
                                        .leadDoAssessmentModel[0] &&
                                      doassesmentData.leadDoAssessmentAlphabet &&
                                      doassesmentData
                                        .leadDoAssessmentAlphabet[0] &&
                                      doassesmentData
                                        .leadDoAssessmentArtyPursuers[0]
                                        .nonSenseYubSpelling
                                        ? doassesmentData
                                            .leadDoAssessmentArtyPursuers[0]
                                            .nonSenseYubSpelling
                                        : "--"}
                                    </td>
                                  </tr>
                                </tbody>
                              </table>
                            </div>
                            <div className="col-12">
                              <div className="row mb-2">
                                <div className="col-md-3 col-6 d-flex">
                                  <p className="text-sm fw-medium ">Remarks</p>
                                </div>
                                <div className="col-md-9 col-6">
                                  <p className="text-muted text-sm">
                                    {doassesmentData &&
                                    doassesmentData.leadDoAssessmentModel &&
                                    doassesmentData.leadDoAssessmentModel
                                      .length > 0 &&
                                    doassesmentData.leadDoAssessmentModel[0] &&
                                    doassesmentData.leadDoAssessmentAlphabet &&
                                    doassesmentData
                                      .leadDoAssessmentAlphabet[0] &&
                                    doassesmentData
                                      .leadDoAssessmentArtyPursuers[0]
                                      .realRemarks
                                      ? doassesmentData
                                          .leadDoAssessmentArtyPursuers[0]
                                          .realRemarks
                                      : "--"}
                                  </p>
                                </div>
                              </div>
                            </div>
                            <hr />
                            <div className="table-responsive">
                              <table class="table">
                                <thead className="table-warning">
                                  <tr>
                                    <th scope="col">CVC</th>
                                    <th scope="col">A</th>
                                    <th scope="col">E</th>
                                    <th scope="col">I</th>
                                    <th scope="col">O</th>
                                    <th scope="col">U</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  <tr>
                                    <th scope="row">L Blend</th>
                                    <td>
                                      Claf{" "}
                                      {doassesmentData &&
                                      doassesmentData.leadDoAssessmentModel &&
                                      doassesmentData.leadDoAssessmentModel
                                        .length > 0 &&
                                      doassesmentData
                                        .leadDoAssessmentModel[0] &&
                                      doassesmentData.leadDoAssessmentArtyPursuers &&
                                      doassesmentData
                                        .leadDoAssessmentArtyPursuers[0] &&
                                      doassesmentData
                                        .leadDoAssessmentArtyPursuers[0]
                                        .lblendClaf ? (
                                        <TiTick
                                          style={{
                                            color: "green",
                                            fontSize: "25px",
                                          }}
                                        />
                                      ) : (
                                        <ImCross style={{ color: "red" }} />
                                      )}
                                    </td>
                                    <td>
                                      Fled{" "}
                                      {doassesmentData &&
                                      doassesmentData.leadDoAssessmentModel &&
                                      doassesmentData.leadDoAssessmentModel
                                        .length > 0 &&
                                      doassesmentData
                                        .leadDoAssessmentModel[0] &&
                                      doassesmentData.leadDoAssessmentArtyPursuers &&
                                      doassesmentData
                                        .leadDoAssessmentArtyPursuers[0] &&
                                      doassesmentData
                                        .leadDoAssessmentArtyPursuers[0]
                                        .lblendFled ? (
                                        <TiTick
                                          style={{
                                            color: "green",
                                            fontSize: "25px",
                                          }}
                                        />
                                      ) : (
                                        <ImCross style={{ color: "red" }} />
                                      )}
                                    </td>
                                    <td>
                                      Silm{" "}
                                      {doassesmentData &&
                                      doassesmentData.leadDoAssessmentModel &&
                                      doassesmentData.leadDoAssessmentModel
                                        .length > 0 &&
                                      doassesmentData
                                        .leadDoAssessmentModel[0] &&
                                      doassesmentData.leadDoAssessmentArtyPursuers &&
                                      doassesmentData
                                        .leadDoAssessmentArtyPursuers[0] &&
                                      doassesmentData
                                        .leadDoAssessmentArtyPursuers[0]
                                        .lblendSilm ? (
                                        <TiTick
                                          style={{
                                            color: "green",
                                            fontSize: "25px",
                                          }}
                                        />
                                      ) : (
                                        <ImCross style={{ color: "red" }} />
                                      )}
                                    </td>
                                    <td>
                                      Glob{" "}
                                      {doassesmentData &&
                                      doassesmentData.leadDoAssessmentModel &&
                                      doassesmentData.leadDoAssessmentModel
                                        .length > 0 &&
                                      doassesmentData
                                        .leadDoAssessmentModel[0] &&
                                      doassesmentData.leadDoAssessmentArtyPursuers &&
                                      doassesmentData
                                        .leadDoAssessmentArtyPursuers[0] &&
                                      doassesmentData
                                        .leadDoAssessmentArtyPursuers[0]
                                        .lblendGlob ? (
                                        <TiTick
                                          style={{
                                            color: "green",
                                            fontSize: "25px",
                                          }}
                                        />
                                      ) : (
                                        <ImCross style={{ color: "red" }} />
                                      )}
                                    </td>
                                    <td>
                                      Blum{" "}
                                      {doassesmentData &&
                                      doassesmentData.leadDoAssessmentModel &&
                                      doassesmentData.leadDoAssessmentModel
                                        .length > 0 &&
                                      doassesmentData
                                        .leadDoAssessmentModel[0] &&
                                      doassesmentData.leadDoAssessmentArtyPursuers &&
                                      doassesmentData
                                        .leadDoAssessmentArtyPursuers[0] &&
                                      doassesmentData
                                        .leadDoAssessmentArtyPursuers[0]
                                        .lblendBlum ? (
                                        <TiTick
                                          style={{
                                            color: "green",
                                            fontSize: "25px",
                                          }}
                                        />
                                      ) : (
                                        <ImCross style={{ color: "red" }} />
                                      )}
                                    </td>
                                  </tr>
                                  <tr>
                                    <th scope="row">Spelling</th>
                                    <td>
                                      {doassesmentData &&
                                      doassesmentData.leadDoAssessmentModel &&
                                      doassesmentData.leadDoAssessmentModel
                                        .length > 0 &&
                                      doassesmentData
                                        .leadDoAssessmentModel[0] &&
                                      doassesmentData.leadDoAssessmentArtyPursuers &&
                                      doassesmentData
                                        .leadDoAssessmentArtyPursuers[0] &&
                                      doassesmentData
                                        .leadDoAssessmentArtyPursuers[0]
                                        .lblendClafSpelling
                                        ? doassesmentData
                                            .leadDoAssessmentArtyPursuers[0]
                                            .lblendClafSpelling
                                        : "--"}
                                    </td>
                                    <td>
                                      {doassesmentData &&
                                      doassesmentData.leadDoAssessmentModel &&
                                      doassesmentData.leadDoAssessmentModel
                                        .length > 0 &&
                                      doassesmentData
                                        .leadDoAssessmentModel[0] &&
                                      doassesmentData.leadDoAssessmentArtyPursuers &&
                                      doassesmentData
                                        .leadDoAssessmentArtyPursuers[0] &&
                                      doassesmentData
                                        .leadDoAssessmentArtyPursuers[0]
                                        .lblendFledSpelling
                                        ? doassesmentData
                                            .leadDoAssessmentArtyPursuers[0]
                                            .lblendFledSpelling
                                        : "--"}
                                    </td>
                                    <td>
                                      {doassesmentData &&
                                      doassesmentData.leadDoAssessmentModel &&
                                      doassesmentData.leadDoAssessmentModel
                                        .length > 0 &&
                                      doassesmentData
                                        .leadDoAssessmentModel[0] &&
                                      doassesmentData.leadDoAssessmentArtyPursuers &&
                                      doassesmentData
                                        .leadDoAssessmentArtyPursuers[0] &&
                                      doassesmentData
                                        .leadDoAssessmentArtyPursuers[0]
                                        .lblendSilmSpelling
                                        ? doassesmentData
                                            .leadDoAssessmentArtyPursuers[0]
                                            .lblendSilmSpelling
                                        : "--"}
                                    </td>
                                    <td>
                                      {doassesmentData &&
                                      doassesmentData.leadDoAssessmentModel &&
                                      doassesmentData.leadDoAssessmentModel
                                        .length > 0 &&
                                      doassesmentData
                                        .leadDoAssessmentModel[0] &&
                                      doassesmentData.leadDoAssessmentArtyPursuers &&
                                      doassesmentData
                                        .leadDoAssessmentArtyPursuers[0] &&
                                      doassesmentData
                                        .leadDoAssessmentArtyPursuers[0]
                                        .lblendGlobSpelling
                                        ? doassesmentData
                                            .leadDoAssessmentArtyPursuers[0]
                                            .lblendGlobSpelling
                                        : "--"}
                                    </td>
                                    <td>
                                      {doassesmentData &&
                                      doassesmentData.leadDoAssessmentArtyPursuers &&
                                      doassesmentData
                                        .leadDoAssessmentArtyPursuers.length >
                                        0 &&
                                      doassesmentData
                                        .leadDoAssessmentArtyPursuers[0] &&
                                      doassesmentData.leadDoAssessmentArtyPursuers &&
                                      doassesmentData
                                        .leadDoAssessmentArtyPursuers[0] &&
                                      doassesmentData
                                        .leadDoAssessmentArtyPursuers[0]
                                        .lblendBlumSpelling
                                        ? doassesmentData
                                            .leadDoAssessmentArtyPursuers[0]
                                            .lblendBlumSpelling
                                        : "--"}
                                    </td>
                                  </tr>
                                  <tr>
                                    <th scope="row">R Blend</th>
                                    <td>
                                      Drap{" "}
                                      {doassesmentData &&
                                      doassesmentData.leadDoAssessmentArtyPursuers &&
                                      doassesmentData
                                        .leadDoAssessmentArtyPursuers.length >
                                        0 &&
                                      doassesmentData
                                        .leadDoAssessmentArtyPursuers[0] &&
                                      doassesmentData.leadDoAssessmentArtyPursuers &&
                                      doassesmentData
                                        .leadDoAssessmentArtyPursuers[0] &&
                                      doassesmentData
                                        .leadDoAssessmentArtyPursuers[0]
                                        .rblendDrap ? (
                                        <TiTick
                                          style={{
                                            color: "green",
                                            fontSize: "25px",
                                          }}
                                        />
                                      ) : (
                                        <ImCross style={{ color: "red" }} />
                                      )}
                                    </td>
                                    <td>
                                      Curd{" "}
                                      {doassesmentData &&
                                      doassesmentData.leadDoAssessmentArtyPursuers &&
                                      doassesmentData
                                        .leadDoAssessmentArtyPursuers.length >
                                        0 &&
                                      doassesmentData
                                        .leadDoAssessmentArtyPursuers[0] &&
                                      doassesmentData.leadDoAssessmentArtyPursuers &&
                                      doassesmentData
                                        .leadDoAssessmentArtyPursuers[0] &&
                                      doassesmentData
                                        .leadDoAssessmentArtyPursuers[0]
                                        .rblendCued ? (
                                        <TiTick
                                          style={{
                                            color: "green",
                                            fontSize: "25px",
                                          }}
                                        />
                                      ) : (
                                        <ImCross style={{ color: "red" }} />
                                      )}
                                    </td>
                                    <td>
                                      Brim{" "}
                                      {doassesmentData &&
                                      doassesmentData.leadDoAssessmentArtyPursuers &&
                                      doassesmentData
                                        .leadDoAssessmentArtyPursuers.length >
                                        0 &&
                                      doassesmentData
                                        .leadDoAssessmentArtyPursuers[0] &&
                                      doassesmentData.leadDoAssessmentArtyPursuers &&
                                      doassesmentData
                                        .leadDoAssessmentArtyPursuers[0] &&
                                      doassesmentData
                                        .leadDoAssessmentArtyPursuers[0]
                                        .rblendBrim ? (
                                        <TiTick
                                          style={{
                                            color: "green",
                                            fontSize: "25px",
                                          }}
                                        />
                                      ) : (
                                        <ImCross style={{ color: "red" }} />
                                      )}
                                    </td>
                                    <td>
                                      Trop{" "}
                                      {doassesmentData &&
                                      doassesmentData.leadDoAssessmentArtyPursuers &&
                                      doassesmentData
                                        .leadDoAssessmentArtyPursuers.length >
                                        0 &&
                                      doassesmentData
                                        .leadDoAssessmentArtyPursuers[0] &&
                                      doassesmentData.leadDoAssessmentArtyPursuers &&
                                      doassesmentData
                                        .leadDoAssessmentArtyPursuers[0] &&
                                      doassesmentData
                                        .leadDoAssessmentArtyPursuers[0]
                                        .rblendTrop ? (
                                        <TiTick
                                          style={{
                                            color: "green",
                                            fontSize: "25px",
                                          }}
                                        />
                                      ) : (
                                        <ImCross style={{ color: "red" }} />
                                      )}
                                    </td>
                                    <td>
                                      Crum{" "}
                                      {doassesmentData &&
                                      doassesmentData.leadDoAssessmentArtyPursuers &&
                                      doassesmentData
                                        .leadDoAssessmentArtyPursuers.length >
                                        0 &&
                                      doassesmentData
                                        .leadDoAssessmentArtyPursuers[0] &&
                                      doassesmentData.leadDoAssessmentArtyPursuers &&
                                      doassesmentData
                                        .leadDoAssessmentArtyPursuers[0] &&
                                      doassesmentData
                                        .leadDoAssessmentArtyPursuers[0]
                                        .rblendCrum ? (
                                        <TiTick
                                          style={{
                                            color: "green",
                                            fontSize: "25px",
                                          }}
                                        />
                                      ) : (
                                        <ImCross style={{ color: "red" }} />
                                      )}
                                    </td>
                                  </tr>
                                  <tr>
                                    <th scope="row">Spelling</th>
                                    <td>
                                      {doassesmentData &&
                                      doassesmentData.leadDoAssessmentModel &&
                                      doassesmentData.leadDoAssessmentModel
                                        .length > 0 &&
                                      doassesmentData
                                        .leadDoAssessmentModel[0] &&
                                      doassesmentData.leadDoAssessmentArtyPursuers &&
                                      doassesmentData
                                        .leadDoAssessmentArtyPursuers[0] &&
                                      doassesmentData
                                        .leadDoAssessmentArtyPursuers[0]
                                        .rblendDrapSpelling
                                        ? doassesmentData
                                            .leadDoAssessmentArtyPursuers[0]
                                            .rblendDrapSpelling
                                        : "--"}
                                    </td>
                                    <td>
                                      {doassesmentData &&
                                      doassesmentData.leadDoAssessmentModel &&
                                      doassesmentData.leadDoAssessmentModel
                                        .length > 0 &&
                                      doassesmentData
                                        .leadDoAssessmentModel[0] &&
                                      doassesmentData.leadDoAssessmentArtyPursuers &&
                                      doassesmentData
                                        .leadDoAssessmentArtyPursuers[0] &&
                                      doassesmentData
                                        .leadDoAssessmentArtyPursuers[0]
                                        .rblendCuedSpelling
                                        ? doassesmentData
                                            .leadDoAssessmentArtyPursuers[0]
                                            .rblendCuedSpelling
                                        : "--"}
                                    </td>
                                    <td>
                                      {doassesmentData &&
                                      doassesmentData.leadDoAssessmentModel &&
                                      doassesmentData.leadDoAssessmentModel
                                        .length > 0 &&
                                      doassesmentData
                                        .leadDoAssessmentModel[0] &&
                                      doassesmentData.leadDoAssessmentArtyPursuers &&
                                      doassesmentData
                                        .leadDoAssessmentArtyPursuers[0] &&
                                      doassesmentData
                                        .leadDoAssessmentArtyPursuers[0]
                                        .rblendBrimSpelling
                                        ? doassesmentData
                                            .leadDoAssessmentArtyPursuers[0]
                                            .rblendBrimSpelling
                                        : "--"}
                                    </td>
                                    <td>
                                      {doassesmentData &&
                                      doassesmentData.leadDoAssessmentModel &&
                                      doassesmentData.leadDoAssessmentModel
                                        .length > 0 &&
                                      doassesmentData
                                        .leadDoAssessmentModel[0] &&
                                      doassesmentData.leadDoAssessmentArtyPursuers &&
                                      doassesmentData
                                        .leadDoAssessmentArtyPursuers[0] &&
                                      doassesmentData
                                        .leadDoAssessmentArtyPursuers[0]
                                        .rblendTropSpelling
                                        ? doassesmentData
                                            .leadDoAssessmentArtyPursuers[0]
                                            .rblendTropSpelling
                                        : "--"}
                                    </td>
                                    <td>
                                      {doassesmentData &&
                                      doassesmentData.leadDoAssessmentModel &&
                                      doassesmentData.leadDoAssessmentModel
                                        .length > 0 &&
                                      doassesmentData
                                        .leadDoAssessmentModel[0] &&
                                      doassesmentData.leadDoAssessmentArtyPursuers &&
                                      doassesmentData
                                        .leadDoAssessmentArtyPursuers[0] &&
                                      doassesmentData
                                        .leadDoAssessmentArtyPursuers[0]
                                        .rblendCrumSpelling
                                        ? doassesmentData
                                            .leadDoAssessmentArtyPursuers[0]
                                            .rblendCrumSpelling
                                        : "--"}
                                    </td>
                                  </tr>
                                  <tr>
                                    <th scope="row">S Blend</th>
                                    <td>
                                      Snap{" "}
                                      {doassesmentData &&
                                      doassesmentData.leadDoAssessmentArtyPursuers &&
                                      doassesmentData
                                        .leadDoAssessmentArtyPursuers.length >
                                        0 &&
                                      doassesmentData
                                        .leadDoAssessmentArtyPursuers[0] &&
                                      doassesmentData.leadDoAssessmentArtyPursuers &&
                                      doassesmentData
                                        .leadDoAssessmentArtyPursuers[0] &&
                                      doassesmentData
                                        .leadDoAssessmentArtyPursuers[0]
                                        .sblendSnap ? (
                                        <TiTick
                                          style={{
                                            color: "green",
                                            fontSize: "25px",
                                          }}
                                        />
                                      ) : (
                                        <ImCross style={{ color: "red" }} />
                                      )}
                                    </td>
                                    <td>
                                      Smeg{" "}
                                      {doassesmentData &&
                                      doassesmentData.leadDoAssessmentArtyPursuers &&
                                      doassesmentData
                                        .leadDoAssessmentArtyPursuers.length >
                                        0 &&
                                      doassesmentData
                                        .leadDoAssessmentArtyPursuers[0] &&
                                      doassesmentData.leadDoAssessmentArtyPursuers &&
                                      doassesmentData
                                        .leadDoAssessmentArtyPursuers[0] &&
                                      doassesmentData
                                        .leadDoAssessmentArtyPursuers[0]
                                        .sblendSmeg ? (
                                        <TiTick
                                          style={{
                                            color: "green",
                                            fontSize: "25px",
                                          }}
                                        />
                                      ) : (
                                        <ImCross style={{ color: "red" }} />
                                      )}
                                    </td>
                                    <td>
                                      Spit{" "}
                                      {doassesmentData &&
                                      doassesmentData.leadDoAssessmentArtyPursuers &&
                                      doassesmentData
                                        .leadDoAssessmentArtyPursuers.length >
                                        0 &&
                                      doassesmentData
                                        .leadDoAssessmentArtyPursuers[0] &&
                                      doassesmentData.leadDoAssessmentArtyPursuers &&
                                      doassesmentData
                                        .leadDoAssessmentArtyPursuers[0] &&
                                      doassesmentData
                                        .leadDoAssessmentArtyPursuers[0]
                                        .sblendSpit ? (
                                        <TiTick
                                          style={{
                                            color: "green",
                                            fontSize: "25px",
                                          }}
                                        />
                                      ) : (
                                        <ImCross style={{ color: "red" }} />
                                      )}
                                    </td>
                                    <td>
                                      Stomp{" "}
                                      {doassesmentData &&
                                      doassesmentData.leadDoAssessmentArtyPursuers &&
                                      doassesmentData
                                        .leadDoAssessmentArtyPursuers.length >
                                        0 &&
                                      doassesmentData
                                        .leadDoAssessmentArtyPursuers[0] &&
                                      doassesmentData.leadDoAssessmentArtyPursuers &&
                                      doassesmentData
                                        .leadDoAssessmentArtyPursuers[0] &&
                                      doassesmentData
                                        .leadDoAssessmentArtyPursuers[0]
                                        .sblendStomp ? (
                                        <TiTick
                                          style={{
                                            color: "green",
                                            fontSize: "25px",
                                          }}
                                        />
                                      ) : (
                                        <ImCross style={{ color: "red" }} />
                                      )}
                                    </td>
                                    <td>
                                      Swum{" "}
                                      {doassesmentData &&
                                      doassesmentData.leadDoAssessmentArtyPursuers &&
                                      doassesmentData
                                        .leadDoAssessmentArtyPursuers.length >
                                        0 &&
                                      doassesmentData
                                        .leadDoAssessmentArtyPursuers[0] &&
                                      doassesmentData.leadDoAssessmentArtyPursuers &&
                                      doassesmentData
                                        .leadDoAssessmentArtyPursuers[0] &&
                                      doassesmentData
                                        .leadDoAssessmentArtyPursuers[0]
                                        .sblendSwum ? (
                                        <TiTick
                                          style={{
                                            color: "green",
                                            fontSize: "25px",
                                          }}
                                        />
                                      ) : (
                                        <ImCross style={{ color: "red" }} />
                                      )}
                                    </td>
                                  </tr>
                                  <tr>
                                    <th scope="row">Spelling</th>
                                    <td>
                                      {doassesmentData &&
                                      doassesmentData.leadDoAssessmentModel &&
                                      doassesmentData.leadDoAssessmentModel
                                        .length > 0 &&
                                      doassesmentData
                                        .leadDoAssessmentModel[0] &&
                                      doassesmentData.leadDoAssessmentArtyPursuers &&
                                      doassesmentData
                                        .leadDoAssessmentArtyPursuers[0] &&
                                      doassesmentData
                                        .leadDoAssessmentArtyPursuers[0]
                                        .sblendSnapSpelling
                                        ? doassesmentData
                                            .leadDoAssessmentArtyPursuers[0]
                                            .sblendSnapSpelling
                                        : "--"}
                                    </td>
                                    <td>
                                      {doassesmentData &&
                                      doassesmentData.leadDoAssessmentModel &&
                                      doassesmentData.leadDoAssessmentModel
                                        .length > 0 &&
                                      doassesmentData
                                        .leadDoAssessmentModel[0] &&
                                      doassesmentData.leadDoAssessmentArtyPursuers &&
                                      doassesmentData
                                        .leadDoAssessmentArtyPursuers[0] &&
                                      doassesmentData
                                        .leadDoAssessmentArtyPursuers[0]
                                        .sblendSmegSpelling
                                        ? doassesmentData
                                            .leadDoAssessmentArtyPursuers[0]
                                            .sblendSmegSpelling
                                        : "--"}
                                    </td>
                                    <td>
                                      {doassesmentData &&
                                      doassesmentData.leadDoAssessmentModel &&
                                      doassesmentData.leadDoAssessmentModel
                                        .length > 0 &&
                                      doassesmentData
                                        .leadDoAssessmentModel[0] &&
                                      doassesmentData.leadDoAssessmentArtyPursuers &&
                                      doassesmentData
                                        .leadDoAssessmentArtyPursuers[0] &&
                                      doassesmentData
                                        .leadDoAssessmentArtyPursuers[0]
                                        .sblendSpitSpelling
                                        ? doassesmentData
                                            .leadDoAssessmentArtyPursuers[0]
                                            .sblendSpitSpelling
                                        : "--"}
                                    </td>
                                    <td>
                                      {doassesmentData &&
                                      doassesmentData.leadDoAssessmentModel &&
                                      doassesmentData.leadDoAssessmentModel
                                        .length > 0 &&
                                      doassesmentData
                                        .leadDoAssessmentModel[0] &&
                                      doassesmentData.leadDoAssessmentArtyPursuers &&
                                      doassesmentData
                                        .leadDoAssessmentArtyPursuers[0] &&
                                      doassesmentData
                                        .leadDoAssessmentArtyPursuers[0]
                                        .sblendStompSpelling
                                        ? doassesmentData
                                            .leadDoAssessmentArtyPursuers[0]
                                            .sblendStompSpelling
                                        : "--"}
                                    </td>
                                    <td>
                                      {doassesmentData &&
                                      doassesmentData.leadDoAssessmentModel &&
                                      doassesmentData.leadDoAssessmentModel
                                        .length > 0 &&
                                      doassesmentData
                                        .leadDoAssessmentModel[0] &&
                                      doassesmentData.leadDoAssessmentArtyPursuers &&
                                      doassesmentData
                                        .leadDoAssessmentArtyPursuers[0] &&
                                      doassesmentData
                                        .leadDoAssessmentArtyPursuers[0]
                                        .sblendSwumSpelling
                                        ? doassesmentData
                                            .leadDoAssessmentArtyPursuers[0]
                                            .sblendSwumSpelling
                                        : "--"}
                                    </td>
                                  </tr>
                                </tbody>
                              </table>
                            </div>
                            <div className="col-12">
                              <div className="row mb-2">
                                <div className="col-md-3 col-6 d-flex">
                                  <p className="text-sm fw-medium ">Remarks</p>
                                </div>
                                <div className="col-md-9 col-6">
                                  <p className="text-muted text-sm">
                                    {doassesmentData &&
                                    doassesmentData.leadDoAssessmentArtyPursuers &&
                                    doassesmentData.leadDoAssessmentArtyPursuers
                                      .length > 0 &&
                                    doassesmentData
                                      .leadDoAssessmentArtyPursuers[0] &&
                                    doassesmentData.leadDoAssessmentArtyPursuers &&
                                    doassesmentData
                                      .leadDoAssessmentArtyPursuers[0] &&
                                    doassesmentData
                                      .leadDoAssessmentArtyPursuers[0]
                                      .blendRemarks
                                      ? doassesmentData
                                          .leadDoAssessmentArtyPursuers[0]
                                          .blendRemarks
                                      : "--"}
                                  </p>
                                </div>
                              </div>
                            </div>
                            <hr />
                            <div className="table-responsive">
                              <table class="table">
                                <thead className="table-warning">
                                  <tr>
                                    <th scope="col">H Brothers</th>
                                    <th scope="col">SH</th>
                                    <th scope="col">CH</th>
                                    <th scope="col">WH</th>
                                    <th scope="col">TH</th>
                                    <th scope="col">PH</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  <tr>
                                    <th scope="row">L Blend</th>
                                    <td>
                                      Shamrock{" "}
                                      {doassesmentData &&
                                      doassesmentData.leadDoAssessmentArtyPursuers &&
                                      doassesmentData
                                        .leadDoAssessmentArtyPursuers.length >
                                        0 &&
                                      doassesmentData
                                        .leadDoAssessmentArtyPursuers[0] &&
                                      doassesmentData.leadDoAssessmentArtyPursuers &&
                                      doassesmentData
                                        .leadDoAssessmentArtyPursuers[0] &&
                                      doassesmentData
                                        .leadDoAssessmentArtyPursuers[0]
                                        .lblendShamrock ? (
                                        <TiTick
                                          style={{
                                            color: "green",
                                            fontSize: "25px",
                                          }}
                                        />
                                      ) : (
                                        <ImCross style={{ color: "red" }} />
                                      )}
                                    </td>
                                    <td>
                                      Choose{" "}
                                      {doassesmentData &&
                                      doassesmentData.leadDoAssessmentArtyPursuers &&
                                      doassesmentData
                                        .leadDoAssessmentArtyPursuers.length >
                                        0 &&
                                      doassesmentData
                                        .leadDoAssessmentArtyPursuers[0] &&
                                      doassesmentData.leadDoAssessmentArtyPursuers &&
                                      doassesmentData
                                        .leadDoAssessmentArtyPursuers[0] &&
                                      doassesmentData
                                        .leadDoAssessmentArtyPursuers[0]
                                        .lblendChoose ? (
                                        <TiTick
                                          style={{
                                            color: "green",
                                            fontSize: "25px",
                                          }}
                                        />
                                      ) : (
                                        <ImCross style={{ color: "red" }} />
                                      )}
                                    </td>
                                    <td>
                                      Whack{" "}
                                      {doassesmentData &&
                                      doassesmentData.leadDoAssessmentArtyPursuers &&
                                      doassesmentData
                                        .leadDoAssessmentArtyPursuers.length >
                                        0 &&
                                      doassesmentData
                                        .leadDoAssessmentArtyPursuers[0] &&
                                      doassesmentData.leadDoAssessmentArtyPursuers &&
                                      doassesmentData
                                        .leadDoAssessmentArtyPursuers[0] &&
                                      doassesmentData
                                        .leadDoAssessmentArtyPursuers[0]
                                        .lblendWhack ? (
                                        <TiTick
                                          style={{
                                            color: "green",
                                            fontSize: "25px",
                                          }}
                                        />
                                      ) : (
                                        <ImCross style={{ color: "red" }} />
                                      )}
                                    </td>
                                    <td>
                                      Thrust{" "}
                                      {doassesmentData &&
                                      doassesmentData.leadDoAssessmentArtyPursuers &&
                                      doassesmentData
                                        .leadDoAssessmentArtyPursuers.length >
                                        0 &&
                                      doassesmentData
                                        .leadDoAssessmentArtyPursuers[0] &&
                                      doassesmentData.leadDoAssessmentArtyPursuers &&
                                      doassesmentData
                                        .leadDoAssessmentArtyPursuers[0] &&
                                      doassesmentData
                                        .leadDoAssessmentArtyPursuers[0]
                                        .lblendThrust ? (
                                        <TiTick
                                          style={{
                                            color: "green",
                                            fontSize: "25px",
                                          }}
                                        />
                                      ) : (
                                        <ImCross style={{ color: "red" }} />
                                      )}
                                    </td>
                                    <td>
                                      Phobics{" "}
                                      {doassesmentData &&
                                      doassesmentData.leadDoAssessmentArtyPursuers &&
                                      doassesmentData
                                        .leadDoAssessmentArtyPursuers.length >
                                        0 &&
                                      doassesmentData
                                        .leadDoAssessmentArtyPursuers[0] &&
                                      doassesmentData.leadDoAssessmentArtyPursuers &&
                                      doassesmentData
                                        .leadDoAssessmentArtyPursuers[0] &&
                                      doassesmentData
                                        .leadDoAssessmentArtyPursuers[0]
                                        .lblendPhobics ? (
                                        <TiTick
                                          style={{
                                            color: "green",
                                            fontSize: "25px",
                                          }}
                                        />
                                      ) : (
                                        <ImCross style={{ color: "red" }} />
                                      )}
                                    </td>
                                  </tr>
                                  <tr>
                                    <th scope="row">Spelling</th>
                                    <td>
                                      {doassesmentData &&
                                      doassesmentData.leadDoAssessmentModel &&
                                      doassesmentData.leadDoAssessmentModel
                                        .length > 0 &&
                                      doassesmentData
                                        .leadDoAssessmentModel[0] &&
                                      doassesmentData.leadDoAssessmentArtyPursuers &&
                                      doassesmentData
                                        .leadDoAssessmentArtyPursuers[0] &&
                                      doassesmentData
                                        .leadDoAssessmentArtyPursuers[0]
                                        .lblendShamrockSpelling
                                        ? doassesmentData
                                            .leadDoAssessmentArtyPursuers[0]
                                            .lblendShamrockSpelling
                                        : "--"}
                                    </td>
                                    <td>
                                      {doassesmentData &&
                                      doassesmentData.leadDoAssessmentModel &&
                                      doassesmentData.leadDoAssessmentModel
                                        .length > 0 &&
                                      doassesmentData
                                        .leadDoAssessmentModel[0] &&
                                      doassesmentData.leadDoAssessmentArtyPursuers &&
                                      doassesmentData
                                        .leadDoAssessmentArtyPursuers[0] &&
                                      doassesmentData
                                        .leadDoAssessmentArtyPursuers[0]
                                        .lblendChooseSpelling
                                        ? doassesmentData
                                            .leadDoAssessmentArtyPursuers[0]
                                            .lblendChooseSpelling
                                        : "--"}
                                    </td>
                                    <td>
                                      {doassesmentData &&
                                      doassesmentData.leadDoAssessmentModel &&
                                      doassesmentData.leadDoAssessmentModel
                                        .length > 0 &&
                                      doassesmentData
                                        .leadDoAssessmentModel[0] &&
                                      doassesmentData.leadDoAssessmentArtyPursuers &&
                                      doassesmentData
                                        .leadDoAssessmentArtyPursuers[0] &&
                                      doassesmentData
                                        .leadDoAssessmentArtyPursuers[0]
                                        .lblendWhackSpelling
                                        ? doassesmentData
                                            .leadDoAssessmentArtyPursuers[0]
                                            .lblendWhackSpelling
                                        : "--"}
                                    </td>
                                    <td>
                                      {doassesmentData &&
                                      doassesmentData.leadDoAssessmentModel &&
                                      doassesmentData.leadDoAssessmentModel
                                        .length > 0 &&
                                      doassesmentData
                                        .leadDoAssessmentModel[0] &&
                                      doassesmentData.leadDoAssessmentArtyPursuers &&
                                      doassesmentData
                                        .leadDoAssessmentArtyPursuers[0] &&
                                      doassesmentData
                                        .leadDoAssessmentArtyPursuers[0]
                                        .lblendThrustSpelling
                                        ? doassesmentData
                                            .leadDoAssessmentArtyPursuers[0]
                                            .lblendThrustSpelling
                                        : "--"}
                                    </td>
                                    <td>
                                      {doassesmentData &&
                                      doassesmentData.leadDoAssessmentArtyPursuers &&
                                      doassesmentData
                                        .leadDoAssessmentArtyPursuers.length >
                                        0 &&
                                      doassesmentData
                                        .leadDoAssessmentArtyPursuers[0] &&
                                      doassesmentData.leadDoAssessmentArtyPursuers &&
                                      doassesmentData
                                        .leadDoAssessmentArtyPursuers[0] &&
                                      doassesmentData
                                        .leadDoAssessmentArtyPursuers[0]
                                        .lblendPhobicsSpelling
                                        ? doassesmentData
                                            .leadDoAssessmentArtyPursuers[0]
                                            .lblendPhobicsSpelling
                                        : "--"}
                                    </td>
                                  </tr>
                                </tbody>
                              </table>
                            </div>
                            <div className="col-12">
                              <div className="row mb-2">
                                <div className="col-md-3 col-6 d-flex">
                                  <p className="text-sm fw-medium ">Remarks</p>
                                </div>
                                <div className="col-md-9 col-6">
                                  <p className="text-muted text-sm">
                                    {doassesmentData &&
                                    doassesmentData.leadDoAssessmentArtyPursuers &&
                                    doassesmentData.leadDoAssessmentArtyPursuers
                                      .length > 0 &&
                                    doassesmentData
                                      .leadDoAssessmentArtyPursuers[0] &&
                                    doassesmentData.leadDoAssessmentArtyPursuers &&
                                    doassesmentData
                                      .leadDoAssessmentArtyPursuers[0] &&
                                    doassesmentData
                                      .leadDoAssessmentArtyPursuers[0]
                                      .hbrothersRemarks
                                      ? doassesmentData
                                          .leadDoAssessmentArtyPursuers[0]
                                          .hbrothersRemarks
                                      : "--"}
                                  </p>
                                </div>
                              </div>
                            </div>
                            <hr />
                            <div className="col-12">
                              <div className="row mb-2">
                                <div className="col-md-3 col-6 d-flex">
                                  <p className="text-sm fw-medium ">
                                    Sight Words
                                  </p>
                                </div>
                                <div className="col-md-9 col-6">
                                  <p className="text-muted text-sm">
                                    {doassesmentData &&
                                    doassesmentData.leadDoAssessmentArtyPursuers &&
                                    doassesmentData.leadDoAssessmentArtyPursuers
                                      .length > 0 &&
                                    doassesmentData
                                      .leadDoAssessmentArtyPursuers[0] &&
                                    doassesmentData.leadDoAssessmentArtyPursuers &&
                                    doassesmentData
                                      .leadDoAssessmentArtyPursuers[0] &&
                                    doassesmentData
                                      .leadDoAssessmentArtyPursuers[0]
                                      .hbrothersSightWords
                                      ? doassesmentData.leadDoAssessmentArtyPursuers[0].hbrothersSightWords.join(
                                          ", "
                                        )
                                      : "--"}
                                  </p>
                                </div>
                              </div>
                            </div>
                            <div className="col-12">
                              <div className="row mb-2">
                                <div className="col-md-3 col-6 d-flex">
                                  <p className="text-sm fw-medium ">Remarks</p>
                                </div>
                                <div className="col-md-9 col-6">
                                  <p className="text-muted text-sm">
                                    {doassesmentData &&
                                    doassesmentData.leadDoAssessmentModel &&
                                    doassesmentData.leadDoAssessmentModel
                                      .length > 0 &&
                                    doassesmentData.leadDoAssessmentModel[0] &&
                                    doassesmentData.leadDoAssessmentArtyPursuers &&
                                    doassesmentData
                                      .leadDoAssessmentArtyPursuers[0] &&
                                    doassesmentData
                                      .leadDoAssessmentArtyPursuers[0]
                                      .sightWordsRemarks
                                      ? doassesmentData
                                          .leadDoAssessmentArtyPursuers[0]
                                          .sightWordsRemarks
                                      : "--"}
                                  </p>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="text-center">
                          <p>Arty Pursuers Information not available </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <></>
            )}

            {/* Arrange Assessment */}
            {/* {doassesmentData.leadDoAssessmentAlphabet &&
            doassesmentData.leadDoAssessmentAlphabet.length > 0 &&
            doassesmentData.leadDoAssessmentArtyPursuers &&
            doassesmentData.leadDoAssessmentArtyPursuers.length > 0 &&
            doassesmentData.leadDoAssessmentModel &&
            doassesmentData.leadDoAssessmentModel.length > 0 ? (
              <>
              
                <div class="accordion-item">
                  <h2 class="accordion-header">
                    <button
                      class="accordion-button collapsed"
                      type="button"
                      data-bs-toggle="collapse"
                      data-bs-target="#collapseFour"
                      aria-expanded="false"
                      aria-controls="collapseFour"
                    >
                      <b>Assessment Scoring</b>
                    </button>
                  </h2>
                  <div
                    id="collapseFour"
                    class="accordion-collapse collapse"
                    data-bs-parent="#accordionExample"
                  >
                    <div class="accordion-body">

                      {doassesmentData.leadDoAssessmentAlphabet &&
                      doassesmentData.leadDoAssessmentAlphabet.length > 0 ? (
                        <div className="container-fluid">
                          <div className="row  m-3">
                            <h5 className="headColor mt-2 mb-4">
                              Beginning Sounds
                            </h5>
                            <div className="col-md-6 col-12">
                              <div className="row mb-2">
                                <div className="col-6 d-flex  align-items-center">
                                  <p className="text-sm fw-medium">
                                    Beginning Sounds Total Score
                                  </p>
                                </div>
                                <div className="col-6">
                                  <p className="text-muted text-sm">
                                    :{" "}
                                    {(doassesmentData &&
                                      doassesmentData.leadDoAssessmentModel &&
                                      doassesmentData.leadDoAssessmentModel
                                        .length > 0 &&
                                      doassesmentData
                                        .leadDoAssessmentModel[0] &&
                                      doassesmentData.leadDoAssessmentAlphabet &&
                                      doassesmentData
                                        .leadDoAssessmentAlphabet[0] &&
                                      doassesmentData
                                        .leadDoAssessmentAlphabet[0]
                                        .beginningSoundsTotalScore) ||
                                      "--"}
                                  </p>
                                </div>
                              </div>
                            </div>
                            <div className="col-md-6 col-12">
                              <div className="row mb-2">
                                <div className="col-6 d-flex  align-items-center">
                                  <p className="text-sm fw-medium">
                                    Beginning Sounds Total Weightage
                                  </p>
                                </div>
                                <div className="col-6">
                                  <p className="text-muted text-sm">
                                    :{" "}
                                    {(doassesmentData &&
                                      doassesmentData.leadDoAssessmentModel &&
                                      doassesmentData.leadDoAssessmentModel
                                        .length > 0 &&
                                      doassesmentData
                                        .leadDoAssessmentModel[0] &&
                                      doassesmentData.leadDoAssessmentAlphabet &&
                                      doassesmentData
                                        .leadDoAssessmentAlphabet[0] &&
                                      doassesmentData
                                        .leadDoAssessmentAlphabet[0]
                                        .beginningSoundsTotalWeightage) ||
                                      "--"}
                                  </p>
                                </div>
                              </div>
                            </div>
                            <div className="col-md-6 col-12">
                              <div className="row mb-2">
                                <div className="col-6 d-flex  align-items-center">
                                  <p className="text-sm fw-medium">
                                    Beginning Sounds Total Weighted Score
                                  </p>
                                </div>
                                <div className="col-6">
                                  <p className="text-muted text-sm">
                                    :{" "}
                                    {(doassesmentData &&
                                      doassesmentData.leadDoAssessmentModel &&
                                      doassesmentData.leadDoAssessmentModel
                                        .length > 0 &&
                                      doassesmentData
                                        .leadDoAssessmentModel[0] &&
                                      doassesmentData.leadDoAssessmentAlphabet &&
                                      doassesmentData
                                        .leadDoAssessmentAlphabet[0] &&
                                      doassesmentData
                                        .leadDoAssessmentAlphabet[0]
                                        .beginningSoundsTotalWeightedScore) ||
                                      "--"}
                                  </p>
                                </div>
                              </div>
                            </div>
                          </div>

                          <div className="row  m-3">
                            <h5 className="headColor mt-2 mb-4">
                              Recognition Of Letters
                            </h5>
                            <div className="col-md-6 col-12">
                              <div className="row mb-2">
                                <div className="col-6 d-flex  align-items-center">
                                  <p className="text-sm fw-medium">
                                    Recognition Of Letters Total Score
                                  </p>
                                </div>
                                <div className="col-6">
                                  <p className="text-muted text-sm">
                                    :{" "}
                                    {(doassesmentData &&
                                      doassesmentData.leadDoAssessmentModel &&
                                      doassesmentData.leadDoAssessmentModel
                                        .length > 0 &&
                                      doassesmentData
                                        .leadDoAssessmentModel[0] &&
                                      doassesmentData.leadDoAssessmentAlphabet &&
                                      doassesmentData
                                        .leadDoAssessmentAlphabet[0] &&
                                      doassesmentData
                                        .leadDoAssessmentAlphabet[0]
                                        .recognitionOfLettersTotalScore) ||
                                      "--"}
                                  </p>
                                </div>
                              </div>
                            </div>
                            <div className="col-md-6 col-12">
                              <div className="row mb-2">
                                <div className="col-6 d-flex  align-items-center">
                                  <p className="text-sm fw-medium">
                                    Recognition Of Letters Total Weightage
                                  </p>
                                </div>
                                <div className="col-6">
                                  <p className="text-muted text-sm">
                                    :{" "}
                                    {(doassesmentData &&
                                      doassesmentData.leadDoAssessmentModel &&
                                      doassesmentData.leadDoAssessmentModel
                                        .length > 0 &&
                                      doassesmentData
                                        .leadDoAssessmentModel[0] &&
                                      doassesmentData.leadDoAssessmentAlphabet &&
                                      doassesmentData
                                        .leadDoAssessmentAlphabet[0] &&
                                      doassesmentData
                                        .leadDoAssessmentAlphabet[0]
                                        .recognitionOfLettersTotalWeightage) ||
                                      "--"}
                                  </p>
                                </div>
                              </div>
                            </div>
                            <div className="col-md-6 col-12">
                              <div className="row mb-2">
                                <div className="col-6 d-flex  align-items-center">
                                  <p className="text-sm fw-medium">
                                    Recognition Of Letters Total Weighted Score
                                  </p>
                                </div>
                                <div className="col-6">
                                  <p className="text-muted text-sm">
                                    :{" "}
                                    {(doassesmentData &&
                                      doassesmentData.leadDoAssessmentModel &&
                                      doassesmentData.leadDoAssessmentModel
                                        .length > 0 &&
                                      doassesmentData
                                        .leadDoAssessmentModel[0] &&
                                      doassesmentData.leadDoAssessmentAlphabet &&
                                      doassesmentData
                                        .leadDoAssessmentAlphabet[0] &&
                                      doassesmentData
                                        .leadDoAssessmentAlphabet[0]
                                        .recognitionOfLettersTotalWeightedScore) ||
                                      "--"}
                                  </p>
                                </div>
                              </div>
                            </div>
                          </div>

                          <div className="row  m-3">
                            <h5 className="headColor mt-2 mb-4">
                              Recognition Of Sounds
                            </h5>
                            <div className="col-md-6 col-12">
                              <div className="row mb-2">
                                <div className="col-6 d-flex  align-items-center">
                                  <p className="text-sm fw-medium">
                                    Recognition Of Sounds Total Score
                                  </p>
                                </div>
                                <div className="col-6">
                                  <p className="text-muted text-sm">
                                    :{" "}
                                    {(doassesmentData &&
                                      doassesmentData.leadDoAssessmentModel &&
                                      doassesmentData.leadDoAssessmentModel
                                        .length > 0 &&
                                      doassesmentData
                                        .leadDoAssessmentModel[0] &&
                                      doassesmentData.leadDoAssessmentAlphabet &&
                                      doassesmentData
                                        .leadDoAssessmentAlphabet[0] &&
                                      doassesmentData
                                        .leadDoAssessmentAlphabet[0]
                                        .recognitionOfSoundsTotalScore) ||
                                      "--"}
                                  </p>
                                </div>
                              </div>
                            </div>
                            <div className="col-md-6 col-12">
                              <div className="row mb-2">
                                <div className="col-6 d-flex  align-items-center">
                                  <p className="text-sm fw-medium">
                                    Recognition Of Sounds Total Weightage
                                  </p>
                                </div>
                                <div className="col-6">
                                  <p className="text-muted text-sm">
                                    :{" "}
                                    {(doassesmentData &&
                                      doassesmentData.leadDoAssessmentModel &&
                                      doassesmentData.leadDoAssessmentModel
                                        .length > 0 &&
                                      doassesmentData
                                        .leadDoAssessmentModel[0] &&
                                      doassesmentData.leadDoAssessmentAlphabet &&
                                      doassesmentData
                                        .leadDoAssessmentAlphabet[0] &&
                                      doassesmentData
                                        .leadDoAssessmentAlphabet[0]
                                        .recognitionOfSoundsTotalWeightage) ||
                                      "--"}
                                  </p>
                                </div>
                              </div>
                            </div>
                            <div className="col-md-6 col-12">
                              <div className="row mb-2">
                                <div className="col-6 d-flex  align-items-center">
                                  <p className="text-sm fw-medium">
                                    Recognition Of Sounds Total Weighted Score
                                  </p>
                                </div>
                                <div className="col-6">
                                  <p className="text-muted text-sm">
                                    :{" "}
                                    {(doassesmentData &&
                                      doassesmentData.leadDoAssessmentModel &&
                                      doassesmentData.leadDoAssessmentModel
                                        .length > 0 &&
                                      doassesmentData
                                        .leadDoAssessmentModel[0] &&
                                      doassesmentData.leadDoAssessmentAlphabet &&
                                      doassesmentData
                                        .leadDoAssessmentAlphabet[0] &&
                                      doassesmentData
                                        .leadDoAssessmentAlphabet[0]
                                        .recognitionOfSoundsTotalWeightedScore) ||
                                      "--"}
                                  </p>
                                </div>
                              </div>
                            </div>
                          </div>

                          <div className="row  m-3">
                            <h5 className="headColor mt-2 mb-4">
                              Writing Letter
                            </h5>
                            <div className="col-md-6 col-12">
                              <div className="row mb-2">
                                <div className="col-6 d-flex  align-items-center">
                                  <p className="text-sm fw-medium">
                                    Writing Letter Total Score
                                  </p>
                                </div>
                                <div className="col-6">
                                  <p className="text-muted text-sm">
                                    :{" "}
                                    {(doassesmentData &&
                                      doassesmentData.leadDoAssessmentModel &&
                                      doassesmentData.leadDoAssessmentModel
                                        .length > 0 &&
                                      doassesmentData
                                        .leadDoAssessmentModel[0] &&
                                      doassesmentData.leadDoAssessmentAlphabet &&
                                      doassesmentData
                                        .leadDoAssessmentAlphabet[0] &&
                                      doassesmentData
                                        .leadDoAssessmentAlphabet[0]
                                        .writingLetterTotalScore) ||
                                      "--"}
                                  </p>
                                </div>
                              </div>
                            </div>
                            <div className="col-md-6 col-12">
                              <div className="row mb-2">
                                <div className="col-6 d-flex  align-items-center">
                                  <p className="text-sm fw-medium">
                                    Writing Letter Total Weightage
                                  </p>
                                </div>
                                <div className="col-6">
                                  <p className="text-muted text-sm">
                                    :{" "}
                                    {(doassesmentData &&
                                      doassesmentData.leadDoAssessmentModel &&
                                      doassesmentData.leadDoAssessmentModel
                                        .length > 0 &&
                                      doassesmentData
                                        .leadDoAssessmentModel[0] &&
                                      doassesmentData.leadDoAssessmentAlphabet &&
                                      doassesmentData
                                        .leadDoAssessmentAlphabet[0] &&
                                      doassesmentData
                                        .leadDoAssessmentAlphabet[0]
                                        .writingLetterTotalWeightage) ||
                                      "--"}
                                  </p>
                                </div>
                              </div>
                            </div>
                            <div className="col-md-6 col-12">
                              <div className="row mb-2">
                                <div className="col-6 d-flex  align-items-center">
                                  <p className="text-sm fw-medium">
                                    Writing Letter Total Weighted Score
                                  </p>
                                </div>
                                <div className="col-6">
                                  <p className="text-muted text-sm">
                                    :{" "}
                                    {(doassesmentData &&
                                      doassesmentData.leadDoAssessmentModel &&
                                      doassesmentData.leadDoAssessmentModel
                                        .length > 0 &&
                                      doassesmentData
                                        .leadDoAssessmentModel[0] &&
                                      doassesmentData.leadDoAssessmentAlphabet &&
                                      doassesmentData
                                        .leadDoAssessmentAlphabet[0] &&
                                      doassesmentData
                                        .leadDoAssessmentAlphabet[0]
                                        .writingLetterTotalWeightedScore) ||
                                      "--"}
                                  </p>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="row  m-3">
                            <h5 className="headColor mt-2 mb-4">
                              Over ALL Score
                            </h5>
                            <div className="col-md-6 col-12">
                              <div className="row mb-2">
                                <div className="col-6 d-flex  align-items-center">
                                  <p className="text-sm fw-medium">
                                    Grade Category
                                  </p>
                                </div>
                                <div className="col-6">
                                  <p className="text-muted text-sm">
                                    :{" "}
                                    {(doassesmentData &&
                                      doassesmentData.leadDoAssessmentModel &&
                                      doassesmentData.leadDoAssessmentModel
                                        .length > 0 &&
                                      doassesmentData
                                        .leadDoAssessmentModel[0] &&
                                      doassesmentData.leadDoAssessmentAlphabet &&
                                      doassesmentData
                                        .leadDoAssessmentAlphabet[0] &&
                                      doassesmentData
                                        .leadDoAssessmentAlphabet[0]
                                        .gradeCategory) ||
                                      "--"}
                                  </p>
                                </div>
                              </div>
                            </div>
                            <div className="col-md-6 col-12">
                              <div className="row mb-2">
                                <div className="col-6 d-flex  align-items-center">
                                  <p className="text-sm fw-medium">
                                    Grade Level
                                  </p>
                                </div>
                                <div className="col-6">
                                  <p className="text-muted text-sm">
                                    :{" "}
                                    {(doassesmentData &&
                                      doassesmentData.leadDoAssessmentModel &&
                                      doassesmentData.leadDoAssessmentModel
                                        .length > 0 &&
                                      doassesmentData
                                        .leadDoAssessmentModel[0] &&
                                      doassesmentData.leadDoAssessmentAlphabet &&
                                      doassesmentData
                                        .leadDoAssessmentAlphabet[0] &&
                                      doassesmentData
                                        .leadDoAssessmentAlphabet[0]
                                        .gradeLevel) ||
                                      "--"}
                                  </p>
                                </div>
                              </div>
                            </div>
                            <div className="col-md-6 col-12">
                              <div className="row mb-2">
                                <div className="col-6 d-flex  align-items-center">
                                  <p className="text-sm fw-medium">
                                    Over All Weighted Score
                                  </p>
                                </div>
                                <div className="col-6">
                                  <p className="text-muted text-sm">
                                    :{" "}
                                    {(doassesmentData &&
                                      doassesmentData.leadDoAssessmentModel &&
                                      doassesmentData.leadDoAssessmentModel
                                        .length > 0 &&
                                      doassesmentData
                                        .leadDoAssessmentModel[0] &&
                                      doassesmentData.leadDoAssessmentAlphabet &&
                                      doassesmentData
                                        .leadDoAssessmentAlphabet[0] &&
                                      doassesmentData
                                        .leadDoAssessmentAlphabet[0]
                                        .overallWeightedScore) ||
                                      "--"}
                                  </p>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="text-center">
                          <p>Alphabet Scoring not available </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <></>
            )} */}
          </div>
        </div>
      </div>
    </>
  );
}

export default Leadview;
