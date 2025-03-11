import React, { useEffect, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import api from "../../../config/URL";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import Logo from "../../../assets/images/TMS_LOGO.png";
import { FaDownload } from "react-icons/fa6";

function PayrollPayslip() {
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);
  const [centerData, setCenterData] = useState([]);
  const userId = localStorage.getItem("tmsuserId");
  const centerId = localStorage.getItem("tmscenterId");
  const table1Ref = useRef();
  console.log("Center DATA:::", centerData);

  const getCenterData = async () => {
    try {
      const response = await api.get(`getAllCenterById/${centerId}`);
      setCenterData(response.data);
      setLoading(false);
    } catch (error) {
      setData({});
      console.log("Error Fetching Data ", error);
    } finally {
      setLoading(false);
    }
  };

  const getPayrollData = async () => {
    try {
      const response = await api.get(`getPayslipByPayrollId/${id}`);
      setData(response.data);
      setLoading(false);
    } catch (error) {
      setData({});
      console.log("Error Fetching Data ", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getPayrollData();
    getCenterData();
  }, [id]);

  const handleGeneratePDF = async () => {
    const pdf = new jsPDF({ orientation: "p", unit: "px", format: "a4" });
    try {
      const canvas = await html2canvas(table1Ref.current, { scale: 2 });
      const imgData = canvas.toDataURL();
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      pdf.addImage(imgData, "PNG", 10, 10, pdfWidth - 20, pdfHeight);
      pdf.save(`Payslip_${data.employeeName}_${data.payrollMonth}.pdf`);
    } catch (error) {
      console.error("Error generating PDF:", error);
    }
  };

  return (
    <div className="container-fluid">
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
          Staffing
          <span className="breadcrumb-separator"> &gt; </span>
        </li>
        <li>
          <Link to="/payrolladmin" className="custom-breadcrumb">
            Payroll
          </Link>
          <span className="breadcrumb-separator"> &gt; </span>
        </li>
        <li className="breadcrumb-item active" aria-current="page">
          Payslip View
        </li>
      </ol>

      <div className="card">
        <div
          className="d-flex px-4 justify-content-between align-items-center p-1"
          style={{ background: "#f5f7f9" }}
        >
          <div class="d-flex align-items-center">
            <div class="d-flex">
              <div class="dot active"></div>
            </div>
            <span class="me-2 text-muted">View Payslip</span>
          </div>
          <div className="my-2 pe-3 d-flex align-items-center">
            {data?.employeeName && (
              <button
                className="btn btn-success mx-2 btn-sm"
                onClick={handleGeneratePDF}
              >
                <FaDownload />
              </button>
            )}

            <Link to="/payrolladmin">
              <button type="button " className="btn btn-sm btn-border   ">
                Back
              </button>
            </Link>
          </div>
        </div>
        <div className="container-fluid my-1">
          <>
            {loading ? (
              <div className="loader-container">
                <div className="loading">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>
            ) : data?.employeeName ? (
              <div ref={table1Ref} className="container-fluid p-3 rounded mb-5">
                <div className="payslip-container text-center">
                  <img
                    className="img-fluid"
                    alt="Logo"
                    width={100}
                    height={100}
                    src={centerData?.logo || Logo}
                  />
                  <h2 className="ms-4 mt-1">
                    {centerData?.centerName || "SMS Guru"}
                  </h2>
                </div>

                <div className="d-flex justify-content-between mt-4">
                  <div className="col-5">
                    <p>
                      <strong>Employee Name:</strong> {data.employeeName}
                    </p>
                    <p>
                      <strong>Birth Date:</strong> {data.dateOfBirth || "--"}
                    </p>
                    <p>
                      <strong>Designation:</strong> {data.designation || "--"}
                    </p>
                  </div>
                  <div className="col-5">
                    <p>
                      <strong>NRIC/FIN No:</strong> {data.nric || "--"}
                    </p>
                    <p>
                      <strong>Pay Period:</strong> {data.payslipMonth || "--"}
                    </p>
                  </div>
                </div>

                <div className="content-section mt-4">
                  <div className="row">
                    <div className="col-md-6">
                      <p>
                        <strong>Basic Pay:</strong> {data.basicSalary || "--"}
                      </p>
                      <p>
                        <strong>Bonus:</strong> {data.bonus || "--"}
                      </p>
                    </div>
                    <div className="col-md-6 border-start">
                      {data?.deductions?.length > 0 ? (
                        data.deductions.map((deduct, index) => (
                          <p key={index}>
                            <strong>Deduction ({deduct.detectionName}):</strong>{" "}
                            {deduct.amount}
                          </p>
                        ))
                      ) : (
                        <p>
                          <strong>Deductions:</strong> --
                        </p>
                      )}
                      <p>
                        <strong>CPF:</strong> {data.cpfContribution}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="row mt-3">
                  <div className="col-md-6">
                    <p>
                      <strong>Gross Wages:</strong> {data.grossPay || "--"}
                    </p>
                    <p>
                      <strong>Salary Credited By:</strong>{" "}
                      {data.salaryCreditedTo || "--"}
                    </p>
                  </div>
                  <div className="col-md-6 text-start">
                    <p>
                      <strong>Total CPF:</strong> {data.totalCpf || "0"}
                    </p>
                    <p>
                      <strong>SGH:</strong> {data.shgContribution || "0"}
                    </p>
                    <p>
                      <strong>SDL:</strong> {data.sdlContribution || "0"}
                    </p>
                    <p>
                      <strong>Net Pay:</strong> {data.netPay || "0"}
                    </p>
                    <p>
                      <strong>Net Pay (in Words):</strong>{" "}
                      {data.netPayInWords || "--"}
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center mt-4">
                <p>No Payslip Data Found.</p>
              </div>
            )}
          </>
        </div>
      </div>
    </div>
  );
}

export default PayrollPayslip;
