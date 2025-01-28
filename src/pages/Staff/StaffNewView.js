import React, { useEffect, useRef, useState } from "react";
import { IoIosSettings } from "react-icons/io";
import { Link, useParams } from "react-router-dom";
import api from "../../config/URL";
import { toast } from "react-toastify";
import fetchAllCentersWithIds from "../List/CenterList";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import fetchAllSalaryTypeWithIds from "../List/SalaryTypeList";

function StaffNewView() {
  const { id } = useParams();
  const [data, setData] = useState({});
  const [centerData, setCenterData] = useState(null);
  const [packageData, setPackageData] = useState(null);
  const storedScreens = JSON.parse(localStorage.getItem("screens") || "{}");
  const table1Ref = useRef();
  const [shgData, setShgData] = useState([]);
  const [salaryTypeData, setSalaryTypeData] = useState(null);

  const fetchSalaryTypeData = async () => {
    try {
      const salarytype = await fetchAllSalaryTypeWithIds();
      setSalaryTypeData(salarytype);
    } catch (error) {
      toast.error(error.message || "Error fetching salary types");
    }
  };
  const fetchData = async () => {
    try {
      const centerData = await fetchAllCentersWithIds();
      setCenterData(centerData);
      setPackageData(packageData);
    } catch (error) {
      toast.error(error);
    }
  };

  useEffect(() => {
    const getData = async () => {
      try {
        const response = await api.get(`/getAllUserById/${id}`);
        setData(response.data);
        console.log("StudentDetails", response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    getData();
    fetchData();
    fetchSalaryTypeData();
  }, [id]);

  const getData = async () => {
    try {
      const response = await api.get("/getAllSHGSetting");
      setShgData(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  const findSalaryType = (id) => {
    const name = salaryTypeData?.find((datas) => datas.id === id);
    return name?.salaryType;
  };
  const handleGeneratePDF = async () => {
    const pdf = new jsPDF({
      orientation: "p",
      unit: "px",
      format: "a3",
    });

    const addTableToPDF = async (tableRef, pageNumber) => {
      const table = tableRef.current;

      try {
        table.style.visibility = "visible";
        table.style.display = "block";
        const canvas = await html2canvas(table, { scale: 2 });

        const imgData = canvas.toDataURL();

        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

        if (pageNumber > 1) {
          pdf.addPage();
        }
        pdf.addImage(imgData, "PNG", 10, 10, pdfWidth - 20, pdfHeight);
        table.style.visibility = "hidden";
        table.style.display = "none";
      } catch (error) {
        console.error("Error generating PDF:", error);
      }
    };

    await addTableToPDF(table1Ref, 1);

    pdf.save("student-details.pdf");
  };
  return (
    <div>
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
          &nbsp;Staffing
          <span className="breadcrumb-separator"> &gt; </span>
        </li>
        <li>
          <Link to="/staff" className="custom-breadcrumb">
            &nbsp;Staff
          </Link>
          <span className="breadcrumb-separator"> &gt; </span>
        </li>
        <li className="breadcrumb-item active" aria-current="page">
          &nbsp;Staff View
        </li>
      </ol>
      <div className="d-flex align-items-center justify-content-end mb-4">
        {/* <PasswordModal /> */}
        <Link to={"/staff"}>
          <button className="btn btn-border btn-sm me-3">Back</button>
        </Link>
      </div>
      <div className="container-fluid studentView">
        <div className="row mb-3">
          <div className="col-md-3 col-12 mb-3">
            <div className="card" style={{ padding: "10px" }}>
              <div className="d-flex flex-column align-items-center">
                {data.photo ? (
                  <img
                    src={data.photo}
                    className="img-fluid stdImg"
                    alt={data.studentName || "--"}
                  />
                ) : (
                  <div></div>
                )}
                <p className="fw-medium mt-2 mb-1">
                  {data.teacherName || "--"}
                </p>
              </div>
              {storedScreens?.staffUpdate && (
                <Link
                  to={`/staff/edit/${data.id}`}
                  style={{ textDecoration: "none" }}
                >
                  <p className="stdSettings mb-0">
                    <IoIosSettings /> Edit
                  </p>
                </Link>
              )}
              <hr className="mt-2 mb-0" />
              <ul style={{ listStyle: "none", paddingLeft: "0" }}>
                <li className="stdList">
                  <b>Staff Name</b>
                  <span>{data.teacherName || "--"}</span>
                </li>
                <li className="stdList">
                  <b>Date of Birth</b>
                  <span>
                    {data.dateOfBirth
                      ? data.dateOfBirth.substring(0, 10)
                      : "--"}
                  </span>
                </li>
                <li className="stdList">
                  <b>ID Type</b>
                  <span>{data.idType || "--"}</span>
                </li>
                <li className="stdList">
                  <b>ID NO</b>
                  <span>{data.idNo || "--"}</span>
                </li>
                <li className="stdList">
                  <b>Country</b>
                  <span>{data.countryName || "--"}</span>
                </li>
                <li className="stdList">
                  <b>Citizenship</b>
                  <span>{data.citizenship || "--"}</span>
                </li>
                <li className="stdList">
                  <b>Nationality</b>
                  <span>{data.nationality || "--"}</span>
                </li>
                <li className="stdList">
                  <b>Gender</b>
                  <span>{data.gender || "--"}</span>
                </li>
                <li className="stdList">
                  <b>Email</b>
                  <span>{data.email || "--"}</span>
                </li>
                <li className="stdList">
                  <b>Role</b>
                  <span>{data.role || "--"}</span>
                </li>
                <li className="stdList">
                  <b>Short Introduction</b>
                  <span>
                    {" "}
                    {data.shortIntroduction === "undefined"
                      ? "--"
                      : data.shortIntroduction || "--"}
                  </span>
                </li>
              </ul>
            </div>
          </div>
          <div className="col-md-3 col-12 mb-3">
            <div className="card mb-3">
              <div className="withBorder">
                <p className="fw-medium ms-3 my-2">
                  &nbsp;&nbsp;Account Information
                </p>
              </div>
              <div style={{ padding: "10px" }}>
                <ul style={{ listStyle: "none", paddingLeft: "0" }}>
                  <li
                    className="stdList"
                    style={{ borderTop: "1px solid #ddd" }}
                  >
                    <b>Start Date</b>
                    <span>
                      {data.userAccountInfo &&
                      data.userAccountInfo.length > 0 &&
                      data.userAccountInfo[0].startDate
                        ? data.userAccountInfo[0].startDate.substring(0, 10)
                        : "--"}
                    </span>
                  </li>
                  <li className="stdList">
                    <b>Color Code</b>
                    <span>
                      {" "}
                      {data.userAccountInfo &&
                      data.userAccountInfo.length > 0 &&
                      data.userAccountInfo[0].colorCode
                        ? data.userAccountInfo[0].colorCode
                        : "--"}
                    </span>
                  </li>
                  <li className="stdList">
                    <b>Teacher Type</b>
                    <span>
                      {" "}
                      {data.userAccountInfo &&
                      data.userAccountInfo.length > 0 &&
                      data.userAccountInfo[0].teacherType
                        ? data.userAccountInfo[0].teacherType
                        : "--"}
                    </span>
                  </li>
                  <li className="stdList">
                    <b>SHG(S) Type</b>
                    <span>
                      {data.userAccountInfo &&
                      data.userAccountInfo.length > 0 &&
                      data.userAccountInfo[0].shgTypeId
                        ? (
                            shgData.find(
                              (item) =>
                                item.id === data.userAccountInfo[0].shgTypeId
                            ) || {}
                          ).shgType || "--"
                        : "--"}
                    </span>
                  </li>
                  <li className="stdList">
                    <b>SHGs Amount</b>
                    <span>
                      {" "}
                      {data.userAccountInfo &&
                      data.userAccountInfo.length > 0 &&
                      data.userAccountInfo[0].shgAmount
                        ? data.userAccountInfo[0].shgAmount
                        : "--"}
                    </span>
                  </li>
                  <li className="stdList">
                    <b>Status</b>
                    {/* <span>
                      {" "}
                      {data.userAccountInfo &&
                      data.userAccountInfo.length > 0 &&
                      data.userAccountInfo[0].status
                        ? data.userAccountInfo[0].status
                        : "--"}
                    </span> */}
                    <span>
                      {{
                        ACTIVE: "Active",
                        RESIGNED: "Resigned",
                      }[data.status] ||
                        data.status ||
                        ""}
                    </span>
                  </li>
                  <li className="stdList">
                    <b>End Date</b>
                    <span>
                      {data.userAccountInfo &&
                      data.userAccountInfo.length > 0 &&
                      data.userAccountInfo[0].endDate
                        ? data.userAccountInfo[0].endDate.substring(0, 10)
                        : "--"}
                    </span>
                  </li>
                  <li className="stdList">
                    <b>Approval</b>
                    <span>
                      {data.userAccountInfo &&
                      data.userAccountInfo.length > 0 &&
                      typeof data.userAccountInfo[0].approvelContentRequired ===
                        "boolean"
                        ? data.userAccountInfo[0].approvelContentRequired
                          ? "Yes"
                          : "No"
                        : "--"}
                    </span>
                  </li>
                  <li className="stdList">
                    <b>Working Days</b>
                    <span>
                      {data.userAccountInfo &&
                      data.userAccountInfo.length > 0 &&
                      data.userAccountInfo[0].workingDays
                        ? [...data.userAccountInfo[0].workingDays]
                            .sort(
                              (a, b) =>
                                [
                                  "MONDAY",
                                  "TUESDAY",
                                  "WEDNESDAY",
                                  "THURSDAY",
                                  "FRIDAY",
                                  "SATURDAY",
                                  "SUNDAY",
                                ].indexOf(a) -
                                [
                                  "MONDAY",
                                  "TUESDAY",
                                  "WEDNESDAY",
                                  "THURSDAY",
                                  "FRIDAY",
                                  "SATURDAY",
                                  "SUNDAY",
                                ].indexOf(b)
                            )
                            .join(", ")
                        : "--"}
                    </span>
                  </li>

                  <li className="stdList">
                    <b>Centre Name</b>
                    <span>
                      {data.userAccountInfo &&
                      data.userAccountInfo.length > 0 &&
                      data.userAccountInfo[0].centers
                        ? data.userAccountInfo[0].centers
                            .map((item) => item.centerName)
                            .join(", ")
                        : "--"}
                    </span>
                  </li>
                </ul>
              </div>
            </div>
            <div className="card">
              <div className="withBorder">
                <p className="fw-medium ms-3 my-2">Contact Information</p>
              </div>
              <div style={{ padding: "10px" }}>
                <ul style={{ listStyle: "none", paddingLeft: "0" }}>
                  <li className="stdList">
                    <b>Contact Number</b>
                    <span>
                      {" "}
                      {data.userContactInfo &&
                      data.userContactInfo.length > 0 &&
                      data.userContactInfo[0].contactNumber
                        ? data.userContactInfo[0].contactNumber
                        : "--"}
                    </span>
                  </li>
                  <li className="stdList">
                    <b>Address</b>
                    <span>
                      {" "}
                      {data.userContactInfo &&
                      data.userContactInfo.length > 0 &&
                      data.userContactInfo[0].address
                        ? data.userContactInfo[0].address
                        : "--"}
                    </span>
                  </li>
                  <li className="stdList">
                    <b>Postal Code</b>
                    <span>
                      {" "}
                      {data.userContactInfo &&
                      data.userContactInfo.length > 0 &&
                      data.userContactInfo[0].postalCode
                        ? data.userContactInfo[0].postalCode
                        : "--"}
                    </span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <div className="col-md-3 col-12 mb-3">
            <div className="card" style={{ padding: "10px" }}>
              <ul style={{ listStyle: "none", paddingLeft: "0" }}>
                <li
                  className="stdList"
                  style={{
                    borderTop: "1px solid #ddd",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <b>Resume/CV</b>
                  <br />
                  {data.userRequireInformationModels &&
                  data.userRequireInformationModels.length > 0 &&
                  data.userRequireInformationModels[0].resume ? (
                    <>
                      <span
                        style={{
                          flexGrow: 1,
                          marginLeft: "10px",
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                        }}
                        title={data.userRequireInformationModels[0].resume
                          .split("/")
                          .pop()}
                      >
                        {data.userRequireInformationModels[0].resume
                          .split("/")
                          .pop()}
                      </span>
                      <a
                        href={data.userRequireInformationModels[0].resume}
                        download
                        style={{
                          textDecoration: "none",
                          display: "flex",
                          alignItems: "center",
                          marginLeft: "auto",
                        }}
                      >
                        <i
                          className="fas fa-download"
                          style={{ cursor: "pointer", color: "#007bff" }}
                        ></i>
                      </a>
                    </>
                  ) : (
                    <span style={{ marginRight: "auto", marginLeft: "10px" }}>
                      No file available
                    </span>
                  )}
                </li>
                <li
                  className="stdList"
                  style={{
                    borderTop: "1px solid #ddd",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <b>Educational Certificates</b>
                  {data.userRequireInformationModels &&
                  data.userRequireInformationModels.length > 0 &&
                  data.userRequireInformationModels[0].educationCertificate ? (
                    <>
                      <span
                        style={{
                          flexGrow: 1,
                          marginLeft: "10px",
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                        }}
                        title={data.userRequireInformationModels[0].educationCertificate
                          .split("/")
                          .pop()}
                      >
                        {data.userRequireInformationModels[0].educationCertificate
                          .split("/")
                          .pop()}
                      </span>
                      <a
                        href={
                          data.userRequireInformationModels[0]
                            .educationCertificate
                        }
                        download
                        style={{
                          textDecoration: "none",
                          display: "flex",
                          alignItems: "center",
                          marginLeft: "auto",
                        }}
                      >
                        <i
                          className="fas fa-download"
                          style={{ cursor: "pointer", color: "#007bff" }}
                        ></i>
                      </a>
                    </>
                  ) : (
                    <span style={{ marginRight: "auto", marginLeft: "10px" }}>
                      No file available
                    </span>
                  )}
                </li>
              </ul>
            </div>
            <div className="card mb-3 mt-3">
              <div className="withBorder">
                <p className="fw-medium ms-3 my-2">
                  &nbsp;&nbsp;Salary Information
                </p>
              </div>
              <div style={{ padding: "10px" }}>
                <ul style={{ listStyle: "none", paddingLeft: "0" }}>
                  <li
                    className="stdList"
                    style={{ borderTop: "1px solid #ddd" }}
                  >
                    <p className="m-0">
                      <b>Salary</b>
                      <span>
                        {data.userSalaryCreationModels &&
                        data.userSalaryCreationModels.length > 0 &&
                        data.userSalaryCreationModels[0].salary
                          ? data.userSalaryCreationModels[0].salary
                          : "--"}
                      </span>
                    </p>
                    <p className="m-0">
                      <b>Effective Date</b>
                      <span>
                        {data.userSalaryCreationModels &&
                        data.userSalaryCreationModels.length > 0 &&
                        data.userSalaryCreationModels[0].effectiveDate
                          ? data.userSalaryCreationModels[0].effectiveDate.substring(
                              0,
                              10
                            )
                          : "--"}
                      </span>
                    </p>
                    <p className="m-0">
                      <b>Salary Type</b>
                      <span>
                        {data?.userSalaryCreationModels &&
                        data?.userSalaryCreationModels?.length > 0 &&
                        data?.userSalaryCreationModels[0]?.salaryTypeId
                          ? findSalaryType(
                              data?.userSalaryCreationModels[0]?.salaryTypeId
                            )
                          : "--"}
                      </span>
                    </p>
                  </li>
                </ul>
              </div>
            </div>
            <div className="card">
              <div className="withBorder">
                <p className="fw-medium ms-3 my-2">
                  &nbsp;&nbsp; Leave Information
                </p>
              </div>
              <div style={{ padding: "10px" }}>
                <hr className="mt-0 mb-2" />
                <ul style={{ listStyle: "none", paddingLeft: "0" }}>
                  <li className="stdList pt-0">
                    <p className="m-0">
                      <b>Year</b>
                      <span>
                        {" "}
                        {data.userLeaveCreationModels &&
                        data.userLeaveCreationModels.length > 0 &&
                        data.userLeaveCreationModels[0].year
                          ? data.userLeaveCreationModels[0].year.substring(
                              0,
                              10
                            )
                          : "--"}
                      </span>
                    </p>
                    <p className="m-0">
                      <b>Annual Leave</b>
                      <span>
                        {" "}
                        {data.userLeaveCreationModels &&
                        data.userLeaveCreationModels.length > 0 &&
                        data.userLeaveCreationModels[0].annualLeave
                          ? data.userLeaveCreationModels[0].annualLeave
                          : "--"}
                      </span>
                    </p>
                    <p className="m-0">
                      <b>Medical Leave</b>
                      <span>
                        {data.userLeaveCreationModels &&
                        data.userLeaveCreationModels.length > 0 &&
                        data.userLeaveCreationModels[0].medicalLeave
                          ? data.userLeaveCreationModels[0].medicalLeave
                          : "--"}
                      </span>
                    </p>
                    <p className="m-0">
                      <b>Carry Forward Leave</b>
                      <span>
                        {data.userLeaveCreationModels &&
                        data.userLeaveCreationModels.length > 0 &&
                        data.userLeaveCreationModels[0].carryForwardLeave
                          ? data.userLeaveCreationModels[0].carryForwardLeave
                          : "--"}
                      </span>
                    </p>
                    <p className="m-0">
                      <b>Other Leave</b>
                      <span>
                        {data.userLeaveCreationModels &&
                        data.userLeaveCreationModels.length > 0 &&
                        data.userLeaveCreationModels[0].otherLeave
                          ? data.userLeaveCreationModels[0].otherLeave
                          : "--"}
                      </span>
                    </p>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <div className="col-md-3 col-12 mb-3">
            <div className="card" style={{ padding: "10px" }}>
              <hr className="mt-2 mb-0" />
              <p className="fw-medium ms-3 my-2">
                &nbsp;&nbsp;Contract Information
              </p>
              <ul style={{ listStyle: "none", paddingLeft: "0" }}>
                <li className="stdList">
                  <b>Details of Employer</b>
                  <span>
                    {" "}
                    {centerData &&
                      centerData.map((centerId) => {
                        if (
                          data &&
                          data.userContractCreationModels &&
                          data.userContractCreationModels.length > 0 &&
                          parseInt(
                            data.userContractCreationModels[0].employer
                          ) === centerId.id
                        ) {
                          return centerId.centerNames || "--";
                        }
                        return null;
                      })}
                  </span>
                </li>
                <li className="stdList">
                  <b>UEN</b>
                  <span>
                    {data.userContractCreationModels &&
                    data.userContractCreationModels.length > 0 &&
                    data.userContractCreationModels[0].uen
                      ? data.userContractCreationModels[0].uen
                      : "--"}
                  </span>
                </li>
                <li className="stdList">
                  <b>Address of Employment</b>
                  <span>
                    {" "}
                    {data.userContractCreationModels &&
                    data.userContractCreationModels.length > 0 &&
                    data.userContractCreationModels[0].addressOfEmployment
                      ? data.userContractCreationModels[0].addressOfEmployment
                      : "--"}
                  </span>
                </li>
                <b>Details of Employee</b>
                <li className="stdList">
                  <b>Employee</b>
                  <span>
                    {" "}
                    {data.userContractCreationModels &&
                    data.userContractCreationModels.length > 0 &&
                    data.userContractCreationModels[0].employee
                      ? data.userContractCreationModels[0].employee
                      : "--"}
                  </span>
                </li>
                <li className="stdList">
                  <b>NRIC</b>
                  <span>
                    {" "}
                    {data.userContractCreationModels &&
                    data.userContractCreationModels.length > 0 &&
                    data.userContractCreationModels[0].nric
                      ? data.userContractCreationModels[0].nric
                      : "--"}
                  </span>
                </li>
                <li className="stdList">
                  <b>Address</b>
                  <span>
                    {data.userContractCreationModels &&
                    data.userContractCreationModels.length > 0 &&
                    data.userContractCreationModels[0].userContractAddress
                      ? data.userContractCreationModels[0].userContractAddress
                      : "--"}
                  </span>
                </li>
                <li className="stdList">
                  <b>Job Title</b>
                  <span>
                    {data.userContractCreationModels &&
                    data.userContractCreationModels.length > 0 &&
                    data.userContractCreationModels[0].jobTitle
                      ? data.userContractCreationModels[0].jobTitle
                      : "--"}
                  </span>
                </li>
                <li className="stdList">
                  <b>Main Duties</b>
                  <span>
                    {" "}
                    {data.userContractCreationModels &&
                    data.userContractCreationModels.length > 0 &&
                    data.userContractCreationModels[0].mainDuties
                      ? data.userContractCreationModels[0].mainDuties
                      : "--"}
                  </span>
                </li>
                <li className="stdList">
                  <b>Start Date Employment</b>
                  <span>
                    {" "}
                    {data.userContractCreationModels &&
                    data.userContractCreationModels.length > 0 &&
                    data.userContractCreationModels[0].startDateOfEmployment
                      ? data.userContractCreationModels[0].startDateOfEmployment.substring(
                          0,
                          10
                        )
                      : "--"}
                  </span>
                </li>
                <li className="stdList">
                  <b>Training</b>
                  <span>
                    {data.userContractCreationModels &&
                    data.userContractCreationModels.length > 0 &&
                    data.userContractCreationModels[0].training
                      ? data.userContractCreationModels[0].training
                      : "--"}
                  </span>
                </li>
                <li className="stdList">
                  <b>Allowance</b>
                  <span>
                    {data.userContractCreationModels &&
                    data.userContractCreationModels.length > 0 &&
                    data.userContractCreationModels[0].allowance
                      ? data.userContractCreationModels[0].allowance
                      : "--"}
                  </span>
                </li>
                <li className="stdList">
                  <b>Start Date</b>
                  <span>
                    {data.userContractCreationModels &&
                    data.userContractCreationModels.length > 0 &&
                    data.userContractCreationModels[0].startDateOfEmployment
                      ? data.userContractCreationModels[0].startDateOfEmployment.substring(
                          0,
                          10
                        )
                      : "--"}
                  </span>
                </li>
                <li className="stdList">
                  <b>Contract Period</b>
                  <span>
                    {data.userContractCreationModels &&
                    data.userContractCreationModels.length > 0 &&
                    data.userContractCreationModels[0].contactPeriod
                      ? data.userContractCreationModels[0].contactPeriod
                      : "--"}
                  </span>
                </li>
                <li className="stdList">
                  <b>Probation (Day)</b>
                  <span>
                    {data.userContractCreationModels &&
                    data.userContractCreationModels.length > 0 &&
                    data.userContractCreationModels[0].probation
                      ? data.userContractCreationModels[0].probation
                      : "--"}
                  </span>
                </li>
                <li className="stdList">
                  <b>Working Days</b>
                  <span>
                    {data.userContractCreationModels &&
                    data.userContractCreationModels.length > 0 &&
                    data.userContractCreationModels[0].workingDays
                      ? [...data.userContractCreationModels[0].workingDays]
                          .sort(
                            (a, b) =>
                              [
                                "MONDAY",
                                "TUESDAY",
                                "WEDNESDAY",
                                "THURSDAY",
                                "FRIDAY",
                                "SATURDAY",
                                "SUNDAY",
                              ].indexOf(a) -
                              [
                                "MONDAY",
                                "TUESDAY",
                                "WEDNESDAY",
                                "THURSDAY",
                                "FRIDAY",
                                "SATURDAY",
                                "SUNDAY",
                              ].indexOf(b)
                          )
                          .join(", ")
                      : "--"}
                  </span>
                </li>

                <li className="stdList">
                  <b>Salary</b>
                  <span>
                    {data.userContractCreationModels &&
                    data.userContractCreationModels.length > 0 &&
                    data.userContractCreationModels[0].userContractSalary
                      ? data.userContractCreationModels[0].userContractSalary
                      : "--"}
                  </span>
                </li>
                <li className="stdList">
                  <b>End Date</b>
                  <span>
                    {data.userContractCreationModels &&
                    data.userContractCreationModels.length > 0 &&
                    data.userContractCreationModels[0].userContractEndDate
                      ? data.userContractCreationModels[0].userContractEndDate.substring(
                          0,
                          10
                        )
                      : "--"}
                  </span>
                </li>
                <b>Bank Account Details</b>
                <li className="stdList">
                  <b>Paynow</b>
                  <span>
                    {data.userContractCreationModels &&
                    data.userContractCreationModels.length > 0 &&
                    data.userContractCreationModels[0].payNow
                      ? data.userContractCreationModels[0].payNow
                      : "--"}
                  </span>
                </li>
                <li className="stdList">
                  <b>Internet Banking</b>
                  <span>
                    {data.userContractCreationModels &&
                    data.userContractCreationModels.length > 0 &&
                    data.userContractCreationModels[0].internetBanking
                      ? data.userContractCreationModels[0].internetBanking
                      : "--"}
                  </span>
                </li>
                <li className="stdList">
                  <b>Contract Date</b>
                  <span>
                    {data.userContractCreationModels &&
                    data.userContractCreationModels.length > 0 &&
                    data.userContractCreationModels[0].contractDate
                      ? data.userContractCreationModels[0].contractDate.substring(
                          0,
                          10
                        )
                      : "--"}
                  </span>
                </li>
                <li className="stdList">
                  <b>Termination Notice (Month)</b>
                  <span>
                    {data.userContractCreationModels &&
                    data.userContractCreationModels.length > 0 &&
                    data.userContractCreationModels[0].terminationNotice
                      ? data.userContractCreationModels[0].terminationNotice
                      : "--"}
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default StaffNewView;
