import React, { useEffect, useRef, useState } from "react";
import "datatables.net-dt";
import "datatables.net-responsive-dt";
import $ from "jquery";
import { Link } from "react-router-dom";
import { FaEye, FaEdit } from "react-icons/fa";
import fetchAllCentersWithIds from "../../List/CenterList";
import toast from "react-hot-toast";
import api from "../../../config/URL";

const LeaveAdmin = () => {
  const tableRef = useRef(null);
  const [datas, setDatas] = useState([]);
  console.log("Leave Data:", datas);
  const [loading, setLoading] = useState(true);
  const [centerData, setCenterData] = useState(null);
  const storedScreens = JSON.parse(sessionStorage.getItem("screens") || "{}");

  const fetchData = async () => {
    try {
      const centerData = await fetchAllCentersWithIds();
      setCenterData(centerData);
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    const getData = async () => {
      try {
        const response = await api.get("/getAllUserLeaveRequests");
        setDatas(response.data);
        setLoading(false);
      } catch (error) {
        toast.error("Error Fetching Data : ", error.message);
      }
    };
    getData();
    fetchData();
  }, []);

  useEffect(() => {
    if (!loading) {
      initializeDataTable();
    }
    return () => {
      destroyDataTable();
    };
  }, [loading]);

  const initializeDataTable = () => {
    if ($.fn.DataTable.isDataTable(tableRef.current)) {
      // DataTable already initialized, no need to initialize again
      return;
    }
    $(tableRef.current).DataTable({
      responsive: true,
    });
  };

  const destroyDataTable = () => {
    const table = $(tableRef.current).DataTable();
    if (table && $.fn.DataTable.isDataTable(tableRef.current)) {
      table.destroy();
    }
  };

  return (
    <div className="minHeight container-fluid  center">
      <div className="card shadow border-0 mb-2 top-header minHeight">
        <div className="container-fluid px-0">
          <div className="my-5 px-4 d-flex justify-content-between">
            <h2>Leave</h2>
          </div>
          <hr />
          {loading ? (
            <div className="loader-container">
              <div class="loading">
                <span></span>
                <span></span>
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>
          ) : (
            <div className="table-response px-4">
              <table ref={tableRef} className="display  ">
                <thead>
                  <tr>
                    <th scope="col" style={{ whiteSpace: "nowrap" }}>
                      S No
                    </th>
                    <th scope="col">Centre Name</th>
                    <th scope="col">Employee Name</th>
                    <th scope="col">Leave Type</th>
                    <th scope="col">Leave Status</th>
                    <th className="text-center">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {datas.map((data, index) => (
                    <tr key={index}>
                      <th scope="row">{index + 1}</th>
                      <td>
                        {centerData &&
                          centerData.map((centerId) =>
                            parseInt(data.tuitionId) === centerId.id
                              ? centerId.centerNames || "--"
                              : ""
                          )}
                      </td>
                      <td>{data.employeeName}</td>
                      <td>{data.leaveType}</td>
                      <td>
                        {data.leaveStatus === "APPROVED" ? (
                          <span className="badge badges-Green">Approved</span>
                        ) : data.leaveStatus === "REJECTED" ? (
                          <span className="badge badges-Red">Rejected</span>
                        ) : (
                          <span className="badge badges-Yellow">Pending</span>
                        )}
                      </td>
                      <td>
                        <div className="d-flex justify-content-center align-items-center ">
                           {storedScreens?.leaveAdminRead && (
                            <Link
                              to={`/leaveadmin/view/${data.id}`}
                              style={{ display: "inline-block" }}
                            >
                              <button className="btn btn-sm">
                                <FaEye />
                              </button>
                            </Link>
                          )} 
                          {storedScreens?.leaveAdminUpdate && ( 
                          <Link
                            to={`/leaveadmin/edit/${data.id}`}
                            style={{ display: "inline-block" }}
                          >
                            <button className="btn btn-sm">
                              <FaEdit />
                            </button>
                          </Link>
                           )} 
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LeaveAdmin;
