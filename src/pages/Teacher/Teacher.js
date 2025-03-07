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
import GlobalDelete from "../../components/common/GlobalDelete";

const Teacher = () => {
  const [filters, setFilters] = useState({
    teacherName: "",
    country: "",
    teacherType: "",
    status: "",
  });
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const roles = localStorage.getItem("tmsuserName");
  const centerId = localStorage.getItem("tmscenterId");
  const appConfigInfo = JSON.parse(localStorage.getItem("tmsappConfigInfo"));
  const storedScreens = JSON.parse(localStorage.getItem("tmsscreens") || "{}");

  const [menuAnchor, setMenuAnchor] = useState(null);
  const [selectedId, setSelectedId] = useState(null);

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
        accessorKey: "role",
        enableHiding: false,
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
          const randomColor = colors[Math.floor(Math.random() * colors.length)];
          return (
            <span className={`badge ${randomColor} text-white fw-light`}>
              {row.original.role}
            </span>
          );
        },
      },
      {
        accessorKey: "userUniqueId",
        enableHiding: false,
        header: `ID`,
      },
      {
        accessorKey: "teacherName",
        header: `Name`,
        enableHiding: false,
        size: 40,
      },
      { accessorKey: "countryName", enableHiding: false, header: "Country" },
      {
        accessorKey: "teacherType",
        header: `${appConfigInfo.employee} Type`,
        enableHiding: false,
        size: 50,
      },
      { accessorKey: "email", enableHiding: false, header: "Email" },
      { accessorKey: "contactNumber", enableHiding: false, header: "Mobile" },

      {
        accessorKey: "createdAt",
        enableHiding: false,
        header: "Created At",
        Cell: ({ cell }) => cell.getValue()?.substring(0, 10),
      },
      {
        accessorKey: "updatedAt",
        enableHiding: false,
        header: "Updated At",
        Cell: ({ cell }) => cell.getValue()?.substring(0, 10) || "",
      },
      {
        accessorKey: "updatedBy",
        header: "Updated By",
        Cell: ({ cell }) => cell.getValue() || "",
      },
      { accessorKey: "createdBy", header: "Created By" },
    ],
    []
  );
  const fetchData = async () => {
    try {
      setLoading(true);
      const filteredFilters = Object.fromEntries(
        Object.entries(filters).filter(
          ([key, value]) =>
            value !== "" && value !== null && value !== undefined
        )
      );
      const queryParams = new URLSearchParams(filteredFilters).toString();
      const response = await api.get(
        `/getUserWithCustomInfo?centerId=${centerId}${
          queryParams ? `&${queryParams}` : ""
        }`
      );
      setData(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchData();
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
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prevFilters) => ({
      ...prevFilters,
      [name]: value,
    }));
  };

  const clearFilter = () => {
    setFilters({
      teacherName: "",
      country: "",
      teacherType: "",
      status: "",
    });
  };

  const handleMenuClose = () => setMenuAnchor(null);
  const hideColumn =
    storedScreens?.teacherUpdate === false &&
    storedScreens?.teacherDelete === false;
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
        <li className="breadcrumb-item active" aria-current="page">
          &nbsp;{appConfigInfo.employee}
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
                {appConfigInfo.employee}
              </span>
            </span>
          </div>
        </div>
        <div className="mb-3 d-flex justify-content-between">
          <div className="individual_fliters d-lg-flex">
            <div className="form-group mb-0 ms-2 mb-1">
              <input
                type="text"
                name="teacherName"
                className="form-control form-control-sm center_list"
                style={{ width: "160px" }}
                placeholder={`Name`}
                value={filters.teacherName}
                onChange={handleFilterChange}
              />
            </div>
            <div className="form-group mb-0 ms-2 mb-1">
              <input
                type="text"
                name="country"
                className="form-control form-control-sm center_list"
                style={{ width: "160px" }}
                placeholder="Country"
                value={filters.country}
                onChange={handleFilterChange}
              />
            </div>
            <div className="form-group mb-0 ms-2 mb-1">
              <select
                type="text"
                className="form-select form-select-sm center_list"
                style={{ width: "160px" }}
                name="teacherType"
                value={filters.teacherType}
                onChange={handleFilterChange}
              >
                <option value="" disabled>
                  {`Select ${appConfigInfo.employee} Type`}
                </option>
                <option value="Permanent">Permanent</option>
                <option value="Temporary">Temporary</option>
                <option value="Intern">Intern</option>
              </select>
            </div>
            <div className="form-group mb-0 ms-2 mb-1">
              <select
                type="text"
                className="form-select form-select-sm center_list"
                style={{ width: "160px" }}
                name="status"
                value={filters.status}
                onChange={handleFilterChange}
              >
                <option value="" disabled>
                  Select a status
                </option>
                <option value={"ACTIVE"}>Active</option>
                <option value={"RESIGNED"}>Resigned</option>
              </select>
            </div>

            <div className="form-group mb-0 ms-2 mb-1">
              <button
                type="button"
                className="btn btn-sm btn-border"
                onClick={clearFilter}
              >
                Clear
              </button>
            </div>
          </div>
          {storedScreens?.teacherCreate && (
            <Link to="/teacher/add">
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
          <div>
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
                    updatedBy: false,
                    invoiceNotes: false,
                    openingDate: false,
                    taxRegistrationNumber: false,
                    zipCode: false,
                    id: !hideColumn,
                  },
                }}
                muiTableBodyRowProps={({ row }) => ({
                  onClick: () => navigate(`/teacher/view/${row.original.id}`),
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
              {storedScreens?.teacherUpdate && (
                <MenuItem
                  onClick={() => navigate(`/teacher/edit/${selectedId}`)}
                  className="text-start mb-0 menuitem-style"
                >
                  Edit
                </MenuItem>
              )}
              <MenuItem>
                {storedScreens?.teacherDelete && (
                  <GlobalDelete
                    path={`/deleteUser/${selectedId}`}
                    onDeleteSuccess={fetchData}
                    onOpen={handleMenuClose}
                  />
                )}
              </MenuItem>
            </Menu>
          </div>
        )}
      </div>
    </div>
  );
};

export default Teacher;
