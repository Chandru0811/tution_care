import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import api from "../../config/URL";
import AttactmentPdf from "../../assets/images/Attactmentpdf.jpg";
import AttactmentExcel from "../../assets/images/AttactmentExcel.jpg";
import AttactmentOther from "../../assets/images/Attactmentothers.jpg";
import AttactmentWord from "../../assets/images/AttactmentWord.jpg";
import AttactmentPpt from "../../assets/images/AttachmentPpt.png";
import { IoMdDownload } from "react-icons/io";

function PaymentsView() {
  const { id } = useParams();
  const [data, setData] = useState({});

  const getData = async () => {
    try {
      const response = await api.get(`/getPaymentById/${id}`);
      setData(response.data);
    } catch (error) {
      console.error("Error fetching data ", error);
    }
  };

  useEffect(() => {
    getData();
  }, [id]);

  const renderAttachment = (attachment) => {
    if (!attachment) return <span>No attachment available</span>;

    // Convert to array if it's a single string
    const fileArray = Array.isArray(attachment) ? attachment : [attachment];

    return fileArray.map((fileUrl, index) => {
      const extension = fileUrl.split(".").pop().toLowerCase();
      let fileName = fileUrl.split("/").pop().replace(/\+/g, " ");

      const downloadFile = () => {
        const a = document.createElement("a");
        a.href = fileUrl;
        a.download = fileName;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      };

      const renderCard = (src, label, isVideo = false) => (
        <div
          key={index}
          className="position-relative d-flex align-items-center mb-3"
        >
          <div className="card" style={{ width: "18rem", marginTop: "20px" }}>
            {isVideo ? (
              <video
                width="100%"
                height="auto"
                controls
                style={{ maxHeight: "150px" }}
              >
                <source src={fileUrl} type="video/mp4" />
                <source src={fileUrl} type="video/ogg" />
                Your browser does not support the video tag.
              </video>
            ) : (
              <img
                src={src}
                alt={label}
                style={{
                  width: "100%",
                  maxHeight: "150px",
                  objectFit: "cover",
                }}
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
          return renderCard(fileUrl, "Image");
        case "pdf":
          return renderCard(AttactmentPdf, "PDF");
        case "xls":
        case "xlsx":
        case "csv":
          return renderCard(AttactmentExcel, "Excel");
        case "mp4":
        case "ogg":
          return renderCard(fileUrl, "Video", true);
        case "doc":
        case "docx":
          return renderCard(AttactmentWord, "Word");
        case "ppt":
        case "pptx":
          return renderCard(AttactmentPpt, "PPT");
        default:
          return renderCard(AttactmentOther, "Other");
      }
    });
  };

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
          Invoice and Payment
          <span className="breadcrumb-separator"> &gt; </span>
        </li>
        <li>
          <Link to="/payments" className="custom-breadcrumb">
            Payment
          </Link>
          <span className="breadcrumb-separator"> &gt; </span>
        </li>
        <li className="breadcrumb-item active" aria-current="page">
          Payment View
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
              <span class="me-2 text-muted">Payment View</span>
            </div>
            <div className="my-2 pe-3 d-flex align-items-center">
              <Link to="/payments">
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
                    <p className="fw-medium">Student</p>
                  </div>
                  <div className="col-6 text-start">
                    <p className="text-muted text-sm">
                      {" "}
                      : {data.studentId || "--"}
                    </p>
                  </div>
                </div>
              </div>
              <div className="col-md-6 col-12">
                <div className="row mb-2">
                  <div className="col-6">
                    <p className="fw-medium">Invoice No</p>
                  </div>
                  <div className="col-6 text-start">
                    <p className="text-muted text-sm">
                      {" "}
                      : {data.invoiceNo || "--"}
                    </p>
                  </div>
                </div>
              </div>
              {/* <div className="col-md-6 col-12">
                <div className="row mb-2">
                  <div className="col-6">
                    <p className="fw-medium">Receipt No </p>
                  </div>
                  <div className="col-6 text-start">
                    <p className="text-muted text-sm">
                      {" "}
                      : {data.receiptNo || "--"}
                    </p>
                  </div>
                </div>
              </div> */}

              <div className="col-md-6 col-12 mb-3">
                <div className="row">
                  <div className="col-6">
                    <p className="fw-medium">Payment Date</p>
                  </div>
                  <div className="col-6 text-start">
                    <p className="text-muted">: {data.paymentDate || "--"}</p>
                  </div>
                </div>
              </div>

              <div className="col-md-6 col-12 mb-3">
                <div className="row">
                  <div className="col-6">
                    <p className="fw-medium">Payment Method</p>
                  </div>
                  <div className="col-6 text-start">
                    <p className="text-muted">: {data.paymentMethod || "--"}</p>
                  </div>
                </div>
              </div>

              <div className="col-md-6 col-12 mb-3">
                <div className="row">
                  <div className="col-6">
                    <p className="fw-medium">Payment Reference</p>
                  </div>
                  <div className="col-6 text-start">
                    <p className="text-muted">
                      : {data.paymentReference || "--"}
                    </p>
                  </div>
                </div>
              </div>

              <div className="col-md-6 col-12">
                <div className="row mb-2">
                  <div className="col-6">
                    <p className="fw-medium">Paid Amount</p>
                  </div>
                  <div className="col-6 text-start">
                    <p className="text-muted text-sm">
                      : {data.paidAmount || "--"}
                    </p>
                  </div>
                </div>
              </div>
              {data.paymentMethod === "Cheque" ||
                (data.paymentMethod === "Internet Banking" && (
                  <>
                    <div className="col-md-6 col-12">
                      <div className="row mb-2">
                        <div className="col-6">
                          <p className="fw-medium">Bank</p>
                        </div>
                        <div className="col-6 text-start">
                          <p className="text-muted text-sm">
                            : {data.bank || "--"}
                          </p>
                        </div>
                      </div>
                    </div>
                  </>
                ))}
              {data.paymentMethod === "Cheque" && (
                <div className="col-md-6 col-12">
                  <div className="row mb-2">
                    <div className="col-6">
                      <p className="fw-medium">Account No</p>
                    </div>
                    <div className="col-6 text-start">
                      <p className="text-muted text-sm">
                        : {data.accountNo || "--"}
                      </p>
                    </div>
                  </div>
                </div>
              )}
              {data.paymentMethod === "Internet Banking" && (
                <>
                  <div className="col-md-6 col-12">
                    <div className="row mb-2">
                      <div className="col-6">
                        <p className="fw-medium">Transaction No</p>
                      </div>
                      <div className="col-6 text-start">
                        <p className="text-muted text-sm">
                          : {data.transactionNo || "--"}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="col-md-6 col-12">
                    <div className="row mb-2">
                      <div className="col-6">
                        <p className="fw-medium">Mobile Number</p>
                      </div>
                      <div className="col-6 text-start">
                        <p className="text-muted text-sm">
                          : {data.mobileNumber || "--"}
                        </p>
                      </div>
                    </div>
                  </div>
                </>
              )}
              <div className="col-md-6 col-12">
                <div className="row mb-2">
                  <div className="col-6">
                    <p className="fw-medium">Remark</p>
                  </div>
                  <div className="col-6 text-start">
                    <p className="text-muted text-sm">
                      : {data.remark || "--"}
                    </p>
                  </div>
                </div>
              </div>
              {data.paymentMethod === "Cheque" ||
                (data.paymentMethod === "Internet Banking" && (
                  <>
                    <div className="col-md-12 col-12 mb-3">
                      <div className="row mb-2">
                        <div className="col-12">
                          <p className="fw-medium">File :</p>
                        </div>
                        {data.file ? (
                          <div className="col-12">
                            <div className="row">
                              {renderAttachment(data.file)}
                            </div>
                          </div>
                        ) : (
                          <p className="text-muted">No attachments available</p>
                        )}
                      </div>
                    </div>
                  </>
                ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PaymentsView;
