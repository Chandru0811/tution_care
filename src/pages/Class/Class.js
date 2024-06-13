import React, { useEffect, useRef, useState } from "react";
import "datatables.net-dt";
import "datatables.net-responsive-dt";
import $ from "jquery";
import { Link } from "react-router-dom";
import { FaEye, FaEdit } from "react-icons/fa";
import api from "../../config/URL";
import toast from "react-hot-toast";
import DeleteModel from "../../components/common/DeleteModel";
// import { SCREENS } from "../../config/ScreenFilter";

const Class = () => {
  const tableRef = useRef(null);

  const [datas, setDatas] = useState([]);
  const [loading, setLoading] = useState(true);
  const storedScreens = JSON.parse(sessionStorage.getItem("screens") || "{}");
  // console.log("Screens : ", SCREENS);

  useEffect(() => {
    const getCenterData = async () => {
      try {
        const response = await api.get("/getAllCourseClassListings");
        setDatas(response.data);
        setLoading(false);
      } catch (error) {
        toast.error("Error Fetching Data");
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
      const response = await api.get("/getAllCourseClassListings");
      setDatas(response.data);
      initializeDataTable();
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
        <div className="container-fluid  center">
          <div className="card shadow border-0 mb-2 top-header minHeight">
            <div className="container-fluid px-0">
              <div className="my-3 d-flex justify-content-between mb-5 px-4">
               
                <h2>Class</h2>
                {storedScreens?.subjectCreate && ( 
                <Link to="/class/add">
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
                      <th scope="col">Class Name</th>
                      <th scope="col">Class Type </th>
                      <th scope="col">Remark </th>

                      <th scope="col">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {datas.map((data, index) => (
                      <tr key={index}>
                        <th scope="row">{index + 1}</th>
                        <td>{data.className}</td>
                        <td>{data.classType}</td>
                        <td>{data.remark}</td>
                        <td>
                          {storedScreens?.classRead && ( 
                          <Link to={`/class/view/${data.id}`}>
                            <button className="btn btn-sm">
                              <FaEye />
                            </button>
                          </Link>
                       )} 
                           {storedScreens?.classUpdate && ( 
                          <Link to={`/class/edit/${data.id}`}>
                            <button className="btn btn-sm">
                              <FaEdit />
                            </button>
                          </Link>
                         )} 
                           {storedScreens?.classDelete && ( 
                          <DeleteModel
                            onSuccess={refreshData}
                            path={`/deleteCourseClassListing/${data.id}`}
                          />
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
export default Class;
