import React, { useEffect, useState } from "react";
import api from "../config/URL";
import { toast } from "react-toastify";
import fetchAllCentersWithIds from "./List/CenterList";
import fetchAllCoursesWithIdsC from "./List/CourseListByCenter";
import fetchAllTeacherListByCenter from "./List/TeacherListByCenter";
import { FaDownload } from "react-icons/fa6";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

function TimeTable() {
  const [data, setData] = useState([]);
  const [day, setDay] = useState(null);
  const [centerData, setCenterData] = useState([]);
  const [courseData, setCourseData] = useState([]);
  const [teacherData, setTeacherData] = useState([]);
  const [loading, setLoading] = useState(false);

  console.log("DATA ::", data);

  const [filters, setFilters] = useState({
    centerId: localStorage.getItem("selectedCenterId") || "",
    courseId: "",
    teacherId: "",
    date: new Date().toISOString().split("T")[0], // Default to today's date
  });

  const fetchData = async () => {
    try {
      // Fetch center data
      const centers = await fetchAllCentersWithIds();
      setCenterData(centers);

      // Set default center ID if not available
      if (!filters.centerId && centers.length > 0) {
        setFilters((prev) => ({ ...prev, centerId: centers[0].id }));
      }

      // Fetch course and teacher data for default center
      if (filters.centerId) {
        fetchCourseAndTeacherData(filters.centerId);
      }
    } catch (error) {
      toast.error("Error fetching center data");
      console.error(error);
    }
  };

  const fetchCourseAndTeacherData = async (centerId) => {
    try {
      const courses = await fetchAllCoursesWithIdsC(centerId);
      const teachers = await fetchAllTeacherListByCenter(centerId);
      setCourseData(courses);
      setTeacherData(teachers);
    } catch (error) {
      toast.error("Error fetching course or teacher data");
      console.error(error);
    }
  };

  const fetchScheduleData = async () => {
    try {
      setLoading(true);

      // Construct query params
      const queryParams = new URLSearchParams(
        Object.entries(filters).filter(([_, value]) => value)
      );

      const response = await api.get(`/getScheduleOverView?${queryParams}`);
      setData(response.data.data.scheduleData);
      setDay(response.data.data.day);
    } catch (error) {
      toast.error("Error fetching schedule data");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));

    // If the center changes, fetch new course and teacher data
    if (name === "centerId") {
      fetchCourseAndTeacherData(value);
    }
  };

  const convertTo12HourFormat = (time) => {
    const [hours, minutes] = time.split(":");
    const period = hours >= 12 ? "PM" : "AM";
    const hour12 = hours % 12 || 12;
    return `${hour12}:${minutes} ${period}`;
  };

  const handleGeneratePDF = async () => {
    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "px",
      format: "a3",
    });
    try {
      const canvas = await html2canvas(document.querySelector(".card-body"), {
        scale: 2,
      });
      const imgData = canvas.toDataURL();
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

      pdf.addImage(imgData, "PNG", 10, 10, pdfWidth - 20, pdfHeight);
      pdf.save("Class Time Table.pdf");
    } catch (error) {
      toast.error("Failed to generate PDF.");
      console.error(error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (filters.centerId) {
      fetchScheduleData();
    }
  }, [filters]);

  return (
    <div className="container-fluid my-4">
      <div className="card shadow-sm">
        <div className="card-header bg-light d-flex align-items-center">
          <div className="dot bg-success rounded-circle me-2"></div>
          <span className="fw-bold text-muted">TimeTable</span>
        </div>
        {/* <div className="d-flex justify-content-between align-items-center py-3 px-2 wrap-md">
          <div className="form-group mb-0 ms-2 mb-1">
            <select
              className="form-select form-select-sm center_list"
              name="centerId"
              style={{ width: "100%" }}
              onChange={handleFilterChange}
              value={filters.centerId}
            >
              <option value="" disabled selected>
                Select a Centre
              </option>
              {centerData?.map((center) => (
                <option key={center.id} value={center.id} selected>
                  {center.centerNames}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group mb-0 ms-2 mb-1">
            <input
              type="date"
              className="form-control form-control-sm center_list"
              style={{ width: "140px" }}
              name="date"
              value={filters.date}
              onChange={handleFilterChange}
              placeholder="Date"
            />
          </div>

          <div className="form-group mb-0 ms-2 mb-1">
            <select
              className="form-select form-select-sm center_list"
              style={{ width: "100%" }}
              name="courseId"
              onChange={handleFilterChange}
              value={filters.courseId}
            >
              <option value="" disabled selected>
                Select a Course
              </option>
              {courseData &&
                courseData.map((courseId) => (
                  <option key={courseId.id} value={courseId.id}>
                    {courseId.courseNames}
                  </option>
                ))}
            </select>
          </div>

          <div className="form-group mb-0 ms-2 mb-1">
            <select
              className="form-select form-select-sm center_list"
              name="teacherId"
              style={{ width: "100%" }}
              value={filters.teacherId}
              onChange={handleFilterChange}
            >
              <option value="" disabled selected>
                Select a Teacher
              </option>
              {teacherData &&
                teacherData.map((teacher) => (
                  <option key={teacher.id} value={teacher.id}>
                    {teacher.teacherNames}
                  </option>
                ))}
            </select>
          </div>

          {data && Object.keys(data).length > 0 ? (
            <button
              className="btn mx-2 btn-sm m-2 text-white"
              onClick={handleGeneratePDF}
              style={{background:"#eb862a"}}
            >
              <FaDownload />
            </button>
          ) : null}
        </div> */}
        <div className="container">
          <div className="row py-3 px-2">
            <div className="col-md-6 col-lg-3 mb-2">
              <div className="form-group">
                <select
                  className="form-select form-select-sm"
                  name="centerId"
                  style={{ width: "100%" }}
                  onChange={handleFilterChange}
                  value={filters.centerId}
                >
                  <option value="" disabled>
                    Select a Centre
                  </option>
                  {centerData?.map((center) => (
                    <option key={center.id} value={center.id}>
                      {center.centerNames}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="col-md-6 col-lg-2 mb-2">
              <div className="form-group">
                <input
                  type="date"
                  className="form-control form-control-sm"
                  style={{ width: "100%" }}
                  name="date"
                  value={filters.date}
                  onChange={handleFilterChange}
                  placeholder="Date"
                />
              </div>
            </div>

            <div className="col-md-6 col-lg-3 mb-2">
              <div className="form-group">
                <select
                  className="form-select form-select-sm"
                  style={{ width: "100%" }}
                  name="courseId"
                  onChange={handleFilterChange}
                  value={filters.courseId}
                >
                  <option value="" disabled>
                    Select a Course
                  </option>
                  {courseData &&
                    courseData.map((courseId) => (
                      <option key={courseId.id} value={courseId.id}>
                        {courseId.courseNames}
                      </option>
                    ))}
                </select>
              </div>
            </div>

            <div className="col-md-6 col-lg-3 mb-2">
              <div className="form-group">
                <select
                  className="form-select form-select-sm"
                  name="teacherId"
                  style={{ width: "100%" }}
                  value={filters.teacherId}
                  onChange={handleFilterChange}
                >
                  <option value="" disabled>
                    Select a Teacher
                  </option>
                  {teacherData &&
                    teacherData.map((teacher) => (
                      <option key={teacher.id} value={teacher.id}>
                        {teacher.teacherNames}
                      </option>
                    ))}
                </select>
              </div>
            </div>

            {data && Object.keys(data).length > 0 ? (
              <div className="col-md-6 col-lg-1 mb-2 text-center">
                <button
                  className="btn btn-sm text-white"
                  onClick={handleGeneratePDF}
                  style={{ background: "#eb862a" }}
                >
                  <FaDownload />
                </button>
              </div>
            ) : null}
          </div>
        </div>

        <div className="card-body">
          <h5
            className="text-center text-white p-2"
            style={{ background: "#287f71" }}
          >
            {day || "No Available Days"}
          </h5>

          {Array.isArray(data) && data.length > 0 ? (
            data.map((classData, classIndex) => (
              <div className="table-responsive my-3" key={classIndex}>
                <table className="table table-bordered table-striped">
                  <thead>
                    <tr>
                      <th className="text-center fw-medium">Class</th>
                      <th className="text-center fw-medium">Teacher</th>
                      <th
                        colSpan={classData.maxClassSizeofDay}
                        className="text-center fw-medium"
                      >
                        {classData.teacherName}
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {classData.batches.map((batch, batchIndex) => (
                      <tr key={batchIndex}>
                        <td className="text-center fw-medium">
                          {batch.className}
                        </td>
                        <td className="text-center fw-medium">
                          {convertTo12HourFormat(batch.startTime)} -{" "}
                          {convertTo12HourFormat(batch.endTime)}
                        </td>
                        {Array.from({
                          length: classData.maxClassSizeofDay,
                        }).map((_, studentIndex) => {
                          const studentName =
                            batch.students[studentIndex]?.studentName || "";
                          return (
                            <td
                              key={studentIndex}
                              className={`text-center ${
                                studentIndex + 1 > batch.batchMaxSize
                                  ? "table_cell_color"
                                  : ""
                              }`}
                              // style={{
                              //   backgroundColor: 1 > 2 ? "#eb862a !important" : "inherit !important",
                              // }}
                            >
                              {studentName || ""}
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ))
          ) : (
            <p className="text-center text-danger">
              No data available for the selected filters.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export default TimeTable;
