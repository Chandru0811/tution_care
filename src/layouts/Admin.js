import React, { useEffect, useState } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import "../styles/sidebar.css";
import "boxicons/css/boxicons.min.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import Sidebar from "../components/common/Sidebar";
import Header from "../components/common/Header";
import Footer from "../components/common/Footer";
import Course from "../pages/Course/Course";
import Lead from "../pages/Lead/Lead";
import Student from "../pages/Student/Student";
import Teacher from "../pages/Teacher/Teacher";
import TeacherAdd from "../pages/Teacher/TeacherAdd";
import TeacherEdit from "../pages/Teacher/TeacherEdit";
import Attendance from "../pages/Report/Attendance";
import Enrolment from "../pages/Report/Enrolment";
import Package from "../pages/Report/Package";
import Center from "../pages/Center/Center";
import CenterAdd from "../pages/Center/CenterAdd";
import CenterView from "../pages/Center/CenterView";
import CenterManager from "../pages/centerManager/CenterManager";
import CenterManagerAdd from "../pages/centerManager/CenterManagerAdd";
import Staff from "../pages/Staff/Staff";
import Invoice from "../pages/Invoice/Invoice";
import Document from "../pages/Document/Document";
import CourseAdd from "../pages/Course/CourseAdd";
import CourseEdit from "../pages/Course/CourseEdit";
import CourseView from "../pages/Course/CourseView";
import Subject from "../pages/Subject/Subject";
import SubjectAdd from "../pages/Subject/SubjectAdd";
import SubjectEdit from "../pages/Subject/SubjectEdit";
import SubjectView from "../pages/Subject/SubjectView";
import Level from "../pages/Level/Level";
import LevelAdd from "../pages/Level/LevelAdd";
import LevelEdit from "../pages/Level/LevelEdit";
import LevelView from "../pages/Level/LevelView";
import DocumentAdd from "../pages/Document/DocumentAdd";
import DocumentEdit from "../pages/Document/DocumentEdit";
import DocumentView from "../pages/Document/DocumentView";
import Class from "../pages/Class/Class";
import ClassAdd from "../pages/Class/ClassAdd";
import ClassEdit from "../pages/Class/ClassEdit";
import ClassView from "../pages/Class/ClassView";
import CenterEdit from "../pages/Center/CenterEdit";
import StaffAdd from "../pages/Staff/StaffAdd";
import StaffEdit from "../pages/Staff/StaffEdit";
import StudentNewView from "../pages/Student/StudentNewView";
import InvoiceAdd from "../pages/Invoice/InvoiceAdd";
import InvoiceEdit from "../pages/Invoice/InvoiceEdit";
import InvoiceView from "../pages/Invoice/InvoiceView";
import LeadAssessment from "../pages/Lead/LeadAssessment";
import StudentAdd from "../pages/Student/StudentAdd";
import StudentEdit from "../pages/Student/StudentEdit";
import StudentTransferOut from "../pages/Student/StudentTransferOut";
import StudentChangeClass from "../pages/Student/StudentChangeClass";
import StudentEndClass from "../pages/Student/StudentEndClass";
import Attendances from "../pages/Attendance/Attendances";
import AttendancesAdd from "../pages/Attendance/AttendancesAdd";
import AttendancesEdit from "../pages/Attendance/AttendancesEdit";
import RolesAdd from "../pages/Roles/RolesAdd";
import DocumentReport from "../pages/Report/DocumentReport";
import WithdrawAdd from "../pages/Student/WithdrawAdd";
import EnrollmentAdd from "../pages/Lead/Enrollment/EnrollmentAdd";
import Video from "../pages/Video";
import { toast, ToastContainer } from "react-toastify";
import Reschedule from "../pages/Reschedule/Reschedule";
import RescheduleStudent from "../pages/Reschedule/RescheduleStudent";
import AttendancesCourse from "../pages/Attendance/AttendancesCourse";
import DocumentFiles from "../pages/Document/DocumentFiles";
import Curriculum from "../pages/Curriculum/Curriculum";
import EnrollmentEdit from "../pages/Lead/Enrollment/EnrollmentEdit";
import StudentRegisterCourse from "../pages/Student/StudentRegisterCourse";
import ReplaceClassLesson from "../pages/Student/ReplaceClassLessonList/ReplaceClassLesson";
import SendNotification from "../pages/SendNotification/SendNotification";
import SendNotificationAdd from "../pages/SendNotification/SendNotificationAdd";
import SendNotificationEdit from "../pages/SendNotification/SendNotificationEdit";
import StaffingAttendance from "../pages/StaffingAttendance/StaffingAttendance";
import StaffingAttendanceAdd from "../pages/StaffingAttendance/StaffingAttendanceAdd";
import StaffingAttendanceEdit from "../pages/StaffingAttendance/StaffingAttendanceEdit";
import StaffingAttendanceView from "../pages/StaffingAttendance/StaffingAttendanceView";
import Holiday from "../pages/Staff/Holiday/Holiday";
import HolidayAdd from "../pages/Staff/Holiday/HolidayAdd";
import HolidayEdit from "../pages/Staff/Holiday/HolidayEdit";
import HolidayView from "../pages/Staff/Holiday/HolidayView";
import Deduction from "../pages/Staff/Deductions/Deduction";
import DeductionAdd from "../pages/Staff/Deductions/DeductionAdd";
import DeductionEdit from "../pages/Staff/Deductions/DeductionEdit";
import DeductionView from "../pages/Staff/Deductions/DeductionView";
import LeaveAdmin from "../pages/Staff/Leave Admin/LeaveAdmin";
import Leave from "../pages/Staff/Leave/Leave";
import LeaveAdminEdit from "../pages/Staff/Leave Admin/LeaveAdminEdit";
import LeaveAdminView from "../pages/Staff/Leave Admin/LeaveAdminView";
import LeaveAdd from "../pages/Staff/Leave/LeaveAdd";
import LeaveView from "../pages/Staff/Leave/LeaveView";
import Payroll from "../pages/Payroll/PayrollAdmin/Payroll";
import AddPayroll from "../pages/Payroll/PayrollAdmin/AddPayroll";
import EditPayroll from "../pages/Payroll/PayrollAdmin/EditPayroll";
import Viewpayroll from "../pages/Payroll/PayrollAdmin/ViewPayroll";
import Payslip from "../pages/EmployeePayslip/Payslip";
import ViewPayslip from "../pages/EmployeePayslip/ViewPayslip";
import CMSFooter from "../pages/CMS/CMSFooter";
import CmsTopbar from "../pages/CMS/CmsTopbar";
import CMSProducts from "../pages/CMS/CMSProducts";
import CMSProductsItems from "../pages/CMS/CMSProductsItem";
import CMSProductsItemAdd from "../pages/CMS/CMSProductsitemAdd";
import CMSProductsItemEdit from "../pages/CMS/CMSProductsItemEdit";
import CmsNewsUpdate from "../pages/CMS/CmsNewsUpdate";
import CmsCalender from "../pages/CMS/CmsCalender";
import { CmsTeacher } from "../pages/CMS/CMSTeacher/CmsTeacher";
import CmsEnglish from "../pages/CMS/CMSEnglishCourse/CmsEnglish";
import CmsHome from "../pages/CMS/CmsHome/CmsHome";
import CMSContact from "../pages/CMS/CMSContact/CMSContact";
import CMSContactAdd from "../pages/CMS/CMSContact/CMSContactAdd";
import CMSContactEdit from "../pages/CMS/CMSContact/CMSContactEdit";
import CMSContactView from "../pages/CMS/CMSContact/CMSContactView";
import CMSTestMonail from "../pages/CMS/CMSTestMonial";
import CMSTestMonialAdd from "../pages/CMS/CMSTestMonialAdd";
import CMSTestMonialEdit from "../pages/CMS/CMSTestMonialEdit";
import CmsAboutUs from "../pages/CMS/CmsAboutus/CmsAboutUs";
import CmsChinesh from "../pages/CMS/CMSChineshCourse/CmsChinesh";
import CenterManagerEdit from "../pages/centerManager/CenterManagerEdit";
import CenterManagerView from "../pages/centerManager/CenterManagerView";
import Tax from "../pages/Settings/Tax/Tax";
import TaxAdd from "../pages/Settings/Tax/TaxAdd";
import TaxEdit from "../pages/Settings/Tax/TaxEdit";
import TaxView from "../pages/Settings/Tax/TaxView";
import Race from "../pages/Settings/Race/Race";
import RaceAdd from "../pages/Settings/Race/RaceAdd";
import RaceEdit from "../pages/Settings/Race/RaceEdit";
import RaceView from "../pages/Settings/Race/RaceView";
import Country from "../pages/Settings/Country/Country";
import CountryAdd from "../pages/Settings/Country/CountryAdd";
import CountryEdit from "../pages/Settings/Country/CountryEdit";
import CountryView from "../pages/Settings/Country/CountryView";
import Shg from "../pages/Settings/Shg/Shg";
import ShgAdd from "../pages/Settings/Shg/ShgAdd";
import ShgEdit from "../pages/Settings/Shg/ShgEdit";
import ShgView from "../pages/Settings/Shg/ShgView";
import SettingLeave from "../pages/Settings/Leave/Leave";
import SettingLeaveAdd from "../pages/Settings/Leave/LeaveAdd";
import SettingLeaveEdit from "../pages/Settings/Leave/LeaveEdit";
import SettingLeaveView from "../pages/Settings/Leave/LeaveView";
import SalaryType from "../pages/Settings/Salary/SalaryType";
import SalaryTypeEdit from "../pages/Settings/Salary/SalaryTypeEdit";
import SalaryTypeView from "../pages/Settings/Salary/SalaryTypeView";
import SalaryTypeAdd from "../pages/Settings/Salary/SalaryTypeAdd";
import IDType from "../pages/Settings/IdType/IDType";
import IDTypeAdd from "../pages/Settings/IdType/IDTypeAdd";
import IDTypeEdit from "../pages/Settings/IdType/IDTypeEdit";
import SendNotificationView from "../pages/SendNotification/SendNotificationView";
import MyMessages from "../pages/Messaging/MyMessages/MyMessages";
import MyMessagesAdd from "../pages/Messaging/MyMessages/MyMessagesAdd";
import MyMessagesView from "../pages/Messaging/MyMessages/MyMessagesView";
import OtherMessagesView from "../pages/Messaging/OtherMessages/OtherMessagesView";
import OtherMessages from "../pages/Messaging/OtherMessages/OtherMessages";
import CourseFees from "../pages/Course/CourseFees/CourseFees";
import CourseFeesAdd from "../pages/Course/CourseFees/CourseFeesAdd";
import CourseFeesEdit from "../pages/Course/CourseFees/CourseFeesEdit";
import CourseFeesView from "../pages/Course/CourseFees/CourseFeesView";
import CourseDeposit from "../pages/Course/CourseDeposit/CourseDeposit";
import CourseDepositAdd from "../pages/Course/CourseDeposit/CourseDepositAdd";
import CurriculumOutlet from "../pages/Course/CurriculumOutlet/CurriculumOutlet";
import CurriculumOutletAdd from "../pages/Course/CurriculumOutlet/CurriculumOutletAdd";
import CurriculumOutletEdit from "../pages/Course/CurriculumOutlet/CurriculumOutletEdit";
import CurriculumOutletView from "../pages/Course/CurriculumOutlet/CurriculumOutletView";
import ScrollToTop from "../pages/ScrollToTop";
import LeaveEdit from "../pages/Staff/Leave/LeaveEdit";
import CMSBlog from "../pages/CMS/CMSBlog/CMSBlog";
import CMSBlogAdd from "../pages/CMS/CMSBlog/CMSBlogAdd";
import CMSBlogEdit from "../pages/CMS/CMSBlog/CMSBlogEdit";
import Contacted from "../pages/Lead/Contacted/Contacted";
import CmsCourses from "../pages/CMS/CMSCourses/CmsCourses";
import CmsCourseAdd from "../pages/CMS/CMSCourses/CmsCourseAdd";
import CmsCourseEdit from "../pages/CMS/CMSCourses/CmsCourseEdit";
import CmsCourseView from "../pages/CMS/CMSCourses/CmsCourseView";
import RevenueReport from "../pages/Report/RevenueReport";
import ReplaceClassLessonEdit from "../pages/Student/ReplaceClassLessonList/ReplaceClassLessonEdit";
import ReplaceClassLessonView from "../pages/Student/ReplaceClassLessonList/ReplaceClassLessonView";
import FreelancerPayslip from "../pages/EmployeePayslip/FreelancerPayslip";
import FreelancerPayslipView from "../pages/EmployeePayslip/FreelancerPayslipView";
import AbsentReason from "../pages/Settings/AbsentReason/AbsentReason";
import CheckIndex from "../pages/Staff/CheckIndex";
import ChangePassword from "../components/common/ChangePassword";
import NewTable1 from "../pages/Center/NewTable1";
import EmailTemplate from "../pages/Settings/Email Template/EmailTemplate";
import ReferalFees from "../pages/ReferalFees/ReferalFees";
import ReferalHistory from "../pages/ReferalHistory/ReferalHistory";
import ReferalFeesAdd from "../pages/ReferalFees/ReferalFeesAdd";
import NewDashboard from "../pages/NewDashboard";
import TransferOut from "../pages/StudentMovement/TransferOut/TransferOut";
import TeacherNewView from "../pages/Teacher/TeacherNewView";
import StaffNewView from "../pages/Staff/StaffNewView";
import Calendar from "../pages/Calendar/Calendar";
import BatchTime from "../pages/Settings/BatchTime/BatchTime";
import BatchTimeEdit from "../pages/Settings/BatchTime/BatchTimeEdit";
import LeadNewView from "../pages/Lead/LeadNewView";
import TimeTable from "../pages/TimeTable";
import Assignment from "../pages/Assignment/Assignment";
import AssignmentAdd from "../pages/Assignment/AssignmentAdd";
import AssignmentResult from "../pages/Assignment/AssignmentResult";
import AssignmentResultView from "../pages/Assignment/AssignmentResultView";
import AssignmentView from "../pages/Assignment/AssignmentView";
import PaymentsAdd from "../pages/Payment/PaymentsAdd";
import Payments from "../pages/Payment/Payments";
import PaymentsEdit from "../pages/Payment/PaymentsEdit";
import Roles from "../pages/Settings/Roles/Roles";
import AssignmentEdit from "../pages/Assignment/AssignmentEdit";
import PaymentsView from "../pages/Payment/PaymentsView";
import Language from "../pages/Settings/Language/Language";
import TrialNotification from "../components/common/TrialNotification";
import api from "../config/URL";

