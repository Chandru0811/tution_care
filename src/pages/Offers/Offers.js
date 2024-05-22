import React, { useEffect, useRef } from "react";
import "datatables.net-dt";
import "datatables.net-responsive-dt";
import $ from "jquery";
import { Link } from "react-router-dom";
import { FaEye, FaEdit } from "react-icons/fa";
import DeleteModel from "../../components/common/DeleteModel";

const Offers = () => {
  const tableRef = useRef(null);

  const datas = [
    {
      id: 1,
      filename: "ragul offer.pdf",
      candidateName: "Ragul ",
      postingTitle: "react js",
      dptName: "React",
    },
    {
      id: 2,
      filename: "Antony offer.pdf",
      candidateName: "Antony",
      postingTitle: "java developer",
      dptName: "Java",
    },
    {
      id: 3,
      filename: "chandru offer.pdf",
      candidateName: "Chandru",
      postingTitle: "react js",
      dptName: "React",
    },
    {
      id: 4,
      filename: "saravana offer.pdf",
      candidateName: "Saravana",
      postingTitle: "flutter",
      dptName: "Flutter ",
    },
    {
      id: 5,
      filename: "suriya offer.pdf",
      candidateName: "Suriya",
      postingTitle: "react js",
      dptName: "React",
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
                <h1 className="h4 ls-tight headingColor ">Offers</h1>
              </div>
            </div>
            <div className="col-auto">
              <div className="hstack gap-2 justify-content-end">
                <Link to="/offer/add">
                  <button type="submit" className="btn btn-sm btn-button">
                    <span>Create Offers</span>
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="card shadow border-0 my-2">
        <div className="table-responsive p-2 minHeight" >
          <table
            ref={tableRef}
            className="display table table-hover table-nowrap"
          >
            <thead className="thead-light">
              <tr>
                <th scope="col" style={{ whiteSpace: "nowrap" }}>
                  S.NO
                </th>
                <th scope="col">FILE NAME</th>
                <th scope="col">CANTIDATE NAME</th>
                <th scope="col">POSTING TITLE</th>
                <th scope="col">DEPARTMENT NAME</th>
                <th scope="col" className="text-center">ACTION</th>
              </tr>
            </thead>
            <tbody>
              {datas.map((data, index) => (
                <tr key={index}>
                  <td className="text-center">{index + 1}</td>
                  <td>{data.filename}</td>
                  <td>{data.candidateName}</td>
                  <td>{data.postingTitle}</td>
                  <td>{data.dptName}</td>
                  <td className="text-center">
                    <Link to="/offer/view">
                      <button className="btn btn-sm ps-0 shadow-none border-none">
                        <FaEye />
                      </button>
                    </Link>
                    <Link to="/offer/edit">
                      <button className="btn btn-sm shadow-none border-none">
                        <FaEdit />
                      </button>
                    </Link>
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

export default Offers;
