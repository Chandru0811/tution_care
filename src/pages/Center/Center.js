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

const Center = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [menuAnchor, setMenuAnchor] = useState(null);
  const [selectedId, setSelectedId] = useState(null);
  const tmscenterName = localStorage.getItem("tmscenterName");
  const appConfigInfo = JSON.parse(localStorage.getItem("tmsappConfigInfo"));
  const storedScreens = JSON.parse(localStorage.getItem("tmsscreens") || "{}");

  console.log("appConfigInfo", appConfigInfo.appName);
  const studentName = {
    success: true,
    status: 200,
    data: {
      id: 6,
      school_id: 1,
      center_id: "[4]",
      generated_by: 2,
      grade_id: "[3]",
      subject_id: "[3]",
      topic_id: "[3]",
      ques_type: '["fillable","closed","multichoice","short_answer","upload"]',
      type: "question",
      title: "Model exam-1",
      question_id: "[31,33,34,35]",
      ques_id_with_type:
        '[{"id":31,"questype":"upload"},{"id":33,"questype":"multichoice"},{"id":34,"questype":"short_answer"},{"id":35,"questype":"fillable"}]',
      difficult_level: "Hard",
      total_score: "100",
      target_score: "80",
      reward: 10,
      active: 1,
      created_at: "2025-02-25T09:12:43.000000Z",
      updated_at: "2025-02-25T09:12:43.000000Z",
      user_name: "Harish",
      center_names: ["Centre 22"],
      grade_names: ["Grade 22"],
      subject_names: ["Subject 22"],
      topic_names: ["Topic 22"],
      questions: [
        {
          id: 31,
          school_id: 1,
          center_id: "[4]",
          grade_id: "3",
          subject_id: "3",
          topic_id: "3",
          ques_type:
            '["fillable","closed","multichoice","short_answer","upload"]',
          question: "What is the fastest land animal?`",
          options: '["Cheetah","Lion","Deer"]',
          upload: "assets/images/questions/31/1740373538_CloudECS.png",
          difficult_level: "Hard",
          hint: "Chee",
          created_at: "2025-02-24T05:05:38.000000Z",
          updated_at: "2025-02-24T05:05:38.000000Z",
        },
        {
          id: 33,
          school_id: 1,
          center_id: "[4]",
          grade_id: "3",
          subject_id: "3",
          topic_id: "3",
          ques_type:
            '["fillable","closed","multichoice","short_answer","upload"]',
          question: "What is the largest living reptile?",
          options: '["Cheetah","Lion","Saltwater crocodile"]',
          upload: null,
          difficult_level: "Hard",
          hint: "Saltwater live",
          created_at: "2025-02-25T09:09:03.000000Z",
          updated_at: "2025-02-25T09:09:03.000000Z",
        },
        {
          id: 34,
          school_id: 1,
          center_id: "[4]",
          grade_id: "3",
          subject_id: "3",
          topic_id: "3",
          ques_type: '["fillable","short_answer","upload"]',
          question: "What color is a polar bear\u2019s skin?",
          options: null,
          upload: null,
          difficult_level: "Hard",
          hint: null,
          created_at: "2025-02-25T09:10:03.000000Z",
          updated_at: "2025-02-25T09:10:03.000000Z",
        },
        {
          id: 35,
          school_id: 1,
          center_id: "[4]",
          grade_id: "3",
          subject_id: "3",
          topic_id: "3",
          ques_type: '["fillable","short_answer","upload"]',
          question: 'Which animal is known as the "King of the Jungle"?',
          options: null,
          upload: null,
          difficult_level: "Hard",
          hint: "Lio",
          created_at: "2025-02-25T09:11:44.000000Z",
          updated_at: "2025-02-25T09:11:44.000000Z",
        },
      ],
      student_assigned: [
        {
          id: 4,
          assigned_id: "6",
          assigned_type: "App\\Models\\Worksheet",
          student_id: "[3]",
          student_names: [" Harishragavendhar","sakthivel"],
          grade_id: 3,
          grade_name: "Grade 22",
          created_at: "2025-02-25T09:19:28.000000Z",
          updated_at: "2025-02-25T09:19:28.000000Z",
        },
      ],
    },
    message: "Worksheet Retrieved Successfully!",
  };

  const studentNames = studentName.data.student_assigned[0].student_names;
  
  const mappedStudentNames = studentNames.join(", ");
  
  console.log("Names:", mappedStudentNames);
  

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
        accessorKey: "centerName",
        enableHiding: false,
        header: `${appConfigInfo.centreName} Name`,
      },
      { accessorKey: "code", header: "Code", enableHiding: false, size: 40 },
      {
        accessorKey: "uenNumber",
        header: "UEN Number",
        enableHiding: false,
        size: 50,
      },
      { accessorKey: "email", enableHiding: false, header: "Email" },
      { accessorKey: "mobile", enableHiding: false, header: "Mobile" },
      { accessorKey: "address", header: "Address" },
      { accessorKey: "invoiceNotes", header: "Invoice Notes" },
      { accessorKey: "openingDate", header: "Opening Date" },
      { accessorKey: "bankAccountName", header: "Bank A/C Name" },
      { accessorKey: "bankAccountNumber", header: "Bank A/C Number" },
      { accessorKey: "bankBranch", header: "Bank Branch" },
      { accessorKey: "bankName", header: "Bank Name" },
      { accessorKey: "gst", header: "GST" },
      { accessorKey: "taxRegistrationNumber", header: "Tax Reg Number" },
      { accessorKey: "zipCode", header: "Zip Code" },
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

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await api.get(
        `/getCenterWithCustomInfo?centerName=${tmscenterName}`
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
  }, []);

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

  const handleMenuClose = () => setMenuAnchor(null);
  const hideColumn =
    storedScreens?.centerListingUpdate === false &&
    storedScreens?.centerListingDelete === false;
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
          &nbsp;{appConfigInfo.centreName}
          <span className="breadcrumb-separator"> &gt; </span>
        </li>
        <li className="breadcrumb-item active" aria-current="page">
          &nbsp;{appConfigInfo.centreName} Listing
        </li>
      </ol>
      <div className="card">
        <div
          className="mb-3 d-flex justify-content-between align-items-center p-1"
          style={{ background: "#f5f7f9" }}
        >
          <span className="text-muted">
            This database shows the list of{" "}
            <strong style={{ color: "#287f71" }}>
              {appConfigInfo.centreName}
            </strong>
          </span>
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
                    id: !hideColumn,
                  },
                }}
                muiTableBodyRowProps={({ row }) => ({
                  onClick: () =>
                    navigate(`/companyRegister/view/${row.original.id}`),
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
              {storedScreens?.centerListingUpdate && (
                <MenuItem
                  onClick={() =>
                    navigate(`/companyRegister/edit/${selectedId}`)
                  }
                  className="text-start mb-0 menuitem-style"
                >
                  Edit
                </MenuItem>
              )}
            </Menu>
          </>
        )}
      </div>
    </div>
  );
};

export default Center;
