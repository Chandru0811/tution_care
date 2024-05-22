import React, { useEffect, useRef } from "react";
import "datatables.net-dt";
import "datatables.net-responsive-dt";
import $ from "jquery";
import { Link } from "react-router-dom";
import { FaEye, FaEdit } from "react-icons/fa";
import DeleteModel from "../../components/common/DeleteModel";

const JopOpening = () => {
  const tableRef = useRef(null);

  const datas = [
    {
      id: 1,
      jobId: "ECS_01_JOB",
      title: "Web Designer",
      recruiters: "User01",
      dptName: "React Js",
      status: "In_progress",
    },
    {
      id: 2,
      jobId: "ECS_02_JOB",
      title: "Developer",
      recruiters: "User02",
      dptName: "Laravel",
      status: "On_Hold",
    },
    {
      id: 3,
      jobId: "ECS_03_JOB",
      title: "Product Lead",
      recruiters: "User03",
      dptName: "Angular",
      status: "Waiting_for_Approval",
    },
    {
      id: 4,
      jobId: "ECS_04_JOB",
      title: "Product Lead",
      recruiters: "User04",
      dptName: "Laravel ",
      status: "On_Hold",
    },
    {
      id: 5,
      jobId: "ECS_05_JOB",
      title: "Web Designer",
      recruiters: "User05",
      dptName: "React Js",
      status: "In_progress",
    },
    {
      id: 5,
      jobId: "ECS_05_JOB",
      title: "Web Designer",
      recruiters: "User05",
      dptName: "React Js",
      status: "In_progress",
    },
    {
      id: 5,
      jobId: "ECS_05_JOB",
      title: "Web Designer",
      recruiters: "User05",
      dptName: "React Js",
      status: "In_progress",
    },
    {
      id: 5,
      jobId: "ECS_05_JOB",
      title: "Web Designer",
      recruiters: "User05",
      dptName: "React Js",
      status: "In_progress",
    },
    {
      id: 5,
      jobId: "ECS_05_JOB",
      title: "Web Designer",
      recruiters: "User05",
      dptName: "React Js",
      status: "In_progress",
    },
    {
      id: 5,
      jobId: "ECS_05_JOB",
      title: "Web Designer",
      recruiters: "User05",
      dptName: "React Js",
      status: "In_progress",
    },
    {
      id: 5,
      jobId: "ECS_05_JOB",
      title: "Web Designer",
      recruiters: "User05",
      dptName: "React Js",
      status: "In_progress",
    },
    {
      id: 5,
      jobId: "ECS_05_JOB",
      title: "Web Designer",
      recruiters: "User05",
      dptName: "React Js",
      status: "In_progress",
    },

    {
      id: 5,
      jobId: "ECS_05_JOB",
      title: "Web Designer",
      recruiters: "User05",
      dptName: "React Js",
      status: "In_progress",
    },

    {
      id: 5,
      jobId: "ECS_05_JOB",
      title: "Web Designer",
      recruiters: "User05",
      dptName: "React Js",
      status: "In_progress",
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
                <h1 className="h4 ls-tight headingColor ">Job Opening</h1>
              </div>
            </div>
            <div className="col-auto">
              <div className="hstack gap-2 justify-content-end">
                <Link to="/jobOpening/add">
                  <button type="submit" className="btn btn-sm btn-button">
                    <span>Create Job Opening</span>
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="card shadow border-0 my-2 ">
        <div className="table-responsive p-2 minHeight">
          <table ref={tableRef} className="display table">
            <thead className="thead-light">
              <tr>
                <th scope="col" style={{ whiteSpace: "nowrap" }}>
                  S.NO
                </th>
                <th scope="col">JOB ID</th>
                <th scope="col">TITLE</th>
                <th scope="col">RECRUITERS</th>
                <th scope="col">DEPARTMENT NAME</th>
                <th scope="col">STATUS</th>
                <th scope="col" className="text-center">ACTION</th>
              </tr>
            </thead>
            <tbody>
              {datas.map((data, index) => (
                <tr key={index}>
                  <td className="text-center">{index + 1}</td>
                  <td>{data.jobId}</td>
                  <td>{data.title}</td>
                  <td>{data.recruiters}</td>
                  <td>{data.dptName}</td>
                  <td>
                    {data.status === "In_progress" ? (
                      <span className="badge text-bg-success">In progress</span>
                    ) : data.status === "On_Hold" ? (
                      <span className="badge text-bg-warning">On Hold</span>
                    ) : (
                      <span className="badge text-bg-primary">
                        Waiting for Approval
                      </span>
                    )}
                  </td>
                  <td>
                    <div>
                      <Link to="/jobOpening/view">
                        <button className="btn btn-sm ps-0 shadow-none border-none">
                          <FaEye />
                        </button>
                      </Link>
                      <Link to="/jobOpening/edit">
                        <button className="btn btn-sm shadow-none border-none">
                          <FaEdit />
                        </button>
                      </Link>
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

export default JopOpening;
