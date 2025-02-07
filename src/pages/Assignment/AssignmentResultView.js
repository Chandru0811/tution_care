import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import api from "../../config/URL";
import AttactmentPdf from "../../assets/images/Attactmentpdf.jpg";
import AttactmentExcel from "../../assets/images/AttactmentExcel.jpg";
import AttactmentOther from "../../assets/images/Attactmentothers.jpg";
import AttactmentWord from "../../assets/images/AttactmentWord.jpg";
import AttactmentPpt from "../../assets/images/AttachmentPpt.png";
import { IoMdDownload } from "react-icons/io";
import { Button, Modal } from "react-bootstrap";

function AssignmentResultView() {
  const { id } = useParams();
  const [data, setData] = useState({});
  console.log("Data", data);
  const [showModal, setShowModal] = useState(false);
  const [remark, setRemark] = useState("");

  const handleModalClose = () => setShowModal(false);
  const handleModalShow = () => setShowModal(true);
  const handleRemarkSubmit = () => {
    console.log("Remark Submitted:", remark);

    // Here, add your logic to save the remark.
    // Example API call to save remark
    // await api.post('/saveRemark', { remark });

    handleModalClose(); // Close the modal after submitting the remark
    setRemark(""); // Clear the textarea field
  };

  const renderAttachment = (attachment) => {
    if (!attachment || !attachment.fileUrl) {
      return <span>No attachment available</span>;
    }
    // console.log("firstAttachment", attachment)
    const url = attachment.fileUrl;
    const extension = url.split(".").pop().toLowerCase();
    let fileName = url.split("/").pop();
    fileName = fileName.replace(/\+/g, " ");

    const downloadFile = () => {
      const a = document.createElement("a");
      a.href = url;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    };

    // const deletedId = data.smsPushNotificationAttachments[0]?.id;

    const renderCard = (src, label, attachmentId, isVideo = false) => (
      <div className="position-relative d-flex align-items-center mb-3">
        <div className="card" style={{ width: "18rem", marginTop: "20px" }}>
          {isVideo ? (
            <video
              width="100%"
              height="auto"
              controls
              style={{ maxHeight: "150px" }}
            >
              <source src={src} type="video/mp4" />
              <source src={src} type="video/ogg" />
              Your browser does not support the video tag.
            </video>
          ) : (
            <img
              src={src}
              alt={label}
              style={{ width: "100%", maxHeight: "150px", objectFit: "cover" }}
            />
          )}
          <div className="card-body">
            <div className="row">
              <div className="col-md-8 col-12 text-end">
                <p>{fileName}</p>
              </div>
              <div className="col-md-4 col-12 text-end">
                <p>
                  <IoMdDownload
                    onClick={downloadFile}
                    style={{ cursor: "pointer" }}
                  />
                </p>
              </div>
            </div>
          </div>
        </div>
        {/* <div
          className="delete-icon-container"
          style={{ marginLeft: "10px", marginBottom: "8rem" }}
        >
          <Delete path={`/deleteSmsPushNotifications/${deletedId}`} id={attachmentId} onSuccess={getData} />
          <Delete id={attachmentId} onSuccess={getData} />
        </div> */}
      </div>
    );

    switch (extension) {
      case "jpg":
      case "jpeg":
      case "png":
      case "gif":
        return renderCard(url, "Image", attachment.id);
      case "pdf":
        return renderCard(AttactmentPdf, "PDF", attachment.id);
      case "xls":
      case "xlsx":
      case "csv":
        return renderCard(AttactmentExcel, "Excel", attachment.id);
      case "mp4":
      case "ogg":
        return renderCard(url, "Video", attachment.id, true);
      case "doc":
      case "docx":
        return renderCard(AttactmentWord, "Word", attachment.id);
      case "ppt":
      case "pptx":
        return renderCard(AttactmentPpt, "PPT", attachment.id);
      default:
        return renderCard(AttactmentOther, "Other", attachment.id);
    }
  };

  const getData = async () => {
    try {
      const response = await api.get(`/getAssignmentQuestionWithAnswer/${id}`);
      console.log("first", response.data);
      setData(response.data);
    } catch (error) {
      console.error("Error fetching data ", error);
    }
  };

  useEffect(() => {
    getData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  return (
    <div className="container-fluid ">
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
          Assignment Management
          <span className="breadcrumb-separator"> &gt; </span>
        </li>
        <li>
          <Link to="/assignmentResult" className="custom-breadcrumb">
            Assignment Result
          </Link>
          <span className="breadcrumb-separator"> &gt; </span>
        </li>
        <li className="breadcrumb-item active" aria-current="page">
          Assignment View
        </li>
      </ol>
      <div>
        <div className="card">
          <div
            className="d-flex px-4 justify-content-between align-items-center p-1 mb-4"
            style={{ background: "#f5f7f9" }}
          >
            <div class="d-flex align-items-center">
              <div class="d-flex">
                <div class="dot active"></div>
              </div>
              <span class="me-2 text-muted">Assignment View</span>
            </div>
            <div className="my-2 pe-3 d-flex align-items-center">
              <button
                type="button"
                className="btn btn-primary btn-sm me-3"
                onClick={handleModalShow}
              >
                Remark
              </button>
              <Link to="/assignmentResult">
                <button type="button " className="btn btn-sm btn-border   ">
                  Back
                </button>
              </Link>
              &nbsp;&nbsp;
            </div>
          </div>
          <div className="container-fluid">
            {/* <h1 className="headColor">View Announcement</h1> */}
            <div className="row mt-2 pb-3">
              <div className="col-md-6 col-12">
                <div className="row mb-2">
                  <div className="col-6">
                    <p className="fw-medium">Centre </p>
                  </div>
                  <div className="col-6 text-start">
                    <p className="text-muted text-sm">
                      {" "}
                      : {data.center || "--"}
                    </p>
                  </div>
                </div>
              </div>
              <div className="col-md-6 col-12">
                <div className="row mb-2">
                  <div className="col-6">
                    <p className="fw-medium">Course </p>
                  </div>
                  <div className="col-6 text-start">
                    <p className="text-muted text-sm">
                      {" "}
                      : {data.course || "--"}
                    </p>
                  </div>
                </div>
              </div>

              <div className="col-md-6 col-12 mb-3">
                <div className="row">
                  <div className="col-6">
                    <p className="fw-medium">Class Listing</p>
                  </div>
                  <div className="col-6 text-start">
                    <p className="text-muted">: {data.classListing || "--"}</p>
                  </div>
                </div>
              </div>

              <div className="col-md-6 col-12 mb-3">
                <div className="row">
                  <div className="col-6">
                    <p className="fw-medium">Teacher</p>
                  </div>
                  <div className="col-6 text-start">
                    <p className="text-muted">: {data.user || "--"}</p>
                  </div>
                </div>
              </div>

              <div className="col-md-6 col-12 mb-3">
                <div className="row">
                  <div className="col-6">
                    <p className="fw-medium">Days</p>
                  </div>
                  <div className="col-6 text-start">
                    <p className="text-muted">: {data.day || "--"}</p>
                  </div>
                </div>
              </div>

              <div className="col-md-6 col-12">
                <div className="row mb-2">
                  <div className="col-6">
                    <p className="fw-medium">Batch Time</p>
                  </div>
                  <div className="col-6 text-start">
                    <p className="text-muted text-sm">
                      : {data.batchTime || "--"}
                    </p>
                  </div>
                </div>
              </div>

              <div className="col-md-6 col-12">
                <div className="row mb-2">
                  <div className="col-6">
                    <p className="fw-medium">Folder Category</p>
                  </div>
                  <div className="col-6 text-start">
                    <p className="text-muted text-sm">
                      : {data.folderCategory || "--"}
                    </p>
                  </div>
                </div>
              </div>

              <div className="col-md-6 col-12">
                <div className="row mb-2">
                  <div className="col-6">
                    <p className="fw-medium"> Student Name</p>
                  </div>
                  <div className="col-6 text-start">
                    <p className="text-muted text-sm">
                      : {data.studentName || "--"}
                    </p>
                  </div>
                </div>
              </div>

              <div className="col-md-6 col-12">
                <div className="row mb-2">
                  <div className="col-6">
                    <p className="fw-medium">Date</p>
                  </div>
                  <div className="col-6 text-start">
                    <p className="text-muted text-sm">: {data.date || "--"}</p>
                  </div>
                </div>
              </div>

              <div className="col-md-6 col-12">
                <div className="row mb-2">
                  <div className="col-6">
                    <p className="fw-medium">Expired Date</p>
                  </div>
                  <div className="col-6 text-start">
                    <p className="text-muted text-sm">
                      : {data.expiredDate || "--"}
                    </p>
                  </div>
                </div>
              </div>

              <div className="col-md-12 col-12 mb-3">
                <div className="row mb-2">
                  <div className="col-12">
                    <p className="fw-medium">Teacher Assignment :</p>
                  </div>
                  {data.attachments && data.attachments.length > 0 ? (
                    <div className="col-12">
                      <div className="row">
                        {data.attachments.map((attachment, index) => (
                          <div key={index} className="col-md-6 col-12 mb-2">
                            {renderAttachment(attachment)}
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <p className="text-muted">No attachments available</p>
                  )}
                </div>
              </div>

              <div className="col-md-12 col-12 mb-3">
                <div className="row mb-2">
                  <div className="col-12">
                    <p className="fw-medium">Student Assignments:</p>
                  </div>
                  {data.attachments && data.attachments.length > 0 ? (
                    <div className="col-12">
                      <div className="row">
                        {data.attachments.map((attachment, index) => (
                          <div key={index} className="col-md-6 col-12 mb-2">
                            {renderAttachment(attachment)}
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <p className="text-muted">No attachments available</p>
                  )}
                </div>
              </div>

              {/* Modal */}
              <Modal show={showModal} onHide={handleModalClose}>
                <Modal.Header closeButton>
                  <Modal.Title>Add Remark</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                  <textarea
                    className="form-control"
                    rows="5"
                    placeholder="Enter your remark"
                    value={remark}
                    onChange={(e) => setRemark(e.target.value)}
                  ></textarea>
                </Modal.Body>
                <Modal.Footer>
                  <Button variant="secondary" onClick={handleModalClose}>
                    Close
                  </Button>
                  <Button variant="primary" onClick={handleRemarkSubmit}>
                    Submit Remark
                  </Button>
                </Modal.Footer>
              </Modal>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AssignmentResultView;
