import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import api from "../../config/URL";
import { MaterialReactTable } from "material-react-table";
import { ThemeProvider, createTheme } from "@mui/material";
import { GoDotFill } from "react-icons/go";
import { IoMdDownload } from "react-icons/io";
import AttactmentPdf from "../../assets/images/Attactmentpdf.jpg";
import AttactmentExcel from "../../assets/images/AttactmentExcel.jpg";
import AttactmentOther from "../../assets/images/Attactmentothers.jpg";
import AttactmentWord from "../../assets/images/AttactmentWord.jpg";
import AttactmentPpt from "../../assets/images/AttachmentPpt.png";

function AssignmentView() {
  const { id } = useParams();
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const storedConfigure = JSON.parse(
    localStorage.getItem("tmsappConfigInfo") || "{}"
  );

  const getData = useCallback(async () => {
    setLoading(true);
    try {
      const response = await api.get(`/getAssignmentQuestionWithAnswer/${id}`);
      setData(response.data);
    } catch (error) {
      console.error("Error fetching data ", error);
    } finally {
      setLoading(false);
    }
  }, [id]);

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
              style={{ width: "100%", maxHeight: "120px", objectFit: "cover" }}
            />
          )}
          <div className="card-body p-1">
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

  const columns = useMemo(
    () => [
      {
        accessorFn: (row, index) => index + 1,
        header: "S.NO",
        enableSorting: true,
        enableHiding: false,
        size: 20,
        cell: ({ cell }) => (
          <span style={{ textAlign: "center" }}>{cell.getValue()}</span>
        ),
      },
      {
        accessorKey: "answers",
        enableHiding: false,
        header: "Status",
        size: 20,
        Cell: ({ row }) => {
          const answers = Array.isArray(row.original.answers)
            ? row.original.answers
            : []; // Ensure it's always an array

          console.log("Row ID:", row.original.id, "Answers:", answers); // Debugging log

          return answers.length > 0 ? (
            <GoDotFill className="text-success fs-6" />
          ) : (
            <GoDotFill className="text-danger fs-6" />
          );
        },
      },
      {
        accessorKey: "studentName",
        header: `${storedConfigure?.student || "Student"} Name`,
        enableHiding: false,
      },
      {
        accessorKey: "studentUniqueId",
        header: `${storedConfigure?.student || "Student"} ID`,
        enableHiding: false,
      },
      {
        accessorKey: "uploadDate",
        header: "Submited Date",
        enableHiding: false,
        Cell: ({ cell }) => cell.getValue()?.substring(0, 10) || "-",
      },
      {
        accessorKey: "createdBy",
        header: "Created By",
        enableHiding: false,
      },
      {
        accessorKey: "createdAt",
        header: "Created At",
        Cell: ({ cell }) => cell.getValue()?.substring(0, 10),
      },
      {
        accessorKey: "updatedAt",
        header: "Updated At",
        Cell: ({ cell }) => cell.getValue()?.substring(0, 10) || "",
      },
      {
        accessorKey: "updatedBy",
        header: "Updated By",
        Cell: ({ cell }) => cell.getValue() || "",
      },
    ],
    []
  );

  const theme = createTheme({
    components: {
      MuiTableCell: {
        styleOverrides: {
          head: {
            color: "#535454 !important",
            backgroundColor: "#e6edf7 !important",
            fontWeight: "400 !important",
            fontSize: "13px !important",
            textAlign: "center !important",
          },
        },
      },
      MuiSwitch: {
        styleOverrides: {
          root: {
            "&.Mui-disabled .MuiSwitch-track": {
              backgroundColor: "#f5e1d0",
              opacity: 1,
            },
            "&.Mui-disabled .MuiSwitch-thumb": {
              color: "#eb862a",
            },
          },
          track: {
            backgroundColor: "#e0e0e0",
          },
          thumb: {
            color: "#eb862a",
          },
          switchBase: {
            "&.Mui-checked": {
              color: "#eb862a",
            },
            "&.Mui-checked + .MuiSwitch-track": {
              backgroundColor: "#eb862a",
            },
          },
        },
      },
    },
  });

  useEffect(() => {
    getData();
  }, [getData]);

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
          {storedConfigure?.assignManagement || "Assignment Management"}
          <span className="breadcrumb-separator"> &gt; </span>
        </li>
        <li>
          <Link to="/assignment" className="custom-breadcrumb">
            {storedConfigure?.assignManagement || "Assignment"}
          </Link>
          <span className="breadcrumb-separator"> &gt; </span>
        </li>
        <li className="breadcrumb-item active" aria-current="page">
          {storedConfigure?.assignManagement || "Assignment"} View
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
              <span class="me-2 text-muted">
                {" "}
                {storedConfigure?.assignManagement || "Assignment"} View
              </span>
            </div>
            <div className="my-2 pe-3 d-flex align-items-center">
              <Link to="/assignment">
                <button type="button " className="btn btn-sm btn-border   ">
                  Back
                </button>
              </Link>
              &nbsp;&nbsp;
            </div>
          </div>
          <div className="container-fluid">
            <div className="row mt-2 pb-3">
              <div className="col-md-6 col-12">
                <div className="row mb-2">
                  <div className="col-6">
                    <p className="fw-medium">
                      {" "}
                      {storedConfigure?.assignManagement || "Assignment"} Name
                    </p>
                  </div>
                  <div className="col-6 text-start">
                    <p className="text-muted text-sm">
                      {" "}
                      : {data.assignmentName || "--"}
                    </p>
                  </div>
                </div>
              </div>
              <div className="col-md-6 col-12">
                <div className="row mb-2">
                  <div className="col-6">
                    <p className="fw-medium">
                      {storedConfigure?.course || "Course"}{" "}
                    </p>
                  </div>
                  <div className="col-6 text-start">
                    <p className="text-muted text-sm">
                      {" "}
                      : {data.courseName || "--"}
                    </p>
                  </div>
                </div>
              </div>
              <div className="col-md-6 col-12 mb-3">
                <div className="row">
                  <div className="col-6">
                    <p className="fw-medium">
                      {storedConfigure?.confClass || "Class"} Listing
                    </p>
                  </div>
                  <div className="col-6 text-start">
                    <p className="text-muted">: {data.className || "--"}</p>
                  </div>
                </div>
              </div>
              <div className="col-md-6 col-12 mb-3">
                <div className="row">
                  <div className="col-6">
                    <p className="fw-medium">
                      {storedConfigure?.employee || "Employee"}
                    </p>
                  </div>
                  <div className="col-6 text-start">
                    <p className="text-muted">: {data.userName || "--"}</p>
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
                      :{" "}
                      {data.batchTimes && data.batchTimes.length > 0
                        ? data.batchTimes.join(", ")
                        : "--"}
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
                    <p className="fw-medium">
                      {" "}
                      {storedConfigure?.assignManagement || "Assignment"} Reason
                    </p>
                  </div>
                  <div className="col-6 text-start">
                    <p className="text-muted text-sm">
                      : {data.assignmentReason || "--"}
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
                    <p className="fw-medium">Expiry Date</p>
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
                    <p className="fw-medium">Teacher Questions :</p>
                  </div>
                  {data?.questions && data?.questions.length > 0 ? (
                    <div className="col-12">
                      <div className="row">
                        {data?.questions?.map((attachment, index) => (
                          <div key={index} className="col-md-3 col-12 mb-2">
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

              <div className="col-md-12 col-12 p-1">
                {loading ? (
                  <div className="loader-container">
                    <div className="loading">
                      <span></span>
                      <span></span>
                      <span></span>
                      <span></span>
                      <span></span>
                    </div>
                  </div>
                ) : (
                  <>
                    <ThemeProvider theme={theme}>
                      <MaterialReactTable
                        columns={columns}
                        data={data?.assignmentAnswerFiles || []} // Ensure it's always an array
                        enableColumnActions={false}
                        enableColumnFilters={false}
                        enableDensityToggle={false}
                        enableFullScreenToggle={false}
                        initialState={{
                          columnVisibility: {
                            createdBy: false,
                            createdAt: false,
                            updatedBy: false,
                            updatedAt: false,
                          },
                        }}
                        muiTableBodyRowProps={({ row }) => ({
                          onClick: () =>
                            navigate(
                              `/assignmentResult/view/${id}?studentId=${row.original.studentId}`
                            ),
                          style: { cursor: "pointer" },
                        })}
                      />
                    </ThemeProvider>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AssignmentView;
