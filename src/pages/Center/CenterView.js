import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import api from "../../config/URL";
import { toast } from "react-toastify";

function CenterView() {
  const { id } = useParams();
  const [data, setData] = useState([]);
  const [taxTypeData, setTaxTypeData] = useState(null);
  const centerId = localStorage.getItem("tmscenterId");
  const appConfigInfo = JSON.parse(localStorage.getItem("tmsappConfigInfo"));

  const fetchTaxData = async () => {
    try {
      const response = await api.get(`/getAllTaxSettingByCenter/${centerId}`);
      setTaxTypeData(response.data);
    } catch (error) {
      toast.error("Error fetching tax data:", error);
    }
  };

  useEffect(() => {
    const getData = async () => {
      try {
        const response = await api.get(`/getAllCenterById/${id}`);
        setData(response.data);
      } catch (error) {
        toast.error("Error Fetching Data", error);
      }
    };
    getData();
    fetchTaxData();
  }, [id]);
  const formatValue = (value) => {
    return value === null || value === "null" ? "" : value;
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
          &nbsp;{appConfigInfo.centreName}
          <span className="breadcrumb-separator"> &gt; </span>
        </li>
        <li>
          <Link to="/companyRegister" className="custom-breadcrumb">
            &nbsp;{appConfigInfo.centreName} Listing
          </Link>
          <span className="breadcrumb-separator"> &gt; </span>
        </li>
        <li className="breadcrumb-item active" aria-current="page">
          &nbsp;{appConfigInfo.centreName} Listing view
        </li>
      </ol>
      <div className="card">
        <div
          className="d-flex px-4 justify-content-between align-items-center p-1 mb-4"
          style={{ background: "#f5f7f9" }}
        >
          <div class="d-flex align-items-center">
            <div class="d-flex">
              <div class="dot active"></div>
            </div>
            <span class="me-2 text-muted">View {appConfigInfo.centreName}</span>
          </div>
          <div className="my-2 pe-3 d-flex align-items-center">
            <Link to="/companyRegister">
              <button type="button " className="btn btn-sm btn-border   ">
                Back
              </button>
            </Link>
          </div>
        </div>
        <div className="container-fluid px-4">
          <div className="row pb-3">
            <div className="col-md-6 col-12">
              <div className="row mt-3  mb-2">
                <div className="col-6 ">
                  <p className="">{appConfigInfo.centreName} Name</p>
                </div>
                <div className="col-6">
                  <p className="text-muted text-sm">
                    : {data.centerName || "--"}
                  </p>
                </div>
              </div>
            </div>
            <div className="col-md-6 col-12">
              <div className="row  mb-2 mt-3">
                <div className="col-6  ">
                  <p className="">Code</p>
                </div>
                <div className="col-6">
                  <p className="text-muted text-sm">: {data.code || "--"}</p>
                </div>
              </div>
            </div>
            <div className="col-md-6 col-12">
              <div className="row  mb-2">
                <div className="col-6  ">
                  <p className="">Address</p>
                </div>
                <div className="col-6">
                  <p className="text-muted text-sm">: {data.address || "--"}</p>
                </div>
              </div>
            </div>
            <div className="col-md-6 col-12">
              <div className="row  mb-2">
                <div className="col-6  ">
                  <p className="">Zip Code</p>
                </div>
                <div className="col-6">
                  <p className="text-muted text-sm">: {data.zipCode || "--"}</p>
                </div>
              </div>
            </div>
            <div className="col-md-6 col-12">
              <div className="row  mb-2">
                <div className="col-6  ">
                  <p className="">Mobile</p>
                </div>
                <div className="col-6">
                  <p className="text-muted text-sm">: {data.mobile || "--"}</p>
                </div>
              </div>
            </div>
            <div className="col-md-6 col-12">
              <div className="row  mb-2">
                <div className="col-6">
                  <p className="">Email</p>
                </div>
                <div className="col-6">
                  <div
                    className="text-muted text-sm"
                    style={{
                      whiteSpace: "nowrap",
                      textOverflow: "ellipsis",
                      overflow: "hidden",
                    }}
                  >
                    : {data.email || "--"}
                  </div>
                </div>
              </div>
            </div>
            <div className="col-md-6 col-12">
              <div className="row  mb-2">
                <div className="col-6  ">
                  <p className="">Opening Date</p>
                </div>
                <div className="col-6">
                  <p className="text-muted text-sm">
                    :{" "}
                    {data.openingDate
                      ? data.openingDate.substring(0, 10)
                      : "--"}
                  </p>
                </div>
              </div>
            </div>
            <div className="col-md-6 col-12">
              <div className="row  mb-2">
                <div className="col-6  ">
                  <p className="">UEN Number</p>
                </div>
                <div className="col-6">
                  <p className="text-muted text-sm">
                    : {data.uenNumber || "--"}
                  </p>
                </div>
              </div>
            </div>
            <div className="col-md-6 col-12">
              <div className="row  mb-2">
                <div className="col-6  ">
                  <p className="">GST</p>
                </div>
                <div className="col-6">
                  <p className="text-muted text-sm">
                    : {data.gst ? "Yes" : "No"}
                  </p>
                </div>
              </div>
            </div>
            <div className="col-md-6 col-12">
              <div className="row  mb-2">
                <div className="col-6  ">
                  <p className="">Tax Registration Number</p>
                </div>
                <div className="col-6">
                  <p className="text-muted text-sm">
                    : {data.taxRegistrationNumber}
                  </p>
                </div>
              </div>
            </div>
            <div className="col-md-6 col-12">
              <div className="row  mb-2">
                <div className="col-6  ">
                  <p className="">Bank Name</p>
                </div>
                <div className="col-6">
                  <p className="text-muted text-sm">: {data.bankName}</p>
                </div>
              </div>
            </div>
            <div className="col-md-6 col-12">
              <div className="row  mb-2">
                <div className="col-6  ">
                  <p className="">Bank Branch</p>
                </div>
                <div className="col-6">
                  <p className="text-muted text-sm">: {data.bankBranch}</p>
                </div>
              </div>
            </div>
            <div className="col-md-6 col-12">
              <div className="row  mb-2">
                <div className="col-6  ">
                  <p className="">Bank Account Number</p>
                </div>
                <div className="col-6">
                  <p className="text-muted text-sm">
                    : {data.bankAccountNumber}
                  </p>
                </div>
              </div>
            </div>
            <div className="col-md-6 col-12">
              <div className="row  mb-2">
                <div className="col-6  ">
                  <p className="">Bank Account Name</p>
                </div>
                <div className="col-6">
                  <p className="text-muted text-sm">: {data.bankAccountName}</p>
                </div>
              </div>
            </div>
            <div className="col-md-6 col-12">
              <div className="row  mb-2">
                <div className="col-6  ">
                  <p className="">Invoice Notes</p>
                </div>
                <div className="col-6  ">
                  <p className="text-muted text-sm d-flex text-truncate">
                    : {data.invoiceNotes || "--"}
                    {/* : {formatValue(data.invoiceNotes) || "--"} */}
                  </p>
                </div>
              </div>
            </div>
            <div className="col-md-6 col-12">
              <div className="row  mb-2">
                <div className="col-6  ">
                  <p className="">Target</p>
                </div>
                <div className="col-6  ">
                  <p className="text-muted text-sm d-flex text-truncate">
                    : {data.target || "--"}
                    {/* : {formatValue(data.invoiceNotes) || "--"} */}
                  </p>
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col-md-4 col-12 ">
                <p className="mb-0 me-2">QR Code:</p>
                {data.qrCode && (
                  <img
                    src={data.qrCode}
                    className="img-fluid w-50 rounded"
                    alt="QR Code"
                  />
                )}
              </div>

              <div className="col-md-4 col-12 ">
                <p className="mb-0 me-2">{appConfigInfo.centreName} Logo:</p>
                {data.logo && (
                  <img
                    src={data.logo}
                    className="img-fluid w-50 rounded"
                    alt="Company Logo"
                  />
                )}
              </div>

              <div className="col-md-4 col-12 ">
                <p className="mb-0 me-2">Profile Image:</p>
                {data.profile && (
                  // eslint-disable-next-line jsx-a11y/img-redundant-alt
                  <img
                    src={data.profile}
                    className="img-fluid w-50 rounded"
                    alt="Profile Image"
                  />
                )}
              </div>
            </div>

            {/* Center Registrations */}
            <div className="col-md-12 col-12 mt-4">
              <h5 className="headColor mb-3">{appConfigInfo.centreName} Registrations</h5>
              <table className="table table-border-solid">
                <thead>
                  <tr>
                    <td className="">S.No</td>
                    <td className="">Effective Date</td>
                    <td className="">Amount Including(GST)</td>
                    <td className="">Tax Type</td>
                  </tr>
                </thead>
                <tbody>
                  {data.centerRegistrations &&
                    data.centerRegistrations.map((registration, index) => (
                      <tr key={index}>
                        <td>{index + 1}</td>
                        <td>{registration.effectiveDate?.substring(0, 10)}</td>
                        <td>{registration.amount}</td>
                        {/* <td>{registration.taxId || "--"}</td> */}
                        <td>
                          {taxTypeData &&
                            taxTypeData.map((tax) =>
                              parseInt(registration.taxId) === tax.id
                                ? tax.taxType || "--"
                                : ""
                            )}
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
            {/* Center Break */}
            <div className="col-md-12 col-12 mt-4">
              <h5 className="headColor mb-3">{appConfigInfo.centreName} Break</h5>
              <table class="table table-border-solid">
                <thead>
                  <tr>
                    <td className="">S.No</td>
                    <td className="">Break Name</td>
                    <td className="">From Date</td>
                    <td className="">To date</td>
                  </tr>
                </thead>
                <tbody>
                  {data.centerBreaks &&
                    data.centerBreaks.map((centerBreak, index) => (
                      <tr key={index}>
                        <td>{index + 1}</td>
                        <td>{centerBreak.breakName}</td>
                        <td>{centerBreak.fromDate.substring(0, 10)}</td>
                        <td>{centerBreak.toDate.substring(0, 10)}</td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
            {/* class Room  */}
            <div className="col-md-12 col-12 mt-4">
              <h5 className="headColor mb-3">{appConfigInfo.centreName} Class Room</h5>
              <table class="table table-border-solid">
                <thead>
                  <tr>
                    <td className="">S.No</td>
                    <td className="" style={{ whiteSpace: "nowrap" }}>
                      Class Room Name
                    </td>
                    <td className="" style={{ whiteSpace: "nowrap" }}>
                      Class Room Code
                    </td>
                    <td className="" style={{ whiteSpace: "nowrap" }}>
                      Class Room Type
                    </td>
                    <td className="" style={{ whiteSpace: "nowrap" }}>
                      Capacity
                    </td>
                    <td className="" style={{ whiteSpace: "nowrap" }}>
                      Description
                    </td>
                  </tr>
                </thead>
                <tbody>
                  {data.centerClassRooms &&
                    data.centerClassRooms.map((centerClassRoom, index) => (
                      <tr key={index}>
                        <td>{index + 1}</td>
                        <td>{centerClassRoom.classRoomName}</td>
                        <td>{centerClassRoom.classRoomCode}</td>
                        <td>{centerClassRoom.classRoomType}</td>
                        <td>{centerClassRoom.capacity}</td>
                        <td className="text-break">
                          {centerClassRoom.description}
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
            {/* Package  */}
            <div className="col-md-12 col-12 mt-4">
              <h5 className="headColor mb-3">{appConfigInfo.centreName} Package</h5>
              <table class="table table-border-solid">
                <thead>
                  <tr>
                    <td className="">S.No</td>
                    <td className="">Package</td>
                    <td className="">Number Of Lesson</td>
                  </tr>
                </thead>
                <tbody>
                  {data.centerPackages &&
                    data.centerPackages.map((centerPackage, index) => (
                      <tr key={index}>
                        <td>{index + 1}</td>
                        <td>{centerPackage.packageName || "--"}</td>
                        <td>{centerPackage.noOfLesson || "--"}</td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CenterView;
