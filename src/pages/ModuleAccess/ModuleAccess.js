import React, { useEffect, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Link, useNavigate } from "react-router-dom";

const validationSchema = Yup.object().shape({});

function ModuleAccess() {
  const [loading, setLoadIndicator] = useState(false);
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      courseIndex: true,
      courseRead: true,
      courseCreate: true,
      courseUpdate: true,
      courseDelete: true,
      classIndex: true,
      classRead: true,
      classCreate: true,
      classUpdate: true,
      classDelete: true,
      levelIndex: true,
      levelRead: true,
      levelCreate: true,
      levelUpdate: true,
      levelDelete: true,
      subjectIndex: true,
      subjectRead: true,
      subjectCreate: true,
      subjectUpdate: true,
      subjectDelete: true,

      curriculumIndex: true,
      curriculumRead: true,
      curriculumCreate: true,
      curriculumUpdate: true,
      curriculumDelete: true,

      courseFeesIndex: true,
      courseFeesRead: true,
      courseFeesCreate: true,
      courseFeesUpdate: true,
      courseFeesDelete: true,

      courseDepositFeesIndex: true,
      courseDepositFeesRead: true,
      courseDepositFeesCreate: true,
      courseDepositFeesUpdate: true,
      courseDepositFeesDelete: true,
      curriculumOutlineIndex: true,
      curriculumOutlineRead: true,
      curriculumOutlineCreate: true,
      curriculumOutlineUpdate: true,
      curriculumOutlineDelete: true,
      centerListingIndex: true,
      centerListingRead: true,
      centerListingCreate: true,
      centerListingUpdate: true,
      centerListingDelete: true,
      leadListingIndex: true,
      leadListingRead: true,
      leadListingCreate: true,
      leadListingUpdate: true,
      leadListingDelete: true,
      enrollmentIndex: true,
      enrollmentRead: true,
      enrollmentCreate: true,
      enrollmentUpdate: true,
      enrollmentDelete: true,
      staffIndex: true,
      staffRead: true,
      staffCreate: true,
      staffUpdate: true,
      staffDelete: true,
      teacherIndex: true,
      teacherRead: true,
      teacherCreate: true,
      teacherUpdate: true,
      teacherDelete: true,
      attendanceIndex: true,
      attendanceRead: true,
      attendanceCreate: true,
      attendanceUpdate: true,
      attendanceDelete: true,
      staffAttendanceCreate: true,
      staffAttendanceIndex: true,
      staffAttendanceRead: true,
      staffAttendanceUpdate: true,
      staffAttendanceDelete: true,
      leaveAdminIndex: true,
      leaveAdminRead: true,
      leaveAdminUpdate: true,
      leaveIndex: true,
      leaveCreate: true,
      holidayIndex: true,
      holidayRead: true,
      holidayCreate: true,
      holidayUpdate: true,
      holidayDelete: true,
      deductionIndex: true,
      deductionCreate: true,
      deductionRead: true,
      deductionUpdate: true,
      deductionDelete: true,

      payrollIndex: true,
      payrollRead: true,
      payrollCreate: true,
      payrollUpdate: true,
      payrollDelete: true,

      payslipIndex: true,
      payslipRead: true,

      freeLancerIndex: true,
      freeLancerRead: true,
      freeLancerCreate: true,
      freeLancerUpdate: true,
      freeLancerDelete: true,

      leaveRequestIndex: true,
      leaveRequestRead: true,
      leaveRequestCreate: true,
      leaveRequestUpdate: true,
      leaveRequestDelete: true,
      rolesMatrixIndex: true,
      rolesMatrixRead: true,
      rolesMatrixCreate: true,
      rolesMatrixUpdate: true,
      rolesMatrixDelete: true,
      studentListingIndex: true,
      studentListingRead: true,
      studentListingCreate: true,
      studentListingUpdate: true,
      studentListingDelete: true,
      changeClassIndex: true,
      changeClassRead: true,
      changeClassCreate: true,
      changeClassUpdate: true,
      changeClassDelete: true,
      transferOutIndex: true,
      transferOutRead: true,
      transferOutCreate: true,
      transferOutUpdate: true,
      transferOutDelete: true,
      withdrawIndex: true,
      withdrawRead: true,
      withdrawCreate: true,
      withdrawUpdate: true,
      withdrawDelete: true,
      endClassIndex: true,
      endClassRead: true,
      endClassCreate: true,
      endClassUpdate: true,
      endClassDelete: true,
      registerNewIndex: true,
      registerNewRead: true,
      registerNewCreate: true,
      registerNewUpdate: true,
      registerNewDelete: true,
      deductDepositIndex: true,
      deductDepositRead: true,
      deductDepositCreate: true,
      deductDepositUpdate: true,
      deductDepositDelete: true,
      documentListingIndex: true,
      documentListingRead: true,
      documentListingCreate: true,
      documentListingUpdate: true,
      documentListingDelete: true,
      documentFileIndex: true,
      documentFileRead: true,
      documentFileCreate: true,
      documentFileUpdate: true,
      documentFileDelete: true,
      invoiceIndex: true,
      invoiceRead: true,
      invoiceCreate: true,
      invoiceUpdate: true,
      invoiceDelete: true,
      paymentIndex: true,
      paymentRead: true,
      paymentCreate: true,
      paymentUpdate: true,
      paymentDelete: true,
      scheduleTeacherIndex: true,
      scheduleTeacherRead: true,
      scheduleTeacherCreate: true,
      scheduleTeacherUpdate: true,
      scheduleTeacherDelete: true,
      documentReportIndex: true,
      documentReportRead: true,
      documentReportCreate: true,
      documentReportUpdate: true,
      documentReportDelete: true,
      attendanceReportIndex: true,
      attendanceReportRead: true,
      attendanceReportCreate: true,
      attendanceReportUpdate: true,
      attendanceReportDelete: true,
      studentReportIndex: true,
      studentReportRead: true,
      studentReportCreate: true,
      studentReportUpdate: true,
      studentReportDelete: true,
      assessmentReportIndex: true,
      assessmentReportRead: true,
      assessmentReportCreate: true,
      assessmentReportUpdate: true,
      assessmentReportDelete: true,
      enrollmentReportIndex: true,
      enrollmentReportRead: true,
      enrollmentReportCreate: true,
      enrollmentReportUpdate: true,
      enrollmentReportDelete: true,
      feeCollectionReportIndex: true,
      feeCollectionReportRead: true,
      feeCollectionReportCreate: true,
      feeCollectionReportUpdate: true,
      feeCollectionReportDelete: true,
      packageBalanceReportIndex: true,
      packageBalanceReportRead: true,
      packageBalanceReportCreate: true,
      packageBalanceReportUpdate: true,
      packageBalanceReportDelete: true,
      salesRevenueReportIndex: true,
      salesRevenueReportRead: true,
      salesRevenueReportCreate: true,
      salesRevenueReportUpdate: true,
      salesRevenueReportDelete: true,
      replaceClassLessonListIndex: true,
      replaceClassLessonListRead: true,
      replaceClassLessonListCreate: true,
      replaceClassLessonListUpdate: true,
      replaceClassLessonListDelete: true,
      timeScheduleIndex: true,
      timeScheduleDelete: true,
      timeScheduleBlock: true,
      timeScheduleUnBlock: true,
      timeScheduleAdd: true,
      timeScheduleApproved: true,
      sendNotificationIndex: true,
      sendNotificationCreate: true,
      sendNotificationUpdate: true,
      smsMessageIndex: true,
      smsMessageRead: true,
      smsMessageCreate: true,
      account_read: true,
      headerIndex: true,
      headerRead: true,
      headerCreate: true,
      headerUpdate: true,
      headerDelete: true,
      headerPublish: true,
      homeIndex: true,
      homeRead: true,
      homeCreate: true,
      homeUpdate: true,
      homeDelete: true,
      homePublish: true,
      testimonialIndex: true,
      testimonialRead: true,
      testimonialCreate: true,
      testimonialUpdate: true,
      testimonialDelete: true,
      testimonialPublish: true,
      aboutIndex: true,
      aboutRead: true,
      aboutCreate: true,
      aboutUpdate: true,
      aboutDelete: true,
      aboutPublish: true,
      englishCourseIndex: true,
      englishCourseRead: true,
      englishCourseCreate: true,
      englishCourseUpdate: true,
      englishCourseDelete: true,
      englishCoursePublish: true,
      chineseCourseIndex: true,
      chineseCourseRead: true,
      chineseCourseCreate: true,
      chineseCourseUpdate: true,
      chineseCourseDelete: true,
      chineseCoursePublish: true,
      teacherSaveCreate: true,
      teacherSaveIndex: true,
      teacherSaveUpdate: true,
      teacherSaveDelete: true,
      teacherSavePublish: true,
      teacherSaveRead: true,

      productSaveCreate: true,
      productSaveUpdate: true,
      productSaveRead: true,
      productSaveIndex: true,
      productSaveDelete: true,
      productSavePublish: true,
      productImageSaveCreate: true,
      productImageSaveUpdate: true,
      productImageSaveRead: true,
      productImageSaveIndex: true,
      productImageSaveDelete: true,
      productImageSavePublish: true,

      newsUpdatesIndex: true,
      newsUpdatesRead: true,
      newsUpdatesCreate: true,
      newsUpdatesUpdate: true,
      newsUpdatesDelete: true,
      newsUpdatesPublish: true,

      contactUsIndex: true,
      contactUsRead: true,
      contactUsCreate: true,
      contactUsUpdate: true,
      contactUsDelete: true,
      contactUsPublish: true,

      taxSettingIndex: true,
      taxSettingRead: true,
      taxSettingCreate: true,
      taxSettingUpdate: true,
      taxSettingDelete: true,

      raceSettingIndex: true,
      raceSettingRead: true,
      raceSettingCreate: true,
      raceSettingUpdate: true,
      raceSettingDelete: true,

      countrySettingIndex: true,
      countrySettingRead: true,
      countrySettingCreate: true,
      countrySettingUpdate: true,
      countrySettingDelete: true,

      shgSettingIndex: true,
      shgSettingRead: true,
      shgSettingCreate: true,
      shgSettingUpdate: true,
      shgSettingDelete: true,

      batchtimeSettingIndex: true,
      batchtimeSettingRead: true,
      batchtimeSettingCreate: true,
      batchtimeSettingUpdate: true,
      batchtimeSettingDelete: true,

      leaveSettingIndex: true,
      leaveSettingRead: true,
      leaveSettingCreate: true,
      leaveSettingUpdate: true,
      leaveSettingDelete: true,

      idTypeSettingIndex: true,
      idTypeSettingRead: true,
      idTypeSettingCreate: true,
      idTypeSettingUpdate: true,
      idTypeSettingDelete: true,

      salarySettingIndex: true,
      salarySettingRead: true,
      salarySettingCreate: true,
      salarySettingUpdate: true,
      salarySettingDelete: true,

      blogIndex: true,
      blogRead: true,
      blogCreate: true,
      blogUpdate: true,
      blogDelete: true,
      blogPublish: true,

      contactUsSettingIndex: true,
      contactUsSettingRead: true,
      contactUsSettingCreate: true,
      contactUsSettingUpdate: true,
      contactUsSettingDelete: true,
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      console.log("Api Data:", values);
      const payload = {
        ...values,
      };

      //   try {
      //     // const response = await api.put(`/updateRoleInfo/${role}`, payload, {
      //     const response = await api.put(`/updateRoleInfo`, payload, {
      //       headers: {
      //         "Content-Type": "application/json",
      //       },
      //     });
      //     if (response.status === 200) {
      //       toast.success(response.data.message);
      //     } else {
      //       toast.error(response.data.message);
      //     }
      //   } catch (error) {
      //     toast.error(error);
      //   }
    },
  });

  const handleCheckboxChange = (fieldName) => {
    return (event) => {
      formik.setFieldValue(fieldName, event.target.checked);
    };
  };

  return (
    <div className="container-fluid">
      <form
        onSubmit={formik.handleSubmit}
        onKeyDown={(e) => {
          if (e.key === "Enter" && !formik.isSubmitting) {
            e.preventDefault();
          }
        }}
      >
        <div
          className="card shadow border-0 mb-2 top-header"
          style={{ borderRadius: "0" }}
        >
          <div className="container-fluid py-4">
            <div className="row align-items-center">
              <div className="col">
                <div className="d-flex align-items-center gap-4">
                  <h1 className="h4 ls-tight headingColor">Add Roles</h1>
                </div>
              </div>
              <div className="col-auto">
                <div className="hstack gap-2 justify-content-end">
                  <Link to="/roles">
                    <button type="button" className="btn btn-sm btn-light">
                      <span>Back</span>
                    </button>
                  </Link>
                  <button
                    type="submit"
                    className="btn btn-sm btn-primary"
                    disabled={loading}
                  >
                    {loading ? (
                      <span
                        className="spinner-border spinner-border-sm"
                        aria-hidden="false"
                      ></span>
                    ) : (
                      <span>Save</span>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="card">
          <div className="row d-flex align-items-start p-2">
            <div className="col-md-7 col-12">
              <lable className="form-lable">
                User Role <span className="text-danger">*</span>
              </lable>
              <div className="input-group mb-3">
                <select
                  className="form-select form-select-sm iconInput "
                  aria-label="Default select example"
                  //   onChange={handleRoleChange}
                >
                  <option value="1">Admin</option>
                  <option value="2">Branch Admin</option>
                  <option value="4">Staff</option>
                  <option value="5">Staff Admin</option>
                  <option value="6">Teacher</option>
                  <option value="7">Centre Manager</option>
                  <option value="8">Freelancer</option>
                </select>
              </div>
            </div>
            {/* <div className="col-md-5 col-12 d-flex justify-content-end">
              <button type="submit" className="btn btn-button btn-sm ">
                Save
              </button>
            </div> */}
          </div>
          <div>
            <div className="row">
              <div className="clo-12">
                <div className="table-responsive">
                  <div
                    id="datatable"
                    style={{ maxHeight: "460px", overflowY: "auto" }}
                  >
                    <table class="table table-permission table-striped">
                      <thead className="thead-light">
                        <tr>
                          <th scope="col" className="cms-header">
                            Module Permission
                          </th>
                          <th scope="col" className="cms-header">
                            Show
                          </th>
                          <th scope="col" className="cms-header">
                            Hide
                          </th>
                          {/* <th scope="col" className="cms-header">
                            Create
                          </th>
                          <th scope="col" className="cms-header">
                            Update
                          </th>
                          <th scope="col" className="cms-header">
                            Delete
                          </th> */}
                        </tr>
                      </thead>
                      <tbody>
                        {/* Course  */}
                        <tr>
                          <th colspan="6">Course Management</th>
                        </tr>
                        <tr>
                          <td>
                            <p
                              style={{
                                marginLeft: "30px",
                                marginBottom: "0px",
                              }}
                            >
                              Course
                            </p>
                          </td>
                          <td>
                            <input
                              className="form-check-input"
                              type="checkbox"
                              name="courseIndex"
                              checked={formik.values.courseIndex}
                              onChange={handleCheckboxChange(`courseIndex`)}
                            />
                          </td>
                          <td>
                            <input
                              className="form-check-input"
                              type="checkbox"
                              name="courseRead"
                              checked={formik.values.courseRead}
                              onChange={handleCheckboxChange(`courseRead`)}
                            />
                          </td>
                        </tr>
                        <tr>
                          <td>
                            <p
                              style={{
                                marginLeft: "30px",
                                marginBottom: "0px",
                              }}
                            >
                              Class
                            </p>
                          </td>
                          <td>
                            <input
                              className="form-check-input"
                              type="checkbox"
                              name="classIndex"
                              checked={formik.values.classIndex}
                              onChange={handleCheckboxChange(`classIndex`)}
                            />
                          </td>
                          <td>
                            <input
                              className="form-check-input"
                              type="checkbox"
                              name="classRead"
                              checked={formik.values.classRead}
                              onChange={handleCheckboxChange(`classRead`)}
                            />
                          </td>
                        </tr>
                        <tr>
                          <td>
                            <p
                              style={{
                                marginLeft: "30px",
                                marginBottom: "0px",
                              }}
                            >
                              Level
                            </p>
                          </td>
                          <td>
                            <input
                              className="form-check-input"
                              type="checkbox"
                              name="levelIndex"
                              checked={formik.values.levelIndex}
                              onChange={handleCheckboxChange(`levelIndex`)}
                            />
                          </td>
                        </tr>
                        <tr>
                          <td>
                            <p
                              style={{
                                marginLeft: "30px",
                                marginBottom: "0px",
                              }}
                            >
                              Subject
                            </p>
                          </td>
                          <td>
                            <input
                              className="form-check-input"
                              type="checkbox"
                              name="subjectIndex"
                              checked={formik.values.subjectIndex}
                              onChange={handleCheckboxChange(`subjectIndex`)}
                            />
                          </td>
                          <td>
                            <input
                              className="form-check-input"
                              type="checkbox"
                              name="subjectRead"
                              checked={formik.values.subjectRead}
                              onChange={handleCheckboxChange(`subjectRead`)}
                            />
                          </td>
                        </tr>
                        <tr>
                          <td>
                            <p
                              style={{
                                marginLeft: "30px",
                                marginBottom: "0px",
                              }}
                            >
                              Curriculum
                            </p>
                          </td>
                          <td>
                            <input
                              className="form-check-input"
                              type="checkbox"
                              name="curriculumIndex"
                              checked={formik.values.curriculumIndex}
                              onChange={handleCheckboxChange(`curriculumIndex`)}
                            />
                          </td>
                          <td>
                            <input
                              className="form-check-input"
                              type="checkbox"
                              name="curriculumRead"
                              checked={formik.values.curriculumRead}
                              onChange={handleCheckboxChange(`curriculumRead`)}
                            />
                          </td>
                        </tr>
                        <tr>
                          <td>
                            <p
                              style={{
                                marginLeft: "30px",
                                marginBottom: "0px",
                              }}
                            >
                              Course Fees
                            </p>
                          </td>
                          <td>
                            <input
                              className="form-check-input"
                              type="checkbox"
                              name="courseFeesIndex"
                              checked={formik.values.courseFeesIndex}
                              onChange={handleCheckboxChange(`courseFeesIndex`)}
                            />
                          </td>
                          <td>
                            <input
                              className="form-check-input"
                              type="checkbox"
                              name="courseFeesRead"
                              checked={formik.values.courseFeesRead}
                              onChange={handleCheckboxChange(`courseFeesRead`)}
                            />
                          </td>
                        </tr>
                        <tr>
                          <td>
                            <p
                              style={{
                                marginLeft: "30px",
                                marginBottom: "0px",
                              }}
                            >
                              Course Deposit Fees
                            </p>
                          </td>
                          <td>
                            <input
                              className="form-check-input"
                              type="checkbox"
                              name="courseDepositFeesIndex"
                              checked={formik.values.courseDepositFeesIndex}
                              onChange={handleCheckboxChange(
                                `courseDepositFeesIndex`
                              )}
                            />
                          </td>
                          <td>
                            <input
                              className="form-check-input"
                              type="checkbox"
                              name="courseDepositFeesRead"
                              checked={formik.values.courseDepositFeesRead}
                              onChange={handleCheckboxChange(
                                `courseDepositFeesRead`
                              )}
                            />
                          </td>
                        </tr>
                        {/* {Curriculum Outline} */}
                        <tr>
                          <td>
                            <p
                              style={{
                                marginLeft: "30px",
                                marginBottom: "0px",
                              }}
                            >
                              Curriculum Outline{" "}
                            </p>
                          </td>
                          <td>
                            <input
                              className="form-check-input"
                              type="checkbox"
                              name="curriculumOutlineIndex"
                              checked={formik.values.curriculumOutlineIndex}
                              onChange={handleCheckboxChange(
                                `curriculumOutlineIndex`
                              )}
                            />
                          </td>
                          <td>
                            <input
                              className="form-check-input"
                              type="checkbox"
                              name="curriculumOutlineRead"
                              checked={formik.values.curriculumOutlineRead}
                              onChange={handleCheckboxChange(
                                `curriculumOutlineRead`
                              )}
                            />
                          </td>
                        </tr>
                        {/* Center  */}
                        <tr>
                          <th colspan="6">Center Management</th>
                        </tr>
                        <tr>
                          <td>
                            <p
                              style={{
                                marginLeft: "30px",
                                marginBottom: "0px",
                              }}
                            >
                              Center Listing
                            </p>
                          </td>
                          <td>
                            <input
                              className="form-check-input"
                              type="checkbox"
                              name="centerListingIndex"
                              checked={formik.values.centerListingIndex}
                              onChange={handleCheckboxChange(
                                `centerListingIndex`
                              )}
                            />
                          </td>
                          <td>
                            <input
                              className="form-check-input"
                              type="checkbox"
                              name="centerListingRead"
                              checked={formik.values.centerListingRead}
                              onChange={handleCheckboxChange(
                                `centerListingRead`
                              )}
                            />
                          </td>
                        </tr>
                        {/* Lead Management  */}
                        <tr>
                          <th colspan="6">Lead Management</th>
                        </tr>
                        <tr>
                          <td>
                            <p
                              style={{
                                marginLeft: "30px",
                                marginBottom: "0px",
                              }}
                            >
                              Lead Listing
                            </p>
                          </td>
                          <td>
                            <input
                              className="form-check-input"
                              type="checkbox"
                              name="leadListingIndex"
                              checked={formik.values.leadListingIndex}
                              onChange={handleCheckboxChange(
                                `leadListingIndex`
                              )}
                            />
                          </td>
                          <td>
                            <input
                              className="form-check-input"
                              type="checkbox"
                              name="leadListingRead"
                              checked={formik.values.leadListingRead}
                              onChange={handleCheckboxChange(`leadListingRead`)}
                            />
                          </td>
                        </tr>

                        {/* User Management  */}
                        <tr>
                          <th colspan="6">User Management</th>
                        </tr>
                        <tr>
                          <td>
                            <p
                              style={{
                                marginLeft: "30px",
                                marginBottom: "0px",
                              }}
                            >
                              Staff
                            </p>
                          </td>
                          <td>
                            <input
                              className="form-check-input"
                              type="checkbox"
                              name="staffIndex"
                              checked={formik.values.staffIndex}
                              onChange={handleCheckboxChange(`staffIndex`)}
                            />
                          </td>
                          <td>
                            <input
                              className="form-check-input"
                              type="checkbox"
                              name="staffRead"
                              checked={formik.values.staffRead}
                              onChange={handleCheckboxChange(`staffRead`)}
                            />
                          </td>
                        </tr>
                        <tr>
                          <td>
                            <p
                              style={{
                                marginLeft: "30px",
                                marginBottom: "0px",
                              }}
                            >
                              Teacher
                            </p>
                          </td>
                          <td>
                            <input
                              className="form-check-input"
                              type="checkbox"
                              name="teacherIndex"
                              checked={formik.values.teacherIndex}
                              onChange={handleCheckboxChange(`teacherIndex`)}
                            />
                          </td>
                          <td>
                            <input
                              className="form-check-input"
                              type="checkbox"
                              name="teacherRead"
                              checked={formik.values.teacherRead}
                              onChange={handleCheckboxChange(`teacherRead`)}
                            />
                          </td>
                        </tr>
                        <tr>
                          <td>
                            <p
                              style={{
                                marginLeft: "30px",
                                marginBottom: "0px",
                              }}
                            >
                              Staffing Attendance
                            </p>
                          </td>
                          <td>
                            <input
                              className="form-check-input"
                              type="checkbox"
                              name="staffAttendanceIndex"
                              checked={formik.values.staffAttendanceIndex}
                              onChange={handleCheckboxChange(
                                `staffAttendanceIndex`
                              )}
                            />
                          </td>
                          <td>
                            <input
                              className="form-check-input"
                              type="checkbox"
                              name="staffAttendanceRead"
                              checked={formik.values.staffAttendanceRead}
                              onChange={handleCheckboxChange(
                                `staffAttendanceRead`
                              )}
                            />
                          </td>
                        </tr>

                        <tr>
                          <td>
                            <p
                              style={{
                                marginLeft: "30px",
                                marginBottom: "0px",
                              }}
                            >
                              Leave
                            </p>
                          </td>
                          <td>
                            <input
                              className="form-check-input"
                              type="checkbox"
                              name="leaveAdminIndex"
                              checked={formik.values.leaveAdminIndex}
                              onChange={handleCheckboxChange(`leaveAdminIndex`)}
                            />
                          </td>
                          <td>
                            <input
                              className="form-check-input"
                              type="checkbox"
                              name="leaveAdminceRead"
                              checked={formik.values.leaveAdminRead}
                              onChange={handleCheckboxChange(`leaveAdminRead`)}
                            />
                          </td>
                        </tr>

                        <tr>
                          <td>
                            <p
                              style={{
                                marginLeft: "30px",
                                marginBottom: "0px",
                              }}
                            >
                              Leave Request
                            </p>
                          </td>
                          <td>
                            <input
                              className="form-check-input"
                              type="checkbox"
                              name="leaveIndex"
                              checked={formik.values.leaveIndex}
                              onChange={handleCheckboxChange(`leaveIndex`)}
                            />
                          </td>
                          <td>
                            <input
                              className="form-check-input"
                              type="checkbox"
                              name="leaveRead"
                              checked={formik.values.leaveRead}
                              onChange={handleCheckboxChange}
                            />
                          </td>
                        </tr>

                        <tr>
                          <td>
                            <p
                              style={{
                                marginLeft: "30px",
                                marginBottom: "0px",
                              }}
                            >
                              Holiday
                            </p>
                          </td>
                          <td>
                            <input
                              className="form-check-input"
                              type="checkbox"
                              name="holidayIndex"
                              checked={formik.values.holidayIndex}
                              onChange={handleCheckboxChange(`holidayIndex`)}
                            />
                          </td>
                          <td>
                            <input
                              className="form-check-input"
                              type="checkbox"
                              name="holidayRead"
                              checked={formik.values.holidayRead}
                              onChange={handleCheckboxChange(`holidayRead`)}
                            />
                          </td>
                        </tr>

                        <tr>
                          <td>
                            <p
                              style={{
                                marginLeft: "30px",
                                marginBottom: "0px",
                              }}
                            >
                              Deduction
                            </p>
                          </td>
                          <td>
                            <input
                              className="form-check-input"
                              type="checkbox"
                              name="deductionIndex"
                              checked={formik.values.deductionIndex}
                              onChange={handleCheckboxChange(`deductionIndex`)}
                            />
                          </td>
                          <td>
                            <input
                              className="form-check-input"
                              type="checkbox"
                              name="deductionRead"
                              checked={formik.values.deductionRead}
                              onChange={handleCheckboxChange(`deductionRead`)}
                            />
                          </td>
                        </tr>

                        <tr>
                          <td>
                            <p
                              style={{
                                marginLeft: "30px",
                                marginBottom: "0px",
                              }}
                            >
                              Payroll
                            </p>
                          </td>
                          <td>
                            <input
                              className="form-check-input"
                              type="checkbox"
                              name="payrollIndex"
                              checked={formik.values.payrollIndex}
                              onChange={handleCheckboxChange(`payrollIndex`)}
                            />
                          </td>
                          <td>
                            <input
                              className="form-check-input"
                              type="checkbox"
                              name="payrollRead"
                              checked={formik.values.payrollRead}
                              onChange={handleCheckboxChange(`payrollRead`)}
                            />
                          </td>
                        </tr>

                        <tr>
                          <td>
                            <p
                              style={{
                                marginLeft: "30px",
                                marginBottom: "0px",
                              }}
                            >
                              Payslip
                            </p>
                          </td>
                          <td>
                            <input
                              className="form-check-input"
                              type="checkbox"
                              name="payslipIndex"
                              checked={formik.values.payslipIndex}
                              onChange={handleCheckboxChange(`payslipIndex`)}
                            />
                          </td>
                          <td>
                            <input
                              className="form-check-input"
                              type="checkbox"
                              name="payslipIndex"
                              checked={formik.values.payslipIndex}
                              onChange={handleCheckboxChange(`payslipIndex`)}
                            />
                          </td>
                        </tr>
                        <tr>
                          <td>
                            <p
                              style={{
                                marginLeft: "30px",
                                marginBottom: "0px",
                              }}
                            >
                              Freelancer Invoice
                            </p>
                          </td>
                          <td>
                            <input
                              className="form-check-input"
                              type="checkbox"
                              name="freeLancerIndex"
                              checked={formik.values.freeLancerIndex}
                              onChange={handleCheckboxChange(`freeLancerIndex`)}
                            />
                          </td>
                          <td>
                            <input
                              className="form-check-input"
                              type="checkbox"
                              name="freeLancerRead"
                              checked={formik.values.freeLancerRead}
                              onChange={handleCheckboxChange(`freeLancerRead`)}
                            />
                          </td>
                        </tr>
                        <tr>
                          <td>
                            <p
                              style={{
                                marginLeft: "30px",
                                marginBottom: "0px",
                              }}
                            >
                              Leave Request
                            </p>
                          </td>
                          <td>
                            <input
                              className="form-check-input"
                              type="checkbox"
                              name="leaveRequestIndex"
                              checked={formik.values.leaveRequestIndex}
                              onChange={handleCheckboxChange(
                                `leaveRequestIndex`
                              )}
                            />
                          </td>
                          <td>
                            <input
                              className="form-check-input"
                              type="checkbox"
                              name="leaveRequestRead"
                              checked={formik.values.leaveRequestRead}
                              onChange={handleCheckboxChange(
                                `leaveRequestRead`
                              )}
                            />
                          </td>
                        </tr>

                        {/* Student Management  */}
                        <tr>
                          <th colspan="6">Student Management</th>
                        </tr>
                        <tr>
                          <td>
                            <p
                              style={{
                                marginLeft: "30px",
                                marginBottom: "0px",
                              }}
                            >
                              Student Listing
                            </p>
                          </td>
                          <td>
                            <input
                              className="form-check-input"
                              type="checkbox"
                              name="studentListingIndex"
                              checked={formik.values.studentListingIndex}
                              onChange={handleCheckboxChange(
                                `studentListingIndex`
                              )}
                            />
                          </td>
                          <td>
                            <input
                              className="form-check-input"
                              type="checkbox"
                              name="studentListingRead"
                              checked={formik.values.studentListingRead}
                              onChange={handleCheckboxChange(
                                `studentListingRead`
                              )}
                            />
                          </td>
                        </tr>
                        <tr>
                          <td>
                            <p
                              style={{
                                marginLeft: "30px",
                                marginBottom: "0px",
                              }}
                            >
                              Attendance
                            </p>
                          </td>
                          <td>
                            <input
                              className="form-check-input"
                              type="checkbox"
                              name="attendanceIndex"
                              checked={formik.values.attendanceIndex}
                              onChange={handleCheckboxChange(`attendanceIndex`)}
                            />
                          </td>
                          <td>
                            <input
                              className="form-check-input"
                              type="checkbox"
                              name="attendanceRead"
                              checked={formik.values.attendanceRead}
                              onChange={handleCheckboxChange}
                            />
                          </td>
                        </tr>
                        <tr>
                          <td>
                            <p
                              style={{
                                marginLeft: "30px",
                                marginBottom: "0px",
                              }}
                            >
                              Change Class
                            </p>
                          </td>
                          <td>
                            <input
                              className="form-check-input"
                              type="checkbox"
                              name="studentListingIdex"
                              checked={formik.values.studentListingIdex}
                              onChange={handleCheckboxChange(
                                `studentListingIdex`
                              )}
                            />
                          </td>
                          <td>
                            <input
                              className="form-check-input"
                              type="checkbox"
                              name="studentListingRead"
                              checked={formik.values.studentListingRead}
                              onChange={handleCheckboxChange}
                            />
                          </td>
                        </tr>
                        <tr>
                          <td>
                            <p
                              style={{
                                marginLeft: "30px",
                                marginBottom: "0px",
                              }}
                            >
                              Transfer Out
                            </p>
                          </td>
                          <td>
                            <input
                              className="form-check-input"
                              type="checkbox"
                              name="studentListingIdex"
                              checked={formik.values.studentListingIdex}
                              onChange={handleCheckboxChange(
                                `studentListingIdex`
                              )}
                            />
                          </td>
                          <td>
                            <input
                              className="form-check-input"
                              type="checkbox"
                              name="studentListingRead"
                              checked={formik.values.studentListingRead}
                              onChange={handleCheckboxChange}
                            />
                          </td>
                        </tr>
                        <tr>
                          <td>
                            <p
                              style={{
                                marginLeft: "30px",
                                marginBottom: "0px",
                              }}
                            >
                              Withdraw
                            </p>
                          </td>
                          <td>
                            <input
                              className="form-check-input"
                              type="checkbox"
                              name="studentListingIdex"
                              checked={formik.values.studentListingIdex}
                              onChange={handleCheckboxChange(
                                `studentListingIdex`
                              )}
                            />
                          </td>
                          <td>
                            <input
                              className="form-check-input"
                              type="checkbox"
                              name="studentListingRead"
                              checked={formik.values.studentListingRead}
                              onChange={handleCheckboxChange}
                            />
                          </td>
                        </tr>
                        <tr>
                          <td>
                            <p
                              style={{
                                marginLeft: "30px",
                                marginBottom: "0px",
                              }}
                            >
                              End Class
                            </p>
                          </td>
                          <td>
                            <input
                              className="form-check-input"
                              type="checkbox"
                              name="studentListingIdex"
                              checked={formik.values.studentListingIdex}
                              onChange={handleCheckboxChange(
                                `studentListingIdex`
                              )}
                            />
                          </td>
                          <td>
                            <input
                              className="form-check-input"
                              type="checkbox"
                              name="studentListingRead"
                              checked={formik.values.studentListingRead}
                              onChange={handleCheckboxChange}
                            />
                          </td>
                        </tr>
                        <tr>
                          <td>
                            <p
                              style={{
                                marginLeft: "30px",
                                marginBottom: "0px",
                              }}
                            >
                              Register New Course
                            </p>
                          </td>
                          <td>
                            <input
                              className="form-check-input"
                              type="checkbox"
                              name="studentListingIdex"
                              checked={formik.values.studentListingIdex}
                              onChange={handleCheckboxChange(
                                `studentListingIdex`
                              )}
                            />
                          </td>
                          <td>
                            <input
                              className="form-check-input"
                              type="checkbox"
                              name="studentListingRead"
                              checked={formik.values.studentListingRead}
                              onChange={handleCheckboxChange}
                            />
                          </td>
                        </tr>
                        <tr>
                          <td>
                            <p
                              style={{
                                marginLeft: "30px",
                                marginBottom: "0px",
                              }}
                            >
                              Deduct Deposit
                            </p>
                          </td>
                          <td>
                            <input
                              className="form-check-input"
                              type="checkbox"
                              name="studentListingIdex"
                              checked={formik.values.studentListingIdex}
                              onChange={handleCheckboxChange(
                                `studentListingIdex`
                              )}
                            />
                          </td>
                          <td>
                            <input
                              className="form-check-input"
                              type="checkbox"
                              name="studentListingRead"
                              checked={formik.values.studentListingRead}
                              onChange={handleCheckboxChange}
                            />
                          </td>
                        </tr>
                        {/* Document Management  */}
                        <tr>
                          <th colspan="6">Document Management</th>
                        </tr>
                        <tr>
                          <td>
                            <p
                              style={{
                                marginLeft: "30px",
                                marginBottom: "0px",
                              }}
                            >
                              Document Listing
                            </p>
                          </td>
                          <td>
                            <input
                              className="form-check-input"
                              type="checkbox"
                              name="documentListingIndex"
                              checked={formik.values.documentListingIndex}
                              onChange={handleCheckboxChange(
                                `documentListingIndex`
                              )}
                            />
                          </td>
                          <td>
                            <input
                              className="form-check-input"
                              type="checkbox"
                              name="documentListingRead"
                              checked={formik.values.documentListingRead}
                              onChange={handleCheckboxChange(
                                `documentListingRead`
                              )}
                            />
                          </td>
                        </tr>
                        <tr>
                          <td>
                            <p
                              style={{
                                marginLeft: "30px",
                                marginBottom: "0px",
                              }}
                            >
                              Document File
                            </p>
                          </td>
                          <td>
                            <input
                              className="form-check-input"
                              type="checkbox"
                              name="documentFileIndex"
                              checked={formik.values.documentFileIndex}
                              onChange={handleCheckboxChange(
                                `documentFileIndex`
                              )}
                            />
                          </td>
                          <td>
                            <input
                              className="form-check-input"
                              type="checkbox"
                              name="documentFileIdex"
                              checked={formik.values.documentFileIdex}
                              onChange={handleCheckboxChange}
                            />
                          </td>
                        </tr>
                        {/* Invoice Management  */}
                        <tr>
                          <th colspan="6">Invoice and Payment</th>
                        </tr>
                        <tr>
                          <td>
                            <p
                              style={{
                                marginLeft: "30px",
                                marginBottom: "0px",
                              }}
                            >
                              Invoice
                            </p>
                          </td>
                          <td>
                            <input
                              className="form-check-input"
                              type="checkbox"
                              name="invoiceIndex"
                              checked={formik.values.invoiceIndex}
                              onChange={handleCheckboxChange(`invoiceIndex`)}
                            />
                          </td>
                          <td>
                            <input
                              className="form-check-input"
                              type="checkbox"
                              name="invoiceRead"
                              checked={formik.values.invoiceRead}
                              onChange={handleCheckboxChange(`invoiceRead`)}
                            />
                          </td>
                        </tr>
                        <tr>
                          <td>
                            <p
                              style={{
                                marginLeft: "30px",
                                marginBottom: "0px",
                              }}
                            >
                              Payment
                            </p>
                          </td>
                          <td>
                            <input
                              className="form-check-input"
                              type="checkbox"
                              name="paymentIndex"
                              checked={formik.values.paymentIndex}
                              onChange={handleCheckboxChange(`paymentIndex`)}
                            />
                          </td>
                          <td>
                            <input
                              className="form-check-input"
                              type="checkbox"
                              name="invoiceRead"
                              checked={formik.values.invoiceRead}
                              onChange={handleCheckboxChange(`paymentIndex`)}
                            />
                          </td>
                        </tr>
                        {/* Time Schedule attendance */}
                        <tr>
                          <th colspan="6">Time Schedule Teacher</th>
                        </tr>
                        <tr>
                          <td>
                            <p
                              style={{
                                marginLeft: "30px",
                                marginBottom: "0px",
                              }}
                            >
                              Schedule Teacher
                            </p>
                          </td>
                          <td>
                            <input
                              className="form-check-input"
                              type="checkbox"
                              name="scheduleTeacherIndex"
                              checked={formik.values.scheduleTeacherIndex}
                              onChange={handleCheckboxChange(
                                `scheduleTeacherIndex`
                              )}
                            />
                          </td>
                          <td>
                            <input
                              className="form-check-input"
                              type="checkbox"
                              name="scheduleTeacherRead"
                              checked={formik.values.scheduleTeacherRead}
                              onChange={handleCheckboxChange(
                                `scheduleTeacherRead`
                              )}
                            />
                          </td>
                        </tr>

                        {/* Report Management  */}
                        <tr>
                          <th colspan="6">Report Management</th>
                        </tr>
                        <tr>
                          <td>
                            <p
                              style={{
                                marginLeft: "30px",
                                marginBottom: "0px",
                              }}
                            >
                              Document Report
                            </p>
                          </td>
                          <td>
                            <input
                              className="form-check-input"
                              type="checkbox"
                              name="documentReportIndex"
                              checked={formik.values.documentReportIndex}
                              onChange={handleCheckboxChange(
                                `documentReportIndex`
                              )}
                            />
                          </td>
                          <td>
                            <input
                              className="form-check-input"
                              type="checkbox"
                              name="documentReportRead"
                              checked={formik.values.documentReportRead}
                              onChange={handleCheckboxChange(
                                `documentReportRead`
                              )}
                            />
                          </td>
                        </tr>

                        <tr>
                          <td>
                            <p
                              style={{
                                marginLeft: "30px",
                                marginBottom: "0px",
                              }}
                            >
                              Attendance Report
                            </p>
                          </td>
                          <td>
                            <input
                              className="form-check-input"
                              type="checkbox"
                              name="attendanceReportIndex"
                              checked={formik.values.attendanceReportIndex}
                              onChange={handleCheckboxChange(
                                `attendanceReportIndex`
                              )}
                            />
                          </td>
                          <td>
                            <input
                              className="form-check-input"
                              type="checkbox"
                              name="attendanceReportRead"
                              checked={formik.values.attendanceReportRead}
                              onChange={handleCheckboxChange}
                            />
                          </td>
                        </tr>
                        <tr>
                          <td>
                            <p
                              style={{
                                marginLeft: "30px",
                                marginBottom: "0px",
                              }}
                            >
                              Student Report
                            </p>
                          </td>
                          <td>
                            <input
                              className="form-check-input"
                              type="checkbox"
                              name="studentReportIndex"
                              checked={formik.values.studentReportIndex}
                              onChange={handleCheckboxChange(
                                `studentReportIndex`
                              )}
                            />
                          </td>
                          <td>
                            <input
                              className="form-check-input"
                              type="checkbox"
                              name="studentReportRead"
                              checked={formik.values.studentReportRead}
                              onChange={handleCheckboxChange}
                            />
                          </td>
                        </tr>
                        <tr>
                          <td>
                            <p
                              style={{
                                marginLeft: "30px",
                                marginBottom: "0px",
                              }}
                            >
                              Assessment Report
                            </p>
                          </td>
                          <td>
                            <input
                              className="form-check-input"
                              type="checkbox"
                              name="assessmentReportIndex"
                              checked={formik.values.assessmentReportIndex}
                              onChange={handleCheckboxChange(
                                `assessmentReportIndex`
                              )}
                            />
                          </td>
                          <td>
                            <input
                              className="form-check-input"
                              type="checkbox"
                              name="assessmentReportRead"
                              checked={formik.values.assessmentReportRead}
                              onChange={handleCheckboxChange}
                            />
                          </td>
                        </tr>
                        <tr>
                          <td>
                            <p
                              style={{
                                marginLeft: "30px",
                                marginBottom: "0px",
                              }}
                            >
                              Enrollment Report
                            </p>
                          </td>
                          <td>
                            <input
                              className="form-check-input"
                              type="checkbox"
                              name="enrollmentReportIndex"
                              checked={formik.values.enrollmentReportIndex}
                              onChange={handleCheckboxChange(
                                `enrollmentReportIndex`
                              )}
                            />
                          </td>
                          <td>
                            <input
                              className="form-check-input"
                              type="checkbox"
                              name="enrollmentReportRead"
                              checked={formik.values.enrollmentReportRead}
                              onChange={handleCheckboxChange}
                            />
                          </td>
                        </tr>
                        <tr>
                          <td>
                            <p
                              style={{
                                marginLeft: "30px",
                                marginBottom: "0px",
                              }}
                            >
                              Fee Collection Report
                            </p>
                          </td>
                          <td>
                            <input
                              className="form-check-input"
                              type="checkbox"
                              name="feeCollectionReportIndex"
                              checked={formik.values.feeCollectionReportIndex}
                              onChange={handleCheckboxChange(
                                `feeCollectionReportIndex`
                              )}
                            />
                          </td>
                          <td>
                            <input
                              className="form-check-input"
                              type="checkbox"
                              name="feeCollectionReportRead"
                              checked={formik.values.feeCollectionReportRead}
                              onChange={handleCheckboxChange}
                            />
                          </td>
                        </tr>
                        <tr>
                          <td>
                            <p
                              style={{
                                marginLeft: "30px",
                                marginBottom: "0px",
                              }}
                            >
                              Package Balance Report
                            </p>
                          </td>
                          <td>
                            <input
                              className="form-check-input"
                              type="checkbox"
                              name="packageBalanceReportIndex"
                              checked={formik.values.packageBalanceReportIndex}
                              onChange={handleCheckboxChange(
                                `packageBalanceReportIndex`
                              )}
                            />
                          </td>
                          <td>
                            <input
                              className="form-check-input"
                              type="checkbox"
                              name="packageBalanceReportRead"
                              checked={formik.values.packageBalanceReportRead}
                              onChange={handleCheckboxChange}
                            />
                          </td>
                        </tr>
                        <tr>
                          <td>
                            <p
                              style={{
                                marginLeft: "30px",
                                marginBottom: "0px",
                              }}
                            >
                              Sales Revenue Report
                            </p>
                          </td>
                          <td>
                            <input
                              className="form-check-input"
                              type="checkbox"
                              name="salesRevenueReportIndex"
                              checked={formik.values.salesRevenueReportIndex}
                              onChange={handleCheckboxChange(
                                `salesRevenueReportIndex`
                              )}
                            />
                          </td>
                          <td>
                            <input
                              className="form-check-input"
                              type="checkbox"
                              name="salesRevenueReportRead"
                              checked={formik.values.salesRevenueReportRead}
                              onChange={handleCheckboxChange}
                            />
                          </td>
                        </tr>
                        <tr>
                          <td>
                            <p
                              style={{
                                marginLeft: "30px",
                                marginBottom: "0px",
                              }}
                            >
                              Replace Class Lesson List
                            </p>
                          </td>
                          <td>
                            <input
                              className="form-check-input"
                              type="checkbox"
                              name="replaceClassLessonListIndex"
                              checked={
                                formik.values.replaceClassLessonListIndex
                              }
                              onChange={handleCheckboxChange(
                                `replaceClassLessonListIndex`
                              )}
                            />
                          </td>
                          <td>
                            <input
                              className="form-check-input"
                              type="checkbox"
                              name="replaceClassLessonListRead"
                              checked={formik.values.replaceClassLessonListRead}
                              onChange={handleCheckboxChange}
                            />
                          </td>
                        </tr>

                        {/* Send Notification */}
                        <tr>
                          <th colspan="6">Messaging</th>
                        </tr>
                        <tr>
                          <td>
                            <p
                              style={{
                                marginLeft: "30px",
                                marginBottom: "0px",
                              }}
                            >
                              School Announcement
                            </p>
                          </td>
                          <td>
                            <input
                              className="form-check-input"
                              type="checkbox"
                              name="sendNotificationIndex"
                              checked={formik.values.sendNotificationIndex}
                              onChange={handleCheckboxChange(
                                `sendNotificationIndex`
                              )}
                            />
                          </td>
                          <td>
                            <input
                              className="form-check-input"
                              type="checkbox"
                              name="sendNotificationRead"
                              checked={formik.values.sendNotificationRead}
                              onChange={handleCheckboxChange(
                                `sendNotificationRead`
                              )}
                            />
                          </td>
                        </tr>

                        <tr>
                          <td>
                            <p
                              style={{
                                marginLeft: "30px",
                                marginBottom: "0px",
                              }}
                            >
                              My Messaging
                            </p>
                          </td>
                          <td>
                            <input
                              className="form-check-input"
                              type="checkbox"
                              name="smsMessageIndex"
                              checked={formik.values.smsMessageIndex}
                              onChange={handleCheckboxChange(`smsMessageIndex`)}
                            />
                          </td>
                          <td>
                            <input
                              className="form-check-input"
                              type="checkbox"
                              name="smsMessageRead"
                              checked={formik.values.smsMessageRead}
                              onChange={handleCheckboxChange(`smsMessageRead`)}
                            />
                          </td>
                        </tr>

                        <tr>
                          <td>
                            <p
                              style={{
                                marginLeft: "30px",
                                marginBottom: "0px",
                              }}
                            >
                              Other Messages
                            </p>
                          </td>
                          <td>
                            <input
                              className="form-check-input"
                              type="checkbox"
                              name="smsMessageIndex"
                              checked={formik.values.smsMessageIndex}
                              onChange={handleCheckboxChange(`smsMessageIndex`)}
                            />
                          </td>
                          <td>
                            <input
                              className="form-check-input"
                              type="checkbox"
                              name="smsMessageRead"
                              checked={formik.values.smsMessageRead}
                              onChange={handleCheckboxChange(`smsMessageRead`)}
                            />
                          </td>
                        </tr>

                        {/* Settings */}
                        <tr>
                          <th colspan="6">Settings</th>
                        </tr>
                        <tr>
                          <td>
                            <p
                              style={{
                                marginLeft: "30px",
                                marginBottom: "0px",
                              }}
                            >
                              Tax
                            </p>
                          </td>
                          <td>
                            <input
                              className="form-check-input"
                              type="checkbox"
                              name="taxSettingIndex"
                              checked={formik.values.taxSettingIndex}
                              onChange={handleCheckboxChange(`taxSettingIndex`)}
                            />
                          </td>
                          <td>
                            <input
                              className="form-check-input"
                              type="checkbox"
                              name="taxSettingRead"
                              checked={formik.values.taxSettingRead}
                              onChange={handleCheckboxChange(`taxSettingRead`)}
                            />
                          </td>
                        </tr>
                        <tr>
                          <td>
                            <p
                              style={{
                                marginLeft: "30px",
                                marginBottom: "0px",
                              }}
                            >
                              Race
                            </p>
                          </td>
                          <td>
                            <input
                              className="form-check-input"
                              type="checkbox"
                              name="raceSettingIndex"
                              checked={formik.values.raceSettingIndex}
                              onChange={handleCheckboxChange(
                                `raceSettingIndex`
                              )}
                            />
                          </td>
                          <td>
                            <input
                              className="form-check-input"
                              type="checkbox"
                              name="raceSettingRead"
                              checked={formik.values.raceSettingRead}
                              onChange={handleCheckboxChange(`raceSettingRead`)}
                            />
                          </td>
                        </tr>
                        <tr>
                          <td>
                            <p
                              style={{
                                marginLeft: "30px",
                                marginBottom: "0px",
                              }}
                            >
                              Country & Nationality
                            </p>
                          </td>
                          <td>
                            <input
                              className="form-check-input"
                              type="checkbox"
                              name="countrySettingIndex"
                              checked={formik.values.countrySettingIndex}
                              onChange={handleCheckboxChange(
                                `countrySettingIndex`
                              )}
                            />
                          </td>
                          <td>
                            <input
                              className="form-check-input"
                              type="checkbox"
                              name="countrySettingRead"
                              checked={formik.values.countrySettingRead}
                              onChange={handleCheckboxChange(
                                `countrySettingRead`
                              )}
                            />
                          </td>
                        </tr>
                        <tr>
                          <td>
                            <p
                              style={{
                                marginLeft: "30px",
                                marginBottom: "0px",
                              }}
                            >
                              SHG
                            </p>
                          </td>
                          <td>
                            <input
                              className="form-check-input"
                              type="checkbox"
                              name="shgSettingIndex"
                              checked={formik.values.shgSettingIndex}
                              onChange={handleCheckboxChange(`shgSettingIndex`)}
                            />
                          </td>
                          <td>
                            <input
                              className="form-check-input"
                              type="checkbox"
                              name="shgSettingRead"
                              checked={formik.values.shgSettingRead}
                              onChange={handleCheckboxChange(`shgSettingRead`)}
                            />
                          </td>
                        </tr>
                        <tr>
                          <td>
                            <p
                              style={{
                                marginLeft: "30px",
                                marginBottom: "0px",
                              }}
                            >
                              Batch Time
                            </p>
                          </td>
                          <td>
                            <input
                              className="form-check-input"
                              type="checkbox"
                              name="batchtimeSettingIndex"
                              checked={formik.values.batchtimeSettingIndex}
                              onChange={handleCheckboxChange(
                                `batchtimeSettingIndex`
                              )}
                            />
                          </td>
                          <td>
                            <input
                              className="form-check-input"
                              type="checkbox"
                              name="batchtimeSettingRead"
                              checked={formik.values.batchtimeSettingRead}
                              onChange={handleCheckboxChange(
                                `batchtimeSettingRead`
                              )}
                            />
                          </td>
                        </tr>
                        <tr>
                          <td>
                            <p
                              style={{
                                marginLeft: "30px",
                                marginBottom: "0px",
                              }}
                            >
                              Leave Type
                            </p>
                          </td>
                          <td>
                            <input
                              className="form-check-input"
                              type="checkbox"
                              name="leaveSettingIndex"
                              checked={formik.values.leaveSettingIndex}
                              onChange={handleCheckboxChange(
                                `leaveSettingIndex`
                              )}
                            />
                          </td>
                          <td>
                            <input
                              className="form-check-input"
                              type="checkbox"
                              name="leaveSettingRead"
                              checked={formik.values.leaveSettingRead}
                              onChange={handleCheckboxChange(
                                `leaveSettingRead`
                              )}
                            />
                          </td>
                        </tr>
                        <tr>
                          <td>
                            <p
                              style={{
                                marginLeft: "30px",
                                marginBottom: "0px",
                              }}
                            >
                              ID Type
                            </p>
                          </td>
                          <td>
                            <input
                              className="form-check-input"
                              type="checkbox"
                              name="idTypeSettingIndex"
                              checked={formik.values.idTypeSettingIndex}
                              onChange={handleCheckboxChange(
                                `idTypeSettingIndex`
                              )}
                            />
                          </td>
                          <td>
                            <input
                              className="form-check-input"
                              type="checkbox"
                              name="idTypeSettingRead"
                              checked={formik.values.idTypeSettingRead}
                              onChange={handleCheckboxChange(
                                `idTypeSettingRead`
                              )}
                            />
                          </td>
                        </tr>
                        <tr>
                          <td>
                            <p
                              style={{
                                marginLeft: "30px",
                                marginBottom: "0px",
                              }}
                            >
                              Salary Type
                            </p>
                          </td>
                          <td>
                            <input
                              className="form-check-input"
                              type="checkbox"
                              name="salarySettingIndex"
                              checked={formik.values.salarySettingIndex}
                              onChange={handleCheckboxChange(
                                `salarySettingIndex`
                              )}
                            />
                          </td>
                          <td>
                            <input
                              className="form-check-input"
                              type="checkbox"
                              name="salarySettingRead"
                              checked={formik.values.salarySettingRead}
                              onChange={handleCheckboxChange(
                                `salarySettingRead`
                              )}
                            />
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}

export default ModuleAccess;
