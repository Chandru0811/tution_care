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
import { toast } from "react-toastify";
import GlobalDelete from "../../components/common/GlobalDelete";
import fetchAllTeacherListByCenter from "../List/TeacherListByCenter";

const AssignmentResult = () => {
  const centerId = localStorage.getItem("tmscenterId");
  const storedScreens = JSON.parse(localStorage.getItem("tmsscreens") || "{}");
  const userId = localStorage.getItem("tmsuserId");
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [menuAnchor, setMenuAnchor] = useState(null);
  const [selectedId, setSelectedId] = useState(null);
  const [teacherData, setTeacherData] = useState([]);
  const [filters, setFilters] = useState({
    centerId: centerId,
    userId: "",
  });
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
      {
        accessorKey: "userName",
        enableHiding: false,
        header: `${storedConfigure?.employee || "Employee"}`,
      },
      {
        accessorKey: "studentName",
        enableHiding: false,
        header: `${storedConfigure?.student || "Student"} Name`,
      },
      {
        accessorKey: "courseName",
        header: `${storedConfigure?.course || "Course"}Course`,
        enableHiding: false,
        size: 40,
      },
      {
        accessorKey: "className",
        header: `${storedConfigure?.confClass || "Class"}`,
        enableHiding: false,
        size: 50,
      },
      // { accessorKey: "batchTime", enableHiding: false, header: "Batch" },
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
      {
        accessorKey: "folderCategory",
        enableHiding: false,
        header: "Folder Category",
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
      const teacherDatas = await fetchAllTeacherListByCenter(centerId);
      setTeacherData(teacherDatas);
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
        `/getAllQuestionsWithAnswersByUserId?${queryParams.toString()}`
      );
      setData(response.data);
    } catch (error) {
      toast.error("Error Fetching Data : " + error.message);
    } finally {
      setLoading(false);
      // setIsClearFilterClicked(false);
    }
  };
  useEffect(() => {
    fetchListData();
  }, []);

  useEffect(() => {
    getAssignmentData();
  }, [filters]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prevFilters) => ({ ...prevFilters, [name]: value }));
  };

  const clearFilter = () => {
    setFilters({
      centerId: centerId,
      userId: "",
    });
    // setIsClearFilterClicked(true); // Set flag to trigger data fetch without filters
  };

  const handleMenuClose = () => setMenuAnchor(null);

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
          &nbsp;{storedConfigure?.assignManagement || "Assignment"} Management
          <span className="breadcrumb-separator"> &gt; </span>
        </li>
        <li className="breadcrumb-item active" aria-current="page">
          &nbsp;{storedConfigure?.assignManagement || "Assignment"} Results
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
                {storedConfigure?.assignManagement || "Assignment"} Results
              </span>
            </span>
          </div>
        </div>
        <div className="individual_fliters d-lg-flex">
          {!userId && (
            <div className="form-group mb-0 ms-2 mb-1">
              <select
                className="form-select form-select-sm center_list"
                name="userId"
                style={{ width: "100%" }}
                onChange={handleFilterChange}
                value={filters.userId}
              >
                <option>
                  Select the {storedConfigure?.employee || "Employee"}
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
                    gst: false,
                    address: false,
                    bankAccountName: false,
                    bankAccountNumber: false,
                    bankBranch: false,
                    bankName: false,
                    createdBy: false,
                    createdAt: false,
                    updatedBy: false,
                    updatedAt: false,
                    invoiceNotes: false,
                    openingDate: false,
                    taxRegistrationNumber: false,
                    zipCode: false,
                  },
                }}
                muiTableBodyRowProps={({ row }) => ({
                  onClick: () =>
                    navigate(
                      `/assignmentResult/view/${row.original.questionId}?studentId=${row.original.studentId}`
                    ),
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
                {storedScreens?.answerDelete && (
                  <GlobalDelete
                    path={`/deleteAssignmentFolder/${selectedId}`}
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

export default AssignmentResult;
