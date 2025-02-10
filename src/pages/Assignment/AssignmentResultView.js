import React, { useEffect, useState } from "react";
import { Link, useParams, useSearchParams } from "react-router-dom";
import api from "../../config/URL";
import AttactmentPdf from "../../assets/images/Attactmentpdf.jpg";
import AttactmentExcel from "../../assets/images/AttactmentExcel.jpg";
import AttactmentOther from "../../assets/images/Attactmentothers.jpg";
import AttactmentWord from "../../assets/images/AttactmentWord.jpg";
import AttactmentPpt from "../../assets/images/AttachmentPpt.png";
import { IoMdDownload } from "react-icons/io";
import { Button, Modal } from "react-bootstrap";
import { toast } from "react-toastify";
import { useFormik } from "formik";
import * as Yup from "yup";

function AssignmentResultView() {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const studentId = searchParams.get("studentId");
  const [data, setData] = useState({});
  console.log("Data", data);
  const [showModal, setShowModal] = useState(false);

  const handleModalClose = () => setShowModal(false);
  const handleModalShow = () => {
    formik.resetForm();
    setShowModal(true);
  };

  const formik = useFormik({
    initialValues: {
      remark: "",
    },
    validationSchema: Yup.object({
      remark: Yup.string().required("Remark is required"),
    }),
    onSubmit: async (values) => {
      try {
        const formData = new FormData();
        formData.append("questionId", data[0]?.questionId || "");
        formData.append("answerId", data[0]?.answerId || "");
        formData.append("studentId", data[0]?.studentId || "");
        formData.append("remark", values.remark || "");

        const response = await api.put("/updateRemark", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });

        if (response.status === 200) {
          toast.success(response.data.message);
          getData();
        }

        handleModalClose();
      } catch (error) {
        console.error("Failed to submit remark:", error);
      }
    },
  });

  const renderAttachment = (attachment) => {
    if (!attachment) return <span>No attachment available</span>;

    const url = typeof attachment === "string" ? attachment : attachment.url;
    const extension = url.split(".").pop().toLowerCase();
    let fileName = url.split("/").pop().replace(/\+/g, " ");

    const downloadFile = () => {
      const a = document.createElement("a");
      a.href = url;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    };

    const renderCard = (src, label, isVideo = false) => (
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
                <IoMdDownload
                  onClick={downloadFile}
                  style={{ cursor: "pointer" }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    );

    switch (extension) {
      case "jpg":
      case "jpeg":
      case "png":
      case "gif":
        return renderCard(url, "Image");
      case "pdf":
        return renderCard(AttactmentPdf, "PDF");
      case "xls":
      case "xlsx":
      case "csv":
        return renderCard(AttactmentExcel, "Excel");
      case "mp4":
      case "ogg":
        return renderCard(url, "Video", true);
      case "doc":
      case "docx":
        return renderCard(AttactmentWord, "Word");
      case "ppt":
      case "pptx":
        return renderCard(AttactmentPpt, "PPT");
      default:
        return renderCard(AttactmentOther, "Other");
    }
  };

  const getData = async () => {
    try {
      const response = await api.get(
        `/getQ&AByQIdAndSId/${id}?studentId=${studentId}`
      );
      setData(response.data);
    } catch (error) {
      console.error("Error fetching data ", error);
    }
  };

  useEffect(() => {
    if (id && studentId) {
      getData();
    }
  }, [id, studentId]);

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
                className="btn btn-button btn-sm me-3"
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
                    <p className="fw-medium">Assignment Name </p>
                  </div>
                  <div className="col-6 text-start">
                    <p className="text-muted text-sm">
                      {" "}
                      : {data[0]?.assignmentName || "--"}
                    </p>
                  </div>
                </div>
              </div>
              <div className="col-md-6 col-12">
                <div className="row mb-2">
                  <div className="col-6">
                    <p className="fw-medium">Assignment Reason </p>
                  </div>
                  <div className="col-6 text-start">
                    <p className="text-muted text-sm">
                      {" "}
                      : {data[0]?.assignmentReason || "--"}
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
                      : {data[0]?.courseName || "--"}
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
                    <p className="text-muted">: {data[0]?.className || "--"}</p>
                  </div>
                </div>
              </div>
              <div className="col-md-6 col-12 mb-3">
                <div className="row">
                  <div className="col-6">
                    <p className="fw-medium">Teacher</p>
                  </div>
                  <div className="col-6 text-start">
                    <p className="text-muted">: {data[0]?.userName || "--"}</p>
                  </div>
                </div>
              </div>
              <div className="col-md-6 col-12 mb-3">
                <div className="row">
                  <div className="col-6">
                    <p className="fw-medium">Days</p>
                  </div>
                  <div className="col-6 text-start">
                    <p className="text-muted">: {data[0]?.day || "--"}</p>
                  </div>
                </div>
              </div>
              <div className="col-md-6 col-12">
                <div className="row mb-2">
                  <div className="col-6">
                    <p className="fw-medium">Batch Time</p>
                  </div>
                  <div className="col-6 text-start">
                  <p className="text-muted">: {data[0]?.batch || "--"}</p>
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
                      : {data[0]?.folderCategory || "--"}
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
                    <p className="text-muted text-sm">
                      : {data[0]?.date || "--"}
                    </p>
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
                      : {data[0]?.expiredDate || "--"}
                    </p>
                  </div>
                </div>
              </div>
              <div className="col-md-12 col-12 mb-3">
                <div className="row mb-2">
                  <div className="col-12">
                    <p className="fw-medium">Teacher Questions :</p>
                  </div>
                  {data[0]?.questions && data[0]?.questions.length > 0 ? (
                    <div className="col-12">
                      <div className="row">
                        {data[0]?.questions.map((attachment, index) => (
                          <div key={index} className="col-md-4 col-12 mb-2">
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
                    <p className="fw-medium">Student Answers:</p>

                    <p>
                      {data[0]?.studentName}({data[0]?.studentUniqueId})
                    </p>
                  </div>
                  {data[0]?.answers && data[0]?.answers?.length > 0 ? (
                    <div className="col-12">
                      <div className="row">
                        {data[0]?.answers.map((attachment, index) => (
                          <div key={index} className="col-md-4 col-12 mb-2">
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
                  <form onSubmit={formik.handleSubmit}>
                    <textarea
                      className="form-control"
                      rows="5"
                      placeholder="Enter your remark"
                      value={formik.values.remark}
                      onChange={formik.handleChange}
                      name="remark"
                    ></textarea>
                    {formik.touched.remark && formik.errors.remark && (
                      <div className="text-danger">{formik.errors.remark}</div>
                    )}
                  </form>
                </Modal.Body>
                <Modal.Footer>
                  <Button
                    className="btn btn-sm btn-border bg-light text-dark"
                    onClick={handleModalClose}
                  >
                    Close
                  </Button>
                  <Button
                    className="btn btn-button btn-sm"
                    onClick={formik.handleSubmit}
                  >
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
