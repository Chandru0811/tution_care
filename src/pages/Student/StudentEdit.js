import * as React from "react";
import { useState } from "react";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import { Link, useNavigate, useParams } from "react-router-dom";
import Tooltip from "react-bootstrap/Tooltip";
import { OverlayTrigger } from "react-bootstrap";
import EditStudentDetails from "./EditStudent/EditStudentDetails";
import EditParentGuardian from "./EditStudent/EditParentGuardian";
import EditEmergencyContact from "./EditStudent/EditEmergencyContact";
import EditTermsAndCondition from "./EditStudent/EditTermsAndCondition";
import EditCourseDetails from "./EditStudent/EditCourceDetails";


export default function StudentAdd() {
  const { id } = useParams();
  const [loadIndicator, setLoadIndicator] = useState(false);
  const [activeStep, setActiveStep] = useState(0);

  const [formData, setFormData] = useState({ id });
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
    <div className="container-fluid minHeight">
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
          {ConfigurationData?.student || "Student Management"}
          <span className="breadcrumb-separator"> &gt; </span>
        </li>
        <li>
          <Link to="/student" className="custom-breadcrumb">
            {ConfigurationData?.student || "Student"} Listing
          </Link>
          <span className="breadcrumb-separator"> &gt; </span>
        </li>
        <li className="breadcrumb-item active" aria-current="page">
          {ConfigurationData?.student || "Student"} Listing Edit
        </li>
      </ol>

      <Stepper className="my-5" activeStep={activeStep} alternativeLabel>
        {filteredSteps.map((step, index) => (
          <Step key={index} onClick={() => setActiveStep(index)}>
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

      <div className="container-fluid card shadow border-0 mb-4">
        <React.Fragment>
          {filteredSteps[activeStep].key === "isStudentDetails" && (
            <EditStudentDetails
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
            <EditParentGuardian
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
            <EditEmergencyContact
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
            <EditCourseDetails
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
            <EditTermsAndCondition
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
                className="btn btn-border btn-sm mt-5 mb-3"
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
              {activeStep === filteredSteps.length - 1 ? "Submit" : " Save And Next"}
            </button>
          </div>
        </React.Fragment>
      </div>
    </div>
  );
}
