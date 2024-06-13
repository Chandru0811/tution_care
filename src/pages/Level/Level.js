import React, { useEffect, useRef, useState } from "react";
import "datatables.net-dt";
import "datatables.net-responsive-dt";
import $ from "jquery";
import { Link } from "react-router-dom";
import { FaEye } from "react-icons/fa";
import LevelEdit from "./LevelEdit";
import Delete from "../../components/common/DeleteModel";
import api from "../../config/URL";
import LevelAdd from "./LevelAdd";

const Level = () => {
  const tableRef = useRef(null);
  const storedScreens = JSON.parse(sessionStorage.getItem("screens") || "{}");
  const [datas, setDatas] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getData = async () => {
      try {
        const response = await api.get("/getAllCourseLevels");
        setDatas(response.data);
      } catch (error) {
        console.error("Error fetching data:", error.message);
      } finally {
        setLoading(false);
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
      const response = await api.get("/getAllCourseLevels");
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
        <div className="container-fluid  center">
          <div className="card shadow border-0 mb-2 top-header minHeight">
            <div className="container-fluid px-0">
              <div className="my-3 d-flex justify-content-between mb-5 px-4">
              <h2>Level</h2>
            {storedScreens?.levelCreate && ( 
              
                <LevelAdd onSuccess={refreshData} />

                )} 
              </div>
              <hr />
              <div className="table-responsive px-4">
                <table ref={tableRef} className="display ">
                  <thead>
                    <tr>
                      <th scope="col">S No</th>
                      <th scope="col">Level</th>
                      <th scope="col">Code</th>
                      <th scope="col">Status</th>
                      <th scope="col">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {datas.map((data, index) => (
                      <tr key={index}>
                        <th scope="row">{index + 1}</th>
                        <td>{data.level}</td>
                        <td>{data.levelCode}</td>
                        <td>
                          {data.status === "Active" ? (
                            <span className="badge badges-Green">Active</span>
                          ) : (
                            <span className="badge badges-Red">Inactive</span>
                          )}
                        </td>
                        <td>
                          {storedScreens?.levelRead && ( 
                          <Link to={`/level/view/${data.id}`}>
                            <button className="btn btn-sm">
                              <FaEye />
                            </button>
                          </Link>
                           )} 
                           {storedScreens?.levelUpdate && ( 
                          <LevelEdit id={data.id} onSuccess={refreshData} />
                          )} 
                          {storedScreens?.levelDelete && ( 
                          <Delete
                            onSuccess={refreshData}
                            path={`/deleteCourseLevel/${data.id}`}
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

export default Level;
