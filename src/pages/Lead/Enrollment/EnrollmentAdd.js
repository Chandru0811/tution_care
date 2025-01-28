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
import Tooltip from "react-bootstrap/Tooltip";
import { OverlayTrigger } from "react-bootstrap";
import { Link } from "react-router-dom";

const steps = [
  { tooltip: "Student Information" },
  { tooltip: "Child Ability" },
  { tooltip: "Parent Information" },
  { tooltip: "Address" },
  { tooltip: "Account Information" },
  { tooltip: "Permission for Medias Posting" },
];

export default function EnrollmentAdd() {
  const [activeStep, setActiveStep] = useState(0);
  const [formData, setFormData] = useState({ lead_id: null });
  const [loadIndicator, setLoadIndicator] = useState(false);

  const childRef = React.useRef();

  const handleNext = () => {
    setActiveStep((prevStep) => prevStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };

  const handleButtonClick = () => {
    if (loadIndicator) return; // Prevent double clicks

    // Set loading to true to disable the button while processing
    // setLoadIndicator(true);

    switch (activeStep.toString()) {
      case "0":
        if (childRef.current) {
          childRef.current.form1();
        }
        break;
      case "1":
        if (childRef.current) {
          childRef.current.form2();
        }
        break;
      case "2":
        if (childRef.current) {
          childRef.current.form3();
        }
        break;
      case "3":
        if (childRef.current) {
          childRef.current.form4();
        }
        break;
      case "4":
        if (childRef.current) {
          childRef.current.form5();
        }
        break;
      case "5":
        if (childRef.current) {
          childRef.current.form6();
        }
        break;

      default:
        break;
    }

    // Reset loading state after processing (you can adjust this logic to fit your needs)
    // setTimeout(() => {
    //   setLoadIndicator(false); // Allow button to be clicked again after a delay
    //   handleNext(); // Proceed to the next step
    // }, 1000); // Adjust this delay as needed
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
          &nbsp;Lead Management
          <span className="breadcrumb-separator"> &gt; </span>
        </li>
        <li>
          <Link to="/lead/lead" className="custom-breadcrumb">
            &nbsp;Lead
          </Link>
          <span className="breadcrumb-separator"> &gt; </span>
        </li>
        <li className="breadcrumb-item active" aria-current="page">
          Lead Add
        </li>
      </ol>
      <Stepper className="my-5" activeStep={activeStep} alternativeLabel>
        {steps.map((step, index) => (
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
          {activeStep === 0 && (
            <Form1
              formData={formData}
              ref={childRef}
              setFormData={setFormData}
              handleNext={handleNext}
              setLoadIndicators={setLoadIndicator}
            />
          )}
          {activeStep === 1 && (
            <Form2
              formData={formData}
              ref={childRef}
              setFormData={setFormData}
              handleNext={handleNext}
              setLoadIndicators={setLoadIndicator}
            />
          )}
          {activeStep === 2 && (
            <Form3
              formData={formData}
              ref={childRef}
              setFormData={setFormData}
              handleNext={handleNext}
              setLoadIndicators={setLoadIndicator}
            />
          )}
          {activeStep === 3 && (
            <Form4
              formData={formData}
              ref={childRef}
              setFormData={setFormData}
              handleNext={handleNext}
              setLoadIndicators={setLoadIndicator}
            />
          )}
          {activeStep === 4 && (
            <Form5
              formData={formData}
              ref={childRef}
              setFormData={setFormData}
              handleNext={handleNext}
              setLoadIndicators={setLoadIndicator}
            />
          )}
          {activeStep === 5 && (
            <Form6
              formData={formData}
              ref={childRef}
              setFormData={setFormData}
              handleNext={handleNext}
              setLoadIndicators={setLoadIndicator}
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
              {activeStep === steps.length - 1 ? "Submit" : "Save And Next"}
            </button>
          </div>
        </React.Fragment>
      </div>
    </div>
  );
}
