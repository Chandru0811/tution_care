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

const Invoice = () => {
  const centerId = localStorage.getItem("tmscenterId");
  const [filters, setFilters] = useState({
    centerId: centerId,
    courseId: "",
    studentId: "",
    packageId: "",
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
        accessorKey: "invoiceStatus",
        enableHiding: false,
        header: "Status",
        Cell: ({ row }) => {
          const statusOptions = [
            { label: "Paid", value: "PAID", bgColor: "#28a745" },
            { label: "Pending", value: "PENDING", bgColor: "#ffc107" },
            { label: "Cancelled", value: "CANCELLED", bgColor: "#dc3545" },
          ];
      
          const selectedStatus = row.original.invoiceStatus || "PENDING";
      
          const handleStatusChange = async (event) => {
            const newStatus = event.target.value;
      
            try {
              const response = await api.put(`/updateInvoiceStatus/${row.original.id}`, {
                invoiceStatus: newStatus,
              });
      
              if (response.status === 200) {
                toast.success("Status updated successfully");
                getInvoiceData(); // Refresh table data
              }
            } catch (error) {
              toast.error("Failed to update status");
            }
          };
      
          const selectedOption = statusOptions.find((opt) => opt.value === selectedStatus);
      
          return (
            <select
              className="form-control w-50 badge"
              value={selectedStatus}
              onChange={handleStatusChange}
              onClick={(e) => e.stopPropagation()}
              style={{
                height: "20px",
                textAlign: "center",
                borderRadius: "5px",
                backgroundColor: selectedOption?.bgColor,
                cursor: "pointer",
              }}
            >
              {statusOptions
                .map((status) => (
                  <option
                    key={status.value}
                    value={status.value}
                    style={{ backgroundColor: "white", color: "black", fontSize: "10px" }}
                  >
                    {status.label}
                  </option>
                ))}
            </select>
          );
        },
      },      
      {
        accessorKey: "invoiceNumber",
        header: "Invoice Number",
        enableHiding: false,
        size: 50,
      },
      {
        accessorKey: "course",
        enableHiding: false,
        header: "Course",
      },
      {
        accessorKey: "studentUniqId",
        enableHiding: false,
        header: "Student ID",
      },
      { accessorKey: "student", header: "Student" },
      { accessorKey: "parent", enableHiding: false, header: "Parent Name" },
      { accessorKey: "package", header: "Package" },

      {
        accessorKey: "invoiceDate",
        header: "Invoice Date",
        Cell: ({ cell }) => {
          const invoiceDate = cell.getValue();
          if (!invoiceDate) return "--";
          const date = new Date(invoiceDate).toLocaleDateString("en-GB");
          return date;
        },
      },

      { accessorKey: "noOfLessons", header: "Number Of Lesson" },
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
      // Dynamically construct query parameters based on filters
      const queryParams = new URLSearchParams();
      if (!isClearFilterClicked) {
        if (filters.centerId) {
          queryParams.append("centerId", filters.centerId);
        } else if (centerId && centerId !== "undefined") {
          queryParams.append("centerId", centerId);
        }
      }

      // Loop through other filters and add key-value pairs if they have a value
      for (let key in filters) {
        if (filters[key] && key !== "centerId") {
          queryParams.append(key, filters[key]);
        }
      }

      const response = await api.get(
        // `/getInvoiceWithCustomInfo?${queryParams.toString()}`
        `/getGenerateInvoiceByCenterId/${centerId}`
      );
      setData(response.data);
    } catch (error) {
      toast.error("Error Fetching Data : ", error);
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
      courseId: "",
      studentId: "",
      packageId: "",
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
          &nbsp;Invoice and Payment
          <span className="breadcrumb-separator"> &gt; </span>
        </li>
        <li className="breadcrumb-item active" aria-current="page">
          &nbsp;Invoice
        </li>
      </ol>
      <div className="card">
        <div
          className="mb-3 d-flex justify-content-between align-items-center p-1"
          style={{ background: "#f5f7f9" }}
        >
          <span className="text-muted">
            This database shows the list of{" "}
            <strong style={{ color: "#287f71" }}>Invoice</strong>
          </span>
        </div>
        <div className="mb-3 d-flex justify-content-between">
          <div className="individual_fliters d-lg-flex ">
            <div className="form-group mb-0 ms-2 mb-1">
              <select
                className="form-select form-select-sm center_list"
                style={{ width: "100%" }}
                name="courseId"
                onChange={handleFilterChange}
                value={filters.courseId}
              >
                <option selected>Select a Course</option>
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
                style={{ width: "100%" }}
                name="studentId"
                onChange={handleFilterChange}
                value={filters.studentId}
              >
                <option selected>Select a Student</option>
                {studentData &&
                  studentData.map((student) => (
                    <option key={student.id} value={student.id}>
                      {student.studentNames}
                    </option>
                  ))}
              </select>
            </div>
            <div className="form-group mb-0 ms-2 mb-1">
              <select
                className="form-select form-select-sm center_list"
                style={{ width: "100%" }}
                name="packageId"
                onChange={handleFilterChange}
                value={filters.packageId}
              >
                <option selected>Select a Package</option>
                {packageData &&
                  packageData.map((packages) => (
                    <option key={packages.id} value={packages.id}>
                      {packages.packageNames}
                    </option>
                  ))}
              </select>
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
          <Link to="/invoice/add">
            <button
              type="button"
              className="btn btn-button btn-sm me-2"
              style={{ fontWeight: "600px !important" }}
            >
              &nbsp; Add &nbsp;&nbsp; <i className="bx bx-plus"></i>
            </button>
          </Link>
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
                  columnVisibility: {
                    gst: false,
                    address: false,

                    createdBy: false,
                    createdAt: false,
                    updatedBy: false,
                    updatedAt: false,
                  },
                }}
                muiTableBodyRowProps={({ row }) => ({
                  onClick: () => navigate(`/invoice/view/${row.original.id}`),
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
              {data.find((invoice) => invoice.id === selectedId)
                ?.invoiceStatus !== "PAID" && (
                <MenuItem
                  onClick={() => navigate(`/invoice/edit/${selectedId}`)}
                  className="text-start mb-0 menuitem-style"
                >
                  Edit
                </MenuItem>
              )}
              <MenuItem>
                <GlobalDelete
                  path={`/deleteGenerateInvoice/${selectedId}`}
                  onDeleteSuccess={getInvoiceData}
                  onOpen={handleMenuClose}
                />
              </MenuItem>
            </Menu>
          </>
        )}
      </div>
    </div>
  );
};

export default Invoice;
