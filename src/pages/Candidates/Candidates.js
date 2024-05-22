import React, { useEffect, useRef } from "react";
import "datatables.net-dt";
import "datatables.net-responsive-dt";
import $ from "jquery";
import { Link } from "react-router-dom";
import { FaEye, FaEdit } from "react-icons/fa";
import { FaStar } from "react-icons/fa6";
import DeleteModel from "../../components/common/DeleteModel";
import JobAssociate from "./JobAssociate";

const Candidates = () => {
  const tableRef = useRef(null);

  const datas = [
    {
      id: 1,
      candidateName: "Ragul",
      city: "Chennai  ",
      candidateStage: "Fresher",
      modifiedTime: "08:00",
      rating: "1",
    },
    {
      id: 2,
      candidateName: "Anthony",
      city: "Chennai  ",
      candidateStage: "Fresher",
      modifiedTime: "08:00",
      rating: "2",
    },
    {
      id: 3,
      candidateName: "Chandru",
      city: "Chennai  ",
      candidateStage: "1 Experience",
      modifiedTime: "09:00",
      rating: "3",
    },
    {
      id: 4,
      candidateName: "Surya",
      city: "Chennai  ",
      candidateStage: "2 Experience",
      modifiedTime: "09:00",
      rating: "4",
    },
    {
      id: 5,
      candidateName: "Manoj",
      city: "Chennai  ",
      candidateStage: "5 Experience",
      modifiedTime: "10:00",
      rating: "5",
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
                <h1 className="h4 ls-tight headingColor ">Candidate</h1>
              </div>
            </div>
            <div className="col-auto">
              <div className="hstack gap-2 justify-content-end">
                <Link to="/candidates/add">
                  <button type="submit" className="btn btn-sm btn-button">
                    <span>Create Candidate</span>
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="card shadow border-0 my-2">
        <div className="table-responsive p-2">
          <table ref={tableRef} className="display table ">
            <thead className="thead-light">
              <tr>
                <th scope="col" style={{ whiteSpace: "nowrap" }}>
                  S.NO
                </th>
                <th scope="col">CANDIDATE NAME</th>
                <th scope="col">CITY</th>
                <th scope="col">CANDIDATE STAGE</th>
                <th scope="col">MODIFIED TIME</th>
                <th className="text-start" scope="col">
                  RATING
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
                  <td>{data.candidateName}</td>
                  <td>{data.city}</td>
                  <td>{data.candidateStage}</td>
                  <td>{data.modifiedTime}</td>
                  <td className="text-start">
        {data.rating === "5" ? (
          <span
            className="badge badge-bg-light text-dark border border-grey"
            style={{ borderRadius: "10px" }}
          >
            5.0 <FaStar className="text-warning" />
          </span>
        ) : data.rating === "4" ? (
          <span
            className="badge badge-bg-light text-dark border border-grey"
            style={{ borderRadius: "10px" }}
          >
            4.0 <FaStar className="text-warning" />
          </span>
        ) : data.rating === "3" ? (
          <span
            className="badge badge-bg-light text-dark border border-grey"
            style={{ borderRadius: "10px" }}
          >
            3.0 <FaStar className="text-warning" />
          </span>
        ) : data.rating === "2" ? (
          <span
            className="badge badge-bg-light text-dark border border-grey"
            style={{ borderRadius: "10px" }}
          >
            2.0 <FaStar className="text-warning" />
          </span>
        ) : (
          <span
            className="badge badge-bg-light text-dark border border-grey"
            style={{ borderRadius: "10px" }}
          >
            1.0 <FaStar className="text-warning" />
          </span>
        )}
      </td>
                  <td>
                    <div className="d-flex justify-content-around align-items-center">
                      <JobAssociate />
                      <Link to="/candidates/view">
                        <button className="btn btn-sm shadow-none border-none">
                          <FaEye />
                        </button>
                      </Link>
                      <Link to="/candidates/edit">
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

export default Candidates;
