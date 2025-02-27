import React, { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../../config/URL";
import { MaterialReactTable } from "material-react-table";
import {
  ThemeProvider,
  createTheme,
  Menu,
  MenuItem,
  IconButton,
} from "@mui/material";
import { MoreVert as MoreVertIcon } from "@mui/icons-material";
import fetchAllClassesWithIdsC from "../List/ClassListByCourse";
import fetchAllCoursesWithIdsC from "../List/CourseListByCenter";
import fetchAllTeacherListByCenter from "../List/TeacherListByCenter";
import { toast } from "react-toastify";
import GlobalDelete from "../../components/common/GlobalDelete";

const Assignment = () => {
  const centerId = localStorage.getItem("tmscenterId");
  const userId = localStorage.getItem("tmsuserId");
  const [filters, setFilters] = useState({
    centerId: centerId,
    courseId: "",
    classId: "",
    userId: "",
    day: "",
    date: "",
  });
  const [data, setData] = useState([]);
  const [courseData, setCourseData] = useState([]);
  const [classData, setClassData] = useState([]);
  const [teacherData, setTeacherData] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [menuAnchor, setMenuAnchor] = useState(null);
  const [selectedId, setSelectedId] = useState(null);
  const [isClearFilterClicked, setIsClearFilterClicked] = useState(false);
  const storedScreens = JSON.parse(localStorage.getItem("tmsscreens") || "{}");
  const storedConfigure = JSON.parse(
    localStorage.getItem("tmsappConfigInfo") || "{}"
  );
  const columns = useMemo(
    () => [
      {
        accessorFn: (row, index) => index + 1,
        header: "S.NO",
        enableSorting: true,
        enableHiding: false,
        size: 40,
        cell: ({ cell }) => (
          <span style={{ textAlign: "center" }}>{cell.getValue()}</span>
        ),
      },
      {
        accessorKey: "id",
        header: "",
        enableHiding: false,
        enableSorting: false,
        size: 20,
        Cell: ({ cell }) => (
          <IconButton
            onClick={(e) => {
              e.stopPropagation();
              setMenuAnchor(e.currentTarget);
              setSelectedId(cell.getValue());
            }}
          >
            <MoreVertIcon />
          </IconButton>
        ),
      },
      {
        accessorKey: "assignmentName",
        enableHiding: false,
        header: `${storedConfigure?.assignManagement || "Assignment"} Name`,
      },
      // { accessorKey: "folderName", enableHiding: false, header: "Folder Name" },
      { accessorKey: "userName", enableHiding: false, header: "Teacher" },
      {
        accessorKey: "folderCategory",
        enableHiding: false,
        header: "Folder Category",
      },
      {
        accessorKey: "courseName",
        header: `${storedConfigure?.course || "Course"}`,
        enableHiding: false,
        size: 40,
      },
      {
        accessorKey: "className",
        header: `${storedConfigure?.confClass || "Class"} `,
        enableHiding: false,
        size: 50,
      },
      {
        accessorKey: "date",
        enableHiding: false,
        header: "Date",
        Cell: ({ cell }) => cell.getValue()?.substring(0, 10),
      },
      {
        accessorKey: "day",
        enableHiding: false,
        header: "Days",
      },
      { accessorKey: "createdBy", header: "Created By" },
      {
        accessorKey: "createdAt",
        header: "Created At",
        Cell: ({ cell }) => cell.getValue()?.substring(0, 10),
      },
      {
        accessorKey: "updatedAt",
        header: "Updated At",
        Cell: ({ cell }) => cell.getValue()?.substring(0, 10) || "",
      },
      {
        accessorKey: "updatedBy",
        header: "Updated By",
        Cell: ({ cell }) => cell.getValue() || "",
      },
    ],
    []
  );

  const theme = createTheme({
    components: {
      MuiTableCell: {
        styleOverrides: {
          head: {
            color: "#535454 !important",
            backgroundColor: "#e6edf7 !important",
            fontWeight: "400 !important",
            fontSize: "13px !important",
            textAlign: "center !important",
          },
        },
      },
      MuiSwitch: {
        styleOverrides: {
          root: {
            "&.Mui-disabled .MuiSwitch-track": {
              backgroundColor: "#f5e1d0",
              opacity: 1,
            },
            "&.Mui-disabled .MuiSwitch-thumb": {
              color: "#eb862a",
            },
          },
          track: {
            backgroundColor: "#e0e0e0",
          },
          thumb: {
            color: "#eb862a",
          },
          switchBase: {
            "&.Mui-checked": {
              color: "#eb862a",
            },
            "&.Mui-checked + .MuiSwitch-track": {
              backgroundColor: "#eb862a",
            },
          },
        },
      },
    },
  });

  const fetchListData = async () => {
    try {
      const courseDatas = await fetchAllCoursesWithIdsC(centerId);
      const teacherDatas = await fetchAllTeacherListByCenter(centerId);
      setTeacherData(teacherDatas);
      setCourseData(courseDatas);
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleCourseChange = async (event) => {
    const courseId = event.target.value;
    setFilters((prevFilters) => ({ ...prevFilters, courseId }));
    if (!courseId) return; // Avoid making API call when courseId is empty
    try {
      const classes = await fetchAllClassesWithIdsC(courseId); // Fetch class list based on courseId
      setClassData(classes);
    } catch (error) {
      toast.error(error.message);
    }
  };

  const getAssignmentData = async () => {
    try {
      setLoading(true);

      // Filter out empty values before constructing query params
      const filteredParams = Object.fromEntries(
        Object.entries(filters).filter(([_, value]) => value !== "")
      );

      // Ensure centerId is always included
      if (!filteredParams.centerId) {
        filteredParams.centerId = centerId;
      }
      if (userId) {
        filteredParams.userId = userId;
      }

      const queryParams = new URLSearchParams(filteredParams);

      const response = await api.get(
        `/getAssignmentQuestionFilesWithCustomInfo?${queryParams.toString()}`
      );
      setData(response.data);
    } catch (error) {
      toast.error("Error Fetching Data : " + error.message);
    } finally {
      setLoading(false);
      setIsClearFilterClicked(false);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prevFilters) => ({ ...prevFilters, [name]: value }));
  };

  const clearFilter = () => {
    setFilters({
      centerId: centerId,
      courseId: "",
      classId: "",
      userId: "",
      date: "",
      day: "",
    });
    setIsClearFilterClicked(true); // Set flag to trigger data fetch without filters
  };

  useEffect(() => {
    fetchListData();
  }, []);

  useEffect(() => {
    getAssignmentData();
  }, [filters]);

  const handleMenuClose = () => setMenuAnchor(null);
  const hideColumn =
    storedScreens?.questionUpdate === false &&
    storedScreens?.questionDelete === false;
  return (
    <div className="container-fluid px-2 my-4 center">
      <ol
        className="breadcrumb my-3"
        style={{ listStyle: "none", padding: 0, margin: 0 }}
      >
        <li>
          <Link to="/" className="custom-breadcrumb">
            Home
          </Link>
          <span className="breadcrumb-separator"> &gt; </span>
        </li>
        <li>
          &nbsp;{storedConfigure?.assignManagement || "Assignment Management"}
          <span className="breadcrumb-separator"> &gt; </span>
        </li>
        <li className="breadcrumb-item active" aria-current="page">
          &nbsp;{storedConfigure?.assignManagement || "Assignment"}
        </li>
      </ol>
      <div className="card">
        <div
          className="mb-3 d-flex justify-content-between align-items-center p-1"
          style={{ background: "#f5f7f9" }}
        >
          <div class="d-flex align-items-center">
            <div class="d-flex">
              <div class="dot active"></div>
            </div>
            <span class="me-2 text-muted">
              This database shows the list of{" "}
              <span className="bold" style={{ color: "#287f71" }}>
                {storedConfigure?.assignManagement || "Assignment"}
              </span>
            </span>
          </div>
        </div>
        <div className="mb-3">
          <div className="individual_fliters d-lg-flex">
            <div className="form-group mb-0 ms-2 mb-1">
              <select
                className="form-select form-select-sm center_list"
                name="courseId"
                style={{ width: "100%" }}
                onChange={handleCourseChange}
                value={filters.courseId}
              >
                <option value="" disabled>
                  Select the {storedConfigure?.course || "Course"}
                </option>
                {courseData &&
                  courseData.map((course) => (
                    <option key={course.id} value={course.id}>
                      {course.courseNames}
                    </option>
                  ))}
              </select>
            </div>
            <div className="form-group mb-0 ms-2 mb-1">
              <select
                className="form-select form-select-sm center_list"
                name="classId"
                style={{ width: "100%" }}
                onChange={handleFilterChange}
                value={filters.classId}
              >
                <option value="" disabled>
                  Select the {storedConfigure?.confClass || "Class"}
                </option>
                {classData &&
                  classData.map((classes) => (
                    <option key={classes.id} value={classes.id}>
                      {classes.classNames}
                    </option>
                  ))}
              </select>
            </div>
            <div className="form-group mb-0 ms-2 mb-1">
              <input
                type="date"
                name="date"
                value={filters.date}
                onChange={handleFilterChange}
                className="form-control form-control-sm center_list"
                style={{ width: "160px" }}
              />
            </div>
            {!userId && (
              <div className="form-group mb-0 ms-2 mb-1">
                <select
                  className="form-select form-select-sm center_list"
                  name="userId"
                  style={{ width: "100%" }}
                  onChange={handleFilterChange}
                  value={filters.userId}
                >
                  <option value="" disabled>
                    Select the Teacher
                  </option>
                  {teacherData &&
                    teacherData.map((teacher) => (
                      <option key={teacher.id} value={teacher.id}>
                        {teacher.teacherNames}
                      </option>
                    ))}
                </select>
              </div>
            )}
          </div>
          <div className="d-flex justify-content-between">
            <div className="individual_fliters d-lg-flex mt-2">
              <div className="form-group mb-0 ms-2 mb-1">
                <select
                  className="form-select form-select-sm center_list"
                  name="day"
                  style={{ width: "100%" }}
                  onChange={handleFilterChange}
                  value={filters.day}
                >
                  <option value="" disabled>
                    Select a Day
                  </option>
                  <option value="SUNDAY">Sunday</option>
                  <option value="MONDAY">Monday</option>
                  <option value="TUESDAY">Tuesday</option>
                  <option value="WEDNESDAY">Wednesday</option>
                  <option value="THURDAY">Thursday</option>
                  <option value="FRIDAY">Friday</option>
                  <option value="SATURDAY">Saturday</option>
                </select>
              </div>
              <div className="form-group mb-0 ms-2 mb-1 ">
                <button
                  type="button"
                  className="btn btn-sm btn-border"
                  onClick={clearFilter}
                >
                  Clear
                </button>
              </div>
            </div>
            {storedScreens?.questionCreate && (
              <Link to="/assignment/add">
                <button
                  type="button"
                  className="btn btn-button btn-sm me-2"
                  style={{ fontWeight: "600px !important" }}
                >
                  &nbsp; Add &nbsp;&nbsp; <i className="bx bx-plus"></i>
                </button>
              </Link>
            )}
          </div>
        </div>
        {loading ? (
          <div className="loader-container">
            <div className="loading">
              <span></span>
              <span></span>
              <span></span>
              <span></span>
              <span></span>
            </div>
          </div>
        ) : (
          <>
            <ThemeProvider theme={theme}>
              <MaterialReactTable
                columns={columns}
                data={data}
                enableColumnActions={false}
                enableColumnFilters={false}
                enableDensityToggle={false}
                enableFullScreenToggle={false}
                initialState={{
                  pagination: { pageSize: 50, pageIndex: 0 },
                  columnVisibility: {
                    createdBy: false,
                    createdAt: false,
                    updatedBy: false,
                    updatedAt: false,
                    id: !hideColumn,
                  },
                }}
                muiTableBodyRowProps={({ row }) => ({
                  onClick: () =>
                    navigate(`/assignment/view/${row.original.id}`),
                  style: { cursor: "pointer" },
                })}
              />
            </ThemeProvider>

            <Menu
              id="action-menu"
              anchorEl={menuAnchor}
              open={Boolean(menuAnchor)}
              onClose={handleMenuClose}
            >
              {storedScreens?.questionUpdate && (
                <MenuItem
                  onClick={() => navigate(`/assignment/edit/${selectedId}`)}
                  className="text-start mb-0 menuitem-style"
                >
                  Edit
                </MenuItem>
              )}
              <MenuItem>
                {storedScreens?.questionDelete && (
                  <GlobalDelete
                    path={`/deleteAssignmentQuestionFile/${selectedId}`}
                    onDeleteSuccess={getAssignmentData}
                    onOpen={handleMenuClose}
                  />
                )}
              </MenuItem>
            </Menu>
          </>
        )}
      </div>
    </div>
  );
};

export default Assignment;