function Admin({ handleLogout }) {
  const [centerChange, setCenterChange] = useState(0);
  const centerId = localStorage.getItem("tmscenterId");
  const [data, setData] = useState([]);
  useEffect(() => {
    let sidebar = document.querySelector(".sidebar");
    let sidebarBtn = document.querySelector(".sidebarBtn");
    sidebarBtn.onclick = function () {
      sidebar.classList.toggle("active");
      if (sidebar.classList.contains("active")) {
        sidebarBtn.classList.replace("bx-menu", "bx-menu-alt-right");
      } else sidebarBtn.classList.replace("bx-menu-alt-right", "bx-menu");
    };
  }, []);
  const handleCenterChanged = () => {
    setCenterChange((prevCount) => prevCount + 1);
    console.log("centerChange", centerChange);
  };

  const getData = async () => {
    try {
      const response = await api.get(`/getAllCenterById/${centerId}`);
      setData(response.data);
    } catch (error) {
      console.error("Error Fetching Data");
    }
  };

  useEffect(() => {
    getData();
  }, [centerChange]);

  return (
    <div>
      <BrowserRouter basename="/tuitions">
        <ToastContainer position="top-center" />
        <Sidebar />
        <section className="home-section">
          <Header
            onLogout={handleLogout}
            centerChange={centerChange}
            data={data}
          />
          <ScrollToTop />
          <div className="home-content" style={{ minHeight: "95vh" }}>
            <TrialNotification />
            <Routes>
              <Route path="*" element={<NewDashboard />} />
              <Route path="/" element={<NewDashboard />} />
              <Route path="/newTable1" element={<NewTable1 />} />

              <Route
                path="/changepassword"
                element={<ChangePassword onLogout={handleLogout} />}
              />
              <Route path="/calendar" element={<Calendar />} />

              {/* Lead */}
              <Route path="/lead/lead" element={<Lead />} />
              <Route path="/lead/lead/add" element={<EnrollmentAdd />} />
              <Route path="/lead/lead/edit/:id" element={<EnrollmentEdit />} />
              <Route path="/lead/lead/view/:id" element={<LeadNewView />} />
              <Route
                path="/lead/lead/assessment/:leadId"
                element={<LeadAssessment />}
              />
              <Route path="/lead/enrollment" element={<EnrollmentAdd />} />
              <Route path="/video" element={<Video />} />
              <Route path="lead/contacted" element={<Contacted />} />

              {/* {/ Student /} */}
              <Route path="/student" element={<Student />} />
              <Route path="/student/add" element={<StudentAdd />} />
              <Route path="/student/edit/:id" element={<StudentEdit />} />
              {/* <Route path="/student/view/:id" element={<StudentView />} /> */}
              <Route path="/student/view/:id" element={<StudentNewView />} />
              <Route
                path="/student/view/transferOut/:id"
                element={<StudentTransferOut />}
              />
              <Route
                path="/student/view/changeClass"
                element={<StudentChangeClass />}
              />
              <Route
                path="/student/view/endClass/:id"
                element={<StudentEndClass />}
              />
              <Route path="/student/withdraw" element={<WithdrawAdd />} />
              <Route
                path="/student/register/course/:id"
                element={<StudentRegisterCourse />}
              />
              <Route
                path="/replaceclasslesson"
                element={<ReplaceClassLesson />}
              />
              <Route
                path="/replaceclasslessonList"
                element={<ReplaceClassLessonEdit />}
              />
              <Route
                path="/replaceclasslesson/view/:id"
                element={<ReplaceClassLessonView />}
              />

              {/* Student Movement */}
              <Route path="/transferOut" element={<TransferOut />} />

              {/* Center */}
              <Route
                path="/companyRegister"
                element={<Center handleCenterChanged={handleCenterChanged} />}
              />
              <Route
                path="/companyRegister/add"
                element={
                  <CenterAdd handleCenterChanged={handleCenterChanged} />
                }
              />
              <Route
                path="/companyRegister/view/:id"
                element={<CenterView />}
              />
              <Route
                path="/companyRegister/edit/:id"
                element={
                  <CenterEdit handleCenterChanged={handleCenterChanged} />
                }
              />

              <Route path="/centermanager" element={<CenterManager />} />
              <Route path="/centermanager/add" element={<CenterManagerAdd />} />
              <Route
                path="/centermanager/edit"
                element={<CenterManagerEdit />}
              />
              <Route
                path="/centermanager/view"
                element={<CenterManagerView />}
              />

              {/* Teacher */}
              <Route path="/teacher" element={<Teacher />} />
              <Route path="/teacher/add" element={<TeacherAdd />} />
              <Route path="/teacher/edit/:staff_id" element={<TeacherEdit />} />
              <Route path="/teacher/view/:id" element={<TeacherNewView />} />
              {/* StaffingCheck */}
              <Route path="/staffing/check" element={<CheckIndex />} />
              {/* StaffingAttendance */}
              <Route
                path="/staffing/attendance"
                element={<StaffingAttendance />}
              />
              <Route
                path="/staffing/attendance/add"
                element={<StaffingAttendanceAdd />}
              />
              <Route
                path="/staffing/attendance/edit/:id"
                element={<StaffingAttendanceEdit />}
              />
              <Route
                path="/staffing/attendance/view/:id"
                element={<StaffingAttendanceView />}
              />

              {/* {/ {/ Holiday /} /} */}
              <Route path="/holiday" element={<Holiday />} />
              <Route path="/holiday/add" element={<HolidayAdd />} />
              <Route path="/holiday/edit/:id" element={<HolidayEdit />} />
              <Route path="/holiday/list/:id" element={<HolidayView />} />

              {/* {/ {/ Deduction /} /} */}
              <Route path="/deduction" element={<Deduction />} />
              <Route path="/deduction/add" element={<DeductionAdd />} />
              <Route path="/deduction/edit/:id" element={<DeductionEdit />} />
              <Route path="/deduction/list/:id" element={<DeductionView />} />

              {/* {/ Leave Admin /} */}
              <Route path="/leaveadmin" element={<LeaveAdmin />} />
              <Route path="/leaveadmin/edit/:id" element={<LeaveAdminEdit />} />
              <Route path="/leaveadmin/view/:id" element={<LeaveAdminView />} />

              {/* {/ Leave /} */}
              <Route path="/leave" element={<Leave />} />
              <Route path="/leave/add" element={<LeaveAdd />} />
              <Route path="/leave/edit/:id" element={<LeaveEdit />} />
              <Route path="/leave/view/:id" element={<LeaveView />} />

              {/* {/ Payroll /} */}
              <Route path="/payrolladmin" element={<Payroll />} />
              <Route path="/payrolladmin/add" element={<AddPayroll />} />
              <Route path="/payrolladmin/edit/:id" element={<EditPayroll />} />
              <Route path="/payrolladmin/view/:id" element={<Viewpayroll />} />

              {/* {/ Payslip /} */}
              <Route path="/employeepayslip" element={<Payslip />} />
              <Route path="/employeepayslip/view" element={<ViewPayslip />} />

              <Route
                path="/freelancerPayslip"
                element={<FreelancerPayslip />}
              />
              <Route
                path="/freelancerPayslip/view/:id"
                element={<FreelancerPayslipView />}
              />

              {/* Report */}
              <Route path="/report/attendance" element={<Attendance />} />
              <Route path="/report/enrolment" element={<Enrolment />} />
              <Route path="/report/package" element={<Package />} />
              <Route path="/report/document" element={<DocumentReport />} />
              <Route path="/report/revenue" element={<RevenueReport />} />

              {/* staff  */}
              <Route path="/staff" element={<Staff />} />
              <Route path="/staff/add" element={<StaffAdd />} />
              <Route path="/staff/edit/:staff_id" element={<StaffEdit />} />
              <Route path="/staff/view/:id" element={<StaffNewView />} />

              {/* Course  */}
              <Route path="/course" element={<Course />} />
              <Route path="/course/add" element={<CourseAdd />} />
              <Route path="/course/edit/:id" element={<CourseEdit />} />
              <Route path="/course/view/:id" element={<CourseView />} />
              <Route
                path="/course/curriculumoutlet/curriculum/:id"
                element={<Curriculum />}
              />
              <Route path="/curriculum" element={<Curriculum />} />
              <Route path="/curriculum" element={<Curriculum />} />
              <Route path="/course/coursefees/:id" element={<CourseFees />} />
              <Route
                path="/course/coursefees/add"
                element={<CourseFeesAdd />}
              />
              <Route
                path="/course/coursefees/edit/:id"
                element={<CourseFeesEdit />}
              />
              <Route
                path="/course/coursefees/view/:id"
                element={<CourseFeesView />}
              />
              <Route path="/course/coursefees/:id" element={<CourseFees />} />
              <Route
                path="/course/coursefees/add"
                element={<CourseFeesAdd />}
              />
              <Route
                path="/course/coursefees/edit/:id"
                element={<CourseFeesEdit />}
              />
              <Route
                path="/course/coursefees/view/:id"
                element={<CourseFeesView />}
              />
              <Route
                path="/course/coursedeposit/:id"
                element={<CourseDeposit />}
              />
              <Route
                path="/course/coursedeposit/add"
                element={<CourseDepositAdd />}
              />
              <Route
                path="/course/coursedeposit/edit/:id"
                element={<CourseDepositAdd />}
              />
              <Route
                path="/course/coursedeposit/view/:id"
                element={<CourseDepositAdd />}
              />
              <Route
                path="/course/curriculumoutlet/:id"
                element={<CurriculumOutlet />}
              />
              <Route
                path="/course/curriculumoutlet/add"
                element={<CurriculumOutletAdd />}
              />
              <Route
                path="/course/curriculumoutlet/edit/:id"
                element={<CurriculumOutletEdit />}
              />
              <Route
                path="/course/curriculumoutlet/view/:id"
                element={<CurriculumOutletView />}
              />

              {/* Invoice  */}
              <Route path="/invoice" element={<Invoice />} />
              <Route path="/invoice/add" element={<InvoiceAdd />} />
              <Route path="/invoice/edit/:id" element={<InvoiceEdit />} />
              <Route path="/invoice/view/:id" element={<InvoiceView />} />
              {/* <Route path="/invoice/payment" element={<InvoicePayment />} /> */}

              {/* Payment  */}
              <Route path="/payments" element={<Payments />} />
              <Route path="/payments/add" element={<PaymentsAdd />} />
              <Route path="/payments/edit/:id" element={<PaymentsEdit />} />
              <Route path="/payments/view/:id" element={<PaymentsView />} />

              {/* Document  */}
              <Route path="/document" element={<Document />} />
              <Route path="/document/add" element={<DocumentAdd />} />
              <Route path="/document/edit" element={<DocumentEdit />} />
              <Route path="/document/view/:id" element={<DocumentView />} />
              <Route path="/documentfile" element={<DocumentFiles />} />

              {/* Assignment  */}
              <Route path="/assignment" element={<Assignment />} />
              <Route path="/assignment/add" element={<AssignmentAdd />} />
              <Route path="/assignmentResult" element={<AssignmentResult />} />
              <Route
                path="/assignmentResult/view/:id"
                element={<AssignmentResultView />}
              />
              <Route path="/assignment/edit/:id" element={<AssignmentEdit />} />
              <Route path="/assignment/view/:id" element={<AssignmentView />} />

              {/* Subject  */}
              <Route path="/subject" element={<Subject />} />
              <Route path="/subject/add" element={<SubjectAdd />} />
              <Route path="/subject/edit" element={<SubjectEdit />} />
              <Route path="/subject/view/:id" element={<SubjectView />} />

              {/* Level */}
              <Route path="/level" element={<Level />} />
              <Route path="/level/add" element={<LevelAdd />} />
              <Route path="/level/edit/:id" element={<LevelEdit />} />
              <Route path="/level/view/:id" element={<LevelView />} />

              {/* Class */}
              <Route path="/class" element={<Class />} />
              <Route path="/class/add" element={<ClassAdd />} />
              <Route path="/class/edit/:id" element={<ClassEdit />} />
              <Route path="/class/view/:id" element={<ClassView />} />

              {/* {/ Attendance /} */}
              <Route path="/attendance/list" element={<AttendancesCourse />} />
              <Route path="/attendance" element={<Attendances />} />
              <Route path="/attendance/add" element={<AttendancesAdd />} />
              <Route path="/attendance/edit" element={<AttendancesEdit />} />

              {/* Send Notification */}
              <Route path="/sendNotification" element={<SendNotification />} />
              <Route path="/roles" element={<Roles />} />
              <Route
                path="/sendNotification/add"
                element={<SendNotificationAdd />}
              />
              <Route
                path="/sendNotification/edit/:id"
                element={<SendNotificationEdit />}
              />
              <Route
                path="/sendNotification/view/:id"
                element={<SendNotificationView />}
              />

              {/* Re-Schedule */}
              <Route path="/reschedule" element={<Reschedule />} />
              <Route
                path="/reschedule/studentlist"
                element={<RescheduleStudent />}
              />

              {/* {/ Role /} */}
              <Route path="/role/add" element={<RolesAdd />} />

              {/* CMS Blog */}
              <Route path="/cms/cmsBlog" element={<CMSBlog />} />
              <Route path="/cms/cmsBlog/add" element={<CMSBlogAdd />} />
              <Route path="/cms/cmsBlog/edit/:id" element={<CMSBlogEdit />} />

              {/* CMS  */}
              <Route path="/cms/footer" element={<CMSFooter />} />
              <Route path="/cms/header" element={<CmsTopbar />} />

              <Route path="/cms/home" element={<CmsHome />} />
              <Route path="/cms/aboutus" element={<CmsAboutUs />} />

              {/* CMS Courses */}
              <Route path="/cms/CmsCourses" element={<CmsCourses />} />
              <Route path="/cms/CmsCourses/add" element={<CmsCourseAdd />} />
              <Route
                path="/cms/CmsCourses/edit/:id"
                element={<CmsCourseEdit />}
              />
              <Route path="/cms/CmsCourses/view" element={<CmsCourseView />} />

              <Route path="/cms/englishcourse" element={<CmsEnglish />} />
              <Route path="/cms/chineshcourse" element={<CmsChinesh />} />

              <Route path="/cms/products" element={<CMSProducts />} />
              <Route path="/cms/productsitem" element={<CMSProductsItems />} />
              <Route
                path="/cms/productsitem/addproductsitem"
                element={<CMSProductsItemAdd />}
              />
              <Route
                path="/cms/productsitem/editproductsitem"
                element={<CMSProductsItemEdit />}
              />

              <Route path="/cms/newsupdate" element={<CmsNewsUpdate />} />
              <Route path="/calender" element={<CmsCalender />} />

              <Route path="/cms/teacher" element={<CmsTeacher />} />

              {/* CMS Contact  */}
              <Route path="/cms/contact" element={<CMSContact />} />
              <Route path="/cms/contact/add" element={<CMSContactAdd />} />
              <Route path="/cms/contact/edit" element={<CMSContactEdit />} />
              <Route path="/cms/contact/view" element={<CMSContactView />} />

              <Route path="/cms/testimonial" element={<CMSTestMonail />} />
              <Route
                path="/cms/testmonial/addtestmonial"
                element={<CMSTestMonialAdd />}
              />
              <Route
                path="/cms/testmonial/editmonial"
                element={<CMSTestMonialEdit />}
              />

              {/* Referal Management  */}
              <Route path="/referalFees" element={<ReferalFees />} />
              <Route path="/referalFees/Add" element={<ReferalFeesAdd />} />

              <Route path="/referalHistory" element={<ReferalHistory />} />

              {/* Setting */}
              {/* Tax */}
              <Route path="/tax" element={<Tax />} />
              <Route path="/tax/add" element={<TaxAdd />} />
              <Route path="/tax/edit/:id" element={<TaxEdit />} />
              <Route path="/tax/view/:id" element={<TaxView />} />

              <Route path="/language" element={<Language />} />

              {/* Shg */}
              <Route path="/shg" element={<Shg />} />
              <Route path="/shg/add" element={<ShgAdd />} />
              <Route path="/shg/edit/:id" element={<ShgEdit />} />
              <Route path="/shg/view/:id" element={<ShgView />} />

              {/* {/ Batch Time /} */}
              <Route path="/batchtime" element={<BatchTime />} />
              <Route path="/batchtime/edit/:id" element={<BatchTimeEdit />} />

              {/* LeaveType */}
              <Route path="/leavetype" element={<SettingLeave />} />
              <Route path="/leavetype/add" element={<SettingLeaveAdd />} />
              <Route
                path="/leavetype/edit/:id"
                element={<SettingLeaveEdit />}
              />
              <Route
                path="/leavetype/view/:id"
                element={<SettingLeaveView />}
              />

              {/* ID Type */}
              <Route path="/idType" element={<IDType />} />
              <Route path="/idType/add" element={<IDTypeAdd />} />
              <Route path="/idType/edit/:id" element={<IDTypeEdit />} />

              {/* Race */}
              <Route path="/race" element={<Race />} />
              <Route path="/race/add" element={<RaceAdd />} />
              <Route path="/race/edit/:id" element={<RaceEdit />} />
              <Route path="/race/view/:id" element={<RaceView />} />

              {/* Countrty */}
              <Route path="/country" element={<Country />} />
              <Route path="/country/add" element={<CountryAdd />} />
              <Route path="/country/edit/:id" element={<CountryEdit />} />
              <Route path="/country/view/:id" element={<CountryView />} />

              {/* Salary */}
              <Route path="/salarytype" element={<SalaryType />} />
              <Route path="/salarytype/add" element={<SalaryTypeAdd />} />
              <Route path="/salarytype/edit/:id" element={<SalaryTypeEdit />} />
              <Route path="/salarytype/view/:id" element={<SalaryTypeView />} />

              {/* Absent Reason */}
              <Route path="/absentreason" element={<AbsentReason />} />

              {/* Email Template */}
              <Route path="/emailTemplate" element={<EmailTemplate />} />

              {/* Messaging */}
              <Route path="/messaging" element={<MyMessages />} />
              <Route path="/messaging/add" element={<MyMessagesAdd />} />
              <Route path="/messaging/view/:id" element={<MyMessagesView />} />

              {/* Other Messaging */}
              <Route path="/othermessaging" element={<OtherMessages />} />
              <Route
                path="/othermessaging/view/:id"
                element={<OtherMessagesView />}
              />
              <Route path="/timetable" element={<TimeTable />} />
            </Routes>
          </div>
          <Footer />
        </section>
      </BrowserRouter>
    </div>
  );
}

export default Admin;
