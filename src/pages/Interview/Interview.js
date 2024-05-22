import React, { useEffect, useRef } from "react";
import "datatables.net-dt";
import "datatables.net-responsive-dt";
import $ from "jquery";
import { Link } from "react-router-dom";
import { FaEye } from "react-icons/fa";
import DeleteModel from "../../components/common/DeleteModel";

const Interview = () => {
  const tableRef = useRef(null);

  const datas = [
    {
      id: 1,
      interviewName: "ECS_01_JOB",
      candidateName: "Ragul",
      departmentName: "React Js",
      postingTitle: "React Developer",
      interviewStatus: "In_progress",
    },
    {
      id: 2,
      interviewName: "ECS_02_JOB",
      candidateName: "Chandru",
      departmentName: "Laravel",
      postingTitle: "Front End Developer",
      interviewStatus: "On_Hold",
    },
    {
      id: 3,
      interviewName: "ECS_03_JOB",
      candidateName: "Surya",
      departmentName: "Angular",
      postingTitle: "Angular Developer",
      interviewStatus: "",
    },
  ];

  useEffect(() => {
    const table = $(tableRef.current).DataTable();

    return () => {
      table.destroy();
    };
  }, []);

  return (
    <div className="container-fluid minHeight">
      <div className="card shadow border-0 mb-2 top-header">
        <div className="container-fluid py-4">
          <div className="row align-items-center justify-content-between ">
            <div className="col">
              <div className="d-flex align-items-center gap-4">
                <h1 className="h4 ls-tight headingColor ">Interview</h1>
              </div>
            </div>
            <div className="col-auto">
              <div className="hstack gap-2 justify-content-end">
                <div className="dropdown">
                  <button
                    className="btn btn-primary dropdown-toggle py-2"
                    type="button"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                  >
                    Create Interview
                  </button>
                  <ul className="dropdown-menu">
                    <li>
                      <Link className="dropdown-item" to="/interview/formal">
                        Formal Interview
                      </Link>
                    </li>
                    <li>
                      <Link className="dropdown-item" to="/interview/record">
                        Record Interview
                      </Link>
                    </li>
                    <li>
                      <Link className="dropdown-item" to="/interview/live">
                        Live Interview
                      </Link>
                    </li>
                    <li>
                      <Link className="dropdown-item" to="/interview/logan">
                        Log an Intervieww
                      </Link>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="card shadow border-0 my-2">
        <div className="table-responsive p-2 minHeight">
          <table ref={tableRef} className="display table">
            <thead className="thead-light">
              <tr>
                <th scope="col" style={{ whiteSpace: "nowrap" }}>
                  S.NO
                </th>
                <th scope="col">INTREVIEW NAME</th>
                <th scope="col">CANDIDATE NAME</th>
                <th scope="col">DEPARTMENT NAME</th>
                <th scope="col">POSTING TITLE</th>
                <th scope="col">INTERVIEW STATUS</th>
                <th scope="col" className="text-center">
                  ACTION
                </th>
              </tr>
            </thead>
            <tbody>
              {datas.map((data, index) => (
                <tr key={index}>
                  <td className="text-center">{index + 1}</td>
                  <td>{data.interviewName}</td>
                  <td>{data.candidateName}</td>
                  <td>{data.departmentName}</td>
                  <td>{data.postingTitle}</td>

                  <td>
                    {data.interviewStatus === "In_progress" ? (
                      <span className="badge text-bg-success">In progress</span>
                    ) : data.interviewStatus === "On_Hold" ? (
                      <span className="badge text-bg-warning">On Hold</span>
                    ) : (
                      <span className="badge text-bg-primary">
                        Waiting for Approval
                      </span>
                    )}
                  </td>
                  <td>
                    <div className="d-flex">
                      <Link to="/interview/view">
                        <button className="btn btn-sm shadow-none border-none">
                          <FaEye />
                        </button>
                      </Link>
                      {/* <Link to="/interview/edit">
                        <button className="btn btn-sm">
                          <FaEdit />
                        </button>
                      </Link> */}
                      <DeleteModel />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="card-footer border-0 py-5"></div>
      </div>
    </div>
  );
};

export default Interview;
