import React, { useEffect, useRef, useState } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import api from "../../config/URL";
import { toast } from "react-toastify";
import { MdDeleteOutline } from "react-icons/md";

function Delete({ onSuccess, path, staffmsg, teachermsg }) {
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const deleteButtonRef = useRef(null);

  const handelDelete = async () => {
    try {
      const response = await api.delete(path);
      if (response.status === 201 || response.status === 200) {
        onSuccess();
        handleClose();
        if (staffmsg) {
          toast.success(staffmsg);
        } else if (teachermsg) {
          toast.success(teachermsg);
        } else {
          toast.success(response.data.message);
        }
      } else if (response.status === 200) {
        onSuccess();
        handleClose();
        toast.success(response.data.message);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      if (error?.response?.status === 409) {
        toast.warning(error?.response?.data?.message);
        handleClose();
      } else {
        toast.error("Error deleting data:", error);
      }
    }
  };
  useEffect(() => {
    if (show && deleteButtonRef.current) {
      deleteButtonRef.current.focus();
    }
  }, [show]);

  useEffect(() => {
    const handleKeyPress = (event) => {
      if (event.key === "Enter") {
        if (show) {
          handelDelete();
        }
      }
    };

    document.addEventListener("keydown", handleKeyPress);
    return () => {
      document.removeEventListener("keydown", handleKeyPress);
    };
  }, [show]);

  return (
    <>
      <button type="button"
        style={{
          whiteSpace: "nowrap",
        }}
        className="btn btn-normal text-start"
        onClick={handleShow}
      >
        <MdDeleteOutline />
      </button>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Delete</Modal.Title>
        </Modal.Header>
        <Modal.Body>Are you sure you want to delete?</Modal.Body>
        <Modal.Footer>
          <Button className="btn btn-sm btn-border bg-light text-dark" onClick={handleClose}>
            Close
          </Button>
          <Button
            variant="danger"
            onClick={handelDelete}
            className={show ? "focused-button" : ""}
          >
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default Delete;
