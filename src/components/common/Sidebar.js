import React, { useEffect, useRef, useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { Collapse, Nav, OverlayTrigger, Tooltip } from "react-bootstrap";
import Logo from "../../assets/images/TMS_LOGO.png";
import api from "../../config/URL";
import { PiBuildings } from "react-icons/pi";
import { IoIosAdd, IoIosRemove } from "react-icons/io";
import { PiBookOpenText } from "react-icons/pi";
import { RiDashboardLine } from "react-icons/ri";
import { HiOutlineUserGroup } from "react-icons/hi2";
import { TbUserSearch } from "react-icons/tb";
import { TbStatusChange } from "react-icons/tb";
import { TbCalendarTime } from "react-icons/tb";
import { TbFolderCog } from "react-icons/tb";
import { LiaFileInvoiceDollarSolid } from "react-icons/lia";
import { VscReferences } from "react-icons/vsc";
import { BsFileEarmarkRichtext } from "react-icons/bs";
import { LiaUserEditSolid } from "react-icons/lia";
import { TbMessageCode } from "react-icons/tb";
import { GrUserSettings } from "react-icons/gr";
import { GiExitDoor } from "react-icons/gi";
import { MdOutlineAssignment } from "react-icons/md";
import { RiUserAddLine } from "react-icons/ri";

function Sidebar() {
  const [activeMenu, setActiveMenu] = useState(null);
  const [menuItems, setMenuItems] = useState([]);
  const [data, setData] = useState({});
  console.log("Data::", data.leadManagement);

  const storedScreens = JSON.parse(localStorage.getItem("tmsscreens") || "{}");
  const storedConfigure = JSON.parse(
    localStorage.getItem("tmsappConfigInfo") || "{}"
  );

  // console.log("storedConfigure ::",storedConfigure);

  const location = useLocation();
  const hasRenderedOnce = useRef(false);
  const centerId = localStorage.getItem("tmscenterId");
  const Key = {
    lead: storedConfigure.lead || "Lead Management",
    student: storedConfigure?.student || "Student Management",
    course: storedConfigure?.course || "Course Management",
    centreName: storedConfigure?.centreName || "Company Management",
    employee: storedConfigure?.employee || "Employee Info",
    report: storedConfigure?.report || "Report Management",
    invoice: `${storedConfigure?.invoice || "Invoice"}  and Payment`,
    Rferal: storedConfigure?.Rferal || "Referal Management",
    message: storedConfigure?.message || "Messaging",
    assignManagement:
      storedConfigure?.assignManagement || "Assignment Management",
    documentManagement:
      storedConfigure?.documentManagement || "Document Management",
    settings: storedConfigure?.settings || "Settings",
    schedule: storedConfigure?.schedule || "Schedule",
  };
  const iconMapping = {
    [Key.centreName]: <PiBuildings />,
    [Key.course]: <PiBookOpenText />,
    [Key.lead]: <GiExitDoor />,
    [Key.employee]: <RiUserAddLine />,
    Staffing: <HiOutlineUserGroup />,
    [Key.student]: <TbUserSearch />,
    "Student Movement": <TbStatusChange />,
    [Key.schedule]: <TbCalendarTime />,
    [Key.documentManagement]: <TbFolderCog />,
    [Key.assignManagement]: <MdOutlineAssignment />,
    [Key.invoice]: <LiaFileInvoiceDollarSolid />,
    [Key.Rferal]: <VscReferences />,
    [Key.report]: <BsFileEarmarkRichtext />,
    "Content Management": <LiaUserEditSolid />,
    [Key.message]: <TbMessageCode />,
    [Key.settings]: <GrUserSettings />,
  };

  const getAccess = async () => {
    try {
      const response = await api.get(`/getAllCenterById/${centerId}`);
      setData(response.data);
    } catch (error) {
      console.error("Error Fetching Data: " + error.message);
    }
  };

  useEffect(() => {
    getAccess();
  }, []);

  useEffect(() => {
    const storedScreens = JSON.parse(
      localStorage.getItem("tmsscreens") || "{}"
    );
    const storedConfigure = JSON.parse(
      localStorage.getItem("tmsappConfigInfo") || "{}"
    );
    console.log("first", storedConfigure.class);
    if (!data) return;
    const updatedMenuItems = [
      {
        title: storedConfigure?.centreName || "Company Management",
        icon: "PiBuildings",
        isOpen: false,
        subMenus: [
          {
            title: storedConfigure?.centreName || "Company Listing",
            path: "/companyRegister",
            access: storedScreens.centerListingIndex,
          },
        ],
      },
      {
        title: storedConfigure?.course || "Course Management",
        icon: "PiBookOpenText",
        isOpen: false,
        subMenus: [
          {
            title: storedConfigure?.subject || "Subject",
            path: "/subject",
            access: storedScreens.subjectIndex,
          },
          {
            title: storedConfigure?.level || "Level",
            path: "/level",
            access: storedScreens.levelIndex,
          },
          {
            title: storedConfigure?.course || "Course",
            path: "/course",
            access: storedScreens.courseIndex,
          },
          {
            title: storedConfigure?.confClass || "Class",
            path: "/class",
            access: storedScreens.classIndex,
          },
        ],
      },
      ...(data.leadManagement
        ? [
            {
              title: storedConfigure?.lead || "Lead Management",
              icon: "GiExitDoor",
              isOpen: false,
              subMenus: [
                {
                  title: `${storedConfigure?.lead} Listing` || "Lead Listing",
                  path: "lead/lead",
                  access: storedScreens.leadListingIndex,
                },
              ],
            },
          ]
        : []),
      {
        title: storedConfigure?.employee || "Employee Info",
        icon: "RiUserAddLine",
        isOpen: false,
        subMenus: [
          {
            title: storedConfigure?.employee || "Teacher",
            path: "/teacher",
            access: storedScreens.teacherIndex,
          },
        ],
      },
      ...(data.staffManagement
        ? [
            {
              title: "Staffing",
              icon: "HiOutlineUserGroup",
              isOpen: false,
              subMenus: [
                // {
                //   title: "Staff",
                //   path: "/staff",
                //   access: storedScreens.staffIndex,
                // },
                {
                  title: "Attendance",
                  path: "/staffing/attendance",
                  access: storedScreens.staffAttendanceIndex,
                },
                {
                  title: "Check Attendance",
                  path: "/staffing/check",
                  access: storedScreens.checkAttendanceIndex,
                },
                {
                  title: "Leave",
                  path: "/leaveadmin",
                  access: storedScreens.leaveAdminIndex,
                },
                {
                  title: "Leave Request",
                  path: "/leave",
                  access: storedScreens.leaveRequestIndex,
                },
                {
                  title: "Holiday",
                  path: "/holiday",
                  access: storedScreens.holidayIndex,
                },
                {
                  title: "Deduction",
                  path: "/deduction",
                  access: storedScreens.deductionIndex,
                },
                {
                  title: "Payroll",
                  path: "/payrolladmin",
                  access: storedScreens.payrollIndex,
                },
                // {
                //   title: "Payslip",
                //   path: "/employeepayslip",
                //   access: storedScreens.payslipIndex,
                // },
                // {
                //   title: "Freelancer Invoice",
                //   path: "/freelancerPayslip",
                //   access: storedScreens.freeLancerIndex,
                // },
              ],
            },
          ]
        : []),
      {
        title: storedConfigure?.student || "Student Management",
        icon: "TbUserSearch",
        isOpen: false,
        subMenus: [
          {
            title: storedConfigure?.student || "Student Listing",
            path: "/student",
            access: storedScreens.studentListingIndex,
          },
          {
            title: storedConfigure?.attendance || "Attendance",
            path: "/attendance",
            access: storedScreens.attendanceIndex,
          },
          {
            title: "Replace Class Lesson List",
            path: "/replaceclasslesson",
            access: storedScreens.attendanceIndex,
          },
        ],
      },
      {
        title: storedConfigure?.schedule || "Schedule",
        icon: "TbCalendarTime",
        isOpen: false,
        subMenus: [
          {
            title: "Time Schedule",
            path: "/timetable",
            access: storedScreens.scheduleTeacherIndex,
          },
          {
            title: "Calendar",
            path: "/calendar",
            access: storedScreens.scheduleTeacherIndex,
          },
        ],
      },
      ...(data.documentManagement
        ? [
            {
              title:
                storedConfigure?.documentManagement || "Document Management",

              // title: storedConfigure?.documentManagement?.trim()
              //   ? `${storedConfigure.documentManagement} `
              //   : "Document Management",

              // title:
              //   storedConfigure?.documentManagement || "Document Management",
              icon: "TbFolderCog",
              isOpen: false,
              subMenus: [
                {
                  title: storedConfigure?.documentManagement?.trim()
                    ? `${storedConfigure.documentManagement} Folder`
                    : "Document Folder",

                  // title:
                  //   storedConfigure?.documentManagement || "Document Folder",
                  path: "/document",
                  access: storedScreens.documentListingIndex,
                },
                {
                  title: storedConfigure?.documentManagement?.trim()
                    ? `${storedConfigure.documentManagement} Files`
                    : "Document Files",

                  // title:
                  //   storedConfigure?.documentManagement || "Document Files",
                  path: "/documentfile",
                  access: storedScreens.documentFileIndex,
                },
                // Add more submenus as needed
              ],
            },
          ]
        : []),
      ...(data.assessmentManagement
        ? [
            {
              title:
                storedConfigure?.assignManagement || "Assignment Management",

              // title: storedConfigure?.assignManagement?.trim()
              //   ? `${storedConfigure.assignManagement} `
              //   : "Assignment Management",

              isOpen: false,
              subMenus: [
                {
                  title: storedConfigure?.assignManagement?.trim()
                    ? `${storedConfigure.assignManagement} Questionnaire`
                    : "Assignment Questionnaire",
                  // title:
                  //   storedConfigure?.assignManagement ||
                  //   "Assignment Questionnaire",
                  path: "/assignment",
                  access: storedScreens.questionIndex,
                },
                {
                  title: storedConfigure?.assignManagement?.trim()
                    ? `${storedConfigure.assignManagement} Result`
                    : "Assignment Result",
                  // title:
                  //   storedConfigure?.assignManagement || "Assignment Result",
                  path: "/assignmentResult",
                  access: storedScreens.answerIndex,
                },
              ],
            },
          ]
        : []),
      {
        title: `${storedConfigure?.invoice || "Invoice"}  and Payment`,
        icon: "LiaFileInvoiceDollarSolid",
        isOpen: false,
        subMenus: [
          {
            title: storedConfigure?.invoice || "Invoice",
            path: "/invoice",
            access: storedScreens.invoiceIndex,
          },
          {
            title: "Payment",
            path: "/payments",
            access: storedScreens.invoiceIndex,
          },
        ],
      },
      ...(data.referalManagement
        ? [
            {
              title: storedConfigure?.Rferal || "Referal Management",
              icon: "VscReferences",
              isOpen: false,
              subMenus: [
                {
                  title: storedConfigure?.Rferal || "Set Referal Fees",
                  path: "/referalFees",
                  access: storedScreens.invoiceIndex,
                },
                // {
                //   title: "Referal History",
                //   path: "/referalHistory",
                //   access: storedScreens.paymentIndex,
                // },
              ],
            },
          ]
        : []),
      ...(data.reportManagement
        ? [
            {
              title: storedConfigure?.report || "Report Management",
              icon: "BsFileEarmarkRichtext ",
              isOpen: false,
              subMenus: [
                {
                  title: `${storedConfigure?.student} Attendance Report`,
                  path: "/report/attendance",
                  access: storedScreens.attendanceReportIndex,
                },
                {
                  title: `${storedConfigure?.employee} Attendance Report`,
                  path: "/report/attendance/employee",
                  access: storedScreens.userAttendanceReportIndex,
                },
                {
                  title: "Revenue Report",
                  path: "/report/revenue",
                  access: storedScreens.assessmentReportIndex,
                },
                {
                  title: "Enrollment Report",
                  path: "/report/enrolment",
                  access: storedScreens.enrollmentReportIndex,
                },
              ],
            },
          ]
        : []),
      {
        title: storedConfigure?.settings || "Settings",
        icon: "GrUserSettings",
        isOpen: false,
        subMenus: [
          {
            title: "Roles",
            path: "/roles",
            access: storedScreens.rolesMatrixIndex,
          },
          {
            title: "Role & Matrix",
            path: "/role/add",
            access: storedScreens.rolesMatrixIndex,
          },
          {
            title: "Tax",
            path: "/tax",
            access: storedScreens.taxSettingIndex,
          },
          {
            title: "Primary Language",
            path: "/language",
            access: storedScreens.languageIndex,
          },
          {
            title: "Race",
            path: "/race",
            access: storedScreens.raceSettingIndex,
          },
          {
            title: "Country & Nationality",
            path: "/country",
            access: storedScreens.countrySettingIndex,
          },
          {
            title: "SHG",
            path: "/shg",
            access: storedScreens.shgSettingIndex,
          },
          {
            title: "SDL",
            path: "/sdl",
            access: true,
          },
          {
            title: "CPF",
            path: "/cpf",
            access: true,
          },
          {
            title: "Batch Time",
            path: "/batchtime",
            access: storedScreens.batchtimeSettingIndex,
          },
          {
            title: "Leave Type",
            path: "/leavetype",
            access: storedScreens.leaveSettingIndex,
          },
          {
            title: "ID Type",
            path: "/idType",
            access: storedScreens.idTypeSettingIndex,
          },
          {
            title: "Salary Type",
            path: "/salarytype",
            access: storedScreens.salarySettingIndex,
          },
          {
            title: "Absent Reason",
            path: "/absentreason",
            // access: storedScreens.absentSettingIndex,
            access: storedScreens.absentReasonIndex,
          },
          {
            title: "Email Template",
            path: "/emailTemplate",
            // access: storedScreens.emailTemplateSettingIndex,
            access: storedScreens.salarySettingIndex,
          },
        ],
      },
      ...(data.messages
        ? [
            {
              title: storedConfigure?.message || "Messaging",
              icon: "TbMessageCode",
              isOpen: false,
              subMenus: [
                {
                  title: "My Messages",
                  path: "/messaging",
                  access: storedScreens.smsMessageIndex,
                  // access:true
                },
                {
                  title: "Other Messages",
                  path: "/othermessaging",
                  access: storedScreens.otherMessageIndex,
                  // access:true
                },
                {
                  title: "School Announcement",
                  path: "/sendNotification",
                  access: storedScreens.sendNotificationIndex,
                  // access:true
                },
              ],
            },
          ]
        : []),
    ];
    setMenuItems(updatedMenuItems);
  }, [data]);

  useEffect(() => {
    if (location.pathname === "/") {
      setMenuItems((menuItems) =>
        menuItems.map((item) => ({ ...item, isOpen: false }))
      );

      if (hasRenderedOnce.current) {
        setActiveMenu(null); // Only called after the first render
      } else {
        hasRenderedOnce.current = true; // Mark as rendered
      }
    }
  }, [location]);

  const handleMenuClick = (index) => {
    if (index === null) {
      // If Home is clicked, deactivate all menus
      setMenuItems(menuItems.map((item) => ({ ...item, isOpen: false })));
      setActiveMenu(null);
    } else {
      const updatedMenuItems = menuItems.map((item, i) => {
        if (i === index) {
          return {
            ...item,
            isOpen: !item.isOpen,
          };
        } else {
          return {
            ...item,
            isOpen: false,
          };
        }
      });
      setMenuItems(updatedMenuItems);
      setActiveMenu(
        updatedMenuItems[index].isOpen ? updatedMenuItems[index].title : null
      );
    }
  };

  return (
    <div className="sidebar">
      <div className="logo-details">
        <span className="logo_name">
          <img src={Logo} alt="logo" width={80} className="img-fluid p-2 " />
          <span className="text-dark">SMS Guru</span>
        </span>
      </div>
      <ul className="nav-links">
        <li>
          <NavLink
            to="/"
            onClick={() => handleMenuClick(null)}
            className={activeMenu === true ? "active activehover" : ""}
          >
            <OverlayTrigger
              placement="right"
              overlay={<Tooltip id="home-tooltip">Home</Tooltip>}
            >
              <i className="homeIcons">
                <RiDashboardLine />
              </i>
            </OverlayTrigger>
            <span className="links_name text-center">&nbsp;Home</span>
          </NavLink>
        </li>
        {menuItems.map(
          (item, index) =>
            item?.subMenus?.some((subMenu) => subMenu?.access) && (
              <li key={index}>
                <Nav.Link
                  to="#"
                  onClick={() => handleMenuClick(index)}
                  className={
                    activeMenu === item.title ? "active activehover" : ""
                  }
                >
                  <div
                    className="w-100 d-flex justify-content-between"
                    style={{ overflow: "hidden", whiteSpace: "nowrap" }}
                  >
                    <span className="d-flex justify-content-center text-center">
                      <div className="text-center">
                        <OverlayTrigger
                          placement="right"
                          overlay={
                            <Tooltip id={`${item.title}-tooltip`}>
                              {item.title}
                            </Tooltip>
                          }
                        >
                          {/* <span>
                              <i className={`${item.icon} activehover`}></i>
                            </span> */}
                          <span className="p-3">
                            {iconMapping[item.title] || "-"}
                          </span>
                        </OverlayTrigger>
                        <span className="links_name">{item.title}</span>
                      </div>
                    </span>
                    <span className="pe-4">
                      {item.isOpen ? (
                        <IoIosRemove
                          className="arrow open"
                          style={{
                            paddingRight: "5px",
                            minWidth: "0px",
                            fontWeight: "700",
                            fontSize: "24px",
                          }}
                        />
                      ) : (
                        <IoIosAdd
                          className="arrow"
                          style={{
                            paddingRight: "5px",
                            minWidth: "0px",
                            fontWeight: "700",
                            fontSize: "24px",
                          }}
                        />
                      )}
                    </span>
                  </div>
                </Nav.Link>

                <Collapse in={item.isOpen}>
                  <ul className="submenu">
                    {item.subMenus.map(
                      (subMenu, subIndex) =>
                        subMenu.access && (
                          <li key={subIndex}>
                            <NavLink
                              to={subMenu.path}
                              className={({ isActive }) =>
                                isActive ? "active-submenu" : ""
                              }
                            >
                              <OverlayTrigger
                                placement="right"
                                overlay={
                                  <Tooltip id={`${subMenu.title}-tooltip`}>
                                    {subMenu.title}
                                  </Tooltip>
                                }
                              >
                                <i
                                  className="bx bx-radio-circle-marked"
                                  style={{ fontWeight: "400" }}
                                ></i>
                                {/* <BiRadioCircleMarked className=""/> */}
                              </OverlayTrigger>
                              <span className="links_name links_names active">
                                {subMenu.title}
                              </span>
                            </NavLink>
                          </li>
                        )
                    )}
                  </ul>
                </Collapse>
              </li>
            )
        )}
      </ul>
    </div>
  );
}

export default Sidebar;
