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

const SuperAdminCenter = ({ handleCenterChanged }) => {
  const [filters, setFilters] = useState({
    centerName: "",
    name: "",
    email: "",
    mobileNo: "",
  });
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [menuAnchor, setMenuAnchor] = useState(null);
  const [selectedId, setSelectedId] = useState(null);

  const fetchData = async () => {
    try {
      setLoading(true);
  
      let url = "/getAllCenterSimplify";
      const queryParams = new URLSearchParams();
  
      for (let key in filters) {
        if (filters[key]) {
          queryParams.append(key, filters[key]);
        }
      }
  
      if (queryParams.toString()) {
        url += `?${queryParams.toString()}`;
      }
  
      const response = await api.get(url);
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
        accessorKey: "centerStatus",
        enableHiding: false,
        header: "Centre Status",
        Cell: ({ row }) => {
          const statusOptions = [
            {
              label: "Approve",
              value: "Approve",
              bgColor: "#28a745",
            },
            {
              label: "Trial",
              value: "Trial",
              bgColor: "#ffc107",
            },
            {
              label: "Reject",
              value: "Rejected",
              bgColor: "#dc3545",
            },
            {
              label: "Pending", 
              value: "Pending",
              bgColor: "#6c757d",
            },
          ];

          const [selectedStatus, setSelectedStatus] = useState(
            row.original.centerStatus || "Pending"
          );

          useEffect(() => {
            setSelectedStatus(row.original.centerStatus);
          }, [row.original.centerStatus]);

          const handleStatusChange = async (event) => {
            const newStatus = event.target.value;
            setLoading(true);
            try {
              // First API call: Update status
              const response = await api.put(
                `/statusApproval/${
                  row.original.id
                }?newStatus=${encodeURIComponent(newStatus)}`
              );

              if (response.status === 200) {
                toast.success("Status updated successfully");
                setSelectedStatus(newStatus);
                fetchData();
              }
            } catch (error) {
              toast.error("Failed to update status");
            } finally {
              setLoading(false);
            }
          };

          const selectedOption = statusOptions.find(
            (opt) => opt.value === selectedStatus
          );

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
                .filter(
                  (status) =>
                    selectedStatus === "Pending" || status.value !== "Pending"
                )
                .map((status) => (
                  <option
                    key={status.value}
                    value={status.value}
                    style={{
                      backgroundColor: "white",
                      color: "black",
                      fontSize: "15px",
                    }}
                  >
                    {status.label}
                  </option>
                ))}
            </select>
            
          );
        },
      },

      {
        accessorKey: "centerName",
        enableHiding: false,
        header: "Centre Name",
      },
      { accessorKey: "email", enableHiding: false, header: "Email" },
      { accessorKey: "mobile", enableHiding: false, header: "Mobile" },
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

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prevFilters) => ({ ...prevFilters, [name]: value }));
  };

  const clearFilter = () => {
    setFilters({
      centerName: "",
      name: "",
      email: "",
      mobileNo: "",
    });
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
          &nbsp;Centre Management
          <span className="breadcrumb-separator"> &gt; </span>
        </li>
        <li className="breadcrumb-item active" aria-current="page">
          &nbsp;Centre Listing
        </li>
      </ol>
      <div className="card">
        <div
          className="mb-3 d-flex justify-content-between align-items-center p-1"
          style={{ background: "#f5f7f9" }}
        >
          <span className="text-muted">
            This database shows the list of{" "}
            <strong style={{ color: "#287f71" }}>Centre</strong>
          </span>
        </div>
        <div className="mb-3 d-flex justify-content-between">
          <div className="individual_fliters d-lg-flex ">
            <div className="form-group mb-0 ms-2 mb-1">
              <input
                type="text"
                name="centerName"
                value={filters.centerName}
                onChange={handleFilterChange}
                className="form-control form-control-sm center_list"
                style={{ width: "180px" }}
                placeholder="Center Name"
                autoComplete="off"
              />
            </div>
            <div className="form-group mb-0 ms-2 mb-1">
              <input
                type="text"
                name="name"
                value={filters.name}
                onChange={handleFilterChange}
                className="form-control form-control-sm center_list"
                style={{ width: "190px" }}
                placeholder="Name"
                autoComplete="off"
              />
            </div>
            <div className="form-group mb-0 ms-2 mb-1">
              <input
                type="text"
                name="email"
                value={filters.email}
                onChange={handleFilterChange}
                className="form-control form-control-sm center_list"
                style={{ width: "160px" }}
                placeholder="Email"
                autoComplete="off"
              />
            </div>
            <div className="form-group mb-0 ms-2 mb-1">
              <input
                type="text"
                name="mobileNo"
                value={filters.mobileNo}
                onChange={handleFilterChange}
                className="form-control form-control-sm center_list"
                style={{ width: "160px" }}
                placeholder="Mobile"
                autoComplete="off"
              />
            </div>
            <div className="form-group mb-2 ms-2">
              <button
                type="button"
                onClick={clearFilter}
                className="btn btn-sm btn-border"
              >
                Clear
              </button>
            </div>
          </div>
          <Link to="/companyregistration/add">
            <button
              type="button"
              className="btn btn-button btn-sm me-2"
              style={{ fontWeight: "600" }}
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
                 pagination: { pageSize: 50, pageIndex: 0 },
                  columnVisibility: {
                    createdBy: false,
                    createdAt: false,
                    updatedBy: false,
                    updatedAt: false,
                  },
                }}
                muiTableBodyRowProps={({ row }) => ({
                  onClick: () => navigate(`/companyregistration/view/${row.original.id}`),
                  style: { cursor: "pointer" },
                })}
              />
            </ThemeProvider>

            <Menu
              id="action-menu"
              anchorEl={menuAnchor}
              open={Boolean(menuAnchor)}
              onClose={handleMenuClose}
              disableScrollLock
            >
              <MenuItem
                onClick={() =>
                  navigate(`/companyregistration/edit/${selectedId}`)
                }
                className="text-start mb-0 menuitem-style"
              >
                Edit
              </MenuItem>
              <MenuItem>
                <GlobalDelete
                  path={`/deleteCenter/${selectedId}`}
                  onDeleteSuccess={fetchData}
                  onOpen={handleMenuClose}
                  // deleteCenterData={true}
                  handleCenterChanged={handleCenterChanged}
                />
              </MenuItem>
            </Menu>
          </>
        )}
      </div>
    </div>
  );
};

export default SuperAdminCenter;
