import React, { useEffect, useState } from "react";
import { Button, Modal, Form } from "react-bootstrap";
import { FaEdit, FaSave } from "react-icons/fa";
import { useFormik } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";
import api from "../../../config/URL";
import Delete from "../../../components/common/Delete";
import { BiEditAlt } from "react-icons/bi";

const CmsTeacherEdit = ({ id, fetchData }) => {
  const [showModal, setShowModal] = useState(false);
  const handleShowModal = () => setShowModal(true);
  const handleCloseModal = () => setShowModal(false);
  const storedScreens = JSON.parse(localStorage.getItem("screens") || "{}");
  const [selectedFile, setSelectedFile] = useState(null);
  const userName = localStorage.getItem("userName");
  const [datas, setDatas] = useState([]);

  const formik = useFormik({
    initialValues: {
      teacherName: "",
      role: "",
      teacherRoleName: "",
      experience: "",
      files: null,
      teacherDescription: "",
    },
    validationSchema: Yup.object({
      teacherName: Yup.string().required("Teacher name is required"),
      role: Yup.string().required("Role is required"),
      teacherRoleName: Yup.string().required("Role name is required"),
      experience: Yup.string().required("Experience is required"),
      teacherDescription: Yup.string().required("Description is required"),
    }),
    onSubmit: async (data) => {
      const formData = new FormData();
      formData.append("file", data.files);
      formData.append("teacherName", data.teacherName);
      formData.append("teacherDescription", data.teacherDescription);
      formData.append("teacherRoleName", data.teacherRoleName);
      formData.append("experience", data.experience);
      formData.append("role", data.role);
      formData.append("updatedBy ", userName);

      try {
        const response = await api.put(`/updateTeacherSave/${id}`, formData);
        if (response.status === 200) {
          fetchData();
          toast.success(response.data.message);
          handleCloseModal();
        } else {
          toast.error(response.data.message);
        }
      } catch (error) {
        toast.error(error);
      }
    },
  });

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setSelectedFile(file);
    formik.setFieldValue("files", file);
  };

  const getData = async () => {
    try {
      const response = await api.get(`/getTeacherSaveById/${id}`);
      formik.setValues(response.data);
      setDatas(response.data);
    } catch (error) {
      toast.error("Error Fetching Data", error);
    }
  };

  useEffect(() => {
    if (showModal) {
      getData();
    }
  }, [showModal]);

  return (
    <>
      {storedScreens?.teacherSaveDelete && (
        <Delete path={`/deleteTeacherSave/${id}`} onSuccess={fetchData} />
      )}
      <button className="btn text-end" onClick={handleShowModal}>
        <BiEditAlt />
      </button>
      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Teacher</Modal.Title>
        </Modal.Header>
        <form
          onSubmit={formik.handleSubmit}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !formik.isSubmitting) {
              e.preventDefault(); // Prevent default form submission
            }
          }}
        >
          <Modal.Body>
            <div className="container">
              <div className="mb-3">
                <label htmlFor="teacherName" className="form-label">
                  Name
                </label>
                <input
                  id="teacherName"
                  name="teacherName"
                  className="form-control"
                  {...formik.getFieldProps("teacherName")}
                />
                {formik.touched.teacherName && formik.errors.teacherName && (
                  <div className="text-danger">{formik.errors.teacherName}</div>
                )}
              </div>
              <div className="mb-3">
                <label htmlFor="role" className="form-label">
                  Role
                </label>
                <select
                  id="role"
                  name="role"
                  className="form-select"
                  {...formik.getFieldProps("role")}
                >
                  <option value="">Select a role</option>
                  <option value="ADMIN">Admin</option>
                  <option value="ENGLISH">English Teacher</option>
                  <option value="CHINESE">Chinese Teacher</option>
                </select>
                {formik.touched.role && formik.errors.role && (
                  <div className="text-danger">{formik.errors.role}</div>
                )}
              </div>
              <div className="mb-3">
                <label htmlFor="teacherRoleName" className="form-label">
                  Role Name
                </label>
                <input
                  id="teacherRoleName"
                  name="teacherRoleName"
                  className="form-control"
                  {...formik.getFieldProps("teacherRoleName")}
                />
                {formik.touched.teacherRoleName &&
                  formik.errors.teacherRoleName && (
                    <div className="text-danger">
                      {formik.errors.teacherRoleName}
                    </div>
                  )}
              </div>
              <div className="mb-3">
                <label htmlFor="experience" className="form-label">
                  Experience
                </label>
                <input
                  id="experience"
                  name="experience"
                  className="form-control"
                  {...formik.getFieldProps("experience")}
                />
                {formik.touched.experience && formik.errors.experience && (
                  <div className="text-danger">{formik.errors.experience}</div>
                )}
              </div>
              <div className="mb-3">
                <label htmlFor="files" className="form-label">
                  Upload Image
                </label>
                <input
                  type="file"
                  id="files"
                  name="files"
                  className="form-control"
                  onChange={handleFileChange}
                  onBlur={formik.handleBlur}
                />
                {formik.touched.files && formik.errors.files && (
                  <div className="text-danger">{formik.errors.files}</div>
                )}
              </div>
              {/* Display Image */}
              <div className="col-12 mb-2">
                {selectedFile ? (
                  selectedFile.type.startsWith("image") ? (
                    <img
                      src={URL.createObjectURL(selectedFile)}
                      alt="Selected File"
                      style={{ maxHeight: "200px" }}
                    />
                  ) : (
                    <div>Invalid file type, please select an image file.</div>
                  )
                ) : (
                  <img
                    src={datas.image || ""}
                    alt="Uploaded File"
                    style={{ maxHeight: "200px" }}
                  />
                )}
              </div>
              <div className="mb-3">
                <label htmlFor="teacherDescription" className="form-label">
                  Description
                </label>
                <textarea
                  id="teacherDescription"
                  name="teacherDescription"
                  className="form-control"
                  {...formik.getFieldProps("teacherDescription")}
                />
                {formik.touched.teacherDescription &&
                  formik.errors.teacherDescription && (
                    <div className="text-danger">
                      {formik.errors.teacherDescription}
                    </div>
                  )}
              </div>
            </div>
          </Modal.Body>
          <Modal.Footer>
            <button
              type="button"
              className="btn btn-border btn-sm"
              style={{ fontSize: "12px" }}
              onClick={handleCloseModal}
            >
              Cancel
            </button>
            <button type="submit" className="btn btn-button btn-sm">
              Update
            </button>
          </Modal.Footer>
        </form>
      </Modal>
    </>
  );
};

export default CmsTeacherEdit;
