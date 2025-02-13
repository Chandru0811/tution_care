import React, { useState } from "react";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import Form1 from "./AddEnrollment/Form1";
import Form2 from "./AddEnrollment/Form2";
import Form3 from "./AddEnrollment/Form3";
import Form4 from "./AddEnrollment/Form4";
import Form5 from "./AddEnrollment/Form5";
import Form6 from "./AddEnrollment/Form6";
import { Link, useNavigate } from "react-router-dom";
import { OverlayTrigger, Tooltip } from "react-bootstrap";

export default function EnrollmentAdd() {
  const [activeStep, setActiveStep] = useState(0);
  const [formData, setFormData] = useState({ lead_id: null });
  const [loadIndicator, setLoadIndicator] = useState(false);
  const ConfigurationData = localStorage.getItem("tuitionConfigurationData");
  const navigate = useNavigate();
  console.log("activeStep", activeStep);

  let filteredSteps = [];
  let filteredForms = [];

  if (ConfigurationData) {
    const parsedData = JSON.parse(ConfigurationData);
    console.log("Lead Form Data:", parsedData.leadForm[0]);

    const leadFormConfig = parsedData.leadForm[0]; 

    const allSteps = [
      { key: "studentInfo", tooltip: "Student Information", component: Form1 },
      { key: "childAbility", tooltip: "Child Ability", component: Form2 },
      { key: "parentInfo", tooltip: "Parent Information", component: Form3 },
      { key: "address", tooltip: "Address", component: Form4 },
      { key: "accountInfo", tooltip: "Account Information", component: Form5 },
      {
        key: "mediaPosting",
        tooltip: "Permission for Media Posting",
        component: Form6,
      },
    ];

    filteredSteps = Object.values(leadFormConfig).some(Boolean)
      ? allSteps.filter((step) => leadFormConfig[step.key])
      : allSteps;

    filteredForms = filteredSteps.map((step) => step.component);
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

    if (childRef.current) {
      const formMethod = `form${activeStep + 1}`;
      if (typeof childRef.current[formMethod] === "function") {
        childRef.current[formMethod]();
      }
    }
  };

  return (
    <div className="container-fluid minHeight">
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
          {" "}
          &nbsp;Lead Management{" "}
          <span className="breadcrumb-separator"> &gt; </span>{" "}
        </li>
        <li>
          <Link to="/lead/lead" className="custom-breadcrumb">
            {" "}
            &nbsp;Lead
          </Link>
          <span className="breadcrumb-separator"> &gt; </span>
        </li>
        <li className="breadcrumb-item active" aria-current="page">
          Lead Add
        </li>
      </ol>

      {/* Stepper */}
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

      <div className="container-fluid card shadow border-0 mb-4">
        <React.Fragment>
          {filteredForms[activeStep] &&
            React.createElement(filteredForms[activeStep], {
              formData,
              ref: childRef,
              setFormData,
              handleNext,
              setLoadIndicators: setLoadIndicator,
              ...(activeStep === filteredSteps.length - 1 && { navigate }), 
            })}

          <div className="container-fluid p-1 d-flex align-items-center justify-content-center">
            {activeStep > 0 && (
              <button
                className="btn btn-border btn-sm mt-5 mb-3"
                style={{ padding: "7px" }}
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
                : "Save And Next"}
            </button>
          </div>
        </React.Fragment>
      </div>
    </div>
  );
}
