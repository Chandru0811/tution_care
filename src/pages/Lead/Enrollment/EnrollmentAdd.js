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
  const ConfigurationData = JSON.parse(
    localStorage.getItem("tmsappConfigInfo")
  );
  const navigate = useNavigate();

  const allSteps = [
    { key: "isStudentInfo", tooltip: "Student Information", component: Form1 },
    { key: "isChildAbility", tooltip: "Child Ability", component: Form2 },
    { key: "isParentInfo", tooltip: "Parent Information", component: Form3 },
    { key: "isAddress", tooltip: "Address", component: Form4 },
    { key: "isAccountInfo", tooltip: "Account Information", component: Form5 },
    {
      key: "isMediaPosting",
      tooltip: "Permission for Media Posting",
      component: Form6,
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
        case "isStudentInfo":
          childRef.current.form1();
          break;
        case "isChildAbility":
          childRef.current.form2();
          break;
        case "isParentInfo":
          childRef.current.form3();
          break;
        case "isAddress":
          childRef.current.form4();
          break;
        case "isAccountInfo":
          childRef.current.form5();
          break;
        case "isMediaPosting":
          childRef.current.form6();
          break;
        default:
          break;
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
        {/* <li>
          {" "}
          &nbsp;{appConfigInfo.lead}
          <span className="breadcrumb-separator"> &gt; </span>{" "}
        </li> */}
        <li>
          <Link to="/lead/lead" className="custom-breadcrumb">
            {" "}
            &nbsp;{ConfigurationData.lead}
          </Link>
          <span className="breadcrumb-separator"> &gt; </span>{" "}
        </li>
        <li className="breadcrumb-item active" aria-current="page">
          {ConfigurationData.lead} Add
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

      <div className="container-fluid card shadow border-0 mb-4">
        <React.Fragment>
          {filteredSteps[activeStep].key === "isStudentInfo" && (
            <Form1
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
          {filteredSteps[activeStep].key === "isChildAbility" && (
            <Form2
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
          {filteredSteps[activeStep].key === "isParentInfo" && (
            <Form3
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
          {filteredSteps[activeStep].key === "isAddress" && (
            <Form4
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
          {filteredSteps[activeStep].key === "isAccountInfo" && (
            <Form5
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
          {filteredSteps[activeStep].key === "isMediaPosting" && (
            <Form6
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
