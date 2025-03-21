import React, { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../../config/URL";
import { toast } from "react-toastify";
import { MaterialReactTable } from "material-react-table";
import {
  ThemeProvider,
  createTheme,
  Menu,
  MenuItem,
  IconButton,
} from "@mui/material";
import { MoreVert as MoreVertIcon } from "@mui/icons-material";
import GlobalDelete from "../../components/common/GlobalDelete";
import TeacherReplacement from "./TeacherReplacement";
import fetchAllCoursesWithIdsC from "../List/CourseListByCenter";
import fetchAllTeacherListByCenter from "../List/TeacherListByCenter";

const Class = () => {
  const navigate = useNavigate();

  const [datas, setDatas] = useState([]);
  const [loading, setLoading] = useState(true);
  const centerId = localStorage.getItem("tmscenterId");
  const [courseData, setCourseData] = useState([]);
  const [teacherData, setTeacherData] = useState([]);
  const [menuAnchor, setMenuAnchor] = useState(null);
  const [selectedId, setSelectedId] = useState(null);
  const appConfigInfo = JSON.parse(localStorage.getItem("tmsappConfigInfo"));
  const storedScreens = JSON.parse(localStorage.getItem("tmsscreens") || "{}");

  const [filters, setFilters] = useState({
    centerId: centerId,
    courseId: "",
    classCode: "",
    userId: "",
    classType: "",
  });
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
        accessorKey: "className",
        header: `${appConfigInfo.confClass}`,
        enableHiding: false,
      },
      // { accessorKey: "centerName", header: "Center Name", enableHiding: false },
      {
        accessorKey: "courseName",
        header: `${appConfigInfo.course}`,
        enableHiding: false,
      },
      {
        accessorKey: "classCode",
        header: `${appConfigInfo.confClass} Code`,
        enableHiding: false,
      },

      {
        accessorKey: "classType",
        header: `${appConfigInfo.confClass} Type`,
        enableHiding: false,
      },
      {
        accessorKey: "teacherName",
        header: `${appConfigInfo.employee}`,
        enableHiding: false,
      },
      {
        accessorKey: "durationInHrs",
        header: "Duration (Hrs)",
      },
      {
        accessorKey: "durationInMins",
        header: "Duration (Mins)",
      },
      { accessorKey: "startDate", header: "Start Date" },
      { accessorKey: "startTime", header: "Start Time" },
      { accessorKey: "endDate", header: "End Date" },
      { accessorKey: "endTime", header: "End Time" },
      { accessorKey: "day", header: "Day" },
      { accessorKey: "remark", header: "Remark" },
      {
        accessorKey: "createdBy",
        header: "Created By",
        Cell: ({ cell }) => cell.getValue() || "",
      },
      {
        accessorKey: "createdAt",
        header: "Created At",
        Cell: ({ cell }) => cell.getValue()?.substring(0, 10) || "",
      },
      {
        accessorKey: "updatedBy",
        header: "Updated By",
        Cell: ({ cell }) => cell.getValue() || "",
      },
      {
        accessorKey: "updatedAt",
        header: "Updated At",
        Cell: ({ cell }) => cell.getValue()?.substring(0, 10) || "",
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
      // Switch (Toggle button) customization
      MuiSwitch: {
        styleOverrides: {
          root: {
            "&.Mui-disabled .MuiSwitch-track": {
              backgroundColor: "#f5e1d0", // Track color when disabled
              opacity: 1, // Ensures no opacity reduction
            },
            "&.Mui-disabled .MuiSwitch-thumb": {
              color: "#eb862a", // Thumb (circle) color when disabled
            },
          },
          track: {
            backgroundColor: "#e0e0e0", // Default track color
          },
          thumb: {
            color: "#eb862a", // Default thumb color
          },
          switchBase: {
            "&.Mui-checked": {
              color: "#eb862a", // Thumb color when checked
            },
            "&.Mui-checked + .MuiSwitch-track": {
              backgroundColor: "#eb862a", // Track color when checked
            },
          },
        },
      },
    },
  });

  const getClassData = async () => {
    try {
      setLoading(true);
      const queryParams = new URLSearchParams();
      for (let key in filters) {
        if (filters[key]) {
          queryParams.append(key, filters[key]);
        }
      }

      const response = await api.get(
        `/getClassWithCustomInfo?${queryParams.toString()}`
      );

      setDatas(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prevFilters) => ({ ...prevFilters, [name]: value }));
  };

  const clearFilters = () => {
    setFilters({
      centerId: centerId,
      courseId: "",
      classCode: "",
      userId: "",
      classType: "",
    });
    getClassData();
  };

  useEffect(() => {
    getClassData();
  }, [filters]);

  const fetchListData = async (centerId) => {
    try {
      const courseDatas = await fetchAllCoursesWithIdsC(centerId);
      const teacherDatas = await fetchAllTeacherListByCenter(centerId);
      setTeacherData(teacherDatas);
      setCourseData(courseDatas);
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    if (filters.centerId) {
      fetchListData(filters.centerId);
    }
  }, [filters]);

  const handleMenuClose = () => setMenuAnchor(null);
  const hideColumn =
    storedScreens?.classUpdate === false &&
    storedScreens?.classDelete === false;
  return (
    <div className="container-fluid my-4 center">
      <ol
        className="breadcrumb my-3 px-2"
        style={{ listStyle: "none", padding: 0, margin: 0 }}
      >
        <li>
          <Link to="/" className="custom-breadcrumb">
            Home
          </Link>
          <span className="breadcrumb-separator"> &gt; </span>
        </li>
        <li>
          &nbsp;{appConfigInfo.course}
          <span className="breadcrumb-separator"> &gt; </span>
        </li>
        <li className="breadcrumb-item active" aria-current="page">
          &nbsp;{appConfigInfo.confClass}
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
                {appConfigInfo.confClass}
              </span>
            </span>
          </div>
        </div>
        <div className="mb-3">
          <div className="individual_fliters d-lg-flex ">
            <div className="form-group mb-0 ms-2 mb-1">
              <select
                className="form-select form-select-sm center_list"
                style={{ width: "100%" }}
                name="courseId"
                onChange={handleFilterChange}
                value={filters.courseId}
              >
                <option value="" disabled>
                  Select a {appConfigInfo.course}
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
              <input
                type="text"
                name="classCode"
                className="form-control form-control-sm center_list"
                style={{ width: "100%" }}
                placeholder="Class Code"
                onChange={handleFilterChange}
                value={filters.classCode}
              />
            </div>
            <div className="form-group mb-0 ms-2 mb-1">
              <select
                className="form-select form-select-sm center_list"
                style={{ width: "100%" }}
                name="userId"
                onChange={handleFilterChange}
                value={filters.userId}
              >
                <option value="" disabled>
                  Select a {appConfigInfo.employee}
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
          <div className="d-flex justify-content-between">
            <div className="individual_fliters d-lg-flex mt-2">
              <div className="form-group mb-0 ms-2 mb-1">
                <select
                  className="form-select form-select-sm center_list"
                  name="classType"
                  style={{ width: "100%" }}
                  onChange={handleFilterChange}
                  value={filters.classType}
                >
                  <option value="" disabled>
                    Select {appConfigInfo.confClass} Type
                  </option>
                  <option value="Group">Group</option>
                  <option value="Individual">Individual</option>
                </select>
              </div>
              <div className="form-group mb-0 ms-2 mb-1 ">
                <button
                  type="button"
                  className="btn btn-sm btn-border"
                  onClick={clearFilters}
                >
                  Clear
                </button>
              </div>
            </div>
            <div className="me-2">
              {storedScreens?.classCreate && (
                <Link to="/class/add">
                  <button type="button" className="btn btn-button btn-sm">
                    Add <i className="bx bx-plus"></i>
                  </button>
                </Link>
              )}
            </div>
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
                data={datas}
                enableColumnActions={false}
                enableColumnFilters={false}
                enableDensityToggle={false}
                enableFullScreenToggle={false}
                initialState={{
                  columnVisibility: {
                    centerName: true,
                    courseName: true,
                    classCode: true,
                    className: true,
                    classType: true,
                    teacherName: true,
                    durationInHrs: false,
                    durationInMins: false,
                    startDate: false,
                    startTime: false,
                    endDate: false,
                    endTime: false,
                    day: false,
                    remark: false,
                    createdBy: false,
                    createdAt: false,
                    updatedBy: false,
                    updatedAt: false,
                    id: !hideColumn,
                  },
                  pagination: { pageSize: 50, pageIndex: 0 },
                }}
                muiTableBodyRowProps={({ row }) => ({
                  onClick: () => navigate(`/class/view/${row.original.id}`),
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
              <MenuItem>
                <TeacherReplacement
                  classId={selectedId}
                  onDeleteSuccess={getClassData}
                  onOpen={handleMenuClose}
                />
              </MenuItem>
              {storedScreens?.classUpdate && (
                <MenuItem
                  onClick={() => navigate(`/class/edit/${selectedId}`)}
                  className="text-start mb-0 menuitem-style"
                >
                  Edit
                </MenuItem>
              )}
              <MenuItem>
                {storedScreens?.classDelete && (
                  <GlobalDelete
                    path={`/deleteCourseClassListing/${selectedId}`}
                    onDeleteSuccess={getClassData}
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

export default Class;
