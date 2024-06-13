import React, { useEffect, useRef, useState } from "react";
import "datatables.net-dt";
import "datatables.net-responsive-dt";
import $ from "jquery";
import { Link } from "react-router-dom";
import { FaEye, FaEdit } from "react-icons/fa";
import api from "../../config/URL";
import { FaFileInvoice } from "react-icons/fa";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import { SCREENS } from "../../config/ScreenFilter";
import DeleteModel from "../../components/common/DeleteModel";

const Course = () => {
  console.log("Screens : ", SCREENS);
  // const { id } = useParams();
  const tableRef = useRef(null);
  const [datas, setDatas] = useState([]);
  const [loading, setLoading] = useState(true);
  const storedScreens = JSON.parse(sessionStorage.getItem("screens") || "{}");

  useEffect(() => {
    const getData = async () => {
      try {
        const response = await api.get("/getAllCourses");
        setDatas(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data ", error.message);
      }
    };
    getData();
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
    $(tableRef.current).DataTable();
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
      const response = await api.get("/getAllCourses");
      setDatas(response.data);
      initializeDataTable(); // Reinitialize DataTable after successful data update
    } catch (error) {
      console.error("Error refreshing data:", error.message);
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
        <div className="container-fluid  center ">
          <div className="card shadow border-0 mb-2 top-header minHeight">
            <div className="container-fluid px-0">
              <div className="my-3 d-flex justify-content-between mb-5 px-4">
              <h2>Course</h2>
            {storedScreens?.subjectCreate && ( 
               
                <Link to="/course/add">
                  <button type="button" className="btn btn-button btn-sm">
                      Add <i class="bx bx-plus"></i>
                  </button>
                </Link>
             )} 
              </div>
              <hr />
              <div className="table-responsive px-4">
                <table ref={tableRef} className="display ">
                  <thead>
                    <tr>
                      <th scope="col">S No</th>
                      {/* <th scope="col">Centre Name</th> */}
                      <th scope="col">Course Name</th>
                      <th scope="col">Course Code</th>
                      <th scope="col">Course Type</th>
                      <th scope="col">Status</th>
                      <th scope="col">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {datas.map((data, index) => (
                      <tr key={index}>
                        <th scope="row">{index + 1}</th>
                        {/* <td>{data.tuitionCareName}</td> */}
                        <td>{data.courseName}</td>
                        <td>{data.courseCode}</td>
                        <td>{data.courseType}</td>
                        <td>
                          {data.status === "Active" ? (
                            <span className="badge badges-Green">Active</span>
                          ) : (
                            <span className="badge badges-Red">Inactive</span>
                          )}
                        </td>
                        <td>
                        {storedScreens?.courseRead && ( 
                            <Link to={`/course/view/${data.id}`}>
                              <button className="btn btn-sm">
                                <FaEye />
                              </button>
                            </Link>
                         )} 
                          {storedScreens?.courseUpdate && ( 
                            <Link to={`/course/edit/${data.id}`}>
                              <button className="btn btn-sm">
                                <FaEdit />
                              </button>
                            </Link>
                        )} 
                         {storedScreens?.courseDelete && ( 
                    <DeleteModel
                      onSuccess={refreshData}
                      path={`/deleteCourse/${data.id}`}
                    />
                 )} 

                      {storedScreens?.curriculumIndex && ( 
                            <OverlayTrigger
                              placement="top"
                              overlay={
                                <Tooltip id="tooltip-top">Curriculum</Tooltip>
                              }
                            >
                              <Link to={`/course/curriculum/${data.id}`}>
                                <button className="btn btn-sm">
                                  <FaFileInvoice />
                                </button>
                              </Link>
                            </OverlayTrigger>
                           )} 
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Course;
