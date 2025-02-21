import * as React from "react";
import { useState } from "react";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import AddCourceDetails from "./AddStudent/AddCourceDetails";
import AddParentGuardian from "./AddStudent/AddParentGuardian";
import AddStudentDetails from "./AddStudent/AddStudentDetails";
import AddEmergencyContact from "./AddStudent/AddEmergencyContact";
// import AddStudentRelation from "./AddStudent/AddStudentRelation";
import AddTermsAndCondition from "./AddStudent/AddTermsAndCondition";
import Tooltip from "react-bootstrap/Tooltip";
import { OverlayTrigger } from "react-bootstrap";
import { Link, useNavigate, useSearchParams } from "react-router-dom";

export default function StudentAdd() {
  const [activeStep, setActiveStep] = useState(0);
  const [searchParams] = useSearchParams();
  const LeadId = searchParams.get("LeadId");
  const LeadStatus = searchParams.get("LeadStatus");
  const [formData, setFormData] = useState({ LeadId, LeadStatus });
  const [loadIndicator, setLoadIndicator] = useState(false);
  const ConfigurationData = JSON.parse(
    localStorage.getItem("tmsappConfigInfo")
  );
  const navigate = useNavigate();

  const allSteps = [
    {
      key: "isStudentDetails",
      tooltip: "Student Details",
    },
    {
      key: "isParentsGuardian",
      tooltip: "Parent Guardian",
    },
    {
      key: "isEmergencyContact",
      tooltip: "Emergency Contact",
    },
    {
      key: "isCourseDetails",
      tooltip: "Course Details",
    },
    {
      key: "isTermsAndCondition",
      tooltip: "Terms AndCondition",
    },
  ];
  let filteredSteps = allSteps;
  if (ConfigurationData) {
    filteredSteps = allSteps.filter((step) => ConfigurationData[step.key]);
  }

  const childRef = React.useRef();

  const handleNext = () => {
    setActiveStep((prevStep) => prevStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };

  const handleButtonClick = () => {
    if (loadIndicator) return;

    const currentForm = filteredSteps[activeStep];

    if (childRef.current) {
      switch (currentForm.key) {
        case "isStudentDetails":
          childRef.current.StudentDetails();
          break;
        case "isParentsGuardian":
          childRef.current.ParentGuardian();
          break;
        case "isEmergencyContact":
          childRef.current.EmergencyContact();
          break;
        case "isCourseDetails":
          childRef.current.CourseDetail();
          break;
        case "isTermsAndCondition":
          childRef.current.TermsAndCondition();
          break;
        default:
          break;
      }
    }
  };

  return (
    <div class="container-fluid minHeight">
      <ol
        className="breadcrumb my-3 px-2"
        style={{ listStyle: "none", padding: 0, margin: 0 }}
      >
        <li>
          <Link to="/" className="custom-breadcrumb">
            Home
          </Link>
          <span className="breadcrumb-separator"> &gt; </span>
        </li>
        <li>
          {ConfigurationData?.student || "Student"} Management
          <span className="breadcrumb-separator"> &gt; </span>
        </li>
        <li>
          <Link to="/student" className="custom-breadcrumb">
            {ConfigurationData?.student || "Student"} Listing
          </Link>
          <span className="breadcrumb-separator"> &gt; </span>
        </li>
        <li className="breadcrumb-item active" aria-current="page">
          {ConfigurationData?.student || "Student"} Listing Add
        </li>
      </ol>
      <Stepper className="my-5" activeStep={activeStep} alternativeLabel>
        {filteredSteps.map((step, index) => (
          <Step key={index}>
            <OverlayTrigger
              placement="top"
              overlay={
                <Tooltip id={`tooltip-${index}`}>{step.tooltip}</Tooltip>
              }
            >
              <StepLabel></StepLabel>
            </OverlayTrigger>
          </Step>
        ))}
      </Stepper>
      <div class="container-fluid py-3 mb-5 card shadow border-0 mb-7">
        <React.Fragment>
          {filteredSteps[activeStep].key === "isStudentDetails" && (
            <AddStudentDetails
              formData={formData}
              ref={childRef}
              setFormData={setFormData}
              handleNext={handleNext}
              setLoadIndicators={setLoadIndicator}
              navigate={
                activeStep === filteredSteps.length - 1 ? navigate : undefined
              }
            />
          )}
          {filteredSteps[activeStep].key === "isParentsGuardian" && (
            <AddParentGuardian
              formData={formData}
              ref={childRef}
              setFormData={setFormData}
              handleNext={handleNext}
              setLoadIndicators={setLoadIndicator}
              navigate={
                activeStep === filteredSteps.length - 1 ? navigate : undefined
              }
            />
          )}
          {filteredSteps[activeStep].key === "isEmergencyContact" && (
            <AddEmergencyContact
              formData={formData}
              ref={childRef}
              setFormData={setFormData}
              handleNext={handleNext}
              setLoadIndicators={setLoadIndicator}
              navigate={
                activeStep === filteredSteps.length - 1 ? navigate : undefined
              }
            />
          )}
          {filteredSteps[activeStep].key === "isCourseDetails" && (
            <AddCourceDetails
              formData={formData}
              ref={childRef}
              setFormData={setFormData}
              handleNext={handleNext}
              setLoadIndicators={setLoadIndicator}
              navigate={
                activeStep === filteredSteps.length - 1 ? navigate : undefined
              }
            />
          )}
          {filteredSteps[activeStep].key === "isTermsAndCondition" && (
            <AddTermsAndCondition
              formData={formData}
              ref={childRef}
              setFormData={setFormData}
              handleNext={handleNext}
              setLoadIndicators={setLoadIndicator}
              navigate={
                activeStep === filteredSteps.length - 1 ? navigate : undefined
              }
            />
          )}

          <div className="container-fluid p-1 d-flex align-items-center justify-content-center">
            {activeStep > 0 && (
              <button
                className="btn btn-border btn-sm"
                style={{ padding: "7px" }}
                disabled={activeStep === 0}
                onClick={handleBack}
              >
                Back
              </button>
            )}

            <div style={{ flex: "1 1 auto" }}></div>

            <button
              type="submit"
              onClick={handleButtonClick}
              style={{ padding: "7px" }}
              className="btn btn-button btn-sm"
              disabled={loadIndicator}
            >
              {loadIndicator && (
                <span
                  className="spinner-border spinner-border-sm me-2"
                  aria-hidden="true"
                ></span>
              )}
              {activeStep === filteredSteps.length - 1
                ? "Submit"
                : " Save And Next"}
            </button>
          </div>
        </React.Fragment>
      </div>
    </div>
  );
}
