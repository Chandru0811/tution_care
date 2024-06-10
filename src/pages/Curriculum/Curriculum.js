import React, { useEffect, useRef, useState } from "react";
import "datatables.net-dt";
import "datatables.net-responsive-dt";
import $ from "jquery";
import CurriculumAdd from "./CurriculumAdd";
import CurriculumEdit from "./CurriculumEdit";
import api from "../../config/URL";
import { useParams } from "react-router-dom";
import fetchAllCoursesWithIds from "../List/CourseList";
import toast from "react-hot-toast";
import DeleteModel from "../../components/common/DeleteModel";

const Curriculum = () => {
  const { id } = useParams();
  // console.log("ID:", id);
  const tableRef = useRef(null);
  const [datas, setDatas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [courseData, setCourseData] = useState(null);
  const storedScreens = JSON.parse(sessionStorage.getItem("screens") || "{}");

  const fetchData = async () => {
    try {
      const courseData = await fetchAllCoursesWithIds();
      setCourseData(courseData);
    } catch (error) {
      toast.error(error);
    }
  };

  useEffect(() => {
    const getData = async () => {
      const response = await api.get(`/getAllCurriculumCodesByCourseId/${id}`);
      setDatas(response.data);
      setLoading(false);
      console.log("Api Data:", response.data);
    };
    getData();
    fetchData();
  }, [id]);

  useEffect(() => {
    const table = $(tableRef.current).DataTable({
      responsive: true,
    });

    return () => {
      table.destroy();
    };
  }, [loading]);

  // const refreshData = async () => {
  //   const response = await api.get(`/getAllCurriculumCodesByCourseId/${id}`);
  //   setDatas(response.data);
  // };

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
      const response = await api.get(`/getAllCurriculumCodesByCourseId/${id}`);
      setDatas(response.data);
      initializeDataTable(); // Reinitialize DataTable after successful data update
    } catch (error) {
      console.error("Error refreshing data:", error.message);
    }
    setLoading(false);
  };

  return (
    <div className="container-fluid  center">
      <div className="card shadow border-0 mb-2 top-header minHight">
    <div className="container my-4">
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
        <>
          {/* {storedScreens?.curriculumCreate && ( */}
            <CurriculumAdd onSuccess={refreshData} course_id={id} />
          {/* )} */}
          <table ref={tableRef} className="display">
            <thead>
              <tr>
                <th scope="col" style={{ whiteSpace: "nowrap" }}>
                  S No
                </th>
                <th scope="col">Course</th>
                <th scope="col">Lesson No.</th>
                <th scope="col">Curriculum Code</th>
                <th scope="col">Status</th>
                <th scope="col">Action</th>
              </tr>
            </thead>
            <tbody>
              {datas.map((data, index) => (
                <tr key={index}>
                  <th scope="row">{index + 1}</th>
                  <td>
                    {courseData &&
                      courseData.map((course) =>
                        parseInt(data.courseId) === course.id
                          ? course.courseNames || "--"
                          : ""
                      )}
                  </td>
                  <td>{data.lessonNo}</td>
                  <td>{data.curriculumCode}</td>
                  <td>
                    <td>
                      {data.status === "Active" ? (
                        <span className="badge badges-Green">Active</span>
                      ) : (
                        <span className="badge badges-Red">In Active</span>
                      )}
                    </td>
                  </td>
                  <td>
                    {/* {storedScreens?.curriculumUpdate && ( */}
                      <CurriculumEdit id={data.id} onSuccess={refreshData} />
                    {/* )} */}
                    {/* {storedScreens?.curriculumDelete && ( */}
                      <DeleteModel
                        onSuccess={refreshData}
                        path={`/deleteCourseCurriculumCode/${data.id}`}
                      />
                    {/* )} */}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}
    </div>
    </div>
    </div>
  );
};

export default Curriculum;
