import React, { useEffect, useRef, useState } from "react";
import "datatables.net-dt";
import "datatables.net-responsive-dt";
import $ from "jquery";
import { Link } from "react-router-dom";
import { FaEye, FaEdit } from "react-icons/fa";
import api from "../../config/URL";
import { SCREENS } from "../../config/ScreenFilter";
import DeleteModel from "../../components/common/DeleteModel";

const Student = () => {
  const tableRef = useRef(null);

  const [datas, setDatas] = useState([]);
  const [loading, setLoading] = useState(true);

  const storedScreens = JSON.parse(sessionStorage.getItem("screens") || "{}");
  console.log("Screens : ", SCREENS);

  useEffect(() => {
    const getCenterData = async () => {
      try {
        const response = await api.get("/getAllStudentDetails");
        setDatas(response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };
    getCenterData();
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

  const refreshData = async () => {
    destroyDataTable();
    setLoading(true);
    try {
      const response = await api.get("/getAllStudentDetails");
      setDatas(response.data);
      initializeDataTable(); // Reinitialize DataTable after successful data update
    } catch (error) {
      console.error("Error refreshing data:", error);
    }
    setLoading(false);
  };

  return (
    <div>
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
        <div className="minHeight center">
        <div className="container-fluid my-4 center">
        <div className="card shadow border-0 mb-2 top-header">
        <div className="container-fluid px-0">
          <div className="my-3 d-flex justify-content-between px-4">
            <h2>Student Listing</h2>
           {/* {storedScreens?.studentListingCreate && (  */}
              <Link to="/studentlisting/add">
                <button type="button" className="btn btn-button btn-sm">
                  Add <i class="bx bx-plus"></i>
                </button>
              </Link>
             {/* )}  */}
          </div>
          <hr/>
          <div className="px-4">
          <table ref={tableRef} className="display">
            <thead>
              <tr>
                <th scope="col" style={{ whiteSpace: "nowrap" }}>
                  S No
                </th>
                <th scope="col">Student ID</th>
                <th scope="col">Student Name</th>
                <th scope="col">Age</th>
                <th scope="col">Gender</th>
                <th scope="col">Nationality</th>
                {/* <th scope="col">Join Class Date</th>
                <th scope="col">Status</th> */}
                <th scope="col">Action</th>
              </tr>
            </thead>
            <tbody>
              {datas.map((data, index) => (
                <tr key={index}>
                  <th scope="row">{index + 1}</th>
                  <td>{data.studentUniqueId}</td>
                  <td>{data.studentName}</td>
                  <td>{data.age}</td>
                  <td>{data.gender}</td>
                  <td>{data.nationality}</td>
                  {/* <td>{data.joinClassDate}</td>
                  <td>{data.status}</td> */}
                  <td>
                    <div className="d-flex">
                      {/* {storedScreens?.studentListingRead && ( */}
                        <Link to={`/studentlisting/view/${data.id}`}>
                          <button className="btn btn-sm">
                            <FaEye />
                          </button>
                        </Link>
                      {/* )} */}
                      {/* {storedScreens?.studentListingUpdate && ( */}
                        <Link to={`/studentlisting/edit/${data.id}`}>
                          <button className="btn btn-sm">
                            <FaEdit />
                          </button>
                        </Link>
                      {/* )} */}
                      {/* {storedScreens?.studentListingDelete && ( */}
                        <DeleteModel
                          onSuccess={refreshData}
                          path={`/deleteStudentDetail/${data.id}`}
                        />
                      {/* )} */}
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
        </div>
      )}
    </div>
  );
};

export default Student;

