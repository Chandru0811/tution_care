import { useState } from "react";
import Modal from "react-bootstrap/Modal";

function PreviewJobOpening() {
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  return (
    <>
      <button
        type="button"
        className="btn btn-button mx-2"
        onClick={handleShow}
      >
        Preview
      </button>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Job Opening</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="container">
            <div className="row mb-5">
              <div className="d-flex flex-column justify-content-end  align-items-end">
                <p className="text-sm">766, Sakthi Tower Ln,</p>
                <p className="text-sm">Anna Salai, Thousand Lights,</p>
                <p className="text-sm">
                  <b>Chennai, Tamil Nadu 600002</b>
                </p>
              </div>
            </div>
            <div className="row">
              <div className="col-md-12 col-12">
                <div className="row mb-3">
                  <p className="text-sm">
                    Looking for multiple java developers(10+ positions)- Remote
                    option available. Need to report to Chennai Office.
                  </p>
                </div>
              </div>
              <div className="col-md-12 col-12">
                <div className="row mb-3">
                  <p className="text-sm">
                    <b>Job Description</b>
                  </p>
                  <p className="text-sm">
                    Competitive Salary- Remote- Multiple Positions
                  </p>
                </div>
              </div>
              <div className="col-md-12 col-12">
                <div className="row mb-3">
                  <ul className="text-sm">
                    looking for a candidate with the following skill sets: Java
                    FullStack developement, Colud Platform,Agile
                    pair-programming,JUnit TDD java Spring Boot prefer Jenkins
                    CI/CD microservices Cloud
                  </ul>
                  <ul className="text-sm">
                    Full stack java developer with 3+ years in Java/J2EE
                  </ul>
                  <ul className="text-sm">
                    Proficient in the following: Spring Core, Spring Tx,
                    REST,JMS
                  </ul>
                  <ul className="text-sm">
                    Proficient in Persistence Techologies: Spring Data,
                    Hibernate,JPA,JDBC
                  </ul>
                  <ul className="text-sm">
                    Strong working knowledge in SQL, PL/SQL
                  </ul>
                  <ul className="text-sm">
                    Strong working knowledge in Application Servers: Spring Boot
                  </ul>
                  <ul className="text-sm">
                    Strong working knowledge in React JS
                  </ul>
                  <ul className="text-sm">
                    Experience in all phases of the SDLC
                  </ul>
                  <ul className="text-sm">
                    Experience developing continuous integration, countinuous
                    delivery and continuous deployment pipelines for distributed
                    apps, using tools such as jenkins
                  </ul>
                  <ul className="text-sm">
                    Evidence of troubleshooting and solving problems in a highly
                    technical customer focused service environment
                  </ul>
                  <p className="text-sm">
                    Committed to delivering quality and well-tested software
                  </p>
                  <ul className="text-sm">
                    Disciplined and successful in delivering accurate and timely
                    results
                  </ul>
                </div>
              </div>
            </div>
          </div>
          <div className="container-fluid">
            <div className="row">
                <p><b>Forward your CV to mailto:hr@ecscloudinfotech.com</b></p>
                <p><b>Call us @ +91 84386 70535 /9361365818 / 7700002110</b></p>
                <p><b>Candidates with short notice are welcome</b></p>
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>

        <button
        type=""
        className="btn btn-button mx-2"
        onClick={handleClose}
      >
        Okay
      </button>
          {/* <Button variant="secondary btn-sm" onClick={handleClose}>
           Okay
          </Button> */}
          {/* <Button variant="primary" onClick={handleClose}>
            Save Changes
          </Button> */}
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default PreviewJobOpening;
