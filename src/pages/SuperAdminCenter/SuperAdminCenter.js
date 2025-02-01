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
import fetchAllCentreManager from "../List/CentreMangerList";
import GlobalDelete from "../../components/common/GlobalDelete";

const SuperAdminCenter = ({ handleCenterChanged }) => {
  const [filters, setFilters] = useState({
    centerName: "",
    centerCode: "",
    email: "",
    centerManagerId: "",
  });
  const [centerManagerData, setCenterManagerData] = useState([]);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [menuAnchor, setMenuAnchor] = useState(null);
  const [selectedId, setSelectedId] = useState(null);

  const fetchCenterManagerData = async () => {
    try {
      const centerManagerData = await fetchAllCentreManager();
      setCenterManagerData(centerManagerData);
    } catch (error) {
      toast.error(error);
    }
  };

  useEffect(() => {
    fetchCenterManagerData();
  }, []);

  // const fetchData = async () => {
  //   try {
  //     setLoading(true);
  //     const queryParams = new URLSearchParams(filters).toString();
  //     const response = await api.get(`/getCenterWithCustomInfo?${queryParams}`);
  //     setData(response.data);
  //   } catch (error) {
  //     console.error("Error fetching data:", error);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const fetchData = async () => {
    try {
      setLoading(true);

      // Filter out empty or null values from the filters
      const nonEmptyFilters = Object.fromEntries(
        Object.entries(filters).filter(([key, value]) => value !== "")
      );

      const queryParams = new URLSearchParams(nonEmptyFilters).toString();
      const response = await api.get(`/getCenterWithCustomInfo?${queryParams}`);

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
      // {
      //   accessorKey: "centerStatus",
      //   enableHiding: false,
      //   header: "Company Status",
      //   Cell: ({ row }) =>
      //     row.original.centerStatus === "APPROVE" ||
      //       row.original.centerStatus === "approve" ||
      //       row.original.centerStatus === "Approve" ? (
      //       <span
      //         className="badge badges-Green fw-light"
      //       // style={{ backgroundColor: "#287f71" }}
      //       >
      //         Approve
      //       </span>
      //     ) : row.original.centerStatus === "PENDING" ||
      //       row.original.centerStatus === "pending" ||
      //       row.original.centerStatus === "Pending" ? (
      //       <span
      //         className="badge badges-orange fw-light"
      //       // style={{ backgroundColor: "#eb862a" }}
      //       >
      //         Pending
      //       </span>
      //     ) : null,
      // },
      {
        accessorKey: "centerStatus",
        enableHiding: false,
        header: "Company Status",
        Cell: ({ row }) => {
          const statusOptions = [
            {
              label: "Approve",
              value: "Approve",
              className: "badges-Green",
              bgColor: "#28a745",
            },
            {
              label: "Pending",
              value: "Pending",
              className: "badges-orange",
              bgColor: "#ffc107",
            },
            {
              label: "Rejected",
              value: "Rejected",
              className: "badges-red",
              bgColor: "#dc3545",
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

            try {
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
            }
          };

          const selectedOption = statusOptions.find(
            (opt) => opt.value === selectedStatus
          );

          return (
            <select
              className="form-control badge w-50"
              value={selectedStatus}
              onChange={handleStatusChange}
              style={{
                height: "20px",
                textAlign: "center",
                borderRadius: "5px",
                backgroundColor: selectedOption?.bgColor,
                cursor: "pointer",
              }}
            >
              {statusOptions.map((status) => (
                <option
                  key={status.value}
                  value={status.value}
                  style={{ backgroundColor: "white", color: "black" }}
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
        header: "Company Name",
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
      centerCode: "",
      email: "",
      centerManagerId: "",
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
          &nbsp;Company Management
          <span className="breadcrumb-separator"> &gt; </span>
        </li>
        <li className="breadcrumb-item active" aria-current="page">
          &nbsp;Company Listing
        </li>
      </ol>
      <div className="card">
        <div
          className="mb-3 d-flex justify-content-between align-items-center p-1"
          style={{ background: "#f5f7f9" }}
        >
          <span className="text-muted">
            This database shows the list of{" "}
            <strong style={{ color: "#287f71" }}>Company</strong>
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
                style={{ width: "160px" }}
                placeholder="Company Name"
                autoComplete="off"
              />
            </div>
            <div className="form-group mb-0 ms-2 mb-1">
              <input
                type="text"
                name="centerCode"
                value={filters.centerCode}
                onChange={handleFilterChange}
                className="form-control form-control-sm center_list"
                style={{ width: "160px" }}
                placeholder="Code"
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
                // muiTableBodyRowProps={({ row }) => ({
                //   onClick: () => navigate(`/companyregistration/view/${row.original.id}`),
                //   style: { cursor: "pointer" },
                // })}
              />
            </ThemeProvider>

            <Menu
              id="action-menu"
              anchorEl={menuAnchor}
              open={Boolean(menuAnchor)}
              onClose={handleMenuClose}
              disableScrollLock
            >
              {/* <MenuItem >
                <AddRegister id={selectedId} onSuccess={fetchData} handleMenuClose={handleMenuClose} />
              </MenuItem>
              <MenuItem >
                <AddClass id={selectedId} onSuccess={fetchData} handleMenuClose={handleMenuClose} />
              </MenuItem>
              <MenuItem >
                <AddPackage id={selectedId} onSuccess={fetchData} handleMenuClose={handleMenuClose} />
              </MenuItem>
              <MenuItem >
                <AddBreak id={selectedId} onSuccess={fetchData} handleMenuClose={handleMenuClose} />
              </MenuItem> */}
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
