import React, { useEffect, useRef } from "react";
import "datatables.net-dt";
import "datatables.net-responsive-dt";
import $ from "jquery";
import { Link } from "react-router-dom";
import { FaEye } from "react-icons/fa";

const DocumentReport = () => {
  const tableRef = useRef(null);
  const storedScreens = JSON.parse(sessionStorage.getItem("screens") || "{}");

  const datas = [
    {
      id: 1,
      course: "Arty Pursures",
      class: "FRI_7PM-DAISY",
      date: "2022-07-01",
      day_time: "Fri(19:00:00-20:30:00)",
      totel_files: "17",
      image_files: "8",
      video_files: "9",
    },
    {
      id: 2,
      course: "Arty Pursures",
      class: "FRI_7PM-DAISY",
      date: "2022-07-01",
      day_time: "Fri(19:00:00-20:30:00)",
      totel_files: "9",
      image_files: "4",
      video_files: "5",
    },
  ];

  useEffect(() => {
    const table = $(tableRef.current).DataTable({
      responsive: true,
    });

    return () => {
      table.destroy();
    };
  }, []);

  return (
    <div className="minHeight container-fluid  center">
    <div className="card shadow border-0 mb-2 top-header">
      <div className="container-fluid px-0">
        <div className="my-3 d-flex justify-content-between mb-5 px-4">
          <h2>Document Report</h2>
        </div>
        <hr />
        <div className="table-responsive px-4">
        <table ref={tableRef} className="display">
          <thead>
            <tr>
              <th scope="col" style={{ whiteSpace: "nowrap" }}>
                S No
              </th>
              <th scope="col">Course</th>
              <th scope="col">Class</th>
              <th scope="col">Day / Time</th>
              <th scope="col">Total Files</th>
              <th scope="col">Image Files</th>
              <th scope="col">Video Files</th>
              <th scope="col">Action</th>
            </tr>
          </thead>
          <tbody>
            {datas.map((data, index) => (
              <tr key={index}>
                <th>{index + 1}</th>
                <td>{data.course}</td>
                <td>{data.class}</td>
                <td>{data.day_time}</td>
                <td>{data.totel_files}</td>
                <td>{data.image_files}</td>
                <td>{data.video_files}</td>
                <td>
                  <div className="d-flex">
                    {storedScreens?.documentReportRead && (
                      <Link to={`/report/document/view`}>
                        <button className="btn btn-sm">
                          <FaEye />
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
    </div>
    </div>
    </div>
  );
};

export default DocumentReport;
