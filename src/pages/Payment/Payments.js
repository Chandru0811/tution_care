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
import fetchAllCoursesWithIdsC from "../List/CourseListByCenter";
import fetchAllStudentListByCenter from "../List/StudentListByCenter";
import fetchAllPackageListByCenter from "../List/PackageListByCenter";

const Payments = () => {
  const centerId = localStorage.getItem("tmscenterId");
  const storedScreens = JSON.parse(localStorage.getItem("tmsscreens") || "{}");
  const [filters, setFilters] = useState({
    centerId: centerId,
    paymentDate: "",
    studentId: "",
    paidAmount: "",
  });
  const [packageData, setPackageData] = useState(null);
  const [studentData, setStudentData] = useState(null);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [menuAnchor, setMenuAnchor] = useState(null);
  const [selectedId, setSelectedId] = useState(null);
  const [isClearFilterClicked, setIsClearFilterClicked] = useState(false);
  const [courseData, setCourseData] = useState(null);
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
      // {
      //   accessorKey: "status",
      //   enableHiding: false,
      //   header: "Status",
      //   Cell: ({ row }) =>
      //     row.original.status === "APPROVED" ? (
      //       <span className="badge badges-Green fw-light">Approved</span>
      //     ) : row.original.status === "REJECTED" ? (
      //       <span className="badge badges-danger fw-light">Rejected</span>
      //     ) : (
      //       <span className="badge badges-orange fw-light">Pending</span>
      //     ),
      // },
      {
        accessorKey: "studentName",
        enableHiding: false,
        header: `${storedConfigure?.student || "Student"} Name`,
      },
      {
        accessorKey: "paymentDate",
        enableHiding: false,
        header: "Payment Date",
      },
      { accessorKey: "paymentMethod", header: "Payment Method" },
      { accessorKey: "paidAmount", enableHiding: false, header: "Paid Amount" },

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

  const getInvoiceData = async () => {
    try {
      setLoading(true);
      const queryParams = new URLSearchParams();
      for (let key in filters) {
        if (filters[key]) {
          queryParams.append(key, filters[key]);
        }
      }

      const response = await api.get(
        `/paymentByCenterId?${queryParams.toString()}`
        // `/paymentByCenterId?centerId=${centerId}`
      );
      setData(response.data);
    } catch (error) {
      toast.error(error);
    } finally {
      setLoading(false);
      setIsClearFilterClicked(false);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prevFilters) => ({ ...prevFilters, [name]: value }));
  };

  const clearFilters = () => {
    setFilters({
      centerId: centerId,
      paymentDate: "",
      studentId: "",
      paidAmount: "",
    });
    getInvoiceData();
    setIsClearFilterClicked(true);
  };

  const fetchListData = async (centerId) => {
    try {
      const courseDatas = await fetchAllCoursesWithIdsC(centerId);
      const student = await fetchAllStudentListByCenter(centerId);
      const packageData = await fetchAllPackageListByCenter(centerId);
      setPackageData(packageData);
      setStudentData(student);
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

  useEffect(() => {
    getInvoiceData();
  }, [filters]);

  const handleMenuClose = () => {
    setMenuAnchor(null);
    console.log("null");
  };
  const hideColumn =
    storedScreens?.paymentUpdate === false &&
    storedScreens?.paymentDelete === false;
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
          &nbsp; {storedConfigure?.invoice || "Invoice and Payment"}
          <span className="breadcrumb-separator"> &gt; </span>
        </li>
        <li className="breadcrumb-item active" aria-current="page">
          &nbsp;Payment
        </li>
      </ol>
      <div className="card">
        <div
          className="mb-3 d-flex justify-content-between align-items-center p-1"
          style={{ background: "#f5f7f9" }}
        >
          <span className="text-muted">
            This database shows the list of{" "}
            <strong style={{ color: "#287f71" }}>Payment</strong>
          </span>
        </div>
        <div className="mb-3 d-flex justify-content-between">
          <div className="individual_fliters d-lg-flex ">
            <div className="form-group mb-0 ms-2 mb-1">
              <select
                className="form-select form-select-sm center_list"
                style={{ width: "100%" }}
                name="studentId"
                onChange={handleFilterChange}
                value={filters.studentId}
              >
                <option selected>
                  Select a {storedConfigure?.student || "Student"}
                </option>
                {studentData &&
                  studentData.map((student) => (
                    <option key={student.id} value={student.id}>
                      {student.studentNames}
                    </option>
                  ))}
              </select>
            </div>
            <div className="form-group mb-0 ms-2 mb-1">
              <input
                className="form-control form-control-sm center_list"
                type="date"
                style={{ width: "100%" }}
                name="paymentDate"
                onChange={handleFilterChange}
                value={filters.paymentDate}
              />
            </div>
            <div className="form-group mb-0 ms-2 mb-1">
              <input
                className="form-control form-control-sm center_list"
                type="text"
                style={{ width: "100%" }}
                name="paidAmount"
                onChange={handleFilterChange}
                value={filters.paidAmount}
                onInput={(e) => {
                  e.target.value = e.target.value.replace(/[^0-9]/g, "");
                }}
                placeholder="Paid Amount"
              />
            </div>
            <div className="form-group mb-2 ms-2">
              <button
                type="button"
                className="btn btn-sm btn-border"
                onClick={clearFilters}
              >
                Clear
              </button>
            </div>
          </div>
          {storedScreens?.paymentCreate && (
            <Link to="/payments/add">
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
                  onClick: () => navigate(`/payments/view/${row.original.id}`),
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
              {storedScreens?.paymentUpdate && (
                <MenuItem
                  onClick={() => navigate(`/payments/edit/${selectedId}`)}
                  className="text-start mb-0 menuitem-style"
                >
                  Edit
                </MenuItem>
              )}
              <MenuItem>
                {storedScreens?.paymentDelete && (
                  <GlobalDelete
                    path={`/deletePayment/${selectedId}`}
                    onDeleteSuccess={getInvoiceData}
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

export default Payments;
