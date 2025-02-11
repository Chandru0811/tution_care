import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useState,
} from "react";
import api from "../../../config/URL";
import EditParentDetailModel from "./EditParentDetailModel";
import AddParentDetailModel from "./AddParentDetailModel";
import { GoDotFill } from "react-icons/go";
import { CiEdit } from "react-icons/ci";
import { MdDeleteOutline } from "react-icons/md";
import { Button, Modal } from "react-bootstrap";
import { toast } from "react-toastify";

const EditParentGuardian = forwardRef(
  ({ formData, setLoadIndicators, setFormData, handleNext }, ref) => {
    const [data, setData] = useState({});
    const [primaryContact, setPrimaryContact] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [deleteId, setDeleteId] = useState(null);

    const handleShowDeleteModal = (id) => {
      setDeleteId(id);
      setShowDeleteModal(true);
    };

    const handleCloseDeleteModal = () => {
      setShowDeleteModal(false);
      setDeleteId(null);
    };

    const getData = async () => {
      setLoadIndicators(true);
      try {
        const response = await api.get(`/getAllStudentById/${formData.id}`);
        setData(response.data);
        // console.log("Response data", response.data.studentParentsDetails.length)
        if (response.data.studentParentsDetails.length === 0) {
          setPrimaryContact(true);
        } else {
          setPrimaryContact(false);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoadIndicators(false);
      }
    };

    useEffect(() => {
      getData();
    }, []);

    const handleDeleteRow = async () => {
      try {
        const response = await api.delete(
          `/deleteStudentParentsDetails/${deleteId}`
        );
        if (response.status === 200 || response.status === 201) {
          toast.success("Parent information deleted successfully!");
          getData();
        } else {
          toast.error("Failed to delete the parent information.");
        }
      } catch (error) {
        toast.error("Error deleting the parent information.");
      } finally {
        handleCloseDeleteModal();
      }
    };

    useImperativeHandle(ref, () => ({
      editParentGuardian: handleNext,
    }));

    useEffect(() => {
      window.scrollTo({ top: 0, left: 0, behavior: "instant" });
    }, []);

    return (
      <div className="container-fluid">
        <div className="container-fluid">
          <div className="container-fluid">
            <div className="row">
              <div className="col-md-12 col-12 mt-4">
                <h5 className="headColor mb-3">Parents / Guardian Details</h5>
                <table className="table table-border-solid">
                  <thead className=" table-light bg-warning">
                    <tr>
                      <th scope="col" className="fw-medium">
                        S.No
                      </th>
                      <th scope="col" className="fw-medium">
                        Parent Names
                      </th>
                      <th scope="col" className="fw-medium">
                        Date Of Birth
                      </th>
                      <th scope="col" className="fw-medium">
                        Relation
                      </th>
                      <th scope="col" className="fw-medium">
                        Email
                      </th>
                      <th scope="col" className="fw-medium">
                        Mobile No
                      </th>
                      <th>Edit</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.studentParentsDetails &&
                    data.studentParentsDetails.length > 0 ? (
                      data.studentParentsDetails.map((parent, index) => (
                        <tr key={index}>
                          <td>{index + 1}</td>
                          <td>
                            <p className="my-2 d-flex">
                              {parent.profileImage ? (
                                <img
                                  src={parent.profileImage}
                                  className="rounded-5 mx-1"
                                  style={{ width: "30px", height: "40px" }}
                                  alt=""
                                />
                              ) : (
                                <></>
                              )}

                              {parent.parentName}
                              {parent.primaryContact === true && (
                                <GoDotFill className="text-primary" />
                              )}
                            </p>
                          </td>
                          <td>
                            {parent.parentDateOfBirth?.substring(0, 10) || "-"}
                          </td>
                          <td>{parent.relation || "-"}</td>
                          <td>{parent.email || "-"}</td>
                          <td>{parent.mobileNumber || "-"}</td>
                          <td className="center">
                            <div className="d-flex">
                              {parent.primaryContact ? (
                                <button
                                  className="btn border-white"
                                  type="button"
                                  disabled
                                >
                                  <CiEdit className="text-secondary" />
                                </button>
                              ) : (
                                <EditParentDetailModel
                                  id={parent.id}
                                  getData={getData}
                                />
                              )}
                              {parent.primaryContact ? (
                                <button
                                  className="btn"
                                  type="button"
                                  style={{ display: "none" }}
                                >
                                  <MdDeleteOutline />
                                </button>
                              ) : (
                                <button
                                  className="btn"
                                  type="button"
                                  onClick={() =>
                                    handleShowDeleteModal(parent.id)
                                  }
                                >
                                  <MdDeleteOutline
                                    id={parent.id}
                                    getData={getData}
                                  />
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="7" className="text-center">
                          No records found
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
            <div className="row">
              <div className="col-md-2 col-12 text-strat">
                <AddParentDetailModel
                  primaryContact={primaryContact}
                  onSuccess={getData}
                />
              </div>
            </div>
          </div>
        </div>
        <Modal show={showDeleteModal} onHide={handleCloseDeleteModal} centered>
          <Modal.Header closeButton>
            <Modal.Title>Confirm Deletion</Modal.Title>
          </Modal.Header>
          <Modal.Body>
          Are you sure you want to delete this record?
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseDeleteModal}>
              Cancel
            </Button>
            <Button variant="danger" onClick={handleDeleteRow}>
              Delete
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    );
  }
);

export default EditParentGuardian;
