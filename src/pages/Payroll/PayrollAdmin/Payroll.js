import React, { useEffect, useMemo, useState } from "react";
import {
  ThemeProvider,
  createTheme,
  Menu,
  MenuItem,
  IconButton,
} from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import { MoreVert as MoreVertIcon } from "@mui/icons-material";
import { MaterialReactTable } from "material-react-table";
import GlobalDelete from "../../../components/common/GlobalDelete";
import api from "../../../config/URL";
import { toast } from "react-toastify";
import fetchAllEmployeeListByCenter from "../../List/EmployeeList";

const Payroll = () => {
  const navigate = useNavigate();
  const storedScreens = JSON.parse(localStorage.getItem("tmsscreens") || "{}");
  const [datas, setDatas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [menuAnchor, setMenuAnchor] = useState(null);
  const [selectedId, setSelectedId] = useState(null);
  const centerId = localStorage.getItem("tmscenterId");
  const tmsuserId = localStorage.getItem("tmsuserId");
  const appConfigInfo = JSON.parse(localStorage.getItem("tmsappConfigInfo"));
  const [teacherData, setTeacherData] = useState([]);
  const [filters, setFilters] = useState({
    centerId: centerId,
    userId: tmsuserId || "",
    payrollMonth: "",
  });

  const columns = useMemo(() => {
    const baseColumns = [
      {
        accessorFn: (row, index) => index + 1,
        header: "S.NO",
        enableSorting: true,
        enableHiding: false,
        size: 20,
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
        accessorKey: "status",
        enableHiding: false,
        size: 20,
        header: "Status",
        Cell: ({ row }) =>
          row.original.status === "APPROVED" ? (
            <span
              className="badge text-light fw-light"
              style={{ backgroundColor: "#287f71" }}
            >
              Approved
            </span>
          ) : row.original.status === "PENDING" ? (
            <span
              className="badge text-light fw-light"
              style={{ backgroundColor: "#eb862a" }}
            >
              Pending
            </span>
          ) : row.original.status === "REJECTED" ? (
            <span
              className="badge text-light fw-light"
              style={{ backgroundColor: "#ed1a1a" }}
            >
              Rejected
            </span>
          ) : null,
      },
      // Conditionally add the Role column if tmsuserId is not present
      ...(tmsuserId
        ? []
        : [
            {
              accessorKey: "userRole",
              enableHiding: false,
              size: 20,
              header: "Role",
              Cell: ({ row }) => {
                const colors = [
                  "bg-primary",
                  "bg-success",
                  "bg-warning",
                  "bg-danger",
                  "bg-info",
                  "bg-secondary",
                ];
                const randomColor =
                  colors[Math.floor(Math.random() * colors.length)];
                return (
                  <span className={`badge ${randomColor} text-white fw-light`}>
                    {row.original.userRole}
                  </span>
                );
              },
            },
          ]),
      {
        accessorKey: "employeeName",
        enableHiding: false,
        header: `${appConfigInfo.employee}`,
      },
      {
        accessorKey: "payrollMonth",
        enableHiding: false,
        header: "Payroll Month",
      },
      { accessorKey: "netPay", enableHiding: false, header: "Net Pay" },
      { accessorKey: "bonus", header: "Bonus" },
      { accessorKey: "cpfContributions", header: "Cpf Contributions" },
      { accessorKey: "deductionAmount", header: "Deduction Amount" },
      { accessorKey: "grossPay", header: "Gross Pay" },
      { accessorKey: "payrollType", header: "Payroll Type" },
      { accessorKey: "shgContribution", header: "Shg Contribution" },
      { accessorKey: "freelanceCount", header: "Freelance Count" },
      { accessorKey: "userId", header: "User Id" },
      { accessorKey: "year", header: "Year" },
      { accessorKey: "startDate", header: "Start Date" },
      { accessorKey: "endDate", header: "End Date" },
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
    ];
  
    return baseColumns;
  }, [tmsuserId]);
  
  const getPayrollData = async () => {
    try {
      setLoading(true);
      const queryParams = new URLSearchParams();
      for (let key in filters) {
        if (filters[key]) {
          queryParams.append(key, filters[key]);
        }
      }

      const response = await api.get(
        `/getAllUserPayrollWithCenterId?${queryParams.toString()}`
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
      userId: tmsuserId ||"",
      payrollMonth: "",
    });
    getPayrollData();
  };

  const fetchUserData = async () => {
    try {
      const teacherDatas = await fetchAllEmployeeListByCenter(centerId);
      setTeacherData(teacherDatas);
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    getPayrollData();
    fetchUserData();
  }, [filters]);

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

  const handleMenuClose = () => setMenuAnchor(null);
  const hideColumn =
    storedScreens?.payrollUpdate === false &&
    storedScreens?.payrollDelete === false;

  return (
    <div className="container-fluid my-4 center">
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
          Staffing
          <span className="breadcrumb-separator"> &gt; </span>
        </li>
        <li className="breadcrumb-item active" aria-current="page">
          Payroll
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
                Payroll
              </span>
            </span>
          </div>
        </div>
        <div className="d-flex justify-content-between mb-3 px-2">
          <div className="individual_fliters d-lg-flex ">
            {!tmsuserId && (
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
                    teacherData.map((emp) => (
                      <option key={emp.id} value={emp.id}>
                        {emp.userNames}
                      </option>
                    ))}
                </select>
              </div>
            )}
            <div className="form-group mb-0 ms-2 mb-1">
              <input
                type="month"
                name="payrollMonth"
                className="form-control form-control-sm center_list"
                style={{ width: "100%" }}
                onChange={handleFilterChange}
                value={filters.payrollMonth}
              />
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
          {storedScreens?.payrollCreate && (
            <Link to="/payrolladmin/add">
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
            <ThemeProvider theme={theme}>
              <MaterialReactTable
                columns={columns}
                data={datas}
                enableColumnActions={false}
                enableColumnFilters={false}
                enableDensityToggle={false}
                enableFullScreenToggle={false}
                initialState={{
                  pagination: { pageSize: 50, pageIndex: 0 },
                  columnVisibility: {
                    bonus: false,
                    cpfContributions: false,
                    deductionAmount: false,
                    grossPay: false,
                    hourlyId: false,
                    payrollType: false,
                    sdl: false,
                    shgContribution: false,
                    freelanceCount: false,
                    userId: false,
                    year: false,
                    startDate: false,
                    endDate: false,
                    createdBy: false,
                    createdAt: false,
                    updatedBy: false,
                    updatedAt: false,
                    id: !hideColumn,
                  },
                }}
                muiTableBodyRowProps={({ row }) => ({
                  onClick: () => {
                    if (tmsuserId) {
                      navigate(`/payrolladmin/payslip/${row.original.id}`);
                    } else {
                      navigate(`/payrolladmin/view/${row.original.id}`);
                    }
                  },
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
              {storedScreens?.payrollUpdate && (
                <MenuItem
                  onClick={() => navigate(`/payrolladmin/edit/${selectedId}`)}
                  className="text-start mb-0 menuitem-style"
                >
                  Edit
                </MenuItem>
              )}
              <MenuItem>
                {storedScreens?.payrollDelete && (
                  <GlobalDelete
                    path={`/deleteUserPayroll/${selectedId}`}
                    onDeleteSuccess={getPayrollData}
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

export default Payroll;
