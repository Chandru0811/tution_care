import React, { useEffect, useRef } from "react";
import "datatables.net-dt";
import "datatables.net-responsive-dt";
import $ from "jquery";
import { Link } from "react-router-dom";
import { FaEye, FaEdit } from "react-icons/fa";
import DeleteModel from "../../components/common/DeleteModel";


const Assessment = () => {
  const tableRef = useRef(null);

  const datas = [
    {
      id: 1,
      assessmentName: "React JS",
      noOfQuestions: "05",
      assessmentowner: "User01",
      type: "General",
    },
    {
      id: 2,
      assessmentName: "Java",
      noOfQuestions: "03",
      assessmentowner: "User02",
      type: "Behavioural Interview",
    },
    {
      id: 3,
      assessmentName: "Flutter",
      noOfQuestions: "02",
      assessmentowner: "User01",
      type: "Pre-Screening",
    },
    {
      id: 4,
      assessmentName: "Angular",
      noOfQuestions: "07",
      assessmentowner: "User02",
      type: "Behavioural Screening",
    },
    {
      id: 5,
      assessmentName: "Screening Interview",
      noOfQuestions: "10",
      assessmentowner: "User01",
      type: "Background Screening",
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
                <h1 className="h4 ls-tight headingColor ">Assessments</h1>
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
                    Create Assessment
                  </button>
                  <ul className="dropdown-menu">
                    <li>
                      <Link className="dropdown-item" to="/assessment/candidateadd">
                         Candidate Assessment
                      </Link>
                    </li>
                    <li>
                      <Link className="dropdown-item" to="/assessment/recruiteradd">
                      Recruiter's Assessment
                      </Link>
                    </li>
                    <li>
                      <Link className="dropdown-item"  to="/assessment/intervieweradd">
                      Interviewer Assessment
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
          <table ref={tableRef} className="display table ">
            <thead className="thead-light">
              <tr>
                <th
                  scope="col"
                  className="text-center"
                  style={{ whiteSpace: "nowrap" }}
                >
                  S.NO
                </th>
                <th scope="col" className="text-start">
                  ASSESSMENT NAME
                </th>
                <th scope="col" className="text-start">
                  NO OF QUESTIONS
                </th>
                <th scope="col" className="text-start">
                  ASSESSMENT OWNER
                </th>
                <th scope="col" className="text-start">
                  TYPE
                </th>
                <th scope="col" className="text-center">
                  ACTION
                </th>
              </tr>
            </thead>
            <tbody>
              {datas.map((data, index) => (
                <tr key={index}>
                  <td className="text-center">{index + 1}</td>
                  <td className="text-start">{data.assessmentName}</td>
                  <td className="text-start">{data.noOfQuestions}</td>
                  <td className="text-start">{data.assessmentowner}</td>
                  <td className="text-start">{data.type}</td>
                  <td className="text-center">
                    <Link to="/assessment/view">
                      <button className="btn btn-sm ps-0 shadow-none border-none">
                        <FaEye />
                      </button>
                    </Link>
                    <div className="dropdown shadow-none border-none">
                      <button
                        className="btn btn-sm dropdown-toggle sortdown shadow-none border-none"
                        type="button"
                        data-bs-toggle="dropdown"
                        aria-expanded="false"
                      >
                        <FaEdit />
                      </button>
                      <ul className="dropdown-menu">
                        <li>
                          <Link
                            className="dropdown-item"
                            to="/assessment/candidateedit"
                          >
                            Candidate Assessment
                          </Link>
                        </li>
                        <li>
                          <Link
                            className="dropdown-item"
                            to="/assessment/recruiteredit"
                          >
                            Recruiter's Assessment
                          </Link>
                        </li>
                        <li>
                          <Link
                            className="dropdown-item"
                            to="/assessment/intervieweredit"
                          >
                            Interviewer Assessment
                          </Link>
                        </li>
                      </ul>
                    </div>
                    <DeleteModel />
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

export default Assessment;
